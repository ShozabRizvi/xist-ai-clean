import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MicrophoneIcon,
  SpeakerWaveIcon,
  Cog6ToothIcon,
  LanguageIcon,
  PlayIcon,
  StopIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import Card from '../UI/Card';
import { voiceCommandSystem } from '../../services/voiceCommandSystem';
import { showNotification } from '../UI/NotificationToast';

const VoiceControlPanel = ({ user, theme }) => {
  const [isListening, setIsListening] = useState(false);
  const [currentCommand, setCurrentCommand] = useState('');
  const [confidence, setConfidence] = useState(0);
  const [commandHistory, setCommandHistory] = useState([]);
  const [voiceSettings, setVoiceSettings] = useState({
    language: 'en-US',
    rate: 0.9,
    pitch: 1.0,
    volume: 0.8,
    wakeWord: true
  });
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    // Check browser support
    setIsSupported(voiceCommandSystem.checkBrowserSupport());
    
    // Load command history
    updateCommandHistory();
    
    const interval = setInterval(updateCommandHistory, 2000);
    return () => clearInterval(interval);
  }, []);

  const updateCommandHistory = () => {
    const history = voiceCommandSystem.getCommandHistory();
    setCommandHistory(history);
  };

  const toggleListening = async () => {
    if (!user) {
      showNotification('Please sign in to use voice commands', 'warning');
      return;
    }

    if (!isListening) {
      const success = await voiceCommandSystem.startListening();
      if (success) {
        setIsListening(true);
      }
    } else {
      voiceCommandSystem.stopListening();
      setIsListening(false);
    }
  };

  const testVoice = () => {
    voiceCommandSystem.speak('Voice system test successful. All systems operational.');
  };

  const executeTestCommand = async (command) => {
    setCurrentCommand(command);
    await voiceCommandSystem.processVoiceInput(command);
    setTimeout(() => setCurrentCommand(''), 3000);
  };

  const languageOptions = [
    { code: 'en-US', name: 'English (US)', flag: '🇺🇸' },
    { code: 'en-GB', name: 'English (UK)', flag: '🇬🇧' },
    { code: 'hi-IN', name: 'Hindi', flag: '🇮🇳' },
    { code: 'es-ES', name: 'Spanish', flag: '🇪🇸' },
    { code: 'fr-FR', name: 'French', flag: '🇫🇷' }
  ];

  const testCommands = [
    'Xist scan url google.com',
    'Xist show threats', 
    'Xist network status',
    'Xist security report',
    'Xist help'
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          🎤 Voice Command Center
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Control Xist AI with natural voice commands
        </p>
      </div>

      {/* Browser Support Check */}
      {!isSupported && (
        <Card className="p-4 border-l-4 border-red-500 bg-red-50 dark:bg-red-900/20">
          <div className="flex items-center">
            <ExclamationTriangleIcon className="w-6 h-6 text-red-600 mr-3" />
            <div>
              <h3 className="text-red-800 dark:text-red-200 font-semibold">
                Voice Commands Not Supported
              </h3>
              <p className="text-red-600 dark:text-red-400 text-sm">
                Your browser doesn't support speech recognition. Please use Chrome, Edge, or Safari.
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* Main Control Panel */}
      <Card className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Voice Control */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
              <MicrophoneIcon className="w-5 h-5 mr-2 text-purple-600" />
              Voice Recognition
            </h3>
            
            {/* Main Control Button */}
            <div className="text-center">
              <motion.button
                onClick={toggleListening}
                disabled={!isSupported || !user}
                className={`w-24 h-24 rounded-full flex items-center justify-center text-white font-semibold text-lg transition-all ${
                  isListening
                    ? 'bg-red-500 hover:bg-red-600 shadow-lg shadow-red-500/50'
                    : 'bg-green-500 hover:bg-green-600 shadow-lg shadow-green-500/50'
                } ${(!isSupported || !user) ? 'opacity-50 cursor-not-allowed' : ''}`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                animate={isListening ? { 
                  boxShadow: [
                    '0 0 0 0 rgba(239, 68, 68, 0.7)',
                    '0 0 0 10px rgba(239, 68, 68, 0)',
                    '0 0 0 20px rgba(239, 68, 68, 0)'
                  ]
                } : {}}
                transition={{ duration: 1.5, repeat: isListening ? Infinity : 0 }}
              >
                {isListening ? <StopIcon className="w-8 h-8" /> : <PlayIcon className="w-8 h-8" />}
              </motion.button>
              
              <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                {isListening ? 'Listening...' : 'Click to start'}
              </div>
            </div>

            {/* Current Command Display */}
            <AnimatePresence>
              {currentCommand && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg"
                >
                  <div className="text-sm text-blue-800 dark:text-blue-200 font-medium">
                    Processing Command:
                  </div>
                  <div className="text-blue-900 dark:text-blue-100 font-mono">
                    "{currentCommand}"
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Test Voice Button */}
            <button
              onClick={testVoice}
              className="w-full flex items-center justify-center space-x-2 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              <SpeakerWaveIcon className="w-5 h-5" />
              <span>Test Voice Output</span>
            </button>
          </div>

          {/* Settings Panel */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
              <Cog6ToothIcon className="w-5 h-5 mr-2 text-purple-600" />
              Voice Settings
            </h3>

            {/* Language Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Voice Language
              </label>
              <select
                value={voiceSettings.language}
                onChange={(e) => {
                  setVoiceSettings(prev => ({ ...prev, language: e.target.value }));
                  voiceCommandSystem.currentLanguage = e.target.value;
                }}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500"
              >
                {languageOptions.map(lang => (
                  <option key={lang.code} value={lang.code}>
                    {lang.flag} {lang.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Voice Rate */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Speech Rate: {voiceSettings.rate}
              </label>
              <input
                type="range"
                min="0.5"
                max="2"
                step="0.1"
                value={voiceSettings.rate}
                onChange={(e) => setVoiceSettings(prev => ({ ...prev, rate: parseFloat(e.target.value) }))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
              />
            </div>

            {/* Voice Pitch */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Speech Pitch: {voiceSettings.pitch}
              </label>
              <input
                type="range"
                min="0.5"
                max="2"
                step="0.1"
                value={voiceSettings.pitch}
                onChange={(e) => setVoiceSettings(prev => ({ ...prev, pitch: parseFloat(e.target.value) }))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
              />
            </div>

            {/* Wake Word Toggle */}
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Wake Word Required
              </span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={voiceSettings.wakeWord}
                  onChange={(e) => {
                    setVoiceSettings(prev => ({ ...prev, wakeWord: e.target.checked }));
                    voiceCommandSystem.toggleWakeWord();
                  }}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 dark:peer-focus:ring-purple-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-purple-600"></div>
              </label>
            </div>
          </div>
        </div>
      </Card>

      {/* Command Examples */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          🗣️ Try These Commands
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {testCommands.map((command, index) => (
            <motion.button
              key={index}
              onClick={() => executeTestCommand(command)}
              className="p-3 text-left bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="text-sm font-medium text-gray-900 dark:text-white">
                💬 "{command}"
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                Click to test this command
              </div>
            </motion.button>
          ))}
        </div>
      </Card>

      {/* Command History */}
      {commandHistory.length > 0 && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            📝 Recent Commands
          </h3>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {commandHistory.map((cmd, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
              >
                <div className="flex-1">
                  <div className="text-sm font-medium text-gray-900 dark:text-white">
                    "{cmd.transcript}"
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {new Date(cmd.timestamp).toLocaleTimeString()}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <div className={`w-2 h-2 rounded-full ${
                    cmd.confidence > 0.8 ? 'bg-green-500' :
                    cmd.confidence > 0.6 ? 'bg-yellow-500' : 'bg-red-500'
                  }`}></div>
                  <span className="text-xs text-gray-500">
                    {Math.round(cmd.confidence * 100)}%
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </Card>
      )}

      {/* Help Card */}
      <Card className="p-4 bg-blue-50 dark:bg-blue-900/20">
        <div className="flex items-start space-x-3">
          <LanguageIcon className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
          <div>
            <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
              Voice Command Tips
            </h4>
            <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
              <li>• Start commands with "Xist" when wake word is enabled</li>
              <li>• Speak clearly and at normal pace</li>
              <li>• Use natural language - "scan this URL" or "check for threats"</li>
              <li>• Say "help" to hear all available commands</li>
              <li>• Emergency commands require confirmation for safety</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default VoiceControlPanel;
