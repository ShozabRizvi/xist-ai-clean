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
  CodeBracketIcon, XMarkIcon, EyeSlashIcon, MegaphoneIcon, ArrowUturnLeftIcon, BellAlertIcon
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
    return <Icon className="w-full h-full p-1 text-indigo-500 dark:text-indigo-400" />;
  }
  if (identifier && typeof identifier === 'string' && identifier.startsWith('http')) {
    return <img src={identifier} className="w-full h-full object-cover" alt="User" />;
  }
  return <UserCircleIcon className="w-full h-full p-1 text-slate-500" />;
};

// ==============================
// UTILITY FUNCTIONS
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

export default function CommunitySection({ user, theme: globalTheme }) {
  const isDark = globalTheme === 'dark';
  
  const typingTitle = useTypewriter("Community Feed", 80, 200);
  const endOfFeedRef = useRef(null);
  const inputRef = useRef(null);
  
  // 🚀 ALIGNMENT ENGINE: Tracks the exact width and position of the feed container
  const feedContainerRef = useRef(null);
  const [inputPosition, setInputPosition] = useState({ left: 0, width: '100%' });

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isPublishing, setIsPublishing] = useState(false);
  const [filter, setFilter] = useState('All');
  const [selectedThreat, setSelectedThreat] = useState(null); 
  const [profileData, setProfileData] = useState(null); 

  const [showHeaderMenu, setShowHeaderMenu] = useState(false);
  const [showCategoryMenu, setShowCategoryMenu] = useState(false); // Pro Dropdown State

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

  // ALARM ENGINE
  const [alarmMuted, setAlarmMuted] = useState(false);
  const [hasActiveBuzzer, setHasActiveBuzzer] = useState(false);
  const audioCtxRef = useRef(null);
  const oscillatorRef = useRef(null);
  const lfoRef = useRef(null);

  // 🚀 DYNAMIC ALIGNMENT OBSERVER (Solves the layout shifting issue)
  useEffect(() => {
    const updatePos = () => {
      requestAnimationFrame(() => {
        if (feedContainerRef.current) {
          const rect = feedContainerRef.current.getBoundingClientRect();
          setInputPosition({ left: rect.left, width: rect.width });
        }
      });
    };
    updatePos();
    // This watches the entire app body. If sidebar opens/closes, it instantly re-centers the input bar.
    const observer = new ResizeObserver(updatePos);
    observer.observe(document.body);
    window.addEventListener('resize', updatePos);
    return () => {
      observer.disconnect();
      window.removeEventListener('resize', updatePos);
    };
  }, []);

  const stopAlarm = useCallback(() => {
    if (oscillatorRef.current) { try { oscillatorRef.current.stop(); } catch(e){} oscillatorRef.current.disconnect(); oscillatorRef.current = null; }
    if (lfoRef.current) { try { lfoRef.current.stop(); } catch(e){} lfoRef.current.disconnect(); lfoRef.current = null; }
    if (audioCtxRef.current) { audioCtxRef.current.close(); audioCtxRef.current = null; }
    setAlarmMuted(true);
    // Removed the annoying toast notification from here!
  }, []);

  const triggerContinuousAlarm = useCallback(() => {
    if (typeof window === 'undefined' || alarmMuted) return;
    try {
      if (audioCtxRef.current) return; 
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const audioCtx = new AudioCtx();
      audioCtxRef.current = audioCtx;

      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      const lfo = audioCtx.createOscillator();
      const lfoGain = audioCtx.createGain();

      oscillator.type = 'square';
      oscillator.frequency.setValueAtTime(500, audioCtx.currentTime);
      lfo.type = 'sine'; lfo.frequency.value = 3; lfoGain.gain.value = 150; 
      
      lfo.connect(lfoGain); lfoGain.connect(oscillator.frequency);
      gainNode.gain.setValueAtTime(0.05, audioCtx.currentTime);
      
      oscillator.connect(gainNode); gainNode.connect(audioCtx.destination);
      oscillator.start(); lfo.start();

      oscillatorRef.current = oscillator; lfoRef.current = lfo;
    } catch (e) { console.log("Audio required interaction."); }
  }, [alarmMuted]);

  useEffect(() => {
    const savedUser = localStorage.getItem('xist_operator_identity');
    if (savedUser) setLocalIdentity(JSON.parse(savedUser));
    
    const savedAuth = localStorage.getItem('xist_authority_session');
    if (savedAuth) { setIsAuthority(true); setAuthForm(JSON.parse(savedAuth)); }
    return () => stopAlarm();
  }, [stopAlarm]);

  const loadPosts = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.from('community_threats')
        .select(`*, threat_likes(user_id), profiles(username, avatar_url)`)
        .eq('is_hidden', false).order('created_at', { ascending: false });

      if (error) throw error;
      
      let formatted = data.map(p => ({ ...p, likes_count: p.threat_likes?.length || 0, user_liked: p.threat_likes?.some(like => like.user_id === currentUserId) }));

      const now = new Date();
      formatted.sort((a, b) => {
        const aPinned = a.is_pinned && (now - new Date(a.pinned_at)) < 86400000;
        const bPinned = b.is_pinned && (now - new Date(b.pinned_at)) < 86400000;
        if (aPinned && !bPinned) return -1;
        if (!aPinned && bPinned) return 1;
        return 0;
      });

      const containsBuzzer = formatted.some(p => p.is_buzzer);
      setHasActiveBuzzer(containsBuzzer);
      if (containsBuzzer && !alarmMuted) triggerContinuousAlarm();

      setPosts(formatted || []);
    } catch (error) { toast.error('Feed sync error'); } finally { setLoading(false); }
  }, [currentUserId, alarmMuted, triggerContinuousAlarm]);

  useEffect(() => {
    loadPosts();
    const channel = supabase.channel('feed_realtime').on('postgres_changes', { event: '*', schema: 'public', table: 'community_threats' }, loadPosts).subscribe();
    return () => supabase.removeChannel(channel);
  }, [loadPosts]);

  const handleSendPost = async () => {
    if (!postText.trim()) return toast.error('Please type a message');
    setIsPublishing(true);
    try {
      if (currentUserId) await supabase.from('profiles').upsert({ id: currentUserId, username: localIdentity.alias, avatar_url: localIdentity.avatar });
      
      const payload = {
        user_id: currentUserId, title: isAuthority ? 'Official Alert' : (replyTo ? `Reply to ${replyTo.username}` : 'Community Update'), 
        description: postText, threat_type: postCategory, 
        // 🚀 Embeds the Authority name and agency directly into the location string
        location: isAuthority ? `Official: ${authForm.agency} | ${authForm.name}` : 'Global',
        is_pinned: isAuthority ? authControls.isPinned : false, is_buzzer: isAuthority ? authControls.isBuzzer : false,
        pinned_at: (isAuthority && authControls.isPinned) ? new Date().toISOString() : null, parent_id: replyTo ? replyTo.id : null
      };

      const { error } = await supabase.from('community_threats').insert(payload);
      if (error) {
         if (error.message.includes('parent_id')) {
            delete payload.parent_id; payload.description = replyTo ? `[Reply to ${replyTo.username}] ${postText}` : postText;
            await supabase.from('community_threats').insert(payload);
         } else throw error;
      }
      
      setPostText(''); setReplyTo(null); setAuthControls({ isPinned: false, isBuzzer: false });
      toast.success(isAuthority ? 'Official Alert Sent' : 'Message Posted'); loadPosts();
      setTimeout(() => endOfFeedRef.current?.scrollIntoView({ behavior: 'smooth' }), 500);
    } catch (error) { toast.error('Post failed'); } finally { setIsPublishing(false); }
  };

  const handleDeletePost = async (id, e) => {
    if (e) e.stopPropagation();
    if (!window.confirm("Delete this post permanently?")) return;
    try { await supabase.from('community_threats').delete().eq('id', id); toast.success('Deleted'); if (selectedThreat?.id === id) setSelectedThreat(null); loadPosts(); } catch (error) { toast.error('Failed to delete.'); }
  };

  const handleHidePost = async (id, e) => {
    if (e) e.stopPropagation();
    if (!window.confirm("Authority Action: Hide this post from the public?")) return;
    try { await supabase.from('community_threats').update({ is_hidden: true }).eq('id', id); toast.success('Post hidden.'); loadPosts(); } catch (error) { toast.error('Failed to hide.'); }
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
    if (e) e.stopPropagation(); setProfileData({ userId: targetUserId, loading: true });
    try {
      const { data: userPosts } = await supabase.from('community_threats').select('*, threat_likes(user_id)').eq('user_id', targetUserId);
      const totalLikes = userPosts.reduce((sum, post) => sum + (post.threat_likes?.length || 0), 0);
      setProfileData({ userId: targetUserId, username: targetProfile?.username || `User-${targetUserId?.substring(0,4).toUpperCase()}`, avatarUrl: targetProfile?.avatar_url, totalLikes, postCount: userPosts.length, loading: false });
    } catch (err) { setProfileData(null); }
  };

  const initiateReply = (post, e) => {
    if(e) e.stopPropagation(); setReplyTo({ id: post.id, username: post.profiles?.username || 'User' }); inputRef.current?.focus();
  };

  const handleShare = async (threat, e) => {
    if (e) e.stopPropagation();
    const shareData = { title: `Alert: ${threat.title}`, text: `Read this on Xist: "${threat.title}"`, url: window.location.href };
    if (navigator.share && navigator.canShare(shareData)) { try { await navigator.share(shareData); } catch (err) { if (err.name !== 'AbortError') navigator.clipboard.writeText(shareData.url); }
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
    const isImage = url.match(/\.(jpeg|jpg|gif|png|webp)$/i); const isVideo = url.match(/\.(mp4|webm|ogg|mov)$/i);
    if (isImage) return <img src={url} className={`w-full object-contain ${className}`} alt="Evidence" />;
    if (isVideo) return <video src={url} className={`w-full ${className}`} controls autoPlay muted loop />;
    return <div className="w-full p-8 flex flex-col items-center justify-center bg-slate-950/50 rounded-xl"><MicrophoneIcon className="w-8 h-8 text-indigo-400 animate-pulse" /></div>;
  };

  // 🚀 Parses the embedded Authority data or falls back to normal user profiles
  const getPostIdentity = (threat) => {
    const isNewOfficial = threat.location?.startsWith('Official:');
    const isLegacyOfficial = threat.location === 'Official Broadcast' || threat.is_buzzer || threat.is_pinned;
    const isOfficial = isNewOfficial || isLegacyOfficial;
    
    let author = threat.user_id === currentUserId ? localIdentity.alias : (threat.profiles?.username || `User-${threat.user_id?.substring(0,4).toUpperCase()}`);
    let avatar = threat.user_id === currentUserId ? localIdentity.avatar : threat.profiles?.avatar_url;
    let agency = 'Global';

    if (isNewOfficial) {
      const parts = threat.location.split(' | ');
      agency = parts[0].replace('Official: ', '');
      author = parts[1] || 'Official Authority';
      // Auto-assign logo based on the agency name
      avatar = agency.toLowerCase().includes('cyber') ? 'chip' : 'shield';
    } else if (isLegacyOfficial) {
      author = 'Official Broadcast';
      agency = 'Official Network';
      avatar = 'shield';
    }
    return { isOfficial, author, avatar, agency };
  };

  const filteredPosts = posts.filter(post => {
    if (filter === 'All') return true;
    if (filter === 'Verified') return post.is_verified === true;
    if (filter === 'Official') return post.location?.includes('Official') || post.is_buzzer || post.is_pinned;
    const safeType = (post.threat_type || '').toLowerCase();
    if (filter === 'Media Fakes') return safeType.includes('media') || safeType.includes('deepfake');
    if (filter === 'Web Scams') return safeType.includes('web') || safeType.includes('scam') || safeType.includes('malware');
    return true;
  });

  const topLevelPosts = filteredPosts.filter(p => !p.parent_id);

  return (
    // 🚀 FIX: Removed hardcoded md:ml-[280px]. App.js entirely controls the layout wrapper!
    <div className="w-full min-h-screen relative overflow-visible" style={{ marginTop: '64px' }}>

      {/* 🌐 DYNAMIC GRID BACKGROUND OVERLAY */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] dark:invert-0 invert z-0" 
           style={{ backgroundImage: 'linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>

      {/* HERO HEADER */}
      <div className="sticky top-0 z-30 px-4 py-8 md:py-12 transition-all overflow-hidden bg-transparent">
        <div className="max-w-4xl mx-auto flex flex-col items-center justify-center relative z-10">
          <UserGroupIcon className="w-10 h-10 md:w-14 md:h-14 text-indigo-500 mb-5 stroke-[1.5]" />
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-center mb-2 pb-4 leading-normal tracking-tight text-slate-900 dark:text-white">
            <span className="text-brand-highlight">{typingTitle}</span>
            <motion.span animate={{ opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 0.9 }} className="inline-block w-2.5 md:w-3 h-[0.8em] bg-indigo-500 ml-2 align-baseline" />
          </h1>
          <p className="text-[9px] md:text-[11px] font-mono font-bold uppercase tracking-[0.3em] md:tracking-[0.4em] text-slate-600 dark:text-slate-400 mb-8 md:mb-12 text-center px-4">
            Live Threat Intelligence & Community Reports
          </p>

          <AnimatePresence>
            {hasActiveBuzzer && !alarmMuted && (
              <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9 }} className="w-full max-w-2xl bg-red-600/90 backdrop-blur-md text-white p-4 flex flex-col sm:flex-row justify-between items-center rounded-[1.5rem] mb-6 shadow-[0_0_30px_rgba(220,38,38,0.6)] border border-red-400 z-50 gap-4">
                <div className="flex items-center gap-3"><SpeakerWaveIcon className="w-8 h-8 animate-pulse" /> <div className="text-left"><div className="font-black uppercase tracking-widest text-sm md:text-base drop-shadow-md">Critical Alert Active</div><div className="text-[10px] font-medium opacity-90 drop-shadow-sm">Official broadcast requires attention</div></div></div>
                <button onClick={stopAlarm} className="px-6 py-2.5 bg-white text-red-600 hover:bg-red-50 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg transition-colors w-full sm:w-auto">Silence Alarm</button>
              </motion.div>
            )}
          </AnimatePresence>
          
          <div className="hidden md:flex w-full max-w-2xl px-2 overflow-hidden justify-center">
            <div className="p-1.5 flex items-center gap-1 rounded-full glass-input transition-all flex-wrap justify-center">
              {['All', 'Web Scams', 'Media Fakes', 'Verified', 'Official'].map(f => (
                <button key={f} onClick={() => setFilter(f)} className={`relative px-6 py-2.5 rounded-full text-[10px] md:text-[11px] font-black uppercase tracking-widest transition-all duration-300 flex-shrink-0 ${filter === f ? 'text-white' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'}`}>
                  {filter === f && <motion.div layoutId="activeFilter" className={`absolute inset-0 rounded-full shadow-lg ${f === 'Verified' ? 'bg-emerald-600' : f === 'Web Scams' ? 'bg-orange-600' : f === 'Media Fakes' ? 'bg-purple-600' : f === 'Official' ? 'bg-red-600' : 'bg-indigo-600'}`} transition={{ type: 'spring', stiffness: 400, damping: 30 }} />}
                  <span className="relative z-10">{f}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="md:hidden relative mt-1 w-max mx-auto">
            <button onClick={() => setShowHeaderMenu(true)} className="flex items-center gap-2 px-6 py-2.5 rounded-full glass-card transition-all text-slate-900 dark:text-white"><FunnelIcon className={`w-4 h-4 ${filter === 'All' ? 'text-indigo-500' : filter === 'Verified' ? 'text-emerald-500' : filter === 'Official' ? 'text-red-500' : filter === 'Web Scams' ? 'text-orange-500' : 'text-purple-500'}`} /><span className="text-[11px] font-black uppercase tracking-widest">{filter}</span></button>
          </div>

          <div className="absolute right-0 top-0 hidden md:flex items-center gap-3">
            {!isAuthority ? ( <button onClick={() => setShowAuthModal(true)} className="text-[10px] uppercase tracking-widest px-5 py-2.5 rounded-full font-bold glass-card hover:text-indigo-500 transition-all text-slate-700 dark:text-slate-300">Authority Login</button> ) : (
              <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 px-3 py-1.5 rounded-xl backdrop-blur-md"><UserGroupIcon className="w-4 h-4 text-red-500"/><div className="flex flex-col items-start px-1 mr-2"><span className="text-[9px] text-red-500 font-black tracking-widest uppercase">Gov ID Active</span><span className="text-[8px] font-bold text-slate-600 dark:text-slate-400 uppercase">{authForm.name}</span></div><button onClick={() => { setIsAuthority(false); setAuthForm({ name: '', agency: '', code: '' }); localStorage.removeItem('xist_authority_session'); toast.success("Deauthorized"); stopAlarm(); }} className="p-1 rounded-md hover:bg-red-500/20 text-red-500 transition-all"><XMarkIcon className="w-4 h-4" /></button></div>
            )}
          </div>
        </div>
      </div>

      {/* 🚀 FEED CONTAINER: This reference defines exactly where the input bar tracks! */}
      <div ref={feedContainerRef} className="max-w-4xl mx-auto p-4 md:p-8 relative z-10 pb-32">
        {loading ? ( <div className="flex justify-center py-24"><ArrowPathIcon className="w-8 h-8 text-indigo-500 animate-spin" /></div> ) : (
          <div className="flex flex-col gap-8">
            
            {topLevelPosts.map((threat) => {
              const isOfficial = threat.location?.includes('Official') || threat.is_buzzer || threat.is_pinned;
              const isBuzzer = threat.is_buzzer;
              const safeType = threat.threat_type || 'Unknown';
              const isMedia = safeType.toLowerCase().includes('media') || safeType.toLowerCase().includes('deepfake');
              const alignmentClass = isOfficial ? 'self-end' : 'self-start';
              const widthClass = 'w-full md:w-[85%]';
              const replies = filteredPosts.filter(p => p.parent_id === threat.id);
              const identity = getPostIdentity(threat);
              return (
              <motion.div key={threat.id} layout className={`flex flex-col ${widthClass} ${alignmentClass}`}>
                <div onClick={() => setSelectedThreat(threat)} className={`glass-card p-6 md:p-8 cursor-pointer group relative transition-all rounded-[2rem] border-t-2 ${isOfficial ? 'border-t-red-500' : 'border-t-indigo-500'}`}>
                  <div className="flex items-start justify-between mb-4 z-10 relative">
                    <div onClick={(e) => openUserProfile(threat.user_id, threat.profiles, e)} className="flex items-center gap-3 group-hover:bg-black/5 dark:group-hover:bg-white/5 p-2 -ml-2 rounded-2xl transition-all">
                      <div className={`w-10 h-10 rounded-full overflow-hidden shrink-0 border-2 flex items-center justify-center ${identity.isOfficial ? 'border-red-500/50 bg-red-500/10 text-red-500' : 'border-indigo-500/30 bg-slate-100 dark:bg-slate-800'}`}>
                        <TacticalAvatar identifier={identity.avatar} />
                      </div>
                      <div className="flex flex-col">
                        <span className={`text-[11px] font-black uppercase tracking-widest flex items-center gap-1 ${identity.isOfficial ? 'text-red-500' : 'text-slate-900 dark:text-white group-hover:text-indigo-500 dark:group-hover:text-indigo-400'}`}>
                          {identity.author} {identity.isOfficial && <ShieldCheckIcon className="w-3.5 h-3.5" />}
                        </span>
                        <span className="text-[9px] text-slate-500 font-bold tracking-wider">
                          {timeAgo(threat.created_at)} {identity.isOfficial && ` • ${identity.agency}`}
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-col md:flex-row items-end md:items-center gap-2">
                      {isBuzzer && <span className="flex items-center gap-1 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest bg-red-600 text-white shadow-[0_0_10px_rgba(220,38,38,0.5)]"><SpeakerWaveIcon className="w-3.5 h-3.5" /> Alert</span>}
                      <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest glass-input ${isOfficial ? 'text-red-500' : 'text-slate-600 dark:text-slate-400'}`}>{safeType}</span>
                    </div>
                  </div>

                  <div className="z-10 relative">
                    <h3 className={`text-xl md:text-2xl font-black mb-2 leading-tight ${isBuzzer ? 'text-red-600 dark:text-red-400' : 'text-slate-900 dark:text-white'}`}>{threat.title}</h3>
                    <p className="text-sm md:text-base leading-relaxed whitespace-pre-wrap font-medium text-slate-700 dark:text-slate-300 mb-2">{threat.description}</p>
                    {threat.media_url && <div className="mt-4 text-[10px] font-black uppercase text-indigo-500 tracking-widest flex items-center gap-1.5"><PhotoIcon className="w-4 h-4" /> Media Attached</div>}
                  </div>

                  <div className="flex items-center justify-between pt-5 mt-5 border-t border-black/10 dark:border-white/10 z-10 relative">
                    <div className="flex items-center gap-6">
                      <button onClick={(e) => handleLike(threat.id, e)} className={`flex items-center gap-2 text-[11px] font-black transition-all ${threat.user_liked ? 'text-rose-500' : 'text-slate-500 hover:text-rose-500'}`}><HeartIcon className={`w-5 h-5 ${threat.user_liked ? 'fill-rose-500' : ''}`} /> {threat.likes_count}</button>
                      <button onClick={(e) => initiateReply(threat, e)} className="flex items-center gap-2 text-[11px] font-black text-slate-500 hover:text-indigo-500 dark:hover:text-indigo-400 transition-all"><ChatBubbleLeftRightIcon className="w-5 h-5" /> {replies.length}</button>
                      <button onClick={(e) => handleShare(threat, e)} className="text-slate-500 hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors"><ShareIcon className="w-5 h-5" /></button>
                      {(threat.user_id === currentUserId || isDeveloperNode) && <button onClick={(e) => handleDeletePost(threat.id, e)} className="text-slate-500 hover:text-rose-500 transition-colors"><TrashIcon className="w-5 h-5" /></button>}
                      {isAuthority && threat.user_id !== currentUserId && !isDeveloperNode && <button onClick={(e) => handleHidePost(threat.id, e)} className="text-slate-500 hover:text-red-500 transition-colors"><EyeSlashIcon className="w-5 h-5" /></button>}
                    </div>
                  </div>
                </div>

                {replies.length > 0 && (
                  <div className={`mt-3 ml-6 md:ml-12 pl-6 border-l-[3px] border-indigo-500/30 flex flex-col gap-4 relative`}>
                    <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-indigo-500/20 border-2 border-indigo-500/50"></div>
                    {replies.map(reply => (
                      <div key={reply.id} className="glass-card !bg-transparent !backdrop-blur-sm p-4 md:p-5 rounded-[1.5rem] relative group border border-black/5 dark:border-white/5 shadow-none hover:shadow-lg transition-all">
                         <div className="flex items-center gap-3 mb-2"><div className="w-6 h-6 rounded-full overflow-hidden border border-black/10 dark:border-white/10 bg-slate-100 dark:bg-slate-800"><TacticalAvatar identifier={reply.profiles?.avatar_url} /></div><span className="text-[10px] font-black uppercase tracking-widest text-slate-800 dark:text-slate-300">{reply.profiles?.username || 'User'}</span><span className="text-[9px] font-bold text-slate-500">{timeAgo(reply.created_at)}</span>{(reply.user_id === currentUserId || isDeveloperNode) && (<button onClick={(e) => handleDeletePost(reply.id, e)} className="ml-auto opacity-0 group-hover:opacity-100 text-slate-500 hover:text-rose-500 transition-all"><TrashIcon className="w-4 h-4"/></button>)}</div>
                         <p className="text-sm pl-9 leading-relaxed text-slate-700 dark:text-slate-300 font-medium">{reply.description.replace(/\[Reply to.*?\]\s*/, '')}</p>
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
      {/* 🚀 STICKY PRO-STYLE COMPACT INPUT BAR       */}
      {/* ========================================= */}
      <div 
        className="fixed bottom-[70px] md:bottom-6 z-40 flex justify-center transition-all duration-75 pointer-events-none"
        style={{ left: inputPosition.left, width: inputPosition.width }}
      >
        <div className="w-full max-w-2xl px-3 md:px-0 pointer-events-auto relative">
          
          {replyTo && (
            <div className="bg-indigo-600 text-white text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-t-[0.75rem] w-max ml-4 flex items-center gap-2 shadow-lg">
              <ArrowUturnLeftIcon className="w-3 h-3" /> Replying to {replyTo.username}
              <button onClick={() => setReplyTo(null)} className="ml-2 hover:bg-white/20 p-0.5 rounded-full"><XMarkIcon className="w-3 h-3" /></button>
            </div>
          )}

          {/* COMPRESSED PRO PILL */}
          <div className={`relative flex items-center p-1 md:p-1.5 rounded-full shadow-[0_20px_50px_rgba(0,0,0,0.4)] backdrop-blur-xl border ${
              isAuthority ? 'bg-red-50/90 border-red-300 dark:bg-red-950/80 dark:border-red-500/50' : 'glass-card !bg-opacity-100 border-white/20 dark:border-white/10'
            } ${replyTo ? 'rounded-tl-none' : ''}`}>
            
            <button onClick={() => document.getElementById('file-upload').click()} className={`p-1.5 mx-0.5 rounded-full transition-all flex-shrink-0 ${isAuthority ? 'text-red-500 hover:bg-red-500/10' : 'text-indigo-500 hover:bg-indigo-500/10'}`}>
              <PlusCircleIcon className="w-5 h-5 md:w-6 md:h-6" />
            </button>
            
            {/* THIN INPUT BOX */}
            <input 
              ref={inputRef}
              value={postText} 
              onChange={(e) => setPostText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendPost()}
              placeholder={replyTo ? "Write a reply..." : (isAuthority ? "Broadcast official alert..." : "Message Xist Intelligence...")}
              className="flex-1 bg-transparent bg-none appearance-none border-none outline-none py-1.5 text-sm px-2 font-medium w-full shadow-none focus:ring-0 focus:outline-none text-slate-900 dark:text-white placeholder-slate-500"
              style={{ backgroundColor: 'transparent', boxShadow: 'none', WebkitAppearance: 'none' }}
            />

            {!replyTo && (
              <div className="relative flex items-center justify-center border-l border-black/10 dark:border-white/10 ml-1 pl-1.5">
                
                {/* INLINE PRO DROPDOWN BUTTON */}
                <button onClick={() => setShowCategoryMenu(!showCategoryMenu)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all text-slate-600 dark:text-slate-300 hover:bg-black/5 dark:hover:bg-white/5 border border-transparent hover:border-black/10 dark:hover:border-white/10">
                  <span className={`w-2 h-2 rounded-full ${postCategory === 'Web Scam' ? 'bg-orange-500' : postCategory === 'Deepfake Media' ? 'bg-purple-500' : 'bg-red-500'}`} />
                  <span className="hidden sm:block text-[10px] font-black uppercase tracking-widest">{postCategory.split(' ')[0]}</span>
                  <svg className={`w-3 h-3 opacity-60 transition-transform ${showCategoryMenu ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* INLINE POP-UP MENU */}
                <AnimatePresence>
                  {showCategoryMenu && (
                    <motion.div initial={{ opacity: 0, y: 10, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 10, scale: 0.95 }} className="absolute bottom-[calc(100%+12px)] right-0 w-40 rounded-2xl shadow-2xl border p-1.5 z-[60] glass-card">
                      {[
                        { id: 'Web Scam', label: 'Web Scam', color: 'bg-orange-500' },
                        { id: 'Deepfake Media', label: 'Media Fake', color: 'bg-purple-500' },
                        { id: 'General Alert', label: 'General Alert', color: 'bg-red-500' }
                      ].map(cat => (
                        <button key={cat.id} onClick={() => { setPostCategory(cat.id); setShowCategoryMenu(false); }} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${postCategory === cat.id ? 'bg-black/10 dark:bg-white/10 text-slate-900 dark:text-white' : 'text-slate-600 dark:text-slate-400 hover:bg-black/5 dark:hover:bg-white/5'}`}> 
                          <span className={`w-2 h-2 rounded-full ${cat.color}`} /> {cat.label} 
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            {isAuthority && !replyTo && (
              <div className="hidden sm:flex items-center gap-1 px-2 border-l border-red-500/30 ml-2">
                <button onClick={() => setAuthControls({...authControls, isPinned: !authControls.isPinned})} className={`p-1.5 rounded-full transition-all ${authControls.isPinned ? 'bg-red-500 text-white' : 'text-red-500 hover:bg-red-500/10'}`}><ChartBarIcon className="w-4 h-4"/></button>
                <button onClick={() => setAuthControls({...authControls, isBuzzer: !authControls.isBuzzer})} className={`p-1.5 rounded-full transition-all ${authControls.isBuzzer ? 'bg-red-500 text-white animate-pulse' : 'text-red-500 hover:bg-red-500/10'}`}><SpeakerWaveIcon className="w-4 h-4"/></button>
              </div>
            )}

            <button onClick={handleSendPost} disabled={isPublishing || !postText.trim()} className={`p-2 rounded-full transition-all ml-1 mr-0.5 flex-shrink-0 ${!postText.trim() ? 'opacity-30 cursor-not-allowed glass-input' : isAuthority ? 'bg-red-600 text-white shadow-[0_0_15px_rgba(220,38,38,0.5)]' : 'bg-indigo-600 text-white shadow-[0_0_15px_rgba(79,70,229,0.5)] hover:scale-105'}`}>
              {isPublishing ? <ArrowPathIcon className="w-4 h-4 animate-spin" /> : <PaperAirplaneIcon className="w-4 h-4 ml-0.5" />}
            </button>
          </div>
        </div>
        <input id="file-upload" type="file" className="hidden" accept="image/*,video/*" onChange={(e) => { const file = e.target.files[0]; if (file) toast.success(`Selected: ${file.name}`, { icon: '📁' }); }} />
      </div>

      {/* ========================================= */}
      {/* 🚀 MODALS (REPORT DETAIL & PROFILE)         */}
      {/* ========================================= */}
      <AnimatePresence>
        {selectedThreat && (
          <motion.div key="threat-modal" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[60] flex items-center justify-center p-3 sm:p-4">
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={() => setSelectedThreat(null)} />
            <motion.div initial={{ scale: 0.9, y: 40 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }} className="relative w-full max-w-2xl max-h-[85vh] flex flex-col z-10 rounded-[2rem] shadow-2xl overflow-hidden border glass-card">
              <div className="px-6 py-4 border-b border-black/10 dark:border-white/10 flex justify-between items-center sticky top-0 z-20 backdrop-blur-2xl">
                 <div className="flex items-center gap-3 cursor-pointer group" onClick={(e) => {setSelectedThreat(null); openUserProfile(selectedThreat.user_id, selectedThreat.profiles, e);}}>
                   {(() => {
                      const modalId = getPostIdentity(selectedThreat);
                      return (
                        <>
                          <div className={`w-12 h-12 rounded-full overflow-hidden shrink-0 border-2 flex items-center justify-center ${modalId.isOfficial ? 'border-red-500/50 bg-red-500/10 text-red-500' : 'border-indigo-500/30 bg-slate-100 dark:bg-slate-800'}`}>
                            <TacticalAvatar identifier={modalId.avatar} />
                          </div>
                          <div>
                            <div className={`text-[10px] font-black uppercase tracking-[0.2em] mb-0.5 ${modalId.isOfficial ? 'text-red-500' : 'text-indigo-600 dark:text-indigo-400'}`}>
                              {modalId.isOfficial ? modalId.agency : 'Reported By'}
                            </div>
                            <div className="text-base font-black tracking-tight text-slate-900 dark:text-white group-hover:text-indigo-500 transition-colors line-clamp-1">
                              {modalId.author}
                            </div>
                          </div>
                        </>
                      );
                   })()}
                 </div>
                 <button onClick={() => setSelectedThreat(null)} className="p-2 rounded-full glass-input hover:text-indigo-500 transition-all text-slate-800 dark:text-slate-300"><XMarkIcon className="w-6 h-6" /></button>
              </div>
              <div className="flex-grow overflow-y-auto p-6 md:p-8 custom-scrollbar relative z-10">
                <h2 className="text-2xl md:text-3xl font-black mb-6 leading-tight tracking-tighter text-slate-900 dark:text-white"><DecodedText text={selectedThreat.title} /></h2>
                {selectedThreat.media_url && (<div className="mb-6 rounded-2xl overflow-hidden border border-black/10 dark:border-white/10 bg-black flex items-center justify-center shadow-lg relative"><RenderForensicMedia url={selectedThreat.media_url} className="max-h-[300px] object-contain" /></div>)}
                <div className="p-6 rounded-2xl text-base leading-relaxed whitespace-pre-wrap font-medium shadow-inner glass-input text-slate-800 dark:text-slate-200">{selectedThreat.description}</div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {profileData && (
          <motion.div key="profile-modal" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[999999] flex items-center justify-center p-4">
             <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={() => setProfileData(null)} />
             <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }} className="glass-card p-10 max-w-sm w-full text-center relative z-10 rounded-[2.5rem] shadow-2xl">
              <button onClick={() => setProfileData(null)} className="absolute top-6 right-6 p-2 rounded-full glass-input hover:text-indigo-500 transition-all text-slate-800 dark:text-slate-300"><XMarkIcon className="w-5 h-5" /></button>
              <div className="w-28 h-28 mx-auto rounded-full overflow-hidden border-4 border-indigo-500/30 mb-6 flex items-center justify-center bg-slate-100 dark:bg-slate-800"><TacticalAvatar identifier={profileData.avatarUrl} /></div>
              <h2 className="text-3xl font-black tracking-tight mb-2 text-slate-900 dark:text-white">{profileData.username}</h2>
              <div onClick={() => { navigator.clipboard.writeText(profileData.userId); toast.success("ID Copied"); }} className="cursor-pointer text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-indigo-500 mb-8">ID: {profileData.userId.substring(0, 8)}...</div>
              <div className="grid grid-cols-2 gap-4"><div className="glass-input p-5 rounded-[1.5rem] border flex flex-col items-center justify-center"><div className="text-4xl font-black text-slate-900 dark:text-white">{profileData.postCount}</div><div className="text-[10px] text-slate-500 font-black uppercase tracking-widest mt-2">Posts</div></div><div className="glass-input p-5 rounded-[1.5rem] border flex flex-col items-center justify-center"><div className="text-4xl font-black text-slate-900 dark:text-white">{profileData.totalLikes}</div><div className="text-[10px] text-slate-500 font-black uppercase tracking-widest mt-2">Impact</div></div></div>
             </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* HEADER FILTER MODAL */}
      <AnimatePresence>
        {showHeaderMenu && (
          <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowHeaderMenu(false)} />
            <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }} className="relative w-64 rounded-[2rem] shadow-2xl flex flex-col z-10 glass-card">
              <div className="p-5 border-b border-black/10 dark:border-white/10 text-center text-xs font-black uppercase tracking-widest text-slate-800 dark:text-slate-300">Select Filter</div>
              {['All', 'Web Scams', 'Media Fakes', 'Verified', 'Official'].map(f => (
                <button key={f} onClick={() => { setFilter(f); setShowHeaderMenu(false); }} className={`w-full text-center px-5 py-4 text-[11px] font-black uppercase tracking-widest transition-all ${filter === f ? 'bg-indigo-600 text-white' : 'text-slate-700 dark:text-slate-300 hover:bg-black/5 dark:hover:bg-white/5'}`}> {f} </button>
              ))}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showAuthModal && (
          <motion.div key="auth-modal" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-slate-900/80 backdrop-blur-md flex items-center justify-center z-[100] p-4">
            <div className="absolute inset-0" onClick={() => setShowAuthModal(false)} />
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} className="glass-card p-10 rounded-[2.5rem] w-full max-w-sm shadow-2xl relative overflow-hidden z-10 border-t-4 border-t-red-600">
              <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-1 flex items-center gap-2"><ShieldCheckIcon className="w-7 h-7 text-red-600"/> Authority Gateway</h3>
              <p className="text-[10px] text-slate-500 mb-8 uppercase tracking-widest font-bold">Secure Official Access</p>
              <div className="space-y-4 mb-8 text-left">
                <div><label className="text-[10px] uppercase tracking-widest font-bold text-slate-600 dark:text-slate-400 ml-2">Officer Name</label><input type="text" value={authForm.name} onChange={e=>setAuthForm({...authForm, name: e.target.value})} className="w-full p-4 glass-input rounded-2xl text-sm font-bold outline-none focus:border-red-500 text-slate-900 dark:text-white" placeholder="e.g. Insp. Sharma" /></div>
                <div><label className="text-[10px] uppercase tracking-widest font-bold text-slate-600 dark:text-slate-400 ml-2">Agency / Department</label><input type="text" value={authForm.agency} onChange={e=>setAuthForm({...authForm, agency: e.target.value})} className="w-full p-4 glass-input rounded-2xl text-sm font-bold outline-none focus:border-red-500 text-slate-900 dark:text-white" placeholder="e.g. Cyber Cell" /></div>
                <div><label className="text-[10px] uppercase tracking-widest font-bold text-slate-600 dark:text-slate-400 ml-2">Access Code</label><input type="password" value={authForm.code} onChange={e=>setAuthForm({...authForm, code: e.target.value})} onKeyDown={e => e.key === 'Enter' && handleAuthorityLogin()} className="w-full p-4 glass-input rounded-2xl text-red-500 font-mono text-center tracking-widest outline-none focus:border-red-500 text-lg" placeholder="••••••••" /></div>
              </div>
              <div className="flex gap-4">
                <button onClick={handleAuthorityLogin} className="flex-1 bg-red-600 hover:bg-red-500 text-white py-3.5 rounded-2xl font-black uppercase tracking-widest text-xs shadow-lg shadow-red-600/20 transition-all">Verify</button>
                <button onClick={()=>setShowAuthModal(false)} className="flex-1 glass-input py-3.5 rounded-2xl font-black uppercase tracking-widest text-xs text-slate-800 dark:text-slate-300 hover:text-red-500 transition-all">Cancel</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}