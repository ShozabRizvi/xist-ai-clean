import React, { useState, useEffect, useCallback } from 'react';
import { Toaster } from 'react-hot-toast';

// Import i18n
import './i18n/i18n';
import { useTranslation } from 'react-i18next';

// Layout Components
import TopNavigation from './components/Layout/TopNavigation';
import DesktopSidebar from './components/Layout/DesktopSidebar';
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

// ✅ SUPABASE CONNECTION
import { supabase } from './lib/supabase';

const APP_VERSION = process.env.REACT_APP_BUILD_TIME || '1.1.0';

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

// ==========================================
// 🚀 NEW: FORENSIC HUD TARGETING GRIDS
// ==========================================
const GlobalCornerGrids = () => {
  const [hasAnimated, setHasAnimated] = useState(true);

  useEffect(() => {
    const played = sessionStorage.getItem('xist_grid_animated');
    if (!played) {
      setHasAnimated(false);
      sessionStorage.setItem('xist_grid_animated', 'true');
    }
  }, []);

  const spacing = 32;
  const center = 128;
  const size = 256;

  // 🚀 FIX: Dropped strokeWidth to 0.5 for an ultra-fine, delicate glass etching
  const lines = [
    { step: 0, opacity: 0.4, length: 1.0, strokeWidth: 1 },   // Center
    { step: 1, opacity: 0.25, length: 0.75, strokeWidth: 1 }, // 1st Outer
    { step: 2, opacity: 0.1, length: 0.5, strokeWidth: 1 },   // 2nd Outer
    { step: 3, opacity: 0.04, length: 0.25, strokeWidth: 1 }, // 3rd Outer
  ];

  const renderHUD = () => (
    <svg width="100%" height="100%" viewBox="0 0 256 256" className={!hasAnimated ? 'hud-container' : 'opacity-40'}>
      <defs>
        <radialGradient id="hud-fade" cx="50%" cy="50%" r="50%">
          <stop offset="50%" stopColor="white" stopOpacity="1" />
          <stop offset="100%" stopColor="white" stopOpacity="0" />
        </radialGradient>
      </defs>

      <g mask="url(#hud-fade)">
        {lines.map((line, i) => {
          const offset = line.step * spacing;
          const lengthPx = size * line.length;
          const start = center - (lengthPx / 2);
          const end = center + (lengthPx / 2);
          const animStyle = !hasAnimated ? { animationDelay: `${line.step * 0.15}s` } : { strokeDashoffset: 0 };

          return (
            <g key={i} className="text-indigo-600 dark:text-white/80">
              
              {/* 🚀 FIX: Vertical Lines have their opacity reduced by another 50% so they are barely visible */}
              <g opacity={line.opacity * 0.5}>
                <line x1={center + offset} y1={start} x2={center + offset} y2={end} stroke="currentColor" strokeWidth={line.strokeWidth} className={!hasAnimated ? "hud-line" : ""} style={animStyle} />
                {line.step > 0 && <line x1={center - offset} y1={start} x2={center - offset} y2={end} stroke="currentColor" strokeWidth={line.strokeWidth} className={!hasAnimated ? "hud-line" : ""} style={animStyle} />}
              </g>

              {/* Horizontal Lines (Keep standard opacity) */}
              <g opacity={line.opacity}>
                <line x1={start} y1={center + offset} x2={end} y2={center + offset} stroke="currentColor" strokeWidth={line.strokeWidth} className={!hasAnimated ? "hud-line" : ""} style={animStyle} />
                {line.step > 0 && <line x1={start} y1={center - offset} x2={end} y2={center - offset} stroke="currentColor" strokeWidth={line.strokeWidth} className={!hasAnimated ? "hud-line" : ""} style={animStyle} />}
              </g>
              
            </g>
          );
        })}
      </g>
    </svg>
  );

  return (
    <>
      <div className="fixed top-16 right-4 w-64 h-64 pointer-events-none z-0 overflow-visible">
        {renderHUD()}
      </div>
      <div className="fixed bottom-0 left-0 w-64 h-64 pointer-events-none z-0 overflow-visible">
        {renderHUD()}
      </div>
    </>
  );
};

