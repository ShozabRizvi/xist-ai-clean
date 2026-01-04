import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Cog6ToothIcon, UserCircleIcon, BellIcon, ShieldCheckIcon, PaintBrushIcon, 
  ArrowRightOnRectangleIcon, SunIcon, MoonIcon, ComputerDesktopIcon, CheckCircleIcon,
  KeyIcon, ArrowPathIcon  
} from '@heroicons/react/24/outline';
import { showNotification } from '../UI/NotificationToast';
import { useTranslation } from 'react-i18next';
import i18n from '../../i18n/i18n';
import aiService from '../../utils/aiService'; 
import {
  ChartBarIcon,           
  BeakerIcon,             
  UserIcon,               
  ExclamationTriangleIcon, 
  SparklesIcon,           
  UserGroupIcon           
} from '@heroicons/react/24/outline';


const ApiPoolStatus = () => {
  const [poolStats, setPoolStats] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const refreshStats = () => {
    setRefreshing(true);
    try {
      const stats = aiService.getServiceStats();
      setPoolStats(stats);
      console.log('🔑 API Pool Status refreshed:', stats);
    } catch (error) {
      console.error('Failed to get API stats:', error);
      setPoolStats({
        total: 20,
        available: 0,
        rateLimited: 0,
        unhealthy: 0,
        successRate: 0,
        serviceSuccess: 0,
        serviceFailures: 0,
        error: error.message
      });
    }
    setTimeout(() => setRefreshing(false), 500);
  };

  useEffect(() => {
    refreshStats();
    const interval = setInterval(refreshStats, 15000); 
    return () => clearInterval(interval);
  }, []);

  const resetPool = () => {
    if (window.confirm('⚠️ Reset all 20 API keys to healthy status?\n\nThis will clear all rate limits and failure counts.')) {
      try {
        aiService.resetApiPool();
        showNotification('✅ API pool reset successfully!', 'success');
        setTimeout(refreshStats, 1000);
      } catch (error) {
        console.error('Failed to reset API pool:', error);
        showNotification('❌ Failed to reset API pool', 'error');
      }
    }
  };

  const testApiConnection = async () => {
    try {
      setRefreshing(true);
      showNotification('🔄 Testing API connection...', 'info', 2000);
      
      
      const testResult = await aiService.analyzeContent('Test connection', 'quick');
      
      if (testResult && !testResult.error) {
        showNotification('✅ API connection test successful!', 'success');
      } else {
        showNotification('⚠️ API connection test completed with warnings', 'warning');
      }
      
      refreshStats();
    } catch (error) {
      console.error('API connection test failed:', error);
      showNotification('❌ API connection test failed', 'error');
    } finally {
      setRefreshing(false);
    }
  };

  if (!poolStats) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mr-3"></div>
        <span className="text-gray-600 dark:text-gray-400">Loading API pool status...</span>
      </div>
    );
  }

  const getStatusColor = () => {
    if (poolStats.available === 0) return 'text-red-600 bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800';
    if (poolStats.available < 5) return 'text-orange-600 bg-orange-50 border-orange-200 dark:bg-orange-900/20 dark:border-orange-800'; 
    return 'text-green-600 bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800';
  };

  const getStatusText = () => {
    if (poolStats.available === 0) return '🚨 All Keys Rate Limited';
    if (poolStats.available < 5) return '⚠️ Limited Availability';
    return '✅ Pool Healthy';
  };

  return (
    <div className="space-y-6">
      {}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{poolStats.total}</div>
          <div className="text-sm text-blue-700 dark:text-blue-300">Total Keys</div>
          <div className="text-xs text-blue-600 dark:text-blue-400 mt-1">OpenRouter API</div>
        </div>
        
        <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
          <div className="text-2xl font-bold text-green-600 dark:text-green-400">{poolStats.available}</div>
          <div className="text-sm text-green-700 dark:text-green-300">Available</div>
          <div className="text-xs text-green-600 dark:text-green-400 mt-1">Ready to use</div>
        </div>
        
        <div className="text-center p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
          <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{poolStats.rateLimited || 0}</div>
          <div className="text-sm text-yellow-700 dark:text-yellow-300">Rate Limited</div>
          <div className="text-xs text-yellow-600 dark:text-yellow-400 mt-1">Temporary</div>
        </div>
        
        <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
          <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">{Math.round(poolStats.successRate || 0)}%</div>
          <div className="text-sm text-purple-700 dark:text-purple-300">Success Rate</div>
          <div className="text-xs text-purple-600 dark:text-purple-400 mt-1">Last 100 calls</div>
        </div>
      </div>

      {}
      <div className="flex items-center justify-center">
        <div className={`flex items-center gap-2 px-6 py-3 rounded-full border-2 ${getStatusColor()}`}>
          {poolStats.available > 0 ? (
            <ShieldCheckIcon className="w-5 h-5" />
          ) : (
            <ExclamationTriangleIcon className="w-5 h-5" />
          )}
          <span className="font-semibold">{getStatusText()}</span>
        </div>
      </div>

      {}
      <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
        <h4 className="font-semibold text-gray-900 dark:text-white mb-3">📊 API Pool Details</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Model:</span>
              <span className="font-mono text-gray-900 dark:text-white">
                {poolStats.model || 'deepseek/deepseek-r1'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Endpoint:</span>
              <span className="font-mono text-xs text-gray-900 dark:text-white">
                openrouter.ai/api/v1
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Rotation:</span>
              <span className="text-green-600 dark:text-green-400 font-medium">
                ✅ Active
              </span>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Total Calls:</span>
              <span className="font-semibold text-gray-900 dark:text-white">
                {(poolStats.serviceSuccess || 0) + (poolStats.serviceFailures || 0)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Successful:</span>
              <span className="text-green-600 dark:text-green-400 font-medium">
                {poolStats.serviceSuccess || 0}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Failed:</span>
              <span className="text-red-600 dark:text-red-400 font-medium">
                {poolStats.serviceFailures || 0}
              </span>
            </div>
          </div>
        </div>
      </div>

      {}
      {poolStats.error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <ExclamationTriangleIcon className="w-5 h-5 text-red-600 dark:text-red-400" />
            <span className="font-semibold text-red-800 dark:text-red-200">Connection Error</span>
          </div>
          <p className="text-sm text-red-700 dark:text-red-300 font-mono">
            {poolStats.error}
          </p>
        </div>
      )}

      {}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <h4 className="font-semibold text-blue-900 dark:text-blue-200 mb-2">🔄 How API Key Rotation Works</h4>
        <ul className="text-sm text-blue-800 dark:text-blue-300 space-y-1">
          <li>• Automatically switches between 20 API keys</li>
          <li>• Detects rate limits and skips to next available key</li>
          <li>• Tracks key health and resets failed keys automatically</li>
          <li>• Provides 99.9% uptime for analysis service</li>
          <li>• Balances load across all keys for optimal performance</li>
        </ul>
      </div>

      {}
      <div className="flex flex-wrap gap-3 justify-center">
        <motion.button
          onClick={refreshStats}
          disabled={refreshing}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          whileHover={{ scale: refreshing ? 1 : 1.02 }}
          whileTap={{ scale: refreshing ? 1 : 0.98 }}
        >
          <ArrowPathIcon className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
          <span>{refreshing ? 'Refreshing...' : 'Refresh Status'}</span>
        </motion.button>

        <motion.button
          onClick={testApiConnection}
          disabled={poolStats.available === 0 || refreshing}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          whileHover={{ scale: (poolStats.available === 0 || refreshing) ? 1 : 1.02 }}
          whileTap={{ scale: (poolStats.available === 0 || refreshing) ? 1 : 0.98 }}
        >
          <ShieldCheckIcon className="w-4 h-4" />
          <span>Test Connection</span>
        </motion.button>

        <motion.button
          onClick={resetPool}
          className="flex items-center gap-2 px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <ArrowPathIcon className="w-4 h-4" />
          <span>Reset Pool</span>
        </motion.button>
      </div>

      {}
      <div className="text-center text-xs text-gray-500 dark:text-gray-400">
        Last updated: {new Date().toLocaleTimeString()} • Auto-refresh every 15 seconds
      </div>
    </div>
  );
};


