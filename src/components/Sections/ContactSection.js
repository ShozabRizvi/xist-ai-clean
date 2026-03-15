import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast, Toaster } from 'react-hot-toast';
import {
  EnvelopeIcon, MapPinIcon, ChatBubbleLeftRightIcon,
  PaperAirplaneIcon, ArrowPathIcon, ShieldCheckIcon,
  IdentificationIcon, UserPlusIcon,
  LockClosedIcon, ChevronDownIcon
} from '@heroicons/react/24/outline';

// ==============================
// UTILITY: TYPEWRITER EFFECT
// ==============================
const useTypewriter = (text, speed = 80, delay = 200) => {
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
    input: 'bg-slate-950 border border-slate-800 text-indigo-400 placeholder-slate-600 focus:border-indigo-500 shadow-inner'
  },
  light: {
    background: 'bg-slate-50',
    headerBg: 'bg-white/80 backdrop-blur-xl',
    card: 'bg-white border border-slate-200 shadow-xl',
    inner: 'bg-slate-100 border border-slate-200',
    textPrimary: 'text-slate-900',
    textSecondary: 'text-slate-600',
    muted: 'text-slate-400',
    input: 'bg-white border border-slate-300 text-indigo-600 placeholder-slate-400 focus:border-indigo-500 shadow-sm'
  }
};

const CONTACT_CATEGORIES = [
  { id: 'general', label: 'General Inquiry' },
  { id: 'technical', label: 'App Support' },
  { id: 'security', label: 'Security Report' },
  { id: 'partnership', label: 'Partnership' }
];

