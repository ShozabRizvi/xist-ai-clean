import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import {
  ShieldCheckIcon, ExclamationTriangleIcon, CheckCircleIcon, XCircleIcon,
  InformationCircleIcon, ChartBarIcon, DocumentTextIcon, GlobeAltIcon,
  ClockIcon, BoltIcon, MagnifyingGlassIcon, LinkIcon, SparklesIcon,
  MicrophoneIcon, DocumentArrowUpIcon, CameraIcon, Cog6ToothIcon,
  PhotoIcon, CloudArrowUpIcon, BeakerIcon, AcademicCapIcon, EyeIcon,
  CpuChipIcon, ArrowPathIcon, StarIcon, FireIcon, LightBulbIcon,
  WifiIcon, SignalIcon, DevicePhoneMobileIcon, ComputerDesktopIcon,
  ServerIcon, CircleStackIcon, LockClosedIcon, KeyIcon,
  ShieldExclamationIcon, ExclamationCircleIcon, DocumentDuplicateIcon,
  BookmarkIcon, HeartIcon, HandThumbUpIcon,
  ChatBubbleLeftRightIcon, UserGroupIcon, GiftIcon, TrophyIcon,
  RocketLaunchIcon, PuzzlePieceIcon, CommandLineIcon, MegaphoneIcon,
  SpeakerWaveIcon, VideoCameraIcon, PlayIcon, StopIcon, PauseIcon,
  ForwardIcon, BackwardIcon, SpeakerXMarkIcon, AdjustmentsHorizontalIcon,
  FunnelIcon, Bars3Icon, XMarkIcon, PlusIcon, MinusIcon, EllipsisHorizontalIcon,
  ChevronUpIcon, ChevronDownIcon, ChevronLeftIcon, ChevronRightIcon,
  MagnifyingGlassPlusIcon, MagnifyingGlassMinusIcon, CloudIcon,
  UserIcon, BellIcon, HomeIcon, NewspaperIcon,
  DocumentIcon, PhoneIcon, EnvelopeIcon, MapPinIcon, CalendarIcon,
  BuildingOfficeIcon, UserCircleIcon, Cog8ToothIcon, QuestionMarkCircleIcon,
  CheckBadgeIcon, ArrowTrendingUpIcon, ArrowTrendingDownIcon,
  FlagIcon, TagIcon, CubeIcon, ChartPieIcon, FingerPrintIcon,
  WindowIcon, CursorArrowRippleIcon, EllipsisVerticalIcon,
  Squares2X2Icon, ListBulletIcon, TableCellsIcon, ViewColumnsIcon,
  AdjustmentsVerticalIcon, FaceSmileIcon, FaceFrownIcon,
  HandRaisedIcon, ExclamationIcon, NoSymbolIcon, CheckIcon,
  PlayCircleIcon, PauseCircleIcon, StopCircleIcon,
  PhoneXMarkIcon, VideoCameraSlashIcon, FolderIcon,
  ArchiveBoxIcon, InboxIcon, PaperAirplaneIcon, PaperClipIcon,
  ScissorsIcon, ClipboardIcon, ClipboardDocumentIcon, PrinterIcon,
  IdentificationIcon, CreditCardIcon, BanknotesIcon,
  CurrencyDollarIcon, CalculatorIcon, ScaleIcon, ReceiptPercentIcon,
  ShoppingBagIcon, ShoppingCartIcon, BuildingStorefrontIcon,
  TruckIcon, MapIcon, CompassIcon, FlaskConicalIcon,
  CircuitBoardIcon, WrenchScrewdriverIcon, HammerIcon, WrenchIcon,
  CogIcon, TerminalIcon, CodeBracketIcon, CodeBracketSquareIcon,
  BugAntIcon, CloudArrowDownIcon, ArrowsRightLeftIcon, ArrowsUpDownIcon,
  ArrowUturnLeftIcon, ArrowUturnRightIcon, ArrowUturnUpIcon, ArrowUturnDownIcon,
  ChevronDoubleLeftIcon, ChevronDoubleRightIcon, ChevronDoubleUpIcon,
  ChevronDoubleDownIcon, HandThumbDownIcon, EyeSlashIcon, UsersIcon,
  BookOpenIcon, PencilIcon, PencilSquareIcon, TrashIcon, ArchiveBoxXMarkIcon,
  ShareIcon
} from '@heroicons/react/24/outline';

import {
  ShieldCheckIcon as ShieldCheckSolid,
  ExclamationTriangleIcon as ExclamationTriangleSolid,
  CheckCircleIcon as CheckCircleSolidIcon,
  XCircleIcon as XCircleSolid,
  StarIcon as StarSolid,
  HeartIcon as HeartSolid,
  FireIcon as FireSolid,
  BoltIcon as BoltSolid,
  SparklesIcon as SparklesSolid,
  LightBulbIcon as LightBulbSolid,
  LockClosedIcon as LockClosedSolid,
  ShieldExclamationIcon as ShieldExclamationSolid,
  CheckBadgeIcon as CheckBadgeSolid
} from '@heroicons/react/24/solid';
import { useAuth } from '../../hooks/useAuth';
import { supabase } from '../../supabase';
const GEMINI_API_KEY = process.env.REACT_APP_GEMINI_API_KEY;
const OPENROUTER_API_KEY = process.env.REACT_APP_OPENROUTER_API_KEY;
const DEEPSEEK_MODEL = process.env.REACT_APP_DEEPSEEK_MODEL;
const OPENROUTER_BASE_URL = process.env.REACT_APP_OPENROUTER_BASE_URL;

