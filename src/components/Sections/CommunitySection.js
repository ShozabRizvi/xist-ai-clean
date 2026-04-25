import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import {
  ChatBubbleLeftRightIcon, CheckCircleIcon, ShareIcon, 
  HeartIcon, ShieldCheckIcon, ArrowPathIcon, TrashIcon, 
  UserCircleIcon, ChartBarIcon, FunnelIcon, MicrophoneIcon,
  VideoCameraIcon, PhotoIcon, SunIcon, MoonIcon,
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
  
  const feedContainerRef = useRef(null);
  const [inputPosition, setInputPosition] = useState({ left: 0, width: '100%' });
  
  // 🚀 NEW: State to track if we hit the footer
  const [isAtBottom, setIsAtBottom] = useState(false);

  // 🚀 NEW: Scroll Listener to detect the footer
  useEffect(() => {
    const handleScroll = () => {
      const docHeight = document.documentElement.scrollHeight;
      const scrollPos = window.scrollY + window.innerHeight;
      // If within 300px of the bottom (where the footer is), hide the input bar
      if (docHeight - scrollPos < 300) {
        setIsAtBottom(true);
      } else {
        setIsAtBottom(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial check on load
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isPublishing, setIsPublishing] = useState(false);
  const [filter, setFilter] = useState('All');
  const [selectedThreat, setSelectedThreat] = useState(null); 
  const [profileData, setProfileData] = useState(null); 

  const [showHeaderMenu, setShowHeaderMenu] = useState(false);
  const [showCategoryMenu, setShowCategoryMenu] = useState(false);
  const [showDeadlineMenu, setShowDeadlineMenu] = useState(false);

  const [localIdentity, setLocalIdentity] = useState({ alias: 'USER', avatar: 'ghost' });
  const currentUserId = user?.id || user?.uid;
  const DEVELOPER_UUID = 'PASTE_YOUR_COPIED_UUID_HERE'; 
  const isDeveloperNode = (user?.email && user.email.toLowerCase() === 'rshozab64@gmail.com') || currentUserId === DEVELOPER_UUID;

  const [isAuthority, setIsAuthority] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authForm, setAuthForm] = useState({ name: '', agency: '', code: '' });
  
  const [postText, setPostText] = useState('');
  const [postCategory, setPostCategory] = useState('Web Scam');
  const [replyTo, setReplyTo] = useState(null);
  
  const [authDeadline, setAuthDeadline] = useState(2); 

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
    const observer = new ResizeObserver(updatePos);
    observer.observe(document.body);
    window.addEventListener('resize', updatePos);
    return () => {
      observer.disconnect();
      window.removeEventListener('resize', updatePos);
    };
  }, []);

  useEffect(() => {
    const savedUser = localStorage.getItem('xist_operator_identity');
    if (savedUser) setLocalIdentity(JSON.parse(savedUser));
    
    const savedAuth = localStorage.getItem('xist_authority_session');
    if (savedAuth) { setIsAuthority(true); setAuthForm(JSON.parse(savedAuth)); }
  }, []);

 // 🚀 1. THE SILENT FETCHER (No spinners allowed!)
  const loadPosts = useCallback(async () => {
    try {
      const { data, error } = await supabase.from('community_threats')
        .select(`*, threat_likes(user_id), profiles(username, avatar_url)`)
        .eq('is_hidden', false).order('created_at', { ascending: true }); 

      if (error) throw error;
      
      let formatted = data.map(p => ({ ...p, likes_count: p.threat_likes?.length || 0, user_liked: p.threat_likes?.some(like => like.user_id === currentUserId) }));
      setPosts(formatted || []);
    } catch (error) { 
      console.error('Feed sync error'); 
    }
  }, [currentUserId]);

  useEffect(() => {
    let isMounted = true;
    
    const initialLoad = async () => {
      setLoading(true); // Spinner ONLY turns on here
      await loadPosts();
      if (isMounted) {
        setLoading(false); // Spinner turns off
        setTimeout(() => endOfFeedRef.current?.scrollIntoView({ behavior: 'smooth' }), 300);
      }
    };
    
    initialLoad();

    // Background listener triggers the silent fetch without spinners!
    const channel = supabase.channel('feed_realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'community_threats' }, () => {
         loadPosts();
      }).subscribe();
      
    return () => {
      isMounted = false;
      supabase.removeChannel(channel);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUserId]); // 🚀 Removing loadPosts from this array permanently fixes the infinite spinner bug!

  // 🚀 NEW: Auto-open post when navigating from Notification Bell
  useEffect(() => {
    if (posts.length > 0) {
      const focusId = sessionStorage.getItem('xist_focus_post');
      if (focusId) {
        const targetPost = posts.find(p => String(p.id) === String(focusId));
        if (targetPost) {
          setSelectedThreat(targetPost);
          sessionStorage.removeItem('xist_focus_post');
        }
      }
    }
  }, [posts]);

  const handleSendPost = async () => {
    if (!postText.trim()) return toast.error('Please type a message');
    setIsPublishing(true);
    try {
      if (currentUserId) await supabase.from('profiles').upsert({ id: currentUserId, username: localIdentity.alias, avatar_url: localIdentity.avatar });
      
      let deadlineDate = null;
      if (isAuthority) {
        deadlineDate = new Date();
        deadlineDate.setDate(deadlineDate.getDate() + parseInt(authDeadline));
      }

      const payload = {
        user_id: currentUserId, 
        title: isAuthority ? 'Official Alert' : (replyTo ? `Reply to ${replyTo.username}` : 'Community Update'), 
        description: postText, 
        threat_type: postCategory, 
        location: isAuthority ? `Official: ${authForm.agency} | ${authForm.name}` : 'Global',
        is_pinned: isAuthority, 
        pinned_at: deadlineDate ? deadlineDate.toISOString() : null, 
        parent_id: replyTo ? replyTo.id : null
      };

      const { error } = await supabase.from('community_threats').insert(payload);
      if (error) {
         if (error.message.includes('parent_id')) {
            delete payload.parent_id; payload.description = replyTo ? `[Reply to ${replyTo.username}] ${postText}` : postText;
            await supabase.from('community_threats').insert(payload);
         } else throw error;
      }
      
      setPostText(''); setReplyTo(null);
      toast.success(isAuthority ? 'Official Alert Sent' : 'Message Posted'); 
      // 🚀 Silent update, but WE DO scroll to bottom to see the new post!
      loadPosts(false, true);
    } catch (error) { toast.error('Post failed'); } finally { setIsPublishing(false); }
  };

  const handleDeletePost = async (id, e) => {
    if (e) e.stopPropagation();
    if (!window.confirm("Delete this post permanently?")) return;
    try { 
      await supabase.from('community_threats').delete().eq('id', id); 
      toast.success('Deleted'); 
      if (selectedThreat?.id === id) setSelectedThreat(null); 
      loadPosts(false, false); // 🚀 Silent update
    } catch (error) { toast.error('Failed to delete.'); }
  };

  const handleHidePost = async (id, e) => {
    if (e) e.stopPropagation();
    if (!window.confirm("Authority Action: Hide this post from the public?")) return;
    try { 
      await supabase.from('community_threats').update({ is_hidden: true }).eq('id', id); 
      toast.success('Post hidden.'); 
      loadPosts(false, false); // 🚀 Silent update
    } catch (error) { toast.error('Failed to hide.'); }
  };

  const handleLike = async (id, e) => {
    if (e) e.stopPropagation();
    if (!currentUserId) return toast.error('Authentication required');
    const { data: existing } = await supabase.from('threat_likes').select('*').eq('threat_id', id).eq('user_id', currentUserId).maybeSingle(); 
    if (existing) await supabase.from('threat_likes').delete().eq('threat_id', id).eq('user_id', currentUserId);
    else await supabase.from('threat_likes').insert({ threat_id: id, user_id: currentUserId });
    
    // 🚀 Update the likes silently without reloading the screen or jumping!
    loadPosts(false, false);
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

  const getPostIdentity = (threat) => {
    const isOfficial = threat.location?.startsWith('Official:');
    let author = threat.user_id === currentUserId ? localIdentity.alias : (threat.profiles?.username || `User-${threat.user_id?.substring(0,4).toUpperCase()}`);
    let avatar = threat.user_id === currentUserId ? localIdentity.avatar : threat.profiles?.avatar_url;
    let agency = 'Global';

    if (isOfficial) {
      const parts = threat.location.split(' | ');
      agency = parts[0].replace('Official: ', '');
      author = parts[1] || 'Official Authority';
      avatar = agency.toLowerCase().includes('cyber') ? 'chip' : 'shield';
    } 
    return { isOfficial, author, avatar, agency };
  };

  const filteredPosts = posts.filter(post => {
    if (filter === 'All') return true;
    if (filter === 'Verified') return post.is_verified === true;
    if (filter === 'Official') return post.location?.includes('Official');
    const safeType = (post.threat_type || '').toLowerCase();
    if (filter === 'Media Fakes') return safeType.includes('media') || safeType.includes('deepfake');
    if (filter === 'Web Scams') return safeType.includes('web') || safeType.includes('scam') || safeType.includes('malware');
    return true;
  });

  const topLevelPosts = filteredPosts.filter(p => !p.parent_id);
  const now = new Date();
  
  const chatPosts = topLevelPosts.filter(p => !(p.location?.includes('Official') && p.pinned_at && new Date(p.pinned_at) >= now));
  const activeAuthPosts = topLevelPosts.filter(p => p.location?.includes('Official') && p.pinned_at && new Date(p.pinned_at) >= now);

  return (
    <div className="w-full min-h-screen relative overflow-visible" style={{ marginTop: '64px' }}>

      <div className="absolute inset-0 pointer-events-none opacity-[0.03] dark:invert-0 invert z-0" 
           style={{ backgroundImage: 'linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>

      {/* HERO HEADER */}
      <div className="sticky top-0 z-30 px-4 py-8 md:py-12 transition-all overflow-hidden bg-transparent">
        <div className="max-w-4xl mx-auto flex flex-col items-center justify-center relative z-10">
          <UserGroupIcon className="w-10 h-10 md:w-14 md:h-14 text-indigo-500 mb-5 stroke-[1.5]" />
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-center mb-2 pb-4 leading-tight tracking-tight text-slate-950 dark:text-white">
            <span className="text-brand-highlight">{typingTitle}</span>
            <motion.span animate={{ opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 0.9 }} className="inline-block w-2.5 md:w-3 h-[0.8em] bg-indigo-500 dark:bg-indigo-400 ml-2 align-baseline" />
          </h1>
          <p className="text-[9px] md:text-[11px] font-mono font-bold uppercase tracking-[0.3em] md:tracking-[0.4em] text-slate-600 dark:text-slate-400 mb-8 md:mb-12 text-center px-4">
            Live Threat Intelligence & Community Reports
          </p>
          
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
              <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 px-3 py-1.5 rounded-xl backdrop-blur-md"><UserGroupIcon className="w-4 h-4 text-red-500"/><div className="flex flex-col items-start px-1 mr-2"><span className="text-[9px] text-red-500 font-black tracking-widest uppercase">Gov ID Active</span><span className="text-[8px] font-bold text-slate-600 dark:text-slate-400 uppercase">{authForm.name}</span></div><button onClick={() => { setIsAuthority(false); setAuthForm({ name: '', agency: '', code: '' }); localStorage.removeItem('xist_authority_session'); toast.success("Deauthorized"); }} className="p-1 rounded-md hover:bg-red-500/20 text-red-500 transition-all"><XMarkIcon className="w-4 h-4" /></button></div>
            )}
          </div>
        </div>
      </div>

      <div ref={feedContainerRef} className="max-w-4xl mx-auto p-4 md:p-8 relative z-10 pb-32">
        {loading ? ( <div className="flex justify-center py-24"><ArrowPathIcon className="w-8 h-8 text-indigo-500 animate-spin" /></div> ) : (
          <div className="flex flex-col gap-6">
            
            {chatPosts.map((threat) => {
              const identity = getPostIdentity(threat);
              const isOfficial = identity.isOfficial;
              const safeType = threat.threat_type || 'Unknown';
              const replies = filteredPosts.filter(p => p.parent_id === threat.id);
              
              const alignmentClass = isOfficial ? 'self-end items-end' : 'self-start items-start';
              const bubbleClass = isOfficial 
                ? 'bg-red-50 dark:bg-red-950/30 border-r-4 border-red-500 rounded-tl-[2rem] rounded-l-[2rem] rounded-br-[2rem]' 
                : 'glass-input border-l-4 border-indigo-500 rounded-tr-[2rem] rounded-r-[2rem] rounded-bl-[2rem]';

              return (
              <motion.div key={threat.id} layout className={`flex flex-col w-full md:w-[75%] ${alignmentClass}`}>
                
                {/* Header (Avatar & Details) */}
                <div className={`flex items-center gap-3 mb-2 ${isOfficial ? 'flex-row-reverse' : 'flex-row'}`}>
                   <div className={`w-8 h-8 rounded-full overflow-hidden shrink-0 border flex items-center justify-center ${isOfficial ? 'border-red-500/50 bg-red-500/10 text-red-500' : 'border-indigo-500/30 bg-slate-100 dark:bg-slate-800'}`}>
                     <TacticalAvatar identifier={identity.avatar} />
                   </div>
                   <div className={`flex flex-col ${isOfficial ? 'items-end' : 'items-start'}`}>
                     <span className={`text-[10px] font-black uppercase tracking-widest flex items-center gap-1 ${isOfficial ? 'text-red-500' : 'text-slate-900 dark:text-white'}`}>
                       {identity.author} {isOfficial && <ShieldCheckIcon className="w-3 h-3" />}
                     </span>
                     <span className="text-[8px] text-slate-500 font-bold tracking-wider">
                       {timeAgo(threat.created_at)} {isOfficial && ` • ${identity.agency}`}
                     </span>
                   </div>
                </div>

                {/* Chat Bubble */}
                <div onClick={() => setSelectedThreat(threat)} className={`p-5 cursor-pointer shadow-sm relative transition-all hover:shadow-md ${bubbleClass} w-full`}>
                  <div className={`flex flex-wrap items-center gap-2 mb-3 ${isOfficial ? 'justify-end' : 'justify-start'}`}>
                    <span className={`px-2.5 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest ${isOfficial ? 'bg-red-500/20 text-red-600 dark:text-red-400' : 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400'}`}>{safeType}</span>
                  </div>
                  <h3 className={`text-base md:text-lg font-black mb-2 leading-tight ${isOfficial ? 'text-red-600 dark:text-red-400 text-right' : 'text-slate-900 dark:text-white text-left'}`}>{threat.title}</h3>
                  <p className={`text-xs md:text-sm leading-relaxed whitespace-pre-wrap font-medium ${isOfficial ? 'text-slate-800 dark:text-slate-300 text-right' : 'text-slate-700 dark:text-slate-300 text-left'}`}>{threat.description}</p>
                  {threat.media_url && <div className={`mt-3 text-[9px] font-black uppercase tracking-widest flex items-center gap-1 ${isOfficial ? 'justify-end text-red-500' : 'justify-start text-indigo-500'}`}><PhotoIcon className="w-3.5 h-3.5" /> Media Attached</div>}

                  {/* Actions Footer */}
                  <div className={`flex items-center gap-4 mt-4 pt-3 border-t border-black/5 dark:border-white/5 ${isOfficial ? 'justify-end' : 'justify-start'}`}>
                    <button onClick={(e) => handleLike(threat.id, e)} className={`flex items-center gap-1.5 text-[10px] font-black transition-all ${threat.user_liked ? 'text-rose-500' : 'text-slate-500 hover:text-rose-500'}`}><HeartIcon className={`w-4 h-4 ${threat.user_liked ? 'fill-rose-500' : ''}`} /> {threat.likes_count}</button>
                    <button onClick={(e) => initiateReply(threat, e)} className="flex items-center gap-1.5 text-[10px] font-black text-slate-500 hover:text-indigo-500 transition-all"><ChatBubbleLeftRightIcon className="w-4 h-4" /> {replies.length}</button>
                    <button onClick={(e) => handleShare(threat, e)} className="text-slate-500 hover:text-indigo-500 transition-colors"><ShareIcon className="w-4 h-4" /></button>
                    {(threat.user_id === currentUserId || isDeveloperNode) && <button onClick={(e) => handleDeletePost(threat.id, e)} className="text-slate-500 hover:text-rose-500 transition-colors"><TrashIcon className="w-4 h-4" /></button>}
                    {isAuthority && threat.user_id !== currentUserId && !isDeveloperNode && <button onClick={(e) => handleHidePost(threat.id, e)} className="text-slate-500 hover:text-red-500 transition-colors"><EyeSlashIcon className="w-4 h-4" /></button>}
                  </div>
                </div>

                {/* Replies */}
                {replies.length > 0 && (
                  <div className={`mt-3 w-[90%] border-indigo-500/30 flex flex-col gap-3 relative ${isOfficial ? 'self-end border-r-[3px] pr-4' : 'self-start border-l-[3px] pl-4'}`}>
                    {replies.map(reply => (
                      <div key={reply.id} className="glass-card !bg-transparent p-3 rounded-2xl relative border border-black/5 dark:border-white/5">
                         <div className={`flex items-center gap-2 mb-1 ${isOfficial ? 'flex-row-reverse' : ''}`}>
                            <div className="w-5 h-5 rounded-full overflow-hidden border border-black/10 dark:border-white/10"><TacticalAvatar identifier={reply.profiles?.avatar_url} /></div>
                            <span className="text-[9px] font-black uppercase tracking-widest text-slate-800 dark:text-slate-300">{reply.profiles?.username || 'User'}</span>
                         </div>
                         <p className={`text-xs text-slate-600 dark:text-slate-400 font-medium ${isOfficial ? 'text-right' : 'text-left'}`}>{reply.description.replace(/\[Reply to.*?\]\s*/, '')}</p>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            )})}
            
            {/* STICKY ACTIVE AUTHORITY POSTS */}
            {activeAuthPosts.length > 0 && (
               <div className="sticky bottom-0 z-20 flex flex-col gap-3 pt-6 pb-2 bg-gradient-to-t from-slate-50 via-slate-50 dark:from-[#0d001a] dark:via-[#0d001a] to-transparent pointer-events-none">
                 {activeAuthPosts.map((threat) => {
                   const identity = getPostIdentity(threat);
                   return (
                     <div key={threat.id} onClick={() => setSelectedThreat(threat)} className="w-full self-end bg-red-950/90 border border-red-500/50 backdrop-blur-xl p-4 rounded-2xl shadow-[0_0_20px_rgba(220,38,38,0.2)] cursor-pointer pointer-events-auto transform transition-all hover:scale-[1.01]">
                        <div className="flex justify-between items-center mb-2">
                           <span className="text-[10px] font-black text-red-500 uppercase tracking-widest flex items-center gap-1"><MegaphoneIcon className="w-4 h-4"/> Active Directive</span>
                           <span className="text-[9px] font-bold text-red-400 uppercase tracking-wider">Deadline: {new Date(threat.pinned_at).toLocaleDateString()}</span>
                        </div>
                        <h3 className="text-sm font-black text-white leading-snug mb-1">{threat.title}</h3>
                        <p className="text-xs text-red-200 line-clamp-2 font-medium">{threat.description}</p>
                     </div>
                   );
                 })}
               </div>
            )}
            
            {/* Invisible anchor to scroll into view */}
            <div ref={endOfFeedRef} className="h-6"></div>
          </div>
        )}
      </div>

      {/* 🚀 STICKY PRO-STYLE COMPACT INPUT BAR */}
      {/* 🚀 VANISH EFFECT: Uses opacity-0 and translate-y to smoothly hide when footer appears */}
      <div 
        className={`fixed bottom-[70px] md:bottom-6 z-[9999] flex justify-center transition-all duration-500 pointer-events-none ${isAtBottom ? 'opacity-0 translate-y-20' : 'opacity-100 translate-y-0'}`}
        style={{ left: inputPosition.left, width: inputPosition.width }}
      >
        <div className={`w-full max-w-2xl px-3 md:px-0 relative ${isAtBottom ? 'pointer-events-none' : 'pointer-events-auto'}`}>
          
          {replyTo && (
            <div className="bg-indigo-600 text-white text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-t-[0.75rem] w-max ml-4 flex items-center gap-2 shadow-lg">
              <ArrowUturnLeftIcon className="w-3 h-3" /> Replying to {replyTo.username}
              <button onClick={() => setReplyTo(null)} className="ml-2 hover:bg-white/20 p-0.5 rounded-full"><XMarkIcon className="w-3 h-3" /></button>
            </div>
          )}

          {/* 🚀 FROSTY FIX: 95% opacity and max blur to completely distort and hide background text */}
          <div className={`relative flex items-center p-1 md:p-1.5 rounded-full shadow-[0_-10px_40px_rgba(0,0,0,0.15)] backdrop-blur-2xl border ${
              isAuthority ? 'bg-red-50/95 border-red-300 dark:bg-red-950/95 dark:border-red-500/50' : 'bg-slate-50/95 dark:bg-[#080c1a]/95 border-black/10 dark:border-white/10'
            } ${replyTo ? 'rounded-tl-none' : ''}`}>
            
            <button onClick={() => document.getElementById('file-upload').click()} className={`p-1.5 mx-0.5 rounded-full transition-all flex-shrink-0 ${isAuthority ? 'text-red-500 hover:bg-red-500/10' : 'text-indigo-500 hover:bg-indigo-500/10'}`}>
              <PlusCircleIcon className="w-5 h-5 md:w-6 md:h-6" />
            </button>
            
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
                <button onClick={() => setShowCategoryMenu(!showCategoryMenu)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all text-slate-600 dark:text-slate-300 hover:bg-black/5 dark:hover:bg-white/5 border border-transparent hover:border-black/10 dark:hover:border-white/10">
                  <span className={`w-2 h-2 rounded-full ${postCategory === 'Web Scam' ? 'bg-orange-500' : postCategory === 'Deepfake Media' ? 'bg-purple-500' : 'bg-red-500'}`} />
                  <span className="hidden sm:block text-[10px] font-black uppercase tracking-widest">{postCategory.split(' ')[0]}</span>
                  <svg className={`w-3 h-3 opacity-60 transition-transform ${showCategoryMenu ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

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

            {/* 🚀 DEADLINE DROPDOWN FOR AUTHORITY (Glass Design) */}
            {isAuthority && !replyTo && (
              <div className="relative flex items-center justify-center border-l border-red-500/30 ml-1 pl-1.5">
                <button onClick={() => setShowDeadlineMenu(!showDeadlineMenu)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all text-red-500 hover:bg-red-500/10 border border-transparent hover:border-red-500/20">
                  <span className="hidden sm:block text-[10px] font-black uppercase tracking-widest">
                    {authDeadline == 7 ? '1 Week' : `${authDeadline} Days`}
                  </span>
                  <svg className={`w-3 h-3 opacity-80 transition-transform ${showDeadlineMenu ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                <AnimatePresence>
                  {showDeadlineMenu && (
                    <motion.div initial={{ opacity: 0, y: 10, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 10, scale: 0.95 }} className="absolute bottom-[calc(100%+12px)] right-0 w-32 rounded-2xl shadow-2xl border border-red-500/20 p-1.5 z-[60] bg-white/95 dark:bg-[#080c1a]/95 backdrop-blur-xl">
                      {[2, 3, 4, 5, 6, 7].map(days => (
                        <button key={days} onClick={() => { setAuthDeadline(days); setShowDeadlineMenu(false); }} className={`w-full text-left px-3 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${authDeadline == days ? 'bg-red-500/10 text-red-600 dark:text-red-400' : 'text-slate-600 dark:text-slate-400 hover:bg-black/5 dark:hover:bg-white/5 hover:text-red-500'}`}> 
                          {days == 7 ? '1 Week' : `${days} Days`}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            <button onClick={handleSendPost} disabled={isPublishing || !postText.trim()} className={`p-2 rounded-full transition-all ml-1 mr-0.5 flex-shrink-0 ${!postText.trim() ? 'opacity-30 cursor-not-allowed glass-input' : isAuthority ? 'bg-red-600 text-white shadow-[0_0_15px_rgba(220,38,38,0.5)]' : 'bg-indigo-600 text-white shadow-[0_0_15px_rgba(79,70,229,0.5)] hover:scale-105'}`}>
              {isPublishing ? <ArrowPathIcon className="w-4 h-4 animate-spin" /> : <PaperAirplaneIcon className="w-4 h-4 ml-0.5" />}
            </button>
          </div>
        </div>
        <input id="file-upload" type="file" className="hidden" accept="image/*,video/*" onChange={(e) => { const file = e.target.files[0]; if (file) toast.success(`Selected: ${file.name}`, { icon: '📁' }); }} />
      </div>

      {/* 🚀 MODALS (REPORT DETAIL & PROFILE) */}
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