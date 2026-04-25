import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AreaChart, Area, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Label } from 'recharts';
import { useAuth } from '../../hooks/useAuth';
import { showNotification } from '../UI/NotificationToast';
import { supabase } from '../../lib/supabase';
import {
  ChartBarIcon, ShieldCheckIcon, DocumentTextIcon, SparklesIcon,
  ExclamationTriangleIcon, CheckCircleIcon, ArrowDownTrayIcon, CpuChipIcon,
  ClockIcon, FunnelIcon, XMarkIcon
} from '@heroicons/react/24/outline';

// ==============================
// UTILITIES
// ==============================
const useTypewriter = (text, speed = 80, delay = 200) => {
  const [displayedText, setDisplayedText] = useState("");
  const [started, setStarted] = useState(false);
  useEffect(() => {
    const timeout = setTimeout(() => setStarted(true), delay);
    return () => clearTimeout(timeout);
  }, [delay]);
  useEffect(() => {
    if (!started) return;
    if (displayedText.length < text.length) {
      const timeout = setTimeout(() => {
        setDisplayedText(text.slice(0, displayedText.length + 1));
      }, speed);
      return () => clearTimeout(timeout);
    }
  }, [displayedText, text, speed, started]);
  return displayedText;
};

const timeAgo = (utcDateStr) => {
  if (!utcDateStr) return 'Just now';
  const safeStr = utcDateStr.endsWith('Z') || utcDateStr.includes('+') ? utcDateStr : `${utcDateStr}Z`;
  const date = new Date(safeStr);
  const now = new Date();
  const seconds = Math.max(0, Math.round((now - date) / 1000));
  const minutes = Math.round(seconds / 60);
  const hours = Math.round(minutes / 60);
  if (seconds < 60) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
};