const ANALYSIS_MODES = {
  lightning: {
    id: 'lightning',
    label: 'Lightning Scan',
    icon: BoltIcon,
    iconSolid: BoltSolid,
    description: 'Ultra-fast threat detection (5-10 seconds)',
    color: 'from-yellow-400 to-orange-500',
    bgColor: 'bg-gradient-to-r from-yellow-50 to-orange-50',
    darkBgColor: 'dark:bg-gradient-to-r dark:from-yellow-900/20 dark:to-orange-900/20',
    borderColor: 'border-yellow-400',
    darkBorderColor: 'dark:border-yellow-600',
    textColor: 'text-yellow-600',
    darkTextColor: 'dark:text-yellow-400',
    estimatedTime: '5-10s',
    maxTokens: 800,
    temperature: 0.1
  },
  comprehensive: {
    id: 'comprehensive',
    label: 'Comprehensive Analysis',
    icon: ShieldCheckIcon,
    iconSolid: ShieldCheckSolid,
    description: 'Balanced detail with explanations (15-20 seconds)',
    color: 'from-blue-500 to-cyan-600',
    bgColor: 'bg-gradient-to-r from-blue-50 to-cyan-50',
    darkBgColor: 'dark:bg-gradient-to-r dark:from-blue-900/20 dark:to-cyan-900/20',
    borderColor: 'border-blue-400',
    darkBorderColor: 'dark:border-blue-600',
    textColor: 'text-blue-600',
    darkTextColor: 'dark:text-blue-400',
    estimatedTime: '15-20s',
    maxTokens: 2000,
    temperature: 0.3
  },
  forensic: {
    id: 'forensic',
    label: 'Forensic Investigation',
    icon: MagnifyingGlassIcon,
    description: 'Deep forensic analysis for high-stakes content (25-35 seconds)',
    color: 'from-amber-600 to-orange-600',
    bgColor: 'bg-gradient-to-r from-amber-50 to-orange-50',
    darkBgColor: 'dark:bg-gradient-to-r dark:from-amber-900/20 dark:to-orange-900/20',
    borderColor: 'border-amber-400',
    darkBorderColor: 'dark:border-amber-600',
    textColor: 'text-amber-600',
    darkTextColor: 'dark:text-amber-400',
    estimatedTime: '25-35s',
    maxTokens: 2500,
    temperature: 0.2
  },
  educational: {
    id: 'educational',
    label: 'Educational Focus',
    icon: AcademicCapIcon,
    description: 'Learning-oriented with prevention tips (20-25 seconds)',
    color: 'from-green-500 to-emerald-600',
    bgColor: 'bg-gradient-to-r from-green-50 to-emerald-50',
    darkBgColor: 'dark:bg-gradient-to-r dark:from-green-900/20 dark:to-emerald-900/20',
    borderColor: 'border-green-400',
    darkBorderColor: 'dark:border-green-600',
    textColor: 'text-green-600',
    darkTextColor: 'dark:text-green-400',
    estimatedTime: '20-25s',
    maxTokens: 2000,
    temperature: 0.35
  },
  expertdeepdive: {
    id: 'expertdeepive',
    label: 'Expert Deep Dive',
    icon: SparklesIcon,
    iconSolid: SparklesSolid,
    description: 'Technical deep-dive for professionals (30-40 seconds)',
    color: 'from-purple-600 to-pink-600',
    bgColor: 'bg-gradient-to-r from-purple-50 to-pink-50',
    darkBgColor: 'dark:bg-gradient-to-r dark:from-purple-900/20 dark:to-pink-900/20',
    borderColor: 'border-purple-400',
    darkBorderColor: 'dark:border-purple-600',
    textColor: 'text-purple-600',
    darkTextColor: 'dark:text-purple-400',
    estimatedTime: '30-40s',
    maxTokens: 3000,
    temperature: 0.4
  },
  realtime: {
    id: 'realtime',
    label: 'Real-time Monitoring',
    icon: ClockIcon,
    description: 'Continuous threat assessment (live)',
    color: 'from-red-600 to-rose-600',
    bgColor: 'bg-gradient-to-r from-red-50 to-rose-50',
    darkBgColor: 'dark:bg-gradient-to-r dark:from-red-900/20 dark:to-rose-900/20',
    borderColor: 'border-red-400',
    darkBorderColor: 'dark:border-red-600',
    textColor: 'text-red-600',
    darkTextColor: 'dark:text-red-400',
    estimatedTime: 'Live',
    maxTokens: 1800,
    temperature: 0.25
  }
};

const INPUT_METHODS = {
  text: {
    id: 'text',
    label: 'Text Input',
    icon: DocumentTextIcon,
    description: 'Type or paste text content',
    placeholder: 'Paste suspicious text, messages, or claims here for analysis...'
  },
  url: {
    id: 'url',
    label: 'URL Analysis',
    icon: LinkIcon,
    description: 'Analyze websites and links',
    placeholder: 'Enter URL to analyze (e.g., https://example.com)'
  },
  image: {
    id: 'image',
    label: 'Image Upload',
    icon: PhotoIcon,
    description: 'Upload images with text or suspicious content',
    placeholder: 'Upload JPG, PNG, or WebP'
  },
  video: {
    id: 'video',
    label: 'Video Upload',
    icon: VideoCameraIcon,
    description: 'Upload video for audio transcription & analysis',
    placeholder: 'Upload MP4, WebM, or MOV'
  },
  voice: {
    id: 'voice',
    label: 'Voice Input',
    icon: MicrophoneIcon,
    description: 'Speak your concern - AI will transcribe and analyze',
    placeholder: 'Click microphone to speak...'
  }
};

