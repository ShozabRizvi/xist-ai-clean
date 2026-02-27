// VerifySection.jsx - Complete Xist AI Forensic Intelligence Hub
// Light/Dark mode compatible + Full AI integration + Supabase ready
import React, { useEffect, useMemo, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast, Toaster } from 'react-hot-toast';
import {
  ShieldCheckIcon,
  DocumentTextIcon,
  LinkIcon,
  PhotoIcon,
  VideoCameraIcon,
  ArrowPathIcon,
  ExclamationTriangleIcon,
  CheckBadgeIcon,
  ClockIcon,
  TrashIcon,
  ShareIcon,
  SparklesIcon,
  Cog6ToothIcon,
  SunIcon,
  MoonIcon
} from '@heroicons/react/24/outline';
import { supabase } from '../../lib/supabase';
// Add after imports (line 20)
const USE_REAL_APIS = process.env.REACT_APP_USE_REAL_APIS === 'true';

// ==============================
// THEME & CONSTANTS (Light/Dark)
// ==============================
const THEMES = {
  dark: {
    background: 'bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900',
    card: 'bg-slate-800/80 backdrop-blur-xl',
    accentPrimary: 'from-purple-500 to-indigo-500',
    accentSecondary: 'from-indigo-500 to-blue-500',
    safe: 'from-emerald-400 to-emerald-500',
    danger: 'from-rose-500 to-rose-600',
    textPrimary: 'text-white',
    textSecondary: 'text-slate-300',
    muted: 'text-slate-400',
    glassOpacity: 'rgba(255,255,255,0.03)'
  },
  light: {
    background: 'bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50',
    card: 'bg-white/80 backdrop-blur-xl',
    accentPrimary: 'from-purple-500 to-indigo-500',
    accentSecondary: 'from-indigo-400 to-blue-400',
    safe: 'from-emerald-500 to-emerald-600',
    danger: 'from-rose-500 to-rose-600',
    textPrimary: 'text-slate-900',
    textSecondary: 'text-slate-700',
    muted: 'text-slate-500',
    glassOpacity: 'rgba(0,0,0,0.03)'
  }
};

const MODES = [
  { id: 'text', label: 'Text', icon: DocumentTextIcon },
  { id: 'url', label: 'URL', icon: LinkIcon },
  { id: 'image', label: 'Image', icon: PhotoIcon },
  { id: 'video', label: 'Video', icon: VideoCameraIcon },
  { id: 'voice', label: 'Voice', icon: VideoCameraIcon }
];

const DEFAULT_METRICS = {
  cognitiveload: 0,
  narrativedistance: 0,
  emotionalvelocity: 0,
  authenticityscore: 0
};

const VERDICT_LEVELS = {
  SAFE: 'SAFE',
  SUSPICIOUS: 'SUSPICIOUS',
  CRITICAL: 'CRITICAL'
};

// ==============================
// UTILITY FUNCTIONS
// ==============================
const clamp = (v, a = 0, b = 100) => Math.max(a, Math.min(b, v));
const formatPercent = (v) => Math.round(clamp(v));
const verdictFromScore = (score) => {
  if (score >= 80) return VERDICT_LEVELS.CRITICAL;
  if (score >= 50) return VERDICT_LEVELS.SUSPICIOUS;
  return VERDICT_LEVELS.SAFE;
};

const verdictLabel = (level) => {
  switch (level) {
    case VERDICT_LEVELS.CRITICAL: return 'Psychological Deception';
    case VERDICT_LEVELS.SUSPICIOUS: return 'Narrative Manipulation';
    default: return 'Authentic';
  }
};

const verdictColor = (level, theme) => {
  switch (level) {
    case VERDICT_LEVELS.CRITICAL: return theme.danger;
    case VERDICT_LEVELS.SUSPICIOUS: return theme.accentSecondary;
    default: return theme.safe;
  }
};