// ==============================
// MAIN COMPONENT
// ==============================
// 🚀 FIX: Added setCurrentSection to props!
const AnalyticsSection = ({ theme: globalTheme, setCurrentSection }) => {
  const { user } = useAuth();
  
  // Keep isDark only for Recharts SVG properties which don't support Tailwind classes directly
  const isDark = globalTheme === 'dark'; 
  
  const typingTitle = useTypewriter("Activity Dashboard", 80, 200);
  
  const [selectedTimeRange, setSelectedTimeRange] = useState('24hours');
  const [showTimeMenu, setShowTimeMenu] = useState(false);
  const [isRealTimeEnabled, setIsRealTimeEnabled] = useState(true);
  const [analyticsData, setAnalyticsData] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [cloudData, setCloudData] = useState([]);

  const TIME_RANGES = {
    '1hour': { label: 'Past Hour', hours: 1 },
    '6hours': { label: 'Past 6 Hours', hours: 6 },
    '24hours': { label: 'Past 24 Hours', hours: 24 },
    '7days': { label: 'Past 7 Days', hours: 168 },
    '30days': { label: 'Past 30 Days', hours: 720 }
  };

  const CHART_COLORS = ['#6366f1', '#10b981', '#f43f5e', '#f59e0b', '#8b5cf6', '#06b6d4'];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.2 } }
  };
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 100 } }
  };

  useEffect(() => {
    const currentUserId = user?.id || user?.uid;
    const fetchCloudHistory = async () => {
      if (!currentUserId) { setIsLoading(false); return; }
      setIsLoading(true);
      const { data, error } = await supabase.from('user_history').select('*').eq('user_id', currentUserId).order('created_at', { ascending: false });
      if (data && !error) setCloudData(data);
      setIsLoading(false);
    };
    fetchCloudHistory();

    if (!currentUserId) return;
    const subscription = supabase.channel('analytics_realtime').on('postgres_changes', { 
        event: 'INSERT', schema: 'public', table: 'user_history', filter: `user_id=eq.${currentUserId}`
      }, payload => {
        if (isRealTimeEnabled) setCloudData(prev => [payload.new, ...prev]);
      }).subscribe();
    return () => supabase.removeChannel(subscription);
  }, [user, isRealTimeEnabled]);

  useEffect(() => {
    if (cloudData.length === 0) { setAnalyticsData({}); return; }
    const now = new Date();
    const timeRange = TIME_RANGES[selectedTimeRange];
    const cutoffTime = new Date(now.getTime() - timeRange.hours * 60 * 60 * 1000);
    const filteredData = cloudData.filter(record => {
      const dbTimeStr = record.created_at.endsWith('Z') || record.created_at.includes('+') ? record.created_at : `${record.created_at}Z`;
      return new Date(dbTimeStr).getTime() > cutoffTime.getTime();
    });
    const bucketCount = selectedTimeRange.includes('hour') ? 12 : selectedTimeRange === '7days' ? 7 : 30;
    const bucketSize = (timeRange.hours * 60 * 60 * 1000) / bucketCount;
    const timeBuckets = Array.from({ length: bucketCount }, (_, i) => {
      const bucketTime = new Date(now.getTime() - (bucketCount - 1 - i) * bucketSize);
      return { time: bucketTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }), analyses: 0, threats: 0, safe: 0 };
    });

    let threatsDetected = 0; let safeContent = 0; let totalScore = 0;
    filteredData.forEach(record => {
      const dbTimeStr = record.created_at.endsWith('Z') || record.created_at.includes('+') ? record.created_at : `${record.created_at}Z`;
      const analysisTime = new Date(dbTimeStr);
      const bucketIndex = Math.floor((now.getTime() - analysisTime.getTime()) / bucketSize);
      if (bucketIndex >= 0 && bucketIndex < bucketCount) {
        const targetBucket = timeBuckets[bucketCount - 1 - bucketIndex];
        targetBucket.analyses++;
        if (record.verdict === 'CRITICAL') { targetBucket.threats++; threatsDetected++; }
        else if (record.verdict === 'SAFE') { targetBucket.safe++; safeContent++; }
      }
      totalScore += record.score || 0;
    });

    const categories = {};
    filteredData.forEach(record => {
      const key = `${record.mode.toUpperCase()} (${record.verdict})`;
      categories[key] = (categories[key] || 0) + 1;
    });

    setAnalyticsData({
      totalAnalyses: filteredData.length, threatsDetected, safeContent,
      averageAccuracy: filteredData.length > 0 ? Math.round(totalScore / filteredData.length) : 0,
      timeSeriesData: timeBuckets,
      categoryData: Object.entries(categories).map(([name, count]) => ({ name, value: count })),
      recentAnalyses: filteredData.slice(0, 10)
    });
  }, [cloudData, selectedTimeRange]);

  const exportAnalytics = () => {
    const blob = new Blob([JSON.stringify(analyticsData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = `xist-analytics-${Date.now()}.json`;
    a.click(); showNotification('Data exported successfully', 'success');
  };

  if (isLoading) return (
    <div className="flex items-center justify-center min-h-[80vh] w-full bg-transparent">
      <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }} className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full shadow-[0_0_15px_rgba(99,102,241,0.5)]" />
    </div>
  );

  return (
    <motion.div initial="hidden" animate="visible" variants={containerVariants}
      className="w-full min-h-screen relative overflow-x-hidden" 
      style={{ marginTop: '64px' }}
    >
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] dark:invert-0 invert z-0" 
           style={{ backgroundImage: 'linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>

      <div className="sticky top-0 z-30 px-4 py-8 md:py-12 transition-all overflow-visible bg-transparent">
        
        <div className="absolute inset-0 pointer-events-none opacity-[0.05] md:opacity-[0.03] dark:invert-0 invert z-0" 
             style={{ backgroundImage: 'linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>

        <div className="max-w-4xl mx-auto flex flex-col items-center justify-center relative z-10 overflow-visible">
          
          <ChartBarIcon className="w-10 h-10 md:w-14 md:h-14 text-indigo-500 dark:text-indigo-400 mb-5 stroke-[1.5]" />
          
          {/* 🚀 FOOLPROOF DARK CONTRAST: text-black ensures it works on ANY Tailwind version */}
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-center mb-2 pb-4 leading-tight tracking-tight text-black dark:text-white">
            <span className="text-brand-highlight">{typingTitle}</span>
            <motion.span animate={{ opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 0.9 }} className="inline-block w-2.5 md:w-3 h-[0.8em] bg-indigo-600 dark:bg-indigo-400 ml-2 align-baseline" />
          </h1>

          <p className="text-[9px] md:text-[11px] font-mono font-bold uppercase tracking-[0.3em] md:tracking-[0.4em] text-slate-600 dark:text-slate-400 mb-8 md:mb-12 text-center px-4">
            Your personal security overview
          </p>

          <div className="hidden md:flex w-full max-w-4xl px-2 overflow-visible justify-center pb-2 flex-wrap gap-y-2">
            <div className="p-1.5 flex items-center gap-1 rounded-full glass-input transition-all flex-wrap justify-center">
              {Object.entries(TIME_RANGES).map(([key, range]) => (
                <button 
                  key={key} onClick={() => setSelectedTimeRange(key)} 
                  className={`relative px-6 py-2.5 rounded-full text-[10px] md:text-[11px] font-black uppercase tracking-widest transition-all duration-300 flex-shrink-0 ${
                    selectedTimeRange === key 
                      ? 'text-white' 
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {selectedTimeRange === key && (
                    <motion.div layoutId="activeTimeRange" className="absolute inset-0 rounded-full shadow-lg bg-indigo-600" transition={{ type: 'spring', stiffness: 400, damping: 30 }} />
                  )}
                  <span className="relative z-10 block py-0.5">{range.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="md:hidden relative mt-1 w-max mx-auto overflow-visible pb-2">
            <button 
              onClick={() => setShowTimeMenu(true)}
              className="flex items-center gap-2 px-6 py-3 rounded-full glass-card text-slate-900 dark:text-white shadow-lg transition-all"
            >
              <ClockIcon className="w-4 h-4 text-indigo-500" />
              <span className="text-[11px] font-black uppercase tracking-widest block py-0.5">
                {TIME_RANGES[selectedTimeRange].label}
              </span>
            </button>
          </div>

          <div className="flex md:hidden items-center justify-center gap-3 mt-6">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg glass-input border border-black/10 dark:border-white/10">
              <button onClick={() => setIsRealTimeEnabled(!isRealTimeEnabled)} className={`relative inline-flex h-4 w-7 items-center rounded-full transition-colors ${isRealTimeEnabled ? 'bg-indigo-500' : 'bg-slate-400 dark:bg-slate-700'}`}>
                <motion.span className={`inline-block h-2.5 w-2.5 transform rounded-full bg-white transition-transform ${isRealTimeEnabled ? 'translate-x-4' : 'translate-x-0.5'}`} layout />
              </button>
              <span className={`text-[9px] font-black uppercase tracking-widest ${isRealTimeEnabled ? 'text-emerald-500' : 'text-slate-500'}`}>
                Live
              </span>
            </div>
            <button onClick={exportAnalytics} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all glass-input text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300">
              <ArrowDownTrayIcon className="w-3 h-3" /> Export
            </button>
          </div>

          <div className="absolute right-0 top-0 hidden md:flex items-center gap-3">
            <div className="flex items-center gap-3 px-4 py-2 rounded-xl glass-input border border-black/10 dark:border-white/10">
              <button onClick={() => setIsRealTimeEnabled(!isRealTimeEnabled)} className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${isRealTimeEnabled ? 'bg-indigo-500' : 'bg-slate-400 dark:bg-slate-700'}`}>
                <motion.span className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${isRealTimeEnabled ? 'translate-x-5' : 'translate-x-1'}`} layout />
              </button>
              <span className={`text-[10px] font-black uppercase tracking-widest ${isRealTimeEnabled ? 'text-emerald-500 dark:text-emerald-400' : 'text-slate-500'}`}>
                {isRealTimeEnabled ? 'Live Sync' : 'Offline'}
              </span>
            </div>
            <button onClick={exportAnalytics} className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all glass-input text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300">
              <ArrowDownTrayIcon className="w-4 h-4" /> Download Data
            </button>
          </div>

        </div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10 px-4 md:px-8 py-8 space-y-8">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { title: 'Total Scans', value: analyticsData.totalAnalyses || 0, icon: DocumentTextIcon, color: 'text-indigo-500', bg: 'bg-indigo-500/10 border border-indigo-500/20' },
            { title: 'Threats Found', value: analyticsData.threatsDetected || 0, icon: ExclamationTriangleIcon, color: 'text-rose-500', bg: 'bg-rose-500/10 border border-rose-500/20' },
            { title: 'Verified Safe', value: analyticsData.safeContent || 0, icon: CheckCircleIcon, color: 'text-emerald-500', bg: 'bg-emerald-500/10 border border-emerald-500/20' },
            { title: 'Avg. Trust Score', value: `${analyticsData.averageAccuracy || 0}%`, icon: SparklesIcon, color: 'text-purple-500', bg: 'bg-purple-500/10 border border-purple-500/20' }
          ].map((stat) => (
            <motion.div key={stat.title} variants={itemVariants} className="glass-card rounded-[2rem] p-6 transition-all hover:-translate-y-1 hover:shadow-2xl group">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-500 dark:text-slate-400 text-[10px] font-black tracking-widest uppercase mb-2 group-hover:text-indigo-500 dark:group-hover:text-indigo-400 transition-colors">{stat.title}</p>
                  <p className="text-3xl font-black text-slate-900 dark:text-white">{stat.value}</p>
                </div>
                <div className={`p-4 rounded-2xl ${stat.bg}`}><stat.icon className={`w-6 h-6 ${stat.color}`} /></div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          <motion.div variants={itemVariants} className="lg:col-span-8 glass-card rounded-[2rem] p-6 md:p-8 flex flex-col">
            <div className="flex items-center justify-between mb-8">
               <h3 className="text-xs md:text-sm font-black uppercase tracking-widest flex items-center gap-2 text-slate-900 dark:text-white">
                 <CpuChipIcon className="w-5 h-5 text-indigo-500" /> Scanning Activity
               </h3>
               <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></div>
            </div>
            
            <div className="h-72 w-full flex-grow">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={analyticsData.timeSeriesData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorScans" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorThreats" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"} vertical={false} />
                  <XAxis dataKey="time" stroke={isDark ? "#64748b" : "#94a3b8"} fontSize={10} tickLine={false} axisLine={false} dy={10} />
                  <YAxis stroke={isDark ? "#64748b" : "#94a3b8"} fontSize={10} tickLine={false} axisLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: isDark ? 'rgba(15, 23, 42, 0.9)' : 'rgba(255, 255, 255, 0.9)', backdropFilter: 'blur(8px)', border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.1)', borderRadius: '12px', color: isDark ? '#f8fafc' : '#0f172a', fontWeight: 'bold' }} 
                    itemStyle={{ fontSize: '12px' }}
                  />
                  <Area type="monotone" dataKey="analyses" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorScans)" name="Total Scans" />
                  <Area type="monotone" dataKey="threats" stroke="#f43f5e" strokeWidth={3} fillOpacity={1} fill="url(#colorThreats)" name="Threats Found" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="lg:col-span-4 glass-card rounded-[2rem] p-6 md:p-8 flex flex-col">
            <h3 className="text-xs md:text-sm font-black uppercase tracking-widest flex items-center gap-2 mb-4 text-slate-900 dark:text-white">
              <ShieldCheckIcon className="w-5 h-5 text-indigo-500" /> Content Types
            </h3>
            
            <div className="h-[380px] w-full relative"> 
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie 
                     data={analyticsData.categoryData?.length > 0 ? analyticsData.categoryData : [{ name: 'No Data', value: 1 }]} 
                     cx="50%" 
                     cy="40%" 
                     innerRadius="55%" 
                     outerRadius="75%" 
                     paddingAngle={6} 
                     cornerRadius={8} 
                     dataKey="value"
                     stroke="none"
                  >
                    <Label
                      content={({ viewBox: { cx, cy } }) => (
                        <text x={cx} y={cy} textAnchor="middle" dominantBaseline="central">
                          <tspan x={cx} y={cy - 5} fontSize="36" fontWeight="900" fill={isDark ? "#f8fafc" : "#0f172a"}>
                            {analyticsData.totalAnalyses || 0}
                          </tspan>
                          <tspan x={cx} y={cy + 20} fontSize="10" fontWeight="900" letterSpacing="0.1em" fill={isDark ? "#64748b" : "#94a3b8"}>
                            SCANS
                          </tspan>
                        </text>
                      )}
                    />
                    
                    {analyticsData.categoryData?.length > 0 ? (
                      analyticsData.categoryData.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                      ))
                    ) : (
                      <Cell fill={isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'} />
                    )}
                  </Pie>
                  
                  <Tooltip 
                    contentStyle={{ backgroundColor: isDark ? 'rgba(15, 23, 42, 0.9)' : 'rgba(255, 255, 255, 0.9)', backdropFilter: 'blur(8px)', border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.1)', borderRadius: '12px', color: isDark ? '#f8fafc' : '#0f172a', fontWeight: 'bold' }} 
                    itemStyle={{ fontSize: '12px' }}
                  />
                  <Legend 
                     verticalAlign="bottom" 
                     align="center" 
                     layout="horizontal" 
                     iconType="circle"
                     wrapperStyle={{ paddingTop: "20px", fontSize: "10px", fontWeight: "bold", textTransform: "uppercase", letterSpacing: "1px", lineHeight: "1.5" }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        </div>

        {/* 🚀 FIX: The routing onClick is now correctly placed here! */}
        <motion.div variants={itemVariants} className="glass-card rounded-[2rem] p-6 md:p-8">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-black/10 dark:border-white/10">
             <h3 className="text-xs md:text-sm font-black uppercase tracking-widest flex items-center gap-2 text-slate-900 dark:text-white">
               <DocumentTextIcon className="w-5 h-5 text-indigo-500" /> Recent History
             </h3>
          </div>
          
          <div className="space-y-3">
            {analyticsData.recentAnalyses?.length > 0 ? (
              analyticsData.recentAnalyses.map((record, index) => (
                <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.05 }} key={record.id} 
                            onClick={() => {
                              sessionStorage.setItem('xist_view_history_id', record.id);
                              window.dispatchEvent(new Event('xist_history_clicked'));
                              setCurrentSection('scan-details');
                            }}
                            className="flex items-center justify-between p-4 rounded-2xl glass-input transition-colors group hover:shadow-lg cursor-pointer">
                  <div className="flex items-center gap-4 overflow-hidden">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center font-black text-xs shadow-md flex-shrink-0 border ${
                      record.verdict === 'CRITICAL' ? 'bg-rose-500/20 text-rose-500 dark:text-rose-400 border-rose-500/30' :
                      record.verdict === 'QUESTIONABLE' || record.verdict === 'SUSPICIOUS' ? 'bg-amber-500/20 text-amber-500 dark:text-amber-400 border-amber-500/30' :
                      'bg-emerald-500/20 text-emerald-500 dark:text-emerald-400 border-emerald-500/30'
                    }`}>
                      {Math.round(record.score)}%
                    </div>
                    <div className="truncate">
                      <p className="font-black uppercase tracking-widest text-xs mb-1 text-slate-900 dark:text-white">{record.verdict}</p>
                      <p className="text-[10px] font-mono tracking-widest uppercase truncate text-slate-600 dark:text-slate-400">
                        <span className="text-indigo-500 dark:text-indigo-400 mr-2">[{record.mode}]</span> {record.input || 'Encrypted Media'}
                      </p>
                    </div>
                  </div>
                  <div className="text-[10px] font-black uppercase tracking-widest whitespace-nowrap pl-4 opacity-50 group-hover:opacity-100 transition-opacity text-slate-900 dark:text-white">
                    {timeAgo(record.created_at)}
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="py-12 text-center text-xs font-mono uppercase tracking-widest text-slate-500">
                No data found. Run a scan to see it here.
              </div>
            )}
          </div>
        </motion.div>

      </div>
      <div className="h-24" />

      {/* ========================================= */}
      {/* 🎛️ FIXED TIME RANGE MODAL                 */}
      {/* ========================================= */}
      <AnimatePresence>
        {showTimeMenu && (
          <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowTimeMenu(false)} />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-64 rounded-[2rem] shadow-2xl glass-card overflow-hidden flex flex-col z-10"
            >
              <div className="p-4 border-b border-black/10 dark:border-white/10 text-center text-xs font-black uppercase tracking-widest text-slate-900 dark:text-white">
                <div className="flex justify-between items-center">
                  <span className="ml-2">Select Time Range</span>
                  <button onClick={() => setShowTimeMenu(false)} className="p-1 hover:bg-black/5 dark:hover:bg-white/5 rounded-md transition-colors text-slate-500"><XMarkIcon className="w-5 h-5" /></button>
                </div>
              </div>
              <div className="p-2 space-y-1">
                {Object.entries(TIME_RANGES).map(([key, range]) => (
                  <button key={key} onClick={() => { setSelectedTimeRange(key); setShowTimeMenu(false); }}
                    className={`w-full text-center px-5 py-4 text-[11px] font-black uppercase tracking-widest transition-all rounded-xl ${selectedTimeRange === key ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-600 dark:text-slate-400 hover:bg-black/5 dark:hover:bg-white/5'}`}
                  > {range.label} </button>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </motion.div>
  );
};

export default AnalyticsSection;