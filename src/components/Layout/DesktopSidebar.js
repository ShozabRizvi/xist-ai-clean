import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Cog6ToothIcon, Bars3Icon, ChatBubbleLeftEllipsisIcon,
  PlusIcon, ArrowLeftIcon, HomeIcon, ShieldCheckIcon, 
  AcademicCapIcon, UserGroupIcon, ChartBarIcon, PhoneIcon, XMarkIcon
} from '@heroicons/react/24/outline';

const DesktopSidebar = ({ currentSection, setCurrentSection, collapsed, setCollapsed, analysisHistory = [], isMobile = false }) => {
  
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
      // 🚀 FIX: Removed the "!" modifiers. Used pure bg-white to guarantee it blocks the dark shadow bleed-through.
      className={`flex flex-col transition-colors duration-300 border-none shadow-none
        ${isMobile 
            ? 'h-full relative z-50 bg-white dark:bg-[#080c1a]' 
            : 'fixed top-0 bottom-0 left-0 z-40 bg-transparent'
        }
      `}
    >
      {/* 🚀 LOGO & TOGGLE BUTTON */}
      <div className="flex-shrink-0 flex flex-col items-center justify-start pt-6 pb-2 px-4 w-full border-none">
        
        {/* LOGO */}
        <div 
          onClick={() => setCurrentSection('home')} 
          className="flex items-center justify-center cursor-pointer hover:opacity-80 transition-opacity mb-4 group"
          title="Return Home"
        >
          <img src="/logo.png" alt="Xist Logo" className="w-8 h-8 object-contain drop-shadow-md group-hover:scale-105 transition-transform" />
          <AnimatePresence>
            {(!collapsed || isMobile) && (
              <motion.span initial={{ opacity: 0, width: 0 }} animate={{ opacity: 1, width: 'auto' }} exit={{ opacity: 0, width: 0 }} className="font-black text-lg tracking-widest uppercase text-slate-900 dark:text-white whitespace-nowrap overflow-hidden ml-3">
                XIST AI
              </motion.span>
            )}
          </AnimatePresence>
        </div>

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
          <div className="px-4 pb-2 pt-2 transition-colors duration-300">
            <button onClick={() => setCurrentSection('home')} title="Back to Dashboard" className={`flex items-center transition-all duration-300 group relative flex-shrink-0 overflow-hidden shadow-sm ${(!isMobile && collapsed) ? 'w-12 h-12 mx-auto justify-center p-0 rounded-full' : 'w-full h-12 justify-start px-4 rounded-[1.2rem]'} glass-input hover:border-indigo-500/50 hover:shadow-lg text-slate-800 dark:text-white`}>
              <ArrowLeftIcon className={`flex-shrink-0 w-5 h-5 transition-colors ${!isMobile && collapsed ? 'text-slate-500 dark:text-slate-400 group-hover:text-indigo-500' : 'text-slate-500 mr-3'}`} />
              <AnimatePresence>{(isMobile || !collapsed) && (<motion.div initial={{ opacity: 0, width: 0 }} animate={{ opacity: 1, width: 'auto' }} exit={{ opacity: 0, width: 0 }} className="font-black text-[11px] uppercase tracking-widest whitespace-nowrap">Back to Home</motion.div>)}</AnimatePresence>
            </button>
          </div>

          <div className="px-4 py-2 transition-colors duration-300 border-none">
            <button onClick={() => { setCurrentSection('verify'); sessionStorage.removeItem('xist_preload_input'); }} title="New Scan" className={`flex items-center transition-all duration-300 group relative flex-shrink-0 overflow-hidden shadow-sm ${(!isMobile && collapsed) ? 'w-12 h-12 rounded-full mx-auto justify-center p-0 bg-transparent shadow-none hover:bg-black/5 dark:hover:bg-white/5' : 'w-full h-12 rounded-[1.2rem] justify-start px-4 glass-card hover:border-indigo-500/50 hover:shadow-[0_0_15px_rgba(99,102,241,0.15)]'} text-slate-800 dark:text-white`}>
              <PlusIcon className={`flex-shrink-0 w-5 h-5 transition-colors ${!isMobile && collapsed ? 'text-slate-500 dark:text-slate-400 group-hover:text-indigo-500' : 'text-indigo-500 mr-3'}`} />
              <AnimatePresence>{(isMobile || !collapsed) && (<motion.div initial={{ opacity: 0, width: 0 }} animate={{ opacity: 1, width: 'auto' }} exit={{ opacity: 0, width: 0 }} className="font-black text-xs uppercase tracking-widest whitespace-nowrap">New Scan</motion.div>)}</AnimatePresence>
            </button>
          </div>

          {!(collapsed && !isMobile) && (
            <div className="flex-1 min-h-0 overflow-y-auto py-4 w-full flex flex-col custom-scrollbar">
              <div className="px-6 mb-3 text-[9px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">Recent History</div>
              <div className="px-3 space-y-1">
                {analysisHistory.length === 0 ? (
                  <div className="px-3 py-4 text-xs italic text-center opacity-50 text-slate-500">No recent activity.</div>
                ) : (
                  analysisHistory.map((historyItem, idx) => (
                    <button key={historyItem.id || idx} onClick={() => { sessionStorage.setItem('xist_view_history_id', historyItem.id); window.dispatchEvent(new Event('xist_history_clicked')); setCurrentSection('scan-details'); }} title={getDisplayTitle(historyItem)} className="flex items-center w-full rounded-xl transition-all duration-200 group relative flex-shrink-0 border border-transparent hover:bg-black/5 dark:hover:bg-white/5 justify-start p-3">
                      <ChatBubbleLeftEllipsisIcon className="flex-shrink-0 transition-colors w-4 h-4 text-slate-400 group-hover:text-indigo-500 dark:text-slate-500 dark:group-hover:text-indigo-400" />
                      <div className="text-left whitespace-nowrap overflow-hidden ml-3 w-full"><div className="font-medium text-[13px] truncate text-slate-700 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white">{getDisplayTitle(historyItem)}</div></div>
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
              <button key={item.id} onClick={() => setCurrentSection(item.id)} title={item.label} className={`flex items-center transition-all duration-200 group relative flex-shrink-0 overflow-hidden ${(!isMobile && collapsed) ? 'w-10 h-10 mx-auto justify-center p-0 rounded-full' : 'w-full h-12 justify-start px-4 rounded-xl'} ${isActive ? 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 shadow-inner border border-indigo-500/20' : 'text-slate-600 dark:text-slate-400 hover:bg-black/5 dark:hover:bg-white/5 border border-transparent'}`}>
                <Icon className={`flex-shrink-0 transition-colors w-5 h-5 ${isActive ? 'text-indigo-500' : 'text-slate-400 group-hover:text-indigo-500 dark:text-slate-500 dark:group-hover:text-indigo-400'}`} />
                <AnimatePresence>
                  {(isMobile || !collapsed) && (<motion.div initial={{ opacity: 0, width: 0 }} animate={{ opacity: 1, width: 'auto' }} exit={{ opacity: 0, width: 0 }} className={`font-black text-[11px] uppercase tracking-widest whitespace-nowrap ml-3 ${isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-700 dark:text-slate-300'}`}>{item.label}</motion.div>)}
                </AnimatePresence>
              </button>
            )
          })}
        </div>
      )}

      {(isScanMode && collapsed && !isMobile) && <div className="flex-1" />}

      {/* 🚀 SETTINGS BUTTON */}
      <div className="flex-shrink-0 w-full mt-auto p-4 transition-colors duration-300 border-none">
        <button onClick={() => setCurrentSection('settings')} title="Settings" className={`flex items-center transition-all duration-200 group relative flex-shrink-0 hover:bg-black/5 dark:hover:bg-white/5 ${(!isMobile && collapsed) ? 'w-10 h-10 rounded-full justify-center mx-auto p-0' : 'w-full rounded-xl justify-start p-3'} ${currentSection === 'settings' ? "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20" : "text-slate-600 dark:text-slate-400 border border-transparent"}`}>
          <Cog6ToothIcon className={`flex-shrink-0 transition-colors w-5 h-5 ${currentSection === 'settings' ? 'text-indigo-500' : 'text-slate-400 group-hover:text-indigo-500 dark:text-slate-500 dark:group-hover:text-indigo-400'}`} />
          <AnimatePresence>
            {(isMobile || !collapsed) && (<motion.div initial={{ opacity: 0, width: 0 }} animate={{ opacity: 1, width: 'auto' }} exit={{ opacity: 0, width: 0 }} className={`font-black text-[11px] uppercase tracking-widest whitespace-nowrap ml-3 ${currentSection === 'settings' ? 'text-indigo-600 dark:text-indigo-400' : ''}`}>Settings</motion.div>)}
          </AnimatePresence>
        </button>
      </div>
    </motion.div>
  );
};

export default DesktopSidebar;