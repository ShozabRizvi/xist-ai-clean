import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import {
  ChatBubbleLeftRightIcon, CheckCircleIcon, ShareIcon, 
  HeartIcon, ShieldCheckIcon, ArrowPathIcon, TrashIcon, 
  UserCircleIcon, ChartBarIcon, FunnelIcon, MicrophoneIcon,
  VideoCameraIcon, PhotoIcon, SpeakerWaveIcon, SunIcon, MoonIcon,
  PaperAirplaneIcon, PlusCircleIcon, DocumentPlusIcon,
  UserGroupIcon, CpuChipIcon, FingerPrintIcon, EyeIcon, FireIcon, 
  CodeBracketIcon, XMarkIcon, EyeSlashIcon, MegaphoneIcon, ArrowUturnLeftIcon
} from '@heroicons/react/24/outline';
import { supabase } from '../../lib/supabase';

// ==============================
// AVATAR MAP
// ==============================
const AVATAR_MAP = {
  ghost: UserCircleIcon, shield: ShieldCheckIcon, chip: CpuChipIcon,
  fingerprint: FingerPrintIcon, eye: EyeIcon, fire: FireIcon, code: CodeBracketIcon
};

const TacticalAvatar = ({ identifier }) => {
  if (identifier && AVATAR_MAP[identifier]) {
    const Icon = AVATAR_MAP[identifier];
    return <Icon className="w-full h-full p-1 text-indigo-400" />;
  }
  if (identifier && typeof identifier === 'string' && identifier.startsWith('http')) {
    return <img src={identifier} className="w-full h-full object-cover" alt="User" />;
  }
  return <UserCircleIcon className="w-full h-full p-1 text-slate-500" />;
};

// ==============================
// UTILITY FUNCTIONS & EFFECTS
// ==============================
const timeAgo = (utcDateStr) => {
  if (!utcDateStr) return 'Just now';
  const safeStr = String(utcDateStr).endsWith('Z') || String(utcDateStr).includes('+') ? utcDateStr : `${utcDateStr}Z`;
  const date = new Date(safeStr);
  const now = new Date();
  const seconds = Math.max(0, Math.round((now - date) / 1000));
  if (seconds < 60) return 'Just now';
  if (seconds < 3600) return `${Math.round(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.round(seconds / 3600)}h ago`;
  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
};

const useTypewriter = (text, speed = 100, delay = 200) => {
  const [displayedText, setDisplayedText] = useState("");
  const [started, setStarted] = useState(false);
  useEffect(() => { const t = setTimeout(() => setStarted(true), delay); return () => clearTimeout(t); }, [delay]);
  useEffect(() => {
    if (!started) return;
    if (displayedText.length < text.length) {
      const t = setTimeout(() => setDisplayedText(text.slice(0, displayedText.length + 1)), speed);
      return () => clearTimeout(t);
    }
  }, [displayedText, text, speed, started]);
  return displayedText;
};

const DecodedText = ({ text }) => {
  const [display, setDisplay] = useState(text || '');
  useEffect(() => {
    if (!text) return;
    let iteration = 0;
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
    const interval = setInterval(() => {
      setDisplay(text.split("").map((char, index) => {
        if (index < iteration) return text[index];
        return letters[Math.floor(Math.random() * 42)];
      }).join(""));
      if (iteration >= text.length) clearInterval(interval);
      iteration += 1 / 3; 
    }, 30);
    return () => clearInterval(interval);
  }, [text]);
  return <span>{display}</span>;
};

const THEMES = {
  dark: { background: 'bg-[#020617]', headerBg: 'bg-[#020617]/90 backdrop-blur-md', card: 'bg-slate-900 border border-slate-800 shadow-xl', inner: 'bg-slate-950 border-slate-800', textPrimary: 'text-slate-100', textSecondary: 'text-slate-400', muted: 'text-slate-500' },
  light: { background: 'bg-slate-50', headerBg: 'bg-white/90 backdrop-blur-md', card: 'bg-white border border-slate-200 shadow-lg', inner: 'bg-slate-100 border-slate-200', textPrimary: 'text-slate-900', textSecondary: 'text-slate-600', muted: 'text-slate-400' }
};

