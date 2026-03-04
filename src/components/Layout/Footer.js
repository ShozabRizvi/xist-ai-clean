import React from 'react';
import { 
  HeartIcon, ShieldCheckIcon, GlobeAltIcon, 
  CpuChipIcon, ClockIcon, CodeBracketIcon, 
  UserCircleIcon 
} from '@heroicons/react/24/outline';

const Footer = ({ theme: globalTheme = 'dark' }) => {
  const isDark = globalTheme === 'dark';
  const currentYear = new Date().getFullYear();
  
  const theme = {
    bg: isDark ? 'bg-[#020617]' : 'bg-slate-50',
    border: isDark ? 'border-slate-800/60' : 'border-slate-200',
    textPrimary: isDark ? 'text-slate-200' : 'text-slate-800', 
    textSecondary: isDark ? 'text-slate-400' : 'text-slate-600',
    brandText: isDark ? 'text-white' : 'text-slate-900',
    accent: 'text-indigo-500'
  };

  const team = [
    { name: 'Shozab Rizvi', url: 'https://www.linkedin.com/in/shozab-rizvi' },
    { name: 'Rishabh Srivastava', url: 'https://www.linkedin.com/in/srishabh9140' },
    { name: 'Asmit Gupta', url: 'https://www.linkedin.com/in/asmit-gupta' }
  ];

  return (
    // ✅ Added "rounded-2xl" for curvy corners
    <footer className={`w-full py-4 border transition-colors duration-500 relative overflow-hidden rounded-2xl ${theme.bg} ${theme.border} ${theme.textSecondary}`}
            style={{ marginLeft: '280px', width: 'calc(100% - 280px)' }}>
      
      {/* 🟦 CURVY TACTICAL CORNER BARS */}
      {/* Added "rounded" to the corner lines so they follow the footer's curve */}
      <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-indigo-500/50 rounded-tl-2xl"></div>
      <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-indigo-500/50 rounded-tr-2xl"></div>
      <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-indigo-500/50 rounded-bl-2xl"></div>
      <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-indigo-500/50 rounded-br-2xl"></div>

      {/* 🚨 ADAPTIVE GRID CONTINUITY */}
      <div className={`absolute inset-0 pointer-events-none opacity-[0.04] ${isDark ? '' : 'invert'}`} 
           style={{ backgroundImage: 'linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>

      <div className="max-w-7xl mx-auto px-10 flex flex-col lg:flex-row items-center justify-between gap-10 relative z-10">
        
        {/* Brand Node */}
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-gradient-to-br from-indigo-600 to-blue-700 rounded-2xl flex items-center justify-center shadow-2xl shadow-indigo-500/20">
            <ShieldCheckIcon className="w-7 h-7 text-white" />
          </div>
          <div>
            <h3 className={`text-xl font-black tracking-tighter ${theme.brandText}`}>XIST INTELLIGENCE</h3>
            <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse border border-emerald-400/50"></div>
                <span className={`text-[10px] font-black uppercase tracking-[0.2em] ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Node Pulse Active</span>
            </div>
          </div>
        </div>

        {/* Global Matrix Stats & Links */}
        <div className="flex flex-col items-center gap-4">
          <div className={`flex flex-wrap gap-8 justify-center font-black uppercase tracking-[0.15em] text-[10px] ${theme.textPrimary}`}>
            <div className="flex items-center gap-2 group cursor-default hover:text-indigo-500 transition-colors"><CpuChipIcon className="w-4 h-4 text-indigo-500" /> GEMINI</div>
            <div className="flex items-center gap-2 group cursor-default hover:text-emerald-500 transition-colors"><ClockIcon className="w-4 h-4 text-emerald-500" /> 24/7_SURVEILLANCE</div>
            <div className="flex items-center gap-2 group cursor-default hover:text-blue-500 transition-colors"><GlobeAltIcon className="w-4 h-4 text-blue-500" /> GLOBAL COMMUNITY</div>
          </div>
          
          <div className="flex flex-wrap gap-4 justify-center">
            <a href="https://github.com/ShozabRizvi/xist-ai-clean" target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest hover:text-indigo-400 transition-colors">
              <CodeBracketIcon className="w-3.5 h-3.5" /> Source_Code
            </a>
            {team.map((m) => (
              <a key={m.name} href={m.url} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-[9px] font-black uppercase tracking-widest hover:text-blue-400 transition-colors">
                <UserCircleIcon className="w-3.5 h-3.5" /> {m.name}
              </a>
            ))}
          </div>
        </div>

        {/* Legal & Built-by */}
        <div className="text-center lg:text-right flex flex-col items-center lg:items-end gap-2">
          <div className={`text-[10px] font-black uppercase tracking-widest ${theme.textPrimary}`}>© {currentYear} XIST AI. ALL RIGHTS RESERVED.</div>
          <div className={`flex items-center justify-center gap-2 text-[9px] font-black uppercase tracking-widest opacity-60`}>
            BUILT WITH <HeartIcon className="w-3.5 h-3.5 text-rose-500 fill-rose-500 animate-pulse" /> FOR DIGITAL_SOVEREIGNTY
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;