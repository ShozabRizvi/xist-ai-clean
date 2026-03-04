// VerifySection.jsx - Complete Xist AI Forensic Intelligence Hub (Modular Matrix Design)
import React, { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast, Toaster } from 'react-hot-toast';
import {
  ShieldCheckIcon, DocumentTextIcon, LinkIcon, PhotoIcon, VideoCameraIcon,
  MicrophoneIcon, TrashIcon, ShareIcon, SparklesIcon, SunIcon, MoonIcon,
  CheckCircleIcon, ArrowUpTrayIcon, ClipboardDocumentCheckIcon, 
  DocumentMagnifyingGlassIcon, MagnifyingGlassCircleIcon
} from '@heroicons/react/24/outline';
import { supabase } from '../../lib/supabase';

// ==============================
// UTILITY FUNCTIONS
// ==============================
const timeAgo = (utcDateStr) => {
  if (!utcDateStr) return 'Just now';
  const safeStr = utcDateStr.endsWith('Z') || utcDateStr.includes('+') ? utcDateStr : `${utcDateStr}Z`;
  const date = new Date(safeStr);
  const now = new Date();
  const seconds = Math.round((now - date) / 1000);
  const minutes = Math.round(seconds / 60);
  const hours = Math.round(minutes / 60);
  const days = Math.round(hours / 24);
  
  if (seconds < 60) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days === 1) return 'Yesterday';
  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
};

const clamp = (v, a = 0, b = 100) => Math.max(a, Math.min(b, v));
const formatPercent = (v) => Math.round(clamp(v));

const verdictLabel = (level) => {
  if (level === 'CRITICAL') return 'Psychological Deception';
  if (level === 'QUESTIONABLE' || level === 'SUSPICIOUS') return 'Narrative Manipulation';
  return 'Authentic & Verified';
};

// ✅ TYPING EFFECT HOOK
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
// THEMES & CONSTANTS
// ==============================
const THEMES = {
  dark: {
    background: 'bg-[#020617]', 
    card: 'bg-slate-900 border border-slate-800 shadow-2xl',
    inner: 'bg-slate-950 border-slate-800',
    accentPrimary: 'from-indigo-600 to-blue-600',
    textPrimary: 'text-slate-100',
    textSecondary: 'text-slate-400',
    muted: 'text-slate-500'
  },
  light: {
    background: 'bg-slate-50',
    card: 'bg-white border border-slate-200 shadow-xl',
    inner: 'bg-slate-100 border-slate-200',
    accentPrimary: 'from-indigo-500 to-blue-500',
    textPrimary: 'text-slate-900',
    textSecondary: 'text-slate-600',
    muted: 'text-slate-400'
  }
};

const MODES = [
  { id: 'text', label: 'Text', icon: DocumentTextIcon },
  { id: 'url', label: 'URL', icon: LinkIcon },
  { id: 'image', label: 'Image', icon: PhotoIcon },
  { id: 'video', label: 'Video', icon: VideoCameraIcon },
  { id: 'voice', label: 'Voice', icon: MicrophoneIcon },
  { id: 'document', label: 'Document', icon: ClipboardDocumentCheckIcon } 
];

const DEFAULT_METRICS = { emotional_intensity: 0, bias_indicator_score: 0, sensationalism_score: 0, logical_consistency_score: 0 };

