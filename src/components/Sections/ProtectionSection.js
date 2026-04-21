import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShieldCheckIcon, PhoneIcon, ShieldExclamationIcon, 
  CommandLineIcon, PaperAirplaneIcon, MagnifyingGlassIcon, 
  BanknotesIcon, CpuChipIcon, MapPinIcon, GlobeAsiaAustraliaIcon, 
  IdentificationIcon, MicrophoneIcon, ExclamationTriangleIcon,
  XMarkIcon, FunnelIcon,ArrowPathIcon
} from '@heroicons/react/24/outline';
import { toast, Toaster } from 'react-hot-toast';

// ==============================
// XIST AI: GLOBAL THREAT DIRECTORY
// ==============================
const HELPLINE_DB = [
  {
    cat: "National Emergency 🇮🇳",
    type: "national",
    contacts: [
      { name: "National Cybercrime Helpline", number: "1930", desc: "MHA Primary 24/7 Helpline for all online frauds." },
      { name: "Financial Fraud (RBI)", number: "155260", desc: "Direct reporting for banking and UPI theft." },
      { name: "Emergency Integrated Service", number: "112", desc: "Police/Medical/Fire pan-India." },
      { name: "Women Cyber Support", number: "181", desc: "Domestic violence and cyber-harassment." },
      { name: "Childline Emergency", number: "1098", desc: "Protection for minors against online abuse." }
    ]
  },
  {
    cat: "State Cyber Cells (A-Z) 📍",
    type: "states",
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
    cat: "Banking Fraud Hub 🏦",
    type: "banks",
    contacts: [
      { name: "SBI Card/Bank Block", number: "1800-11-2211", desc: "State Bank of India primary fraud cell." },
      { name: "HDFC Security Line", number: "1800-2586-161", desc: "HDFC specialized digital fraud unit." },
      { name: "ICICI Emergency Hub", number: "1800-200-3344", desc: "Unauthorized transaction reporting." },
      { name: "UPI Fraud (NPCI)", number: "1800-120-1740", desc: "Report GPay, PhonePe, or BHIM theft." }
    ]
  },
  {
    cat: "Global Networks 🌍",
    type: "global",
    contacts: [
      { name: "USA: FBI (IC3)", number: "1-800-225-5324", desc: "Internet Crime Complaint Center." },
      { name: "Europol (EC3)", number: "Online Portal", desc: "European Cybercrime Centre." },
      { name: "UK: Action Fraud", number: "0300-123-2040", desc: "UK national reporting centre." },
      { name: "Australia: ACSC", number: "1300-292-371", desc: "Australian Cyber Security Centre." }
    ]
  }
];

const PROTOCOLS = [
  { id: 'money', label: 'Financial Fraud', icon: BanknotesIcon, color: 'text-rose-500', prompt: 'I have been a victim of financial/UPI fraud. My money was stolen.' },
  { id: 'hack', label: 'Account Identity', icon: IdentificationIcon, color: 'text-indigo-500', prompt: 'My social media account is hacked or someone is impersonating me.' },
  { id: 'extort', label: 'Extortion Safety', icon: ShieldExclamationIcon, color: 'text-rose-500', prompt: 'I am being blackmailed, extorted, or threatened online.' },
  { id: 'device', label: 'Device Security', icon: CpuChipIcon, color: 'text-blue-500', prompt: 'I think my phone is hacked, or I clicked a suspicious link.' }
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
      const timeout = setTimeout(() => { setDisplayedText(text.slice(0, displayedText.length + 1)); }, speed);
      return () => clearTimeout(timeout);
    }
  }, [displayedText, text, speed, started]);
  return displayedText;
};

