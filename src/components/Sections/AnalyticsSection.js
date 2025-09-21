import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';
import { useAuth } from '../../hooks/useAuth';
import { showNotification } from '../UI/NotificationToast';
import {
  ChartBarIcon, ArrowTrendingUpIcon, ArrowTrendingDownIcon, ShieldCheckIcon,
  GlobeAltIcon, UserGroupIcon, ClockIcon, ExclamationTriangleIcon,
  CheckCircleIcon, XCircleIcon, EyeIcon, FireIcon, BoltIcon,
  ArrowPathIcon, CalendarIcon, FunnelIcon, ShareIcon, ArrowDownTrayIcon,
  MapIcon, DevicePhoneMobileIcon, ComputerDesktopIcon, ServerIcon,
  MagnifyingGlassIcon, CpuChipIcon, WifiIcon, SignalIcon,
  DocumentTextIcon, SparklesIcon, UserIcon, BuildingOfficeIcon,
  AcademicCapIcon, NewspaperIcon, PhoneIcon, EnvelopeIcon
} from '@heroicons/react/24/outline';

const AnalyticsSection = ({ 
  analysisData = [], 
  localAnalysisHistory = [], 
  performanceMetrics = {} 
}) => {
  const { user } = useAuth();
  
  // State management
  const [selectedTimeRange, setSelectedTimeRange] = useState('24hours');
  const [selectedView, setSelectedView] = useState('overview'); // 'overview', 'personal', 'public'
  const [selectedMetric, setSelectedMetric] = useState('all');
  const [isRealTimeEnabled, setIsRealTimeEnabled] = useState(true);
  const [analyticsData, setAnalyticsData] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  // Time range options
  const TIME_RANGES = {
    '1hour': { label: '1 Hour', hours: 1 },
    '6hours': { label: '6 Hours', hours: 6 },
    '24hours': { label: '24 Hours', hours: 24 },
    '7days': { label: '7 Days', hours: 168 },
    '30days': { label: '30 Days', hours: 720 }
  };

  // View modes
  const VIEW_MODES = {
    'overview': { label: 'Overview', icon: ChartBarIcon, color: 'blue' },
    'personal': { label: 'Your Analytics', icon: UserIcon, color: 'green' },
    'public': { label: 'Public Analytics', icon: GlobeAltIcon, color: 'purple' }
  };

  // Process user's personal analysis data
  const processPersonalAnalytics = () => {
    const now = new Date();
    const timeRange = TIME_RANGES[selectedTimeRange];
    const cutoffTime = new Date(now.getTime() - timeRange.hours * 60 * 60 * 1000);
    
    // Combine both current session and stored history
    const allPersonalData = [
      ...analysisData,
      ...(localAnalysisHistory || [])
    ].filter(analysis => 
      analysis && analysis.timestamp && new Date(analysis.timestamp) > cutoffTime
    );

    // Create time buckets
    const bucketCount = selectedTimeRange === '1hour' ? 12 : 
                       selectedTimeRange === '6hours' ? 12 :
                       selectedTimeRange === '24hours' ? 24 : 
                       selectedTimeRange === '7days' ? 7 : 30;

    const bucketSize = timeRange.hours * 60 * 60 * 1000 / bucketCount;

    const timeBuckets = Array.from({ length: bucketCount }, (_, i) => {
      const bucketTime = new Date(now.getTime() - (bucketCount - 1 - i) * bucketSize);
      return {
        time: formatTimeLabel(bucketTime, selectedTimeRange),
        timestamp: bucketTime,
        analyses: 0,
        threats: 0,
        blocked: 0,
        accuracy: 0,
        accuracyCount: 0,
        phishing: 0,
        scams: 0,
        misinformation: 0,
        legitimate: 0
      };
    });

    // Process personal data into buckets
    allPersonalData.forEach(analysis => {
      const analysisTime = new Date(analysis.timestamp);
      const bucketIndex = Math.floor((now.getTime() - analysisTime.getTime()) / bucketSize);
      const targetBucket = timeBuckets[bucketCount - 1 - bucketIndex];
      
      if (targetBucket && bucketIndex >= 0 && bucketIndex < bucketCount) {
        targetBucket.analyses++;
        
        // Categorize threats
        const riskLevel = analysis.overallRiskLevel || analysis.riskLevel || 'LOW';
        if (riskLevel === 'HIGH' || riskLevel === 'CRITICAL') {
          targetBucket.threats++;
        }
        
        if (analysis.recommendation === 'block' || analysis.action === 'block') {
          targetBucket.blocked++;
        }
        
        // Add accuracy/confidence
        if (analysis.confidence || analysis.overallConfidence) {
          const confidence = analysis.confidence || analysis.overallConfidence;
          targetBucket.accuracy += typeof confidence === 'number' ? confidence : 0.8;
          targetBucket.accuracyCount++;
        }
        
        // Categorize by type
        const category = (analysis.category || analysis.type || '').toLowerCase();
        if (category.includes('phishing')) {
          targetBucket.phishing++;
        } else if (category.includes('scam') || category.includes('fraud')) {
          targetBucket.scams++;
        } else if (category.includes('misinformation') || category.includes('fake')) {
          targetBucket.misinformation++;
        } else if (riskLevel === 'LOW' || riskLevel === 'SAFE') {
          targetBucket.legitimate++;
        }
      }
    });

    // Calculate averages
    timeBuckets.forEach(bucket => {
      bucket.accuracy = bucket.accuracyCount > 0 ? 
        Math.round((bucket.accuracy / bucket.accuracyCount) * 100) : 0;
      delete bucket.accuracyCount;
      delete bucket.timestamp;
    });

    return {
      totalAnalyses: allPersonalData.length,
      threatsDetected: allPersonalData.filter(a => 
        (a.overallRiskLevel === 'HIGH' || a.overallRiskLevel === 'CRITICAL') ||
        (a.riskLevel === 'HIGH' || a.riskLevel === 'CRITICAL')
      ).length,
      threatsBlocked: allPersonalData.filter(a => 
        a.recommendation === 'block' || a.action === 'block'
      ).length,
      averageAccuracy: allPersonalData.length > 0 ? 
        Math.round(allPersonalData.reduce((sum, a) => 
          sum + ((a.confidence || a.overallConfidence || 0.8) * 100), 0
        ) / allPersonalData.length) : 0,
      timeSeriesData: timeBuckets,
      categoryData: getCategoryBreakdown(allPersonalData),
      performanceData: performanceMetrics
    };
  };

  // Generate public/community analytics
  const generatePublicAnalytics = () => {
    const now = new Date();
    const timeRange = TIME_RANGES[selectedTimeRange];
    const bucketCount = selectedTimeRange === '7days' ? 7 : 
                       selectedTimeRange === '30days' ? 30 : 24;

    // Mock public data based on time range (in real app, this would come from API)
    const publicTimeSeriesData = Array.from({ length: bucketCount }, (_, i) => {
      const bucketTime = new Date(now.getTime() - (bucketCount - 1 - i) * 
        (timeRange.hours * 60 * 60 * 1000 / bucketCount));
      
      // Simulate realistic public usage patterns
      const baseAnalyses = selectedTimeRange === '30days' ? 
        Math.floor(Math.random() * 5000) + 2000 :
        selectedTimeRange === '7days' ? 
        Math.floor(Math.random() * 1500) + 800 :
        Math.floor(Math.random() * 300) + 100;
      
      return {
        time: formatTimeLabel(bucketTime, selectedTimeRange),
        analyses: baseAnalyses,
        threats: Math.floor(baseAnalyses * (0.15 + Math.random() * 0.1)), // 15-25% threat rate
        blocked: Math.floor(baseAnalyses * (0.12 + Math.random() * 0.08)), // 12-20% blocked
        accuracy: Math.round((92 + Math.random() * 6) * 100) / 100, // 92-98% accuracy
        users: Math.floor(baseAnalyses * 0.3), // ~30% unique users
        countries: Math.floor(Math.random() * 50) + 20
      };
    });

    return {
      totalAnalyses: 2847569 + Math.floor(Math.random() * 10000),
      threatsDetected: 456892 + Math.floor(Math.random() * 1000),
      threatsBlocked: 441203 + Math.floor(Math.random() * 1000),
      globalAccuracy: 96.3 + (Math.random() * 0.8 - 0.4),
      activeUsers: 89247 + Math.floor(Math.random() * 5000),
      countriesServed: 147,
      timeSeriesData: publicTimeSeriesData,
      categoryData: getGlobalCategoryData(),
      geographicData: getGlobalGeographicData(),
      platformData: getGlobalPlatformData(),
      modelPerformance: getGlobalModelPerformance()
    };
  };

  // Helper functions
  const formatTimeLabel = (date, timeRange) => {
    if (timeRange === '1hour' || timeRange === '6hours') {
      return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    } else if (timeRange === '24hours') {
      return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    } else if (timeRange === '7days') {
      return date.toLocaleDateString('en-US', { weekday: 'short' });
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
  };

  const getCategoryBreakdown = (data) => {
    const categories = {};
    data.forEach(analysis => {
      const category = analysis.category || analysis.type || 'Unknown';
      categories[category] = (categories[category] || 0) + 1;
    });
    
    return Object.entries(categories)
      .map(([name, count]) => ({ name, count, value: count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 6);
  };

  const getGlobalCategoryData = () => [
    { name: 'Phishing Attempts', count: 156829, value: 156829 },
    { name: 'Financial Scams', count: 98432, value: 98432 },
    { name: 'Romance Scams', count: 67234, value: 67234 },
    { name: 'Tech Support Scams', count: 54123, value: 54123 },
    { name: 'Health Misinformation', count: 43567, value: 43567 },
    { name: 'Political Misinformation', count: 36707, value: 36707 }
  ];

  const getGlobalGeographicData = () => [
    { country: 'United States', threats: 89234, blocked: 86543, users: 23456 },
    { country: 'United Kingdom', threats: 45678, blocked: 44321, users: 12890 },
    { country: 'Canada', threats: 32145, blocked: 31234, users: 8765 },
    { country: 'Australia', threats: 28976, blocked: 28123, users: 7432 },
    { country: 'Germany', threats: 25843, blocked: 25001, users: 6789 },
    { country: 'India', threats: 67890, blocked: 65432, users: 18765 }
  ];

  const getGlobalPlatformData = () => [
    { platform: 'Web Browser', percentage: 62.4, value: 1776890 },
    { platform: 'Mobile App', percentage: 28.7, value: 817247 },
    { platform: 'API Integration', percentage: 8.9, value: 253432 }
  ];

  const getGlobalModelPerformance = () => [
    { model: 'Xist-GPT-4o', accuracy: 97.8, speed: 1.1, analyses: 1234567 },
    { model: 'Xist-Claude-3', accuracy: 96.9, speed: 0.8, analyses: 892341 },
    { model: 'Xist-Gemini-Pro', accuracy: 95.7, speed: 1.4, analyses: 720861 }
  ];

  // Process and combine data based on selected view
  const processAnalyticsData = () => {
    const personalData = processPersonalAnalytics();
    const publicData = generatePublicAnalytics();

    if (selectedView === 'personal') {
      return personalData;
    } else if (selectedView === 'public') {
      return publicData;
    } else {
      // Overview combines both
      return {
        ...publicData,
        personalData,
        hasPersonalData: personalData.totalAnalyses > 0
      };
    }
  };

  // Real-time data updates
  useEffect(() => {
    const updateData = () => {
      setAnalyticsData(processAnalyticsData());
      setIsLoading(false);
      setLastUpdated(new Date());
    };

    updateData();

    let interval;
    if (isRealTimeEnabled) {
      interval = setInterval(updateData, 10000); // Update every 10 seconds
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [selectedTimeRange, selectedView, analysisData.length, localAnalysisHistory.length]);

  // Chart colors
  const COLORS = {
    primary: '#3b82f6',
    secondary: '#10b981', 
    danger: '#ef4444',
    warning: '#f59e0b',
    info: '#06b6d4',
    purple: '#8b5cf6'
  };

  const CHART_COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];

  // Export function
  const exportAnalytics = (format) => {
    const exportData = {
      exportDate: new Date().toISOString(),
      timeRange: selectedTimeRange,
      view: selectedView,
      userScope: user ? 'authenticated' : 'anonymous',
      data: analyticsData
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { 
      type: 'application/json' 
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `xist-analytics-${selectedView}-${selectedTimeRange}-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    showNotification(`📊 Analytics exported (${selectedView} view)`, 'success');
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-6">
        <div className="flex items-center justify-center min-h-96">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full"
          />
          <span className="ml-3 text-lg text-gray-600 dark:text-gray-300">
            Loading Xist AI Analytics...
          </span>
        </div>
      </div>
    );
  }

  // Get stats array based on selected view
  const getStatsArray = () => {
    if (selectedView === 'personal' || selectedView === 'overview') {
      return [
        { 
          title: 'Your Analyses', 
          value: analyticsData.personalData?.totalAnalyses?.toLocaleString() || 
                 analyticsData.totalAnalyses?.toLocaleString() || '0', 
          change: '+12.5%', 
          icon: DocumentTextIcon, 
          color: 'blue',
          subtitle: 'Content you\'ve verified'
        },
        { 
          title: 'Threats Found', 
          value: analyticsData.personalData?.threatsDetected?.toLocaleString() || 
                 analyticsData.threatsDetected?.toLocaleString() || '0', 
          change: '+8.2%', 
          icon: ExclamationTriangleIcon, 
          color: 'red',
          subtitle: 'In your analyses'
        },
        { 
          title: 'Blocked Content', 
          value: analyticsData.personalData?.threatsBlocked?.toLocaleString() || 
                 analyticsData.threatsBlocked?.toLocaleString() || '0', 
          change: '+15.3%', 
          icon: ShieldCheckIcon, 
          color: 'green',
          subtitle: 'Successfully prevented'
        },
        { 
          title: 'Your Accuracy', 
          value: `${analyticsData.personalData?.averageAccuracy || 
                   analyticsData.averageAccuracy || 0}%`, 
          change: '+2.1%', 
          icon: SparklesIcon, 
          color: 'purple',
          subtitle: 'Detection precision'
        }
      ];
    } else {
      return [
        { 
          title: 'Global Analyses', 
          value: analyticsData.totalAnalyses?.toLocaleString() || '0', 
          change: '+18.7%', 
          icon: GlobeAltIcon, 
          color: 'blue',
          subtitle: 'Worldwide verifications'
        },
        { 
          title: 'Threats Detected', 
          value: analyticsData.threatsDetected?.toLocaleString() || '0', 
          change: '+14.3%', 
          icon: ExclamationTriangleIcon, 
          color: 'red',
          subtitle: 'Global threat detection'
        },
        { 
          title: 'Active Users', 
          value: analyticsData.activeUsers?.toLocaleString() || '0', 
          change: '+22.1%', 
          icon: UserGroupIcon, 
          color: 'green',
          subtitle: `Across ${analyticsData.countriesServed || 0} countries`
        },
        { 
          title: 'System Accuracy', 
          value: `${Math.round(analyticsData.globalAccuracy || 0)}%`, 
          change: '+0.8%', 
          icon: CpuChipIcon, 
          color: 'purple',
          subtitle: 'AI model performance'
        }
      ];
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-6">
      
      {/* Header Section */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
              <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", duration: 0.8 }}
          className="relative inline-block"
        >
          <ChartBarIcon className="w-12 h-12 md:w-16 md:h-16 mx-auto mb-4 text-purple-600" />
          </motion.div>
              Analytics
              {selectedView === 'personal' && user && (
                <span className="text-sm px-3 py-1 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 rounded-full">
                  Personal
                </span>
              )}
              {selectedView === 'public' && (
                <span className="text-sm px-3 py-1 bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200 rounded-full">
                  Global
                </span>
              )}
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mt-2 flex items-center gap-2">
              {isRealTimeEnabled && (
                <span className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  Live
                </span>
              )}
              Last updated: {lastUpdated.toLocaleTimeString()}
              {selectedView === 'overview' && ' • Combined analytics'}
              {selectedView === 'personal' && user && ' • Your analysis data'}
              {selectedView === 'public' && ' • Community data'}
            </p>
          </div>
          
          <div className="flex flex-wrap items-center gap-3">
            {/* View Mode Selector */}
            <div className="flex bg-white dark:bg-gray-800 rounded-lg p-1 border border-gray-200 dark:border-gray-700">
              {Object.entries(VIEW_MODES).map(([key, mode]) => (
                <button
                  key={key}
                  onClick={() => setSelectedView(key)}
                  className={`px-3 py-1 text-xs rounded-md transition-all duration-200 flex items-center gap-1 ${
                    selectedView === key
                      ? `bg-${mode.color}-500 text-white shadow-sm`
                      : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  <mode.icon className="w-3 h-3" />
                  {mode.label}
                </button>
              ))}
            </div>

            {/* Time Range Selector */}
            <div className="flex bg-white dark:bg-gray-800 rounded-lg p-1 border border-gray-200 dark:border-gray-700">
              {Object.entries(TIME_RANGES).map(([key, range]) => (
                <button
                  key={key}
                  onClick={() => setSelectedTimeRange(key)}
                  className={`px-3 py-1 text-xs rounded-md transition-all duration-200 ${
                    selectedTimeRange === key
                      ? 'bg-blue-500 text-white shadow-sm'
                      : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  {range.label}
                </button>
              ))}
            </div>

            {/* Real-time Toggle */}
            <button
              onClick={() => setIsRealTimeEnabled(!isRealTimeEnabled)}
              className={`p-2 rounded-lg transition-colors ${
                isRealTimeEnabled
                  ? 'bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-400'
                  : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
              }`}
              title={isRealTimeEnabled ? 'Disable real-time updates' : 'Enable real-time updates'}
            >
              <ArrowPathIcon className={`w-4 h-4 ${isRealTimeEnabled ? 'animate-spin' : ''}`} />
            </button>
            
            {/* Export Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => exportAnalytics('json')}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <ArrowDownTrayIcon className="w-4 h-4" />
              Export
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {getStatsArray().map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  {stat.title}
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                  {stat.value}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {stat.subtitle}
                </p>
                <p className={`text-sm flex items-center gap-1 mt-2 ${
                  stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'
                }`}>
                  {stat.change.startsWith('+') ? 
                    <ArrowTrendingUpIcon className="w-4 h-4" /> : 
                    <ArrowTrendingDownIcon className="w-4 h-4" />
                  }
                  {stat.change} vs last period
                </p>
              </div>
              <div className={`p-3 rounded-lg bg-${stat.color}-100 dark:bg-${stat.color}-900/20`}>
                <stat.icon className={`w-6 h-6 text-${stat.color}-600 dark:text-${stat.color}-400`} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Main Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        
        {/* Time Series Chart - Takes 2/3 width */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {selectedView === 'personal' ? 'Your Analysis Timeline' : 
               selectedView === 'public' ? 'Global Analysis Timeline' : 
               'Combined Analysis Timeline'}
            </h3>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {selectedView === 'overview' && analyticsData.hasPersonalData && 
                'Personal + Global data'}
            </span>
          </div>
          
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={analyticsData.timeSeriesData || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis 
                  dataKey="time" 
                  stroke="#6b7280"
                  fontSize={12}
                  interval="preserveStartEnd"
                />
                <YAxis stroke="#6b7280" fontSize={12} />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'rgb(31 41 55)',
                    border: 'none',
                    borderRadius: '8px',
                    color: '#fff'
                  }}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="analyses" 
                  stroke={COLORS.primary} 
                  strokeWidth={3}
                  name="Total Analyses"
                  dot={{ fill: COLORS.primary, strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="threats" 
                  stroke={COLORS.danger} 
                  strokeWidth={2}
                  name="Threats Detected"
                  dot={{ fill: COLORS.danger, strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="blocked" 
                  stroke={COLORS.secondary} 
                  strokeWidth={2}
                  name="Threats Blocked"
                  dot={{ fill: COLORS.secondary, strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6 }}
                />
                {selectedView === 'public' && (
                  <Line 
                    type="monotone" 
                    dataKey="users" 
                    stroke={COLORS.purple} 
                    strokeWidth={2}
                    name="Active Users"
                    dot={{ fill: COLORS.purple, strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                )}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Distribution Pie Chart */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
            {selectedView === 'personal' ? 'Your Threat Categories' : 'Threat Categories'}
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={analyticsData.categoryData || []}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name.split(' ')[0]} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {(analyticsData.categoryData || []).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'rgb(31 41 55)',
                    border: 'none',
                    borderRadius: '8px',
                    color: '#fff'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Additional Charts for Public View */}
      {(selectedView === 'public' || selectedView === 'overview') && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          
          {/* Geographic Distribution */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
              <MapIcon className="w-5 h-5 text-blue-600" />
              Global Distribution
            </h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analyticsData.geographicData || []}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis 
                    dataKey="country" 
                    stroke="#6b7280"
                    fontSize={12}
                    interval={0}
                    angle={-45}
                    textAnchor="end"
                    height={80}
                  />
                  <YAxis stroke="#6b7280" fontSize={12} />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'rgb(31 41 55)',
                      border: 'none',
                      borderRadius: '8px',
                      color: '#fff'
                    }}
                  />
                  <Legend />
                  <Bar dataKey="threats" fill={COLORS.danger} name="Threats Detected" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="users" fill={COLORS.primary} name="Active Users" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Platform Distribution */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
              <DevicePhoneMobileIcon className="w-5 h-5 text-green-600" />
              Platform Usage
            </h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={analyticsData.platformData || []}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ platform, percentage }) => `${platform} ${percentage}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="percentage"
                  >
                    {(analyticsData.platformData || []).map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'rgb(31 41 55)',
                      border: 'none',
                      borderRadius: '8px',
                      color: '#fff'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* AI Model Performance Chart (Public View) */}
      {(selectedView === 'public' || selectedView === 'overview') && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8 border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
            <CpuChipIcon className="w-5 h-5 text-purple-600" />
            Xist AI Model Performance
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analyticsData.modelPerformance || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="model" stroke="#6b7280" fontSize={12} />
                <YAxis stroke="#6b7280" fontSize={12} />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'rgb(31 41 55)',
                    border: 'none',
                    borderRadius: '8px',
                    color: '#fff'
                  }}
                />
                <Legend />
                <Bar dataKey="accuracy" fill={COLORS.primary} name="Accuracy %" radius={[4, 4, 0, 0]} />
                <Bar dataKey="speed" fill={COLORS.warning} name="Speed (s)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Recent Activity Feed */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
          <ClockIcon className="w-5 h-5 text-indigo-600" />
          {selectedView === 'personal' ? 'Your Recent Analysis Activity' : 
           selectedView === 'public' ? 'Recent Global Activity' :
           'Recent Activity Overview'}
        </h3>
        <div className="space-y-4 max-h-96 overflow-y-auto">
          <AnimatePresence>
            {selectedView === 'personal' ? (
              // Show personal analysis history
              (analysisData.slice(-10) || []).reverse().map((analysis, index) => (
                <motion.div
                  key={analysis.id || index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-100 dark:border-gray-600"
                >
                  <div className="flex items-center space-x-4">
                    <div className={`p-2 rounded-lg ${
                      (analysis.overallRiskLevel === 'HIGH' || analysis.overallRiskLevel === 'CRITICAL') ||
                      (analysis.riskLevel === 'HIGH' || analysis.riskLevel === 'CRITICAL') ?
                      'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' :
                      'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                    }`}>
                      {(analysis.overallRiskLevel === 'HIGH' || analysis.overallRiskLevel === 'CRITICAL') ||
                       (analysis.riskLevel === 'HIGH' || analysis.riskLevel === 'CRITICAL') ? 
                        <ExclamationTriangleIcon className="w-4 h-4" /> :
                        <CheckCircleIcon className="w-4 h-4" />
                      }
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {analysis.category || analysis.type || 'Content Analysis'}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        {analysis.summary || `Risk Level: ${analysis.overallRiskLevel || analysis.riskLevel || 'LOW'}`}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {new Date(analysis.timestamp).toLocaleTimeString()}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {Math.round(((analysis.confidence || analysis.overallConfidence || 0.8) * 100))}% confidence
                    </p>
                  </div>
                </motion.div>
              ))
            ) : (
              // Show mock global activity
              Array.from({ length: 8 }, (_, index) => {
                const activities = [
                  { type: 'Phishing Email', country: 'United States', risk: 'HIGH' },
                  { type: 'Romance Scam', country: 'United Kingdom', risk: 'CRITICAL' },
                  { type: 'Tech Support Scam', country: 'Canada', risk: 'HIGH' },
                  { type: 'Investment Fraud', country: 'Australia', risk: 'CRITICAL' },
                  { type: 'Health Misinformation', country: 'Germany', risk: 'MEDIUM' },
                  { type: 'Legitimate Content', country: 'France', risk: 'LOW' },
                  { type: 'Political Misinformation', country: 'India', risk: 'MEDIUM' },
                  { type: 'Financial Scam', country: 'Brazil', risk: 'HIGH' }
                ];
                const activity = activities[index];
                
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-100 dark:border-gray-600"
                  >
                    <div className="flex items-center space-x-4">
                      <div className={`p-2 rounded-lg ${
                        activity.risk === 'HIGH' || activity.risk === 'CRITICAL' ?
                        'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' :
                        activity.risk === 'MEDIUM' ?
                        'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                        'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                      }`}>
                        {activity.risk === 'HIGH' || activity.risk === 'CRITICAL' ? 
                          <ExclamationTriangleIcon className="w-4 h-4" /> :
                          activity.risk === 'MEDIUM' ?
                          <ExclamationTriangleIcon className="w-4 h-4" /> :
                          <CheckCircleIcon className="w-4 h-4" />
                        }
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {activity.type}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          Detected in {activity.country}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        {new Date(Date.now() - index * 60000 * Math.random() * 10).toLocaleTimeString()}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {Math.round(95 + Math.random() * 5)}% confidence
                      </p>
                    </div>
                  </motion.div>
                );
              })
            )}
          </AnimatePresence>
          
          {selectedView === 'personal' && (!analysisData || analysisData.length === 0) && (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              <DocumentTextIcon className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No personal analysis activity to display</p>
              <p className="text-sm mt-2">
                Start analyzing content in the Verify section to see your activity here
              </p>
            </div>
          )}
        </div>
      </div>

    </div>
  );
};

export default AnalyticsSection;
