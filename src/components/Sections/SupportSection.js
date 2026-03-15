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
    headerBg: 'bg-[#020617]/80 backdrop-blur-xl',
    card: 'bg-slate-900 border border-slate-800 shadow-2xl',
    inner: 'bg-slate-950 border border-slate-800',
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
    headerBg: 'bg-white/80 backdrop-blur-xl',
    card: 'bg-white border border-slate-200 shadow-xl',
    inner: 'bg-slate-100 border border-slate-200',
    textPrimary: 'text-slate-900',
    textSecondary: 'text-slate-700',
    muted: 'text-slate-600',
    accent: 'text-indigo-600',
    input: 'bg-white border-slate-300 text-indigo-600 placeholder-slate-500 focus:border-indigo-500',
    glow: 'from-indigo-500/5 via-rose-500/5 to-transparent',
    iconContainer: 'bg-slate-200'
  }
};

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
// SIMPLIFIED FAQ DATA
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
    category: 'App Performance & Limits',
    icon: CpuChipIcon,
    questions: [
      { q: 'Is there a file size limit for uploads?', a: 'Yes. To keep the app running fast, media files should be kept under standard short-clip sizes. Massive 4K videos may time out during upload.' },
      { q: 'Can the AI scan YouTube videos directly?', a: 'URL mode currently only scans web page text. To analyze a specific video for deepfakes, you must download the clip and upload it via "Video" mode.' },
      { q: 'What languages does Xist support?', a: 'The AI engine is highly proficient in English, Hindi, and multiple global languages, allowing it to detect scams across borders.' },
      { q: 'Why did my document extraction fail?', a: 'If your PDF is essentially a "picture" of text (scanned without a text layer), the parser cannot read it. You may need to screenshot the document and upload it via "Image" mode instead.' }
    ]
  },
  {
    category: 'Understanding the AI Scores',
    icon: DocumentMagnifyingGlassIcon,
    questions: [
      { q: 'What does the "Emotional Intensity" score mean?', a: 'A high score means the content is designed to trigger fear, urgency, or outrage to bypass your logical thinking—a classic hallmark of scams.' },
      { q: 'What is the "Logical Consistency" metric?', a: 'This checks if the claims make logical sense. A low score means the argument or the structure of the media falls apart under close inspection.' },
      { q: 'Why did my real photo get a "Questionable" score?', a: 'Heavy editing, Instagram filters, or low-resolution compression can strip away natural data. The AI flags these because the image has been unnaturally altered.' },
      { q: 'What is an "AI Fingerprint"?', a: 'AI text generators overuse specific patterns and words (like "delve" or overly perfect grammar). Our system detects this lack of human writing style.' }
    ]
  },
  {
    category: 'Privacy & Data Security',
    icon: EyeSlashIcon,
    questions: [
      { q: 'Are my uploaded files stored permanently?', a: 'Absolutely not. Once the analysis is complete, your temporary media or document file is permanently deleted from our servers.' },
      { q: 'Is my search history public?', a: 'Only if you explicitly click "Share to Community". Otherwise, your scans remain strictly in your private history log.' },
      { q: 'Does Xist read my personal phone data?', a: 'No. The app is completely sandboxed. It can only analyze the exact text, link, or file you manually submit.' }
    ]
  }
];

