import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Cog6ToothIcon, UserCircleIcon, PaintBrushIcon, SunIcon, 
  MoonIcon, CheckCircleIcon, ShieldExclamationIcon, 
  TrashIcon, KeyIcon, FingerPrintIcon, ShieldCheckIcon, CpuChipIcon,
  EyeIcon, FireIcon, CodeBracketIcon, SparklesIcon, ClockIcon,
  ArrowLeftOnRectangleIcon,      // Use this for Sign Out (Modern replacement)
  ArrowRightStartOnRectangleIcon
} from '@heroicons/react/24/outline';
import { useResponsive } from '../../hooks/useResponsive';

// ==============================
// 100% ADAPTIVE THEME MATRIX
// ==============================
const THEMES = {
  dark: {
    background: 'bg-[#020617]', card: 'bg-slate-900 border border-slate-800 shadow-2xl',
    inner: 'bg-slate-950 border border-slate-800', textPrimary: 'text-slate-100',
    textSecondary: 'text-slate-400', accent: 'text-indigo-400',
    input: 'bg-slate-950 border-slate-800 text-indigo-400 focus:border-indigo-500/50',
    glow: 'from-indigo-500/10 via-rose-500/5 to-transparent',
    iconContainer: 'bg-slate-800/50', danger: 'text-rose-500 border-rose-500/30 hover:bg-rose-500/10'
  },
  light: {
    background: 'bg-slate-50', card: 'bg-white border border-slate-200 shadow-xl',
    inner: 'bg-slate-100 border border-slate-200', textPrimary: 'text-slate-900',
    textSecondary: 'text-slate-700', accent: 'text-indigo-600',
    input: 'bg-white border-slate-300 text-indigo-600 focus:border-indigo-500',
    glow: 'from-indigo-500/5 via-rose-500/5 to-transparent',
    iconContainer: 'bg-slate-200', danger: 'text-rose-600 border-rose-600/30 hover:bg-rose-50'
  }
};

const useTypewriterEffect = (text, speed = 80, delay = 200) => {
  const [displayedText, setDisplayedText] = useState("");
  const [started, setStarted] = useState(false);
  useEffect(() => {
    const timeout = setTimeout(() => setStarted(true), delay);
    return () => clearTimeout(timeout);
  }, [delay]);
  useEffect(() => {
    if (!started) return;
    if (displayedText.length < text.length) {
      const timeout = setTimeout(() => setDisplayedText(text.slice(0, displayedText.length + 1)), speed);
      return () => clearTimeout(timeout);
    }
  }, [displayedText, text, speed, started]);
  return displayedText;
};

export const AVATAR_OPTIONS = [
  { id: 'ghost', icon: UserCircleIcon },
  { id: 'shield', icon: ShieldCheckIcon },
  { id: 'chip', icon: CpuChipIcon },
  { id: 'fingerprint', icon: FingerPrintIcon },
  { id: 'eye', icon: EyeIcon },
  { id: 'fire', icon: FireIcon },
  { id: 'code', icon: CodeBracketIcon }
];

