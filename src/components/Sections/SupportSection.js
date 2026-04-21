import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MagnifyingGlassIcon, ChevronDownIcon, ShieldCheckIcon, 
  CpuChipIcon, DocumentMagnifyingGlassIcon, EyeSlashIcon, 
  BoltIcon, FingerPrintIcon, LifebuoyIcon, BookOpenIcon,
  ArrowLeftIcon
} from '@heroicons/react/24/outline';

// ==============================
// UTILITY: TYPEWRITER EFFECT
// ==============================
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
      const timeout = setTimeout(() => {
        setDisplayedText(text.slice(0, displayedText.length + 1));
      }, speed);
      return () => clearTimeout(timeout);
    }
  }, [displayedText, text, speed, started]);
  return displayedText;
};

// ==============================
// FAQ DATA
// ==============================
const FAQS = [
  {
    category: 'How to Use Xist',
    icon: BookOpenIcon,
    questions: [
      { q: 'How do I check a suspicious text message or email?', a: 'Go to the Verify section, select "Text", paste the message into the box, and click Analyze. The AI will look for manipulation tactics and scam markers.' },
      { q: 'How do I check if a website link is safe?', a: 'Select "URL" mode in the Verify section and paste the link. Xist AI will securely scan the website without you having to open the dangerous page yourself.' },
      { q: 'Can I check PDF bank statements for fakes?', a: 'Yes. Select "Document" mode and upload the PDF. The system will extract the text and analyze it for logical inconsistencies or typical phishing words.' },
      { q: 'How do I test a voice note or video for Deepfakes?', a: 'Select the matching "Media" mode and upload your video or audio file. The engine will look for unnatural audio jitter or visual errors.' }
    ]
  },
  {
    category: 'App Limits',
    icon: CpuChipIcon,
    questions: [
      { q: 'Is there a file size limit for uploads?', a: 'Yes. To keep the app running fast, media files should be kept under standard short-clip sizes. Massive 4K videos may time out during upload.' },
      { q: 'Can the AI scan YouTube videos directly?', a: 'URL mode currently only scans web page text. To analyze a specific video for deepfakes, you must download the clip and upload it via "Video" mode.' },
      { q: 'What languages does Xist support?', a: 'The AI engine is highly proficient in English, Hindi, and multiple global languages, allowing it to detect scams across borders.' },
      { q: 'Why did my document extraction fail?', a: 'If your PDF is essentially a "picture" of text (scanned without a text layer), the parser cannot read it. You may need to screenshot the document and upload it via "Image" mode instead.' }
    ]
  },
  {
    category: 'AI Scores',
    icon: DocumentMagnifyingGlassIcon,
    questions: [
      { q: 'What does the "Emotional Intensity" score mean?', a: 'A high score means the content is designed to trigger fear, urgency, or outrage to bypass your logical thinking—a classic hallmark of scams.' },
      { q: 'What is the "Logical Consistency" metric?', a: 'This checks if the claims make logical sense. A low score means the argument or the structure of the media falls apart under close inspection.' },
      { q: 'Why did my real photo get a "Questionable" score?', a: 'Heavy editing, Instagram filters, or low-resolution compression can strip away natural data. The AI flags these because the image has been unnaturally altered.' },
      { q: 'What is an "AI Fingerprint"?', a: 'AI text generators overuse specific patterns and words (like "delve" or overly perfect grammar). Our system detects this lack of human writing style.' }
    ]
  },
  {
    category: 'Privacy',
    icon: EyeSlashIcon,
    questions: [
      { q: 'Are my uploaded files stored permanently?', a: 'Absolutely not. Once the analysis is complete, your temporary media or document file is permanently deleted from our servers.' },
      { q: 'Is my search history public?', a: 'Only if you explicitly click "Share to Community". Otherwise, your scans remain strictly in your private history log.' },
      { q: 'Does Xist read my personal phone data?', a: 'No. The app is completely sandboxed. It can only analyze the exact text, link, or file you manually submit.' }
    ]
  }
];

