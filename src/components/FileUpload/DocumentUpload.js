import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import {
  DocumentTextIcon,
  PhotoIcon,
  DocumentIcon,
  XMarkIcon,
  CloudArrowUpIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import { processFile, validateFile } from '../../utils/fileProcessor';

const DocumentUpload = ({ onFileProcessed, isProcessing, setIsProcessing }) => {
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [processingProgress, setProcessingProgress] = useState({});

  const onDrop = useCallback(async (acceptedFiles) => {
    for (const file of acceptedFiles) {
      const validation = validateFile(file);
      
      if (!validation.valid) {
        alert(`${file.name}: ${validation.error}`);
        continue;
      }

      const fileId = Date.now() + Math.random();
      
      // Add file to uploaded files list
      setUploadedFiles(prev => [...prev, {
        id: fileId,
        file: file,
        status: 'processing',
        progress: 0,
        result: null
      }]);

      setIsProcessing(true);

      try {
        // Process the file
        const result = await processFile(file, (progress, message) => {
          setProcessingProgress(prev => ({
            ...prev,
            [fileId]: { progress, message }
          }));
          
          setUploadedFiles(prev => prev.map(f => 
            f.id === fileId ? { ...f, progress } : f
          ));
        });

        // Update file status
        setUploadedFiles(prev => prev.map(f => 
          f.id === fileId ? { 
            ...f, 
            status: result.success ? 'completed' : 'error',
            result: result,
            progress: 100
          } : f
        ));

        if (result.success && onFileProcessed) {
          onFileProcessed({
            text: result.text,
            metadata: result.metadata,
            source: 'file_upload'
          });
        }

      } catch (error) {
        console.error('File processing failed:', error);
        setUploadedFiles(prev => prev.map(f => 
          f.id === fileId ? { 
            ...f, 
            status: 'error',
            error: error.message,
            progress: 0
          } : f
        ));
      }

      setIsProcessing(false);
    }
  }, [onFileProcessed, setIsProcessing]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/plain': ['.txt'],
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'image/*': ['.jpeg', '.jpg', '.png']
    },
    maxFiles: 5,
    disabled: isProcessing
  });

  const removeFile = (fileId) => {
    setUploadedFiles(prev => prev.filter(f => f.id !== fileId));
  };

  const getFileIcon = (fileName) => {
    const extension = fileName.split('.').pop().toLowerCase();
    
    if (['pdf'].includes(extension)) return DocumentTextIcon;
    if (['doc', 'docx', 'txt'].includes(extension)) return DocumentIcon;
    if (['jpg', 'jpeg', 'png'].includes(extension)) return PhotoIcon;
    return DocumentIcon;
  };

  return (
    <div className="space-y-4">
      
      {/* Upload Dropzone */}
      <div
        {...getRootProps()}
        className={`
          border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all duration-200
          ${isDragActive 
            ? 'border-purple-400 bg-purple-50 dark:bg-purple-900' 
            : 'border-gray-300 dark:border-gray-600 hover:border-purple-300 dark:hover:border-purple-500'
          }
          ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        <input {...getInputProps()} />
        
        <CloudArrowUpIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        
        {isDragActive ? (
          <p className="text-purple-600 dark:text-purple-400 font-medium">
            Drop files here to analyze...
          </p>
        ) : (
          <div>
            <p className="text-gray-600 dark:text-gray-300 font-medium mb-2">
              Upload documents to analyze for misinformation
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              Drag & drop files here, or click to select
            </p>
            <div className="flex flex-wrap justify-center gap-2 text-xs text-gray-400">
              <span className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">PDF</span>
              <span className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">DOC/DOCX</span>
              <span className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">TXT</span>
              <span className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">Images</span>
            </div>
          </div>
        )}
      </div>

      {/* Uploaded Files List */}
      {uploadedFiles.length > 0 && (
        <div className="space-y-3">
          <h4 className="font-semibold text-gray-900 dark:text-white">
            Uploaded Files ({uploadedFiles.length})
          </h4>
          
          {uploadedFiles.map((fileItem) => {
            const FileIcon = getFileIcon(fileItem.file.name);
            const progress = processingProgress[fileItem.id];
            
            return (
              <div
                key={fileItem.id}
                className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
              >
                <div className="flex items-center space-x-3 flex-1">
                  <FileIcon className="w-8 h-8 text-gray-400" />
                  
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {fileItem.file.name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {(fileItem.file.size / 1024).toFixed(1)} KB
                    </p>
                    
                    {/* Processing Status */}
                    {fileItem.status === 'processing' && progress && (
                      <div className="mt-2">
                        <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-300 mb-1">
                          <span>{progress.message}</span>
                          <span>{Math.round(progress.progress)}%</span>
                        </div>
                        <div className="bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                          <div
                            className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${progress.progress}%` }}
                          />
                        </div>
                      </div>
                    )}
                    
                    {/* Results */}
                    {fileItem.status === 'completed' && fileItem.result && (
                      <div className="mt-2 text-xs text-green-600 dark:text-green-400">
                        ✅ Processed successfully • {fileItem.result.wordCount} words extracted
                      </div>
                    )}
                    
                    {fileItem.status === 'error' && (
                      <div className="mt-2 text-xs text-red-600 dark:text-red-400">
                        ❌ {fileItem.error || 'Processing failed'}
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  {/* Status Icon */}
                  {fileItem.status === 'processing' && (
                    <div className="animate-spin w-5 h-5 border-2 border-purple-600 border-t-transparent rounded-full" />
                  )}
                  {fileItem.status === 'completed' && (
                    <CheckCircleIcon className="w-5 h-5 text-green-500" />
                  )}
                  {fileItem.status === 'error' && (
                    <ExclamationTriangleIcon className="w-5 h-5 text-red-500" />
                  )}
                  
                  {/* Remove Button */}
                  <button
                    onClick={() => removeFile(fileItem.id)}
                    className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded"
                    disabled={fileItem.status === 'processing'}
                  >
                    <XMarkIcon className="w-4 h-4 text-gray-400" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default DocumentUpload;