const VIDEO_ANALYSIS_SERVICE = {
  async extractAudioFromVideo(videoFile) {
    return new Promise((resolve, reject) => {
      try {
        const fileReader = new FileReader();
        fileReader.onload = (e) => {
          const arrayBuffer = e.target.result;
          const audioContext = new (window.AudioContext || window.webkitAudioContext)();
          
          audioContext.decodeAudioData(
            arrayBuffer,
            (audioBuffer) => {
              resolve({
                success: true,
                audioBuffer: audioBuffer,
                sampleRate: audioBuffer.sampleRate,
                duration: audioBuffer.duration,
                message: `Video audio extracted: ${audioBuffer.duration.toFixed(2)}s`
              });
            },
            (error) => {
              reject(new Error(`Audio decoding failed: ${error.message}`));
            }
          );
        };
        
        fileReader.onerror = () => {
          reject(new Error('Failed to read video file'));
        };
        
        fileReader.readAsArrayBuffer(videoFile);
      } catch (error) {
        reject(new Error(`Video extraction failed: ${error.message}`));
      }
    });
  },

  async transcribeAudio(audioBuffer) {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      return {
        success: false,
        error: 'Speech recognition not supported in this browser',
        fallback: 'Please provide audio transcription manually or paste text'
      };
    }

    return new Promise((resolve) => {
      try {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        const recognition = new SpeechRecognition();
        
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.language = 'en-US';
        
        let finalTranscript = '';
        
        recognition.onstart = () => {
          console.log('[VideoAnalysis] Audio transcription started...');
        };

        recognition.onresult = (event) => {
          for (let i = event.resultIndex; i < event.results.length; i++) {
            const transcript = event.results[i][0].transcript;
            
            if (event.results[i].isFinal) {
              finalTranscript += transcript + ' ';
            }
          }
        };

        recognition.onend = () => {
          console.log('[VideoAnalysis] Transcription complete');
          
          if (finalTranscript.trim()) {
            resolve({
              success: true,
              transcript: finalTranscript.trim(),
              wordCount: finalTranscript.trim().split(/\s+/).length,
              duration: audioBuffer.duration,
              message: `Transcribed ${finalTranscript.trim().split(/\s+/).length} words from video audio`
            });
          } else {
            resolve({
              success: false,
              error: 'No speech detected in video',
              fallback: 'Video appears to have no audio or inaudible content'
            });
          }
        };

        recognition.onerror = (event) => {
          resolve({
            success: false,
            error: `Transcription failed: ${event.error}`,
            fallback: 'Unable to transcribe video audio'
          });
        };

        recognition.start();
      } catch (error) {
        resolve({
          success: false,
          error: `Transcription error: ${error.message}`,
          fallback: 'Video transcription unavailable'
        });
      }
    });
  },

  async analyzeVideoMetadata(videoFile) {
    try {
      const video = document.createElement('video');
      
      return new Promise((resolve) => {
        video.onloadedmetadata = () => {
          const metadata = {
            duration: video.duration,
            width: video.videoWidth,
            height: video.videoHeight,
            fileSize: videoFile.size,
            fileType: videoFile.type,
            fileName: videoFile.name,
            lastModified: new Date(videoFile.lastModified).toISOString(),
            bitrate: (videoFile.size * 8) / video.duration / 1000000,
            aspectRatio: (video.videoWidth / video.videoHeight).toFixed(2),
            quality: this.assessVideoQuality(video.videoWidth, video.videoHeight)
          };
          
          resolve({
            success: true,
            metadata: metadata,
            message: `Video metadata extracted: ${Math.floor(video.duration)}s, ${video.videoWidth}x${video.videoHeight}`
          });
          
          video.src = '';
        };
        
        video.onerror = () => {
          resolve({
            success: false,
            error: 'Failed to load video metadata',
            fallback: {
              duration: 'Unknown',
              resolution: 'Unknown',
              fileSize: videoFile.size,
              fileName: videoFile.name
            }
          });
        };
        
        const blob = new Blob([videoFile], { type: videoFile.type });
        video.src = URL.createObjectURL(blob);
      });
    } catch (error) {
      return {
        success: false,
        error: `Video analysis failed: ${error.message}`,
        fallback: null
      };
    }
  },

  assessVideoQuality(width, height) {
    const resolution = width * height;
    if (resolution >= 3840 * 2160) return '4K Ultra HD';
    if (resolution >= 1920 * 1080) return '1080p Full HD';
    if (resolution >= 1280 * 720) return '720p HD';
    if (resolution >= 854 * 480) return '480p SD';
    return 'Low Resolution';
  },

  async processVideoForAnalysis(videoFile) {
    try {
      const audioResult = await this.extractAudioFromVideo(videoFile);
      
      if (!audioResult.success) {
        return {
          stage: 'audio_extraction_failed',
          error: audioResult.message,
          fallback: 'Please provide video description or transcript manually'
        };
      }

      const transcriptionResult = await this.transcribeAudio(audioResult.audioBuffer);
      
      if (!transcriptionResult.success) {
        return {
          stage: 'transcription_failed',
          error: transcriptionResult.error,
          fallback: transcriptionResult.fallback,
          audioData: audioResult
        };
      }

      const metadataResult = await this.analyzeVideoMetadata(videoFile);

      return {
        success: true,
        stage: 'complete',
        transcript: transcriptionResult.transcript,
        metadata: metadataResult.metadata,
        analysisInput: `Video Analysis Report:\n\nFile: ${videoFile.name}\nDuration: ${Math.floor(transcriptionResult.duration)}s\nResolution: ${metadataResult.metadata?.quality || 'Unknown'}\n\nTranscribed Content:\n${transcriptionResult.transcript}\n\nAnalyze the above video transcript for scams, misinformation, fraud, or suspicious claims.`,
        message: 'Video processing complete - ready for analysis'
      };
    } catch (error) {
      return {
        success: false,
        stage: 'processing_error',
        error: error.message,
        fallback: 'Video processing encountered an error'
      };
    }
  }
};

