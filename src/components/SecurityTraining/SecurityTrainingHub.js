import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  AcademicCapIcon,
  TrophyIcon,
  FireIcon,
  ClockIcon,
  StarIcon,
  ShieldCheckIcon,
  ChartBarIcon,
  UserGroupIcon,
  PlayIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import Card from '../UI/Card';
import securityTrainingGame from '../../services/securityTrainingGame';
import { showNotification } from '../UI/NotificationToast';

const SecurityTrainingHub = ({ user, theme }) => {
  const [activeTab, setActiveTab] = useState('scenarios');
  const [scenarios, setScenarios] = useState([]);
  const [userStats, setUserStats] = useState({});
  const [leaderboard, setLeaderboard] = useState([]);
  const [currentScenario, setCurrentScenario] = useState(null);
  const [scenarioState, setScenarioState] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setScenarios(securityTrainingGame.getAllScenarios());
    setUserStats(securityTrainingGame.getUserStats());
    setLeaderboard(securityTrainingGame.getLeaderboard());
  };

  const startScenario = async (scenarioId) => {
    try {
      const state = await securityTrainingGame.startScenario(scenarioId);
      setCurrentScenario(scenarioId);
      setScenarioState(state);
      showNotification('Training scenario started!', 'success');
    } catch (error) {
      showNotification(`Failed to start scenario: ${error.message}`, 'error');
    }
  };

  const submitAnswer = async (choiceId) => {
    try {
      const result = await securityTrainingGame.submitAnswer(choiceId);
      
      if (result.nextStep) {
        setScenarioState(result.nextStep);
      } else {
        // Scenario completed
        setCurrentScenario(null);
        setScenarioState(null);
        loadData(); // Refresh stats
        
        showNotification(`Scenario completed! Score: ${result.score}`, 'success');
        
        if (result.newAchievements?.length > 0) {
          result.newAchievements.forEach(achievement => {
            showNotification(`🏆 Achievement unlocked: ${achievement.title}!`, 'success');
          });
        }
        
        if (result.levelUp?.leveledUp) {
          showNotification(`🎉 Level up! Welcome to level ${result.levelUp.newLevel}!`, 'success');
        }
      }
      
      return result;
    } catch (error) {
      showNotification(`Error: ${error.message}`, 'error');
    }
  };

  const useHint = () => {
    const hint = securityTrainingGame.useHint();
    if (hint) {
      showNotification(`💡 Hint: ${hint.hint}`, 'info');
      setScenarioState(prev => ({
        ...prev,
        hintsUsed: prev.hintsUsed + 1,
        canUseHint: hint.hintsRemaining > 0
      }));
    } else {
      showNotification('No hints available', 'warning');
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'beginner': return 'text-green-600 bg-green-100 dark:bg-green-900/20';
      case 'intermediate': return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20';
      case 'advanced': return 'text-red-600 bg-red-100 dark:bg-red-900/20';
      default: return 'text-gray-600 bg-gray-100 dark:bg-gray-700';
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'social_engineering': return '🎭';
      case 'technical_security': return '⚙️';
      case 'authentication': return '🔐';
      case 'infrastructure': return '🌐';
      case 'compliance': return '📋';
      default: return '🛡️';
    }
  };

  const tabs = [
    { id: 'scenarios', label: 'Training Scenarios', icon: AcademicCapIcon },
    { id: 'progress', label: 'My Progress', icon: ChartBarIcon },
    { id: 'achievements', label: 'Achievements', icon: TrophyIcon },
    { id: 'leaderboard', label: 'Leaderboard', icon: UserGroupIcon }
  ];

  // Render current scenario interface
  if (currentScenario && scenarioState) {
    const step = scenarioState.currentStep;
    
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Scenario Header */}
        <Card className="p-6 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                {scenarioState.scenario.title}
              </h2>
              <div className="flex items-center space-x-4 mt-2">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(scenarioState.scenario.difficulty)}`}>
                  {scenarioState.scenario.difficulty}
                </span>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {getCategoryIcon(scenarioState.scenario.category)} {scenarioState.scenario.category}
                </span>
              </div>
            </div>
            
            <div className="text-right">
              <div className="text-2xl font-bold text-purple-600">
                {scenarioState.score} pts
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {Math.floor(scenarioState.timeElapsed / 60)}:{(scenarioState.timeElapsed % 60).toString().padStart(2, '0')}
              </div>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="relative">
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className="bg-gradient-to-r from-purple-600 to-blue-600 h-3 rounded-full transition-all duration-300"
                style={{ width: `${scenarioState.progress}%` }}
              ></div>
            </div>
            <div className="text-center mt-2 text-sm text-gray-600 dark:text-gray-400">
              Progress: {scenarioState.progress}%
            </div>
          </div>
        </Card>

        {/* Scenario Content */}
        <Card className="p-6">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            {step.title}
          </h3>
          
          {/* Email Scenario */}
          {step.content.from && (
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg mb-6 border border-gray-200 dark:border-gray-600">
              <div className="space-y-2 text-sm">
                <div><strong>From:</strong> {step.content.from}</div>
                <div><strong>Subject:</strong> {step.content.subject}</div>
                {step.content.attachments && (
                  <div><strong>Attachments:</strong> {step.content.attachments.join(', ')}</div>
                )}
              </div>
              <div className="mt-4 p-4 bg-white dark:bg-gray-800 rounded border">
                <pre className="whitespace-pre-wrap text-sm">{step.content.body}</pre>
              </div>
            </div>
          )}

          {/* Social Engineering Scenario */}
          {step.content.dialogue && (
            <div className="space-y-3 mb-6">
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                <strong>Scenario:</strong> {step.content.scenario}
              </div>
              {step.content.dialogue.map((line, index) => (
                <div key={index} className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="text-sm font-mono">{line}</div>
                </div>
              ))}
            </div>
          )}

          {/* Choices */}
          <div className="space-y-3">
            <h4 className="font-medium text-gray-900 dark:text-white">What would you do?</h4>
            {step.choices.map((choice, index) => (
              <motion.button
                key={choice.id}
                onClick={() => submitAnswer(choice.id)}
                className="w-full p-4 text-left bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-purple-300 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-all"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 rounded-full border-2 border-gray-300 dark:border-gray-600 flex items-center justify-center text-sm font-medium">
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

          {/* Hint Button */}
          <div className="mt-6 flex justify-between">
            <button
              onClick={useHint}
              disabled={!scenarioState.canUseHint}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                scenarioState.canUseHint
                  ? 'bg-yellow-600 text-white hover:bg-yellow-700'
                  : 'bg-gray-400 text-gray-200 cursor-not-allowed'
              }`}
            >
              <span>💡</span>
              <span>Use Hint ({3 - scenarioState.hintsUsed} left)</span>
            </button>
          </div>
        </Card>
      </div>
    );
  }

  // Main training hub interface
  return (
    <div className="max-w-6xl mx-auto space-y-6">
      
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          🎓 Security Training Academy
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Master cybersecurity through interactive scenarios and challenges
        </p>
      </div>

      {/* User Progress Banner */}
      <Card className="p-6 bg-gradient-to-r from-purple-600 to-blue-600 text-white">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold">{userStats.level}</div>
            <div className="text-sm opacity-90">Level</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">{userStats.totalScore}</div>
            <div className="text-sm opacity-90">Total XP</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">{userStats.scenariosCompleted}</div>
            <div className="text-sm opacity-90">Completed</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">{userStats.averageAccuracy}%</div>
            <div className="text-sm opacity-90">Accuracy</div>
          </div>
        </div>
        
        {/* XP Progress Bar */}
        <div className="mt-4">
          <div className="flex justify-between text-sm mb-2">
            <span>Progress to Level {userStats.level + 1}</span>
            <span>{1000 - userStats.xpToNextLevel}/1000 XP</span>
          </div>
          <div className="w-full bg-white/20 rounded-full h-3">
            <div 
              className="bg-white h-3 rounded-full transition-all duration-300"
              style={{ width: `${((1000 - userStats.xpToNextLevel) / 1000) * 100}%` }}
            ></div>
          </div>
        </div>
      </Card>

      {/* Navigation Tabs */}
      <Card className="p-2">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            
            return (
              <motion.button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 p-3 rounded-lg font-medium transition-all ${
                  isActive
                    ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Icon className="w-5 h-5" />
                <span className="hidden sm:inline">{tab.label}</span>
              </motion.button>
            );
          })}
        </div>
      </Card>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.2 }}
        >
          
          {/* Scenarios Tab */}
          {activeTab === 'scenarios' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {scenarios.map((scenario) => (
                <motion.div
                  key={scenario.id}
                  whileHover={{ y: -4 }}
                  className="relative"
                >
                  <Card className="p-6 h-full flex flex-col">
                    <div className="flex items-start justify-between mb-3">
                      <div className="text-3xl">{getCategoryIcon(scenario.category)}</div>
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(scenario.difficulty)}`}>
                          {scenario.difficulty}
                        </span>
                        {scenario.completed && (
                          <CheckCircleIcon className="w-5 h-5 text-green-600" />
                        )}
                      </div>
                    </div>
                    
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      {scenario.title}
                    </h3>
                    
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 flex-1">
                      {scenario.description}
                    </p>
                    
                    <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-4">
                      <div className="flex items-center space-x-1">
                        <ClockIcon className="w-4 h-4" />
                        <span>{scenario.estimatedTime} min</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <StarIcon className="w-4 h-4" />
                        <span>{scenario.points} XP</span>
                      </div>
                    </div>
                    
                    <button
                      onClick={() => startScenario(scenario.id)}
                      disabled={!user}
                      className={`w-full flex items-center justify-center space-x-2 py-3 rounded-lg font-medium transition-all ${
                        scenario.completed
                          ? 'bg-green-600 text-white hover:bg-green-700'
                          : 'bg-purple-600 text-white hover:bg-purple-700'
                      } ${!user ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      <PlayIcon className="w-5 h-5" />
                      <span>{scenario.completed ? 'Replay' : 'Start Training'}</span>
                    </button>
                    
                    {scenario.badge && (
                      <div className="mt-2 text-center text-xs text-gray-500">
                        🏅 Earn: {scenario.badge}
                      </div>
                    )}
                  </Card>
                </motion.div>
              ))}
            </div>
          )}

          {/* Progress Tab */}
          {activeTab === 'progress' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Statistics Cards */}
              <div className="space-y-4">
                <Card className="p-4">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Training Statistics</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Current Level</span>
                      <span className="font-semibold">{userStats.level}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Total XP</span>
                      <span className="font-semibold">{userStats.totalScore}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Scenarios Completed</span>
                      <span className="font-semibold">{userStats.scenariosCompleted}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Average Accuracy</span>
                      <span className="font-semibold">{userStats.averageAccuracy}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Time Spent</span>
                      <span className="font-semibold">{Math.floor((userStats.totalTime || 0) / 60)} min</span>
                    </div>
                  </div>
                </Card>
              </div>

              {/* Achievements Preview */}
              <Card className="p-4">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Recent Achievements</h3>
                <div className="text-center text-gray-500 dark:text-gray-400">
                  Complete scenarios to unlock achievements!
                </div>
              </Card>
            </div>
          )}

          {/* Achievements Tab */}
          {activeTab === 'achievements' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.values(securityTrainingGame.achievements).map((achievement) => {
                const isUnlocked = userStats.achievements?.includes(achievement.id);
                
                return (
                  <Card key={achievement.id} className={`p-4 ${isUnlocked ? 'ring-2 ring-yellow-400' : 'opacity-60'}`}>
                    <div className="text-center">
                      <div className="text-4xl mb-2">{achievement.icon}</div>
                      <h3 className={`font-semibold mb-2 ${isUnlocked ? 'text-yellow-600' : 'text-gray-500'}`}>
                        {achievement.title}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        {achievement.description}
                      </p>
                      <div className="text-xs text-purple-600 font-medium">
                        +{achievement.points} XP
                      </div>
                      {isUnlocked && (
                        <div className="mt-2">
                          <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">
                            Unlocked!
                          </span>
                        </div>
                      )}
                    </div>
                  </Card>
                );
              })}
            </div>
          )}

          {/* Leaderboard Tab */}
          {activeTab === 'leaderboard' && (
            <Card className="p-6">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                🏆 Top Security Trainees
              </h3>
              {leaderboard.length > 0 ? (
                <div className="space-y-3">
                  {leaderboard.map((entry, index) => (
                    <div key={entry.userId} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <div className="flex items-center space-x-4">
                                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${
                          index === 0 ? 'bg-yellow-500' :
                          index === 1 ? 'bg-gray-400' :
                          index === 2 ? 'bg-orange-600' : 'bg-purple-600'
                        }`}>
                          {index + 1}
                        </div>
                        <div>
                          <div className="font-medium text-gray-900 dark:text-white">
                            {entry.username}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            Level {entry.level} • {entry.scenariosCompleted} scenarios
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-purple-600">
                          {entry.totalScore} XP
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {entry.averageAccuracy}% accuracy
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center text-gray-500 dark:text-gray-400 py-8">
                  No leaderboard data yet. Complete scenarios to get ranked!
                </div>
              )}
            </Card>
          )}

        </motion.div>
      </AnimatePresence>

      {/* Quick Start Section */}
      {activeTab === 'scenarios' && (
        <Card className="p-6 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20">
          <div className="flex items-center space-x-4">
            <div className="text-4xl">🚀</div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                New to Security Training?
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Start with our beginner-friendly Email Phishing Detection scenario to learn the basics of cybersecurity.
              </p>
              <button
                onClick={() => startScenario('phishing_email')}
                disabled={!user}
                className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors font-medium"
              >
                Start Your Journey
              </button>
            </div>
          </div>
        </Card>
      )}

      {/* User Not Signed In Warning */}
      {!user && (
        <Card className="p-4 border-l-4 border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20">
          <div className="flex items-center">
            <ExclamationTriangleIcon className="w-6 h-6 text-yellow-600 mr-3" />
            <div>
              <h3 className="text-yellow-800 dark:text-yellow-200 font-semibold">
                Sign In Required
              </h3>
              <p className="text-yellow-600 dark:text-yellow-400 text-sm">
                Please sign in to access security training scenarios and track your progress.
              </p>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

export default SecurityTrainingHub;
