import React from 'react';
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

const MobileBottomNav = ({ currentSection, setCurrentSection, userStats }) => {
  const bottomNavItems = [
    { id: 'home', icon: HomeIcon, iconSolid: HomeIconSolid, label: 'Home', badge: null },
    { id: 'verify', icon: ShieldCheckIcon, iconSolid: ShieldCheckIconSolid, label: 'Verify', badge: null },
    { id: 'community', icon: UsersIcon, iconSolid: UsersIconSolid, label: 'Community', badge: null },
    { id: 'analytics', icon: ChartBarIcon, iconSolid: ChartBarIconSolid, label: 'Analytics', badge: userStats?.newThreats || null },
    { id: 'settings', icon: Cog6ToothIcon, iconSolid: Cog6ToothIconSolid, label: 'Settings', badge: null }
  ];

  const handleNavigation = (sectionId) => {
    if (navigator.vibrate) navigator.vibrate(10);
    setCurrentSection(sectionId);
  };

  return (
    <>
      <nav 
        // ✅ FIX: Matched the slate/cyan cyber theme used in the desktop version
        className="mobile-bottom-nav fixed bottom-0 left-0 right-0 z-50 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-t border-gray-200/50 dark:border-white/10 shadow-[0_-10px_30px_rgba(0,0,0,0.15)]"
        role="navigation"
        aria-label="Main mobile navigation"
      >
        <div className="grid grid-cols-5 h-16 sm:h-18 safe-area-bottom">
          {bottomNavItems.map((item) => {
            const isActive = currentSection === item.id;
            const IconComponent = isActive ? item.iconSolid : item.icon;
            
            return (
              <button
                key={item.id}
                onClick={() => handleNavigation(item.id)}
                className={`
                  relative flex flex-col items-center justify-center px-1 py-2 
                  transition-all duration-300 ease-out min-h-[64px] min-w-[48px] rounded-lg mx-1
                  ${isActive
                    ? 'text-cyan-600 dark:text-cyan-400 bg-cyan-50/80 dark:bg-white/5 scale-105' 
                    : 'text-gray-500 dark:text-slate-400 hover:text-gray-800 dark:hover:text-slate-200 hover:bg-gray-100/50 dark:hover:bg-white/5'
                  }
                `}
                aria-label={item.label}
                aria-current={isActive ? 'page' : undefined}
                style={{ WebkitTapHighlightColor: 'transparent' }}
              >
                {item.badge && (
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center animate-pulse">
                    {item.badge > 99 ? '99+' : item.badge}
                  </div>
                )}

                <IconComponent className={`w-6 h-6 mb-1 transition-all duration-200 ${isActive ? 'scale-110 drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]' : 'scale-100'}`} />
                
                <span className={`text-[10px] transition-all duration-200 leading-tight ${isActive ? 'font-bold tracking-wide' : 'font-medium'}`}>
                  {item.label}
                </span>
                
                {/* ✨ ACTIVE INDICATOR BAR (Matches Desktop Neon style) */}
                {isActive && (
                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-t-full shadow-[0_-2px_8px_rgba(34,211,238,0.6)]" />
                )}
              </button>
            );
          })}
        </div>
      </nav>
      <div className="h-safe-area-bottom bg-white dark:bg-slate-900 fixed bottom-0 left-0 right-0 -z-10" />
    </>
  );
};

export default MobileBottomNav;