const API_SERVICE = {
  geminiApiKey: process.env.REACT_APP_GEMINI_API_KEY,
  geminiEndpoint: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro-latest:generateContent',

  buildAnalysisPrompt(content, analysisMode) {
    const mode = ANALYSIS_MODES[analysisMode];
    
    const prompts = {
      lightning: `You are XIST AI, an expert threat detection system. Analyze this content for immediate threats.

CONTENT: "${content}"

Respond in EXACTLY this JSON format, no additional text:
{
  "verdict": "true/false/partial/unverifiable",
  "threat_level": "CRITICAL/HIGH/MEDIUM/LOW/SAFE",
  "confidence": 85-98,
  "summary": "One sentence assessment",
  "details": "2-3 sentence explanation of threats found",
  "risks": ["risk1", "risk2", "risk3"],
  "recommendations": ["action1", "action2"],
  "sources": ["verification_method1", "verification_method2"]
}`,

      comprehensive: `You are XIST AI, a comprehensive threat analysis system. Perform balanced analysis.

CONTENT: "${content}"

Analyze for:
1. Scams & Financial Fraud
2. Health Misinformation
3. Political Disinformation
4. Technical Threats
5. Social Engineering

Respond in EXACTLY this JSON format, no additional text:
{
  "verdict": "true/false/partial/unverifiable",
  "threat_level": "CRITICAL/HIGH/MEDIUM/LOW/SAFE",
  "confidence": 85-98,
  "summary": "Key findings summary",
  "details": "Detailed threat analysis and reasoning",
  "threats_identified": ["threat1", "threat2"],
  "risks": ["specific_risk1", "specific_risk2"],
  "recommendations": ["protective_action1", "protective_action2"],
  "sources": ["source1", "source2"]
}`,

      forensic: `You are XIST AI Forensics. Provide investigation-grade analysis.

CONTENT: "${content}"

Perform forensic analysis including:
1. Evidence chain analysis
2. Pattern recognition
3. Attribution indicators
4. Legal implications

Respond in EXACTLY this JSON format, no additional text:
{
  "verdict": "true/false/partial/unverifiable",
  "threat_level": "CRITICAL/HIGH/MEDIUM/LOW/SAFE",
  "confidence": 90-98,
  "summary": "Executive summary of findings",
  "details": "Detailed forensic investigation results",
  "threat_classification": "primary_threat_type",
  "sophistication_level": "amateur/intermediate/professional",
  "evidence": ["evidence1", "evidence2", "evidence3"],
  "risks": ["forensic_risk1", "forensic_risk2"],
  "recommendations": ["forensic_action1", "forensic_action2"],
  "sources": ["source1", "source2"]
}`,

      educational: `You are XIST AI Educational. Teach users to recognize threats.

CONTENT: "${content}"

Provide educational analysis with learning outcomes:
1. How this type of threat works
2. Red flags to recognize
3. Psychology behind the threat
4. Prevention strategies

Respond in EXACTLY this JSON format, no additional text:
{
  "verdict": "true/false/partial/unverifiable",
  "threat_level": "CRITICAL/HIGH/MEDIUM/LOW/SAFE",
  "confidence": 85-95,
  "summary": "Educational summary",
  "details": "Detailed explanation suitable for learning",
  "threat_type": "scam/misinformation/fraud/social_engineering",
  "red_flags": ["flag1", "flag2", "flag3"],
  "how_it_works": "Explanation of threat mechanism",
  "risks": ["educational_risk1", "educational_risk2"],
  "prevention": ["prevention_tip1", "prevention_tip2"],
  "sources": ["source1", "source2"]
}`,

      expertdeepdive: `You are XIST AI Expert Analysis. Maximum technical depth.

CONTENT: "${content}"

Technical deep-dive analysis:
1. Technical indicators & signatures
2. Infrastructure analysis
3. Campaign correlation
4. Threat actor profiling

Respond in EXACTLY this JSON format, no additional text:
{
  "verdict": "true/false/partial/unverifiable",
  "threat_level": "CRITICAL/HIGH/MEDIUM/LOW/SAFE",
  "confidence": 92-98,
  "summary": "Technical analysis summary",
  "details": "Comprehensive technical investigation",
  "threat_actor_profile": "likely_attacker_profile",
  "iocs": ["indicator_of_compromise1", "indicator_of_compromise2"],
  "technical_analysis": "Deep technical breakdown",
  "risks": ["technical_risk1", "technical_risk2"],
  "recommendations": ["technical_mitigation1", "technical_mitigation2"],
  "sources": ["source1", "source2"]
}`,

      realtime: `You are XIST AI Real-time Monitor. Assess current threat status.

CONTENT: "${content}"

Real-time threat assessment:
1. Current risk level
2. Trend analysis
3. Alert generation
4. Response recommendations

Respond in EXACTLY this JSON format, no additional text:
{
  "verdict": "true/false/partial/unverifiable",
  "threat_level": "CRITICAL/HIGH/MEDIUM/LOW/SAFE",
  "confidence": 80-95,
  "summary": "Real-time status summary",
  "details": "Current threat assessment",
  "trend": "escalating/stable/decreasing",
  "spread_velocity": "slow/medium/fast",
  "current_risk": "immediate_threat/emerging_threat/monitored/safe",
  "risks": ["immediate_risk1", "immediate_risk2"],
  "immediate_actions": ["urgent_action1", "urgent_action2"],
  "sources": ["realtime_source1", "realtime_source2"]
}`
    };

    return prompts[analysisMode] || prompts.comprehensive;
  },

  async analyze(content, analysisMode) {
    try {
      if (!this.geminiApiKey) {
        throw new Error('Gemini API key not configured');
      }

      const prompt = this.buildAnalysisPrompt(content, analysisMode);
      const mode = ANALYSIS_MODES[analysisMode];

      const response = await fetch(`${this.geminiEndpoint}?key=${this.geminiApiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }],
          generationConfig: {
            temperature: mode.temperature,
            topP: 0.9,
            topK: 40,
            maxOutputTokens: mode.maxTokens
          }
        })
      });

      if (!response.ok) {
        throw new Error(`Gemini API error: ${response.status}`);
      }

      const data = await response.json();

      if (data.error) {
        throw new Error(`Gemini API error: ${data.error.code} - ${data.error.message}`);
      }

      if (!Array.isArray(data.candidates) || !data.candidates.length) {
        console.error('Gemini returned:', data);
        throw new Error('Gemini did not return a valid response. See console for full object.');
      }

      let responseText = "";
      const parts = data.candidates[0]?.content?.parts;
      if (Array.isArray(parts) && parts[0]?.text) {
        responseText = parts[0].text;
      } else if (data.candidates[0]?.content?.text) {
        responseText = data.candidates[0].content.text;
      } else {
        throw new Error('Gemini did not return valid text in candidates.');
      }
      
      try {
        const jsonMatch = responseText.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
          throw new Error('No JSON found in response');
        }
        
        const parsedResponse = JSON.parse(jsonMatch[0]);
        return {
          success: true,
          data: parsedResponse,
          model: 'gemini-pro-latest',
          responseTime: Date.now()
        };
      } catch (parseError) {
        throw new Error(`Response parsing failed: ${parseError.message}`);
      }
    } catch (error) {
      console.error('[API] Analysis failed:', error);
      throw error;
    }
  }
};

const COMMUNITY_SERVICE = {
  async createPost(analysisResult, userId, username, userVerified = false) {
    try {
      if (!analysisResult) {
        throw new Error('Analysis result required');
      }

      const threatLevel = analysisResult.data?.threat_level || 'medium';
      const postContent = `Analysis Result: ${analysisResult.data?.summary || 'Threat detected'}\n\nVerdict: ${analysisResult.data?.verdict || 'Unknown'}\nConfidence: ${analysisResult.data?.confidence || 0}%\n\n${analysisResult.data?.details || ''}`;

      const { data, error } = await supabase
        .from('community_posts')
        .insert([
          {
            content: postContent,
            user_id: userId,
            username: username,
            user_verified: userVerified,
            threat_level: threatLevel,
            likes: 0,
            reposts: 0,
            replies_count: 0,
            engagement_score: 0,
            created_at: new Date().toISOString()
          }
        ])
        .select();

      if (error) {
        throw new Error(`Supabase insert error: ${error.message}`);
      }

      return {
        success: true,
        postId: data[0].id,
        message: 'Post created successfully',
        data: data[0]
      };
    } catch (error) {
      console.error('[CommunityService] Post creation failed:', error);
      throw error;
    }
  }
};

export default function VerifySection() {
  const [selectedMode, setSelectedMode] = useState('comprehensive');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [inputMethod, setInputMethod] = useState('text');
  const [inputContent, setInputContent] = useState('');
  const [analysisResult, setAnalysisResult] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [jobs, setJobs] = useState([]);
  const [expandedJob, setExpandedJob] = useState(null);
  const [user, setUser] = useState(null);
  const [isVoiceInputActive, setIsVoiceInputActive] = useState(false);
  const [voiceTranscript, setVoiceTranscript] = useState('');
  const [currentlyPlayingTTS, setCurrentlyPlayingTTS] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [showCommunityShare, setShowCommunityShare] = useState(false);
  const [videoProcessing, setVideoProcessing] = useState(false);

  const fileInputRef = useRef(null);
  const videoInputRef = useRef(null);
  const textareaRef = useRef(null);
  const recognitionRef = useRef(null);
  const dropdownRef = useRef(null);

    const { user: authUser } = useAuth();


  useEffect(() => {
    console.log('[VerifySection] Auth user from context:', authUser?.id || authUser?.email || 'null');
    setUser(authUser);
  }, [authUser]);



      useEffect(() => {
  if (!user || !user.id) {
    setJobs([]);
    return;
  }
  const userId = user.id;
  const loadHistory = async () => {
    const { data, error } = await supabase
      .from("community_posts")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(100);
    if (data) setJobs(data);
    if (error) console.error("History load error:", error);
  };
  loadHistory();
}, [user]);






  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const announceMode = useCallback((modeName) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(`${modeName} selected`);
      utterance.rate = 1;
      utterance.pitch = 1;
      window.speechSynthesis.speak(utterance);
    }
  }, []);

  const handleModeSelect = useCallback((modeId) => {
    const mode = ANALYSIS_MODES[modeId];
    if (mode) {
      setSelectedMode(modeId);
      announceMode(mode.label);
      setIsDropdownOpen(false);
      toast.success(`${mode.label} selected`);
    }
  }, [announceMode]);

  const initVoiceRecognition = useCallback(() => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      toast.error('Speech recognition not supported');
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognitionRef.current = new SpeechRecognition();
    recognitionRef.current.continuous = false;
    recognitionRef.current.interimResults = false;
    recognitionRef.current.language = 'en-US';
    recognitionRef.current.maxAlternatives = 1;

    let finalTranscript = '';

    recognitionRef.current.onstart = () => {
      setIsVoiceInputActive(true);
      finalTranscript = '';
      toast.loading('Listening... Speak now');
    };

    recognitionRef.current.onresult = (event) => {
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        
        if (event.results[i].isFinal) {
          finalTranscript += transcript + ' ';
        }
      }
    };

    recognitionRef.current.onend = () => {
      setIsVoiceInputActive(false);
      
      if (finalTranscript.trim()) {
        setVoiceTranscript(finalTranscript.trim());
        setInputContent(prev => (prev ? prev + ' ' : '') + finalTranscript.trim());
        toast.success(`Captured: "${finalTranscript.trim()}"`);
      } else {
        toast.error('No speech detected');
      }
      
      toast.dismiss();
    };

    recognitionRef.current.onerror = (event) => {
      toast.error(`Voice error: ${event.error}`);
      setIsVoiceInputActive(false);
      console.error('[Voice] Error:', event.error);
    };

    recognitionRef.current.start();
  }, []);

  const stopVoiceRecognition = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsVoiceInputActive(false);
    }
  }, []);

  const playTextToSpeech = useCallback((text) => {
    if (!('speechSynthesis' in window)) {
      toast.error('Text-to-speech not supported');
      return;
    }

    if (currentlyPlayingTTS) {
      window.speechSynthesis.cancel();
      setCurrentlyPlayingTTS(null);
      return;
    }

    const cleanText = typeof text === 'string' ? text : JSON.stringify(text, null, 2);
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 1;
    utterance.pitch = 1;
    utterance.volume = 1;

    utterance.onstart = () => setCurrentlyPlayingTTS(true);
    utterance.onend = () => setCurrentlyPlayingTTS(null);
    utterance.onerror = () => {
      toast.error('TTS error');
      setCurrentlyPlayingTTS(null);
    };

    window.speechSynthesis.speak(utterance);
  }, [currentlyPlayingTTS]);

  const handleFileUpload = useCallback(async (e, type) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      if (type === 'image') {
        const reader = new FileReader();
        reader.onload = (event) => {
          setImagePreview(event.target?.result);
          setInputContent(`[Image: ${file.name}] Please describe what you see or paste any visible text for analysis.`);
          setUploadedFile(file);
        };
        reader.readAsDataURL(file);
        toast.success('Image loaded');
      } else if (type === 'video') {
        setVideoProcessing(true);
        toast.loading('Processing video...');

        const result = await VIDEO_ANALYSIS_SERVICE.processVideoForAnalysis(file);

        if (result.success) {
          setInputContent(result.analysisInput);
          setUploadedFile(file);
          toast.success('Video processed - transcription ready for analysis');
        } else {
          toast.error(result.fallback || 'Video processing failed');
          setInputContent(result.fallback || '');
        }
      }
    } catch (error) {
      toast.error('File processing failed: ' + error.message);
    } finally {
      setVideoProcessing(false);
    }
  }, []);

  const runAnalysis = useCallback(async () => {
  if (!inputContent.trim()) {
    toast.error('Please enter content to analyze');
    return;
  }

  setIsAnalyzing(true);
  const newJob = {
    id: Date.now().toString(),
    input: inputContent.substring(0, 200),
    inputMethod: inputMethod,
    analysisMode: selectedMode,
    status: 'pending',
    result: null,
    error: null,
    created_at: new Date().toISOString(),
    user_id: user?.id
  };

  setJobs(prev => [newJob, ...prev]);

  let apiResult = null;

  // 1. Try Gemini first
  try {
    const geminiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-pro:generateContent?key=${process.env.REACT_APP_GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{role: "user", parts: [{text: inputContent}]}],
        }),
      }
    );

    if (geminiRes.ok) {
      apiResult = await geminiRes.json();
    } else {
      const err = await geminiRes.json();
      if (!err?.error || (!err.error.message?.includes("quota") && err.error.code !== 429)) {
        throw new Error(err?.error?.message || "Unknown Gemini error.");
      }
    }
  } catch (err) {}

  // 2. Fallback to DeepSeek via OpenRouter if Gemini failed or is null
  if (!apiResult) {
    try {
      const dsRes = await fetch(`${process.env.REACT_APP_OPENROUTER_BASE_URL}/chat/completions`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.REACT_APP_OPENROUTER_API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: process.env.REACT_APP_DEEPSEEK_MODEL,
          messages: [{role: "user", content: inputContent}]
        })
      });
      if (!dsRes.ok) throw new Error("DeepSeek error: " + (await dsRes.text()));
      apiResult = await dsRes.json();
    } catch (finalErr) {
      const failedJob = {...newJob, status: "error", error: finalErr?.message || "Analysis failed"};
      setJobs(prev => prev.map(j => j.id === newJob.id ? failedJob : j));
      toast.error(finalErr?.message || "Analysis failed");
      setIsAnalyzing(false);
      return;
    }
  }

  // --- Save result and DB logic ---
  const updatedJob = {
    ...newJob,
    status: 'completed',
    result: apiResult.data || apiResult // keep like your original
  };
  setJobs(prev => prev.map(j => j.id === newJob.id ? updatedJob : j));
  setAnalysisResult(updatedJob);

  if (user && user.id) {
    try {
      const postContent = `[Analysis] ${newJob.input.substring(0, 100)}...
Mode: ${selectedMode}
Verdict: ${apiResult.data?.verdict}
Threat Level: ${apiResult.data?.threat_level}

Full Result:
${JSON.stringify(apiResult.data, null, 2)}`;

      const { error } = await supabase.from('community_posts').insert([{
        content: postContent,
        user_id: user.id, // fixed for your schema!
        username: user.email || user.user_metadata?.username || 'Anonymous',
        user_verified: user.user_metadata?.verified || false,
        threat_level: apiResult.data?.threat_level || 'low',
        created_at: new Date().toISOString()
      }]);
      if (window.updateHomeStats) window.updateHomeStats();
      if (error) {
        console.error('[runAnalysis] Database save error:', error);
        toast.error('Could not save to history: ' + error.message);
      }
    } catch (dbErr) {
      console.error('[runAnalysis] Database error:', dbErr);
    }
  } else {
    console.log('[runAnalysis] No user, not saving job');
  }

  const threatLevel = apiResult.data?.threat_level || 'medium';
  if (['CRITICAL', 'HIGH'].includes(threatLevel.toUpperCase())) {
    setShowCommunityShare(true);
  }

  toast.success('Analysis complete');
  setInputContent('');
  setIsAnalyzing(false);
}, [inputContent, inputMethod, selectedMode, user]);




    const shareToCommunity = useCallback(async () => {
    console.log('[shareToCommunity] Attempting share. User:', user?.id, 'Result:', analysisResult?.id);
    
    if (!user) {
      toast.error('Please log in first to share to community');
      console.error('[shareToCommunity] User not authenticated');
      return;
    }

    if (!analysisResult) {
      toast.error('No analysis result to share');
      return;
    }

    try {
      const username = user.user_metadata?.username || user.email || 'Anonymous';
      const isVerified = user.user_metadata?.verified || false;
      
      console.log('[shareToCommunity] Sharing as:', username, 'Verified:', isVerified);
      
      const result = await COMMUNITY_SERVICE.createPost(
        analysisResult,
        user.id,
        username,
        isVerified
      );

      if (result.success) {
        console.log('[shareToCommunity] Success! Post ID:', result.postId);
        toast.success('Posted to community successfully');
        setShowCommunityShare(false);
      } else {
        throw new Error('Post creation returned false');
      }
    } catch (error) {
      console.error('[shareToCommunity] Failed:', error);
      toast.error('Failed to share: ' + error.message);
    }
  }, [user, analysisResult]);


  const deleteJob = useCallback(async (jobId) => {
  setJobs(prev => prev.filter(j => j.id !== jobId));
  if (user) {
    const { error } = await supabase.from('community_posts').delete().eq('id', jobId);
    if (error) {
      console.error('[deleteJob] Error:', error);
      toast.error('Could not delete');
    } else {
      toast.success('Deleted');
    }
  }
}, [user]);


  const getThreatColor = (threatLevel) => {
    const level = threatLevel?.toUpperCase();
    if (level === 'CRITICAL') return 'text-red-700 bg-red-50 border-red-200 dark:text-red-400 dark:bg-red-900/20 dark:border-red-800';
    if (level === 'HIGH') return 'text-orange-700 bg-orange-50 border-orange-200 dark:text-orange-400 dark:bg-orange-900/20 dark:border-orange-800';
    if (level === 'MEDIUM') return 'text-yellow-700 bg-yellow-50 border-yellow-200 dark:text-yellow-400 dark:bg-yellow-900/20 dark:border-yellow-800';
    if (level === 'LOW') return 'text-blue-700 bg-blue-50 border-blue-200 dark:text-blue-400 dark:bg-blue-900/20 dark:border-blue-800';
    return 'text-green-700 bg-green-50 border-green-200 dark:text-green-400 dark:bg-green-900/20 dark:border-green-800';
  };

  const getThreatIcon = (threatLevel) => {
    const level = threatLevel?.toUpperCase();
    if (['CRITICAL', 'HIGH'].includes(level)) return ExclamationTriangleIcon;
    if (level === 'MEDIUM') return InformationCircleIcon;
    if (['LOW', 'SAFE'].includes(level)) return CheckCircleIcon;
    return QuestionMarkCircleIcon;
  };

  const selectedModeData = ANALYSIS_MODES[selectedMode];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 text-gray-900 dark:text-gray-100 transition-colors">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-7xl mx-auto px-4 py-8"
      >
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <h1 className="text-5xl font-black flex items-center gap-4 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600 bg-clip-text text-transparent">
            <ShieldCheckIcon className="w-12 h-12 text-cyan-500" />
            Xist AI Verify
          </h1>
          <p className="text-sm mt-2 text-gray-600 dark:text-gray-400">
            Advanced AI-powered threat detection and analysis
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1 space-y-6"
          >
            <motion.div
              ref={dropdownRef}
              className="rounded-xl p-6 backdrop-blur-sm bg-white/50 dark:bg-gray-800/50 border border-white dark:border-gray-700 hover:border-gray-200 dark:hover:border-gray-600 shadow-xl transition-all"
            >
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Cog6ToothIcon className="w-5 h-5" />
                Analysis Mode
              </h3>

              <motion.button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className={`w-full px-4 py-3 rounded-lg font-medium flex items-center justify-between transition-all border-2 ${
                  isDropdownOpen
                    ? `border-cyan-500 bg-cyan-50 dark:bg-cyan-900/30`
                    : `border-gray-300 dark:border-gray-600 bg-gray-100/50 dark:bg-gray-700/30 hover:bg-gray-100 dark:hover:bg-gray-600/40`
                }`}
                whileHover={{ scale: 1.02 }}
              >
                <div className="flex items-center gap-2">
                  {React.createElement(selectedModeData.icon, { className: 'w-5 h-5' })}
                  <span>{selectedModeData.label}</span>
                </div>
                <ChevronDownIcon className={`w-4 h-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
              </motion.button>

              <AnimatePresence>
                {isDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="mt-3 rounded-lg border bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 overflow-hidden"
                  >
                    {Object.entries(ANALYSIS_MODES).map(([key, mode]) => (
                      <motion.button
                        key={key}
                        onClick={() => handleModeSelect(key)}
                        className={`w-full px-4 py-3 text-left transition-all border-b dark:border-gray-700 last:border-b-0 flex items-center justify-between group ${
                          selectedMode === key
                            ? `${mode.bgColor} ${mode.darkBgColor}`
                            : 'hover:bg-gray-50 dark:hover:bg-gray-700/50'
                        }`}
                        whileHover={{ x: 4 }}
                      >
                        <div className="flex items-center gap-2">
                          {React.createElement(mode.icon, { className: 'w-4 h-4' })}
                          <div>
                            <p className="font-medium text-sm">{mode.label}</p>
                            <p className="text-xs text-gray-600 dark:text-gray-400">
                              {mode.estimatedTime}
                            </p>
                          </div>
                        </div>
                        {selectedMode === key && <CheckIcon className="w-4 h-4 text-green-500" />}
                      </motion.button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            <motion.div
              className="rounded-xl p-6 backdrop-blur-sm bg-white/50 dark:bg-gray-800/50 border border-white dark:border-gray-700 shadow-xl"
            >
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <DocumentTextIcon className="w-5 h-5" />
                Input Method
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {Object.entries(INPUT_METHODS).map(([key, method]) => (
                  <motion.button
                    key={key}
                    onClick={() => {
                      setInputMethod(key);
                      setInputContent('');
                      setImagePreview(null);
                      setVoiceTranscript('');
                    }}
                    className={`p-3 rounded-lg transition-all text-center font-medium text-sm ${
                      inputMethod === key
                        ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg'
                        : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300'
                    }`}
                    whileHover={{ scale: 1.05 }}
                  >
                    {React.createElement(method.icon, { className: 'w-5 h-5 mx-auto mb-1' })}
                    <p>{method.label}</p>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-2 space-y-6"
          >
            <motion.div
              className="rounded-xl p-6 backdrop-blur-sm bg-white/50 dark:bg-gray-800/50 border border-white dark:border-gray-700 shadow-xl"
            >
              <h3 className="text-lg font-semibold mb-4">{INPUT_METHODS[inputMethod].label}</h3>

              {(inputMethod === 'text' || inputMethod === 'url') && (
                <textarea
                  ref={textareaRef}
                  value={inputContent}
                  onChange={(e) => setInputContent(e.target.value)}
                  placeholder={INPUT_METHODS[inputMethod].placeholder}
                  className="w-full px-4 py-3 rounded-lg border outline-none resize-none transition-all bg-white dark:bg-gray-900/50 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-100 focus:border-cyan-500 dark:focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20"
                  rows={6}
                  maxLength={10000}
                />
              )}

              {inputMethod === 'image' && (
                <>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileUpload(e, 'image')}
                    className="hidden"
                  />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full p-8 border-2 border-dashed rounded-lg transition-all text-center border-cyan-400 dark:border-cyan-500/50 hover:border-cyan-500 dark:hover:border-cyan-500 hover:bg-cyan-50 dark:hover:bg-cyan-900/20"
                  >
                    <PhotoIcon className="w-10 h-10 mx-auto mb-2 text-cyan-500" />
                    <p className="font-medium">Click to upload image</p>
                  </button>
                  {imagePreview && (
                    <div className="mt-4 relative">
                      <img src={imagePreview} alt="Preview" className="w-full max-h-64 object-contain rounded-lg" />
                      <button
                        onClick={() => {
                          setImagePreview(null);
                          setUploadedFile(null);
                        }}
                        className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                      >
                        <XMarkIcon className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </>
              )}

              {inputMethod === 'video' && (
                <>
                  <input
                    ref={videoInputRef}
                    type="file"
                    accept="video/*"
                    onChange={(e) => handleFileUpload(e, 'video')}
                    className="hidden"
                    disabled={videoProcessing}
                  />
                  <button
                    onClick={() => videoInputRef.current?.click()}
                    disabled={videoProcessing}
                    className={`w-full p-8 border-2 border-dashed rounded-lg transition-all text-center ${
                      videoProcessing
                        ? 'opacity-50 cursor-not-allowed'
                        : 'border-cyan-400 dark:border-cyan-500/50 hover:border-cyan-500 dark:hover:border-cyan-500 hover:bg-cyan-50 dark:hover:bg-cyan-900/20'
                    }`}
                  >
                    <VideoCameraIcon className="w-10 h-10 mx-auto mb-2 text-cyan-500" />
                    <p className="font-medium">{videoProcessing ? 'Processing video...' : 'Click to upload video'}</p>
                  </button>
                </>
              )}

              {inputMethod === 'voice' && (
                <div className="text-center space-y-4">
                  <motion.button
                    onClick={isVoiceInputActive ? stopVoiceRecognition : initVoiceRecognition}
                    className={`p-6 rounded-full transition-all mx-auto block ${
                      isVoiceInputActive
                        ? 'bg-red-500 hover:bg-red-600 text-white animate-pulse'
                        : 'bg-blue-500 hover:bg-blue-600 text-white'
                    }`}
                    whileHover={{ scale: 1.05 }}
                  >
                    {isVoiceInputActive ? (
                      <StopIcon className="w-8 h-8" />
                    ) : (
                      <MicrophoneIcon className="w-8 h-8" />
                    )}
                  </motion.button>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{isVoiceInputActive ? 'Listening... Click to stop' : 'Click to start voice recognition'}</p>
                  
                  {voiceTranscript && (
                    <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                      <p className="text-sm font-medium text-green-900 dark:text-green-100 mb-2">Voice Transcript:</p>
                      <p className="text-sm text-green-800 dark:text-green-200">{voiceTranscript}</p>
                    </div>
                  )}
                </div>
              )}

              <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
                {inputContent.length} / 10000 characters
              </div>
            </motion.div>

            <motion.button
              onClick={runAnalysis}
              disabled={!inputContent.trim() || isAnalyzing || videoProcessing}
              className={`w-full py-4 px-6 rounded-xl font-bold text-white flex items-center justify-center gap-2 transition-all ${
                isAnalyzing || !inputContent.trim() || videoProcessing
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:shadow-xl hover:shadow-blue-500/50'
              }`}
              whileHover={!isAnalyzing && inputContent.trim() && !videoProcessing ? { scale: 1.05 } : {}}
              whileTap={!isAnalyzing && inputContent.trim() && !videoProcessing ? { scale: 0.95 } : {}}
            >
              {isAnalyzing ? (
                <>
                  <ArrowPathIcon className="w-5 h-5 animate-spin" />
                  Analyzing... {selectedModeData.estimatedTime}
                </>
              ) : (
                <>
                  <SparklesIcon className="w-5 h-5" />
                  Analyze with {selectedModeData.label}
                </>
              )}
            </motion.button>

            {analysisResult && analysisResult.status === 'completed' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-xl p-6 backdrop-blur-sm bg-white/50 dark:bg-gray-800/50 border border-white dark:border-gray-700 shadow-xl space-y-6"
              >
                <div className={`rounded-lg p-6 border-2 ${getThreatColor(analysisResult.result?.threat_level)}`}>
                  <div className="flex items-start gap-4">
                    {React.createElement(getThreatIcon(analysisResult.result?.threat_level), { className: 'w-8 h-8 flex-shrink-0 mt-1' })}
                    <div className="flex-1">
                      <h3 className="text-xl font-bold mb-2">
                        {analysisResult.result?.threat_level || 'Unknown'} - Threat Level
                      </h3>
                      <p className="text-sm font-semibold mb-2">Verdict: {analysisResult.result?.verdict || 'Unknown'}</p>
                      <p className="mb-3">{analysisResult.result?.summary}</p>
                      <p className="text-sm opacity-90">{analysisResult.result?.details}</p>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-lg text-center bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
                  <p className="text-sm font-semibold text-blue-700 dark:text-blue-300">Confidence Score</p>
                  <p className="text-3xl font-bold text-cyan-500">{analysisResult.result?.confidence}%</p>
                </div>

                {analysisResult.result?.risks && analysisResult.result.risks.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                      <ExclamationTriangleIcon className="w-5 h-5 text-orange-500" />
                      Identified Risks
                    </h4>
                    <ul className="space-y-2">
                      {analysisResult.result.risks.map((risk, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm">
                          <span className="text-orange-500 mt-1">•</span>
                          <span>{risk}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {analysisResult.result?.recommendations && analysisResult.result.recommendations.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                      <LightBulbIcon className="w-5 h-5 text-yellow-500" />
                      Recommendations
                    </h4>
                    <ul className="space-y-2">
                      {analysisResult.result.recommendations.map((rec, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm">
                          <CheckIcon className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                          <span>{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="flex gap-3">
                  <motion.button
                    onClick={() => playTextToSpeech(analysisResult.result?.details)}
                    className="flex-1 py-2 px-4 rounded-lg font-medium bg-purple-500 hover:bg-purple-600 text-white transition-all flex items-center justify-center gap-2"
                    whileHover={{ scale: 1.05 }}
                  >
                    <SpeakerWaveIcon className="w-4 h-4" />
                    Listen
                  </motion.button>
                  <motion.button
                    onClick={() => deleteJob(analysisResult.id)}
                    className="flex-1 py-2 px-4 rounded-lg font-medium bg-red-500 hover:bg-red-600 text-white transition-all flex items-center justify-center gap-2"
                    whileHover={{ scale: 1.05 }}
                  >
                    <TrashIcon className="w-4 h-4" />
                    Delete
                  </motion.button>
                </div>

                {showCommunityShare && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`rounded-lg p-4 border-2 ${
                      ['CRITICAL', 'HIGH'].includes(analysisResult.result?.threat_level?.toUpperCase())
                        ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
                        : 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800'
                    }`}
                  >
                    <p className="text-sm font-medium mb-3 text-gray-900 dark:text-gray-100">
                      {['CRITICAL', 'HIGH'].includes(analysisResult.result?.threat_level?.toUpperCase())
                        ? 'High-threat content detected - consider alerting the community'
                        : 'Share this finding with the community?'}
                    </p>
                    <motion.button
                      onClick={shareToCommunity}
                      className="w-full py-2 px-4 rounded-lg font-medium bg-gradient-to-r from-cyan-500 to-blue-600 text-white hover:shadow-lg transition-all flex items-center justify-center gap-2"
                      whileHover={{ scale: 1.02 }}
                    >
                      <ShareIcon className="w-4 h-4" />
                      Share to Community Thread
                    </motion.button>
                  </motion.div>
                )}
              </motion.div>
            )}

            {jobs.length > 0 && (

              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-xl p-6 backdrop-blur-sm bg-white/50 dark:bg-gray-800/50 border border-white dark:border-gray-700 shadow-xl"
              >
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <ChartBarIcon className="w-5 h-5" />
                  Analysis History ({jobs.length})
                </h3>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {jobs.map((job) => (
                    <motion.button
                      key={job.id}
                      onClick={() => setExpandedJob(job)}
                      className={`w-full p-3 rounded-lg text-left transition-all border ${
                        job.status === 'completed'
                          ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 hover:bg-green-100 dark:hover:bg-green-900/30'
                          : job.status === 'error'
                          ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 hover:bg-red-100 dark:hover:bg-red-900/30'
                          : 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800 hover:bg-yellow-100 dark:hover:bg-yellow-900/30'
                      }`}
                      whileHover={{ x: 4 }}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate text-sm">{job.input}</p>
                          <p className="text-xs text-gray-600 dark:text-gray-400">
                            {new Date(job.created_at).toLocaleString()}
                          </p>
                        </div>
                        {job.status === 'completed' ? (
                          <CheckCircleIcon className="w-4 h-4 text-green-500 flex-shrink-0" />
                        ) : job.status === 'error' ? (
                          <XCircleIcon className="w-4 h-4 text-red-500 flex-shrink-0" />
                        ) : (
                          <ArrowPathIcon className="w-4 h-4 animate-spin flex-shrink-0" />
                        )}
                      </div>
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}
            {jobs.length > 0 && (
  <motion.button
    onClick={async () => {
  if (!user || !user.id) return;
  await supabase.from('community_posts').delete().eq('user_id', user.id);
  setJobs([]);
  toast.success('History cleared');
}}

    className="w-full mt-3 py-2 px-4 rounded-lg font-medium bg-red-500 hover:bg-red-600 text-white transition-all flex items-center justify-center gap-2"
    whileHover={{ scale: 1.02 }}
  >
    <TrashIcon className="w-4 h-4" />
    Clear All History
  </motion.button>
)}

          </motion.div>
        </div>

        <AnimatePresence>
          {expandedJob && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto"
              onClick={() => setExpandedJob(null)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="w-full max-w-2xl rounded-xl p-6 my-20 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
              >
                <button onClick={() => setExpandedJob(null)} className="float-right">
                  <XMarkIcon className="w-6 h-6" />
                </button>
                <h2 className="text-2xl font-bold mb-4">{ANALYSIS_MODES[expandedJob.analysisMode]?.label}</h2>
                <div className="mb-4 p-4 rounded-lg bg-gray-50 dark:bg-gray-700/50">
                  <p className="text-sm font-semibold mb-2">ANALYSIS INPUT:</p>
                  <p>{expandedJob.input}</p>
                </div>
                {expandedJob.result && (
                  <div className="mb-4 p-4 rounded-lg bg-gray-50 dark:bg-gray-700/50 max-h-64 overflow-y-auto">
                    <p className="text-sm font-semibold mb-3">ANALYSIS RESULT:</p>
                    <div className="space-y-3 text-sm">
                      {Object.entries(expandedJob.result).map(([key, value]) => (
                        <div key={key}>
                          <p className="font-semibold text-cyan-500 capitalize">{key.replace(/_/g, ' ')}:</p>
                          <p className="text-sm mt-1">{typeof value === 'object' ? JSON.stringify(value, null, 2) : String(value)}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(JSON.stringify(expandedJob.result, null, 2));
                      toast.success('Copied');
                    }}
                    className="flex-1 py-2 px-4 rounded-lg bg-blue-500 hover:bg-blue-600 text-white font-medium transition-all"
                  >
                    Copy
                  </button>
                  <button
                    onClick={() => setExpandedJob(null)}
                    className="flex-1 py-2 px-4 rounded-lg bg-gray-500 hover:bg-gray-600 text-white font-medium transition-all"
                  >
                    Close
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}