export default function CommunitySection({ user, theme: globalTheme }) {
  const isDark = globalTheme === 'dark';
  const theme = THEMES[isDark ? 'dark' : 'light'];
  
  const typingTitle = useTypewriter("Community Feed", 80, 200);
  const endOfFeedRef = useRef(null);
  const inputRef = useRef(null);

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isPublishing, setIsPublishing] = useState(false);
  const [filter, setFilter] = useState('All');
  const [selectedThreat, setSelectedThreat] = useState(null); 
  const [profileData, setProfileData] = useState(null); 

  // ✅ CUSTOM MENU STATES
  const [showHeaderMenu, setShowHeaderMenu] = useState(false);
  const [showCategoryMenu, setShowCategoryMenu] = useState(false);

  const [localIdentity, setLocalIdentity] = useState({ alias: 'USER', avatar: 'ghost' });
  const currentUserId = user?.id || user?.uid;
  const DEVELOPER_UUID = 'PASTE_YOUR_COPIED_UUID_HERE'; 
  const isDeveloperNode = (user?.email && user.email.toLowerCase() === 'rshozab64@gmail.com') || currentUserId === DEVELOPER_UUID;

  const [isAuthority, setIsAuthority] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authForm, setAuthForm] = useState({ name: '', agency: '', code: '' });
  
  const [postText, setPostText] = useState('');
  const [postCategory, setPostCategory] = useState('Web Scam');
  const [authControls, setAuthControls] = useState({ isPinned: false, isBuzzer: false });
  const [replyTo, setReplyTo] = useState(null);

  useEffect(() => {
    // Only logging to verify state is changing smoothly
    // console.log("Menu State Sync -> Header:", showHeaderMenu, "| Category:", showCategoryMenu);
  }, [showHeaderMenu, showCategoryMenu]);

  // SSR Safe Audio
  const playBuzzerSound = () => {
    if (typeof window === 'undefined') return;
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const audioCtx = new AudioCtx();
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      oscillator.type = 'sawtooth';
      oscillator.frequency.setValueAtTime(440, audioCtx.currentTime); 
      gainNode.gain.setValueAtTime(0.05, audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.4);
      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      oscillator.start();
      oscillator.stop(audioCtx.currentTime + 0.4);
    } catch (e) { console.log("Audio required interaction."); }
  };

  useEffect(() => {
    const savedUser = localStorage.getItem('xist_operator_identity');
    if (savedUser) setLocalIdentity(JSON.parse(savedUser));
    
    const savedAuth = localStorage.getItem('xist_authority_session');
    if (savedAuth) {
      setIsAuthority(true);
      setAuthForm(JSON.parse(savedAuth));
    }
  }, []);

  const loadPosts = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.from('community_threats')
        .select(`*, threat_likes(user_id), profiles(username, avatar_url)`)
        .eq('is_hidden', false).order('created_at', { ascending: false });

      if (error) throw error;
      
      let formatted = data.map(p => ({
        ...p,
        likes_count: p.threat_likes?.length || 0,
        user_liked: p.threat_likes?.some(like => like.user_id === currentUserId) 
      }));

      const now = new Date();
      formatted.sort((a, b) => {
        const aPinned = a.is_pinned && (now - new Date(a.pinned_at)) < 86400000;
        const bPinned = b.is_pinned && (now - new Date(b.pinned_at)) < 86400000;
        if (aPinned && !bPinned) return -1;
        if (!aPinned && bPinned) return 1;
        return 0;
      });

      if (formatted.some(p => p.is_buzzer)) playBuzzerSound();
      setPosts(formatted || []);
    } catch (error) { toast.error('Feed sync error'); } finally { setLoading(false); }
  }, [currentUserId]);

  useEffect(() => {
    loadPosts();
    const channel = supabase.channel('feed_realtime').on('postgres_changes', { event: '*', schema: 'public', table: 'community_threats' }, loadPosts).subscribe();
    return () => supabase.removeChannel(channel);
  }, [loadPosts]);

  const handleSendPost = async () => {
    if (!postText.trim()) return toast.error('Please type a message');
    setIsPublishing(true);
    try {
      if (currentUserId) {
        await supabase.from('profiles').upsert({ id: currentUserId, username: localIdentity.alias, avatar_url: localIdentity.avatar });
      }
      
      const payload = {
        user_id: currentUserId, 
        title: isAuthority ? 'Official Alert' : (replyTo ? `Reply to ${replyTo.username}` : 'Community Update'), 
        description: postText,
        threat_type: postCategory, 
        location: isAuthority ? 'Official Broadcast' : 'Global',
        is_pinned: isAuthority ? authControls.isPinned : false,
        is_buzzer: isAuthority ? authControls.isBuzzer : false,
        pinned_at: (isAuthority && authControls.isPinned) ? new Date().toISOString() : null,
        parent_id: replyTo ? replyTo.id : null
      };

      const { error } = await supabase.from('community_threats').insert(payload);
      if (error) {
         if (error.message.includes('parent_id')) {
            delete payload.parent_id;
            payload.description = replyTo ? `[Reply to ${replyTo.username}] ${postText}` : postText;
            await supabase.from('community_threats').insert(payload);
         } else { throw error; }
      }
      
      setPostText(''); setReplyTo(null); setAuthControls({ isPinned: false, isBuzzer: false });
      toast.success(isAuthority ? 'Official Alert Sent' : 'Message Posted'); 
      loadPosts();
      setTimeout(() => endOfFeedRef.current?.scrollIntoView({ behavior: 'smooth' }), 500);
    } catch (error) { toast.error('Post failed'); } finally { setIsPublishing(false); }
  };

  const handleDeletePost = async (id, e) => {
    if (e) e.stopPropagation();
    if (!window.confirm("Delete this post permanently?")) return;
    try {
      await supabase.from('community_threats').delete().eq('id', id);
      toast.success('Deleted'); if (selectedThreat?.id === id) setSelectedThreat(null); loadPosts();
    } catch (error) { toast.error('Failed to delete.'); }
  };

  const handleHidePost = async (id, e) => {
    if (e) e.stopPropagation();
    if (!window.confirm("Authority Action: Hide this post from the public?")) return;
    try {
      await supabase.from('community_threats').update({ is_hidden: true }).eq('id', id);
      toast.success('Post hidden.'); loadPosts();
    } catch (error) { toast.error('Failed to hide.'); }
  };

  const handleLike = async (id, e) => {
    if (e) e.stopPropagation();
    if (!currentUserId) return toast.error('Authentication required');
    const { data: existing } = await supabase.from('threat_likes').select('*').eq('threat_id', id).eq('user_id', currentUserId).maybeSingle(); 
    if (existing) await supabase.from('threat_likes').delete().eq('threat_id', id).eq('user_id', currentUserId);
    else await supabase.from('threat_likes').insert({ threat_id: id, user_id: currentUserId });
    loadPosts();
  };

  const openUserProfile = async (targetUserId, targetProfile, e) => {
    if (e) e.stopPropagation(); 
    setProfileData({ userId: targetUserId, loading: true });
    try {
      const { data: userPosts } = await supabase.from('community_threats').select('*, threat_likes(user_id)').eq('user_id', targetUserId);
      const totalLikes = userPosts.reduce((sum, post) => sum + (post.threat_likes?.length || 0), 0);
      setProfileData({
        userId: targetUserId, username: targetProfile?.username || `User-${targetUserId?.substring(0,4).toUpperCase()}`,
        avatarUrl: targetProfile?.avatar_url, totalLikes, postCount: userPosts.length, loading: false
      });
    } catch (err) { setProfileData(null); }
  };

  const initiateReply = (post, e) => {
    if(e) e.stopPropagation();
    const username = post.profiles?.username || 'User';
    setReplyTo({ id: post.id, username });
    inputRef.current?.focus();
  };

  const handleShare = async (threat, e) => {
    if (e) e.stopPropagation();
    const shareData = { title: `Alert: ${threat.title}`, text: `Read this on Xist: "${threat.title}"`, url: window.location.href };
    if (navigator.share && navigator.canShare(shareData)) {
      try { await navigator.share(shareData); } catch (err) { if (err.name !== 'AbortError') navigator.clipboard.writeText(shareData.url); }
    } else { navigator.clipboard.writeText(shareData.url); toast.success('Link copied'); }
  };

  const handleAuthorityLogin = () => {
    if (!authForm.name || !authForm.agency || !authForm.code) return toast.error('Fill all fields');
    if (authForm.code === 'ADMIN2026') {
      setIsAuthority(true); setShowAuthModal(false); 
      localStorage.setItem('xist_authority_session', JSON.stringify({ name: authForm.name, agency: authForm.agency, code: authForm.code }));
      toast.success(`Welcome, ${authForm.name}`);
    } else { toast.error('Invalid ID Code'); }
  };

  const RenderForensicMedia = ({ url, className = "" }) => {
    if (!url || typeof url !== 'string') return null;
    const isImage = url.match(/\.(jpeg|jpg|gif|png|webp)$/i);
    const isVideo = url.match(/\.(mp4|webm|ogg|mov)$/i);
    if (isImage) return <img src={url} className={`w-full object-contain ${className}`} alt="Evidence" />;
    if (isVideo) return <video src={url} className={`w-full ${className}`} controls autoPlay muted loop />;
    return <div className="w-full p-8 flex flex-col items-center justify-center bg-slate-950/50 rounded-xl"><MicrophoneIcon className="w-8 h-8 text-indigo-400 animate-pulse" /></div>;
  };

  // ✅ UPDATED FILTER LOGIC
  const filteredPosts = posts.filter(post => {
    if (filter === 'All') return true;
    if (filter === 'Verified') return post.is_verified === true;
    
    // Official Filter Logic
    if (filter === 'Official') {
      return post.location?.includes('Official') || post.is_buzzer || post.is_pinned;
    }

    const safeType = (post.threat_type || '').toLowerCase();
    if (filter === 'Media Fakes') return safeType.includes('media') || safeType.includes('deepfake');
    if (filter === 'Web Scams') return safeType.includes('web') || safeType.includes('scam') || safeType.includes('malware');
    
    return true;
  });

  const topLevelPosts = filteredPosts.filter(p => !p.parent_id);

  return (
    <div className={`w-full min-h-screen transition-colors duration-500 ${theme.background} ${theme.textPrimary} relative overflow-x-hidden md:ml-[280px] ml-0`}
         style={{ marginTop: '64px', fontFamily: 'Inter, system-ui, sans-serif' }}>
      
      {/* GRID BACKGROUND */}
      <div className={`absolute inset-0 pointer-events-none opacity-[0.03] ${isDark ? '' : 'invert'} z-0`} 
           style={{ backgroundImage: 'linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>

      {/* ========================================= */}
      {/* 🚀 HERO HEADER (XIST ANALYSIS STYLE)      */}
      {/* ========================================= */}
      <div className={`sticky top-0 z-30 px-4 py-8 md:py-12 transition-all overflow-hidden ${theme.headerBg}`}>
        
        {/* 🔥 TACTICAL GRID FOR HEADER 🔥 */}
        <div className={`absolute inset-0 pointer-events-none opacity-[0.05] md:opacity-[0.03] ${isDark ? '' : 'invert'} z-0`} 
             style={{ backgroundImage: 'linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>

        <div className="max-w-4xl mx-auto flex flex-col items-center justify-center relative z-10">
          
          {/* Top Shield Icon */}
          <UserGroupIcon className="w-10 h-10 md:w-14 md:h-14 text-indigo-500 mb-5 stroke-[1.5]" />
          
         <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-center mb-2 pb-4 leading-normal tracking-tight">
                     <span>{typingTitle}</span>
                     <motion.span 
                       animate={{ opacity: [0, 1, 0] }} 
                       transition={{ repeat: Infinity, duration: 0.9 }} 
                       className="inline-block w-2.5 md:w-3 h-[0.8em] bg-indigo-500 ml-2 align-baseline" 
                     />
                   </h1>

          {/* Subtitle / Cyber Tagline */}
          <p className="text-[9px] md:text-[11px] font-mono font-bold uppercase tracking-[0.3em] md:tracking-[0.4em] text-slate-500 mb-8 md:mb-12 text-center px-4">
            Live Threat Intelligence & Community Reports
          </p>
          
          {/* ✅ DESKTOP: SEGMENTED CONTROL */}
          <div className="hidden md:flex w-full max-w-2xl px-2 overflow-hidden justify-center">
            <div className={`p-1 flex items-center gap-1 rounded-full border transition-all ${
              isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-slate-100 border-slate-200'
            }`}>
              {['All', 'Web Scams', 'Media Fakes', 'Verified', 'Official'].map(f => (
                <button 
                  key={f} onClick={() => setFilter(f)} 
                  className={`relative px-6 py-2 rounded-full text-[10px] md:text-[11px] font-black uppercase tracking-widest transition-all duration-300 flex-shrink-0 ${filter === f ? 'text-white' : (isDark ? 'text-slate-500 hover:text-slate-300' : 'text-slate-500 hover:text-slate-700')}`}
                >
                  {filter === f && (
                    <motion.div layoutId="activeFilter" className={`absolute inset-0 rounded-full shadow-lg ${f === 'Verified' ? 'bg-emerald-600' : f === 'Web Scams' ? 'bg-orange-600' : f === 'Media Fakes' ? 'bg-purple-600' : f === 'Official' ? 'bg-red-600' : 'bg-indigo-600'}`} transition={{ type: 'spring', stiffness: 400, damping: 30 }} />
                  )}
                  <span className="relative z-10">{f}</span>
                </button>
              ))}
            </div>
          </div>

          {/* ✅ MOBILE HEADER FILTER: Button Only */}
          <div className="md:hidden relative mt-1 w-max mx-auto">
            <button 
              onClick={() => setShowHeaderMenu(true)}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-full border shadow-lg transition-all ${isDark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-slate-300 text-slate-900'}`}
            >
              <FunnelIcon className={`w-4 h-4 ${filter === 'All' ? 'text-indigo-500' : filter === 'Verified' ? 'text-emerald-500' : filter === 'Official' ? 'text-red-500' : filter === 'Web Scams' ? 'text-orange-500' : 'text-purple-500'}`} />
              <span className="text-[11px] font-black uppercase tracking-widest">{filter}</span>
            </button>
          </div>

          {/* AUTHORITY STATUS / LOGIN */}
          <div className="absolute right-0 top-0 hidden md:flex items-center gap-3">
            {!isAuthority ? (
              <button onClick={() => setShowAuthModal(true)} className={`text-[10px] uppercase tracking-widest px-4 py-2 rounded-lg font-bold border transition-all ${isDark ? 'bg-slate-800 text-slate-300 border-slate-700 hover:text-white hover:border-slate-500' : 'bg-white text-slate-600 border-slate-300 hover:border-slate-400'}`}>Authority Login</button>
            ) : (
              <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 px-3 py-1.5 rounded-xl">
                <UserGroupIcon className="w-4 h-4 text-red-500"/>
                <div className="flex flex-col items-start px-1 mr-2">
                  <span className="text-[9px] text-red-500 font-black tracking-widest uppercase">Gov ID Active</span>
                  <span className="text-[8px] font-bold text-slate-500 uppercase">{authForm.name}</span>
                </div>
                <button onClick={() => { setIsAuthority(false); setAuthForm({ name: '', agency: '', code: '' }); localStorage.removeItem('xist_authority_session'); toast.success("Deauthorized"); }} className="p-1 rounded-md hover:bg-red-500/20 text-red-400 transition-all"><XMarkIcon className="w-4 h-4" /></button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ========================================= */}
      {/* 🚀 HYBRID FEED (LEFT/RIGHT ALIGNED)       */}
      {/* ========================================= */}
      <div className="max-w-4xl mx-auto p-4 md:p-8 relative z-10 pb-40">
        {loading ? ( <div className="flex justify-center py-24"><ArrowPathIcon className="w-8 h-8 text-indigo-500 animate-spin" /></div> ) : (
          <div className="flex flex-col gap-6">
            
            {topLevelPosts.map((threat) => {
              // Strict checking for Authority posts
              const isOfficial = threat.location?.includes('Official') || threat.is_buzzer || threat.is_pinned;
              
              const isBuzzer = threat.is_buzzer;
              const safeType = threat.threat_type || 'Unknown';
              const isMedia = safeType.toLowerCase().includes('media') || safeType.toLowerCase().includes('deepfake');
              
              // Alignment: self-start (Left) for users, self-end (Right) for Authorities
              const alignmentClass = isOfficial ? 'self-end border-r-4 border-r-red-500' : 'self-start border-l-4 border-l-indigo-500';
              const widthClass = 'w-[95%] md:w-[80%]';
              
              // Glow Logic
              let glowClass = '';
              if (isBuzzer) glowClass = 'shadow-[0_0_20px_rgba(239,68,68,0.2)] border border-red-500 bg-red-500/5 animate-pulse';
              else if (isOfficial) glowClass = 'shadow-[0_0_15px_rgba(239,68,68,0.05)] border border-slate-800';
              else if (isMedia) glowClass = 'hover:border-purple-500/30';
              else glowClass = 'hover:border-indigo-500/30';

              const replies = filteredPosts.filter(p => p.parent_id === threat.id);

              return (
              <motion.div key={threat.id} layout className={`flex flex-col gap-3 ${widthClass} ${alignmentClass}`}>
                
                {/* Put overflow-hidden back to keep the card clean */}
                <div onClick={() => setSelectedThreat(threat)} className={`${theme.card} p-5 cursor-pointer group relative overflow-hidden transition-all rounded-2xl ${glowClass}`}>
                  
                  {/* Hover Media */}
                  {threat.media_url && (
                    <div className="absolute inset-0 z-0 opacity-0 group-hover:opacity-[0.15] transition-opacity duration-500 pointer-events-none">
                      <RenderForensicMedia url={threat.media_url} className="w-full h-full object-cover grayscale" />
                    </div>
                  )}

                  {/* Top Row (Avatar + Badges) */}
                  <div className="flex items-start justify-between mb-3 z-10 relative">
                    <div onClick={(e) => openUserProfile(threat.user_id, threat.profiles, e)} className="flex items-center gap-2 group-hover:bg-indigo-500/10 p-1.5 -ml-1.5 rounded-xl transition-all">
                      <div className={`w-8 h-8 rounded-full overflow-hidden shrink-0 border flex items-center justify-center ${isOfficial ? 'border-red-500/50 bg-red-500/10' : 'border-slate-700 bg-slate-800'}`}>
                        <TacticalAvatar identifier={threat.user_id === currentUserId ? localIdentity.avatar : threat.profiles?.avatar_url} />
                      </div>
                      <div className="flex flex-col">
                        <span className={`text-[10px] font-black uppercase tracking-tighter flex items-center gap-1 ${isOfficial ? 'text-red-400' : 'text-slate-400 group-hover:text-indigo-400'}`}>
                          {threat.user_id === currentUserId ? localIdentity.alias : (threat.profiles?.username || 'User')}
                          {isOfficial && <ShieldCheckIcon className="w-3 h-3" />}
                        </span>
                        <span className="text-[8px] text-slate-500 font-mono font-bold">{timeAgo(threat.created_at)}</span>
                      </div>
                    </div>
                    
                    {/* ✅ FIX: Static, non-moving Buzzer neatly tucked in the corner */}
                    <div className="flex items-center gap-2">
                      {isBuzzer && (
                        <span className="flex items-center gap-1 px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest bg-red-600 text-white">
                          <SpeakerWaveIcon className="w-3 h-3" />
                          Alert
                        </span>
                      )}
                      <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest border ${isOfficial ? 'bg-red-500/10 text-red-400 border-red-500/20' : 'bg-slate-800 text-slate-400 border-slate-700'}`}>
                        {safeType}
                      </span>
                    </div>
                  </div>

                  <div className="z-10 relative pl-1">
                    <h3 className={`text-base font-black mb-1.5 leading-tight ${isBuzzer ? 'text-red-400' : theme.textPrimary}`}>{threat.title}</h3>
                    <p className={`text-sm leading-relaxed whitespace-pre-wrap font-medium ${theme.textSecondary}`}>{threat.description}</p>
                    {threat.media_url && <div className="mt-3 text-[9px] font-black uppercase text-indigo-500 tracking-widest flex items-center gap-1"><PhotoIcon className="w-3.5 h-3.5" /> Media Attached</div>}
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t z-10 relative mt-4 border-slate-800/50">
                    <div className="flex items-center gap-4">
                      <button onClick={(e) => handleLike(threat.id, e)} className={`flex items-center gap-1.5 text-[10px] font-black transition-all ${threat.user_liked ? 'text-rose-500' : 'text-slate-500 hover:text-rose-400'}`}>
                        <HeartIcon className={`w-4 h-4 ${threat.user_liked ? 'fill-rose-500' : ''}`} /> {threat.likes_count}
                      </button>
                      <button onClick={(e) => initiateReply(threat, e)} className="flex items-center gap-1.5 text-[10px] font-black text-slate-500 hover:text-indigo-400 transition-all">
                        <ChatBubbleLeftRightIcon className="w-4 h-4" /> {replies.length}
                      </button>
                      <button onClick={(e) => handleShare(threat, e)} className="text-slate-500 hover:text-indigo-400 transition-colors">
                        <ShareIcon className="w-4 h-4" />
                      </button>
                      
                      {(threat.user_id === currentUserId || isDeveloperNode) && (
                         <button onClick={(e) => handleDeletePost(threat.id, e)} className="text-slate-500 hover:text-rose-500 transition-colors">
                           <TrashIcon className="w-4 h-4" />
                         </button>
                      )}
                      {isAuthority && threat.user_id !== currentUserId && !isDeveloperNode && (
                        <button onClick={(e) => handleHidePost(threat.id, e)} className="text-slate-500 hover:text-red-500 transition-colors">
                          <EyeSlashIcon className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* NESTED REPLIES */}
                {replies.length > 0 && (
                  <div className={`mt-2 flex flex-col gap-2 ${isOfficial ? 'mr-4 pr-4 border-r-2 border-slate-800' : 'ml-4 pl-4 border-l-2 border-slate-800'}`}>
                    {replies.map(reply => (
                      <div key={reply.id} className={`${theme.inner} p-3 rounded-xl border ${isDark ? 'border-slate-800' : 'border-slate-200'} relative group`}>
                         <div className="flex items-center gap-2 mb-1.5">
                           <div className="w-5 h-5 rounded-full overflow-hidden bg-slate-800 border border-slate-700">
                             <TacticalAvatar identifier={reply.profiles?.avatar_url} />
                           </div>
                           <span className={`text-[9px] font-black uppercase ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                             {reply.profiles?.username || 'User'}
                           </span>
                           <span className="text-[8px] text-slate-500">{timeAgo(reply.created_at)}</span>
                           {(reply.user_id === currentUserId || isDeveloperNode) && (
                             <button onClick={(e) => handleDeletePost(reply.id, e)} className="ml-auto opacity-0 group-hover:opacity-100 text-slate-500 hover:text-rose-500 transition-all">
                               <TrashIcon className="w-3 h-3"/>
                             </button>
                           )}
                         </div>
                         <p className={`text-xs pl-7 leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-700 font-medium'}`}>
                           {reply.description.replace(/\[Reply to.*?\]\s*/, '')}
                         </p>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            )})}
            <div ref={endOfFeedRef} className="h-10"></div>
          </div>
        )}
      </div>

      {/* ========================================= */}
      {/* 🚀 STICKY GEMINI-STYLE INPUT BAR          */}
      {/* ========================================= */}
      {/* ✅ FIXED: bottom-20 clears mobile nav */}
      <div className={`fixed bottom-20 md:bottom-0 right-0 left-0 md:left-[280px] z-40 pb-4 pt-10 bg-gradient-to-t ${isDark ? 'from-[#020617] via-[#020617]/80' : 'from-slate-50 via-slate-50/90'} to-transparent transition-all duration-300 pointer-events-none`}>
        <div className="max-w-3xl mx-auto px-4 pointer-events-auto w-full">
          
          {replyTo && (
            <div className="bg-indigo-600 text-white text-[9px] md:text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-t-xl w-max ml-4 flex items-center gap-2 shadow-lg">
              <ArrowUturnLeftIcon className="w-3 h-3" /> {replyTo.username}
              <button onClick={() => setReplyTo(null)} className="ml-1"><XMarkIcon className="w-3 h-3" /></button>
            </div>
          )}

          <div className={`relative flex items-center p-1.5 md:p-2 rounded-full shadow-2xl backdrop-blur-xl border ${
              isAuthority 
              ? (isDark ? 'bg-red-950/80 border-red-500/50' : 'bg-red-50/90 border-red-300') 
              : (isDark ? 'bg-slate-900/90 border-slate-700' : 'bg-white border-slate-300')
            } ${replyTo ? 'rounded-tl-none' : ''}`}>
            
            <button 
              onClick={() => document.getElementById('file-upload').click()}
              className={`p-2 rounded-full transition-all flex-shrink-0 ${isAuthority ? 'text-red-400 hover:bg-red-500/10' : 'text-indigo-500 hover:bg-indigo-500/10'}`}
            >
              <PlusCircleIcon className="w-5 h-5 md:w-6 md:h-6" />
            </button>
            
            {/* The Input with enforced transparency */}
            <input 
              ref={inputRef}
              value={postText} 
              onChange={(e) => setPostText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendPost()}
              placeholder={replyTo ? "Write a reply..." : (isAuthority ? "Broadcast alert..." : "Share update...")}
              className={`flex-1 bg-transparent bg-none appearance-none border-none outline-none text-xs md:text-sm px-2 font-medium w-full shadow-none focus:ring-0 focus:outline-none focus:shadow-none ${
                isDark ? 'text-white placeholder-slate-500' : 'text-slate-900 placeholder-slate-400'
              }`}
              style={{ backgroundColor: 'transparent', boxShadow: 'none', WebkitAppearance: 'none' }}
            />

{/* ✅ BOTTOM INPUT CATEGORY: Button Only */}
            {!replyTo && (
              <div className="relative flex items-center justify-center border-l border-slate-700/50 ml-1 pl-2">
                <button 
                  onClick={() => setShowCategoryMenu(true)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all shadow-md ${
                    postCategory === 'Web Scam' ? 'bg-orange-500 text-white' : 
                    postCategory === 'Deepfake Media' ? 'bg-purple-600 text-white' : 
                    'bg-red-600 text-white'
                  }`}
                >
                  <FunnelIcon className="w-3.5 h-3.5" />
                  <span className="hidden sm:block text-[9px] font-black uppercase tracking-widest">{postCategory.split(' ')[0]}</span>
                </button>
              </div>
            )}

            {/* Authority Inner Toggles */}
            {isAuthority && !replyTo && (
              <div className="hidden sm:flex items-center gap-1 px-2 border-l border-red-500/30 ml-1">
                <button onClick={() => setAuthControls({...authControls, isPinned: !authControls.isPinned})} className={`p-1.5 rounded-full transition-all ${authControls.isPinned ? 'bg-red-500 text-white' : 'text-red-500 hover:bg-red-500/10'}`}><ChartBarIcon className="w-4 h-4"/></button>
                <button onClick={() => setAuthControls({...authControls, isBuzzer: !authControls.isBuzzer})} className={`p-1.5 rounded-full transition-all ${authControls.isBuzzer ? 'bg-red-500 text-white animate-pulse' : 'text-red-500 hover:bg-red-500/10'}`}><SpeakerWaveIcon className="w-4 h-4"/></button>
              </div>
            )}

            <button 
              onClick={handleSendPost}
              disabled={isPublishing || !postText.trim()}
              className={`p-2 md:p-2.5 rounded-full transition-all ml-1 flex-shrink-0 ${
                !postText.trim() ? (isDark ? 'opacity-50 cursor-not-allowed bg-slate-800 text-slate-500' : 'opacity-50 cursor-not-allowed bg-slate-200 text-slate-400') : isAuthority ? 'bg-red-600 text-white shadow-[0_0_15px_rgba(220,38,38,0.5)]' : 'bg-indigo-600 text-white shadow-[0_0_15px_rgba(79,70,229,0.5)]'
              }`}
            >
              {isPublishing ? <ArrowPathIcon className="w-5 h-5 animate-spin" /> : <PaperAirplaneIcon className="w-5 h-5" />}
            </button>
          </div>
        </div>
        
        {/* Functional Hidden File Input */}
        <input 
          id="file-upload" 
          type="file" 
          className="hidden" 
          accept="image/*,video/*" 
          onChange={(e) => { 
            const file = e.target.files[0]; 
            if (file) { toast.success(`Selected: ${file.name}`, { icon: '📁' }); } 
          }} 
        />
      </div>

      {/* ========================================= */}
      {/* ELITE MODAL W/ DECODED TEXT               */}
      {/* ========================================= */}
      <AnimatePresence>
        {selectedThreat && (
          <motion.div key="threat-modal" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[60] flex items-center justify-center p-3 sm:p-4">
            <div className={`absolute inset-0 ${isDark ? 'bg-[#020617]/80' : 'bg-slate-900/40'} backdrop-blur-sm`} onClick={() => setSelectedThreat(null)} />
            
            <motion.div initial={{ scale: 0.9, y: 40 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }} className={`relative w-full max-w-xl max-h-[85vh] flex flex-col z-10 rounded-2xl shadow-2xl overflow-hidden border ${isDark ? 'bg-slate-950 border-slate-700/50 shadow-[0_0_50px_rgba(99,102,241,0.15)]' : 'bg-white border-slate-200 shadow-xl'}`}>
              <div className={`absolute inset-0 pointer-events-none opacity-[0.02] ${isDark ? '' : 'invert'}`} style={{ backgroundImage: 'linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>
              
              <div className={`px-4 py-3 md:px-5 md:py-4 border-b flex justify-between items-center sticky top-0 z-20 backdrop-blur-2xl ${isDark ? 'bg-slate-950/80 border-slate-800' : 'bg-white/80 border-slate-200'}`}>
                 <div className="flex items-center gap-3 cursor-pointer group" onClick={(e) => {setSelectedThreat(null); openUserProfile(selectedThreat.user_id, selectedThreat.profiles, e);}}>
                   <div className="w-10 h-10 rounded-full overflow-hidden shrink-0 border border-slate-700 bg-slate-800 flex items-center justify-center">
                     <TacticalAvatar identifier={selectedThreat.user_id === currentUserId ? localIdentity.avatar : selectedThreat.profiles?.avatar_url} />
                   </div>
                   <div>
                     <div className="text-[9px] font-black uppercase tracking-[0.2em] text-indigo-500 mb-0.5">Reported By</div>
                     <div className={`text-sm font-black tracking-tight group-hover:text-indigo-400 transition-colors line-clamp-1 ${theme.textPrimary}`}>
                       {selectedThreat.user_id === currentUserId ? localIdentity.alias : (selectedThreat.profiles?.username || `USER-${selectedThreat.user_id?.substring(0,4).toUpperCase()}`)}
                     </div>
                   </div>
                 </div>
                 <button onClick={() => setSelectedThreat(null)} className={`p-2 rounded-lg transition-all ${isDark ? 'bg-slate-800 text-slate-400 hover:text-white' : 'bg-slate-100 text-slate-500 hover:text-slate-900'}`}><XMarkIcon className="w-5 h-5" /></button>
              </div>

              <div className="flex-grow overflow-y-auto p-4 md:p-6 custom-scrollbar relative z-10">
                <h2 className={`text-xl font-black mb-4 leading-tight tracking-tighter ${theme.textPrimary}`}>
                  <DecodedText text={selectedThreat.title} />
                </h2>
                
                {selectedThreat.media_url && (
                  <div className="mb-5 rounded-xl overflow-hidden border border-slate-800 bg-black flex items-center justify-center shadow-lg relative">
                    <RenderForensicMedia url={selectedThreat.media_url} className="max-h-[220px] object-contain" />
                  </div>
                )}
                
                <div className={`p-5 rounded-xl text-sm leading-relaxed whitespace-pre-wrap font-medium shadow-inner ${isDark ? 'bg-slate-900/80 text-slate-300 border border-slate-800' : 'bg-slate-50 text-slate-700 border border-slate-200'}`}>
                  {selectedThreat.description}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ========================================= */}
      {/* 👤 PROFILE MODAL                            */}
      {/* ========================================= */}
      <AnimatePresence>
        {profileData && (
          <motion.div key="profile-modal" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[999999] flex items-center justify-center p-4">
             <div className={`absolute inset-0 backdrop-blur-md ${isDark ? 'bg-slate-950/70' : 'bg-slate-900/40'}`} onClick={() => setProfileData(null)} />
             
             <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }} className={`${theme.card} p-8 max-w-sm w-full text-center relative z-10 rounded-[2rem] shadow-2xl`}>
              <button onClick={() => setProfileData(null)} className={`absolute top-4 right-4 p-2 rounded-full transition-all ${isDark ? 'bg-slate-800 text-slate-400 hover:text-white' : 'bg-slate-100 text-slate-500 hover:text-slate-900'}`}><XMarkIcon className="w-4 h-4" /></button>
              
              <div className="w-24 h-24 mx-auto rounded-full overflow-hidden border-4 border-indigo-500/20 mb-5 flex items-center justify-center bg-slate-800/50">
                <TacticalAvatar identifier={profileData.avatarUrl} />
              </div>
              
              <h2 className={`text-2xl font-black tracking-tight mb-1 ${theme.textPrimary}`}>{profileData.username}</h2>
              <div onClick={() => { navigator.clipboard.writeText(profileData.userId); toast.success("ID Copied"); }} className="cursor-pointer text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-indigo-400 mb-6">ID: {profileData.userId.substring(0, 8)}...</div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className={`${theme.inner} p-4 rounded-2xl border flex flex-col items-center justify-center`}>
                  <div className={`text-3xl font-black ${theme.textPrimary}`}>{profileData.postCount}</div>
                  <div className="text-[9px] text-slate-500 font-black uppercase tracking-widest mt-1">Posts</div>
                </div>
                <div className={`${theme.inner} p-4 rounded-2xl border flex flex-col items-center justify-center`}>
                  <div className={`text-3xl font-black ${theme.textPrimary}`}>{profileData.totalLikes}</div>
                  <div className="text-[9px] text-slate-500 font-black uppercase tracking-widest mt-1">Impact</div>
                </div>
              </div>
             </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

{/* ========================================= */}
      {/* 🎛️ GLOBAL FLOATING MENUS (CSS TRAP FIX)  */}
      {/* ========================================= */}
      <AnimatePresence>
        {/* HEADER FILTER MODAL */}
        {showHeaderMenu && (
          <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowHeaderMenu(false)} />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className={`relative w-64 rounded-3xl shadow-2xl border overflow-hidden flex flex-col z-10 ${isDark ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200'}`}
            >
              <div className={`p-4 border-b text-center text-xs font-black uppercase tracking-widest ${isDark ? 'border-slate-800 text-slate-400' : 'border-slate-100 text-slate-500'}`}>Select Filter</div>
              {['All', 'Web Scams', 'Media Fakes', 'Verified', 'Official'].map(f => (
                <button key={f} onClick={() => { setFilter(f); setShowHeaderMenu(false); }}
                  className={`w-full text-center px-5 py-4 text-[11px] font-black uppercase tracking-widest transition-all ${filter === f ? 'bg-indigo-600 text-white' : (isDark ? 'text-slate-300 hover:bg-slate-800' : 'text-slate-600 hover:bg-slate-50')}`}
                > {f} </button>
              ))}
            </motion.div>
          </div>
        )}

        {/* INPUT CATEGORY MODAL */}
        {showCategoryMenu && (
          <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowCategoryMenu(false)} />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className={`relative w-64 rounded-3xl shadow-2xl border overflow-hidden flex flex-col z-10 ${isDark ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200'}`}
            >
              <div className={`p-4 border-b text-center text-xs font-black uppercase tracking-widest ${isDark ? 'border-slate-800 text-slate-400' : 'border-slate-100 text-slate-500'}`}>Select Threat Type</div>
              {[
                { id: 'Web Scam', label: 'Web Scam', color: 'bg-orange-500' },
                { id: 'Deepfake Media', label: 'Media Fake', color: 'bg-purple-500' },
                { id: 'General Alert', label: 'General Alert', color: 'bg-red-500' }
              ].map(cat => (
                <button key={cat.id} onClick={() => { setPostCategory(cat.id); setShowCategoryMenu(false); }}
                  className={`w-full flex items-center justify-center gap-2 px-5 py-4 text-[11px] font-black uppercase tracking-widest transition-all ${postCategory === cat.id ? 'bg-indigo-600 text-white' : (isDark ? 'text-slate-300 hover:bg-slate-800' : 'text-slate-600 hover:bg-slate-50')}`}
                > 
                  <span className={`w-2 h-2 rounded-full ${cat.color}`} /> {cat.label} 
                </button>
              ))}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ========================================= */}
      {/* 🔐 AUTHORITY LOGIN MODAL                    */}
      {/* ========================================= */}
      <AnimatePresence>
        {showAuthModal && (
          <motion.div key="auth-modal" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
            <div className="absolute inset-0" onClick={() => setShowAuthModal(false)} />
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} className="bg-slate-900 p-8 rounded-3xl w-full max-w-sm border border-slate-700 shadow-2xl relative overflow-hidden z-10">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-600 to-indigo-600"></div>
              <h3 className="text-xl font-black text-white mb-1 flex items-center gap-2"><ShieldCheckIcon className="w-6 h-6 text-red-500"/> Authority Gateway</h3>
              <p className="text-[10px] text-slate-400 mb-6 uppercase tracking-widest font-bold">Secure Official Access</p>
              
              <div className="space-y-3 mb-6 text-left">
                <div><label className="text-[9px] uppercase tracking-widest font-bold text-slate-500 ml-1">Officer Name</label><input type="text" value={authForm.name} onChange={e=>setAuthForm({...authForm, name: e.target.value})} className="w-full p-3 bg-slate-950 border border-slate-800 text-white rounded-xl text-sm font-bold outline-none focus:border-red-500" placeholder="e.g. Insp. Sharma" /></div>
                <div><label className="text-[9px] uppercase tracking-widest font-bold text-slate-500 ml-1">Agency / Department</label><input type="text" value={authForm.agency} onChange={e=>setAuthForm({...authForm, agency: e.target.value})} className="w-full p-3 bg-slate-950 border border-slate-800 text-white rounded-xl text-sm font-bold outline-none focus:border-red-500" placeholder="e.g. Cyber Cell" /></div>
                <div><label className="text-[9px] uppercase tracking-widest font-bold text-slate-500 ml-1">Access Code</label><input type="password" value={authForm.code} onChange={e=>setAuthForm({...authForm, code: e.target.value})} onKeyDown={e => e.key === 'Enter' && handleAuthorityLogin()} className="w-full p-3 bg-slate-950 border border-slate-800 text-rose-400 rounded-xl font-mono text-center tracking-widest outline-none focus:border-red-500" placeholder="••••••••" /></div>
              </div>
              
              <div className="flex gap-3">
                <button onClick={handleAuthorityLogin} className="flex-1 bg-red-600 hover:bg-red-500 text-white py-3 rounded-xl font-black uppercase tracking-widest text-xs shadow-lg shadow-red-600/20">Verify</button>
                <button onClick={()=>setShowAuthModal(false)} className="flex-1 bg-slate-800 hover:bg-slate-700 text-white py-3 rounded-xl font-black uppercase tracking-widest text-xs">Cancel</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}