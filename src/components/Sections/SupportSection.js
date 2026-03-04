import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MagnifyingGlassIcon, ChevronDownIcon, ShieldCheckIcon, 
  CpuChipIcon, DocumentMagnifyingGlassIcon, EyeSlashIcon, 
  BoltIcon, FingerPrintIcon, LifebuoyIcon, BookOpenIcon
} from '@heroicons/react/24/outline';
import { useResponsive } from '../../hooks/useResponsive';

// ==============================
// 100% ADAPTIVE THEME MATRIX
// ==============================
const THEMES = {
  dark: {
    background: 'bg-[#020617]',
    card: 'bg-slate-900 border border-slate-800 shadow-2xl',
    inner: 'bg-slate-950 border-slate-800',
    textPrimary: 'text-slate-100',
    textSecondary: 'text-slate-400',
    muted: 'text-slate-500',
    accent: 'text-indigo-400',
    input: 'bg-slate-950 border-slate-800 text-indigo-400 placeholder-slate-700 focus:border-indigo-500/50',
    glow: 'from-indigo-500/10 via-rose-500/5 to-transparent',
    iconContainer: 'bg-slate-800/50'
  },
  light: {
    background: 'bg-slate-50',
    card: 'bg-white border border-slate-200 shadow-xl',
    inner: 'bg-slate-100 border-slate-200',
    textPrimary: 'text-slate-900',
    textSecondary: 'text-slate-700',
    muted: 'text-slate-600',
    accent: 'text-indigo-600',
    input: 'bg-white border-slate-300 text-indigo-600 placeholder-slate-500 focus:border-indigo-500',
    glow: 'from-indigo-500/5 via-rose-500/5 to-transparent',
    iconContainer: 'bg-slate-200'
  }
};

// ==============================
// TYPEWRITER EFFECT HOOK
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
// MASSIVE FAQ DATABASE FOR SEARCH
// ==============================
const FAQS = [
  {
    category: 'Operator Guide (How to Use)',
    icon: BookOpenIcon,
    questions: [
      { q: 'How do I scan a suspicious text message or email?', a: 'Navigate to the Verify section, select "Text" mode, paste the suspicious content into the terminal, and click Analyze. The AI will extract psychological manipulation tactics and scam markers.' },
      { q: 'How do I check if a website link is safe?', a: 'Select "URL" mode in the Verify section and paste the link. Xist AI will scrape the target page securely and analyze its contents without you having to open the malicious site yourself.' },
      { q: 'Can I upload a PDF bank statement to check for forgery?', a: 'Yes. Select "Document" mode and upload the PDF. The backend uses PyPDF2 to extract the raw text and analyze it for logical inconsistencies or typical phishing terminology.' },
      { q: 'How do I test a voice note or video for Deepfakes?', a: 'Select the corresponding "Media" mode and upload your .webm, .mp4, or .mp3 file. The engine will look for acoustic jitter or lighting asymmetry.' }
    ]
  },
  {
    category: 'System Capabilities & Limits',
    icon: CpuChipIcon,
    questions: [
      { q: 'Is there a file size limit for uploads?', a: 'Currently, to ensure rapid forensic turnaround and prevent memory overloads, media files should be kept under standard short-clip sizes. Massive 4K videos may time out.' },
      { q: 'Can the AI scan YouTube videos directly?', a: 'URL mode currently scrapes web page text. To analyze a specific video for deepfakes, you must download the clip and upload it via "Video" mode.' },
      { q: 'What languages does Xist AI support?', a: 'The Gemini-powered semantic engine is highly proficient in English, Hindi, and multiple global languages, allowing it to detect scams and disinformation across borders.' },
      { q: 'Why did my document extraction fail?', a: 'If your PDF is essentially an "image" of text (scanned without OCR), the PyPDF2 parser cannot read the text layers. You may need to screenshot the document and upload it via "Image" mode instead.' }
    ]
  },
  {
    category: 'Understanding The Intelligence Report',
    icon: DocumentMagnifyingGlassIcon,
    questions: [
      { q: 'What does the "Emotional Intensity" score mean?', a: 'High emotional intensity indicates the content is engineered to bypass your rational thinking by triggering fear, urgency, or outrage—a classic hallmark of both scams and political disinformation.' },
      { q: 'What is the "Logical Consistency" metric?', a: 'This measures whether the claims made in the text actually align with standard physics, established facts, and internal logic. A low score means the argument or media structural physics fall apart under scrutiny.' },
      { q: 'Why did my real photo get a "Questionable" score?', a: 'Heavy editing, Instagram filters, HDR processing, or low-resolution compression can strip away natural metadata. The AI flags these as "Questionable" because the digital physics have been altered.' },
      { q: 'What is an "AI Fingerprint"?', a: 'AI text generators often overuse specific structural patterns and vocabulary (like "delve," "tapestry," or overly perfect grammar). Our system detects this lack of human "burstiness."' }
    ]
  },
  {
    category: 'Privacy & Data Security',
    icon: EyeSlashIcon,
    questions: [
      { q: 'Are my uploaded files stored permanently?', a: 'Absolutely not. Xist AI uses a volatile-memory protocol. Once the analysis is complete, your temporary media or document file is purged from the server via strict OS-level deletion.' },
      { q: 'Is my search history public?', a: 'Only if you explicitly choose to broadcast a scan to the Community Feed (if enabled). Otherwise, your scans remain strictly in your private ledger.' },
      { q: 'Does Xist AI read my personal device data?', a: 'No. The system is heavily sandboxed. It can only analyze the exact text, URL, or file payload you manually submit to the Verification Node.' }
    ]
  }
];

