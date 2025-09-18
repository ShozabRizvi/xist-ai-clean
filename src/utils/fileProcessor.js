import mammoth from 'mammoth';
import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf';
import Tesseract from 'tesseract.js';

// Set PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js`;

export const processFile = async (file, onProgress) => {
  try {
    console.log('Processing file:', file.name, file.type);
    onProgress && onProgress(10, 'Starting file processing...');

    let extractedText = '';
    let metadata = {
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type,
      processedAt: new Date().toISOString()
    };

    if (file.type === 'text/plain') {
      extractedText = await processTextFile(file, onProgress);
    } else if (file.type === 'application/pdf') {
      extractedText = await processPDFFile(file, onProgress);
    } else if (file.type.includes('word') || file.name.endsWith('.docx')) {
      extractedText = await processWordFile(file, onProgress);
    } else if (file.type.startsWith('image/')) {
      extractedText = await processImageFile(file, onProgress);
    } else {
      throw new Error('Unsupported file format');
    }

    onProgress && onProgress(100, 'File processing complete!');

    return {
      success: true,
      text: extractedText,
      metadata: metadata,
      wordCount: extractedText.split(/\s+/).filter(w => w.length > 0).length
    };

  } catch (error) {
    console.error('File processing error:', error);
    return {
      success: false,
      error: error.message,
      metadata: { fileName: file.name, fileType: file.type }
    };
  }
};

// Process text files
const processTextFile = async (file, onProgress) => {
  onProgress && onProgress(50, 'Reading text file...');
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target.result);
    reader.onerror = (e) => reject(new Error('Failed to read text file'));
    reader.readAsText(file);
  });
};

// Process PDF files
const processPDFFile = async (file, onProgress) => {
  onProgress && onProgress(30, 'Loading PDF...');
  
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const typedarray = new Uint8Array(e.target.result);
        const pdf = await pdfjsLib.getDocument(typedarray).promise;
        
        onProgress && onProgress(60, `Processing ${pdf.numPages} pages...`);
        
        let fullText = '';
        
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const textContent = await page.getTextContent();
          const pageText = textContent.items.map(item => item.str).join(' ');
          fullText += pageText + '\n';
          
          onProgress && onProgress(60 + (i / pdf.numPages) * 30, `Processing page ${i} of ${pdf.numPages}...`);
        }
        
        resolve(fullText);
      } catch (error) {
        reject(new Error('Failed to process PDF: ' + error.message));
      }
    };
    reader.onerror = () => reject(new Error('Failed to read PDF file'));
    reader.readAsArrayBuffer(file);
  });
};

// Process Word documents
const processWordFile = async (file, onProgress) => {
  onProgress && onProgress(30, 'Processing Word document...');
  
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const arrayBuffer = e.target.result;
        const result = await mammoth.extractRawText({ arrayBuffer });
        onProgress && onProgress(80, 'Extracting text from document...');
        resolve(result.value);
      } catch (error) {
        reject(new Error('Failed to process Word document: ' + error.message));
      }
    };
    reader.onerror = () => reject(new Error('Failed to read Word document'));
    reader.readAsArrayBuffer(file);
  });
};

// Process image files with OCR
const processImageFile = async (file, onProgress) => {
  onProgress && onProgress(20, 'Preparing image for OCR...');
  
  try {
    const result = await Tesseract.recognize(
      file,
      'eng',
      {
        logger: m => {
          if (m.status === 'recognizing text') {
            const progress = 20 + (m.progress * 70);
            onProgress && onProgress(progress, `OCR: ${Math.round(m.progress * 100)}% complete...`);
          }
        }
      }
    );
    
    return result.data.text;
  } catch (error) {
    throw new Error('Failed to extract text from image: ' + error.message);
  }
};

// Validate file
export const validateFile = (file) => {
  const maxSize = 10 * 1024 * 1024; // 10MB
  const allowedTypes = [
    'text/plain',
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/msword',
    'image/jpeg',
    'image/png',
    'image/jpg'
  ];

  if (file.size > maxSize) {
    return { valid: false, error: 'File size must be less than 10MB' };
  }

  if (!allowedTypes.includes(file.type) && !file.name.endsWith('.docx')) {
    return { valid: false, error: 'Unsupported file format' };
  }

  return { valid: true };
};
