import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  HomeIcon, 
  ShieldCheckIcon, 
  UsersIcon, 
  ChartBarIcon,
  Cog6ToothIcon 
} from '@heroicons/react/24/outline';
import {
  HomeIcon as HomeIconSolid,
  ShieldCheckIcon as ShieldCheckIconSolid,
  UsersIcon as UsersIconSolid,
  ChartBarIcon as ChartBarIconSolid,
  Cog6ToothIcon as Cog6ToothIconSolid
} from '@heroicons/react/24/solid';

const MobileBottomNav = ({ currentSection, setCurrentSection, userStats, theme }) => {
  const isDark = theme === 'dark';

  const bottomNavItems = [
    { id: 'home', icon: HomeIcon, iconSolid: HomeIconSolid, label: 'Home' },
    { id: 'verify', icon: ShieldCheckIcon, iconSolid: ShieldCheckIconSolid, label: 'Verify' },
    { id: 'community', icon: UsersIcon, iconSolid: UsersIconSolid, label: 'Feed' },
    { id: 'analytics', icon: ChartBarIcon, iconSolid: ChartBarIconSolid, label: 'Stats', badge: userStats?.newThreats },
    { id: 'settings', icon: Cog6ToothIcon, iconSolid: Cog6ToothIconSolid, label: 'Settings' }
  ];

  const handleNavigation = (sectionId) => {
    // Standard Android Haptic Feedback
    if (navigator.vibrate) navigator.vibrate(10); 
    setCurrentSection(sectionId);
  };

  return (
    <nav className="mobile-bottom-nav" role="navigation">
      <div className="nav-grid">
        {bottomNavItems.map((item) => {
          const isActive = currentSection === item.id;
          const IconComponent = isActive ? item.iconSolid : item.icon;
          
          return (
            <button
              key={item.id}
              onClick={() => handleNavigation(item.id)}
              className={`nav-item ${isActive ? 'active' : ''}`}
              aria-label={item.label}
              aria-current={isActive ? 'page' : undefined}
            >
              {/* Icon Container with Pill Logic */}
              <div className="relative">
                <IconComponent className="nav-icon" />
                
                {/* Notification Badge */}
                <AnimatePresence>
                  {item.badge > 0 && (
                    <motion.div 
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      className="absolute -top-1 -right-1 w-4 h-4 bg-red-600 text-white text-[9px] font-black rounded-full flex items-center justify-center border-2 border-white dark:border-slate-900"
                    >
                      {item.badge > 9 ? '9+' : item.badge}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Label */}
              <span className="nav-label">
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default MobileBottomNav;