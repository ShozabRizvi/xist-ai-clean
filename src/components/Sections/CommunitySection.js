import React, { useState, useEffect } from 'react';
import {
  UsersIcon, HeartIcon, ChatBubbleLeftIcon, ShareIcon, FlagIcon, 
  StarIcon, TrophyIcon, FireIcon, ArrowUpTrayIcon, EyeIcon,
  HandThumbUpIcon, HandThumbDownIcon, MagnifyingGlassIcon, 
  FunnelIcon, CheckBadgeIcon, PlusIcon, ExclamationTriangleIcon,BookmarkIcon, DocumentTextIcon, ShieldCheckIcon, AcademicCapIcon, // ADD THESE
  CurrencyDollarIcon, ChartBarIcon, ScaleIcon, XMarkIcon,
  UserGroupIcon, NoSymbolIcon, CheckCircleIcon, UserMinusIcon,
  MapPinIcon
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

  const [authorityReports, setAuthorityReports] = useState([
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
      specialties: ['Health Claims', 'Medical Research', 'Vaccine Information']
    }
  ]);

  
  const [posts, setPosts] = useState([
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
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Add visual feedback
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

// Authority Report Functions - ADD THESE
const createAuthorityReport = (reportData) => {
  const newReport = {
    id: `auth-${Date.now()}`,
    type: 'authority_alert',
    authority: `${authorityIdType.replace('_', ' ')} - ${authorityId}`,
    title: reportData.title,
    content: reportData.content,
    priority: reportData.priority,
    timestamp: new Date().toISOString(),
    verified: true,
    official: true,
    region: reportData.region || 'Global',
    threatLevel: reportData.threatLevel,
    affectedSectors: reportData.affectedSectors || []
  };

  setAuthorityReports(prev => [newReport, ...prev]);
  
  // Add to main posts feed with HIGHLIGHTED display
  const authorityPost = {
    id: `post-auth-${Date.now()}`,
    author: reportData.authority || 'Official Authority',
    authorId: 'authority-system',
    avatar: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=50&h=50&fit=crop&crop=face',
    content: `🚨 OFFICIAL AUTHORITY ALERT 🚨\n\n${reportData.title}\n\n${reportData.content}`,
    timestamp: new Date().toISOString(),
    likes: 0,
    dislikes: 0,
    comments: 0,
    shares: 0,
    views: 1,
    tags: ['authority-alert', 'official', reportData.priority.toLowerCase()],
    verified: true,
    official: true,
    authority: true,
    priority: reportData.priority,
    threatLevel: reportData.threatLevel,
    pinned: true,
    trending: true,
    liked: false,
    disliked: false,
    reputation: 'Official Authority'
  };

  setPosts(prev => [authorityPost, ...prev]);
};

const handleSubmitAuthorityReport = (e) => {
  e.preventDefault();
  const formData = new FormData(e.target);
  const reportData = {
    title: formData.get('title'),
    content: formData.get('content'),
    priority: formData.get('priority'),
    threatLevel: formData.get('threatLevel'),
    region: formData.get('region'),
    authority: `${authorityIdType.replace('_', ' ')} - ${authorityId}`
  };

  createAuthorityReport(reportData);
  setShowAuthorityReportForm(false);
  e.target.reset();
  
  console.log('Authority report published successfully');
};

  const getBadgeIcon = (user) => {
    if (user.expert) return <CheckBadgeIcon className="w-4 h-4 text-blue-500" />;
    if (user.verified) return <CheckBadgeIcon className="w-4 h-4 text-green-500" />;
    return null;
  };

  const formatTime = (timestamp) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffMs = now - time;
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffHours < 1) return 'Just now';
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return time.toLocaleDateString();
  };

  const tabs = [
    { id: 'feed', label: 'Community Feed', icon: UsersIcon },
    { id: 'leaderboard', label: 'Leaderboard', icon: TrophyIcon },
    { id: 'experts', label: 'Expert Network', icon: StarIcon },
    { id: 'reports', label: 'Threat Reports', icon: ExclamationTriangleIcon },
    { id: 'authority', label: 'Authority Panels', icon: CheckBadgeIcon }
  ];

  const filteredPosts = posts.filter(post => {
    if (selectedFilter === 'trending') return post.trending;
    if (selectedFilter === 'expert') return post.expert;
    if (selectedFilter === 'urgent') return post.tags.includes('urgent') || post.threatLevel === 'critical';
    return true;
  }).filter(post => 
    searchQuery === '' || 
    post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-2">
            <UsersIcon className="w-12 h-12 text-purple-600" />
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Community Hub</h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            Connect with security experts, share threat intelligence, and collaborate to make the internet safer for everyone
          </p>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2 md:gap-4 mb-8 overflow-hidden">
          {[
            { label: 'Total Members', value: communityStats.totalMembers.toLocaleString(), icon: UsersIcon, color: 'purple' },
            { label: 'Online Now', value: communityStats.onlineNow.toLocaleString(), icon: FireIcon, color: 'green' },
            { label: 'Posts Today', value: communityStats.postsToday, icon: ChatBubbleLeftIcon, color: 'blue' },
            { label: 'Experts Online', value: communityStats.expertsOnline, icon: StarIcon, color: 'yellow' },
            { label: 'Threats Stopped', value: communityStats.threatsReported.toLocaleString(), icon: ExclamationTriangleIcon, color: 'red' },
            { label: 'Accuracy Rate', value: `${communityStats.accuracyRate}%`, icon: CheckBadgeIcon, color: 'emerald' }
          ].map((stat, idx) => (
            <div key={idx} className="bg-white dark:bg-gray-800 rounded-lg p-2 md:p-4 shadow-lg border border-gray-200 dark:border-gray-700 min-w-0">

             <div className="flex items-center space-x-1 mb-1">
  <stat.icon className={`w-3 h-3 md:w-4 md:h-4 text-${stat.color}-600`} />
  <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide truncate">
    {stat.label}
  </span>
</div>
<div className={`text-sm md:text-lg font-bold text-${stat.color}-600 dark:text-${stat.color}-400 truncate`}>
  {stat.value}
</div>

            </div>
          ))}
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap items-center justify-between mb-6">
          <div className="flex space-x-2 mb-4 md:mb-0">
            {tabs.map(({ id, label, icon: IconComponent }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  activeTab === id
                    ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                <IconComponent className="w-4 h-4" />
                <span className="hidden sm:inline">{label}</span>
              </button>
            ))}
          </div>

          {activeTab === 'feed' && (
            <div className="flex items-center space-x-3">
              {/* Search */}
              <div className="relative">
                <MagnifyingGlassIcon className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search posts..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              {/* Filter */}
              <select
                value={selectedFilter}
                onChange={(e) => setSelectedFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="all">All Posts</option>
                <option value="trending">Trending</option>
                <option value="expert">Expert Posts</option>
                <option value="urgent">Urgent Alerts</option>
              </select>

              {/* New Post Button */}
              {user && (
                <button
                  onClick={() => setShowNewPostForm(true)}
                  className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg font-medium hover:from-purple-700 hover:to-indigo-700 transition-all shadow-lg"
                >
                  <PlusIcon className="w-4 h-4" />
                  <span>New Post</span>
                </button>
              )}
            </div>
          )}
        </div>

        {/* Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          
          {/* Main Content */}
          <div className="lg:col-span-3">
            
            {/* COMMUNITY FEED TAB */}
            {activeTab === 'feed' && (
              <div className="space-y-6">
                
                {/* New Post Form */}
                {showNewPostForm && user && (
                  <Card className="p-6">
                    <div className="flex items-center space-x-3 mb-4">
                      <img
                        src={user.photoURL || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=40&h=40&fit=crop&crop=face'}
                        alt={user.displayName}
                        className="w-10 h-10 rounded-full border-2 border-purple-300"
                      />
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white">
                          Share with the community
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Help others stay safe by sharing threat intelligence
                        </p>
                      </div>
                    </div>
                    
                    <form onSubmit={handleNewPost} className="space-y-4">
                      <textarea
                        value={newPost.content}
                        onChange={(e) => setNewPost(prev => ({ ...prev, content: e.target.value }))}
                        placeholder="Share a security tip, threat alert, or ask the community for help..."
                        className="w-full p-4 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                        rows={4}
                        required
                      />
                      
                      <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            {newPost.content.length}/1000
                          </span>
                        </div>
                        
                        <div className="flex space-x-2">
                          <button
                            type="button"
                            onClick={() => setShowNewPostForm(false)}
                            className="px-4 py-2 text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            className="px-6 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg font-medium hover:from-purple-700 hover:to-indigo-700 transition-all shadow-lg"
                          >
                            Share Post
                          </button>
                        </div>
                      </div>
                    </form>
                  </Card>
                )}

                {/* Posts Feed */}
                {filteredPosts.map((post) => (
                   <Card key={post.id} className={`p-6 hover:shadow-xl transition-all duration-200 post-card ${
    post.authority ? 'border-4 border-red-500 bg-red-50 dark:bg-red-900/20 shadow-2xl' : ''
  } ${
    post.official ? 'ring-4 ring-red-300 dark:ring-red-700' : ''
  }`}>
    
    {/* 🚨 AUTHORITY ALERT BANNER - SHOWS ONLY FOR AUTHORITY POSTS */}
    {post.authority && (
      <div className="mb-4 -mx-6 -mt-6 bg-gradient-to-r from-red-600 to-red-700 text-white p-4 rounded-t-xl">
        <div className="flex items-center space-x-2">
          <ExclamationTriangleIcon className="w-6 h-6 animate-pulse" />
          <span className="font-bold text-lg">OFFICIAL AUTHORITY ALERT</span>
          <span className={`px-3 py-1 rounded-full text-sm font-bold ${
            post.priority === 'CRITICAL' ? 'bg-red-800 text-white animate-pulse' :
            post.priority === 'HIGH' ? 'bg-orange-600 text-white' :
            'bg-yellow-500 text-black'
          }`}>
            {post.priority} PRIORITY
          </span>
        </div>
      </div>
    )}
    
    {/* POST HEADER WITH AUTHORITY HIGHLIGHTING */}
    <div className="flex items-start justify-between mb-4">
      <div className="flex items-center space-x-3">
        <div className="relative">
          {/* PROFILE PICTURE WITH AUTHORITY STYLING */}
          <img
            src={post.avatar}
            alt={post.author}
            className={`w-12 h-12 rounded-full border-2 ${
              post.authority ? 'border-red-500 ring-2 ring-red-300' : 'border-gray-200 dark:border-gray-700'
            }`}
          />
          
          {/* EXPERT BADGE (existing code) */}
          {post.expert && (
            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
              <StarIcon className="w-3 h-3 text-white" />
            </div>
          )}
          
          {/* 🚨 AUTHORITY BADGE - NEW */}
          {post.authority && (
            <div className="absolute -top-1 -left-1 w-6 h-6 bg-red-600 rounded-full flex items-center justify-center animate-pulse">
              <ExclamationTriangleIcon className="w-4 h-4 text-white" />
            </div>
          )}
        </div>
        
        <div className="flex-1">
          <div className="flex items-center space-x-2">
            {/* AUTHOR NAME WITH AUTHORITY COLORING */}
            <span className={`font-semibold ${
              post.authority ? 'text-red-800 dark:text-red-200' : 'text-gray-900 dark:text-white'
            }`}>
              {post.author}
            </span>
            
            {/* VERIFICATION BADGE */}
            {getBadgeIcon(post)}
            
            {/* REPUTATION BADGE WITH AUTHORITY STYLING */}
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
              post.authority ? 'bg-red-200 dark:bg-red-800 text-red-800 dark:text-red-200' :
              'bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200'
            }`}>
              {post.reputation}
            </span>
            
            {/* 🚨 OFFICIAL AUTHORITY BADGE - NEW */}
            {post.authority && (
              <span className="px-3 py-1 bg-red-600 text-white text-xs font-bold rounded-full animate-pulse">
                OFFICIAL AUTHORITY
              </span>
            )}
          </div>
          
          {/* POST METADATA WITH AUTHORITY INDICATORS */}
          <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
            <span>{formatTime(post.timestamp)}</span>
            {post.pinned && (
              <>
                <span>•</span>
                <TrophyIcon className="w-4 h-4 text-purple-600" />
                <span className="text-purple-600">Pinned</span>
              </>
            )}
            {post.trending && (
              <>
                <span>•</span>
                <FireIcon className="w-4 h-4 text-orange-600" />
                <span className="text-orange-600">Trending</span>
              </>
            )}
            {post.authority && (
              <>
                <span>•</span>
                <ShieldCheckIcon className="w-4 h-4 text-red-600" />
                <span className="text-red-600 font-bold">OFFICIAL ALERT</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* POST ACTIONS MENU */}
      <div className="flex items-center space-x-2">
        {/* THREAT LEVEL INDICATOR */}
        {(post.threatLevel === 'critical' || post.priority) && (
          <span className={`px-2 py-1 text-xs font-medium rounded-full flex items-center space-x-1 ${
            post.priority === 'CRITICAL' ? 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 animate-pulse' :
            post.priority === 'HIGH' ? 'bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200' :
            'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'
          }`}>
            <ExclamationTriangleIcon className="w-3 h-3" />
            <span>{post.priority || 'Critical'}</span>
          </span>
        )}
        
        {/* REPORT BUTTON (only for non-authority posts) */}
        {user && post.authorId !== user.uid && !post.authority && (
          <button
            onClick={() => setReportingPost(post)}
            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
            title="Report post"
          >
            <FlagIcon className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>

    {/* POST CONTENT WITH AUTHORITY STYLING */}
    <div className="mb-4">
      <p className={`leading-relaxed ${
        post.authority ? 'text-red-900 dark:text-red-100 font-medium text-lg' : 'text-gray-900 dark:text-white'
      }`}>
        {post.content}
      </p>
      
      {/* TAGS WITH AUTHORITY STYLING */}
      {post.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-3">
          {post.tags.map((tag, idx) => (
            <span
              key={idx}
              className={`px-3 py-1 text-sm rounded-full cursor-pointer transition-colors flex items-center space-x-1 ${
                post.authority ? 
                'bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 hover:bg-red-200 dark:hover:bg-red-800' :
                'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-purple-100 dark:hover:bg-purple-900'
              }`}
            >
              {post.authority && tag.includes('authority') && <ShieldCheckIcon className="w-3 h-3" />}
              {post.authority && tag.includes('critical') && <ExclamationTriangleIcon className="w-3 h-3" />}
              <span>#{tag}</span>
            </span>
          ))}
        </div>
      )}
    </div>

    {/* POST ACTIONS BAR - EXISTING CODE WITH AUTHORITY MODIFICATIONS */}
    <div className={`flex items-center justify-between border-t pt-4 ${
      post.authority ? 'border-red-200 dark:border-red-700' : 'border-gray-200 dark:border-gray-700'
    }`}>
      <div className="flex items-center space-x-6">
        
        {/* LIKE BUTTON */}
        <button
          onClick={() => handleLike(post.id)}
          className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all ${
            post.liked
              ? 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300'
              : 'text-gray-500 dark:text-gray-400 hover:bg-green-50 dark:hover:bg-green-900/20'
          }`}
        >
          <HandThumbUpIcon className="w-4 h-4" />
          <span className="text-sm font-medium">{post.likes}</span>
        </button>

        {/* DISLIKE BUTTON */}
        <button
          onClick={() => handleDislike(post.id)}
          className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all ${
            post.disliked
              ? 'bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300'
              : 'text-gray-500 dark:text-gray-400 hover:bg-red-50 dark:hover:bg-red-900/20'
          }`}
        >
          <HandThumbDownIcon className="w-4 h-4" />
          <span className="text-sm font-medium">{post.dislikes}</span>
        </button>

        {/* COMMENTS */}
        <div className="flex items-center space-x-2 text-gray-500 dark:text-gray-400">
          <ChatBubbleLeftIcon className="w-4 h-4" />
          <span className="text-sm">{post.comments}</span>
        </div>

        {/* SHARES */}
        <div className="flex items-center space-x-2 text-gray-500 dark:text-gray-400">
          <ShareIcon className="w-4 h-4" />
          <span className="text-sm">{post.shares}</span>
        </div>
      </div>

      {/* VIEWS */}
      <div className="flex items-center space-x-2 text-gray-400">
        <EyeIcon className="w-4 h-4" />
        <span className="text-sm">{post.views}</span>
      </div>
    </div>
  </Card>
                ))}
              </div>
            )}

            {/* LEADERBOARD TAB */}
            {activeTab === 'leaderboard' && (
              <Leaderboard user={user} />
            )}

            {/* EXPERTS TAB */}
            {activeTab === 'experts' && (
              <div className="space-y-6">
                <Card className="p-6">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                    Expert Network
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">
                    Connect with verified security professionals and misinformation experts
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {expertMembers.map((expert) => (
                      <div key={expert.id} className="p-4 border border-gray-200 dark:border-gray-700 rounded-xl hover:shadow-lg transition-all expert-card">
                        <div className="flex items-start space-x-3">
                          <div className="relative">
                            <img
                              src={expert.avatar}
                              alt={expert.name}
                              className="w-16 h-16 rounded-full border-2 border-blue-300"
                            />
                            {expert.online && (
                              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 border-2 border-white rounded-full"></div>
                            )}
                            <div className="absolute -top-1 -right-1 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                              <StarIcon className="w-4 h-4 text-white" />
                            </div>
                          </div>
                          
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                              <h3 className="font-bold text-gray-900 dark:text-white">{expert.name}</h3>
                              <CheckBadgeIcon className="w-5 h-5 text-blue-500" />
                            </div>
                            
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                              {expert.title}
                            </p>
                            
                            <div className="flex items-center space-x-4 text-xs text-gray-500 mb-3">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${
                                expert.level === 'Diamond' ? 'from-blue-400 to-blue-600 text-blue-900' :
                                expert.level === 'Gold' ? 'from-yellow-400 to-yellow-600 text-yellow-900' :
                                'from-gray-400 to-gray-600 text-gray-900'
                              }`}>
                                {expert.level}
                              </span>
                              <span>{expert.contributions} contributions</span>
                              <span className={expert.online ? 'text-green-600' : 'text-gray-400'}>
                                {expert.online ? 'Online' : 'Offline'}
                              </span>
                            </div>
                            
                            {/* Specialties */}
                            <div className="flex flex-wrap gap-1">
                              {expert.specialties.slice(0, 2).map((specialty, idx) => (
                                <span key={idx} className="px-2 py-1 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 text-xs rounded-full">
                                  {specialty}
                                </span>
                              ))}
                              {expert.specialties.length > 2 && (
                                <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs rounded-full">
                                  +{expert.specialties.length - 2}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            )}

            {/* REPORTS TAB */}
            {activeTab === 'reports' && (
              <Card className="p-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                  Daily Threat Reports
                </h2>
                <div className="space-y-4">
                  {[
                    { type: 'Phishing', count: 847, trend: '+23%', severity: 'high' },
                    { type: 'Investment Scams', count: 234, trend: '+67%', severity: 'critical' },
                    { type: 'Romance Scams', count: 156, trend: '-12%', severity: 'medium' },
                    { type: 'Tech Support Scams', count: 89, trend: '+5%', severity: 'medium' },
                    { type: 'Fake Products', count: 67, trend: '+45%', severity: 'low' }
                  ].map((report, idx) => (
                    <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white">{report.type}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {report.count} reports today • {report.trend} from yesterday
                        </p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        report.severity === 'critical' ? 'bg-red-100 text-red-800' :
                        report.severity === 'high' ? 'bg-orange-100 text-orange-800' :
                        report.severity === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {report.severity.toUpperCase()}
                      </span>
                    </div>
                  ))}
                </div>
              </Card>
            )}
            {/* AUTHORITY PANELS TAB */}
{activeTab === 'authority' && (
  <div className="space-y-6">
    
    {/* Authority Header */}
    <Card className="p-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
      <div className="flex items-center space-x-4">
        <CheckBadgeIcon className="w-12 h-12 text-blue-200" />
        <div>
          <h2 className="text-2xl font-bold mb-2">Authority Panels & Official Reports</h2>
          <p className="text-blue-100">
            Verified reports from government agencies, cybersecurity firms, and trusted authorities
          </p>
        </div>
      </div>
    </Card>

    {/* Authority Categories Dashboard */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {[
        { name: 'Government Alerts', count: 23, color: 'red', urgent: true, icon: ExclamationTriangleIcon },
        { name: 'Industry Reports', count: 67, color: 'blue', urgent: false, icon: DocumentTextIcon },
        { name: 'Security Bulletins', count: 45, color: 'yellow', urgent: true, icon: ShieldCheckIcon },
        { name: 'Research Papers', count: 89, color: 'green', urgent: false, icon: AcademicCapIcon }
      ].map((category, idx) => (
        <Card key={idx} className={`p-4 border-l-4 ${
          category.urgent ? 'border-red-500 bg-red-50 dark:bg-red-900/20' : 'border-gray-200 dark:border-gray-700'
        } hover:shadow-lg transition-all`}>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <category.icon className={`w-6 h-6 text-${category.color}-600`} />
              <h3 className={`font-bold text-sm ${category.urgent ? 'text-red-800 dark:text-red-200' : 'text-gray-900 dark:text-white'}`}>
                {category.name}
              </h3>
            </div>
            {category.urgent && (
              <span className="px-2 py-1 bg-red-500 text-white text-xs rounded-full animate-pulse">
                URGENT
              </span>
            )}
          </div>
          <div className={`text-xl font-bold ${category.urgent ? 'text-red-600' : `text-${category.color}-600`}`}>
            {category.count}
          </div>
        </Card>
      ))}
    </div>

    {/* Official Authority Reports */}
    <div className="space-y-4">
      {[
        {
          id: 'auth1',
          authority: 'FBI Cyber Division',
          title: 'CRITICAL: Multi-State Romance Scam Network Dismantled',
          description: 'Federal agents have arrested 15 individuals operating a sophisticated romance scam network that defrauded victims of over $50 million across 12 states. Operation involved international coordination with European law enforcement.',
          timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
          priority: 'CRITICAL',
          verified: true,
          category: 'Government',
          badge: ExclamationTriangleIcon,
          victims: '2,300+',
          losses: '$50M+',
          status: 'Active Investigation',
          region: 'United States'
        },
        {
          id: 'auth2',
          authority: 'CISA (Cybersecurity & Infrastructure Security Agency)',
          title: 'HIGH: New AI-Powered Phishing Toolkit Detected',
          description: 'CISA has identified a sophisticated phishing toolkit utilizing advanced AI to create convincing fake websites and emails targeting financial institutions and cryptocurrency exchanges.',
          timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
          priority: 'HIGH',
          verified: true,
          category: 'Government',
          badge: ShieldCheckIcon,
          victims: '1,200+',
          losses: '$15M+',
          status: 'Under Investigation',
          region: 'Global'
        },
        {
          id: 'auth3',
          authority: 'Microsoft Security Intelligence',
          title: 'MEDIUM: Q4 Threat Landscape Report Released',
          description: 'Microsoft releases comprehensive analysis of cybersecurity threats observed in Q4 2024, highlighting significant trends in business email compromise and supply chain attacks affecting enterprise customers.',
          timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
          priority: 'MEDIUM',
          verified: true,
          category: 'Industry',
          badge: DocumentTextIcon,
          victims: 'N/A',
          losses: 'N/A',
          status: 'Published Report',
          region: 'Global'
        },
        {
          id: 'auth4',
          authority: 'Federal Trade Commission (FTC)',
          title: 'HIGH: Cryptocurrency Investment Scam Warning',
          description: 'FTC issues urgent warning about fraudulent cryptocurrency investment platforms promising unrealistic returns. Over $100M lost by consumers in past 6 months through fake trading applications.',
          timestamp: new Date(Date.now() - 18 * 60 * 60 * 1000).toISOString(),
          priority: 'HIGH',
          verified: true,
          category: 'Government',
          badge: CurrencyDollarIcon,
          victims: '5,600+',
          losses: '$100M+',
          status: 'Consumer Alert Active',
          region: 'United States'
        },
        {
          id: 'auth5',
          authority: 'Symantec Threat Intelligence',
          title: 'LOW: Annual Cybercrime Trends Analysis',
          description: 'Symantec publishes detailed analysis of cybercrime trends for 2024, including significant rise in AI-generated content used in social engineering attacks and business email compromise.',
          timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
          priority: 'LOW',
          verified: true,
          category: 'Industry',
          badge: ChartBarIcon,
          victims: 'N/A',
          losses: 'N/A',
          status: 'Research Publication',
          region: 'Global'
        }
      ].map((report) => (
        <Card key={report.id} className={`p-6 border-l-4 ${
          report.priority === 'CRITICAL' ? 'border-red-500 bg-red-50 dark:bg-red-900/10' :
          report.priority === 'HIGH' ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/10' :
          report.priority === 'MEDIUM' ? 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/10' :
          'border-green-500 bg-green-50 dark:bg-green-900/10'
        } hover:shadow-xl transition-all duration-200`}>
          
          {/* Report Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center space-x-3">
              <report.badge className="w-8 h-8 text-blue-600" />
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1 flex-wrap">
                  <h3 className="font-bold text-gray-900 dark:text-white text-lg">
                    {report.authority}
                  </h3>
                  <CheckBadgeIcon className="w-6 h-6 text-blue-500" />
                  <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs font-medium rounded-full">
                    VERIFIED AUTHORITY
                  </span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400 flex-wrap">
                  <span>{formatTime(report.timestamp)}</span>
                  <span>•</span>
                  <span>{report.category}</span>
                  <span>•</span>
                  <span>{report.region}</span>
                  <span>•</span>
                  <span className={`font-bold ${
                    report.priority === 'CRITICAL' ? 'text-red-600' :
                    report.priority === 'HIGH' ? 'text-orange-600' :
                    report.priority === 'MEDIUM' ? 'text-yellow-600' :
                    'text-green-600'
                  }`}>
                    {report.priority} PRIORITY
                  </span>
                </div>
              </div>
            </div>
            
            {/* Priority Badge */}
            <div className={`px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap ${
              report.priority === 'CRITICAL' ? 'bg-red-500 text-white animate-pulse' :
              report.priority === 'HIGH' ? 'bg-orange-500 text-white' :
              report.priority === 'MEDIUM' ? 'bg-yellow-500 text-yellow-900' :
              'bg-green-500 text-white'
            }`}>
              {report.priority}
            </div>
          </div>
          
          {/* Report Content */}
          <div className="mb-6">
            <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-3 leading-tight">
              {report.title}
            </h4>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              {report.description}
            </p>
          </div>
          
          {/* Report Statistics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-700">
            <div className="text-center">
              <div className="font-bold text-lg text-gray-900 dark:text-white">{report.victims}</div>
              <div className="text-sm text-gray-500">Affected</div>
            </div>
            <div className="text-center">
              <div className="font-bold text-lg text-gray-900 dark:text-white">{report.losses}</div>
              <div className="text-sm text-gray-500">Financial Impact</div>
            </div>
            <div className="text-center">
              <div className="font-bold text-sm text-gray-900 dark:text-white text-center">{report.status}</div>
              <div className="text-sm text-gray-500">Current Status</div>
            </div>
            <div className="text-center">
              <div className="font-bold text-lg text-purple-600">{report.category}</div>
              <div className="text-sm text-gray-500">Source Type</div>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-3 flex-wrap">
              <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm">
                <DocumentTextIcon className="w-4 h-4" />
                <span>View Full Report</span>
              </button>
              <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm">
                <ShareIcon className="w-4 h-4" />
                <span>Share Alert</span>
              </button>
              <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm">
                <BookmarkIcon className="w-4 h-4" />
                <span>Save</span>
              </button>
            </div>
            
            {/* Credibility Score */}
            <div className="text-right">
              <div className="text-sm text-gray-500 dark:text-gray-400">Credibility</div>
              <div className="text-2xl font-bold text-green-600">98%</div>
            </div>
          </div>
        </Card>
      ))}
    </div>
    
    {/* Authority Access Panel */}
    {/* Authority Access Panel - FUNCTIONAL */}
<Card className="p-6 bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
  <div className="flex items-center justify-between flex-wrap">
    <div className="flex items-center space-x-4 mb-4 md:mb-0">
      <CheckBadgeIcon className="w-12 h-12 text-indigo-200" />
      <div>
        <h3 className="text-xl font-bold mb-2">Law Enforcement Access Portal</h3>
        <p className="text-indigo-100">
          Authorized personnel can access advanced threat intelligence and investigation tools
        </p>
      </div>
    </div>
    <button 
      onClick={() => setShowAuthorityPanel(true)}
      className="px-6 py-3 bg-white text-indigo-600 rounded-lg font-bold hover:bg-gray-100 transition-colors whitespace-nowrap"
    >
      🔐 Secure Access
    </button>
  </div>
</Card>

    
    {/* Subscribe to Authority Alerts */}
    <Card className="p-6 bg-gradient-to-r from-purple-600 to-pink-600 text-white">
      <div className="flex items-center justify-between flex-wrap">
        <div className="mb-4 md:mb-0">
          <h3 className="text-xl font-bold mb-2">Stay Updated with Authority Alerts</h3>
          <p className="text-purple-100">
            Get real-time notifications when new official reports and alerts are published
          </p>
        </div>
        <button className="px-6 py-3 bg-white text-purple-600 rounded-lg font-bold hover:bg-gray-100 transition-colors whitespace-nowrap">
          Subscribe to Alerts
        </button>
      </div>
    </Card>
  </div>
)}

          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-6 space-y-6">
              
              {/* User Profile Card */}
              {user && (
                <Card className="p-4">
                  <div className="text-center">
                    <img
                      src={user.photoURL || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=60&h=60&fit=crop&crop=face'}
                      alt={user.displayName}
                      className="w-16 h-16 rounded-full border-4 border-purple-300 mx-auto mb-3"
                    />
                    <h3 className="font-bold text-gray-900 dark:text-white">
                      {user.displayName || 'User'}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                      Community Member
                    </p>
                    
                    <div className="grid grid-cols-2 gap-4 text-center">
                      <div>
                        <div className="text-lg font-bold text-purple-600">{userStats?.level || 1}</div>
                        <div className="text-xs text-gray-500">Level</div>
                      </div>
                      <div>
                        <div className="text-lg font-bold text-purple-600">{userStats?.points || 0}</div>
                        <div className="text-xs text-gray-500">Points</div>
                      </div>
                    </div>
                  </div>
                </Card>
              )}

              {/* Quick Actions */}
              <Card className="p-4">
                <h3 className="font-bold text-gray-900 dark:text-white mb-4">Quick Actions</h3>
                <div className="space-y-2">
                  <button className="w-full text-left p-3 text-sm bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900/40 transition-colors">
                    🚨 Report Suspicious Content
                  </button>
                  <button className="w-full text-left p-3 text-sm bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors">
                    📚 Security Learning Hub
                  </button>
                  <button className="w-full text-left p-3 text-sm bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/40 transition-colors">
                    🛡️ Get Expert Help
                  </button>
                </div>
              </Card>

              {/* Trending Topics */}
              <Card className="p-4">
                <h3 className="font-bold text-gray-900 dark:text-white mb-4">🔥 Trending Now</h3>
                <div className="space-y-3">
                  {[
                    { tag: 'AI-PhishingScams', posts: 147 },
                    { tag: 'CryptoFraud', posts: 89 },
                    { tag: 'DeepfakeAlerts', posts: 67 },
                    { tag: 'SocialEngineering', posts: 45 },
                    { tag: 'InvestmentScams', posts: 34 }
                  ].map((topic, idx) => (
                    <div key={idx} className="flex items-center justify-between">
                      <span className="text-sm text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-200 cursor-pointer">
                        #{topic.tag}
                      </span>
                      <span className="text-xs text-gray-500">{topic.posts} posts</span>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
{/* Authority Panel Modal - FULL FEATURED */}
{/* Authority Panel Modal - INTEGRATED */}
{showAuthorityPanel && (
  <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
      
      {/* Modal Header */}
      <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-xl">
        <div className="flex items-center space-x-3">
          <ScaleIcon className="w-8 h-8 text-blue-200" />
          <div>
            <h2 className="text-2xl font-bold">Authority Access Portal</h2>
            <p className="text-blue-100">Secure access for verified law enforcement and agencies</p>
          </div>
        </div>
        <button
          onClick={() => setShowAuthorityPanel(false)}
          className="p-2 text-blue-200 hover:text-white hover:bg-blue-700/50 rounded-lg transition-colors"
        >
          <XMarkIcon className="w-6 h-6" />
        </button>
      </div>

      {/* Modal Content */}
      <div className="p-6 space-y-6">
        
        {!isAuthorityVerified ? (
          /* Authority Verification Form */
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-6">
              <ShieldCheckIcon className="w-12 h-12 mx-auto mb-4 text-yellow-600" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Authority Verification Required
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                This section is restricted to verified law enforcement agencies, cybersecurity organizations, and government authorities.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Authority Type
                </label>
                <select
                  value={authorityIdType}
                  onChange={(e) => setAuthorityIdType(e.target.value)}
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-3 text-base focus:ring-2 focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-700 dark:text-white"
                >
                  {authorityTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Authority ID / Badge Number / Organization Code
                </label>
                <input
                  type="text"
                  value={authorityId}
                  onChange={(e) => setAuthorityId(e.target.value)}
                  placeholder="Enter your official identification"
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-3 text-base focus:ring-2 focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-700 dark:text-white"
                />
              </div>

              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                <p className="text-sm text-blue-800 dark:text-blue-300">
                  <strong>Verification Process:</strong> Our team manually reviews all authority verification requests. 
                  Processing typically takes 24-48 hours. You will receive email confirmation once approved.
                </p>
              </div>

              <button
                onClick={handleVerifyAuthority}
                disabled={!authorityId.trim()}
                className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ShieldCheckIcon className="w-5 h-5" />
                <span>Submit Verification Request</span>
              </button>
            </div>
          </div>
        ) : (
          /* Verified Authority Dashboard */
          <div className="space-y-6">
            
            {/* Welcome Card */}
            <Card className="p-6 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20">
              <div className="flex items-center space-x-4">
                <CheckCircleIcon className="w-8 h-8 text-green-600" />
                <div>
                  <h3 className="text-lg font-semibold text-green-900 dark:text-green-200">
                    Welcome, verified {authorityIdType.replace('_', ' ')} representative
                  </h3>
                  <p className="text-green-700 dark:text-green-300 text-sm">
                    Authority ID: {authorityId} • Access Level: Tier 1 • Last Login: {new Date().toLocaleString()}
                  </p>
                </div>
              </div>
            </Card>
{/* Authority Report Creation Form - HEROICONS ONLY */}
<Card className="p-6 border-2 border-red-200 dark:border-red-800">
  <div className="flex items-center justify-between mb-4">
    <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
      <DocumentTextIcon className="w-5 h-5 mr-2 text-red-600" />
      Publish Official Authority Alert
    </h3>
    <button
      onClick={() => setShowAuthorityReportForm(!showAuthorityReportForm)}
      className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
    >
      {showAuthorityReportForm ? (
        <>
          <XMarkIcon className="w-4 h-4" />
          <span>Cancel</span>
        </>
      ) : (
        <>
          <PlusIcon className="w-4 h-4" />
          <span>Create Alert</span>
        </>
      )}
    </button>
  </div>

  {showAuthorityReportForm && (
    <form onSubmit={handleSubmitAuthorityReport} className="space-y-4 mt-6 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border-2 border-red-200 dark:border-red-800">
      
      {/* ALERT HEADER */}
      <div className="flex items-center space-x-2 p-3 bg-red-100 dark:bg-red-900/40 rounded-lg">
        <ExclamationTriangleIcon className="w-6 h-6 text-red-600 animate-pulse" />
        <span className="font-bold text-red-800 dark:text-red-200">Creating Official Authority Alert</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            <DocumentTextIcon className="w-4 h-4" />
            <span>Alert Title *</span>
          </label>
          <input
            name="title"
            type="text"
            required
            placeholder="URGENT: Brief description of threat"
            className="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-3 focus:ring-2 focus:ring-red-500 dark:bg-gray-700 dark:text-white"
          />
        </div>
        
        <div>
          <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            <ExclamationTriangleIcon className="w-4 h-4" />
            <span>Priority Level *</span>
          </label>
          <select
            name="priority"
            required
            className="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-3 focus:ring-2 focus:ring-red-500 dark:bg-gray-700 dark:text-white"
          >
            <option value="CRITICAL">🚨 CRITICAL - Immediate Action Required</option>
            <option value="HIGH">⚠️ HIGH - Urgent Attention Needed</option>
            <option value="MEDIUM">📊 MEDIUM - Important Notice</option>
            <option value="LOW">📋 LOW - General Information</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            <ShieldCheckIcon className="w-4 h-4" />
            <span>Threat Level</span>
          </label>
          <select
            name="threatLevel"
            className="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-3 focus:ring-2 focus:ring-red-500 dark:bg-gray-700 dark:text-white"
          >
            <option value="national_security">🏛️ National Security</option>
            <option value="financial_fraud">💰 Financial Fraud</option>
            <option value="cybersecurity">🔒 Cybersecurity Threat</option>
            <option value="public_safety">🚨 Public Safety</option>
            <option value="misinformation">📰 Misinformation Campaign</option>
          </select>
        </div>
        
        <div>
          <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            <MapPinIcon className="w-4 h-4" />
            <span>Region</span>
          </label>
          <input
            name="region"
            type="text"
            placeholder="e.g., United States, Global, California"
            className="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-3 focus:ring-2 focus:ring-red-500 dark:bg-gray-700 dark:text-white"
          />
        </div>
      </div>

      <div>
        <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          <ChatBubbleLeftIcon className="w-4 h-4" />
          <span>Alert Content *</span>
        </label>
        <textarea
          name="content"
          required
          rows="4"
          placeholder="Detailed description of the threat, including specific indicators, affected systems, and immediate actions required..."
          className="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-3 focus:ring-2 focus:ring-red-500 dark:bg-gray-700 dark:text-white"
        />
      </div>

      <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg flex items-start space-x-3">
        <ExclamationTriangleIcon className="w-5 h-5 text-yellow-600 mt-0.5" />
        <p className="text-sm text-yellow-800 dark:text-yellow-300">
          <strong>Warning:</strong> This alert will be immediately published to all community members with high priority highlighting. Only submit verified, official information.
        </p>
      </div>

      <button
        type="submit"
        className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors"
      >
        <DocumentTextIcon className="w-5 h-5" />
        <span>Publish Official Alert</span>
      </button>
    </form>
  )}
</Card>

            {/* Authority Tools */}
            <div className="grid gap-6 md:grid-cols-3">
              <Card className="p-6 text-center hover:shadow-lg transition-all duration-300 cursor-pointer">
                <ExclamationTriangleIcon className="w-12 h-12 mx-auto mb-4 text-red-600" />
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Emergency Response</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Access emergency threat response tools
                </p>
              </Card>

              <Card className="p-6 text-center hover:shadow-lg transition-all duration-300 cursor-pointer">
                <DocumentTextIcon className="w-12 h-12 mx-auto mb-4 text-blue-600" />
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Intelligence Feeds</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Advanced threat intelligence feeds
                </p>
              </Card>

              <Card className="p-6 text-center hover:shadow-lg transition-all duration-300 cursor-pointer">
                <UserGroupIcon className="w-12 h-12 mx-auto mb-4 text-purple-600" />
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Investigation Tools</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Specialized investigation and analysis tools
                </p>
              </Card>
            </div>

            {/* Pending Reports */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <DocumentTextIcon className="w-5 h-5 mr-2" />
                Pending Authority Reviews ({pendingAuthorityReports.length})
              </h3>
              
              <div className="space-y-4">
                {pendingAuthorityReports.map((report) => (
                  <div key={report.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getSeverityColor(report.severity)}`}>
                            {report.severity.toUpperCase()}
                          </span>
                          <span className="text-sm text-gray-500 capitalize">{report.type}</span>
                        </div>
                        <p className="text-gray-900 dark:text-white font-medium mb-1">{report.content}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Reported by: {report.reporter} • {report.timestamp.toLocaleString()}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2 ml-4">
                        <button
                          onClick={() => handleAuthorityReportAction(report.id, 'investigating')}
                          className="flex items-center space-x-1 px-3 py-1 border border-gray-300 text-gray-700 rounded hover:bg-gray-50 text-sm"
                        >
                          <EyeIcon className="w-3 h-3" />
                          <span>Review</span>
                        </button>
                        <button
                          onClick={() => handleAuthorityReportAction(report.id, 'approved')}
                          className="flex items-center space-x-1 px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 text-sm"
                        >
                          <CheckCircleIcon className="w-3 h-3" />
                          <span>Approve</span>
                        </button>
                        <button
                          onClick={() => handleAuthorityReportAction(report.id, 'rejected')}
                          className="flex items-center space-x-1 px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
                        >
                          <XMarkIcon className="w-3 h-3" />
                          <span>Reject</span>
                        </button>
                      </div>
                    </div>
                    
                    <div className="text-xs text-gray-500">
                      Status: <span className="capitalize font-medium">{report.status.replace('_', ' ')}</span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  </div>
)}






      {/* Report Modal */}
      {reportingPost && (
        <PostReporting
          post={reportingPost}
          user={user}
          onClose={() => setReportingPost(null)}
          onReport={handleReport}
        />
      )}
    </div>
  );
};

export default CommunitySection;