export default function ProtectionSection() {
  const typingTitle = useTypewriterEffect("Helpline 24/7", 80, 200);

  const [search, setSearch] = useState('');
  const [directoryFilter, setDirectoryFilter] = useState('all'); // Controls the Directory Tabs
  const [userInput, setUserInput] = useState('');
  const [isAiAnalyzing, setIsAiAnalyzing] = useState(false);
  const [showProtocolMenu, setShowProtocolMenu] = useState(false);
  const [isListening, setIsListening] = useState(false);
  
  const [messages, setMessages] = useState([
    { id: 1, role: 'ai', text: "How can I help you today? Select an option above, or describe your emergency for quick help." }
  ]);

  useEffect(() => {
    const savedDraft = localStorage.getItem('xist_triage_draft');
    if (savedDraft) setUserInput(savedDraft);
  }, []);

  const handleInputChange = (e) => {
    setUserInput(e.target.value);
    localStorage.setItem('xist_triage_draft', e.target.value);
  };

  const toggleDictation = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      return toast.error("Voice dictation not supported in this browser. Please type.", { icon: <ExclamationTriangleIcon className="w-5 h-5 text-rose-500" /> });
    }
    if (isListening) return; 

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onstart = () => {
      setIsListening(true);
      toast('Listening...', { icon: <MicrophoneIcon className="w-5 h-5 text-indigo-500 animate-pulse" /> });
    };
    
    recognition.onend = () => setIsListening(false);

    recognition.onresult = (event) => {
      let currentTranscript = '';
      for (let i = 0; i < event.results.length; i++) {
          currentTranscript += event.results[i][0].transcript;
      }
      setUserInput(currentTranscript);
      localStorage.setItem('xist_triage_draft', currentTranscript);
    };

    recognition.start();
  };

  const handleGeminiTriage = async (input) => {
    if (!input.trim()) return;
    const userMsg = { id: Date.now(), role: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setIsAiAnalyzing(true);
    setUserInput('');

    try {
      const BACKEND_URL = window.location.hostname === 'localhost' ? 'http://localhost:5000' : 'https://xist-ai-clean-1.onrender.com';
      const response = await fetch(`${BACKEND_URL}/api/triage`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ text: input })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);

      setMessages(prev => [...prev, { id: Date.now() + 1, role: 'ai', text: data.solution }]);
      localStorage.removeItem('xist_triage_draft');
    } catch (err) {
      setTimeout(() => {
        setMessages(prev => [...prev, { id: Date.now() + 1, role: 'ai', text: "1. Call 1930 immediately.\n2. Freeze accounts via 155260.\n3. Secure device passwords." }]);
        setIsAiAnalyzing(false);
      }, 600);
    } finally {
      setIsAiAnalyzing(false);
    }
  };

  // 🚀 THE DIRECTORY FILTER LOGIC
  const filteredDB = HELPLINE_DB.filter(group => {
    if (directoryFilter === 'all') return true;
    return group.type === directoryFilter;
  }).map(group => ({
    ...group,
    contacts: group.contacts.filter(c => 
      c.name.toLowerCase().includes(search.toLowerCase()) || 
      c.number.includes(search)
    )
  })).filter(group => group.contacts.length > 0);

  const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.1 } } };
  const itemVariants = { hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 100 } } };

  return (
    <motion.div initial="hidden" animate="visible" variants={containerVariants}
                className="w-full min-h-screen relative overflow-x-hidden pb-24"
                style={{ marginTop: '64px' }}>
      
      {/* 🌐 DYNAMIC GRID BACKGROUND OVERLAY */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] dark:invert-0 invert z-0" 
           style={{ backgroundImage: 'linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>

      {/* ========================================= */}
      {/* 🚀 HERO HEADER                            */}
      {/* ========================================= */}
      <div className="sticky top-0 z-30 px-4 py-8 md:py-12 transition-all overflow-visible bg-transparent">
        <div className="absolute inset-0 pointer-events-none opacity-[0.05] md:opacity-[0.03] dark:invert-0 invert z-0" 
             style={{ backgroundImage: 'linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>

        <div className="max-w-4xl mx-auto flex flex-col items-center justify-center relative z-10 overflow-visible">
          <ShieldExclamationIcon className="w-12 h-12 md:w-16 md:h-16 text-rose-500 mb-5 stroke-[1.5]" />
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-center mb-2 pb-4 leading-normal tracking-tight text-slate-900 dark:text-white">
            <span className="text-brand-highlight">{typingTitle}</span>
            <motion.span animate={{ opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 0.9 }} className="inline-block w-2.5 md:w-3 h-[0.8em] bg-indigo-500 dark:bg-indigo-400 ml-2 align-baseline" />
          </h1>

          <p className="text-[9px] md:text-[11px] font-mono font-bold uppercase tracking-[0.3em] md:tracking-[0.4em] text-slate-600 dark:text-slate-400 mb-4 text-center px-4">
            Quick Help & Emergency Support
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10 px-4 md:px-8 py-4">
        
        {/* ========================================= */}
        {/* 🚀 QUICK ACTION PROTOCOLS (DESKTOP)       */}
        {/* ========================================= */}
        <motion.div variants={itemVariants} className="hidden md:grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {PROTOCOLS.map(p => (
            <button key={p.id} onClick={() => handleGeminiTriage(p.prompt)}
                    className="glass-card p-4 rounded-[1.5rem] flex items-center justify-start gap-4 group hover:-translate-y-1 transition-all relative overflow-hidden border border-black/5 dark:border-white/5 hover:border-indigo-500/50 hover:shadow-[0_0_20px_rgba(99,102,241,0.2)]">
              
              <div className="relative w-12 h-12 flex items-center justify-center rounded-xl bg-black/5 dark:bg-white/5 group-hover:bg-indigo-500/10 transition-colors shrink-0">
                <p.icon className={`w-6 h-6 transition-colors duration-300 ${p.color}`} />
              </div>

              <div className="flex flex-col items-start text-left w-full overflow-hidden">
                <span className="text-[11px] lg:text-xs font-black uppercase tracking-tighter text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                  {p.label}
                </span>
                <span className="text-[9px] font-bold uppercase tracking-widest mt-1 text-slate-500 dark:text-slate-400">
                 Get Help
                </span>
              </div>
            </button>
          ))}
        </motion.div>

        {/* ✅ MOBILE QUICK ACTION BUTTON */}
        <motion.div variants={itemVariants} className="md:hidden relative w-max mx-auto overflow-visible mb-8">
          <button 
            onClick={() => setShowProtocolMenu(true)}
            className="flex items-center gap-2 px-6 py-3 rounded-full glass-card text-slate-900 dark:text-white transition-all shadow-lg"
          >
            <ShieldCheckIcon className="w-4 h-4 text-indigo-500" />
            <span className="text-[11px] font-black uppercase tracking-widest block py-0.5">
              Choose an Option
            </span>
          </button>
        </motion.div>

        <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* ========================================= */}
          {/* 🚀 LEFT: AI TRIAGE TERMINAL               */}
          {/* ========================================= */}
          <div className="lg:col-span-6 flex flex-col h-[600px]">
            <div className="glass-card rounded-[2.5rem] flex flex-col h-full border-t-4 border-t-rose-500 overflow-hidden shadow-2xl">
              
              <div className="p-5 border-b border-black/10 dark:border-white/10 flex items-center justify-between backdrop-blur-md">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-rose-500/10">
                    <CommandLineIcon className="w-5 h-5 text-rose-600 dark:text-rose-400" />
                  </div>
                  <div>
                    <h3 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-widest">Emergency Assistant</h3>
                    <p className="text-[9px] font-mono uppercase tracking-widest text-slate-500 mt-0.5">Online Now</p>
                  </div>
                </div>
                <div className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse shadow-[0_0_10px_rgba(244,63,94,0.8)]"></div>
              </div>
              
              <div className="flex-grow overflow-y-auto p-6 space-y-6 text-sm custom-scrollbar bg-black/5 dark:bg-black/20">
                {messages.map(m => (
                  <div key={m.id} className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'}`}>
                    <span className="opacity-60 block text-[9px] mb-1.5 uppercase font-bold tracking-widest text-slate-500">
                      [{new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}] {m.role === 'user' ? 'YOU' : 'XIST AI'}
                    </span>
                    <div className={`px-5 py-4 rounded-2xl max-w-[85%] font-medium leading-relaxed shadow-sm ${
                      m.role === 'user' 
                        ? 'bg-indigo-600 text-white rounded-br-none shadow-[0_0_15px_rgba(79,70,229,0.3)]' 
                        : 'glass-input rounded-bl-none text-slate-900 dark:text-white'
                    }`}>
                      {m.text}
                    </div>
                  </div>
                ))}
                {isAiAnalyzing && (
                  <div className="flex items-center gap-2 text-rose-500 font-black text-[10px] tracking-widest uppercase">
                    <ArrowPathIcon className="w-4 h-4 animate-spin" /> Finding the best steps...
                  </div>
                )}
              </div>

              <div className="p-4 border-t border-black/10 dark:border-white/10 backdrop-blur-md">
                <div className="relative flex items-center p-1.5 rounded-full glass-input">
                  <button 
                    onClick={toggleDictation} 
                    className={`p-2.5 rounded-full transition-all ml-1 ${isListening ? 'bg-rose-500 text-white animate-pulse shadow-[0_0_15px_rgba(244,63,94,0.5)]' : 'text-slate-500 hover:text-indigo-500 hover:bg-indigo-500/10'}`}
                  >
                    <MicrophoneIcon className="w-5 h-5"/>
                  </button>

                  <input 
                    value={userInput} 
                    onChange={handleInputChange} 
                    onKeyDown={e => e.key === 'Enter' && handleGeminiTriage(userInput)}
                    className="flex-1 bg-transparent px-3 py-2 text-sm font-medium outline-none text-slate-900 dark:text-white placeholder-slate-500" 
                    placeholder={isListening ? "Listening..." : "Describe emergency..."}
                  />
                  
                  <button 
                    onClick={() => handleGeminiTriage(userInput)} 
                    disabled={!userInput.trim() || isAiAnalyzing}
                    className={`p-2.5 rounded-full transition-all mr-1 ${!userInput.trim() ? 'opacity-30 cursor-not-allowed text-slate-500' : 'bg-rose-600 text-white hover:bg-rose-500 shadow-[0_0_15px_rgba(225,29,72,0.5)]'}`}
                  >
                    <PaperAirplaneIcon className="w-5 h-5"/>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* ========================================= */}
          {/* 🚀 RIGHT: INDIAN DIRECTORY & SEARCH       */}
          {/* ========================================= */}
          <div className="lg:col-span-6 flex flex-col h-[600px]">
            
            {/* TABS & SEARCH CONTAINER */}
            <div className="glass-card p-4 rounded-[2rem] mb-6 flex flex-col gap-4">
              
              {/* Directory Filter Tabs */}
              <div className="flex items-center gap-1 overflow-x-auto no-scrollbar pb-1">
                {[
                  { id: 'all', label: 'All Contacts' },
                  { id: 'national', label: 'National' },
                  { id: 'states', label: 'States (A-Z)' },
                  { id: 'banks', label: 'Banking' },
                  { id: 'global', label: 'Global' }
                ].map(tab => (
                  <button 
                    key={tab.id}
                    onClick={() => setDirectoryFilter(tab.id)}
                    className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all ${
                      directoryFilter === tab.id 
                        ? 'bg-indigo-600 text-white shadow-lg' 
                        : 'text-slate-600 dark:text-slate-400 hover:bg-black/5 dark:hover:bg-white/5'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Search Bar */}
              <div className="relative">
                <MagnifyingGlassIcon className="w-5 h-5 absolute left-5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input 
                  value={search} 
                  onChange={e => setSearch(e.target.value)}
                  className="w-full pl-14 pr-6 py-3.5 rounded-2xl text-sm font-bold outline-none transition-all glass-input text-slate-900 dark:text-white placeholder-slate-500" 
                  placeholder="Search State or Bank (e.g. Kerala, HDFC)..."
                />
              </div>
            </div>

            {/* SCROLLING DIRECTORY LIST */}
            <div className="flex-grow overflow-y-auto pr-2 custom-scrollbar space-y-6">
              {filteredDB.length === 0 ? (
                <div className="text-center py-12">
                  <MapPinIcon className="w-12 h-12 text-slate-500 opacity-50 mx-auto mb-4" />
                  <p className="text-xs font-mono uppercase tracking-widest text-slate-500">No contacts found.</p>
                </div>
              ) : (
                filteredDB.map((group, idx) => (
                  <div key={idx} className="space-y-4">
                    <div className="flex items-center gap-3 ml-2">
                      <MapPinIcon className="w-4 h-4 text-rose-500" />
                      <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-600 dark:text-slate-400">{group.cat}</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-4">
                      {group.contacts.map((c, i) => (
                        <div key={i} onClick={() => { navigator.clipboard.writeText(c.number); toast.success(`Copied: ${c.number}`); }}
                          className="glass-card p-5 rounded-[1.5rem] border-l-4 border-l-indigo-600 cursor-pointer group hover:border-l-rose-500 hover:-translate-y-1 transition-all">
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="text-xs font-black uppercase tracking-tight text-slate-900 dark:text-white">{c.name}</h4>
                            <PhoneIcon className="w-4 h-4 text-rose-500 group-hover:animate-bounce" />
                          </div>
                          <div className="text-lg font-mono font-black tracking-tighter text-indigo-600 dark:text-indigo-400 mb-1">{c.number}</div>
                          <p className="text-[9px] leading-relaxed font-bold uppercase tracking-widest text-slate-600 dark:text-slate-400">{c.desc}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

        </motion.div>

        {/* ========================================= */}
        {/* 🚀 BOTTOM BANNER                          */}
        {/* ========================================= */}
        <motion.div variants={itemVariants} className="mt-12 glass-card p-8 rounded-[2.5rem] border border-indigo-500/20 flex flex-col md:flex-row items-center justify-between gap-6 shadow-[0_0_30px_rgba(79,70,229,0.1)]">
            <div className="flex items-center gap-6">
                <div className="w-16 h-16 bg-indigo-600 rounded-[1.5rem] flex items-center justify-center shadow-lg shadow-indigo-600/30 shrink-0">
                  <GlobeAsiaAustraliaIcon className="w-8 h-8 text-white"/>
                </div>
                <div>
                    <h3 className="text-lg font-black uppercase tracking-tighter text-slate-900 dark:text-white">India Cyber Cell Website</h3>
                    <p className="text-xs font-medium text-slate-600 dark:text-slate-400 mt-1">The official website to report a cyber crime in India.</p>
                </div>
            </div>
            <button onClick={() => window.open('https://cybercrime.gov.in', '_blank')}
                    className="px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg active:scale-95 whitespace-nowrap">
                Open Official Portal
            </button>
        </motion.div>

      </div>

      {/* ========================================= */}
      {/* 🎛️ PROTOCOL MODAL (MOBILE FIX)            */}
      {/* ========================================= */}
      <AnimatePresence>
        {showProtocolMenu && (
          <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowProtocolMenu(false)} />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-72 rounded-[2rem] shadow-2xl glass-card overflow-hidden flex flex-col z-10"
            >
              <div className="p-5 border-b border-black/10 dark:border-white/10 flex justify-between items-center text-xs font-black uppercase tracking-widest text-slate-900 dark:text-white">
                <span className="ml-1">Choose an Option</span>
                <button onClick={() => setShowProtocolMenu(false)} className="p-1 hover:bg-black/5 dark:hover:bg-white/5 rounded-md transition-colors text-slate-500"><XMarkIcon className="w-5 h-5" /></button>
              </div>
              <div className="flex flex-col p-2">
                {PROTOCOLS.map(p => (
                  <button key={p.id} onClick={() => { handleGeminiTriage(p.prompt); setShowProtocolMenu(false); }}
                    className="w-full text-left px-5 py-4 text-[11px] font-black uppercase tracking-widest transition-all flex items-center gap-4 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-black/5 dark:hover:bg-white/5"
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