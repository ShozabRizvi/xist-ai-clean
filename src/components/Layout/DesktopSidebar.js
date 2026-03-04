import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { createClient } from '@supabase/supabase-js';
import { 
  HomeIcon, ShieldCheckIcon, BookOpenIcon, UsersIcon, ChartBarIcon, 
  ShieldExclamationIcon, Cog6ToothIcon, InformationCircleIcon, PhoneIcon, 
  QuestionMarkCircleIcon, ChevronLeftIcon, ChevronRightIcon, UserCircleIcon
} from '@heroicons/react/24/outline';
import { AVATAR_OPTIONS } from '../Sections/SettingsSection';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const DesktopSidebar = ({ currentSection, setCurrentSection, user, identity, collapsed, setCollapsed }) => {
  const [realStats, setRealStats] = useState({ scans: 0, threats: 0, points: 0 });

  useEffect(() => {
    const fetchSidebarStats = async () => {
      const currentUserId = user?.id || user?.uid;
      if (!currentUserId) return;

      try {
        const { data: userRecords, error } = await supabase
          .from('user_history')
          .select('*')
          .eq('user_id', currentUserId);

        if (!error && userRecords) {
          const totalScans = userRecords.length;
          const totalThreats = userRecords.filter(r => {
            const status = (r.verdict || r.threat_level || r.severity || '').toLowerCase();
            return status.includes('high') || status.includes('medium') || status.includes('critical') || status.includes('threat') || status.includes('danger');
          }).length;
          
          setRealStats({ scans: totalScans, threats: totalThreats, points: totalScans * 15 });
        }
      } catch (err) {
        console.error("Sidebar stats sync error:", err);
      }
    };

    fetchSidebarStats();

    const currentUserId = user?.id || user?.uid;
    if (currentUserId) {
      const historyChannel = supabase
        .channel('sidebar_ledger')
        .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'user_history', filter: `user_id=eq.${currentUserId}` }, 
          () => fetchSidebarStats()
        ).subscribe();
      return () => { supabase.removeChannel(historyChannel); };
    }
  }, [user?.id, user?.uid]);

  const navigationItems = [
    { id: 'home', icon: HomeIcon, label: 'Home', description: 'Dashboard & Overview' },
    { id: 'verify', icon: ShieldCheckIcon, label: 'Threat Analysis', description: 'AI Forensic Scanner' },
    { id: 'education', icon: BookOpenIcon, label: 'Academy', description: 'Security Training' },
    { id: 'community', icon: UsersIcon, label: 'Community Hub', description: 'Global Network' },
    { id: 'protection', icon: ShieldExclamationIcon, label: 'Helpline 24/7', description: 'Emergency Resources' },
    { id: 'analytics', icon: ChartBarIcon, label: 'Analytics', description: 'Your Ledger Stats' },
    { id: 'contact', icon: PhoneIcon, label: 'Contact', description: 'Reach the Team' },
    { id: 'support', icon: QuestionMarkCircleIcon, label: 'Support', description: 'Help Center' },
    { id: 'about', icon: InformationCircleIcon, label: 'About Xist AI', description: 'Mission & Vision' },
    { id: 'settings', icon: Cog6ToothIcon, label: 'Settings', description: 'Node Preferences' },
  ];

  const ActiveIcon = AVATAR_OPTIONS?.find(a => a.id === identity?.avatar)?.icon || UserCircleIcon;

  return (
    <>
      <style>{`
        @media (min-width: 769px) {
          aside, [class*="sidebar"], .desktop-panel-menu {
            width: ${collapsed ? '88px' : '280px'} !important;
            min-width: ${collapsed ? '88px' : '280px'} !important;
            max-width: ${collapsed ? '88px' : '280px'} !important;
            transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1), min-width 0.3s cubic-bezier(0.4, 0, 0.2, 1), max-width 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
            overflow-x: hidden !important;
          }
          .main-content-with-sidebar, main, .main-content, .app-content {
            margin-left: ${collapsed ? '88px' : '280px'} !important;
            width: calc(100vw - ${collapsed ? '88px' : '280px'}) !important;
            max-width: calc(100vw - ${collapsed ? '88px' : '280px'}) !important;
            transition: margin-left 0.3s cubic-bezier(0.4, 0, 0.2, 1), width 0.3s cubic-bezier(0.4, 0, 0.2, 1), max-width 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
          }
        }
      `}</style>

      <motion.div
        initial={false}
        animate={{ width: collapsed ? 88 : 280, minWidth: collapsed ? 88 : 280, maxWidth: collapsed ? 88 : 280 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        style={{ overflowY: 'hidden', height: 'calc(100vh - 64px)' }}
        className={`desktop-panel-menu fixed top-16 left-0 z-40 flex flex-col shadow-2xl transition-colors duration-300
          bg-white dark:bg-slate-900 
          border-r border-gray-200 dark:border-white/5 
          text-gray-800 dark:text-slate-300
          ${collapsed ? 'collapsed' : 'expanded'}`}
      >
        <div className="flex-shrink-0 flex items-center justify-center p-4 border-b border-gray-200 dark:border-white/5 h-[72px] w-full transition-colors duration-300">
          <motion.button
            onClick={() => setCollapsed(!collapsed)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className={`w-10 h-10 min-w-[40px] min-h-[40px] rounded-xl flex items-center justify-center transition-colors 
              bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-gray-900 border-gray-200
              dark:bg-white/5 dark:hover:bg-white/10 dark:text-slate-400 dark:hover:text-white dark:border-white/10 border
              ${collapsed ? 'mx-auto' : 'ml-auto'}`}
          >
            {collapsed ? <ChevronRightIcon className="w-5 h-5" /> : <ChevronLeftIcon className="w-5 h-5" />}
          </motion.button>
        </div>

        <nav className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden custom-scrollbar py-4 w-full">
          <div className="px-3 space-y-2">
            {navigationItems.map((item) => {
              const isActive = currentSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentSection(item.id)}
                  title={collapsed ? item.label : ''}
                  className={`flex items-center rounded-xl transition-all duration-200 group relative flex-shrink-0
                    ${isActive 
                      ? "bg-purple-50 dark:bg-cyan-500/10 text-purple-700 dark:text-cyan-300 border border-purple-200 dark:border-cyan-500/20 dark:shadow-[0_0_15px_rgba(6,182,212,0.15)]" 
                      : "hover:bg-gray-100 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-white border border-transparent"}
                    ${collapsed ? "w-[52px] h-[52px] justify-center mx-auto p-0" : "w-full justify-start p-3"}
                  `}
                >
                  {isActive && (
                    <motion.div layoutId="activeNavIndicator" className="absolute left-0 top-2 bottom-2 w-1 bg-purple-600 dark:bg-cyan-400 rounded-r-full shadow-sm dark:shadow-[0_0_10px_rgba(34,211,238,0.8)]" />
                  )}

                  <item.icon className={`flex-shrink-0 transition-colors ${collapsed ? 'w-6 h-6' : 'w-5 h-5 ml-2'} 
                    ${isActive ? 'text-purple-600 dark:text-cyan-400' : 'text-gray-400 dark:text-slate-500 group-hover:text-purple-500 dark:group-hover:text-cyan-200'}`} 
                  />
                  
                  <AnimatePresence>
                    {!collapsed && (
                      <motion.div 
                        initial={{ opacity: 0, width: 0 }}
                        animate={{ opacity: 1, width: 'auto' }}
                        exit={{ opacity: 0, width: 0 }}
                        className="text-left whitespace-nowrap overflow-hidden ml-3"
                      >
                        <div className={`font-semibold text-sm ${isActive ? 'text-purple-800 dark:text-white' : ''}`}>{item.label}</div>
                        <div className="text-[10px] text-gray-500 dark:text-slate-500 font-light mt-0.5">{item.description}</div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </button>
              );
            })}
          </div>
        </nav>

        <div className="flex-shrink-0 w-full mt-auto border-t border-gray-200 dark:border-white/5 bg-gray-50/80 dark:bg-slate-800/50 p-4 transition-colors duration-300">
          
          {/* TACTICAL SIDEBAR PROFILE */}
          <div className={`flex items-center ${collapsed ? 'justify-center' : 'gap-3'}`}>
            <div className="w-10 h-10 shrink-0 rounded-xl bg-purple-600/20 dark:bg-cyan-500/10 border border-purple-500/30 dark:border-cyan-500/30 flex items-center justify-center">
              <ActiveIcon className="w-6 h-6 text-purple-600 dark:text-cyan-400" />
            </div>
            
            <AnimatePresence>
              {!collapsed && (
                <motion.div 
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: 'auto' }}
                  exit={{ opacity: 0, width: 0 }}
                  className="overflow-hidden whitespace-nowrap"
                >
                  <div className="text-sm font-bold font-mono uppercase text-gray-900 dark:text-white truncate max-w-[160px]">
                    {identity?.alias || 'Unknown Node'}
                  </div>
                  <div className="text-[10px] text-purple-600 dark:text-cyan-400 uppercase tracking-widest flex items-center gap-1 mt-0.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-purple-600 dark:bg-cyan-400 animate-pulse" /> Active Shield
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <AnimatePresence>
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0, height: 0, marginTop: 0 }}
                animate={{ opacity: 1, height: 'auto', marginTop: '16px' }}
                exit={{ opacity: 0, height: 0, marginTop: 0 }}
                transition={{ duration: 0.2 }}
                className="grid grid-cols-3 gap-2 overflow-hidden"
              >
                <div className="bg-white dark:bg-white/5 rounded-lg py-2 text-center border border-gray-200 dark:border-white/5 shadow-sm dark:shadow-none transition-colors">
                  <div className="text-sm font-bold text-gray-900 dark:text-white">{realStats.scans}</div>
                  <div className="text-[9px] uppercase tracking-wider text-gray-500 dark:text-slate-500">Scans</div>
                </div>
                <div className="bg-white dark:bg-white/5 rounded-lg py-2 text-center border border-gray-200 dark:border-white/5 shadow-sm dark:shadow-none transition-colors">
                  <div className="text-sm font-bold text-red-600 dark:text-red-400">{realStats.threats}</div>
                  <div className="text-[9px] uppercase tracking-wider text-gray-500 dark:text-slate-500">Threats</div>
                </div>
                <div className="bg-white dark:bg-white/5 rounded-lg py-2 text-center border border-gray-200 dark:border-white/5 shadow-sm dark:shadow-none transition-colors">
                  <div className="text-sm font-bold text-purple-600 dark:text-purple-400">{realStats.points}</div>
                  <div className="text-[9px] uppercase tracking-wider text-gray-500 dark:text-slate-500">Points</div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </>
  );
};

export default DesktopSidebar;