export default function SupportSection() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState(null); // Controls the "Rolling" Animation Flow
  const [expandedFaq, setExpandedFaq] = useState(null);

  const typingTitle = useTypewriterEffect("Help Center", 80, 200);

  const toggleFaq = (id) => {
    setExpandedFaq(expandedFaq === id ? null : id);
  };

  // Search Logic
  const allQuestions = FAQS.flatMap(cat => cat.questions);
  const searchResults = searchQuery 
    ? allQuestions.filter(q => q.q.toLowerCase().includes(searchQuery.toLowerCase()) || q.a.toLowerCase().includes(searchQuery.toLowerCase()))
    : [];

  return (
    // 🚀 FIX: Removed hardcoded marginLeft so it aligns perfectly with the sidebar layout
    <div className="w-full min-h-screen relative overflow-x-hidden" style={{ marginTop: '64px' }}>
      
      {/* 🌐 GLOBAL GRID BACKGROUND OVERLAY */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] dark:invert-0 invert z-0" 
           style={{ backgroundImage: 'linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>

      {/* ========================================= */}
      {/* 🚀 HERO HEADER                            */}
      {/* ========================================= */}
      <div className="sticky top-0 z-30 px-4 py-8 md:py-12 transition-all overflow-visible bg-transparent">
        <div className="absolute inset-0 pointer-events-none opacity-[0.05] md:opacity-[0.03] dark:invert-0 invert z-0" 
             style={{ backgroundImage: 'linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>

        <div className="max-w-4xl mx-auto flex flex-col items-center justify-center relative z-10 overflow-visible">
          <LifebuoyIcon className="w-10 h-10 md:w-14 md:h-14 mb-5 stroke-[1.5] text-indigo-500 dark:text-indigo-400" />
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-center mb-2 pb-4 leading-normal tracking-tight text-slate-900 dark:text-white">
            <span className="text-brand-highlight">{typingTitle}</span>
            <motion.span animate={{ opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 0.9 }} className="inline-block w-2.5 md:w-3 h-[0.8em] bg-indigo-500 dark:bg-indigo-400 ml-2 align-baseline" />
          </h1>
          
          <p className="text-[9px] md:text-[11px] font-mono font-bold uppercase tracking-[0.3em] md:tracking-[0.4em] text-slate-600 dark:text-slate-400 mb-4 text-center px-4">
            Here to help you navigate Xist safely.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto relative z-10 px-4 md:px-8 py-4 pb-24">
        
        {/* ========================================= */}
        {/* 🚀 STICKY SEARCH BAR                      */}
        {/* ========================================= */}
        <div className="relative mb-8">
          <MagnifyingGlassIcon className="w-5 h-5 absolute left-6 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Search for guides, errors, or limits..."
            value={searchQuery}
            onChange={(e) => { setSearchQuery(e.target.value); setActiveCategory(null); }}
            className="w-full pl-14 pr-6 py-5 rounded-full text-sm font-bold outline-none transition-all shadow-[0_15px_40px_rgba(0,0,0,0.15)] glass-input text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400"
          />
        </div>

        {/* ========================================= */}
        {/* 🚀 DYNAMIC ROLLING VIEW INTERFACE         */}
        {/* ========================================= */}
        <AnimatePresence mode="wait">
          
          {/* STATE 1: SEARCH RESULTS */}
          {searchQuery ? (
            <motion.div key="search-results" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-4">
              <h3 className="text-xs font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 ml-2 mb-4">Search Results</h3>
              {searchResults.length > 0 ? searchResults.map((faq, idx) => (
                <div key={idx} className="glass-card rounded-2xl overflow-hidden">
                  <div className="p-5">
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-2">{faq.q}</h4>
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium">{faq.a}</p>
                  </div>
                </div>
              )) : (
                <div className="glass-card p-12 text-center rounded-[2rem] flex flex-col items-center justify-center">
                  <FingerPrintIcon className="w-12 h-12 text-slate-500 opacity-50 mb-4" />
                  <p className="text-xs font-mono uppercase text-slate-500">No articles match your search.</p>
                </div>
              )}
            </motion.div>
          ) 
          
          /* STATE 2: TOPIC DRILL-DOWN (The Questions) */
          : activeCategory ? (
            <motion.div key="category-view" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 50 }} transition={{ type: 'spring', stiffness: 300, damping: 30 }} className="space-y-6">
              
              {/* Back Button */}
              <button 
                onClick={() => { setActiveCategory(null); setExpandedFaq(null); }}
                className="flex items-center gap-2 px-4 py-2 rounded-full glass-input text-[10px] font-black uppercase tracking-widest text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all"
              >
                <ArrowLeftIcon className="w-4 h-4" /> Back to Dashboard
              </button>

              {/* Topic Header */}
              <div className="glass-card p-8 rounded-[2rem] flex items-center gap-5">
                <div className="p-4 bg-indigo-500/10 rounded-2xl">
                  <activeCategory.icon className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
                </div>
                <div>
                  <h2 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white">{activeCategory.category}</h2>
                  <p className="text-[10px] font-mono uppercase tracking-widest text-slate-500 mt-1">Select a question to expand</p>
                </div>
              </div>

              {/* Accordion List */}
              <div className="space-y-3">
                {activeCategory.questions.map((faq, idx) => {
                  const isOpen = expandedFaq === idx;
                  return (
                    <div key={idx} className={`rounded-2xl overflow-hidden transition-all duration-300 ${isOpen ? 'glass-card border border-indigo-500/50 shadow-[0_0_20px_rgba(79,70,229,0.15)]' : 'glass-input'}`}>
                      <button onClick={() => toggleFaq(idx)} className="w-full p-5 flex items-start justify-between text-left focus:outline-none gap-4">
                        <div className={`text-xs md:text-sm font-bold leading-relaxed ${isOpen ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-900 dark:text-white'}`}>
                          {faq.q}
                        </div>
                        <motion.div animate={{ rotate: isOpen ? 180 : 0 }} className="shrink-0 mt-0.5">
                          <ChevronDownIcon className={`w-5 h-5 ${isOpen ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-500'}`} />
                        </motion.div>
                      </button>
                      <AnimatePresence>
                        {isOpen && (
                          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}>
                            <p className="px-5 pb-5 text-xs md:text-sm leading-relaxed text-slate-700 dark:text-slate-300 font-medium border-t border-black/5 dark:border-white/5 pt-4">
                              {faq.a}
                            </p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          ) 
          
          /* STATE 3: MAIN DASHBOARD (The Puzzle Bento Grid) */
          : (
            <motion.div key="bento-dashboard" initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} transition={{ type: 'spring', stiffness: 300, damping: 30 }} className="space-y-8">
              
              {/* TOP BENTO: Quick Guides */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Guide 1 */}
                <div className="glass-card p-6 md:p-8 rounded-[2rem] border-t-4 border-t-indigo-500 group hover:-translate-y-1 transition-transform">
                  <div className="flex items-center gap-3 mb-6">
                    <BoltIcon className="w-6 h-6 text-indigo-500 shrink-0" />
                    <h3 className="text-xs font-black uppercase tracking-widest text-slate-900 dark:text-white">Quick Start</h3>
                  </div>
                  <div className="relative border-l-2 border-indigo-500/30 ml-3 space-y-5">
                    {[
                      { step: "1. Select", desc: "Choose Text, URL, Document, or Media." },
                      { step: "2. Scan", desc: "Provide data and let the AI process it." },
                      { step: "3. Act", desc: "Read the report. If CRITICAL, block the sender." }
                    ].map((item, i) => (
                      <div key={i} className="relative pl-5 w-full">
                        <div className="absolute w-3 h-3 bg-indigo-500 rounded-full -left-[7px] top-0.5 shadow-[0_0_10px_#6366f1]" />
                        <h4 className="text-[10px] font-black uppercase text-slate-900 dark:text-white">{item.step}</h4>
                        <p className="text-[10px] font-medium text-slate-600 dark:text-slate-400 mt-1">{item.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Guide 2 */}
                <div className="glass-card p-6 md:p-8 rounded-[2rem] border-l-4 border-l-rose-500 group hover:-translate-y-1 transition-transform">
                  <div className="flex items-center gap-3 mb-6">
                    <ShieldCheckIcon className="w-6 h-6 text-rose-500 shrink-0" />
                    <h3 className="text-xs font-black uppercase tracking-widest text-slate-900 dark:text-white">Threat Levels</h3>
                  </div>
                  <div className="space-y-4">
                    {[
                      { label: "SAFE", range: "80-100%", color: "text-emerald-500", desc: "Content looks completely natural." },
                      { label: "CAUTION", range: "40-79%", color: "text-amber-500", desc: "AI detected mild manipulation." },
                      { label: "CRITICAL", range: "0-39%", color: "text-rose-500", desc: "High chance of a Deepfake/Scam." }
                    ].map((legend, i) => (
                      <div key={i} className="p-3 rounded-xl glass-input w-full flex items-center gap-4">
                        <div className={`w-2 h-2 rounded-full ${legend.color.replace('text-', 'bg-')} shadow-[0_0_8px_currentColor] shrink-0`} />
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 mb-0.5">
                            <span className={`${legend.color} font-black text-[10px] uppercase tracking-widest`}>{legend.label}</span>
                            <span className="text-slate-500 font-mono text-[9px]">{legend.range}</span>
                          </div>
                          <p className="text-[10px] text-slate-600 dark:text-slate-300 font-medium truncate">{legend.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* BOTTOM BENTO: Interactive Topics Grid */}
              <div className="pt-4">
                <h3 className="text-xs font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 ml-2 mb-4">Browse Topics</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {FAQS.map((cat, i) => (
                    <button 
                      key={i} 
                      onClick={() => setActiveCategory(cat)}
                      className="glass-card p-6 md:p-8 rounded-[2rem] flex flex-col items-center justify-center gap-4 hover:scale-105 hover:shadow-[0_0_30px_rgba(79,70,229,0.2)] hover:border-indigo-500/50 transition-all duration-300 group"
                    >
                      <div className="p-4 rounded-2xl bg-black/5 dark:bg-white/5 group-hover:bg-indigo-500/20 transition-colors">
                        <cat.icon className="w-8 h-8 text-slate-600 dark:text-slate-300 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors" />
                      </div>
                      <span className="text-[10px] md:text-[11px] font-black uppercase tracking-widest text-center text-slate-900 dark:text-white leading-relaxed">
                        {cat.category}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
              
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}