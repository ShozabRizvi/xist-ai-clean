import React from 'react';
import { motion } from 'framer-motion';
import { DocumentTextIcon } from '@heroicons/react/24/outline';

export default function TermsOfService() {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full min-h-screen pb-24 relative z-10" style={{ marginTop: '64px' }}>
      <div className="max-w-4xl mx-auto px-4 md:px-8 py-12">
        
        <div className="text-center mb-12">
          <DocumentTextIcon className="w-12 h-12 mx-auto text-indigo-500 mb-4" />
          <h1 className="text-4xl md:text-5xl font-black mb-4 text-slate-900 dark:text-white">
            Terms of <span className="text-brand-highlight">Service</span>
          </h1>
          <p className="text-xs font-mono uppercase tracking-widest text-slate-500">Effective Date: {new Date().toLocaleDateString()}</p>
        </div>

        <div className="glass-card p-8 md:p-12 rounded-[2.5rem] space-y-8 text-slate-700 dark:text-slate-300 text-sm md:text-base font-medium leading-relaxed shadow-xl">
          <section>
            <h2 className="text-lg font-black uppercase tracking-widest text-slate-900 dark:text-white mb-3">1. Acceptance of Terms</h2>
            <p>By accessing or utilizing the Xist AI platform, you agree to be bound by these Terms of Service. If you do not agree with any part of these terms, you must immediately cease use of the system.</p>
          </section>

          <section>
            <h2 className="text-lg font-black uppercase tracking-widest text-slate-900 dark:text-white mb-3">2. System Usage & Limitations</h2>
            <p>Xist AI provides forensic intelligence and triage tools. While our models are highly accurate, they are designed as advisory tools and should not replace professional legal, financial, or law enforcement advice. You agree not to use the system to upload illegal material, harass others, or reverse-engineer the detection algorithms.</p>
          </section>

          <section>
            <h2 className="text-lg font-black uppercase tracking-widest text-slate-900 dark:text-white mb-3">3. Community Guidelines</h2>
            <p>Users engaging with the Community Feed must maintain a professional and safe environment. Xist AI reserves the right to remove any content or terminate access for users who post misleading, harmful, or inappropriate material.</p>
          </section>

          <section>
            <h2 className="text-lg font-black uppercase tracking-widest text-slate-900 dark:text-white mb-3">4. Limitation of Liability</h2>
            <p>Xist AI and its developers are not liable for any financial losses, data breaches, or damages resulting from your reliance on the platform's analysis. Users assume all responsibility for actions taken based on our threat reports.</p>
          </section>
        </div>
      </div>
    </motion.div>
  );
}