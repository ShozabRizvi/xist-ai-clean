// src/components/Sections/CommunitySection.js - NEW SUPABASE READY VERSION
import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import {
  ChatBubbleLeftRightIcon, ExclamationTriangleIcon, CheckCircleIcon, ClockIcon,
  MagnifyingGlassIcon, ShareIcon, HeartIcon, UserGroupIcon, ShieldCheckIcon,
  XCircleIcon, ArrowPathIcon, EyeIcon
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolid } from '@heroicons/react/24/solid';
import { supabase } from '../../lib/supabase';

const CommunitySection = ({ user }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newPost, setNewPost] = useState({ title: '', description: '', threat_type: 'deepfake' });
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [isAuthority, setIsAuthority] = useState(false);
  const [authorityDept, setAuthorityDept] = useState('');
  const [showAuthorityModal, setShowAuthorityModal] = useState(false);

  // BETTER: Replace entire loadPosts with this:
const loadPosts = useCallback(async () => {
  setLoading(true);
  try {
    const { data: threatsData, error } = await supabase
      .from('community_threats')
      .select(`
        *,
        threat_likes!inner(likes_count:*),
        threat_shares!inner(shares_count:*),
        profiles(name)
      `)
      .order('created_at', { ascending: false })
      .limit(50);

    if (error) throw error;
    
    console.log('📋 Loaded threats:', threatsData);
    setPosts(threatsData || []);
  } catch (error) {
    console.error('Posts error:', error);
    toast.error('Failed to load threats');
  } finally {
    setLoading(false);
  }
}, [user?.id]);




  // ✅ NEW: Real database likes
  const handleLike = async (threatId) => {
  if (!user?.id) {
    toast.error('Please login to like threats');
    return;
  }

  const { data: existing } = await supabase
    .from('threat_likes')
    .select('*')
    .eq('threat_id', threatId)
    .eq('user_id', user.id)  // ✅ Fixed: user.id not user.data.user.id
    .single();

  if (existing) {
    await supabase.from('threat_likes').delete()
      .eq('threat_id', threatId)
      .eq('user_id', user.id);  // ✅ Fixed
  } else {
    await supabase.from('threat_likes').insert({
      threat_id: threatId,
      user_id: user.id  // ✅ Fixed
    });
  }
  loadPosts();
  toast.success(existing ? 'Unliked' : 'Liked');
};


  // ✅ NEW: Real database shares
  const handleShare = async (threatId) => {
  if (!user?.id) {
    toast.error('Please login to share');
    return;
  }

  await supabase.from('threat_shares').insert({
    threat_id: threatId,
    user_id: user.id,  // ✅ Fixed
    shared_to_platform: 'twitter'
  });
  loadPosts();
  toast.success('Threat shared! 📤');
};

