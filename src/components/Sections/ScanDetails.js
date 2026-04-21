import React, { useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { supabase } from '../../lib/supabase';
import {
  ShieldCheckIcon, ArrowLeftIcon, ShareIcon, TrashIcon, 
  ArrowPathIcon, ClipboardDocumentCheckIcon, LinkIcon,
  CalendarDaysIcon
} from '@heroicons/react/24/outline';

const formatPercent = (v) => Math.round(Math.max(0, Math.min(100, v)));

const formatDateTime = (utcDateStr) => {
  if (!utcDateStr) return 'Unknown Date';
  const safeStr = utcDateStr.endsWith('Z') || utcDateStr.includes('+') ? utcDateStr : `${utcDateStr}Z`;
  const date = new Date(safeStr);
  return date.toLocaleString('en-US', { 
    month: 'short', day: 'numeric', year: 'numeric', 
    hour: 'numeric', minute: '2-digit', hour12: true 
  });
};

export default function ScanDetails({ user, analysisHistory, setCurrentSection }) {
  const [record, setRecord] = useState(null);
  const [isSharing, setIsSharing] = useState(false);

  // 🚀 BULLETPROOF LOADER: Forces a reload when the custom event fires
  const loadRecord = useCallback(() => {
    const loadId = sessionStorage.getItem('xist_view_history_id');
    if (loadId && analysisHistory && analysisHistory.length > 0) {
      const foundRecord = analysisHistory.find(s => String(s.id) === String(loadId));
      if (foundRecord) {
        setRecord(foundRecord);
      } else {
        toast.error("Record not found in current session.");
        setCurrentSection('home');
      }
    }
  }, [analysisHistory, setCurrentSection]);

  useEffect(() => {
    loadRecord(); // Load on mount
    // Listen for clicks from the sidebar to force an instant update
    window.addEventListener('xist_history_clicked', loadRecord);
    return () => window.removeEventListener('xist_history_clicked', loadRecord);
  }, [loadRecord]);

  if (!record) {
    return (
      <div className="w-full min-h-screen flex flex-col items-center justify-center pt-20">
        <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-slate-500 font-mono uppercase tracking-widest text-xs">Retrieving Immutable Record...</p>
      </div>
    );
  }

  const score = record.score || 0;
  const verdictLevel = record.verdict || record.level || 'UNKNOWN';
  const metrics = record.metrics || record.metadata || {};
  
  // 🚀 BULLETPROOF SOURCE PARSER (Fixes Supabase JSONB parsing)
  let sources = [];
  try {
    if (typeof record.sources === 'string') {
      sources = JSON.parse(record.sources);
    } else if (Array.isArray(record.sources)) {
      sources = record.sources;
    }
  } catch (e) {
    console.error("Failed to parse sources:", e);
  }

  const handleShareToCommunity = async () => {
    setIsSharing(true);
    try {
      const postData = {
        title: `[${Math.round(score)}% Score] AI Detected ${verdictLevel} Content`,
        description: `FORENSIC SUMMARY:\n${record.summary}\n\nSCANNED CONTENT:\n"${String(record.input || record.query || '').substring(0, 150)}..."`,
        threat_type: record.mode === 'url' ? 'scam' : record.mode === 'text' ? 'misinfo' : 'deepfake', 
        location: 'Global AI Network', is_verified: false, user_id: user?.id || null, media_url: record.media_url || null
      };
      const { error } = await supabase.from('community_threats').insert(postData);
      if (error) throw error;
      toast.success('Shared to Community Feed!');
    } catch (error) {
      toast.error('Failed to broadcast to community.');
    } finally {
      setIsSharing(false);
    }
  };

  const handleLoadToScanner = () => {
    sessionStorage.setItem('xist_preload_input', JSON.stringify({ mode: record.mode, input: record.input || record.query }));
    setCurrentSection('verify');
  };

  const handleDeleteRecord = async () => {
    if (!window.confirm("Permanently delete this forensic record?")) return;
    try {
      await supabase.from('user_history').delete().eq('id', record.id);
      toast.success('Record purged from history.');
      sessionStorage.removeItem('xist_view_history_id');
      setCurrentSection('home');
    } catch (err) {
      toast.error('Failed to delete record.');
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full min-h-screen pb-24 relative z-10" style={{ marginTop: '64px' }}>
      
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] invert dark:invert-0 z-0" style={{ backgroundImage: 'linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>

      <div className="max-w-5xl mx-auto px-4 md:px-8 py-8 relative z-10">
        
        {/* Top Navigation Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <button onClick={() => setCurrentSection('home')} className="flex items-center gap-2 px-4 py-2 rounded-full glass-input text-[10px] font-black uppercase tracking-widest text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all w-max">
            <ArrowLeftIcon className="w-4 h-4" /> Back to Dashboard
          </button>
          <div className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-widest px-4 py-2 rounded-full glass-input w-max border border-black/5 dark:border-white/5">
            <CalendarDaysIcon className="w-4 h-4" /> {formatDateTime(record.created_at)}
          </div>
        </div>

        {/* EXACT INPUT BLOCK */}
        <div className="mb-6 p-6 rounded-[2rem] border glass-card shadow-lg">
          <span className="text-[10px] font-black uppercase tracking-widest text-indigo-500 block mb-3">Target Content Scanned [{record.mode}]</span>
          <div className="text-sm md:text-base font-medium text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-900/50 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 break-words whitespace-pre-wrap">
            {record.input || record.query || 'No text input saved.'}
          </div>
          {record.media_url && (
            <div className="mt-4 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-black/5 flex items-center justify-center max-w-md p-2">
              {record.media_url.match(/\.(jpeg|jpg|gif|png|webp)(\?.*)?$/i) ? (
                <img src={record.media_url} alt="Scanned Evidence" className="max-h-[300px] object-contain rounded-lg" />
              ) : record.media_url.match(/\.(mp4|webm|ogg|mov)(\?.*)?$/i) ? (
                <video src={record.media_url} controls className="max-h-[300px] w-full rounded-lg" />
              ) : record.media_url.match(/\.(mp3|wav)(\?.*)?$/i) ? (
                <audio src={record.media_url} controls className="w-full" />
              ) : (
                <a href={record.media_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 p-4 glass-input rounded-xl text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 font-bold text-sm transition-colors w-full justify-center">
                  <ClipboardDocumentCheckIcon className="w-6 h-6" />
                  View Attached Document
                </a>
              )}
            </div>
          )}
        </div>

        {/* THE VERDICT & SUMMARY */}
        <div className="p-6 md:p-8 rounded-[2rem] flex flex-col md:flex-row items-center md:items-start gap-8 border glass-card shadow-2xl mb-6">
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
            <div className="flex flex-col xl:flex-row xl:items-center justify-between mb-4 pb-4 border-b border-black/10 dark:border-white/10 gap-4">
                <h2 className="text-sm font-black uppercase tracking-widest text-slate-900 dark:text-white flex items-center gap-2">
                  <ShieldCheckIcon className="w-5 h-5 text-indigo-500" /> AI Diagnostic Report
                </h2>
                <div className="flex flex-wrap items-center gap-2">
                  <button onClick={handleLoadToScanner} className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest px-4 py-2.5 rounded-xl transition-colors glass-input text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300">
                    <ArrowPathIcon className="w-4 h-4" /> Re-Scan Input
                  </button>
                  <button onClick={handleShareToCommunity} disabled={isSharing} className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest px-4 py-2.5 rounded-xl transition-colors bg-indigo-600 text-white hover:bg-indigo-500 shadow-lg">
                    {isSharing ? <ArrowPathIcon className="w-4 h-4 animate-spin" /> : <ShareIcon className="w-4 h-4" />} Share
                  </button>
                  <button onClick={handleDeleteRecord} className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest px-4 py-2.5 rounded-xl transition-colors glass-input text-rose-500 hover:bg-rose-500 hover:text-white">
                    <TrashIcon className="w-4 h-4" /> Delete
                  </button>
                </div>
            </div>
            
            <div className="flex-grow">
              <div className="text-sm md:text-base font-medium leading-relaxed whitespace-pre-wrap text-slate-700 dark:text-slate-300">
                  {record.summary || 'No detailed diagnostic available for this record.'}
              </div>
            </div>
          </div>
        </div>

        {/* SOURCES & METRICS */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Sources */}
            <div className="p-6 md:p-8 rounded-[2rem] border glass-card shadow-xl flex flex-col h-full">
                <h3 className="text-xs font-bold uppercase tracking-widest mb-5 flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
                  <ClipboardDocumentCheckIcon className="w-5 h-5" /> Validation Sources
                </h3>
                
                {sources.length > 0 ? (
                  <div className="space-y-4 flex-grow">
                    {sources.map((src, idx) => (
                      <a key={idx} href={src.url !== 'Observation' ? src.url : '#'} target={src.url !== 'Observation' ? "_blank" : "_self"} rel="noopener noreferrer"
                        className="block border-l-4 border-indigo-500 pl-4 py-3 transition-all group cursor-pointer hover:border-l-indigo-400 glass-input rounded-r-xl"
                      >
                        <div className="text-sm font-black flex items-center justify-between text-slate-900 dark:text-slate-100">
                          <span>{src.source_name || src.name || `Source ${idx + 1}`}</span>
                          {src.url !== 'Observation' && <LinkIcon className="w-4 h-4 text-indigo-500 opacity-50 group-hover:opacity-100 transition-opacity" />}
                        </div>
                        <div className="text-xs mt-1.5 leading-relaxed font-medium text-slate-600 dark:text-slate-400">{src.why_relevant || src.relevance}</div>
                      </a>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center flex-grow py-8 text-center opacity-60">
                    <LinkIcon className="w-10 h-10 mb-3 text-slate-500" />
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">No external sources attached to this report.</p>
                  </div>
                )}
            </div>

            {/* Metrics */}
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

      </div>
    </motion.div>
  );
}