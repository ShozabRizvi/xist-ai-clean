import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  QrCodeIcon, SunIcon, MoonIcon, UserCircleIcon, XMarkIcon, Bars3Icon, ArrowRightEndOnRectangleIcon, ClockIcon, UserGroupIcon
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
    return <Icon className="w-5 h-5 text-indigo-400" />;
  }
  return <UserCircleIcon className="w-5 h-5 text-indigo-400" />;
};

// ✅ ADDED "login" PROP BACK
const TopNavigation = ({ user, identity, theme, setTheme, currentSection, setCurrentSection, setMobileMenuOpen, login }) => {
  const { screenSize } = useResponsive();
  const [showQRPopup, setShowQRPopup] = useState(false);
  const [liveScans, setLiveScans] = useState(0);
  
  // React State for Dropdown
  const [showScanDetails, setShowScanDetails] = useState(false);
  
  // STATE FOR LOCAL RESET TIME
  const [localResetTime, setLocalResetTime] = useState("12:00 AM (PT)");

  // CALCULATE LOCAL TIME EQUIVALENT OF MIDNIGHT PT
  useEffect(() => {
    try {
      const now = new Date();
      const ptString = now.toLocaleString('en-US', { timeZone: 'America/Los_Angeles' });
      const ptDate = new Date(ptString);
      const diff = now.getTime() - ptDate.getTime();
      ptDate.setHours(0, 0, 0, 0);
      const absoluteMidnight = new Date(ptDate.getTime() + diff);
      const timeString = absoluteMidnight.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      setLocalResetTime(`${timeString} Local Time`);
    } catch (error) {
      setLocalResetTime("12:00 AM (PT)");
    }
  }, []);

  useEffect(() => {
    const fetchScans = async () => {
      const currentUserId = user?.id || user?.uid;
      if (!currentUserId) return;

      const startOfDay = new Date();
      startOfDay.setHours(0, 0, 0, 0);

      const { count, error } = await supabase
        .from('user_history')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', currentUserId)
        .gte('created_at', startOfDay.toISOString());
      
      if (!error) setLiveScans(count || 0);
    };

    fetchScans();

    const currentUserId = user?.id || user?.uid;
    if (currentUserId) {
      const uniqueChannelName = `topnav_scans_${Math.random().toString(36).substring(2, 10)}`;
      const channel = supabase
        .channel(uniqueChannelName)
        .on('postgres_changes', 
            { event: 'INSERT', schema: 'public', table: 'user_history', filter: `user_id=eq.${currentUserId}` }, 
            () => fetchScans()
        ).subscribe();

      return () => supabase.removeChannel(channel);
    }
  }, [user?.id, user?.uid]);

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
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 max-w-sm w-full shadow-2xl border dark:border-slate-800">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Share Xist AI</h3>
              <button onClick={() => setShowQRPopup(false)} className="p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-full transition-colors">
                <XMarkIcon className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <div className="text-center">
              <div className="bg-white p-4 rounded-xl mx-auto mb-4 w-48 h-48 flex items-center justify-center border">
                <img src="/qrcode2.png" alt="QR Code" className="w-full h-full rounded-lg" onError={(e) => { e.target.style.display = 'none'; }} />
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">Scan to access Xist AI</p>
            </div>
          </div>
        </div>
      )}

      {/* NAV BAR */}
      <nav className="bg-gradient-to-r from-indigo-900 to-purple-900 border-b border-indigo-800 sticky top-0 z-50 backdrop-blur-md overflow-visible">
        <div className="max-w-7xl mx-auto px-4 overflow-visible">
          
          <div className="relative flex items-center justify-between h-16 overflow-visible">
            
            {/* LEFT: Brand & Menu */}
            <div className="flex items-center gap-3 shrink-0">
               <button 
                 onClick={(e) => { e.stopPropagation(); setMobileMenuOpen(true); }} 
                 className="lg:hidden p-1.5 text-gray-300 hover:bg-indigo-800 rounded-md transition-colors"
               >
                 <Bars3Icon className="w-6 h-6" />
               </button>

               <div className="flex items-center gap-2 cursor-pointer hover:scale-105 transition-transform duration-300" onClick={() => setCurrentSection('home')}>
                  <img src="/logo.png" alt="Logo" className="w-7 h-7 sm:w-8 sm:h-8 object-contain" />
                  <h1 className="hidden min-[360px]:block text-sm sm:text-lg font-black text-white tracking-tight">Xist AI</h1>
               </div>
            </div>

            {/* CENTER: DESKTOP ONLY NAVIGATION LINKS */}
            <div className="hidden lg:flex absolute left-1/2 -translate-x-1/2 items-center gap-8 justify-center shrink-0">
              {navigationItems.map((item) => {
                const isActive = currentSection === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setCurrentSection(item.id)}
                    className={`relative py-2 text-xs uppercase tracking-widest transition-all duration-300 hover:scale-105 ${
                      isActive 
                        ? 'text-white font-black drop-shadow-[0_0_8px_rgba(255,255,255,0.3)] scale-105' 
                        : 'text-indigo-200/60 font-bold hover:text-indigo-100'
                    }`}
                  >
                    {item.label}
                    
                    {/* Glowing Animated Underline for the Active Tab */}
                    {isActive && (
                      <motion.div
                        layoutId="active-nav-indicator"
                        className="absolute -bottom-1.5 left-0 right-0 h-[3px] bg-indigo-300 rounded-full shadow-[0_0_10px_rgba(165,180,252,0.8)]"
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
            <div className="flex items-center gap-2 sm:gap-4 shrink-0 overflow-visible">
              
              {/* SCANS BUTTON */}
              {user && (
                <div 
                  className="relative flex items-center justify-center h-16 cursor-pointer px-2 hover:scale-105 transition-transform duration-300"
                  onMouseEnter={() => setShowScanDetails(true)}
                  onMouseLeave={() => setShowScanDetails(false)}
                  onClick={() => setShowScanDetails(!showScanDetails)}
                >
                  <span className={`text-[10px] sm:text-xs font-black uppercase tracking-widest transition-colors ${showScanDetails ? 'text-indigo-300' : 'text-white'}`}>
                    SCANS
                  </span>
                </div>
              )}

              {/* QR and Theme Buttons */}
              <button onClick={() => setShowQRPopup(true)} className="p-1.5 rounded-full hover:bg-white/10 hover:scale-105 transition-all">
                <QrCodeIcon className="w-5 h-5 text-indigo-100" />
              </button>
              
              <button onClick={toggleTheme} className="p-1.5 rounded-full hover:bg-white/10 hover:scale-105 transition-all">
                {theme === 'dark' ? <SunIcon className="w-5 h-5 text-indigo-100" /> : <MoonIcon className="w-5 h-5 text-indigo-100" />}
              </button>

              {/* PERFECT CIRCULAR PROFILE PICTURE (WHEN LOGGED IN) */}
              {user && (
                <div className="flex items-center pl-1 sm:pl-2 ml-1 border-l border-indigo-500/30">
                  <button 
                    onClick={handleProfileClick} 
                    className="w-8 h-8 sm:w-9 sm:h-9 rounded-full border-2 border-indigo-400/50 flex items-center justify-center overflow-hidden hover:border-indigo-300 hover:scale-105 transition-all bg-slate-900 shrink-0"
                  >
                    <TacticalAvatar url={user?.photoURL} tacticalId={identity?.avatar} />
                  </button>
                </div>
              )}

             {/* SIGN IN BUTTON (PREMIUM GLASS STYLE) */}
              {!user && (
                <div className="flex items-center pl-1 sm:pl-2 ml-1 border-l border-indigo-500/30">
                  <button 
                    onClick={login} 
                    className="flex items-center gap-2 px-5 py-2 rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/30 backdrop-blur-md transition-all duration-300 hover:scale-105 active:scale-95 group shadow-lg"
                  >
                    <span className="text-[10px] sm:text-xs font-black uppercase tracking-[0.15em]">
                      Sign In
                    </span>
                    <ArrowRightEndOnRectangleIcon className="w-4 h-4 text-indigo-300 group-hover:text-white transition-colors stroke-2" />
                  </button>
                </div>
              )}

            </div>
          </div>
        </div>
      </nav>

      {/* MODERN GLASS-CARD SCAN DROPDOWN */}
      <AnimatePresence>
        {showScanDetails && user && (
          <motion.div 
            initial={{ opacity: 0, y: 12, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            onMouseEnter={() => setShowScanDetails(true)} 
            onMouseLeave={() => setShowScanDetails(false)}
            // 'fixed' positioning ensures it floats above the nav strip without cutting off
            className={`fixed top-[70px] right-4 sm:right-8 lg:right-[12%] p-1 rounded-[1.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.3)] z-[999999] overflow-hidden backdrop-blur-xl border ${
              theme === 'dark' 
                ? 'bg-slate-900/80 border-white/10' 
                : 'bg-white/80 border-slate-200'
            }`}
          >
            {/* Interior Content Container */}
            <div className="px-5 py-4 min-w-[240px]">
              <div className="flex items-center justify-between mb-3">
                <span className={`text-[10px] font-black uppercase tracking-[0.15em] ${theme === 'dark' ? 'text-slate-500' : 'text-slate-400'}`}>
                  Usage Balance
                </span>
                <div className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                  scansRemaining <= 5 
                    ? 'bg-rose-500/10 border-rose-500/20 text-rose-400' 
                    : 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400'
                }`}>
                  {scansRemaining} Available
                </div>
              </div>

              {/* Progress Bar (Visual indicator of scans used) */}
              <div className="w-full h-1.5 bg-slate-800/50 rounded-full mb-4 overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${(scansRemaining / 20) * 100}%` }}
                  className={`h-full rounded-full ${scansRemaining <= 5 ? 'bg-rose-500' : 'bg-indigo-500'}`}
                />
              </div>

              <div className="flex items-center justify-between gap-6">
                <div className="flex flex-col">
                  <span className={`text-xl font-black ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                    {scansRemaining}<span className="text-sm font-medium opacity-40 ml-1">/ 20</span>
                  </span>
                  <span className="text-[9px] font-bold text-slate-500 uppercase tracking-tight">Total Scans</span>
                </div>
                
                <div className="text-right flex flex-col items-end">
                   <div className="flex items-center gap-1 text-indigo-400">
                      <ClockIcon className="w-3 h-3" />
                      <span className="text-[10px] font-black uppercase tracking-wider">Reset</span>
                   </div>
                   <span className="text-[10px] font-bold text-slate-500 mt-0.5">{localResetTime}</span>
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