// ==============================
// SUB-COMPONENTS
// ==============================
const ModeSelector = ({ mode, setMode, theme }) => (
  <div className="w-full flex justify-center mt-6">
    <div className={`inline-flex items-center rounded-full p-3 ${theme.card} shadow-xl ring-1 ring-white/10`}>
      {MODES.map((m) => {
        const Icon = m.icon;
        const active = m.id === mode;
        return (
          <button
            key={m.id}
            onClick={() => setMode(m.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-200 focus:outline-none ${
              active
                ? `bg-gradient-to-r ${theme.accentPrimary} text-white shadow-lg shadow-purple-500/25`
                : 'text-slate-400 hover:text-white hover:bg-white/10'
            }`}
            style={{ fontFamily: 'Inter, system-ui, -apple-system', fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.05em' }}
          >
            <Icon className="w-4 h-4" />
            <span className="hidden sm:inline">{m.label}</span>
          </button>
        );
      })}
    </div>
  </div>
);

const TerminalOutput = ({ running, logs, onClear, theme }) => {
  const containerRef = useRef(null);
  
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <div className="mt-4">
      <div className={`${theme.card} p-4 text-xs font-mono border border-white/10 rounded-xl min-h-[120px] max-h-[240px] overflow-y-auto`} ref={containerRef}>
        {logs.length === 0 ? (
          <div className={`${theme.muted} text-center py-8`}>Diagnostic terminal idle</div>
        ) : (
          logs.map((l, i) => (
            <div key={i} className="flex items-start gap-2 mb-2 last:mb-0">
              <div className={`w-2 h-2 rounded-full mt-1 flex-shrink-0 ${
                l.level === 'info' ? 'bg-indigo-400' :
                l.level === 'warn' ? 'bg-yellow-400' :
                'bg-rose-400'
              }`} />
              <div className="flex-1 min-w-0">
                <div className={`${theme.muted} text-xs`}>{l.time}</div>
                <div className={`${theme.textSecondary} truncate`}>{l.message}</div>
              </div>
            </div>
          ))
        )}
      </div>
      <div className="flex items-center justify-between mt-3">
        <div className={`${theme.muted} text-xs`}>
          {running ? '🔄 Analyzing...' : '⚡ Idle'}
        </div>
        <button
          onClick={onClear}
          className={`${theme.textSecondary} px-3 py-1 rounded-md hover:bg-white/10 text-xs transition-colors`}
        >
          Clear
        </button>
      </div>
    </div>
  );
};

const MetricBar = ({ label, value, color, description, theme }) => {
  const pct = clamp(value, 0, 100);
  return (
    <div className="mb-4">
      <div className="flex justify-between items-baseline">
        <div className={`${theme.muted} text-xs uppercase tracking-widest`}>{label}</div>
        <div className={`${theme.textPrimary} text-sm font-semibold`}>{formatPercent(pct)}%</div>
      </div>
      <div className="w-full h-3 rounded-full mt-2 bg-white/10 border border-white/20">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.9, ease: 'easeOut' }}
          className="h-full rounded-full shadow-lg"
          style={{
            background: `linear-gradient(90deg, ${color}, var(--accent-secondary, #6366f1))`,
            boxShadow: `0 4px 18px ${color}33`
          }}
        />
      </div>
      <div className={`${theme.muted} text-xs mt-1`}>{description}</div>
    </div>
  );
};

const EvidenceLog = ({ items, theme }) => (
  <div className="mt-6">
    <div className={`${theme.muted} text-xs uppercase tracking-widest mb-3 font-medium`}>Evidence Log</div>
    {items.length === 0 ? (
      <div className={`${theme.textSecondary} text-sm py-6 text-center border-2 border-dashed border-white/20 rounded-xl`}>
        No anomalies detected
      </div>
    ) : (
      <div className="space-y-3">
        {items.map((item, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.03 }}
            className={`${theme.card} p-4 rounded-xl border border-white/10 flex items-start gap-3 hover:shadow-2xl transition-all`}
          >
            <ExclamationTriangleIcon className="w-6 h-6 text-rose-400 flex-shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <div className={`${theme.textPrimary} text-sm font-semibold mb-1 truncate`}>{item.title}</div>
              <div className={`${theme.textSecondary} text-xs leading-relaxed`}>{item.detail}</div>
            </div>
          </motion.div>
        ))}
      </div>
    )}
  </div>
);

const VerdictCard = ({ score, level, summary, theme }) => {
  const color = verdictColor(level, theme);
  const label = verdictLabel(level);
  
  return (
    <motion.div
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className={`${theme.card} rounded-2xl p-8 border border-white/10 shadow-2xl`}
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className={`${theme.muted} text-xs uppercase tracking-widest mb-2 font-medium`}>Verdict Confidence</div>
          <div className="flex items-end gap-4">
            <div className="text-6xl font-black" style={{ color: color.split('from-')[1]?.replace('-500', '-400') }}>
              {formatPercent(score)}%
            </div>
            <div className={`${theme.textPrimary} text-2xl font-bold tracking-tight`}>{label}</div>
          </div>
        </div>
        <ShieldCheckIcon className="w-20 h-20 text-white/40 hidden md:block" />
      </div>
      {summary && (
        <div className={`${theme.textSecondary} text-sm leading-relaxed bg-white/5 p-4 rounded-xl`}>
          {summary}
        </div>
      )}
    </motion.div>
  );
};

const CriticalOverlay = ({ open, onCancel, onComplete, theme }) => {
  const [count, setCount] = useState(10);
  const timerRef = useRef(null);

  useEffect(() => {
    if (!open) {
      setCount(10);
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      return;
    }

    timerRef.current = setInterval(() => {
      setCount((c) => {
        if (c <= 1) {
          clearInterval(timerRef.current);
          timerRef.current = null;
          onComplete();
          return 0;
        }
        return c - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [open, onComplete]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
          style={{
            background: 'linear-gradient(180deg, rgba(2,6,23,0.95), rgba(15,23,42,0.98))',
            backdropFilter: 'blur(12px)'
          }}
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            className={`${theme.card} max-w-2xl w-full p-8 rounded-2xl border border-white/20 shadow-2xl`}
          >
            <div className="flex items-center justify-between mb-6">
              <div className="text-rose-400 text-xs uppercase tracking-widest font-bold flex items-center gap-2">
                <ExclamationTriangleIcon className="w-5 h-5" />
                Critical Threat Protocol
              </div>
              <button onClick={onCancel} className="text-white/60 hover:text-white p-1 -m-1 rounded-full hover:bg-white/10">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="text-center mb-8">
              <div className={`${theme.textPrimary} text-3xl font-bold mb-3`}>
                Global Intelligence Sync Imminent
              </div>
              <div className={`${theme.textSecondary} text-sm mb-6 max-w-md mx-auto`}>
                This scan detected critical deception indicators. Anonymized intelligence will be shared with the Xist AI community unless cancelled.
              </div>
              <div className="space-y-2">
                <div className={`${theme.muted} text-xs uppercase tracking-widest`}>Auto-Sync in</div>
                <div className={`text-5xl font-black ${theme.danger.split(' ')[0]}`}>
                  {count || 'SYNC'}
                </div>
                <div className={`${theme.muted} text-xs uppercase tracking-widest`}>seconds</div>
              </div>
            </div>
            
            <div className="flex justify-end">
              <button
                onClick={onCancel}
                className="px-6 py-2.5 rounded-xl font-semibold text-sm bg-white/20 hover:bg-white/30 backdrop-blur-sm border border-white/30 transition-all"
              >
                Cancel Global Sync
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const PrivateLedger = ({ entries, theme }) => (
  <div className="mt-8">
    <div className={`${theme.muted} text-xs uppercase tracking-widest mb-4 font-medium`}>Private Ledger</div>
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 ${theme.card} p-6 rounded-xl border border-white/10`}>
      {entries.length === 0 ? (
        <div className={`${theme.textSecondary} col-span-full text-center py-12`}>
          No recent scans. Run your first analysis above.
        </div>
      ) : (
        entries.map((e) => (
          <motion.div
            key={e.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 rounded-xl border border-white/10 hover:shadow-xl transition-all hover:-translate-y-1 group"
          >
            <div className="flex items-center justify-between mb-2">
              <div className={`${theme.textPrimary} text-sm font-semibold`}>
                {e.mode?.toUpperCase() || 'TEXT'}
              </div>
              <div className={`${theme.muted} text-xs`}>
                {new Date(e.created_at).toLocaleString()}
              </div>
            </div>
            <div className={`${theme.muted} text-xs mb-2`}>{e.verdict}</div>
            <div className={`${theme.textSecondary} text-sm line-clamp-2 group-hover:line-clamp-none`}>
              {e.summary || e.input?.slice(0, 120)}
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
export default function VerifySection({ user }) { 
  // Theme state
  const [themeMode, setThemeMode] = useState('dark');
  const theme = THEMES[themeMode];

  // Core analysis state
  const [mode, setMode] = useState('text');
  const [inputValue, setInputValue] = useState('');
  const [file, setFile] = useState(null);
  const [running, setRunning] = useState(false);
  const [logs, setLogs] = useState([]);
  const [metrics, setMetrics] = useState(DEFAULT_METRICS);
  const [evidence, setEvidence] = useState([]);
  const [score, setScore] = useState(0);
  const [verdictLevel, setVerdictLevel] = useState(VERDICT_LEVELS.SAFE);
  const [detailedAnalysis, setDetailedAnalysis] = useState(null);
  const [summary, setSummary] = useState('');
  const [ledger, setLedger] = useState([]);
  const [loadingLedger, setLoadingLedger] = useState(true);
  const [analysisStage, setAnalysisStage] = useState("");

  // Overlays & flags
  const [criticalOpen, setCriticalOpen] = useState(false);
  const [autoSyncPending, setAutoSyncPending] = useState(null);
  const [sharing, setSharing] = useState(false);
  const [error, setError] = useState(null);
  
  // Analysis controller
  const analysisAbortRef = useRef({ aborted: false });
  const userIdRef = useRef(null);

  // ==============================
  // SUPABASE INTEGRATION
  // ==============================
  const pushLog = useCallback((message, level = 'info') => {
    const entry = { time: new Date().toLocaleTimeString(), message, level };
    setLogs(prev => [...prev, entry].slice(-200));
  }, []);

  const fetchLedger = useCallback(async () => {
    setLoadingLedger(true);
    try {
      const { data, error } = await supabase
        .from('user_history')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(6);

      if (error) {
        console.error('Supabase fetch ledger error:', error);
        toast.error('Failed to load private ledger.');
      } else {
        setLedger(data || []);
      }
    } catch (err) {
      console.error('Ledger fetch exception:', err);
      toast.error('Unexpected error loading ledger.');
    } finally {
      setLoadingLedger(false);
    }
  }, []);

  // FIXED persistHistory - Works with your Supabase
const persistHistory = async (record) => {
    try {
      console.log('💾 Saving to ledger:', record);
      
      const { data, error } = await supabase
        .from('user_history')  // ✅ Your existing table
        .upsert({
          user_id: user?.id || 'anonymous',
          verdict: record.verdict,
          score: record.score,
          level: record.level,
          summary: record.summary || 'Analysis complete',
          input: record.input?.substring(0, 500),
          mode: record.mode,
          metadata: record.metrics,
          created_at: new Date().toISOString()
        });

      if (error) {
        console.error('Ledger error:', error);
        toast.error('Ledger save failed');
      } else {
        console.log('✅ Ledger saved:', data);
        toast.success('✅ Saved to Private Ledger');
        fetchLedger();  // Refresh ledger
      }
    } catch (error) {
      console.error('Ledger exception:', error);
    }
  };


  const shareToCommunity = async (record) => {
    setSharing(true);
    try {
      const postData = {
        title: `${record.verdict} Threat (${record.mode.toUpperCase()})`,
        body: `${record.summary}\n\nScore: ${record.score}%\nEvidence: ${record.evidence.length}\nMetrics: ${JSON.stringify(record.metrics)}`,  // ✅ FULL DETAILS
        metadata: record,
        evidence_count: record.evidence.length,
        is_automated: true,
        mode: record.mode,
        user_id: user?.id  // ✅ Links to profile
      };

      console.log('📤 Sharing to community:', postData);

      const { data, error } = await supabase
        .from('communityposts')
        .insert(postData)
        .select();

      if (error) throw error;
      
      toast.success('🚀 Shared to Community - Full details included!');
      setSharing(false);
    } catch (error) {
      console.error('Share error:', error);
      toast.error('Share failed');
      setSharing(false);
    }
  };

  // Load ledger on mount
  useEffect(() => {
    fetchLedger();
  }, [fetchLedger]);

  const runAnalysis = async (autoShare = false) => {
  if (running) return toast('Analysis already running.', { icon: '⚠️' });
  if (!inputValue && !file) return toast.error('Please provide content to analyze.');

  setRunning(true);
  analysisAbortRef.current.aborted = false;
  setError(null);
  setLogs([]);
  
  pushLog('🚀 Initializing Xist AI Forensic Engine...', 'info');
  pushLog('🔗 DeepSeek-R1-0528 (Postman CONFIRMED)...', 'info');
  
  try {
    // ✅ YOUR WORKING OPENROUTER + DEEPSEEK-R1
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.REACT_APP_OPENROUTER_API_KEY?.trim()}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': window.location.origin,
        'X-Title': 'Xist AI',
      },
      body: JSON.stringify({
        model: 'openai/gpt-oss-120b:free',
        messages: [{
  role: 'user',
  content: `
You are Xist AI — an advanced misinformation forensic analysis engine.

Return ONLY valid JSON.

STRICT FORMAT:

{
  "overall_verdict": "SAFE | QUESTIONABLE | MISLEADING | FALSE | MANIPULATIVE",
  "credibility_score": number (0-100),

  "content_overview": {
    "content_type": "news | opinion | social_post | political_statement | advertisement | unknown",
    "primary_theme": string,
    "intent_assessment": "informative | persuasive | emotional_manipulation | propaganda | unclear"
  },

  "claim_analysis": [
    {
      "claim_text": string,
      "claim_type": "factual | opinion | prediction | emotional_trigger",
      "confidence_level": number (0-100),
      "risk_level": "low | medium | high",
      "verification_status": "verified | unverified | disputed | false | opinion_based",
      "explanation": string
    }
  ],

  "extracted_quotes": [
    {
      "quote": string,
      "tone": "neutral | emotional | aggressive | fear_based | persuasive",
      "manipulation_risk": number (0-100)
    }
  ],

  "linguistic_patterns": {
    "emotional_intensity": number (0-100),
    "bias_indicator_score": number (0-100),
    "sensationalism_score": number (0-100),
    "logical_consistency_score": number (0-100)
  },

  "contextual_risk_assessment": {
    "misinformation_probability": number (0-100),
    "propaganda_likelihood": number (0-100),
    "virality_risk": number (0-100)
  },

  "recommended_sources_for_verification": [
    {
      "source_name": string,
      "source_type": "fact_check | news | government | academic | data_repository",
      "why_relevant": string
    }
  ],

  "final_explanation_for_user": string
}

Analyze this content:

"${inputValue || file?.name || 'No content'}"
`
}],
        temperature: 0.05,
        max_tokens: 3000
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || '{}';
    
    // Parse forensic JSON
    let analysis;

try {
  const cleaned = content.replace(/```json\s*|\s*```/g, '').trim();
  analysis = JSON.parse(cleaned);
} catch {
  analysis = {
    overall_verdict: 'QUESTIONABLE',
    credibility_score: 50,
    content_overview: {},
    claim_analysis: [],
    extracted_quotes: [],
    linguistic_patterns: {},
    contextual_risk_assessment: {},
    recommended_sources_for_verification: [],
    final_explanation_for_user: 'AI response malformed. Neutral assessment applied.'
  };
}

    // ✅ SET ANALYSIS RESULTS
    setScore(analysis.credibility_score || 50);
setVerdictLevel(analysis.overall_verdict || 'QUESTIONABLE');

setMetrics(analysis.linguistic_patterns || DEFAULT_METRICS);
setEvidence(analysis.claim_analysis || []);
setSummary(analysis.final_explanation_for_user || 'Forensic analysis complete');

setDetailedAnalysis({
  overview: analysis.content_overview || {},
  claims: analysis.claim_analysis || [],
  quotes: analysis.extracted_quotes || [],
  contextual: analysis.contextual_risk_assessment || {},
  sources: analysis.recommended_sources_for_verification || []
});

    pushLog(`✅ DeepSeek-R1: ${analysis.verdict} (${analysis.score}%)`, 'success');
    toast.success(`🎯 ${analysis.verdict} (${analysis.score}%) - R1 Analysis!`);

    // 🔥 FIXED: CREATE COMPLETE RECORD
    const record = {
      mode,
      input: inputValue || file?.name || 'Unknown',
      verdict: analysis.verdict || 'SUSPICIOUS',
      score: analysis.score || 50,
      level: analysis.level || 'SUSPICIOUS',
      evidence: analysis.evidence || [],
      metrics: analysis.metrics || DEFAULT_METRICS,
      summary: analysis.summary || 'Analysis complete'
    };

    // ✅ 1. SAVE TO LEDGER (Your user_history table)
    await persistHistory(record);

    // ✅ 2. AUTO-SHARE CRITICAL THREATS TO COMMUNITY
    if (analysis.score > 75 || autoShare) {
      pushLog('🚨 Critical threat detected - Auto-sharing to community...', 'warn');
      setTimeout(() => shareToCommunity(record), 1000);
    }

  } catch (err) {
    pushLog(`❌ ${err.message}`, 'error');
    toast.error(err.message);
  } finally {
    setRunning(false);
  }
};



  const cancelAnalysis = () => {
    analysisAbortRef.current.aborted = true;
    setRunning(false);
    pushLog('👤 User requested cancellation.', 'warn');
  };

  const onCriticalComplete = async () => {
    setCriticalOpen(false);
    if (autoSyncPending) {
      await shareToCommunity(autoSyncPending, true);
      setAutoSyncPending(null);
    }
  };

  const onCriticalCancel = () => {
    setCriticalOpen(false);
    setAutoSyncPending(null);
    toast('Global sync cancelled.', { icon: '❌' });
  };

  const handleShareClick = async () => {
    if (running) {
      toast('Wait for analysis to finish.', { icon: '⏳' });
      return;
    }

    const record = {
      mode,
      input: mode === 'text' ? inputValue : file?.name || inputValue,
      verdict: verdictLabel(verdictLevel),
      verdict_level: verdictLevel,
      score,
      metrics,
      evidence,
      summary
    };

    await shareToCommunity(record, false);
  };

  const handleFileChange = (e) => {
    const f = e.target.files?.[0];
    if (f) {
      setFile(f);
      setInputValue(f.name);
      pushLog(`📁 File selected: ${f.name}`, 'info');
    }
  };

  const clearAll = () => {
    setInputValue('');
    setFile(null);
    setLogs([]);
    setEvidence([]);
    setMetrics(DEFAULT_METRICS);
    setScore(0);
    setSummary('');
    setVerdictLevel(VERDICT_LEVELS.SAFE);
    toast('Cleared input and state.', { icon: '🔄' });
  };

  // Quick samples
  const loadSample = () => {
    const sample = `🚨 BREAKING: New study shows shocking correlation between 5G towers and cognitive decline. Experts warn this could fundamentally alter human evolution. Read the exclusive report: https://example.com/5g-study`;
    setInputValue(sample);
    toast('Sample critical content loaded.', { icon: '📄' });
  };

  return (
    <div className={`w-full min-h-screen p-8 ${theme.background} ${theme.textPrimary} overflow-x-hidden`}
         style={{ 
           fontFamily: 'Inter, system-ui, -apple-system, Segoe UI, Roboto, sans-serif',
           marginLeft: '280px',
           marginTop: '64px'
         }}>
      
      {/* Theme Toggle */}
      <div className="fixed top-4 right-4 z-40">
        <button
          onClick={() => setThemeMode(themeMode === 'dark' ? 'light' : 'dark')}
          className={`${theme.card} p-2 rounded-xl border border-white/20 shadow-lg hover:shadow-xl transition-all`}
        >
          {themeMode === 'dark' ? (
            <SunIcon className="w-5 h-5 text-yellow-400" />
          ) : (
            <MoonIcon className="w-5 h-5 text-slate-600" />
          )}
        </button>
      </div>

      <Toaster position="top-right" containerStyle={{ top: 80 }} />

      {/* Header */}
      <div className="max-w-6xl mx-auto text-center mb-12">
        <div className="flex flex-col items-center">
          <motion.div
            initial={{ scale: 0.8, rotate: -5 }}
            animate={{ scale: 1, rotate: 0 }}
            className={`${theme.card} rounded-2xl p-6 mb-6 shadow-2xl border border-white/20 backdrop-blur-xl`}
            style={{ 
              background: `linear-gradient(180deg, ${theme.card}, ${theme.glassOpacity})`,
              boxShadow: '0 20px 40px rgba(139, 92, 246, 0.15)'
            }}
          >
            <ShieldCheckIcon className="w-20 h-20 text-white mx-auto mb-4" style={{ opacity: 0.9 }} />
          </motion.div>
          <motion.h1 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-7xl md:text-8xl font-black bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400 bg-clip-text text-transparent mb-6 leading-tight"
          >
            Xist AI
          </motion.h1>
          <motion.p 
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className={`${theme.textSecondary} text-xl md:text-2xl max-w-2xl mx-auto leading-relaxed`}
          >
            Forensic Intelligence Hub - Real-time deception detection and psychological signature analysis
          </motion.p>
        </div>
      </div>

      {/* Mode Selector */}
      <ModeSelector mode={mode} setMode={setMode} theme={theme} />

      {/* Main Content Grid */}
      <div className="max-w-6xl mx-auto mt-12 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column - Input Lab */}
        <div className="lg:col-span-7 space-y-8">
          
          {/* Input Lab Card */}
          <div className={`${theme.card} rounded-2xl p-8 border border-white/10 shadow-2xl`}>
            <div className="flex items-start justify-between gap-4 mb-6">
              <div>
                <div className={`${theme.muted} text-xs uppercase tracking-widest mb-2 font-medium`}>Input Lab</div>
                <div className={`${theme.textSecondary} text-sm`}>Provide content for forensic analysis</div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={clearAll}
                  className={`${theme.textSecondary} px-4 py-2 rounded-xl text-xs font-medium hover:bg-white/10 transition-colors`}
                >
                  <TrashIcon className="w-4 h-4 inline mr-1" /> Reset
                </button>
                <button
                  onClick={loadSample}
                  className={`${theme.textSecondary} px-4 py-2 rounded-xl text-xs font-medium hover:bg-white/10 transition-colors`}
                >
                  Sample Data
                </button>
              </div>
            </div>

            {/* Input Area */}
            <div className="space-y-4">
              {mode === 'text' && (
                <textarea
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Paste text, articles, or content to analyze for deception patterns..."
                  className={`w-full min-h-[200px] p-6 rounded-xl text-lg ${theme.textPrimary} placeholder:${theme.muted} bg-white/5 border border-white/20 focus:border-purple-400/50 focus:ring-2 focus:ring-purple-500/30 focus:outline-none resize-vertical transition-all`}
                  style={{ fontFamily: 'Inter, ui-monospace, monospace' }}
                />
              )}
              
              {mode === 'url' && (
                <div className="flex gap-3">
                  <input
                    type="url"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="https://example.com/article"
                    className={`flex-1 p-4 rounded-xl text-lg ${theme.textPrimary} placeholder:${theme.muted} bg-white/5 border border-white/20 focus:border-purple-400/50 focus:ring-2 focus:ring-purple-500/30 focus:outline-none transition-all`}
                  />
                  <button
                    onClick={() => {
                      if (!inputValue) {
                        toast.error('Enter a URL first.');
                        return;
                      }
                      toast.success('URL queued for analysis (simulated fetch)');
                    }}
                    className={`px-6 py-4 rounded-xl bg-gradient-to-r ${theme.accentPrimary} text-white font-semibold shadow-lg hover:shadow-xl transition-all`}
                  >
                    Fetch
                  </button>
                </div>
              )}

              {['image', 'video', 'voice'].includes(mode) && (
                <div className={`border-2 border-dashed ${theme.muted} border-opacity-50 rounded-2xl p-12 flex flex-col items-center justify-center text-center hover:border-opacity-100 transition-all`}>
                  <div className={`${mode === 'image' ? 'text-blue-400' : 'text-purple-400'} mb-4`}>
                    <PhotoIcon className="w-16 h-16 mx-auto" />
                  </div>
                  <div className={`${theme.textSecondary} text-lg mb-4`}>Upload a {mode}</div>
                  <input
                    type="file"
                    accept={mode === 'image' ? 'image/*' : mode === 'video' ? 'video/*' : 'audio/*'}
                    onChange={handleFileChange}
                    className="file:mr-4 file:py-3 file:px-6 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-purple-500 file:text-white hover:file:bg-purple-600 file:transition-colors file:cursor-pointer w-full cursor-pointer"
                  />
                  {file && (
                    <div className={`${theme.textSecondary} mt-4 text-sm truncate max-w-full`}>
                      📁 {file.name}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Diagnostic Terminal */}
          <div className={`${theme.card} rounded-2xl p-8 border border-white/10 shadow-2xl`}>
            <div className="flex items-center justify-between mb-6">
              <div>
                <div className={`${theme.muted} text-xs uppercase tracking-widest mb-2 font-medium`}>Diagnostic Terminal</div>
                <div className={`${theme.muted} text-xs`}>
                  {running ? '🔄 Live analysis stream' : '⚡ Ready for analysis'}
                </div>
              </div>
            </div>
            <TerminalOutput running={running} logs={logs} onClear={() => setLogs([])} theme={theme} />
          </div>

          {/* Controls */}
          <div className="flex flex-wrap items-center gap-4 p-2">
            <button
              onClick={() => runAnalysis(false)}
              disabled={running}
              className={`px-8 py-4 rounded-xl text-lg font-bold flex-1 min-w-[200px] transition-all ${
                running
                  ? 'bg-white/10 text-slate-400 cursor-not-allowed'
                  : `bg-gradient-to-r ${theme.accentPrimary} text-white shadow-2xl hover:shadow-3xl hover:-translate-y-1 active:translate-y-0`
              }`}
            >
              {running ? (
                <>
                  <ArrowPathIcon className="w-5 h-5 animate-spin mr-2" />
                  Analyzing...
                </>
              ) : (
                '🚀 Run Forensic Audit'
              )}
            </button>
            
            <button
              onClick={() => runAnalysis(true)}
              disabled={running}
              className={`px-8 py-4 rounded-xl text-lg font-bold flex-1 min-w-[200px] transition-all bg-white/20 hover:bg-white/30 border border-white/30 backdrop-blur-sm ${
                running ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {running ? '⏳ Queued' : '🤝 Run + Auto-Share'}
            </button>
            
            <button
              onClick={cancelAnalysis}
              disabled={!running}
              className={`px-6 py-4 rounded-xl font-semibold text-sm transition-all ${
                running
                  ? 'bg-rose-500/80 text-white hover:bg-rose-500 shadow-lg hover:shadow-xl'
                  : 'bg-white/10 text-slate-400 hover:text-white hover:bg-white/20'
              }`}
            >
              ⏹️ Cancel
            </button>
          </div>
        </div>

        {/* Right Column - Intelligence Bento */}
        <div className="lg:col-span-5 space-y-8">
          
          {/* Intelligence Summary */}
          <div className={`${theme.card} rounded-2xl p-8 border border-white/10 shadow-2xl`}>
            <div className="flex items-center justify-between mb-6">
              <div>
                <div className={`${theme.muted} text-xs uppercase tracking-widest mb-2 font-medium`}>Intelligence Bento</div>
                <div className={`${theme.textSecondary} text-sm`}>Analysis snapshot & psychological signals</div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setEvidence([]);
                    setMetrics(DEFAULT_METRICS);
                    setScore(0);
                    setSummary('');
                    toast('Intelligence cleared.', { icon: '🔄' });
                  }}
                  className={`${theme.textSecondary} px-3 py-2 rounded-lg text-xs hover:bg-white/10 transition-colors`}
                >
                  Clear
                </button>
                <button
                  onClick={handleShareClick}
                  disabled={sharing || running}
                  className={`p-3 rounded-xl ${sharing || running ? 'bg-white/10 text-slate-400' : `bg-gradient-to-r ${theme.accentPrimary} text-white shadow-lg hover:shadow-xl transition-all`}`}
                >
                  <ShareIcon className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Verdict Card */}
            {score > 0 && (
              <VerdictCard score={score} level={verdictLevel} summary={summary} theme={theme} />
            )}

            {/* Psychological DNA */}
            {Object.values(metrics).some(v => v > 0) && (
              <div>
                <div className={`${theme.muted} text-xs uppercase tracking-widest mb-4 font-medium`}>Psychological DNA</div>
                <MetricBar
                  label="Cognitive Load"
                  value={metrics.cognitiveload}
                  color="#8b5cf6"
                  description="Complexity and cognitive strain indicators"
                  theme={theme}
                />
                <MetricBar
                  label="Narrative Distance"
                  value={metrics.narrativedistance}
                  color="#6366f1"
                  description="Deviation from expected contextual patterns"
                  theme={theme}
                />
                <MetricBar
                  label="Emotional Velocity"
                  value={metrics.emotionalvelocity}
                  color="#ef4444"
                  description="Rate of emotional escalation in language"
                  theme={theme}
                />
              </div>
            )}

            {/* Evidence Log */}
            {evidence.length > 0 && <EvidenceLog items={evidence} theme={theme} />}
          </div>

          {/* Private Ledger */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <div className={`${theme.muted} text-xs uppercase tracking-widest mb-2 font-medium`}>Private Ledger</div>
                <div className={`${theme.textSecondary} text-sm`}>Your recent scans (last 6)</div>
              </div>
              <div className={`${theme.muted} text-xs`}>
                {loadingLedger ? 'Loading...' : `${ledger.length} entries`}
              </div>
            </div>
            <PrivateLedger entries={ledger} theme={theme} />
          </div>
        </div>
      </div>

      {/* Critical Overlay */}
      <CriticalOverlay
        open={criticalOpen}
        onCancel={onCriticalCancel}
        onComplete={onCriticalComplete}
        theme={theme}
      />

      {/* Footer spacing */}
      <div className="h-24" />
      
      {/* Bottom utilities */}
      <div className="max-w-6xl mx-auto mt-12 space-y-4">
        <div className={`${theme.card} p-6 rounded-2xl border border-white/10 flex items-center justify-between`}>
          <div className={`${theme.muted} text-xs uppercase tracking-widest font-medium`}>System Health</div>
          <div className={`${theme.textSecondary} text-sm font-medium`}>All systems nominal</div>
          <div className={`${theme.muted} text-xs`}>v2.1.0</div>
        </div>
      </div>
    </div>
  );
}
