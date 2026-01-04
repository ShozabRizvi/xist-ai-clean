import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  HomeIcon, ShieldCheckIcon, BookOpenIcon, UsersIcon, ChartBarIcon, 
  ShieldExclamationIcon, Cog6ToothIcon, InformationCircleIcon, PhoneIcon, 
  QuestionMarkCircleIcon, CodeBracketIcon, HeartIcon, ScaleIcon, 
  ChevronLeftIcon, ChevronRightIcon 
} from '@heroicons/react/24/outline';

// USER AVATAR COMPONENT WITH IMPROVED SIZING
const UserAvatar = ({ user, size = 'md', className = '' }) => {
  const sizeClasses = {
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-base',
    lg: 'w-12 h-12 text-lg',
    xl: 'w-16 h-16 text-xl'
  };

  const getInitials = (user) => {
    if (user?.displayName) {
      return user.displayName
        .split(' ')
        .map(name => name[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
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

  // Check if user has a profile photo
  const hasPhoto = user?.photoURL && user.photoURL !== '';

  if (hasPhoto) {
    return (
      <div className={`relative ${className}`}>
        <img
          src={user.photoURL}
          alt={user.displayName || user.email || 'User'}
          className={`${sizeClasses[size]} rounded-full object-cover border-2 border-white shadow-lg`}
          onError={(e) => {
            // Fallback to initials if image fails to load
            e.target.style.display = 'none';
            e.target.nextSibling.style.display = 'flex';
          }}
        />
        <div 
          className={`${sizeClasses[size]} rounded-full ${getAvatarColor(user)} text-white font-semibold flex items-center justify-center shadow-lg absolute inset-0 hidden`}
        >
          {getInitials(user)}
        </div>
      </div>
    );
  }

  return (
    <div className={`${sizeClasses[size]} rounded-full ${getAvatarColor(user)} text-white font-semibold flex items-center justify-center shadow-lg ${className}`}>
      {getInitials(user)}
    </div>
  );
};

const DesktopSidebar = ({ currentSection, setCurrentSection, user, userStats, collapsed, setCollapsed }) => {
  const navigationItems = [
    { id: 'home', icon: HomeIcon, label: 'Home', description: 'Dashboard & Overview' },
    { id: 'verify', icon: ShieldCheckIcon, label: 'Verify', description: 'AI Threat Analysis' },
    { id: 'education', icon: BookOpenIcon, label: 'Education', description: 'Safety Learning' },
    { id: 'community', icon: UsersIcon, label: 'Community', description: 'Social Network' },
    { id: 'protection', icon: ShieldExclamationIcon, label: 'Helpline', description: 'Security Center' },
    { id: 'analytics', icon: ChartBarIcon, label: 'Analytics', description: 'Usage Statistics' },
    { id: 'contact', icon: PhoneIcon, label: 'Contact', description: 'Get in Touch' },
    { id: 'support', icon: QuestionMarkCircleIcon, label: 'Support', description: 'Help & FAQs' },
    //{ id: 'authority', icon: ScaleIcon, label: 'Authority', description: 'Admin Panel' },
    { id: 'about', icon: InformationCircleIcon, label: 'About', description: 'Company Info' },
    { id: 'settings', icon: Cog6ToothIcon, label: 'Settings', description: 'Preferences' },
    //{ id: 'api', icon: CodeBracketIcon, label: 'API', description: 'API Management' },
    //{ id: 'health', icon: HeartIcon, label: 'Health', description: 'System Monitor' },
    
  ];

  return (
    <motion.div
  initial={false}
  animate={{ 
    width: collapsed ? '60px' : '280px',
    x: 0
  }}
  transition={{ 
    duration: 0.3, 
    ease: 'easeInOut' 
  }}
  className={`desktop-sidebar bg-white dark:bg-gray-800 flex flex-col fixed top-16 left-0 h-screen-minus-nav border-r border-gray-200 dark:border-gray-700 z-40 ${collapsed ? 'collapsed' : 'expanded'}`}
>




      {/* Simple Collapse Toggle */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <motion.button
          onClick={() => setCollapsed(!collapsed)}
          className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? (
            <ChevronRightIcon className="w-5 h-5" />
          ) : (
            <ChevronLeftIcon className="w-5 h-5" />
          )}
        </motion.button>
      </div>

      {/* NAVIGATION ITEMS - FULLY ANIMATED */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {navigationItems.map((item, index) => {
  const IconComponent = item.icon;
  const isActive = currentSection === item.id;

  return (
    <button
      key={item.id}
      onClick={() => setCurrentSection(item.id)}
      className={`w-full flex items-center rounded-lg group relative overflow-hidden transition-all duration-200
          ${isActive ? "bg-gradient-to-r from-cyan-500 to-purple-600 text-white shadow-lg" : "text-gray-300 hover:text-white hover:bg-purple-800/20"}
          ${collapsed ? "justify-center px-2 py-3" : "px-3 py-3 space-x-3"}
        `}
      title={collapsed ? `${item.label}` : ""}
    >
      {/* Icon only when collapsed */}
      <IconComponent className={`flex-shrink-0 ${collapsed ? "w-5 h-5" : "w-6 h-6"}`} />
      {/* Text only when expanded */}
      {!collapsed && (
        <div className="flex-1 min-w-0 text-left">
          <div className="font-medium truncate">{item.label}</div>
          <div className="text-xs opacity-70 truncate">{item.description}</div>
        </div>
      )}
      {/* Active indicator (optional) */}
      {isActive && !collapsed && (
        <div className="absolute right-0 top-0 bottom-0 w-1 bg-white rounded-l-full" />
      )}
    </button>
  );
})}

      </nav>

      {/* USER SECTION - SMART PROFILE DISPLAY */}
      {!collapsed && (
  <motion.div 
    className="p-4 border-t border-gray-200 dark:border-gray-700"
    layout
  >
    <motion.div 
      className="flex items-center pl-4"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="text-sm font-medium text-gray-900 dark:text-white truncate">
        {user?.displayName || user?.email?.split('@')[0] || 'User'}
      </div>
    </motion.div>

    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.2, delay: 0.1 }}
      className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700"
    >
      <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
        <div className="text-center">
          <div className="font-semibold text-purple-600 dark:text-purple-400">
            {userStats?.totalAnalyses || 0}
          </div>
          <div>Analyses</div>
        </div>
        <div className="text-center">
          <div className="font-semibold text-blue-600 dark:text-blue-400">
            {userStats?.threatsDetected || 0}
          </div>
          <div>Threats</div>
        </div>
        <div className="text-center">
          <div className="font-semibold text-green-600 dark:text-green-400">
            {Math.floor((userStats?.totalAnalyses || 0) / 7) || 0}
          </div>
          <div>Days</div>
        </div>
      </div>
    </motion.div>
  </motion.div>
)}

    </motion.div>
  );
};

export default DesktopSidebar;
