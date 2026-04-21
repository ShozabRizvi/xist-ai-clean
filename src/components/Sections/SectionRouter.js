import React from 'react';
import HomeSection from './HomeSection';
import VerifySection from './VerifySection';
import AnalyticsSection from './AnalyticsSection';
import CommunitySection from './CommunitySection';
import EducationSection from './EducationSection';
import SettingsSection from './SettingsSection';
import AboutSection from './AboutSection';
import ProtectionSection from './ProtectionSection';
import ContactSection from './ContactSection';  
import SupportSection from './SupportSection';  
import ApiDashboard from './ApiDashboard'; // 🚀 1. ADDED IMPORT HERE
import PrivacyPolicy from './PrivacyPolicy'; // ✅ ADDED THIS
import TermsOfService from './TermsOfService'; // ✅ ADDED THIS
import ScanDetails from './ScanDetails';

const SectionRouter = ({ 
  currentSection, 
  setCurrentSection,
  user, 
  login,
  userStats, 
  onUpdateStats,
  onAnalysisComplete,
  analysisHistory,
  logout,
  isMobile,
  theme,
  setTheme,
  onGlobalSettingsChange,
  globalSettings 
}) => {
  
  const renderSection = () => {
    switch (currentSection) {
      
      // 🚀 2. ADDED THE API ROUTE HERE
      case 'api':
        return (
          <ApiDashboard
            user={user}
            themeMode={theme}
          />
        );

      case 'home':
        return (
          <HomeSection
            user={user}
            userStats={userStats}
            onUpdateStats={onUpdateStats}
            setCurrentSection={setCurrentSection}
            theme={theme}
          />
        );
      case 'verify':
        return (
          <VerifySection
            user={user}
            userStats={userStats}
            onUpdateStats={onUpdateStats}
            setCurrentSection={setCurrentSection}
            onAnalysisComplete={onAnalysisComplete}
            theme={theme}
          />
        );
      case 'analytics':
        return (
          <AnalyticsSection
            user={user}
            userStats={userStats}
            setCurrentSection={setCurrentSection}
            analysisData={analysisHistory}
            theme={theme}
          />
        );
      case 'community':
        return (
          <CommunitySection
            user={user}
            userStats={userStats}
            setCurrentSection={setCurrentSection}
            theme={theme}
          />
        );
      case 'education':
        return (
          <EducationSection
            user={user}
            userStats={userStats}
            setCurrentSection={setCurrentSection}
            theme={theme}
          />
        );
      case 'settings':
        return (
          <SettingsSection
            user={user}
            login={login}
            userStats={userStats}
            logout={logout}
            isMobile={isMobile}
            theme={theme}
            setTheme={setTheme}
            onGlobalSettingsChange={onGlobalSettingsChange}
            setCurrentSection={setCurrentSection}
          />
        );
      case 'about':
        return (
          <AboutSection
            setCurrentSection={setCurrentSection}
            theme={theme}
          />
        );
      case 'protection':
        return (
          <ProtectionSection
            user={user}
            userStats={userStats}
            setCurrentSection={setCurrentSection}
            theme={theme}
          />
        );
      case 'contact':  
        return (
          <ContactSection
            user={user}
            userStats={userStats}
            setCurrentSection={setCurrentSection}
            theme={theme}
          />
        );
      case 'support':  
        return (
          <SupportSection
            user={user}
            userStats={userStats}
            setCurrentSection={setCurrentSection}
            theme={theme}
          />
        );

      // ✅ ADDED PRIVACY AND TERMS ROUTES HERE
      case 'privacy':
        return <PrivacyPolicy theme={theme} />;
      
      case 'terms':
        return <TermsOfService theme={theme} />;
      
        case 'scan-details':
        return (
          <ScanDetails 
            user={user}
            analysisHistory={analysisHistory}
            setCurrentSection={setCurrentSection}
          />
        );
      default:
        return (
          <HomeSection
            user={user}
            userStats={userStats}
            onUpdateStats={onUpdateStats}
            setCurrentSection={setCurrentSection}
            theme={theme}
          />
        );
    }
  };

  return (
  <div className="section-router">
    {/* Explicitly passing login here ensures it is captured from the main props */}
    {renderSection(login)} 
  </div>
);
};

export default SectionRouter;