export default function SupportSection({ theme: globalTheme = 'dark' }) {
  const { screenSize } = useResponsive();
  const theme = THEMES[globalTheme];
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedFaq, setExpandedFaq] = useState(null);

  // Initialize Typewriter
  const typingTitle = useTypewriterEffect("Intelligence Base: Active", 80, 200);

  const toggleFaq = (id) => {
    setExpandedFaq(expandedFaq === id ? null : id);
  };

  const filteredFaqs = FAQS.map(category => ({
    ...category,
    questions: category.questions.filter(q => 
      q.q.toLowerCase().includes(searchQuery.toLowerCase()) || 
      q.a.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(category => category.questions.length > 0);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className={`w-full min-h-screen p-6 relative transition-colors duration-500 ${theme.background} ${theme.textPrimary}`}
                style={{ marginLeft: screenSize.isMobile ? '0' : '280px', marginTop: '64px' }}>
      
      {/* BACKGROUND MATRIX GRID */}
      <div className={`absolute inset-0 pointer-events-none opacity-[0.03] ${globalTheme === 'light' ? 'invert' : ''}`} 
           style={{ backgroundImage: 'linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
      <div className={`absolute inset-0 pointer-events-none opacity-20 bg-gradient-to-tr ${theme.glow}`}></div>

      <div className="max-w-7xl mx-auto text-center mb-10 relative z-10">
        <LifebuoyIcon className={`w-16 h-16 mx-auto mb-4 ${theme.accent} opacity-80`} />
        
        {/* TYPEWRITER TITLE + BLINKING CURSOR */}
        <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-3 uppercase flex justify-center items-center">
          <span>{typingTitle}</span>
          <motion.span animate={{ opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 0.8 }} className="w-1.5 h-8 md:h-10 bg-indigo-500 inline-block ml-2" />
        </h1>
        
        <p className={`${theme.muted} text-sm font-mono tracking-widest uppercase`}>
          System Documentation & Operator Guide
        </p>
      </div>

      <div className="max-w-7xl mx-auto relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEFT COLUMN: GUIDES & LEGENDS */}
        <div className="lg:col-span-5 space-y-8">
          
          {/* OPERATOR'S QUICK GUIDE */}
          <div className={`${theme.card} p-6 rounded-[2rem] border-t-4 border-t-indigo-500`}>
            <div className="flex items-center gap-3 mb-6">
              <BoltIcon className="w-6 h-6 text-indigo-500" />
              <h3 className="text-xs font-black uppercase tracking-widest">Operator's Quick Guide</h3>
            </div>
            <div className="relative border-l-2 border-indigo-500/30 ml-3 space-y-6 pb-2">
              <div className="relative pl-6">
                <div className="absolute w-3 h-3 bg-indigo-500 rounded-full -left-[7px] top-1 shadow-[0_0_10px_#6366f1]" />
                <h4 className={`text-[11px] font-bold uppercase mb-1 ${theme.textPrimary}`}>1. Select Input Vector</h4>
                <p className={`text-[10px] ${theme.textSecondary}`}>Open the Verify tab. Choose Text, URL, Document, or Media depending on the suspected threat.</p>
              </div>
              <div className="relative pl-6">
                <div className="absolute w-3 h-3 bg-indigo-500 rounded-full -left-[7px] top-1 shadow-[0_0_10px_#6366f1]" />
                <h4 className={`text-[11px] font-bold uppercase mb-1 ${theme.textPrimary}`}>2. Initiate Scan</h4>
                <p className={`text-[10px] ${theme.textSecondary}`}>Provide the data and trigger the analysis. The engine will extract features and query the forensics model.</p>
              </div>
              <div className="relative pl-6">
                <div className="absolute w-3 h-3 bg-indigo-500 rounded-full -left-[7px] top-1 shadow-[0_0_10px_#6366f1]" />
                <h4 className={`text-[11px] font-bold uppercase mb-1 ${theme.textPrimary}`}>3. Review Intelligence</h4>
                <p className={`text-[10px] ${theme.textSecondary}`}>Analyze the returned Credibility Score, Threat Category, and specific anomaly explanations.</p>
              </div>
              <div className="relative pl-6">
                <div className="absolute w-3 h-3 bg-indigo-500 rounded-full -left-[7px] top-1 shadow-[0_0_10px_#6366f1]" />
                <h4 className={`text-[11px] font-bold uppercase mb-1 ${theme.textPrimary}`}>4. Tactical Mitigation</h4>
                <p className={`text-[10px] ${theme.textSecondary}`}>If the threat is CRITICAL, switch to the Protection tab for immediate 3-step survival protocols.</p>
              </div>
            </div>
          </div>

          {/* THE FORENSIC LEGEND */}
          <div className={`${theme.card} p-6 rounded-[2rem] border-l-4 border-l-rose-500`}>
            <div className="flex items-center gap-3 mb-6">
              <ShieldCheckIcon className="w-6 h-6 text-rose-500" />
              <h3 className="text-xs font-black uppercase tracking-widest">Forensic Scoring Legend</h3>
            </div>
            <div className="space-y-3">
              <div className={`p-4 rounded-xl ${theme.inner} border border-emerald-500/20`}>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-emerald-500 font-bold text-[11px] uppercase tracking-wider">[SAFE]</span>
                  <span className="text-emerald-500 font-mono text-[10px]">80-100%</span>
                </div>
                <p className={`text-[10px] ${theme.textSecondary} leading-relaxed`}>Content exhibits natural human patterns. Low risk of manipulation.</p>
              </div>
              <div className={`p-4 rounded-xl ${theme.inner} border border-amber-500/20`}>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-amber-500 font-bold text-[11px] uppercase tracking-wider">[QUESTIONABLE]</span>
                  <span className="text-amber-500 font-mono text-[10px]">40-79%</span>
                </div>
                <p className={`text-[10px] ${theme.textSecondary} leading-relaxed`}>AI detected missing metadata or mild psychological manipulation. Verify source.</p>
              </div>
              <div className={`p-4 rounded-xl ${theme.inner} border border-rose-500/20`}>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-rose-500 font-bold text-[11px] uppercase tracking-wider">[CRITICAL]</span>
                  <span className="text-rose-500 font-mono text-[10px]">0-39%</span>
                </div>
                <p className={`text-[10px] ${theme.textSecondary} leading-relaxed`}>High-probability detection of Deepfake anomalies or phishing. Do not interact.</p>
              </div>
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: SEARCH & MASSIVE FAQ */}
        <div className="lg:col-span-7 flex flex-col space-y-6">
          
          {/* SEARCH BAR */}
          <div className="relative">
            <MagnifyingGlassIcon className={`w-5 h-5 absolute left-5 top-1/2 -translate-y-1/2 ${theme.muted}`} />
            <input
              type="text"
              placeholder="Search guides, limits, errors, or definitions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full pl-14 pr-6 py-5 rounded-[2rem] text-sm font-bold outline-none border-2 transition-all shadow-lg ${theme.input}`}
            />
          </div>

          {/* DYNAMIC FAQ ACCORDION */}
          <div className="flex-grow overflow-y-auto h-[600px] custom-scrollbar pr-2 space-y-6">
            {filteredFaqs.map((cat, catIdx) => (
              <div key={catIdx} className={`${theme.card} p-6 rounded-[2rem]`}>
                <div className="flex items-center gap-3 mb-4">
                  <div className={`p-2 rounded-lg ${theme.iconContainer}`}>
                    <cat.icon className={`w-5 h-5 ${theme.accent}`} />
                  </div>
                  <h3 className={`text-xs font-black uppercase tracking-widest ${theme.textPrimary}`}>{cat.category}</h3>
                </div>
                
                <div className="space-y-3">
                  {cat.questions.map((faq, qIdx) => {
                    const id = `${catIdx}-${qIdx}`;
                    const isOpen = expandedFaq === id;
                    return (
                      <div key={qIdx} className={`rounded-xl overflow-hidden transition-all ${theme.inner} border ${isOpen ? 'border-indigo-500/50' : 'border-transparent'}`}>
                        <button onClick={() => toggleFaq(id)}
                                className="w-full p-4 flex items-start justify-between text-left focus:outline-none">
                          <span className={`text-[11px] font-bold leading-relaxed pr-4 ${theme.textPrimary}`}>{faq.q}</span>
                          <motion.div animate={{ rotate: isOpen ? 180 : 0 }} className="mt-0.5">
                            <ChevronDownIcon className={`w-4 h-4 ${theme.muted}`} />
                          </motion.div>
                        </button>
                        <AnimatePresence>
                          {isOpen && (
                            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                              <p className={`px-4 pb-4 text-[10px] leading-relaxed ${theme.textSecondary} font-mono border-t border-slate-700/30 pt-3`}>
                                {faq.a}
                              </p>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}

            {filteredFaqs.length === 0 && (
              <div className={`p-12 text-center rounded-[2rem] ${theme.card}`}>
                <FingerPrintIcon className={`w-12 h-12 mx-auto mb-4 ${theme.muted} opacity-50`} />
                <p className={`text-xs font-mono uppercase ${theme.muted}`}>No intelligence records match your search.</p>
              </div>
            )}
          </div>

        </div>
      </div>
      <div className="h-24" />
    </motion.div>
  );
}