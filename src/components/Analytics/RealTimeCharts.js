import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  Filler
} from 'chart.js';
import { Line, Bar, Doughnut, Radar } from 'react-chartjs-2';
import {
  ChartBarIcon,
  GlobeAltIcon,
  ExclamationTriangleIcon,
  ClockIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon
} from '@heroicons/react/24/outline';
import Card from '../UI/Card';
import analyticsEngine from '../../services/analyticsEngine';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  Filler
);

const RealTimeCharts = ({ user, theme }) => {
  const [analyticsData, setAnalyticsData] = useState(null);
  const [isLive, setIsLive] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(null);
  const chartRefs = useRef({});

  useEffect(() => {
    // Start real-time updates
    analyticsEngine.startRealTimeUpdates();
    setIsLive(true);

    // Listen for data updates
    const handleDataUpdate = (update) => {
      setAnalyticsData(update.data);
      setLastUpdate(update.timestamp);
    };

    analyticsEngine.on('dataUpdate', handleDataUpdate);

    // Cleanup
    return () => {
      analyticsEngine.stopRealTimeUpdates();
      analyticsEngine.off('dataUpdate', handleDataUpdate);
      setIsLive(false);
    };
  }, []);

  // CHART CONFIGURATIONS
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          usePointStyle: true,
          padding: 20,
          color: theme === 'dark' ? '#E5E7EB' : '#374151'
        }
      },
      tooltip: {
        mode: 'index',
        intersect: false,
        backgroundColor: theme === 'dark' ? '#1F2937' : '#FFFFFF',
        titleColor: theme === 'dark' ? '#E5E7EB' : '#111827',
        bodyColor: theme === 'dark' ? '#E5E7EB' : '#111827',
        borderColor: theme === 'dark' ? '#374151' : '#E5E7EB',
        borderWidth: 1
      }
    },
    scales: {
      x: {
        grid: {
          color: theme === 'dark' ? '#374151' : '#F3F4F6'
        },
        ticks: {
          color: theme === 'dark' ? '#9CA3AF' : '#6B7280'
        }
      },
      y: {
        grid: {
          color: theme === 'dark' ? '#374151' : '#F3F4F6'
        },
        ticks: {
          color: theme === 'dark' ? '#9CA3AF' : '#6B7280'
        }
      }
    },
    animation: {
      duration: 1000,
      easing: 'easeInOutQuart'
    }
  };

  // DAILY SCANS LINE CHART
  const dailyScansData = {
    labels: analyticsData?.dailyScans?.map(item => 
      `${item.hour.toString().padStart(2, '0')}:00`
    ) || [],
    datasets: [
      {
        label: 'Scans',
        data: analyticsData?.dailyScans?.map(item => item.scans) || [],
        borderColor: '#8B5CF6',
        backgroundColor: 'rgba(139, 92, 246, 0.1)',
        fill: true,
        tension: 0.4,
        pointRadius: 4,
        pointHoverRadius: 6,
        pointBackgroundColor: '#8B5CF6',
        pointBorderColor: '#FFFFFF',
        pointBorderWidth: 2
      },
      {
        label: 'Threats',
        data: analyticsData?.dailyScans?.map(item => item.threats) || [],
        borderColor: '#EF4444',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        fill: true,
        tension: 0.4,
        pointRadius: 4,
        pointHoverRadius: 6,
        pointBackgroundColor: '#EF4444',
        pointBorderColor: '#FFFFFF',
        pointBorderWidth: 2
      }
    ]
  };

  // THREATS BY TYPE DOUGHNUT CHART
  const threatsByTypeData = {
    labels: Object.keys(analyticsData?.threatsByType || {}),
    datasets: [
      {
        data: Object.values(analyticsData?.threatsByType || {}),
        backgroundColor: [
          '#EF4444', '#F97316', '#EAB308', '#22C55E', '#3B82F6',
          '#8B5CF6', '#EC4899', '#06B6D4', '#84CC16'
        ],
        borderColor: theme === 'dark' ? '#1F2937' : '#FFFFFF',
        borderWidth: 2,
        hoverBorderWidth: 3,
        hoverOffset: 10
      }
    ]
  };

  // RISK TRENDS BAR CHART
  const riskTrendsData = {
    labels: analyticsData?.riskTrends?.map(item => {
      const date = new Date(item.date);
      return date.toLocaleDateString('en-US', { weekday: 'short' });
    }) || [],
    datasets: [
      {
        label: 'Risk Score',
        data: analyticsData?.riskTrends?.map(item => item.riskScore) || [],
        backgroundColor: analyticsData?.riskTrends?.map(item => {
          if (item.riskScore > 70) return '#EF4444';
          if (item.riskScore > 50) return '#F97316';
          if (item.riskScore > 30) return '#EAB308';
          return '#22C55E';
        }) || [],
        borderRadius: 8,
        borderSkipped: false
      }
    ]
  };

  // PERFORMANCE METRICS RADAR CHART
  const performanceData = {
    labels: ['Response Time', 'Success Rate', 'Uptime', 'Accuracy', 'Speed'],
    datasets: [
      {
        label: 'Current Performance',
        data: [
          Math.max(0, 100 - (analyticsData?.performanceMetrics?.avgResponseTime || 1) * 20),
          analyticsData?.performanceMetrics?.successRate || 98,
          analyticsData?.performanceMetrics?.uptime || 99,
          95, // Mock accuracy
          90  // Mock speed
        ],
        backgroundColor: 'rgba(139, 92, 246, 0.2)',
        borderColor: '#8B5CF6',
        pointBackgroundColor: '#8B5CF6',
        pointBorderColor: '#FFFFFF',
        pointHoverBackgroundColor: '#FFFFFF',
        pointHoverBorderColor: '#8B5CF6',
        borderWidth: 2
      }
    ]
  };

  if (!analyticsData) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading real-time analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      {/* LIVE STATUS HEADER */}
      <Card className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${isLive ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`}></div>
              <span className="font-semibold text-green-800 dark:text-green-200">
                {isLive ? 'LIVE' : 'OFFLINE'}
              </span>
            </div>
            <span className="text-sm text-green-700 dark:text-green-300">
              Real-time Threat Monitoring Active
            </span>
          </div>
          <div className="text-sm text-green-600 dark:text-green-400">
            Last Update: {lastUpdate ? new Date(lastUpdate).toLocaleTimeString() : 'Never'}
          </div>
        </div>
      </Card>

      {/* QUICK STATS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700"
        >
          <div className="flex items-center justify-between mb-2">
            <ChartBarIcon className="w-6 h-6 text-blue-600" />
            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">ACTIVE</span>
          </div>
          <div className="text-2xl font-bold text-blue-600">{analyticsData.activeScans}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Active Scans</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700"
        >
          <div className="flex items-center justify-between mb-2">
            <ExclamationTriangleIcon className="w-6 h-6 text-red-600" />
            <ArrowTrendingUpIcon className="w-4 h-4 text-red-600" />
          </div>
          <div className="text-2xl font-bold text-red-600">{analyticsData.threatsDetected}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Threats Detected</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700"
        >
          <div className="flex items-center justify-between mb-2">
            <ClockIcon className="w-6 h-6 text-green-600" />
            <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">FAST</span>
          </div>
          <div className="text-2xl font-bold text-green-600">
            {analyticsData.performanceMetrics.avgResponseTime.toFixed(1)}s
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Avg Response</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700"
        >
          <div className="flex items-center justify-between mb-2">
            <GlobeAltIcon className="w-6 h-6 text-purple-600" />
            <ArrowTrendingDownIcon className="w-4 h-4 text-green-600" />
          </div>
          <div className="text-2xl font-bold text-purple-600">
            {analyticsData.performanceMetrics.successRate.toFixed(1)}%
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Success Rate</div>
        </motion.div>
      </div>

      {/* CHARTS GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* DAILY SCANS CHART */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <ChartBarIcon className="w-5 h-5 mr-2 text-blue-600" />
            24-Hour Activity
          </h3>
          <div className="h-64">
            <Line 
              ref={ref => chartRefs.current.dailyScans = ref}
              data={dailyScansData} 
              options={chartOptions} 
            />
          </div>
        </Card>

        {/* THREATS BY TYPE CHART */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <ExclamationTriangleIcon className="w-5 h-5 mr-2 text-red-600" />
            Threat Categories
          </h3>
          <div className="h-64">
            <Doughnut 
              ref={ref => chartRefs.current.threatsByType = ref}
              data={threatsByTypeData} 
              options={{
                ...chartOptions,
                scales: undefined,
                plugins: {
                  ...chartOptions.plugins,
                  legend: {
                    position: 'bottom',
                    labels: {
                      padding: 10,
                      usePointStyle: true,
                      color: theme === 'dark' ? '#E5E7EB' : '#374151'
                    }
                  }
                }
              }} 
            />
          </div>
        </Card>

        {/* RISK TRENDS CHART */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <ArrowTrendingUpIcon className="w-5 h-5 mr-2 text-orange-600" />
            Weekly Risk Trends
          </h3>
          <div className="h-64">
            <Bar 
              ref={ref => chartRefs.current.riskTrends = ref}
              data={riskTrendsData} 
              options={chartOptions} 
            />
          </div>
        </Card>

        {/* PERFORMANCE RADAR */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <GlobeAltIcon className="w-5 h-5 mr-2 text-purple-600" />
            System Performance
          </h3>
          <div className="h-64">
            <Radar 
              ref={ref => chartRefs.current.performance = ref}
              data={performanceData} 
              options={{
                ...chartOptions,
                scales: {
                  r: {
                    angleLines: {
                      color: theme === 'dark' ? '#374151' : '#E5E7EB'
                    },
                    grid: {
                      color: theme === 'dark' ? '#374151' : '#E5E7EB'
                    },
                    pointLabels: {
                      color: theme === 'dark' ? '#9CA3AF' : '#6B7280'
                    },
                    ticks: {
                      color: theme === 'dark' ? '#9CA3AF' : '#6B7280'
                    }
                  }
                }
              }} 
            />
          </div>
        </Card>
      </div>

      {/* EXPORT OPTIONS */}
      <Card className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-white">Export Analytics Data</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">Download comprehensive analytics reports</p>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => {
                const data = analyticsEngine.exportAnalyticsData('json');
                const blob = new Blob([data], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `xist-analytics-${new Date().toISOString().split('T')[0]}.json`;
                a.click();
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
            >
              Export JSON
            </button>
            <button
              onClick={() => {
                const data = analyticsEngine.exportAnalyticsData('csv');
                const blob = new Blob([data], { type: 'text/csv' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `xist-analytics-${new Date().toISOString().split('T')[0]}.csv`;
                a.click();
              }}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
            >
              Export CSV
            </button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default RealTimeCharts;
