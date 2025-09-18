import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CameraIcon, 
  XMarkIcon, 
  SparklesIcon,
  ShieldExclamationIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  BoltIcon
} from '@heroicons/react/24/outline';

const ARScanner = ({ isActive, onClose, onTextDetected }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [isScanning, setIsScanning] = useState(false);
  const [detectedText, setDetectedText] = useState('');
  const [scanResults, setScanResults] = useState(null);
  const [overlayBoxes, setOverlayBoxes] = useState([]);
  const [scanMode, setScanMode] = useState('auto'); // 'auto', 'manual', 'continuous'

  useEffect(() => {
    if (isActive) {
      startCamera();
    } else {
      stopCamera();
    }

    return () => {
      stopCamera();
    };
  }, [isActive]);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { 
          facingMode: 'environment', // Back camera
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        
        // Start scanning when video is ready
        videoRef.current.onloadedmetadata = () => {
          if (scanMode === 'continuous') {
            startContinuousScanning();
          }
        };
      }
    } catch (error) {
      console.error('Camera access denied:', error);
      alert('Camera access is required for AR scanning. Please enable camera permissions.');
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsScanning(false);
  };

  const startContinuousScanning = () => {
    if (!isScanning) {
      setIsScanning(true);
      
      const scanInterval = setInterval(() => {
        if (videoRef.current && canvasRef.current) {
          captureAndAnalyze();
        }
      }, 2000); // Scan every 2 seconds

      // Store interval ID for cleanup
      videoRef.current.scanInterval = scanInterval;
    }
  };

  const captureAndAnalyze = async () => {
    if (!videoRef.current || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    
    // Set canvas size to match video
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    
    // Draw current video frame to canvas
    context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
    
    try {
      // Convert canvas to base64 image
      const imageData = canvas.toDataURL('image/jpeg', 0.8);
      
      // Simulate OCR text extraction (in real app, use Tesseract.js or Google Vision API)
      const extractedText = await performOCR(imageData);
      
      if (extractedText && extractedText.length > 10) {
        setDetectedText(extractedText);
        
        // Analyze the extracted text for threats
        const analysis = await analyzeExtractedText(extractedText);
        setScanResults(analysis);
        
        // Create overlay boxes for detected text regions
        createTextOverlay(extractedText);
        
        // Trigger haptic feedback based on threat level
        if ('vibrate' in navigator) {
          if (analysis.riskScore > 70) {
            navigator.vibrate([100, 50, 100, 50, 100]); // High risk
          } else if (analysis.riskScore > 40) {
            navigator.vibrate([50, 100, 50]); // Medium risk
          } else {
            navigator.vibrate([10, 50, 10]); // Low/safe
          }
        }
        
        // Callback to parent component
        if (onTextDetected) {
          onTextDetected(extractedText, analysis);
        }
      }
    } catch (error) {
      console.error('OCR analysis failed:', error);
    }
  };

  const performOCR = async (imageData) => {
    // In a real implementation, you would use:
    // 1. Tesseract.js for client-side OCR
    // 2. Google Vision API for cloud OCR
    // 3. AWS Textract for advanced document analysis
    
    // Simulated OCR results for demo
    const mockTexts = [
      "URGENT! You've won $50,000! Click here to claim your prize before it expires!",
      "Your bank account has been suspended. Verify your identity immediately to restore access.",
      "Congratulations! You've been selected for an exclusive investment opportunity with guaranteed 500% returns!",
      "WARNING: Your computer is infected with viruses. Download our security software now!",
      "This is a legitimate business email regarding your recent purchase. Thank you for your order."
    ];
    
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    return mockTexts[Math.floor(Math.random() * mockTexts.length)];
  };

  const analyzeExtractedText = async (text) => {
    // Reuse the analysis logic from MobileVerifyScreen
    const threatIndicators = [
      { pattern: /urgent|emergency|act now|expires|deadline/gi, weight: 25, type: 'urgency' },
      { pattern: /won|prize|congratulations|selected|winner/gi, weight: 30, type: 'lottery_scam' },
      { pattern: /suspended|verify|confirm|update|account|bank/gi, weight: 35, type: 'phishing' },
      { pattern: /virus|infected|security|malware|download/gi, weight: 30, type: 'tech_scam' },
      { pattern: /investment|returns|profit|guaranteed|opportunity/gi, weight: 35, type: 'investment_fraud' }
    ];

    let riskScore = 0;
    let detectedThreats = [];

    threatIndicators.forEach(({ pattern, weight, type }) => {
      const matches = (text.match(pattern) || []).length;
      if (matches > 0) {
        riskScore += weight * matches;
        detectedThreats.push({ type, matches, weight: weight * matches });
      }
    });

    const threatLevel = riskScore > 70 ? 'CRITICAL' : riskScore > 50 ? 'HIGH' : riskScore > 25 ? 'MEDIUM' : 'LOW';
    
    return {
      text,
      riskScore: Math.min(riskScore, 100),
      threatLevel,
      detectedThreats,
      confidence: 85 + Math.random() * 10, // Simulate confidence score
      scanType: 'AR Camera Scan',
      timestamp: new Date().toISOString()
    };
  };

  const createTextOverlay = (text) => {
    // Simulate text bounding boxes for overlay
    const mockBoxes = [
      { x: 50, y: 100, width: 300, height: 40, confidence: 0.95 },
      { x: 80, y: 200, width: 250, height: 35, confidence: 0.88 },
      { x: 120, y: 300, width: 200, height: 30, confidence: 0.92 }
    ];
    
    setOverlayBoxes(mockBoxes);
    
    // Clear overlay after 3 seconds
    setTimeout(() => {
      setOverlayBoxes([]);
    }, 3000);
  };

  const manualCapture = () => {
    setIsScanning(true);
    captureAndAnalyze().finally(() => {
      setTimeout(() => setIsScanning(false), 2000);
    });
  };

  if (!isActive) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black"
    >
      {/* Camera View */}
      <div className="relative w-full h-full">
        <video
          ref={videoRef}
          className="w-full h-full object-cover"
          playsInline
          muted
        />
        
        {/* Hidden canvas for image processing */}
        <canvas
          ref={canvasRef}
          className="hidden"
        />

        {/* AR Overlay */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Scanning grid */}
          <motion.div
            className="absolute inset-0 border-2 border-cyan-400 opacity-30"
            animate={{
              boxShadow: [
                "inset 0 0 0 2px rgba(34, 211, 238, 0.3)",
                "inset 0 0 20px 2px rgba(34, 211, 238, 0.6)",
                "inset 0 0 0 2px rgba(34, 211, 238, 0.3)"
              ]
            }}
            transition={{ duration: 2, repeat: Infinity }}
          />

          {/* Scanning Line */}
          {isScanning && (
            <motion.div
              className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent"
              initial={{ top: "0%" }}
              animate={{ top: "100%" }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "linear"
              }}
            />
          )}

          {/* Text Detection Overlays */}
          <AnimatePresence>
            {overlayBoxes.map((box, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="absolute border-2 border-yellow-400 bg-yellow-400/20 backdrop-blur-sm"
                style={{
                  left: `${(box.x / 640) * 100}%`,
                  top: `${(box.y / 480) * 100}%`,
                  width: `${(box.width / 640) * 100}%`,
                  height: `${(box.height / 480) * 100}%`
                }}
              >
                <div className="absolute -top-6 left-0 bg-yellow-400 text-black text-xs px-2 py-1 rounded">
                  {Math.round(box.confidence * 100)}% confidence
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Corner Frame */}
          <div className="absolute inset-4 pointer-events-none">
            {/* Top-left corner */}
            <div className="absolute top-0 left-0 w-8 h-8 border-l-2 border-t-2 border-cyan-400" />
            {/* Top-right corner */}
            <div className="absolute top-0 right-0 w-8 h-8 border-r-2 border-t-2 border-cyan-400" />
            {/* Bottom-left corner */}
            <div className="absolute bottom-0 left-0 w-8 h-8 border-l-2 border-b-2 border-cyan-400" />
            {/* Bottom-right corner */}
            <div className="absolute bottom-0 right-0 w-8 h-8 border-r-2 border-b-2 border-cyan-400" />
          </div>

          {/* Center crosshair */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <motion.div
              className="w-6 h-6 border-2 border-cyan-400 rounded-full"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.5, 1, 0.5]
              }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </div>
        </div>

        {/* Top UI Bar */}
        <motion.div
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          className="absolute top-0 left-0 right-0 bg-black/50 backdrop-blur-lg p-4 z-10"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <motion.div
                className="w-8 h-8 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center"
                animate={{ rotate: 360 }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              >
                <SparklesIcon className="w-5 h-5 text-white" />
              </motion.div>
              <div>
                <h3 className="text-white font-bold">AR Text Scanner</h3>
                <p className="text-cyan-300 text-xs">Point camera at suspicious text</p>
              </div>
            </div>
            
            <motion.button
              onClick={onClose}
              className="w-10 h-10 bg-red-500/20 border border-red-500/50 rounded-lg flex items-center justify-center text-red-300"
              whileHover={{ scale: 1.1, backgroundColor: "rgba(239, 68, 68, 0.3)" }}
              whileTap={{ scale: 0.9 }}
            >
              <XMarkIcon className="w-6 h-6" />
            </motion.button>
          </div>
        </motion.div>

        {/* Bottom Control Bar */}
        <motion.div
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          className="absolute bottom-0 left-0 right-0 bg-black/50 backdrop-blur-lg p-6 z-10"
        >
          <div className="flex items-center justify-center space-x-6">
            
            {/* Scan Mode Toggle */}
            <motion.button
              onClick={() => setScanMode(scanMode === 'auto' ? 'continuous' : 'auto')}
              className={`px-4 py-2 rounded-lg font-medium text-sm ${
                scanMode === 'continuous' 
                  ? 'bg-cyan-500 text-white' 
                  : 'bg-white/20 text-cyan-300 border border-cyan-500/50'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {scanMode === 'continuous' ? 'Auto Scan ON' : 'Auto Scan OFF'}
            </motion.button>

            {/* Manual Capture Button */}
            <motion.button
              onClick={manualCapture}
              disabled={isScanning}
              className="w-20 h-20 bg-white/20 border-4 border-cyan-400 rounded-full flex items-center justify-center disabled:opacity-50"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              animate={isScanning ? {
                borderColor: ["#22D3EE", "#06B6D4", "#0891B2", "#06B6D4", "#22D3EE"]
              } : {}}
              transition={isScanning ? { duration: 1, repeat: Infinity } : {}}
            >
              {isScanning ? (
                <motion.div
                  className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                />
              ) : (
                <CameraIcon className="w-10 h-10 text-cyan-400" />
              )}
            </motion.button>

            {/* Flash Toggle (if supported) */}
            <motion.button
              className="px-4 py-2 bg-white/20 border border-white/30 rounded-lg text-white font-medium text-sm"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Flash
            </motion.button>
          </div>
        </motion.div>

        {/* Scan Results Overlay */}
        <AnimatePresence>
          {scanResults && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              className="absolute bottom-24 left-4 right-4 bg-black/80 backdrop-blur-lg rounded-xl p-4 border border-white/20"
            >
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-white font-bold flex items-center space-x-2">
                  <BoltIcon className="w-5 h-5 text-cyan-400" />
                  <span>Text Analysis Result</span>
                </h4>
                
                <motion.div
                  className={`px-3 py-1 rounded-full text-sm font-bold ${
                    scanResults.threatLevel === 'CRITICAL' ? 'bg-red-500' :
                    scanResults.threatLevel === 'HIGH' ? 'bg-red-400' :
                    scanResults.threatLevel === 'MEDIUM' ? 'bg-yellow-500 text-black' :
                    'bg-green-500 text-black'
                  }`}
                  whileHover={{ scale: 1.05 }}
                >
                  {scanResults.threatLevel}
                </motion.div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-3">
                <div>
                  <span className="text-gray-300 text-sm">Risk Score</span>
                  <div className={`text-xl font-bold ${
                    scanResults.riskScore > 70 ? 'text-red-400' :
                    scanResults.riskScore > 40 ? 'text-yellow-400' :
                    'text-green-400'
                  }`}>
                    {scanResults.riskScore}%
                  </div>
                </div>
                <div>
                  <span className="text-gray-300 text-sm">Confidence</span>
                  <div className="text-xl font-bold text-cyan-400">
                    {Math.round(scanResults.confidence)}%
                  </div>
                </div>
              </div>

              <div className="bg-white/10 rounded-lg p-3 mb-3">
                <span className="text-gray-300 text-sm font-medium">Detected Text:</span>
                <p className="text-white text-sm mt-1 line-clamp-3">
                  {scanResults.text}
                </p>
              </div>

              {scanResults.detectedThreats.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {scanResults.detectedThreats.slice(0, 3).map((threat, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-1 bg-red-500/30 text-red-300 rounded-full text-xs font-medium border border-red-500/50"
                    >
                      {threat.type.replace('_', ' ')} ({threat.matches}x)
                    </span>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Status Indicator */}
        <motion.div
          className="absolute top-20 left-4 flex items-center space-x-2 bg-black/50 backdrop-blur-lg rounded-lg px-3 py-2"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <motion.div
            className={`w-3 h-3 rounded-full ${
              isScanning ? 'bg-green-400' : 'bg-gray-400'
            }`}
            animate={isScanning ? { scale: [1, 1.2, 1] } : {}}
            transition={{ duration: 1, repeat: Infinity }}
          />
          <span className="text-white text-sm font-medium">
            {isScanning ? 'Scanning...' : 'Ready to Scan'}
          </span>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default ARScanner;
