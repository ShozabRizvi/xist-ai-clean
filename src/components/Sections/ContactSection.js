import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast, Toaster } from 'react-hot-toast';
import {
  ChatBubbleLeftRightIcon, PaperAirplaneIcon, 
  ArrowPathIcon, ShieldCheckIcon, ChevronDownIcon
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

const CONTACT_CATEGORIES = [
  { id: 'general', label: 'General Question' },
  { id: 'technical', label: 'Need Help with the App' },
  { id: 'security', label: 'Report a Security Issue' },
  { id: 'partnership', label: 'Business & Partnerships' }
];

const ContactSection = () => {
  const typingTitle = useTypewriter("Contact Support", 80, 200);

  // 🚀 FIX: Removed all default names/emails. Form starts completely blank.
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    category: 'general'
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // State for the new inline dropdown
  const [showTopicDropdown, setShowTopicDropdown] = useState(false);

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
        setFormData({ name: '', email: '', subject: '', message: '', category: 'general' });
      } else {
        throw new Error("Relay failed");
      }
    } catch (err) {
      toast.error("Message failed to send. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } };
  const itemVariants = { hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 100 } } };

  return (
    <motion.div initial="hidden" animate="visible" variants={containerVariants}
                className="w-full min-h-screen relative overflow-x-hidden"
                style={{ marginTop: '64px' }}>
      
      {/* 🌐 DYNAMIC GRID BACKGROUND OVERLAY */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] dark:invert-0 invert z-0" 
           style={{ backgroundImage: 'linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>

      <Toaster position="top-right" containerStyle={{ top: 80 }} />

      {/* ========================================= */}
      {/* 🚀 HERO HEADER                            */}
      {/* ========================================= */}
      <div className="sticky top-0 z-30 px-4 py-8 md:py-12 transition-all overflow-visible bg-transparent">
        <div className="absolute inset-0 pointer-events-none opacity-[0.05] md:opacity-[0.03] dark:invert-0 invert z-0" 
             style={{ backgroundImage: 'linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>

        <div className="max-w-4xl mx-auto flex flex-col items-center justify-center relative z-10 overflow-visible">
          <ChatBubbleLeftRightIcon className="w-10 h-10 md:w-14 md:h-14 text-indigo-500 dark:text-indigo-400 mb-5 stroke-[1.5]" />
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-center mb-2 pb-4 leading-normal tracking-tight text-slate-900 dark:text-white">
            <span className="text-brand-highlight">{typingTitle}</span>
            <motion.span animate={{ opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 0.9 }} className="inline-block w-2.5 md:w-3 h-[0.8em] bg-indigo-500 dark:bg-indigo-400 ml-2 align-baseline" />
          </h1>

          <p className="text-[9px] md:text-[11px] font-mono font-bold uppercase tracking-[0.3em] md:tracking-[0.4em] text-slate-600 dark:text-slate-400 mb-4 text-center px-4">
            We are here to help
          </p>
        </div>
      </div>

      {/* ========================================= */}
      {/* 🚀 MAIN CONTENT: CENTERED FORM            */}
      {/* ========================================= */}
      <div className="max-w-3xl mx-auto relative z-10 px-4 md:px-8 py-8">
        
        <motion.div variants={itemVariants} className="glass-card p-6 md:p-10 rounded-[2.5rem] relative overflow-visible shadow-2xl">
          
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3 min-w-0"> 
              <div className="p-2 bg-indigo-500/10 rounded-xl">
                <ShieldCheckIcon className="w-5 h-5 text-indigo-600 dark:text-indigo-400 shrink-0" />
              </div>
              <div>
                <h3 className="text-sm font-black uppercase tracking-[0.2em] text-slate-900 dark:text-white">
                  Send a Message
                </h3>
                <p className="text-[10px] font-medium uppercase tracking-widest text-slate-500 dark:text-slate-400 mt-0.5">
                  Secure Communication Line
                </p>
              </div>
            </div>
            
            <div className="flex gap-1 shrink-0">
              <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-ping"></div>
              <div className="w-1.5 h-1.5 rounded-full bg-indigo-500/50"></div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-[10px] font-bold uppercase text-slate-500 dark:text-slate-400 mb-2 block ml-1 tracking-widest">Full Name</label>
                <input type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required
                  className="w-full px-4 py-3.5 rounded-2xl text-sm font-medium transition-all glass-input text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400" 
                  placeholder="John Doe" />
              </div>
              <div>
                <label className="text-[10px] font-bold uppercase text-slate-500 dark:text-slate-400 mb-2 block ml-1 tracking-widest">Email Address</label>
                <input type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} required
                  className="w-full px-4 py-3.5 rounded-2xl text-sm font-medium transition-all glass-input text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400" 
                  placeholder="john@example.com" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative">
              {/* 🚀 INLINE DROPDOWN FOR TOPIC */}
              <div className="relative">
                <label className="text-[10px] font-bold uppercase text-slate-500 dark:text-slate-400 mb-2 block ml-1 tracking-widest">Topic</label>
                <button 
                  type="button"
                  onClick={() => setShowTopicDropdown(!showTopicDropdown)}
                  className="w-full px-4 py-3.5 rounded-2xl text-xs flex items-center justify-between font-black uppercase tracking-widest transition-all glass-input text-slate-900 dark:text-white"
                >
                  {CONTACT_CATEGORIES.find(c => c.id === formData.category)?.label}
                  <ChevronDownIcon className={`w-4 h-4 text-indigo-500 shrink-0 transition-transform ${showTopicDropdown ? 'rotate-180' : ''}`} />
                </button>

                <AnimatePresence>
                  {showTopicDropdown && (
                    <motion.div 
                      initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                      className="absolute top-full left-0 right-0 mt-2 p-2 rounded-2xl shadow-2xl z-50 glass-card border border-black/10 dark:border-white/10"
                    >
                      {CONTACT_CATEGORIES.map(c => (
                        <button 
                          key={c.id} type="button" 
                          onClick={() => { setFormData({...formData, category: c.id}); setShowTopicDropdown(false); }}
                          className={`w-full text-left px-4 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${formData.category === c.id ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-600 dark:text-slate-400 hover:bg-black/5 dark:hover:bg-white/5'}`}
                        >
                          {c.label}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase text-slate-500 dark:text-slate-400 mb-2 block ml-1 tracking-widest">Subject</label>
                <input type="text" value={formData.subject} onChange={(e) => setFormData({...formData, subject: e.target.value})} required
                  className="w-full px-4 py-3.5 rounded-2xl text-sm font-medium transition-all glass-input text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400" 
                  placeholder="What is this about?" />
              </div>
            </div>

            <div>
              <label className="text-[10px] font-bold uppercase text-slate-500 dark:text-slate-400 mb-2 block ml-1 tracking-widest">How can we help?</label>
              <textarea value={formData.message} onChange={(e) => setFormData({...formData, message: e.target.value})} required rows={5}
                placeholder="Type your message here..."
                className="w-full px-4 py-4 rounded-2xl text-sm resize-none font-medium transition-all glass-input text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400" />
            </div>

            <button type="submit" disabled={isSubmitting} 
                    className="w-full mt-2 relative overflow-hidden bg-indigo-600 hover:bg-indigo-500 py-4 rounded-2xl transition-all shadow-[0_0_20px_rgba(79,70,229,0.3)] active:scale-[0.98] group/btn">
              {isSubmitting ? (
                <div className="flex items-center justify-center gap-2">
                  <ArrowPathIcon className="w-5 h-5 animate-spin text-white" />
                  <span className="text-[11px] font-black text-white uppercase tracking-[0.2em]">Sending...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2">
                  <PaperAirplaneIcon className="w-5 h-5 text-white group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
                  <span className="text-[11px] font-black text-white uppercase tracking-[0.2em]">Send Message</span>
                </div>
              )}
            </button>
          </form>
        </motion.div>

      </div>
      <div className="h-24" />
    </motion.div>
  );
};

export default ContactSection;