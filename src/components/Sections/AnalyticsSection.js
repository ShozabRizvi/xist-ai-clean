import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChartBarIcon, ArrowTrendingUpIcon,
  ArrowTrendingDownIcon, ShieldCheckIcon,
  GlobeAltIcon, UserGroupIcon, ClockIcon, ExclamationTriangleIcon,
  CheckCircleIcon, XCircleIcon, EyeIcon, FireIcon, BoltIcon,
  ArrowPathIcon, CalendarIcon, FunnelIcon, ShareIcon, ArrowDownTrayIcon,
  MapIcon, DevicePhoneMobileIcon, ComputerDesktopIcon, ServerIcon,
  MagnifyingGlassIcon, CpuChipIcon, WifiIcon, SignalIcon, DocumentTextIcon, SparklesIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../../context/AuthContext';
import { showNotification } from '../UI/NotificationToast';


const AnalyticsSection = ({ analysisData = [] }) => {

  // Helper function for threat level colors
  const getThreatColor = (threatLevel) => {
    switch (threatLevel?.toUpperCase()) {
      case 'HIGH':
      case 'CRITICAL':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'MEDIUM':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'LOW':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    }
  };

  // Auth context
  const { user } = useAuth();

  // State management
  const [selectedTimeRange, setSelectedTimeRange] = useState('7days');
  const [selectedMetric, setSelectedMetric] = useState('all');
  const [isRealTimeEnabled, setIsRealTimeEnabled] = useState(true);
  const [analyticsData, setAnalyticsData] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [filterType, setFilterType] = useState('all');
  const [viewMode, setViewMode] = useState('overview'); // overview, detailed, comparison

  // Time range options
  const TIME_RANGES = {
    '1hour': { label: '1 Hour', days: 0, hours: 1 },
    '24hours': { label: '24 Hours', days: 1, hours: 0 },
    '7days': { label: '7 Days', days: 7, hours: 0 },
    '30days': { label: '30 Days', days: 30, hours: 0 },
    '90days': { label: '3 Months', days: 90, hours: 0 },
    '1year': { label: '1 Year', days: 365, hours: 0 }
  };

  // Metric categories
  const METRIC_TYPES = {
    'all': { label: 'All Metrics', color: 'blue' },
    'threats': { label: 'Threat Detection', color: 'red' },
    'misinformation': { label: 'Misinformation', color: 'orange' },
    'performance': { label: 'Performance', color: 'green' },
    'users': { label: 'User Activity', color: 'purple' },
    'accuracy': { label: 'AI Accuracy', color: 'indigo' }
  };

  // Process real analysis data or fallback to mock
const processAnalyticsData = () => {
  // If we have real analysis data, process it
  if (analysisData && analysisData.length > 0) {
    const now = new Date();
    
    // Create hourly buckets for last 24 hours
    const hourlyData = Array.from({ length: 24 }, (_, i) => {
      const hour = new Date(now.getTime() - (23 - i) * 60 * 60 * 1000);
      return {
        time: `${String(hour.getHours()).padStart(2, '0')}:00`,
        threats: 0,
        analyses: 0,
        blocked: 0,
        accuracy: 0
      };
    });

    // Process real analysis data into hourly buckets
    analysisData.forEach(analysis => {
      const analysisHour = new Date(analysis.timestamp).getHours();
      const bucket = hourlyData.find(h => h.time === `${String(analysisHour).padStart(2, '0')}:00`);
      if (bucket) {
        bucket.analyses++;
        if (analysis.overallTreatLevel === 'HIGH' || analysis.overallTreatLevel === 'CRITICAL') {
          bucket.threats++;
        }
        if (analysis.recommendation === 'block') {
          bucket.blocked++;
        }
        bucket.accuracy += (analysis.confidence || 0);
      }
    });

    // Calculate averages
    hourlyData.forEach(bucket => {
      if (bucket.analyses > 0) {
        bucket.accuracy = (bucket.accuracy / bucket.analyses) * 100;
      }
    });

    return {
      // Real overview metrics
      totalAnalyses: analysisData.length,
      threatsDetected: analysisData.filter(a => 
        a.overallTreatLevel === 'HIGH' || a.overallTreatLevel === 'CRITICAL'
      ).length,
      threatsBlocked: analysisData.filter(a => a.recommendation === 'block').length,
      accuracyRate: analysisData.length > 0 
        ? (analysisData.reduce((sum, a) => sum + (a.confidence || 0), 0) / analysisData.length) * 100
        : 0,
      activeUsers: 12847 + Math.floor(Math.random() * 200), // Keep mock for now
      
      // Real time series data
      timeSeriesData: hourlyData,
      
      // Keep other sections as mock for now (you can process these later)
      threatCategories: [
        { name: 'Phishing', count: 5847 + Math.floor(Math.random() * 100), trend: 'up' },
        { name: 'Romance Scams', count: 3492 + Math.floor(Math.random() * 50), trend: 'up' },
        { name: 'Investment Fraud', count: 2941 + Math.floor(Math.random() * 75), trend: 'down' },
        { name: 'Tech Support Scams', count: 2156 + Math.floor(Math.random() * 40), trend: 'stable' },
        { name: 'Health Misinformation', count: 1847 + Math.floor(Math.random() * 30), trend: 'up' },
        { name: 'Political Disinformation', count: 1634 + Math.floor(Math.random() * 25), trend: 'down' }
      ],
      
      geographicData: [
        { country: 'United States', threats: 4234, blocked: 4102 },
        { country: 'United Kingdom', threats: 2156, blocked: 2089 },
        { country: 'Canada', threats: 1847, blocked: 1791 },
        { country: 'Australia', threats: 1456, blocked: 1398 },
        { country: 'Germany', threats: 1298, blocked: 1245 },
        { country: 'France', threats: 1147, blocked: 1098 }
      ],
      
      platformData: [
        { platform: 'Web Browser', percentage: 68.4, threats: 12459 },
        { platform: 'Mobile App', percentage: 23.7, threats: 4312 },
        { platform: 'API Integration', percentage: 7.9, threats: 1623 }
      ],
      
      modelPerformance: [
        { model: 'XIST-GPT-4o', accuracy: 97.2, speed: 1.2, threats: 8934 },
        { model: 'XIST-Claude-3', accuracy: 96.8, speed: 0.9, threats: 7123 },
        { model: 'XIST-Gemini-Pro', accuracy: 95.9, speed: 1.5, threats: 2337 }
      ]
    };
  }
  
  // Fallback to mock data when no real analysis data
  return generateMockAnalytics();
};


// Keep original generateMockAnalytics for fallback
const generateMockAnalytics = () => {
  const now = new Date();
  
  return {
    totalAnalyses: 245689 + Math.floor(Math.random() * 1000),
    threatsDetected: 18394 + Math.floor(Math.random() * 100),
    threatsBlocked: 17892 + Math.floor(Math.random() * 100),
    accuracyRate: 96.8 + (Math.random() * 0.4 - 0.2),
    activeUsers: 12847 + Math.floor(Math.random() * 200),
    
    timeSeriesData: Array.from({ length: 24 }, (_, i) => ({
      time: `${String(now.getHours() - 23 + i).padStart(2, '0')}:00`,
      threats: Math.floor(Math.random() * 50) + 10,
      analyses: Math.floor(Math.random() * 200) + 50,
      blocked: Math.floor(Math.random() * 45) + 8,
      accuracy: 94 + Math.random() * 6
    })),
    
    // ... rest of original mock data
  };
};


  // Real-time data updates
  useEffect(() => {
   const generateInitialData = () => {
  setAnalyticsData(processAnalyticsData());
  setIsLoading(false);
  setLastUpdated(new Date());
};

    generateInitialData();

    let interval;
    if (isRealTimeEnabled) {
      interval = setInterval(() => {
  setAnalyticsData(processAnalyticsData());
  setLastUpdated(new Date());
}, 5000);
 // Update every 5 seconds
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [selectedTimeRange, isRealTimeEnabled]);

  // Filtered metrics based on selection
  const filteredMetrics = useMemo(() => {
    if (!analyticsData.timeSeriesData) return [];
    
    return analyticsData.timeSeriesData.map(item => {
      switch (selectedMetric) {
        case 'threats':
          return { ...item, value: item.threats, label: 'Threats Detected' };
        case 'analyses':
          return { ...item, value: item.analyses, label: 'Total Analyses' };
        case 'accuracy':
          return { ...item, value: item.accuracy, label: 'Accuracy Rate' };
        default:
          return { ...item, value: item.threats, label: 'All Metrics' };
      }
    });
  }, [analyticsData.timeSeriesData, selectedMetric]);

  // Export analytics data
  const exportAnalytics = (format) => {
    const exportData = {
      exportDate: new Date().toISOString(),
      timeRange: selectedTimeRange,
      data: analyticsData
    };
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `xist-analytics-${selectedTimeRange}-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    showNotification(`📊 Analytics exported as ${format.toUpperCase()}`, 'success');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900/20 dark:to-purple-900/20 py-8">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-center min-h-[60vh]">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full"
            />
            <span className="ml-4 text-xl font-semibold text-gray-700 dark:text-gray-300">
              Loading Analytics Dashboard...
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-6 space-y-8">
        
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8"
        >
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-6 lg:space-y-0">
            <div className="flex items-center space-x-4">
              <div className="p-4  rounded-2xl">
                <ChartBarIcon className="w-12 h-12 text-purple-600" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  Analytics Dashboard
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                  Real-time threat intelligence and performance metrics
                </p>
                <div className="flex items-center space-x-4 mt-2">
                  <div className="flex items-center space-x-2">
                    <div className={`w-2 h-2 rounded-full ${isRealTimeEnabled ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`} />
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {isRealTimeEnabled ? 'Live Updates' : 'Static Data'}
                    </span>
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    Last updated: {lastUpdated.toLocaleTimeString()}
                  </div>
                </div>
              </div>
            </div>

            {/* Controls */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-3 sm:space-y-0 sm:space-x-3">
              {/* Time Range Selector */}
              <select
                value={selectedTimeRange}
                onChange={(e) => setSelectedTimeRange(e.target.value)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {Object.entries(TIME_RANGES).map(([key, range]) => (
                  <option key={key} value={key}>{range.label}</option>
                ))}
              </select>

              {/* Metric Filter */}
              <select
                value={selectedMetric}
                onChange={(e) => setSelectedMetric(e.target.value)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Metrics</option>
                <option value="threats">Threats</option>
                <option value="analyses">Analyses</option>
                <option value="accuracy">Accuracy</option>
              </select>

              {/* Real-time Toggle */}
              <motion.button
                onClick={() => setIsRealTimeEnabled(!isRealTimeEnabled)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all ${
                  isRealTimeEnabled 
                    ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400' 
                    : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <WifiIcon className={`w-4 h-4 ${isRealTimeEnabled ? 'animate-pulse' : ''}`} />
                <span>{isRealTimeEnabled ? 'Live' : 'Static'}</span>
              </motion.button>

              {/* Export Button */}
              <motion.button
                onClick={() => exportAnalytics('json')}
                className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <ArrowDownTrayIcon className="w-4 h-4" />
                <span>Export</span>
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Key Metrics Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 lg:grid-cols-5 gap-6"
        >
          {[
            {
              title: 'Total Analyses',
              value: analyticsData.totalAnalyses?.toLocaleString(),
              change: '+12.5%',
              trend: 'up',
              icon: MagnifyingGlassIcon,
              color: 'blue'
            },
            {
              title: 'Threats Detected',
              value: analyticsData.threatsDetected?.toLocaleString(),
              change: '+8.3%',
              trend: 'up',
              icon: ExclamationTriangleIcon,
              color: 'red'
            },
            {
              title: 'Threats Blocked',
              value: analyticsData.threatsBlocked?.toLocaleString(),
              change: '+9.1%',
              trend: 'up',
              icon: ShieldCheckIcon,
              color: 'green'
            },
            {
              title: 'Accuracy Rate',
              value: `${analyticsData.accuracyRate?.toFixed(1)}%`,
              change: '+0.3%',
              trend: 'up',
              icon: SparklesIcon,
              color: 'purple'
            },
            {
              title: 'Active Users',
              value: analyticsData.activeUsers?.toLocaleString(),
              change: '+15.7%',
              trend: 'up',
              icon: UserGroupIcon,
              color: 'indigo'
            }
          ].map((metric, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 + index * 0.05 }}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg bg-gradient-to-r ${
                  metric.color === 'blue' ? 'from-blue-500 to-blue-600' :
                  metric.color === 'red' ? 'from-red-500 to-red-600' :
                  metric.color === 'green' ? 'from-green-500 to-green-600' :
                  metric.color === 'purple' ? 'from-purple-500 to-purple-600' :
                  'from-indigo-500 to-indigo-600'
                }`}>
                  <metric.icon className="w-6 h-6 text-white" />
                </div>
                <div className={`flex items-center space-x-1 text-sm font-medium ${
                  metric.trend === 'up' ? 'text-green-600 dark:text-green-400' :
                  metric.trend === 'down' ? 'text-red-600 dark:text-red-400' :
                  'text-gray-600 dark:text-gray-400'
                }`}>
                  {metric.trend === 'up' ? (
                    <ArrowTrendingUpIcon className="w-4 h-4" />
                  ) : metric.trend === 'down' ? (
                    <ArrowTrendingDownIcon  className="w-4 h-4" />
                  ) : (
                    <div className="w-4 h-4 bg-gray-400 rounded-full" />
                  )}
                  <span>{metric.change}</span>
                </div>
              </div>
              <div className="space-y-1">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {metric.value}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {metric.title}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Real-time Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Real-time Threat Detection
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Live monitoring of threat detection across the last 24 hours
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span>Threats</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span>Analyses</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span>Blocked</span>
              </div>
            </div>
          </div>

          {/* Simple Chart Visualization */}
          <div className="h-80 flex items-end justify-between space-x-2">
            {analyticsData.timeSeriesData?.map((dataPoint, index) => {
              const maxValue = Math.max(
                ...analyticsData.timeSeriesData.map(d => Math.max(d.threats, d.analyses / 4, d.blocked))
              );
              
              return (
                <div key={index} className="flex-1 flex flex-col items-center space-y-2">
                  <div className="flex flex-col items-center justify-end h-64 space-y-1">
                    {/* Analyses bar */}
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: `${(dataPoint.analyses / 4 / maxValue) * 240}px` }}
                      transition={{ delay: index * 0.05, duration: 0.8 }}
                      className="w-full bg-gradient-to-t from-blue-400 to-blue-500 rounded-t opacity-60 min-h-[4px]"
                      title={`Analyses: ${dataPoint.analyses}`}
                    />
                    
                    {/* Threats bar */}
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: `${(dataPoint.threats / maxValue) * 240}px` }}
                      transition={{ delay: index * 0.05, duration: 0.8 }}
                      className="w-full bg-gradient-to-t from-red-400 to-red-500 rounded-t min-h-[4px]"
                      title={`Threats: ${dataPoint.threats}`}
                    />
                    
                    {/* Blocked bar */}
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: `${(dataPoint.blocked / maxValue) * 240}px` }}
                      transition={{ delay: index * 0.05, duration: 0.8 }}
                      className="w-full bg-gradient-to-t from-green-400 to-green-500 rounded-t min-h-[4px]"
                      title={`Blocked: ${dataPoint.blocked}`}
                    />
                  </div>
                  
                  <div className="text-xs text-gray-500 dark:text-gray-400 transform -rotate-45 origin-left">
                    {dataPoint.time}
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Threat Categories & Geographic Distribution */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Threat Categories */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Threat Categories
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  Distribution of detected threats by category
                </p>
              </div>
              <FireIcon className="w-8 h-8 text-red-500" />
            </div>

            <div className="space-y-4">
              {analyticsData.threatCategories?.map((category, index) => {
                const maxCount = Math.max(...analyticsData.threatCategories.map(c => c.count));
                const percentage = (category.count / maxCount) * 100;
                
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + index * 0.05 }}
                    className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                  >
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-gray-900 dark:text-white">
                          {category.name}
                        </span>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-bold text-gray-700 dark:text-gray-300">
                            {category.count.toLocaleString()}
                          </span>
                          {category.trend === 'up' ? (
                            <ArrowTrendingUpIcon className="w-4 h-4 text-red-500" />
                          ) : category.trend === 'down' ? (
                            <ArrowTrendingDownIcon  className="w-4 h-4 text-green-500" />
                          ) : (
                            <div className="w-4 h-4 bg-gray-400 rounded-full" />
                          )}
                        </div>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${percentage}%` }}
                          transition={{ delay: 0.2 + index * 0.05, duration: 1 }}
                          className="h-2 rounded-full bg-gradient-to-r from-red-500 to-red-600"
                        />
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          {/* Geographic Distribution */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Global Threat Map
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  Geographic distribution of threats detected
                </p>
              </div>
              <GlobeAltIcon className="w-8 h-8 text-blue-500" />
            </div>

            <div className="space-y-4">
              {analyticsData.geographicData?.map((country, index) => {
                const blockRate = (country.blocked / country.threats) * 100;
                
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 + index * 0.05 }}
                    className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
                  >
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-gray-900 dark:text-white">
                          {country.country}
                        </span>
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          {country.threats.toLocaleString()} threats
                        </span>
                      </div>
                      <div className="flex items-center space-x-4 text-sm">
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                          <span className="text-gray-600 dark:text-gray-400">
                            Detected: {country.threats.toLocaleString()}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span className="text-gray-600 dark:text-gray-400">
                            Blocked: {country.blocked.toLocaleString()} ({blockRate.toFixed(1)}%)
                          </span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </div>

        {/* Platform Analytics & AI Model Performance */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Platform Distribution */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Platform Usage
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  Distribution across different platforms
                </p>
              </div>
              <DevicePhoneMobileIcon className="w-8 h-8 text-green-500" />
            </div>

            <div className="space-y-6">
              {analyticsData.platformData?.map((platform, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 + index * 0.1 }}
                  className="flex items-center space-x-4"
                >
                  <div className={`p-3 rounded-lg ${
                    platform.platform === 'Web Browser' ? 'bg-blue-100 dark:bg-blue-900/20' :
                    platform.platform === 'Mobile App' ? 'bg-green-100 dark:bg-green-900/20' :
                    'bg-purple-100 dark:bg-purple-900/20'
                  }`}>
                    {platform.platform === 'Web Browser' ? (
                      <ComputerDesktopIcon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                    ) : platform.platform === 'Mobile App' ? (
                      <DevicePhoneMobileIcon className="w-6 h-6 text-green-600 dark:text-green-400" />
                    ) : (
                      <ServerIcon className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-gray-900 dark:text-white">
                        {platform.platform}
                      </span>
                      <span className="text-sm font-bold text-gray-700 dark:text-gray-300">
                        {platform.percentage}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2 mb-1">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${platform.percentage}%` }}
                        transition={{ delay: 0.3 + index * 0.1, duration: 1 }}
                        className={`h-2 rounded-full ${
                          platform.platform === 'Web Browser' ? 'bg-gradient-to-r from-blue-500 to-blue-600' :
                          platform.platform === 'Mobile App' ? 'bg-gradient-to-r from-green-500 to-green-600' :
                          'bg-gradient-to-r from-purple-500 to-purple-600'
                        }`}
                      />
                    </div>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {platform.threats.toLocaleString()} threats detected
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* AI Model Performance */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  AI Model Performance
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  Comparison of different AI models
                </p>
              </div>
              <CpuChipIcon className="w-8 h-8 text-purple-500" />
            </div>

            <div className="space-y-6">
              {analyticsData.modelPerformance?.map((model, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + index * 0.1 }}
                  className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-medium text-gray-900 dark:text-white">
                      {model.model}
                    </span>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {model.threats.toLocaleString()} detections
                    </span>
                  </div>
                  
                  <div className="space-y-3">
                    {/* Accuracy */}
                    <div>
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span className="text-gray-600 dark:text-gray-400">Accuracy</span>
                        <span className="font-bold text-gray-900 dark:text-white">{model.accuracy}%</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${model.accuracy}%` }}
                          transition={{ delay: 0.3 + index * 0.1, duration: 1 }}
                          className="h-2 rounded-full bg-gradient-to-r from-green-500 to-emerald-600"
                        />
                      </div>
                    </div>
                    
                    {/* Speed */}
                    <div>
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span className="text-gray-600 dark:text-gray-400">Speed</span>
                        <span className="font-bold text-gray-900 dark:text-white">{model.speed}s avg</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${100 - (model.speed * 20)}%` }}
                          transition={{ delay: 0.4 + index * 0.1, duration: 1 }}
                          className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-cyan-600"
                        />
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Real-time Activity Feed */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Live Activity Feed
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Real-time threat detection events
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-gray-600 dark:text-gray-400">Live</span>
            </div>
          </div>

          <div className="space-y-3 max-h-64 overflow-y-auto">
            {Array.from({ length: 8 }, (_, index) => {
              const activities = [
                { type: 'threat_blocked', message: 'Phishing attempt blocked from suspicious domain', severity: 'high', time: `${index + 1} min ago` },
                { type: 'analysis_complete', message: 'Bulk analysis completed: 247 items processed', severity: 'info', time: `${index + 2} min ago` },
                { type: 'threat_detected', message: 'Romance scam pattern identified in email content', severity: 'medium', time: `${index + 3} min ago` },
                { type: 'user_alert', message: 'User reported suspicious investment offer', severity: 'warning', time: `${index + 4} min ago` }
              ];
              const activity = activities[index % 4];
              
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center space-x-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                >
                  <div className={`w-3 h-3 rounded-full ${
                    activity.severity === 'high' ? 'bg-red-500' :
                    activity.severity === 'medium' ? 'bg-orange-500' :
                    activity.severity === 'warning' ? 'bg-yellow-500' :
                    'bg-blue-500'
                  }`} />
                  <div className="flex-1">
                    <p className="text-sm text-gray-900 dark:text-white">{activity.message}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{activity.time}</p>
                  </div>
                  <div className={`px-2 py-1 rounded text-xs font-medium ${
                    activity.severity === 'high' ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400' :
                    activity.severity === 'medium' ? 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400' :
                    activity.severity === 'warning' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400' :
                    'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
                  }`}>
                    {activity.type.replace('_', ' ')}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Recent Analysis Results - NEW SECTION */}
        {analysisData && analysisData.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1 }}
            className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-lg"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                <DocumentTextIcon className="w-5 h-5 mr-2 text-blue-500" />
                Recent Analysis Results
              </h3>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Last {Math.min(analysisData.length, 5)} analyses
              </span>
            </div>
            
            <div className="space-y-3">
              {analysisData.slice(0, 5).map((analysis, index) => (
                <div
                  key={analysis.analysisId || index}
                  className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg analysis-result-item border-l-4 border-blue-400"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <span className={`text-xs font-medium px-2 py-1 rounded-full ${getThreatColor(analysis.threatLevel)}`}>
                        {analysis.threatLevel || 'UNKNOWN'}
                      </span>
                      <span className="text-xs text-gray-600 dark:text-gray-400">
                        Mode: {analysis.analysisMode || 'standard'}
                      </span>
                    </div>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {analysis.timestamp ? new Date(analysis.timestamp).toLocaleDateString() : 'Recent'}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-700 dark:text-gray-300">
                      Confidence: <span className="font-semibold">{analysis.confidence || 0}%</span>
                    </span>
                    <span className="text-gray-500 dark:text-gray-400">
                      {analysis.responseTime ? `${Math.round(analysis.responseTime)}ms` : 'N/A'}
                    </span>
                  </div>
                  
                  {analysis.quickSummary && (
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-2 line-clamp-2">
                      {analysis.quickSummary}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        )}

      </div>
    </div>
  );
};

export default AnalyticsSection;
