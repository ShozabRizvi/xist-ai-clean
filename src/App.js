import React, { useState, useEffect, useCallback } from 'react';
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

// UI Components
import { NotificationProvider } from './components/UI/NotificationToast';

const APP_VERSION = process.env.REACT_APP_BUILD_TIME || '1.0.0';

const checkForUpdates = () => {
  const currentVersion = localStorage.getItem('xist_app_version');
  if (currentVersion && currentVersion !== APP_VERSION) {
    console.log('🔄 App version updated, clearing caches...');
    if ('caches' in window) {
      caches.keys().then(names => {
        names.forEach(name => {
          caches.delete(name);
        });
      });
    }
    localStorage.removeItem('xist_cache_version');
    localStorage.setItem('xist_app_version', APP_VERSION);
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

  // ==========================================
  // GLOBAL SETTINGS & IDENTITY STATE (FIXED)
  // ==========================================
  const [globalSettings, setGlobalSettings] = useState(() => {
    // Attempt to load saved identity on boot so it survives page refreshes
    const savedIdentity = localStorage.getItem('xist_operator_identity');
    const parsedIdentity = savedIdentity ? JSON.parse(savedIdentity) : null;
    
    return {
      theme: localStorage.getItem('xist-theme') || 'system',
      fontSize: 'medium',
      language: 'en',
      identity: parsedIdentity || {
        alias: user?.displayName || 'Unknown Node', 
        avatar: 'ghost' 
      }
    };
  });

  const [theme, setTheme] = useState(globalSettings.theme);

  // Unified function to update settings globally
  const updateGlobalSettings = (newSettings) => {
    setGlobalSettings(prev => {
      const updated = {
        ...prev,
        ...newSettings,
        identity: newSettings.identity || prev.identity
      };
      
      // Save identity to local storage
      if (newSettings.identity) {
        localStorage.setItem('xist_operator_identity', JSON.stringify(newSettings.identity));
      }
      return updated;
    });
    
    if (newSettings.theme) {
      setTheme(newSettings.theme);
    }
  };

  // ==========================================
  // UI & ANALYSIS STATE
  // ==========================================
  const [currentSection, setCurrentSection] = useState('home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showVoiceControl, setShowVoiceControl] = useState(false);
  
  const [analysisHistory, setAnalysisHistory] = useState([]);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);

  const handleAnalysisComplete = useCallback((analysisData) => {
    setAnalysisHistory(prev => [
      {
        ...analysisData,
        analysisId: `analysis_${Date.now()}`,
        timestamp: new Date().toISOString()
      },
      ...prev.slice(0, 49) // Keep last 50 analyses
    ]);
    setAnalysisResult(analysisData);
  }, []);

  // Theme Management Effect
  useEffect(() => {
    const root = document.documentElement;
    const body = document.body;
    
    // Clear both initially
    root.classList.remove('dark');
    body.classList.remove('dark');

    if (theme === 'dark') {
      root.classList.add('dark');
      body.classList.add('dark');
      body.style.backgroundColor = '#0f172a';
    } else if (theme === 'light') {
      body.style.backgroundColor = '#f8fafc';
    } else {
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        root.classList.add('dark');
        body.classList.add('dark');
        body.style.backgroundColor = '#0f172a';
      } else {
        body.style.backgroundColor = '#f8fafc';
      }
    }
    localStorage.setItem('xist-theme', theme);
  }, [theme]);

  // Font Size Effect
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
  }, [globalSettings.fontSize]);

  // Device Detection Effect
  useEffect(() => {
    const checkDevice = () => {
      const width = window.innerWidth;
      setIsMobile(width < 768);
      setIsTablet(width >= 768 && width < 1024);
      if (width >= 768) setMobileMenuOpen(false);
    };
    checkDevice();
    window.addEventListener('resize', checkDevice);
    return () => window.removeEventListener('resize', checkDevice);
  }, []);

  // Scroll Behavior
  useEffect(() => {
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    setTimeout(() => {
      window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
    }, 50);
  }, [currentSection]);

  const handleUpdateUserStats = async (newStats) => {
    try {
      if (updateUserStats) {
        updateUserStats({ ...userStats, ...newStats });
      }
    } catch (error) {
      console.error('Failed to update user stats:', error);
    }
  };

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
        <div className={`app min-h-screen transition-colors duration-300 ${theme === 'dark' ? 'dark bg-slate-900' : 'bg-slate-50'}`}>
          
          <TopNavigation
            user={user}
            identity={globalSettings.identity} // ✅ Passed Identity Prop
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

          <div className="flex relative">
            {!isMobile && (
              <DesktopSidebar
                user={user}
                identity={globalSettings.identity} // ✅ Passed Identity Prop
                userStats={userStats}
                currentSection={currentSection}
                setCurrentSection={setCurrentSection}
                collapsed={sidebarCollapsed}
                setCollapsed={setSidebarCollapsed}
                theme={theme}
              />
            )}

            <main className={`flex-1 transition-all duration-300 ${!isMobile && !sidebarCollapsed ? 'ml-64' : !isMobile ? 'ml-16' : 'ml-0'} ${isMobile ? 'pb-20' : 'pb-4'}`}>
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
                  updateGlobalSettings={updateGlobalSettings} // ✅ Passed Update Function
                  theme={theme}
                  setTheme={setTheme}
                  isMobile={isMobile}
                  isTablet={isTablet}
                />
              </div>
              {!isMobile && <Footer currentSection={currentSection} setCurrentSection={setCurrentSection} theme={theme} />}
            </main>
          </div>

          {isMobile && <MobileBottomNav currentSection={currentSection} setCurrentSection={setCurrentSection} user={user} theme={theme} />}
          
          {showVoiceControl && (
            <VoiceControlPanel isOpen={showVoiceControl} onClose={() => setShowVoiceControl(false)} onSectionChange={setCurrentSection} theme={theme} user={user} />
          )}

          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: theme === 'dark' ? '#1e293b' : '#ffffff',
                color: theme === 'dark' ? '#f1f5f9' : '#0f172a',
                border: `1px solid ${theme === 'dark' ? '#334155' : '#e2e8f0'}`,
                fontSize: '14px', fontWeight: '500', borderRadius: '8px',
                boxShadow: theme === 'dark' ? '0 10px 25px rgba(0, 0, 0, 0.3)' : '0 10px 25px rgba(0, 0, 0, 0.1)',
              }
            }}
          />
        </div>
      </NotificationProvider>
    </ErrorBoundary>
  );
};

export default App;