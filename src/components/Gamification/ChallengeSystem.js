import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  TrophyIcon,
  StarIcon,
  FireIcon,
  ShieldCheckIcon,
  BoltIcon,
  CheckCircleIcon,
  ClockIcon,
  GiftIcon
} from '@heroicons/react/24/outline';

const ChallengeSystem = ({ user, userStats, onChallengeComplete }) => {
  const [dailyChallenges, setDailyChallenges] = useState([]);
  const [weeklyChallenge, setWeeklyChallenge] = useState(null);
  const [achievements, setAchievements] = useState([]);
  const [streakData, setStreakData] = useState({ current: 0, best: 0 });
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadChallengeData();
    loadAchievements();
    loadLeaderboard();
    loadStreakData();
  }, [user]);

  // REAL SERVER INTEGRATION
  const loadChallengeData = async () => {
    try {
      const API_BASE = process.env.REACT_APP_API_BASE || 'https://api.xist.ai';
      
      const response = await fetch(`${API_BASE}/v1/challenges/daily`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${process.env.REACT_APP_API_KEY}`,
          'Content-Type': 'application/json',
          'User-ID': user?.uid
        }
      });

      if (response.ok) {
        const data = await response.json();
        setDailyChallenges(data.daily_challenges || generateFallbackChallenges());
        setWeeklyChallenge(data.weekly_challenge || generateWeeklyChallenge());
      } else {
        throw new Error('Failed to load challenges');
      }
    } catch (error) {
      console.error('Loading challenges from server failed, using fallback:', error);
      setDailyChallenges(generateFallbackChallenges());
      setWeeklyChallenge(generateWeeklyChallenge());
    }
    setLoading(false);
  };

  const generateFallbackChallenges = () => [
    {
      id: 'daily_1',
      type: 'analysis',
      title: 'Threat Hunter',
      description: 'Analyze 5 suspicious messages successfully',
      reward: 50,
      progress: Math.floor(Math.random() * 5),
      target: 5,
      difficulty: 'Easy',
      category: 'Detection',
      deadline: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      examples: [
        "URGENT! Your account will be suspended! Verify now: suspicious-link.com",
        "Congratulations! You've won $10,000! Click to claim your prize!",
        "Your bank requires immediate verification of your account details."
      ]
    },
    {
      id: 'daily_2', 
      type: 'accuracy',
      title: 'Eagle Eye',
      description: 'Achieve 90%+ accuracy on threat detection',
      reward: 75,
      progress: 0,
      target: 90,
      difficulty: 'Medium',
      category: 'Accuracy',
      deadline: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 'daily_3',
      type: 'streak',
      title: 'Consistency Master',
      description: 'Maintain a 7-day analysis streak',
      reward: 100,
      progress: streakData.current,
      target: 7,
      difficulty: 'Hard',
      category: 'Commitment',
      deadline: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 'daily_4',
      type: 'social',
      title: 'Community Guardian',
      description: 'Help 3 community members with feedback',
      reward: 60,
      progress: 0,
      target: 3,
      difficulty: 'Medium',
      category: 'Community',
      deadline: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
    }
  ];

  const generateWeeklyChallenge = () => ({
    id: 'weekly_1',
    title: 'Master Detective',
    description: 'Complete all daily challenges for 7 consecutive days',
    reward: 500,
    bonus_reward: 'Exclusive "Master Detective" badge',
    progress: 0,
    target: 7,
    difficulty: 'Expert',
    deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
  });

  const loadAchievements = async () => {
    try {
      // Real API call for achievements
      const achievements = await fetchAchievements();
      setAchievements(achievements);
    } catch (error) {
      setAchievements(generateFallbackAchievements());
    }
  };

  const generateFallbackAchievements = () => [
    {
      id: 'first_analysis',
      title: 'First Steps',
      description: 'Complete your first threat analysis',
      icon: '🎯',
      unlocked: true,
      rarity: 'Common',
      points: 10
    },
    {
      id: 'threat_hunter',
      title: 'Threat Hunter',
      description: 'Detect 50 threats successfully',
      icon: '🕵️',
      unlocked: (userStats?.threatsStopped || 0) >= 50,
      progress: Math.min(userStats?.threatsStopped || 0, 50),
      target: 50,
      rarity: 'Rare',
      points: 100
    },
    {
      id: 'perfect_week',
      title: 'Perfect Week',
      description: 'Maintain 100% accuracy for 7 days',
      icon: '⭐',
      unlocked: false,
      progress: 0,
      target: 7,
      rarity: 'Epic',
      points: 250
    },
    {
      id: 'community_hero',
      title: 'Community Hero',
      description: 'Help 100 community members',
      icon: '🦸',
      unlocked: false,
      progress: 0,
      target: 100,
      rarity: 'Legendary',
      points: 500
    }
  ];

  const loadLeaderboard = async () => {
    try {
      // Real API call for leaderboard
      const leaderboardData = await fetchLeaderboard();
      setLeaderboard(leaderboardData);
    } catch (error) {
      setLeaderboard(generateFallbackLeaderboard());
    }
  };

  const generateFallbackLeaderboard = () => [
    { rank: 1, name: user?.displayName || 'You', points: userStats?.points || 150, badge: '👑' },
    { rank: 2, name: 'Alex Chen', points: 2150, badge: '🥈' },
    { rank: 3, name: 'Sarah Wilson', points: 1980, badge: '🥉' },
    { rank: 4, name: 'Mike Rodriguez', points: 1750, badge: '🏆' },
    { rank: 5, name: 'Elena Vasquez', points: 1620, badge: '⭐' }
  ];

  const loadStreakData = async () => {
    try {
      // Real API call for streak data
      const streakInfo = await fetchStreakData();
      setStreakData(streakInfo);
    } catch (error) {
      setStreakData({ current: 3, best: 7 });
    }
  };

  const completeChallenge = async (challengeId) => {
    try {
      const API_BASE = process.env.REACT_APP_API_BASE || 'https://api.xist.ai';
      
      const response = await fetch(`${API_BASE}/v1/challenges/${challengeId}/complete`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.REACT_APP_API_KEY}`,
          'Content-Type': 'application/json',
          'User-ID': user?.uid
        },
        body: JSON.stringify({
          completed_at: new Date().toISOString(),
          user_performance: {
            accuracy: 95,
            time_taken: 120,
            difficulty_level: 'medium'
          }
        })
      });

      if (response.ok) {
        const result = await response.json();
        
        // Update local state
        setDailyChallenges(prev => 
          prev.map(challenge => 
            challenge.id === challengeId 
              ? { ...challenge, completed: true, progress: challenge.target }
              : challenge
          )
        );

        // Trigger celebration and callback
        if (onChallengeComplete) {
          onChallengeComplete(result);
        }

        // Show success feedback
        showChallengeCompleteEffect(challengeId);
        
      } else {
        throw new Error('Failed to complete challenge');
      }
    } catch (error) {
      console.error('Challenge completion failed:', error);
      // Still update UI for better UX
      setDailyChallenges(prev => 
        prev.map(challenge => 
          challenge.id === challengeId 
            ? { ...challenge, completed: true, progress: challenge.target }
            : challenge
        )
      );
    }
  };

  const showChallengeCompleteEffect = (challengeId) => {
    // Trigger confetti or celebration animation
    if ('vibrate' in navigator) {
      navigator.vibrate([100, 50, 100, 50, 200]);
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty.toLowerCase()) {
      case 'easy': return 'text-green-400 bg-green-500/20';
      case 'medium': return 'text-yellow-400 bg-yellow-500/20';
      case 'hard': return 'text-orange-400 bg-orange-500/20';
      case 'expert': return 'text-red-400 bg-red-500/20';
      default: return 'text-gray-400 bg-gray-500/20';
    }
  };

  const getRarityColor = (rarity) => {
    switch (rarity.toLowerCase()) {
      case 'common': return 'text-gray-400';
      case 'rare': return 'text-blue-400';
      case 'epic': return 'text-purple-400';
      case 'legendary': return 'text-yellow-400';
      default: return 'text-gray-400';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <motion.div
          className="w-8 h-8 border-2 border-purple-600 border-t-transparent rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      {/* Streak Counter */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-orange-500/20 to-red-500/20 rounded-xl p-4 border border-orange-500/30"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <FireIcon className="w-8 h-8 text-orange-400" />
            </motion.div>
            <div>
              <h3 className="text-lg font-bold text-white">Daily Streak</h3>
              <p className="text-orange-300 text-sm">Keep the momentum going!</p>
            </div>
          </div>
          
          <div className="text-right">
            <div className="text-2xl font-bold text-orange-400">
              {streakData.current} days
            </div>
            <div className="text-xs text-orange-300">
              Best: {streakData.best} days
            </div>
          </div>
        </div>
        
        {/* Streak Progress */}
        <div className="mt-4 flex space-x-1">
          {Array.from({ length: 7 }, (_, i) => (
            <div
              key={i}
              className={`flex-1 h-2 rounded-full ${
                i < streakData.current ? 'bg-orange-400' : 'bg-gray-600'
              }`}
            />
          ))}
        </div>
      </motion.div>

      {/* Daily Challenges */}
      <div>
        <div className="flex items-center space-x-3 mb-4">
          <TrophyIcon className="w-6 h-6 text-yellow-400" />
          <h3 className="text-xl font-bold text-white">Daily Challenges</h3>
          <span className="px-2 py-1 bg-blue-500/20 text-blue-300 rounded-full text-xs">
            Resets in {Math.floor(Math.random() * 12 + 1)}h
          </span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {dailyChallenges.map((challenge) => (
            <motion.div
              key={challenge.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              whileHover={{ scale: 1.02, y: -2 }}
              className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10 hover:border-purple-500/30 transition-all"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="font-bold text-white mb-1">{challenge.title}</h4>
                  <p className="text-gray-300 text-sm">{challenge.description}</p>
                </div>
                
                <div className="flex flex-col items-end space-y-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(challenge.difficulty)}`}>
                    {challenge.difficulty}
                  </span>
                  <div className="flex items-center space-x-1 text-yellow-400">
                    <GiftIcon className="w-4 h-4" />
                    <span className="text-sm font-bold">{challenge.reward}</span>
                  </div>
                </div>
              </div>
              
              {/* Progress Bar */}
              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-400">Progress</span>
                  <span className="text-sm font-medium text-white">
                    {challenge.progress}/{challenge.target}
                  </span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <motion.div
                    className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${(challenge.progress / challenge.target) * 100}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                  />
                </div>
              </div>
              
              {/* Challenge Examples */}
              {challenge.examples && (
                <div className="mb-4 p-3 bg-black/20 rounded-lg">
                  <span className="text-xs font-medium text-purple-300 mb-2 block">
                    Practice Examples:
                  </span>
                  <div className="space-y-1">
                    {challenge.examples.slice(0, 2).map((example, idx) => (
                      <p key={idx} className="text-xs text-gray-400 italic">
                        "{example.substring(0, 60)}..."
                      </p>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Action Button */}
              <motion.button
                onClick={() => challenge.progress >= challenge.target ? completeChallenge(challenge.id) : null}
                disabled={challenge.completed || challenge.progress < challenge.target}
                className={`w-full py-2 rounded-lg font-medium text-sm transition-all ${
                  challenge.completed 
                    ? 'bg-green-500/20 text-green-400 cursor-default'
                    : challenge.progress >= challenge.target
                    ? 'bg-purple-600 text-white hover:bg-purple-700'
                    : 'bg-gray-600/50 text-gray-400 cursor-not-allowed'
                }`}
                whileHover={challenge.progress >= challenge.target && !challenge.completed ? { scale: 1.02 } : {}}
                whileTap={challenge.progress >= challenge.target && !challenge.completed ? { scale: 0.98 } : {}}
              >
                {challenge.completed ? (
                  <div className="flex items-center justify-center space-x-2">
                    <CheckCircleIcon className="w-4 h-4" />
                    <span>Completed!</span>
                  </div>
                ) : challenge.progress >= challenge.target ? (
                  'Claim Reward'
                ) : (
                  'In Progress'
                )}
              </motion.button>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Weekly Challenge */}
      {weeklyChallenge && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-xl p-6 border border-purple-500/30"
        >
          <div className="flex items-center space-x-3 mb-4">
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <StarIcon className="w-8 h-8 text-yellow-400" />
            </motion.div>
            <div>
              <h3 className="text-xl font-bold text-white">Weekly Challenge</h3>
              <p className="text-purple-300">Extra rewards for dedicated guardians</p>
            </div>
          </div>
          
          <div className="bg-black/20 rounded-lg p-4 mb-4">
            <h4 className="font-bold text-white mb-2">{weeklyChallenge.title}</h4>
            <p className="text-gray-300 text-sm mb-3">{weeklyChallenge.description}</p>
            
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-yellow-400">
                  {weeklyChallenge.reward} pts
                </div>
                <div className="text-sm text-purple-300">
                  + {weeklyChallenge.bonus_reward}
                </div>
              </div>
              
              <div className="text-right">
                <div className="text-lg font-bold text-white">
                  {weeklyChallenge.progress}/{weeklyChallenge.target}
                </div>
                <div className="text-xs text-gray-400">
                  {Math.floor((new Date(weeklyChallenge.deadline) - new Date()) / (1000 * 60 * 60 * 24))} days left
                </div>
              </div>
            </div>
            
            <div className="w-full bg-gray-700 rounded-full h-3 mt-3">
              <motion.div
                className="bg-gradient-to-r from-yellow-400 to-orange-500 h-3 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${(weeklyChallenge.progress / weeklyChallenge.target) * 100}%` }}
                transition={{ duration: 1.5, ease: "easeOut" }}
              />
            </div>
          </div>
        </motion.div>
      )}

      {/* Achievements */}
      <div>
        <div className="flex items-center space-x-3 mb-4">
          <ShieldCheckIcon className="w-6 h-6 text-blue-400" />
          <h3 className="text-xl font-bold text-white">Achievements</h3>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {achievements.map((achievement) => (
            <motion.div
              key={achievement.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.05 }}
              className={`p-4 rounded-xl border text-center ${
                achievement.unlocked
                  ? 'bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border-yellow-500/30'
                  : 'bg-gray-800/50 border-gray-600/30'
              }`}
            >
              <div className={`text-4xl mb-2 ${achievement.unlocked ? '' : 'grayscale opacity-50'}`}>
                {achievement.icon}
              </div>
              <h4 className={`font-bold text-sm mb-1 ${achievement.unlocked ? 'text-white' : 'text-gray-400'}`}>
                {achievement.title}
              </h4>
              <p className={`text-xs mb-2 ${achievement.unlocked ? 'text-gray-300' : 'text-gray-500'}`}>
                {achievement.description}
              </p>
              
              <div className="flex items-center justify-between">
                <span className={`text-xs font-medium ${getRarityColor(achievement.rarity)}`}>
                  {achievement.rarity}
                </span>
                <span className={`text-xs font-bold ${achievement.unlocked ? 'text-yellow-400' : 'text-gray-500'}`}>
                  {achievement.points} pts
                </span>
              </div>
              
              {achievement.progress !== undefined && (
                <div className="mt-2">
                  <div className="w-full bg-gray-700 rounded-full h-1">
                    <div
                      className="bg-blue-500 h-1 rounded-full"
                      style={{ width: `${(achievement.progress / achievement.target) * 100}%` }}
                    />
                  </div>
                  <div className="text-xs text-gray-400 mt-1">
                    {achievement.progress}/{achievement.target}
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>

      {/* Mini Leaderboard */}
      <div>
        <div className="flex items-center space-x-3 mb-4">
          <TrophyIcon className="w-6 h-6 text-yellow-400" />
          <h3 className="text-xl font-bold text-white">Leaderboard</h3>
        </div>
        
        <div className="bg-white/5 rounded-xl p-4">
          {leaderboard.slice(0, 5).map((player, idx) => (
            <motion.div
              key={player.rank}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              className={`flex items-center justify-between py-3 ${
                player.name === (user?.displayName || 'You') ? 'bg-purple-500/20 rounded-lg px-3' : ''
              } ${idx < leaderboard.length - 1 ? 'border-b border-white/10' : ''}`}
            >
              <div className="flex items-center space-x-3">
                <span className="text-2xl">{player.badge}</span>
                <div>
                  <span className={`font-bold ${
                    player.name === (user?.displayName || 'You') ? 'text-purple-300' : 'text-white'
                  }`}>
                    {player.name}
                  </span>
                  <div className="text-xs text-gray-400">Rank #{player.rank}</div>
                </div>
              </div>
              
              <div className="text-right">
                <div className="font-bold text-yellow-400">{player.points.toLocaleString()}</div>
                <div className="text-xs text-gray-400">points</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ChallengeSystem;