// ==========================================
// MAIN APP COMPONENT
// ==========================================
const App = () => {
  const { user, userStats, loading, login, logout, updateUserStats } = useAuth();
  const { screenSize } = useResponsive();
  const { i18n } = useTranslation();
  
  useEffect(() => {
    checkForUpdates();
  }, []);

  // ==========================================
  // ✅ REAL-TIME OPERATOR STATISTICS ENGINE
  // ==========================================
  const [operatorStats, setOperatorStats] = useState({
    totalScans: 0, threatsFound: 0, communityShares: 0, trustScore: 100
  });

  useEffect(() => {
    const fetchOperatorStats = async () => {
      const currentUserId = user?.id || user?.uid;
      if (!currentUserId) return; 

      try {
        const { count: totalScans } = await supabase.from('user_history').select('*', { count: 'exact', head: true }).eq('user_id', currentUserId);
        const { count: threatsFound } = await supabase.from('user_history').select('*', { count: 'exact', head: true }).eq('user_id', currentUserId).lt('score', 70); 
        const { count: communityShares } = await supabase.from('community_threats').select('*', { count: 'exact', head: true }).eq('user_id', currentUserId);

        let calculatedTrust = 100; 
        if (totalScans > 0) {
           calculatedTrust = Math.min(99, 85 + ((communityShares || 0) * 2));
        }

        setOperatorStats({
          totalScans: totalScans || 0,
          threatsFound: threatsFound || 0,
          communityShares: communityShares || 0,
          trustScore: calculatedTrust
        });
      } catch (error) {
        console.error("Failed to fetch operator stats:", error);
      }
    };

    fetchOperatorStats();

    const currentUserId = user?.id || user?.uid;
    if (currentUserId) {
      const channel = supabase
        .channel('operator_stats_sync')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'user_history', filter: `user_id=eq.${currentUserId}` }, () => fetchOperatorStats())
        .on('postgres_changes', { event: '*', schema: 'public', table: 'community_threats', filter: `user_id=eq.${currentUserId}` }, () => fetchOperatorStats())
        .subscribe();
      return () => supabase.removeChannel(channel);
    }
  }, [user]);

  const activeUserStats = { ...userStats, ...operatorStats };

  // ==========================================
  // GLOBAL SETTINGS & IDENTITY STATE
  // ==========================================
  const [globalSettings, setGlobalSettings] = useState(() => {
    const savedIdentity = localStorage.getItem('xist_operator_identity');
    const parsedIdentity = savedIdentity ? JSON.parse(savedIdentity) : null;
    
    return {
      theme: localStorage.getItem('xist-theme') || 'system',
      fontSize: 'medium', language: 'en',
      security: { sessionTimeout: 'never' },
      privacy: { anonymousSharing: true },
      forensics: { strictMode: false },
      identity: parsedIdentity || { alias: user?.displayName || 'Unknown Node', avatar: 'ghost' }
    };
  });

  // ==========================================
  // 🛡️ AUTO-LOCK SECURITY ENGINE
  // ==========================================
  useEffect(() => {
    if (!user || !globalSettings.security || globalSettings.security.sessionTimeout === 'never') return;

    let timeoutId;
    const timeoutMinutes = parseInt(globalSettings.security.sessionTimeout);
    const timeoutMs = timeoutMinutes * 60 * 1000;

    const resetTimer = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        if (logout) {
          logout();
          alert(`Security Protocol: Session locked due to ${timeoutMinutes} minutes of inactivity.`);
        }
      }, timeoutMs);
    };

    window.addEventListener('mousemove', resetTimer);
    window.addEventListener('keypress', resetTimer);
    window.addEventListener('click', resetTimer);
    window.addEventListener('scroll', resetTimer);
    window.addEventListener('touchstart', resetTimer);

    resetTimer(); 

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('mousemove', resetTimer);
      window.removeEventListener('keypress', resetTimer);
      window.removeEventListener('click', resetTimer);
      window.removeEventListener('scroll', resetTimer);
      window.removeEventListener('touchstart', resetTimer);
    };
  }, [user, globalSettings.security?.sessionTimeout, logout]);

  const [theme, setTheme] = useState(() => {
    const savedTheme = globalSettings.theme;
    if (savedTheme === 'system') return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    return savedTheme;
  });
  
  if (theme === 'dark') document.documentElement.classList.add('dark');
  else document.documentElement.classList.remove('dark');

  const updateGlobalSettings = (newSettings) => {
    setGlobalSettings(prev => {
      const updated = { ...prev, ...newSettings, identity: newSettings.identity || prev.identity };
      if (newSettings.identity) localStorage.setItem('xist_operator_identity', JSON.stringify(newSettings.identity));
      return updated;
    });
    if (newSettings.theme) setTheme(newSettings.theme);
    if (newSettings.language && i18n.changeLanguage) i18n.changeLanguage(newSettings.language);
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

  // 🚀 FETCH UNLIMITED HISTORY FROM SUPABASE ON LOGIN
  useEffect(() => {
    const fetchFullHistory = async () => {
      const currentUserId = user?.id || user?.uid;
      if (!currentUserId) return;
      
      try {
        const { data, error } = await supabase
          .from('user_history')
          .select('*')
          .eq('user_id', currentUserId)
          .order('created_at', { ascending: false });

        if (data && !error) {
          setAnalysisHistory(data);
        }
      } catch (err) {
        console.error("Error fetching unlimited history:", err);
      }
    };
    
    fetchFullHistory();
  }, [user]);

  const handleAnalysisComplete = useCallback((analysisData) => {
    setAnalysisHistory(prev => [
      { ...analysisData, analysisId: `analysis_${Date.now()}`, created_at: new Date().toISOString() },
      ...prev
    ]);
    setAnalysisResult(analysisData);
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    const body = document.body;
    root.classList.remove('dark'); body.classList.remove('dark');
    if (theme === 'dark') {
      root.classList.add('dark'); body.classList.add('dark');
    } else if (theme === 'light') {
      // Backgrounds handled natively by new CSS rules
    } else {
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        root.classList.add('dark'); body.classList.add('dark');
      }
    }
    localStorage.setItem('xist-theme', theme);
  }, [theme]);

  useEffect(() => {
    const root = document.documentElement;
    switch (globalSettings.fontSize) {
      case 'small': root.style.setProperty('--app-font-size', '14px'); root.style.setProperty('--app-font-scale', '0.875'); break;
      case 'large': root.style.setProperty('--app-font-size', '18px'); root.style.setProperty('--app-font-scale', '1.125'); break;
      default: root.style.setProperty('--app-font-size', '16px'); root.style.setProperty('--app-font-scale', '1');
    }
  }, [globalSettings.fontSize]);

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

  useEffect(() => {
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    setTimeout(() => window.scrollTo({ top: 0, left: 0, behavior: 'smooth' }), 50);
  }, [currentSection]);

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
      document.body.style.touchAction = 'none'; 
    } else {
      document.body.style.overflow = '';
      document.body.style.touchAction = '';
    }
    return () => { document.body.style.overflow = ''; document.body.style.touchAction = ''; };
  }, [mobileMenuOpen]);

  const handleUpdateUserStats = async (newStats) => {
    try {
      if (updateUserStats) updateUserStats({ ...userStats, ...newStats });
    } catch (error) { console.error('Failed to update stats:', error); }
  };

  if (loading) {
    return (
      // 🚀 FIX: Removed hardcoded background so global theme shows through
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <NotificationProvider>
        {/* Removed inline bg colors to let index.css take over natively */}
        <div className={`app min-h-[100dvh] flex flex-col transition-colors duration-300 ${theme === 'dark' ? 'dark' : ''}`}>
          
          {isMobile && (
            <div className={`fixed inset-0 z-[100] lg:hidden transition-opacity duration-300 ${mobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
              <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)} />
              <div className={`absolute top-0 left-0 w-72 h-[100dvh] bg-[#1A1525] shadow-2xl transition-transform duration-300 transform overflow-y-auto overscroll-contain pb-10 ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                 <DesktopSidebar 
                    user={user} isMobile={true} identity={globalSettings.identity} currentSection={currentSection}
                    setCurrentSection={(section) => { setCurrentSection(section); setMobileMenuOpen(false); }}
                    setCollapsed={() => setMobileMenuOpen(false)}
                    analysisHistory={analysisHistory} 
                 />
              </div>
            </div>
          )}

          <TopNavigation
            user={user} identity={globalSettings.identity} userStats={activeUserStats} currentSection={currentSection} setCurrentSection={setCurrentSection}
            mobileMenuOpen={mobileMenuOpen} setMobileMenuOpen={setMobileMenuOpen} login={login} logout={logout}
            theme={theme} setTheme={setTheme} isMobile={isMobile} setShowVoiceControl={setShowVoiceControl} showVoiceControl={showVoiceControl}
          />

          <div className="flex flex-1 relative overflow-hidden">
            {!isMobile && (
              <DesktopSidebar
                user={user} identity={globalSettings.identity} userStats={activeUserStats} currentSection={currentSection} setCurrentSection={setCurrentSection}
                collapsed={sidebarCollapsed} setCollapsed={setSidebarCollapsed} theme={theme}
                analysisHistory={analysisHistory} 
              />
            )}

            {/* Replace the <main> tag declaration with this: */}
            <main className={`flex-1 flex flex-col transition-all duration-300 h-full w-full
              ${!isMobile && !sidebarCollapsed ? 'ml-[240px]' : !isMobile ? 'ml-[72px]' : 'ml-0'}`}
              style={{ overflow: 'visible' }}>
              
              {/* 🚀 INJECTED GLOBAL ANIMATED GRIDS HERE */}
              <GlobalCornerGrids />
              
              <div className={`flex-1 w-full relative z-10 ${currentSection === 'verify' ? 'h-[calc(100dvh-64px)] overflow-hidden' : 'container mx-auto px-2 sm:px-4 py-6'}`}>
                <SectionRouter
                  currentSection={currentSection} setCurrentSection={setCurrentSection} user={user} userStats={activeUserStats}
                  updateUserStats={handleUpdateUserStats} analysisHistory={analysisHistory} analysisResult={analysisResult}
                  onAnalysisComplete={handleAnalysisComplete} globalSettings={globalSettings} onGlobalSettingsChange={updateGlobalSettings}
                  theme={theme} setTheme={setTheme} isMobile={isMobile} isTablet={isTablet} logout={logout} login={login}
                />
              </div>
              
              {currentSection !== 'verify' && (
                <div className="w-full mt-auto relative z-10" style={{ maxWidth: '100%', margin: 0 }}> 
                   <Footer currentSection={currentSection} setCurrentSection={setCurrentSection} theme={theme} />
                </div>
              )}

            </main>
          </div>
          
          {showVoiceControl && (
            <VoiceControlPanel isOpen={showVoiceControl} onClose={() => setShowVoiceControl(false)} onSectionChange={setCurrentSection} theme={theme} user={user} />
          )}

         <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: theme === 'dark' ? 'rgba(26, 21, 37, 0.8)' : 'rgba(255, 255, 255, 0.9)',
                backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)',
                color: theme === 'dark' ? '#f1f5f9' : '#0f172a',
                border: `1px solid ${theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'}`,
                fontSize: '13px', fontWeight: '700', borderRadius: '16px', padding: '12px 20px',
                letterSpacing: '0.025em', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.2), 0 10px 10px -5px rgba(0, 0, 0, 0.1)',
                maxWidth: '350px'
              },
              success: { iconTheme: { primary: '#10b981', secondary: '#fff', }, },
              error: { iconTheme: { primary: '#ef4444', secondary: '#fff', }, },
            }}
          />
        </div>
      </NotificationProvider>
    </ErrorBoundary>
  );
};

export default App;