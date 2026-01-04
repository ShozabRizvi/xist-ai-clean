// CommunitySection.js
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  UsersIcon, HeartIcon, ChatBubbleLeftIcon, ShareIcon, FlagIcon,
  StarIcon, TrophyIcon, FireIcon, ArrowUpTrayIcon, EyeIcon,
  HandThumbUpIcon, HandThumbDownIcon, MagnifyingGlassIcon,
  FunnelIcon, CheckBadgeIcon, PlusIcon, ExclamationTriangleIcon,
  BookmarkIcon, DocumentTextIcon, ShieldCheckIcon, AcademicCapIcon,
  CalendarIcon, CurrencyDollarIcon, ChartBarIcon, ScaleIcon, XMarkIcon,
  UserGroupIcon, NoSymbolIcon, CheckCircleIcon, UserMinusIcon,
  MapPinIcon, UserPlusIcon, GlobeAltIcon, LanguageIcon, ClockIcon,
  TrashIcon, ArchiveBoxIcon, EllipsisHorizontalIcon, PhotoIcon,
  VideoCameraIcon, LinkIcon, HashtagIcon, AtSymbolIcon, BellIcon,
  InformationCircleIcon, ExclamationCircleIcon
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid, StarIcon as StarIconSolid,
         CheckBadgeIcon as CheckBadgeIconSolid } from '@heroicons/react/24/solid';
import Card from '../UI/Card';
import Button from '../UI/Button';
import { useResponsive } from '../../hooks/useResponsive';
import { supabase } from '../../supabase';

/**
 * CommunitySection
 *
 * - Uses the single exported `supabase` client (from supabase.js) — do NOT create clients here.
 * - All fields use `user?.id` (not uid) and all DB row identifiers use `id`.
 * - Realtime subscribes to `community_posts`.
 * - DB updates are guarded with try/catch when optional columns might not exist.
 *
 * Keep the component props (`user`, `isDarkMode`) so your app integration remains unchanged.
 */

