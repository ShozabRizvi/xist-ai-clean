import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { XMarkIcon } from '@heroicons/react/24/outline';

// Custom SVG for LinkedIn to keep it completely independent
const LinkedInIcon = ({ className }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
  </svg>
);

const Footer = ({ setCurrentSection, theme }) => {
  const [showQRPopup, setShowQRPopup] = useState(false);
  const currentYear = new Date().getFullYear();

  const productLinks = [
    { id: 'home', label: 'Dashboard' },
    { id: 'verify', label: 'Ask Xist' },
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
    <>
      {/* 🚀 GLASSY QR POPUP MODAL */}
      <AnimatePresence>
        {showQRPopup && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[100] flex items-center justify-center p-4" onClick={() => setShowQRPopup(false)}>
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }} 
              animate={{ scale: 1, opacity: 1 }} 
              exit={{ scale: 0.95, opacity: 0 }}
              className="glass-card p-8 rounded-[2.5rem] max-w-sm w-full shadow-2xl relative border border-black/10 dark:border-white/10" 
              onClick={e => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-widest">Access Mobile</h3>
                <button onClick={() => setShowQRPopup(false)} className="p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-full transition-colors">
                  <XMarkIcon className="w-5 h-5 text-slate-500" />
                </button>
              </div>
              <div className="text-center">
                <div className="bg-white/60 dark:bg-white/5 p-4 rounded-[2rem] mx-auto mb-6 w-48 h-48 flex items-center justify-center shadow-inner border border-black/10 dark:border-white/10 backdrop-blur-xl">
                  <img src={theme === 'dark' ? '/qrcode28.png' : '/qrcode26.png'} alt="QR Code" className="w-full h-full rounded-xl object-contain" />
                </div>
                <p className="text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">Scan to download the app</p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <footer className="w-full relative z-0 bg-transparent mt-12 pb-6">
        <div className="w-full max-w-7xl mx-auto px-6 md:px-8 py-10 border-t border-black/10 dark:border-white/10">
          
          {/* 🚀 TOP GRID: 5-column layout */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-10 md:gap-8 mb-12">
            
            {/* COLUMN 1: Logo, Description, and QR Code */}
            <div className="col-span-1 md:col-span-2 flex flex-col items-start pr-4">
              <div className="flex items-center gap-3 mb-4">
                <img src="/logo.png" alt="Xist Logo" className="w-8 h-8 md:w-10 md:h-10 object-contain drop-shadow-md" />
                {/* 🚀 FONT INCREASED */}
                <span className="text-2xl md:text-3xl font-black tracking-widest text-slate-900 dark:text-white">
                  XIST AI
                </span>
              </div>
              
              {/* 🚀 FONT INCREASED */}
              <p className="text-base md:text-lg leading-relaxed text-slate-500 dark:text-slate-400 mb-6 max-w-sm">
                Forensic Intelligence & Digital Sovereignty. Built to protect users and businesses from advanced digital threats, deepfakes, and misinformation.
              </p>

              {/* 🚀 CLICKABLE QR CODE IMPLEMENTATION */}
              <div className="flex flex-col gap-2 mt-2 cursor-pointer group" onClick={() => setShowQRPopup(true)}>
                 <span className="text-xs md:text-sm font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest group-hover:text-indigo-500 transition-colors">
                   Scan to Access Mobile App
                 </span>
                 <div className="w-max p-2.5 md:p-3 rounded-[1rem] bg-white/30 dark:bg-white/5 backdrop-blur-xl border border-black/10 dark:border-white/10 shadow-sm transition-transform group-hover:scale-105">
                   <img 
                     src={theme === 'dark' ? '/qrcode28.png' : '/qrcode26.png'} 
                     alt="Mobile App QR Code" 
                     className="w-20 h-20 md:w-28 md:h-28 object-contain" 
                   />
                 </div>
              </div>
            </div>

            {/* COLUMN 2: Application Links */}
            <div className="col-span-1">
              <h3 className="text-base md:text-lg font-black mb-5 text-slate-900 dark:text-white uppercase tracking-wider">Application</h3>
              <ul className="space-y-4">
                {productLinks.map((link) => (
                  <li key={link.id}>
                    <button onClick={() => setCurrentSection(link.id)} className="text-base md:text-lg font-medium text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 transition-colors">
                      {link.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* COLUMN 3: Resources Links */}
            <div className="col-span-1">
              <h3 className="text-base md:text-lg font-black mb-5 text-slate-900 dark:text-white uppercase tracking-wider">Resources</h3>
              <ul className="space-y-4">
                {resourceLinks.map((link) => (
                  <li key={link.id}>
                    <button onClick={() => setCurrentSection(link.id)} className="text-base md:text-lg font-medium text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 transition-colors">
                      {link.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* COLUMN 4: Company Links */}
            <div className="col-span-1">
              <h3 className="text-base md:text-lg font-black mb-5 text-slate-900 dark:text-white uppercase tracking-wider">Company</h3>
              <ul className="space-y-4">
                {companyLinks.map((link) => (
                  <li key={link.id}>
                    <button onClick={() => setCurrentSection(link.id)} className="text-base md:text-lg font-medium text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 transition-colors">
                      {link.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* 🚀 BOTTOM ROW: Stacked Copyright, Razorpay, LinkedIn */}
          <div className="pt-6 border-t border-black/10 dark:border-white/10 flex flex-col md:flex-row justify-between items-center gap-8">
            
            {/* 🚀 STACKED LINKS AND COPYRIGHT */}
            <div className="flex flex-col items-center md:items-start gap-3 text-center md:text-left">
              <div className="flex items-center gap-6">
                <button onClick={() => setCurrentSection('privacy')} className="text-base font-medium text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 transition-colors">
                  Privacy Policy
                </button>
                <button onClick={() => setCurrentSection('terms')} className="text-base font-medium text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 transition-colors">
                  Terms of Service
                </button>
              </div>
              <p className="text-sm md:text-base font-medium text-slate-500 dark:text-slate-400/70">
                © {currentYear} Xist AI. All rights reserved.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row items-center gap-6">
              {/* Razorpay Indicator */}
              <div className="flex items-center gap-2 px-4 py-2 rounded-lg border border-black/10 dark:border-white/10 bg-slate-50 dark:bg-slate-800/50 shadow-sm">
                <span className="text-[10px] md:text-xs font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">Secured By</span>
                <span className="text-sm md:text-base font-black tracking-tight text-[#02042B] dark:text-white">Razorpay</span>
              </div>
              
              {/* LinkedIn Only Link */}
              <a 
                href="https://www.linkedin.com/in/shozab-rizvi" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="p-2 rounded-full text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 transition-all"
                aria-label="LinkedIn"
              >
                <LinkedInIcon className="w-6 h-6 md:w-7 md:h-7" />
              </a>
            </div>

          </div>

        </div>
      </footer>
    </>
  );
};

export default Footer;