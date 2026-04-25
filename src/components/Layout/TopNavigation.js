import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BellIcon, SunIcon, MoonIcon, UserCircleIcon, XMarkIcon, Bars3Icon, ArrowRightEndOnRectangleIcon, ClockIcon, TrashIcon 
} from '@heroicons/react/24/outline';
import { BellAlertIcon } from '@heroicons/react/24/solid';
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
  
  // 🚀 NOTIFICATION SYSTEM STATES
  const [showNotifications, setShowNotifications] = useState(false);
  const [hasNewAlert, setHasNewAlert] = useState(false);
  const [notifications, setNotifications] = useState([]);

  const [liveScans, setLiveScans] = useState(0);
  const [showScanDetails, setShowScanDetails] = useState(false);
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
      const { count, error } = await supabase.from('user_history').select('*', { count: 'exact', head: true }).gte('created_at', lastMidnightPT.toISOString()); 
      if (!error) setLiveScans(count || 0);
    };

    fetchGlobalScans();
    const channel = supabase.channel('global_scans').on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'user_history' }, () => fetchGlobalScans()).subscribe();
    return () => supabase.removeChannel(channel);
  }, []); 

  // ==========================================
  // 🚀 REAL-TIME NOTIFICATIONS DB SYNC
  // ==========================================
  useEffect(() => {
    const fetchAlerts = async () => {
      // Pull only Official Directives for the Notification Bell
      const { data } = await supabase
        .from('community_threats')
        .select('*')
        .ilike('location', 'Official%')
        .order('created_at', { ascending: false })
        .limit(5);

      if (data && data.length > 0) {
        const formattedAlerts = data.map(d => ({
          id: d.id,
          title: d.title,
          message: d.description.length > 60 ? d.description.substring(0, 60) + '...' : d.description,
          time: new Date(d.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
        }));
        
        setNotifications(formattedAlerts);
        
        // Trigger animation if the latest alert is newer than the last cleared timestamp
        const lastCleared = localStorage.getItem('xist_last_cleared_alerts');
        if (!lastCleared || new Date(data[0].created_at) > new Date(lastCleared)) {
          setHasNewAlert(true);
        }
      }
    };

    fetchAlerts();

    const notifChannel = supabase.channel('top_nav_alerts')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'community_threats' }, (payload) => {
        if (payload.new.location && payload.new.location.includes('Official')) {
           fetchAlerts();
        }
      }).subscribe();

    return () => supabase.removeChannel(notifChannel);
  }, []);

  const handleClearNotifications = () => {
    setNotifications([]);
    setHasNewAlert(false);
    setShowNotifications(false);
    localStorage.setItem('xist_last_cleared_alerts', new Date().toISOString());
  };

  const handleBellClick = () => {
    setShowNotifications(!showNotifications);
    setHasNewAlert(false);
    if (notifications.length > 0) {
      localStorage.setItem('xist_last_cleared_alerts', new Date().toISOString());
    }
  };

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
    if (newTheme === 'dark') { document.documentElement.classList.add('dark'); document.body.classList.add('dark'); }
    else { document.documentElement.classList.remove('dark'); document.body.classList.remove('dark'); }
  };

  const scansRemaining = Math.max(0, 20 - liveScans);
  const handleProfileClick = () => { window.location.hash = 'edit-profile'; setCurrentSection('settings'); };

  return (
    <>
      {/* 🚀 FIX: Removed 'overflow-hidden' so the dropdown isn't cut off on mobile */}
      <nav className="relative z-50 bg-transparent transition-colors duration-500 pt-2 md:pt-4 w-full max-w-full overflow-visible">
        <div className="max-w-[90rem] mx-auto px-2 sm:px-4 w-full">
          <div className="relative flex items-center justify-between h-14 sm:h-16 w-full">
            
            {/* LEFT: Logo and Menu */}
            <div className="flex items-center gap-1 sm:gap-3 shrink-0 lg:invisible">
               {/* 🚀 HAMBURGER ICON COLOR FIXED: Now properly adapts to light/dark mode */}
               <button 
                 onClick={(e) => { e.stopPropagation(); setMobileMenuOpen(true); }} 
                 className="p-1.5 sm:p-2 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5 rounded-full transition-colors"
               >
                 <Bars3Icon className="w-5 h-5 sm:w-6 sm:h-6" />
               </button>
               <div className="flex items-center gap-2 sm:gap-3 cursor-pointer hover:opacity-80 transition-opacity duration-300 ml-1" onClick={() => setCurrentSection('home')}>
                 <img src="/logo.png" alt="Logo" className="w-6 h-6 sm:w-8 sm:h-8 object-contain shrink-0" />
               </div>
            </div>

            {/* CENTER: DESKTOP ONLY NAVIGATION */}
            <div className="hidden lg:flex absolute left-1/2 -translate-x-1/2 items-center gap-2 xl:gap-6 justify-center shrink-0 h-full">
              {navigationItems.map((item) => (
                <button key={item.id} onClick={() => setCurrentSection(item.id)} className={`relative px-3 py-2 h-full flex items-center text-[10px] xl:text-[11px] uppercase tracking-widest transition-all duration-300 font-black ${currentSection === item.id ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'}`}>
                  {item.label}
                  {currentSection === item.id && (<motion.div layoutId="active-nav-indicator" className="absolute bottom-0 left-0 right-0 h-[3px] bg-indigo-500 rounded-t-full shadow-[0_-2px_10px_rgba(99,102,241,0.5)]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }} />)}
                </button>
              ))}
            </div>

            {/* RIGHT: Action Hub */}
            <div className="flex items-center gap-0.5 sm:gap-2 shrink-0">
              {user && (
                <div className={`relative flex items-center justify-center h-8 sm:h-9 px-2 sm:px-4 rounded-full cursor-pointer transition-all duration-300 ${showScanDetails ? 'bg-indigo-50 dark:bg-indigo-500/10' : 'hover:bg-black/5 dark:hover:bg-white/5'}`} onMouseEnter={() => setShowScanDetails(true)} onMouseLeave={() => setShowScanDetails(false)} onClick={() => setShowScanDetails(!showScanDetails)}>
                  <span className={`text-[9px] sm:text-[10px] font-black uppercase tracking-widest ${showScanDetails ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-600 dark:text-slate-300'}`}>Scans</span>
                </div>
              )}

              {/* 🚀 NOTIFICATION BELL (Replaces QR Code) */}
              <div className="relative flex items-center justify-center">
                <button 
                  onClick={handleBellClick} 
                  className={`p-1.5 sm:p-2 rounded-full transition-all shrink-0 ${hasNewAlert ? 'text-red-500 hover:bg-red-500/10' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5'}`}
                >
                  {hasNewAlert ? (
                    <motion.div animate={{ rotate: [0, -15, 15, -15, 15, 0] }} transition={{ repeat: Infinity, duration: 1.5, repeatDelay: 2 }}>
                      <BellAlertIcon className="w-4 h-4 sm:w-5 sm:h-5 text-red-500 drop-shadow-[0_0_8px_rgba(220,38,38,0.6)]" />
                    </motion.div>
                  ) : (
                    <BellIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                  )}
                  {hasNewAlert && (
                    <span className="absolute top-1.5 sm:top-2 right-1.5 sm:right-2 w-2 h-2 bg-red-500 border-2 border-white dark:border-[#0f172a] rounded-full"></span>
                  )}
                </button>

                {/* NOTIFICATION DROPDOWN */}
                <AnimatePresence>
                  {showNotifications && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute top-[calc(100%+10px)] right-0 w-72 sm:w-80 glass-card rounded-[1.5rem] shadow-2xl border border-black/10 dark:border-white/10 overflow-hidden z-[99999] bg-white/95 dark:bg-[#080c1a]/95 backdrop-blur-2xl"
                    >
                      <div className="p-4 border-b border-black/10 dark:border-white/10 flex justify-between items-center bg-slate-50/50 dark:bg-slate-900/50">
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-900 dark:text-white">System Alerts</span>
                        {notifications.length > 0 && (
                          <button onClick={handleClearNotifications} className="text-[9px] font-bold uppercase tracking-widest text-slate-500 hover:text-red-500 flex items-center gap-1 transition-colors">
                            <TrashIcon className="w-3 h-3" /> Clear
                          </button>
                        )}
                      </div>
                      <div className="max-h-64 overflow-y-auto custom-scrollbar">
                        {notifications.length > 0 ? notifications.map(notif => (
                          <div key={notif.id} onClick={() => { 
                              // 🚀 FIX: Save the ID before navigating so the Community page knows what to open
                              sessionStorage.setItem('xist_focus_post', notif.id);
                              setShowNotifications(false); 
                              setCurrentSection('community'); 
                            }} 
                            className="p-4 border-b border-black/5 dark:border-white/5 hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer border-l-2 border-l-red-500 bg-red-500/5"
                          >
                            <h4 className="text-[10px] font-black uppercase tracking-widest mb-1 text-red-600 dark:text-red-400">{notif.title}</h4>
                            <p className="text-xs text-slate-700 dark:text-slate-300 font-medium mb-2">{notif.message}</p>
                            <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">{notif.time}</span>
                          </div>
                        )) : (
                          <div className="p-8 text-center text-slate-500 text-[10px] font-bold uppercase tracking-widest">No active alerts</div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* THEME TOGGLE */}
              <button onClick={toggleTheme} className="p-1.5 sm:p-2 rounded-full text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5 transition-all"><SunIcon className="w-4 h-4 sm:w-5 sm:h-5 block dark:hidden" /><MoonIcon className="w-4 h-4 sm:w-5 sm:h-5 hidden dark:block" /></button>

              <div className="h-6 w-px bg-black/10 dark:bg-white/10 mx-0.5 sm:mx-1 shrink-0"></div>

              {user ? (
                <button onClick={handleProfileClick} className="w-7 h-7 sm:w-9 sm:h-9 rounded-full border-2 border-indigo-500/30 flex items-center justify-center overflow-hidden hover:border-indigo-500 transition-all bg-slate-100 dark:bg-slate-800 shrink-0"><TacticalAvatar url={user?.photoURL} tacticalId={identity?.avatar} /></button>
              ) : (
                <button onClick={login} className="flex items-center gap-1 px-2.5 sm:px-5 py-1.5 sm:py-2 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white transition-all shadow-[0_0_15px_rgba(99,102,241,0.3)] shrink-0 active:scale-95">
                  <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest whitespace-nowrap">
                    <span className="xs:hidden">Auth</span>
                    <span className="hidden xs:inline">Sign In/Up</span>
                  </span>
                  <ArrowRightEndOnRectangleIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* SCANS DROPDOWN */}
      <AnimatePresence>
        {showScanDetails && user && (
          <motion.div 
            initial={{ opacity: 0, y: 12, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            onMouseEnter={() => setShowScanDetails(true)} 
            onMouseLeave={() => setShowScanDetails(false)}
            className="fixed top-[60px] sm:top-[70px] right-2 sm:right-8 lg:right-[12%] p-1.5 rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.15)] z-[999999] overflow-hidden glass-card border border-black/5 dark:border-white/10 bg-white/95 dark:bg-[#080c1a]/95 backdrop-blur-2xl"
          >
            <div className="px-5 sm:px-6 py-4 sm:py-5 w-[calc(100vw-16px)] sm:w-auto min-w-[260px] max-w-[320px] bg-slate-100/50 dark:bg-slate-900/50 rounded-[1.5rem]">
              <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-500">Global API Limit</span>
                <div className={`px-2.5 py-1 rounded-md text-[9px] font-black tracking-widest uppercase border ${
                  scansRemaining <= 5 ? 'bg-rose-500/10 border-rose-500/20 text-rose-500 dark:text-rose-400' : 'bg-indigo-500/10 border-indigo-500/20 text-indigo-600 dark:text-indigo-400'
                }`}>
                  {scansRemaining} Global Left
                </div>
              </div>

              <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-800/50 rounded-full mb-5 overflow-hidden border border-black/5 dark:border-white/5">
                <motion.div 
                  initial={{ width: 0 }} animate={{ width: `${(scansRemaining / 20) * 100}%` }}
                  className={`h-full rounded-full shadow-[0_0_10px_currentColor] ${scansRemaining <= 5 ? 'bg-rose-500' : 'bg-indigo-500'}`}
                />
              </div>

              <div className="flex items-center justify-between gap-6">
                <div className="flex flex-col">
                  <span className="text-2xl font-black text-slate-900 dark:text-white">{scansRemaining}<span className="text-sm font-bold opacity-30 ml-1">/ 20</span></span>
                  <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest mt-1">Total Scans</span>
                </div>
                <div className="text-right flex flex-col items-end">
                   <div className="flex items-center gap-1.5 text-indigo-500 dark:text-indigo-400"><ClockIcon className="w-4 h-4" /><span className="text-[10px] font-black uppercase tracking-widest">Reset</span></div>
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