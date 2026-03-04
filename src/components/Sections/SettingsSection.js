import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Cog6ToothIcon, UserCircleIcon, PaintBrushIcon, SunIcon, 
  MoonIcon, CheckCircleIcon, ShieldExclamationIcon, 
  GlobeAltIcon, ServerStackIcon, TrashIcon, KeyIcon,
  FingerPrintIcon, ShieldCheckIcon, CpuChipIcon,
  EyeIcon, FireIcon, CodeBracketIcon
} from '@heroicons/react/24/outline';
import { useResponsive } from '../../hooks/useResponsive';

const THEMES = {
  dark: {
    background: 'bg-[#020617]', card: 'bg-slate-900 border border-slate-800 shadow-2xl',
    inner: 'bg-slate-950 border-slate-800', textPrimary: 'text-slate-100',
    textSecondary: 'text-slate-400', accent: 'text-indigo-400',
    input: 'bg-slate-950 border-slate-800 text-emerald-400',
    glow: 'from-indigo-500/10 via-rose-500/5 to-transparent',
    iconContainer: 'bg-slate-800/50', danger: 'text-rose-500 border-rose-500/30 hover:bg-rose-500/10'
  },
  light: {
    background: 'bg-slate-50', card: 'bg-white border border-slate-200 shadow-xl',
    inner: 'bg-slate-100 border-slate-200', textPrimary: 'text-slate-900',
    textSecondary: 'text-slate-700', accent: 'text-indigo-600',
    input: 'bg-white border-slate-300 text-emerald-600',
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

export default function SettingsSection({ theme: globalTheme = 'dark', setTheme, onGlobalSettingsChange, currentAlias, currentAvatar }) {
  const { screenSize } = useResponsive();
  const theme = THEMES[globalTheme];
  const typingTitle = useTypewriterEffect("System Config: Active", 80, 200);

  const [settings, setSettings] = useState({
    theme: globalTheme,
    forensics: { strictMode: false, autoPurge: true },
    privacy: { anonymousSharing: true },
    security: { sessionTimeout: '30' }
  });

  // ✅ BULLETPROOF FIX: Check local storage directly on mount so it survives reloads instantly
  const [localIdentity, setLocalIdentity] = useState(() => {
    const saved = localStorage.getItem('xist_operator_identity');
    if (saved) {
      return JSON.parse(saved);
    }
    return {
      alias: currentAlias || 'Shozab Rizvi',
      avatar: currentAvatar || 'ghost'
    };
  });
  
  const [isSaved, setIsSaved] = useState(false);
  const [activeTab, setActiveTab] = useState('appearance');

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

  // ✅ BULLETPROOF FIX: Save directly to localStorage from here too
  const commitIdentity = () => {
    localStorage.setItem('xist_operator_identity', JSON.stringify(localIdentity));
    if (onGlobalSettingsChange) onGlobalSettingsChange({ ...settings, identity: localIdentity });
    setIsSaved(true);
  };

  const settingsTabs = [
    { id: 'appearance', label: 'Terminal Interface', icon: PaintBrushIcon },
    { id: 'general', label: 'Forensic Protocol', icon: Cog6ToothIcon },
    { id: 'account', label: 'Operator Security', icon: UserCircleIcon }
  ];

  const ActiveAvatarIcon = AVATAR_OPTIONS.find(a => a.id === localIdentity.avatar)?.icon || UserCircleIcon;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className={`w-full min-h-screen p-6 relative transition-colors duration-500 ${theme.background} ${theme.textPrimary}`}
                style={{ marginLeft: screenSize.isMobile ? '0' : '280px', marginTop: '64px' }}>
      
      <div className={`absolute inset-0 pointer-events-none opacity-[0.03] ${globalTheme === 'light' ? 'invert' : ''}`} 
           style={{ backgroundImage: 'linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
      <div className={`absolute inset-0 pointer-events-none opacity-20 bg-gradient-to-tr ${theme.glow}`}></div>

      <div className="max-w-4xl mx-auto relative z-10">
        <div className="text-center mb-10">
          <Cog6ToothIcon className={`w-16 h-16 mx-auto mb-4 ${theme.accent} opacity-80`} />
          <h1 className="text-4xl font-black tracking-tight mb-3 uppercase flex justify-center items-center">
            <span>{typingTitle}</span>
            <motion.span animate={{ opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 0.8 }} className="w-1.5 h-8 bg-indigo-500 inline-block ml-2" />
          </h1>
          <p className={`text-sm font-mono tracking-widest uppercase ${theme.textSecondary}`}>Global Operational Parameters</p>
        </div>

        <div className="flex flex-col md:flex-row justify-center gap-3 mb-8">
          {settingsTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                className={`flex items-center justify-center gap-2 px-6 py-4 rounded-xl font-bold uppercase tracking-widest text-xs transition-all border-2 
                ${isActive ? 'border-indigo-500 bg-indigo-500/10 text-indigo-500' : `${theme.card} ${theme.textSecondary} hover:border-indigo-500/50`}`}>
                <Icon className="w-5 h-5" /> {tab.label}
              </button>
            );
          })}
        </div>

        <div className={`${theme.card} rounded-[2rem] p-8`}>
          
          {/* TAB 1: APPEARANCE */}
          {activeTab === 'appearance' && (
            <div className="space-y-8 animate-fade-in">
              <div>
                <h3 className="text-xs font-black uppercase tracking-widest mb-6 flex items-center gap-2"><PaintBrushIcon className="w-5 h-5"/> Visual Subsystem</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[
                    { value: 'dark', label: 'Dark Mode (Tactical)', icon: MoonIcon, bg: 'bg-[#020617]', border: 'border-slate-800' },
                    { value: 'light', label: 'Light Mode (Standard)', icon: SunIcon, bg: 'bg-slate-50', border: 'border-slate-300' }
                  ].map((opt) => {
                    const isSelected = settings.theme === opt.value;
                    return (
                      <button key={opt.value} onClick={() => handleSettingChange('root', 'theme', opt.value)}
                        className={`relative p-6 rounded-2xl border-2 transition-all text-left overflow-hidden
                        ${isSelected ? 'border-indigo-500 bg-indigo-500/5' : `${theme.inner} hover:border-indigo-500/50`}`}>
                        <div className={`w-full h-24 ${opt.bg} ${opt.border} border-2 rounded-xl mb-4 flex items-center justify-center shadow-inner`}>
                          <opt.icon className="w-8 h-8 text-slate-400" />
                        </div>
                        <div className="font-bold text-sm uppercase tracking-wider">{opt.label}</div>
                        {isSelected && <CheckCircleIcon className="absolute top-6 right-6 w-6 h-6 text-indigo-500" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: GENERAL / FORENSICS */}
          {activeTab === 'general' && (
            <div className="space-y-8 animate-fade-in">
              <h3 className="text-xs font-black uppercase tracking-widest mb-6 flex items-center gap-2"><ServerStackIcon className="w-5 h-5"/> Analysis Engine Directives</h3>
              
              <div className={`flex items-center justify-between p-6 rounded-2xl border ${theme.inner}`}>
                <div className="pr-4">
                  <h4 className="font-bold text-sm uppercase mb-1">Strict Heuristics Mode</h4>
                  <p className={`text-[10px] font-mono leading-relaxed ${theme.textSecondary}`}>Increases AI sensitivity to micro-anomalies. May cause higher false-positive deepfake flags.</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer flex-shrink-0">
                  <input type="checkbox" className="sr-only peer" checked={settings.forensics.strictMode} onChange={(e) => handleSettingChange('forensics', 'strictMode', e.target.checked)} />
                  <div className="w-11 h-6 bg-slate-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-500"></div>
                </label>
              </div>

              <div className={`flex items-center justify-between p-6 rounded-2xl border ${theme.inner}`}>
                <div className="pr-4">
                  <h4 className="font-bold text-sm uppercase mb-1 flex items-center gap-2">Anonymous Threat Matrix <GlobeAltIcon className="w-4 h-4"/></h4>
                  <p className={`text-[10px] font-mono leading-relaxed ${theme.textSecondary}`}>Automatically submit confirmed scam URLs and hashes to the global feed.</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer flex-shrink-0">
                  <input type="checkbox" className="sr-only peer" checked={settings.privacy.anonymousSharing} onChange={(e) => handleSettingChange('privacy', 'anonymousSharing', e.target.checked)} />
                  <div className="w-11 h-6 bg-slate-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-500"></div>
                </label>
              </div>
            </div>
          )}

          {/* TAB 3: ACCOUNT */}
          {activeTab === 'account' && (
            <div className="space-y-8 animate-fade-in">
              <h3 className="text-xs font-black uppercase tracking-widest mb-6 flex items-center gap-2"><ShieldExclamationIcon className="w-5 h-5"/> Operator Clearance & Identity</h3>
              
              <div className={`p-6 rounded-2xl border-l-4 border-l-emerald-500 space-y-6 ${theme.inner}`}>
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="w-20 h-20 shrink-0 rounded-2xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/30">
                    <ActiveAvatarIcon className="w-10 h-10 text-emerald-500" />
                  </div>
                  
                  <div className="flex-grow space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-emerald-500">Operator Alias</label>
                    <input 
                      type="text" 
                      value={localIdentity.alias} 
                      onChange={(e) => {
                        setLocalIdentity({...localIdentity, alias: e.target.value});
                        setIsSaved(false); // Unlock the button when they start typing
                      }}
                      className={`w-full p-3 rounded-xl border-2 outline-none font-mono text-sm uppercase bg-slate-900/50 text-emerald-400 border-emerald-500/30 focus:border-emerald-500`}
                      placeholder="Enter Secure Codename..."
                    />
                    <p className={`text-[9px] font-mono ${theme.textSecondary}`}>This alias overrides your global profile display.</p>
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-emerald-500 mb-2 block">Tactical Avatar</label>
                  <div className="flex flex-wrap gap-3">
                    {AVATAR_OPTIONS.map((avatar) => {
                      const isSelected = localIdentity.avatar === avatar.id;
                      return (
                        <button key={avatar.id} onClick={() => {
                          setLocalIdentity({...localIdentity, avatar: avatar.id});
                          setIsSaved(false); // Unlock the button when they pick a new icon
                        }}
                          className={`p-3 rounded-xl border-2 transition-all ${isSelected ? 'border-emerald-500 bg-emerald-500/20 text-emerald-500' : `border-slate-700 bg-slate-800 text-slate-400 hover:border-emerald-500/50`}`}>
                          <avatar.icon className="w-6 h-6" />
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="pt-4 border-t border-emerald-500/20 flex justify-end">
                  <button onClick={commitIdentity} disabled={isSaved}
                    className={`px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2
                    ${isSaved ? 'bg-emerald-500 text-white' : 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/50 hover:bg-emerald-500 hover:text-white'}`}>
                    {isSaved ? <><CheckCircleIcon className="w-4 h-4" /> Identity Locked</> : 'Commit Identity'}
                  </button>
                </div>

              </div>

              {/* SECURITY CONTROLS */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className={`p-6 rounded-2xl border ${theme.inner}`}>
                  <h4 className="font-bold text-sm uppercase mb-2 flex items-center gap-2"><KeyIcon className="w-4 h-4"/> Session Timeout</h4>
                  <p className={`text-[10px] font-mono mb-4 ${theme.textSecondary}`}>Auto-lock terminal after inactivity.</p>
                  <select value={settings.security.sessionTimeout} onChange={(e) => handleSettingChange('security', 'sessionTimeout', e.target.value)}
                    className={`w-full p-3 rounded-xl border-2 outline-none text-xs font-bold uppercase ${theme.input}`}>
                    <option value="15">15 Minutes</option>
                    <option value="30">30 Minutes</option>
                    <option value="60">1 Hour</option>
                    <option value="never">Never (Not Recommended)</option>
                  </select>
                </div>

                <div className={`p-6 rounded-2xl border ${theme.inner}`}>
                  <h4 className="font-bold text-sm uppercase mb-2 flex items-center gap-2 text-rose-500"><TrashIcon className="w-4 h-4"/> Data Sanitization</h4>
                  <p className={`text-[10px] font-mono mb-4 ${theme.textSecondary}`}>Permanently delete all local forensic ledgers and scan history.</p>
                  <button className={`w-full p-3 rounded-xl border-2 transition-all text-xs font-black uppercase tracking-widest flex justify-center items-center gap-2 ${theme.danger}`}>
                    <TrashIcon className="w-4 h-4" /> Purge Records
                  </button>
                </div>
              </div>

            </div>
          )}
        </div>
      </div>
      <div className="h-24" />
    </motion.div>
  );
}