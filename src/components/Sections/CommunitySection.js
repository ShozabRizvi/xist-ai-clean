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
  MapPinIcon,
  UserPlusIcon
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid, StarIcon as StarIconSolid } from '@heroicons/react/24/solid';
import Card from '../UI/Card';
import Button from '../UI/Button';
import { useResponsive } from '../../hooks/useResponsive';
import PostReporting from '../Community/PostReporting';
import Leaderboard from '../Community/Leaderboard';

const CommunitySection = ({ user, userStats }) => {
  const { screenSize } = useResponsive();
  const [activeTab, setActiveTab] = useState('feed');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [reportingPost, setReportingPost] = useState(null);
  const [showNewPostForm, setShowNewPostForm] = useState(false);
  const [newPost, setNewPost] = useState({ title: '', content: '', tags: [] });
  const [showAuthorityPanel, setShowAuthorityPanel] = useState(false);
  const [showAuthorityReportForm, setShowAuthorityReportForm] = useState(false);
  const [sharedPosts, setSharedPosts] = useState([]);

  // Fixed localStorage keys for XIST AI
  const [posts, setPosts] = useState(() => {
    const savedPosts = localStorage.getItem('xist_community_posts');
    return savedPosts ? JSON.parse(savedPosts) : [
      {
        id: 1,
        author: 'Dr. Sarah Chen',
        authorId: 'user1',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b25ad2be?w=50&h=50&fit=crop&crop=face',
        content: '🚨 URGENT: New AI-powered phishing campaign detected targeting cryptocurrency users. These emails use ChatGPT-like responses to seem legitimate. Key indicators: 1) Asks for wallet recovery phrases, 2) Creates false urgency about account suspension, 3) Links to fake exchange websites. Stay vigilant! #CryptoSecurity #PhishingAlert',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        likes: 89,
        dislikes: 2,
        comments: 23,
        shares: 34,
        views: 456,
        tags: ['phishing', 'cryptocurrency', 'ai', 'urgent'],
        verified: true,
        pinned: true,
        trending: true,
        threatLevel: 'critical',
        liked: false,
        disliked: false,
        expert: true,
        reputation: 'Diamond Expert'
      },
      {
        id: 2,
        author: 'Alex Thompson',
        authorId: 'user2',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop&crop=face',
        content: 'Thanks to this community, I avoided a romance scam that could have cost me $15,000! The red flags you all taught me to look for were spot on. Sharing my experience to help others. 🙏 #CommunitySupport #RomanceScamAwareness',
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
        likes: 156,
        dislikes: 0,
        comments: 45,
        shares: 67,
        views: 892,
        tags: ['romance-scam', 'success-story', 'gratitude'],
        verified: false,
        provisional: true,
        liked: false,
        disliked: false,
        reputation: 'Trusted Member'
      },
      {
        id: 3,
        author: 'Mike Rodriguez',
        authorId: 'user3',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop&crop=face',
        content: '📊 Weekly Threat Report: We\'ve seen a 340% increase in fake investment schemes using deepfake videos of celebrities. These scams are becoming incredibly sophisticated. Always verify investment opportunities through official channels. Never trust social media ads for investments! #WeeklyReport #InvestmentScams #DeepfakeAlert',
        timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
        likes: 203,
        dislikes: 1,
        comments: 67,
        shares: 89,
        views: 1247,
        tags: ['investment-scams', 'deepfake', 'weekly-report', 'celebrity-fraud'],
        verified: true,
        expert: true,
        liked: false,
        disliked: false,
        reputation: 'Gold Expert'
      }
    ];
  });

  const [authorityReports, setAuthorityReports] = useState(() => {
    const savedReports = localStorage.getItem('xist_authority_reports');
    return savedReports ? JSON.parse(savedReports) : [
      {
        id: 'auth-001',
        type: 'authority_alert',
        authority: 'FBI Cyber Division',
        title: 'CRITICAL: Nation-State Actor Targeting Critical Infrastructure',
        content: 'Federal agencies have identified coordinated attacks by advanced persistent threat (APT) groups targeting power grid and water treatment facilities across multiple states.',
        priority: 'CRITICAL',
        timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
        verified: true,
        official: true,
        region: 'United States',
        threatLevel: 'national_security',
        affectedSectors: ['Energy', 'Water', 'Transportation']
      },
      {
        id: 'auth-002',
        type: 'authority_warning',
        authority: 'Federal Trade Commission',
        title: 'HIGH ALERT: Massive Cryptocurrency Ponzi Scheme Discovered',
        content: 'FTC warns consumers about "CryptoMax Pro" - a fraudulent investment platform that has already stolen over $200M from victims nationwide.',
        priority: 'HIGH',
        timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
        verified: true,
        official: true,
        region: 'United States',
        threatLevel: 'financial_fraud',
        affectedSectors: ['Financial Services', 'Cryptocurrency']
      }
    ];
  });

  // Auto-save to localStorage when data changes
  useEffect(() => {
    localStorage.setItem('xist_community_posts', JSON.stringify(posts));
  }, [posts]);

  useEffect(() => {
    localStorage.setItem('xist_authority_reports', JSON.stringify(authorityReports));
  }, [authorityReports]);

  // Fixed sessionStorage key for shared posts from VerifySection
  useEffect(() => {
    const checkForSharedPost = () => {
      const sharedPostData = sessionStorage.getItem('sharedToXistCommunity');
      if (sharedPostData) {
        try {
          const postData = JSON.parse(sharedPostData);
          handleAddSharedPost(postData);
          sessionStorage.removeItem('sharedToXistCommunity');
        } catch (error) {
          console.error('Error parsing shared post data:', error);
        }
      }
    };
    
    checkForSharedPost();
    window.addEventListener('storage', checkForSharedPost);
    return () => window.removeEventListener('storage', checkForSharedPost);
  }, []);

  // Populated challenges data
  const [challenges, setChallenges] = useState([
    {
      id: 'challenge-1',
      title: 'Phishing Email Detection Master',
      description: 'Test your ability to identify sophisticated phishing attempts and social engineering tactics',
      difficulty: 'Intermediate',
      participants: 2847,
      timeLimit: '15 minutes',
      questions: 25,
      reward: '500 XP + Security Badge',
      category: 'Email Security',
      icon: '🎣',
      status: 'active',
      leaderboard: [
        { name: 'Dr. Sarah Chen', score: 98, time: '12:45' },
        { name: 'Mike Rodriguez', score: 96, time: '13:22' },
        { name: 'Elena Vasquez', score: 94, time: '14:10' }
      ]
    },
    {
      id: 'challenge-2',
      title: 'Cryptocurrency Scam Spotter',
      description: 'Identify fake crypto investment schemes and romance scam red flags',
      difficulty: 'Advanced',
      participants: 1923,
      timeLimit: '20 minutes',
      questions: 30,
      reward: '750 XP + Crypto Expert Badge',
      category: 'Financial Security',
      icon: '💰',
      status: 'active',
      leaderboard: [
        { name: 'Alex Thompson', score: 92, time: '18:33' },
        { name: 'Jessica Park', score: 90, time: '19:15' },
        { name: 'David Kim', score: 88, time: '19:45' }
      ]
    },
    {
      id: 'challenge-3',
      title: 'Deepfake Detection Challenge',
      description: 'Learn to spot AI-generated content and manipulated media',
      difficulty: 'Expert',
      participants: 1456,
      timeLimit: '25 minutes',
      questions: 20,
      reward: '1000 XP + AI Detection Master Badge',
      category: 'Digital Security',
      icon: '🤖',
      status: 'active',
      leaderboard: [
        { name: 'Prof. Chen Liu', score: 95, time: '22:10' },
        { name: 'Maya Singh', score: 93, time: '23:55' },
        { name: 'Tom Wilson', score: 91, time: '24:30' }
      ]
    }
  ]);

  // Populated events data
  const [events, setEvents] = useState([
    {
      id: 'event-1',
      title: 'Cybersecurity Trends 2025: AI Threats & Defenses',
      speaker: 'Dr. Sarah Chen & Mike Rodriguez',
      date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
      time: '2:00 PM EST',
      duration: '90 minutes',
      attendees: 1247,
      maxAttendees: 2000,
      type: 'Webinar',
      category: 'Digital Security',
      description: 'Explore emerging AI-powered threats and learn advanced defense strategies from leading cybersecurity experts.',
      tags: ['AI', 'Threats', 'Defense', 'Trends'],
      status: 'upcoming',
      isRegistered: false,
      image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400&h=200&fit=crop',
      agenda: [
        'Current AI Threat Landscape',
        'Deepfake Detection Techniques',
        'Automated Defense Systems',
        'Q&A Session'
      ]
    },
    {
      id: 'event-2',
      title: 'Romance Scam Prevention Workshop',
      speaker: 'Elena Vasquez & Community Survivors',
      date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
      time: '7:00 PM EST',
      duration: '2 hours',
      attendees: 892,
      maxAttendees: 1500,
      type: 'Interactive Workshop',
      category: 'Psychology',
      description: 'Learn to identify and avoid romance scams through real case studies and survivor testimonials.',
      tags: ['Romance Scams', 'Prevention', 'Psychology', 'Support'],
      status: 'upcoming',
      isRegistered: true,
      image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=200&fit=crop',
      agenda: [
        'Psychology of Romance Scams',
        'Red Flag Recognition',
        'Survivor Stories',
        'Support Resources'
      ]
    },
    {
      id: 'event-3',
      title: 'Cryptocurrency Security Deep Dive',
      speaker: 'Blockchain Security Alliance',
      date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      time: '11:00 AM EST',
      duration: '3 hours',
      attendees: 567,
      maxAttendees: 1000,
      type: 'Technical Session',
      category: 'Financial Security',
      description: 'Advanced cryptocurrency security practices, wallet protection, and identifying investment fraud.',
      tags: ['Cryptocurrency', 'Blockchain', 'Wallets', 'Investment'],
      status: 'upcoming',
      isRegistered: false,
      image: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=400&h=200&fit=crop',
      agenda: [
        'Wallet Security Best Practices',
        'DeFi Risk Assessment',
        'Scam Identification',
        'Legal Perspectives'
      ]
    }
  ]);

  const [communityStats, setCommunityStats] = useState({
    totalMembers: 12847,
    onlineNow: 1432,
    postsToday: 234,
    expertsOnline: 45,
    threatsReported: 3456,
    accuracyRate: 98.7
  });

  const [expertMembers] = useState([
    {
      id: 1,
      name: 'Dr. Sarah Chen',
      title: 'Cybersecurity Researcher',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b25ad2be?w=50&h=50&fit=crop&crop=face',
      verified: true,
      reputation: 'Expert',
      level: 'Diamond',
      contributions: 1247,
      online: true,
      category: 'Digital Security',
      specialties: ['AI Security', 'Threat Detection', 'Misinformation Analysis']
    },
    {
      id: 2,
      name: 'Mike Rodriguez',
      title: 'Fraud Investigation Specialist',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop&crop=face',
      verified: true,
      reputation: 'Expert',
      level: 'Gold',
      contributions: 892,
      online: true,
      category: 'Financial Security',
      specialties: ['Financial Fraud', 'Social Engineering', 'Romance Scams']
    },
    {
      id: 3,
      name: 'Elena Vasquez',
      title: 'Medical Misinformation Expert',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=50&h=50&fit=crop&crop=face',
      verified: true,
      reputation: 'Expert',
      level: 'Gold',
      contributions: 734,
      online: false,
      category: 'Misinformation',
      specialties: ['Health Claims', 'Medical Research', 'Vaccine Information']
    }
  ]);

  // Authority Panel States
  const [authorityId, setAuthorityId] = useState('');
  const [authorityIdType, setAuthorityIdType] = useState('law_enforcement');
  const [isAuthorityVerified, setIsAuthorityVerified] = useState(false);
  const [pendingAuthorityReports, setPendingAuthorityReports] = useState([
    {
      id: 1,
      type: 'misinformation',
      content: 'False claim about vaccine safety spreading on social media',
      reporter: 'Dr. Sarah Chen',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      severity: 'high',
      status: 'pending'
    },
    {
      id: 2,
      type: 'scam',
      content: 'Cryptocurrency investment fraud targeting elderly users',
      reporter: 'Mike Rodriguez',
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
      severity: 'critical',
      status: 'under_review'
    }
  ]);

  // 🎨 Category color mapping like in your image
  const getCategoryColor = (category) => {
    const colors = {
      'All Categories': 'from-purple-500 to-pink-500',
      'Email Security': 'from-blue-500 to-indigo-500',
      'Misinformation': 'from-red-500 to-pink-500',
      'Financial Security': 'from-green-500 to-emerald-500',
      'Psychology': 'from-orange-500 to-red-500',
      'Mobile Security': 'from-cyan-500 to-blue-500',
      'Digital Security': 'from-purple-500 to-indigo-500'
    };
    return colors[category] || 'from-gray-500 to-gray-600';
  };

  // Updated shared post content to use Xist AI branding
  const handleAddSharedPost = (sharedData) => {
    const postData = {
      id: `shared-${Date.now()}`,
      author: user?.displayName || 'Anonymous User',
      authorId: user?.uid || 'anonymous',
      avatar: user?.photoURL || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=50&h=50&fit=crop&crop=face',
      content: `🔍 **Analysis Shared:** I analyzed this content using Xist AI and wanted to share the results.

**Original Content:** "${sharedData.content}"

**Analysis Result:** ${sharedData.result} (${sharedData.score}% confidence)

**Detected Issues:** ${sharedData.details}

#AnalysisShared #ThreatDetection #CommunityWarning`,
      timestamp: new Date().toISOString(),
      likes: 0,
      dislikes: 0,
      comments: 0,
      shares: 0,
      views: 1,
      tags: ['analysis-shared', 'threat-detection', 'user-contribution'],
      verified: false,
      shared: true,
      analysisResult: sharedData.result,
      analysisScore: sharedData.score,
      originalContent: sharedData.content,
      liked: false,
      disliked: false,
      reputation: 'Community Contributor'
    };

    setPosts(prev => [postData, ...prev]);
    console.log('Analysis shared to community successfully!');
  };

  // Handle post interactions
  const handleLike = (postId) => {
    setPosts(prev => prev.map(post =>
      post.id === postId
        ? {
            ...post,
            likes: post.liked ? post.likes - 1 : post.likes + 1,
            dislikes: post.disliked ? post.dislikes - 1 : post.dislikes,
            liked: !post.liked,
            disliked: false
          }
        : post
    ));
  };

  const handleDislike = (postId) => {
    setPosts(prev => prev.map(post =>
      post.id === postId
        ? {
            ...post,
            dislikes: post.disliked ? post.dislikes - 1 : post.dislikes + 1,
            likes: post.liked ? post.likes - 1 : post.likes,
            disliked: !post.disliked,
            liked: false
          }
        : post
    ));
  };

  const handleReport = async (reportData) => {
    console.log('Report submitted:', reportData);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setPosts(prev => prev.map(post =>
      post.id === reportData.postId
        ? { ...post, reported: true }
        : post
    ));
  };

  const handleNewPost = async (e) => {
    e.preventDefault();
    if (!newPost.content.trim()) return;

    const postData = {
      id: Date.now(),
      author: user?.displayName || 'Anonymous',
      authorId: user?.uid || 'anonymous',
      avatar: user?.photoURL || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=50&h=50&fit=crop&crop=face',
      content: newPost.content,
      timestamp: new Date().toISOString(),
      likes: 0,
      dislikes: 0,
      comments: 0,
      shares: 0,
      views: 1,
      tags: newPost.tags,
      verified: false,
      liked: false,
      disliked: false,
      reputation: 'New Member'
    };

    setPosts(prev => [postData, ...prev]);
    setNewPost({ title: '', content: '', tags: [] });
    setShowNewPostForm(false);
  };

  // Challenge Functions
  const handleStartChallenge = (challengeId) => {
    console.log('Starting challenge:', challengeId);
    alert(`Starting challenge: ${challenges.find(c => c.id === challengeId)?.title}`);
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Beginner': return 'text-green-600 bg-green-50 dark:bg-green-900/20';
      case 'Intermediate': return 'text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20';
      case 'Advanced': return 'text-orange-600 bg-orange-50 dark:bg-orange-900/20';
      case 'Expert': return 'text-red-600 bg-red-50 dark:bg-red-900/20';
      default: return 'text-gray-600 bg-gray-50 dark:bg-gray-800';
    }
  };

  // Event Functions
  const handleEventRegistration = (eventId) => {
    setEvents(prev => prev.map(event =>
      event.id === eventId
        ? {
            ...event,
            isRegistered: !event.isRegistered,
            attendees: event.isRegistered ? event.attendees - 1 : event.attendees + 1
          }
        : event
    ));
  };

  const getEventStatusColor = (status) => {
    switch (status) {
      case 'upcoming': return 'text-blue-600 bg-blue-50 dark:bg-blue-900/20';
      case 'featured': return 'text-purple-600 bg-purple-50 dark:bg-purple-900/20';
      case 'live': return 'text-green-600 bg-green-50 dark:bg-green-900/20';
      default: return 'text-gray-600 bg-gray-50 dark:bg-gray-800';
    }
  };

  // Authority Panel Functions
  const authorityTypes = [
    { value: 'law_enforcement', label: 'Law Enforcement Agency' },
    { value: 'cybersecurity', label: 'Cybersecurity Organization' },
    { value: 'government', label: 'Government Authority' },
    { value: 'academic', label: 'Academic Institution' },
    { value: 'ngo', label: 'Non-Governmental Organization' }
  ];

  const handleVerifyAuthority = () => {
    if (authorityId.trim()) {
      setIsAuthorityVerified(true);
      console.log('Authority verification submitted:', { authorityId, authorityIdType });
    }
  };

  const handleAuthorityReportAction = (reportId, action) => {
    setPendingAuthorityReports(prev =>
      prev.map(report =>
        report.id === reportId
          ? { ...report, status: action }
          : report
      )
    );
    console.log(`Authority report ${reportId} ${action}`);
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'critical': return 'text-red-600 bg-red-50 dark:bg-red-900/20';
      case 'high': return 'text-orange-600 bg-orange-50 dark:bg-orange-900/20';
      case 'medium': return 'text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20';
      case 'low': return 'text-green-600 bg-green-50 dark:bg-green-900/20';
      default: return 'text-gray-600 bg-gray-50 dark:bg-gray-800';
    }
  };

  const getBadgeIcon = (user) => {
    if (user.expert) return <CheckBadgeIcon className="w-4 h-4 text-blue-500" />;
    if (user.verified) return <CheckCircleIcon className="w-4 h-4 text-green-500" />;
    return null;
  };

  // Filtered and sorted data
  const filteredPosts = posts.filter(post => {
    const matchesSearch = !searchQuery || 
      post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.author.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFilter = selectedFilter === 'all' ||
      post.tags.some(tag => tag.toLowerCase().includes(selectedFilter.toLowerCase()));
    
    return matchesSearch && matchesFilter;
  });

  // Tab content renderer
  const renderTabContent = () => {
    switch (activeTab) {
      case 'feed':
        return (
          <div className="space-y-6">
            {/* Search and Filter Bar */}
            <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-lg border border-white/20">
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search discussions, threats, alerts..."
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <select
                    className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                    value={selectedFilter}
                    onChange={(e) => setSelectedFilter(e.target.value)}
                  >
                    <option value="all">All Categories</option>
                    <option value="phishing">Phishing</option>
                    <option value="scam">Scams</option>
                    <option value="misinformation">Misinformation</option>
                    <option value="cryptocurrency">Cryptocurrency</option>
                    <option value="urgent">Urgent Alerts</option>
                  </select>
                  <Button
                    
                    size="sm"
                    onClick={() => setShowNewPostForm(true)}
                    className="flex items-center gap-1"
                  >
                    <PlusIcon className="w-6 h-5" />
                  New Post
                  </Button>
                </div>
              </div>
            </div>

            {/* Community Stats */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg border border-white/20">
              <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-neon-cyan">{communityStats.totalMembers.toLocaleString()}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Members</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-500">{communityStats.onlineNow.toLocaleString()}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Online Now</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-500">{communityStats.postsToday}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Posts Today</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-500">{communityStats.expertsOnline}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Experts Online</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-500">{communityStats.threatsReported.toLocaleString()}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Threats Reported</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-500">{communityStats.accuracyRate}%</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Accuracy Rate</div>
                </div>
              </div>
            </div>

            {/* Posts Feed */}
            <div className="space-y-4">
              {filteredPosts.length === 0 ? (
                <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg border border-white/20 text-center">
                  <div className="text-gray-500 dark:text-gray-400 mb-4">
                    <UserGroupIcon className="w-12 h-12 mx-auto mb-2" />
                    <p className="text-lg font-medium">No posts found</p>
                    <p className="text-sm">
                      {searchQuery || selectedFilter !== 'all' 
                        ? 'Try adjusting your search or filters' 
                        : 'Be the first to share a security alert!'}
                    </p>
                  </div>
                  <Button
                    onClick={() => setShowNewPostForm(true)}
                    className="bg-neon-cyan hover:bg-neon-cyan/80"
                  >
                    Create First Post
                  </Button>
                </div>
              ) : (
                filteredPosts.map((post) => (
                  <motion.div
                    key={post.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`${post.authority ? 'ring-2 ring-red-500 bg-red-50 dark:bg-red-900/10' : ''}`}
                  >
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg border border-white/20">
                      {/* Post Header */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={post.avatar}
                            alt={post.author}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-gray-900 dark:text-gray-100">
                                {post.author}
                              </span>
                              {getBadgeIcon(post)}
                              {post.pinned && (
                                <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-200 rounded-full">
                                  PINNED
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                              <span>{post.reputation}</span>
                              <span>•</span>
                              <span>{new Date(post.timestamp).toLocaleString()}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {post.trending && (
                            <FireIcon className="w-5 h-5 text-orange-500" title="Trending" />
                          )}
                          <button
                            onClick={() => setReportingPost(post)}
                            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded"
                          >
                            <FlagIcon className="w-4 h-4 text-gray-400" />
                          </button>
                        </div>
                      </div>

                      {/* Post Content */}
                      <div className="mb-4">
                        <p className="text-gray-900 dark:text-gray-100 whitespace-pre-wrap">
                          {post.content}
                        </p>
                      </div>

                      {/* Tags */}
                      {post.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-4">
                          {post.tags.map((tag) => (
                            <span
                              key={tag}
                              className="px-2 py-1 text-xs bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200 rounded-full"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Post Actions */}
                      <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                        <div className="flex items-center gap-6">
                          <button
                            onClick={() => handleLike(post.id)}
                            className={`flex items-center gap-1 text-sm ${
                              post.liked ? 'text-blue-600' : 'text-gray-600 dark:text-gray-400'
                            } hover:text-blue-600`}
                          >
                            <HandThumbUpIcon className="w-4 h-4" />
                            {post.likes}
                          </button>
                          <button
                            onClick={() => handleDislike(post.id)}
                            className={`flex items-center gap-1 text-sm ${
                              post.disliked ? 'text-red-600' : 'text-gray-600 dark:text-gray-400'
                            } hover:text-red-600`}
                          >
                            <HandThumbDownIcon className="w-4 h-4" />
                            {post.dislikes}
                          </button>
                          <span className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
                            <ChatBubbleLeftIcon className="w-4 h-4" />
                            {post.comments}
                          </span>
                          <span className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
                            <ShareIcon className="w-4 h-4" />
                            {post.shares}
                          </span>
                        </div>
                        <span className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
                          <EyeIcon className="w-4 h-4" />
                          {post.views} views
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </div>
        );

      case 'experts':
        return (
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg border border-white/20">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                Connect with verified security professionals and misinformation experts
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {expertMembers.map((expert) => (
                  <motion.div
                    key={expert.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    whileHover={{ scale: 1.02 }}
                    className="transition-transform"
                  >
                    {/* 🎨 Updated card design matching your image */}
                    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300">
                      {/* Category Badge */}
                      <div className={`inline-block px-4 py-2 rounded-full text-white text-sm font-medium mb-4 bg-gradient-to-r ${getCategoryColor(expert.category)}`}>
                        {expert.category}
                      </div>
                      
                      <div className="flex items-center gap-3 mb-3">
                        <div className="relative">
                          <img
                            src={expert.avatar}
                            alt={expert.name}
                            className="w-12 h-12 rounded-full object-cover"
                          />
                          {expert.online && (
                            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-gray-800"></div>
                          )}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-medium text-gray-900 dark:text-gray-100">
                              {expert.name}
                            </h4>
                            {expert.verified && (
                              <CheckBadgeIcon className="w-4 h-4 text-blue-500" />
                            )}
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {expert.title}
                          </p>
                        </div>
                      </div>
                      
                      <div className="mb-3">
                        <div className="flex items-center justify-between text-sm mb-1">
                          <span className="text-gray-600 dark:text-gray-400">Reputation</span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            expert.level === 'Diamond' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-200' :
                            expert.level === 'Gold' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-200' :
                            'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'
                          }`}>
                            {expert.level} {expert.reputation}
                          </span>
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          <span className="font-medium">{expert.contributions}</span> contributions
                        </div>
                      </div>

                      <div className="mb-4">
                        <h5 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
                          Specialties
                        </h5>
                        <div className="flex flex-wrap gap-1">
                          {expert.specialties.map((specialty) => (
                            <span
                              key={specialty}
                              className="px-2 py-1 text-xs bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300 rounded-full"
                            >
                              {specialty}
                            </span>
                          ))}
                        </div>
                      </div>

                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full"
                        disabled={!expert.online}
                      >
                        {expert.online ? 'Connect' : 'Offline'}
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'threats':
        return (
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg border border-white/20">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                Real-time threat detection and community-reported incidents
              </h3>
              
              {/* Authority Reports */}
              <div className="space-y-4">
                <h4 className="font-medium text-gray-900 dark:text-gray-100">
                  Verified reports from government agencies, cybersecurity firms, and trusted authorities
                </h4>
                {authorityReports.map((report) => (
                  <motion.div
                    key={report.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                  >
                    <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-lg border border-white/20 border-l-4 border-l-red-500 bg-red-50 dark:bg-red-900/10">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <ExclamationTriangleIcon className="w-5 h-5 text-red-600" />
                            <span className={`px-2 py-1 text-xs font-bold rounded-full ${
                              report.priority === 'CRITICAL' 
                                ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-200'
                                : 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-200'
                            }`}>
                              {report.priority}
                            </span>
                            <span className="text-sm text-gray-600 dark:text-gray-400">
                              {report.authority}
                            </span>
                          </div>
                          <h5 className="font-medium text-gray-900 dark:text-gray-100 mb-2">
                            {report.title}
                          </h5>
                          <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">
                            {report.content}
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {report.affectedSectors.map((sector) => (
                              <span
                                key={sector}
                                className="px-2 py-1 text-xs bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 rounded"
                              >
                                {sector}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {new Date(report.timestamp).toLocaleString()}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'challenges':
        return (
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg border border-white/20">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    Security Challenges
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Test your cybersecurity knowledge and compete with other community members
                  </p>
                </div>
                <TrophyIcon className="w-8 h-8 text-yellow-500" />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {challenges.map((challenge) => (
                  <motion.div
                    key={challenge.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    whileHover={{ scale: 1.02 }}
                    className="transition-transform"
                  >
                    {/* 🎨 Updated card design matching your image */}
                    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-white/20 h-full">
                      {/* Category Badge */}
                      <div className={`inline-block px-4 py-2 rounded-full text-white text-sm font-medium mb-4 bg-gradient-to-r ${getCategoryColor(challenge.category)}`}>
                        {challenge.category}
                      </div>

                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="text-3xl">{challenge.icon}</div>
                          <div>
                            <h4 className="font-semibold text-gray-900 dark:text-gray-100">
                              {challenge.title}
                            </h4>
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getDifficultyColor(challenge.difficulty)}`}>
                              {challenge.difficulty}
                            </span>
                          </div>
                        </div>
                      </div>

                      <p className="text-sm text-gray-700 dark:text-gray-300 mb-4">
                        {challenge.description}
                      </p>

                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div className="text-center">
                          <div className="text-lg font-bold text-neon-cyan">
                            {challenge.participants.toLocaleString()}
                          </div>
                          <div className="text-xs text-gray-600 dark:text-gray-400">
                            Participants
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-bold text-purple-500">
                            {challenge.questions}
                          </div>
                          <div className="text-xs text-gray-600 dark:text-gray-400">
                            Questions
                          </div>
                        </div>
                      </div>

                      <div className="mb-4">
                        <div className="flex items-center justify-between text-sm mb-2">
                          <span className="text-gray-600 dark:text-gray-400">Time Limit</span>
                          <span className="font-medium text-gray-900 dark:text-gray-100">
                            {challenge.timeLimit}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-sm mb-2">
                          <span className="text-gray-600 dark:text-gray-400">Reward</span>
                          <span className="font-medium text-yellow-600">
                            {challenge.reward}
                          </span>
                        </div>
                      </div>

                      {/* Leaderboard Preview */}
                      <div className="mb-4">
                        <h5 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
                          Top Performers
                        </h5>
                        <div className="space-y-1">
                          {challenge.leaderboard.slice(0, 3).map((entry, index) => (
                            <div key={index} className="flex items-center justify-between text-sm">
                              <div className="flex items-center gap-2">
                                <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                                  #{index + 1}
                                </span>
                                <span className="text-gray-900 dark:text-gray-100">
                                  {entry.name}
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="font-medium text-green-600">
                                  {entry.score}%
                                </span>
                                <span className="text-gray-500 dark:text-gray-400">
                                  {entry.time}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <Button
                        onClick={() => handleStartChallenge(challenge.id)}
                        className="w-full bg-gradient-to-r from-neon-cyan to-purple-600 hover:from-neon-cyan/80 hover:to-purple-600/80"
                      >
                        Start Challenge
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'events':
        return (
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg border border-white/20">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    Upcoming Events
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Join webinars, workshops, and discussions with security experts
                  </p>
                </div>
                <CalendarIcon className="w-8 h-8 text-blue-500" />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {events.map((event) => (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    whileHover={{ y: -5 }}
                    className="transition-transform"
                  >
                    {/* 🎨 Updated card design matching your image */}
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-white/20 overflow-hidden h-full">
                      {/* Category Badge at top */}
                      <div className="p-4 pb-0">
                        <div className={`inline-block px-4 py-2 rounded-full text-white text-sm font-medium bg-gradient-to-r ${getCategoryColor(event.category)}`}>
                          {event.category}
                        </div>
                      </div>

                      {/* Event Image */}
                      <div className="relative h-48 mx-4 mt-2 rounded-xl overflow-hidden">
                        <img
                          src={event.image}
                          alt={event.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-4 left-4">
                          <span className={`px-3 py-1 text-xs font-medium rounded-full ${getEventStatusColor(event.status)}`}>
                            {event.status.toUpperCase()}
                          </span>
                        </div>
                        <div className="absolute top-4 right-4">
                          <div className="bg-white dark:bg-gray-800 rounded-lg p-2 text-center shadow-lg">
                            <div className="text-lg font-bold text-gray-900 dark:text-gray-100">
                              {new Date(event.date).getDate()}
                            </div>
                            <div className="text-xs text-gray-600 dark:text-gray-400 uppercase">
                              {new Date(event.date).toLocaleDateString('en-US', { month: 'short' })}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="p-6">
                        <div className="mb-4">
                          <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                            {event.title}
                          </h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                            by {event.speaker}
                          </p>
                          <p className="text-sm text-gray-700 dark:text-gray-300">
                            {event.description}
                          </p>
                        </div>

                        {/* Event Details */}
                        <div className="space-y-2 mb-4">
                          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                            <CalendarIcon className="w-4 h-4" />
                            <span>{new Date(event.date).toLocaleDateString()}</span>
                            <span>•</span>
                            <span>{event.time}</span>
                            <span>•</span>
                            <span>{event.duration}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                            <UsersIcon className="w-4 h-4" />
                            <span>{event.attendees.toLocaleString()} registered</span>
                            <span>•</span>
                            <span>{event.type}</span>
                          </div>
                        </div>

                        {/* Event Tags */}
                        <div className="flex flex-wrap gap-2 mb-4">
                          {event.tags.map((tag) => (
                            <span
                              key={tag}
                              className="px-2 py-1 text-xs bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300 rounded-full"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>

                        {/* Agenda Preview */}
                        <div className="mb-4">
                          <h5 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
                            Agenda
                          </h5>
                          <ul className="space-y-1">
                            {event.agenda.slice(0, 3).map((item, index) => (
                              <li key={index} className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2">
                                <div className="w-1.5 h-1.5 bg-neon-cyan rounded-full"></div>
                                {item}
                              </li>
                            ))}
                            {event.agenda.length > 3 && (
                              <li className="text-sm text-gray-500 dark:text-gray-500 italic">
                                +{event.agenda.length - 3} more items...
                              </li>
                            )}
                          </ul>
                        </div>

                        {/* Registration Button */}
                        <Button
                          onClick={() => handleEventRegistration(event.id)}
                          variant={event.isRegistered ? "outline" : "default"}
                          className={`w-full ${
                            !event.isRegistered 
                              ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-600/80 hover:to-purple-600/80' 
                              : 'text-green-600 border-green-600 hover:bg-green-50 dark:hover:bg-green-900/20'
                          }`}
                        >
                          {event.isRegistered ? (
                            <>
                              <CheckCircleIcon className="w-4 h-4 mr-2" />
                              Registered
                            </>
                          ) : (
                            <>
                              <CalendarIcon className="w-4 h-4 mr-2" />
                              Register Now
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'authority':
        return (
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg border border-white/20">
              <div className="flex items-center gap-3 mb-6">
                <ShieldCheckIcon className="w-8 h-8 text-blue-600" />
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    Authority Panel
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Authorized personnel can access advanced threat intelligence and investigation tools
                  </p>
                </div>
              </div>

              {!isAuthorityVerified ? (
                <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg border border-white/20 bg-yellow-50 dark:bg-yellow-900/10 border-yellow-200 dark:border-yellow-800">
                  <div className="text-center mb-6">
                    <ExclamationTriangleIcon className="w-12 h-12 text-yellow-600 mx-auto mb-3" />
                    <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                      Authority Verification Required
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
                      This section is restricted to verified law enforcement agencies, cybersecurity organizations, and government authorities.
                    </p>
                  </div>

                  <div className="max-w-md mx-auto space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Authority Type
                      </label>
                      <select
                        value={authorityIdType}
                        onChange={(e) => setAuthorityIdType(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800"
                      >
                        {authorityTypes.map(type => (
                          <option key={type.value} value={type.value}>
                            {type.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Authority Identification
                      </label>
                      <input
                        type="text"
                        placeholder="Enter badge number, department ID, or organization code"
                        value={authorityId}
                        onChange={(e) => setAuthorityId(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800"
                      />
                    </div>

                    <Button
                      onClick={handleVerifyAuthority}
                      className="w-full bg-blue-600 hover:bg-blue-700"
                      disabled={!authorityId.trim()}
                    >
                      <ShieldCheckIcon className="w-4 h-4 mr-2" />
                      Verify Authority Access
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-lg border border-white/20 bg-green-50 dark:bg-green-900/10 border-green-200 dark:border-green-800">
                    <div className="flex items-center gap-3">
                      <CheckBadgeIcon className="w-6 h-6 text-green-600" />
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900 dark:text-gray-100">
                          Authority Access Verified
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          ID: {authorityId} • Access Level: Tier 1 • Last Login: {new Date().toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Pending Reports */}
                  <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg border border-white/20">
                    <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-4">
                      Pending Community Reports
                    </h4>
                    <div className="space-y-3">
                      {pendingAuthorityReports.map((report) => (
                        <div
                          key={report.id}
                          className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg"
                        >
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <span className={`px-2 py-1 text-xs font-medium rounded-full ${getSeverityColor(report.severity)}`}>
                                {report.severity.toUpperCase()}
                              </span>
                              <span className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-100">
                                {report.type}
                              </span>
                            </div>
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              {new Date(report.timestamp).toLocaleString()}
                            </span>
                          </div>
                          <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                            {report.content}
                          </p>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600 dark:text-gray-400">
                              Reported by: {report.reporter}
                            </span>
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleAuthorityReportAction(report.id, 'investigating')}
                              >
                                Investigate
                              </Button>
                              <Button
                                size="sm"
                                onClick={() => handleAuthorityReportAction(report.id, 'approved')}
                              >
                                Approve
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", duration: 0.8 }}
                    className="relative inline-block"
                  >
                    <UserGroupIcon className="w-12 h-12 md:w-16 md:h-16 mx-auto mb-4 text-purple-600" />
          </motion.div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            Community Security Hub
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Connect with security experts, share threat intelligence, and collaborate to make the internet safer for everyone
          </p>
        </div>

        {/* 🎨 Updated Navigation Tabs with category-style design */}
        <div className="bg-white dark:bg-gray-800 p-1 mb-8 rounded-2xl shadow-lg border border-white/20">
          <div className="flex flex-wrap gap-1">
            {[
              { id: 'feed', label: 'Community Feed', icon: UsersIcon, category: 'All Categories' },
              { id: 'experts', label: 'Experts', icon: AcademicCapIcon, category: 'Digital Security' },
              { id: 'threats', label: 'Threat Intel', icon: ExclamationTriangleIcon, category: 'Financial Security' },
              { id: 'challenges', label: 'Challenges', icon: TrophyIcon, category: 'Email Security' },
              { id: 'events', label: 'Events', icon: CalendarIcon, category: 'Psychology' },
              { id: 'authority', label: 'Authority Panel', icon: ShieldCheckIcon, category: 'Misinformation' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  activeTab === tab.id
                    ? `text-white bg-gradient-to-r ${getCategoryColor(tab.category)} shadow-lg`
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {screenSize === 'mobile' ? '' : tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {renderTabContent()}
          </motion.div>
        </AnimatePresence>

        {/* Modals */}
        <AnimatePresence>
          {/* New Post Form Modal */}
          {showNewPostForm && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
              onClick={() => setShowNewPostForm(false)}
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-2xl shadow-2xl border border-white/20"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    Share Security Alert
                  </h3>
                  <button
                    onClick={() => setShowNewPostForm(false)}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                  >
                    <XMarkIcon className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleNewPost} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Content
                    </label>
                    <textarea
                      value={newPost.content}
                      onChange={(e) => setNewPost(prev => ({ ...prev, content: e.target.value }))}
                      placeholder="Share your security findings, warnings, or ask questions..."
                      rows={6}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 resize-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Tags (comma-separated)
                    </label>
                    <input
                      type="text"
                      value={newPost.tags.join(', ')}
                      onChange={(e) => setNewPost(prev => ({
                        ...prev,
                        tags: e.target.value.split(',').map(tag => tag.trim()).filter(Boolean)
                      }))}
                      placeholder="phishing, scam, urgent, cryptocurrency..."
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800"
                    />
                  </div>

                  <div className="flex gap-3">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowNewPostForm(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      className="bg-neon-cyan hover:bg-neon-cyan/80"
                    >
                      <ArrowUpTrayIcon className="w-4 h-4 mr-2" />
                      Post Alert
                    </Button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}

          {/* Post Reporting Modal */}
          {reportingPost && (
            <PostReporting
              post={reportingPost}
              onClose={() => setReportingPost(null)}
              onSubmit={handleReport}
            />
          )}
        </AnimatePresence>
      </div>
    
  );
};

export default CommunitySection;
