import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  ShieldCheckIcon, UserGroupIcon, CpuChipIcon, BellAlertIcon,
  BookOpenIcon, TrophyIcon
} from '@heroicons/react/24/outline';
import LoadingSpinner from '../UI/LoadingSpinner';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const HomeSection = ({ user, setCurrentSection, theme }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [globalStats, setGlobalStats] = useState({ totalScans: 0, activeUsers: 1, avgSystemConfidence: 0 });
  const [briefing, setBriefing] = useState([]);

  // 🚀 REAL-TIME DATABASE FETCHING (NO HARDCODING)
  const fetchGlobalStats = async () => {
    try {
      // 1. Get Total Scans (Community + Private)
      const { count: publicCount } = await supabase.from('community_threats').select('*', { count: 'exact', head: true });
      const { count: privateCount } = await supabase.from('user_history').select('*', { count: 'exact', head: true });
      const totalScans = (publicCount || 0) + (privateCount || 0);

      // 2. Get Unique Active Users
      const { data: activeNodes } = await supabase.from('user_history').select('user_id');
      const uniqueUsers = activeNodes ? new Set(activeNodes.map(item => item.user_id)).size : 1;

      // 3. Calculate Real-Time System Confidence (Average of all scan scores)
      const { data: allScans } = await supabase.from('user_history').select('score');
      let avgScore = 0;
      if (allScans && allScans.length > 0) {
        const sum = allScans.reduce((acc, curr) => acc + (curr.score || 100), 0);
        avgScore = Math.round(sum / allScans.length);
      } else {
        avgScore = 98; // Fallback only if database is completely empty
      }

      setGlobalStats({
        totalScans,
        activeUsers: uniqueUsers || 1,
        avgSystemConfidence: avgScore
      });
    } catch (err) {
      console.error(err);
    }
  };

  const fetchUserData = async () => {
    const currentUserId = user?.id || user?.uid;
    
    // If not logged in, show default action items
    if (!currentUserId) {
       setBriefing([
          { id: 1, type: 'education', title: 'Security Education', description: 'Learn how to identify deepfakes and scams.', action: 'Start Learning', icon: BookOpenIcon, actionHandler: () => setCurrentSection('education') }
       ]);
       return;
    }

    try {
      const { data: userRecords } = await supabase.from('user_history').select('*').eq('user_id', currentUserId);
      const totalAnalyses = userRecords ? userRecords.length : 0;

      const insights = [];
      if (totalAnalyses > 0) {
        insights.push({
          id: 1, type: 'achievement', title: 'Your Activity', description: `You have completed ${totalAnalyses} security scans.`, action: 'View History', icon: TrophyIcon, actionHandler: () => setCurrentSection('analytics')
        });
      }
      insights.push({ id: 2, type: 'education', title: 'Security Education', description: 'Learn how to identify deepfakes and scams.', action: 'Start Learning', icon: BookOpenIcon, actionHandler: () => setCurrentSection('education') });
      
      setBriefing(insights);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const init = async () => {
        setIsLoading(true);
        await fetchGlobalStats();
        await fetchUserData();
        setIsLoading(false);
    };
    init();

    // Listen for real-time global feed updates
    const communityChannel = supabase.channel('public_threats')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'community_threats' }, fetchGlobalStats).subscribe();

    // Listen for personal scan updates
    const historyChannel = supabase.channel('private_ledger')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'user_history' }, () => {
          fetchGlobalStats();
          fetchUserData();
      }).subscribe();

    return () => {
        communityChannel.unsubscribe();
        historyChannel.unsubscribe();
    };
  }, [user]);

  if (isLoading) return <div className="h-96 flex items-center justify-center"><LoadingSpinner size="lg" text="Loading..." /></div>;

  return (
    <div className="space-y-12 max-w-6xl mx-auto py-8">
      
      {/* 🚀 1. HERO BANNER: CLARTHA STYLE */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        /* To change color of this Hero, edit `.glass-card` in index.css */
        className="relative overflow-hidden glass-card rounded-[2.5rem] p-10 md:p-16 text-center border-t border-l border-white/20 shadow-2xl flex flex-col items-center justify-center"
      >
        <div className="relative z-10 w-full max-w-4xl mx-auto flex flex-col items-center">
          
          {/* Logo Animation (No internal grids anymore!) */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1, y: [0, -5, 0] }}
            transition={{ scale: { type: "spring", stiffness: 260, damping: 20 }, y: { duration: 4, repeat: Infinity, ease: "easeInOut" } }}
            className="w-16 h-16 md:w-20 md:h-20 mb-8 drop-shadow-2xl"
          >
            <img src="/logo.png" alt="Xist AI" className="w-full h-full object-contain" />
          </motion.div>
          
          {/* User Greeting */}
          <p className="text-sm md:text-base font-bold uppercase tracking-[0.2em] opacity-60 mb-4">
             {user ? `Welcome back, ${user.displayName?.split(' ')[0] || 'User'}` : 'System Initialized'}
          </p>

          {/* 🚀 THE HIGH-CONTRAST CLARTHA HIGHLIGHT HEADER */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold mb-6 leading-tight tracking-tight text-slate-900 dark:text-white">
            Your Network Doesn't Need More Tools. <br/>
            <span className="text-brand-highlight">It Needs Intelligence.</span>
          </h1>
          
          <p className="text-lg md:text-xl opacity-70 font-medium max-w-2xl mx-auto mb-12 leading-relaxed">
            Forensic Intelligence & Digital Sovereignty. Built to protect users and businesses from advanced digital threats.
          </p>

          {/* REAL-TIME STATS HUD */}
          <div className="flex flex-wrap items-center justify-center gap-4 md:gap-8">
            <div className="flex items-center px-4 py-2 rounded-full bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 backdrop-blur-sm">
              <div className="w-2 h-2 bg-indigo-500 rounded-full mr-3 animate-pulse shadow-[0_0_8px_rgba(99,102,241,0.8)]"></div>
              <ShieldCheckIcon className="w-4 h-4 mr-2 opacity-70" />
              <span className="text-sm font-bold">{globalStats.totalScans.toLocaleString()} Total Scans</span>
            </div>
            
            <div className="flex items-center px-4 py-2 rounded-full bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 backdrop-blur-sm">
              <div className="w-2 h-2 bg-purple-500 rounded-full mr-3 animate-pulse shadow-[0_0_8px_rgba(168,85,247,0.8)]"></div>
              <UserGroupIcon className="w-4 h-4 mr-2 opacity-70" />
              <span className="text-sm font-bold">{globalStats.activeUsers} Active Nodes</span>
            </div>

            <div className="flex items-center px-4 py-2 rounded-full bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 backdrop-blur-sm">
              <div className="w-2 h-2 bg-cyan-500 rounded-full mr-3 animate-pulse shadow-[0_0_8px_rgba(6,182,212,0.8)]"></div>
              <CpuChipIcon className="w-4 h-4 mr-2 opacity-70" />
              <span className="text-sm font-bold">{globalStats.avgSystemConfidence}% Avg Confidence</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* 🚀 2. BRIEFING SECTION (Workspace Cards) */}
      <div className="space-y-6">
         <h2 className="text-sm font-bold uppercase tracking-[0.2em] opacity-60 ml-2">
           Action Items
         </h2>
         <div className="grid md:grid-cols-2 gap-6">
           {briefing.map((insight, idx) => (
              <motion.div 
                 key={insight.id}
                 initial={{ opacity: 0, y: 20 }}
                 animate={{ opacity: 1, y: 0 }}
                 transition={{ delay: 0.2 + (idx * 0.1) }}
                 /* To change color of these Cards, edit `.glass-card` in index.css */
                 className="glass-card rounded-[2rem] p-8 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl cursor-pointer group"
                 onClick={insight.actionHandler}
              >
                 <div className="flex gap-6 items-start">
                    <div className="p-4 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 group-hover:scale-110 transition-transform duration-300">
                       <insight.icon className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
                    </div>
                    <div className="flex-1">
                       <h4 className="text-xl font-bold mb-2 text-slate-900 dark:text-white">{insight.title}</h4>
                       <p className="text-sm opacity-70 mb-5 leading-relaxed">{insight.description}</p>
                       <div className="inline-flex items-center text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400 group-hover:text-indigo-800 dark:group-hover:text-indigo-300 transition-colors">
                         {insight.action} <span className="ml-2 transition-transform group-hover:translate-x-2">→</span>
                       </div>
                    </div>
                 </div>
              </motion.div>
           ))}
         </div>
      </div>

    </div>
  );
};

export default HomeSection;