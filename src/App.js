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

// Voice Control Component
import VoiceControlPanel from './components/VoiceControl/VoiceControlPanel';

// Hooks
import { useAuth } from './hooks/useAuth';
import { useResponsive } from './hooks/useResponsive';

// UI Components - FIXED IMPORT
import { NotificationProvider } from './components/UI/NotificationToast';

// Add this after your imports and before the App component
const APP_VERSION = process.env.REACT_APP_BUILD_TIME || '1.0.0';

const checkForUpdates = () => {
  const currentVersion = localStorage.getItem('xist_app_version');
  if (currentVersion && currentVersion !== APP_VERSION) {
    console.log('🔄 App version updated, clearing caches...');
    
    // Clear all caches
    if ('caches' in window) {
      caches.keys().then(names => {
        names.forEach(name => {
          console.log('🗑️ Deleting cache:', name);
          caches.delete(name);
        });
      });
    }
    
    // Clear localStorage cache indicators
    localStorage.removeItem('xist_cache_version');
    localStorage.setItem('xist_app_version', APP_VERSION);
    
    // Reload without cache
    setTimeout(() => {
      window.location.reload(true);
    }, 1000);
  } else {
    localStorage.setItem('xist_app_version', APP_VERSION);
  }
};

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

  // Analysis data management for Analytics section
  const [analysisHistory, setAnalysisHistory] = useState([]);
  const [analysisResult, setAnalysisResult] = useState(null);

  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('xist-theme');
    return saved || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  });

  // Device detection
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);

  // Analysis Collection Function
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
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <NotificationProvider>
        <div className={`app min-h-screen transition-colors duration-300 ${
          theme === 'dark' ? 'dark bg-slate-900' : 'bg-slate-50'
        }`}>
          
          {/* Top Navigation */}
          <TopNavigation
            user={user}
            userStats={userStats}
            currentSection={currentSection}
            setCurrentSection={setCurrentSection}
            mobileMenuOpen={mobileMenuOpen}
            setMobileMenuOpen={setMobileMenuOpen}
            login={login}
            logout={logout}
            theme={theme}
            setTheme={setTheme}
            isMobile={isMobile}
            setShowVoiceControl={setShowVoiceControl}
            showVoiceControl={showVoiceControl}
          />

          {/* Main Layout */}
          <div className="flex relative">
            
            {/* Desktop Sidebar */}
            {!isMobile && (
              <DesktopSidebar
                user={user}
                userStats={userStats}
                currentSection={currentSection}
                setCurrentSection={setCurrentSection}
                collapsed={sidebarCollapsed}
                setCollapsed={setSidebarCollapsed}
                theme={theme}
              />
            )}

            {/* Main Content Area */}
            <main className={`flex-1 transition-all duration-300 ${
              !isMobile && !sidebarCollapsed ? 'ml-64' : !isMobile ? 'ml-16' : 'ml-0'
            } ${isMobile ? 'pb-20' : 'pb-4'}`}>
              
              <div className="container mx-auto px-4 py-6">
                <SectionRouter
                  currentSection={currentSection}
                  setCurrentSection={setCurrentSection}
                  user={user}
                  userStats={userStats}
                  updateUserStats={handleUpdateUserStats}
                  analysisHistory={analysisHistory}
                  analysisResult={analysisResult}
                  onAnalysisComplete={handleAnalysisComplete}
                  globalSettings={globalSettings}
                  updateGlobalSettings={updateGlobalSettings}
                  theme={theme}
                  setTheme={setTheme}
                  isMobile={isMobile}
                  isTablet={isTablet}
                />
              </div>

              {/* Footer */}
              {!isMobile && (
                <Footer
                  currentSection={currentSection}
                  setCurrentSection={setCurrentSection}
                  theme={theme}
                />
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

          {/* Voice Control Panel */}
          {showVoiceControl && (
            <VoiceControlPanel
              isOpen={showVoiceControl}
              onClose={() => setShowVoiceControl(false)}
              onSectionChange={setCurrentSection}
              theme={theme}
              user={user}
            />
          )}

          {/* Global Toast Notifications */}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: theme === 'dark' ? '#1e293b' : '#ffffff',
                color: theme === 'dark' ? '#f1f5f9' : '#0f172a',
                border: `1px solid ${theme === 'dark' ? '#334155' : '#e2e8f0'}`,
                fontSize: '14px',
                fontWeight: '500',
                borderRadius: '8px',
                boxShadow: theme === 'dark' 
                  ? '0 10px 25px rgba(0, 0, 0, 0.3)' 
                  : '0 10px 25px rgba(0, 0, 0, 0.1)',
              },
              success: {
                iconTheme: {
                  primary: '#10b981',
                  secondary: theme === 'dark' ? '#1e293b' : '#ffffff',
                },
                style: {
                  border: '1px solid #10b981',
                },
              },
              error: {
                iconTheme: {
                  primary: '#ef4444',
                  secondary: theme === 'dark' ? '#1e293b' : '#ffffff',
                },
                style: {
                  border: '1px solid #ef4444',
                },
              },
              loading: {
                iconTheme: {
                  primary: '#3b82f6',
                  secondary: theme === 'dark' ? '#1e293b' : '#ffffff',
                },
                style: {
                  border: '1px solid #3b82f6',
                },
              },
            }}
          />
          
        </div>
      </NotificationProvider>
    </ErrorBoundary>
  );
};

export default App;
