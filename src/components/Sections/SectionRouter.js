// SectionRouter.js
import React from 'react';
import HomeSection from './HomeSection';
import VerifySection from './VerifySection';
import AnalyticsSection from './AnalyticsSection';
import CommunitySection from './CommunitySection';
import EducationSection from './EducationSection';
import SettingsSection from './SettingsSection';
import AboutSection from './AboutSection';

// **ALL MISSING SECTIONS INCLUDING CONTACT & SUPPORT**
import APISection from './APISection';
import AuthoritySection from './AuthoritySection';
import ProtectionSection from './ProtectionSection';
import HealthSection from './HealthSection';
import ContactSection from './ContactSection';  // ← HERE!
import SupportSection from './SupportSection';  // ← HERE!

const SectionRouter = ({ 
  currentSection, 
  setCurrentSection,
  user, 
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
      
      // **ALL YOUR MISSING SECTIONS**
      case 'api':
        return (
          <APISection
            user={user}
            userStats={userStats}
            setCurrentSection={setCurrentSection}
            theme={theme}
          />
        );
      case 'authority':
        return (
          <AuthoritySection
            user={user}
            userStats={userStats}
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
      case 'health':
        return (
          <HealthSection
            user={user}
            userStats={userStats}
            setCurrentSection={setCurrentSection}
            theme={theme}
          />
        );
      case 'contact':  // ← CONTACT SECTION
        return (
          <ContactSection
            user={user}
            userStats={userStats}
            setCurrentSection={setCurrentSection}
            theme={theme}
          />
        );
      case 'support':  // ← SUPPORT SECTION
        return (
          <SupportSection
            user={user}
            userStats={userStats}
            setCurrentSection={setCurrentSection}
            theme={theme}
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

  return <div className="section-router">{renderSection()}</div>;
};

export default SectionRouter;