const ContactSection = ({ user, theme: globalTheme }) => {
  // ✅ Globally Adaptive Theme Sync
  const isDark = globalTheme === 'dark';
  const themeMode = (globalTheme === 'dark' || globalTheme === 'light') ? globalTheme : 'dark';
  const theme = THEMES[themeMode];

  const typingTitle = useTypewriter("Contact Us", 80, 200);

  const [formData, setFormData] = useState({
    name: user?.displayName || '',
    email: user?.email || '',
    subject: '',
    message: '',
    category: 'general'
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showCategoryMenu, setShowCategoryMenu] = useState(false);

  // ✅ 3-Column Team Roster
  const teamMembers = [
    { name: 'Shozab Rizvi', role: 'Lead Developer', email: 'rshozab64@gmail.com', icon: IdentificationIcon },
    { name: 'Rishabh Srivastava', role: 'Security Analyst', email: 'parabalsrivastava@gmail.com', icon: LockClosedIcon },
    { name: 'Asmit Gupta', role: 'Project Mentor', email: 'asmitgupta2006@gmail.com', icon: UserPlusIcon }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch("https://formspree.io/f/mbdanbww", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast.success('Message sent successfully!');
        setFormData({ ...formData, subject: '', message: '' });
      } else {
        throw new Error("Relay failed");
      }
    } catch (err) {
      toast.error("Message failed to send. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Animation Variants
  const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } };
  const itemVariants = { hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 100 } } };

  return (
    <motion.div initial="hidden" animate="visible" variants={containerVariants}
                className={`w-full min-h-screen relative transition-colors duration-500 ${theme.background} ${theme.textPrimary} overflow-x-hidden`}
                style={{ fontFamily: 'Inter, system-ui, sans-serif', marginLeft: typeof window !== 'undefined' && window.innerWidth > 768 ? '280px' : '0px', marginTop: '64px' }}>
      
      {/* 🌐 DYNAMIC GRID BACKGROUND OVERLAY */}
      <div className={`absolute inset-0 pointer-events-none opacity-[0.03] ${isDark ? '' : 'invert'} z-0`} 
           style={{ backgroundImage: 'linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>

      <Toaster position="top-right" containerStyle={{ top: 80 }} />

      {/* ========================================= */}
      {/* 🚀 HERO HEADER (CONTACT STYLE)            */}
      {/* ========================================= */}
      <div className={`sticky top-0 z-30 px-4 py-8 md:py-12 transition-all overflow-visible ${theme.headerBg}`}>
        
        <div className={`absolute inset-0 pointer-events-none opacity-[0.05] md:opacity-[0.03] ${isDark ? '' : 'invert'} z-0`} 
             style={{ backgroundImage: 'linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>

        <div className="max-w-4xl mx-auto flex flex-col items-center justify-center relative z-10 overflow-visible">
          
          <ChatBubbleLeftRightIcon className="w-10 h-10 md:w-14 md:h-14 text-indigo-500 mb-5 stroke-[1.5]" />
          
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
            Get in touch with the team
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-10 px-4 md:px-8 py-8">
        
        {/* LEFT COLUMN: TEAM DIRECTORY & HQ */}
        <motion.div variants={itemVariants} className="lg:col-span-5 space-y-6">
          
          {/* HQ Location Box */}
          <div className={`${theme.card} p-6 rounded-2xl relative overflow-hidden border-l-4 border-l-indigo-500`}>
            <div className="flex items-center gap-4">
               <div className="p-3 bg-indigo-500/10 rounded-xl shrink-0"><MapPinIcon className="w-6 h-6 text-indigo-500" /></div>
               <div className="min-w-0">
                 <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-500 mb-1">Headquarters</h3>
                 <p className={`text-sm font-bold truncate ${theme.textPrimary}`}>Feroze Gandhi Institute of Eng. & Tech.</p>
                 <p className={`text-xs font-mono mt-1 truncate ${theme.textSecondary}`}>Raebareli, Uttar Pradesh, INDIA</p>
               </div>
            </div>
          </div>

          <h3 className={`text-[10px] font-black uppercase tracking-[0.3em] ${theme.muted} ml-2 mt-4`}>Team Directory</h3>

          {/* Team Layout */}
          <div className="flex flex-col gap-4">
            {teamMembers.map((member, index) => {
              const Icon = member.icon;
              return (
                <div key={index} className={`${theme.card} p-5 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between group hover:border-indigo-500/50 transition-all cursor-pointer gap-3`}
                     onClick={() => {
                       navigator.clipboard.writeText(member.email);
                       toast.success(`Email copied to clipboard!`);
                     }}>
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="p-2.5 bg-slate-800/50 rounded-lg group-hover:bg-indigo-500/10 transition-colors shrink-0">
                      <Icon className="w-5 h-5 text-slate-400 group-hover:text-indigo-400" />
                    </div>
                    <div className="min-w-0">
                      <h4 className={`text-sm font-bold truncate ${theme.textPrimary}`}>{member.name}</h4>
                      <p className={`text-[9px] uppercase tracking-widest font-black text-indigo-500/70 truncate`}>{member.role}</p>
                    </div>
                  </div>
                  
                  {/* ✅ FIXED: Layout protected from squishing */}
                  <div className="flex items-center gap-2 justify-start sm:justify-end min-w-0">
                    <span className={`text-[11px] font-mono break-all sm:text-right ${theme.textSecondary} max-w-[180px] sm:max-w-none`}>
                      {member.email}
                    </span>
                    <EnvelopeIcon className="w-4 h-4 text-slate-500 group-hover:text-indigo-400 shrink-0" />
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* RIGHT COLUMN: SECURE MESSAGE TERMINAL */}
        <motion.div variants={itemVariants} className="lg:col-span-7">
          <div className={`${theme.card} p-6 md:p-8 rounded-2xl relative overflow-hidden`}>
            
            <div className="flex items-center justify-between mb-8">
              <div className="flex flex-col gap-1 min-w-0"> 
                <h3 className={`text-[10px] font-black uppercase tracking-[0.3em] flex items-center gap-2 truncate ${theme.textPrimary}`}>
                  <ShieldCheckIcon className="w-4 h-4 text-indigo-500 shrink-0" /> Send a Message
                </h3>
                <p className="text-[9px] font-mono uppercase tracking-widest text-slate-500 ml-6 truncate">
                  We'd love to hear from you
                </p>
              </div>
              
              <div className="flex gap-1 shrink-0">
                <div className="w-1 h-1 rounded-full bg-indigo-500 animate-ping"></div>
                <div className="w-1 h-1 rounded-full bg-indigo-500/50"></div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="text-[9px] font-bold uppercase text-slate-500 mb-1.5 block ml-1 tracking-widest">Your Name</label>
                  <input type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required
                    className={`w-full px-4 py-3 rounded-xl text-sm outline-none font-mono transition-all border-transparent ${theme.input}`} />
                </div>
                <div>
                  <label className="text-[9px] font-bold uppercase text-slate-500 mb-1.5 block ml-1 tracking-widest">Email Address</label>
                  <input type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} required
                    className={`w-full px-4 py-3 rounded-xl text-sm outline-none font-mono transition-all border-transparent ${theme.input}`} />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* ✅ CATEGORY SELECTOR: MOBILE MODAL READY */}
                <div>
                  <label className="text-[9px] font-bold uppercase text-slate-500 mb-1.5 block ml-1 tracking-widest">Topic</label>
                  <button 
                    type="button"
                    onClick={() => setShowCategoryMenu(true)}
                    className={`w-full px-4 py-3 rounded-xl text-xs flex items-center justify-between font-black uppercase tracking-widest border-transparent ${theme.input} text-left transition-all`}
                  >
                    {CONTACT_CATEGORIES.find(c => c.id === formData.category)?.label}
                    <ChevronDownIcon className="w-4 h-4 text-indigo-500 shrink-0" />
                  </button>
                </div>
                <div>
                  <label className="text-[9px] font-bold uppercase text-slate-500 mb-1.5 block ml-1 tracking-widest">Subject</label>
                  <input type="text" value={formData.subject} onChange={(e) => setFormData({...formData, subject: e.target.value})} required
                    className={`w-full px-4 py-3 rounded-xl text-sm outline-none font-mono transition-all border-transparent ${theme.input}`} />
                </div>
              </div>

              <div>
                <label className="text-[9px] font-bold uppercase text-slate-500 mb-1.5 block ml-1 tracking-widest">Your Message</label>
                <textarea value={formData.message} onChange={(e) => setFormData({...formData, message: e.target.value})} required rows={6}
                  placeholder="Enter details here..."
                  className={`w-full px-4 py-3 rounded-xl text-sm resize-none outline-none font-medium transition-all border-transparent ${theme.input}`} />
              </div>

              <button type="submit" disabled={isSubmitting} 
                      className="w-full mt-4 relative overflow-hidden bg-indigo-600 hover:bg-indigo-500 py-4 rounded-xl transition-all shadow-xl shadow-indigo-500/20 active:scale-[0.98] group/btn">
                {isSubmitting ? (
                  <div className="flex items-center justify-center gap-2">
                    <ArrowPathIcon className="w-4 h-4 animate-spin text-white" />
                    <span className="text-[10px] font-black text-white uppercase tracking-[0.2em]">Sending...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2">
                    <PaperAirplaneIcon className="w-4 h-4 text-white group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
                    <span className="text-[10px] font-black text-white uppercase tracking-[0.2em]">Send Message</span>
                  </div>
                )}
              </button>
            </form>
          </div>
        </motion.div>

      </div>
      <div className="h-24" />

      {/* ========================================= */}
      {/* 🎛️ GLOBAL CATEGORY MODAL (MOBILE FIX)     */}
      {/* ========================================= */}
      <AnimatePresence>
        {showCategoryMenu && (
          <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowCategoryMenu(false)} />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className={`relative w-72 rounded-3xl shadow-2xl border overflow-hidden flex flex-col z-10 ${isDark ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200'}`}
            >
              <div className={`p-4 border-b text-center text-xs font-black uppercase tracking-widest ${isDark ? 'border-slate-800 text-slate-400' : 'border-slate-100 text-slate-500'}`}>Select Topic</div>
              <div className="flex flex-col p-2">
                {CONTACT_CATEGORIES.map(f => (
                  <button key={f.id} onClick={() => { setFormData({...formData, category: f.id}); setShowCategoryMenu(false); }}
                    className={`w-full text-left px-5 py-4 text-[11px] font-black uppercase tracking-widest transition-all rounded-xl ${formData.category === f.id ? 'bg-indigo-600 text-white' : (isDark ? 'text-slate-300 hover:bg-slate-800' : 'text-slate-600 hover:bg-slate-50')}`}
                  > 
                    {f.label} 
                  </button>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </motion.div>
  );
};

export default ContactSection;