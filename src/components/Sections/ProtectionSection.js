import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShieldCheckIcon, PhoneIcon, ShieldExclamationIcon, 
  CommandLineIcon, PaperAirplaneIcon, MagnifyingGlassIcon, 
  ClipboardDocumentCheckIcon, BanknotesIcon, CpuChipIcon, 
  MapPinIcon, GlobeAsiaAustraliaIcon, IdentificationIcon
} from '@heroicons/react/24/outline';
import { toast, Toaster } from 'react-hot-toast';

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
    input: 'bg-slate-950 border-slate-800 text-rose-400 placeholder-slate-700 focus:border-rose-500/50',
    terminalBg: 'bg-slate-950/60',
    aiBubble: 'bg-slate-900 border border-slate-800 text-slate-300',
    userBubble: 'bg-indigo-600/20 border border-indigo-500/30 text-indigo-300',
    glow: 'from-rose-500/10 via-indigo-500/5 to-transparent',
    iconBg: 'bg-slate-800/50', // Darker background for dark mode icons
    timestamp: 'text-slate-500' // Muted timestamp for dark mode
  },
  light: { 
    background: 'bg-slate-50', 
    card: 'bg-white border border-slate-200 shadow-xl', 
    inner: 'bg-slate-100 border-slate-200', 
    textPrimary: 'text-slate-900', 
    textSecondary: 'text-slate-700', // Darkened for better readability
    muted: 'text-slate-600', // Darkened from 400 to 600 for sub-header contrast
    input: 'bg-white border-slate-300 text-rose-600 placeholder-slate-500 focus:border-rose-500',
    terminalBg: 'bg-white',
    aiBubble: 'bg-slate-200 border border-slate-300 text-slate-900',
    userBubble: 'bg-indigo-100 border border-indigo-200 text-indigo-900',
    glow: 'from-rose-500/10 via-blue-500/10 to-transparent',
    iconBg: 'bg-slate-200', // Light grey background for icons in light mode
    timestamp: 'text-slate-600' // Darker timestamp for light mode
  }
};

