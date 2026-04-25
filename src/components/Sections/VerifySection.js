import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import {
  ShieldCheckIcon, DocumentTextIcon, LinkIcon, PhotoIcon, VideoCameraIcon,
  MicrophoneIcon, TrashIcon, ShareIcon, 
  CheckCircleIcon, ClipboardDocumentCheckIcon, GlobeAltIcon,
  ArrowUpIcon, PaperClipIcon, ExclamationTriangleIcon, XMarkIcon
} from '@heroicons/react/24/outline';
import { supabase } from '../../lib/supabase';

const formatPercent = (v) => Math.round(Math.max(0, Math.min(100, v)));

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

const MODES = [
  { id: 'text', label: 'Text', icon: DocumentTextIcon },
  { id: 'url', label: 'URL', icon: LinkIcon },
  { id: 'file', label: 'File', icon: PaperClipIcon }, 
  { id: 'voice', label: 'Voice', icon: MicrophoneIcon }
];

const DEFAULT_METRICS = { emotional_intensity: 0, bias_indicator_score: 0, sensationalism_score: 0, logical_consistency_score: 0 };

// 🚀 DYNAMIC FORENSIC SCANNER (Now uses native Tailwind dark mode)
const ForensicScanner = ({ mode }) => {
  const [progress, setProgress] = useState(0);
  const [activeStage, setActiveStage] = useState(0);
  
  const getStages = (scanMode) => {
    switch (scanMode) {
      case 'url':
        return [
          { id: 0, text: "Connecting to website..." },
          { id: 1, text: "Scanning page content and code..." },
          { id: 2, text: "Checking domain reputation..." },
          { id: 3, text: "Looking for phishing links..." },
          { id: 4, text: "Generating final report..." }
        ];
      case 'image':
        return [
          { id: 0, text: "Processing image data..." },
          { id: 1, text: "Checking for digital manipulation..." },
          { id: 2, text: "Analyzing hidden metadata..." },
          { id: 3, text: "Searching for AI artifacts..." },
          { id: 4, text: "Generating final report..." }
        ];
      case 'video':
        return [
          { id: 0, text: "Extracting video frames and audio..." },
          { id: 1, text: "Tracking facial movements..." },
          { id: 2, text: "Analyzing voice sync and AI signs..." },
          { id: 3, text: "Checking structural integrity..." },
          { id: 4, text: "Generating final report..." }
        ];
      case 'voice':
        return [
          { id: 0, text: "Processing audio frequencies..." },
          { id: 1, text: "Analyzing vocal characteristics..." },
          { id: 2, text: "Checking for synthetic generation..." },
          { id: 3, text: "Looking for background anomalies..." },
          { id: 4, text: "Generating final report..." }
        ];
      case 'file':
      case 'document':
        return [
          { id: 0, text: "Reading file structure..." },
          { id: 1, text: "Extracting text and hidden macros..." },
          { id: 2, text: "Scanning for malicious code..." },
          { id: 3, text: "Checking document history..." },
          { id: 4, text: "Generating final report..." }
        ];
      case 'text':
      default:
        return [
          { id: 0, text: "Reading text content..." },
          { id: 1, text: "Analyzing language and tone..." },
          { id: 2, text: "Checking for manipulative patterns..." },
          { id: 3, text: "Cross-referencing known scams..." },
          { id: 4, text: "Generating final report..." }
        ];
    }
  };

  const stages = getStages(mode);

  useEffect(() => {
    const timer = setInterval(() => setProgress(p => (p + (Math.random() * 8) > 94 ? 94 : p + (Math.random() * 8))), 400);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => { setActiveStage(Math.floor(progress / 20)); }, [progress]);

  return (
    <div className="glass-card rounded-[2.5rem] p-8 border flex flex-col justify-center h-full min-h-[400px] w-full shadow-2xl">
      <div className="mb-10 flex justify-center">
        <div className="relative">
          <div className="w-20 h-20 border-4 border-slate-200 dark:border-slate-800 border-t-indigo-500 rounded-full animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center"><ShieldCheckIcon className="w-8 h-8 text-indigo-500 animate-pulse" /></div>
        </div>
      </div>
      <h3 className="text-xl font-black text-center mb-6 text-indigo-500 tracking-widest uppercase font-mono">Scanning...</h3>
      
      <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-1.5 mb-8 overflow-hidden">
        <motion.div className="bg-gradient-to-r from-indigo-600 via-blue-500 to-indigo-400 h-full" animate={{ width: `${progress}%` }} transition={{ ease: "linear", duration: 0.4 }} />
      </div>
      
      <div className="space-y-4 px-2 font-mono text-xs">
        {stages.map((stage) => {
          const isCompleted = activeStage > stage.id;
          const isActive = activeStage === stage.id;
          const isPending = activeStage < stage.id;
          return (
            <div key={stage.id} className={`flex items-center gap-3 transition-all duration-500 ${isPending ? 'opacity-30' : 'opacity-100'} ${isActive ? 'translate-x-2' : ''}`}>
              <div className={`w-5 h-5 rounded-sm flex items-center justify-center shrink-0 ${
                isCompleted ? 'bg-emerald-500/20 text-emerald-500 border border-emerald-500/30' : 
                isActive ? 'bg-indigo-500/20 text-indigo-500 animate-pulse border border-indigo-500/50' : 'bg-slate-200 dark:bg-white/10 text-slate-500'}`}>
                {isCompleted ? <CheckCircleIcon className="w-3.5 h-3.5" /> : isActive ? <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full" /> : <div className="w-1 h-1 bg-slate-500 rounded-full" />}
              </div>
              <span className={`tracking-tight ${isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-500'}`}>{stage.text}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const TypewriterTerminalText = ({ text, skipAnimation = false }) => {
  const [displayedText, setDisplayedText] = useState(skipAnimation ? text : "");
  useEffect(() => {
    if (skipAnimation) { setDisplayedText(text); return; }
    setDisplayedText("");
    let i = 0;
    const interval = setInterval(() => { setDisplayedText(text.slice(0, i)); i++; if (i > text.length) clearInterval(interval); }, 5); 
    return () => clearInterval(interval);
  }, [text, skipAnimation]);
  
  const isTyping = !skipAnimation && displayedText.length < text.length;
  return (
    <span>
      {displayedText}
      {isTyping && <span className="animate-pulse text-indigo-500">_</span>}
    </span>
  );
};

export default function VerifySection({ user, onAnalysisComplete, analysisHistory = [] }) {
  const typingTitle = useTypewriter("Ask Xist AI", 80, 200);
  const inputRef = useRef(null); 

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
  const [currentMediaUrl, setCurrentMediaUrl] = useState(null);
  const [isCachedResult, setIsCachedResult] = useState(false);

  const abortControllerRef = useRef(null); 

  useEffect(() => {
    const savedState = sessionStorage.getItem('xist_verify_state');
    if (savedState) {
      const parsed = JSON.parse(savedState);
      if (Date.now() - parsed.timestamp < 300000) {
        setMode(parsed.mode); setInputValue(parsed.inputValue); setScore(parsed.score);
        setVerdictLevel(parsed.verdictLevel); setMetrics(parsed.metrics); setSummary(parsed.summary);
        setSources(parsed.sources); setIsCachedResult(true); 
      } else sessionStorage.removeItem('xist_verify_state'); 
    }
  }, []);

  useEffect(() => {
    const loadId = sessionStorage.getItem('xist_view_history_id');
    if (loadId && analysisHistory.length > 0) {
      const pastScan = analysisHistory.find(s => String(s.id) === String(loadId));
      if (pastScan) {
        setMode(pastScan.mode || pastScan.type || 'text');
        setInputValue(pastScan.input || pastScan.query || '');
        setScore(pastScan.score || 0);
        setVerdictLevel(pastScan.verdict || pastScan.level || 'UNKNOWN');
        setMetrics(pastScan.metrics || pastScan.metadata || DEFAULT_METRICS);
        setSummary(pastScan.summary || '');
        setSources(pastScan.sources || []);
        setIsCachedResult(true); 
        sessionStorage.removeItem('xist_view_history_id');
        if (inputRef.current) inputRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  }, [analysisHistory]);

  const stopAnalysis = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort(); 
      setRunning(false);
      toast('Analysis aborted.', { icon: <XMarkIcon className="w-5 h-5 text-yellow-500" /> });
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
    if (running) return toast('System busy.');
    if (mode === 'voice' && !audioBlob) return toast.error('Initiate audio capture first.');
    if (['image', 'video', 'document', 'file'].includes(mode) && !file) return toast.error(`Provide a file.`);
    if (['text', 'url'].includes(mode) && !inputValue.trim()) return toast.error('Provide text/URL.');
    
    setRunning(true); setScore(0); setCurrentMediaUrl(null); setSummary(''); setIsCachedResult(false);
    if (inputRef.current) inputRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });

    try {
      const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
      const BACKEND_URL = isLocal ? 'http://localhost:5000' : 'https://xist-ai-clean-1.onrender.com';
      const formData = new FormData();

      let sendMode = mode;
      if (mode === 'file' && file) {
        if (file.type.startsWith('image/')) sendMode = 'image';
        else if (file.type.startsWith('video/')) sendMode = 'video';
        else sendMode = 'document';
      }
      
      formData.append('mode', sendMode); 
      if (['text', 'url'].includes(mode)) formData.append('text', inputValue);
      else if (mode === 'voice' && audioBlob) formData.append('file', audioBlob, 'voice_note.webm');
      else if (['file','image','video','document'].includes(mode) && file) formData.append('file', file); 

      abortControllerRef.current = new AbortController();
      const response = await fetch(`${BACKEND_URL}/api/analyze`, { method: 'POST', body: formData, signal: abortControllerRef.current.signal });
      if (!response.ok) throw new Error('Engine offline');
      const analysis = await response.json();

      let finalMediaUrl = null;
      if (file || audioBlob) {
        const fileToUpload = file || audioBlob;
        const fileName = `${user?.id || 'anon'}_${Date.now()}.${file ? file.name.split('.').pop() : 'webm'}`;
        const { error: uploadError } = await supabase.storage.from('threat_media').upload(fileName, fileToUpload);
        if (!uploadError) {
          const { data: publicUrlData } = supabase.storage.from('threat_media').getPublicUrl(fileName);
          finalMediaUrl = publicUrlData.publicUrl; setCurrentMediaUrl(finalMediaUrl);
        }
      }

      sessionStorage.setItem('xist_verify_state', JSON.stringify({
        timestamp: Date.now(), mode: sendMode, inputValue: inputValue || file?.name,
        score: analysis.credibility_score, verdictLevel: analysis.overall_verdict,
        metrics: analysis.dynamic_metrics || DEFAULT_METRICS, summary: analysis.final_explanation_for_user,
        sources: analysis.validation_sources || []
      }));

      setScore(analysis.credibility_score); setVerdictLevel(analysis.overall_verdict);
      setMetrics(analysis.dynamic_metrics || DEFAULT_METRICS);
      setSummary(analysis.final_explanation_for_user); setSources(analysis.validation_sources || []); 
      toast.success(`Analysis Complete`);

      const record = {
        id: Date.now().toString(), mode: sendMode, 
        input: mode === 'voice' ? 'Voice Recording' : (inputValue || file?.name),
        query: mode === 'voice' ? 'Voice Recording' : (inputValue || file?.name), 
        verdict: analysis.overall_verdict, score: analysis.credibility_score,
        level: analysis.overall_verdict, metrics: analysis.dynamic_metrics,
        summary: analysis.final_explanation_for_user, media_url: finalMediaUrl,
        sources: analysis.validation_sources
      };
      
      const payload = { ...record, user_id: user?.id || user?.uid };
      const { data } = await supabase.from('user_history').insert(payload).select().single(); 
      if (data && onAnalysisComplete) onAnalysisComplete({ ...record, id: data.id });
      
    } catch (err) { 
      if (err.name !== 'AbortError') toast.error("Forensic Engine offline."); 
    } finally { 
      setRunning(false); 
    }
  };

  const shareToCommunity = async () => {
    if (!summary) return toast.error('Run analysis first.');
    try {
      const postData = {
        title: `[${Math.round(score)}% Score] AI Detected ${verdictLevel} Content`,
        description: `FORENSIC SUMMARY:\n${summary}\n\nSCANNED CONTENT:\n"${String(inputValue || file?.name || '').substring(0, 150)}..."`,
        threat_type: mode === 'url' ? 'scam' : mode === 'text' ? 'misinfo' : 'deepfake', 
        location: 'Global AI Network', is_verified: false, user_id: user?.id || null, media_url: currentMediaUrl || null
      };
      const { error } = await supabase.from('community_threats').insert(postData);
      if (error) throw error;
      toast.success('Shared to Community');
    } catch (error) { toast.error('Broadcast failed.'); }
  };

  const clearAll = () => {
    setInputValue(''); setFile(null); setAudioBlob(null); setMetrics(DEFAULT_METRICS);
    setScore(0); setSummary(''); setSources([]); setVerdictLevel('SAFE'); setCurrentMediaUrl(null);
  };

  return (
    // 🚀 Dynamic height: Prevents scrolling until analysis runs
    <div className={`w-full p-4 md:p-8 relative overflow-x-hidden text-slate-900 dark:text-slate-100 ${running || summary ? 'min-h-screen' : 'min-h-[calc(100vh-100px)]'}`} style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
      
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] invert dark:invert-0" style={{ backgroundImage: 'linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>

      <div className="max-w-6xl mx-auto flex flex-col gap-8 relative z-10 pt-4 md:pt-10">
        
        <div className="text-center">
           <ShieldCheckIcon className="w-12 h-12 text-indigo-500 mx-auto mb-4 opacity-80" />
           <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-center mb-2 pb-4 tracking-tight">
              <span className="text-brand-highlight">{typingTitle}</span>
              <motion.span animate={{ opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 0.9 }} className="inline-block w-2.5 md:w-3 h-[0.8em] bg-indigo-500 ml-2 align-baseline" />
           </h1>
           <p className="text-[10px] md:text-[11px] font-mono font-bold uppercase tracking-[0.3em] md:tracking-[0.4em] text-slate-500 mb-4 text-center px-4">
             Analyze text, links, and media for threats
           </p>
        </div>

        <motion.div layout className={`flex flex-col lg:flex-row gap-8 items-stretch w-full`}>
          
          {/* 🚀 THE INPUT TERMINAL (Fixed to bottom on mobile only) */}
          <motion.div layout ref={inputRef} className={`transition-all duration-700 ease-in-out ${running ? 'w-full lg:w-1/2' : 'w-full max-w-3xl mx-auto'} fixed bottom-0 left-0 right-0 p-4 z-50 md:relative md:p-0 md:z-auto`}>
            <div className={`p-2 md:p-3 rounded-[2.5rem] transition-all duration-300 shadow-2xl flex flex-col glass-card border bg-slate-50/95 dark:bg-slate-900/95 md:bg-transparent md:dark:bg-transparent backdrop-blur-xl
               ${running ? 'border-indigo-500/50 shadow-indigo-500/20' : 'focus-within:border-indigo-500/50'}`}>
              
              <div className="relative w-full mb-2 transition-all flex-grow flex flex-col">
                {mode === 'text' || mode === 'url' ? (
                  <textarea 
                    value={inputValue} 
                    onChange={(e) => {
                      setInputValue(e.target.value);
                      e.target.style.height = '56px'; 
                      e.target.style.height = Math.min(e.target.scrollHeight, 250) + 'px';
                    }} 
                    disabled={running} 
                    placeholder={mode === 'text' ? "Paste a message or claim to scan..." : "Paste a URL to scan..."} 
                    style={{ minHeight: '56px' }}
                    className="w-full bg-transparent outline-none px-4 pt-4 pb-2 text-sm md:text-base resize-none custom-scrollbar transition-all duration-200 text-slate-900 dark:text-white placeholder-slate-500" 
                  />
                ) : mode === 'file' ? (
                  <div className="flex-grow flex flex-col items-center justify-center min-h-[80px] p-4 cursor-pointer" onClick={() => document.getElementById('file-upload').click()}>
                    {file ? (
                      <div className="text-center flex items-center gap-3">
                         <span className="text-indigo-600 dark:text-indigo-400 font-bold">{file.name}</span>
                         <button className="text-xs text-rose-500 font-bold" onClick={(e) => { e.stopPropagation(); setFile(null); setInputValue(''); }}>Remove</button>
                      </div>
                    ) : (
                      <div className="text-center flex items-center justify-center gap-2 text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                        <PaperClipIcon className="w-5 h-5" />
                        <span className="text-sm font-medium">Upload Document, Image, or Video</span>
                      </div>
                    )}
                    <input id="file-upload" type="file" className="hidden" onChange={(e) => { setFile(e.target.files?.[0]); setInputValue(e.target.files?.[0]?.name); }} />
                  </div>
                ) : (
                  <div className="flex-grow flex flex-col items-center justify-center min-h-[80px] p-4">
                    {audioBlob ? (
                      <div className="flex items-center gap-3">
                        <audio src={URL.createObjectURL(audioBlob)} controls className="max-w-[200px] h-8 rounded-full" />
                        <button onClick={() => setAudioBlob(null)} className="text-xs text-rose-500 font-bold">Rerecord</button>
                      </div>
                    ) : (
                      <button onClick={isRecording ? stopRecording : startRecording} className={`px-6 py-2.5 rounded-full text-sm font-bold transition-colors ${isRecording ? 'bg-rose-500 text-white animate-pulse shadow-[0_0_15px_rgba(244,63,94,0.5)]' : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg'}`}>{isRecording ? 'Listening...' : 'Tap to Speak'}</button>
                    )}
                  </div>
                )}
              </div>

              {/* TOOLBAR */}
              <div className="flex items-center justify-between px-2 pb-1">
                <div className="flex gap-1 overflow-x-auto no-scrollbar">
                  {MODES.map((m) => (
                    <button key={m.id} onClick={() => setMode(m.id)}
                      className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${mode === m.id ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-500 hover:bg-black/5 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white'}`} title={m.label}>
                      <m.icon className="w-5 h-5" />
                    </button>
                  ))}
                </div>

                <div className="flex gap-2 items-center">
                  {(inputValue || file || audioBlob) && (
                    <button onClick={clearAll} disabled={running} className="p-2 text-slate-400 hover:text-rose-500 transition-colors">
                      <TrashIcon className="w-5 h-5" />
                    </button>
                  )}
                  
                  {/* Scan & Share Button */}
                  <button 
                    onClick={() => running ? stopAnalysis() : runAnalysis(true)} 
                    disabled={!running && !inputValue && !file && !audioBlob}
                    className={`flex items-center gap-1.5 px-4 h-10 rounded-[1.2rem] font-bold text-xs transition-all shadow-sm
                      ${running 
                        ? 'bg-rose-500 text-white shadow-[0_0_15px_rgba(244,63,94,0.4)]' 
                        : 'bg-indigo-600 hover:bg-indigo-500 text-white disabled:opacity-50 disabled:cursor-not-allowed glass-input disabled:text-slate-500 disabled:shadow-none'}`}
                  >
                    {running ? <XMarkIcon className="w-4 h-4" /> : <><ShareIcon className="w-3.5 h-3.5" /><ArrowUpIcon className="w-3.5 h-3.5" /></>}
                  </button>
                  
                  {/* Private Scan Button */}
                  <button 
                    onClick={() => runAnalysis(false)} 
                    disabled={running || (!inputValue && !file && !audioBlob)}
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-all shadow-sm
                      ${running
                        ? 'bg-rose-500 text-white shadow-[0_0_15px_rgba(244,63,94,0.4)]'
                        : 'glass-input text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none'}`}
                  >
                    {running ? <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"/> : <ArrowUpIcon className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>

          <AnimatePresence>
            {running && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, scale: 0.95 }} className="w-full lg:w-1/2 flex items-center">
                <ForensicScanner mode={mode} />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* RESULTS CARDS */}
        <AnimatePresence>
          {!running && summary && (
             <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="w-full max-w-5xl mx-auto space-y-6 mt-4">
                
                <div className="p-6 md:p-8 rounded-[2rem] flex flex-col md:flex-row items-center md:items-start gap-8 border glass-card shadow-2xl">
                   <div className="flex-shrink-0 flex flex-col items-center">
                      <div className="relative w-32 h-32 flex items-center justify-center mb-4">
                         <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                            <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" className="text-slate-200 dark:text-slate-800" strokeWidth="2.5" />
                            <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke={score < 40 ? "#ef4444" : score < 70 ? "#eab308" : "#10b981"} strokeWidth="2.5" strokeDasharray={`${score}, 100`} />
                         </svg>
                         <div className="absolute font-black text-4xl text-slate-900 dark:text-white">{formatPercent(score)}</div>
                      </div>
                      <div className={`px-4 py-1.5 rounded-lg text-xs font-black uppercase tracking-widest border ${score < 40 ? "text-rose-500 border-rose-500/20 bg-rose-500/10 shadow-[0_0_15px_rgba(244,63,94,0.2)]" : score < 70 ? "text-yellow-600 dark:text-yellow-500 border-yellow-500/20 bg-yellow-500/10 shadow-[0_0_15px_rgba(234,179,8,0.2)]" : "text-emerald-600 dark:text-emerald-500 border-emerald-500/20 bg-emerald-500/10 shadow-[0_0_15px_rgba(16,185,129,0.2)]"}`}>
                        {verdictLevel}
                      </div>
                   </div>

                   <div className="flex-grow flex flex-col w-full">
                      <div className="flex items-center justify-between mb-4 pb-2 border-b border-black/10 dark:border-white/10">
                         <h2 className="text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">Scan Results</h2>
                         <button onClick={shareToCommunity} className="text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-lg transition-colors glass-input text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300">
                           Share to Community
                         </button>
                      </div>
                      <div className="pt-2 flex-grow">
                        <div className="text-sm font-mono leading-relaxed whitespace-pre-wrap text-slate-700 dark:text-slate-300">
                            <TypewriterTerminalText text={summary} skipAnimation={isCachedResult} />
                        </div>
                      </div>
                   </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   {sources && sources.length > 0 && (
                    <div className="p-6 md:p-8 rounded-[2rem] border glass-card shadow-xl">
                       <h3 className="text-xs font-bold uppercase tracking-widest mb-5 flex items-center gap-2 text-indigo-600 dark:text-indigo-400"><ClipboardDocumentCheckIcon className="w-5 h-5" /> Verified Sources</h3>
                       <div className="space-y-4">
                         {sources.map((src, idx) => (
                           <a key={idx} href={src.url !== 'Observation' ? src.url : '#'} target={src.url !== 'Observation' ? "_blank" : "_self"} rel="noopener noreferrer"
                              className="block border-l-2 border-indigo-500 pl-4 py-2 transition-all group cursor-pointer hover:border-l-indigo-400 glass-input rounded-r-xl"
                           >
                             <div className="text-sm font-bold flex items-center justify-between text-slate-900 dark:text-slate-100">
                               <span>[{src.id}] {src.source_name || src.name}</span>
                               {src.url !== 'Observation' && <LinkIcon className="w-4 h-4 text-indigo-500 opacity-50 group-hover:opacity-100 transition-opacity" />}
                             </div>
                             <div className="text-xs mt-1.5 leading-relaxed font-medium text-slate-600 dark:text-slate-400">{src.why_relevant || src.relevance}</div>
                           </a>
                         ))}
                       </div>
                     </div>
                   )}

                   {Object.values(metrics).some(v => v > 0) && (
                     <div className="grid grid-cols-2 gap-4 content-start">
                       {Object.entries(metrics)
                         .filter(([_, val]) => val !== null && val !== undefined)
                         .map(([key, val]) => {
                         const displayName = key.replace(/_/g, ' ');
                         const isGoodWhenHigh = ['Original_File_History', 'Logical_Facts', 'Writing_Style_Match', 'Makes_Sense', 'Smooth_Movement', 'Normal_Background_Noise', 'Natural_Lighting'].includes(key);
                         const isHighRisk = isGoodWhenHigh ? val < 50 : val > 50;

                         return (
                           <div key={key} className="p-6 rounded-[2rem] flex flex-col justify-center h-full min-h-[120px] border glass-card shadow-xl">
                              <div className="text-[10px] uppercase tracking-widest font-black mb-2 truncate text-slate-500" title={displayName}>{displayName}</div>
                              <div className="text-3xl font-black mb-4 text-slate-900 dark:text-white">{formatPercent(val)}%</div>
                              <div className="w-full h-1.5 rounded-full overflow-hidden bg-slate-200 dark:bg-slate-800">
                                <div className={`h-full transition-all duration-1000 shadow-[0_0_10px_currentColor] ${isHighRisk ? 'bg-rose-500' : 'bg-emerald-500'}`} style={{ width: `${val}%` }}/>
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

      </div>
      {/* 🚀 Conditionally render spacer to PREVENT empty scrolling. Increased mobile height to clear the fixed input */}
      {(running || summary) && <div className="h-40 md:h-24" />}
    </div>
  );
}