// ==============================
// SUB-COMPONENTS
// ==============================
const ForensicScanner = ({ theme }) => {
  const [progress, setProgress] = useState(0);
  const [activeStage, setActiveStage] = useState(0);
  
  const stages = [
    { id: 0, text: "Initializing Omni-Engine..." },
    { id: 1, text: "Extracting structural metadata & hidden payloads..." },
    { id: 2, text: "Running adversarial pattern recognition..." },
    { id: 3, text: "Cross-referencing Global Threat Matrix..." },
    { id: 4, text: "Synthesizing forensic dossier..." }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress(p => {
        const nextP = p + (Math.random() * 8);
        return nextP > 94 ? 94 : nextP;
      });
    }, 400);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => { setActiveStage(Math.floor(progress / 20)); }, [progress]);

  return (
    <div className={`${theme.card} rounded-3xl p-8 border border-indigo-500/30 shadow-[0_0_40px_rgba(99,102,241,0.1)] flex flex-col justify-center h-full min-h-[500px]`}>
      <div className="mb-10 flex justify-center">
        <div className="relative">
          <div className="w-24 h-24 border-4 border-slate-700/50 border-t-indigo-500 rounded-full animate-spin shadow-[0_0_15px_rgba(99,102,241,0.3)]"></div>
          <div className="absolute inset-0 flex items-center justify-center"><ShieldCheckIcon className="w-10 h-10 text-indigo-400 animate-pulse" /></div>
        </div>
      </div>
      <h3 className="text-2xl font-black text-center mb-8 text-indigo-400 tracking-widest uppercase font-mono">Scanning...</h3>
      <div className="w-full bg-slate-950 rounded-full h-2 mb-10 overflow-hidden border border-slate-800">
        <motion.div className="bg-gradient-to-r from-indigo-600 via-blue-500 to-indigo-400 h-full shadow-[0_0_10px_rgba(99,102,241,0.8)]" animate={{ width: `${progress}%` }} transition={{ ease: "linear", duration: 0.4 }} />
      </div>
      <div className="space-y-5 px-4 font-mono text-sm">
        {stages.map((stage) => {
          const isCompleted = activeStage > stage.id;
          const isActive = activeStage === stage.id;
          const isPending = activeStage < stage.id;
          return (
            <div key={stage.id} className={`flex items-center gap-4 transition-all duration-500 ${isPending ? 'opacity-30' : 'opacity-100'} ${isActive ? 'translate-x-2' : ''}`}>
              <div className={`w-6 h-6 rounded-sm flex items-center justify-center shrink-0 ${
                isCompleted ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 
                isActive ? 'bg-indigo-500/20 text-indigo-400 animate-pulse border border-indigo-500/50' : 'bg-slate-800/50 text-slate-500 border border-slate-700/50'}`}>
                {isCompleted ? <CheckCircleIcon className="w-4 h-4" /> : isActive ? <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full" /> : <div className="w-1 h-1 bg-slate-500 rounded-full" />}
              </div>
              <span className={`tracking-tight ${isActive ? 'text-indigo-200' : 'text-slate-500'}`}>{stage.text}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const ModeSelector = ({ mode, setMode, theme }) => (
  <div className="w-full flex justify-center mt-6">
    <div className={`inline-flex items-center rounded-xl p-1.5 ${theme.card} overflow-x-auto custom-scrollbar`}>
      {MODES.map((m) => {
        const Icon = m.icon;
        const active = m.id === mode;
        return (
          <button key={m.id} onClick={() => setMode(m.id)}
            className={`flex items-center gap-2 px-5 py-2 rounded-lg transition-all duration-200 focus:outline-none whitespace-nowrap ${
              active ? `bg-slate-800 text-indigo-400 shadow-md border border-slate-700` : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800/50 border border-transparent'
            }`}>
            <Icon className="w-4 h-4" />
            <span className="hidden sm:inline text-sm font-semibold tracking-wide">{m.label}</span>
          </button>
        );
      })}
    </div>
  </div>
);

const TypewriterTerminalText = ({ text }) => {
  const [displayedText, setDisplayedText] = useState("");
  useEffect(() => {
    setDisplayedText("");
    let i = 0;
    const interval = setInterval(() => {
      setDisplayedText(text.slice(0, i));
      i++;
      if (i > text.length) clearInterval(interval);
    }, 15);
    return () => clearInterval(interval);
  }, [text]);

  return <span>{displayedText}<span className="animate-pulse text-indigo-400">_</span></span>;
};

const PrivateLedger = ({ entries, theme, onDelete, onDeleteAll, onLoad }) => (
  <div className="mt-8">
    <div className={`${theme.muted} text-xs uppercase tracking-widest mb-4 font-bold flex items-center justify-between`}>
      <span>Secure Event Log</span>
      <div className="flex items-center gap-3">
        <span className="bg-slate-800 border border-slate-700 px-3 py-1 rounded-md text-slate-300 font-mono text-[10px] uppercase">
          {entries.length} Recent Scans
        </span>
        {entries.length > 0 && (
          <button onClick={onDeleteAll} className="text-rose-400 hover:text-rose-300 flex items-center gap-1 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 px-3 py-1.5 rounded-md transition-colors cursor-pointer">
            <TrashIcon className="w-3.5 h-3.5" /> Purge Logs
          </button>
        )}
      </div>
    </div>
    
    <div className="space-y-3">
      {entries.length === 0 ? (
        <div className={`${theme.textSecondary} text-center py-12 bg-slate-900/50 rounded-xl border border-slate-800 font-mono text-sm`}>
          No history found. Awaiting payload injection.
        </div>
      ) : (
        entries.map((e, i) => (
          <motion.div key={e.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}
                      className={`${theme.card} flex flex-col sm:flex-row sm:items-center gap-4 p-5 rounded-xl border border-slate-800 hover:border-indigo-500/50 transition-all group bg-slate-900`}>
            <div className="flex-shrink-0">
              <div className={`w-14 h-14 rounded-full flex items-center justify-center font-black text-lg shadow-lg ${
                e.verdict === 'CRITICAL' ? 'bg-rose-500/10 text-rose-500 border border-rose-500/30' :
                e.verdict === 'QUESTIONABLE' || e.verdict === 'SUSPICIOUS' ? 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/30' :
                'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
              }`}>{Math.round(e.score)}%</div>
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-2">
                <span className={`${theme.textPrimary} font-bold text-sm tracking-wide uppercase`}>{e.verdict}</span>
                <span className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-[9px] font-bold uppercase text-slate-400 flex items-center gap-1">
                   {e.mode === 'image' && <PhotoIcon className="w-3 h-3"/>}
                   {e.mode === 'url' && <LinkIcon className="w-3 h-3"/>}
                   {e.mode === 'text' && <DocumentTextIcon className="w-3 h-3"/>}
                   {e.mode === 'video' && <VideoCameraIcon className="w-3 h-3"/>}
                   {e.mode === 'voice' && <MicrophoneIcon className="w-3 h-3"/>}
                   {e.mode === 'document' && <ClipboardDocumentCheckIcon className="w-3 h-3"/>}
                   {e.mode}
                </span>
                <span className={`${theme.muted} text-[10px] font-medium ml-auto tracking-widest uppercase`}>{timeAgo(e.created_at)}</span>
              </div>
              <div className={`${theme.textPrimary} text-sm font-medium mb-1 truncate`}>
                <span className="opacity-50 mr-2 text-[10px] uppercase tracking-widest font-mono">Payload:</span> 
                {e.input || 'No input recorded'}
              </div>
              <div className={`${theme.textSecondary} text-xs line-clamp-1 group-hover:line-clamp-2 transition-all duration-300 mb-3`}>
                <span className="opacity-50 mr-2 text-[10px] uppercase tracking-widest font-mono">Summary:</span> 
                {e.summary}
              </div>
              <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => onLoad(e)} className="flex items-center gap-1 text-[10px] uppercase tracking-widest bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20 border border-indigo-500/20 px-3 py-1.5 rounded transition-colors font-bold">
                  <ArrowUpTrayIcon className="w-3.5 h-3.5" /> Load Payload
                </button>
                <button onClick={() => onDelete(e.id)} className="flex items-center gap-1 text-[10px] uppercase tracking-widest bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 border border-rose-500/20 px-3 py-1.5 rounded transition-colors font-bold">
                  <TrashIcon className="w-3.5 h-3.5" /> Redact
                </button>
              </div>
            </div>
          </motion.div>
        ))
      )}
    </div>
  </div>
);

// ==============================
// MAIN COMPONENT
// ==============================
export default function VerifySection({ user, theme: globalTheme }) { 
  const [localThemeMode, setLocalThemeMode] = useState('dark');
  const themeMode = THEMES[globalTheme] ? globalTheme : localThemeMode;
const theme = THEMES[themeMode];
  const typingTitle = useTypewriter("Xist Threat Parser", 80, 200);

  const [mode, setMode] = useState('text');
  const [inputValue, setInputValue] = useState('');
  const [file, setFile] = useState(null);
  
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  const [running, setRunning] = useState(false);
  const [metrics, setMetrics] = useState(DEFAULT_METRICS);
  const [score, setScore] = useState(0);
  const [verdictLevel, setVerdictLevel] = useState('SAFE');
  const [summary, setSummary] = useState('');
  const [sources, setSources] = useState([]); 
  const [ledger, setLedger] = useState([]);
  const [sharing, setSharing] = useState(false);
  const [currentMediaUrl, setCurrentMediaUrl] = useState(null);

  useEffect(() => { fetchLedger(); }, []);

  const fetchLedger = async () => {
    try {
      const { data, error } = await supabase.from('user_history').select('*').order('created_at', { ascending: false }).limit(5);
      if (!error && data) setLedger(data);
    } catch (err) { console.error('Ledger fetch error:', err); }
  };

  const persistHistory = async (record) => {
    try {
      const payload = {
        verdict: record.verdict, score: record.score, level: record.level,
        summary: record.summary || 'Analysis complete', input: record.input?.substring(0, 500),
        mode: record.mode, metadata: record.metrics, media_url: record.media_url
      };
      const currentUserId = user?.id || user?.uid;
      if (currentUserId) payload.user_id = currentUserId;
      const { error } = await supabase.from('user_history').insert(payload); 
      if (!error) { toast.success('💾 Saved to Secure Event Log'); fetchLedger(); }
    } catch (error) { console.error('Save error:', error); }
  };

  const handleDeleteEntry = async (id) => {
    try {
      const { error } = await supabase.from('user_history').delete().eq('id', id);
      if (error) throw error;
      setLedger(prev => prev.filter(item => item.id !== id));
      toast.success('History redacted.');
    } catch (err) { toast.error('Failed to redact entry.'); }
  };

  const handleDeleteAll = async () => {
    const currentUserId = user?.id || user?.uid;
    if (!currentUserId) return toast.error('Authentication required.');
    if (!window.confirm('Are you sure you want to purge all secure logs?')) return;
    try {
      const { error } = await supabase.from('user_history').delete().eq('user_id', currentUserId);
      if (error) throw error;
      setLedger([]);
      toast.success('Logs purged.');
    } catch (err) { toast.error('Failed to purge logs.'); }
  };

  const handleLoadEntry = (entry) => {
    setMode(entry.mode || 'text');
    setInputValue(entry.input || '');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (['image', 'video', 'voice', 'document'].includes(entry.mode)) {
       toast('Media mode selected. Please re-inject payload.', { icon: '📁' });
    } else { toast.success('Payload loaded.'); }
  };
  
  const shareToCommunity = async (record) => {
    setSharing(true);
    try {
      const currentUserId = user?.id || user?.uid;
      
      // ✅ THE NEW MULTI-MODAL ROUTER
      // Maps the input method to the correct Community Feed category
      let mappedCategory = 'misinfo'; // Default fallback
      
      if (record.mode === 'url') {
        mappedCategory = 'scam'; // Malicious links go to Social Engineering
      } else if (record.mode === 'document') {
        mappedCategory = 'malware'; // Suspicious files go to Malware
      } else if (['image', 'video', 'voice'].includes(record.mode)) {
        mappedCategory = 'deepfake'; // Media goes to Deepfake Media
      } else if (record.mode === 'text') {
        // Text can be misinfo or a scam, we default to misinfo unless it's a critical threat
        mappedCategory = record.score < 40 ? 'cyber_attack' : 'misinfo'; 
      }

      const postData = {
        title: `[${Math.round(record.score)}% Score] AI Detected ${record.verdict} Content`,
        description: `FORENSIC SUMMARY:\n${record.summary}\n\nSCANNED CONTENT:\n"${record.input.substring(0, 150)}..."`,
        threat_type: mappedCategory, // 🎯 Now dynamically assigned!
        location: 'Global AI Network', 
        is_verified: false, 
        user_id: currentUserId || null, 
        media_url: record.media_url || null
      };
      
      const { error } = await supabase.from('community_threats').insert(postData);
      if (error) throw error;
      toast.success('🌍 Broadcasted to Threat Matrix!');
    } catch (error) { 
      toast.error('Broadcast failed.'); 
      console.error(error);
    } finally { 
      setSharing(false); 
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder; audioChunksRef.current = [];
      mediaRecorder.ondataavailable = (e) => { if (e.data.size > 0) audioChunksRef.current.push(e.data); };
      mediaRecorder.onstop = () => { const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' }); setAudioBlob(blob); };
      mediaRecorder.start(); setIsRecording(true);
    } catch (err) { toast.error('Microphone access denied.'); }
  };

  const stopRecording = () => { if (mediaRecorderRef.current) { mediaRecorderRef.current.stop(); setIsRecording(false); } };

  const runAnalysis = async (autoShare = false) => {
    if (running) return toast('System locked. Parse in progress.', { icon: '⚠️' });
    if (mode === 'voice' && !audioBlob) return toast.error('Initiate audio capture first.');
    if (['image', 'video', 'document'].includes(mode) && !file) return toast.error(`Please provide a ${mode} payload.`);
    if (['text', 'url'].includes(mode) && !inputValue.trim()) return toast.error('Provide text/URL payload first.');

    setRunning(true); setScore(0); setCurrentMediaUrl(null);
    try {
      const BACKEND_URL = process.env.NODE_ENV === 'development' ? 'http://localhost:5000' : 'https://your-flask-backend.onrender.com';
      const formData = new FormData();
      formData.append('mode', mode);
      if (['text', 'url'].includes(mode)) formData.append('text', inputValue);
      else if (mode === 'voice' && audioBlob) formData.append('file', audioBlob, 'voice_note.webm');
      else if (file) formData.append('file', file);

      const response = await fetch(`${BACKEND_URL}/api/analyze`, { method: 'POST', body: formData });
      if (!response.ok) throw new Error('Engine offline');
      const analysis = await response.json();

      let finalMediaUrl = null;
      if (file || audioBlob) {
        const fileToUpload = file || audioBlob;
        const fileExt = file ? file.name.split('.').pop() : 'webm';
        const fileName = `${user?.id || 'anon'}_${Date.now()}.${fileExt}`;
        const { error: uploadError } = await supabase.storage.from('threat_media').upload(fileName, fileToUpload);
        if (!uploadError) {
          const { data: publicUrlData } = supabase.storage.from('threat_media').getPublicUrl(fileName);
          finalMediaUrl = publicUrlData.publicUrl; setCurrentMediaUrl(finalMediaUrl);
        }
      }

      setScore(analysis.credibility_score); setVerdictLevel(analysis.overall_verdict);
      setMetrics(analysis.linguistic_patterns || DEFAULT_METRICS);
      setSummary(analysis.final_explanation_for_user); setSources(analysis.validation_sources || []); 
      toast.success(`Forensic Scan Complete`);

      const record = {
        mode, input: mode === 'voice' ? 'Voice Recording' : (inputValue || file?.name),
        verdict: analysis.overall_verdict, score: analysis.credibility_score,
        level: analysis.overall_verdict, metrics: analysis.linguistic_patterns,
        summary: analysis.final_explanation_for_user, media_url: finalMediaUrl
      };
      await persistHistory(record);
      if (autoShare) await shareToCommunity(record);
    } catch (err) { toast.error("Forensic Engine offline."); } finally { setRunning(false); }
  };

  const handleManualShareClick = async () => {
    if (!summary || score === 0) return toast.error('Run analysis first.');
    const record = { mode, input: inputValue || file?.name, verdict: verdictLevel, score, metrics, summary, media_url: currentMediaUrl };
    await shareToCommunity(record);
  };

  const clearAll = () => {
    setInputValue(''); setFile(null); setAudioBlob(null); setMetrics(DEFAULT_METRICS);
    setScore(0); setSummary(''); setSources([]); setVerdictLevel('SAFE'); setCurrentMediaUrl(null);
  };

  // Animation Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.2 } }
  };
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 100 } }
  };

  return (
    <motion.div initial="hidden" animate="visible" variants={containerVariants}
                className={`w-full min-h-screen p-8 relative transition-colors duration-500 ${theme.background} ${theme.textPrimary} overflow-x-hidden`}
                style={{ fontFamily: 'Inter, system-ui, sans-serif', marginLeft: '280px', marginTop: '64px' }}>
      
      {/* Dynamic Grid Background Overlay */}
      <div className={`absolute inset-0 pointer-events-none opacity-[0.03] ${themeMode === 'dark' ? '' : 'invert'}`} 
           style={{ backgroundImage: 'linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>

      <div className="fixed top-4 right-4 z-40">
        <button onClick={() => setLocalThemeMode(themeMode === 'dark' ? 'light' : 'dark')} className={`${theme.card} p-2.5 rounded-lg transition-all`}>
          {themeMode === 'dark' ? <SunIcon className="w-5 h-5 text-slate-400" /> : <MoonIcon className="w-5 h-5 text-slate-600" />}
        </button>
      </div>

      <Toaster position="top-right" containerStyle={{ top: 80 }} />

      <div className="max-w-5xl mx-auto text-center mb-10 relative z-10">
        <ShieldCheckIcon className="w-16 h-16 text-indigo-500 mx-auto mb-4 opacity-80" />
        <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-3">
            <span>{typingTitle}</span>
            <motion.span animate={{ opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 0.8 }} className="w-1.5 h-8 bg-indigo-500 inline-block ml-1" />
        </h1>
        <p className={`${theme.muted} text-sm font-mono tracking-widest uppercase`}>Multi-Modal Intelligence Analysis</p>
        <ModeSelector mode={mode} setMode={setMode} theme={theme} />
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-10">
        {/* LEFT COLUMN - Tactical Input */}
        <motion.div variants={itemVariants} className="lg:col-span-5 space-y-6">
          <div className={`${theme.card} rounded-2xl p-6 flex flex-col h-full relative overflow-hidden group`}>
            <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-4 relative z-10">
              <h2 className="text-sm font-bold uppercase tracking-widest text-indigo-400 flex items-center gap-2">
                <ShieldCheckIcon className="w-4 h-4" /> Target Payload
              </h2>
              <button onClick={clearAll} disabled={running} className="text-slate-500 hover:text-rose-400 flex items-center gap-1 text-xs font-bold transition-colors">
                <TrashIcon className="w-3.5 h-3.5" /> Purge
              </button>
            </div>

            {mode === 'text' && (
              <textarea value={inputValue} onChange={(e) => setInputValue(e.target.value)} disabled={running} placeholder="Inject raw text payload here..." 
                        className={`w-full flex-grow min-h-[250px] p-4 rounded-lg text-sm border focus:border-indigo-500 outline-none font-mono resize-none transition-all relative z-10 shadow-inner custom-scrollbar ${theme.inner} ${theme.textPrimary}`} />
            )}
            
            {mode === 'url' && (
              <input type="url" value={inputValue} onChange={(e) => setInputValue(e.target.value)} disabled={running} placeholder="Enter Target URL..." 
                     className={`w-full p-4 rounded-lg text-sm border focus:border-indigo-500 outline-none font-mono transition-all relative z-10 shadow-inner ${theme.inner} ${theme.textPrimary}`} />
            )}

            {['image', 'video', 'document'].includes(mode) && (
              <div className={`border-2 border-dashed ${themeMode === 'dark' ? 'border-slate-800' : 'border-slate-200'} ${theme.inner} rounded-xl p-2 relative flex-grow min-h-[250px] flex flex-col items-center justify-center transition-all ${running ? 'opacity-80 pointer-events-none' : ''}`}>
                {running && file && <motion.div initial={{ top: '0%' }} animate={{ top: ['0%', '95%', '0%'] }} transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }} className="absolute left-0 right-0 h-1 bg-indigo-500 shadow-[0_0_20px_rgba(99,102,241,1)] z-50 pointer-events-none" />}
                {file ? (
                  <div className="w-full h-full relative flex flex-col items-center justify-center p-4">
                    {mode === 'image' && <img src={URL.createObjectURL(file)} alt="Preview" className="max-h-56 rounded border border-slate-700" />}
                    {mode === 'video' && <video src={URL.createObjectURL(file)} controls className="max-h-56 rounded border border-slate-700" />}
                    {mode === 'document' && <div className="text-center w-full max-w-xs bg-slate-900 border border-slate-700 p-4 rounded-lg"><DocumentMagnifyingGlassIcon className="w-12 h-12 text-indigo-400 mx-auto mb-3"/><p className="text-indigo-300 font-mono text-xs truncate">{file.name}</p></div>}
                    {!running && <button onClick={() => { setFile(null); setInputValue(''); }} className="mt-6 text-[10px] uppercase tracking-widest text-rose-400 font-bold border border-rose-500/30 px-4 py-2 rounded">Remove</button>}
                  </div>
                ) : (
                  <div className="cursor-pointer group flex flex-col items-center justify-center w-full h-full p-8" onClick={() => document.getElementById('file-upload').click()}>
                    <div className="w-16 h-16 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform"><PhotoIcon className="w-8 h-8 text-slate-500" /></div>
                    <p className={`text-sm font-bold uppercase tracking-widest ${theme.textSecondary}`}>Inject {mode}</p>
                    <input id="file-upload" type="file" className="hidden" onChange={(e) => { setFile(e.target.files?.[0]); setInputValue(e.target.files?.[0]?.name); }} />
                  </div>
                )}
              </div>
            )}

            {mode === 'voice' && (
              <div className={`border border-slate-800 rounded-xl p-8 text-center flex flex-col items-center flex-grow min-h-[250px] justify-center transition-all ${theme.inner} ${running ? 'opacity-50 pointer-events-none' : ''}`}>
                {audioBlob ? <div className="w-full flex flex-col items-center gap-4"><audio src={URL.createObjectURL(audioBlob)} controls className="w-full max-w-xs" /><button onClick={() => setAudioBlob(null)} className="text-rose-400 text-xs font-bold">Rerecord</button></div> : 
                <button onClick={isRecording ? stopRecording : startRecording} className={`px-6 py-2.5 rounded-lg text-sm font-bold border transition-all ${isRecording ? 'bg-rose-500/10 text-rose-500 border-rose-500/30' : 'bg-slate-800 text-slate-300 border-slate-700'}`}>{isRecording ? 'End Capture' : 'Initiate Audio Capture'}</button>}
              </div>
            )}
            
            <div className="grid grid-cols-2 gap-3 mt-6 relative z-10">
              <button onClick={() => runAnalysis(false)} disabled={running} className="py-3 rounded-lg text-sm font-bold tracking-wider uppercase bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg">Execute Parse</button>
              <button onClick={() => runAnalysis(true)} disabled={running} className={`py-3 rounded-lg text-sm font-bold tracking-wider uppercase border border-indigo-500/30 bg-indigo-500/10 text-indigo-300`}>Parse + Share</button>
            </div>
          </div>
        </motion.div>

        {/* RIGHT COLUMN - Threat Matrix */}
        <motion.div variants={itemVariants} className="lg:col-span-7 space-y-4">
          {running ? (
             <ForensicScanner theme={theme} />
          ) : score > 0 ? (
            <div className="flex flex-col gap-4 h-full">
              <div className={`${theme.card} p-4 rounded-2xl flex items-center justify-between`}>
                 <h2 className={`text-sm font-bold uppercase tracking-widest ${theme.textSecondary}`}>Forensic Dossier</h2>
                 <button onClick={handleManualShareClick} className="text-[10px] font-black uppercase text-indigo-400 bg-indigo-500/10 px-3 py-1.5 rounded-lg border border-indigo-500/20 flex items-center gap-2"><ShareIcon className="w-3.5 h-3.5" /> Export Matrix</button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                <div className={`md:col-span-4 ${theme.card} p-6 rounded-2xl flex flex-col items-center justify-center`}>
                   <div className="relative w-28 h-28 flex items-center justify-center shrink-0 mb-4">
                      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                         <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke={themeMode === 'dark' ? "#1e293b" : "#e2e8f0"} strokeWidth="2.5" />
                         <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke={score < 40 ? "#ef4444" : score < 70 ? "#eab308" : "#10b981"} strokeWidth="2.5" strokeDasharray={`${score}, 100`} />
                      </svg>
                      <div className="absolute font-black text-3xl">{formatPercent(score)}</div>
                   </div>
                   <div className={`text-sm font-black uppercase ${score < 40 ? "text-rose-500" : score < 70 ? "text-yellow-500" : "text-emerald-500"}`}>{verdictLevel}</div>
                   <div className="text-[9px] text-slate-500 font-mono mt-2 pt-2 border-t border-slate-800 w-full text-center">{verdictLabel(verdictLevel)}</div>
                </div>

                <div className={`md:col-span-8 ${theme.inner} p-5 rounded-2xl shadow-inner flex flex-col h-48 md:h-auto`}>
                   <div className="flex items-center gap-2 mb-3 opacity-50"><SparklesIcon className="w-3.5 h-3.5 text-indigo-400" /><span className="text-[10px] font-mono font-bold tracking-widest uppercase">AI_DIAGNOSTICS_LEDGER</span></div>
                   <div className="text-xs font-mono leading-relaxed overflow-y-auto custom-scrollbar flex-grow"><TypewriterTerminalText text={summary} /></div>
                </div>
              </div>

              {Object.values(metrics).some(v => v > 0) && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {Object.entries(metrics).map(([key, val]) => (
                    <div key={key} className={`${theme.card} p-4 rounded-2xl relative overflow-hidden transition-colors`}>
                       <div className={`absolute top-0 right-0 w-8 h-8 ${val > 60 ? 'bg-rose-500/10' : 'bg-emerald-500/10'} rounded-bl-full`}></div>
                       <div className="text-[8px] text-slate-500 uppercase tracking-widest font-bold mb-2 truncate">{key.replace(/_/g, ' ')}</div>
                       <div className="text-xl font-black">{formatPercent(val)}%</div>
                       <div className="w-full h-1 bg-slate-950 mt-2 rounded-full overflow-hidden"><div className={`h-full ${val > 60 ? 'bg-rose-500' : 'bg-indigo-500'}`} style={{ width: `${val}%` }}/></div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
             <div className={`${theme.card} rounded-2xl p-16 border flex flex-col items-center justify-center text-center h-full min-h-[500px]`}>
                <ShieldCheckIcon className={`w-16 h-16 mb-4 ${themeMode === 'dark' ? 'text-slate-800' : 'text-slate-200'}`} />
                <h3 className={`text-base font-bold uppercase tracking-widest ${theme.muted}`}>System Standby</h3>
                <p className={`text-sm mt-2 max-w-xs ${theme.muted}`}>Awaiting payload injection for forensic analysis.</p>
             </div>
          )}
        </motion.div>
      </div>

      <motion.div variants={itemVariants} className="max-w-7xl mx-auto mt-8 relative z-10">
         <PrivateLedger entries={ledger} theme={theme} onDelete={handleDeleteEntry} onDeleteAll={handleDeleteAll} onLoad={handleLoadEntry} />
      </motion.div>
      <div className="h-24" />
    </motion.div>
  );
}