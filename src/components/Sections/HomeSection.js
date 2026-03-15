import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  ShieldCheckIcon, UserGroupIcon, CpuChipIcon, BellAlertIcon,
  BookOpenIcon, TrophyIcon
} from '@heroicons/react/24/outline';
import Card from '../UI/Card';
import LoadingSpinner from '../UI/LoadingSpinner';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const HomeSection = ({ user, setCurrentSection, theme }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [globalStats, setGlobalStats] = useState({ totalScans: 0, activeUsers: 1, accuracyRate: 94 });
  const [briefing, setBriefing] = useState([]);

  const fetchGlobalStats = async () => {
    try {
      const { count: publicCount } = await supabase.from('community_threats').select('*', { count: 'exact', head: true });
      const { count: privateCount } = await supabase.from('user_history').select('*', { count: 'exact', head: true });
      const totalScans = (publicCount || 0) + (privateCount || 0);

      const { data: activeNodes } = await supabase.from('user_history').select('user_id');
      const uniqueUsers = activeNodes ? new Set(activeNodes.map(item => item.user_id)).size : 1;

      setGlobalStats({
        totalScans,
        activeUsers: uniqueUsers || 1,
        accuracyRate: 94
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

    // Listen for global feed updates
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

  if (isLoading) return <div className="h-96 flex items-center justify-center"><LoadingSpinner size="lg" text="Loading Dashboard..." /></div>;

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      
      {/* HERO BANNER - Preserved Animations, Simplified Text */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white text-center p-8 md:p-12 rounded-2xl border border-white/5 shadow-2xl"
      >
        {/* Corner Accents */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 border-indigo-400/50 rounded-tl-lg animate-pulse"></div>
          <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-indigo-400/50 rounded-tr-lg animate-pulse"></div>
          <div className="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 border-indigo-400/50 rounded-bl-lg animate-pulse"></div>
          <div className="absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2 border-indigo-400/50 rounded-br-lg animate-pulse"></div>
        </div>

        {/* Ambient Glows */}
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
            {/* Grid Background behind logo */}
            <motion.div 
              className="absolute inset-0 opacity-20 pointer-events-none rounded-2xl" 
              animate={{ backgroundPosition: ["0px 0px", "20px 20px"], opacity: [0.15, 0.25, 0.15] }}
              transition={{ backgroundPosition: { duration: 8, repeat: Infinity, ease: "linear" }, opacity: { duration: 4, repeat: Infinity, ease: "easeInOut" } }}
              style={{ backgroundImage: 'linear-gradient(#4f46e5 1px, transparent 1px), linear-gradient(90deg, #4f46e5 1px, transparent 1px)', backgroundSize: '10px 10px' }}
            />

            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1, y: [0, -5, 0] }}
              transition={{ scale: { type: "spring", stiffness: 260, damping: 20 }, y: { duration: 4, repeat: Infinity, ease: "easeInOut" } }}
              className="relative z-10 w-20 h-20 flex items-center justify-center drop-shadow-[0_0_10px_rgba(99,102,241,0.4)]"
            >
              <img
                src="/logo.png"
                alt="Xist AI"
                className="w-full h-full object-contain"
                onError={(e) => { e.target.style.display = 'none'; e.target.nextElementSibling.style.display = 'flex'; }}
              />
            </motion.div>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white via-cyan-200 to-purple-200">
            {user ? `Welcome back, ${user.displayName?.split(' ')[0] || 'User'}!` : 'Welcome to Xist AI'}
          </h1>
          
          <p className="text-xl md:text-2xl opacity-95 mb-8 font-light text-cyan-100">
            Verifying the truth in a digital world.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-gray-300">
            <span className="flex items-center">
              <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
              <ShieldCheckIcon className="w-4 h-4 mr-1" />
              {globalStats.totalScans.toLocaleString()} Total Scans
            </span>
            <span className="flex items-center">
              <div className="w-2 h-2 bg-blue-400 rounded-full mr-2 animate-pulse"></div>
              <UserGroupIcon className="w-4 h-4 mr-1" />
              {globalStats.activeUsers} Active Users
            </span>
            {globalStats.accuracyRate > 0 && (
              <span className="flex items-center">
                <div className="w-2 h-2 bg-purple-400 rounded-full mr-2 animate-pulse"></div>
                <CpuChipIcon className="w-4 h-4 mr-1" />
                {globalStats.accuracyRate}% Accuracy
              </span>
            )}
          </div>
        </div>
      </motion.div>

      {/* BRIEFING SECTION (Moved up, Quick Actions removed) */}
      <div className="space-y-4 pt-4">
         <h2 className="text-xl font-bold flex items-center gap-2 dark:text-white">
           <BellAlertIcon className="w-5 h-5 text-indigo-500" /> Action Items
         </h2>
         <div className="grid md:grid-cols-2 gap-4">
           {briefing.map((insight) => (
              <Card key={insight.id} className="p-5 bg-white dark:bg-slate-900 border-none shadow-sm hover:shadow-md transition-shadow">
                 <div className="flex gap-4">
                    <insight.icon className="w-6 h-6 text-indigo-500" />
                    <div>
                       <h4 className="font-bold dark:text-white">{insight.title}</h4>
                       <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 mb-3">{insight.description}</p>
                       <button onClick={insight.actionHandler} className="text-xs font-bold text-indigo-500 uppercase tracking-widest hover:text-indigo-600 transition-colors">
                         {insight.action} →
                       </button>
                    </div>
                 </div>
              </Card>
           ))}
         </div>
      </div>

    </div>
  );
};

export default HomeSection;