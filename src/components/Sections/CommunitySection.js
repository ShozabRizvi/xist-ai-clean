import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import {
  ChatBubbleLeftRightIcon, CheckCircleIcon, ShareIcon, 
  HeartIcon, ShieldCheckIcon, ArrowPathIcon, TrashIcon, 
  UserCircleIcon, ChartBarIcon, FunnelIcon, MicrophoneIcon,
  VideoCameraIcon, PhotoIcon, SpeakerWaveIcon, SunIcon, MoonIcon,
  PaperAirplaneIcon, PlusCircleIcon, DocumentPlusIcon,
  UserGroupIcon, CpuChipIcon, FingerPrintIcon, EyeIcon, FireIcon, CodeBracketIcon,XMarkIcon
} from '@heroicons/react/24/outline'; 
import { supabase } from '../../lib/supabase';

// ==============================
// TACTICAL AVATAR MAP
// ==============================
const AVATAR_MAP = {
  ghost: UserCircleIcon,
  shield: ShieldCheckIcon,
  chip: CpuChipIcon,
  fingerprint: FingerPrintIcon,
  eye: EyeIcon,
  fire: FireIcon,
  code: CodeBracketIcon
};

const TacticalAvatar = ({ identifier }) => {
  if (identifier && AVATAR_MAP[identifier]) {
    const Icon = AVATAR_MAP[identifier];
    return <Icon className="w-full h-full p-1 text-indigo-400" />;
  }
  if (identifier && identifier.startsWith('http')) {
    return <img src={identifier} className="w-full h-full object-cover" alt="Operative" />;
  }
  return <UserCircleIcon className="w-5 h-5 text-slate-500" />;
};

// ==============================
// UTILITY FUNCTIONS
// ==============================
const timeAgo = (utcDateStr) => {
  if (!utcDateStr) return 'Just now';
  const safeStr = utcDateStr.endsWith('Z') || utcDateStr.includes('+') ? utcDateStr : `${utcDateStr}Z`;
  const date = new Date(safeStr);
  const now = new Date();
  const seconds = Math.max(0, Math.round((now - date) / 1000));
  const minutes = Math.round(seconds / 60);
  const hours = Math.round(minutes / 60);
  if (seconds < 60) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
};

// ==============================
// UTILITY FUNCTIONS
// ==============================

// Your existing typewriter effect (used for the top header)
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

// ✅ NEW: 2026 CYBER DECODING ANIMATION (used for modal titles & classifications)
const DecodedText = ({ text }) => {
  const [display, setDisplay] = useState(text);
  
  useEffect(() => {
    let iteration = 0;
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
    
    const interval = setInterval(() => {
      setDisplay(text.split("").map((char, index) => {
        if (index < iteration) return text[index];
        return letters[Math.floor(Math.random() * 42)];
      }).join(""));
      
      if (iteration >= text.length) clearInterval(interval);
      
      // The speed of the reveal. Change to 1/2 for faster, 1/4 for slower.
      iteration += 1 / 3; 
    }, 30);
    
    return () => clearInterval(interval);
  }, [text]);

  return <span>{display}</span>;
};

// ==============================
// THEMES
// ==============================
const THEMES = {
  dark: {
    background: 'bg-slate-950',
    headerBg: 'bg-[#020617]',
    card: 'bg-slate-900 border-slate-800 shadow-2xl',
    inner: 'bg-slate-950 border-slate-800',
    textPrimary: 'text-slate-100',
    textSecondary: 'text-slate-400',
    muted: 'text-slate-500',
    input: 'bg-slate-950 border-slate-800 text-white placeholder-slate-600 focus:border-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.05)]'
  },
  light: {
    background: 'bg-slate-50',
    headerBg: 'bg-white/90 backdrop-blur-md',
    card: 'bg-white border-slate-200 shadow-xl',
    inner: 'bg-slate-100 border-slate-200',
    textPrimary: 'text-slate-900',
    textSecondary: 'text-slate-600',
    muted: 'text-slate-400',
    input: 'bg-white border-slate-200 text-slate-900 placeholder-slate-400 focus:border-indigo-500 shadow-sm'
  }
};

