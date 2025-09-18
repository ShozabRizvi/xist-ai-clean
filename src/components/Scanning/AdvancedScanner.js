import React, { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LinkIcon, PhotoIcon, DocumentIcon, CameraIcon, 
  EyeIcon, ClipboardDocumentIcon, ArrowUpTrayIcon,
  CheckCircleIcon, XCircleIcon, ExclamationTriangleIcon,
  PlayIcon, StopIcon, ArrowDownTrayIcon
} from '@heroicons/react/24/outline';
import { useDropzone } from 'react-dropzone';
import Webcam from 'react-webcam';
import Card from '../UI/Card';
import aiScanner from '../../services/aiScanner';
import { showNotification } from '../UI/NotificationToast';

const AdvancedScanner = ({ user, theme }) => {
  const [activeTab, setActiveTab] = useState('url');
  const [scanning, setScanning] = useState(false);
  const [scanResult, setScanResult] = useState(null);
  const [scanHistory, setScanHistory] = useState([]);
  const [showCamera, setShowCamera] = useState(false);
  
  // Form states
  const [urlInput, setUrlInput] = useState('');
  const [textInput, setTextInput] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState([]);
  
  const webcamRef = useRef(null);
  const fileInputRef = useRef(null);

  // SCANNING TABS CONFIGURATION
  const scanningTabs = [
    {
      id: 'url',
      label: 'URL Scanner',
      icon: LinkIcon,
      description: 'Scan web links for threats',
      color: 'blue'
    },
    {
      id: 'image',
      label: 'Image Scanner',
      icon: PhotoIcon,
      description: 'Upload images for analysis',
      color: 'green'
    },
    {
      id: 'document',
      label: 'Document Scanner',
      icon: DocumentIcon,
      description: 'Scan PDF, DOC, TXT files',
      color: 'purple'
    },
    {
      id: 'camera',
      label: 'Camera Scanner',
      icon: CameraIcon,
      description: 'Real-time camera capture',
      color: 'red'
    },
    {
      id: 'ocr',
      label: 'OCR Scanner',
      icon: EyeIcon,
      description: 'Extract text from images',
      color: 'yellow'
    },
    {
      id: 'text',
      label: 'Text Scanner',
      icon: ClipboardDocumentIcon,
      description: 'Direct text analysis',
      color: 'indigo'
    }
  ];

  // FILE UPLOAD DROPZONE
  const onDrop = useCallback((acceptedFiles) => {
    setUploadedFiles(prev => [...prev, ...acceptedFiles]);
    showNotification(`${acceptedFiles.length} file(s) uploaded successfully`, 'success');
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp'],
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'text/plain': ['.txt']
    },
    multiple: true
  });

  // SCANNING FUNCTIONS
  const performScan = async () => {
    if (!user) {
      showNotification('Please sign in to use scanning features', 'warning');
      return;
    }

    setScanning(true);
    setScanResult(null);

    try {
      let result;

      switch (activeTab) {
        case 'url':
          if (!urlInput.trim()) throw new Error('Please enter a URL to scan');
          result = await aiScanner.scanURL(urlInput.trim());
          break;

        case 'text':
          if (!textInput.trim()) throw new Error('Please enter text to scan');
          result = await aiScanner.scanText(textInput.trim());
          break;

        case 'image':
          if (uploadedFiles.length === 0) throw new Error('Please upload an image file');
          result = await aiScanner.scanImage(uploadedFiles[0]);
          break;

        case 'document':
          if (uploadedFiles.length === 0) throw new Error('Please upload a document file');
          result = await aiScanner.scanDocument(uploadedFiles[0]);
          break;

        case 'ocr':
          if (uploadedFiles.length === 0) throw new Error('Please upload an image for OCR');
          result = await aiScanner.scanOCR(uploadedFiles[0]);
          break;

        case 'camera':
          const imageSrc = webcamRef.current?.getScreenshot();
          if (!imageSrc) throw new Error('Failed to capture image from camera');
          
          // Convert base64 to blob
          const response = await fetch(imageSrc);
          const blob = await response.blob();
          result = await aiScanner.scanCamera(blob);
          break;

        default:
          throw new Error('Invalid scan type');
      }

      setScanResult(result);
      
      // Add to scan history
      const historyEntry = {
        id: Date.now(),
        timestamp: new Date().toISOString(),
        type: activeTab,
        input: getInputSummary(),
        result,
        user: user.uid
      };
      
      setScanHistory(prev => [historyEntry, ...prev.slice(0, 9)]); // Keep last 10
      
      if (result.success) {
        showNotification('Scan completed successfully', 'success');
      } else {
        showNotification('Scan completed with warnings', 'warning');
      }

    } catch (error) {
      console.error('Scan error:', error);
      setScanResult({
        success: false,
        error: error.message,
        timestamp: new Date().toISOString()
      });
      showNotification(`Scan failed: ${error.message}`, 'error');
    } finally {
      setScanning(false);
    }
  };

  // Get input summary for history
  const getInputSummary = () => {
    switch (activeTab) {
      case 'url': return urlInput.substring(0, 50) + (urlInput.length > 50 ? '...' : '');
      case 'text': return textInput.substring(0, 50) + (textInput.length > 50 ? '...' : '');
      case 'image':
      case 'document':
      case 'ocr': return uploadedFiles[0]?.name || 'Unknown file';
      case 'camera': return 'Camera capture';
      default: return 'Unknown input';
    }
  };

  // Camera capture
  const captureImage = useCallback(() => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc) {
      showNotification('Image captured successfully', 'success');
      // You could save this to state if needed
    }
  }, [webcamRef]);

  // Clear form data
  const clearForm = () => {
    setUrlInput('');
    setTextInput('');
    setUploadedFiles([]);
    setScanResult(null);
    setShowCamera(false);
  };

  // Render scan result
  const renderScanResult = () => {
    if (!scanResult) return null;

    const { success, analysis, error } = scanResult;

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-6"
      >
        <Card className={`p-6 border-l-4 ${
          success && !analysis?.threatDetected 
            ? 'border-green-500 bg-green-50 dark:bg-green-900/20' 
            : success && analysis?.threatDetected
              ? 'border-red-500 bg-red-50 dark:bg-red-900/20'
              : 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20'
        }`}>
          
          {/* Result Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              {success && !analysis?.threatDetected ? (
                <CheckCircleIcon className="w-8 h-8 text-green-600" />
              ) : success && analysis?.threatDetected ? (
                <XCircleIcon className="w-8 h-8 text-red-600" />
              ) : (
                <ExclamationTriangleIcon className="w-8 h-8 text-yellow-600" />
              )}
              
              <div>
                <h3 className={`text-lg font-semibold ${
                  success && !analysis?.threatDetected
                    ? 'text-green-800 dark:text-green-200'
                    : success && analysis?.threatDetected
                      ? 'text-red-800 dark:text-red-200'
                      : 'text-yellow-800 dark:text-yellow-200'
                }`}>
                  {success && !analysis?.threatDetected
                    ? 'Content Safe'
                    : success && analysis?.threatDetected
                      ? 'Threat Detected'
                      : 'Scan Error'
                  }
                </h3>
                <p className={`text-sm ${
                  success && !analysis?.threatDetected
                    ? 'text-green-600 dark:text-green-400'
                    : success && analysis?.threatDetected
                      ? 'text-red-600 dark:text-red-400'
                      : 'text-yellow-600 dark:text-yellow-400'
                }`}>
                  Scan completed at {new Date(scanResult.timestamp).toLocaleTimeString()}
                </p>
              </div>
            </div>

            {/* Download Report Button */}
            <button
              onClick={() => {
                const reportData = JSON.stringify(scanResult, null, 2);
                const blob = new Blob([reportData], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `xist-scan-report-${Date.now()}.json`;
                a.click();
              }}
              className="flex items-center space-x-2 px-3 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm"
            >
              <ArrowDownTrayIcon className="w-4 h-4" />
              <span>Download Report</span>
            </button>
          </div>

          {/* Result Content */}
          {success && analysis ? (
            <div className="space-y-4">
              
              {/* Threat Level & Confidence */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-3 bg-white dark:bg-gray-800 rounded-lg">
                  <div className={`text-lg font-bold ${
                    analysis.threatLevel === 'critical' ? 'text-red-600' :
                    analysis.threatLevel === 'high' ? 'text-orange-600' :
                    analysis.threatLevel === 'medium' ? 'text-yellow-600' :
                    'text-green-600'
                  }`}>
                    {analysis.threatLevel?.toUpperCase() || 'LOW'}
                  </div>
                  <div className="text-xs text-gray-500">Threat Level</div>
                </div>
                
                <div className="text-center p-3 bg-white dark:bg-gray-800 rounded-lg">
                  <div className="text-lg font-bold text-blue-600">
                    {analysis.confidenceScore || 0}%
                  </div>
                  <div className="text-xs text-gray-500">Confidence</div>
                </div>
                
                <div className="text-center p-3 bg-white dark:bg-gray-800 rounded-lg">
                  <div className={`text-lg font-bold ${analysis.safeToVisit ? 'text-green-600' : 'text-red-600'}`}>
                    {analysis.safeToVisit ? 'SAFE' : 'UNSAFE'}
                  </div>
                  <div className="text-xs text-gray-500">Safety Status</div>
                </div>
                
                <div className="text-center p-3 bg-white dark:bg-gray-800 rounded-lg">
                  <div className="text-lg font-bold text-purple-600">
                    {analysis.threatTypes?.length || 0}
                  </div>
                  <div className="text-xs text-gray-500">Threat Types</div>
                </div>
              </div>

              {/* Threat Types */}
              {analysis.threatTypes?.length > 0 && (
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">Detected Threats:</h4>
                  <div className="flex flex-wrap gap-2">
                    {analysis.threatTypes.map((type, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 rounded-full text-sm font-medium"
                      >
                        {type}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Risk Assessment */}
              {analysis.riskAssessment && (
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">Risk Assessment:</h4>
                  <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                    {analysis.riskAssessment}
                  </p>
                </div>
              )}

              {/* Recommendations */}
              {analysis.recommendations?.length > 0 && (
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">Recommendations:</h4>
                  <ul className="space-y-1">
                    {analysis.recommendations.map((rec, index) => (
                      <li key={index} className="text-gray-700 dark:text-gray-300 text-sm flex items-start">
                        <span className="text-blue-600 mr-2">•</span>
                        {rec}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* OCR Extracted Text */}
              {scanResult.extractedText && (
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">Extracted Text:</h4>
                  <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg text-sm font-mono">
                    {scanResult.extractedText}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-red-600 dark:text-red-400">
              <p className="font-medium">Error: {error}</p>
            </div>
          )}
        </Card>
      </motion.div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Advanced AI Scanner
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Multi-format threat detection powered by advanced AI
        </p>
      </div>

      {/* Scanning Tabs */}
      <Card className="p-2">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
          {scanningTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            
            return (
              <motion.button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  clearForm();
                }}
                className={`p-3 rounded-lg text-center transition-all ${
                  isActive
                    ? `bg-${tab.color}-100 dark:bg-${tab.color}-900/30 text-${tab.color}-700 dark:text-${tab.color}-300 ring-2 ring-${tab.color}-500`
                    : 'bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-600'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Icon className="w-6 h-6 mx-auto mb-1" />
                <div className="text-xs font-medium">{tab.label}</div>
              </motion.button>
            );
          })}
        </div>
      </Card>

      {/* Scanning Interface */}
      <Card className="p-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            
            {/* Tab Content Header */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                {scanningTabs.find(tab => tab.id === activeTab)?.label}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {scanningTabs.find(tab => tab.id === activeTab)?.description}
              </p>
            </div>

            {/* URL Scanner */}
            {activeTab === 'url' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Enter URL to scan
                  </label>
                  <input
                    type="url"
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                    placeholder="https://example.com"
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            )}

            {/* Text Scanner */}
            {activeTab === 'text' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Enter text to analyze
                  </label>
                  <textarea
                    value={textInput}
                    onChange={(e) => setTextInput(e.target.value)}
                    placeholder="Paste your text content here..."
                    rows={6}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                  />
                </div>
              </div>
            )}

            {/* File Upload Scanners */}
            {['image', 'document', 'ocr'].includes(activeTab) && (
              <div className="space-y-4">
                
                {/* Dropzone */}
                <div
                  {...getRootProps()}
                  className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                    isDragActive
                      ? 'border-blue-400 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
                  }`}
                >
                  <input {...getInputProps()} ref={fileInputRef} />
                  <ArrowUpTrayIcon className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                  <p className="text-lg font-medium text-gray-600 dark:text-gray-400 mb-2">
                    {isDragActive ? 'Drop files here' : 'Drag & drop files here'}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-500">
                    or click to select files
                  </p>
                </div>

                {/* Uploaded Files */}
                {uploadedFiles.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Uploaded Files:
                    </h4>
                    {uploadedFiles.map((file, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <DocumentIcon className="w-5 h-5 text-gray-500" />
                          <span className="text-sm font-medium text-gray-900 dark:text-white">
                            {file.name}
                          </span>
                          <span className="text-xs text-gray-500">
                            {(file.size / 1024 / 1024).toFixed(1)} MB
                          </span>
                        </div>
                        <button
                          onClick={() => {
                            setUploadedFiles(files => files.filter((_, i) => i !== index));
                          }}
                          className="text-red-600 hover:text-red-700"
                        >
                          <XCircleIcon className="w-5 h-5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Camera Scanner */}
            {activeTab === 'camera' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Camera Feed
                  </h4>
                  <button
                    onClick={() => setShowCamera(!showCamera)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                      showCamera
                        ? 'bg-red-600 text-white hover:bg-red-700'
                        : 'bg-green-600 text-white hover:bg-green-700'
                    }`}
                  >
                    {showCamera ? <StopIcon className="w-4 h-4" /> : <PlayIcon className="w-4 h-4" />}
                    <span>{showCamera ? 'Stop Camera' : 'Start Camera'}</span>
                  </button>
                </div>

                {showCamera && (
                  <div className="relative">
                    <Webcam
                      ref={webcamRef}
                      screenshotFormat="image/jpeg"
                      className="w-full rounded-lg"
                    />
                    <button
                      onClick={captureImage}
                      className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-white text-gray-900 p-3 rounded-full shadow-lg hover:bg-gray-100 transition-colors"
                    >
                      <CameraIcon className="w-6 h-6" />
                    </button>
                  </div>
                )}
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Action Buttons */}
        <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={clearForm}
            className="px-4 py-2 text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            Clear
          </button>
          
          <button
            onClick={performScan}
            disabled={scanning || !user}
            className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-colors ${
              scanning || !user
                ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                : 'bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700'
            }`}
          >
            {scanning ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Scanning...</span>
              </>
            ) : (
              <>
                <PlayIcon className="w-4 h-4" />
                <span>Start Scan</span>
              </>
            )}
          </button>
        </div>
      </Card>

      {/* Scan Results */}
      {renderScanResult()}

      {/* Scan History */}
      {scanHistory.length > 0 && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Recent Scans
          </h3>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {scanHistory.map((scan) => (
              <div key={scan.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${
                    scan.result?.success && !scan.result?.analysis?.threatDetected
                      ? 'bg-green-500'
                      : scan.result?.success && scan.result?.analysis?.threatDetected
                        ? 'bg-red-500'
                        : 'bg-yellow-500'
                  }`}></div>
                  <div>
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      {scan.type.toUpperCase()} - {scan.input}
                    </div>
                    <div className="text-xs text-gray-500">
                      {new Date(scan.timestamp).toLocaleString()}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setScanResult(scan.result)}
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                  View Result
                </button>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};

export default AdvancedScanner;
