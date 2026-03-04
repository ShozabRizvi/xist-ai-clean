import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import {
  ChatBubbleLeftRightIcon, CheckCircleIcon, ShareIcon, 
  HeartIcon, ShieldCheckIcon, ArrowPathIcon, TrashIcon, 
  UserCircleIcon, ChartBarIcon, FunnelIcon, MicrophoneIcon,
  VideoCameraIcon, PhotoIcon, SpeakerWaveIcon, SunIcon, MoonIcon,
  PaperAirplaneIcon, PlusCircleIcon, DocumentPlusIcon
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
  const seconds = Math.max(0, Math.round((now - date) / 1000));
  const minutes = Math.round(seconds / 60);
  const hours = Math.round(minutes / 60);
  if (seconds < 60) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
};

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

  // ✅ Tactical Authorization Check
  const currentUserId = user?.id || user?.uid;
  const isDeveloperNode = user?.email === 'shozabrizvi16@gmail.com';

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
              <ShieldCheckIcon className="w-7 h-7 text-indigo-500" /> 
              <span>{typingTitle}</span>
              <motion.span animate={{ opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 0.8 }} className="w-1.5 h-7 bg-indigo-500 inline-block ml-1" />
            </h1>
            <p className={`${theme.muted} text-xs uppercase tracking-widest font-bold mt-1`}>OSINT Intelligence Feed</p>
          </div>
          <div className="flex items-center gap-2 overflow-x-auto hide-scrollbar pb-1">
            {['all', 'deepfake', 'misinfo', 'scam', 'malware', 'cyber_attack', 'verified'].map(f => (
                <button key={f} onClick={() => setFilter(f)} 
                        className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${
                          filter === f ? 'bg-indigo-600 text-white shadow-lg' : `${theme.inner} ${theme.textSecondary} hover:text-indigo-400`
                        }`}>
                  {f.replace('_', ' ')}
                </button>
            ))}
          </div>
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
                      <div className="w-7 h-7 rounded-full overflow-hidden shrink-0 border border-slate-700 bg-slate-800">
                        {threat.profiles?.avatar_url ? <img src={threat.profiles.avatar_url} className="w-full h-full object-cover" /> : <UserCircleIcon className="w-5 h-5 text-slate-500" />}
                      </div>
                      <span className="text-[10px] font-black text-slate-400 group-hover:text-indigo-400 uppercase tracking-tighter">{threat.profiles?.username || 'ANON_AGENT'}</span>
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
                      <button onClick={(e) => { e.stopPropagation(); toast.success('Dossier ID Copied'); }} className="text-slate-500 hover:text-indigo-400 transition-colors">
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

      {/* DRAWER & MODALS */}
      <AnimatePresence>
        {selectedThreat && (
          <div className="fixed inset-0 z-[99999] flex justify-end">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedThreat(null)} className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" />
            <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', damping: 25, stiffness: 200 }} 
                        className={`relative w-full max-w-lg h-full border-l flex flex-col z-10 ${theme.background} ${isDark ? 'border-slate-800' : 'border-slate-200 shadow-2xl'}`}>
              <div className={`p-6 border-b flex justify-between items-center ${theme.headerBg} ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
                 <span className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-500 flex items-center gap-2"><ShieldCheckIcon className="w-4 h-4"/> Forensic Briefing</span>
                 <div className="flex items-center gap-4">
                    {/* ✅ DELETE BUTTON IN MODAL */}
                    {(selectedThreat.user_id === currentUserId || isDeveloperNode) && (
                       <button onClick={(e) => handleDeletePost(selectedThreat.id, e)} className="p-2 bg-rose-500/10 text-rose-500 hover:bg-rose-500/20 rounded-lg transition-all" title="Redact">
                         <TrashIcon className="w-4 h-4" />
                       </button>
                    )}
                    <button onClick={() => setSelectedThreat(null)} className="p-2 hover:bg-slate-800/50 rounded-lg text-slate-500 hover:text-slate-300 transition-all font-bold font-mono text-xs">ESC</button>
                 </div>
              </div>
              <div className="flex-grow overflow-y-auto p-8 custom-scrollbar">
                <h2 className={`text-2xl font-black mb-6 leading-tight ${theme.textPrimary}`}>{selectedThreat.title}</h2>
                {selectedThreat.media_url && (
                  <div className="mb-8 rounded-2xl overflow-hidden border border-slate-800 bg-slate-900 shadow-2xl flex items-center justify-center">
                    <RenderForensicMedia url={selectedThreat.media_url} className="max-h-[450px]" />
                  </div>
                )}
                <div className={`${theme.inner} p-6 rounded-2xl border mb-8 text-sm leading-relaxed whitespace-pre-wrap font-medium ${theme.textPrimary} shadow-inner`}>
                  <div className="text-[10px] font-black uppercase text-slate-500 mb-4 tracking-widest border-b border-slate-800/50 pb-2">Analysis_Dump</div>
                  {selectedThreat.description}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* OSINT PROFILE MODAL */}
      <AnimatePresence>
        {profileData && (
          <div className="fixed inset-0 z-[999999] flex items-center justify-center p-4">
             <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setProfileData(null)} className="absolute inset-0 bg-slate-950/90 backdrop-blur-md" />
             <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
                         className={`${theme.card} p-8 max-w-sm w-full text-center relative z-10 rounded-3xl`}>
              <div className="w-24 h-24 mx-auto rounded-full overflow-hidden border-4 border-indigo-500/30 mb-4 shadow-2xl">
                {profileData.avatarUrl ? <img src={profileData.avatarUrl} className="w-full h-full object-cover" /> : <UserCircleIcon className="w-full h-full text-slate-600" />}
              </div>
              <h2 className={`text-xl font-black ${theme.textPrimary}`}>{profileData.username}</h2>
              <div className="text-[10px] font-black uppercase tracking-widest text-indigo-500 mb-8 flex items-center justify-center gap-1 mt-1"><ShieldCheckIcon className="w-4 h-4" /> Trusted Operative</div>
              <div className="grid grid-cols-2 gap-4">
                <div className={`${theme.inner} p-4 rounded-2xl border shadow-inner`}><div className={`text-2xl font-black ${theme.textPrimary}`}>{profileData.postCount}</div><div className="text-[9px] text-slate-500 font-black uppercase tracking-widest mt-1">Dossiers</div></div>
                <div className={`${theme.inner} p-4 rounded-2xl border shadow-inner`}><div className={`text-2xl font-black ${theme.textPrimary}`}>{profileData.totalLikes}</div><div className="text-[9px] text-slate-500 font-black uppercase tracking-widest mt-1">Impact</div></div>
              </div>
             </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default CommunitySection;