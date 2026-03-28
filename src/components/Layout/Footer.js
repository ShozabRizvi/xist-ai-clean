import React from 'react';
import { CodeBracketIcon, UserCircleIcon, HeartIcon } from '@heroicons/react/24/outline';

const Footer = ({ theme: globalTheme = 'dark' }) => {
  const isDark = globalTheme === 'dark';
  const currentYear = new Date().getFullYear();
  
  const theme = {
    bg: isDark ? 'bg-[#020617]' : 'bg-slate-50',
    border: isDark ? 'border-slate-800/60' : 'border-slate-200',
    textPrimary: isDark ? 'text-slate-200' : 'text-slate-900', 
    textSecondary: isDark ? 'text-slate-400' : 'text-slate-700', 
    brandText: isDark ? 'text-white' : 'text-slate-950', 
    accent: 'text-indigo-500'
  };

  const team = [
    { name: 'Shozab Rizvi', url: 'https://www.linkedin.com/in/shozab-rizvi' },
    { name: 'Rishabh Srivastava', url: 'https://www.linkedin.com/in/srishabh9140' },
    { name: 'Asmit Gupta', url: 'https://www.linkedin.com/in/asmit-gupta' }
  ];

  return (
    <footer className={`w-full py-8 md:py-10 border transition-colors duration-500 relative overflow-hidden rounded-none md:rounded-2xl ${theme.bg} ${theme.border} ml-0 md:ml-[280px] pb-24 md:pb-8`}
            style={{ width: '100%', maxWidth: '100vw' }}>
      
      {/* 🟦 CURVY TACTICAL CORNER BARS */}
      <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-indigo-500/50 rounded-tl-2xl"></div>
      <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-indigo-500/50 rounded-tr-2xl"></div>
      <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-indigo-500/50 rounded-bl-2xl"></div>
      <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-indigo-500/50 rounded-br-2xl"></div>

      {/* 🚨 ADAPTIVE GRID CONTINUITY */}
      <div className={`absolute inset-0 pointer-events-none opacity-[0.04] ${isDark ? '' : 'invert'}`} 
           style={{ backgroundImage: 'linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>

      {/* MAIN CONTAINER */}
      <div className="max-w-7xl mx-auto px-6 md:px-10 flex flex-col gap-10 relative z-10 w-full">
        
        {/* ============================== */}
        {/* TOP SECTION: CENTERED BRAND & LINKS */}
        {/* ============================== */}
        <div className="flex flex-col items-center justify-center w-full gap-6">
          
          <div className="flex flex-col items-center space-y-3 hover:scale-110 transition-transform duration-300 cursor-pointer p-2 overflow-visible">
            <div className="w-10 h-10 shrink-0 overflow-visible">
               <img src="/logo.png" alt="Logo" className="w-full h-full object-contain drop-shadow-lg" />
            </div>
            <div className="text-center">
              <h3 className={`text-xl font-black tracking-tighter ${theme.brandText}`}>XIST INTELLIGENCE</h3>
              <div className="flex items-center justify-center gap-2 mt-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse border border-emerald-400/50"></div>
                  <span className={`text-[10px] font-black uppercase tracking-[0.2em] ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>SYSTEMS ONLINE</span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-4 md:gap-8 justify-center items-center mt-2">
            <a href="https://github.com/ShozabRizvi/xist-ai-clean" target="_blank" rel="noreferrer" 
               className={`flex items-center gap-1.5 px-2 py-1 text-[10px] font-black uppercase tracking-widest transition-all duration-300 hover:scale-110 ${theme.textSecondary} hover:text-indigo-500`}>
              <CodeBracketIcon className="w-4 h-4 shrink-0" /> Source Code
            </a>
            
            {team.map((m) => (
              <a key={m.name} href={m.url} target="_blank" rel="noreferrer" 
                 className={`flex items-center gap-1.5 px-2 py-1 text-[10px] font-black uppercase tracking-widest transition-all duration-300 hover:scale-110 ${theme.textSecondary} hover:text-blue-500`}>
                <UserCircleIcon className="w-4 h-4 shrink-0" /> {m.name}
              </a>
            ))}
          </div>

        </div>

        {/* ============================================================ */}
        {/* ✅ FIXED BOTTOM SECTION: Center-Aligned & No Clipping         */}
        {/* ============================================================ */}
        <div className={`flex flex-col-reverse md:flex-row items-center justify-between w-full gap-4 pt-10 pb-6 border-t ${theme.border} overflow-visible`}>
          
          {/* ✅ FIXED: Two-Line Copyright with Safe-Zone Padding */}
          <div className="px-4 py-4 overflow-visible">
            <div className={`text-[9px] font-black uppercase tracking-widest transition-all duration-300 hover:scale-110 cursor-default inline-block ${theme.textSecondary} hover:text-indigo-400 leading-relaxed`}>
              © {currentYear} &nbsp; &nbsp; XIST AI <br /> 
              ALL RIGHTS RESERVED.
            </div>
          </div>
          
          {/* Built With Section - Centered with safe-zone padding */}
          <div className="px-4 py-2 overflow-visible text-center">
            <div className={`flex items-center justify-center gap-2 text-[9px] font-black uppercase tracking-widest transition-all duration-300 hover:scale-110 cursor-default inline-block ${theme.textSecondary} hover:text-rose-400`}>
              <span className="flex items-center gap-2">
                BUILT WITH <HeartIcon className="w-3.5 h-3.5 text-rose-500 fill-rose-500 animate-pulse shrink-0" /> FOR DIGITAL SOVEREIGNTY
              </span>
            </div>
          </div>

        </div>

      </div>
    </footer>
  );
};

export default Footer;