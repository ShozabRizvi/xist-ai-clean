import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FingerPrintIcon, ShieldCheckIcon, CpuChipIcon } from '@heroicons/react/24/outline';

const useTypewriter = (text, speed = 50) => {
  const [displayed, setDisplayed] = useState("");
  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      setDisplayed(text.substring(0, i + 1));
      i++;
      if (i >= text.length) clearInterval(interval);
    }, speed);
    return () => clearInterval(interval);
  }, [text, speed]);
  return displayed;
};

export default function LoginScreen({ login, loading }) {
  const typingText = useTypewriter("XIST_AI // FORENSIC_NODE_LOCKED", 60);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#020617] text-slate-100 overflow-hidden">
      
      {/* TACTICAL GRID BACKGROUND */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.05]" 
           style={{ backgroundImage: 'linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
      <div className="absolute inset-0 pointer-events-none opacity-30 bg-gradient-to-tr from-indigo-500/20 via-rose-500/10 to-transparent"></div>

      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.5 }}
                  className="relative z-10 max-w-md w-full p-8 rounded-[2rem] bg-slate-900 border border-slate-800 shadow-[0_0_50px_rgba(99,102,241,0.1)] text-center">
        
        <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center relative">
          <div className="absolute inset-0 rounded-2xl border border-indigo-500/50 animate-ping opacity-20"></div>
          <FingerPrintIcon className="w-10 h-10 text-indigo-400" />
        </div>

        <h1 className="text-xl font-black font-mono tracking-widest uppercase mb-2 flex justify-center items-center h-8 text-rose-500">
          {typingText}
          <motion.span animate={{ opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 0.8 }} className="w-2 h-5 bg-rose-500 inline-block ml-1" />
        </h1>
        
        <p className="text-xs text-slate-400 font-mono mb-10 leading-relaxed uppercase tracking-widest">
          Unauthorized access prohibited. Establish secure Google OAuth handshake to proceed.
        </p>

        <button 
          onClick={login}
          disabled={loading}
          className="w-full relative group overflow-hidden rounded-xl p-[1px]"
        >
          <span className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-rose-500 opacity-70 group-hover:opacity-100 transition-opacity"></span>
          <div className="relative flex items-center justify-center gap-3 bg-slate-950 px-6 py-4 rounded-xl transition-all group-hover:bg-slate-900">
            {loading ? (
              <CpuChipIcon className="w-6 h-6 text-indigo-400 animate-pulse" />
            ) : (
              <ShieldCheckIcon className="w-6 h-6 text-emerald-400" />
            )}
            <span className="font-black tracking-widest text-xs uppercase text-slate-100">
              {loading ? 'Negotiating...' : 'Initiate Secure Handshake'}
            </span>
          </div>
        </button>

      </motion.div>
    </div>
  );
}