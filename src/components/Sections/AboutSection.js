import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  InformationCircleIcon, ShieldCheckIcon, UsersIcon, CpuChipIcon, 
  AcademicCapIcon, CodeBracketIcon, PaintBrushIcon
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

const AboutSection = () => {
  const [isStackExpanded, setIsStackExpanded] = useState(false);
  const [activeCard, setActiveCard] = useState(null);
  const typingTitle = useTypewriterEffect("About Xist AI", 80, 200);

  // ✅ STAGGERED ANIMATION ENGINE
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.1 } }
  };
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 100 } }
  };

  // ✅ THE FOOLPROOF 4-STATE ANIMATION ENGINE
  const stackVariants = {
    compressed: (i) => ({
      x: i * 15, y: i * 15, rotate: i * -4, scale: 1 - i * 0.05, zIndex: 10 - i, opacity: 1,
      transition: { type: "spring", stiffness: 300, damping: 25 }
    }),
    expanded: (i) => {
      const w = typeof window !== 'undefined' ? window.innerWidth : 1000;
      const isMobile = w < 768;
      const vSpread = typeof window !== 'undefined' ? Math.min(window.innerHeight * 0.35, 280) : 280;
      const hSpread = Math.min(w * 0.22, 320);
      return {
        x: isMobile ? 0 : (i === 0 ? -hSpread : i === 1 ? 0 : hSpread),
        y: isMobile ? (i === 0 ? -vSpread : i === 1 ? 0 : vSpread) : (i === 0 ? 10 : i === 1 ? -15 : 10),
        rotate: isMobile ? 0 : (i === 0 ? -4 : i === 1 ? 0 : 4),
        scale: isMobile ? 1.02 : 1.05, zIndex: 20, opacity: 1,
        transition: { type: "spring", stiffness: 260, damping: 20 }
      };
    },
    focusedActive: (i) => {
      const w = typeof window !== 'undefined' ? window.innerWidth : 1000;
      const isMobile = w < 768;
      const hSpread = Math.min(w * 0.22, 320);
      if (isMobile) {
        return { x: 0, y: 0, rotate: 0, scale: 1.05, zIndex: 50, opacity: 1, transition: { type: "spring", stiffness: 300, damping: 20 } };
      } else {
        return { x: i === 0 ? -hSpread : i === 1 ? 0 : hSpread, y: i === 0 ? 10 : i === 1 ? -15 : 10, rotate: i === 0 ? -4 : i === 1 ? 0 : 4, scale: 1.1, zIndex: 50, opacity: 1, transition: { type: "spring", stiffness: 300, damping: 20 } };
      }
    },
    focusedInactive: (i) => {
      const w = typeof window !== 'undefined' ? window.innerWidth : 1000;
      const isMobile = w < 768;
      const vSpread = typeof window !== 'undefined' ? Math.min(window.innerHeight * 0.35, 280) : 280;
      const hSpread = Math.min(w * 0.22, 320);
      if (isMobile) {
        return { x: 0, y: i === 0 ? -vSpread - 40 : i === 1 ? 0 : vSpread + 40, rotate: 0, scale: 0.85, zIndex: 10, opacity: 0.25, transition: { type: "spring", stiffness: 260, damping: 20 } };
      } else {
        return { x: i === 0 ? -hSpread : i === 1 ? 0 : hSpread, y: i === 0 ? 10 : i === 1 ? -15 : 10, rotate: i === 0 ? -4 : i === 1 ? 0 : 4, scale: 1.0, zIndex: 10, opacity: 0.5, transition: { type: "spring", stiffness: 260, damping: 20 } };
      }
    }
  };

  const teamMembers = [
    {
      name: 'Shozab Rizvi', role: 'Lead Developer', image: 'shozab3.jpg', icon: CodeBracketIcon,
      experience: '3rd Year Student', education: 'B.Tech Computer Science Engineering, FGIET',
      bio: 'Shozab is a third-year computer science student at FGIET Raebareli and the founder of Xist AI. As a passionate student developer, he leads the technical development of the platform while balancing his academic studies.',
      specializations: ['React Development', 'JavaScript/TypeScript', 'AI Integration', 'Web Security', 'System Design'],
      socialLinks: { github: 'https://github.com/shozabrizvi', linkedin: 'https://linkedin.com/in/shozab-rizvi' },
      location: 'Raebareli, UP'
    },
    {
      name: 'Rishabh Srivastava', role: 'AI Expert', image: 'Rishabh.png', icon: CpuChipIcon,
      experience: '3rd Year Student', education: 'B.Tech Computer Science Engineering, FGIET',
      bio: 'Rishabh is a third-year computer science student at FGIET Raebareli, specializing in artificial intelligence and machine learning. He develops intelligent analysis systems for Xist AI.',
      specializations: ['Machine Learning', 'Python Programming', 'AI Model Training', 'Data Analysis', 'Algorithm Design'],
      socialLinks: { github: 'https://github.com/rishabh-ai-fresh', linkedin: 'https://www.linkedin.com/in/rishabh-srivastava-854a98377/' },
      location: 'Raebareli, UP'
    },
    {
      name: 'Asmit Gupta', role: 'Community Moderator', image: 'Asmit.png', icon: PaintBrushIcon,
      experience: '2nd Year Student', education: 'B.Tech Computer Science Engineering, AKGEC',
      bio: 'Asmit is a second-year computer science student at AKGEC, Ghaziabad. He manages community engagement and creative design for Xist AI while pursuing his studies.',
      specializations: ['UI/UX Design', 'Community Management', 'Social Media Strategy', 'Content Creation', 'Digital Design'],
      socialLinks: { github: 'https://github.com/asmit-creative', linkedin: 'https://www.linkedin.com/in/asmit-gupta' },
      location: 'Ghaziabad, UP'
    }
  ];

  return (
    <motion.div initial="hidden" animate="visible" variants={containerVariants}
                className="w-full min-h-screen relative overflow-x-hidden pb-24"
                style={{ marginTop: '64px' }}>
      
      {/* 🌐 GLOBAL GRID BACKGROUND OVERLAY */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] dark:invert-0 invert z-0" 
           style={{ backgroundImage: 'linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>

      <div className="max-w-7xl mx-auto space-y-12 relative z-10 px-4 md:px-8 py-8">
        
        {/* ========================================= */}
        {/* 🚀 HERO HEADER                            */}
        {/* ========================================= */}
        <motion.div variants={itemVariants} className="text-center space-y-6 pt-4">
          <InformationCircleIcon className="w-16 h-16 mx-auto text-indigo-500 dark:text-indigo-400 mb-4" />
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-center mb-2 pb-4 leading-normal tracking-tight text-slate-900 dark:text-white">
            <span className="text-brand-highlight">{typingTitle}</span>
            <motion.span animate={{ opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 0.9 }} className="inline-block w-2.5 md:w-3 h-[0.8em] bg-indigo-500 dark:bg-indigo-400 ml-2 align-baseline" />
          </h1>
          
          <p className="text-[10px] md:text-xs font-mono tracking-widest uppercase text-slate-500 dark:text-slate-400">
            Advanced AI platform built by students
          </p>
          <p className="text-sm max-w-3xl mx-auto leading-relaxed font-medium text-slate-700 dark:text-slate-300">
            Xist AI is a student-led initiative dedicated to protecting individuals and communities from digital threats through innovative AI technology. Built by passionate computer science students, we combine academic knowledge with practical application to make cybersecurity accessible to everyone.
          </p>
        </motion.div>

        {/* ========================================= */}
        {/* 🚀 KEY FEATURES GRID                      */}
        {/* ========================================= */}
        <motion.div variants={itemVariants} className="glass-card rounded-[2.5rem] p-8 md:p-12">
          <div className="text-center mb-10">
            <h2 className="text-xl font-black uppercase tracking-widest mb-3 flex items-center justify-center gap-2 text-slate-900 dark:text-white">
              <CpuChipIcon className="w-6 h-6 text-indigo-500" /> Platform Architecture
            </h2>
            <div className="w-12 h-1 bg-indigo-500/50 mx-auto rounded-full"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: CpuChipIcon, title: "Student-Built AI", desc: "AI models developed by students using modern algorithms." },
              { icon: ShieldCheckIcon, title: "Real-time Shield", desc: "Fast threat detection built with latest web practices." },
              { icon: UsersIcon, title: "Community Hub", desc: "Built by students, for everyone who needs protection." },
              { icon: AcademicCapIcon, title: "Learning-Focused", desc: "Continuously improving while applying coursework concepts." }
            ].map((feature, idx) => (
              <div key={idx} className="p-6 rounded-[1.5rem] glass-input hover:border-indigo-500/50 transition-all text-center group">
                <feature.icon className="w-8 h-8 mx-auto mb-4 text-indigo-500 dark:text-indigo-400 group-hover:scale-110 transition-transform" />
                <h3 className="font-black uppercase tracking-tight text-xs mb-2 text-slate-900 dark:text-white">{feature.title}</h3>
                <p className="text-[10px] uppercase tracking-widest leading-relaxed text-slate-600 dark:text-slate-400">{feature.desc}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* ========================================= */}
        {/* 🚀 TEAM STACK ANIMATION                   */}
        {/* ========================================= */}
        <motion.div variants={itemVariants} className="glass-card rounded-[2.5rem] p-8 md:p-12 overflow-visible">
          <div className="text-center mb-10">
            <h2 className="text-xl font-black uppercase tracking-widest mb-3 flex items-center justify-center gap-2 text-slate-900 dark:text-white">
              <CodeBracketIcon className="w-6 h-6 text-indigo-500" /> Team Members
            </h2>
            <div className="w-12 h-1 bg-indigo-500/50 mx-auto rounded-full mb-4"></div>
            <p className="text-[10px] uppercase tracking-widest font-mono text-slate-500 dark:text-slate-400">Connect with the <span className="text-brand-highlight">Core Intelligence Team.</span></p>
          </div>
          
          <motion.div 
            onHoverStart={() => { if (typeof window !== 'undefined' && window.innerWidth >= 768) setIsStackExpanded(true); }}
            onHoverEnd={() => { if (typeof window !== 'undefined' && window.innerWidth >= 768) { setIsStackExpanded(false); setActiveCard(null); } }}
            onClick={() => { 
              if (typeof window !== 'undefined' && window.innerWidth < 768) { 
                if (isStackExpanded) { setIsStackExpanded(false); setActiveCard(null); } 
                else setIsStackExpanded(true); 
              } 
            }}
            className="relative flex justify-center items-center h-[900px] md:h-[500px] w-full max-w-5xl mx-auto cursor-pointer"
          >
            {teamMembers.map((member, index) => (
              <motion.div 
                key={index} custom={index} variants={stackVariants} initial="compressed"
                animate={ !isStackExpanded ? "compressed" : activeCard === null ? "expanded" : activeCard === index ? "focusedActive" : "focusedInactive" }
                onHoverStart={() => { if (typeof window !== 'undefined' && window.innerWidth >= 768 && isStackExpanded) { setActiveCard(index); } }}
                onHoverEnd={() => { if (typeof window !== 'undefined' && window.innerWidth >= 768) { setActiveCard(null); } }}
                onClick={(e) => { 
                  if (typeof window !== 'undefined' && window.innerWidth < 768) { 
                    if (!isStackExpanded) return; 
                    e.stopPropagation(); 
                    if (activeCard === index) { setActiveCard(null); setIsStackExpanded(false); } 
                    else setActiveCard(index); 
                  } 
                }}
                className={`absolute w-[90%] md:w-[320px] p-6 md:p-8 rounded-[2rem] glass-card group transition-colors shadow-2xl ${activeCard === index ? 'border-indigo-500/80 shadow-[0_0_40px_rgba(99,102,241,0.3)]' : ''}`}
                style={{ transformOrigin: 'center center' }}
              >
                
                {/* Glowing Background Accent */}
                <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-[2rem] pointer-events-none"></div>

                <div className="relative mb-6">
                  <div className="absolute inset-0 bg-indigo-500 blur-xl opacity-20 rounded-full scale-90 group-hover:scale-105 transition-transform"></div>
                  <img src={`/${member.image}`} alt={member.name} className="relative w-24 h-24 rounded-full object-cover mx-auto border-2 border-indigo-500/50 shadow-lg"
                       onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }} />
                  <div className="w-24 h-24 rounded-full glass-input text-indigo-500 font-bold text-lg items-center justify-center mx-auto border border-indigo-500/50 shadow-lg hidden">
                    {member.name.split(' ').map(n => n[0]).join('')}
                  </div>
                </div>

                <div className="text-center relative z-10">
                  <h3 className="text-base font-black uppercase tracking-widest mb-1 text-slate-900 dark:text-white">{member.name}</h3>
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-600 dark:text-indigo-400 mb-3">{member.role}</p>
                  <p className="text-[9px] uppercase tracking-widest font-mono mb-1 text-slate-600 dark:text-slate-400">{member.education}</p>
                  <p className="text-[9px] uppercase tracking-widest font-mono mb-5 text-emerald-600 dark:text-emerald-400">📍 {member.location}</p>
                  
                  <div className="flex flex-wrap justify-center gap-2 mb-6">
                    {member.specializations.slice(0, 3).map((skill, skillIndex) => (
                      <span key={skillIndex} className="px-2.5 py-1 glass-input text-indigo-600 dark:text-indigo-400 text-[8px] font-black uppercase tracking-widest rounded-md">
                        {skill}
                      </span>
                    ))}
                  </div>

                  <div className="flex justify-center space-x-4 pt-5 border-t border-black/10 dark:border-white/10">
                    {member.socialLinks?.github && (
                      <a href={member.socialLinks.github} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className="text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors relative z-50">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
                      </a>
                    )}
                    {member.socialLinks?.linkedin && (
                      <a href={member.socialLinks.linkedin} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className="text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors relative z-50">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                      </a>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>  

        {/* ========================================= */}
        {/* 🚀 TIMELINE & MISSION GRID                  */}
        {/* ========================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <motion.div variants={itemVariants} className="glass-card rounded-[2.5rem] p-8 md:p-10">
            <h2 className="text-lg font-black uppercase tracking-widest mb-8 flex items-center gap-3 text-slate-900 dark:text-white">
              <AcademicCapIcon className="w-6 h-6 text-indigo-500" /> Development Timeline
            </h2>
            <div className="space-y-5">
              {[
                { title: "Academic Foundation", desc: "Applying computer science concepts to real-world security." },
                { title: "Hands-on Development", desc: "Learning by building - every feature teaches something new." },
                { title: "Student Collaboration", desc: "Working together across colleges to combine skills." }
              ].map((item, idx) => (
                <div key={idx} className="p-5 rounded-2xl glass-input flex items-start gap-4 hover:border-indigo-500/30 transition-colors">
                  <div className="w-2 h-2 rounded-full bg-indigo-500 mt-1.5 shrink-0 shadow-[0_0_10px_rgba(99,102,241,0.8)]"></div>
                  <div>
                    <h3 className="text-[11px] font-black uppercase tracking-widest mb-1.5 text-slate-900 dark:text-white">{item.title}</h3>
                    <p className="text-[10px] uppercase tracking-widest leading-relaxed text-slate-600 dark:text-slate-400">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="glass-card rounded-[2.5rem] p-8 md:p-10 flex flex-col justify-center text-center">
            <ShieldCheckIcon className="w-14 h-14 text-indigo-500 dark:text-indigo-400 mx-auto mb-6 drop-shadow-[0_0_15px_rgba(99,102,241,0.4)]" />
            <h2 className="text-xl font-black uppercase tracking-widest mb-4 text-slate-900 dark:text-white">Core Directive</h2>
            <p className="text-xs uppercase tracking-widest leading-relaxed font-bold text-slate-600 dark:text-slate-400">
              As computer science students, we believe in using our knowledge to solve real-world problems. 
              Xist AI represents our commitment to making the digital world safer for everyone, one line of code at a time.
            </p>
            <div className="mt-8 flex justify-center gap-4">
               <div className="px-5 py-2.5 rounded-xl glass-input text-[10px] font-black uppercase tracking-widest text-slate-800 dark:text-slate-300">Innovation</div>
               <div className="px-5 py-2.5 rounded-xl glass-input text-[10px] font-black uppercase tracking-widest text-slate-800 dark:text-slate-300">Community</div>
            </div>
          </motion.div>
        </div>

      </div>
    </motion.div>
  );
};

export default AboutSection;