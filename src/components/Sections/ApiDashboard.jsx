import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  KeyIcon, ClipboardDocumentIcon, CodeBracketIcon, CommandLineIcon, 
  ShieldCheckIcon, TrashIcon, ExclamationTriangleIcon, ChartBarIcon,
  CheckCircleIcon, ArrowTrendingDownIcon, SparklesIcon
} from '@heroicons/react/24/outline';

// 🚀 1. IMPORT RECHARTS
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

// ==============================
// TYPING EFFECT HOOK
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

export default function ApiDashboard({ user, themeMode = 'dark' }) {
  const isDark = themeMode === 'dark';
  const typingTitle = useTypewriter("Developer API Hub", 80, 200);

  // State Management
  const [apiKeyData, setApiKeyData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('curl');
  
  // Pricing & Billing State
  const [billingCycle, setBillingCycle] = useState('yearly'); // 'monthly' or 'yearly'
  
  // Modal & Security State
  const [showModal, setShowModal] = useState(false);
  const [freshKey, setFreshKey] = useState(null); 

  // 🚀 LIVE USAGE DATA FROM SUPABASE
  const dailyLimit = 5; 
  const currentDailyUsage = apiKeyData?.daily_count || 0; 
  const currentPlan = "Basic"; // Mocked as basic until payment system is connected

  // Live Chart Data (Today is 100% real, past days default to 0 until an api_logs table is created)
  const chartData = [
    { date: '6 Days Ago', requests: 0 },
    { date: '5 Days Ago', requests: 0 },
    { date: '4 Days Ago', requests: 0 },
    { date: '3 Days Ago', requests: 0 },
    { date: '2 Days Ago', requests: 0 },
    { date: 'Yesterday', requests: 0 },
    { date: 'Today', requests: currentDailyUsage }, // <-- LIVE DATA
  ];

  // 1. Fetch Key on Load
  useEffect(() => {
    async function fetchKey() {
      const currentUserId = user?.id || user?.uid;
      if (!currentUserId) {
          setLoading(false);
          return;
      }
      const { data } = await supabase.from('api_keys').select('*').eq('user_id', currentUserId).single();
      if (data) setApiKeyData(data);
      setLoading(false);
    }
    fetchKey();
  }, [user]);

  // 2. Generate Key & Show Modal
  const generateNewKey = async () => {
    const currentUserId = user?.id || user?.uid;
    const currentUserEmail = user?.email || ''; // Grab user email for VIP checks
    if (!currentUserId) return toast.error("Must be logged in!");

    const newKey = 'xist_live_' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    
    // We also save the email so your Python backend can easily check for VIP Gmails
    const { data, error } = await supabase.from('api_keys').insert({ 
      user_id: currentUserId, 
      user_email: currentUserEmail, 
      key_string: newKey 
    }).select().single();

    if (error) {
      toast.error("Failed to generate key.");
    } else {
      setApiKeyData(data);
      setFreshKey(newKey);
      setShowModal(true); 
      toast.success("API Key Generated!");
    }
  };

  // 3. Delete Key
  const deleteKey = async () => {
    if (!window.confirm("WARNING: Any applications using this API key will instantly break. Are you sure you want to delete it?")) return;
    
    const currentUserId = user?.id || user?.uid;
    const { error } = await supabase.from('api_keys').delete().eq('user_id', currentUserId);
    
    if (error) {
      toast.error("Failed to delete key.");
    } else {
      setApiKeyData(null);
      setFreshKey(null);
      toast.success("API Key Deleted.");
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!");
  };

  const maskKey = (key) => {
    if (!key) return '';
    return key.slice(0, 10) + '********************' + key.slice(-4);
  };

  const handleUpgradeCheckout = () => {
    if (billingCycle === 'monthly') {
      window.open('https://rzp.io/rzp/jswxqVtx', '_blank'); 
    } else {
      window.open('https://rzp.io/rzp/NcnHgEmB', '_blank'); 
    }
  };

  const keyToDisplay = apiKeyData?.key_string || 'YOUR_API_KEY_HERE';
  
  const codeSnippets = {
    curl: `curl -X POST https://xist-ai-clean-1.onrender.com/api/v1/public/scan \\\n  -H "Content-Type: application/json" \\\n  -H "X-Xist-API-Key: ${keyToDisplay}" \\\n  -d '{\n    "mode": "text",\n    "text": "Check this suspicious message claiming I won the lottery."\n  }'`,
    powershell: `$headers = @{\n  "Content-Type" = "application/json"\n  "X-Xist-API-Key" = "${keyToDisplay}"\n}\n$body = @{\n  mode = "text"\n  text = "Check this suspicious message claiming I won the lottery."\n} | ConvertTo-Json\n\nInvoke-RestMethod -Uri "https://xist-ai-clean-1.onrender.com/api/v1/public/scan" -Method Post -Headers $headers -Body $body`,
    python: `import requests\n\nurl = "https://xist-ai-clean-1.onrender.com/api/v1/public/scan"\nheaders = {\n    "Content-Type": "application/json",\n    "X-Xist-API-Key": "${keyToDisplay}"\n}\ndata = {\n    "mode": "text",\n    "text": "Check this suspicious message claiming I won the lottery."\n}\n\nresponse = requests.post(url, headers=headers, json=data)\nprint(response.json())`,
    javascript: `fetch("https://xist-ai-clean-1.onrender.com/api/v1/public/scan", {\n  method: "POST",\n  headers: {\n    "Content-Type": "application/json",\n    "X-Xist-API-Key": "${keyToDisplay}"\n  },\n  body: JSON.stringify({\n    mode: "text",\n    text: "Check this suspicious message claiming I won the lottery."\n  })\n})\n.then(response => response.json())\n.then(data => console.log(data));`
  };

  return (
    // 🚀 FIX: Removed marginLeft, handled dynamically by App.js
    <div className="w-full min-h-screen relative overflow-x-hidden text-slate-900 dark:text-slate-100" style={{ fontFamily: 'Inter, system-ui, sans-serif', marginTop: '64px' }}>
      
      {/* 🌐 GLOBAL GRID BACKGROUND */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] dark:invert-0 invert z-0" 
           style={{ backgroundImage: 'linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>

      <div className="max-w-5xl mx-auto flex flex-col gap-6 relative z-10 px-4 md:px-8 py-8 md:py-12 pb-24">
        
        {/* HEADER */}
        <div className="text-center mb-4">
           <CodeBracketIcon className="w-12 h-12 text-indigo-500 mx-auto mb-4 opacity-80" />
           {/* 🚀 RESIZED & COLOR UPGRADED: text-indigo-950 gives a premium deep professional look in light mode */}
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-center mb-2 pb-4 leading-tight tracking-tight text-indigo-950 dark:text-white">
            <span className="text-brand-highlight">{typingTitle}</span>
            <motion.span animate={{ opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 0.9 }} className="inline-block w-2.5 md:w-3 h-[0.8em] bg-indigo-500 dark:bg-indigo-400 ml-2 align-baseline" />
          </h1>
           <p className="text-sm md:text-base font-medium text-slate-600 dark:text-slate-400 max-w-2xl mx-auto flex items-center justify-center gap-2">
             Integrate Xist AI's forensic threat detection engine directly into your own apps.
           </p>
           <div className="mt-6 inline-flex items-center gap-2 glass-input px-5 py-2 rounded-full text-xs font-black uppercase tracking-widest text-slate-700 dark:text-slate-300">
             <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]"></span>
             Current Plan: <strong className="text-indigo-600 dark:text-indigo-400">{currentPlan}</strong>
           </div>
        </div>

        {/* TOP ROW: USAGE ANALYTICS & API KEY MANAGEMENT */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-4">
          
          {/* USAGE CARD */}
          <div className="glass-card p-6 md:p-8 rounded-[2rem] flex flex-col justify-between shadow-xl">
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-black uppercase tracking-widest flex items-center gap-2 text-slate-900 dark:text-white">
                  <ChartBarIcon className="w-5 h-5 text-indigo-500" /> Daily API Usage
                </h2>
                <span className="bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border border-indigo-500/20">Today</span>
              </div>
              
              <div className="flex items-end gap-3 mb-6 text-slate-900 dark:text-white">
                <span className="text-4xl font-black">{currentDailyUsage}</span>
                <span className="text-slate-500 text-sm font-black tracking-widest uppercase mb-1">requests / {dailyLimit} limit</span>
              </div>
            </div>
            
            {/* REAL-TIME CHART */}
            <div className="w-full h-[180px] mt-auto">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorRequests" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'} opacity={0.5} />
                  <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: isDark ? '#94a3b8' : '#64748b', fontWeight: 'bold' }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: isDark ? '#94a3b8' : '#64748b', fontWeight: 'bold' }} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: isDark ? 'rgba(15, 23, 42, 0.9)' : 'rgba(255, 255, 255, 0.9)', 
                      backdropFilter: 'blur(8px)',
                      borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
                      borderRadius: '16px',
                      boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
                      color: isDark ? '#f8fafc' : '#0f172a'
                    }}
                    itemStyle={{ color: '#6366f1', fontWeight: '900', fontSize: '12px' }}
                  />
                  <Area type="monotone" dataKey="requests" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorRequests)" activeDot={{ r: 6, fill: '#6366f1', stroke: '#fff', strokeWidth: 2 }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* API KEY CARD */}
          {/* 🚀 FIX: Added 'h-fit' and changed to 'justify-start' so the card stops stretching to match the chart's massive height on desktop! */}
          <div className="glass-card p-6 md:p-8 rounded-[2rem] flex flex-col justify-start shadow-xl overflow-hidden h-fit">
            {/* 🚀 FIX: Simplified word from "Authentication Key" to "Your API Key" */}
            <h2 className="text-sm font-black uppercase tracking-widest mb-6 flex items-center gap-2 text-slate-900 dark:text-white">
              <KeyIcon className="w-5 h-5 text-emerald-500" /> Your API Key
            </h2>
            
            {loading ? (
              <div className="flex justify-center py-8">
                <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : apiKeyData ? (
              <div className="w-full">
                <p className="text-slate-500 text-xs font-black uppercase tracking-widest mb-3">Active Secret Key</p>
                {/* 🚀 FIX: Added gap-3, truncate, and shrink-0 to perfectly contain the text on mobile */}
                <div className="p-4 rounded-2xl font-mono text-sm tracking-wider flex items-center justify-between gap-3 glass-input mb-5 border border-black/5 dark:border-white/5 w-full">
                  <span className="opacity-80 font-bold text-slate-700 dark:text-slate-300 truncate min-w-0 block">{maskKey(apiKeyData.key_string)}</span>
                  <button onClick={() => copyToClipboard(apiKeyData.key_string)} className="shrink-0 text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 transition-colors" title="Copy Full Key">
                    <ClipboardDocumentIcon className="w-5 h-5" />
                  </button>
                </div>
                {/* 🚀 FIX: Simplified word from "Revoke Key" to "Delete Key" */}
                <button onClick={deleteKey} className="text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-lg bg-rose-500/10 text-rose-600 dark:text-rose-400 hover:bg-rose-500 hover:text-white flex items-center gap-1.5 transition-all w-max">
                  <TrashIcon className="w-4 h-4" /> Delete Key
                </button>
              </div>
            ) : (
              <div>
                <p className="text-slate-600 dark:text-slate-400 text-sm font-medium leading-relaxed mb-6">You do not have an active API key. Generate one to authenticate your external requests.</p>
                <button onClick={generateNewKey} className="w-full bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-4 rounded-[1.5rem] text-xs font-black uppercase tracking-widest transition-all shadow-lg hover:shadow-emerald-500/25 flex items-center justify-center gap-2">
                  <KeyIcon className="w-5 h-5" /> Generate Secret Key
                </button>
              </div>
            )}
          </div>
        </div>

        {/* INSTRUCTIONS & CODE SNIPPETS */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="glass-card p-6 md:p-8 rounded-[2rem] lg:col-span-1 shadow-xl">
             <h3 className="text-sm font-black uppercase tracking-widest mb-5 flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
               <ShieldCheckIcon className="w-5 h-5" /> Integration Guide
             </h3>
             <div className="space-y-5 text-sm font-medium leading-relaxed text-slate-700 dark:text-slate-300">
                <div>
                  {/* 🚀 FIX: Simplified from "Authentication" to "Connecting" */}
                  <p className="font-black text-xs uppercase tracking-widest text-slate-900 dark:text-white mb-1">1. Connecting</p>
                  <p className="text-slate-500">Include your API key in the headers using <code className="glass-input px-1.5 py-0.5 rounded-md font-mono text-[11px] text-indigo-500 font-bold">X-Xist-API-Key</code>.</p>
                </div>
                <div>
                  <p className="font-black text-xs uppercase tracking-widest text-slate-900 dark:text-white mb-1">2. Formatting</p>
                  <p className="text-slate-500">Send data as JSON. Specify <code className="glass-input px-1.5 py-0.5 rounded-md font-mono text-[11px] text-indigo-500 font-bold">mode</code> (text, url) and the target content.</p>
                </div>
                <div>
                  <p className="font-black text-xs uppercase tracking-widest text-slate-900 dark:text-white mb-1">3. The Response</p>
                  <p className="text-slate-500">We return a JSON object with the Scam Risk Score, Verdict, and Diagnostic Summary.</p>
                </div>
             </div>
          </div>

          <div className="glass-card p-6 md:p-8 rounded-[2rem] lg:col-span-2 flex flex-col shadow-xl">
             <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
               <h3 className="text-sm font-black uppercase tracking-widest flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
                 <CommandLineIcon className="w-5 h-5" /> Code Snippets
               </h3>
               <div className="flex p-1 rounded-xl glass-input overflow-x-auto no-scrollbar">
                 {['curl', 'powershell', 'python', 'javascript'].map(lang => (
                   <button 
                     key={lang} onClick={() => setActiveTab(lang)}
                     className={`px-4 py-2 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all ${activeTab === lang ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'}`}
                   >
                     {lang === 'curl' ? 'cURL' : lang === 'powershell' ? 'P-Shell' : lang}
                   </button>
                 ))}
               </div>
             </div>
             <div className="relative glass-input border border-black/5 dark:border-white/5 p-5 rounded-2xl flex-grow overflow-hidden group shadow-inner">
                <button onClick={() => copyToClipboard(codeSnippets[activeTab])} className="absolute top-3 right-3 bg-white dark:bg-slate-800 border border-black/10 dark:border-white/10 text-slate-700 dark:text-slate-300 p-2.5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity hover:text-indigo-600 dark:hover:text-indigo-400 shadow-lg" title="Copy Code">
                  <ClipboardDocumentIcon className="w-4 h-4" />
                </button>
                <pre className="font-mono text-xs md:text-sm text-slate-800 dark:text-indigo-200 overflow-x-auto whitespace-pre leading-relaxed custom-scrollbar h-full font-medium">
                  {codeSnippets[activeTab]}
                </pre>
             </div>
          </div>
        </div>

        {/* 🚀 PRICING & PLANS SECTION */}
        <div className="mt-8 pt-12 border-t border-black/5 dark:border-white/5">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-black mb-3 text-slate-900 dark:text-white tracking-tight">Scale your Security</h2>
            <p className="text-sm font-medium text-slate-500 mb-8 max-w-xl mx-auto">Upgrade to Premium Pro to remove API rate limits and unlock advanced forensic capabilities.</p>
            
            {/* Billing Toggle */}
            <div className="inline-flex items-center p-1.5 glass-card rounded-full border border-black/5 dark:border-white/5">
              <button onClick={() => setBillingCycle('monthly')} className={`px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${billingCycle === 'monthly' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'}`}>
                Monthly
              </button>
              <button onClick={() => setBillingCycle('yearly')} className={`px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${billingCycle === 'yearly' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'}`}>
                Yearly <span className={`text-[9px] px-2 py-0.5 rounded-md ${billingCycle === 'yearly' ? 'bg-white/20 text-white' : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'}`}>SAVE 15%</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto items-stretch">
            
            {/* BASIC PLAN */}
            <div className="glass-card p-8 rounded-[2.5rem] flex flex-col shadow-xl">
              <div className="mb-8">
                <span className="glass-input text-slate-500 px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest border border-black/5 dark:border-white/5">Current Plan</span>
                <h3 className="text-2xl font-black mt-5 mb-2 text-slate-900 dark:text-white">Basic Protocol</h3>
                <div className="flex items-baseline gap-1 text-slate-900 dark:text-white">
                  <span className="text-4xl font-black">₹0</span>
                  <span className="text-slate-500 font-bold text-sm">/ forever</span>
                </div>
              </div>
              <ul className="space-y-4 mb-8 flex-grow">
                {['5 API Scans per day', 'Standard Threat Detection', 'Text & URL Analysis', 'Community Support'].map((feature, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm font-medium text-slate-700 dark:text-slate-300">
                    <CheckCircleIcon className="w-5 h-5 text-emerald-500 shrink-0" /> {feature}
                  </li>
                ))}
              </ul>
              <button disabled className="w-full py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest glass-input text-slate-400 cursor-not-allowed border border-black/5 dark:border-white/5">
                Active Plan
              </button>
            </div>

            {/* PREMIUM PLAN */}
            <div className="relative glass-card border-indigo-500/30 p-8 rounded-[2.5rem] flex flex-col shadow-[0_0_40px_rgba(99,102,241,0.15)] bg-gradient-to-b from-indigo-500/5 to-transparent">
              
              {/* Floating Badge */}
              <div className="absolute -top-4 right-6 z-20 bg-gradient-to-r from-amber-400 to-orange-500 text-white px-4 py-1.5 rounded-xl text-[9px] font-black tracking-widest uppercase flex items-center gap-1.5 shadow-xl">
                <SparklesIcon className="w-3.5 h-3.5" /> Most Popular
              </div>
              
              <div className="mb-8 mt-2">
                {/* 🚀 ANIMATED DYNAMIC HEADING */}
                <div className="h-8 mb-2 flex items-center">
                  <AnimatePresence mode="wait">
                    <motion.h3 
                      key={billingCycle}
                      initial={{ opacity: 0, y: 10 }} 
                      animate={{ opacity: 1, y: 0 }} 
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="text-2xl font-black text-slate-900 dark:text-white"
                    >
                      {billingCycle === 'monthly' ? 'Premium' : 'Premium Pro'}
                    </motion.h3>
                  </AnimatePresence>
                </div>
                
                <div className="h-16 flex items-center">
                  <AnimatePresence mode="wait">
                    {billingCycle === 'monthly' ? (
                      <motion.div key="monthly" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="flex items-baseline gap-1 text-slate-900 dark:text-white">
                        <span className="text-4xl font-black">₹99</span>
                        <span className="text-slate-500 font-bold text-sm">/ month</span>
                      </motion.div>
                    ) : (
                      <motion.div key="yearly" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="flex items-center gap-4">
                        <div className="flex items-baseline gap-1 text-slate-900 dark:text-white">
                          <span className="text-4xl font-black text-indigo-600 dark:text-indigo-400">₹999</span>
                          <span className="text-slate-500 font-bold text-sm">/ year</span>
                        </div>
                        
                        {/* 🚀 ANIMATED E-COMMERCE DISCOUNT BADGE */}
                        <div className="flex flex-col items-start bg-emerald-500/10 px-3 py-1.5 rounded-lg border border-emerald-500/20 relative overflow-hidden">
                          {/* E-commerce style shine sweep */}
                          <motion.div 
                            animate={{ x: ['-100%', '200%'] }} 
                            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut", repeatDelay: 3 }} 
                            className="absolute inset-0 bg-gradient-to-r from-transparent via-emerald-400/20 to-transparent -skew-x-12 z-0" 
                          />
                          
                          <div className="relative inline-block mb-0.5 z-10 mt-0.5">
                            <span className="text-slate-500 dark:text-slate-400 text-xs font-bold tracking-wider">₹1200</span>
                            {/* The dynamic red slash that draws itself */}
                            <motion.span 
                              initial={{ width: 0, opacity: 0 }} 
                              animate={{ width: '110%', opacity: 1 }} 
                              transition={{ duration: 0.4, ease: "easeOut", delay: 0.2 }}
                              className="absolute left-[-5%] top-1/2 h-[2px] bg-rose-500 dark:bg-rose-400 origin-left -translate-y-1/2 -rotate-6"
                            />
                          </div>
                          
                          <motion.span 
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ type: "spring", stiffness: 400, damping: 10, delay: 0.5 }}
                            className="text-[10px] font-black uppercase tracking-widest text-emerald-600 dark:text-emerald-400 flex items-center z-10"
                          >
                             <ArrowTrendingDownIcon className="w-3 h-3 mr-1" /> Drop
                          </motion.span>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
              
              <ul className="space-y-4 mb-8 flex-grow">
                {['Unlimited API Scans', 'Deepfake Video Forensics', 'Priority 24/7 Support', 'Zero Rate Limits'].map((feature, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm font-medium text-slate-700 dark:text-slate-300">
                    <CheckCircleIcon className="w-5 h-5 text-indigo-500 dark:text-indigo-400 shrink-0" /> {feature}
                  </li>
                ))}
              </ul>
              
              {/* 🚀 FIX: Now correctly calls your handleUpgradeCheckout function */}
              <button onClick={handleUpgradeCheckout} className="w-full py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest bg-indigo-600 hover:bg-indigo-500 text-white transition-all shadow-lg hover:shadow-indigo-500/25 active:scale-95 flex justify-center items-center gap-2">
                <span>Upgrade Access</span>
              </button>
            </div>
          </div>
        </div>

      </div>

      {/* ONE-TIME SECURITY MODAL */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowModal(false)} />
            <motion.div initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="glass-card p-8 rounded-[2.5rem] shadow-2xl relative z-10 max-w-lg w-full text-center border border-black/10 dark:border-white/10"
            >
              <div className="w-16 h-16 bg-amber-500/10 border border-amber-500/30 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-inner">
                <ExclamationTriangleIcon className="w-8 h-8 text-amber-500" />
              </div>
              <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-2 tracking-tight">Save your Secret Key</h2>
              <p className="text-slate-500 text-sm mb-8 font-medium leading-relaxed">
                Please copy this key and store it securely. For your protection, <strong>you will not be able to view it again</strong> once you close this window.
              </p>
              
              <div className="glass-input border border-black/10 dark:border-white/10 p-4 rounded-2xl flex items-center justify-between gap-4 mb-8 shadow-inner">
                <span className="font-mono text-indigo-600 dark:text-indigo-400 text-sm tracking-wider break-all text-left font-bold">{freshKey}</span>
                <button onClick={() => copyToClipboard(freshKey)} className="text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors bg-white dark:bg-slate-800 p-2.5 rounded-xl border border-black/5 dark:border-white/5 shadow-sm shrink-0 hover:scale-105 active:scale-95">
                  <ClipboardDocumentIcon className="w-5 h-5" />
                </button>
              </div>

              <button onClick={() => setShowModal(false)} className="w-full bg-indigo-600 hover:bg-indigo-500 text-white text-[10px] font-black uppercase tracking-widest py-4 rounded-2xl transition-all shadow-lg active:scale-95">
                I've copied it safely
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}