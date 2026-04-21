import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  QrCodeIcon, SunIcon, MoonIcon, UserCircleIcon, XMarkIcon, Bars3Icon, ArrowRightEndOnRectangleIcon, ClockIcon 
} from '@heroicons/react/24/outline';
import { useResponsive } from '../../hooks/useResponsive';
import { AVATAR_OPTIONS } from '../Sections/SettingsSection';

// ✅ SUPABASE CONNECTION FOR REAL-TIME SYNC
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const TacticalAvatar = ({ url, tacticalId }) => {
  if (url && url.startsWith('http')) {
    return <img src={url} alt="Profile" className="w-full h-full object-cover" />;
  }
  const tacticalOption = AVATAR_OPTIONS?.find(a => a.id === tacticalId);
  if (tacticalOption) {
    const Icon = tacticalOption.icon;
    return <Icon className="w-5 h-5 text-indigo-500 dark:text-indigo-400" />;
  }
  return <UserCircleIcon className="w-5 h-5 text-indigo-500 dark:text-indigo-400" />;
};

const TopNavigation = ({ user, identity, theme, setTheme, currentSection, setCurrentSection, setMobileMenuOpen, login }) => {
  const { screenSize } = useResponsive();
  const [showQRPopup, setShowQRPopup] = useState(false);
  const [liveScans, setLiveScans] = useState(0);
  
  // React State for Dropdown
  const [showScanDetails, setShowScanDetails] = useState(false);
  
  // STATE FOR LOCAL RESET TIME
  const [localResetTime, setLocalResetTime] = useState("12:00 AM (PT)");

  // ==========================================
  // 🌎 GLOBAL SCANS & PT RESET TIME LOGIC
  // ==========================================
  useEffect(() => {
    const calculatePTMidnights = () => {
      const now = new Date();
      const ptString = now.toLocaleString('en-US', { timeZone: 'America/Los_Angeles' });
      const localOfPt = new Date(ptString);
      const diff = now.getTime() - localOfPt.getTime();
      
      const lastMidnightLocal = new Date(localOfPt);
      lastMidnightLocal.setHours(0, 0, 0, 0);
      const lastMidnightPT = new Date(lastMidnightLocal.getTime() + diff);
      
      const nextMidnightLocal = new Date(localOfPt);
      nextMidnightLocal.setHours(24, 0, 0, 0);
      const nextMidnightPT = new Date(nextMidnightLocal.getTime() + diff);

      return { lastMidnightPT, nextMidnightPT };
    };

    const { lastMidnightPT, nextMidnightPT } = calculatePTMidnights();

    try {
      const timeString = nextMidnightPT.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      setLocalResetTime(`${timeString} Local Time`);
    } catch (error) {
      setLocalResetTime("12:00 AM (PT)");
    }

    const fetchGlobalScans = async () => {
      const { count, error } = await supabase
        .from('user_history')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', lastMidnightPT.toISOString()); 
      
      if (!error) setLiveScans(count || 0);
    };

    fetchGlobalScans();

    const uniqueChannelName = `global_scans_${Math.random().toString(36).substring(2, 10)}`;
    const channel = supabase
      .channel(uniqueChannelName)
      .on('postgres_changes', 
          { event: 'INSERT', schema: 'public', table: 'user_history' }, 
          () => fetchGlobalScans()
      ).subscribe();

    return () => supabase.removeChannel(channel);
  }, []); 

  const navigationItems = [
    { id: 'home', label: 'Home' },
    { id: 'verify', label: 'Verify' },
    { id: 'education', label: 'Education' },
    { id: 'community', label: 'Community' },
    { id: 'analytics', label: 'Analytics' },
    { id: 'protection', label: 'Helpline 24/7' }
  ];

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('xist-theme', newTheme);
    
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
      document.body.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('dark');
    }
  };

  const scansRemaining = Math.max(0, 20 - liveScans);

  const handleProfileClick = () => {
    window.location.hash = 'edit-profile';
    setCurrentSection('settings');
  };

  return (
    <>
      {showQRPopup && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[100] flex items-center justify-center p-4" onClick={() => setShowQRPopup(false)}>
          <div className="glass-card p-8 rounded-[2.5rem] max-w-sm w-full shadow-2xl relative border border-black/10 dark:border-white/10" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-widest">Share Xist AI</h3>
              <button onClick={() => setShowQRPopup(false)} className="p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-full transition-colors">
                <XMarkIcon className="w-5 h-5 text-slate-500" />
              </button>
            </div>
            <div className="text-center">
              <div className="bg-white p-4 rounded-[2rem] mx-auto mb-6 w-48 h-48 flex items-center justify-center shadow-inner">
                <img src="/qrcode2.png" alt="QR Code" className="w-full h-full rounded-xl object-contain" onError={(e) => { e.target.style.display = 'none'; }} />
              </div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">Scan to access the platform</p>
            </div>
          </div>
        </div>
      )}

      {/* 🚀 PREMIUM GLASS NAV BAR */}
      <nav className="sticky top-0 z-50 bg-slate-50/80 dark:bg-[#080c1a]/80 backdrop-blur-2xl border-b border-black/5 dark:border-white/5 transition-colors duration-500 overflow-visible">
        <div className="max-w-[90rem] mx-auto px-4 overflow-visible">
          
          <div className="relative flex items-center justify-between h-16 overflow-visible">
            
            {/* LEFT: Brand & Mobile Menu Toggle */}
            <div className="flex items-center gap-3 shrink-0">
               <button 
                 onClick={(e) => { e.stopPropagation(); setMobileMenuOpen(true); }} 
                 className="lg:hidden p-2 text-slate-600 dark:text-slate-300 hover:bg-black/5 dark:hover:bg-white/5 rounded-full transition-colors"
               >
                 <Bars3Icon className="w-6 h-6" />
               </button>

               <div className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity duration-300 ml-1" onClick={() => setCurrentSection('home')}>
                  <img src="/logo.png" alt="Logo" className="w-7 h-7 sm:w-8 sm:h-8 object-contain" />
                  <h1 className="hidden min-[360px]:block text-sm sm:text-lg font-black text-slate-900 dark:text-white tracking-widest uppercase">Xist AI</h1>
               </div>
            </div>

            {/* CENTER: DESKTOP ONLY NAVIGATION LINKS */}
            <div className="hidden lg:flex absolute left-1/2 -translate-x-1/2 items-center gap-2 xl:gap-6 justify-center shrink-0 h-full">
              {navigationItems.map((item) => {
                const isActive = currentSection === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setCurrentSection(item.id)}
                    className={`relative px-3 py-2 h-full flex items-center text-[10px] xl:text-[11px] uppercase tracking-widest transition-all duration-300 font-black ${
                      isActive 
                        ? 'text-indigo-600 dark:text-indigo-400' 
                        : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    {item.label}
                    
                    {/* Glowing Animated Underline for the Active Tab */}
                    {isActive && (
                      <motion.div
                        layoutId="active-nav-indicator"
                        className="absolute bottom-0 left-0 right-0 h-[3px] bg-indigo-500 rounded-t-full shadow-[0_-2px_10px_rgba(99,102,241,0.5)]"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                      />
                    )}
                  </button>
                );
              })}
            </div>

            {/* RIGHT: Action Hub */}
            <div className="flex items-center gap-1 sm:gap-2 shrink-0 overflow-visible">
              
              {/* SCANS BUTTON */}
              {user && (
                <div 
                  className={`relative flex items-center justify-center h-9 px-4 rounded-full cursor-pointer transition-all duration-300 mr-2 ${showScanDetails ? 'bg-indigo-50 dark:bg-indigo-500/10' : 'hover:bg-black/5 dark:hover:bg-white/5'}`}
                  onMouseEnter={() => setShowScanDetails(true)}
                  onMouseLeave={() => setShowScanDetails(false)}
                  onClick={() => setShowScanDetails(!showScanDetails)}
                >
                  <span className={`text-[10px] font-black uppercase tracking-widest transition-colors ${showScanDetails ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-600 dark:text-slate-300'}`}>
                    Scans
                  </span>
                </div>
              )}

              {/* QR and Theme Buttons */}
              <button onClick={() => setShowQRPopup(true)} className="p-2 rounded-full text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5 transition-all hidden sm:block">
                <QrCodeIcon className="w-5 h-5" />
              </button>
              
              <button onClick={toggleTheme} className="p-2 rounded-full text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5 transition-all">
                {theme === 'dark' ? <SunIcon className="w-5 h-5" /> : <MoonIcon className="w-5 h-5" />}
              </button>

              {/* PROFILE PICTURE (WHEN LOGGED IN) */}
              {user && (
                <div className="flex items-center pl-2 ml-1 border-l border-black/10 dark:border-white/10">
                  <button 
                    onClick={handleProfileClick} 
                    className="w-8 h-8 sm:w-9 sm:h-9 rounded-full border-2 border-indigo-500/30 flex items-center justify-center overflow-hidden hover:border-indigo-500 hover:scale-105 transition-all bg-slate-100 dark:bg-slate-800 shrink-0"
                  >
                    <TacticalAvatar url={user?.photoURL} tacticalId={identity?.avatar} />
                  </button>
                </div>
              )}

             {/* SIGN IN BUTTON (WHEN LOGGED OUT) */}
              {!user && (
                <div className="flex items-center pl-2 ml-1 border-l border-black/10 dark:border-white/10">
                  <button 
                    onClick={login} 
                    className="flex items-center gap-2 px-5 py-2 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white transition-all duration-300 hover:scale-105 active:scale-95 group shadow-lg shadow-indigo-500/20"
                  >
                    <span className="text-[10px] font-black uppercase tracking-widest">
                      Sign In
                    </span>
                    <ArrowRightEndOnRectangleIcon className="w-4 h-4 text-indigo-200 group-hover:text-white transition-colors" />
                  </button>
                </div>
              )}

            </div>
          </div>
        </div>
      </nav>

      {/* 🚀 MODERN GLASS-CARD SCAN DROPDOWN */}
      <AnimatePresence>
        {showScanDetails && user && (
          <motion.div 
            initial={{ opacity: 0, y: 12, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            onMouseEnter={() => setShowScanDetails(true)} 
            onMouseLeave={() => setShowScanDetails(false)}
            className="fixed top-[70px] right-4 sm:right-8 lg:right-[12%] p-1.5 rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.15)] z-[999999] overflow-hidden glass-card border border-black/5 dark:border-white/10"
          >
            <div className="px-6 py-5 min-w-[260px] bg-slate-100/50 dark:bg-slate-900/50 rounded-[1.5rem]">
              <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-500">
                  Global API Limit
                </span>
                <div className={`px-2.5 py-1 rounded-md text-[9px] font-black tracking-widest uppercase border ${
                  scansRemaining <= 5 
                    ? 'bg-rose-500/10 border-rose-500/20 text-rose-500 dark:text-rose-400' 
                    : 'bg-indigo-500/10 border-indigo-500/20 text-indigo-600 dark:text-indigo-400'
                }`}>
                  {scansRemaining} Global Left
                </div>
              </div>

              <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-800/50 rounded-full mb-5 overflow-hidden border border-black/5 dark:border-white/5">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${(scansRemaining / 20) * 100}%` }}
                  className={`h-full rounded-full shadow-[0_0_10px_currentColor] ${scansRemaining <= 5 ? 'bg-rose-500' : 'bg-indigo-500'}`}
                />
              </div>

              <div className="flex items-center justify-between gap-6">
                <div className="flex flex-col">
                  <span className="text-2xl font-black text-slate-900 dark:text-white">
                    {scansRemaining}<span className="text-sm font-bold opacity-30 ml-1">/ 20</span>
                  </span>
                  <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest mt-1">Total Scans</span>
                </div>
                
                <div className="text-right flex flex-col items-end">
                   <div className="flex items-center gap-1.5 text-indigo-500 dark:text-indigo-400">
                      <ClockIcon className="w-4 h-4" />
                      <span className="text-[10px] font-black uppercase tracking-widest">Reset</span>
                   </div>
                   <span className="text-[10px] font-bold text-slate-500 mt-1">{localResetTime}</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default TopNavigation;