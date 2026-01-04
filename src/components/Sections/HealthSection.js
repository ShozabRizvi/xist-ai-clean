import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HeartIcon, ShieldCheckIcon, ServerIcon, GlobeAltIcon, ChartBarIcon,
  ClockIcon, ExclamationTriangleIcon, CheckCircleIcon, XCircleIcon,
  BoltIcon, CpuChipIcon, CloudIcon, WifiIcon,  CircleStackIcon,
  ArrowTrendingUpIcon, ArrowTrendingDownIcon, InformationCircleIcon,
  BeakerIcon, Cog6ToothIcon, ArrowPathIcon, EyeIcon,
  CalendarIcon, MapPinIcon, UsersIcon, DocumentTextIcon,
  BellIcon, MegaphoneIcon, FireIcon, SparklesIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../../hooks/useAuth';
import { showNotification } from '../UI/NotificationToast';

const HealthSection = () => {
  const { user } = useAuth();
  
  
  const [activeTab, setActiveTab] = useState('overview');
  const [systemMetrics, setSystemMetrics] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [selectedIncident, setSelectedIncident] = useState(null);

  
  const [systemStatus, setSystemStatus] = useState({
    overall: 'operational',
    api: 'operational',
    dashboard: 'operational',
    database: 'operational',
    authentication: 'operational',
    cdn: 'operational',
    monitoring: 'operational'
  });

  
  const [performanceMetrics, setPerformanceMetrics] = useState({
    uptime: 99.97,
    responseTime: 142,
    throughput: 15847,
    errorRate: 0.03,
    activeUsers: 12456,
    totalRequests: 2456789
  });

  
  const REGIONS = [
    { 
      id: 'us-east-1', 
      name: 'US East (Virginia)', 
      status: 'operational',
      latency: 12,
      load: 67,
      incidents: 0
    },
    { 
      id: 'us-west-2', 
      name: 'US West (Oregon)', 
      status: 'operational',
      latency: 18,
      load: 73,
      incidents: 0
    },
    { 
      id: 'eu-west-1', 
      name: 'Europe (Ireland)', 
      status: 'operational',
      latency: 28,
      load: 61,
      incidents: 0
    },
    { 
      id: 'ap-southeast-1', 
      name: 'Asia Pacific (Singapore)', 
      status: 'degraded',
      latency: 45,
      load: 89,
      incidents: 1
    },
    { 
      id: 'ap-northeast-1', 
      name: 'Asia Pacific (Tokyo)', 
      status: 'operational',
      latency: 22,
      load: 58,
      incidents: 0
    }
  ];

  
  const SERVICE_COMPONENTS = [
    {
      name: 'API Gateway',
      status: 'operational',
      uptime: '99.98%',
      lastIncident: '2 days ago',
      description: 'Main API endpoints and request routing'
    },
    {
      name: 'Threat Analysis Engine',
      status: 'operational',
      uptime: '99.95%',
      lastIncident: '5 days ago',
      description: 'Core AI-powered threat detection system'
    },
    {
      name: 'User Authentication',
      status: 'operational',
      uptime: '100%',
      lastIncident: '15 days ago',
      description: 'User login and session management'
    },
    {
      name: 'Database Cluster',
      status: 'operational',
      uptime: '99.99%',
      lastIncident: '8 days ago',
      description: 'Primary data storage and analytics database'
    },
    {
      name: 'CDN & Static Assets',
      status: 'operational',
      uptime: '99.97%',
      lastIncident: '3 days ago',
      description: 'Content delivery network and static file serving'
    },
    {
      name: 'Real-time Monitoring',
      status: 'operational',
      uptime: '99.94%',
      lastIncident: '1 day ago',
      description: 'System health monitoring and alerting'
    }
  ];

  
  const INCIDENTS = [
    {
      id: 'inc-2025-09-15-001',
      title: 'Increased API Response Times in APAC Region',
      status: 'resolved',
      severity: 'minor',
      startTime: '2025-09-15T14:32:00Z',
      endTime: '2025-09-15T16:45:00Z',
      duration: '2h 13m',
      affectedServices: ['API Gateway', 'Threat Analysis Engine'],
      affectedRegions: ['ap-southeast-1'],
      description: 'Users in the Asia Pacific region experienced increased API response times due to high traffic volume.',
      resolution: 'Added additional capacity and optimized request routing algorithms.',
      updates: [
        { time: '2025-09-15T14:32:00Z', message: 'Investigating increased response times in APAC region', status: 'investigating' },
        { time: '2025-09-15T15:15:00Z', message: 'Issue identified: High traffic causing resource contention', status: 'identified' },
        { time: '2025-09-15T15:45:00Z', message: 'Scaling additional resources to handle load', status: 'monitoring' },
        { time: '2025-09-15T16:45:00Z', message: 'All systems restored to normal operation', status: 'resolved' }
      ]
    },
    {
      id: 'inc-2025-09-12-002',
      title: 'Brief Authentication Service Disruption',
      status: 'resolved',
      severity: 'minor',
      startTime: '2025-09-12T09:22:00Z',
      endTime: '2025-09-12T09:38:00Z',
      duration: '16m',
      affectedServices: ['User Authentication'],
      affectedRegions: ['us-east-1'],
      description: 'Some users experienced login difficulties due to authentication service instability.',
      resolution: 'Restarted authentication services and implemented additional monitoring.',
      updates: [
        { time: '2025-09-12T09:22:00Z', message: 'Users reporting login issues', status: 'investigating' },
        { time: '2025-09-12T09:30:00Z', message: 'Authentication service restart in progress', status: 'identified' },
        { time: '2025-09-12T09:38:00Z', message: 'All authentication services restored', status: 'resolved' }
      ]
    },
    {
      id: 'inc-2025-09-08-003',
      title: 'Planned Maintenance - Database Optimization',
      status: 'resolved',
      severity: 'maintenance',
      startTime: '2025-09-08T02:00:00Z',
      endTime: '2025-09-08T04:30:00Z',
      duration: '2h 30m',
      affectedServices: ['Database Cluster', 'API Gateway'],
      affectedRegions: ['all'],
      description: 'Scheduled maintenance for database performance optimization and security updates.',
      resolution: 'Maintenance completed successfully with improved query performance.',
      updates: [
        { time: '2025-09-08T02:00:00Z', message: 'Scheduled maintenance window started', status: 'maintenance' },
        { time: '2025-09-08T03:15:00Z', message: 'Database optimization 60% complete', status: 'maintenance' },
        { time: '2025-09-08T04:30:00Z', message: 'Maintenance completed, all systems operational', status: 'resolved' }
      ]
    }
  ];

  
  const SCHEDULED_MAINTENANCE = [
    {
      id: 'maint-2025-09-20-001',
      title: 'Security Update Deployment',
      description: 'Applying latest security patches and system updates across all regions.',
      startTime: '2025-09-20T03:00:00Z',
      endTime: '2025-09-20T05:00:00Z',
      duration: '2 hours',
      impact: 'Minimal - API may experience brief interruptions',
      affectedServices: ['All Services']
    },
    {
      id: 'maint-2025-09-25-001',
      title: 'AI Model Update',
      description: 'Deploying improved threat detection models with enhanced accuracy.',
      startTime: '2025-09-25T01:00:00Z',
      endTime: '2025-09-25T03:30:00Z',
      duration: '2.5 hours',
      impact: 'Low - Threat analysis may be temporarily slower',
      affectedServices: ['Threat Analysis Engine']
    }
  ];

  
  useEffect(() => {
    const updateMetrics = () => {
      setPerformanceMetrics(prev => ({
        uptime: Math.max(99.90, Math.min(100, prev.uptime + (Math.random() - 0.5) * 0.01)),
        responseTime: Math.max(50, Math.min(500, prev.responseTime + (Math.random() - 0.5) * 10)),
        throughput: Math.max(10000, prev.throughput + Math.floor((Math.random() - 0.5) * 1000)),
        errorRate: Math.max(0, Math.min(1, prev.errorRate + (Math.random() - 0.5) * 0.01)),
        activeUsers: Math.max(5000, prev.activeUsers + Math.floor((Math.random() - 0.5) * 500)),
        totalRequests: prev.totalRequests + Math.floor(Math.random() * 100)
      }));
      setLastUpdated(new Date());
    };

    setIsLoading(false);
    updateMetrics();

    const interval = setInterval(updateMetrics, 10000); 
    return () => clearInterval(interval);
  }, []);

  
  const getStatusColor = (status) => {
    switch (status) {
      case 'operational': return 'text-green-600 dark:text-green-400';
      case 'degraded': return 'text-yellow-600 dark:text-yellow-400';
      case 'partial': return 'text-orange-600 dark:text-orange-400';
      case 'major': return 'text-red-600 dark:text-red-400';
      default: return 'text-gray-600 dark:text-gray-400';
    }
  };

  const getStatusBg = (status) => {
    switch (status) {
      case 'operational': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'degraded': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'partial': return 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400';
      case 'major': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-400';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-green-900/20 dark:to-blue-900/20 py-8">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-center min-h-[60vh]">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full"
            />
            <span className="ml-4 text-xl font-semibold text-gray-700 dark:text-gray-300">
              Loading System Health...
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-green-900/20 dark:to-blue-900/20 py-8">
      <div className="max-w-7xl mx-auto px-6 space-y-8">
        
        {}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8"
        >
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-6 lg:space-y-0">
            <div className="flex items-center space-x-4">
              <div className="p-4 bg-gradient-to-r from-green-600 to-blue-600 rounded-2xl">
                <HeartIcon className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  System Health
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                  Real-time monitoring and status updates for all XIST AI services
                </p>
                <div className="flex items-center space-x-4 mt-2">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      All Systems Operational
                    </span>
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    Last updated: {lastUpdated.toLocaleTimeString()}
                  </div>
                </div>
              </div>
            </div>

            {}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-xl font-bold text-green-600 dark:text-green-400">
                  {performanceMetrics.uptime.toFixed(2)}%
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400">Uptime</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-blue-600 dark:text-blue-400">
                  {performanceMetrics.responseTime.toFixed(0)}ms
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400">Response</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-purple-600 dark:text-purple-400">
                  {performanceMetrics.activeUsers.toLocaleString()}
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400">Active Users</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-orange-600 dark:text-orange-400">
                  {performanceMetrics.errorRate.toFixed(2)}%
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400">Error Rate</div>
              </div>
            </div>
          </div>
        </motion.div>

        {}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-2"
        >
          <div className="flex flex-wrap gap-2">
            {[
              { id: 'overview', label: 'Overview', icon: HeartIcon },
              { id: 'services', label: 'Services', icon: ServerIcon },
              { id: 'regions', label: 'Regions', icon: GlobeAltIcon },
              { id: 'incidents', label: 'Incidents', icon: ExclamationTriangleIcon },
              { id: 'maintenance', label: 'Maintenance', icon: Cog6ToothIcon },
              { id: 'metrics', label: 'Metrics', icon: ChartBarIcon }
            ].map((tab) => (
              <motion.button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-xl font-medium transition-all text-sm ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-green-600 to-blue-600 text-white shadow-lg'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <tab.icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {}
        <AnimatePresence mode="wait">
          {}
          {activeTab === 'overview' && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              {}
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Current System Status
                  </h2>
                  <div className="flex items-center space-x-2">
                    <CheckCircleIcon className="w-6 h-6 text-green-500" />
                    <span className="text-lg font-semibold text-green-600 dark:text-green-400">
                      All Systems Operational
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {[
                    { name: 'API Services', status: 'operational', icon: ServerIcon, uptime: '99.98%' },
                    { name: 'Web Dashboard', status: 'operational', icon: GlobeAltIcon, uptime: '99.95%' },
                    { name: 'Authentication', status: 'operational', icon: ShieldCheckIcon, uptime: '100%' },
                    { name: 'Database', status: 'operational', icon: CircleStackIcon, uptime: '99.99%' }
                  ].map((service, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                      className="p-4 border border-gray-200 dark:border-gray-700 rounded-xl"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <service.icon className="w-6 h-6 text-gray-600 dark:text-gray-400" />
                        <div className={`w-3 h-3 rounded-full ${
                          service.status === 'operational' ? 'bg-green-500' : 'bg-yellow-500'
                        }`} />
                      </div>
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                        {service.name}
                      </h3>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        Uptime: <span className="font-medium">{service.uptime}</span>
                      </div>
                      <div className={`text-sm mt-1 capitalize ${getStatusColor(service.status)}`}>
                        {service.status}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  {
                    title: 'Average Response Time',
                    value: `${performanceMetrics.responseTime.toFixed(0)}ms`,
                    change: '-12ms from yesterday',
                    trend: 'down',
                    color: 'blue',
                    icon: BoltIcon
                  },
                  {
                    title: 'Request Throughput',
                    value: `${(performanceMetrics.throughput / 1000).toFixed(1)}K/min`,
                    change: '+2.3K from yesterday',
                    trend: 'up',
                    color: 'green',
                    icon: ArrowTrendingUpIcon
                  },
                  {
                    title: 'Error Rate',
                    value: `${performanceMetrics.errorRate.toFixed(3)}%`,
                    change: '-0.002% from yesterday',
                    trend: 'down',
                    color: 'red',
                    icon: ExclamationTriangleIcon
                  }
                ].map((metric, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 + index * 0.1 }}
                    className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className={`p-3 rounded-xl ${
                        metric.color === 'blue' ? 'bg-blue-100 dark:bg-blue-900/20' :
                        metric.color === 'green' ? 'bg-green-100 dark:bg-green-900/20' :
                        'bg-red-100 dark:bg-red-900/20'
                      }`}>
                        <metric.icon className={`w-6 h-6 ${
                          metric.color === 'blue' ? 'text-blue-600 dark:text-blue-400' :
                          metric.color === 'green' ? 'text-green-600 dark:text-green-400' :
                          'text-red-600 dark:text-red-400'
                        }`} />
                      </div>
                      <div className={`flex items-center space-x-1 text-sm ${
                        metric.trend === 'up' ? 'text-green-600 dark:text-green-400' :
                        'text-blue-600 dark:text-blue-400'
                      }`}>
                        {metric.trend === 'up' ? (
                          <ArrowTrendingUpIcon className="w-4 h-4" />
                        ) : (
                          <ArrowTrendingDownIcon className="w-4 h-4" />
                        )}
                        <span className="font-medium">Better</span>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                        {metric.value}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">
                        {metric.title}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {metric.change}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {}
          {activeTab === 'services' && (
            <motion.div
              key="services"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                  Service Components
                </h2>
                
                <div className="space-y-4">
                  {SERVICE_COMPONENTS.map((service, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-xl hover:shadow-lg transition-all"
                    >
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <div className={`w-3 h-3 rounded-full ${
                            service.status === 'operational' ? 'bg-green-500' :
                            service.status === 'degraded' ? 'bg-yellow-500' :
                            'bg-red-500'
                          }`} />
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                            {service.name}
                          </h3>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBg(service.status)}`}>
                            {service.status}
                          </span>
                        </div>
                        <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">
                          {service.description}
                        </p>
                        <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                          <span>Uptime: {service.uptime}</span>
                          <span>Last incident: {service.lastIncident}</span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {}
          {activeTab === 'regions' && (
            <motion.div
              key="regions"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                  Global Infrastructure Status
                </h2>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {REGIONS.map((region, index) => (
                    <motion.div
                      key={region.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="p-6 border border-gray-200 dark:border-gray-700 rounded-xl"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <div className={`w-4 h-4 rounded-full ${
                            region.status === 'operational' ? 'bg-green-500' :
                            region.status === 'degraded' ? 'bg-yellow-500' :
                            'bg-red-500'
                          }`} />
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                              {region.name}
                            </h3>
                            <span className={`text-sm capitalize ${getStatusColor(region.status)}`}>
                              {region.status}
                            </span>
                          </div>
                        </div>
                        {region.incidents > 0 && (
                          <div className="px-2 py-1 bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400 rounded-full text-xs">
                            {region.incidents} incident
                          </div>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-3 gap-4">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                            {region.latency}ms
                          </div>
                          <div className="text-xs text-gray-600 dark:text-gray-400">Latency</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                            {region.load}%
                          </div>
                          <div className="text-xs text-gray-600 dark:text-gray-400">Load</div>
                        </div>
                        <div className="text-center">
                          <div className={`text-2xl font-bold ${
                            region.incidents === 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                          }`}>
                            {region.incidents}
                          </div>
                          <div className="text-xs text-gray-600 dark:text-gray-400">Incidents</div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

                    {}
          {activeTab === 'incidents' && (
            <motion.div
              key="incidents"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Incident History
                  </h2>
                  <div className="flex items-center space-x-4">
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Last 30 days: <span className="font-medium">3 incidents</span>
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Avg resolution: <span className="font-medium">47 minutes</span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-6">
                  {INCIDENTS.map((incident, index) => (
                    <motion.div
                      key={incident.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="border border-gray-200 dark:border-gray-700 rounded-xl p-6 hover:shadow-lg transition-all cursor-pointer"
                      onClick={() => setSelectedIncident(incident)}
                      whileHover={{ scale: 1.01 }}
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                              incident.status === 'resolved' ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' :
                              incident.status === 'investigating' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400' :
                              'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                            }`}>
                              {incident.status}
                            </div>
                            <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                              incident.severity === 'minor' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400' :
                              incident.severity === 'major' ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400' :
                              'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-400'
                            }`}>
                              {incident.severity}
                            </div>
                          </div>
                          
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                            {incident.title}
                          </h3>
                          <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">
                            {incident.description}
                          </p>
                          
                          <div className="flex items-center space-x-6 text-sm text-gray-500 dark:text-gray-400">
                            <div className="flex items-center space-x-1">
                              <CalendarIcon className="w-4 h-4" />
                              <span>{new Date(incident.startTime).toLocaleDateString()}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <ClockIcon className="w-4 h-4" />
                              <span>Duration: {incident.duration}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <ServerIcon className="w-4 h-4" />
                              <span>{incident.affectedServices.length} services affected</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="ml-4">
                          <motion.button
                            className="text-blue-600 dark:text-blue-400 hover:text-blue-700 text-sm font-medium"
                            whileHover={{ scale: 1.05 }}
                          >
                            View Details →
                          </motion.button>
                        </div>
                      </div>
                      
                      {}
                      <div className="flex flex-wrap gap-2">
                        {incident.affectedServices.map((service, serviceIndex) => (
                          <span
                            key={serviceIndex}
                            className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded-full"
                          >
                            {service}
                          </span>
                        ))}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {}
          {activeTab === 'maintenance' && (
            <motion.div
              key="maintenance"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                  Scheduled Maintenance
                </h2>
                
                {SCHEDULED_MAINTENANCE.length > 0 ? (
                  <div className="space-y-6">
                    {SCHEDULED_MAINTENANCE.map((maintenance, index) => (
                      <motion.div
                        key={maintenance.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/20 rounded-xl p-6"
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <Cog6ToothIcon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                {maintenance.title}
                              </h3>
                              <div className="px-3 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 rounded-full text-xs font-medium">
                                Scheduled
                              </div>
                            </div>
                            
                            <p className="text-gray-700 dark:text-gray-300 mb-4">
                              {maintenance.description}
                            </p>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                              <div>
                                <div className="font-medium text-gray-900 dark:text-white mb-1">Schedule</div>
                                <div className="text-gray-600 dark:text-gray-400">
                                  {new Date(maintenance.startTime).toLocaleString()} - {new Date(maintenance.endTime).toLocaleString()}
                                </div>
                                <div className="text-gray-600 dark:text-gray-400">
                                  Duration: {maintenance.duration}
                                </div>
                              </div>
                              <div>
                                <div className="font-medium text-gray-900 dark:text-white mb-1">Expected Impact</div>
                                <div className="text-gray-600 dark:text-gray-400">
                                  {maintenance.impact}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        {}
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            Affected Services:
                          </span>
                          <div className="flex flex-wrap gap-1">
                            {maintenance.affectedServices.map((service, serviceIndex) => (
                              <span
                                key={serviceIndex}
                                className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400 text-xs rounded-full"
                              >
                                {service}
                              </span>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Cog6ToothIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                      No Scheduled Maintenance
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      All systems are running smoothly with no planned maintenance windows.
                    </p>
                  </div>
                )}

                {}
                <div className="mt-8 p-6 bg-gray-50 dark:bg-gray-700 rounded-xl">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center space-x-2">
                    <InformationCircleIcon className="w-5 h-5" />
                    <span>Maintenance Policy</span>
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-gray-600 dark:text-gray-400">
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white mb-2">Notification Timeline</h4>
                      <ul className="space-y-1">
                        <li>• Major maintenance: 7 days advance notice</li>
                        <li>• Minor updates: 24 hours advance notice</li>
                        <li>• Emergency patches: As soon as possible</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white mb-2">Maintenance Windows</h4>
                      <ul className="space-y-1">
                        <li>• Preferred: Tuesday-Thursday, 2:00-6:00 AM UTC</li>
                        <li>• Emergency: Any time as needed</li>
                        <li>• Duration: Typically 30 minutes to 3 hours</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {}
          {activeTab === 'metrics' && (
            <motion.div
              key="metrics"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              {}
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                  Real-time Performance Metrics
                </h2>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                      Response Time (Last 24 Hours)
                    </h3>
                    <div className="h-64 bg-gray-50 dark:bg-gray-700 rounded-xl p-4">
                      <div className="flex items-end justify-between h-full space-x-1">
                        {Array.from({ length: 24 }, (_, i) => {
                          const height = Math.random() * 80 + 20;
                          const responseTime = 80 + Math.random() * 120;
                          return (
                            <motion.div
                              key={i}
                              className="flex-1 bg-gradient-to-t from-blue-500 to-blue-600 rounded-t opacity-80 hover:opacity-100 transition-opacity cursor-pointer"
                              style={{ height: `${height}%` }}
                              initial={{ height: 0 }}
                              animate={{ height: `${height}%` }}
                              transition={{ delay: i * 0.05 }}
                              title={`${responseTime.toFixed(0)}ms at ${i}:00`}
                            />
                          );
                        })}
                      </div>
                      <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-2">
                        <span>00:00</span>
                        <span>12:00</span>
                        <span>24:00</span>
                      </div>
                    </div>
                  </div>

                  {}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                      Request Throughput (Requests/min)
                    </h3>
                    <div className="h-64 bg-gray-50 dark:bg-gray-700 rounded-xl p-4">
                      <div className="flex items-end justify-between h-full space-x-1">
                        {Array.from({ length: 24 }, (_, i) => {
                          const height = Math.random() * 90 + 10;
                          const throughput = 5000 + Math.random() * 15000;
                          return (
                            <motion.div
                              key={i}
                              className="flex-1 bg-gradient-to-t from-green-500 to-green-600 rounded-t opacity-80 hover:opacity-100 transition-opacity cursor-pointer"
                              style={{ height: `${height}%` }}
                              initial={{ height: 0 }}
                              animate={{ height: `${height}%` }}
                              transition={{ delay: i * 0.05 }}
                              title={`${throughput.toFixed(0)} req/min at ${i}:00`}
                            />
                          );
                        })}
                      </div>
                      <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-2">
                        <span>00:00</span>
                        <span>12:00</span>
                        <span>24:00</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  {
                    title: 'CPU Usage',
                    value: '67%',
                    trend: 'stable',
                    color: 'blue',
                    icon: CpuChipIcon,
                    description: 'Average across all instances'
                  },
                  {
                    title: 'Memory Usage',
                    value: '78%',
                    trend: 'up',
                    color: 'yellow',
                    icon: CircleStackIcon,
                    description: 'Current memory utilization'
                  },
                  {
                    title: 'Network I/O',
                    value: '1.2 GB/s',
                    trend: 'stable',
                    color: 'green',
                    icon: WifiIcon,
                    description: 'Aggregate network throughput'
                  },
                  {
                    title: 'Disk Usage',
                    value: '45%',
                    trend: 'down',
                    color: 'purple',
                    icon: ServerIcon,
                    description: 'Storage utilization'
                  }
                ].map((metric, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className={`p-3 rounded-xl ${
                        metric.color === 'blue' ? 'bg-blue-100 dark:bg-blue-900/20' :
                        metric.color === 'yellow' ? 'bg-yellow-100 dark:bg-yellow-900/20' :
                        metric.color === 'green' ? 'bg-green-100 dark:bg-green-900/20' :
                        'bg-purple-100 dark:bg-purple-900/20'
                      }`}>
                        <metric.icon className={`w-6 h-6 ${
                          metric.color === 'blue' ? 'text-blue-600 dark:text-blue-400' :
                          metric.color === 'yellow' ? 'text-yellow-600 dark:text-yellow-400' :
                          metric.color === 'green' ? 'text-green-600 dark:text-green-400' :
                          'text-purple-600 dark:text-purple-400'
                        }`} />
                      </div>
                      <div className={`flex items-center space-x-1 text-sm ${
                        metric.trend === 'up' ? 'text-red-600 dark:text-red-400' :
                        metric.trend === 'down' ? 'text-green-600 dark:text-green-400' :
                        'text-gray-600 dark:text-gray-400'
                      }`}>
                        {metric.trend === 'up' && <ArrowTrendingUpIcon className="w-4 h-4" />}
                        {metric.trend === 'down' && <ArrowTrendingDownIcon className="w-4 h-4" />}
                        <span className="capitalize">{metric.trend}</span>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                        {metric.value}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">
                        {metric.title}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {metric.description}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>

              {}
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                  SLA Performance
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {[
                    {
                      title: 'Uptime SLA',
                      target: '99.9%',
                      current: '99.97%',
                      status: 'exceeding',
                      color: 'green'
                    },
                    {
                      title: 'Response Time SLA',
                      target: '<200ms',
                      current: '142ms',
                      status: 'meeting',
                      color: 'blue'
                    },
                    {
                      title: 'Error Rate SLA',
                      target: '<0.1%',
                      current: '0.03%',
                      status: 'exceeding',
                      color: 'green'
                    }
                  ].map((sla, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="text-center"
                    >
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                        {sla.title}
                      </h3>
                      <div className="space-y-2">
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          Target: <span className="font-medium">{sla.target}</span>
                        </div>
                        <div className={`text-2xl font-bold ${
                          sla.color === 'green' ? 'text-green-600 dark:text-green-400' :
                          'text-blue-600 dark:text-blue-400'
                        }`}>
                          {sla.current}
                        </div>
                        <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                          sla.status === 'exceeding' ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' :
                          'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
                        }`}>
                          {sla.status === 'exceeding' ? 'Exceeding Target' : 'Meeting Target'}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {}
        <AnimatePresence>
          {selectedIncident && (
            <motion.div
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedIncident(null)}
            >
              <motion.div
                className="bg-white dark:bg-gray-800 rounded-2xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-start justify-between mb-6">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                        selectedIncident.status === 'resolved' ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' :
                        'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
                      }`}>
                        {selectedIncident.status}
                      </div>
                      <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                        selectedIncident.severity === 'minor' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400' :
                        'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                      }`}>
                        {selectedIncident.severity} severity
                      </div>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                      {selectedIncident.title}
                    </h2>
                    <div className="flex items-center space-x-6 text-sm text-gray-500 dark:text-gray-400 mb-4">
                      <span>ID: {selectedIncident.id}</span>
                      <span>Duration: {selectedIncident.duration}</span>
                      <span>Started: {new Date(selectedIncident.startTime).toLocaleString()}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedIncident(null)}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg text-2xl"
                  >
                    ×
                  </button>
                </div>
                
                <div className="space-y-6">
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Description</h3>
                    <p className="text-gray-700 dark:text-gray-300">{selectedIncident.description}</p>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Resolution</h3>
                    <p className="text-gray-700 dark:text-gray-300">{selectedIncident.resolution}</p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Affected Services</h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedIncident.affectedServices.map((service, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400 text-sm rounded-full"
                          >
                            {service}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Affected Regions</h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedIncident.affectedRegions.map((region, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400 text-sm rounded-full"
                          >
                            {region}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Timeline</h3>
                    <div className="space-y-4">
                      {selectedIncident.updates.map((update, index) => (
                        <div key={index} className="flex items-start space-x-4">
                          <div className={`w-3 h-3 rounded-full mt-2 ${
                            update.status === 'resolved' ? 'bg-green-500' :
                            update.status === 'monitoring' ? 'bg-blue-500' :
                            update.status === 'identified' ? 'bg-yellow-500' :
                            'bg-red-500'
                          }`} />
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-1">
                              <span className="text-sm font-medium text-gray-900 dark:text-white">
                                {new Date(update.time).toLocaleString()}
                              </span>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                update.status === 'resolved' ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' :
                                update.status === 'monitoring' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400' :
                                update.status === 'identified' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400' :
                                'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                              }`}>
                                {update.status}
                              </span>
                            </div>
                            <p className="text-gray-700 dark:text-gray-300 text-sm">
                              {update.message}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
};

export default HealthSection;
