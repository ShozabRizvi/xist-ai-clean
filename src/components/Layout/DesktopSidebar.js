import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  HomeIcon, ShieldCheckIcon, BookOpenIcon, UsersIcon, ChartBarIcon, 
  ShieldExclamationIcon, Cog6ToothIcon, InformationCircleIcon, PhoneIcon, 
  QuestionMarkCircleIcon, ChevronLeftIcon, ChevronRightIcon
} from '@heroicons/react/24/outline';

const DesktopSidebar = ({ currentSection, setCurrentSection, collapsed, setCollapsed }) => {
  
  // 1. Simplified Navigation Language
  const mainNavItems = [
    { id: 'home', icon: HomeIcon, label: 'Home', description: 'Main dashboard' },
    { id: 'verify', icon: ShieldCheckIcon, label: 'Scan', description: 'Check links & files' },
    { id: 'analytics', icon: ChartBarIcon, label: 'History', description: 'Past scan results' },
    { id: 'community', icon: UsersIcon, label: 'Community', description: 'Public safety feed' },
    { id: 'education', icon: BookOpenIcon, label: 'Learn', description: 'Security academy' },
    { id: 'protection', icon: ShieldExclamationIcon, label: 'Emergency', description: 'Get help fast' },
  ];

  const secondaryNavItems = [
    { id: 'about', icon: InformationCircleIcon, label: 'About', description: 'Our mission' },
    { id: 'contact', icon: PhoneIcon, label: 'Contact', description: 'Reach our team' },
    { id: 'support', icon: QuestionMarkCircleIcon, label: 'Support', description: 'Help center' },
  ];

  // Helper function to render nav buttons
  const NavButton = ({ item }) => {
    const isActive = currentSection === item.id;
    return (
      <button
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
  };

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
        style={{ overflowY: 'hidden', height: 'calc(100dvh - 64px)' }} 
        className={`desktop-panel-menu fixed top-16 bottom-0 left-0 z-40 flex flex-col shadow-2xl transition-colors duration-300
          bg-white dark:bg-slate-900 
          border-r border-gray-200 dark:border-white/5 
          text-gray-800 dark:text-slate-300
          ${collapsed ? 'collapsed' : 'expanded'}`}
      >
        {/* COLLAPSE TOGGLE */}
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

        {/* MAIN NAVIGATION SCROLL AREA */}
        <nav className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden custom-scrollbar py-4 w-full flex flex-col justify-between">
          <div className="px-3 space-y-2">
            {mainNavItems.map(item => <NavButton key={item.id} item={item} />)}
            
            <div className="my-4 border-t border-gray-200 dark:border-white/5 mx-3" />
            
            {secondaryNavItems.map(item => <NavButton key={item.id} item={item} />)}
          </div>
        </nav>

        {/* BOTTOM PINNED SETTINGS (Replaces the old profile block) */}
        <div className="flex-shrink-0 w-full mt-auto border-t border-gray-200 dark:border-white/5 bg-gray-50/80 dark:bg-slate-800/50 p-4 pb-24 md:pb-4 transition-colors duration-300">
          <NavButton item={{ id: 'settings', icon: Cog6ToothIcon, label: 'Settings', description: 'Profile & Preferences' }} />
        </div>

      </motion.div>
    </>
  );
};

export default DesktopSidebar;