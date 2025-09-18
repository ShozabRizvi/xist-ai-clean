import React, { useState, useEffect } from 'react';
import { Toaster } from 'react-hot-toast';

// Import i18n
import './i18n/i18n';

// Layout Components
import TopNavigation from './components/Layout/TopNavigation';
import DesktopSidebar from './components/Layout/DesktopSidebar';
import MobileBottomNav from './components/Layout/MobileBottomNav';
import SectionRouter from './components/Sections/SectionRouter';
import LoadingSpinner from './components/UI/LoadingSpinner';
import ErrorBoundary from './components/Common/ErrorBoundary';
import Footer from './components/Layout/Footer';

// Voice Control Component - FIXED PATH
import VoiceControlPanel from './components/VoiceControl/VoiceControlPanel';

// Hooks
import { useAuth } from './hooks/useAuth';
import { useResponsive } from './hooks/useResponsive';

// UI Components
import { NotificationToast, NotificationProvider } from './components/UI/NotificationToast';

const App = () => {
  // Auth and user management
  const { user, userStats, loading, login, logout, updateUserStats } = useAuth();
  const { screenSize } = useResponsive();

  // GLOBAL THEME AND SETTINGS STATE MANAGEMENT
  const [globalSettings, setGlobalSettings] = useState({
    theme: 'system',
    fontSize: 'medium',
    language: 'en'
  });

  // UI State Management
  const [currentSection, setCurrentSection] = useState('home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showVoiceControl, setShowVoiceControl] = useState(false);

  // Analysis data management for Analytics section - FIXED!
  const [analysisHistory, setAnalysisHistory] = useState([]);
  const [analysisResult, setAnalysisResult] = useState(null);

  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('xist-theme');
    return saved || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  });

  // Device detection
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);

  // Analysis Collection Function - FIXED!
  const handleAnalysisComplete = React.useCallback((analysisData) => {
    // Add to analysis history
    setAnalysisHistory(prev => [
      {
        ...analysisData,
        analysisId: `analysis_${Date.now()}`,
        timestamp: new Date().toISOString()
      },
      ...prev.slice(0, 49) // Keep last 50 analyses
    ]);
    
    // Update current result
    setAnalysisResult(analysisData);
    
    console.log('Analysis data collected for analytics:', analysisData);
  }, []);

  // APPLY GLOBAL THEME CHANGES
  useEffect(() => {
    const root = document.documentElement;
    const body = document.body;

    if (globalSettings.theme === 'dark') {
      root.classList.add('dark');
      body.classList.add('dark');
    } else if (globalSettings.theme === 'light') {
      root.classList.remove('dark');
      body.classList.remove('dark');
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (prefersDark) {
        root.classList.add('dark');
        body.classList.add('dark');
      } else {
        root.classList.remove('dark');
        body.classList.remove('dark');
      }
    }
  }, [globalSettings.theme]);

  // APPLY GLOBAL FONT SIZE CHANGES
  useEffect(() => {
    const root = document.documentElement;

    switch (globalSettings.fontSize) {
      case 'small':
        root.style.setProperty('--app-font-size', '14px');
        root.style.setProperty('--app-font-scale', '0.875');
        break;
      case 'large':
        root.style.setProperty('--app-font-size', '18px');
        root.style.setProperty('--app-font-scale', '1.125');
        break;
      default:
        root.style.setProperty('--app-font-size', '16px');
        root.style.setProperty('--app-font-scale', '1');
    }

    root.className = root.className.replace(/font-size-\w+/g, '');
    root.classList.add(`font-size-${globalSettings.fontSize}`);
  }, [globalSettings.fontSize]);

  // FUNCTION TO UPDATE GLOBAL SETTINGS FROM SETTINGS COMPONENT
  const updateGlobalSettings = (newSettings) => {
    setGlobalSettings(newSettings);
    
    if (newSettings.theme) {
      setTheme(newSettings.theme);
    }
  };

  useEffect(() => {
    const checkDevice = () => {
      const width = window.innerWidth;
      setIsMobile(width < 768);
      setIsTablet(width >= 768 && width < 1024);
    };

    checkDevice();
    window.addEventListener('resize', checkDevice);

    return () => window.removeEventListener('resize', checkDevice);
  }, []);

  // Theme Management
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      document.body.style.backgroundColor = '#0f172a';
    } else {
      root.classList.remove('dark');
      document.body.style.backgroundColor = '#f8fafc';
    }
    localStorage.setItem('xist-theme', theme);
  }, [theme]);

  // Auto-close mobile menu on resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setMobileMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // User stats update handler
  const handleUpdateUserStats = async (newStats) => {
    try {
      const updatedStats = { ...userStats, ...newStats };
      console.log('Stats updated:', updatedStats);

      if (updateUserStats) {
        updateUserStats(updatedStats);
      }
    } catch (error) {
      console.error('Failed to update user stats:', error);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <NotificationProvider>
        <div className={`min-h-screen transition-colors duration-200 ${
          theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'
        }`}>
          
          {/* Top Navigation */}
          <TopNavigation
            user={user}
            userStats={userStats}
            login={login}
            logout={logout}
            theme={theme}
            setTheme={setTheme}
            currentSection={currentSection}
            setCurrentSection={setCurrentSection}
            mobileMenuOpen={mobileMenuOpen}
            setMobileMenuOpen={setMobileMenuOpen}
            sidebarCollapsed={sidebarCollapsed}
            setSidebarCollapsed={setSidebarCollapsed}
            isMobile={isMobile}
            isTablet={isTablet}
            showVoiceControl={showVoiceControl}
            setShowVoiceControl={setShowVoiceControl}
          />

          <div className="flex">
            {/* Desktop Sidebar */}
            {!isMobile && (
              <DesktopSidebar
                user={user}
                userStats={userStats}
                currentSection={currentSection}
                setCurrentSection={setCurrentSection}
                theme={theme}
                collapsed={sidebarCollapsed}
                setCollapsed={setSidebarCollapsed}
              />
            )}

            {/* Main Content */}
            <main className={`flex-1 transition-all duration-200 ${
              !isMobile && !sidebarCollapsed ? 'ml-64' : 
              !isMobile && sidebarCollapsed ? 'ml-16' : 'ml-0'
            } ${isMobile ? 'pb-16' : ''}`}>
              
              <SectionRouter
                currentSection={currentSection}
                setCurrentSection={setCurrentSection}
                user={user}
                userStats={userStats}
                onUpdateStats={handleUpdateUserStats}
                onAnalysisComplete={handleAnalysisComplete}  // FIXED!
                analysisHistory={analysisHistory}  // FIXED!
                theme={theme}
                globalSettings={globalSettings}
                updateGlobalSettings={updateGlobalSettings}
                logout={logout}
                isMobile={isMobile}
                setTheme={setTheme}
              />

              {/* Footer - Only on desktop and in certain sections */}
              {!isMobile && ['about', 'contact'].includes(currentSection) && (
                <Footer theme={theme} />
              )}
            </main>
          </div>

          {/* Mobile Bottom Navigation */}
          {isMobile && (
            <MobileBottomNav
              currentSection={currentSection}
              setCurrentSection={setCurrentSection}
              user={user}
              theme={theme}
            />
          )}

          {/* Voice Control Panel - Floating - FIXED JARVIS-LIKE UI! */}
          {showVoiceControl && (
            <div className="fixed inset-0 bg-black bg-opacity-80 z-50 flex items-center justify-center p-4">
              <div className="bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-cyan-400 shadow-2xl shadow-cyan-400/20">
                <div className="p-6">
                  <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 rounded-full bg-cyan-400 animate-pulse"></div>
                      <h2 className="text-2xl font-bold text-cyan-400 font-mono tracking-wide">
                        VANTA AI VOICE COMMAND CENTER
                      </h2>
                      <div className="w-3 h-3 rounded-full bg-cyan-400 animate-pulse"></div>
                    </div>
                    <button
                      onClick={() => setShowVoiceControl(false)}
                      className="p-2 hover:bg-cyan-400/20 rounded-lg text-cyan-400 hover:text-white transition-colors"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                  <VoiceControlPanel user={user} theme="dark" />
                </div>
              </div>
            </div>
          )}

          {/* Toast Notifications */}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: theme === 'dark' ? '#374151' : '#ffffff',
                color: theme === 'dark' ? '#f3f4f6' : '#111827',
                border: `1px solid ${theme === 'dark' ? '#4b5563' : '#e5e7eb'}`,
              },
            }}
          />
          
        </div>
      </NotificationProvider>
    </ErrorBoundary>
  );
};

export default App;
