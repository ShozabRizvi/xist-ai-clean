import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CodeBracketIcon, DocumentTextIcon, PlayIcon, CpuChipIcon, KeyIcon,
  ShieldCheckIcon, BoltIcon, ClipboardDocumentIcon, CheckCircleIcon, XCircleIcon,
  ArrowRightIcon, GlobeAltIcon, ServerIcon, CloudIcon, CommandLineIcon,
  BeakerIcon, CogIcon, EyeIcon, ArrowDownTrayIcon, ShareIcon,
  ExclamationTriangleIcon, InformationCircleIcon, LightBulbIcon,
  RocketLaunchIcon, UserGroupIcon, ChartBarIcon, LockClosedIcon,
  ClipboardIcon, SparklesIcon, FireIcon, TrophyIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../../context/AuthContext';
import { showNotification } from '../UI/NotificationToast';

const APISection = () => {
  const { user } = useAuth();
  
  // State management
  const [activeTab, setActiveTab] = useState('overview');
  const [apiKey, setApiKey] = useState('');
  const [selectedEndpoint, setSelectedEndpoint] = useState('analyze-text');
  const [testInput, setTestInput] = useState('');
  const [testResponse, setTestResponse] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('javascript');
  const [copiedText, setCopiedText] = useState('');

  // API Statistics
  const [apiStats, setApiStats] = useState({
    totalRequests: 245689,
    activeUsers: 1247,
    uptime: 99.9,
    avgResponseTime: 142
  });

  // Load saved API key
  useEffect(() => {
    const savedKey = localStorage.getItem(`xist-api-key-${user?.uid || 'anonymous'}`);
    if (savedKey) setApiKey(savedKey);
  }, [user]);

  // Generate API key
  const generateApiKey = () => {
    const newKey = `xist_${Math.random().toString(36).substr(2, 12)}_${Date.now().toString(36)}`;
    setApiKey(newKey);
    localStorage.setItem(`xist-api-key-${user?.uid || 'anonymous'}`, newKey);
    showNotification('🔑 API Key generated successfully!', 'success');
  };

  // Copy to clipboard
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopiedText(text);
    showNotification('📋 Copied to clipboard!', 'success');
    setTimeout(() => setCopiedText(''), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-blue-900/20 dark:to-indigo-900/20 py-8">
      <div className="max-w-7xl mx-auto px-6 space-y-8">
        
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8"
        >
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-6 lg:space-y-0">
            <div className="flex items-center space-x-4">
              <div className="p-4 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl">
                <CodeBracketIcon className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  XIST AI API
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                  Integrate advanced threat detection into your applications
                </p>
                <div className="flex items-center space-x-4 mt-2">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      API Status: Operational
                    </span>
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    Version: v1.2.0
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-xl font-bold text-blue-600 dark:text-blue-400">
                  {apiStats.totalRequests.toLocaleString()}
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400">Total Requests</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-green-600 dark:text-green-400">
                  {apiStats.activeUsers.toLocaleString()}
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400">Active Users</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-purple-600 dark:text-purple-400">
                  {apiStats.uptime}%
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400">Uptime</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-orange-600 dark:text-orange-400">
                  {apiStats.avgResponseTime}ms
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400">Avg Response</div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Navigation Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-2"
        >
          <div className="flex flex-wrap gap-2">
            {[
              { id: 'overview', label: 'Overview', icon: GlobeAltIcon },
              { id: 'quickstart', label: 'Quick Start', icon: RocketLaunchIcon },
              { id: 'endpoints', label: 'Endpoints', icon: ServerIcon },
              { id: 'testing', label: 'API Tester', icon: BeakerIcon },
              { id: 'examples', label: 'Examples', icon: CodeBracketIcon },
              { id: 'pricing', label: 'Pricing', icon: CpuChipIcon }
            ].map((tab) => (
              <motion.button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-xl font-medium transition-all text-sm ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg'
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

        {/* Content Area */}
        <AnimatePresence mode="wait">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              {/* API Introduction */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                  Powerful Threat Detection API
                </h2>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                      The XIST AI API provides enterprise-grade threat detection capabilities through simple REST endpoints. 
                      Analyze text, URLs, and files for misinformation, phishing, scams, and other digital threats with 
                      industry-leading accuracy.
                    </p>
                    
                    <div className="space-y-3">
                      {[
                        { icon: ShieldCheckIcon, text: '96.8% accuracy rate across all threat types' },
                        { icon: BoltIcon, text: 'Average response time under 200ms' },
                        { icon: CloudIcon, text: 'Global CDN with 99.9% uptime SLA' },
                        { icon: LockClosedIcon, text: 'Enterprise-grade security and compliance' }
                      ].map((feature, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.1 + index * 0.1 }}
                          className="flex items-center space-x-3"
                        >
                          <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                            <feature.icon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                          </div>
                          <span className="text-gray-700 dark:text-gray-300">{feature.text}</span>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center space-x-2">
                      <SparklesIcon className="w-5 h-5" />
                      <span>Key Features</span>
                    </h3>
                    
                    <div className="grid grid-cols-2 gap-4">
                      {[
                        { label: 'Text Analysis', value: 'Multi-language support' },
                        { label: 'URL Scanning', value: 'Real-time checking' },
                        { label: 'Batch Processing', value: 'Up to 100 items' },
                        { label: 'Webhooks', value: 'Event notifications' },
                        { label: 'Rate Limiting', value: 'Fair usage policies' },
                        { label: 'SDKs Available', value: '8 programming languages' }
                      ].map((item, index) => (
                        <div key={index} className="space-y-1">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {item.label}
                          </div>
                          <div className="text-xs text-gray-600 dark:text-gray-400">
                            {item.value}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* API Key Generation */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center space-x-2">
                  <KeyIcon className="w-6 h-6" />
                  <span>API Authentication</span>
                </h2>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <p className="text-gray-600 dark:text-gray-400">
                      Generate your API key to start making requests. All API calls require authentication 
                      using Bearer token in the Authorization header.
                    </p>
                    
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center">
                          <span className="text-sm font-bold text-blue-600 dark:text-blue-400">1</span>
                        </div>
                        <span className="text-gray-700 dark:text-gray-300">Generate your API key</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center">
                          <span className="text-sm font-bold text-blue-600 dark:text-blue-400">2</span>
                        </div>
                        <span className="text-gray-700 dark:text-gray-300">Include in Authorization header</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center">
                          <span className="text-sm font-bold text-blue-600 dark:text-blue-400">3</span>
                        </div>
                        <span className="text-gray-700 dark:text-gray-300">Start making API requests</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Your API Key
                      </label>
                      <div className="flex space-x-2">
                        <input
                          type="text"
                          value={apiKey}
                          readOnly
                          placeholder="Click generate to create API key"
                          className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white text-sm font-mono"
                        />
                        <motion.button
                          onClick={generateApiKey}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          Generate
                        </motion.button>
                        {apiKey && (
                          <motion.button
                            onClick={() => copyToClipboard(apiKey)}
                            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <ClipboardIcon className="w-4 h-4" />
                          </motion.button>
                        )}
                      </div>
                    </div>
                    
                    {apiKey && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg"
                      >
                        <div className="flex items-center space-x-2 text-green-800 dark:text-green-400 text-sm">
                          <CheckCircleIcon className="w-4 h-4" />
                          <span>API key generated successfully! Keep it secure.</span>
                        </div>
                      </motion.div>
                    )}
                  </div>
                </div>
              </div>

              {/* Usage Statistics */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  {
                    title: 'Requests Today',
                    value: '12,847',
                    change: '+23.5%',
                    color: 'blue',
                    icon: ChartBarIcon
                  },
                  {
                    title: 'Threats Detected',
                    value: '1,249',
                    change: '+12.8%',
                    color: 'red',
                    icon: ShieldCheckIcon
                  },
                  {
                    title: 'Active Developers',
                    value: '847',
                    change: '+8.3%',
                    color: 'green',
                    icon: UserGroupIcon
                  }
                ].map((stat, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 + index * 0.1 }}
                    className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className={`p-3 rounded-xl ${
                        stat.color === 'blue' ? 'bg-blue-100 dark:bg-blue-900/20' :
                        stat.color === 'red' ? 'bg-red-100 dark:bg-red-900/20' :
                        'bg-green-100 dark:bg-green-900/20'
                      }`}>
                        <stat.icon className={`w-6 h-6 ${
                          stat.color === 'blue' ? 'text-blue-600 dark:text-blue-400' :
                          stat.color === 'red' ? 'text-red-600 dark:text-red-400' :
                          'text-green-600 dark:text-green-400'
                        }`} />
                      </div>
                      <div className={`text-sm font-medium px-2 py-1 rounded-full ${
                        stat.color === 'blue' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400' :
                        stat.color === 'red' ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400' :
                        'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                      }`}>
                        {stat.change}
                      </div>
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                        {stat.value}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400">
                        {stat.title}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Quick Start Tab */}
          {activeTab === 'quickstart' && (
            <motion.div
              key="quickstart"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center space-x-2">
                  <RocketLaunchIcon className="w-6 h-6" />
                  <span>Quick Start Guide</span>
                </h2>
                
                <div className="space-y-8">
                  {/* Step 1 */}
                  <div className="flex items-start space-x-6">
                    <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-lg flex-shrink-0">
                      1
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                        Get Your API Key
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 mb-4">
                        Generate your API key from the Overview tab or your dashboard. This key will authenticate all your requests.
                      </p>
                      <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 font-mono text-sm">
                        <div className="text-gray-500 dark:text-gray-400">Your API Key:</div>
                        <div className="text-blue-600 dark:text-blue-400 break-all">
                          {apiKey || 'xist_abc123def456_789xyz'}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Step 2 */}
                  <div className="flex items-start space-x-6">
                    <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-lg flex-shrink-0">
                      2
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                        Make Your First Request
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 mb-4">
                        Send a POST request to analyze text content. Here's a simple example:
                      </p>
                      <div className="bg-gray-900 dark:bg-gray-800 rounded-lg p-4 overflow-x-auto">
                        <pre className="text-green-400 text-sm">
{`curl -X POST "https://api.xist.ai/v1/analyze/text" \\
  -H "Authorization: Bearer ${apiKey || 'YOUR_API_KEY'}" \\
  -H "Content-Type: application/json" \\
  -d '{
    "content": "Urgent! You won $1,000,000! Click now!",
    "mode": "comprehensive"
  }'`}
                        </pre>
                      </div>
                    </div>
                  </div>

                  {/* Step 3 */}
                  <div className="flex items-start space-x-6">
                    <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-lg flex-shrink-0">
                      3
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                        Handle the Response
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 mb-4">
                        The API returns a JSON response with threat analysis results:
                      </p>
                      <div className="bg-gray-900 dark:bg-gray-800 rounded-lg p-4 overflow-x-auto">
                        <pre className="text-blue-400 text-sm">
{`{
  "risk_score": 95,
  "verdict": "dangerous", 
  "confidence": 98,
  "analysis": "This text exhibits multiple high-risk indicators...",
  "threats_detected": [
    {
      "type": "lottery_scam",
      "confidence": 95,
      "indicators": ["urgency", "large_prize", "action_required"]
    }
  ],
  "processing_time": 142
}`}
                        </pre>
                      </div>
                    </div>
                  </div>

                  {/* Next Steps */}
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center space-x-2">
                      <SparklesIcon className="w-5 h-5" />
                      <span>Next Steps</span>
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {[
                        { text: 'Explore all available endpoints', icon: ServerIcon },
                        { text: 'Try the interactive API tester', icon: BeakerIcon },
                        { text: 'Download SDKs for your language', icon: CodeBracketIcon },
                        { text: 'Read the full documentation', icon: DocumentTextIcon }
                      ].map((step, index) => (
                        <div key={index} className="flex items-center space-x-3">
                          <step.icon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                          <span className="text-gray-700 dark:text-gray-300">{step.text}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

                    {/* Endpoints Tab */}
          {activeTab === 'endpoints' && (
            <motion.div
              key="endpoints"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center space-x-2">
                  <ServerIcon className="w-6 h-6" />
                  <span>API Endpoints</span>
                </h2>
                
                <div className="space-y-6">
                  {/* Text Analysis Endpoint */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="border border-gray-200 dark:border-gray-700 rounded-xl p-6"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <span className="px-3 py-1 bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400 rounded-full text-sm font-medium">
                          POST
                        </span>
                        <code className="text-lg font-mono text-gray-900 dark:text-white">
                          /v1/analyze/text
                        </code>
                      </div>
                      <motion.button
                        onClick={() => setSelectedEndpoint('analyze-text')}
                        className="text-blue-600 dark:text-blue-400 hover:text-blue-700 text-sm font-medium"
                        whileHover={{ scale: 1.05 }}
                      >
                        Try it →
                      </motion.button>
                    </div>
                    
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      Analyze Text Content
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      Analyze text content for misinformation, phishing attempts, scams, and other threats with high accuracy.
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white mb-3">Parameters</h4>
                        <div className="space-y-3">
                          {[
                            { name: 'content', type: 'string', required: true, desc: 'Text content to analyze' },
                            { name: 'mode', type: 'string', required: false, desc: 'Analysis mode: quick, comprehensive, deep' },
                            { name: 'language', type: 'string', required: false, desc: 'Content language (auto-detected)' },
                            { name: 'include_sources', type: 'boolean', required: false, desc: 'Include source verification' }
                          ].map((param, index) => (
                            <div key={index} className="flex items-start space-x-3 text-sm">
                              <span className={`px-2 py-1 rounded text-xs font-mono ${
                                param.required 
                                  ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400' 
                                  : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
                              }`}>
                                {param.name}
                              </span>
                              <div className="flex-1">
                                <div className="text-gray-900 dark:text-white font-medium">{param.type}</div>
                                <div className="text-gray-600 dark:text-gray-400">{param.desc}</div>
                              </div>
                              {param.required && (
                                <span className="text-red-500 text-xs">Required</span>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white mb-3">Response</h4>
                        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                          <pre className="text-sm text-gray-800 dark:text-gray-200 overflow-x-auto">
{`{
  "risk_score": 85,
  "verdict": "suspicious",
  "confidence": 92,
  "analysis": "Detected urgency patterns...",
  "threats_detected": [...],
  "processing_time": 142,
  "request_id": "req_abc123"
}`}
                          </pre>
                        </div>
                      </div>
                    </div>
                  </motion.div>

                  {/* URL Analysis Endpoint */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="border border-gray-200 dark:border-gray-700 rounded-xl p-6"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <span className="px-3 py-1 bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400 rounded-full text-sm font-medium">
                          POST
                        </span>
                        <code className="text-lg font-mono text-gray-900 dark:text-white">
                          /v1/analyze/url
                        </code>
                      </div>
                      <motion.button
                        onClick={() => setSelectedEndpoint('analyze-url')}
                        className="text-blue-600 dark:text-blue-400 hover:text-blue-700 text-sm font-medium"
                        whileHover={{ scale: 1.05 }}
                      >
                        Try it →
                      </motion.button>
                    </div>
                    
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      URL Security Scan
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      Analyze URLs for phishing, malware, suspicious redirects, and domain reputation issues.
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white mb-3">Parameters</h4>
                        <div className="space-y-3">
                          {[
                            { name: 'url', type: 'string', required: true, desc: 'URL to analyze' },
                            { name: 'scan_content', type: 'boolean', required: false, desc: 'Scan page content for threats' },
                            { name: 'check_redirects', type: 'boolean', required: false, desc: 'Follow and analyze redirects' }
                          ].map((param, index) => (
                            <div key={index} className="flex items-start space-x-3 text-sm">
                              <span className={`px-2 py-1 rounded text-xs font-mono ${
                                param.required 
                                  ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400' 
                                  : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
                              }`}>
                                {param.name}
                              </span>
                              <div className="flex-1">
                                <div className="text-gray-900 dark:text-white font-medium">{param.type}</div>
                                <div className="text-gray-600 dark:text-gray-400">{param.desc}</div>
                              </div>
                              {param.required && (
                                <span className="text-red-500 text-xs">Required</span>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white mb-3">Response</h4>
                        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                          <pre className="text-sm text-gray-800 dark:text-gray-200 overflow-x-auto">
{`{
  "risk_score": 78,
  "verdict": "suspicious",
  "domain_age": 15,
  "ssl_valid": true,
  "reputation_score": 45,
  "threats_found": [...],
  "redirects": [...]
}`}
                          </pre>
                        </div>
                      </div>
                    </div>
                  </motion.div>

                  {/* Batch Analysis Endpoint */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="border border-gray-200 dark:border-gray-700 rounded-xl p-6"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <span className="px-3 py-1 bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400 rounded-full text-sm font-medium">
                          POST
                        </span>
                        <code className="text-lg font-mono text-gray-900 dark:text-white">
                          /v1/analyze/batch
                        </code>
                      </div>
                      <motion.button
                        onClick={() => setSelectedEndpoint('batch-analyze')}
                        className="text-blue-600 dark:text-blue-400 hover:text-blue-700 text-sm font-medium"
                        whileHover={{ scale: 1.05 }}
                      >
                        Try it →
                      </motion.button>
                    </div>
                    
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      Batch Analysis
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      Analyze multiple items simultaneously with bulk processing discounts and parallel execution.
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white mb-3">Parameters</h4>
                        <div className="space-y-3">
                          {[
                            { name: 'items', type: 'array', required: true, desc: 'Array of content items to analyze' },
                            { name: 'type', type: 'string', required: true, desc: 'Item type: text, url, or mixed' },
                            { name: 'priority', type: 'string', required: false, desc: 'Processing priority level' }
                          ].map((param, index) => (
                            <div key={index} className="flex items-start space-x-3 text-sm">
                              <span className={`px-2 py-1 rounded text-xs font-mono ${
                                param.required 
                                  ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400' 
                                  : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
                              }`}>
                                {param.name}
                              </span>
                              <div className="flex-1">
                                <div className="text-gray-900 dark:text-white font-medium">{param.type}</div>
                                <div className="text-gray-600 dark:text-gray-400">{param.desc}</div>
                              </div>
                              {param.required && (
                                <span className="text-red-500 text-xs">Required</span>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white mb-3">Response</h4>
                        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                          <pre className="text-sm text-gray-800 dark:text-gray-200 overflow-x-auto">
{`{
  "job_id": "job_xyz789",
  "status": "processing",
  "total_items": 25,
  "processed": 0,
  "estimated_completion": "2025-09-16T14:32:00Z"
}`}
                          </pre>
                        </div>
                      </div>
                    </div>
                  </motion.div>

                  {/* Rate Limits Info */}
                  <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-amber-900 dark:text-amber-200 mb-4 flex items-center space-x-2">
                      <ExclamationTriangleIcon className="w-5 h-5" />
                      <span>Rate Limits & Best Practices</span>
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-medium text-amber-900 dark:text-amber-200 mb-3">Current Limits</h4>
                        <div className="space-y-2 text-sm text-amber-800 dark:text-amber-300">
                          <div>• Text Analysis: 100 requests/minute</div>
                          <div>• URL Scanning: 50 requests/minute</div>
                          <div>• Batch Processing: 10 requests/minute</div>
                          <div>• Monthly quota varies by plan</div>
                        </div>
                      </div>
                      <div>
                        <h4 className="font-medium text-amber-900 dark:text-amber-200 mb-3">Best Practices</h4>
                        <div className="space-y-2 text-sm text-amber-800 dark:text-amber-300">
                          <div>• Implement exponential backoff for retries</div>
                          <div>• Use batch endpoints for multiple items</div>
                          <div>• Cache results to reduce API calls</div>
                          <div>• Monitor rate limit headers</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* API Tester Tab */}
          {activeTab === 'testing' && (
            <motion.div
              key="testing"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center space-x-2">
                  <BeakerIcon className="w-6 h-6" />
                  <span>Interactive API Tester</span>
                </h2>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Request Panel */}
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Select Endpoint
                      </label>
                      <select
                        value={selectedEndpoint}
                        onChange={(e) => setSelectedEndpoint(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="analyze-text">POST /v1/analyze/text</option>
                        <option value="analyze-url">POST /v1/analyze/url</option>
                        <option value="batch-analyze">POST /v1/analyze/batch</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Request Body
                      </label>
                      <textarea
                        value={testInput}
                        onChange={(e) => setTestInput(e.target.value)}
                        placeholder={selectedEndpoint === 'analyze-text' 
                          ? '{\n  "content": "Your text content here",\n  "mode": "comprehensive"\n}'
                          : selectedEndpoint === 'analyze-url'
                          ? '{\n  "url": "https://example.com",\n  "scan_content": true\n}'
                          : '{\n  "items": ["text1", "text2"],\n  "type": "text"\n}'
                        }
                        className="w-full h-48 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        API Key
                      </label>
                      <div className="flex space-x-2">
                        <input
                          type="password"
                          value={apiKey}
                          onChange={(e) => setApiKey(e.target.value)}
                          placeholder="Enter your API key"
                          className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {!apiKey && (
                          <motion.button
                            onClick={generateApiKey}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            Generate
                          </motion.button>
                        )}
                      </div>
                    </div>

                    <motion.button
                      onClick={() => {
                        if (!apiKey) {
                          showNotification('⚠️ Please enter an API key', 'warning');
                          return;
                        }
                        if (!testInput.trim()) {
                          showNotification('⚠️ Please enter request data', 'warning');
                          return;
                        }
                        
                        setIsLoading(true);
                        
                        // Simulate API call
                        setTimeout(() => {
                          setTestResponse({
                            status: 200,
                            data: {
                              risk_score: Math.floor(Math.random() * 100),
                              verdict: ['safe', 'suspicious', 'dangerous'][Math.floor(Math.random() * 3)],
                              confidence: Math.floor(Math.random() * 30) + 70,
                              analysis: 'This content has been analyzed for potential threats...',
                              processing_time: Math.floor(Math.random() * 1000) + 100,
                              request_id: `req_${Date.now()}`
                            },
                            headers: {
                              'Content-Type': 'application/json',
                              'X-RateLimit-Remaining': '99',
                              'X-Response-Time': `${Math.floor(Math.random() * 200) + 50}ms`
                            }
                          });
                          setIsLoading(false);
                          showNotification('✅ API request completed', 'success');
                        }, 2000);
                      }}
                      disabled={isLoading}
                      className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-6 rounded-lg font-medium hover:from-blue-700 hover:to-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      whileHover={!isLoading ? { scale: 1.02 } : {}}
                      whileTap={!isLoading ? { scale: 0.98 } : {}}
                    >
                      {isLoading ? (
                        <>
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                          />
                          <span>Testing...</span>
                        </>
                      ) : (
                        <>
                          <PlayIcon className="w-5 h-5" />
                          <span>Send Request</span>
                        </>
                      )}
                    </motion.button>
                  </div>

                  {/* Response Panel */}
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Response
                      </label>
                      {testResponse ? (
                        <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                          {/* Response Headers */}
                          <div className="bg-gray-50 dark:bg-gray-700 px-4 py-2 border-b border-gray-200 dark:border-gray-600">
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                Status: 
                                <span className={`ml-2 ${
                                  testResponse.status === 200 
                                    ? 'text-green-600 dark:text-green-400' 
                                    : 'text-red-600 dark:text-red-400'
                                }`}>
                                  {testResponse.status}
                                </span>
                              </span>
                              <motion.button
                                onClick={() => copyToClipboard(JSON.stringify(testResponse.data, null, 2))}
                                className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                              >
                                <ClipboardIcon className="w-4 h-4" />
                              </motion.button>
                            </div>
                            {testResponse.headers && (
                              <div className="mt-2 text-xs text-gray-600 dark:text-gray-400">
                                <div>Response-Time: {testResponse.headers['X-Response-Time']}</div>
                                <div>Rate-Limit-Remaining: {testResponse.headers['X-RateLimit-Remaining']}</div>
                              </div>
                            )}
                          </div>
                          
                          {/* Response Body */}
                          <div className="bg-gray-900 dark:bg-gray-800 p-4 overflow-x-auto">
                            <pre className="text-green-400 text-sm">
                              {JSON.stringify(testResponse.data, null, 2)}
                            </pre>
                          </div>
                        </div>
                      ) : (
                        <div className="h-64 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg flex items-center justify-center">
                          <div className="text-center">
                            <BeakerIcon className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                            <p className="text-gray-500 dark:text-gray-400">
                              Send a request to see the response here
                            </p>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Quick Test Examples */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                        Quick Test Examples
                      </label>
                      <div className="space-y-2">
                        {[
                          { 
                            label: 'Phishing Text', 
                            data: '{"content": "URGENT! Your account will be closed! Click here: suspicious-bank.com/login", "mode": "comprehensive"}' 
                          },
                          { 
                            label: 'Suspicious URL', 
                            data: '{"url": "https://amaz0n-security.com/verify-account", "scan_content": true}' 
                          },
                          { 
                            label: 'Safe Content', 
                            data: '{"content": "Thank you for your purchase. Your order will arrive in 3-5 business days.", "mode": "quick"}' 
                          }
                        ].map((example, index) => (
                          <motion.button
                            key={index}
                            onClick={() => setTestInput(example.data)}
                            className="w-full text-left p-3 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.99 }}
                          >
                            <div className="font-medium text-gray-900 dark:text-white">{example.label}</div>
                            <div className="text-sm text-gray-600 dark:text-gray-400 truncate font-mono">
                              {example.data}
                            </div>
                          </motion.button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Examples Tab */}
          {activeTab === 'examples' && (
            <motion.div
              key="examples"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center space-x-2">
                  <CodeBracketIcon className="w-6 h-6" />
                  <span>Code Examples</span>
                </h2>
                
                {/* Language Selector */}
                <div className="flex flex-wrap gap-2 mb-8">
                  {[
                    { id: 'javascript', name: 'JavaScript', icon: '🟨' },
                    { id: 'python', name: 'Python', icon: '🐍' },
                    { id: 'curl', name: 'cURL', icon: '🌀' },
                    { id: 'nodejs', name: 'Node.js', icon: '💚' },
                    { id: 'php', name: 'PHP', icon: '🐘' }
                  ].map((lang) => (
                    <motion.button
                      key={lang.id}
                      onClick={() => setSelectedLanguage(lang.id)}
                      className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all ${
                        selectedLanguage === lang.id
                          ? 'bg-blue-600 text-white shadow-lg'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                      }`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <span>{lang.icon}</span>
                      <span>{lang.name}</span>
                    </motion.button>
                  ))}
                </div>

                {/* Code Examples */}
                <div className="space-y-6">
                  {/* JavaScript Example */}
                  {selectedLanguage === 'javascript' && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                          🟨 JavaScript (Fetch API)
                        </h3>
                        <motion.button
                          onClick={() => copyToClipboard(`// XIST AI - JavaScript Example
const analyzeText = async (content) => {
  const response = await fetch('https://api.xist.ai/v1/analyze/text', {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer ${apiKey || 'YOUR_API_KEY'}',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      content: content,
      mode: 'comprehensive'
    })
  });

  if (!response.ok) {
    throw new Error(\`API Error: \${response.status}\`);
  }

  const result = await response.json();
  return result;
};

// Usage example
analyzeText('Urgent! You won $1,000,000! Click now!')
  .then(result => {
    console.log('Risk Score:', result.risk_score);
    console.log('Verdict:', result.verdict);
    console.log('Analysis:', result.analysis);
  })
  .catch(error => {
    console.error('Error:', error.message);
  });`)}
                          className="flex items-center space-x-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                          whileHover={{ scale: 1.1 }}
                        >
                          <ClipboardIcon className="w-4 h-4" />
                          <span className="text-sm">Copy</span>
                        </motion.button>
                      </div>
                      <div className="bg-gray-900 dark:bg-gray-800 rounded-lg p-6 overflow-x-auto">
                        <pre className="text-green-400 text-sm">
{`// XIST AI - JavaScript Example
const analyzeText = async (content) => {
  const response = await fetch('https://api.xist.ai/v1/analyze/text', {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer ${apiKey || 'YOUR_API_KEY'}',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      content: content,
      mode: 'comprehensive'
    })
  });

  if (!response.ok) {
    throw new Error(\`API Error: \${response.status}\`);
  }

  const result = await response.json();
  return result;
};

// Usage example
analyzeText('Urgent! You won $1,000,000! Click now!')
  .then(result => {
    console.log('Risk Score:', result.risk_score);
    console.log('Verdict:', result.verdict);
    console.log('Analysis:', result.analysis);
  })
  .catch(error => {
    console.error('Error:', error.message);
  });`}
                        </pre>
                      </div>
                    </motion.div>
                  )}

                  {/* Python Example */}
                  {selectedLanguage === 'python' && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <>
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                            🐍 Python (requests)
                          </h3>
                          <motion.button
                            onClick={() => copyToClipboard(
`import requests
import json

class XistAI:
    def __init__(self, api_key):
        self.api_key = api_key
        self.base_url = "https://api.xist.ai/v1"
        self.headers = {
            "Authorization": f"Bearer {apiKey || 'YOUR_API_KEY'}",
            "Content-Type": "application/json"
        }
    
    def analyze_text(self, content, mode="comprehensive"):
        """Analyze text content for threats"""
        url = f"{self.base_url}/analyze/text"
        data = {
            "content": content,
            "mode": mode
        }
        
        response = requests.post(url, headers=self.headers, json=data)
        
        if response.status_code != 200:
            raise Exception(f"API Error: {response.status_code}")
        
        return response.json()
    
    def analyze_url(self, url, scan_content=True):
        """Analyze URL for security threats"""
        endpoint = f"{self.base_url}/analyze/url"
        data = {
            "url": url,
            "scan_content": scan_content
        }
        
        response = requests.post(endpoint, headers=self.headers, json=data)
        return response.json()

# Usage example
if __name__ == "__main__":
    client = XistAI("${apiKey || 'YOUR_API_KEY'}")
    
    # Analyze suspicious text
    result = client.analyze_text("Urgent! You won $1,000,000! Click now!")
    
    print(f"Risk Score: {result['risk_score']}")
    print(f"Verdict: {result['verdict']}")
    print(f"Analysis: {result['analysis']}")
    
    # Analyze suspicious URL
    url_result = client.analyze_url("https://suspicious-bank.com/login")
    print(f"URL Risk: {url_result['risk_score']}")
`
                            )}
                            className="flex items-center space-x-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                            whileHover={{ scale: 1.1 }}
                          >
                            <ClipboardIcon className="w-4 h-4" />
                            <span className="text-sm">Copy</span>
                          </motion.button>
                        </div>
                        <div className="bg-gray-900 dark:bg-gray-800 rounded-lg p-6 overflow-x-auto">
                          <pre className="text-blue-400 text-sm">
{`import requests
import json

class XistAI:
    def __init__(self, api_key):
        self.api_key = api_key
        self.base_url = "https://api.xist.ai/v1"
        self.headers = {
            "Authorization": f"Bearer ${apiKey || 'YOUR_API_KEY'}",
            "Content-Type": "application/json"
        }
    
    def analyze_text(self, content, mode="comprehensive"):
        """Analyze text content for threats"""
        url = f"{self.base_url}/analyze/text"
        data = {
            "content": content,
            "mode": mode
        }
        
        response = requests.post(url, headers=self.headers, json=data)
        
        if response.status_code != 200:
            raise Exception(f"API Error: {response.status_code}")
        
        return response.json()

# Usage example
if __name__ == "__main__":
    client = XistAI("${apiKey || 'YOUR_API_KEY'}")
    
    result = client.analyze_text("Urgent! You won $1,000,000! Click now!")
    print(f"Risk Score: {result['risk_score']}")
    print(f"Verdict: {result['verdict']}")
    print(f"Analysis: {result['analysis']}")
    
    url_result = client.analyze_url("https://suspicious-bank.com/login")
    print(f"URL Risk: {url_result['risk_score']}")
`}
                          </pre>
                        </div>
                      </>
                    </motion.div>
                  )}

                  {/* cURL Example */}
                  {selectedLanguage === 'curl' && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                          🌀 cURL Commands
                        </h3>
                        <motion.button
                          onClick={() => copyToClipboard(`# Text Analysis
curl -X POST "https://api.xist.ai/v1/analyze/text" \\
  -H "Authorization: Bearer ${apiKey || 'YOUR_API_KEY'}" \\
  -H "Content-Type: application/json" \\
  -d '{
    "content": "Urgent! You won $1,000,000! Click now!",
    "mode": "comprehensive"
  }'

# URL Analysis  
curl -X POST "https://api.xist.ai/v1/analyze/url" \\
  -H "Authorization: Bearer ${apiKey || 'YOUR_API_KEY'}" \\
  -H "Content-Type: application/json" \\
  -d '{
    "url": "https://suspicious-bank.com/login",
    "scan_content": true
  }'

# Batch Analysis
curl -X POST "https://api.xist.ai/v1/analyze/batch" \\
  -H "Authorization: Bearer ${apiKey || 'YOUR_API_KEY'}" \\
  -H "Content-Type: application/json" \\
  -d '{
    "items": [
      "Free money! Click here!",
      "Your order has been shipped",
      "Verify your account immediately"
    ],
    "type": "text"
  }'`)}
                          className="flex items-center space-x-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                          whileHover={{ scale: 1.1 }}
                        >
                          <ClipboardIcon className="w-4 h-4" />
                          <span className="text-sm">Copy</span>
                        </motion.button>
                      </div>
                      <div className="bg-gray-900 dark:bg-gray-800 rounded-lg p-6 overflow-x-auto">
                        <pre className="text-yellow-400 text-sm">
{`# Text Analysis
curl -X POST "https://api.xist.ai/v1/analyze/text" \\
  -H "Authorization: Bearer ${apiKey || 'YOUR_API_KEY'}" \\
  -H "Content-Type: application/json" \\
  -d '{
    "content": "Urgent! You won $1,000,000! Click now!",
    "mode": "comprehensive"
  }'

# URL Analysis  
curl -X POST "https://api.xist.ai/v1/analyze/url" \\
  -H "Authorization: Bearer ${apiKey || 'YOUR_API_KEY'}" \\
  -H "Content-Type: application/json" \\
  -d '{
    "url": "https://suspicious-bank.com/login",
    "scan_content": true
  }'

# Get Usage Statistics
curl -X GET "https://api.xist.ai/v1/account/stats" \\
  -H "Authorization: Bearer ${apiKey || 'YOUR_API_KEY'}"`}
                        </pre>
                      </div>
                    </motion.div>
                  )}

                  {/* Node.js Example */}
                  {selectedLanguage === 'nodejs' && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                          💚 Node.js (axios)
                        </h3>
                        <motion.button
                          onClick={() => copyToClipboard(`const axios = require('axios');

class XistAIClient {
  constructor(apiKey) {
    this.apiKey = apiKey;
    this.baseURL = 'https://api.xist.ai/v1';
    this.headers = {
      'Authorization': \`Bearer \${apiKey}\`,
      'Content-Type': 'application/json'
    };
  }

  async analyzeText(content, options = {}) {
    try {
      const response = await axios.post(\`\${this.baseURL}/analyze/text\`, {
        content: content,
        mode: options.mode || 'comprehensive',
        language: options.language || 'auto'
      }, { headers: this.headers });

      return response.data;
    } catch (error) {
      throw new Error(\`API Error: \${error.response?.status} - \${error.response?.data?.message}\`);
    }
  }

  async analyzeURL(url, options = {}) {
    try {
      const response = await axios.post(\`\${this.baseURL}/analyze/url\`, {
        url: url,
        scan_content: options.scanContent !== false,
        check_redirects: options.checkRedirects !== false
      }, { headers: this.headers });

      return response.data;
    } catch (error) {
      throw new Error(\`API Error: \${error.response?.status}\`);
    }
  }

  async batchAnalyze(items, type = 'text') {
    try {
      const response = await axios.post(\`\${this.baseURL}/analyze/batch\`, {
        items: items,
        type: type
      }, { headers: this.headers });

      return response.data;
    } catch (error) {
      throw new Error(\`Batch Analysis Error: \${error.response?.status}\`);
    }
  }
}

// Usage example
async function main() {
  const client = new XistAIClient('${apiKey || 'YOUR_API_KEY'}');

  try {
    // Analyze suspicious text
    const textResult = await client.analyzeText(
      'Urgent! You won $1,000,000! Click now!',
      { mode: 'comprehensive' }
    );
    
    console.log('Text Analysis Result:');
    console.log(\`Risk Score: \${textResult.risk_score}\`);
    console.log(\`Verdict: \${textResult.verdict}\`);
    
    // Analyze suspicious URL
    const urlResult = await client.analyzeURL('https://suspicious-bank.com/login');
    console.log('\\nURL Analysis Result:');
    console.log(\`Risk Score: \${urlResult.risk_score}\`);
    console.log(\`Domain Age: \${urlResult.domain_age} days\`);
    
  } catch (error) {
    console.error('Error:', error.message);
  }
}

main();`)}
                          className="flex items-center space-x-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                          whileHover={{ scale: 1.1 }}
                        >
                          <ClipboardIcon className="w-4 h-4" />
                          <span className="text-sm">Copy</span>
                        </motion.button>
                      </div>
                      <div className="bg-gray-900 dark:bg-gray-800 rounded-lg p-6 overflow-x-auto">
                        <pre className="text-green-400 text-sm">
{`const axios = require('axios');

class XistAIClient {
  constructor(apiKey) {
    this.apiKey = apiKey;
    this.baseURL = 'https://api.xist.ai/v1';
    this.headers = {
      'Authorization': \`Bearer \${apiKey}\`,
      'Content-Type': 'application/json'
    };
  }

  async analyzeText(content, options = {}) {
    try {
      const response = await axios.post(\`\${this.baseURL}/analyze/text\`, {
        content: content,
        mode: options.mode || 'comprehensive'
      }, { headers: this.headers });

      return response.data;
    } catch (error) {
      throw new Error(\`API Error: \${error.response?.status}\`);
    }
  }
}

// Usage
const client = new XistAIClient('${apiKey || 'YOUR_API_KEY'}');
const result = await client.analyzeText('Suspicious text here');
console.log('Risk Score:', result.risk_score);`}
                        </pre>
                      </div>
                    </motion.div>
                  )}

                  {/* PHP Example */}
                  {selectedLanguage === 'php' && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                          🐘 PHP (cURL)
                        </h3>
                        <motion.button
                          onClick={() => copyToClipboard(`<?php

class XistAI {
    private $apiKey;
    private $baseUrl = 'https://api.xist.ai/v1';
    
    public function __construct($apiKey) {
        $this->apiKey = $apiKey;
    }
    
    public function analyzeText($content, $mode = 'comprehensive') {
        $url = $this->baseUrl . '/analyze/text';
        $data = json_encode([
            'content' => $content,
            'mode' => $mode
        ]);
        
        $headers = [
            'Authorization: Bearer ' . $this->apiKey,
            'Content-Type: application/json',
            'Content-Length: ' . strlen($data)
        ];
        
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, $data);
        curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, true);
        
        $response = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);
        
        if ($httpCode !== 200) {
            throw new Exception("API Error: HTTP $httpCode");
        }
        
        return json_decode($response, true);
    }
    
    public function analyzeUrl($url, $scanContent = true) {
        $endpoint = $this->baseUrl . '/analyze/url';
        $data = json_encode([
            'url' => $url,
            'scan_content' => $scanContent
        ]);
        
        // Similar cURL implementation...
        return $this->makeRequest($endpoint, $data);
    }
    
    private function makeRequest($url, $data) {
        // Helper method for making requests
        $headers = [
            'Authorization: Bearer ' . $this->apiKey,
            'Content-Type: application/json'
        ];
        
        $ch = curl_init();
        curl_setopt_array($ch, [
            CURLOPT_URL => $url,
            CURLOPT_POST => true,
            CURLOPT_POSTFIELDS => $data,
            CURLOPT_HTTPHEADER => $headers,
            CURLOPT_RETURNTRANSFER => true
        ]);
        
        $response = curl_exec($ch);
        curl_close($ch);
        
        return json_decode($response, true);
    }
}

// Usage example
try {
    $client = new XistAI('${apiKey || 'YOUR_API_KEY'}');
    
    $result = $client->analyzeText('Urgent! You won $1,000,000! Click now!');
    
    echo "Risk Score: " . $result['risk_score'] . "\\n";
    echo "Verdict: " . $result['verdict'] . "\\n";
    echo "Analysis: " . $result['analysis'] . "\\n";
    
} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\\n";
}

?>`)}
                          className="flex items-center space-x-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                          whileHover={{ scale: 1.1 }}
                        >
                          <ClipboardIcon className="w-4 h-4" />
                          <span className="text-sm">Copy</span>
                        </motion.button>
                      </div>
                      <div className="bg-gray-900 dark:bg-gray-800 rounded-lg p-6 overflow-x-auto">
                        <pre className="text-purple-400 text-sm">
{`<?php

class XistAI {
    private $apiKey;
    private $baseUrl = 'https://api.xist.ai/v1';
    
    public function __construct($apiKey) {
        $this->apiKey = $apiKey;
    }
    
    public function analyzeText($content, $mode = 'comprehensive') {
        $url = $this->baseUrl . '/analyze/text';
        $data = json_encode([
            'content' => $content,
            'mode' => $mode
        ]);
        
        $headers = [
            'Authorization: Bearer ' . $this->apiKey,
            'Content-Type: application/json'
        ];
        
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, $data);
        curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        
        $response = curl_exec($ch);
        curl_close($ch);
        
        return json_decode($response, true);
    }
}

// Usage
$client = new XistAI('${apiKey || 'YOUR_API_KEY'}');
$result = $client->analyzeText('Suspicious text');
echo "Risk: " . $result['risk_score'];

?>`}
                        </pre>
                      </div>
                    </motion.div>
                  )}

                  {/* SDK Downloads */}
                  <div className="bg-gradient-to-r from-gray-50 to-blue-50 dark:from-gray-700 dark:to-blue-900/20 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center space-x-2">
                      <ArrowDownTrayIcon className="w-5 h-5" />
                      <span>Official SDKs & Libraries</span>
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {[
                        { name: 'JavaScript', icon: '🟨', cmd: 'npm install @xist/ai-sdk' },
                        { name: 'Python', icon: '🐍', cmd: 'pip install xist-ai' },
                        { name: 'Node.js', icon: '💚', cmd: 'npm install xist-ai-node' },
                        { name: 'PHP', icon: '🐘', cmd: 'composer require xist/ai-php' }
                      ].map((sdk, index) => (
                        <motion.div
                          key={index}
                          className="p-4 bg-white dark:bg-gray-800 rounded-lg text-center"
                          whileHover={{ scale: 1.05 }}
                        >
                          <div className="text-2xl mb-2">{sdk.icon}</div>
                          <div className="font-medium text-gray-900 dark:text-white mb-2">{sdk.name}</div>
                          <code className="text-xs text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                            {sdk.cmd}
                          </code>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Pricing Tab */}
          {activeTab === 'pricing' && (
            <motion.div
              key="pricing"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
                <div className="text-center mb-12">
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                    Simple, Transparent Pricing
                  </h2>
                  <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
                    Choose the plan that fits your needs. All plans include our advanced threat detection technology.
                  </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {[
                    {
                      name: 'Free',
                      price: '$0',
                      period: 'forever',
                      description: 'Perfect for trying out our API',
                      features: [
                        '1,000 API calls/month',
                        'Text analysis',
                        'Basic threat detection',
                        'Community support',
                        '10 requests/minute limit'
                      ],
                      color: 'gray',
                      popular: false,
                      buttonText: 'Get Started Free'
                    },
                    {
                      name: 'Pro',
                      price: '$49',
                      period: 'month',
                      description: 'For growing applications and businesses',
                      features: [
                        '100,000 API calls/month',
                        'All analysis features',
                        'URL scanning',
                        'Batch processing',
                        'Priority support',
                        '100 requests/minute limit',
                        'Webhook notifications'
                      ],
                      color: 'blue',
                      popular: true,
                      buttonText: 'Start Pro Trial'
                    },
                    {
                      name: 'Enterprise',
                      price: 'Custom',
                      period: 'contact us',
                      description: 'For large-scale applications',
                      features: [
                        'Unlimited API calls',
                        'Custom threat models',
                        'Dedicated infrastructure',
                        'SLA guarantees',
                        '24/7 dedicated support',
                        'On-premise deployment',
                        'Custom integrations'
                      ],
                      color: 'purple',
                      popular: false,
                      buttonText: 'Contact Sales'
                    }
                  ].map((plan, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className={`relative rounded-2xl p-8 ${
                        plan.popular
                          ? 'bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-2 border-blue-500'
                          : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700'
                      }`}
                      whileHover={{ scale: 1.02 }}
                    >
                      {plan.popular && (
                        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                          <div className="bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                            Most Popular
                          </div>
                        </div>
                      )}
                      
                      <div className="text-center mb-8">
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                          {plan.name}
                        </h3>
                        <div className="mb-4">
                          <span className="text-4xl font-bold text-gray-900 dark:text-white">
                            {plan.price}
                          </span>
                          {plan.price !== 'Custom' && (
                            <span className="text-gray-600 dark:text-gray-400">/{plan.period}</span>
                          )}
                        </div>
                        <p className="text-gray-600 dark:text-gray-400">
                          {plan.description}
                        </p>
                      </div>
                      
                      <div className="space-y-4 mb-8">
                        {plan.features.map((feature, featureIndex) => (
                          <div key={featureIndex} className="flex items-center space-x-3">
                            <CheckCircleIcon className={`w-5 h-5 ${
                              plan.color === 'blue' ? 'text-blue-600' :
                              plan.color === 'purple' ? 'text-purple-600' :
                              'text-green-600'
                            }`} />
                            <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                          </div>
                        ))}
                      </div>
                      
                      <motion.button
                        className={`w-full py-3 px-6 rounded-lg font-medium transition-all ${
                          plan.popular
                            ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg'
                            : plan.color === 'purple'
                            ? 'bg-purple-600 text-white hover:bg-purple-700'
                            : 'bg-gray-100 text-gray-900 hover:bg-gray-200 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600'
                        }`}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => showNotification(`🚀 ${plan.buttonText} clicked!`, 'info')}
                      >
                        {plan.buttonText}
                      </motion.button>
                    </motion.div>
                  ))}
                </div>

                {/* Pricing FAQ */}
                <div className="mt-16 bg-gray-50 dark:bg-gray-700 rounded-xl p-8">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 text-center">
                    Frequently Asked Questions
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[
                      {
                        q: 'What counts as an API call?',
                        a: 'Each request to any endpoint counts as one API call, regardless of the amount of content analyzed.'
                      },
                      {
                        q: 'Can I upgrade or downgrade anytime?',
                        a: 'Yes, you can change your plan at any time. Changes take effect immediately with prorated billing.'
                      },
                      {
                        q: 'What happens if I exceed my limit?',
                        a: 'API requests will be rate-limited. You can upgrade your plan or wait for the next billing cycle.'
                      },
                      {
                        q: 'Do you offer custom solutions?',
                        a: 'Yes, our Enterprise plan includes custom integrations, dedicated infrastructure, and specialized models.'
                      }
                    ].map((faq, index) => (
                      <div key={index} className="space-y-2">
                        <h4 className="font-semibold text-gray-900 dark:text-white">{faq.q}</h4>
                        <p className="text-gray-600 dark:text-gray-400 text-sm">{faq.a}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Copied Success Message */}
        <AnimatePresence>
          {copiedText && (
            <motion.div
              className="fixed bottom-4 right-4 bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg z-50"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
            >
              <div className="flex items-center space-x-2">
                <CheckCircleIcon className="w-4 h-4" />
                <span>Copied to clipboard!</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
};

export default APISection;