export default function SupportSection({ theme: globalTheme = 'dark' }) {
  const { screenSize } = useResponsive();
  const theme = THEMES[globalTheme];
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedFaq, setExpandedFaq] = useState(null);

  const typingTitle = useTypewriterEffect("Help Center", 80, 200);

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
                className={`w-full min-h-screen relative transition-colors duration-500 ${theme.background} ${theme.textPrimary} overflow-x-hidden`}
                style={{ marginLeft: screenSize.isMobile ? '0' : '280px', marginTop: '64px', fontFamily: 'Inter, system-ui, sans-serif' }}>
      
      {/* 🌐 GLOBAL GRID BACKGROUND OVERLAY */}
      <div className={`absolute inset-0 pointer-events-none opacity-[0.03] ${globalTheme === 'light' ? 'invert' : ''} z-0`} 
           style={{ backgroundImage: 'linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>

      {/* ========================================= */}
      {/* 🚀 HERO HEADER (SUPPORT STYLE)            */}
      {/* ========================================= */}
      <div className={`sticky top-0 z-30 px-4 py-8 md:py-12 transition-all overflow-visible ${theme.headerBg}`}>
        
        {/* 🔥 TACTICAL GRID FOR HEADER (SEAMLESS) 🔥 */}
        <div className={`absolute inset-0 pointer-events-none opacity-[0.05] md:opacity-[0.03] ${globalTheme === 'light' ? 'invert' : ''} z-0`} 
             style={{ backgroundImage: 'linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>

        <div className="max-w-4xl mx-auto flex flex-col items-center justify-center relative z-10 overflow-visible">
          
          <LifebuoyIcon className={`w-10 h-10 md:w-14 md:h-14 mb-5 stroke-[1.5] ${theme.accent}`} />
          
          {/* ✅ SIMPLIFIED MASSIVE TITLE: Bulletproof Descender Fix */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-center mb-2 pb-4 leading-normal tracking-tight">
            <span>{typingTitle}</span>
            <motion.span 
              animate={{ opacity: [0, 1, 0] }} 
              transition={{ repeat: Infinity, duration: 0.9 }} 
              className="inline-block w-2.5 md:w-3 h-[0.8em] bg-indigo-500 ml-2 align-baseline" 
            />
          </h1>
          
          <p className="text-[9px] md:text-[11px] font-mono font-bold uppercase tracking-[0.3em] md:tracking-[0.4em] text-slate-500 mb-4 text-center px-4">
            Here to help you navigate Xist safely.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 px-4 md:px-8 py-8">
        
        {/* LEFT COLUMN: GUIDES & LEGENDS */}
        <div className="lg:col-span-5 space-y-8 h-fit">
          <div className={`${theme.card} p-5 md:p-6 rounded-[2rem] border-t-4 border-t-indigo-500`}>
            <div className="flex items-center gap-3 mb-6">
              <BoltIcon className="w-6 h-6 text-indigo-500 shrink-0" />
              <h3 className="text-xs font-black uppercase tracking-widest break-words whitespace-normal">How-To Guides</h3>
            </div>
            <div className="relative border-l-2 border-indigo-500/30 ml-3 space-y-6 pb-2">
              {[
                { step: "1. Select Input", desc: "Open the Verify tab. Choose Text, URL, Document, or Media." },
                { step: "2. Run Scan", desc: "Provide the data and click Analyze. The AI will scan for threats." },
                { step: "3. Read Report", desc: "Check the Credibility Score, Threat Category, and explanation." },
                { step: "4. Take Action", desc: "If the threat is CRITICAL, visit the Support tab for next steps." }
              ].map((item, i) => (
                <div key={i} className="relative pl-5 md:pl-6 w-full">
                  <div className="absolute w-3 h-3 bg-indigo-500 rounded-full -left-[7px] top-1 shadow-[0_0_10px_#6366f1]" />
                  {/* ✅ Text wrapping enforced for tiny screens */}
                  <h4 className={`text-[11px] font-bold uppercase mb-1 break-words whitespace-normal ${theme.textPrimary}`}>{item.step}</h4>
                  <p className={`text-[10px] break-words whitespace-normal leading-relaxed ${theme.textSecondary}`}>{item.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <div className={`${theme.card} p-5 md:p-6 rounded-[2rem] border-l-4 border-l-rose-500`}>
            <div className="flex items-center gap-3 mb-6">
              <ShieldCheckIcon className="w-6 h-6 text-rose-500 shrink-0" />
              <h3 className="text-xs font-black uppercase tracking-widest break-words whitespace-normal">Understanding the AI Scores</h3>
            </div>
            <div className="space-y-3">
              {[
                { label: "[SAFE]", range: "80-100%", color: "text-emerald-500", border: "border-emerald-500/20", desc: "Content looks completely natural. Low risk." },
                { label: "[QUESTIONABLE]", range: "40-79%", color: "text-amber-500", border: "border-amber-500/20", desc: "AI detected missing data or mild manipulation. Be careful." },
                { label: "[CRITICAL]", range: "0-39%", color: "text-rose-500", border: "border-rose-500/20", desc: "High chance of a Deepfake or active scam. Do not interact." }
              ].map((legend, i) => (
                <div key={i} className={`p-4 rounded-xl ${theme.inner} border ${legend.border} w-full`}>
                  {/* ✅ Flex-wrap ensures the label and percentage don't collide on an iPhone SE */}
                  <div className="flex flex-wrap justify-between items-center mb-2 gap-2">
                    <span className={`${legend.color} font-bold text-[11px] uppercase tracking-wider`}>{legend.label}</span>
                    <span className={`${legend.color} font-mono text-[10px] shrink-0`}>{legend.range}</span>
                  </div>
                  <p className={`text-[10px] ${theme.textSecondary} leading-relaxed break-words whitespace-normal`}>{legend.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: SEARCH & FAQ */}
        <div className="lg:col-span-7 flex flex-col space-y-6 min-h-0">
          <div className="relative shrink-0">
            <MagnifyingGlassIcon className={`w-5 h-5 absolute left-5 top-1/2 -translate-y-1/2 ${theme.muted}`} />
            <input
              type="text"
              placeholder="Search for help, guides, or troubleshooting..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full pl-14 pr-6 py-5 rounded-[2rem] text-xs md:text-sm font-bold outline-none border transition-all shadow-lg ${theme.input} placeholder-slate-500`}
            />
          </div>

          <div className="flex-grow overflow-y-auto h-[600px] custom-scrollbar pr-1 md:pr-2 space-y-6 pb-20">
            {filteredFaqs.map((cat, catIdx) => (
              <div key={catIdx} className={`${theme.card} p-5 md:p-6 rounded-[2rem] h-auto`}>
                <div className="flex items-center gap-3 mb-4">
                  <div className={`p-2 rounded-lg shrink-0 ${theme.iconContainer}`}>
                    <cat.icon className={`w-5 h-5 ${theme.accent}`} />
                  </div>
                  {/* ✅ Enforced wrapping for category titles */}
                  <h3 className={`text-xs font-black uppercase tracking-widest break-words whitespace-normal ${theme.textPrimary}`}>{cat.category}</h3>
                </div>
                
                <div className="space-y-3 h-auto">
                  {cat.questions.map((faq, qIdx) => {
                    const id = `${catIdx}-${qIdx}`;
                    const isOpen = expandedFaq === id;
                    return (
                      <div key={qIdx} className={`rounded-xl overflow-hidden h-auto transition-all ${theme.inner} border ${isOpen ? 'border-indigo-500/50' : 'border-transparent'}`}>
                        <button 
                          onClick={() => toggleFaq(id)}
                          className="w-full p-4 flex items-start justify-between text-left focus:outline-none h-auto min-h-fit gap-3"
                        >
                          {/* ✅ GUARANTEED WRAPPING: The text will naturally wrap and push the container down */}
                          <div className={`block w-full text-[11px] md:text-xs font-bold leading-relaxed whitespace-normal break-words ${theme.textPrimary}`}>
                            {faq.q}
                          </div>
                          <motion.div animate={{ rotate: isOpen ? 180 : 0 }} className="mt-1 shrink-0">
                            <ChevronDownIcon className={`w-4 h-4 ${theme.muted}`} />
                          </motion.div>
                        </button>
                        
                        <AnimatePresence>
                          {isOpen && (
                            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden h-auto">
                              <p className={`px-4 pb-4 text-[10.5px] leading-relaxed whitespace-normal break-words ${theme.textSecondary} border-t border-slate-700/30 pt-3`}>
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
                <p className={`text-xs font-mono uppercase break-words whitespace-normal ${theme.muted}`}>No help articles match your search.</p>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="h-24" />
    </motion.div>
  );
}