export default function SettingsSection({ 
  user, 
  userStats, 
  logout, 
  login, // Handled by App.js
  isMobile, 
  theme: globalTheme = 'dark', 
  setTheme, 
  onGlobalSettingsChange, 
  setCurrentSection,
  currentAlias,
  currentAvatar 
}) {
  const { screenSize } = useResponsive();
  const themeMode = THEMES[globalTheme] ? globalTheme : 'dark';
  const theme = THEMES[themeMode];
  
  const typingTitle = useTypewriterEffect("Settings", 80, 200);

  const [settings, setSettings] = useState({
    theme: globalTheme,
    forensics: { strictMode: false, autoPurge: true },
    privacy: { anonymousSharing: true },
    security: { sessionTimeout: '30' }
  });
  const [localIdentity, setLocalIdentity] = useState(() => {
    const saved = localStorage.getItem('xist_operator_identity');
    if (saved) return JSON.parse(saved);
    return { alias: currentAlias || 'Operator', avatar: currentAvatar || 'ghost' };
  });
  
  const [isSaved, setIsSaved] = useState(false);
  const [activeTab, setActiveTab] = useState('appearance');

  // SESSION UPTIME STATE
  const [sessionStart, setSessionStart] = useState(null);
  const [uptime, setUptime] = useState("00:00:00");

  // LISTEN FOR URL HASH
  useEffect(() => {
    if (window.location.hash === '#edit-profile') {
      setActiveTab('account');
      window.history.replaceState(null, '', window.location.pathname); 
    }
  }, []);

  // CALCULATE REALTIME UPTIME
  useEffect(() => {
    let start = sessionStorage.getItem('xist_session_start');
    if (!start) {
      start = Date.now().toString();
      sessionStorage.setItem('xist_session_start', start);
    }
    setSessionStart(parseInt(start, 10));

    const interval = setInterval(() => {
      const now = Date.now();
      const diff = Math.floor((now - parseInt(start, 10)) / 1000);
      const h = Math.floor(diff / 3600).toString().padStart(2, '0');
      const m = Math.floor((diff % 3600) / 60).toString().padStart(2, '0');
      const s = (diff % 60).toString().padStart(2, '0');
      setUptime(`${h}:${m}:${s}`);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (globalTheme && globalTheme !== settings.theme) {
      setSettings(prev => ({ ...prev, theme: globalTheme }));
    }
  }, [globalTheme]);

  const handleSettingChange = (category, key, value) => {
    const newSettings = { ...settings };
    if (category === 'root') {
      newSettings[key] = value;
      if (key === 'theme') {
        localStorage.setItem('xist-theme', value);
        if (setTheme) setTheme(value);
        if (value === 'dark') {
          document.documentElement.classList.add('dark'); document.body.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark'); document.body.classList.remove('dark');
        }
      }
    } else {
      newSettings[category] = { ...newSettings[category], [key]: value };
    }
    setSettings(newSettings);
    if (onGlobalSettingsChange) onGlobalSettingsChange(newSettings);
  };

  const commitIdentity = () => {
    localStorage.setItem('xist_operator_identity', JSON.stringify(localIdentity));
    if (onGlobalSettingsChange) onGlobalSettingsChange({ ...settings, identity: localIdentity });
    setIsSaved(true);
    window.location.reload(); 
  };

  const settingsTabs = [
    { id: 'appearance', label: 'App Appearance', icon: PaintBrushIcon },
    { id: 'account', label: 'Account Details', icon: UserCircleIcon },
    { id: 'general', label: 'Preferences', icon: Cog6ToothIcon }
  ];

  const ActiveAvatarIcon = AVATAR_OPTIONS.find(a => a.id === localIdentity.avatar)?.icon || UserCircleIcon;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className={`w-full min-h-screen relative transition-colors duration-500 ${theme.background} ${theme.textPrimary} overflow-x-hidden`}
                style={{ marginLeft: screenSize.isMobile ? '0' : '280px', marginTop: '64px', fontFamily: 'Inter, system-ui, sans-serif' }}>
      
      <div className={`absolute inset-0 pointer-events-none opacity-[0.03] ${themeMode === 'light' ? 'invert' : ''} z-0`} 
           style={{ backgroundImage: 'linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>

      {/* HERO HEADER */}
      <div className="pt-8 md:pt-12 pb-6 px-4 relative z-10 text-center">
        <Cog6ToothIcon className={`w-12 h-12 md:w-16 md:h-16 mx-auto mb-4 stroke-[1.5] ${theme.accent}`} />
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mb-2 pb-4 tracking-tight">
          <span className="inline-block pb-2 leading-[1.2em]">{typingTitle}</span>
          <motion.span 
  animate={{ opacity: [0, 1, 0] }} 
  transition={{ repeat: Infinity, duration: 0.9 }} 
  className="inline-block w-[3px] md:w-[4px] h-[0.7em] bg-indigo-500 ml-2 align-middle" 
/>
        </h1>
        <p className={`text-[10px] md:text-xs font-mono tracking-[0.3em] uppercase ${theme.textSecondary}`}>
          Manage your app experience
        </p>
      </div>

      <div className="max-w-4xl mx-auto px-4 relative z-10">

       {/* ✅ Adaptive Tab Bar: Centered Row on Desktop | Auto-adjusting on Mobile */}
<div className="flex flex-wrap items-center justify-center gap-2 md:gap-4 mb-10 w-full px-2">
  {settingsTabs.map((tab) => {
    const Icon = tab.icon;
    const isActive = activeTab === tab.id;
    return (
      <button 
        key={tab.id} 
        onClick={() => setActiveTab(tab.id)}
        className={`flex items-center justify-center gap-2 py-3 px-4 md:px-8 rounded-2xl font-black uppercase tracking-widest transition-all duration-300 border-2 
        ${isActive 
          ? 'border-indigo-500 bg-indigo-500/10 text-indigo-500 shadow-[0_0_20px_rgba(99,102,241,0.2)]' 
          : `${theme.card} ${theme.textSecondary} border-transparent hover:border-indigo-500/50 hover:bg-white/5`
        }
        /* Mobile: Grow to fill space | Desktop: Natural width */
        flex-1 md:flex-none
        text-[9px] xs:text-[10px] md:text-xs`}
      >
        <Icon className="w-4 h-4 md:w-5 md:h-5 shrink-0" /> 
        <span className="whitespace-nowrap">{tab.label}</span>
      </button>
    );
  })}
</div>

        <div className={`${theme.card} rounded-[2rem] p-6 md:p-8 mb-20`}>
          
          {/* TAB 1: APPEARANCE */}
          {activeTab === 'appearance' && (
            <div className="space-y-8 animate-fade-in">
              <div>
                <h3 className="text-xs font-black uppercase tracking-widest mb-6 flex items-center gap-2"><PaintBrushIcon className="w-5 h-5 text-indigo-500"/> Theme Selection</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[
                    { value: 'dark', label: 'Dark Mode', icon: MoonIcon, bg: 'bg-[#020617]', border: 'border-slate-800' },
                    { value: 'light', label: 'Light Mode', icon: SunIcon, bg: 'bg-slate-50', border: 'border-slate-300' }
                  ].map((opt) => {
                    const isSelected = settings.theme === opt.value;
                    return (
                      <button key={opt.value} onClick={() => handleSettingChange('root', 'theme', opt.value)}
                        className={`relative p-6 rounded-2xl border-2 transition-all text-left overflow-hidden group
                        ${isSelected ? 'border-indigo-500 bg-indigo-500/5 shadow-[0_0_20px_rgba(99,102,241,0.1)]' : `${theme.inner} hover:border-indigo-500/50`}`}>
                        <div className={`w-full h-24 ${opt.bg} ${opt.border} border rounded-xl mb-4 flex items-center justify-center transition-transform group-hover:scale-[1.02]`}>
                          <opt.icon className={`w-8 h-8 ${isSelected ? 'text-indigo-500' : 'text-slate-400'}`} />
                        </div>
                        <div className={`font-bold text-sm uppercase tracking-wider ${isSelected ? 'text-indigo-500' : theme.textPrimary}`}>{opt.label}</div>
                        {isSelected && <CheckCircleIcon className="absolute top-6 right-6 w-6 h-6 text-indigo-500 drop-shadow-md" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: ACCOUNT */}
          {activeTab === 'account' && (
            <div className="space-y-8 animate-fade-in">
              <h3 className="text-xs font-black uppercase tracking-widest mb-6 flex items-center gap-2"><UserCircleIcon className="w-5 h-5 text-indigo-500"/> Personal Details</h3>
              
              <div className={`p-6 rounded-2xl border-l-4 border-l-indigo-500 space-y-6 ${theme.inner}`}>
                
                {/* SESSION UPTIME & LOGIN DATE */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-indigo-500/5 p-4 rounded-xl border border-indigo-500/20 mb-2 gap-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-indigo-500/20 rounded-lg shrink-0">
                      <ClockIcon className="w-5 h-5 text-indigo-500" />
                    </div>
                    <div>
                      <p className={`text-[9px] font-black uppercase tracking-widest text-indigo-500/70 mb-0.5`}>Session Uptime</p>
                      <p className={`text-lg font-mono font-bold ${theme.textPrimary}`}>{uptime}</p>
                    </div>
                  </div>
                  <div className="sm:text-right border-t sm:border-t-0 border-indigo-500/10 pt-2 sm:pt-0 w-full sm:w-auto">
                    <p className={`text-[9px] font-black uppercase tracking-widest text-indigo-500/70 mb-0.5`}>Logged In At</p>
                    <p className={`text-xs font-mono font-medium ${theme.textPrimary}`}>
                      {sessionStart ? new Date(sessionStart).toLocaleString() : 'Loading...'}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center">
                  <div className="w-20 h-20 shrink-0 rounded-full bg-indigo-500/10 flex items-center justify-center border-2 border-indigo-500/30 shadow-lg">
                    <ActiveAvatarIcon className="w-10 h-10 text-indigo-500" />
                  </div>
                  <div className="flex-grow w-full space-y-2">
                    <label className={`text-[10px] font-black uppercase tracking-widest ${theme.textSecondary}`}>Display Name</label>
                    <input 
                      type="text" 
                      value={localIdentity.alias} 
                      onChange={(e) => {
                        setLocalIdentity({...localIdentity, alias: e.target.value});
                        setIsSaved(false);
                      }}
                      className={`w-full p-3 md:p-4 rounded-xl border-2 outline-none font-bold text-sm bg-transparent transition-all ${theme.textPrimary} border-slate-700/50 focus:border-indigo-500`}
                      placeholder="Enter your name..."
                    />
                  </div>
                </div>

                <div>
                  <label className={`text-[10px] font-black uppercase tracking-widest ${theme.textSecondary} mb-3 block`}>Choose an Icon</label>
                  <div className="flex flex-wrap gap-3">
                    {AVATAR_OPTIONS.map((avatar) => {
                      const isSelected = localIdentity.avatar === avatar.id;
                      return (
                        <button key={avatar.id} onClick={() => {
                          setLocalIdentity({...localIdentity, avatar: avatar.id});
                          setIsSaved(false);
                        }}
                          className={`p-3 md:p-4 rounded-full border-2 transition-all hover:scale-110 active:scale-95 ${isSelected ? 'border-indigo-500 bg-indigo-500/20 text-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.3)]' : `border-transparent ${theme.iconContainer} ${theme.textSecondary} hover:border-indigo-500/50`}`}>
                          <avatar.icon className="w-5 h-5 md:w-6 md:h-6" />
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="pt-6 border-t border-slate-700/20 flex justify-end">
                  <button onClick={commitIdentity} disabled={isSaved}
                    className={`w-full sm:w-auto px-8 py-3.5 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all flex justify-center items-center gap-2 shadow-lg
                    ${isSaved ? 'bg-indigo-500 text-white' : 'bg-indigo-600 hover:bg-indigo-500 text-white active:scale-95'}`}>
                    {isSaved ? <><CheckCircleIcon className="w-4 h-4" /> Saved Successfully</> : 'Save Profile'}
                  </button>
                </div>
              </div>

              {/* ✅ SESSION & DATA MANAGEMENT */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                
                {/* DYNAMIC AUTH CARD */}
                <div className={`p-6 rounded-2xl border ${theme.inner} flex flex-col justify-between transition-all duration-500`}>
                  {!user ? (
                    /* SIGN IN STATE (BLUE) */
                    <>
                      <div>
                        <h4 className="font-bold text-sm mb-2 flex items-center gap-2 text-indigo-500">
                          <UserCircleIcon className="w-5 h-5"/> Account Access
                        </h4>
                        <p className={`text-[11px] font-medium leading-relaxed mb-6 ${theme.textSecondary}`}>
                          Sign in to sync your history and access premium features.
                        </p>
                      </div>
                      <button 
                        onClick={() => {
                          console.log("Settings Login Clicked. Function exists:", !!login);
                          if (login) {
                            login();
                          } else {
                            alert("Login system connection error. Please use the Sign In button in the Top Navigation bar.");
                          }
                        }} 
                        className="w-full px-6 py-3 rounded-xl border-2 transition-all text-[10px] font-black uppercase tracking-widest flex justify-center items-center gap-2 border-indigo-500 text-indigo-500 hover:bg-indigo-500 hover:text-white shadow-[0_0_15px_rgba(99,102,241,0.2)]"
                      >
                        <ArrowRightStartOnRectangleIcon className="w-4 h-4" /> Sign In
                      </button>
                    </>
                  ) : (
                    /* SIGN OUT STATE (RED) */
                    <>
                      <div>
                        <h4 className="font-bold text-sm mb-2 flex items-center gap-2 text-rose-500">
                          <ArrowLeftOnRectangleIcon className="w-5 h-5"/> Account Session</h4>
                        <p className={`text-[11px] font-medium leading-relaxed mb-6 ${theme.textSecondary}`}>
                          Securely sign out of your current account session.
                        </p>
                      </div>
                      <button 
                        onClick={() => { if(logout) logout(); }} 
                        className={`w-full px-6 py-3 rounded-xl border-2 transition-all text-[10px] font-black uppercase tracking-widest flex justify-center items-center gap-2 ${theme.danger}`}
                      >
                        <ArrowLeftOnRectangleIcon className="w-4 h-4" /> Sign Out
                      </button>
                    </>
                  )}
                </div>

                {/* Data Deletion Block - Only visible if user is logged in */}
                {user && (
                  <div className={`p-6 rounded-2xl border ${theme.inner} flex flex-col justify-between animate-fade-in`}>
                    <div>
                      <h4 className="font-bold text-sm mb-2 flex items-center gap-2 text-rose-500"><TrashIcon className="w-5 h-5"/> Clear History</h4>
                      <p className={`text-[11px] font-medium leading-relaxed mb-6 ${theme.textSecondary}`}>Permanently remove your scan history from this device.</p>
                    </div>
                    <button className={`w-full px-6 py-3 rounded-xl border-2 transition-all text-[10px] font-black uppercase tracking-widest flex justify-center items-center gap-2 ${theme.danger}`}>
                      <TrashIcon className="w-4 h-4" /> Clear All Data
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: GENERAL PREFERENCES */}
          {activeTab === 'general' && (
            <div className="space-y-6 animate-fade-in">
              <h3 className="text-xs font-black uppercase tracking-widest mb-6 flex items-center gap-2"><SparklesIcon className="w-5 h-5 text-indigo-500"/> App Behavior</h3>
              
              <div className={`flex flex-col sm:flex-row sm:items-center justify-between p-5 md:p-6 rounded-2xl border gap-4 ${theme.inner}`}>
                <div className="pr-4">
                  <h4 className={`font-bold text-sm mb-1 ${theme.textPrimary}`}>Strict AI Scanning</h4>
                  <p className={`text-[11px] leading-relaxed ${theme.textSecondary}`}>Increases sensitivity to anomalies. May flag safe content more often.</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer flex-shrink-0">
                  <input type="checkbox" className="sr-only peer" checked={settings.forensics.strictMode} onChange={(e) => handleSettingChange('forensics', 'strictMode', e.target.checked)} />
                  <div className="w-11 h-6 bg-slate-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-500"></div>
                </label>
              </div>

              <div className={`flex flex-col sm:flex-row sm:items-center justify-between p-5 md:p-6 rounded-2xl border gap-4 ${theme.inner}`}>
                <div className="pr-4">
                  <h4 className={`font-bold text-sm mb-1 ${theme.textPrimary}`}>Share findings to Community</h4>
                  <p className={`text-[11px] leading-relaxed ${theme.textSecondary}`}>Automatically submit malicious URLs to the global feed to warn others.</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer flex-shrink-0">
                  <input type="checkbox" className="sr-only peer" checked={settings.privacy.anonymousSharing} onChange={(e) => handleSettingChange('privacy', 'anonymousSharing', e.target.checked)} />
                  <div className="w-11 h-6 bg-slate-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-500"></div>
                </label>
              </div>

              <div className={`p-5 md:p-6 rounded-2xl border ${theme.inner}`}>
                <h4 className={`font-bold text-sm mb-2 flex items-center gap-2 ${theme.textPrimary}`}><KeyIcon className="w-4 h-4 text-indigo-500"/> Auto-Lock App</h4>
                <p className={`text-[11px] mb-4 ${theme.textSecondary}`}>Require re-authentication after inactivity to protect your scans.</p>
                <select value={settings.security.sessionTimeout} onChange={(e) => handleSettingChange('security', 'sessionTimeout', e.target.value)}
                  className={`w-full sm:w-max p-3 rounded-xl border-2 outline-none text-xs font-bold uppercase cursor-pointer ${theme.input} border-slate-700/50`}>
                  <option value="15">After 15 Minutes</option>
                  <option value="30">After 30 Minutes</option>
                  <option value="60">After 1 Hour</option>
                  <option value="never">Never Lock</option>
                </select>
              </div>
            </div>
          )}

        </div>
      </div>
    </motion.div>
  );
}