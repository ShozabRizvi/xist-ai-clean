import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast, Toaster } from 'react-hot-toast';
import {
  EnvelopeIcon, MapPinIcon, ChatBubbleLeftRightIcon,
  PaperAirplaneIcon, ArrowPathIcon, ShieldCheckIcon,
  UserCircleIcon, IdentificationIcon,UserPlusIcon,
  LockClosedIcon
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
    background: 'bg-slate-950',
    card: 'bg-slate-900 border-slate-800 shadow-2xl',
    inner: 'bg-slate-950 border-slate-800',
    textPrimary: 'text-slate-100',
    textSecondary: 'text-slate-400',
    muted: 'text-slate-500',
    input: 'bg-slate-950 border-slate-800 text-indigo-400 placeholder-slate-600 focus:border-indigo-500 shadow-inner'
  },
  light: {
    background: 'bg-slate-50',
    card: 'bg-white border-slate-200 shadow-xl',
    inner: 'bg-slate-100 border-slate-200',
    textPrimary: 'text-slate-900',
    textSecondary: 'text-slate-600',
    muted: 'text-slate-400',
    input: 'bg-slate-50 border-slate-300 text-indigo-600 placeholder-slate-400 focus:border-indigo-500 shadow-sm'
  }
};

const ContactSection = ({ user, theme: globalTheme }) => {
  // ✅ Globally Adaptive Theme Sync
  const isDark = globalTheme === 'dark';
  const themeMode = (globalTheme === 'dark' || globalTheme === 'light') ? globalTheme : 'dark';
  const theme = THEMES[themeMode];

  const typingTitle = useTypewriter("Secure Communication", 80, 200);

  const [formData, setFormData] = useState({
    name: user?.displayName || '',
    email: user?.email || '',
    subject: '',
    message: '',
    category: 'general'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ✅ 3-Column Team Roster
  const teamMembers = [
    { name: 'Shozab Rizvi', role: 'Lead Operative / Developer', email: 'rshozab64@gmail.com', icon: IdentificationIcon },
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
        toast.success('Transmission received by HQ!');
        setFormData({ ...formData, subject: '', message: '' });
      } else {
        throw new Error("Relay failed");
      }
    } catch (err) {
      toast.error("Transmission blocked by firewall.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Animation Variants
  const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } };
  const itemVariants = { hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 100 } } };

  return (
    <motion.div initial="hidden" animate="visible" variants={containerVariants}
                className={`w-full min-h-screen p-8 relative transition-colors duration-500 ${theme.background} ${theme.textPrimary} overflow-x-hidden`}
                style={{ fontFamily: 'Inter, system-ui, sans-serif', marginLeft: '280px', marginTop: '64px' }}>
      
      {/* 🌐 DYNAMIC GRID BACKGROUND OVERLAY */}
      <div className={`absolute inset-0 pointer-events-none opacity-[0.03] ${isDark ? '' : 'invert'}`} 
           style={{ backgroundImage: 'linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>

      <Toaster position="top-right" containerStyle={{ top: 80 }} />

      {/* HEADER */}
      <div className="max-w-5xl mx-auto text-center mb-12 relative z-10">
        <ChatBubbleLeftRightIcon className="w-16 h-16 text-indigo-500 mx-auto mb-4 opacity-80" />
        <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-3">
            <span>{typingTitle}</span>
            <motion.span animate={{ opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 0.8 }} className="w-1.5 h-8 bg-indigo-500 inline-block ml-1" />
        </h1>
        <p className={`${theme.muted} text-sm font-mono tracking-widest uppercase`}>
          Direct Channel to Xist Intelligence HQ
        </p>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-10">
        
        {/* LEFT COLUMN: TEAM DIRECTORY & HQ */}
        <motion.div variants={itemVariants} className="lg:col-span-5 space-y-6">
          
          {/* HQ Location Box */}
          <div className={`${theme.card} p-6 rounded-2xl relative overflow-hidden border-l-4 border-l-indigo-500`}>
            <div className="flex items-center gap-4">
               <div className="p-3 bg-indigo-500/10 rounded-xl"><MapPinIcon className="w-6 h-6 text-indigo-500" /></div>
               <div>
                 <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-500 mb-1">Central Command</h3>
                 <p className={`text-sm font-bold ${theme.textPrimary}`}>Feroze Gandhi Institute of Eng. & Tech.</p>
                 <p className={`text-xs font-mono mt-1 ${theme.textSecondary}`}>Raebareli, Uttar Pradesh, INDIA</p>
               </div>
            </div>
          </div>

          <h3 className={`text-[10px] font-black uppercase tracking-[0.3em] ${theme.muted} ml-2 mt-4`}>Operative Directory</h3>

          {/* 3-Row/Column Team Layout */}
          <div className="flex flex-col gap-4">
           {teamMembers.map((member, index) => {
  const Icon = member.icon;
  return (
    <div key={index} className={`${theme.card} p-5 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between group hover:border-indigo-500/50 transition-all cursor-pointer gap-3`}
         onClick={() => {
           navigator.clipboard.writeText(member.email);
           toast.success(`${member.name}'s comm-link copied!`);
         }}>
      <div className="flex items-center gap-4">
        <div className="p-2.5 bg-slate-800/50 rounded-lg group-hover:bg-indigo-500/10 transition-colors">
          <Icon className="w-5 h-5 text-slate-400 group-hover:text-indigo-400" />
        </div>
        <div>
          <h4 className={`text-sm font-bold ${theme.textPrimary}`}>{member.name}</h4>
          <p className={`text-[9px] uppercase tracking-widest font-black text-indigo-500/70`}>{member.role}</p>
        </div>
      </div>
      
      {/* ✅ FIXED: Added break-all and flex-shrink-0 to prevent trimming */}
      <div className="flex items-center gap-2 justify-end">
        <span className={`text-[11px] font-mono break-all text-right ${theme.textSecondary} max-w-[180px] sm:max-w-none`}>
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
          <div className={`${theme.card} p-8 rounded-2xl relative overflow-hidden border`}>
            {/* Tactical Corner accents */}
           <div className="flex items-center justify-between mb-8">
  <div className="flex flex-col gap-1"> {/* ✅ Added column wrapper */}
    <h3 className={`text-[10px] font-black uppercase tracking-[0.3em] flex items-center gap-2 ${theme.textPrimary}`}>
      <ShieldCheckIcon className="w-4 h-4 text-indigo-500" /> Secure Transmission Form
    </h3>
    {/* ✅ New Subtitle with Forensic Styling */}
    <p className="text-[9px] font-mono uppercase tracking-widest text-slate-500 ml-6">
      Send your queries and feedback<span className="animate-pulse"></span>
    </p>
  </div>
  
  <div className="flex gap-1">
    <div className="w-1 h-1 rounded-full bg-indigo-500 animate-ping"></div>
    <div className="w-1 h-1 rounded-full bg-indigo-500/50"></div>
  </div>
</div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="text-[9px] font-bold uppercase text-slate-500 mb-1.5 block ml-1 tracking-widest">Operative_Name</label>
                  <input type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required
                    className={`w-full px-4 py-3 rounded-xl text-sm outline-none font-mono transition-all border-2 border-transparent ${theme.input} focus:border-indigo-500/30`} />
                </div>
                <div>
                  <label className="text-[9px] font-bold uppercase text-slate-500 mb-1.5 block ml-1 tracking-widest">Return_Address</label>
                  <input type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} required
                    className={`w-full px-4 py-3 rounded-xl text-sm outline-none font-mono transition-all border-2 border-transparent ${theme.input} focus:border-indigo-500/30`} />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="text-[9px] font-bold uppercase text-slate-500 mb-1.5 block ml-1 tracking-widest">Routing_Category</label>
                  <select value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})}
                    className={`w-full px-4 py-3 rounded-xl text-xs outline-none font-black uppercase tracking-widest appearance-none border-2 border-transparent ${theme.input} focus:border-indigo-500/30 cursor-pointer`}>
                    <option value="general">General_Intel</option>
                    <option value="technical">Technical_Support</option>
                    <option value="security">Security_Vulnerability</option>
                    <option value="partnership">Alliance_Partnership</option>
                  </select>
                </div>
                <div>
                  <label className="text-[9px] font-bold uppercase text-slate-500 mb-1.5 block ml-1 tracking-widest">Transmission_Subject</label>
                  <input type="text" value={formData.subject} onChange={(e) => setFormData({...formData, subject: e.target.value})} required
                    className={`w-full px-4 py-3 rounded-xl text-sm outline-none font-mono transition-all border-2 border-transparent ${theme.input} focus:border-indigo-500/30`} />
                </div>
              </div>

              <div>
                <label className="text-[9px] font-bold uppercase text-slate-500 mb-1.5 block ml-1 tracking-widest">Message_Payload</label>
                <textarea value={formData.message} onChange={(e) => setFormData({...formData, message: e.target.value})} required rows={6}
                  placeholder="Enter secure details here..."
                  className={`w-full px-4 py-3 rounded-xl text-sm resize-none outline-none font-medium transition-all border-2 border-transparent ${theme.input} focus:border-indigo-500/30`} />
              </div>

              <button type="submit" disabled={isSubmitting} 
                      className="w-full mt-4 relative overflow-hidden bg-indigo-600 hover:bg-indigo-500 py-4 rounded-xl transition-all shadow-xl shadow-indigo-500/20 active:scale-[0.98] group/btn">
                {isSubmitting ? (
                  <div className="flex items-center justify-center gap-2">
                    <ArrowPathIcon className="w-4 h-4 animate-spin text-white" />
                    <span className="text-[10px] font-black text-white uppercase tracking-[0.2em]">Encrypting & Sending...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2">
                    <PaperAirplaneIcon className="w-4 h-4 text-white group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
                    <span className="text-[10px] font-black text-white uppercase tracking-[0.2em]">Transmit Payload</span>
                  </div>
                )}
              </button>
            </form>
          </div>
        </motion.div>

      </div>
      <div className="h-24" />
    </motion.div>
  );
};

export default ContactSection;