// ==============================
// XIST AI: GLOBAL THREAT DIRECTORY
// ==============================
const HELPLINE_DB = [
  // --- 1. INDIA: ABSOLUTE PRIORITY ---
  {
    cat: "India: National Emergency 🇮🇳",
    contacts: [
      { name: "National Cybercrime Helpline", number: "1930", desc: "MHA Primary 24/7 Helpline for all online frauds." },
      { name: "Financial Fraud (RBI)", number: "155260", desc: "Direct reporting for banking and UPI theft." },
      { name: "Emergency Integrated Service", number: "112", desc: "Police/Medical/Fire pan-India." },
      { name: "Women Cyber Support", number: "181", desc: "Domestic violence and cyber-harassment." },
      { name: "Childline Emergency", number: "1098", desc: "Protection for minors against online abuse." }
    ]
  },
  {
    cat: "India: State Cyber Cells (A-Z) 📍",
    contacts: [
      { name: "Andhra Pradesh", number: "0863-2340100", desc: "AP State Cyber Crime Station." },
      { name: "Arunachal Pradesh", number: "0360-2214414", desc: "Itanagar Cyber Cell." },
      { name: "Assam", number: "0361-2524639", desc: "Guwahati CID Cyber Cell." },
      { name: "Bihar", number: "0612-2233802", desc: "Patna Cyber Crime Unit." },
      { name: "Chhattisgarh", number: "0771-4247109", desc: "Raipur Cyber Station." },
      { name: "Delhi", number: "011-20813536", desc: "Special Cell, Dwarka Sector 19." },
      { name: "Goa", number: "0832-2421710", desc: "Panaji Cyber Crime Cell." },
      { name: "Gujarat", number: "079-23250798", desc: "Gandhinagar CID Intelligence." },
      { name: "Haryana", number: "0172-2587529", desc: "Panchkula Cyber Cell." },
      { name: "Himachal Pradesh", number: "0177-2621714", desc: "Shimla Cyber Unit." },
      { name: "Jharkhand", number: "0651-2490052", desc: "Ranchi Cyber Cell." },
      { name: "Karnataka", number: "080-22094498", desc: "Bangalore CID Cyber Unit." },
      { name: "Kerala", number: "0471-2317457", desc: "Thiruvananthapuram Cyber Cell." },
      { name: "Madhya Pradesh", number: "0755-2443496", desc: "Bhopal Cyber Cell." },
      { name: "Maharashtra", number: "022-26504008", desc: "Mumbai BKC Cyber Police." },
      { name: "Manipur", number: "0385-2450159", desc: "Imphal Cyber Unit." },
      { name: "Meghalaya", number: "0364-2520442", desc: "Shillong Cyber Cell." },
      { name: "Mizoram", number: "0389-2335134", desc: "Aizawl Cyber Unit." },
      { name: "Nagaland", number: "0370-2244101", desc: "Kohima Cyber Cell." },
      { name: "Odisha", number: "0671-2304192", desc: "Cuttack CID Cyber Cell." },
      { name: "Punjab", number: "0172-2225801", desc: "Mohali Cyber Crime Unit." },
      { name: "Rajasthan", number: "0141-2309540", desc: "Jaipur Cyber Cell." },
      { name: "Sikkim", number: "03592-202042", desc: "Gangtok Cyber Unit." },
      { name: "Tamil Nadu", number: "044-23452350", desc: "Chennai Cyber Cell." },
      { name: "Telangana", number: "040-23147661", desc: "Hyderabad Cyber Crime Unit." },
      { name: "Tripura", number: "0381-2321522", desc: "Agartala Cyber Cell." },
      { name: "Uttar Pradesh", number: "0522-2287253", desc: "Lucknow Cyber Command HQ." },
      { name: "Uttarakhand", number: "0135-2712563", desc: "Dehradun Cyber Unit." },
      { name: "West Bengal", number: "033-22505120", desc: "Kolkata Cyber Cell." }
    ]
  },
  {
    cat: "India: Banking Fraud Hub 🏦",
    contacts: [
      { name: "SBI Card/Bank Block", number: "1800-11-2211", desc: "State Bank of India primary fraud cell." },
      { name: "HDFC Security Line", number: "1800-2586-161", desc: "HDFC specialized digital fraud unit." },
      { name: "ICICI Emergency Hub", number: "1800-200-3344", desc: "Unauthorized transaction reporting." },
      { name: "UPI Fraud (NPCI)", number: "1800-120-1740", desc: "Report GPay, PhonePe, or BHIM theft." }
    ]
  },

  // --- 2. GLOBAL RESPONSE NETWORKS ---
  {
    cat: "North America 🌎",
    contacts: [
      { name: "USA: FBI (IC3)", number: "1-800-225-5324", desc: "Internet Crime Complaint Center for cyber threats." },
      { name: "USA: CISA 24/7", number: "1-888-282-0870", desc: "Cybersecurity & Infrastructure Security Agency." },
      { name: "Canada: Anti-Fraud", number: "1-888-495-8501", desc: "Canadian Anti-Fraud Centre (CAFC)." },
      { name: "Mexico: Cyber Police", number: "088", desc: "National Guard Cyber Incident Response." }
    ]
  },
  {
    cat: "Europe 🇪🇺",
    contacts: [
      { name: "Europol (EC3)", number: "Online Portal", desc: "European Cybercrime Centre for EU-wide incidents." },
      { name: "UK: Action Fraud", number: "0300-123-2040", desc: "UK national reporting centre for fraud & cybercrime." },
      { name: "Germany: BSI", number: "+49-800-274-1000", desc: "Federal Office for Information Security." },
      { name: "France: Cybermalveillance", number: "0-805-805-817", desc: "French national cyber assistance." },
      { name: "Spain: INCIBE", number: "017", desc: "National Cybersecurity Institute of Spain." }
    ]
  },
  {
    cat: "Asia & Middle East 🌏",
    contacts: [
      { name: "Singapore: SingCERT", number: "+65-6322-9096", desc: "Cyber Emergency Response Team." },
      { name: "Japan: Cyber Police", number: "110", desc: "National Police Agency Cyber Division." },
      { name: "UAE: eCrime", number: "901", desc: "Dubai Police Cybercrime Hotline." },
      { name: "Saudi Arabia", number: "330330", desc: "Anti-Cyber Crime Reporting." }
    ]
  },
  {
    cat: "Oceania & Africa 🌍",
    contacts: [
      { name: "Australia: ACSC", number: "1300-292-371", desc: "Australian Cyber Security Centre." },
      { name: "New Zealand: CERT", number: "0800-2378-69", desc: "CERT NZ National Response." },
      { name: "South Africa: Cyber", number: "012-393-9052", desc: "SAPS Cybercrime Division." }
    ]
  }
];
const PROTOCOLS = [
  { id: 'money', label: 'Financial Fraud', icon: BanknotesIcon, color: 'text-rose-500', glow: 'bg-rose-500/20', border: 'group-hover:border-rose-500', dot: 'bg-rose-500', prompt: 'I have been a victim of financial/UPI fraud. My money was stolen.' },
  { id: 'hack', label: 'Account & Identity', icon: IdentificationIcon, color: 'text-indigo-500', glow: 'bg-indigo-500/20', border: 'group-hover:border-indigo-500', dot: 'bg-indigo-500', prompt: 'My social media account is hacked or someone is impersonating me.' },
  { id: 'extort', label: 'Extortion & Safety', icon: ShieldExclamationIcon, color: 'text-rose-500', glow: 'bg-rose-500/20', border: 'group-hover:border-rose-500', dot: 'bg-rose-500', prompt: 'I am being blackmailed, extorted, or threatened online.' },
  { id: 'device', label: 'Device & Web', icon: CpuChipIcon, color: 'text-blue-500', glow: 'bg-blue-500/20', border: 'group-hover:border-blue-500', dot: 'bg-blue-500', prompt: 'I think my phone is hacked, or I clicked a suspicious link.' }
];

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

