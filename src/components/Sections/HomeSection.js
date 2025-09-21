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
  MicrophoneIcon
} from '@heroicons/react/24/outline';
import Card, { MetricCard, GradientCard, ClickableCard } from '../UI/Card';
import LoadingSpinner from '../UI/LoadingSpinner';

const HomeSection = ({ user, userStats, onUpdateStats, setCurrentSection, theme }) => {
  const [realTimeData, setRealTimeData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [quickActions, setQuickActions] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [personalizedInsights, setPersonalizedInsights] = useState([]);
  const [liveGlobalStats, setLiveGlobalStats] = useState({
    globalThreats: 47823,
    activeUsers: 12847,
    threatsBlocked: 89234,
    accuracyRate: 94.8
  });
// Simple notification function instead of useNotification hook
const showNotification = (message, type = 'info') => {
  console.log(`${type.toUpperCase()}: ${message}`);
  // You can replace this with a simple alert or toast later
  if (type === 'error') {
    alert(`Error: ${message}`);
  }
};


  useEffect(() => {
    initializeDashboard();
    
    // Live global stats updates
    const globalStatsInterval = setInterval(() => {
      setLiveGlobalStats(prev => ({
        ...prev,
        globalThreats: prev.globalThreats + Math.floor(Math.random() * 10),
        activeUsers: prev.activeUsers + Math.floor(Math.random() * 5),
        threatsBlocked: prev.threatsBlocked + Math.floor(Math.random() * 15),
        accuracyRate: Math.min(prev.accuracyRate + (Math.random() - 0.5) * 0.1, 99.9)
      }));
    }, 10000);

    return () => clearInterval(globalStatsInterval);
  }, [user]);

  const initializeDashboard = async () => {
    try {
      setIsLoading(true);
      
      // Initialize personalized insights
      setPersonalizedInsights([
        {
          id: 1,
          type: 'urgent',
          title: 'New Phishing Campaign Detected',
          description: 'Banking phishing emails targeting your region. Stay vigilant for suspicious messages.',
          action: 'Learn More',
          icon: ExclamationTriangleIcon,
          color: 'red',
          actionHandler: () => setCurrentSection('education')
        },
        {
          id: 2,
          type: 'achievement',
          title: 'Security Milestone Reached!',
          description: `You've successfully analyzed ${userStats?.totalAnalyses || 0}+ threats. You're making the internet safer!`,
          action: 'View Badge',
          icon: TrophyIcon,
          color: 'yellow',
          actionHandler: () => showNotification('🏆 Achievement system coming soon!', 'info')
        },
        {
          id: 3,
          type: 'recommendation',
          title: 'Recommended: Voice Commands',
          description: 'Try our new voice-activated security analysis. Just say "Xist scan URL".',
          action: 'Try Now',
          icon: BoltIcon,
          color: 'purple',
          actionHandler: () => activateVoiceControl()
        },
        {
          id: 4,
          type: 'education',
          title: 'Security Training Available',
          description: 'Complete interactive scenarios to improve your cybersecurity knowledge.',
          action: 'Start Learning',
          icon: BookOpenIcon,
          color: 'green',
          actionHandler: () => setCurrentSection('training')
        }
      ]);
      
      // Initialize quick actions
setQuickActions([
  {
    id: 'verify',
    title: 'Quick Analysis',
    description: 'Analyze suspicious content instantly',
    icon: ShieldCheckIcon,
    gradient: 'from-purple-500 to-indigo-600',
    stats: `${userStats?.totalAnalyses || 0} completed`,
    action: () => setCurrentSection('verify')
  },
  {
    id: 'voice',
    title: 'Voice Commands',
    description: 'Use voice to control security analysis',
    icon: MicrophoneIcon, // Changed from BoltIcon to MicrophoneIcon
    gradient: 'from-blue-500 to-purple-600',
    stats: 'Say "Xist help" to start',
    action: () => activateVoiceControl()
  },
  {
    id: 'training',
    title: 'Security Training',
    description: 'Master cybersecurity skills',
    icon: BookOpenIcon,
    gradient: 'from-green-500 to-emerald-600',
    stats: '15 courses available',
    action: () => setCurrentSection('education') // Changed from 'training' to 'education'
  },
  {
    id: 'analytics',
    title: 'Analytics Dashboard',
    description: 'View your security metrics',
    icon: ChartBarIcon,
    gradient: 'from-orange-500 to-red-600',
    stats: 'Real-time insights',
    action: () => setCurrentSection('analytics')
  },
  {
    id: 'community',
    title: 'Community Hub',
    description: 'Share experiences & get help',
    icon: UserGroupIcon,
    gradient: 'from-pink-500 to-rose-600',
    stats: 'Join 12K+ members',
    action: () => setCurrentSection('community')
  },
  {
    id: 'scanner',
    title: 'Advanced Scanner',
    description: 'Deep scan files and URLs',
    icon: EyeIcon,
    gradient: 'from-cyan-500 to-blue-600',
    stats: 'Pro features',
    action: () => setCurrentSection('verify') // Changed to verify section for now
  }
]);


      // Initialize recent activity
      setRecentActivity([
        {
          id: 1,
          type: 'scan',
          title: 'URL Analysis Completed',
          description: 'Analyzed suspicious link - Phishing detected',
          timestamp: new Date(Date.now() - 5 * 60 * 1000),
          status: 'warning',
          icon: ShieldCheckIcon
        },
        {
          id: 2,
          type: 'threat',
          title: 'Threat Blocked Successfully',
          description: 'Investment scam email intercepted',
          timestamp: new Date(Date.now() - 30 * 60 * 1000),
          status: 'success',
          icon: ExclamationTriangleIcon
        },
        {
          id: 3,
          type: 'training',
          title: 'Training Module Completed',
          description: 'Finished "Social Engineering Defense"',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
          status: 'success',
          icon: BookOpenIcon
        },
        {
          id: 4,
          type: 'community',
          title: 'Community Contribution',
          description: 'Shared threat report - 15 upvotes',
          timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
          status: 'info',
          icon: UserGroupIcon
        }
      ]);
      
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
        showNotification('🎤 Voice commands activated! Say "Xist help" to get started.', 'success');
        // Navigate to verify section with voice input ready
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
      
      {/* Enhanced Hero Section */}
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
            {user ? `Welcome back, ${user.displayName?.split(' ')[0] || 'Guardian'}!` : 'Welcome to Xist AI'}
          </h1>
          
          <p className="text-xl md:text-2xl opacity-95 mb-3 font-light text-cyan-100">
            Illuminating the Truth in Everything That Exists
          </p>
          
          <p className="text-base md:text-lg opacity-80 mb-8 text-purple-200 max-w-3xl mx-auto">
            Real-time threat detection • Community intelligence • Advanced analytics • 24/7 protection
          </p>
          
          {/* Live Global Stats */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-gray-300 mb-8">
            <span className="flex items-center">
              <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
              <GlobeAltIcon className="w-4 h-4 mr-1" />
              {liveGlobalStats.globalThreats.toLocaleString()} Global Threats
            </span>
            <span className="flex items-center">
              <div className="w-2 h-2 bg-blue-400 rounded-full mr-2 animate-pulse"></div>
              <UserGroupIcon className="w-4 h-4 mr-1" />
              {liveGlobalStats.activeUsers.toLocaleString()} Active Users
            </span>
            <span className="flex items-center">
              <div className="w-2 h-2 bg-red-400 rounded-full mr-2 animate-pulse"></div>
              <ShieldCheckIcon className="w-4 h-4 mr-1" />
              {liveGlobalStats.threatsBlocked.toLocaleString()} Threats Blocked
            </span>
            <span className="flex items-center">
              <div className="w-2 h-2 bg-yellow-400 rounded-full mr-2 animate-pulse"></div>
              <CpuChipIcon className="w-4 h-4 mr-1" />
              {liveGlobalStats.accuracyRate.toFixed(1)}% AI Accuracy
            </span>
          </div>

          {/* User Protection Status */}
          {user && (
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 max-w-2xl mx-auto">
              <h3 className="text-lg font-semibold mb-4">Your Protection Status</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-cyan-300">{userStats?.totalAnalyses || 0}</div>
                  <div className="text-xs text-gray-300">Analyses</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-300">{userStats?.threatsStopped || 0}</div>
                  <div className="text-xs text-gray-300">Threats Stopped</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-300">{userStats?.communityPoints || 0}</div>
                  <div className="text-xs text-gray-300">Points</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-300">{userStats?.securityScore || 95}</div>
                  <div className="text-xs text-gray-300">Security Score</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </motion.div>

      {/* Real-time Metrics Dashboard */}
      {user && userStats && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
            <ChartBarIcon className="w-6 h-6 mr-2" />
            Security Metrics
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <MetricCard
              title="Total Analyses"
              value={userStats.totalAnalyses || 0}
              change={`+${Math.floor(Math.random() * 10) + 1} this week`}
              icon={ShieldCheckIcon}
              trend="up"
            />
            <MetricCard
              title="Threats Detected"
              value={userStats.threatsDetected || 0}
              change={`${userStats.threatsDetected || 0 > 5 ? 'High activity' : 'Normal levels'}`}
              icon={ExclamationTriangleIcon}
              trend={userStats.threatsDetected > 10 ? 'up' : 'neutral'}
            />
            <MetricCard
              title="Success Rate"
              value={`${userStats.successRate || 98}%`}
              change="Excellent performance"
              icon={SparklesIcon}
              trend="up"
            />
            <MetricCard
              title="Community Rank"
              value={`#${Math.floor(Math.random() * 100) + 1}`}
              change="Rising"
              icon={TrophyIcon}
              trend="up"
            />
          </div>
        </motion.div>
      )}

      {/* Personalized Insights */}
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
                insight.color === 'yellow' ? 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20' :
                insight.color === 'purple' ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20' :
                'border-green-500 bg-green-50 dark:bg-green-900/20'
              }`}>
                <div className="flex items-start space-x-4">
                  <div className={`p-2 rounded-lg ${
                    insight.color === 'red' ? 'bg-red-100 dark:bg-red-800' :
                    insight.color === 'yellow' ? 'bg-yellow-100 dark:bg-yellow-800' :
                    insight.color === 'purple' ? 'bg-purple-100 dark:bg-purple-800' :
                    'bg-green-100 dark:bg-green-800'
                  }`}>
                    <IconComponent className={`w-5 h-5 ${
                      insight.color === 'red' ? 'text-red-600 dark:text-red-300' :
                      insight.color === 'yellow' ? 'text-yellow-600 dark:text-yellow-300' :
                      insight.color === 'purple' ? 'text-purple-600 dark:text-purple-300' :
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

      {/* Quick Actions Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Quick Actions</h2>
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

      {/* Recent Activity */}
      {user && (
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

      {/* Quick Start Guide for New Users */}
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
              Join thousands of users protecting themselves from misinformation and digital threats. 
              Start analyzing suspicious content instantly with our advanced AI technology.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                onClick={() => setCurrentSection('verify')}
                className="bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors flex items-center justify-center"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <ShieldCheckIcon className="w-5 h-5 mr-2" />
                Start Free Analysis
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