// ✅ ADD THIS FUNCTION
const handleDelete = async (threatId) => {
  if (!user?.id) {
    toast.error('Please login to delete');
    return;
  }

  if (!window.confirm('Delete this threat permanently?')) return;

  try {
    const { error } = await supabase
      .from('community_threats')
      .delete()
      .eq('id', threatId)
      .eq('user_id', user.id); // Only poster can delete

    if (error) throw error;
    
    toast.success('Threat deleted!');
    loadPosts();
  } catch (error) {
    toast.error('Delete failed');
  }
};

  // ✅ UPDATED: Post to new table structure
  const handlePost = async () => {
    if (!newPost.title.trim() || !newPost.description.trim()) {
      toast.error('Title and description required');
      return;
    }

    try {
      const { error } = await supabase.from('community_threats').insert({
        user_id: user?.id,
        title: newPost.title,
        description: newPost.description,
        threat_type: newPost.threat_type,
        location: 'India', // Default
        is_verified: isAuthority
      });

      if (error) throw error;
      
      setNewPost({ title: '', description: '', threat_type: 'deepfake' });
      toast.success(isAuthority ? 'Official threat posted!' : 'Threat posted!');
      loadPosts();
    } catch (error) {
      toast.error('Failed to post threat');
    }
  };

  // Authority verify - UPDATED for new schema
  const verifyThreat = async (threatId) => {
    if (!isAuthority) {
      setShowAuthorityModal(true);
      return;
    }

    try {
      await supabase
        .from('community_threats')
        .update({ 
          is_verified: true,
          updated_at: new Date().toISOString()
        })
        .eq('id', threatId);

      toast.success(`✅ VERIFIED by ${authorityDept}`);
      loadPosts();
    } catch (error) {
      toast.error('Verification failed');
    }
  };

  // Rest of your existing functions (unchanged)
  const handleAuthorityLogin = (dept) => {
    setIsAuthority(true);
    setAuthorityDept(dept);
    setShowAuthorityModal(false);
    toast.success(`Welcome ${dept} Authority! 👑`);
  };

  useEffect(() => {
    loadPosts();

    const channel = supabase
      .channel('community_threats')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'community_threats' }, loadPosts)
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, [loadPosts]);

  const filteredPosts = posts.filter(post => {
    if (filter === 'all') return true;
    if (filter === 'authority') return post.is_verified;
    if (filter === 'deepfake') return post.threat_type === 'deepfake';
    if (filter === 'scam') return post.threat_type === 'scam';
    return post.threat_type === filter;
  });

  return (
    <div className="w-full min-h-screen p-8 bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 text-white" 
         style={{ marginLeft: '280px', marginTop: '64px', fontFamily: 'Inter, sans-serif' }}>
      
      {/* Header - UNCHANGED */}
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="max-w-7xl mx-auto mb-16 text-center">
        <div className="inline-flex items-center gap-4 bg-slate-800/50 backdrop-blur-xl rounded-3xl p-8 mb-8 border border-white/10 shadow-2xl">
          <UserGroupIcon className="w-14 h-14 text-indigo-400" />
          <div>
            <h1 className="text-6xl font-black bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Threat Intelligence Network
            </h1>
            <p className="text-slate-400 mt-3 text-xl">Global threat sharing + Authority verification</p>
          </div>
        </div>

        {isAuthority && (
          <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} className="inline-flex items-center gap-3 bg-emerald-500/20 backdrop-blur-xl rounded-2xl p-4 border border-emerald-500/30 mb-8">
            <ShieldCheckIcon className="w-6 h-6 text-emerald-400" />
            <span className="text-lg font-bold text-emerald-300">VERIFIED AUTHORITY: {authorityDept}</span>
            <button onClick={() => setIsAuthority(false)} className="ml-auto p-2 hover:bg-white/20 rounded-xl">
              <XCircleIcon className="w-5 h-5" />
            </button>
          </motion.div>
        )}
      </motion.div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-12">
        
        {/* Left: Controls - UPDATED form */}
        <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="lg:col-span-1 space-y-8">
          
          {!isAuthority && (
            <motion.div whileHover={{ scale: 1.02 }} className="bg-gradient-to-r from-emerald-500/10 to-blue-500/10 backdrop-blur-xl rounded-3xl p-8 border border-emerald-500/20 shadow-2xl cursor-pointer"
                        onClick={() => setShowAuthorityModal(true)}>
              <div className="flex items-center gap-3 mb-4">
                <ShieldCheckIcon className="w-8 h-8 text-emerald-400" />
                <h3 className="text-2xl font-bold">Authority Access</h3>
              </div>
              <p className="text-slate-300 mb-2">FBI • CIA • CISA • DOJ</p>
              <p className="text-sm text-slate-400">Official verification powers</p>
            </motion.div>
          )}

          {/* ✅ UPDATED: New schema post form */}
          <div className="bg-slate-800/80 backdrop-blur-xl rounded-3xl p-8 border border-white/10 shadow-2xl">
            <div className="flex items-center gap-3 mb-6">
              <ShareIcon className="w-6 h-6 text-indigo-400" />
              <h3 className="text-2xl font-bold">{isAuthority ? 'Official Report' : 'Report Threat'}</h3>
            </div>
            <input 
              value={newPost.title} 
              onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
              placeholder="Threat title..." 
              className="w-full p-4 bg-white/5 border border-white/20 rounded-2xl text-white placeholder-slate-400 focus:border-indigo-500 mb-4 text-lg" 
            />
            <textarea 
              value={newPost.description} 
              onChange={(e) => setNewPost({ ...newPost, description: e.target.value })}
              placeholder="Describe threat details..." 
              rows={4}
              className="w-full p-4 bg-white/5 border border-white/20 rounded-2xl text-white placeholder-slate-400 focus:border-indigo-500 mb-4 resize-none" 
            />
            <select 
              value={newPost.threat_type}
              onChange={(e) => setNewPost({ ...newPost, threat_type: e.target.value })}
              className="w-full p-4 bg-white/5 border border-white/20 rounded-2xl text-white mb-6"
            >
              <option value="deepfake">Deepfake</option>
              <option value="misinfo">Misinformation</option>
              <option value="scam">Scam</option>
              <option value="malware">Malware</option>
            </select>
            <button onClick={handlePost} 
                    className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold py-4 rounded-2xl shadow-xl hover:shadow-2xl text-lg">
              {isAuthority ? 'Post Official Report' : 'Post to Network'}
            </button>
          </div>

          {/* Filters - UPDATED */}
          <div className="bg-slate-800/80 backdrop-blur-xl rounded-3xl p-8 border border-white/10 shadow-2xl">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
              <MagnifyingGlassIcon className="w-5 h-5" /> Filters
            </h3>
            <div className="space-y-3 mb-6">
              {['all', 'deepfake', 'misinfo', 'scam', 'malware', 'verified'].map(f => (
                <button key={f} onClick={() => setFilter(f)} 
                        className={`w-full p-4 rounded-2xl text-left font-semibold transition-all ${
                          filter === f 
                            ? 'bg-gradient-to-r from-indigo-500/30 to-purple-500/30 text-indigo-200 border-2 border-indigo-500/50 shadow-lg'
                            : 'text-slate-400 hover:text-white hover:bg-white/10 border border-white/20'
                        }`}>
                  {f.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Right: Feed - UPDATED threat cards */}
        <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="lg:col-span-2 space-y-8">
          <div>
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-4xl font-black flex items-center gap-4">
                <ChatBubbleLeftRightIcon className="w-10 h-10" />
                Threat Feed
                <span className="bg-indigo-500/30 text-indigo-200 px-4 py-1 rounded-2xl text-lg font-bold">
                  {filteredPosts.length}
                </span>
              </h2>
              <div className="text-lg text-slate-400">
                Live <ArrowPathIcon className="w-6 h-6 inline animate-spin" />
              </div>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-24">
                <div className="animate-spin rounded-full h-20 w-20 border-b-2 border-indigo-500"></div>
              </div>
            ) : filteredPosts.length === 0 ? (
              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                          className="bg-slate-800/50 backdrop-blur-xl rounded-3xl p-16 border-2 border-dashed border-white/20 text-center">
                <ChatBubbleLeftRightIcon className="w-24 h-24 text-slate-500 mx-auto mb-8" />
                <h3 className="text-3xl font-bold text-slate-200 mb-4">No active threats</h3>
                <p className="text-xl text-slate-500 mb-8">Be first to report threat to network</p>
                <button onClick={handlePost} className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold py-4 px-10 rounded-2xl shadow-xl hover:shadow-2xl">
                  Report Threat
                </button>
              </motion.div>
            ) : (
              filteredPosts.map((threat, i) => (
                <motion.div key={threat.id} initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} 
                            transition={{ delay: i * 0.05 }} whileHover={{ y: -8, scale: 1.02 }}
                            className="group bg-slate-800/80 backdrop-blur-xl rounded-3xl p-8 border border-white/10 hover:border-indigo-500/50 hover:shadow-2xl hover:shadow-indigo-500/20 transition-all cursor-pointer">
                  
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center gap-3 flex-wrap">
                      <div className={`px-4 py-2 rounded-2xl text-sm font-bold shadow-lg ${
                        threat.threat_type === 'deepfake' ? 'bg-gradient-to-r from-purple-500/30 to-pink-500/30 text-purple-200 border-2 border-purple-500/50' :
                        threat.threat_type === 'scam' ? 'bg-gradient-to-r from-rose-500/30 to-red-500/30 text-rose-200 border-2 border-rose-500/50' :
                        'bg-gradient-to-r from-amber-500/30 to-yellow-500/30 text-amber-200 border-2 border-amber-500/50'
                      }`}>
                        {threat.threat_type?.toUpperCase()}
                      </div>
                      {threat.is_verified && (
                        <div className="px-3 py-1.5 bg-emerald-500/30 text-emerald-200 text-xs font-bold rounded-xl border border-emerald-500/50">
                          VERIFIED
                        </div>
                      )}
                    </div>
                    <div className="text-sm text-slate-500">
  {new Date(threat.created_at).toLocaleString('en-IN', {
    timeZone: 'Asia/Kolkata',
    month: 'short', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  })}
</div>
                  </div>

                  <h3 className="text-2xl font-black mb-4 text-slate-100 group-hover:text-white line-clamp-2">
                    {threat.title}
                  </h3>

                  <p className="text-lg text-slate-300 mb-6 line-clamp-2 leading-relaxed">
                    {threat.description}
                  </p>

                  <div className="flex items-center gap-6 text-sm text-slate-400 mb-6">
                    <div className="flex items-center gap-2">
                      <ExclamationTriangleIcon className="w-4 h-4 text-rose-400" />
                      <span>📍 {threat.location}</span>
                    </div>
                  </div>

                  {/* ✅ NEW: Real like/share buttons */}
                  <div className="flex items-center justify-between pt-6 border-t border-white/20">
                    <div className="flex items-center gap-6 text-lg font-bold">
                      <span className="flex items-center gap-2 text-rose-400">
                        <HeartIcon className={threat.user_liked?.length > 0 ? "w-6 h-6 fill-rose-400 text-rose-400" : "w-6 h-6 text-rose-400/50"} />
                        {threat.likes_count || 0}
                      </span>
                      <span className="flex items-center gap-2 text-indigo-400">
                        <ShareIcon className="w-6 h-6" />
                        {threat.shares_count || 0}
                      </span>
                    </div>
                    
                    <div className="flex gap-3">
  {/* Like Button */}
  <button 
    onClick={(e) => { e.stopPropagation(); handleLike(threat.id); }} 
    className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-bold transition-all ${
      threat.user_liked 
        ? 'bg-rose-500/20 text-rose-300 border-2 border-rose-500/50 hover:bg-rose-500/30' 
        : 'bg-white/10 text-slate-300 border border-white/20 hover:bg-white/20'
    }`}
  >
    {threat.user_liked ? '❤️ Unlike' : '🤍 Like'}
  </button>
  
  {/* Share Button */}
  <button 
    onClick={(e) => { e.stopPropagation(); handleShare(threat.id); }} 
    className="flex items-center gap-2 px-6 py-3 bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 border-2 border-indigo-500/50 rounded-2xl font-bold transition-all"
  >
    <ShareIcon className="w-5 h-5" />
    Share
  </button>

  {/* ✅ NEW: DELETE BUTTON - Only for post owner */}
  {threat.user_id === user?.id && (
    <button 
      onClick={(e) => { e.stopPropagation(); handleDelete(threat.id); }} 
      className="flex items-center gap-2 px-4 py-3 bg-red-500/20 hover:bg-red-500/40 text-red-300 border-2 border-red-500/50 rounded-xl font-bold transition-all"
    >
      <XCircleIcon className="w-5 h-5" />
      Delete
    </button>
  )}

  {/* Authority Verify */}
  {isAuthority && (
    <button 
      onClick={(e) => { e.stopPropagation(); verifyThreat(threat.id); }} 
      className="bg-emerald-600/90 hover:bg-emerald-500 text-white py-3 px-6 rounded-2xl font-bold text-sm shadow-lg hover:shadow-xl transition-all ml-2"
    >
      <CheckCircleIcon className="w-5 h-5 inline mr-1" /> Verify
    </button>
  )}
</div>

                  </div>
                </motion.div>
              ))
            )}
          </div>
        </motion.div>
      </div>

      {/* Authority Modal - UNCHANGED */}
      <AnimatePresence>
        {showAuthorityModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-8"
                      onClick={() => setShowAuthorityModal(false)}>
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} 
                        className="bg-slate-900/95 backdrop-blur-2xl rounded-3xl p-10 max-w-lg w-full border border-white/20 shadow-2xl max-h-[90vh] overflow-y-auto"
                        onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-4xl font-black bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent">
                  Authority Login
                </h2>
                <button onClick={() => setShowAuthorityModal(false)} className="p-2 hover:bg-white/20 rounded-2xl">
                  <XCircleIcon className="w-7 h-7" />
                </button>
              </div>
              
              <div className="grid md:grid-cols-2 gap-4">
                {[
                  { id: 'FBI', name: 'Federal Bureau of Investigation', badge: '🕵️' },
                  { id: 'CIA', name: 'Central Intelligence Agency', badge: '🔒' },
                  { id: 'CISA', name: 'Cybersecurity Agency', badge: '🛡️' },
                  { id: 'DOJ', name: 'Department of Justice', badge: '⚖️' }
                ].map(dept => (
                  <motion.div key={dept.id} whileHover={{ scale: 1.05 }} 
                              className="group bg-gradient-to-r from-slate-700/50 to-slate-800/50 backdrop-blur-xl p-6 rounded-2xl border border-white/20 hover:border-indigo-500/50 cursor-pointer hover:shadow-xl transition-all"
                              onClick={() => handleAuthorityLogin(dept.id)}>
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-2xl">{dept.badge}</span>
                      <div className="text-sm font-bold uppercase tracking-wider text-indigo-400 group-hover:text-indigo-300">
                        {dept.id}
                      </div>
                    </div>
                    <p className="text-slate-300 text-sm leading-tight">{dept.name}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CommunitySection;