const CommunitySection = ({ user, theme: globalTheme }) => {
 const isDark = globalTheme === 'dark';
  const theme = THEMES[isDark ? 'dark' : 'light'];
  const typingTitle = useTypewriter("Global Threat Matrix", 80, 200);

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isPublishing, setIsPublishing] = useState(false);
  const [newPost, setNewPost] = useState({ title: '', description: '', threat_type: 'deepfake' });
  const [filter, setFilter] = useState('all');
  const [selectedThreat, setSelectedThreat] = useState(null); 
  const [profileData, setProfileData] = useState(null); 

  // ✅ LOAD LOCAL IDENTITY STATE
  const [localIdentity, setLocalIdentity] = useState({ alias: 'UNKNOWN_OPERATOR', avatar: 'ghost' });
  
  useEffect(() => {
    const saved = localStorage.getItem('xist_operator_identity');
    if (saved) {
      setLocalIdentity(JSON.parse(saved));
    }
  }, []);

  // ✅ Tactical Authorization Check
  // ✅ Tactical Authorization Check
  const currentUserId = user?.id || user?.uid;
  
  // Replace the placeholder below with your actual Supabase UUID copied from the dashboard
  const DEVELOPER_UUID = 'PASTE_YOUR_COPIED_UUID_HERE'; 
  
  const isDeveloperNode = 
    (user?.email && user.email.toLowerCase() === 'rshozab64@gmail.com') || 
    currentUserId === DEVELOPER_UUID;

  const loadPosts = useCallback(async () => {
    setLoading(true);
    try {
      const { data: threatsData, error } = await supabase
        .from('community_threats')
        .select(`*, threat_likes(user_id), profiles(username, avatar_url)`)
        .order('created_at', { ascending: false });

      if (error) throw error;
      const formattedData = threatsData.map(threat => ({
        ...threat,
        likes_count: threat.threat_likes?.length || 0,
        user_liked: threat.threat_likes?.some(like => like.user_id === currentUserId) 
      }));
      setPosts(formattedData || []);
    } catch (error) { toast.error('Intelligence sync error'); } finally { setLoading(false); }
  }, [currentUserId]);

  useEffect(() => {
    loadPosts();
    const channel = supabase.channel('community_realtime').on('postgres_changes', { event: '*', schema: 'public', table: 'community_threats' }, loadPosts).subscribe();
    return () => supabase.removeChannel(channel);
  }, [loadPosts]);

  const handlePost = async () => {
    if (!newPost.title.trim() || !newPost.description.trim()) return toast.error('Dossier incomplete');
    
    setIsPublishing(true);
    try {
      // 1. SYNC IDENTITY TO SUPABASE SO OTHERS SEE IT
      if (currentUserId) {
        await supabase.from('profiles').upsert({
          id: currentUserId,
          username: localIdentity.alias,
          avatar_url: localIdentity.avatar,
          updated_at: new Date().toISOString()
        });
      }

      // 2. BROADCAST THREAT
      const { error } = await supabase.from('community_threats').insert({
        user_id: currentUserId, title: newPost.title, description: newPost.description,
        threat_type: newPost.threat_type, location: 'Global AI Network'
      });
      if (error) throw error;
      
      setNewPost({ title: '', description: '', threat_type: 'deepfake' });
      toast.success('Dossier Broadcasted');
      loadPosts();
    } catch (error) { toast.error('Broadcast failed'); } finally { setIsPublishing(false); }
  };

  // ✅ REDACTION PROTOCOL (Delete logic)
  const handleDeletePost = async (threatId, e) => {
    if (e) e.stopPropagation();
    if (!window.confirm("Are you sure you want to permanently redact this dossier?")) return;

    try {
      const { error } = await supabase.from('community_threats').delete().eq('id', threatId);
      if (error) throw error;
      
      toast.success('Dossier Redacted');
      if (selectedThreat?.id === threatId) setSelectedThreat(null);
      loadPosts();
    } catch (error) {
      toast.error('Failed to redact dossier.');
    }
  };

  const openUserProfile = async (targetUserId, targetProfile, e) => {
    if (e) e.stopPropagation(); 
    setProfileData({ userId: targetUserId, loading: true });
    try {
      const { data: userPosts } = await supabase.from('community_threats').select('*, threat_likes(user_id)').eq('user_id', targetUserId);
      const totalLikes = userPosts.reduce((sum, post) => sum + (post.threat_likes?.length || 0), 0);
      setProfileData({
        userId: targetUserId, username: targetProfile?.username || `Agent-${targetUserId?.substring(0,4).toUpperCase()}`,
        avatarUrl: targetProfile?.avatar_url, totalLikes, postCount: userPosts.length, loading: false
      });
    } catch (err) { setProfileData(null); }
  };

  // ✅ FIX: Keeps the modal UI instantly synced when you click 'Like'
  useEffect(() => {
    if (selectedThreat) {
      const freshData = posts.find(p => p.id === selectedThreat.id);
      if (freshData) setSelectedThreat(freshData);
    }
  }, [posts]);
  
  const handleLike = async (threatId, e) => {
    if (e) e.stopPropagation();
    if (!currentUserId) return toast.error('Authentication required');
    const { data: existing } = await supabase.from('threat_likes').select('*').eq('threat_id', threatId).eq('user_id', currentUserId).maybeSingle(); 
    if (existing) {
      await supabase.from('threat_likes').delete().eq('threat_id', threatId).eq('user_id', currentUserId);
    } else {
      await supabase.from('threat_likes').insert({ threat_id: threatId, user_id: currentUserId });
    }
    loadPosts();
  };

  const RenderForensicMedia = ({ url, className = "" }) => {
    if (!url) return null;
    const isImage = url.match(/\.(jpeg|jpg|gif|png|webp)$/i);
    const isVideo = url.match(/\.(mp4|webm|ogg|mov)$/i);
    if (isImage) return <img src={url} className={`w-full object-contain ${className}`} alt="Evidence" />;
    if (isVideo) return <video src={url} className={`w-full ${className}`} controls autoPlay muted loop />;
    return (
      <div className="w-full p-8 flex flex-col items-center justify-center bg-slate-950/50 rounded-xl border border-white/5">
        <MicrophoneIcon className="w-12 h-12 text-indigo-400 mb-4 animate-pulse" />
        <audio src={url} controls className="w-full max-w-xs" />
      </div>
    );
  };

  // ✅ NATIVE SHARE PROTOCOL
  const handleShare = async (threat, e) => {
    if (e) e.stopPropagation();

    const shareData = {
      title: `XIST Alert: ${threat.threat_type.toUpperCase()}`,
      text: `Review this threat dossier: "${threat.title}" on the Global Threat Matrix.`,
      url: window.location.href, // Shares the current app URL
    };

    if (navigator.share && navigator.canShare(shareData)) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        // Ignore AbortError (this happens when a user opens the share menu but cancels)
        if (err.name !== 'AbortError') {
          fallbackCopy(shareData.url);
        }
      }
    } else {
      // Fallback for desktop or unsupported environments
      fallbackCopy(shareData.url);
    }
  };

  const fallbackCopy = (text) => {
    navigator.clipboard.writeText(text)
      .then(() => toast.success('Link copied to clipboard'))
      .catch(() => toast.error('Failed to copy link'));
  };

  const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } };
  const itemVariants = { hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 100 } } };

  const filteredPosts = posts.filter(post => {
    if (filter === 'all') return true;
    if (filter === 'verified') return post.is_verified === true;
    return post.threat_type === filter;
  });

  return (
    <motion.div initial="hidden" animate="visible" variants={containerVariants}
                className={`w-full min-h-screen transition-colors duration-500 ${theme.background} ${theme.textPrimary} relative overflow-x-hidden`}
                style={{ marginLeft: '280px', marginTop: '64px', fontFamily: 'Inter, system-ui, sans-serif' }}>
      
      {/* ADAPTIVE GRID BACKGROUND */}
      <div className={`absolute inset-0 pointer-events-none opacity-[0.03] ${isDark ? '' : 'invert'}`} 
           style={{ backgroundImage: 'linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>

      {/* HEADER SECTION */}
      <div className={`border-b sticky top-0 z-30 px-8 py-6 transition-all ${theme.headerBg} ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black tracking-tight flex items-center gap-2">
              <UserGroupIcon className="w-7 h-7 text-indigo-500" /> 
              <span>{typingTitle}</span>
              <motion.span animate={{ opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 0.8 }} className="w-1.5 h-7 bg-indigo-500 inline-block ml-1" />
            </h1>
            <p className={`${theme.muted} text-xs uppercase tracking-widest font-bold mt-1`}>OSINT Intelligence Feed</p>
          </div>
          {/* ========================================= */}
          {/* 📱 SURGICAL FILTER REPLACEMENT START        */}
          {/* ========================================= */}
          <div className="w-full sm:w-auto">
            
            {/* 🖥️ DESKTOP VIEW: Full Button Row (Hidden on mobile) */}
            <div className="hidden md:flex items-center gap-2 overflow-x-auto hide-scrollbar pb-1">
              {['all', 'deepfake', 'misinfo', 'scam', 'malware', 'cyber_attack', 'verified'].map(f => (
                  <button key={f} onClick={() => setFilter(f)} 
                          className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap flex-shrink-0 ${
                            filter === f ? 'bg-indigo-600 text-white shadow-lg' : `${theme.inner} ${theme.textSecondary} hover:text-indigo-400`
                          }`}>
                    {f.replace('_', ' ')}
                  </button>
              ))}
            </div>

            {/* 📱 MOBILE VIEW: Compact Native Dropdown (Hidden on desktop) */}
            <div className="flex md:hidden items-center justify-end w-full">
              <div className="relative w-full sm:w-auto">
                <select 
                  value={filter} 
                  onChange={(e) => setFilter(e.target.value)}
                  className={`w-full appearance-none pl-4 pr-10 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest outline-none border shadow-sm transition-all cursor-pointer ${
                    isDark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-900'
                  } focus:border-indigo-500`}
                >
                  <option value="all">Filter: All Threats</option>
                  <option value="deepfake">Deepfake Media</option>
                  <option value="misinfo">Disinformation</option>
                  <option value="scam">Social Engineering</option>
                  <option value="malware">Malware Package</option>
                  <option value="cyber_attack">Network Intrusion</option>
                  <option value="verified">Verified Only</option>
                </select>
                <FunnelIcon className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-indigo-500" />
              </div>
            </div>

          </div>
          {/* ========================================= */}
          {/* 📱 SURGICAL FILTER REPLACEMENT END          */}
          {/* ========================================= */}
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-10">
        
        {/* 🚀 UPGRADED BROADCAST FORM (TACTICAL SUBMISSION TERMINAL) */}
        <motion.div variants={itemVariants} className="lg:col-span-4 space-y-6">
          <div className={`${theme.card} p-6 rounded-2xl relative overflow-hidden group/form`}>
            {/* Tactical Corner accents */}
            <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-indigo-500/50"></div>
            <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-indigo-500/50"></div>
            
            <div className="flex items-center justify-between mb-8">
              <h3 className={`text-[10px] font-black uppercase tracking-[0.3em] flex items-center gap-2 ${theme.textPrimary}`}>
                <DocumentPlusIcon className="w-4 h-4 text-indigo-500" /> Dossier_Injection
              </h3>
              <div className="flex gap-1">
                <div className="w-1 h-1 rounded-full bg-indigo-500 animate-ping"></div>
                <div className="w-1 h-1 rounded-full bg-indigo-500/50"></div>
              </div>
            </div>

            <div className="space-y-5">
              <motion.div initial={{ x: -10, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.4 }}>
                <label className="text-[9px] font-bold uppercase text-slate-500 mb-1.5 block ml-1 tracking-widest">Case_Title</label>
                <input value={newPost.title} onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                  placeholder="System Subject Identifier..." className={`w-full px-4 py-3 rounded-xl text-sm outline-none font-mono transition-all border-2 border-transparent ${theme.input} focus:border-indigo-500/30`} />
              </motion.div>

              <motion.div initial={{ x: -10, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.5 }}>
                <label className="text-[9px] font-bold uppercase text-slate-500 mb-1.5 block ml-1 tracking-widest">Forensic_Body</label>
                <textarea value={newPost.description} onChange={(e) => setNewPost({ ...newPost, description: e.target.value })}
                  placeholder="Analyze and describe the threat vector..." rows={5} className={`w-full px-4 py-3 rounded-xl text-sm resize-none outline-none font-medium transition-all border-2 border-transparent ${theme.input} focus:border-indigo-500/30`} />
              </motion.div>

              <motion.div initial={{ x: -10, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.6 }}>
                <label className="text-[9px] font-bold uppercase text-slate-500 mb-1.5 block ml-1 tracking-widest">Threat_Classification</label>
                <div className="relative">
                  <select value={newPost.threat_type} onChange={(e) => setNewPost({ ...newPost, threat_type: e.target.value })}
                    className={`w-full px-4 py-3 rounded-xl text-xs outline-none font-black uppercase tracking-widest appearance-none border-2 border-transparent ${theme.input} focus:border-indigo-500/30 cursor-pointer`}>
                    <option value="deepfake">Deepfake_Media</option>
                    <option value="misinfo">Disinformation</option>
                    <option value="scam">Social_Engineering</option>
                    <option value="malware">Malware_Package</option>
                    <option value="cyber_attack">Network_Intrusion</option>
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none opacity-50"><FunnelIcon className="w-3 h-3" /></div>
                </div>
              </motion.div>
            </div>

            <button onClick={handlePost} disabled={isPublishing} className="w-full mt-8 group/btn relative overflow-hidden bg-indigo-600 hover:bg-indigo-500 py-4 rounded-xl transition-all shadow-xl shadow-indigo-500/20 active:scale-[0.98]">
              <AnimatePresence mode="wait">
                {isPublishing ? (
                  <motion.div initial={{ y: 10 }} animate={{ y: 0 }} exit={{ y: -10 }} className="flex items-center justify-center gap-2">
                    <ArrowPathIcon className="w-4 h-4 animate-spin text-white" />
                    <span className="text-[10px] font-black text-white uppercase tracking-[0.2em]">Uploading...</span>
                  </motion.div>
                ) : (
                  <motion.div initial={{ y: 10 }} animate={{ y: 0 }} exit={{ y: -10 }} className="flex items-center justify-center gap-2">
                    <PaperAirplaneIcon className="w-4 h-4 text-white group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
                    <span className="text-[10px] font-black text-white uppercase tracking-[0.2em]">Engage Broadcast</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </button>
            <div className="mt-4 text-center">
              <span className="text-[8px] font-mono text-slate-600 uppercase tracking-widest">Protocol 7-X // Secure Node Transmission</span>
            </div>
          </div>
        </motion.div>

        {/* RIGHT COLUMN: FEED */}
        <motion.div variants={itemVariants} className="lg:col-span-8">
          {loading ? ( <div className="flex justify-center py-24"><ArrowPathIcon className="w-8 h-8 text-indigo-500 animate-spin" /></div> ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredPosts.map((threat) => (
                <motion.div key={threat.id} layout onClick={() => setSelectedThreat(threat)}
                     className={`${theme.card} p-6 cursor-pointer group flex flex-col h-72 relative overflow-hidden transition-all hover:border-indigo-500/50 rounded-2xl`}>
                  
                  {/* DYNAMIC MEDIA PREVIEW ON HOVER */}
                  {threat.media_url && (
                    <div className="absolute inset-0 z-0 opacity-0 group-hover:opacity-[0.12] transition-opacity duration-500 pointer-events-none">
                      <RenderForensicMedia url={threat.media_url} className="h-full object-cover grayscale" />
                    </div>
                  )}

                  <div className="flex items-start justify-between mb-4 z-10">
  <div onClick={(e) => openUserProfile(threat.user_id, threat.profiles, e)} className="flex items-center gap-2 group-hover:bg-indigo-500/10 p-1.5 -ml-1.5 rounded-xl transition-all">
    
    {/* ✅ FIX: Centered container for tactical icons */}
    <div className="w-7 h-7 rounded-full overflow-hidden shrink-0 border border-slate-700 bg-slate-800 flex items-center justify-center">
      <TacticalAvatar identifier={threat.user_id === currentUserId ? localIdentity.avatar : threat.profiles?.avatar_url} />
    </div>
    
    {/* ✅ FIX: Show local alias if it's the current user, otherwise show database name */}
    <span className="text-[10px] font-black text-slate-400 group-hover:text-indigo-400 uppercase tracking-tighter">
      {threat.user_id === currentUserId 
        ? localIdentity.alias 
        : (threat.profiles?.username || `AGENT-${threat.user_id?.substring(0,4).toUpperCase()}`)}
    </span>

  </div>
  <span className="text-[10px] text-slate-500 font-mono font-bold tracking-tighter">{timeAgo(threat.created_at)}</span>
</div>

                  <div className="z-10 flex-grow">
                    <div className="flex items-center gap-2 mb-3">
                      <span className={`px-2.5 py-1 rounded text-[9px] font-black uppercase tracking-widest border ${
                        threat.threat_type === 'deepfake' ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' :
                        threat.threat_type === 'scam' ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' : 
                        'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'}`}>
                        {threat.threat_type}
                      </span>
                      {threat.is_verified && <span className="flex items-center gap-1 text-emerald-400 text-[9px] font-black uppercase tracking-widest bg-emerald-500/10 px-2 py-1 rounded border border-emerald-500/20"><CheckCircleIcon className="w-3 h-3" /> VERIFIED</span>}
                    </div>
                    <h3 className={`text-base font-black mb-2 line-clamp-2 leading-tight ${theme.textPrimary}`}>{threat.title}</h3>
                    <p className={`text-xs line-clamp-3 leading-relaxed font-medium ${theme.textSecondary}`}>{threat.description}</p>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t z-10 border-slate-800/50 mt-2">
                    <div className="flex items-center gap-4">
                      <button onClick={(e) => handleLike(threat.id, e)} className={`flex items-center gap-1.5 text-[10px] font-black transition-all ${threat.user_liked ? 'text-rose-500' : 'text-slate-500 hover:text-rose-400'}`}>
                        <HeartIcon className={`w-4 h-4 ${threat.user_liked ? 'fill-rose-500' : ''}`} /> {threat.likes_count}
                      </button>
                      <button 
    onClick={(e) => handleShare(threat, e)} 
    className="text-slate-500 hover:text-indigo-400 transition-colors"
    title="Share Dossier"
  >
    <ShareIcon className="w-4 h-4" />
  </button>
                      
                      {/* ✅ DELETE BUTTON FOR AUTHOR OR DEVELOPER */}
                      {(threat.user_id === currentUserId || isDeveloperNode) && (
                         <button 
                           onClick={(e) => handleDeletePost(threat.id, e)} 
                           className="text-slate-500 hover:text-rose-500 transition-colors"
                           title={isDeveloperNode && threat.user_id !== currentUserId ? "Developer Override" : "Redact Dossier"}
                         >
                           <TrashIcon className="w-4 h-4" />
                         </button>
                      )}
                    </div>

                    {threat.media_url && <div className="text-[9px] font-black uppercase text-indigo-500 tracking-widest flex items-center gap-1"><ChartBarIcon className="w-3 h-3" /> EVIDENCE_LOCKED</div>}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>

      {/* ========================================= */}
      {/* 🚀 ELITE 2026 CYBER MODAL W/ ANIMATIONS     */}
      {/* ========================================= */}
      <AnimatePresence>
        {selectedThreat && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-3 sm:p-4">
            
            {/* Smooth Backdrop Fade */}
            <motion.div 
              initial={{ opacity: 0, backdropFilter: "blur(0px)" }} 
              animate={{ opacity: 1, backdropFilter: "blur(12px)" }} 
              exit={{ opacity: 0, backdropFilter: "blur(0px)" }} 
              transition={{ duration: 0.3 }}
              onClick={() => setSelectedThreat(null)} 
              className={`absolute inset-0 ${isDark ? 'bg-[#020617]/80' : 'bg-slate-900/40'}`} 
            />
            
            {/* Snappy Spring-Loaded Modal Container */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 40, rotateX: 5 }} 
              animate={{ opacity: 1, scale: 1, y: 0, rotateX: 0 }} 
              exit={{ opacity: 0, scale: 0.95, y: 20 }} 
              transition={{ type: 'spring', damping: 20, stiffness: 350, mass: 0.8 }} 
              className={`relative w-full max-w-xl max-h-[85vh] md:max-h-[80vh] flex flex-col z-10 rounded-2xl shadow-2xl overflow-hidden border ${isDark ? 'bg-slate-950 border-slate-700/50 shadow-[0_0_50px_rgba(99,102,241,0.15)]' : 'bg-white border-slate-200 shadow-[0_0_40px_rgba(0,0,0,0.1)]'}`}
            >
              <div className={`absolute inset-0 pointer-events-none opacity-[0.02] ${isDark ? '' : 'invert'}`} style={{ backgroundImage: 'linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>
              
              {/* Header */}
              <div className={`px-4 py-3 md:px-5 md:py-3.5 border-b flex justify-between items-center sticky top-0 z-20 backdrop-blur-2xl ${isDark ? 'bg-slate-950/80 border-slate-800/80' : 'bg-white/80 border-slate-100'}`}>
                 <div className="flex items-center gap-2.5 cursor-pointer group" onClick={(e) => openUserProfile(selectedThreat.user_id, selectedThreat.profiles, e)}>
                   <div className="w-8 h-8 md:w-9 md:h-9 rounded-full overflow-hidden shrink-0 border border-slate-700 bg-slate-800 flex items-center justify-center transition-all group-hover:border-indigo-500 shadow-inner">
                     <TacticalAvatar identifier={selectedThreat.user_id === currentUserId ? localIdentity.avatar : selectedThreat.profiles?.avatar_url} />
                   </div>
                   <div>
                     <div className="text-[8px] font-black uppercase tracking-[0.2em] text-indigo-500 flex items-center gap-1.5 mb-0.5">
                        {/* ✅ ACTIVE NODE PULSE ANIMATION */}
                        <div className="relative flex h-1.5 w-1.5">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-indigo-500"></span>
                        </div>
                        Network Node
                     </div>
                     <div className={`text-xs md:text-sm font-black tracking-tight group-hover:text-indigo-400 transition-colors line-clamp-1 ${theme.textPrimary}`}>
                       {selectedThreat.user_id === currentUserId ? localIdentity.alias : (selectedThreat.profiles?.username || `AGENT-${selectedThreat.user_id?.substring(0,4).toUpperCase()}`)}
                     </div>
                   </div>
                 </div>

                 <div className="flex items-center gap-1.5">
                    {(selectedThreat.user_id === currentUserId || isDeveloperNode) && (
                       <button onClick={(e) => handleDeletePost(selectedThreat.id, e)} className="p-1.5 bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white rounded-lg transition-all" title="Redact">
                         <TrashIcon className="w-4 h-4" />
                       </button>
                    )}
                    <button onClick={() => setSelectedThreat(null)} className={`p-1.5 rounded-lg transition-all ${isDark ? 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}>
                      <XMarkIcon className="w-4 h-4 md:w-5 md:h-5" />
                    </button>
                 </div>
              </div>

              {/* Console Body */}
              <div className="flex-grow overflow-y-auto p-4 md:p-6 custom-scrollbar relative z-10">
                
                {/* ✅ DECODING ANIMATION ON TITLE */}
                <h2 className={`text-lg md:text-xl font-black mb-4 leading-tight tracking-tighter ${theme.textPrimary}`}>
                  <DecodedText text={selectedThreat.title} />
                </h2>

                <div className="flex flex-wrap md:flex-nowrap gap-2 mb-5">
                   <div className={`flex-1 min-w-[90px] p-2.5 rounded-xl border flex flex-col items-start relative overflow-hidden ${isDark ? 'bg-slate-900/50 border-slate-800/80 shadow-inner' : 'bg-slate-50 border-slate-200 shadow-sm'}`}>
                      <div className="absolute top-0 right-0 w-6 h-6 bg-rose-500/10 rounded-bl-full"></div>
                      <span className="text-[7px] md:text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">Class</span>
                      {/* ✅ DECODING ANIMATION ON CLASSIFICATION */}
                      <span className={`text-[9px] md:text-[10px] font-mono font-bold uppercase line-clamp-1 ${selectedThreat.threat_type === 'safe' ? 'text-emerald-500' : 'text-rose-500'}`}>
                         <DecodedText text={selectedThreat.threat_type.replace('_', ' ').toUpperCase()} />
                      </span>
                   </div>
                   <div className={`flex-1 min-w-[90px] p-2.5 rounded-xl border flex flex-col items-start relative overflow-hidden ${isDark ? 'bg-slate-900/50 border-slate-800/80 shadow-inner' : 'bg-slate-50 border-slate-200 shadow-sm'}`}>
                      <div className="absolute top-0 right-0 w-6 h-6 bg-indigo-500/10 rounded-bl-full"></div>
                      <span className="text-[7px] md:text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">Timestamp</span>
                      <span className={`text-[9px] md:text-[10px] font-mono font-bold uppercase line-clamp-1 ${theme.textPrimary}`}>{timeAgo(selectedThreat.created_at)}</span>
                   </div>
                   <div className={`flex-1 min-w-[90px] p-2.5 rounded-xl border flex flex-col items-start relative overflow-hidden ${isDark ? 'bg-slate-900/50 border-slate-800/80 shadow-inner' : 'bg-slate-50 border-slate-200 shadow-sm'}`}>
                      <div className="absolute top-0 right-0 w-6 h-6 bg-emerald-500/10 rounded-bl-full"></div>
                      <span className="text-[7px] md:text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">Integrity</span>
                      {selectedThreat.is_verified ? (
                         <span className="text-[9px] md:text-[10px] font-mono font-bold uppercase text-emerald-500 flex items-center gap-1"><CheckCircleIcon className="w-3 h-3"/> Verified</span>
                      ) : (
                         <span className="text-[9px] md:text-[10px] font-mono font-bold uppercase text-yellow-500 flex items-center gap-1"><ArrowPathIcon className="w-3 h-3 animate-spin-slow"/> Scanning</span>
                      )}
                   </div>
                </div>
                
                {selectedThreat.media_url && (
                  <div className="mb-5 rounded-xl overflow-hidden border border-slate-800 bg-black flex items-center justify-center shadow-lg relative">
                    <div className="absolute top-2 right-2 px-1.5 py-0.5 bg-black/60 backdrop-blur-md rounded text-[7px] font-mono text-white tracking-widest border border-white/10 z-10">EVIDENCE</div>
                    <RenderForensicMedia url={selectedThreat.media_url} className="max-h-[160px] md:max-h-[220px] object-contain opacity-90 hover:opacity-100 transition-opacity" />
                  </div>
                )}
                
                <div className="relative">
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-500 rounded-l-lg"></div>
                  <div className={`pl-4 pr-3 py-3 md:pl-5 md:pr-4 md:py-4 rounded-r-lg md:rounded-r-xl text-xs leading-relaxed whitespace-pre-wrap font-medium shadow-inner ${isDark ? 'bg-slate-900/80 text-slate-300 border border-slate-800 border-l-0' : 'bg-slate-50 text-slate-700 border border-slate-200 border-l-0'}`}>
                    <div className="text-[8px] md:text-[9px] font-black uppercase text-indigo-500 mb-2 tracking-widest flex items-center gap-1.5 pb-1.5">
                      <DocumentPlusIcon className="w-3 h-3" /> Final Analysis Dump
                    </div>
                    {selectedThreat.description}
                  </div>
                </div>

                <div className={`mt-5 pt-4 flex flex-wrap gap-2 items-center justify-between border-t ${isDark ? 'border-slate-800/80' : 'border-slate-200'}`}>
                   <button onClick={(e) => handleLike(selectedThreat.id, e)} className={`flex items-center gap-1.5 px-3 py-2 md:px-4 md:py-2.5 rounded-lg text-[10px] md:text-xs font-black uppercase tracking-widest transition-all ${selectedThreat.user_liked ? 'bg-rose-500 text-white shadow-[0_0_15px_rgba(225,29,72,0.4)]' : isDark ? 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-rose-400' : 'bg-slate-100 text-slate-600 hover:bg-rose-50 hover:text-rose-500'}`}>
                     <HeartIcon className={`w-3 h-3 md:w-4 md:h-4 ${selectedThreat.user_liked ? 'fill-white' : ''}`} /> 
                     {selectedThreat.likes_count} Impact
                   </button>
                   
                   <button onClick={(e) => handleShare(selectedThreat, e)} className={`flex items-center gap-1.5 px-3 py-2 md:px-4 md:py-2.5 rounded-lg text-[10px] md:text-xs font-black uppercase tracking-widest transition-all ${isDark ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/30 hover:bg-indigo-500 hover:text-white hover:shadow-[0_0_15px_rgba(99,102,241,0.4)]' : 'bg-indigo-50 text-indigo-600 border border-indigo-200 hover:bg-indigo-600 hover:text-white'}`}>
                     <ShareIcon className="w-3 h-3 md:w-4 md:h-4" /> Distribute
                   </button>
                </div>

              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ========================================= */}
      {/* 👤 MODERN OSINT PROFILE MODAL               */}
      {/* ========================================= */}
      <AnimatePresence>
        {profileData && (
          <div className="fixed inset-0 z-[999999] flex items-center justify-center p-4">
             {/* Backdrop */}
             <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setProfileData(null)} className={`absolute inset-0 backdrop-blur-md ${isDark ? 'bg-slate-950/70' : 'bg-slate-900/40'}`} />
             
             {/* Center Card */}
             <motion.div 
               initial={{ opacity: 0, scale: 0.9, y: 20 }} 
               animate={{ opacity: 1, scale: 1, y: 0 }} 
               exit={{ opacity: 0, scale: 0.9, y: 20 }}
               transition={{ type: 'spring', damping: 25, stiffness: 300 }}
               className={`${theme.card} p-8 max-w-sm w-full text-center relative z-10 rounded-[2rem] shadow-2xl overflow-hidden`}
             >
              {/* Close Button */}
              <button onClick={() => setProfileData(null)} className={`absolute top-4 right-4 p-2 rounded-full transition-all ${isDark ? 'bg-slate-800 text-slate-400 hover:text-white' : 'bg-slate-100 text-slate-500 hover:text-slate-900'}`}>
                <XMarkIcon className="w-4 h-4" />
              </button>

              {/* Profile Content */}
              <div className="w-24 h-24 mx-auto rounded-full overflow-hidden border-4 border-indigo-500/20 mb-5 flex items-center justify-center bg-slate-800/50 shadow-inner">
                {/* ✅ TacticalAvatar now properly handles icons vs images here too */}
                <TacticalAvatar identifier={profileData.avatarUrl} />
              </div>
              
              <h2 className={`text-2xl font-black tracking-tight mb-1 ${theme.textPrimary}`}>{profileData.username}</h2>
              <div className="text-[10px] font-black uppercase tracking-widest text-indigo-500 mb-8 flex items-center justify-center gap-1.5 bg-indigo-500/10 w-max mx-auto px-3 py-1 rounded-full border border-indigo-500/20">
                <ShieldCheckIcon className="w-3.5 h-3.5" /> Trusted Operative
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className={`${theme.inner} p-4 rounded-2xl border flex flex-col items-center justify-center transition-all hover:border-indigo-500/30`}>
                  <div className={`text-3xl font-black ${theme.textPrimary}`}>{profileData.postCount}</div>
                  <div className="text-[9px] text-slate-500 font-black uppercase tracking-widest mt-1">Dossiers</div>
                </div>
                <div className={`${theme.inner} p-4 rounded-2xl border flex flex-col items-center justify-center transition-all hover:border-indigo-500/30`}>
                  <div className={`text-3xl font-black ${theme.textPrimary}`}>{profileData.totalLikes}</div>
                  <div className="text-[9px] text-slate-500 font-black uppercase tracking-widest mt-1">Impact</div>
                </div>
              </div>
             </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default CommunitySection;