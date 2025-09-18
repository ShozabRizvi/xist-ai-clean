import React, { useState, useEffect } from 'react';
import { TrophyIcon, StarIcon, ShieldCheckIcon, FireIcon, ChevronUpIcon, ChevronDownIcon } from '@heroicons/react/24/outline';
import { TrophyIcon as TrophyIconSolid } from '@heroicons/react/24/solid';

const Leaderboard = ({ user }) => {
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [timeframe, setTimeframe] = useState('all');
  const [category, setCategory] = useState('overall');
  const [userRank, setUserRank] = useState(null);

  // Enhanced mock leaderboard with more realistic data
  const mockLeaderboard = [
    {
      rank: 1,
      userId: 'user1',
      name: 'Dr. Sarah Chen',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b25ad2be?w=50&h=50&fit=crop&crop=face',
      score: 2847,
      accuracy: 98.5,
      contributions: 1247,
      verified: true,
      badges: ['Expert', 'Top Contributor', 'Fact Checker', 'AI Specialist'],
      level: 'Diamond',
      streak: 45,
      specialization: 'Cybersecurity Research',
      joinDate: '2024-01-15',
      lastActive: 'Online now'
    },
    {
      rank: 2,
      userId: 'user2',
      name: 'Mike Rodriguez',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop&crop=face',
      score: 2156,
      accuracy: 97.2,
      contributions: 892,
      verified: true,
      badges: ['Fraud Specialist', 'Community Leader', 'Mentor'],
      level: 'Gold',
      streak: 32,
      specialization: 'Fraud Investigation',
      joinDate: '2024-02-20',
      lastActive: '2 hours ago'
    },
    {
      rank: 3,
      userId: 'user3',
      name: 'Elena Vasquez',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=50&h=50&fit=crop&crop=face',
      score: 1923,
      accuracy: 96.8,
      contributions: 734,
      verified: true,
      badges: ['Health Expert', 'Researcher', 'Verified'],
      level: 'Gold',
      streak: 28,
      specialization: 'Medical Misinformation',
      joinDate: '2024-03-10',
      lastActive: 'Online now'
    },
    {
      rank: 4,
      userId: 'user4',
      name: 'James Wilson',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop&crop=face',
      score: 1654,
      accuracy: 94.3,
      contributions: 567,
      verified: false,
      badges: ['Rising Star', 'Dedicated'],
      level: 'Silver',
      streak: 15,
      specialization: 'Political Fact-Checking',
      joinDate: '2024-04-05',
      lastActive: '1 day ago'
    },
    {
      rank: 5,
      userId: 'user5',
      name: 'Aisha Patel',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=50&h=50&fit=crop&crop=face',
      score: 1432,
      accuracy: 93.7,
      contributions: 445,
      verified: false,
      badges: ['Tech Expert', 'Contributor'],
      level: 'Silver',
      streak: 12,
      specialization: 'Technology Claims',
      joinDate: '2024-05-12',
      lastActive: '3 hours ago'
    },
    // Add current user if logged in
    ...(user ? [{
      rank: 15,
      userId: user.uid,
      name: user.displayName || 'You',
      avatar: user.photoURL || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=50&h=50&fit=crop&crop=face',
      score: 456,
      accuracy: 89.3,
      contributions: 23,
      verified: false,
      badges: ['New Member', 'Rising Star'],
      level: 'Bronze',
      streak: 7,
      specialization: 'General Analysis',
      joinDate: '2024-09-01',
      lastActive: 'Online now',
      isCurrentUser: true
    }] : [])
  ];

  useEffect(() => {
    let filteredData = [...mockLeaderboard];
    
    // Filter by timeframe
    if (timeframe === 'month') {
      filteredData = filteredData.map(item => ({
        ...item,
        score: Math.floor(item.score * 0.3),
        contributions: Math.floor(item.contributions * 0.15)
      }));
    } else if (timeframe === 'week') {
      filteredData = filteredData.map(item => ({
        ...item,
        score: Math.floor(item.score * 0.1),
        contributions: Math.floor(item.contributions * 0.05)
      }));
    }
    
    // Sort by category
    if (category === 'accuracy') {
      filteredData.sort((a, b) => b.accuracy - a.accuracy);
    } else if (category === 'contributions') {
      filteredData.sort((a, b) => b.contributions - a.contributions);
    } else {
      filteredData.sort((a, b) => b.score - a.score);
    }
    
    // Update ranks
    filteredData = filteredData.map((item, index) => ({ 
      ...item, 
      rank: index + 1,
      previousRank: item.rank
    }));
    
    setLeaderboardData(filteredData);
    
    // Find current user rank
    const currentUser = filteredData.find(item => item.isCurrentUser);
    setUserRank(currentUser);
  }, [timeframe, category, user]);

  const getLevelColor = (level) => {
    const colors = {
      'Diamond': 'from-blue-400 to-blue-600 text-blue-900',
      'Gold': 'from-yellow-400 to-yellow-600 text-yellow-900',
      'Silver': 'from-gray-300 to-gray-500 text-gray-900',
      'Bronze': 'from-amber-400 to-amber-600 text-amber-900'
    };
    return colors[level] || 'from-gray-400 to-gray-600 text-gray-900';
  };

  const getRankIcon = (rank, previousRank) => {
    const rankChange = previousRank ? previousRank - rank : 0;
    
    if (rank === 1) return <TrophyIconSolid className="w-6 h-6 text-yellow-500" />;
    if (rank === 2) return <TrophyIcon className="w-6 h-6 text-gray-400" />;
    if (rank === 3) return <TrophyIcon className="w-6 h-6 text-amber-600" />;
    
    return (
      <div className="flex items-center space-x-1">
        <span className="text-lg font-bold text-gray-600">#{rank}</span>
        {rankChange > 0 && <ChevronUpIcon className="w-4 h-4 text-green-500" />}
        {rankChange < 0 && <ChevronDownIcon className="w-4 h-4 text-red-500" />}
      </div>
    );
  };

  const getBadgeColor = (badge) => {
    const colors = {
      'Expert': 'bg-purple-100 text-purple-800',
      'Top Contributor': 'bg-green-100 text-green-800',
      'Fact Checker': 'bg-blue-100 text-blue-800',
      'AI Specialist': 'bg-indigo-100 text-indigo-800',
      'Fraud Specialist': 'bg-red-100 text-red-800',
      'Community Leader': 'bg-yellow-100 text-yellow-800',
      'Health Expert': 'bg-emerald-100 text-emerald-800',
      'Rising Star': 'bg-pink-100 text-pink-800'
    };
    return colors[badge] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 border border-gray-200 dark:border-gray-700">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl">
            <TrophyIcon className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Community Leaderboard
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Top fact-checkers and misinformation fighters
            </p>
          </div>
        </div>
        
        {/* Filters */}
        <div className="flex space-x-2">
          <select
            value={timeframe}
            onChange={(e) => setTimeframe(e.target.value)}
            className="px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            <option value="all">All Time</option>
            <option value="month">This Month</option>
            <option value="week">This Week</option>
          </select>
          
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            <option value="overall">Overall Score</option>
            <option value="accuracy">Accuracy</option>
            <option value="contributions">Contributions</option>
          </select>
        </div>
      </div>

      {/* Leaderboard List */}
      <div className="space-y-4">
        {leaderboardData.slice(0, 10).map((member, index) => (
          <div
            key={member.userId}
            className={`flex items-center justify-between p-4 rounded-xl border transition-all duration-200 hover:scale-[1.02] ${
              member.isCurrentUser 
                ? 'bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/30 dark:to-indigo-900/30 border-purple-200 dark:border-purple-700 shadow-lg' 
                : 'bg-gray-50 dark:bg-gray-700/50 border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700'
            } ${index < 3 ? 'shadow-lg' : 'shadow-sm'}`}
          >
            <div className="flex items-center space-x-4 flex-1">
              
              {/* Rank */}
              <div className="flex-shrink-0 w-12 flex justify-center">
                {getRankIcon(member.rank, member.previousRank)}
              </div>

              {/* Avatar & Basic Info */}
              <div className="flex items-center space-x-3 flex-1">
                <div className="relative">
                  <img
                    src={member.avatar}
                    alt={member.name}
                    className={`w-12 h-12 rounded-full border-2 ${
                      member.verified ? 'border-blue-500' : 'border-gray-300 dark:border-gray-600'
                    } shadow-md`}
                  />
                  {member.verified && (
                    <ShieldCheckIcon className="w-4 h-4 text-blue-500 absolute -bottom-1 -right-1 bg-white dark:bg-gray-800 rounded-full p-0.5" />
                  )}
                  {member.lastActive === 'Online now' && (
                    <div className="w-3 h-3 bg-green-400 rounded-full absolute -top-1 -right-1 border-2 border-white dark:border-gray-800"></div>
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2">
                    <span className={`font-semibold text-sm ${
                      member.isCurrentUser ? 'text-purple-900 dark:text-purple-200' : 'text-gray-900 dark:text-white'
                    }`}>
                      {member.name}
                    </span>
                    {member.streak > 0 && (
                      <div className="flex items-center space-x-1 bg-orange-100 dark:bg-orange-900 px-2 py-1 rounded-full">
                        <FireIcon className="w-3 h-3 text-orange-600 dark:text-orange-400" />
                        <span className="text-xs font-medium text-orange-700 dark:text-orange-300">{member.streak}</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-2 mt-1">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${getLevelColor(member.level)}`}>
                      {member.level}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">{member.specialization}</span>
                  </div>
                  
                  {/* Badges */}
                  <div className="flex flex-wrap gap-1 mt-2">
                    {member.badges.slice(0, 2).map((badge, idx) => (
                      <span key={idx} className={`px-2 py-1 rounded-full text-xs font-medium ${getBadgeColor(badge)}`}>
                        {badge}
                      </span>
                    ))}
                    {member.badges.length > 2 && (
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                        +{member.badges.length - 2}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="text-right flex-shrink-0">
              <div className="text-xl font-bold text-gray-900 dark:text-white">
                {category === 'accuracy' ? `${member.accuracy}%` :
                 category === 'contributions' ? member.contributions.toLocaleString() :
                 member.score.toLocaleString()}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                {category === 'accuracy' ? 'Accuracy Rate' :
                 category === 'contributions' ? 'Contributions' :
                 'Total Points'}
              </div>
              <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                {member.lastActive}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Current User Position (if not in top 10) */}
      {user && userRank && userRank.rank > 10 && (
        <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="text-sm text-gray-500 dark:text-gray-400 mb-3 text-center">Your Position</div>
          <div className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/30 dark:to-indigo-900/30 rounded-xl border border-purple-200 dark:border-purple-700">
            <div className="flex items-center space-x-3">
              <span className="text-lg font-bold text-purple-600 dark:text-purple-400">#{userRank.rank}</span>
              <img
                src={userRank.avatar}
                alt={userRank.name}
                className="w-10 h-10 rounded-full border-2 border-purple-300 dark:border-purple-600"
              />
              <div>
                <span className="font-semibold text-purple-900 dark:text-purple-200">
                  {userRank.name}
                </span>
                <div className="text-xs text-purple-700 dark:text-purple-300">
                  {userRank.specialization}
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-lg font-bold text-purple-900 dark:text-purple-200">
                {category === 'accuracy' ? `${userRank.accuracy}%` :
                 category === 'contributions' ? userRank.contributions.toLocaleString() :
                 userRank.score.toLocaleString()}
              </div>
              <div className="text-xs text-purple-600 dark:text-purple-400">
                Keep climbing! 🚀
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Motivational Footer */}
      <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700 text-center">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          🌟 Help fight misinformation and climb the leaderboard by contributing quality fact-checks!
        </p>
      </div>
    </div>
  );
};

export default Leaderboard;
