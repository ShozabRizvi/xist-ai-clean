import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
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

const AnalyticsSection = ({ analysisData = [], localAnalysisHistory = [], performanceMetrics = {} }) => {
  const { user } = useAuth();
  
  // State management
  const [selectedTimeRange, setSelectedTimeRange] = useState('24hours');
  const [selectedView, setSelectedView] = useState('personal'); // Focus on personal analytics
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

  // View modes (simplified to focus on real data)
  const VIEW_MODES = {
    'personal': { label: 'Your Analytics', icon: UserIcon, color: 'green' },
    'summary': { label: 'Summary View', icon: ChartBarIcon, color: 'blue' }
  };

  // Process user's real analysis data from Verify section
  const processPersonalAnalytics = () => {
    const now = new Date();
    const timeRange = TIME_RANGES[selectedTimeRange];
    const cutoffTime = new Date(now.getTime() - timeRange.hours * 60 * 60 * 1000);

    // Get all analysis data from both current session and stored history
    const allPersonalData = [
      ...analysisData,
      ...(localAnalysisHistory || [])
    ].filter(analysis => {
      return analysis && 
             analysis.timestamp && 
             new Date(analysis.timestamp) > cutoffTime;
    });

    // Create time buckets for visualization
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
        safe: 0,
        blocked: 0,
        accuracy: 0,
        accuracyCount: 0,
        phishing: 0,
        scams: 0,
        misinformation: 0,
        legitimate: 0,
        suspicious: 0
      };
    });

    // Process real analysis data into time buckets
    allPersonalData.forEach(analysis => {
      const analysisTime = new Date(analysis.timestamp);
      const bucketIndex = Math.floor((now.getTime() - analysisTime.getTime()) / bucketSize);
      const targetBucket = timeBuckets[bucketCount - 1 - bucketIndex];
      
      if (targetBucket && bucketIndex >= 0 && bucketIndex < bucketCount) {
        targetBucket.analyses++;

        // Categorize based on actual risk levels from Verify section
        const riskLevel = analysis.overallRiskLevel || analysis.riskLevel || 'UNKNOWN';
        
        if (riskLevel === 'HIGH' || riskLevel === 'CRITICAL') {
          targetBucket.threats++;
        } else if (riskLevel === 'MEDIUM' || riskLevel === 'SUSPICIOUS') {
          targetBucket.suspicious++;
        } else if (riskLevel === 'LOW' || riskLevel === 'SAFE') {
          targetBucket.safe++;
        }

        // Track blocked/flagged content
        if (analysis.recommendation === 'block' || 
            analysis.action === 'block' || 
            riskLevel === 'HIGH' || 
            riskLevel === 'CRITICAL') {
          targetBucket.blocked++;
        }

        // Add confidence/accuracy tracking
        const confidence = analysis.confidence || analysis.overallConfidence;
        if (confidence) {
          targetBucket.accuracy += typeof confidence === 'number' ? confidence : parseFloat(confidence) || 0.8;
          targetBucket.accuracyCount++;
        }

        // Categorize by actual analysis results
        const category = (analysis.category || analysis.type || '').toLowerCase();
        const summary = (analysis.summary || '').toLowerCase();
        const content = (analysis.inputText || analysis.content || '').toLowerCase();

        if (category.includes('phishing') || summary.includes('phishing') || content.includes('phishing')) {
          targetBucket.phishing++;
        } else if (category.includes('scam') || category.includes('fraud') || 
                   summary.includes('scam') || summary.includes('fraud')) {
          targetBucket.scams++;
        } else if (category.includes('misinformation') || category.includes('fake') ||
                   summary.includes('misinformation') || summary.includes('fake')) {
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

    // Calculate summary statistics
    const totalAnalyses = allPersonalData.length;
    const threatsDetected = allPersonalData.filter(a => 
      (a.overallRiskLevel === 'HIGH' || a.overallRiskLevel === 'CRITICAL') ||
      (a.riskLevel === 'HIGH' || a.riskLevel === 'CRITICAL')
    ).length;

    const threatsBlocked = allPersonalData.filter(a => 
      a.recommendation === 'block' || 
      a.action === 'block' ||
      a.overallRiskLevel === 'HIGH' ||
      a.overallRiskLevel === 'CRITICAL'
    ).length;

    const safeContent = allPersonalData.filter(a =>
      (a.overallRiskLevel === 'LOW' || a.overallRiskLevel === 'SAFE') ||
      (a.riskLevel === 'LOW' || a.riskLevel === 'SAFE')
    ).length;

    const averageAccuracy = totalAnalyses > 0 ? 
      Math.round(allPersonalData.reduce((sum, a) => {
        const confidence = a.confidence || a.overallConfidence || 0.8;
        return sum + (typeof confidence === 'number' ? confidence * 100 : parseFloat(confidence) * 100 || 80);
      }, 0) / totalAnalyses) : 0;

    return {
      totalAnalyses,
      threatsDetected,
      threatsBlocked,
      safeContent,
      suspiciousContent: totalAnalyses - threatsDetected - safeContent,
      averageAccuracy,
      timeSeriesData: timeBuckets,
      categoryData: getCategoryBreakdown(allPersonalData),
      performanceData: performanceMetrics,
      recentAnalyses: allPersonalData.slice(0, 10).map(analysis => ({
        id: analysis.id || Date.now(),
        timestamp: analysis.timestamp,
        type: analysis.category || analysis.type || 'Content Analysis',
        content: analysis.inputText || analysis.content || 'Analysis performed',
        riskLevel: analysis.overallRiskLevel || analysis.riskLevel || 'UNKNOWN',
        confidence: analysis.confidence || analysis.overallConfidence || 0.8,
        summary: analysis.summary || `Risk: ${analysis.overallRiskLevel || analysis.riskLevel || 'Unknown'}`,
        recommendation: analysis.recommendation || analysis.action
      }))
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
      const riskLevel = analysis.overallRiskLevel || analysis.riskLevel || 'Unknown';
      const category = analysis.category || analysis.type || 'General Analysis';
      
      const key = `${category} (${riskLevel})`;
      categories[key] = (categories[key] || 0) + 1;
    });

    return Object.entries(categories)
      .map(([name, count]) => ({ name, count, value: count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 8); // Show top 8 categories
  };

  // Process analytics data based on selected view
  const processAnalyticsData = () => {
    if (selectedView === 'personal' || selectedView === 'summary') {
      return processPersonalAnalytics();
    }
    return processPersonalAnalytics(); // Default to personal analytics
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
    if (isRealTimeEnabled && (analysisData.length > 0 || localAnalysisHistory.length > 0)) {
      interval = setInterval(updateData, 30000); // Update every 30 seconds when there's data
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
    purple: '#8b5cf6',
    safe: '#10b981',
    suspicious: '#f59e0b',
    threat: '#ef4444'
  };

  const CHART_COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];

  // Export function for real data
  const exportAnalytics = (format) => {
    const exportData = {
      exportDate: new Date().toISOString(),
      timeRange: selectedTimeRange,
      view: selectedView,
      userScope: user ? 'authenticated' : 'anonymous',
      totalDataPoints: analyticsData.totalAnalyses || 0,
      data: analyticsData,
      rawAnalysisData: analysisData.length > 0 ? analysisData : 'No analysis data available'
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

    showNotification(`📊 Analytics exported (${analyticsData.totalAnalyses || 0} analyses)`, 'success');
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full"
        />
        <span className="ml-3 text-gray-600 dark:text-gray-400">Loading your analytics...</span>
      </div>
    );
  }

  // No data state
  if (!analyticsData.totalAnalyses || analyticsData.totalAnalyses === 0) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="text-center py-12">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", duration: 0.6 }}
          >
            <ChartBarIcon className="w-24 h-24 mx-auto text-gray-400 mb-6" />
          </motion.div>
          
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            No Analysis Data Available
          </h2>
          
          <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
            Start analyzing content in the Verify section to see your analytics and insights here.
            Your analysis history will appear once you begin using Xist AI's verification tools.
          </p>
          
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6 max-w-lg mx-auto">
            <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-200 mb-3">
              📊 What you'll see here:
            </h3>
            <ul className="text-left text-blue-800 dark:text-blue-300 space-y-2">
              <li>• Real-time analysis statistics</li>
              <li>• Threat detection trends</li>
              <li>• Content safety metrics</li>
              <li>• Analysis accuracy rates</li>
              <li>• Category breakdowns</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  // Main render with real data
  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center">
            <ChartBarIcon className="w-8 h-8 mr-3 text-blue-600" />
            Your Analytics Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Real-time insights from your content analysis activity
          </p>
        </div>

        <div className="flex items-center gap-4">
          {/* Real-time toggle */}
          <div className="flex items-center gap-2">
            <motion.button
              onClick={() => setIsRealTimeEnabled(!isRealTimeEnabled)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                isRealTimeEnabled ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
              }`}
              whileTap={{ scale: 0.95 }}
            >
              <motion.span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  isRealTimeEnabled ? 'translate-x-6' : 'translate-x-1'
                }`}
                layout
              />
            </motion.button>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {isRealTimeEnabled && (
                <span className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse mr-1" />
                  Live
                </span>
              )}
            </span>
          </div>

          {/* Export button */}
          <motion.button
            onClick={() => exportAnalytics('json')}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <ArrowDownTrayIcon className="w-4 h-4" />
            Export
          </motion.button>
        </div>
      </div>

      {/* Time Range Selector */}
      <div className="flex flex-wrap gap-2">
        {Object.entries(TIME_RANGES).map(([key, range]) => (
          <motion.button
            key={key}
            onClick={() => setSelectedTimeRange(key)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              selectedTimeRange === key
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {range.label}
          </motion.button>
        ))}
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          {
            title: 'Total Analyses',
            value: analyticsData.totalAnalyses || 0,
            subtitle: `Last ${TIME_RANGES[selectedTimeRange].label.toLowerCase()}`,
            icon: DocumentTextIcon,
            color: 'blue',
            change: analyticsData.totalAnalyses > 0 ? '+' + analyticsData.totalAnalyses : '0'
          },
          {
            title: 'Threats Detected',
            value: analyticsData.threatsDetected || 0,
            subtitle: `${analyticsData.totalAnalyses > 0 ? Math.round((analyticsData.threatsDetected / analyticsData.totalAnalyses) * 100) : 0}% of total`,
            icon: ExclamationTriangleIcon,
            color: 'red',
            change: analyticsData.threatsDetected > 0 ? `${analyticsData.threatsDetected} flagged` : 'None detected'
          },
          {
            title: 'Safe Content',
            value: analyticsData.safeContent || 0,
            subtitle: `${analyticsData.totalAnalyses > 0 ? Math.round((analyticsData.safeContent / analyticsData.totalAnalyses) * 100) : 0}% verified safe`,
            icon: CheckCircleIcon,
            color: 'green',
            change: analyticsData.safeContent > 0 ? `${analyticsData.safeContent} verified` : 'None yet'
          },
          {
            title: 'Average Accuracy',
            value: `${analyticsData.averageAccuracy || 0}%`,
            subtitle: 'Confidence score',
            icon: SparklesIcon,
            color: 'purple',
            change: analyticsData.averageAccuracy >= 90 ? 'High confidence' : analyticsData.averageAccuracy >= 70 ? 'Good confidence' : 'Building confidence'
          }
        ].map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  {stat.title}
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                  {stat.value}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {stat.subtitle}
                </p>
              </div>
              <div className={`p-3 rounded-full bg-${stat.color}-100 dark:bg-${stat.color}-900/20`}>
                <stat.icon className={`w-6 h-6 text-${stat.color}-600`} />
              </div>
            </div>
            <div className="mt-4">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {stat.change}
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Analysis Timeline */}
      {analyticsData.timeSeriesData && analyticsData.timeSeriesData.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700"
        >
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
            Analysis Activity Timeline
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={analyticsData.timeSeriesData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
                <XAxis 
                  dataKey="time" 
                  stroke="#6b7280"
                  fontSize={12}
                />
                <YAxis stroke="#6b7280" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1f2937',
                    border: 'none',
                    borderRadius: '8px',
                    color: '#f9fafb'
                  }}
                />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="analyses"
                  stackId="1"
                  stroke={COLORS.primary}
                  fill={COLORS.primary}
                  fillOpacity={0.6}
                  name="Total Analyses"
                />
                <Area
                  type="monotone"
                  dataKey="threats"
                  stackId="2"
                  stroke={COLORS.danger}
                  fill={COLORS.danger}
                  fillOpacity={0.6}
                  name="Threats Detected"
                />
                <Area
                  type="monotone"
                  dataKey="safe"
                  stackId="3"
                  stroke={COLORS.secondary}
                  fill={COLORS.secondary}
                  fillOpacity={0.6}
                  name="Safe Content"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      )}

      {/* Category Breakdown */}
      {analyticsData.categoryData && analyticsData.categoryData.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700"
          >
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
              Content Categories
            </h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={analyticsData.categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {analyticsData.categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1f2937',
                      border: 'none',
                      borderRadius: '8px',
                      color: '#f9fafb'
                    }}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Recent Analyses */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700"
          >
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
              Recent Analysis Activity
            </h3>
            <div className="space-y-4 max-h-64 overflow-y-auto">
              {analyticsData.recentAnalyses && analyticsData.recentAnalyses.length > 0 ? (
                analyticsData.recentAnalyses.map((analysis, index) => (
                  <motion.div
                    key={analysis.id || index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          {analysis.type}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          analysis.riskLevel === 'HIGH' || analysis.riskLevel === 'CRITICAL' 
                            ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                            : analysis.riskLevel === 'MEDIUM' || analysis.riskLevel === 'SUSPICIOUS'
                            ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                            : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                        }`}>
                          {analysis.riskLevel}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                        {analysis.summary}
                      </p>
                      <div className="flex items-center gap-4 mt-1 text-xs text-gray-500 dark:text-gray-400">
                        <span>{new Date(analysis.timestamp).toLocaleTimeString()}</span>
                        <span>{Math.round((typeof analysis.confidence === 'number' ? analysis.confidence : parseFloat(analysis.confidence) || 0.8) * 100)}% confidence</span>
                      </div>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  <DocumentTextIcon className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>No recent analyses to display</p>
                  <p className="text-sm mt-1">Your analysis history will appear here</p>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}

      {/* Status Bar */}
      <div className="text-center text-sm text-gray-500 dark:text-gray-400">
        {isRealTimeEnabled && (
          <span className="inline-flex items-center mr-4">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse mr-2" />
            Live updates enabled
          </span>
        )}
        <span>Last updated: {lastUpdated.toLocaleTimeString()}</span>
        <span className="mx-2">•</span>
        <span>Showing real analysis data from Verify section</span>
      </div>
    </div>
  );
};

export default AnalyticsSection;
