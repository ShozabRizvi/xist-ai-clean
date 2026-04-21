import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Cog6ToothIcon, Bars3Icon, ChatBubbleBottomCenterTextIcon, ChatBubbleLeftEllipsisIcon,
  PlusIcon
} from '@heroicons/react/24/outline';

const DesktopSidebar = ({ 
  currentSection, setCurrentSection, collapsed, setCollapsed, analysisHistory = [], isMobile = false
}) => {
  
  // 🚀 Parses the title beautifully for the sidebar history list
  const getDisplayTitle = (item) => {
    const text = item.input || item.query || item.input_text || item.text || item.url || item.payload;
    if (!text) return "Unknown Input";
    return text.length > 22 ? text.substring(0, 22) + "..." : text;
  };

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
      <div className="flex-shrink-0 flex items-center justify-start p-4 h-[72px] w-full border-b border-black/5 dark:border-white/5">
        <motion.button
          onClick={() => setCollapsed(!collapsed)}
          whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
          title={collapsed ? "Expand menu" : "Collapse menu"}
          className="w-10 h-10 min-w-[40px] min-h-[40px] rounded-full flex items-center justify-center transition-colors text-slate-500 hover:text-slate-900 hover:bg-black/5 dark:text-slate-400 dark:hover:text-white dark:hover:bg-white/10"
        >
          <Bars3Icon className="w-6 h-6" />
        </motion.button>
      </div>

      {/* 🚀 NEW SCAN BUTTON */}
      <div className={`p-4 transition-colors duration-300 ${(!isMobile && collapsed) ? 'border-transparent' : 'border-b border-black/5 dark:border-white/5'}`}>
        <button 
          onClick={() => setCurrentSection('verify')}
          title="New Scan"
          className={`flex items-center transition-all duration-300 group relative flex-shrink-0 overflow-hidden shadow-sm
            ${!isMobile && collapsed ? 'w-12 h-12 rounded-full mx-auto justify-center p-0' : 'w-full h-12 rounded-[1.2rem] justify-start px-4'}
            ${(!isMobile && collapsed) 
              ? 'bg-transparent shadow-none hover:bg-black/5 dark:hover:bg-white/5' 
              : 'glass-card hover:border-indigo-500/50 hover:shadow-[0_0_15px_rgba(99,102,241,0.15)] text-slate-800 dark:text-white' 
            }
          `}
        >
          <PlusIcon className={`flex-shrink-0 w-5 h-5 transition-colors ${!isMobile && collapsed ? 'text-slate-500 dark:text-slate-400 group-hover:text-indigo-500' : 'text-indigo-500 mr-3'}`} />
          
          <AnimatePresence>
            {(isMobile || !collapsed) && (
              <motion.div 
                initial={{ opacity: 0, width: 0 }} 
                animate={{ opacity: 1, width: 'auto' }} 
                exit={{ opacity: 0, width: 0 }} 
                className="font-black text-xs uppercase tracking-widest whitespace-nowrap"
              >
                New Scan
              </motion.div>
            )}
          </AnimatePresence>
        </button>
      </div>

      {/* 🚀 RECENT SCANS HISTORY */}
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
                     window.dispatchEvent(new Event('xist_history_clicked')); // 🚀 FORCES RELOAD
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

      {/* Push settings to bottom when collapsed */}
      {(collapsed && !isMobile) && <div className="flex-1" />}

      {/* 🚀 SETTINGS BUTTON */}
      <div className="flex-shrink-0 w-full mt-auto p-4 transition-colors duration-300 border-t border-black/5 dark:border-white/5">
        <button onClick={() => setCurrentSection('settings')} 
          title="Settings"
          // Replace the className line for the Settings button with this:
          className={`flex items-center w-full transition-all duration-200 group relative flex-shrink-0 hover:bg-black/5 dark:hover:bg-white/5
            ${!isMobile && collapsed ? 'rounded-full' : 'rounded-xl'}
            ${currentSection === 'settings' ? "glass-input text-indigo-600 dark:text-indigo-400" : "text-slate-600 dark:text-slate-400"}
            ${!isMobile && collapsed ? "w-10 h-10 justify-center mx-auto p-0" : "justify-start p-3"}
          `}
        >
          <Cog6ToothIcon className={`flex-shrink-0 transition-colors w-5 h-5 ${currentSection === 'settings' ? 'text-indigo-500' : 'text-slate-400 group-hover:text-indigo-500 dark:text-slate-500 dark:group-hover:text-indigo-400'}`} />
          <AnimatePresence>
            {(isMobile || !collapsed) && (
              <motion.div initial={{ opacity: 0, width: 0 }} animate={{ opacity: 1, width: 'auto' }} exit={{ opacity: 0, width: 0 }} className="font-black text-[11px] uppercase tracking-widest whitespace-nowrap ml-3">
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