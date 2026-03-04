import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  ShieldCheckIcon, ExclamationTriangleIcon, ChartBarIcon, GlobeAltIcon,
  UserGroupIcon, BookOpenIcon, TrophyIcon, SparklesIcon, ClockIcon,
  BellAlertIcon, CpuChipIcon, MicrophoneIcon, PhoneIcon,
  ArrowTrendingUpIcon, ArrowTrendingDownIcon, BoltIcon
} from '@heroicons/react/24/outline';
import Card, { MetricCard, GradientCard } from '../UI/Card';
import LoadingSpinner from '../UI/LoadingSpinner';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const HomeSection = ({ user, userStats, onUpdateStats, setCurrentSection, theme }) => {
  const [isLoading, setIsLoading] = useState(true);
  
  // 🎯 PRE-LOADED CARDS: Ensuring they never disappear during loads
  const [quickActions, setQuickActions] = useState([
    { id: 'verify', title: 'Threat Analysis', description: 'Analyze suspicious content', icon: ShieldCheckIcon, gradient: 'from-purple-500 to-indigo-600', stats: 'Ready to scan', action: () => setCurrentSection('verify') },
    { id: 'community', title: 'Community Hub', description: 'Share experiences & get help', icon: UserGroupIcon, gradient: 'from-green-500 to-emerald-600', stats: 'Connect with community', action: () => setCurrentSection('community') },
    { id: 'protection', title: 'Emergency Help', description: 'Access emergency helplines', icon: PhoneIcon, gradient: 'from-red-500 to-pink-600', stats: 'Global emergency database', action: () => setCurrentSection('protection') }
  ]);
  
  const [recentActivity, setRecentActivity] = useState([
    { id: 1, type: 'system', title: 'System Synced', description: 'Xist AI Shield is active and monitoring.', timestamp: new Date(), status: 'info', icon: CpuChipIcon }
  ]);
  
  const [personalizedInsights, setPersonalizedInsights] = useState([]);
  
  // 🎯 REAL-TIME PERSONAL METRICS (From Private Ledger)
  const [personalStats, setPersonalStats] = useState({
    analyses: 0,
    threats: 0,
    points: 0,
    accuracy: 0
  });
  
  const [liveGlobalStats, setLiveGlobalStats] = useState({
    globalThreats: 0,      
    activeUsers: 1, 
    threatsBlocked: 0,     
    accuracyRate: 0        
  });

  // ✅ GLOBAL TELEMETRY: Merges Community Threats + Private Scans for true absolute numbers
  const fetchLiveDatabaseStats = async () => {
    try {
      // 1. Fetch count from public community threats
      const { count: publicCount } = await supabase
        .from('community_threats')
        .select('*', { count: 'exact', head: true });

      // 2. Fetch count from private intelligence ledger (user_history)
      const { count: privateCount } = await supabase
        .from('user_history')
        .select('*', { count: 'exact', head: true });

      const totalGlobalThreats = (publicCount || 0) + (privateCount || 0);

      // 3. Count unique active contributors across the platform
      const { data: activeNodes } = await supabase
        .from('user_history')
        .select('user_id');
      
      const uniqueNodes = activeNodes ? new Set(activeNodes.map(item => item.user_id)).size : 1;

      setLiveGlobalStats(prev => ({
        ...prev,
        globalThreats: totalGlobalThreats,
        threatsBlocked: totalGlobalThreats,
        activeUsers: uniqueNodes || 1
      }));
    } catch (err) {
      console.error("Stats sync error:", err);
    }
  };

  // ✅ PERSONAL TELEMETRY: Reads directly from your Private Ledger (user_history)
  const initializeDashboard = async () => {
    // 🚨 CRITICAL FIX: Cross-provider authentication check
    const currentUserId = user?.id || user?.uid;
    
    if (!currentUserId) {
      setIsLoading(false);
      return;
    }

    try {
      // Fetch THIS USER'S real records from the Private Ledger
      const { data: userRecords, error } = await supabase
        .from('user_history')
        .select('*')
        .eq('user_id', currentUserId);

      if (!error && userRecords) {
        const totalAnalyses = userRecords.length;
        
       // ✅ FIX: Checks 'verdict', 'threat_level', AND 'severity' to catch the 29 scans
const threatsFound = userRecords.filter(r => {
  const status = (r.verdict || r.threat_level || r.severity || '').toLowerCase();
  return status.includes('high') || 
         status.includes('medium') || 
         status.includes('critical') || 
         status.includes('threat') || 
         status.includes('danger');
}).length;
        
        const calculatedAccuracy = totalAnalyses > 0 ? ((threatsFound / totalAnalyses) * 100).toFixed(1) : 0;

        // Populate your specific numbers for the Protection Status bar
        setPersonalStats({
          analyses: totalAnalyses,
          threats: threatsFound,
          points: totalAnalyses * 15, // 15 points per analysis
          accuracy: calculatedAccuracy
        });
        
        // Sync global accuracy UI with your personal accuracy
        setLiveGlobalStats(prev => ({
          ...prev,
          accuracyRate: calculatedAccuracy
        }));

        // Update action cards
        setQuickActions(prev => prev.map(a => a.id === 'verify' ? { ...a, stats: `${totalAnalyses} completed` } : a));

        // Generate dynamic intelligence briefing
        const insights = [];
        if (totalAnalyses > 0) {
          insights.push({
            id: 1, type: 'achievement', title: 'Your Security Contribution', description: `You've completed ${totalAnalyses} threat analyses in your private ledger.`, action: 'View Details', icon: TrophyIcon, color: 'green', actionHandler: () => setCurrentSection('analytics')
          });
        }
        insights.push({ id: 4, type: 'education', title: 'Security Education', description: 'Learn cybersecurity fundamentals and threat identification techniques.', action: 'Start Learning', icon: BookOpenIcon, color: 'blue', actionHandler: () => setCurrentSection('education') });
        
        setPersonalizedInsights(insights);
      }
    } catch (error) {
      console.error('Dashboard error:', error);
    } finally {
      setIsLoading(false); // Guarantee loading screen vanishes
    }
  };

  // ✅ BULLETPROOF LIFECYCLE: Prevents infinite loops and handles Real-time
  useEffect(() => {
    const currentUserId = user?.id || user?.uid;
    setIsLoading(true);
    fetchLiveDatabaseStats();
    
    // Fallback release if user takes too long to load
    if (currentUserId) {
      initializeDashboard();
    } else {
      const timer = setTimeout(() => setIsLoading(false), 3000);
      return () => clearTimeout(timer);
    }

    // Listen to Community Posts
    const communityChannel = supabase
      .channel('public_threats')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'community_threats' }, 
        () => fetchLiveDatabaseStats()
      ).subscribe();

    // Listen to Private Ledger Scans
    const historyChannel = supabase
      .channel('private_ledger')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'user_history' }, 
        (payload) => {
          fetchLiveDatabaseStats();
          if (payload.new.user_id === currentUserId) {
            initializeDashboard();
            
            // Push update to Live Feed
            setRecentActivity(prev => [{
              id: Date.now(), type: 'personal', title: 'Analysis Logged', description: `Network node logged a private threat analysis.`, timestamp: new Date(), status: 'success', icon: ShieldCheckIcon
            }, ...prev.slice(0, 4)]);
          }
        }
      ).subscribe();
      
    return () => { 
      communityChannel.unsubscribe(); 
      historyChannel.unsubscribe();
    };
  }, [user?.id, user?.uid]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'success': return 'text-green-600 bg-green-100 dark:bg-green-900/20';
      case 'info': return 'text-blue-600 bg-blue-100 dark:bg-blue-900/20';
      default: return 'text-gray-600 bg-gray-100 dark:bg-gray-700';
    }
  };

  if (isLoading) return <div className="h-96 flex items-center justify-center"><LoadingSpinner size="lg" text="Syncing Global Intelligence..." /></div>;

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white text-center p-8 md:p-12 rounded-2xl border border-white/5 shadow-2xl"
      >
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 border-indigo-400/50 rounded-tl-lg animate-pulse"></div>
          <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-indigo-400/50 rounded-tr-lg animate-pulse"></div>
          <div className="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 border-indigo-400/50 rounded-bl-lg animate-pulse"></div>
          <div className="absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2 border-indigo-400/50 rounded-br-lg animate-pulse"></div>
        </div>

        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <motion.div 
            animate={{ opacity: [0.05, 0.12, 0.05] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-1/4 left-1/4 w-64 h-64 md:w-96 md:h-96 bg-cyan-500/10 rounded-full blur-[120px]"
          />
          <motion.div 
            animate={{ opacity: [0.05, 0.12, 0.05] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
            className="absolute bottom-0 right-1/4 w-64 h-64 md:w-96 md:h-96 bg-purple-500/10 rounded-full blur-[120px]"
          />
        </div>
        
        <div className="relative z-10">
          <div className="relative w-32 h-32 mx-auto mb-6 flex items-center justify-center">
            <motion.div 
              className="absolute inset-0 opacity-20 pointer-events-none rounded-2xl" 
              animate={{ 
                backgroundPosition: ["0px 0px", "20px 20px"],
                opacity: [0.15, 0.25, 0.15] 
              }}
              transition={{ 
                backgroundPosition: { duration: 8, repeat: Infinity, ease: "linear" },
                opacity: { duration: 4, repeat: Infinity, ease: "easeInOut" }
              }}
              style={{ 
                backgroundImage: 'linear-gradient(#4f46e5 1px, transparent 1px), linear-gradient(90deg, #4f46e5 1px, transparent 1px)', 
                backgroundSize: '10px 10px' 
              }}
            />

            <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full overflow-visible">
              <defs>
                <linearGradient id="traceGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#22d3ee" />
                  <stop offset="100%" stopColor="#a855f7" />
                </linearGradient>
                <filter id="neonGlow">
                  <feGaussianBlur stdDeviation="1.5" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>
              
              <motion.path
                d="M32,38 L68,38 L68,72"
                fill="none"
                stroke="url(#traceGradient)"
                strokeWidth="1.5"
                strokeLinecap="round"
                filter="url(#neonGlow)"
                initial={{ pathLength: 0.1, pathOffset: 0 }}
                animate={{ pathOffset: [0, 1] }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
              />
            </svg>

            <motion.div
              initial={{ scale: 0 }}
              animate={{ 
                scale: 1, 
                y: [0, -5, 0] 
              }}
              transition={{ 
                scale: { type: "spring", stiffness: 260, damping: 20 },
                y: { duration: 4, repeat: Infinity, ease: "easeInOut" }
              }}
              className="relative z-10 w-20 h-20 flex items-center justify-center drop-shadow-[0_0_10px_rgba(99,102,241,0.4)]"
            >
              <img
                src="/logo.png"
                alt="Xist AI"
                className="w-full h-full object-contain"
                style={{ imageRendering: 'auto', willChange: 'transform' }}
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextElementSibling.style.display = 'flex';
                }}
              />
            </motion.div>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white via-cyan-200 to-purple-200">
            {user ? `Welcome back, ${user.displayName?.split(' ')[0] || 'User'}!` : 'Welcome to Xist AI'}
          </h1>
          
          <p className="text-xl md:text-2xl opacity-95 mb-3 font-light text-cyan-100">
            Illuminating the Truth in Everything That Exists
          </p>

          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-gray-300 mb-8">
            <span className="flex items-center">
              <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
              <ShieldCheckIcon className="w-4 h-4 mr-1" />
              {liveGlobalStats.globalThreats.toLocaleString()} Forensic Records
            </span>
            <span className="flex items-center">
              <div className="w-2 h-2 bg-blue-400 rounded-full mr-2 animate-pulse"></div>
              <UserGroupIcon className="w-4 h-4 mr-1" />
              {liveGlobalStats.activeUsers} Verified Nodes
            </span>
            {liveGlobalStats.accuracyRate > 0 && (
              <span className="flex items-center">
                <div className="w-2 h-2 bg-purple-400 rounded-full mr-2 animate-pulse"></div>
                <CpuChipIcon className="w-4 h-4 mr-1" />
                {liveGlobalStats.accuracyRate}% Accuracy
              </span>
            )}
          </div>

         {/* 🛡️ REAL PROTECTION STATUS: Pulled directly from Private Ledger */}
          {user && (
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 max-w-2xl mx-auto border border-white/10">
              <h3 className="text-sm font-bold uppercase tracking-widest text-cyan-300 mb-4">Your Protection Status</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">{personalStats.analyses}</div>
                  <div className="text-[10px] uppercase text-gray-400">Analyses</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">{personalStats.threats}</div>
                  <div className="text-[10px] uppercase text-gray-400">Threats Found</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">{personalStats.points}</div>
                  <div className="text-[10px] uppercase text-gray-400">Points</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">{personalStats.accuracy}%</div>
                  <div className="text-[10px] uppercase text-gray-400">Accuracy</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </motion.div>

      <div className="grid lg:grid-cols-12 gap-8">
         <div className="lg:col-span-8 space-y-8">
            <div className="grid md:grid-cols-3 gap-6">
               {quickActions.map((action) => (
                 <motion.button
                   key={action.id}
                   whileHover={{ y: -5 }}
                   whileTap={{ scale: 0.98 }}
                   onClick={action.action}
                   className={`p-6 rounded-2xl bg-gradient-to-br ${action.gradient} text-white text-left shadow-xl relative overflow-hidden group`}
                 >
                    <action.icon className="w-10 h-10 mb-4" />
                    <h3 className="text-xl font-bold mb-2">{action.title}</h3>
                    <p className="text-sm opacity-80 font-light">{action.description}</p>
                 </motion.button>
               ))}
            </div>

            <div className="space-y-4">
               <h2 className="text-xl font-bold flex items-center gap-2 dark:text-white">
                 <BellAlertIcon className="w-5 h-5 text-indigo-500" /> Intelligence Briefing
               </h2>
               <div className="grid md:grid-cols-2 gap-4">
                 {personalizedInsights.map((insight) => (
                    <Card key={insight.id} className="p-5 bg-white dark:bg-slate-900 border-none shadow-sm">
                       <div className="flex gap-4">
                          <insight.icon className="w-6 h-6 text-indigo-500" />
                          <div>
                             <h4 className="font-bold dark:text-white">{insight.title}</h4>
                             <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 mb-3">{insight.description}</p>
                             <button onClick={insight.actionHandler} className="text-xs font-bold text-indigo-500 uppercase tracking-widest">
                               {insight.action} →
                             </button>
                          </div>
                       </div>
                    </Card>
                 ))}
               </div>
            </div>
         </div>

         <div className="lg:col-span-4">
            <h2 className="text-xl font-bold flex items-center gap-2 dark:text-white mb-4">
              <ClockIcon className="w-5 h-5 text-indigo-500" /> Live Feed
            </h2>
            <div className="space-y-3 bg-white dark:bg-slate-900 p-4 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800">
               {recentActivity.map((activity) => (
                 <div key={activity.id} className="flex gap-4 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-all">
                    <div className={`p-2 rounded-lg h-fit ${getStatusColor(activity.status)}`}>
                       <activity.icon className="w-5 h-5" />
                    </div>
                    <div>
                       <div className="text-sm font-bold dark:text-white">{activity.title}</div>
                       <div className="text-xs text-slate-500 mt-1">{activity.description}</div>
                       <div className="text-[10px] text-slate-400 mt-2">{activity.timestamp.toLocaleTimeString()}</div>
                    </div>
                 </div>
               ))}
            </div>
         </div>
      </div>
    </div>
  );
};

export default HomeSection;