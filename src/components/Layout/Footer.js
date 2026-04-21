import React from 'react';

const Footer = ({ setCurrentSection }) => {
  const currentYear = new Date().getFullYear();

  const productLinks = [
    { id: 'home', label: 'Home Page' },
    { id: 'verify', label: 'Scan' },
    { id: 'analytics', label: 'Your Past History' },
    { id: 'api', label: 'Developer API' }
  ];

  const resourceLinks = [
    { id: 'protection', label: 'Helpline 24/7' },
    { id: 'community', label: 'Community' },
    { id: 'education', label: 'Education' }
  ];

  const companyLinks = [
    { id: 'about', label: 'About Xist AI' },
    { id: 'contact', label: 'Contact Support' },
    { id: 'support', label: 'Help Center' }
  ];

  return (
    <footer className="w-full relative z-20 border-t border-black/5 dark:border-white/5 bg-slate-50/60 dark:bg-[#080c1a]/60 backdrop-blur-xl mt-auto">
      {/* 🚀 REDUCED PADDING: Changed from py-10 to py-6 for a much shorter profile */}
      <div className="w-full max-w-7xl mx-auto px-6 md:px-8 py-6 md:py-8">
        
        {/* TOP GRID */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 md:gap-6 mb-6">
          
          <div className="col-span-1 md:col-span-1 flex flex-col items-start pr-4">
            <div className="flex items-center gap-3 mb-3">
              <img src="/logo.png" alt="Xist Logo" className="w-6 h-6 object-contain drop-shadow-md" />
              <span className="text-base font-black tracking-[0.2em] uppercase text-slate-900 dark:text-white">
                XIST AI
              </span>
            </div>
            <p className="text-[9px] md:text-[10px] leading-relaxed font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">
              Forensic Intelligence & Digital Sovereignty. Built to protect users and businesses from advanced digital threats.
            </p>
          </div>

          <div>
            <h3 className="text-[9px] font-black uppercase tracking-[0.2em] mb-3 text-slate-900 dark:text-white">Application</h3>
            {/* 🚀 REDUCED SPACING: Changed space-y-3 to space-y-2 */}
            <ul className="space-y-2">
              {productLinks.map((link) => (
                <li key={link.id}>
                  <button onClick={() => setCurrentSection(link.id)} className="text-[10px] font-bold uppercase tracking-widest text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-[9px] font-black uppercase tracking-[0.2em] mb-3 text-slate-900 dark:text-white">Resources</h3>
            <ul className="space-y-2">
              {resourceLinks.map((link) => (
                <li key={link.id}>
                  <button onClick={() => setCurrentSection(link.id)} className="text-[10px] font-bold uppercase tracking-widest text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-[9px] font-black uppercase tracking-[0.2em] mb-3 text-slate-900 dark:text-white">Company</h3>
            <ul className="space-y-2">
              {companyLinks.map((link) => (
                <li key={link.id}>
                  <button onClick={() => setCurrentSection(link.id)} className="text-[10px] font-bold uppercase tracking-widest text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* BOTTOM ROW */}
        <div className="pt-4 border-t border-black/5 dark:border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">
            © {currentYear} XIST AI. ALL RIGHTS RESERVED.
          </p>
          
          <div className="flex items-center gap-6">
            <button onClick={() => setCurrentSection('privacy')} className="text-[9px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
              Privacy Policy
            </button>
            <button onClick={() => setCurrentSection('terms')} className="text-[9px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
              Terms of Service
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;