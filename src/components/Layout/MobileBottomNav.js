import React from 'react';
import { 
  HomeIcon, 
  ShieldCheckIcon, 
  UsersIcon, 
  ChartBarIcon,        // 📊 Changed from generic stats to analytics
  Cog6ToothIcon 
} from '@heroicons/react/24/outline';
import {
  HomeIcon as HomeIconSolid,
  ShieldCheckIcon as ShieldCheckIconSolid,
  UsersIcon as UsersIconSolid,
  ChartBarIcon as ChartBarIconSolid,  // 📊 Solid version for active state
  Cog6ToothIcon as Cog6ToothIconSolid
} from '@heroicons/react/24/solid';

// USER AVATAR COMPONENT - For future profile integration
const UserAvatar = ({ user, size = 'sm', className = '' }) => {
  const sizeClasses = {
    xs: 'w-4 h-4 text-xs',
    sm: 'w-6 h-6 text-xs',
    md: 'w-8 h-8 text-sm',
  };

  const getInitials = (user) => {
    if (user?.displayName) {
      return user.displayName
        .split(' ')
        .map(name => name[0])
        .join('')
        .toUpperCase()
        .slice(0, 1);
    }
    if (user?.email) {
      return user.email[0].toUpperCase();
    }
    return '?';
  };

  const getAvatarColor = (user) => {
    if (!user?.email && !user?.displayName) return 'bg-gray-500';
    
    const name = user.displayName || user.email || '';
    const colors = [
      'bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-yellow-500',
      'bg-purple-500', 'bg-pink-500', 'bg-indigo-500', 'bg-teal-500'
    ];
    
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  };

  const hasPhoto = user?.photoURL && user.photoURL !== '';

  if (hasPhoto) {
    return (
      <img
        src={user.photoURL}
        alt={user.displayName || user.email || 'User'}
        className={`${sizeClasses[size]} rounded-full object-cover ${className}`}
        onError={(e) => {
          e.target.style.display = 'none';
          e.target.nextSibling.style.display = 'flex';
        }}
      />
    );
  }

  return (
    <div className={`${sizeClasses[size]} rounded-full ${getAvatarColor(user)} text-white font-semibold flex items-center justify-center ${className}`}>
      {getInitials(user)}
    </div>
  );
};

