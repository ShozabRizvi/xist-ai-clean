// VerifySection.jsx - Complete Xist AI Forensic Intelligence Hub (Modular Matrix Design)
import React, { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast, Toaster } from 'react-hot-toast';
import {
  ShieldCheckIcon, DocumentTextIcon, LinkIcon, PhotoIcon, VideoCameraIcon,
  MicrophoneIcon, TrashIcon, ShareIcon, SparklesIcon, SunIcon, MoonIcon,
  CheckCircleIcon, ArrowUpTrayIcon, ClipboardDocumentCheckIcon, GlobeAltIcon,
  DocumentMagnifyingGlassIcon, MagnifyingGlassCircleIcon,ChevronDownIcon,ArrowUpIcon,PaperClipIcon,PlusIcon, ExclamationTriangleIcon,
  XMarkIcon // <--- ADD THIS ONE
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
  { id: 'file', label: 'File', icon: PaperClipIcon }, 
  { id: 'voice', label: 'Voice', icon: MicrophoneIcon }
];

const DEFAULT_METRICS = { emotional_intensity: 0, bias_indicator_score: 0, sensationalism_score: 0, logical_consistency_score: 0 };

// ==============================
// SUB-COMPONENTS
// ==============================
const ForensicScanner = ({ theme }) => {
  const [progress, setProgress] = useState(0);
  const [activeStage, setActiveStage] = useState(0);
  
  const stages = [
    { id: 0, text: "Starting Analysis Engine..." },
    { id: 1, text: "Extracting content and hidden data..." },
    { id: 2, text: "Checking for scams and deepfakes..." },
    { id: 3, text: "Comparing against known threats..." },
    { id: 4, text: "Generating final report..." }
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
    <div className={`${theme.card} rounded-[32px] p-8 border border-indigo-500/30 shadow-[0_0_40px_rgba(99,102,241,0.1)] flex flex-col justify-center h-full min-h-[400px]`}>
      <div className="mb-10 flex justify-center">
        <div className="relative">
          <div className="w-20 h-20 border-4 border-slate-700/50 border-t-indigo-500 rounded-full animate-spin shadow-[0_0_15px_rgba(99,102,241,0.3)]"></div>
          <div className="absolute inset-0 flex items-center justify-center"><ShieldCheckIcon className="w-8 h-8 text-indigo-400 animate-pulse" /></div>
        </div>
      </div>
      <h3 className="text-xl font-black text-center mb-6 text-indigo-400 tracking-widest uppercase font-mono">Scanning...</h3>
      <div className="w-full bg-slate-950 rounded-full h-1.5 mb-8 overflow-hidden border border-slate-800">
        <motion.div className="bg-gradient-to-r from-indigo-600 via-blue-500 to-indigo-400 h-full shadow-[0_0_10px_rgba(99,102,241,0.8)]" animate={{ width: `${progress}%` }} transition={{ ease: "linear", duration: 0.4 }} />
      </div>
      <div className="space-y-4 px-2 font-mono text-xs">
        {stages.map((stage) => {
          const isCompleted = activeStage > stage.id;
          const isActive = activeStage === stage.id;
          const isPending = activeStage < stage.id;
          return (
            <div key={stage.id} className={`flex items-center gap-3 transition-all duration-500 ${isPending ? 'opacity-30' : 'opacity-100'} ${isActive ? 'translate-x-2' : ''}`}>
              <div className={`w-5 h-5 rounded-sm flex items-center justify-center shrink-0 ${
                isCompleted ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 
                isActive ? 'bg-indigo-500/20 text-indigo-400 animate-pulse border border-indigo-500/50' : 'bg-slate-800/50 text-slate-500 border border-slate-700/50'}`}>
                {isCompleted ? <CheckCircleIcon className="w-3.5 h-3.5" /> : isActive ? <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full" /> : <div className="w-1 h-1 bg-slate-500 rounded-full" />}
              </div>
              <span className={`tracking-tight ${isActive ? 'text-indigo-200' : 'text-slate-500'}`}>{stage.text}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const TypewriterTerminalText = ({ text, skipAnimation = false }) => {
  // If skipAnimation is true, start with the full text immediately
  const [displayedText, setDisplayedText] = useState(skipAnimation ? text : "");
  
  useEffect(() => {
    if (skipAnimation) {
      setDisplayedText(text);
      return;
    }
    setDisplayedText("");
    let i = 0;
    const interval = setInterval(() => {
      setDisplayedText(text.slice(0, i));
      i++;
      if (i > text.length) clearInterval(interval);
    }, 5); // Sped up the typing slightly
    return () => clearInterval(interval);
  }, [text, skipAnimation]);

  // Determine if it is actively typing to show the cursor
  const isTyping = !skipAnimation && displayedText.length < text.length;

  return (
    <span 
      onClick={() => setDisplayedText(text)} 
      className={isTyping ? "cursor-pointer" : ""}
      title={isTyping ? "Click to skip animation" : ""}
    >
      {displayedText}
      {isTyping && <span className="animate-pulse text-indigo-400">_</span>}
    </span>
  );
};

const PrivateLedger = ({ entries, theme, onDelete, onDeleteAll, onLoad }) => (
  <div className="mt-12 max-w-4xl mx-auto">
    <div className={`${theme.muted} text-xs uppercase tracking-widest mb-4 font-bold flex items-center justify-between`}>
      <span>Your History</span>
      <div className="flex items-center gap-3">
        <span className="bg-slate-800 border border-slate-700 px-3 py-1 rounded-md text-slate-300 font-mono text-[10px] uppercase">
          {entries.length} Recent Scans
        </span>
        {entries.length > 0 && (
          <button onClick={onDeleteAll} className="text-rose-400 hover:text-rose-300 flex items-center gap-1 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 px-3 py-1.5 rounded-md transition-colors cursor-pointer">
            <TrashIcon className="w-3.5 h-3.5" /> Clear All
          </button>
        )}
      </div>
    </div>
    
    <div className="space-y-3">
      {entries.length === 0 ? (
        <div className={`${theme.textSecondary} text-center py-12 bg-slate-900/50 rounded-xl border border-slate-800 font-mono text-sm`}>
          No history found. Awaiting input for analysis.
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
              
              <div className={`${theme.textPrimary} text-sm font-bold mb-1 truncate`}>
                {e.input || 'Media File'}
              </div>
              <div className={`${theme.textSecondary} text-xs line-clamp-1 group-hover:line-clamp-2 transition-all duration-300 mb-3`}>
                {e.summary}
              </div>
              
              <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => onLoad(e)} className="flex items-center gap-1 text-[10px] uppercase tracking-widest bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20 border border-indigo-500/20 px-3 py-1.5 rounded transition-colors font-bold">
                  <ArrowUpTrayIcon className="w-3.5 h-3.5" /> Load Input
                </button>
                <button onClick={() => onDelete(e.id)} className="flex items-center gap-1 text-[10px] uppercase tracking-widest bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 border border-rose-500/20 px-3 py-1.5 rounded transition-colors font-bold">
                  <TrashIcon className="w-3.5 h-3.5" /> Delete
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
export default function VerifySection({ user, theme: globalTheme,globalSettings }) { 
  const [localThemeMode, setLocalThemeMode] = useState('dark');
  const themeMode = THEMES[globalTheme] ? globalTheme : localThemeMode;
  const theme = THEMES[themeMode];
  const typingTitle = useTypewriter("Xist Analytics", 80, 200);

  const inputRef = useRef(null); // ✅ REF TO SCROLL TO TEXT BOX

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
  const [isCachedResult, setIsCachedResult] = useState(false);

  const abortControllerRef = useRef(null); // ✅ CONTROLS THE STOP BUTTON

 // ✅ 5-MINUTE MEMORY: Restores state if you switch tabs or refresh
  useEffect(() => {
    fetchLedger();
    const savedState = sessionStorage.getItem('xist_verify_state');
    if (savedState) {
      const parsed = JSON.parse(savedState);
      const timePassed = Date.now() - parsed.timestamp;
      
      // If less than 5 minutes (300,000 ms) have passed, restore everything!
      if (timePassed < 300000) {
        setMode(parsed.mode);
        setInputValue(parsed.inputValue);
        setScore(parsed.score);
        setVerdictLevel(parsed.verdictLevel);
        setMetrics(parsed.metrics);
        setSummary(parsed.summary);
        setSources(parsed.sources);
        setIsCachedResult(true); // ✅ FLAG THIS AS CACHED SO IT DOESN'T ANIMATE
      } else {
        sessionStorage.removeItem('xist_verify_state'); // Expire old data
      }
    }
  }, []);

  // ✅ STOP BUTTON FUNCTION
  const stopAnalysis = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort(); // Kills the fetch request
      setRunning(false);
      toast('Analysis aborted by user.', { icon: <XMarkIcon className="w-5 h-5 text-yellow-500" /> });
    }
  };

  const fetchLedger = async () => {
    const currentUserId = user?.id || user?.uid;
    if (!currentUserId) return;
    try {
      const { data, error } = await supabase.from('user_history').select('*')
        .eq('user_id', currentUserId)
        .order('created_at', { ascending: false }).limit(10);
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
      if (!error) { 
        toast.success('Saved to Secure Log', { icon: <ShieldCheckIcon className="w-5 h-5 text-indigo-400" />}); 
        fetchLedger(); 
      }
    } catch (error) { console.error('Save error:', error); }
  };

  const handleDeleteEntry = async (id) => {
    try {
      console.log("🛠️ DEBUG: Attempting to delete row with ID:", id);
      
      // 1. Find the entry in our local state to see if it has a media file
      const entryToDelete = ledger.find(item => item.id === id);

      // 2. If there is a media file, delete it from Supabase Storage first!
      if (entryToDelete && entryToDelete.media_url) {
        // Extract just the filename from the end of the long URL
        const fileName = entryToDelete.media_url.split('/').pop(); 
        console.log("🗑️ Deleting associated media file:", fileName);
        
        const { error: storageError } = await supabase.storage.from('threat_media').remove([fileName]);
        if (storageError) {
          console.warn("⚠️ Could not delete storage file (it might already be gone):", storageError);
        }
      }

      // 3. Now delete the actual text row from the database
      const response = await supabase.from('user_history').delete().eq('id', id);
      
      if (response.error) {
        console.error("🚨 SUPABASE REJECTED DELETE:", response.error);
        toast.error(`DB Error: ${response.error.message || response.error.details}`);
        return; 
      }

      console.log("✅ DEBUG: Delete successful!");
      setLedger(prev => prev.filter(item => item.id !== id));
      toast('History entry deleted', { icon: <TrashIcon className="w-5 h-5 text-slate-400" /> });
      
    } catch (err) { 
      console.error('💥 FATAL CATCH ERROR:', err);
      toast.error('Code crashed during delete.'); 
    }
  };

  const handleDeleteAll = async () => {
    const currentUserId = user?.id || user?.uid;
    if (!currentUserId) return;
    if (!window.confirm('Are you sure you want to purge all secure logs?')) return;
    
    try {
      console.log("🛠️ DEBUG: Attempting to clear all history for user.");

      // 1. Gather all file names from the current ledger that have a media_url
      const filesToDelete = ledger
        .filter(item => item.media_url)
        .map(item => item.media_url.split('/').pop());

      // 2. If there are files, delete them from Storage in ONE batch!
      if (filesToDelete.length > 0) {
        console.log("🗑️ Batch deleting media files:", filesToDelete);
        const { error: storageError } = await supabase.storage.from('threat_media').remove(filesToDelete);
        if (storageError) {
          console.warn("⚠️ Issue deleting some files from storage:", storageError);
        }
      }

      // 3. Delete all text rows from the database
      const response = await supabase.from('user_history').delete().eq('user_id', currentUserId);
      
      if (response.error) {
         console.error("🚨 SUPABASE REJECTED CLEAR ALL:", response.error);
         return toast.error("Failed to clear logs.");
      }

      console.log("✅ DEBUG: Clear All successful!");
      setLedger([]);
      toast('All history cleared', { icon: <TrashIcon className="w-5 h-5 text-slate-400" /> });
      
    } catch (err) { 
      console.error("💥 FATAL CATCH ERROR:", err);
      toast.error('Failed to purge logs.'); 
    }
  };

  const handleLoadEntry = (entry) => {
    setMode(entry.mode || 'text');
    setInputValue(entry.input || '');
    
    // ✅ SCROLL DIRECTLY TO THE INPUT BOX, NOT THE TOP OF THE PAGE
    if (inputRef.current) {
        inputRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    if (['image', 'video', 'voice', 'document'].includes(entry.mode)) {
       toast('Media mode selected. Please re-upload the file.', { icon: <PaperClipIcon className="w-5 h-5 text-indigo-400" /> });
    } else { 
       toast.success('Input loaded', { icon: <DocumentTextIcon className="w-5 h-5 text-emerald-400" /> }); 
    }
  };
  
  const shareToCommunity = async (record) => {
    setSharing(true);
    try {
      const currentUserId = user?.id || user?.uid;
      let mappedCategory = 'misinfo'; 
      if (record.mode === 'url') mappedCategory = 'scam'; 
      else if (record.mode === 'document') mappedCategory = 'malware'; 
      else if (['image', 'video', 'voice'].includes(record.mode)) mappedCategory = 'deepfake'; 
      else if (record.mode === 'text') mappedCategory = record.score < 40 ? 'cyber_attack' : 'misinfo'; 

      // ✅ FIX: Ensure input is safely converted to a string to prevent .substring() crashes
      const safeInput = String(record.input || 'Media File Analysis');

      const postData = {
        title: `[${Math.round(record.score)}% Score] AI Detected ${record.verdict} Content`,
        description: `FORENSIC SUMMARY:\n${record.summary}\n\nSCANNED CONTENT:\n"${safeInput.substring(0, 150)}..."`,
        threat_type: mappedCategory, 
        location: 'Global AI Network', 
        is_verified: false, 
        user_id: currentUserId || null, 
        media_url: record.media_url || null
      };
      
      const { error } = await supabase.from('community_threats').insert(postData);
      if (error) {
        console.error("Supabase Share Error:", error);
        throw error;
      }
      toast.success('Shared to Global Community', { icon: <GlobeAltIcon className="w-5 h-5 text-blue-400" /> });
    } catch (error) { 
      toast.error('Broadcast failed.', { icon: <ExclamationTriangleIcon className="w-5 h-5 text-rose-500" /> }); 
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
    } catch (err) { toast.error('Microphone access denied.', { icon: <ExclamationTriangleIcon className="w-5 h-5 text-rose-500" /> }); }
  };

  const stopRecording = () => { if (mediaRecorderRef.current) { mediaRecorderRef.current.stop(); setIsRecording(false); } };

  const runAnalysis = async (autoShare = false) => {
    if (running) return toast('System busy. Analysis in progress.', { icon: <ShieldCheckIcon className="w-5 h-5 text-indigo-400" /> });
    if (mode === 'voice' && !audioBlob) return toast.error('Initiate audio capture first.', { icon: <MicrophoneIcon className="w-5 h-5 text-rose-500" />});
    if (['image', 'video', 'document'].includes(mode) && !file) return toast.error(`Please provide a ${mode} to analyze.`, { icon: <PaperClipIcon className="w-5 h-5 text-rose-500" />});
    if (['text', 'url'].includes(mode) && !inputValue.trim()) return toast.error('Provide text/URL to analyze first.', { icon: <DocumentTextIcon className="w-5 h-5 text-rose-500" />});
    
    const MAX_FILE_SIZE = 20 * 1024 * 1024; 
    if (file && file.size > MAX_FILE_SIZE) {
        return toast.error("File is too large. Please upload media under 20MB.", { icon: <ExclamationTriangleIcon className="w-5 h-5 text-rose-500" /> });
    }
    if (audioBlob && audioBlob.size > MAX_FILE_SIZE) {
        return toast.error("Audio recording too long. Please keep under 5 minutes.", { icon: <ExclamationTriangleIcon className="w-5 h-5 text-rose-500" /> });
    }
    
    setRunning(true); setScore(0); setCurrentMediaUrl(null); setSummary(''); setIsCachedResult(false);
    
    // ✅ SCROLL TO CENTER DURING ANALYSIS
    if (inputRef.current) {
        inputRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    try {
      // ✅ IMPROVED SMART ROUTER: Handles both localhost and 127.0.0.1 safely
      const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
      const BACKEND_URL = isLocal 
        ? 'http://localhost:5000' 
        : 'https://xist-ai-clean-1.onrender.com';
        
      const formData = new FormData();

      let sendMode = mode;
      if (mode === 'file' && file) {
        if (file.type.startsWith('image/')) sendMode = 'image';
        else if (file.type.startsWith('video/')) sendMode = 'video';
        else sendMode = 'document';
      }
      
      formData.append('mode', sendMode); 
      formData.append('strictMode', globalSettings?.forensics?.strictMode || false);
      if (['text', 'url'].includes(mode)) formData.append('text', inputValue);
      else if (mode === 'voice' && audioBlob) formData.append('file', audioBlob, 'voice_note.webm');
      else if (mode === 'file' && file) formData.append('file', file); 

      // ✅ WIRE UP THE ABORT CONTROLLER TO THE FETCH
      abortControllerRef.current = new AbortController();
      const response = await fetch(`${BACKEND_URL}/api/analyze`, { 
        method: 'POST', 
        body: formData,
        signal: abortControllerRef.current.signal // <-- Tells fetch to listen for the stop command
      });
      
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

      // ✅ SAVE TO 5-MINUTE MEMORY ON SUCCESS
      sessionStorage.setItem('xist_verify_state', JSON.stringify({
        timestamp: Date.now(),
        mode: sendMode,
        inputValue: inputValue || file?.name,
        score: analysis.credibility_score,
        verdictLevel: analysis.overall_verdict,
        metrics: analysis.dynamic_metrics || DEFAULT_METRICS,
        summary: analysis.final_explanation_for_user,
        sources: analysis.validation_sources || []
      }));

      setScore(analysis.credibility_score); setVerdictLevel(analysis.overall_verdict);
      setMetrics(analysis.dynamic_metrics || DEFAULT_METRICS);
      setSummary(analysis.final_explanation_for_user); setSources(analysis.validation_sources || []); 
      toast.success(`Analysis Complete`, { icon: <ShieldCheckIcon className="w-5 h-5 text-emerald-400" /> });

      const record = {
        mode: sendMode, 
        input: mode === 'voice' ? 'Voice Recording' : (inputValue || file?.name),
        verdict: analysis.overall_verdict, score: analysis.credibility_score,
        level: analysis.overall_verdict, metrics: analysis.dynamic_metrics,
        summary: analysis.final_explanation_for_user, media_url: finalMediaUrl
      };
      await persistHistory(record);
      if (autoShare) await shareToCommunity(record);
      
    } catch (err) { 
      // ✅ HANDLE THE ABORT ERROR GRACEFULLY SO IT DOESN'T SHOW AS A CRASH
      if (err.name === 'AbortError') {
         console.log("Analysis stopped by user.");
      } else {
         console.error("Engine Error:", err);
         toast.error("Forensic Engine offline.", { icon: <ExclamationTriangleIcon className="w-5 h-5 text-rose-500" /> }); 
      }
    } finally { 
      setRunning(false); 
    }
  };

const handleManualShareClick = async () => {
    // ✅ FIX: Removed "score === 0" because 0 is a valid score for completely fake news!
    if (!summary || score === null || score === undefined) return toast.error('Run analysis first.');
    
    // ✅ FIX: Provide a strict fallback string for the input
    const record = { 
      mode, 
      input: inputValue || file?.name || 'Media Upload', 
      verdict: verdictLevel, 
      score, 
      metrics, 
      summary, 
      media_url: currentMediaUrl 
    };
    await shareToCommunity(record);
  };

  const clearAll = () => {
    setInputValue(''); setFile(null); setAudioBlob(null); setMetrics(DEFAULT_METRICS);
    setScore(0); setSummary(''); setSources([]); setVerdictLevel('SAFE'); setCurrentMediaUrl(null);
  };

  return (
    <div className={`w-full min-h-screen p-4 md:p-8 relative transition-colors duration-500 ${theme.background} ${theme.textPrimary} overflow-x-hidden`}
         style={{ fontFamily: 'Inter, system-ui, sans-serif', marginLeft: '280px', marginTop: '64px' }}>
      
      {/* Dynamic Grid Background Overlay */}
      <div className={`absolute inset-0 pointer-events-none opacity-[0.03] ${themeMode === 'dark' ? '' : 'invert'}`} 
           style={{ backgroundImage: 'linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>

      <div className="fixed top-4 right-4 z-40">
        <button onClick={() => setLocalThemeMode(themeMode === 'dark' ? 'light' : 'dark')} className={`${theme.card} p-2.5 rounded-lg transition-all`}>
          {themeMode === 'dark' ? <SunIcon className="w-5 h-5 text-slate-400" /> : <MoonIcon className="w-5 h-5 text-slate-600" />}
        </button>
      </div>

      {/* ✅ NEW GLASSMORPHISM TOASTER WITH ANIMATIONS */}
      <Toaster 
        position="top-right" 
        toastOptions={{
          className: '',
          style: {
            background: themeMode === 'dark' ? 'rgba(15, 23, 42, 0.7)' : 'rgba(255, 255, 255, 0.7)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            border: themeMode === 'dark' ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(0, 0, 0, 0.1)',
            color: themeMode === 'dark' ? '#fff' : '#0f172a',
            borderRadius: '16px',
            boxShadow: '0 10px 40px rgba(0, 0, 0, 0.2)',
            fontFamily: 'system-ui, sans-serif',
            fontSize: '14px',
            fontWeight: '500'
          },
          duration: 3500,
        }} 
      />

      {/* FULL WIDTH LAYOUT */}
      <div className="max-w-6xl mx-auto flex flex-col gap-8 relative z-10 pt-4 md:pt-10">
        
        {/* HEADER */}
        <div className="text-center">
           <ShieldCheckIcon className="w-12 h-12 text-indigo-500 mx-auto mb-4 opacity-80" />
           <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-center mb-2 pb-4 leading-normal tracking-tight">
              <span>{typingTitle}</span>
              <motion.span animate={{ opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 0.9 }} className="inline-block w-2.5 md:w-3 h-[0.8em] bg-indigo-500 ml-2 align-baseline" />
           </h1>
        </div>

        {/* ✅ THE GLIDE ANIMATION WRAPPER */}
        <motion.div layout className={`flex flex-col lg:flex-row gap-8 items-stretch w-full`}>
          
          {/* INPUT BOX (Shrinks to left when running) */}
          <motion.div layout ref={inputRef} className={`transition-all duration-700 ease-in-out ${running ? 'w-full lg:w-1/2' : 'w-full max-w-4xl mx-auto'}`}>
            <div className={`relative flex flex-col h-full transition-all duration-300 
              bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800
              rounded-[28px] md:rounded-[32px] 
              ${running ? 'shadow-[0_0_30px_rgba(99,102,241,0.2)] border-indigo-500' : 'shadow-lg focus-within:shadow-xl focus-within:border-indigo-500/50'}`}>
              
              <div className="px-6 pt-6 pb-2 min-h-[140px] flex flex-col relative justify-center flex-grow">
                {mode === 'text' && (
                  <textarea 
                    value={inputValue} 
                    onChange={(e) => setInputValue(e.target.value)} 
                    disabled={running} 
                    placeholder="Ask Xist to verify a claim, or paste text/logs here..." 
                    className={`w-full h-full flex-grow !bg-transparent !border-0 !outline-none !ring-0 shadow-none text-lg md:text-xl font-sans resize-none custom-scrollbar leading-relaxed placeholder:text-gray-400 dark:placeholder:text-slate-500 transition-all duration-200 ${inputValue ? 'text-left' : 'text-center'} ${theme.textPrimary}`} 
                  />
                )}
                
                {mode === 'url' && (
                  <input 
                    type="url" 
                    value={inputValue} 
                    onChange={(e) => setInputValue(e.target.value)} 
                    disabled={running} 
                    placeholder="Paste a URL to scan for threats..." 
                    className={`w-full flex-grow !bg-transparent !border-0 !outline-none !ring-0 shadow-none text-lg md:text-xl font-sans placeholder:text-gray-400 dark:placeholder:text-slate-500 transition-all duration-200 ${inputValue ? 'text-left' : 'text-center'} ${theme.textPrimary}`} 
                  />
                )}

                {mode === 'file' && (
                  <div className="flex-grow flex flex-col items-center justify-center transition-all p-4">
                    {file ? (
                      <div className="text-center">
                         <div className="text-indigo-500 font-sans font-medium mb-2">{file.name}</div>
                         <button onClick={() => { setFile(null); setInputValue(''); }} className="text-xs text-rose-500 uppercase tracking-widest font-bold">Remove</button>
                      </div>
                    ) : (
                      <div className="cursor-pointer flex flex-col items-center text-slate-500 hover:text-slate-300 transition-colors" onClick={() => document.getElementById('file-upload').click()}>
                        <PaperClipIcon className="w-10 h-10 mb-3" />
                        <span className="text-sm font-sans font-medium">Upload Document, Image, or Video</span>
                        <input id="file-upload" type="file" accept="image/*,video/*,.pdf,.doc,.docx,.txt" className="hidden" onChange={(e) => { setFile(e.target.files?.[0]); setInputValue(e.target.files?.[0]?.name); }} />
                      </div>
                    )}
                  </div>
                )}

                {mode === 'voice' && (
                  <div className="flex-grow flex flex-col items-center justify-center">
                    {audioBlob ? (
                       <div className="text-center">
                         <audio src={URL.createObjectURL(audioBlob)} controls className="mb-2 max-w-full rounded-full" />
                         <button onClick={() => setAudioBlob(null)} className="text-xs text-rose-500 font-bold uppercase mt-2">Rerecord</button>
                       </div>
                    ) : (
                       <button onClick={isRecording ? stopRecording : startRecording} className={`flex items-center gap-2 px-6 py-3 rounded-full font-sans font-medium text-sm transition-all ${isRecording ? 'bg-rose-500 text-white animate-pulse' : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700'}`}>
                         <MicrophoneIcon className="w-5 h-5" /> {isRecording ? 'Listening...' : 'Tap to Speak'}
                       </button>
                    )}
                  </div>
                )}
              </div>

              {/* Bottom Toolbar */}
              <div className="px-4 pb-4 pt-2 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
                  {MODES.map((m) => {
                    const active = mode === m.id;
                    return (
                      <button key={m.id} onClick={() => setMode(m.id)}
                        className={`flex items-center justify-center w-10 h-10 rounded-full transition-all ${active ? 'bg-indigo-500/10 text-indigo-500' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
                        title={m.label}
                      >
                        <m.icon className="w-5 h-5" />
                      </button>
                    );
                  })}
                </div>

                <div className="flex items-center gap-2 ml-auto">
                  {inputValue || file || audioBlob ? (
                    <button onClick={clearAll} disabled={running} className="p-2.5 text-slate-500 hover:text-rose-500 transition-colors rounded-full hover:bg-slate-100 dark:hover:bg-slate-800">
                      <TrashIcon className="w-5 h-5" />
                    </button>
                  ) : null}
                  
                  {/* ✅ ADAPTIVE SCAN / STOP BUTTON */}
                  <button 
                    // ✅ FIX: Force "true" to guarantee it shares, bypassing the undefined settings object
                    onClick={() => running ? stopAnalysis() : runAnalysis(true)}
                    disabled={(!running && !inputValue && !file && !audioBlob)}
                    className={`flex items-center justify-center gap-1.5 shrink-0 px-3 h-10 rounded-full transition-all shadow-sm group ${running ? 'bg-rose-500 hover:bg-rose-600 text-white' : themeMode === 'dark' ? 'bg-white text-slate-900 hover:bg-slate-200 disabled:bg-slate-800 disabled:text-slate-600' : 'bg-slate-900 text-white hover:bg-black disabled:bg-slate-200 disabled:text-slate-400'}`}
                    title={running ? "Stop Scan" : "Scan & Share"}
                  >
                    {running ? (
                      <>
                        <XMarkIcon className="w-5 h-5 stroke-[2.5]" />
                        <span className="text-xs font-bold uppercase tracking-widest mr-1">Stop</span>
                      </>
                    ) : (
                      <>
                        <ShareIcon className="w-4 h-4 stroke-[2.5] transition-transform group-hover:-translate-y-0.5" />
                        <ArrowUpIcon className="w-4 h-4 stroke-[2.5] transition-transform group-hover:-translate-y-0.5" />
                      </>
                    )}
                  </button>

                  <button 
                    onClick={() => runAnalysis(false)} 
                    disabled={running || (!inputValue && !file && !audioBlob)}
                    className={`flex items-center justify-center shrink-0 w-10 h-10 rounded-full transition-all shadow-sm group ${themeMode === 'dark' ? 'bg-white text-slate-900 hover:bg-slate-200 disabled:bg-slate-800 disabled:text-slate-600' : 'bg-slate-900 text-white hover:bg-black disabled:bg-slate-200 disabled:text-slate-400'}`}
                    title="Private Scan"
                  >
                    {running ? (
                      <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <ArrowUpIcon className="w-5 h-5 stroke-[2.5] transition-transform group-hover:-translate-y-0.5" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>

          {/* SCANNER CONTAINER (Appears on right during running) */}
          <AnimatePresence>
            {running && (
              <motion.div 
                initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, scale: 0.95 }}
                className="w-full lg:w-1/2 flex items-center"
              >
                <div className="w-full h-full">
                  <ForensicScanner theme={theme} />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* DYNAMIC RESULTS CONTAINER (Appears below input when done) */}
        <AnimatePresence>
          {!running && summary && (
             <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="w-full max-w-4xl mx-auto space-y-6 mt-4">
                
                {/* Results Header & Main Score */}
                <div className={`${theme.card} p-6 rounded-2xl flex flex-col md:flex-row items-center md:items-start gap-6`}>
                   <div className="flex-shrink-0 flex flex-col items-center">
                      <div className="relative w-28 h-28 flex items-center justify-center mb-2">
                         <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                            <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke={themeMode === 'dark' ? "#1e293b" : "#e2e8f0"} strokeWidth="2.5" />
                            <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke={score < 40 ? "#ef4444" : score < 70 ? "#eab308" : "#10b981"} strokeWidth="2.5" strokeDasharray={`${score}, 100`} />
                         </svg>
                         <div className="absolute font-black text-3xl">{formatPercent(score)}</div>
                      </div>
                      <div className={`text-sm font-black uppercase ${score < 40 ? "text-rose-500" : score < 70 ? "text-yellow-500" : "text-emerald-500"}`}>{verdictLevel}</div>
                   </div>

                   <div className="flex-grow flex flex-col">
                      <div className="flex items-center justify-between mb-3">
                         <h2 className={`text-xs font-bold uppercase tracking-widest ${theme.textSecondary}`}>AI Forensic Report</h2>
                         <button onClick={handleManualShareClick} className="text-[10px] font-black uppercase text-indigo-400 bg-indigo-500/10 hover:bg-indigo-500/20 px-3 py-1.5 rounded border border-indigo-500/20 flex items-center gap-1 transition-colors">
                           <ShareIcon className="w-3 h-3" /> Share
                         </button>
                      </div>
                      <div className={`${theme.inner} p-4 rounded-xl flex-grow`}>
   {/* ✅ THE PRE-WRAP FIX SO PARAGRAPHS LOOK BEAUTIFUL */}
   <div className="text-sm font-mono leading-relaxed whitespace-pre-wrap">
       <TypewriterTerminalText text={summary} skipAnimation={isCachedResult} />
   </div>
</div>
                   </div>
                </div>

                {/* Sources & Metrics Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   {sources && sources.length > 0 && (
                     <div className={`${theme.card} p-5 rounded-2xl`}>
                       <h3 className="text-xs font-bold uppercase tracking-widest text-indigo-400 mb-4 flex items-center gap-2"><ClipboardDocumentCheckIcon className="w-4 h-4" /> Validation Sources</h3>
                       <div className="space-y-3">
                         {sources.map((src, idx) => (
                           <a key={idx} 
                              href={src.url !== 'Observation' ? src.url : '#'} 
                              target={src.url !== 'Observation' ? "_blank" : "_self"}
                              rel="noopener noreferrer"
                              className={`block border-l-2 border-indigo-500 pl-3 py-2 ${theme.inner} rounded-r-lg pr-3 hover:bg-indigo-500/5 transition-colors group cursor-pointer`}
                           >
                             <div className={`text-sm font-bold flex items-center justify-between ${theme.textPrimary}`}>
                               <span>[{src.id}] {src.source_name || src.name}</span>
                               {src.url !== 'Observation' && <LinkIcon className="w-3.5 h-3.5 text-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity" />}
                             </div>
                             <div className={`text-xs mt-1 leading-relaxed ${theme.textSecondary}`}>{src.why_relevant || src.relevance}</div>
                           </a>
                         ))}
                       </div>
                     </div>
                   )}

                   {Object.values(metrics).some(v => v > 0) && (
                     <div className="grid grid-cols-2 gap-3 content-start">
                       {Object.entries(metrics)
                         .filter(([_, val]) => val !== null && val !== undefined) // Hide inactive metrics
                         .map(([key, val]) => {
                         
                         // 1. Format the key to be readable (replace underscores with spaces)
                         const displayName = key.replace(/_/g, ' ');

                         // 2. ADAPTIVE LOGIC: Define which metrics are "Good" when high. 
                         // Everything else is assumed "Bad" (Red) when high.
                         const isGoodWhenHigh = [
                           'Original_File_History', 'Logical_Facts', 'Writing_Style_Match', 
                           'Makes_Sense', 'Smooth_Movement', 'Normal_Background_Noise', 'Natural_Lighting'
                         ].includes(key);

                         const isHighRisk = isGoodWhenHigh ? val < 50 : val > 50;

                         return (
                           <div key={key} className={`${theme.card} p-4 rounded-xl flex flex-col justify-center h-full min-h-[90px]`}>
                              <div className="text-[10px] text-indigo-400 uppercase tracking-widest font-bold mb-2 truncate" title={displayName}>
                                {displayName}
                              </div>
                              <div className="text-xl font-black mb-2">
                                {formatPercent(val)}%
                              </div>
                              <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                                <div className={`h-full transition-all duration-1000 ${isHighRisk ? 'bg-rose-500' : 'bg-emerald-500'}`} style={{ width: `${val}%` }}/>
                              </div>
                           </div>
                         );
                       })}
                     </div>
                   )}
                </div>
             </motion.div>
          )}
        </AnimatePresence>

        {/* HISTORY SECTION */}
        <PrivateLedger entries={ledger} theme={theme} onDelete={handleDeleteEntry} onDeleteAll={handleDeleteAll} onLoad={handleLoadEntry} />
      
      </div>
      <div className="h-24" />
    </div>
  );
}