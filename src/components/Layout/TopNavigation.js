import React, { useState, useEffect } from 'react';
import { HomeIcon, ShieldCheckIcon, BookOpenIcon, UsersIcon, ChartBarIcon, ShieldExclamationIcon, Cog6ToothIcon, InformationCircleIcon, PhoneIcon, QuestionMarkCircleIcon, SunIcon, MoonIcon, UserCircleIcon, ArrowRightOnRectangleIcon, Bars3Icon, WifiIcon, CogIcon, QrCodeIcon, ShareIcon, XMarkIcon, BoltIcon } from '@heroicons/react/24/outline';
import { useResponsive } from '../../hooks/useResponsive';
import { AVATAR_OPTIONS } from '../Sections/SettingsSection';

const TopNavigation = ({ user, identity, userStats, login, logout, theme, setTheme, currentSection, setCurrentSection, mobileMenuOpen, setMobileMenuOpen }) => {
  const { screenSize } = useResponsive();
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [networkSpeed, setNetworkSpeed] = useState('4g');
  const [showQRPopup, setShowQRPopup] = useState(false);

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

  // Assuming max scans is 20, and userStats provides the remaining scans.
  const scansRemaining = userStats?.scansLeft ?? 20;

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
          <div className="relative flex items-center justify-between h-16">
            <div className="flex items-center flex-shrink-0 space-x-4">
              <div className="flex items-center space-x-2 flex-shrink-0">
                <img src="/logo.png" alt="Logo" className="w-8 h-8 object-contain" />
                <div className="hidden sm:block"><h1 className="text-lg font-bold text-white">Xist AI</h1></div>
              </div>
            </div>

            <div className="hidden md:flex items-center justify-center flex-1 space-x-1">
              {navigationItems.map(({ id, icon: IconComponent, label }) => (
                <button key={id} onClick={() => setCurrentSection(id)} className={`flex items-center space-x-2 px-3 py-2 rounded-md font-medium transition-colors ${currentSection === id ? 'bg-indigo-700 text-white' : 'text-gray-400 hover:text-white hover:bg-indigo-600'}`}>
                  <IconComponent className="w-4 h-4" /> <span className="text-sm">{label}</span>
                </button>
              ))}
            </div>

            <div className="flex items-center space-x-2">
              
              {/* ✅ NEW SCAN LIMIT TRACKER INJECTED HERE */}
              {user && (
                <div className="flex flex-col items-center justify-center mr-1">
                  <div className={`flex items-center space-x-1 px-2 py-1 rounded-md border ${scansRemaining <= 5 ? 'bg-red-500/20 border-red-500/50' : 'bg-white/10 border-white/20'}`}>
                    <BoltIcon className={`w-3.5 h-3.5 ${scansRemaining <= 5 ? 'text-red-400 animate-pulse' : 'text-yellow-400'}`} />
                    <span className="text-[10px] sm:text-xs font-bold text-white">
                      {scansRemaining}/20 <span className="hidden sm:inline">Scans</span>
                    </span>
                  </div>
                  {/* Reset time is hidden on mobile to save space, visible on tablet/desktop */}
                  <span className="text-[8px] text-gray-300 mt-0.5 hidden sm:block">Resets ~1:30 PM IST</span>
                </div>
              )}

              <button onClick={() => setShowQRPopup(true)} className="p-2 rounded-md hover:bg-indigo-600 transition-colors"><QrCodeIcon className="w-5 h-5 text-gray-300" /></button>
              
              <button onClick={toggleTheme} className="p-2 rounded-md hover:bg-indigo-600 transition-colors">
                {theme === 'dark' ? <SunIcon className="w-5 h-5 text-gray-300" /> : <MoonIcon className="w-5 h-5 text-gray-300" />}
              </button>

              {user ? (
                <div className="flex items-center space-x-3 bg-white/5 px-3 py-1.5 rounded-xl border border-white/10">
                  <div className="text-right hidden sm:block">
                    <p className="text-[9px] font-black uppercase tracking-widest text-indigo-300 mb-0.5">Operator_Active</p>
                    <p className="text-xs font-bold text-white uppercase font-mono">{identity?.alias || 'Unknown'}</p>
                  </div>
                  <div className="w-9 h-9 rounded-lg bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center">
                    <ActiveIcon className="w-5 h-5 text-indigo-400" />
                  </div>
                  <div className="w-px h-6 bg-white/10 mx-1"></div>
                  <button onClick={logout} className="p-1.5 rounded-md hover:bg-rose-500/20 hover:text-rose-400 transition-colors">
                    <ArrowRightOnRectangleIcon className="w-5 h-5 text-gray-300 hover:text-rose-400" />
                  </button>
                </div>
              ) : (
                <button onClick={login} className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white px-4 py-2 rounded-md text-sm">Sign In</button>
              )}
              
              <button onClick={() => setCurrentSection('settings')} className="p-2 rounded-md hover:bg-indigo-600"><CogIcon className="w-5 h-5 text-gray-300" /></button>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default TopNavigation;