const MobileBottomNav = ({ currentSection, setCurrentSection, userStats, user }) => {
  // 📊 UPDATED NAVIGATION ITEMS - ANALYTICS INSTEAD OF STATS
  const bottomNavItems = [
    { 
      id: 'home', 
      icon: HomeIcon, 
      iconSolid: HomeIconSolid, 
      label: 'Home',
      ariaLabel: 'Navigate to Home page',
      badge: null
    },
    { 
      id: 'verify', 
      icon: ShieldCheckIcon, 
      iconSolid: ShieldCheckIconSolid, 
      label: 'Verify',
      ariaLabel: 'Navigate to AI Verification tools',
      badge: null
    },
    { 
      id: 'community', 
      icon: UsersIcon, 
      iconSolid: UsersIconSolid, 
      label: 'Community',
      ariaLabel: 'Navigate to Community Hub',
      badge: null
    },
    { 
      id: 'analytics',           // 🎯 CHANGED FROM 'analytics' TO PROPER ROUTING
      icon: ChartBarIcon,        // 📊 ANALYTICS ICON (was generic chart)
      iconSolid: ChartBarIconSolid, 
      label: 'Analytics',        // 🏷️ CHANGED FROM 'Stats' TO 'Analytics'
      ariaLabel: 'Navigate to Advanced Analytics and Threat Intelligence',
      badge: userStats?.newThreats || null  // Show badge if new threats detected
    },
    { 
      id: 'settings', 
      icon: Cog6ToothIcon, 
      iconSolid: Cog6ToothIconSolid, 
      label: 'Settings',
      ariaLabel: 'Navigate to Settings and Preferences',
      badge: null
    }
  ];

  // 🎨 HANDLE NAVIGATION WITH HAPTIC FEEDBACK (if supported)
  const handleNavigation = (sectionId) => {
    // Haptic feedback for iOS devices
    if (navigator.vibrate) {
      navigator.vibrate(10);
    }
    
    // Call the parent navigation function
    setCurrentSection(sectionId);
    
    // Analytics tracking (optional)
    if (window.gtag) {
      window.gtag('event', 'navigation', {
        event_category: 'mobile_nav',
        event_label: sectionId
      });
    }
  };

  return (
    <>
      {/* 📱 MAIN BOTTOM NAVIGATION - ENHANCED VERSION */}
      <nav 
        className="mobile-bottom-nav fixed bottom-0 left-0 right-0 z-50 bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg border-t-2 border-purple-200/30 dark:border-purple-700/30 shadow-2xl"
        role="navigation"
        aria-label="Main mobile navigation"
      >
        {/* 🌟 ENHANCED GRID WITH BETTER SPACING */}
        <div className="grid grid-cols-5 h-16 sm:h-18 safe-area-bottom">
          {bottomNavItems.map((item, index) => {
            const isActive = currentSection === item.id;
            const IconComponent = isActive ? item.iconSolid : item.icon;
            
            return (
              <button
                key={item.id}
                onClick={() => handleNavigation(item.id)}
                className={`
                  relative flex flex-col items-center justify-center px-1 py-2 
                  transition-all duration-300 ease-out
                  min-h-[64px] min-w-[48px]
                  ${isActive
                    ? 'text-purple-600 dark:text-purple-400 bg-purple-50/80 dark:bg-purple-900/30 scale-105' 
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100/50 dark:hover:bg-gray-800/50'
                  }
                  active:scale-95 active:bg-purple-100 dark:active:bg-purple-800/40
                  focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50
                  rounded-lg mx-1
                `}
                aria-label={item.ariaLabel}
                aria-current={isActive ? 'page' : undefined}
                style={{ 
                  minHeight: '64px',  // ✅ ACCESSIBILITY: 48px+ touch target
                  minWidth: '48px',
                  WebkitTapHighlightColor: 'transparent'  // Remove iOS blue highlight
                }}
              >
                {/* 🔔 NOTIFICATION BADGE (if any) */}
                {item.badge && (
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center animate-pulse">
                    {item.badge > 99 ? '99+' : item.badge}
                  </div>
                )}

                {/* 🎯 ENHANCED ICON WITH BETTER SIZING */}
                <IconComponent 
                  className={`
                    w-7 h-7 mb-1 transition-all duration-200
                    ${isActive ? 'scale-110' : 'scale-100'}
                  `} 
                />
                
                {/* 🏷️ LABEL WITH BETTER TYPOGRAPHY */}
                <span 
                  className={`
                    text-xs font-medium transition-all duration-200 leading-tight
                    ${isActive ? 'font-semibold scale-105' : 'font-normal'}
                  `}
                >
                  {item.label}
                </span>
                
                {/* ✨ ACTIVE INDICATOR BAR */}
                {isActive && (
                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-gradient-to-r from-purple-500 to-purple-600 rounded-t-full animate-pulse" />
                )}

                {/* 🌊 RIPPLE EFFECT ON CLICK */}
                <div className="absolute inset-0 rounded-lg overflow-hidden">
                  <div className={`
                    absolute inset-0 bg-purple-400 opacity-0 transform scale-0 rounded-full
                    transition-all duration-300 pointer-events-none
                    ${isActive ? 'animate-ping' : ''}
                  `} />
                </div>
              </button>
            );
          })}
        </div>

        {/* 📊 OPTIONAL: Mini stats bar (can be toggled) */}
        {userStats && (
          <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 px-3 py-1 bg-gradient-to-r from-purple-600 to-blue-600 text-white text-xs rounded-full shadow-lg opacity-90">
            {userStats.threatsStopped || 0} threats blocked
          </div>
        )}
      </nav>

      {/* 📱 SAFE AREA BOTTOM PADDING FOR iPHONE */}
      <div className="h-safe-area-bottom bg-white dark:bg-gray-900 fixed bottom-0 left-0 right-0 -z-10" />
    </>
  );
};

export default MobileBottomNav;
