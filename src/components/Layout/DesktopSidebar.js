import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Cog6ToothIcon, Bars3Icon, ChatBubbleLeftEllipsisIcon,
  PlusIcon, ArrowLeftIcon, HomeIcon, ShieldCheckIcon, 
  AcademicCapIcon, UserGroupIcon, ChartBarIcon, PhoneIcon
} from '@heroicons/react/24/outline';

const DesktopSidebar = ({ 
  currentSection, setCurrentSection, collapsed, setCollapsed, analysisHistory = [], isMobile = false
}) => {
  
  const getDisplayTitle = (item) => {
    const text = item.input || item.query || item.input_text || item.text || item.url || item.payload;
    if (!text) return "Unknown Input";
    return text.length > 22 ? text.substring(0, 22) + "..." : text;
  };

  const isScanMode = currentSection === 'verify' || currentSection === 'scan-details';

  const navigationItems = [
    { id: 'home', label: 'Dashboard', icon: HomeIcon },
    { id: 'verify', label: 'Ask Xist ', icon: ShieldCheckIcon },
    { id: 'education', label: 'Education', icon: AcademicCapIcon },
    { id: 'community', label: 'Community Feed', icon: UserGroupIcon },
    { id: 'analytics', label: 'Analytics', icon: ChartBarIcon },
    { id: 'protection', label: 'Helpline 24/7', icon: PhoneIcon }
  ];

  return (
    <motion.div
      initial={false}
      animate={{ width: isMobile ? '100%' : (collapsed ? 72 : 240) }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className={`desktop-panel-menu flex flex-col shadow-2xl transition-colors duration-300 border-r border-black/5 dark:border-white/5 bg-slate-50/60 dark:bg-[#080c1a]/60 backdrop-blur-2xl
        ${isMobile ? 'h-full relative z-50' : 'fixed top-[64px] bottom-0 left-0 z-40'}
      `}
    >
      {/* 🚀 TOP TOGGLE BUTTON */}
      <div className="flex-shrink-0 flex items-center justify-start p-4 h-[72px] w-full border-b border-transparent">
        <motion.button
          onClick={() => setCollapsed(!collapsed)}
          whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
          title={collapsed ? "Expand menu" : "Collapse menu"}
          className="w-10 h-10 min-w-[40px] min-h-[40px] rounded-full flex items-center justify-center transition-colors text-slate-500 hover:text-slate-900 hover:bg-black/5 dark:text-slate-400 dark:hover:text-white dark:hover:bg-white/10"
        >
          <Bars3Icon className="w-6 h-6" />
        </motion.button>
      </div>

      {isScanMode ? (
        /* ========================================= */
        /* 🚀 SCAN MODE: WORKSPACE & HISTORY         */
        /* ========================================= */
        <>
          {/* BACK TO HOME BUTTON */}
          <div className="px-4 pb-2 pt-2 transition-colors duration-300">
            <button 
              onClick={() => setCurrentSection('home')}
              title="Back to Dashboard"
              className={`flex items-center transition-all duration-300 group relative flex-shrink-0 overflow-hidden shadow-sm
                ${(!isMobile && collapsed) ? 'w-12 h-12 mx-auto justify-center p-0 rounded-full' : 'w-full h-12 justify-start px-4 rounded-[1.2rem]'}
                glass-input hover:border-indigo-500/50 hover:shadow-lg text-slate-800 dark:text-white
              `}
            >
              <ArrowLeftIcon className={`flex-shrink-0 w-5 h-5 transition-colors ${!isMobile && collapsed ? 'text-slate-500 dark:text-slate-400 group-hover:text-indigo-500' : 'text-slate-500 mr-3'}`} />
              <AnimatePresence>
                {(isMobile || !collapsed) && (
                  <motion.div initial={{ opacity: 0, width: 0 }} animate={{ opacity: 1, width: 'auto' }} exit={{ opacity: 0, width: 0 }} className="font-black text-[11px] uppercase tracking-widest whitespace-nowrap">
                    Back to Home
                  </motion.div>
                )}
              </AnimatePresence>
            </button>
          </div>

          {/* NEW SCAN BUTTON */}
          <div className="px-4 py-2 transition-colors duration-300 border-b border-black/5 dark:border-white/5">
            <button 
              onClick={() => {
                 setCurrentSection('verify');
                 sessionStorage.removeItem('xist_preload_input');
              }}
              title="New Scan"
              className={`flex items-center transition-all duration-300 group relative flex-shrink-0 overflow-hidden shadow-sm
                ${(!isMobile && collapsed) ? 'w-12 h-12 rounded-full mx-auto justify-center p-0 bg-transparent shadow-none hover:bg-black/5 dark:hover:bg-white/5' : 'w-full h-12 rounded-[1.2rem] justify-start px-4 glass-card hover:border-indigo-500/50 hover:shadow-[0_0_15px_rgba(99,102,241,0.15)]'} text-slate-800 dark:text-white
              `}
            >
              <PlusIcon className={`flex-shrink-0 w-5 h-5 transition-colors ${!isMobile && collapsed ? 'text-slate-500 dark:text-slate-400 group-hover:text-indigo-500' : 'text-indigo-500 mr-3'}`} />
              <AnimatePresence>
                {(isMobile || !collapsed) && (
                  <motion.div initial={{ opacity: 0, width: 0 }} animate={{ opacity: 1, width: 'auto' }} exit={{ opacity: 0, width: 0 }} className="font-black text-xs uppercase tracking-widest whitespace-nowrap">
                    New Scan
                  </motion.div>
                )}
              </AnimatePresence>
            </button>
          </div>

          {/* RECENT SCANS HISTORY */}
          {!(collapsed && !isMobile) && (
            <div className="flex-1 min-h-0 overflow-y-auto py-4 w-full flex flex-col custom-scrollbar">
              <div className="px-6 mb-3 text-[9px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">Recent History</div>
              <div className="px-3 space-y-1">
                {analysisHistory.length === 0 ? (
                  <div className="px-3 py-4 text-xs italic text-center opacity-50 text-slate-500">No recent activity.</div>
                ) : (
                  analysisHistory.map((historyItem, idx) => (
                    <button key={historyItem.id || idx} 
                      onClick={() => {
                         sessionStorage.setItem('xist_view_history_id', historyItem.id);
                         window.dispatchEvent(new Event('xist_history_clicked'));
                         setCurrentSection('scan-details'); 
                      }}
                      title={getDisplayTitle(historyItem)}
                      className="flex items-center w-full rounded-xl transition-all duration-200 group relative flex-shrink-0 border border-transparent hover:bg-black/5 dark:hover:bg-white/5 justify-start p-3"
                    >
                      <ChatBubbleLeftEllipsisIcon className="flex-shrink-0 transition-colors w-4 h-4 text-slate-400 group-hover:text-indigo-500 dark:text-slate-500 dark:group-hover:text-indigo-400" />
                      <div className="text-left whitespace-nowrap overflow-hidden ml-3 w-full">
                        <div className="font-medium text-[13px] truncate text-slate-700 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white">
                          {getDisplayTitle(historyItem)}
                        </div>
                      </div>
                    </button>
                  ))
                )}
              </div>
            </div>
          )}
        </>
      ) : (
        /* ========================================= */
        /* 🚀 MAIN MENU MODE: SECTIONS NAVIGATION    */
        /* ========================================= */
        <div className={`flex-1 min-h-0 overflow-y-hidden flex flex-col w-full ${(!isMobile && collapsed) ? 'py-2 space-y-1 px-0 items-center' : 'py-4 space-y-2 px-3'}`}>
          {!(collapsed && !isMobile) && (
            <div className="px-3 mb-2 text-[9px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">Main Menu</div>
          )}
          
          {navigationItems.map(item => {
            const Icon = item.icon;
            const isActive = currentSection === item.id;
            
            return (
              <button 
                key={item.id}
                onClick={() => setCurrentSection(item.id)}
                title={item.label}
                className={`flex items-center transition-all duration-200 group relative flex-shrink-0 overflow-hidden
                  ${(!isMobile && collapsed) ? 'w-10 h-10 mx-auto justify-center p-0 rounded-full' : 'w-full h-12 justify-start px-4 rounded-xl'}
                  ${isActive 
                    ? 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 shadow-inner border border-indigo-500/20' 
                    : 'text-slate-600 dark:text-slate-400 hover:bg-black/5 dark:hover:bg-white/5 border border-transparent'
                  }
                `}
              >
                <Icon className={`flex-shrink-0 transition-colors w-5 h-5 ${isActive ? 'text-indigo-500' : 'text-slate-400 group-hover:text-indigo-500 dark:text-slate-500 dark:group-hover:text-indigo-400'}`} />
                <AnimatePresence>
                  {(isMobile || !collapsed) && (
                    <motion.div initial={{ opacity: 0, width: 0 }} animate={{ opacity: 1, width: 'auto' }} exit={{ opacity: 0, width: 0 }} className={`font-black text-[11px] uppercase tracking-widest whitespace-nowrap ml-3 ${isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-700 dark:text-slate-300'}`}>
                      {item.label}
                    </motion.div>
                  )}
                </AnimatePresence>
              </button>
            )
          })}
        </div>
      )}

      {/* 🚀 FIXED: Only push settings to bottom if we are in Scan Mode with History hidden */}
      {(isScanMode && collapsed && !isMobile) && <div className="flex-1" />}

      {/* 🚀 SETTINGS BUTTON */}
      <div className="flex-shrink-0 w-full mt-auto p-4 transition-colors duration-300 border-t border-black/5 dark:border-white/5">
        <button onClick={() => setCurrentSection('settings')} 
          title="Settings"
          className={`flex items-center transition-all duration-200 group relative flex-shrink-0 hover:bg-black/5 dark:hover:bg-white/5
            ${(!isMobile && collapsed) ? 'w-10 h-10 rounded-full justify-center mx-auto p-0' : 'w-full rounded-xl justify-start p-3'}
            ${currentSection === 'settings' ? "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20" : "text-slate-600 dark:text-slate-400 border border-transparent"}
          `}
        >
          <Cog6ToothIcon className={`flex-shrink-0 transition-colors w-5 h-5 ${currentSection === 'settings' ? 'text-indigo-500' : 'text-slate-400 group-hover:text-indigo-500 dark:text-slate-500 dark:group-hover:text-indigo-400'}`} />
          <AnimatePresence>
            {(isMobile || !collapsed) && (
              <motion.div initial={{ opacity: 0, width: 0 }} animate={{ opacity: 1, width: 'auto' }} exit={{ opacity: 0, width: 0 }} className={`font-black text-[11px] uppercase tracking-widest whitespace-nowrap ml-3 ${currentSection === 'settings' ? 'text-indigo-600 dark:text-indigo-400' : ''}`}>
                Settings
              </motion.div>
            )}
          </AnimatePresence>
        </button>
      </div>
    </motion.div>
  );
};

export default DesktopSidebar;