const CommunitySection = ({ user, isDarkMode }) => {
  const { isMobile, isTablet, isDesktop } = useResponsive();

  // Main state
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newPost, setNewPost] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [showAuthorityModal, setShowAuthorityModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showPostModal, setShowPostModal] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);

  // Authority state
  const [isAuthority, setIsAuthority] = useState(false);
  const [authorityData, setAuthorityData] = useState(null);
  const [authorityLoginMode, setAuthorityLoginMode] = useState('login');
  const [authorityForm, setAuthorityForm] = useState({
    authorityId: '',
    department: '',
    name: '',
    email: '',
    verificationCode: ''
  });

  // Post composition state
  const [postContent, setPostContent] = useState('');
  const [postType, setPostType] = useState('regular');
  const [postMedia, setPostMedia] = useState([]);
  const [postLocation, setPostLocation] = useState(null);
  const [postHashtags, setPostHashtags] = useState([]);
  const [showLocationPicker, setShowLocationPicker] = useState(false);

  // Authority departments (unchanged)
  const authorityDepartments = [
    { id: 'fbi', name: 'Federal Bureau of Investigation', badge: '🏛️', color: 'blue' },
    { id: 'cia', name: 'Central Intelligence Agency', badge: '🕵️', color: 'gray' },
    { id: 'ftc', name: 'Federal Trade Commission', badge: '⚖️', color: 'green' },
    { id: 'fcc', name: 'Federal Communications Commission', badge: '📡', color: 'purple' },
    { id: 'cisa', name: 'Cybersecurity & Infrastructure Security Agency', badge: '🛡️', color: 'red' },
    { id: 'doj', name: 'Department of Justice', badge: '⚡', color: 'indigo' },
    { id: 'sec', name: 'Securities and Exchange Commission', badge: '💼', color: 'yellow' },
    { id: 'dhs', name: 'Department of Homeland Security', badge: '🏠', color: 'orange' },
    { id: 'nsa', name: 'National Security Agency', badge: '🔒', color: 'slate' },
    { id: 'local_police', name: 'Local Police Department', badge: '👮', color: 'blue' },
    { id: 'state_police', name: 'State Police', badge: '🚔', color: 'blue' },
    { id: 'interpol', name: 'International Police', badge: '🌍', color: 'blue' },
    { id: 'europol', name: 'European Police Office', badge: '🇪🇺', color: 'blue' },
    { id: 'cyber_crime', name: 'Cyber Crime Unit', badge: '💻', color: 'red' },
    { id: 'financial_crimes', name: 'Financial Crimes Enforcement', badge: '💰', color: 'green' },
    { id: 'academic', name: 'Academic Institution', badge: '🎓', color: 'purple' },
    { id: 'research', name: 'Research Organization', badge: '🔬', color: 'teal' },
    { id: 'media_org', name: 'Media Organization', badge: '📰', color: 'gray' },
    { id: 'fact_checker', name: 'Fact-Checking Organization', badge: '✓', color: 'green' },
    { id: 'other', name: 'Other Government Agency', badge: '🏢', color: 'gray' }
  ];

  // ---------- lifecycle ----------
  useEffect(() => {
    initializeData();
    loadPosts();
    checkAuthorityStatus();
    const subscription = setupRealtimeSubscription();
    getUserLocation();
    cleanupOldPosts();

    return () => {
      // cleanup realtime subscription safely
      try {
        if (subscription && typeof subscription.unsubscribe === 'function') {
          subscription.unsubscribe();
        } else if (subscription && typeof supabase.removeChannel === 'function') {
          // fallback if channel object differs
          supabase.removeChannel(subscription).catch(() => {});
        }
      } catch (e) {
        console.warn('[Community] subscription cleanup failed', e);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const initializeData = async () => {
    // purely informational initialization - do not create new clients here
    try {
      console.log('Initializing Supabase connection (CommunitySection)...');
      // Optionally test connection (non-blocking)
      // We keep this lightweight; do not attempt to create a client here.
    } catch (err) {
      console.error('Error initializing Supabase (CommunitySection):', err);
    }
  };

  // ---------- load / realtime ----------
  const loadPosts = async () => {
    setLoading(true);

    try {
      if (!supabase) {
        console.log('Supabase client not found — running in demo/local mode');
        setPosts([]);
        return;
      }

      // fetch community_posts
      const { data, error } = await supabase
        .from('community_posts')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) {
        console.error('[Community] loadPosts error:', error);
        // If 406 occurred previously it often indicates requesting columns that the server can't return.
        // Fall back gracefully.
        setPosts([]);
      } else {
        setPosts(data || []);
      }
    } catch (err) {
      console.error('[Community] loadPosts exception:', err);
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  const setupRealtimeSubscription = () => {
    if (!supabase) return null;

    try {
      // Subscribe to changes on community_posts table (all events)
      const channel = supabase
        .channel('community_posts_changes')
        .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'community_posts' }, (payload) => {
          console.log('Realtime INSERT:', payload.new);
          setPosts(prev => [payload.new, ...prev.filter(p => p.id !== payload.new.id)]);
        })
        .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'community_posts' }, (payload) => {
          console.log('Realtime UPDATE:', payload.new);
          setPosts(prev => prev.map(p => (p.id === payload.new.id ? payload.new : p)));
        })
        .on('postgres_changes', { event: 'DELETE', schema: 'public', table: 'community_posts' }, (payload) => {
          console.log('Realtime DELETE:', payload.old);
          setPosts(prev => prev.filter(p => p.id !== payload.old.id));
        })
        .subscribe();

      return channel;
    } catch (err) {
      console.error('[Community] realtime subscription error:', err);
      return null;
    }
  };

  // ---------- location ----------
  const getUserLocation = () => {
    if (!navigator?.geolocation) return;
    try {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setPostLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            city: 'Unknown',
            country: 'Unknown'
          });
        },
        (error) => {
          console.log('Geolocation error:', error);
        }
      );
    } catch (err) {
      console.warn('getUserLocation failed:', err);
    }
  };

  // ---------- authority ----------
  const checkAuthorityStatus = async () => {
    // We cannot assume extra columns exist on user_profiles.
    // We'll attempt to read the user_profiles row by id and use `verified` flag or local logic.
    if (!user || !user.id) return;

    try {
      if (!supabase) return;

      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (!error && data) {
        // if your schema uses a dedicated `is_authority` column, replace logic here.
        // For now, treat `verified === true` as authority (if your flow sets that).
        if (data.verified) {
          setIsAuthority(true);
          setAuthorityData(data);
        } else {
          setIsAuthority(false);
          setAuthorityData(data);
        }
      } else {
        // No profile yet or other error
        console.log('[Community] checkAuthorityStatus:', error?.message || 'no profile');
      }
    } catch (err) {
      console.error('Error checking authority status:', err);
    }
  };

  const handleAuthorityAuth = async () => {
    if (!user || !user.id) {
      alert('Please login first');
      return;
    }

    try {
      if (!supabase) {
        alert('Database not configured. Please set up Supabase.');
        return;
      }

      // WARNING: your provided user_profiles schema doesn't contain authority_id, department, badge_color, etc.
      // To avoid SQL errors we update only known columns (id, username, full_name, email, country, verified).
      // If you want a full authority system, add a dedicated table (e.g. authority_profiles) in your DB.

      if (authorityLoginMode === 'register') {
        // Upsert basic profile info and keep verified=false until manual verification by admin.
        const profilePayload = {
          id: user.id,
          username: user?.email?.split?.('@')?.[0] || user?.id,
          full_name: authorityForm.name || null,
          email: authorityForm.email || user?.email || null,
          country: null,
          verified: false,
          created_at: new Date().toISOString()
        };

        // upsert: insert or update existing
        const { error } = await supabase
          .from('user_profiles')
          .upsert(profilePayload, { onConflict: 'id' });

        if (error) {
          throw error;
        }

        alert('Authority registration submitted! Please wait for manual verification by admins.');
      } else {
        // Login flow: we'll validate that the user's profile email or full_name matches what they entered.
        const { data, error } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (error || !data) {
          throw new Error('No profile found. Please register first.');
        }

        // crude matching: check provided email or name matches stored values
        const matchesEmail = authorityForm.email && data.email && authorityForm.email.toLowerCase() === (data.email || '').toLowerCase();
        const matchesName = authorityForm.name && data.full_name && authorityForm.name.trim().toLowerCase() === (data.full_name || '').trim().toLowerCase();

        if (!matchesEmail && !matchesName) {
          throw new Error('Invalid authority credentials (no match). Please register or contact admin.');
        }

        // If they match and profile.verified is true, grant authority locally
        if (data.verified) {
          setIsAuthority(true);
          setAuthorityData(data);
          alert('Successfully logged in as authority!');
        } else {
          // not verified by admin yet
          alert('Your profile is not verified as an authority. Please wait for admin verification.');
        }
      }

      setShowAuthorityModal(false);
      resetAuthorityForm();
    } catch (err) {
      console.error('Authority auth error:', err);
      alert('Error: ' + (err.message || 'Unknown error'));
    }
  };

  const resetAuthorityForm = () => {
    setAuthorityForm({
      authorityId: '',
      department: '',
      name: '',
      email: '',
      verificationCode: ''
    });
  };

  // ---------- posts CRUD ----------
  const createPost = async () => {
    if (!postContent?.trim()) return;
    if (!user || !user.id) {
      alert('Please login first');
      return;
    }

    try {
      const postData = {
        content: postContent,
        user_id: user.id,
        username: (user.user_metadata && user.user_metadata.username) || user.email || user.id,
        user_country: (user.user_metadata && user.user_metadata.country) || null,
        user_verified: !!(user.user_metadata && user.user_metadata.verified),
        hashtags: postHashtags.length ? postHashtags : null,
        created_at: new Date().toISOString(),
        likes: 0,
        reposts: 0,
        replies_count: 0,
        engagement_score: 0,
        threat_level: 'low',
        parent_id: null
      };

      if (!supabase) {
        // local fallback
        const fallbackPost = { ...postData, id: Date.now().toString() };
        setPosts(prev => [fallbackPost, ...prev]);
      } else {
        const { data, error } = await supabase
          .from('community_posts')
          .insert([postData])
          .select();

        if (error) throw error;

        // refresh using returned data if available
        if (data && data[0]) {
          setPosts(prev => [data[0], ...prev]);
        } else {
          loadPosts();
        }
      }

      // Reset composer
      setPostContent('');
      setPostType('regular');
      setPostMedia([]);
      setPostHashtags([]);
      setShowPostModal(false);
      alert('Post created successfully!');
    } catch (err) {
      console.error('Error creating post:', err);
      alert('Error creating post: ' + (err.message || 'Unknown'));
    }
  };

  // interactions: like / share / report / reply — update counts on community_posts
  const interactWithPost = async (postId, interactionType, data = {}) => {
    if (!user || !user.id) {
      alert('Please login first');
      return;
    }

    try {
      // Determine which field to increment on the main post table
      const fieldMap = {
        like: 'likes',
        share: 'reposts',
        report: 'replies_count', // for reporting we also keep a separate table; we'll increment reports_count if present, else replies_count
        reply: 'replies_count'
      };

      const targetField = fieldMap[interactionType] || 'engagement_score';

      // Attempt to increment the counter atomically on the DB
      if (supabase) {
        // Fetch current value, then update; note: Supabase doesn't have incremental update until you use SQL; do read-modify-update safely in try/catch
        const { data: postRow, error: fetchError } = await supabase
          .from('community_posts')
          .select(targetField)
          .eq('id', postId)
          .single();

        if (fetchError) {
          console.warn('[interact] fetch failed:', fetchError);
        } else {
          const current = (postRow && postRow[targetField]) || 0;
          const { error: updateError } = await supabase
            .from('community_posts')
            .update({ [targetField]: current + 1 })
            .eq('id', postId);

          if (updateError) {
            console.warn('[interact] update increment failed:', updateError);
          } else {
            // reflect locally
            setPosts(prev => prev.map(p => p.id === postId ? { ...p, [targetField]: current + 1 } : p));
          }
        }

        // For report interactions, also save to threat_reports table if available
        if (interactionType === 'report') {
          try {
            const reportPayload = {
              post_id: postId,
              reporter_id: user.id,
              report_type: data.reason || 'inappropriate',
              status: 'pending',
              created_at: new Date().toISOString()
            };
            const { error: reportErr } = await supabase
              .from('threat_reports')
              .insert([reportPayload]);
            if (reportErr) console.warn('[interact] threat_reports insert failed:', reportErr);
          } catch (e) {
            console.warn('[interact] threat_reports insert exception:', e);
          }
        }
      } else {
        // fallback: update local state only
        setPosts(prev => prev.map(p => {
          if (p.id === postId) {
            const updateField = targetField;
            return { ...p, [updateField]: (p[updateField] || 0) + 1 };
          }
          return p;
        }));
      }
    } catch (err) {
      console.error('Error interacting with post:', err);
    }
  };

  const deletePost = async (postId, isAutoDelete = false) => {
    try {
      if (!supabase) {
        setPosts(prev => prev.filter(post => post.id !== postId));
        return;
      }

      if (isAutoDelete) {
        // If you prefer a soft-delete, set a flag; your schema doesn't include `status` or `archived_at` by default,
        // so we'll set threat_level='archived' as a conservative safe operation (won't fail if that column exists).
        try {
          await supabase
            .from('community_posts')
            .update({
              threat_level: 'archived'
            })
            .eq('id', postId);
        } catch (e) {
          // fallback to delete if update fails
          await supabase
            .from('community_posts')
            .delete()
            .eq('id', postId);
        }
      } else {
        await supabase
          .from('community_posts')
          .delete()
          .eq('id', postId);
      }

      // refresh local list
      loadPosts();
    } catch (err) {
      console.error('Error deleting post:', err);
    }
  };

  const cleanupOldPosts = async () => {
    try {
      if (!supabase) return;
      const sevenMonthsAgo = new Date();
      sevenMonthsAgo.setMonth(sevenMonthsAgo.getMonth() - 7);

      await supabase
        .from('community_posts')
        .delete()
        .lt('created_at', sevenMonthsAgo.toISOString());
    } catch (err) {
      console.error('Error cleaning up old posts:', err);
    }
  };

  // Fact-check post: uses AI externally (mocked). To avoid DB errors, DB updates are attempted but failures are caught.
  const factCheckPost = async (postId, content) => {
    try {
      console.log('Fact-checking post:', postId, content);

      // Mock or real integration goes here; keep mock result for now
      const mockResult = {
        status: 'verified',
        notes: 'Information verified through multiple sources.',
        confidence: 0.85
      };

      // Update DB with optional columns; wrapped in try/catch so it won't break if columns missing in schema
      if (supabase) {
        try {
          await supabase
            .from('community_posts')
            .update({
              fact_check_status: mockResult.status,
              fact_check_notes: mockResult.notes,
              fact_check_confidence: mockResult.confidence
            })
            .eq('id', postId);
        } catch (dbErr) {
          // Might fail if those columns don't exist - don't crash; just log
          console.warn('[factCheck] Optional columns update failed (if columns missing, ignore):', dbErr?.message || dbErr);
        }

        // refresh
        loadPosts();
      } else {
        // local update
        setPosts(prev => prev.map(p => p.id === postId ? {
          ...p,
          fact_check_status: mockResult.status,
          fact_check_notes: mockResult.notes,
          fact_check_confidence: mockResult.confidence
        } : p));
      }
    } catch (err) {
      console.error('Error fact-checking post:', err);
    }
  };

  // ---------- filtering ----------
  const filteredPosts = posts.filter(post => {
    if (!post) return false;
    if (selectedFilter === 'authorities') return post.is_authority || false;
    if (selectedFilter === 'reports') return post.post_type === 'report';
    if (selectedFilter === 'verified') return (post.fact_check_status || '').toLowerCase() === 'verified';
    if (selectedFilter === 'disputed') return (post.fact_check_status || '').toLowerCase() === 'disputed';
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const contentMatch = post.content && post.content.toLowerCase().includes(q);
      const tagsMatch = Array.isArray(post.hashtags) && post.hashtags.some(tag => tag.toLowerCase().includes(q));
      return contentMatch || tagsMatch;
    }
    return true;
  });

  // ---------- render helpers ----------
  const renderAuthorityBadge = (post) => {
    if (!post || !post.is_authority) return null;
    const dept = authorityDepartments.find(d => d.id === post.authority_department) || authorityDepartments[0];
    return (
      <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-${dept.color}-100 text-${dept.color}-800 dark:bg-${dept.color}-900 dark:text-${dept.color}-200`}>
        <CheckBadgeIconSolid className="w-3 h-3 mr-1" />
        {dept.badge} {dept.name}
      </div>
    );
  };

  const renderFactCheckLabel = (post) => {
    const status = (post && post.fact_check_status) || null;
    if (!status || status === 'pending') return null;

    const statusKey = status.toLowerCase();
    const statusConfig = {
      verified: { icon: CheckCircleIcon, color: 'green', text: 'Verified Information' },
      disputed: { icon: ExclamationTriangleIcon, color: 'yellow', text: 'Disputed Claims' },
      false: { icon: XMarkIcon, color: 'red', text: 'False Information' }
    };

    const config = statusConfig[statusKey];
    if (!config) return null;

    const Icon = config.icon;
    return (
      <div className={`mt-2 p-2 rounded-lg bg-${config.color}-50 border border-${config.color}-200 dark:bg-${config.color}-900/20`}>
        <div className="flex items-center">
          <Icon className={`w-4 h-4 text-${config.color}-600 mr-2`} />
          <span className={`text-sm font-medium text-${config.color}-800 dark:text-${config.color}-200`}>
            {config.text}
          </span>
        </div>
        {post.fact_check_notes && (
          <p className={`mt-1 text-sm text-${config.color}-700 dark:text-${config.color}-300`}>
            {post.fact_check_notes}
          </p>
        )}
      </div>
    );
  };

  // ---------- UI ----------
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <UserGroupIcon className="w-8 h-8 text-blue-600" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Global Community
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Connect with fact-checkers and authorities worldwide
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {!isAuthority && (
              <Button
                onClick={() => setShowAuthorityModal(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <ShieldCheckIcon className="w-4 h-4 mr-2" />
                Authority Access
              </Button>
            )}

            <Button
              onClick={() => setShowPostModal(true)}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              <PlusIcon className="w-4 h-4 mr-2" />
              New Post
            </Button>
          </div>
        </div>

        {/* Authority Status */}
        {isAuthority && authorityData && (
          <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <CheckBadgeIconSolid className="w-6 h-6 text-blue-600" />
                <div>
                  <p className="font-medium text-blue-900 dark:text-blue-100">
                    Verified Authority Account
                  </p>
                  <p className="text-sm text-blue-700 dark:text-blue-300">
                    {authorityDepartments.find(d => d.id === authorityData.department)?.name || authorityData.full_name || authorityData.username}
                  </p>
                </div>
              </div>
              {renderAuthorityBadge({ is_authority: true, authority_department: authorityData?.department })}
            </div>
          </div>
        )}

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search posts, hashtags, or topics..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>

          <div className="flex space-x-2 overflow-x-auto">
            {['all', 'authorities', 'reports', 'verified', 'disputed'].map((filter) => (
              <button
                key={filter}
                onClick={() => setSelectedFilter(filter)}
                className={`px-4 py-2 rounded-lg font-medium capitalize transition-colors whitespace-nowrap ${
                  selectedFilter === filter
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        {/* Database Status */}
        {/* Removed checks for supabaseUrl / supabaseKey (use single client). Keep a demo message if supabase is falsy. */}
        {!supabase && (
          <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200">
            <div className="flex items-center space-x-2">
              <ExclamationTriangleIcon className="w-5 h-5 text-yellow-600" />
              <p className="text-sm text-yellow-800 dark:text-yellow-200">
                <strong>Demo Mode:</strong> Supabase not configured. Posts will be stored locally only.
              </p>
            </div>
          </div>
        )}
      </Card>

      {/* Posts Feed */}
      <div className="space-y-4">
        {loading ? (
          <Card className="p-8 text-center">
            <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">Loading community posts...</p>
          </Card>
        ) : filteredPosts.length === 0 ? (
          <Card className="p-8 text-center">
            <UserGroupIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No posts found
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Be the first to share something with the community!
            </p>
          </Card>
        ) : (
          filteredPosts.map((post) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`${
                post.is_authority
                  ? 'ring-2 ring-blue-200 dark:ring-blue-800 bg-blue-50/50 dark:bg-blue-900/10'
                  : ''
              }`}
            >
              <Card className="p-6">
                {/* Post Header */}
                <div className="flex items-start space-x-3 mb-4">
                  <img
                    src={post.user_avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(post.username || post.user_name || 'User')}&background=random`}
                    alt={post.username || post.user_name || 'User'}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <h3 className="font-semibold text-gray-900 dark:text-white truncate">
                        {post.username || post.user_name || 'Anonymous'}
                      </h3>
                      {post.is_authority && renderAuthorityBadge(post)}
                      {post.post_type === 'report' && (
                        <span className="px-2 py-1 bg-red-100 text-red-800 text-xs font-medium rounded-full dark:bg-red-900 dark:text-red-200">
                          Official Report
                        </span>
                      )}
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                      <ClockIcon className="w-4 h-4" />
                      <span>{post.created_at ? new Date(post.created_at).toLocaleString() : 'Unknown'}</span>
                      {post.location && (
                        <>
                          <MapPinIcon className="w-4 h-4" />
                          <span>{(post.location.city || post.location.city === 0) ? post.location.city : 'Unknown'}, {(post.location.country || post.location.country === 0) ? post.location.country : 'Unknown'}</span>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => factCheckPost(post.id, post.content)}
                      className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors dark:hover:bg-blue-900/20"
                      title="Fact Check"
                    >
                      <MagnifyingGlassIcon className="w-5 h-5" />
                    </button>

                    <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-full transition-colors dark:hover:bg-gray-700">
                      <EllipsisHorizontalIcon className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Post Content */}
                <div className="mb-4">
                  <p className="text-gray-900 dark:text-white whitespace-pre-wrap mb-3">
                    {post.content}
                  </p>

                  {/* Hashtags */}
                  {post.hashtags && post.hashtags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-3">
                      {post.hashtags.map((tag, index) => (
                        <span
                          key={index}
                          className="text-blue-600 hover:text-blue-800 cursor-pointer font-medium"
                        >
                          #{tag.replace(/^#/, '')}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Media */}
                  {post.media && Array.isArray(post.media) && post.media.length > 0 && (
                    <div className="grid grid-cols-2 gap-2 mb-3">
                      {post.media.map((media, index) => (
                        <div key={index} className="relative rounded-lg overflow-hidden">
                          {media.type === 'image' ? (
                            <img
                              src={media.url}
                              alt="Post media"
                              className="w-full h-48 object-cover"
                            />
                          ) : (
                            <video
                              src={media.url}
                              controls
                              className="w-full h-48 object-cover"
                            />
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Fact Check Label */}
                  {renderFactCheckLabel(post)}
                </div>

                {/* Post Actions */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center space-x-6">
                    <button
                      onClick={() => interactWithPost(post.id, 'like')}
                      className="flex items-center space-x-2 text-gray-500 hover:text-red-600 transition-colors"
                    >
                      <HeartIcon className="w-5 h-5" />
                      <span>{post.likes ?? post.likes_count ?? 0}</span>
                    </button>

                    <button
                      onClick={() => setSelectedPost(post)}
                      className="flex items-center space-x-2 text-gray-500 hover:text-blue-600 transition-colors"
                    >
                      <ChatBubbleLeftIcon className="w-5 h-5" />
                      <span>{post.replies_count ?? post.comments_count ?? 0}</span>
                    </button>

                    <button
                      onClick={() => interactWithPost(post.id, 'share')}
                      className="flex items-center space-x-2 text-gray-500 hover:text-green-600 transition-colors"
                    >
                      <ShareIcon className="w-5 h-5" />
                      <span>{post.reposts ?? post.shares_count ?? 0}</span>
                    </button>

                    <button
                      onClick={() => interactWithPost(post.id, 'report', { reason: 'inappropriate' })}
                      className="flex items-center space-x-2 text-gray-500 hover:text-yellow-600 transition-colors"
                    >
                      <FlagIcon className="w-5 h-5" />
                      <span>{post.reports_count ?? 0}</span>
                    </button>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-full transition-colors dark:hover:bg-gray-700">
                      <BookmarkIcon className="w-5 h-5" />
                    </button>

                    {(user?.id === post.user_id || isAuthority) && (
                      <button
                        onClick={() => deletePost(post.id)}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors dark:hover:bg-red-900/20"
                      >
                        <TrashIcon className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                </div>
              </Card>
            </motion.div>
          ))
        )}
      </div>

      {/* Authority Modal */}
      <AnimatePresence>
        {showAuthorityModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowAuthorityModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-md"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  Authority Access
                </h2>
                <button
                  onClick={() => setShowAuthorityModal(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors dark:hover:bg-gray-700"
                >
                  <XMarkIcon className="w-5 h-5" />
                </button>
              </div>

              {/* Login/Register Toggle */}
              <div className="flex mb-6 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
                <button
                  onClick={() => setAuthorityLoginMode('login')}
                  className={`flex-1 py-2 px-4 rounded-md transition-colors ${
                    authorityLoginMode === 'login'
                      ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                      : 'text-gray-600 dark:text-gray-400'
                  }`}
                >
                  Login
                </button>
                <button
                  onClick={() => setAuthorityLoginMode('register')}
                  className={`flex-1 py-2 px-4 rounded-md transition-colors ${
                    authorityLoginMode === 'register'
                      ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                      : 'text-gray-600 dark:text-gray-400'
                  }`}
                >
                  Register
                </button>
              </div>

              <form onSubmit={(e) => { e.preventDefault(); handleAuthorityAuth(); }} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Authority ID
                  </label>
                  <input
                    type="text"
                    required
                    value={authorityForm.authorityId}
                    onChange={(e) => setAuthorityForm(prev => ({ ...prev, authorityId: e.target.value }))}
                    placeholder="Enter your government/organization ID"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Department/Organization
                  </label>
                  <select
                    required
                    value={authorityForm.department}
                    onChange={(e) => setAuthorityForm(prev => ({ ...prev, department: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  >
                    <option value="">Select Department</option>
                    {authorityDepartments.map(dept => (
                      <option key={dept.id} value={dept.id}>
                        {dept.badge} {dept.name}
                      </option>
                    ))}
                  </select>
                </div>

                {authorityLoginMode === 'register' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Full Name
                      </label>
                      <input
                        type="text"
                        required
                        value={authorityForm.name}
                        onChange={(e) => setAuthorityForm(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="Enter your full name"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Official Email
                      </label>
                      <input
                        type="email"
                        required
                        value={authorityForm.email}
                        onChange={(e) => setAuthorityForm(prev => ({ ...prev, email: e.target.value }))}
                        placeholder="Enter your official email"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      />
                    </div>
                  </>
                )}

                <Button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <ShieldCheckIcon className="w-4 h-4 mr-2" />
                  {authorityLoginMode === 'login' ? 'Login as Authority' : 'Register Authority'}
                </Button>
              </form>

              <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                <div className="flex items-start space-x-2">
                  <InformationCircleIcon className="w-5 h-5 text-yellow-600 mt-0.5" />
                  <div className="text-sm text-yellow-800 dark:text-yellow-200">
                    <p className="font-medium mb-1">Authority Verification</p>
                    <p>Authority accounts require manual verification. Please ensure you have valid credentials.</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* New Post Modal */}
      <AnimatePresence>
        {showPostModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowPostModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  Create New Post
                </h2>
                <button
                  onClick={() => setShowPostModal(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors dark:hover:bg-gray-700"
                >
                  <XMarkIcon className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={(e) => { e.preventDefault(); createPost(); }} className="space-y-4">
                {/* Post Type */}
                {isAuthority && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Post Type
                    </label>
                    <div className="flex space-x-4">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          value="regular"
                          checked={postType === 'regular'}
                          onChange={(e) => setPostType(e.target.value)}
                          className="mr-2"
                        />
                        <span className="text-sm text-gray-700 dark:text-gray-300">Regular Post</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          value="report"
                          checked={postType === 'report'}
                          onChange={(e) => setPostType(e.target.value)}
                          className="mr-2"
                        />
                        <span className="text-sm text-gray-700 dark:text-gray-300">Official Report</span>
                      </label>
                    </div>
                  </div>
                )}

                {/* Content */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Content
                  </label>
                  <textarea
                    required
                    value={postContent}
                    onChange={(e) => setPostContent(e.target.value)}
                    placeholder="What's happening in your area? Share information, ask questions, or report incidents..."
                    rows={6}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white resize-none"
                  />
                  <div className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    {postContent.length}/1000 characters
                  </div>
                </div>

                {/* Location */}
                {postLocation && (
                  <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <MapPinIcon className="w-4 h-4 text-gray-600" />
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        {postLocation.city}, {postLocation.country}
                      </span>
                      <button
                        type="button"
                        onClick={() => setPostLocation(null)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <XMarkIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center space-x-2">
                    <button
                      type="button"
                      className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors dark:hover:bg-blue-900/20"
                      title="Add Photo"
                      onClick={() => {
                        // placeholder: integrate file picker / upload flow
                        alert('Add Photo not implemented in this demo. Use upload flow in future.');
                      }}
                    >
                      <PhotoIcon className="w-5 h-5" />
                    </button>
                    <button
                      type="button"
                      className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors dark:hover:bg-blue-900/20"
                      title="Add Video"
                      onClick={() => alert('Add Video not implemented in this demo.')}
                    >
                      <VideoCameraIcon className="w-5 h-5" />
                    </button>
                    <button
                      type="button"
                      className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors dark:hover:bg-blue-900/20"
                      title="Add Link"
                      onClick={() => alert('Add Link not implemented in this demo.')}
                    >
                      <LinkIcon className="w-5 h-5" />
                    </button>
                    <button
                      type="button"
                      className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors dark:hover:bg-blue-900/20"
                      title="Add Location"
                      onClick={() => setShowLocationPicker((s) => !s)}
                    >
                      <MapPinIcon className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Button
                      type="button"
                      onClick={() => setShowPostModal(false)}
                      className="px-4 py-2 text-gray-700 bg-gray-200 hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-300 dark:hover:bg-gray-500"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={!postContent.trim()}
                      className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {postType === 'report' ? 'Publish Report' : 'Post'}
                    </Button>
                  </div>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CommunitySection;
