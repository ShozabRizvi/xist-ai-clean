import React, { useState, useEffect, useCallback } from 'react';
import { MicrophoneIcon, StopIcon, SpeakerWaveIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';

const VoiceRecognition = ({ onTranscript, isAnalyzing, className = "" }) => {
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState(null);
  const [transcript, setTranscript] = useState('');
  const [isSupported, setIsSupported] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // Check browser support
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognitionInstance = new SpeechRecognition();
      
      recognitionInstance.continuous = true;
      recognitionInstance.interimResults = true;
      recognitionInstance.lang = 'en-US';
      
      recognitionInstance.onresult = (event) => {
        let finalTranscript = '';
        let interimTranscript = '';
        
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const result = event.results[i];
          if (result.isFinal) {
            finalTranscript += result[0].transcript;
          } else {
            interimTranscript += result[0].transcript;
          }
        }
        
        const fullTranscript = finalTranscript + interimTranscript;
        setTranscript(fullTranscript);
        
        if (finalTranscript && onTranscript) {
          onTranscript(finalTranscript);
        }
      };
      
      recognitionInstance.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setError(`Speech recognition error: ${event.error}`);
        setIsListening(false);
      };
      
      recognitionInstance.onend = () => {
        setIsListening(false);
      };
      
      setRecognition(recognitionInstance);
      setIsSupported(true);
    } else {
      setIsSupported(false);
      setError('Speech recognition not supported in this browser. Try Chrome or Edge.');
    }
  }, [onTranscript]);

  const startListening = useCallback(() => {
    if (recognition && !isListening && !isAnalyzing) {
      setTranscript('');
      setError('');
      try {
        recognition.start();
        setIsListening(true);
      } catch (error) {
        setError('Failed to start voice recognition');
        console.error('Recognition start error:', error);
      }
    }
  }, [recognition, isListening, isAnalyzing]);

  const stopListening = useCallback(() => {
    if (recognition && isListening) {
      recognition.stop();
      setIsListening(false);
    }
  }, [recognition, isListening]);

  const speakText = (text) => {
    if ('speechSynthesis' in window) {
      // Cancel any ongoing speech
      speechSynthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1;
      utterance.volume = 0.8;
      speechSynthesis.speak(utterance);
    }
  };

  if (!isSupported) {
    return (
      <div className={`bg-yellow-50 dark:bg-yellow-900 border border-yellow-200 dark:border-yellow-700 rounded-lg p-4 ${className}`}>
        <div className="flex items-center space-x-2">
          <ExclamationTriangleIcon className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
          <p className="text-sm text-yellow-800 dark:text-yellow-200">
            Voice recognition not supported. Please use Chrome, Edge, or Safari.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Voice Controls */}
      <div className="flex items-center justify-center space-x-4">
        <button
          onClick={isListening ? stopListening : startListening}
          disabled={isAnalyzing}
          className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-medium transition-all duration-200 shadow-lg ${
            isListening 
              ? 'bg-red-500 hover:bg-red-600 text-white animate-pulse shadow-red-500/30' 
              : 'bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white shadow-purple-500/30'
          } disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105`}
        >
          {isListening ? (
            <>
              <StopIcon className="w-5 h-5" />
              <span>Stop Recording</span>
            </>
          ) : (
            <>
              <MicrophoneIcon className="w-5 h-5" />
              <span>Start Voice Input</span>
            </>
          )}
        </button>

        <button
          onClick={() => speakText("Welcome to Xist AI. I'm ready to help you verify suspicious content for misinformation and threats.")}
          disabled={isListening || isAnalyzing}
          className="flex items-center space-x-2 px-4 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-medium transition-all duration-200 disabled:opacity-50 transform hover:scale-105 shadow-lg shadow-blue-500/30"
        >
          <SpeakerWaveIcon className="w-5 h-5" />
          <span>Test Voice</span>
        </button>
      </div>

      {/* Live Transcript */}
      {transcript && (
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 shadow-lg">
          <div className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center space-x-2">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
            <span>Live Transcript:</span>
          </div>
          <p className="text-gray-900 dark:text-white italic leading-relaxed">
            "{transcript}"
          </p>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-700 rounded-lg p-3">
          <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
        </div>
      )}

      {/* Status */}
      <div className="text-center">
        <div className={`inline-flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-medium ${
          isListening 
            ? 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 border border-red-200 dark:border-red-700' 
            : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700'
        }`}>
          <div className={`w-2 h-2 rounded-full ${
            isListening ? 'bg-red-500 animate-pulse' : 'bg-gray-400'
          }`}></div>
          <span>{isListening ? 'Listening for suspicious content...' : 'Ready to listen'}</span>
        </div>
      </div>
    </div>
  );
};

export default VoiceRecognition;
