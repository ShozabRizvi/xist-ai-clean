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
    textPrimary: isDark ? 'text-slate-200' : 'text-slate-900', // Darker for light mode
    textSecondary: isDark ? 'text-slate-400' : 'text-slate-700', // ✅ Darkened from 600 to 700
    brandText: isDark ? 'text-white' : 'text-slate-950', // ✅ Absolute contrast for brand
    accent: 'text-indigo-500'
  };

  const team = [
    { name: 'Shozab Rizvi', url: 'https://www.linkedin.com/in/shozab-rizvi' },
    { name: 'Rishabh Srivastava', url: 'https://www.linkedin.com/in/srishabh9140' },
    { name: 'Asmit Gupta', url: 'https://www.linkedin.com/in/asmit-gupta' }
  ];

  return (
    // ✅ Added "rounded-2xl" for curvy corners
    <footer className={`w-full py-4 border transition-colors duration-500 relative overflow-hidden rounded-none md:rounded-2xl ${theme.bg} ${theme.border} ${theme.textSecondary} ml-0 md:ml-[280px] pb-24 md:pb-4`}
            style={{ width: '100%', maxWidth: '100vw' }}>
      
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
        <div className="flex items-center space-x-4 hover:scale-105 transition-transform duration-300 cursor-pointer">
          <div className="w-8 h-8 shrink-0">
                  <img src="/logo.png" alt="Logo" className="w-full h-full object-contain" />
               </div>
          <div>
            <h3 className={`text-xl font-black tracking-tighter ${theme.brandText}`}>XIST INTELLIGENCE</h3>
            <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse border border-emerald-400/50"></div>
                <span className={`text-[10px] font-black uppercase tracking-[0.2em] ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>SYSTEMS ONLINE</span>
            </div>
          </div>
        </div>

        {/* Global Matrix Stats & Links */}
        <div className="flex flex-col items-center gap-4">
          <div className={`flex flex-wrap gap-8 justify-center font-black uppercase tracking-[0.15em] text-[10px] ${theme.textPrimary}`}>
            
            {/* GEMINI - Rotates right on hover */}
            {/* GEMINI - Added padding and overflow-visible to prevent cutting off */}
            <div className="flex items-center gap-2 group cursor-default hover:text-indigo-500 hover:scale-110 transition-all duration-300 px-1 overflow-visible">
              <div className="flex-shrink-0 overflow-visible">
                <CpuChipIcon className="w-4 h-4 text-indigo-500 transition-transform duration-300 group-hover:rotate-12" />
              </div> 
              <span className="whitespace-nowrap">GEMINI</span>
            </div>

            <div className="flex items-center gap-2 group cursor-default hover:text-emerald-500 hover:scale-110 transition-all duration-300">
              <ClockIcon className="w-4 h-4 text-emerald-500 transition-transform duration-300 group-hover:rotate-12" /> 
              24/7 SURVEILLANCE
            </div>

            <div className="flex items-center gap-2 group cursor-default hover:text-blue-500 hover:scale-110 transition-all duration-300">
              <GlobeAltIcon className="w-4 h-4 text-blue-500 transition-transform duration-300 group-hover:rotate-12" /> 
              GLOBAL COMMUNITY
            </div>
          </div>
          
          {/* Links Block */}
          <div className="flex flex-wrap gap-4 justify-center">
            <a href="https://github.com/ShozabRizvi/xist-ai-clean" target="_blank" rel="noreferrer" 
               className={`flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest transition-all duration-300 hover:scale-110 ${theme.textSecondary} hover:text-indigo-500`}>
              <CodeBracketIcon className="w-3.5 h-3.5" /> Source_Code
            </a>
            {team.map((m) => (
              <a key={m.name} href={m.url} target="_blank" rel="noreferrer" 
                 className={`flex items-center gap-1 text-[9px] font-black uppercase tracking-widest transition-all duration-300 hover:scale-110 ${theme.textSecondary} hover:text-blue-500`}>
                <UserCircleIcon className="w-3.5 h-3.5" /> {m.name}
              </a>
            ))}
          </div>
        </div>

        {/* Legal & Built-by */}
        <div className="text-center lg:text-right flex flex-col items-center lg:items-end gap-2">
          <div className={`text-[10px] font-black uppercase tracking-widest ${theme.textPrimary} hover:scale-105 transition-transform duration-300 cursor-default`}>
            © {currentYear} XIST AI. ALL RIGHTS RESERVED.
          </div>
          {/* ✅ Removed opacity-60 and used theme.textSecondary for higher contrast */}
          <div className={`flex items-center justify-center gap-2 text-[9px] font-black uppercase tracking-widest ${theme.textSecondary}`}>
            BUILT WITH <HeartIcon className="w-3.5 h-3.5 text-rose-500 fill-rose-500 animate-pulse" /> FOR DIGITAL_SOVEREIGNTY
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;