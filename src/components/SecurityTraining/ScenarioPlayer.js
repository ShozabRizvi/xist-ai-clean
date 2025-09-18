import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ClockIcon,
  LightBulbIcon,
  CheckCircleIcon,
  XCircleIcon,
  ExclamationTriangleIcon,
  ArrowLeftIcon,
  StarIcon
} from '@heroicons/react/24/outline';
import Card from '../UI/Card';

const ScenarioPlayer = ({ 
  scenarioState, 
  onSubmitAnswer, 
  onUseHint, 
  onExit,
  theme 
}) => {
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [lastResult, setLastResult] = useState(null);

  const handleChoiceSelect = async (choiceId) => {
    setSelectedChoice(choiceId);
    
    try {
      const result = await onSubmitAnswer(choiceId);
      setLastResult(result);
      setShowFeedback(true);
      
      // Auto-continue after showing feedback
      setTimeout(() => {
        setShowFeedback(false);
        setSelectedChoice(null);
      }, 3000);
      
    } catch (error) {
      console.error('Failed to submit answer:', error);
    }
  };

  const step = scenarioState?.currentStep;
  
  if (!step) {
    return (
      <Card className="p-8 text-center">
        <div className="text-gray-500 dark:text-gray-400">
          Loading scenario...
        </div>
      </Card>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      {/* Scenario Header */}
      <Card className="p-6 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={onExit}
              className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
            >
              <ArrowLeftIcon className="w-5 h-5" />
            </button>
            
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                {scenarioState.scenario.title}
              </h2>
              <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                <span>{scenarioState.scenario.difficulty}</span>
                <span>•</span>
                <span>{scenarioState.scenario.category}</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <div className="text-2xl font-bold text-purple-600">
                {scenarioState.score}
              </div>
              <div className="text-sm text-gray-500">points</div>
            </div>
            
            <div className="text-right">
              <div className="flex items-center text-gray-600 dark:text-gray-400">
                <ClockIcon className="w-4 h-4 mr-1" />
                <span>
                  {Math.floor(scenarioState.timeElapsed / 60)}:
                  {(scenarioState.timeElapsed % 60).toString().padStart(2, '0')}
                </span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="mt-4">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <motion.div 
              className="bg-gradient-to-r from-purple-600 to-blue-600 h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${scenarioState.progress}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
          <div className="text-center mt-2 text-sm text-gray-600 dark:text-gray-400">
            Step {scenarioState.progress === 100 ? 'Complete' : `${scenarioState.currentStep + 1}`}
          </div>
        </div>
      </Card>

      {/* Feedback Overlay */}
      <AnimatePresence>
        {showFeedback && lastResult && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          >
            <Card className={`p-6 max-w-md mx-4 ${
              lastResult.correct 
                ? 'border-l-4 border-green-500 bg-green-50 dark:bg-green-900/20' 
                : 'border-l-4 border-red-500 bg-red-50 dark:bg-red-900/20'
            }`}>
              <div className="text-center">
                <div className="mb-4">
                  {lastResult.correct ? (
                    <CheckCircleIcon className="w-16 h-16 text-green-600 mx-auto" />
                  ) : (
                    <XCircleIcon className="w-16 h-16 text-red-600 mx-auto" />
                  )}
                </div>
                
                <h3 className={`text-xl font-bold mb-2 ${
                  lastResult.correct 
                    ? 'text-green-800 dark:text-green-200' 
                    : 'text-red-800 dark:text-red-200'
                }`}>
                  {lastResult.correct ? 'Correct!' : 'Incorrect'}
                </h3>
                
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  {lastResult.feedback}
                </p>
                
                {lastResult.consequence && (
                  <div className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    <strong>Consequence:</strong> {lastResult.consequence}
                  </div>
                )}
                
                <div className="flex items-center justify-center space-x-1">
                  <StarIcon className="w-5 h-5 text-yellow-500" />
                  <span className="font-semibold">
                    {lastResult.points > 0 ? '+' : ''}{lastResult.points} points
                  </span>
                </div>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Scenario Content */}
      <Card className="p-6">
        <div className="space-y-6">
          
          {/* Step Title */}
          <div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              {step.title}
            </h3>
          </div>

          {/* Email Content */}
          {step.content.from && (
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 overflow-hidden">
              
              {/* Email Header */}
              <div className="bg-gray-100 dark:bg-gray-600 p-4 border-b border-gray-200 dark:border-gray-500">
                <div className="space-y-2 text-sm">
                  <div className="flex">
                    <span className="font-semibold text-gray-700 dark:text-gray-300 w-16">From:</span>
                    <span className="text-gray-900 dark:text-white">{step.content.from}</span>
                  </div>
                  <div className="flex">
                    <span className="font-semibold text-gray-700 dark:text-gray-300 w-16">Subject:</span>
                    <span className="text-gray-900 dark:text-white font-medium">{step.content.subject}</span>
                  </div>
                  {step.content.attachments && (
                    <div className="flex">
                      <span className="font-semibold text-gray-700 dark:text-gray-300 w-16">Files:</span>
                      <div className="flex flex-wrap gap-2">
                        {step.content.attachments.map((attachment, index) => (
                          <span 
                            key={index}
                            className="bg-red-100 text-red-800 px-2 py-1 rounded text-xs font-medium"
                          >
                            📎 {attachment}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Email Body */}
              <div className="p-4">
                <pre className="whitespace-pre-wrap text-sm text-gray-800 dark:text-gray-200 font-sans leading-relaxed">
                  {step.content.body}
                </pre>
              </div>
            </div>
          )}

          {/* Social Engineering Dialogue */}
          {step.content.dialogue && (
            <div className="space-y-4">
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                <div className="text-sm text-blue-800 dark:text-blue-200 mb-2">
                  <strong>Scenario Context:</strong> {step.content.scenario}
                </div>
              </div>
              
              <div className="space-y-3">
                <h4 className="font-semibold text-gray-900 dark:text-white">Phone Conversation:</h4>
                {step.content.dialogue.map((line, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.2 }}
                    className="flex items-start space-x-3"
                  >
                    <div className="w-8 h-8 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center text-sm font-semibold text-red-700 dark:text-red-300">
                      📞
                    </div>
                    <div className="flex-1 bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                      <div className="text-sm text-gray-800 dark:text-gray-200">
                        {line}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Malware Analysis Content */}
          {step.content.fileName && (
            <div className="space-y-4">
              <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg border-l-4 border-yellow-400">
                <div className="flex items-center mb-3">
                  <ExclamationTriangleIcon className="w-6 h-6 text-yellow-600 mr-2" />
                  <span className="font-semibold text-yellow-800 dark:text-yellow-200">
                    Suspicious File Detected
                  </span>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-gray-700 dark:text-gray-300">Filename:</span>
                    <div className="font-mono text-red-600 dark:text-red-400">
                      {step.content.fileName}
                    </div>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700 dark:text-gray-300">Size:</span>
                    <div>{step.content.fileSize}</div>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700 dark:text-gray-300">Source:</span>
                    <div>{step.content.source}</div>
                  </div>
                </div>
                
                {step.content.behavior && (
                  <div className="mt-4">
                    <div className="font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Observed Behavior:
                    </div>
                    <ul className="list-disc list-inside space-y-1 text-sm text-gray-600 dark:text-gray-400">
                      {step.content.behavior.map((behavior, index) => (
                        <li key={index}>{behavior}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Password Analysis Content */}
          {step.content.passwords && (
            <div className="space-y-4">
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                <strong>Task:</strong> {step.content.task}
              </div>
              
              <div className="grid gap-3">
                {step.content.passwords.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="font-mono text-sm">{item.password}</div>
                    <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                      item.strength === 'Very Strong' ? 'bg-green-100 text-green-800' :
                      item.strength === 'Strong' ? 'bg-blue-100 text-blue-800' :
                      item.strength === 'Moderate' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {item.strength}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Question and Choices */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
              What would you do in this situation?
            </h4>
            
            <div className="space-y-3">
              {step.choices.map((choice, index) => (
                <motion.button
                  key={choice.id}
                  onClick={() => handleChoiceSelect(choice.id)}
                  disabled={showFeedback}
                  className={`w-full p-4 text-left rounded-lg border-2 transition-all ${
                    selectedChoice === choice.id
                      ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                      : 'border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 hover:border-purple-300 hover:bg-purple-50 dark:hover:bg-purple-900/10'
                  } ${showFeedback ? 'opacity-50 cursor-not-allowed' : ''}`}
                  whileHover={!showFeedback ? { scale: 1.02 } : {}}
                  whileTap={!showFeedback ? { scale: 0.98 } : {}}
                >
                  <div className="flex items-start space-x-3">
                    <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-sm font-bold ${
                      selectedChoice === choice.id
                        ? 'border-purple-500 bg-purple-500 text-white'
                        : 'border-gray-300 dark:border-gray-500 text-gray-600 dark:text-gray-400'
                    }`}>
                      {String.fromCharCode(65 + index)}
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {choice.text}
                      </div>
                    </div>
                  </div>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Red Flags Hint Section */}
          {step.redFlags && step.redFlags.length > 0 && (
            <Card className="p-4 bg-orange-50 dark:bg-orange-900/20 border-l-4 border-orange-400">
              <div className="flex items-start space-x-3">
                <ExclamationTriangleIcon className="w-6 h-6 text-orange-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-orange-800 dark:text-orange-200 mb-2">
                    Security Red Flags to Look For:
                  </h4>
                  <ul className="list-disc list-inside space-y-1 text-sm text-orange-700 dark:text-orange-300">
                    {step.redFlags.map((flag, index) => (
                      <li key={index}>{flag}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </Card>
          )}

          {/* Action Bar */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={onUseHint}
              disabled={!scenarioState.canUseHint || showFeedback}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                scenarioState.canUseHint && !showFeedback
                  ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200 border border-yellow-300'
                  : 'bg-gray-200 text-gray-500 cursor-not-allowed'
              }`}
            >
              <LightBulbIcon className="w-4 h-4" />
              <span>
                Get Hint ({3 - scenarioState.hintsUsed} remaining)
              </span>
            </button>
            
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Think carefully before choosing your answer
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ScenarioPlayer;
