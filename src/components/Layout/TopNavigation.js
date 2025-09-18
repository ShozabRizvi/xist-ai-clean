import React, { useState, useEffect } from 'react';
import {
  HomeIcon,
  ShieldCheckIcon,
  BookOpenIcon,
  UsersIcon,
  ChartBarIcon,
  ShieldExclamationIcon,
  Cog6ToothIcon,
  InformationCircleIcon,
  PhoneIcon,
  QuestionMarkCircleIcon,
  CodeBracketIcon,
  HeartIcon,
  ScaleIcon,
  SunIcon,
  MoonIcon,
  UserCircleIcon,
  ArrowRightOnRectangleIcon,
  Bars3Icon,
  WifiIcon,
  CogIcon,
  ChatBubbleLeftRightIcon,
  CommandLineIcon,
  DocumentTextIcon,
  BellIcon,
  QrCodeIcon, 
  ShareIcon, 
  XMarkIcon ,
  ShieldCheckIcon as ProtectionIcon
} from '@heroicons/react/24/outline';
import { useResponsive } from '../../hooks/useResponsive';

const TopNavigation = ({
  user,
  userStats,
  login,
  logout,
  theme,
  setTheme,
  currentSection,
  setCurrentSection,
  mobileMenuOpen,
  setMobileMenuOpen
}) => {
  const { screenSize } = useResponsive();
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [networkSpeed, setNetworkSpeed] = useState('4g');
  
  // ✨ ONLY ADDITION: QR popup state
  const [showQRPopup, setShowQRPopup] = useState(false);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Network speed detection
    const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    if (connection) {
      setNetworkSpeed(connection.effectiveType || '4g');
      connection.addEventListener('change', () => {
        setNetworkSpeed(connection.effectiveType || '4g');
      });
    }

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
    { id: 'protection', icon: ShieldExclamationIcon, label: 'Protection' }
  ];

  // 🚀 MOBILE-ONLY NAVIGATION ITEMS (Extra sections for hamburger menu)
  const mobileExtraItems = [
    { id: 'about', icon: InformationCircleIcon, label: 'About Xist AI', description: 'Learn about our mission' },
    { id: 'contact', icon: PhoneIcon, label: 'Contact Us', description: 'Get in touch with support' },
    { id: 'support', icon: QuestionMarkCircleIcon, label: 'Help & Support', description: 'Documentation and FAQs' }
  ];

  const handleMobileMenuClick = (sectionId) => {
    setCurrentSection(sectionId);
    setMobileMenuOpen(false); // Close menu after selection
  };

  return (
    <>
      {/* ✨ ONLY ADDITION: QR Code Popup */}
      {showQRPopup && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-sm w-full shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Share Xist AI</h3>
              <button
                onClick={() => setShowQRPopup(false)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
              >
                <XMarkIcon className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            
            <div className="text-center">
              <div className="bg-white p-4 rounded-xl mx-auto mb-4 w-48 h-48 flex items-center justify-center border">
                <img 
                  src="/qrcode.png" 
                  alt="QR Code" 
                  className="w-full h-full rounded-lg"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextElementSibling.style.display = 'flex';
                  }}
                />
                <div className="w-full h-full flex-col items-center justify-center text-gray-500 hidden">
                  <QrCodeIcon className="w-18 h-18 mb-2" />
                  <p className="text-sm">QR Code</p>
                </div>
              </div>
              
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Scan to access Xist AI Verify
              </p>
              
              <p className="text-xs text-gray-500 dark:text-gray-500 mb-6 break-all">
                {window.location.href}
              </p>

              <button
                onClick={() => {
                  if (navigator.share) {
                    navigator.share({
                      title: 'Xist AI Verify',
                      text: 'Advanced Threat Detection & Analysis',
                      url: window.location.href
                    });
                  } else {
                    navigator.clipboard.writeText(window.location.href);
                    alert('URL copied to clipboard!');
                  }
                }}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 px-4 rounded-xl hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
              >
                <ShareIcon className="w-5 h-5" />
                Share Link
              </button>
            </div>
          </div>
        </div>
      )}

      <nav className="bg-gradient-to-r from-indigo-900 to-purple-900 border-b border-indigo-800 sticky top-0 z-50 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
          <div className="relative flex items-center justify-between h-16">
            
            {/* Left section: Logo & Network Status */}
            <div className="flex items-center flex-shrink-0 space-x-4">
              {/* Logo */}
              <div className="flex items-center space-x-2 flex-shrink-0">
                <div className="flex items-center space-x-2">
                <img
                  src="/logo.png"
                  alt="Xist AI Logo"
                  className="w-8 h-8 object-contain"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
                {/* Fallback logo */}
                <div className="w-8 h-8 bg-gradient-to-r from-purple-400 to-indigo-400 rounded-lg flex items-center justify-center hidden">
                  <span className="text-white font-bold text-sm">V</span>
                </div>
                </div>
                <div className="hidden sm:block">
                  <h1 className="text-lg font-bold text-white">Xist AI</h1>
                  <p className="text-xs text-gray-300">Advanced Detection</p>
                </div>
              </div>

              {/* Network Status */}
              <div className="hidden lg:flex items-center space-x-2">
                <WifiIcon className={`w-4 h-4 ${isOnline ? 'text-green-400' : 'text-red-400'}`} />
                <span className="text-xs text-gray-300">
                  {isOnline ? `Secured (${networkSpeed.toUpperCase()})` : 'Offline'}
                </span>
              </div>
            </div>

            {/* Center - Navigation Items (Desktop Only) */}
            <div className="hidden md:flex items-center justify-center flex-1 space-x-1">
              {navigationItems.map(({ id, icon: IconComponent, label }) => (
                <button
                  key={id}
                  onClick={() => setCurrentSection(id)}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md font-medium focus:outline-none transition-colors duration-200 ${
                    currentSection === id
                      ? 'bg-indigo-700 text-white'
                      : 'text-gray-400 hover:text-white hover:bg-indigo-600'
                  }`}
                >
                  <IconComponent className="w-4 h-4" />
                  <span className="text-sm">{label}</span>
                </button>
              ))}
            </div>

            {/* Right section: User Controls */}
            <div className="flex items-center space-x-2">
              
              {/* ✨ ONLY ADDITION: QR Button */}
              <button
                onClick={() => setShowQRPopup(true)}
                className="p-2 rounded-md hover:bg-indigo-600 transition-colors"
                title="Share QR Code"
              >
                <QrCodeIcon className="w-5 h-5 text-gray-300" />
              </button>
              
              {/* Theme Toggle */}
              <button
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="p-2 rounded-md hover:bg-indigo-600 transition-colors"
                title="Toggle Theme"
              >
                {theme === 'dark' ? (
                  <SunIcon className="w-5 h-5 text-gray-300" />
                ) : (
                  <MoonIcon className="w-5 h-5 text-gray-300" />
                )}
              </button>

              {/* Network Status Mobile */}
              {isOnline && (
                <WifiIcon className="w-4 h-4 text-green-400 md:hidden" />
              )}

              {/* User Info & Avatar */}
              {user ? (
                <div className="flex items-center space-x-3">
                  {/* User Stats */}
                  <div className="hidden lg:block text-right">
                    <div className="text-xs text-gray-400">
                      Points: {userStats?.points || 15} | Level: {userStats?.level || 1}
                    </div>
                    <div className="text-sm font-medium text-white">
                      {user.displayName || 'Shozab Rizvi'}
                    </div>
                    <div className="text-xs text-purple-300">Newcomer</div>
                  </div>

                  {/* User Avatar */}
                  <div className="relative group">
                    {user.photoURL ? (
                      <>
                        <img
                          src={user.photoURL}
                          alt={user.displayName || user.email || 'User'}
                          className="w-10 h-10 rounded-full border-2 border-white/20 hover:border-purple-300 transition-all duration-200 cursor-pointer object-cover group-hover:scale-105 shadow-lg hover:shadow-xl"
                          onClick={() => {
                            console.log('Profile clicked');
                          }}
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.nextElementSibling.style.display = 'flex';
                          }}
                          loading="lazy"
                        />
                        <div className="absolute inset-0 rounded-full bg-black/0 group-hover:bg-black/10 transition-all duration-200"></div>
                      </>
                    ) : null}
                    
                    {/* Fallback gradient circle */}
                    <div 
                      className={`w-10 h-10 rounded-full bg-gradient-to-r from-purple-400 to-indigo-400 flex items-center justify-center cursor-pointer group-hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl hover:from-purple-500 hover:to-indigo-500 ${
                        user.photoURL ? 'hidden' : 'flex'
                      }`}
                      onClick={() => {
                        console.log('Profile clicked');
                      }}
                    >
                      <span className="text-sm font-bold text-white">
                        {(user.displayName || user.email || 'SR')[0].toUpperCase()}
                      </span>
                    </div>
                    
                    {/* Online status indicator */}
                    <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 border-2 border-white rounded-full"></div>
                  </div>

                  {/* Logout Button */}
                  <button
                    onClick={logout}
                    className="p-2 rounded-md hover:bg-indigo-600 transition-colors"
                    title="Logout"
                  >
                    <ArrowRightOnRectangleIcon className="w-5 h-5 text-gray-300" />
                  </button>
                </div>
              ) : (
                /* Login Button */
                <button
                  onClick={login}
                  className="bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white px-4 py-2 rounded-md font-medium text-sm transition-all duration-200 flex items-center space-x-2"
                >
                  <UserCircleIcon className="w-4 h-4" />
                  <span>Sign In</span>
                </button>
              )}

              {/* Settings */}
              <button
                onClick={() => setCurrentSection('settings')}
                className="p-2 rounded-md hover:bg-indigo-600 transition-colors"
                title="Settings"
              >
                <CogIcon className="w-5 h-5 text-gray-300" />
              </button>

              {/* Mobile Menu Toggle - ONLY VISIBLE ON MOBILE */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-md hover:bg-indigo-600 transition-colors md:hidden"
                title="Toggle Menu"
              >
                {mobileMenuOpen ? (
                  <XMarkIcon className="w-5 h-5 text-gray-300" />
                ) : (
                  <Bars3Icon className="w-5 h-5 text-gray-300" />
                )}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* 🚀🚀 MOBILE HAMBURGER MENU DROPDOWN 🚀🚀 */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-gradient-to-b from-indigo-900 to-purple-900 border-b border-indigo-800 shadow-xl">
          <div className="px-2 pt-2 pb-3 space-y-1">
            
            {/* Main Navigation Items */}
            <div className="space-y-1">
              <div className="px-3 py-2">
                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Navigation</h3>
              </div>
              {navigationItems.map(({ id, icon: IconComponent, label }) => (
                <button
                  key={id}
                  onClick={() => handleMobileMenuClick(id)}
                  className={`w-full flex items-center space-x-3 px-3 py-3 rounded-md font-medium transition-colors duration-200 ${
                    currentSection === id
                      ? 'bg-indigo-700 text-white'
                      : 'text-gray-300 hover:text-white hover:bg-indigo-600'
                  }`}
                >
                  <IconComponent className="w-5 h-5" />
                  <span className="text-sm">{label}</span>
                </button>
              ))}
            </div>

            {/* Divider */}
            <div className="border-t border-indigo-700 my-3"></div>

            {/* ✨ ONLY ADDITION: QR Button in Mobile Menu */}
            <div className="space-y-1">
              <button
                onClick={() => {
                  setShowQRPopup(true);
                  setMobileMenuOpen(false);
                }}
                className="w-full flex items-center space-x-3 px-3 py-3 rounded-md font-medium text-gray-300 hover:text-white hover:bg-indigo-600 transition-colors duration-200"
              >
                <QrCodeIcon className="w-5 h-5" />
                <div className="text-left">
                  <div className="text-sm font-medium">Share QR Code</div>
                  <div className="text-xs text-gray-400">Share Xist AI with others</div>
                </div>
              </button>
            </div>

            {/* Divider */}
            <div className="border-t border-indigo-700 my-3"></div>

            {/* Extra Mobile-Only Items */}
            <div className="space-y-1">
              <div className="px-3 py-2">
                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">More</h3>
              </div>
              {mobileExtraItems.map(({ id, icon: IconComponent, label, description }) => (
                <button
                  key={id}
                  onClick={() => handleMobileMenuClick(id)}
                  className={`w-full flex items-start space-x-3 px-3 py-3 rounded-md transition-colors duration-200 ${
                    currentSection === id
                      ? 'bg-indigo-700 text-white'
                      : 'text-gray-300 hover:text-white hover:bg-indigo-600'
                  }`}
                >
                  <IconComponent className="w-5 h-5 mt-0.5 flex-shrink-0" />
                  <div className="text-left">
                    <div className="text-sm font-medium">{label}</div>
                    <div className="text-xs text-gray-400">{description}</div>
                  </div>
                </button>
              ))}
            </div>

            {/* Divider */}
            <div className="border-t border-indigo-700 my-3"></div>

            {/* User Profile Section (Mobile) */}
            {user && (
              <div className="px-3 py-3 bg-indigo-800 rounded-md">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-400 to-indigo-400 flex items-center justify-center">
                    <span className="text-sm font-bold text-white">
                      {(user.displayName || user.email || 'SR')[0].toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-white">
                      {user.displayName || 'Shozab Rizvi'}
                    </div>
                    <div className="text-xs text-purple-300">
                      Level {userStats?.level || 1} • {userStats?.points || 15} Points
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* App Info */}
            <div className="px-3 py-2 text-center">
              <div className="text-xs text-gray-500">
                Xist AI v1.0 • {isOnline ? 'Online' : 'Offline'}
              </div>
            </div>
          </div>
        </div>
      )}
      
    </>
  );
};

export default TopNavigation;
