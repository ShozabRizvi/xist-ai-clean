import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { 
  HomeIcon, ShieldCheckIcon, BookOpenIcon, UsersIcon, ChartBarIcon, 
  ShieldExclamationIcon, CogIcon, QrCodeIcon, XMarkIcon, BoltIcon, 
  SunIcon, MoonIcon, UserCircleIcon, ArrowRightOnRectangleIcon, WifiIcon,
  Bars3Icon 
} from '@heroicons/react/24/outline';
import { useResponsive } from '../../hooks/useResponsive';
import { AVATAR_OPTIONS } from '../Sections/SettingsSection';

// ✅ SUPABASE CONNECTION FOR REAL-TIME SYNC
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// ==============================
// TOP NAV AVATAR RENDERER
// ==============================
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

const TopNavigation = ({ user, identity, userStats, login, logout, theme, setTheme, currentSection, setCurrentSection, mobileMenuOpen, setMobileMenuOpen }) => {
  const { screenSize } = useResponsive();
  
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showQRPopup, setShowQRPopup] = useState(false);
  
  // ✅ GLOBAL REAL-TIME TRACKING & TIMEZONE STATE
  const [liveGlobalScans, setLiveGlobalScans] = useState(0);
  const [localResetTime, setLocalResetTime] = useState("");
  const [lastMidnightUTC, setLastMidnightUTC] = useState("");

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // ✅ CALCULATE PACIFIC TIME (PT) MIDNIGHT & LOCAL RESET TIME
  useEffect(() => {
    const calculateTimes = () => {
      const now = new Date();
      // Convert current time to Los Angeles (PT) time
      const ptString = now.toLocaleString("en-US", { timeZone: "America/Los_Angeles" });
      const ptTime = new Date(ptString);
      
      // Find what midnight looked like this morning in PT
      const lastMidnightPT = new Date(ptTime);
      lastMidnightPT.setHours(0, 0, 0, 0);
      
      // Find what midnight looks like tonight in PT
      const nextMidnightPT = new Date(lastMidnightPT);
      nextMidnightPT.setDate(nextMidnightPT.getDate() + 1);

      // Convert those PT times back to pure UTC so the database understands it
      const offsetMs = now.getTime() - ptTime.getTime();
      const absoluteLastMidnight = new Date(lastMidnightPT.getTime() + offsetMs);
      const absoluteNextMidnight = new Date(nextMidnightPT.getTime() + offsetMs);

      setLastMidnightUTC(absoluteLastMidnight.toISOString());
      
      // Format the NEXT reset time perfectly to the user's local device timezone
      setLocalResetTime(absoluteNextMidnight.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    };
    
    calculateTimes();
    
    // Recalculate if the app stays open past midnight
    const interval = setInterval(calculateTimes, 60000 * 60); 
    return () => clearInterval(interval);
  }, []);

  // ✅ FETCH GLOBAL SCANS AND LISTEN FOR APP-WIDE UPDATES
  useEffect(() => {
    if (!lastMidnightUTC) return;

    const fetchGlobalScans = async () => {
      const { count, error } = await supabase
        .from('user_history')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', lastMidnightUTC); // Only count scans since the last PT midnight
      
      if (!error) setLiveGlobalScans(count || 0);
    };

    fetchGlobalScans();

    // Listen to ALL inserts in the table, regardless of user_id
    const uniqueChannelName = `global_scans_${Math.random().toString(36).substring(2, 10)}`;
    const channel = supabase
      .channel(uniqueChannelName)
      .on('postgres_changes', 
          { event: 'INSERT', schema: 'public', table: 'user_history' }, 
          () => fetchGlobalScans()
      ).subscribe();

    return () => supabase.removeChannel(channel);
  }, [lastMidnightUTC]);

  const navigationItems = [
    { id: 'home', icon: HomeIcon, label: 'Home' },
    { id: 'verify', icon: ShieldCheckIcon, label: 'Verify' },
    { id: 'education', icon: BookOpenIcon, label: 'Education' },
    { id: 'community', icon: UsersIcon, label: 'Community' },
    { id: 'analytics', icon: ChartBarIcon, label: 'Analytics' },
    { id: 'protection', icon: ShieldExclamationIcon, label: 'Helpline 24/7' }
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

  const ActiveIcon = AVATAR_OPTIONS?.find(a => a.id === identity?.avatar)?.icon || UserCircleIcon;
  
  // ✅ GLOBAL MATH: App-wide limit of 20 minus the total global scans today
  const scansRemaining = Math.max(0, 20 - liveGlobalScans);

  return (
    <>
      {showQRPopup && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-sm w-full shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Share Xist AI</h3>
              <button onClick={() => setShowQRPopup(false)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
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

      <nav className="bg-gradient-to-r from-indigo-900 to-purple-900 border-b border-indigo-800 sticky top-0 z-50 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
          
          <div className="relative flex flex-wrap items-center justify-between min-h-[64px] py-2 gap-y-3">
            
            <div className="flex items-center flex-shrink-0 space-x-2 relative z-[100]"> 
               <button 
                 onClick={(e) => {
                   e.stopPropagation(); 
                   console.log("Menu Triggered");
                   setMobileMenuOpen(true);
                 }} 
                 className="lg:hidden p-2 -ml-2 text-gray-300 hover:bg-indigo-800 rounded-md transition-colors relative z-[110] pointer-events-auto"
                 aria-label="Open Menu"
               >
                 <Bars3Icon className="w-6 h-6" />
               </button>

               <div className="w-8 h-8 shrink-0">
                  <img src="/logo.png" alt="Logo" className="w-full h-full object-contain" />
               </div>
               
               <div>
                 <h1 className="text-lg font-bold text-white tracking-tight whitespace-nowrap">Xist AI</h1>
               </div>
            </div>

            <div className="hidden lg:flex flex-wrap items-center justify-center flex-1 space-x-1 xl:space-x-2 px-2">
              {navigationItems.map(({ id, icon: IconComponent, label }) => (
                <button 
                  key={id} 
                  onClick={() => setCurrentSection(id)} 
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md font-medium transition-colors 
                    ${currentSection === id 
                      ? 'bg-indigo-700 text-white' 
                      : 'text-gray-400 hover:text-white hover:bg-indigo-600'}`}
                >
                  <IconComponent className="w-4 h-4 shrink-0" /> 
                  <span className="text-sm whitespace-nowrap">{label}</span>
                </button>
              ))}
            </div>

            <div className="flex items-center space-x-1 sm:space-x-2 shrink-0">
              
              {!isOnline && (
                <div className="hidden sm:flex items-center mr-2 px-2 py-1 bg-red-500/20 rounded-md">
                   <WifiIcon className="w-4 h-4 text-red-400 mr-1" />
                   <span className="text-[10px] font-bold text-white uppercase">Offline</span>
                </div>
              )}

              {/* ✅ GLOBAL APP-WIDE SCAN COUNTER */}
              {user && (
                <div className="flex flex-col items-center justify-center mr-1">
                  <div className={`flex flex-col items-center px-2 py-1 rounded-lg border transition-all duration-300
                    ${scansRemaining <= 5 ? 'bg-rose-500/20 border-rose-500/50 shadow-[0_0_10px_rgba(244,63,94,0.2)]' : 'bg-white/10 border-white/20'}`}>
                    
                    <div className="flex items-center space-x-1.5">
                      <BoltIcon className={`w-3.5 h-3.5 ${scansRemaining <= 5 ? 'text-rose-400 animate-pulse' : 'text-yellow-400'}`} />
                      <div className="flex items-baseline gap-0.5">
                        <span className="text-xs font-black text-white font-mono">{scansRemaining}</span>
                        <span className="text-[8px] font-bold text-white/60 uppercase tracking-tighter">/ 20</span>
                      </div>
                      <span className="hidden sm:inline text-[8px] font-black text-white/80 uppercase tracking-widest ml-1">
                        Global Scans
                      </span>
                    </div>
                    
                    {/* ✅ THE LOCAL RESET TIMER */}
                    {localResetTime && (
                      <div className="text-[6px] sm:text-[7px] font-mono text-white/50 uppercase tracking-widest mt-0.5 text-center w-full">
                        Resets at {localResetTime}
                      </div>
                    )}
                    
                  </div>
                </div>
              )}

              <button onClick={() => setShowQRPopup(true)} className="p-2 rounded-md hover:bg-indigo-600 transition-colors">
                <QrCodeIcon className="w-5 h-5 text-gray-300" />
              </button>
              
              <button onClick={toggleTheme} className="p-2 rounded-md hover:bg-indigo-600 transition-colors">
                {theme === 'dark' ? <SunIcon className="w-5 h-5 text-gray-300" /> : <MoonIcon className="w-5 h-5 text-gray-300" />}
              </button>

              {user ? (
                <div className="flex items-center space-x-2 sm:space-x-3 bg-white/5 px-2 sm:px-3 py-1.5 rounded-xl border border-white/10">
                  
                  <div className="text-right hidden lg:block">
                    <p className="text-[9px] font-black uppercase tracking-widest text-indigo-300 mb-0.5">Operator Active</p>
                    <p className="text-xs font-bold text-white uppercase font-mono truncate max-w-[100px]">{identity?.alias || 'Unknown'}</p>
                  </div>
                  
                  <button onClick={() => setCurrentSection('settings')} className="w-9 h-9 rounded-lg bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center overflow-hidden shrink-0">
                    <TacticalAvatar url={user?.photoURL} tacticalId={identity?.avatar} />
                  </button>
                  
                  <div className="w-px h-6 bg-white/10 mx-1 hidden sm:block"></div>
                  
                  <button onClick={logout} className="p-1.5 rounded-md hover:bg-rose-500/20 hover:text-rose-400 transition-colors hidden sm:block">
                    <ArrowRightOnRectangleIcon className="w-5 h-5 text-gray-300 hover:text-rose-400" />
                  </button>
                </div>
              ) : (
                <button onClick={login} className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white px-4 py-2 rounded-md text-sm whitespace-nowrap">
                  Sign In
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default TopNavigation;