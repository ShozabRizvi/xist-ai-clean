import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheckIcon } from '@heroicons/react/24/outline';

export default function PrivacyPolicy() {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full min-h-screen pb-24 relative z-10" style={{ marginTop: '64px' }}>
      <div className="max-w-4xl mx-auto px-4 md:px-8 py-12">
        
        <div className="text-center mb-12">
          <ShieldCheckIcon className="w-12 h-12 mx-auto text-indigo-500 mb-4" />
          <h1 className="text-4xl md:text-5xl font-black mb-4 text-slate-900 dark:text-white">
            Privacy <span className="text-brand-highlight">Policy</span>
          </h1>
          <p className="text-xs font-mono uppercase tracking-widest text-slate-500">Last Updated: {new Date().toLocaleDateString()}</p>
        </div>

        <div className="glass-card p-8 md:p-12 rounded-[2.5rem] space-y-8 text-slate-700 dark:text-slate-300 text-sm md:text-base font-medium leading-relaxed shadow-xl">
          <section>
            <h2 className="text-lg font-black uppercase tracking-widest text-slate-900 dark:text-white mb-3">1. Data Collection</h2>
            <p>Xist AI is built on the principle of digital sovereignty. We do not permanently store the media, text, or documents you upload for analysis. All files are processed in secure, temporary memory and are immediately deleted upon report generation.</p>
          </section>

          <section>
            <h2 className="text-lg font-black uppercase tracking-widest text-slate-900 dark:text-white mb-3">2. Community Feed</h2>
            <p>If you choose to publish a threat to the Community Feed, the specific text, title, and media you attach will be made public. Your identity will be displayed based on your selected profile settings. You retain the right to delete your community posts at any time.</p>
          </section>

          <section>
            <h2 className="text-lg font-black uppercase tracking-widest text-slate-900 dark:text-white mb-3">3. Third-Party Processing</h2>
            <p>To provide advanced intelligence, Xist AI securely transmits encrypted query data to our secure language model partners (e.g., Google Gemini API). These partners are strictly bound by agreements prohibiting the use of your data for training their public models.</p>
          </section>

          <section>
            <h2 className="text-lg font-black uppercase tracking-widest text-slate-900 dark:text-white mb-3">4. Contact & Compliance</h2>
            <p>For questions regarding your data privacy, or to request a complete purge of your account history, please use the Contact Support page to reach our Core Engineering team.</p>
          </section>
        </div>
      </div>
    </motion.div>
  );
}