export default function ProtectionSection({ user, theme: globalTheme }) {
  const themeMode = THEMES[globalTheme] ? globalTheme : 'dark';
const theme = THEMES[themeMode];
  const typingTitle = useTypewriterEffect("Helpline 24/7: Active Response", 80, 200);

  const [search, setSearch] = useState('');
  const [userInput, setUserInput] = useState('');
  const [isAiAnalyzing, setIsAiAnalyzing] = useState(false);
  const [showProtocolMenu, setShowProtocolMenu] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, role: 'ai', text: "How can I help you today? Select a topic above or describe your issue for quick action steps." }
  ]);

  const filteredDB = HELPLINE_DB.map(group => ({
    ...group,
    contacts: group.contacts.filter(c => 
      c.name.toLowerCase().includes(search.toLowerCase()) || 
      c.number.includes(search)
    )
  })).filter(group => group.contacts.length > 0);

  // --- UPDATE THIS FUNCTION IN ProtectionSection.js ---

const handleGeminiTriage = async (input) => {
    if (!input.trim()) return;
    const userMsg = { id: Date.now(), role: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setIsAiAnalyzing(true);
    setUserInput('');

    try {
      // ✅ FORENSIC FIX: Dynamic routing for the triage endpoint
      const BACKEND_URL = 'https://xist-ai-clean.onrender.com';

      const response = await fetch(`${BACKEND_URL}/api/triage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: input })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error);

      setMessages(prev => [...prev, { 
        id: Date.now() + 1, 
        role: 'ai', 
        text: data.solution 
      }]);

    } catch (err) {
      // Fallback for reliability
      setTimeout(() => {
        setMessages(prev => [...prev, { 
          id: Date.now() + 1, 
          role: 'ai', 
          text: "1. Call 1930 immediately.\n2. Freeze accounts via 155260.\n3. Secure device passwords." 
        }]);
        setIsAiAnalyzing(false);
      }, 600);
    } finally {
      setIsAiAnalyzing(false);
    }
  };

  // ✅ STAGGERED ANIMATION ENGINE
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.1 } }
  };
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 100 } }
  };

  return (
    <motion.div initial="hidden" animate="visible" variants={containerVariants}
                className={`w-full min-h-screen p-4 sm:p-8 relative transition-colors duration-500 ${theme.background} ${theme.textPrimary}`}>
      
      {/* BACKGROUND MATRIX */}
      <div className={`absolute inset-0 pointer-events-none opacity-[0.03] ${globalTheme === 'light' ? 'invert' : ''}`} 
           style={{ backgroundImage: 'linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
      <div className={`absolute inset-0 pointer-events-none opacity-20 bg-gradient-to-tr ${theme.glow}`}></div>

      {/* HEADER */}
      <motion.div variants={itemVariants} className="max-w-5xl mx-auto text-center mb-10 relative z-10">
        <ShieldExclamationIcon className="w-16 h-16 text-rose-500 mx-auto mb-4 opacity-80" />
        <h1 className="text-4xl md:text-5xl lg:text-5xl font-black text-center mb-3 pb-4 leading-normal tracking-tight">
                             <span>{typingTitle}</span>
                             <motion.span 
                               animate={{ opacity: [0, 1, 0] }} 
                               transition={{ repeat: Infinity, duration: 0.9 }} 
                               className="inline-block w-2.5 md:w-3 h-[0.8em] bg-indigo-500 ml-2 align-baseline" 
                             />
                           </h1>
        <p className={`${theme.muted} text-sm font-mono tracking-widest uppercase`}>
  Quick Action Steps & Emergency Contacts
</p>
      </motion.div>

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* CONSOLIDATED 4 PROTOCOLS (DESKTOP ONLY) */}
        <motion.div variants={itemVariants} className="hidden md:grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {PROTOCOLS.map(p => (
            <button key={p.id} onClick={() => handleGeminiTriage(p.prompt)}
                    className={`${theme.card} p-3 md:p-4 rounded-tl-[1.5rem] rounded-br-[1.5rem] flex items-center justify-start gap-4 group hover:scale-[1.02] transition-all relative overflow-hidden`}>
              
              {/* ✅ ELITE TACTICAL ICON CONTAINER */}
              <div className="relative shrink-0">
                <div className={`absolute -inset-1 ${p.glow} rounded-xl blur opacity-0 group-hover:opacity-100 transition duration-500`}></div>
                <div className={`relative w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-xl border transition-all duration-300 ${globalTheme === 'dark' ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200'} shadow-inner ${p.border}`}>
                  <p.icon className={`w-5 h-5 md:w-6 md:h-6 transition-colors duration-300 ${p.color}`} />
                  <div className={`absolute top-1 right-1 w-1 h-1 rounded-full ${p.dot} opacity-40 group-hover:opacity-100 group-hover:animate-ping`}></div>
                </div>
              </div>

              {/* ✅ TEXT & HOVER STATE */}
              <div className="flex flex-col items-start text-left w-full overflow-hidden">
                <span className={`text-[10px] md:text-xs font-black uppercase tracking-tighter line-clamp-1 ${theme.textPrimary}`}>
                  {p.label}
                </span>
                <span className={`text-[8px] md:text-[9px] font-mono tracking-widest uppercase mt-0.5 opacity-0 group-hover:opacity-100 transition-opacity ${p.color}`}>
                  Select Topic
                </span>
              </div>
              
            </button>
          ))}
        </motion.div>

        {/* ✅ MOBILE: TOPIC SELECTOR BUTTON (Opens Global Modal) */}
        <motion.div variants={itemVariants} className="md:hidden relative w-max mx-auto overflow-visible mb-8 mt-4">
          <button 
            onClick={() => setShowProtocolMenu(true)}
            className={`flex items-center gap-2 px-6 py-3 rounded-full border shadow-lg transition-all ${themeMode === 'dark' ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-slate-300 text-slate-900'}`}
          >
            <ShieldCheckIcon className="w-4 h-4 text-indigo-500" />
            <span className="text-[11px] font-black uppercase tracking-widest block py-0.5">
              Select Support Topic
            </span>
          </button>
        </motion.div>
        <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* THEME-ADAPTIVE TERMINAL */}
          <div className="lg:col-span-6 flex flex-col gap-6">
            <div className={`${theme.card} rounded-tl-[2.5rem] rounded-br-[2.5rem] overflow-hidden flex flex-col h-[550px] border-t-4 border-t-rose-500`}>
              <div className={`p-4 border-b flex items-center justify-between ${theme.inner}`}>
                <div className="flex items-center gap-2">
                  <CommandLineIcon className="w-4 h-4 text-rose-500" />
                  <span className="text-[10px] font-black text-rose-500 uppercase tracking-widest">Support Assistant</span>
                </div>
                <div className="w-2 h-2 rounded-full bg-rose-500 animate-pulse shadow-[0_0_8px_#f43f5e]"></div>
              </div>
              
              <div className={`flex-grow overflow-y-auto p-6 space-y-6 font-mono text-[11px] custom-scrollbar whitespace-pre-line ${theme.terminalBg}`}>
                {messages.map(m => (
                  <div key={m.id} className={`${m.role === 'user' ? 'text-right' : 'text-left'}`}>
<span className={`opacity-60 block text-[9px] mb-1 uppercase font-bold ${theme.timestamp}`}>
  [{new Date().toLocaleTimeString()}] NODE_{m.role.toUpperCase()}
</span>
                    <div className={`p-4 rounded-2xl inline-block max-w-[90%] shadow-sm text-left ${m.role === 'user' ? theme.userBubble : theme.aiBubble}`}>
                      {m.text}
                    </div>
                  </div>
                ))}
                {isAiAnalyzing && <div className="text-rose-500 animate-pulse font-black text-[10px]">FINDING BEST SOLUTION...</div>}
              </div>

              <div className={`p-4 border-t flex gap-2 ${theme.inner}`}>
                <input value={userInput} onChange={e => setUserInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleGeminiTriage(userInput)}
                       className={`flex-1 ${theme.input} px-5 py-3 rounded-2xl font-mono text-xs outline-none transition-all`} placeholder="Awaiting emergency input..."/>
                <button onClick={() => handleGeminiTriage(userInput)} className="bg-rose-600 px-5 rounded-2xl hover:bg-rose-500 transition-all shadow-lg"><PaperAirplaneIcon className="w-5 h-5 text-white"/></button>
              </div>
            </div>
          </div>

          {/* RIGHT: UNIVERSAL DIRECTORY */}
          <div className="lg:col-span-6 flex flex-col">
            <div className="relative mb-6">
              <MagnifyingGlassIcon className="w-5 h-5 absolute left-5 top-1/2 -translate-y-1/2 text-slate-500" />
              <input value={search} onChange={e => setSearch(e.target.value)}
                     className={`w-full pl-14 pr-6 py-5 rounded-[2rem] text-sm font-bold outline-none border-2 transition-all shadow-xl ${theme.input}`} 
                     placeholder="Search State or Bank..."/>
            </div>

            <div className="flex-grow overflow-y-auto h-[550px] pr-2 custom-scrollbar space-y-8">
              {filteredDB.map((group, idx) => (
                <div key={idx} className="space-y-4">
                  <div className="flex items-center gap-3 ml-2">
                    <MapPinIcon className="w-4 h-4 text-rose-500" />
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">{group.cat}</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {group.contacts.map((c, i) => (
                      <motion.div whileHover={{ scale: 1.02 }} key={i} onClick={() => {
                        navigator.clipboard.writeText(c.number);
                        toast.success(`Copied: ${c.number}`);
                      }}
                        className={`${theme.card} p-5 rounded-tl-2xl rounded-br-2xl border-l-4 border-l-indigo-600 cursor-pointer group hover:border-rose-500/50 transition-all`}>
                        <div className="flex justify-between items-start mb-2">
                          <h4 className={`text-xs font-black uppercase tracking-tight ${theme.textPrimary}`}>{c.name}</h4>
                          <PhoneIcon className="w-4 h-4 text-rose-500" />
                        </div>
                        <div className="text-xl font-mono font-black tracking-tighter text-indigo-500 mb-1">{c.number}</div>
                        <p className={`text-[9px] leading-tight font-medium uppercase ${theme.textSecondary}`}>{c.desc}</p>
                      </motion.div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </motion.div>

        {/* BOTTOM BANNER */}
        <motion.div variants={itemVariants} className={`mt-12 p-8 rounded-[3rem] border flex flex-col md:flex-row items-center justify-between gap-6 ${globalTheme === 'light' ? 'bg-slate-100' : 'bg-indigo-600/10 border-indigo-500/20'}`}>
            <div className="flex items-center gap-6">
                <div className="w-16 h-16 bg-indigo-600 rounded-[1.5rem] flex items-center justify-center shadow-2xl shadow-indigo-600/30">
                  <GlobeAsiaAustraliaIcon className="w-9 h-9 text-white"/>
                </div>
                <div>
                    <h3 className={`text-lg font-black uppercase tracking-tighter ${theme.textPrimary}`}>India Cyber Cell Website</h3>
                    <p className={`text-xs font-medium ${theme.textSecondary}`}>Official MHA Portal for National Incident Registration.</p>
                </div>
            </div>
            <button onClick={() => window.open('https://cybercrime.gov.in', '_blank')}
                    className="px-8 py-4 bg-indigo-600 hover:bg-indigo-50 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all">
                Open Official Portal
            </button>
        </motion.div>

      </div>
      <div className="h-24" />
      {/* ========================================= */}
      {/* 🎛️ GLOBAL TOPIC MODAL (MOBILE FIX)        */}
      {/* ========================================= */}
      <AnimatePresence>
        {showProtocolMenu && (
          <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowProtocolMenu(false)} />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className={`relative w-72 rounded-3xl shadow-2xl border overflow-hidden flex flex-col z-10 ${themeMode === 'dark' ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200'}`}
            >
              <div className={`p-4 border-b text-center text-xs font-black uppercase tracking-widest ${themeMode === 'dark' ? 'border-slate-800 text-slate-400' : 'border-slate-100 text-slate-500'}`}>
                What do you need help with?
              </div>
              <div className="flex flex-col p-2">
                {PROTOCOLS.map(p => (
                  <button key={p.id} onClick={() => { handleGeminiTriage(p.prompt); setShowProtocolMenu(false); }}
                    className={`w-full text-left px-5 py-4 text-[11px] font-black uppercase tracking-widest transition-all flex items-center gap-3 rounded-xl ${themeMode === 'dark' ? 'text-slate-300 hover:bg-slate-800' : 'text-slate-600 hover:bg-slate-50'}`}
                  > 
                    <p.icon className={`w-5 h-5 ${p.color}`} />
                    {p.label} 
                  </button>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <Toaster position="top-right" containerStyle={{ top: 80 }} />
    </motion.div>
  );
}