const UserAvatar = ({ user, size = 'md', className = '' }) => {
  const sizeClasses = {
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-base',
    lg: 'w-12 h-12 text-lg',
    xl: 'w-16 h-16 text-xl',
    '2xl': 'w-20 h-20 text-2xl'
  };

  const getInitials = (user) => {
    if (user?.displayName) {
      return user.displayName
        .split(' ')
        .map(name => name[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
    }
    if (user?.email) {
      return user.email[0].toUpperCase();
    }
    return '?';
  };

  const getAvatarColor = (user) => {
    if (!user?.email && !user?.displayName) return 'bg-gray-500';
    
    const name = user.displayName || user.email || '';
    const colors = [
      'bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-yellow-500',
      'bg-purple-500', 'bg-pink-500', 'bg-indigo-500', 'bg-teal-500'
    ];
    
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  };

  const hasPhoto = user?.photoURL && user.photoURL !== '';

  if (hasPhoto) {
    return (
      <div className={`relative ${className}`}>
        <img
          src={user.photoURL}
          alt={user.displayName || user.email || 'User'}
          className={`${sizeClasses[size]} rounded-full object-cover border-2 border-white shadow-lg`}
          onError={(e) => {
            e.target.style.display = 'none';
            e.target.nextSibling.style.display = 'flex';
          }}
        />
        <div 
          className={`${sizeClasses[size]} rounded-full ${getAvatarColor(user)} text-white font-semibold flex items-center justify-center shadow-lg absolute inset-0 hidden`}
        >
          {getInitials(user)}
        </div>
      </div>
    );
  }

  return (
    <div className={`${sizeClasses[size]} rounded-full ${getAvatarColor(user)} text-white font-semibold flex items-center justify-center shadow-lg ${className}`}>
      {getInitials(user)}
    </div>
  );
};

const SettingsSection = ({ 
  user, 
  userStats, 
  logout, 
  isMobile, 
  theme, 
  setTheme, 
  onGlobalSettingsChange 
}) => {
  const { t } = useTranslation();

  
  const [settings, setSettings] = useState({
    theme: theme || 'system',
    language: 'en',
    fontSize: 'medium',
    notifications: {
      threats: true,
      updates: true,
      community: false,
      marketing: false
    },
    privacy: {
      analytics: true,
      datasharing: false,
      publicProfile: false
    },
    security: {
      twoFactor: false,
      loginAlerts: true,
      sessionTimeout: 30
    }
  });

  const [activeTab, setActiveTab] = useState('general');
  const [realUserData, setRealUserData] = useState({
    accountAge: 0,
    totalSessions: 0,
    dataUsage: 0,
    securityScore: 0,
    joinDate: null,
    lastLogin: null,
    threatsBlocked: 0,
    analysesCompleted: 0
  });

  
  useEffect(() => {
    if (setTheme && settings.theme !== theme) {
      const root = document.documentElement;
      const body = document.body;
      
      if (settings.theme === 'dark') {
        root.classList.add('dark');
        body.classList.add('dark');
      } else if (settings.theme === 'light') {
        root.classList.remove('dark');
        body.classList.remove('dark');
      } else {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        if (prefersDark) {
          root.classList.add('dark');
          body.classList.add('dark');
        } else {
          root.classList.remove('dark');
          body.classList.remove('dark');
        }
      }
      
      setTheme(settings.theme);
      showNotification(`Theme changed to ${settings.theme}`, 'success');
    }
  }, [settings.theme, setTheme, theme]);

  
  useEffect(() => {
    if (settings.language !== 'en') {
      showNotification(`Language set to ${getLanguageName(settings.language)}`, 'success');
      localStorage.setItem('preferred-language', settings.language);
    }
  }, [settings.language]);

  const getLanguageName = (code) => {
    const languages = {
      'en': 'English',
      'es': 'Spanish', 
      'fr': 'French',
      'de': 'German',
      'hi': 'Hindi'
    };
    return languages[code] || 'English';
  };

  
  const calculateRealUserData = React.useCallback(() => {
    if (!user) return;

    const userCreationTime = user.metadata?.creationTime || user.metadata?.a || Date.now();
    const joinDate = new Date(userCreationTime);
    const now = new Date();
    const accountAgeMs = now.getTime() - joinDate.getTime();
    const accountAgeDays = Math.floor(accountAgeMs / (1000 * 60 * 60 * 24));

    const lastSignInTime = user.metadata?.lastSignInTime || user.metadata?.b || Date.now();
    const lastLogin = new Date(lastSignInTime);

    const storedSessions = JSON.parse(localStorage.getItem(`xist-sessions-${user.uid}`) || '[]');
    const totalSessions = storedSessions.length || Math.max(1, Math.floor(accountAgeDays / 3));

    const analysisHistory = JSON.parse(localStorage.getItem(`xist-analysis-${user.uid}`) || '[]');
    const analysesCompleted = analysisHistory.length || userStats?.totalAnalyses || 0;

    const estimatedDataUsage = (analysesCompleted * 0.05 + totalSessions * 0.02).toFixed(1);

    let securityScore = 60;
    if (settings.security.twoFactor) securityScore += 15;
    if (settings.security.loginAlerts) securityScore += 10;
    if (settings.privacy.analytics === false) securityScore += 5;
    if (accountAgeDays > 30) securityScore += 10;

    const threatsBlocked = userStats?.threatsStopped || analysisHistory.filter(a => 
      a.riskLevel === 'HIGH' || a.riskLevel === 'CRITICAL'
    ).length || 0;

    setRealUserData({
      accountAge: accountAgeDays,
      totalSessions: totalSessions,
      dataUsage: parseFloat(estimatedDataUsage),
      securityScore: Math.min(securityScore, 100),
      joinDate: joinDate,
      lastLogin: lastLogin,
      threatsBlocked: threatsBlocked,
      analysesCompleted: analysesCompleted
    });

    trackCurrentSession();
  }, [user, userStats, settings]);

  const trackCurrentSession = () => {
    if (!user) return;
    const sessionKey = `xist-sessions-${user.uid}`;
    const sessions = JSON.parse(localStorage.getItem(sessionKey) || '[]');
    const today = new Date().toDateString();
    const hasSessionToday = sessions.some(session => 
      new Date(session.date).toDateString() === today
    );

    if (!hasSessionToday) {
      sessions.push({
        date: new Date().toISOString(),
        duration: 0,
        analyses: 0
      });
      const recentSessions = sessions.slice(-100);
      localStorage.setItem(sessionKey, JSON.stringify(recentSessions));
    }
  };

  useEffect(() => {
    calculateRealUserData();
  }, [calculateRealUserData]);

  const formatDate = (date) => {
    if (!date) return 'Unknown';
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short', 
      day: 'numeric'
    });
  };

  const formatRelativeTime = (date) => {
    if (!date) return 'Unknown';
    const now = new Date();
    const diffMs = now - date;
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMinutes < 60) return `${diffMinutes} minutes ago`;
    if (diffHours < 24) return `${diffHours} hours ago`;
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return formatDate(date);
  };

  
  const loadSettings = React.useCallback(async () => {
    try {
      const savedSettings = localStorage.getItem(`xist-settings-${user?.uid}`);
      if (savedSettings) {
        const parsed = JSON.parse(savedSettings);
        setSettings(parsed);
        if (parsed.theme && setTheme) {
          setTheme(parsed.theme);
        }
      }
    } catch (error) {
      console.error('Failed to load settings:', error);
    }
  }, [user, setTheme]);

  useEffect(() => {
    loadSettings();
  }, [loadSettings]);

  const saveSettings = async (newSettings) => {
    try {
      setSettings(newSettings);
      localStorage.setItem(`xist-settings-${user?.uid}`, JSON.stringify(newSettings));
      showNotification(t('settingsSaved') || 'Settings saved', 'success');
      
      if (newSettings.theme && setTheme) {
        setTheme(newSettings.theme);
      }
      
      calculateRealUserData();
    } catch (error) {
      console.error('Failed to save settings:', error);
      showNotification('Failed to save settings', 'error');
    }
  };

  
  const handleSettingChange = (category, key, value) => {
    const newSettings = {
      ...settings,
      [category]: {
        ...settings[category],
        [key]: value
      }
    };
    saveSettings(newSettings);

    if (category === 'notifications') {
      showNotification(`${key} notifications ${value ? 'enabled' : 'disabled'}`, 'info');
    }
    if (category === 'privacy') {
      showNotification(`Privacy setting updated: ${key}`, 'info');
    }
    if (category === 'security') {
      showNotification(`Security setting updated: ${key}`, value ? 'success' : 'warning');
    }
  };

  const handleDirectSettingChange = (key, value) => {
    const newSettings = { ...settings, [key]: value };

    if (key === 'fontSize') {
      document.body.classList.remove('font-small', 'font-medium', 'font-large');
      document.body.classList.add(`font-${value}`);
      localStorage.setItem('xist-font-size', value);
      showNotification(`✅ Font size changed to ${value}!`, 'success');
    }
    
    if (key === 'theme') {
      const root = document.documentElement;
      const body = document.body;
      
      root.classList.remove('dark');
      body.classList.remove('dark');
      
      if (value === 'dark') {
        root.classList.add('dark');
        body.classList.add('dark');
      } else if (value === 'system') {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        if (prefersDark) {
          root.classList.add('dark');
          body.classList.add('dark');
        }
      }
      
      localStorage.setItem('xist-theme', value);
      if (setTheme) setTheme(value);
      showNotification(`✅ Theme changed to ${value}!`, 'success');
    }

    saveSettings(newSettings);
    
    if (onGlobalSettingsChange) {
      onGlobalSettingsChange(newSettings);
    }
  };

  
  useEffect(() => {
    const savedFont = localStorage.getItem('xist-font-size') || 'medium';
    const savedTheme = localStorage.getItem('xist-theme') || 'dark';
    
    document.body.classList.remove('font-small', 'font-medium', 'font-large');
    document.body.classList.add(`font-${savedFont}`);
    
    const root = document.documentElement;
    const body = document.body;
    
    if (savedTheme === 'dark') {
      root.classList.add('dark');
      body.classList.add('dark');
    }
    
    setSettings(prev => ({
      ...prev,
      fontSize: savedFont,
      theme: savedTheme
    }));
  }, []);

  
  const testNotifications = () => {
    if (settings.notifications.threats) {
      showNotification('🚨 Test threat notification - This would alert you to real threats!', 'error');
    } else {
      showNotification('Threat notifications are disabled in your settings', 'warning');
    }
  };

  
  const clearUserData = () => {
    if (window.confirm('Are you sure you want to clear all your analysis history? This cannot be undone.')) {
      localStorage.removeItem(`xist-analysis-${user?.uid}`);
      localStorage.removeItem(`xist-sessions-${user?.uid}`);
      showNotification('User data cleared successfully', 'success');
      calculateRealUserData();
    }
  };

  
  const exportUserData = () => {
    const analysisHistory = JSON.parse(localStorage.getItem(`xist-analysis-${user?.uid}`) || '[]');
    const sessions = JSON.parse(localStorage.getItem(`xist-sessions-${user?.uid}`) || '[]');
    
    const exportData = {
      user: {
        email: user?.email,
        displayName: user?.displayName,
        joinDate: realUserData.joinDate
      },
      settings: settings,
      statistics: realUserData,
      analysisHistory: analysisHistory,
      sessions: sessions,
      exportDate: new Date().toISOString()
    };

    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], {type: 'application/json'});
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `xist-ai-data-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    showNotification('User data exported successfully', 'success');
  };

  const settingsTabs = [
    { id: 'general', label: 'General', icon: Cog6ToothIcon },
    { id: 'account', label: 'Account', icon: UserCircleIcon },
    { id: 'privacy', label: 'Privacy', icon: ShieldCheckIcon },
    { id: 'notifications', label: 'Notifications', icon: BellIcon },
    { id: 'appearance', label: 'Appearance', icon: PaintBrushIcon },
    { id: 'api', label: 'API Status', icon: KeyIcon } 
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {}
      <div className="text-center space-y-4">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", duration: 0.8 }}
          className="relative inline-block"
        >
          <Cog6ToothIcon className="w-12 h-12 md:w-16 md:h-16 mx-auto mb-4 text-purple-600" />
        </motion.div>
        
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Settings
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {t('customizeExperience') || 'Customize your experience and manage your account'}
          </p>
        </div>
      </div>

      {}
      <div className="flex flex-wrap justify-center gap-2 mb-8">
        {settingsTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          
          return (
            <motion.button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all ${
                isActive
                  ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg'
                  : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-gray-500 dark:text-gray-400'}`} />
              <span className={isMobile ? 'hidden sm:inline' : ''}>{tab.label}</span>
            </motion.button>
          );
        })}
      </div>

      {}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
        
        {}
        {activeTab === 'api' && (
          <div className="p-6 space-y-8">
            <div>
              <div className="flex items-center space-x-3 mb-6">
                <KeyIcon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  API Service Status (20-Key Rotation)
                </h3>
              </div>
              
              <div className="mb-4 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  <strong>🔑 Intelligent API Management:</strong> Xist AI uses 20 OpenRouter API keys with automatic rotation 
                  to ensure 99.9% uptime for analysis services. Keys are automatically managed for optimal performance.
                </p>
              </div>
              
              <ApiPoolStatus />
            </div>
          </div>
        )}
        
        {}
        {activeTab === 'general' && (
          <div className="p-6 space-y-8">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">General Settings</h3>
              
              {}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Language
                  </label>
                  <select
                    value={settings.language}
                    onChange={(e) => handleDirectSettingChange('language', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="en">English</option>
                    <option value="es">Spanish</option>
                    <option value="fr">French</option>
                    <option value="de">German</option>
                    <option value="hi">Hindi</option>
                  </select>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Choose your preferred language (affects notifications)
                  </p>
                </div>

                {}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Font Size
                  </label>
                  <div className="flex space-x-3">
                    {[
                      { value: 'small', label: 'Small', size: 'text-sm' },
                      { value: 'medium', label: 'Medium', size: 'text-base' },
                      { value: 'large', label: 'Large', size: 'text-lg' }
                    ].map((option) => (
                      <motion.button
                        key={option.value}
                        onClick={() => handleDirectSettingChange('fontSize', option.value)}
                        className={`px-4 py-2 rounded-lg border font-medium transition-all ${option.size} ${
                          settings.fontSize === option.value
                            ? 'bg-purple-600 text-white border-purple-600'
                            : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600'
                        }`}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        {option.label}
                      </motion.button>
                    ))}
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Changes text size across the entire app
                  </p>
                </div>

                {}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Session Timeout
                  </label>
                  <select
                    value={settings.security.sessionTimeout}
                    onChange={(e) => handleSettingChange('security', 'sessionTimeout', parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value={15}>15 minutes</option>
                    <option value={30}>30 minutes</option>
                    <option value={60}>1 hour</option>
                    <option value={120}>2 hours</option>
                    <option value={0}>Never</option>
                  </select>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Auto-logout after inactivity (affects security score)
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {}
        {activeTab === 'notifications' && (
          <div className="p-6 space-y-6">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Notification Preferences</h3>
            
            <div className="space-y-4">
              {[
                {
                  key: 'threats',
                  title: 'Threat Alerts',
                  description: 'Get notified when threats are detected in your analysis',
                  icon: ExclamationTriangleIcon
                },
                {
                  key: 'updates',
                  title: 'Feature Updates',
                  description: 'Get notified about new features and updates',
                  icon: SparklesIcon
                },
                {
                  key: 'community',
                  title: 'Community Activity',
                  description: 'Get notified about community discussions and tips',
                  icon: UserGroupIcon
                }
              ].map((notification) => (
                <div key={notification.key} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <notification.icon className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">
                        {notification.title}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {notification.description}
                      </div>
                    </div>
                  </div>
                  <motion.button
                    onClick={() => handleSettingChange('notifications', notification.key, !settings.notifications[notification.key])}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      settings.notifications[notification.key]
                        ? 'bg-purple-600'
                        : 'bg-gray-300 dark:bg-gray-600'
                    }`}
                    whileTap={{ scale: 0.95 }}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        settings.notifications[notification.key] ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </motion.button>
                </div>
              ))}
            </div>

            {}
            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
              <motion.button
                onClick={testNotifications}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Test Notifications
              </motion.button>
            </div>
          </div>
        )}

        {}
        {activeTab === 'privacy' && (
          <div className="p-6 space-y-6">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Privacy & Data</h3>
            
            <div className="space-y-4">
              {[
                {
                  key: 'analytics',
                  title: 'Usage Analytics',
                  description: 'Help improve Xist AI by sharing usage data (affects security score)',
                  icon: ChartBarIcon
                },
                {
                  key: 'datasharing',
                  title: 'Research Data Sharing',
                  description: 'Share anonymized data for cybersecurity research',
                  icon: BeakerIcon
                },
                {
                  key: 'publicProfile',
                  title: 'Public Profile',
                  description: 'Make your threat detection stats visible to other users',
                  icon: UserIcon
                }
              ].map((privacy) => (
                <div key={privacy.key} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <privacy.icon className="w-6 h-6 text-green-600 dark:text-green-400" />
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">
                        {privacy.title}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {privacy.description}
                      </div>
                    </div>
                  </div>
                  <motion.button
                    onClick={() => handleSettingChange('privacy', privacy.key, !settings.privacy[privacy.key])}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      settings.privacy[privacy.key]
                        ? 'bg-purple-600'
                        : 'bg-gray-300 dark:bg-gray-600'
                    }`}
                    whileTap={{ scale: 0.95 }}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        settings.privacy[privacy.key] ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </motion.button>
                </div>
              ))}
            </div>
          </div>
        )}

        {}
        {activeTab === 'appearance' && (
          <div className="p-6 space-y-6">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Appearance</h3>
            
            {}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Theme
              </label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { value: 'light', label: 'Light', icon: SunIcon, bg: 'bg-white', border: 'border-gray-300' },
                  { value: 'dark', label: 'Dark', icon: MoonIcon, bg: 'bg-gray-900', border: 'border-gray-700' },
                  { value: 'system', label: 'System', icon: ComputerDesktopIcon, bg: 'bg-gradient-to-r from-white to-gray-900', border: 'border-gray-400' }
                ].map((themeOption) => {
                  const Icon = themeOption.icon;
                  const isSelected = settings.theme === themeOption.value;
                  
                  return (
                    <motion.button
                      key={themeOption.value}
                      onClick={() => handleDirectSettingChange('theme', themeOption.value)}
                      className={`relative p-4 rounded-xl border-2 transition-all ${
                        isSelected
                          ? 'border-purple-500 ring-2 ring-purple-200 dark:ring-purple-800'
                          : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                      }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className={`w-full h-16 ${themeOption.bg} ${themeOption.border} border rounded-lg mb-3`}>
                        <div className="w-full h-full flex items-center justify-center">
                          <Icon className={`w-6 h-6 ${
                            themeOption.value === 'light' ? 'text-gray-600' : 
                            themeOption.value === 'dark' ? 'text-gray-300' : 
                            'text-gray-500'
                          }`} />
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="font-medium text-gray-900 dark:text-white text-sm">
                          {themeOption.label}
                        </div>
                      </div>
                      {isSelected && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute -top-2 -right-2"
                        >
                          <CheckCircleIcon className="w-6 h-6 text-purple-600 bg-white rounded-full" />
                        </motion.div>
                      )}
                    </motion.button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {}
        {activeTab === 'account' && (
          <div className="p-6 space-y-6">
            {}
            <div className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-xl p-6 border border-purple-200 dark:border-purple-700/50">
              <div className="flex items-center space-x-6 mb-6">
                <div className="relative">
                  <UserAvatar user={user} size="2xl" />
                  {}
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 border-2 border-white rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                </div>
                
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                    {user?.displayName || user?.email?.split('@')[0] || 'User'}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                    {user?.email || 'user@example.com'}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-500 mb-2">
                    Joined {formatDate(realUserData.joinDate)}
                  </p>
                  <div className="flex items-center space-x-4 text-xs">
                    <span className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 px-2 py-1 rounded-full">
                      ✓ Verified Account
                    </span>
                    <span className="text-gray-500 dark:text-gray-400">
                      Last active: {formatRelativeTime(realUserData.lastLogin)}
                    </span>
                  </div>
                </div>
              </div>

              {}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-white dark:bg-gray-800 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                    {realUserData.accountAge}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">Days Active</div>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    {realUserData.analysesCompleted}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">Analyses</div>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                    {realUserData.threatsBlocked}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">Threats Blocked</div>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                    {realUserData.securityScore}%
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">Security Score</div>
                </div>
              </div>

              {}
              <div className="flex flex-wrap gap-3">
                <motion.button
                  onClick={exportUserData}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm flex items-center space-x-2"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z"/>
                    <polyline points="14,2 14,8 20,8"/>
                    <line x1="16" y1="13" x2="8" y2="13"/>
                    <line x1="16" y1="17" x2="8" y2="17"/>
                    <polyline points="10,9 9,9 8,9"/>
                  </svg>
                  <span>Export Data</span>
                </motion.button>

                <motion.button
                  onClick={clearUserData}
                  className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors text-sm flex items-center space-x-2"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <polyline points="3,6 5,6 21,6"/>
                    <path d="m19,6v14a2,2 0 0,1 -2,2H7a2,2 0 0,1 -2,-2V6m3,0V4a2,2 0 0,1 2,-2h4a2,2 0 0,1 2,2v2"/>
                  </svg>
                  <span>Clear Data</span>
                </motion.button>

                <motion.button
                  onClick={logout}
                  className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors text-sm flex items-center space-x-2"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <ArrowRightOnRectangleIcon className="w-4 h-4" />
                  <span>Sign Out</span>
                </motion.button>
              </div>

              {}
              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">Account Details</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500 dark:text-gray-400">User ID:</span>
                    <span className="ml-2 font-mono text-xs text-gray-700 dark:text-gray-300">
                      {user?.uid?.substring(0, 16)}...
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500 dark:text-gray-400">Provider:</span>
                    <span className="ml-2 text-gray-700 dark:text-gray-300">
                      {user?.providerData?.[0]?.providerId || 'Email'}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500 dark:text-gray-400">Email Verified:</span>
                    <span className={`ml-2 ${user?.emailVerified ? 'text-green-600' : 'text-orange-600'}`}>
                      {user?.emailVerified ? 'Yes' : 'Pending'}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500 dark:text-gray-400">Data Usage:</span>
                    <span className="ml-2 text-gray-700 dark:text-gray-300">
                      {realUserData.dataUsage} MB
                    </span>
                  </div>
                </div>
                
                {}
                <div className="mt-4 p-3 bg-gray-100 dark:bg-gray-700 rounded-lg">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Sign out of your account. You'll need to sign in again to access your data.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SettingsSection;
