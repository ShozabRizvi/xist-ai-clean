import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

import {
  ShieldCheckIcon,
  ExclamationTriangleIcon,
  ChartBarIcon,
  GlobeAltIcon,
  UserGroupIcon,
  BookOpenIcon,
  PlayIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  EyeIcon,
  BoltIcon,
  SparklesIcon,
  ClockIcon,
  TrophyIcon,
  BellAlertIcon,
  CpuChipIcon,
  HomeIcon,
  FireIcon,
  MicrophoneIcon,
  PhoneIcon
} from '@heroicons/react/24/outline';
import Card, { MetricCard, GradientCard, ClickableCard } from '../UI/Card';
import LoadingSpinner from '../UI/LoadingSpinner';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);


const HomeSection = ({ user, userStats, onUpdateStats, setCurrentSection, theme }) => {
  const [realTimeData, setRealTimeData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [quickActions, setQuickActions] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [personalizedInsights, setPersonalizedInsights] = useState([]);
  
  
  const [liveGlobalStats, setLiveGlobalStats] = useState({
    globalThreats: 0,      
    activeUsers: 1,        
    threatsBlocked: 0,     
    accuracyRate: 0        
  });

  
  const showNotification = (message, type = 'info') => {
    console.log(`${type.toUpperCase()}: ${message}`);
    if (type === 'error') {
      alert(`Error: ${message}`);
    }
  };

  useEffect(() => {
  initializeDashboard();
  
  // Realtime listener for community_posts (new analyses)
  const setupRealtimeListener = async () => {
    if (!user) return;
    
    const channel = supabase
      .channel('community_posts_realtime')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'community_posts',
          filter: `user_id=eq.${user.id}`
        },
        (payload) => {
          console.log('[HomeSection] New analysis detected:', payload);
          // Update stats immediately
          setLiveGlobalStats(prev => ({
            ...prev,
            globalThreats: prev.globalThreats + 1,
            threatsBlocked: prev.threatsBlocked + 1
          }));
          
          // Add to recent activity
          setRecentActivity(prev => [{
            id: Date.now(),
            type: 'analysis',
            title: 'New Analysis Completed',
            description: payload.new.content?.substring(0, 100) || 'Threat analysis completed',
            timestamp: new Date(),
            status: 'success',
            icon: ShieldCheckIcon
          }, ...prev.slice(0, 4)]);
          
          // Call parent update
          if (onUpdateStats) {
            onUpdateStats({
              ...userStats,
              totalAnalyses: (userStats?.totalAnalyses || 0) + 1,
              lastAnalysis: new Date().toISOString()
            });
          }
        }
      )
      .subscribe();
      
    return () => {
      channel.unsubscribe();
    };
  };
  
  setupRealtimeListener();
}, [user, userStats, onUpdateStats]);


  const initializeDashboard = async () => {
    try {
      setIsLoading(true);
      
      
      setLiveGlobalStats({
        globalThreats: userStats?.threatsDetected || 0,
        activeUsers: user ? 1 : 0, 
        threatsBlocked: userStats?.threatsStopped || userStats?.threatsDetected || 0,
        accuracyRate: userStats?.successRate || 0
      });
      
      
      const insights = [];
      
      if (user && userStats?.totalAnalyses > 0) {
        insights.push({
          id: 1,
          type: 'achievement',
          title: 'Your Security Contribution',
          description: `You've completed ${userStats.totalAnalyses} threat analyses, contributing to digital security.`,
          action: 'View Details',
          icon: TrophyIcon,
          color: 'green',
          actionHandler: () => setCurrentSection('analytics')
        });
      }

      if (userStats?.threatsDetected > 0) {
        insights.push({
          id: 2,
          type: 'security',
          title: 'Threats You\'ve Identified',
          description: `You've successfully identified ${userStats.threatsDetected} potential threats through analysis.`,
          action: 'Review',
          icon: ExclamationTriangleIcon,
          color: 'orange',
          actionHandler: () => setCurrentSection('analytics')
        });
      }

      
      if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        insights.push({
          id: 3,
          type: 'feature',
          title: 'Voice Commands Available',
          description: 'Your device supports voice-activated security analysis.',
          action: 'Try Voice',
          icon: MicrophoneIcon,
          color: 'purple',
          actionHandler: () => activateVoiceControl()
        });
      }

      
      insights.push({
        id: 4,
        type: 'education',
        title: 'Security Education',
        description: 'Learn cybersecurity fundamentals and threat identification techniques.',
        action: 'Start Learning',
        icon: BookOpenIcon,
        color: 'blue',
        actionHandler: () => setCurrentSection('education')
      });

      setPersonalizedInsights(insights);
      
      
      
setQuickActions([
  {
    id: 'verify',
    title: 'Threat Analysis',
    description: 'Analyze suspicious content',
    icon: ShieldCheckIcon,
    gradient: 'from-purple-500 to-indigo-600',
    stats: userStats?.totalAnalyses > 0 ? `${userStats.totalAnalyses} completed` : 'Start analyzing',
    action: () => {
      setCurrentSection('verify');
      
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  },
  {
    id: 'protection',
    title: 'Emergency Help',
    description: 'Access emergency helplines',
    icon: PhoneIcon,
    gradient: 'from-red-500 to-pink-600',
    stats: 'Global emergency database',
    action: () => {
      setCurrentSection('protection');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  },
  {
    id: 'community',
    title: 'Community Hub',
    description: 'Share experiences & get help',
    icon: UserGroupIcon,
    gradient: 'from-green-500 to-emerald-600',
    stats: 'Connect with community',
    action: () => {
      setCurrentSection('community');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  },
  {
    id: 'education',
    title: 'Security Education',
    description: 'Learn cybersecurity skills',
    icon: BookOpenIcon,
    gradient: 'from-orange-500 to-red-600',
    stats: 'Educational resources',
    action: () => {
      setCurrentSection('education');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  },
  {
    id: 'analytics',
    title: 'Your Analytics',
    description: 'View your security metrics',
    icon: ChartBarIcon,
    gradient: 'from-blue-500 to-cyan-600',
    stats: user ? 'Personal insights' : 'Login to view',
    action: () => {
      setCurrentSection('analytics');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }
]);


      
      const activities = [];
      
      if (userStats?.lastAnalysis) {
        activities.push({
          id: 1,
          type: 'analysis',
          title: 'Recent Analysis',
          description: 'Last threat analysis completed',
          timestamp: new Date(userStats.lastAnalysis),
          status: 'success',
          icon: ShieldCheckIcon
        });
      }

      if (userStats?.totalAnalyses > 0) {
        activities.push({
          id: 2,
          type: 'milestone',
          title: 'Analysis Milestone',
          description: `Completed ${userStats.totalAnalyses} security analyses`,
          timestamp: new Date(),
          status: 'info',
          icon: TrophyIcon
        });
      }

      
      if (user && user.metadata?.creationTime) {
        const joinDate = new Date(user.metadata.creationTime);
        const daysSinceJoin = Math.floor((new Date() - joinDate) / (1000 * 60 * 60 * 24));
        
        if (daysSinceJoin <= 7) {
          activities.push({
            id: 3,
            type: 'welcome',
            title: 'Welcome to Xist AI',
            description: 'Account created and security protection activated',
            timestamp: joinDate,
            status: 'success',
            icon: SparklesIcon
          });
        }
      }

      setRecentActivity(activities);
      
    } catch (error) {
      console.error('Dashboard initialization error:', error);
      showNotification('Failed to load dashboard data', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const activateVoiceControl = async () => {
    try {
      if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        showNotification('🎤 Voice commands activated! Try saying "analyze this content".', 'success');
        setCurrentSection('verify');
      } else {
        showNotification('Voice control not available on this device', 'warning');
      }
    } catch (error) {
      showNotification('Failed to activate voice control', 'error');
    }
  };

  const getTrendIcon = (trend) => {
    if (trend > 0) return <ArrowTrendingUpIcon className="w-4 h-4 text-green-500" />;
    if (trend < 0) return <ArrowTrendingDownIcon className="w-4 h-4 text-red-500" />;
    return <div className="w-4 h-4" />;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'success': return 'text-green-600 bg-green-100 dark:bg-green-900/20';
      case 'warning': return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20';
      case 'error': return 'text-red-600 bg-red-100 dark:bg-red-900/20';
      case 'info': return 'text-blue-600 bg-blue-100 dark:bg-blue-900/20';
      default: return 'text-gray-600 bg-gray-100 dark:bg-gray-700';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <LoadingSpinner size="lg" text="Loading your security dashboard..." />
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      
      {}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white text-center p-8 md:p-12 rounded-2xl"
      >
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-1/4 left-1/4 w-48 h-48 md:w-72 md:h-72 bg-cyan-400 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
          <div className="absolute top-3/4 right-1/4 w-48 h-48 md:w-72 md:h-72 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl animate-pulse" style={{animationDelay: '2s'}}></div>
        </div>
        
        <div className="relative z-10">
          <div className="w-20 h-20 mx-auto mb-6 rounded-2xl flex items-center justify-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", duration: 0.8 }}
              className="relative inline-block"
            >
              <img
                src="/logo.png"
                alt="Xist AI Network Protection"
                className="w-full h-full object-contain"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextElementSibling.style.display = 'flex';
                }}
              />
            </motion.div>
            <div className="w-20 h-20 bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-600 rounded-2xl hidden items-center justify-center shadow-lg">
              <SparklesIcon className="w-12 h-12 text-white" />
            </div>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white via-cyan-200 to-purple-200">
            {user ? `Welcome back, ${user.displayName?.split(' ')[0] || 'User'}!` : 'Welcome to Xist AI'}
          </h1>
          
          <p className="text-xl md:text-2xl opacity-95 mb-3 font-light text-cyan-100">
            Illuminating the Truth in Everything That Exists
          </p>
          
          <p className="text-base md:text-lg opacity-80 mb-8 text-purple-200 max-w-3xl mx-auto">
            Real-time threat detection • Emergency helplines • 24/7 protection • Security education • Advanced analytics • Community support
          </p>
          
          {}
          {(liveGlobalStats.globalThreats > 0 || liveGlobalStats.threatsBlocked > 0 || user) && (
            <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-gray-300 mb-8">
              {liveGlobalStats.threatsBlocked > 0 && (
                <span className="flex items-center">
                  <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
                  <ShieldCheckIcon className="w-4 h-4 mr-1" />
                  {liveGlobalStats.threatsBlocked} Threats Detected
                </span>
              )}
              {user && (
                <span className="flex items-center">
                  <div className="w-2 h-2 bg-blue-400 rounded-full mr-2 animate-pulse"></div>
                  <UserGroupIcon className="w-4 h-4 mr-1" />
                  Active Protection Enabled
                </span>
              )}
              {liveGlobalStats.accuracyRate > 0 && (
                <span className="flex items-center">
                  <div className="w-2 h-2 bg-purple-400 rounded-full mr-2 animate-pulse"></div>
                  <CpuChipIcon className="w-4 h-4 mr-1" />
                  {liveGlobalStats.accuracyRate.toFixed(1)}% Success Rate
                </span>
              )}
            </div>
          )}

          {}
          {user && userStats && (
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 max-w-2xl mx-auto">
              <h3 className="text-lg font-semibold mb-4">Your Protection Status</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-cyan-300">{userStats.totalAnalyses || 0}</div>
                  <div className="text-xs text-gray-300">Analyses</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-300">{userStats.threatsDetected || 0}</div>
                  <div className="text-xs text-gray-300">Threats Found</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-300">{userStats.communityPoints || 0}</div>
                  <div className="text-xs text-gray-300">Points</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-300">{userStats.successRate || 0}%</div>
                  <div className="text-xs text-gray-300">Success Rate</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </motion.div>

      {}
      {user && userStats && userStats.totalAnalyses > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
            <ChartBarIcon className="w-6 h-6 mr-2" />
            Your Security Metrics
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <MetricCard
              title="Total Analyses"
              value={userStats.totalAnalyses}
              change={userStats.totalAnalyses > 1 ? "Active user" : "Getting started"}
              icon={ShieldCheckIcon}
              trend="up"
            />
            <MetricCard
              title="Threats Detected"
              value={userStats.threatsDetected || 0}
              change={userStats.threatsDetected > 0 ? "Threats found" : "Clean so far"}
              icon={ExclamationTriangleIcon}
              trend={userStats.threatsDetected > 0 ? 'up' : 'neutral'}
            />
            <MetricCard
              title="Success Rate"
              value={`${userStats.successRate || 0}%`}
              change={userStats.successRate > 80 ? "Excellent" : "Building history"}
              icon={SparklesIcon}
              trend={userStats.successRate > 80 ? "up" : "neutral"}
            />
            <MetricCard
              title="Community Points"
              value={userStats.communityPoints || 0}
              change={userStats.communityPoints > 0 ? "Contributing" : "Join community"}
              icon={TrophyIcon}
              trend={userStats.communityPoints > 0 ? "up" : "neutral"}
            />
          </div>
        </motion.div>
      )}

      {}
      {personalizedInsights.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
            <BellAlertIcon className="w-6 h-6 mr-2" />
            Personalized Security Insights
          </h2>
          <div className="space-y-4">
            {personalizedInsights.map((insight) => {
              const IconComponent = insight.icon;
              return (
                <Card key={insight.id} className={`p-4 border-l-4 ${
                  insight.color === 'red' ? 'border-red-500 bg-red-50 dark:bg-red-900/20' :
                  insight.color === 'orange' ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20' :
                  insight.color === 'purple' ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20' :
                  insight.color === 'blue' ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' :
                  'border-green-500 bg-green-50 dark:bg-green-900/20'
                }`}>
                  <div className="flex items-start space-x-4">
                    <div className={`p-2 rounded-lg ${
                      insight.color === 'red' ? 'bg-red-100 dark:bg-red-800' :
                      insight.color === 'orange' ? 'bg-orange-100 dark:bg-orange-800' :
                      insight.color === 'purple' ? 'bg-purple-100 dark:bg-purple-800' :
                      insight.color === 'blue' ? 'bg-blue-100 dark:bg-blue-800' :
                      'bg-green-100 dark:bg-green-800'
                    }`}>
                      <IconComponent className={`w-5 h-5 ${
                        insight.color === 'red' ? 'text-red-600 dark:text-red-300' :
                        insight.color === 'orange' ? 'text-orange-600 dark:text-orange-300' :
                        insight.color === 'purple' ? 'text-purple-600 dark:text-purple-300' :
                        insight.color === 'blue' ? 'text-blue-600 dark:text-blue-300' :
                        'text-green-600 dark:text-green-300'
                      }`} />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-1">{insight.title}</h3>
                      <p className="text-gray-600 dark:text-gray-300 text-sm mb-3">{insight.description}</p>
                      <motion.button
                        onClick={insight.actionHandler}
                        className="text-sm font-medium px-3 py-1 rounded-lg transition-colors hover:bg-white dark:hover:bg-gray-700 border border-gray-300 dark:border-gray-600"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        {insight.action}
                      </motion.button>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </motion.div>
      )}

      {}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Essential Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {quickActions.map((action) => {
            const IconComponent = action.icon;
            return (
              <motion.button
                key={action.id}
                onClick={action.action}
                className={`group relative p-6 rounded-2xl text-white font-bold text-left shadow-2xl transform hover:scale-105 active:scale-95 transition-all duration-500 bg-gradient-to-br ${action.gradient} hover:shadow-xl cursor-pointer`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"></div>
                <div className="relative z-10">
                  <IconComponent className="w-12 h-12 mb-4 transform group-hover:scale-110 transition-transform duration-300" />
                  <h3 className="text-xl font-bold mb-2">{action.title}</h3>
                  <p className="text-sm opacity-90 mb-3">{action.description}</p>
                  <div className="text-xs opacity-75">{action.stats}</div>
                </div>
              </motion.button>
            );
          })}
        </div>
      </motion.div>

      {}
      {user && recentActivity.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <ClockIcon className="w-5 h-5 mr-2" />
              Recent Activity
            </h3>
            <div className="space-y-3">
              {recentActivity.map((activity) => {
                const IconComponent = activity.icon;
                return (
                  <motion.div
                    key={activity.id}
                    className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    whileHover={{ x: 5 }}
                  >
                    <div className={`p-2 rounded-lg ${getStatusColor(activity.status)}`}>
                      <IconComponent className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{activity.title}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {activity.description} • {activity.timestamp.toLocaleTimeString()}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </Card>
        </motion.div>
      )}

      {}
      {!user && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <GradientCard className="p-8 text-center">
            <SparklesIcon className="w-16 h-16 mx-auto mb-4 text-purple-600" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Get Started with Xist AI
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-2xl mx-auto">
              Start protecting yourself from misinformation and digital threats. 
              Analyze suspicious content with our AI-powered security platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                onClick={() => setCurrentSection('verify')}
                className="bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors flex items-center justify-center"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <ShieldCheckIcon className="w-5 h-5 mr-2" />
                Start Analysis
              </motion.button>
              <motion.button
                onClick={() => setCurrentSection('education')}
                className="border border-purple-600 text-purple-600 px-6 py-3 rounded-lg font-semibold hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors flex items-center justify-center"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <BookOpenIcon className="w-5 h-5 mr-2" />
                Learn Security
              </motion.button>
            </div>
          </GradientCard>
        </motion.div>
      )}
    </div>
  );
};

export default HomeSection;
