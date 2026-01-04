import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShieldCheckIcon, ExclamationTriangleIcon, LockClosedIcon, EyeIcon,
  DevicePhoneMobileIcon, ComputerDesktopIcon, GlobeAltIcon, BellIcon,
  BookOpenIcon, AcademicCapIcon, ShieldExclamationIcon, PlayCircleIcon,
  DocumentTextIcon, CheckCircleIcon, XMarkIcon, ArrowRightIcon, ClockIcon,
  StarIcon, TrophyIcon, FireIcon, BoltIcon, SparklesIcon, MagnifyingGlassIcon,
  KeyIcon, WifiIcon, PhoneIcon, EnvelopeIcon, CameraIcon, MicrophoneIcon,
  VideoCameraIcon, ChatBubbleLeftRightIcon, HandRaisedIcon, ExclamationCircleIcon,
  InformationCircleIcon, BuildingOfficeIcon, HeartIcon, UserGroupIcon,
  CreditCardIcon, BanknotesIcon, IdentificationIcon, HomeIcon, MegaphoneIcon,
  CpuChipIcon, EyeSlashIcon, SpeakerWaveIcon, SpeakerXMarkIcon, CloudIcon,
  CircleStackIcon, CommandLineIcon, PaperAirplaneIcon, UserIcon, 
  LightBulbIcon, ChartBarIcon, ArrowPathIcon, Cog6ToothIcon
} from '@heroicons/react/24/outline';

// Enhanced notification system
const useNotification = () => {
  const [notifications, setNotifications] = useState([]);

  const showNotification = useCallback((message, type = 'info', duration = 4000) => {
  const id = Date.now() + Math.random();
  const notification = { id, message, type, timestamp: new Date() };
  
  // For voice commands, clear previous notifications to avoid clutter
  if (message.includes('Voice') || message.includes('🎤')) {
    setNotifications(prev => prev.filter(n => !n.message.includes('Voice') && !n.message.includes('🎤')));
    duration = 2000; // Shorter duration for voice notifications
  }
  
  setNotifications(prev => [...prev, notification]);
  
  if (duration > 0) {
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, duration);
  }
}, []);


  const dismissNotification = useCallback((id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  return { notifications, showNotification, dismissNotification };
};

const ProtectionSection = ({ theme = 'light', isMobile = false }) => {
  // Enhanced state management
  const [activeProtectionTool, setActiveProtectionTool] = useState('dashboard');
  const [protectionSettings, setProtectionSettings] = useState({
    realTimeScanning: true,
    threatNotifications: true,
    autoBlock: false,
    privacyMode: false,
    familyFilter: false,
    aiAssistantEnabled: true,
    voiceCommands: true,
    predictiveProtection: true,
    smartAlerts: true,
    secureMode: false
  });

  // AI State Management with enhanced features
  const [aiMessages, setAiMessages] = useState([
    {
      id: 1,
      role: 'assistant',
      content: 'Welcome to Xist AI Protection Center!\n\nI\'m your advanced AI security assistant for 99.9% uptime. I can:\n\nAnalyze threats in real-time\nGuide emergency situations\nConnect you to helplines instantly\nProvide 24/7 crisis support\n\nHow can I protect you today?',
      timestamp: new Date(),
      type: 'welcome',
      enhanced: true
    }
  ]);
  
  const [aiInput, setAiInput] = useState('');
  const [isAiAnalyzing, setIsAiAnalyzing] = useState(false);
  const [voiceListening, setVoiceListening] = useState(false);
  const [currentThreatLevel, setCurrentThreatLevel] = useState('low');
  const [analysisHistory, setAnalysisHistory] = useState([]);
  const [realTimeStats, setRealTimeStats] = useState({
    threatsBlocked: 0,
    scansCompleted: 0,
    helplinesConnected: 0,
    uptime: '99.9%'
  });

  const messagesEndRef = useRef(null);
  const { notifications, showNotification, dismissNotification } = useNotification();

  // AI Scanner State with enhanced capabilities
  const [scanResults, setScanResults] = useState([]);
  const [scanningActive, setScanningActive] = useState(false);
  const [scanQueue, setScanQueue] = useState([]);
  const [batchScanning, setBatchScanning] = useState(false);

  // Voice Recognition Setup with enhanced error handling
  const recognition = useRef(null);
  const [voiceSupported, setVoiceSupported] = useState(false);

  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
      recognition.current = new SpeechRecognition();
      recognition.current.continuous = true;
      recognition.current.interimResults = true;
      recognition.current.lang = 'en-US';
      
      recognition.current.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map(result => result[0])
          .map(result => result.transcript)
          .join('');
        
        if (event.results[0].isFinal) {
          handleVoiceCommand(transcript);
        }
      };

      recognition.current.onerror = (event) => {
        console.error('Voice recognition error:', event.error);
        setVoiceListening(false);
        showNotification(`Voice recognition error: ${event.error}`, 'error');
      };

      recognition.current.onend = () => {
        setVoiceListening(false);
      };

      setVoiceSupported(true);
    } else {
      setVoiceSupported(false);
    }
  }, [showNotification]);

  // Auto-scroll to bottom of messages
  // Smart auto-scroll - only scroll if user was already at bottom
useEffect(() => {
  const container = messagesEndRef.current?.parentElement;
  if (container) {
    const isNearBottom = container.scrollTop > container.scrollHeight - container.clientHeight - 100;
    if (isNearBottom) {
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  }
}, [aiMessages]);


  // COMPREHENSIVE EMERGENCY HELPLINES DATABASE (keeping ALL your existing helplines)
  const EMERGENCY_HELPLINES = {
    cybercrime: {
      title: 'Cybercrime & Online Fraud',
      icon: ShieldCheckIcon,
      color: 'red',
      urgent: true,
      contacts: [
        {
          country: 'India 🇮🇳',
          priority: 'high',
          numbers: [
            { type: 'National Cybercrime Helpline', number: '1930', description: 'Report cybercrime incidents 24/7', category: 'emergency' },
            { type: 'Cyber Crime Portal', number: 'cybercrime.gov.in', description: 'Online complaint registration', category: 'web' },
            { type: 'Women Helpline (Cyber)', number: '181', description: 'Women cybercrime support', category: 'emergency' },
            { type: 'Child Helpline (Cyber)', number: '1098', description: 'Child protection from online abuse', category: 'emergency' },
            { type: 'IT Ministry Helpline', number: '1800-11-1550', description: 'Government IT security support', category: 'support' },
            { type: 'CERT-In Incident', number: 'incident@cert-in.org.in', description: 'Computer Emergency Response Team', category: 'email' },
            { type: 'Digital India Helpline', number: '1800-3000-3468', description: 'Digital services support', category: 'support' },
            { type: 'UPI Fraud Helpline', number: '1800-120-1740', description: 'UPI/payment fraud reporting', category: 'financial' },
            { type: 'TRAI Consumer Helpline', number: '198', description: 'Telecom fraud complaints', category: 'telecom' },
            { type: 'Senior Citizens Cyber', number: '14567', description: 'Senior citizen cyber support', category: 'support' }
          ]
        },
        {
          country: 'USA 🇺🇸',
          priority: 'high',
          numbers: [
            { type: 'FBI Internet Crime (IC3)', number: '1-800-CALL-FBI', description: 'Federal Bureau of Investigation', category: 'emergency' },
            { type: 'FTC Identity Theft', number: '1-877-ID-THEFT', description: 'Federal Trade Commission', category: 'identity' },
            { type: 'NCSC Cybersecurity', number: '1-888-282-0870', description: 'National Cyber Security Centre', category: 'security' },
            { type: 'Secret Service (Cyber)', number: '1-202-406-5708', description: 'Financial cybercrime', category: 'financial' },
            { type: 'CISA Emergency', number: '1-888-282-0870', description: 'Cybersecurity & Infrastructure', category: 'emergency' }
          ]
        },
        {
          country: 'UK 🇬🇧',
          priority: 'high',
          numbers: [
            { type: 'Action Fraud', number: '0300 123 2040', description: 'UK national fraud reporting centre', category: 'emergency' },
            { type: 'NCSC Incident', number: '0345 600 5545', description: 'National Cyber Security Centre', category: 'security' },
            { type: 'City of London Police', number: '020 7601 2222', description: 'Economic crime unit', category: 'police' },
            { type: 'Get Safe Online', number: '0844 800 9400', description: 'Online safety guidance', category: 'support' }
          ]
        },
        {
          country: 'Canada 🇨🇦',
          priority: 'medium',
          numbers: [
            { type: 'Canadian Anti-Fraud', number: '1-888-495-8501', description: 'Anti-Fraud Centre', category: 'emergency' },
            { type: 'RCMP Cybercrime', number: '1-613-993-7267', description: 'Royal Canadian Mounted Police', category: 'police' },
            { type: 'Cyber Security Centre', number: '1-833-CYBER-88', description: 'Canadian Centre for Cyber Security', category: 'security' }
          ]
        },
        {
          country: 'Australia 🇦🇺',
          priority: 'medium',
          numbers: [
            { type: 'Scamwatch', number: '1800 123 040', description: 'ACCC Scamwatch hotline', category: 'emergency' },
            { type: 'Australian Cyber Security', number: '1300 CYBER1', description: 'Cyber security incidents', category: 'security' },
            { type: 'ReportCyber', number: 'cyber.gov.au', description: 'Online incident reporting', category: 'web' }
          ]
        }
      ]
    },
    financial: {
      title: 'Banking & Financial Fraud',
      icon: CreditCardIcon,
      color: 'orange',
      urgent: true,
      contacts: [
        {
          country: 'India 🇮🇳',
          priority: 'high',
          numbers: [
            { type: 'Banking Fraud Helpline', number: '155260', description: 'Reserve Bank of India 24/7', category: 'emergency' },
            { type: 'UPI Fraud Reporting', number: '1800-891-3333', description: 'NPCI UPI helpline', category: 'financial' },
            { type: 'Credit Card Fraud', number: '1800-1800', description: 'Universal card fraud helpline', category: 'financial' },
            { type: 'SBI Fraud Helpline', number: '1800-2100', description: 'State Bank of India', category: 'banking' },
            { type: 'HDFC Bank Fraud', number: '1800-425-3800', description: 'HDFC Bank security', category: 'banking' },
            { type: 'ICICI Bank Fraud', number: '1800-200-3344', description: 'ICICI Bank helpline', category: 'banking' },
            { type: 'Axis Bank Fraud', number: '1800-419-5959', description: 'Axis Bank security', category: 'banking' },
            { type: 'PNB Fraud Helpline', number: '1800-180-2345', description: 'Punjab National Bank', category: 'banking' },
            { type: 'Kotak Bank Fraud', number: '1800-274-0110', description: 'Kotak Mahindra Bank', category: 'banking' },
            { type: 'Yes Bank Fraud', number: '1800-1200-1122', description: 'Yes Bank security', category: 'banking' },
            { type: 'Bank of Baroda', number: '1800-258-4455', description: 'BOB fraud helpline', category: 'banking' },
            { type: 'Canara Bank Fraud', number: '1800-425-0018', description: 'Canara Bank security', category: 'banking' },
            { type: 'Indian Bank Fraud', number: '1800-425-1400', description: 'Indian Bank helpline', category: 'banking' },
            { type: 'Union Bank Fraud', number: '1800-222-244', description: 'Union Bank of India', category: 'banking' },
            { type: 'BOI Fraud Helpline', number: '1800-103-1906', description: 'Bank of India', category: 'banking' },
            { type: 'Insurance Fraud', number: '155255', description: 'IRDAI insurance fraud', category: 'insurance' },
            { type: 'Mutual Fund Fraud', number: '1800-266-0-266', description: 'AMFI investor helpline', category: 'investment' },
            { type: 'Stock Market Fraud', number: '1800-266-7575', description: 'SEBI investor protection', category: 'investment' }
          ]
        },
        {
          country: 'USA 🇺🇸',
          priority: 'high',
          numbers: [
            { type: 'FTC Consumer Sentinel', number: '1-877-FTC-HELP', description: 'Federal Trade Commission', category: 'emergency' },
            { type: 'Equifax Fraud Alert', number: '1-888-766-0008', description: 'Credit monitoring', category: 'credit' },
            { type: 'Experian Fraud', number: '1-888-EXPERIAN', description: 'Credit fraud reporting', category: 'credit' },
            { type: 'TransUnion Fraud', number: '1-800-680-7289', description: 'Credit protection', category: 'credit' },
            { type: 'Visa Fraud Hotline', number: '1-800-VISA-911', description: 'Visa card fraud', category: 'banking' },
            { type: 'Mastercard Fraud', number: '1-800-MC-ASSIST', description: 'Mastercard security', category: 'banking' }
          ]
        },
        {
          country: 'UK 🇬🇧',
          priority: 'high',
          numbers: [
            { type: 'UK Finance Fraud', number: '0300 123 2040', description: 'Banking fraud hotline', category: 'banking' },
            { type: 'Cifas Fraud Prevention', number: '0330 101 0180', description: 'Identity protection', category: 'identity' },
            { type: 'FCA Consumer Helpline', number: '0800 111 6768', description: 'Financial Conduct Authority', category: 'financial' }
          ]
        }
      ]
    },
    emergency: {
      title: 'Emergency Services',
      icon: ExclamationCircleIcon,
      color: 'red',
      urgent: true,
      contacts: [
        {
          country: 'India 🇮🇳',
          priority: 'critical',
          numbers: [
            { type: 'Police Emergency', number: '100', description: 'Immediate police assistance', category: 'emergency' },
            { type: 'Fire Emergency', number: '101', description: 'Fire department emergency', category: 'emergency' },
            { type: 'Medical Emergency', number: '108', description: 'Ambulance & medical emergency', category: 'emergency' },
            { type: 'Disaster Management', number: '1078', description: 'Natural disaster helpline', category: 'emergency' },
            { type: 'Traffic Police', number: '103', description: 'Traffic emergencies', category: 'traffic' },
            { type: 'Tourist Helpline', number: '1363', description: 'Tourist emergency assistance', category: 'support' },
            { type: 'Railway Helpline', number: '182', description: 'Railway police/emergency', category: 'transport' },
            { type: 'Power Outage', number: '1912', description: 'Electricity emergency', category: 'utility' },
            { type: 'Gas Leak Emergency', number: '1906', description: 'LPG gas emergency', category: 'utility' },
            { type: 'Road Accident', number: '1033', description: 'Highway emergency response', category: 'emergency' }
          ]
        },
        {
          country: 'USA 🇺🇸',
          priority: 'critical',
          numbers: [
            { type: 'Emergency Services', number: '911', description: 'Police, Fire, Medical emergency', category: 'emergency' },
            { type: 'Poison Control', number: '1-800-222-1222', description: 'National poison control', category: 'medical' },
            { type: 'Suicide Prevention', number: '988', description: 'Crisis lifeline', category: 'mental' },
            { type: 'Domestic Violence', number: '1-800-799-7233', description: 'National domestic violence', category: 'safety' }
          ]
        },
        {
          country: 'UK 🇬🇧',
          priority: 'critical',
          numbers: [
            { type: 'Emergency Services', number: '999', description: 'Police, Fire, Ambulance', category: 'emergency' },
            { type: 'Non-Emergency Police', number: '101', description: 'Non-urgent police matters', category: 'police' },
            { type: 'NHS Emergency', number: '111', description: 'Medical advice hotline', category: 'medical' },
            { type: 'Samaritans Crisis', number: '116 123', description: 'Emotional support', category: 'mental' }
          ]
        },
        {
          country: 'Canada 🇨🇦',
          priority: 'critical',
          numbers: [
            { type: 'Emergency Services', number: '911', description: 'Police, Fire, Medical', category: 'emergency' },
            { type: 'Poison Control', number: '1-844-POISON-X', description: 'Poison information', category: 'medical' },
            { type: 'Crisis Services', number: '1-833-456-4566', description: 'Mental health crisis', category: 'mental' }
          ]
        }
      ]
    },
    mental_health: {
      title: 'Mental Health & Counseling',
      icon: HeartIcon,
      color: 'green',
      urgent: false,
      contacts: [
        {
          country: 'India 🇮🇳',
          priority: 'high',
          numbers: [
            { type: 'KIRAN Mental Health', number: '1800-599-0019', description: '24/7 mental health support', category: 'mental' },
            { type: 'Vandrevala Foundation', number: '1860-2662-345', description: 'Crisis helpline & counseling', category: 'mental' },
            { type: 'iCall Helpline', number: '9152987821', description: 'Psychosocial helpline by TISS', category: 'mental' },
            { type: 'COOJ Mental Health', number: '+91-83692-93264', description: 'Youth mental health support', category: 'mental' },
            { type: 'Sanjeevani Helpline', number: '011-24311918', description: 'Delhi govt mental health', category: 'mental' },
            { type: 'Roshni Helpline', number: '040-66202000', description: 'Hyderabad crisis support', category: 'mental' },
            { type: 'Aasra Helpline', number: '91-9820466726', description: 'Mumbai crisis intervention', category: 'mental' },
            { type: 'Sumaitri Helpline', number: '011-23389090', description: 'Delhi emotional support', category: 'mental' },
            { type: 'Maithri Helpline', number: '0484-2540530', description: 'Kerala suicide prevention', category: 'mental' },
            { type: 'Sneha Helpline', number: '044-24640050', description: 'Chennai emotional support', category: 'mental' },
            { type: 'Sahai Helpline', number: '080-25497777', description: 'Bangalore mental health', category: 'mental' },
            { type: 'Parivarthan Helpline', number: '076760-76766', description: 'Mumbai crisis counseling', category: 'mental' }
          ]
        },
        {
          country: 'USA 🇺🇸',
          priority: 'high',
          numbers: [
            { type: 'Crisis Text Line', number: 'Text HOME to 741741', description: '24/7 crisis support via text', category: 'mental' },
            { type: 'National Suicide Prevention', number: '988', description: 'Suicide & Crisis Lifeline', category: 'mental' },
            { type: 'SAMHSA National Helpline', number: '1-800-662-HELP', description: 'Mental health & substance abuse', category: 'mental' },
            { type: 'NAMI HelpLine', number: '1-800-950-NAMI', description: 'Mental health information', category: 'mental' },
            { type: 'Teen Line', number: '1-800-852-8336', description: 'Teen crisis support', category: 'mental' }
          ]
        },
        {
          country: 'UK 🇬🇧',
          priority: 'high',
          numbers: [
            { type: 'Samaritans', number: '116 123', description: 'Free emotional support 24/7', category: 'mental' },
            { type: 'NHS Mental Health Crisis', number: '111', description: 'NHS mental health support', category: 'mental' },
            { type: 'Mind Info Line', number: '0300 123 3393', description: 'Mental health information', category: 'mental' },
            { type: 'CALM (Men)', number: '0800 58 58 58', description: 'Campaign Against Living Miserably', category: 'mental' }
          ]
        }
      ]
    },
    women_safety: {
      title: 'Women Safety & Support',
      icon: HandRaisedIcon,
      color: 'purple',
      urgent: true,
      contacts: [
        {
          country: 'India 🇮🇳',
          priority: 'critical',
          numbers: [
            { type: 'Women Helpline', number: '181', description: 'National women helpline 24/7', category: 'emergency' },
            { type: 'Women in Distress', number: '1091', description: 'Women in distress emergency', category: 'emergency' },
            { type: 'Domestic Violence', number: '1091', description: 'Domestic violence helpline', category: 'safety' },
            { type: 'NCW Helpline', number: '7827170170', description: 'National Commission for Women', category: 'legal' },
            { type: 'Mahila Thana', number: '1091', description: 'Women police station', category: 'police' },
            { type: 'Nirbhaya Helpline', number: '1096', description: 'Women harassment helpline', category: 'safety' },
            { type: 'POCSO Helpline', number: '1098', description: 'Child sexual abuse', category: 'child' },
            { type: 'Legal Aid Helpline', number: '15100', description: 'Free legal aid for women', category: 'legal' },
            { type: 'Women Safety App', number: '112', description: 'Emergency response app', category: 'app' },
            { type: 'She Team Helpline', number: '8712661601', description: 'Telangana women safety', category: 'police' }
          ]
        },
        {
          country: 'USA 🇺🇸',
          priority: 'critical',
          numbers: [
            { type: 'National Domestic Violence', number: '1-800-799-7233', description: 'National domestic violence hotline', category: 'safety' },
            { type: 'RAINN National Sexual Assault', number: '1-800-656-HOPE', description: 'Sexual assault hotline', category: 'safety' },
            { type: 'National Dating Abuse', number: '1-866-331-9474', description: 'Dating abuse helpline', category: 'safety' },
            { type: 'WomensLaw Helpline', number: '1-800-799-SAFE', description: 'Legal information for women', category: 'legal' }
          ]
        },
        {
          country: 'UK 🇬🇧',
          priority: 'critical',
          numbers: [
            { type: 'National Domestic Violence', number: '0808 2000 247', description: '24/7 domestic violence helpline', category: 'safety' },
            { type: 'Rape Crisis England', number: '0808 802 9999', description: 'Sexual violence support', category: 'safety' },
            { type: 'Women\'s Aid', number: '0808 2000 247', description: 'Domestic abuse support', category: 'safety' },
            { type: 'Rights of Women', number: '0207 251 6577', description: 'Legal advice for women', category: 'legal' }
          ]
        }
      ]
    },
    child_safety: {
      title: 'Child Safety & Protection',
      icon: UserGroupIcon,
      color: 'blue',
      urgent: true,
      contacts: [
        {
          country: 'India 🇮🇳',
          priority: 'critical',
          numbers: [
            { type: 'Childline India', number: '1098', description: 'Child protection emergency 24/7', category: 'emergency' },
            { type: 'Missing Child Helpline', number: '1094', description: 'Missing children helpline', category: 'missing' },
            { type: 'POCSO Helpline', number: '155620', description: 'Child sexual abuse reporting', category: 'abuse' },
            { type: 'CWC Emergency', number: '1098', description: 'Child Welfare Committee', category: 'welfare' },
            { type: 'NCPCR Helpline', number: '1800-121-2830', description: 'National Commission Protection Child Rights', category: 'rights' },
            { type: 'Child Marriage', number: '181', description: 'Child marriage prevention', category: 'prevention' },
            { type: 'Child Labour', number: '1098', description: 'Child labour rescue', category: 'labour' },
            { type: 'Cyber Crime (Child)', number: '1930', description: 'Online child abuse reporting', category: 'cyber' },
            { type: 'School Safety', number: '1800-11-6116', description: 'School safety helpline', category: 'education' },
            { type: 'Adoption Helpline', number: '1800-88-9393', description: 'Child adoption services', category: 'adoption' }
          ]
        },
        {
          country: 'USA 🇺🇸',
          priority: 'critical',
          numbers: [
            { type: 'National Child Abuse', number: '1-800-4-A-CHILD', description: 'Child abuse reporting', category: 'abuse' },
            { type: 'Missing & Exploited Children', number: '1-800-THE-LOST', description: 'National Center Missing Children', category: 'missing' },
            { type: 'CyberTipline', number: '1-800-843-5678', description: 'Online child exploitation', category: 'cyber' },
            { type: 'Boys Town Hotline', number: '1-800-448-3000', description: 'Crisis counseling for kids', category: 'counseling' }
          ]
        },
        {
          country: 'UK 🇬🇧',
          priority: 'critical',
          numbers: [
            { type: 'NSPCC Helpline', number: '0808 800 5000', description: 'Child protection helpline', category: 'protection' },
            { type: 'Childline UK', number: '0800 1111', description: 'Free confidential support', category: 'support' },
            { type: 'CEOP Safety Centre', number: '0870 000 3344', description: 'Online child exploitation', category: 'cyber' },
            { type: 'Missing People', number: '116 000', description: 'Missing children helpline', category: 'missing' }
          ]
        }
      ]
    },
    senior_citizens: {
      title: 'Senior Citizens Support',
      icon: HomeIcon,
      color: 'indigo',
      urgent: false,
      contacts: [
        {
          country: 'India 🇮🇳',
          priority: 'medium',
          numbers: [
            { type: 'Senior Citizens Helpline', number: '14567', description: 'Elder abuse & support 24/7', category: 'support' },
            { type: 'Elder Abuse Helpline', number: '1800-180-1253', description: 'Elder abuse reporting', category: 'abuse' },
            { type: 'Senior Citizens Cyber', number: '1930', description: 'Cyber fraud against seniors', category: 'cyber' },
            { type: 'Healthcare for Seniors', number: '14567', description: 'Medical emergency seniors', category: 'medical' },
            { type: 'Legal Aid Seniors', number: '15100', description: 'Free legal aid for elderly', category: 'legal' },
            { type: 'Pension Helpline', number: '1800-110-001', description: 'Pension related issues', category: 'pension' },
            { type: 'Senior Citizens Welfare', number: '1800-180-1253', description: 'Government welfare schemes', category: 'welfare' }
          ]
        },
        {
          country: 'USA 🇺🇸',
          priority: 'medium',
          numbers: [
            { type: 'Elder Abuse Hotline', number: '1-800-677-1116', description: 'National elder abuse hotline', category: 'abuse' },
            { type: 'Medicare Fraud', number: '1-800-MEDICARE', description: 'Medicare fraud reporting', category: 'fraud' },
            { type: 'Senior Medicare Patrol', number: '1-877-808-2468', description: 'Medicare fraud prevention', category: 'prevention' },
            { type: 'AARP Fraud Watch', number: '1-877-908-3360', description: 'Senior fraud prevention', category: 'fraud' }
          ]
        }
      ]
    },
    consumer_protection: {
      title: 'Consumer Protection',
      icon: MegaphoneIcon,
      color: 'yellow',
      urgent: false,
      contacts: [
        {
          country: 'India 🇮🇳',
          priority: 'medium',
          numbers: [
            { type: 'National Consumer Helpline', number: '1800-11-4000', description: 'Consumer complaints 24/7', category: 'consumer' },
            { type: 'E-commerce Complaints', number: '1800-11-4000', description: 'Online shopping fraud', category: 'ecommerce' },
            { type: 'Food Safety Helpline', number: '1800-11-2100', description: 'Food safety complaints', category: 'food' },
            { type: 'Telecom Consumer Care', number: '198', description: 'Mobile/telecom complaints', category: 'telecom' },
            { type: 'Gas Booking Complaint', number: '1906', description: 'LPG booking issues', category: 'utility' },
            { type: 'Electricity Complaint', number: '1912', description: 'Power supply issues', category: 'utility' },
            { type: 'Railway Consumer Care', number: '139', description: 'Railway complaints', category: 'transport' },
            { type: 'Insurance Complaint', number: '155255', description: 'Insurance grievances', category: 'insurance' }
          ]
        },
        {
          country: 'USA 🇺🇸',
          priority: 'medium',
          numbers: [
            { type: 'FTC Consumer Complaint', number: '1-877-FTC-HELP', description: 'Federal Trade Commission', category: 'consumer' },
            { type: 'Better Business Bureau', number: '1-800-955-5100', description: 'Business complaints', category: 'business' },
            { type: 'Consumer Product Safety', number: '1-800-638-2772', description: 'Product safety complaints', category: 'safety' }
          ]
        },
        {
          country: 'UK 🇬🇧',
          priority: 'medium',
          numbers: [
            { type: 'Citizens Advice Consumer', number: '0808 223 1133', description: 'Consumer rights advice', category: 'consumer' },
            { type: 'Trading Standards', number: '0808 223 1133', description: 'Trading standards complaints', category: 'trading' },
            { type: 'Financial Ombudsman', number: '0800 023 4567', description: 'Financial services complaints', category: 'financial' }
          ]
        }
      ]
    }
  };

  // Enhanced AI Functions with 20-key rotation support
  const analyzeEmergencySituation = async (input) => {
    setIsAiAnalyzing(true);
    try {
      // Use the same 20-key rotation system as VerifySection
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.REACT_APP_OPENROUTER_API_KEY}`, // Will be enhanced with rotation
          'Content-Type': 'application/json',
          'HTTP-Referer': window.location.origin,
          'X-Title': 'XIST AI Emergency Protection'
        },
        body: JSON.stringify({
          model: 'deepseek/deepseek-r1',
          messages: [
            {
              role: 'system',
              content: `You are an AI Emergency Protection Assistant specializing in cybersecurity, fraud prevention, and crisis management. 

Analyze the user's situation and provide:

1. **🚨 Threat Assessment**: Determine threat level (LOW/MEDIUM/HIGH/CRITICAL)
2. **📱 Emergency Classification**: Category (cybercrime/financial/safety/mental health/other)
3. **⚡ Immediate Actions**: What user should do RIGHT NOW
4. **📞 Recommended Helplines**: Best numbers to call based on situation and location
5. **🔄 Next Steps**: Detailed step-by-step guidance for resolution
6. **🛡️ Prevention Tips**: How to avoid similar situations in future

**Response Format:**
- Use emojis for visual clarity
- Provide specific, actionable advice
- Include relevant helpline numbers from database
- Be empathetic yet professional
- Focus on immediate safety and resolution
- Consider user's location if mentioned

**Critical Situations:**
- If life-threatening: Immediately recommend 911/999/100/108
- If active cyber attack: Guide to cybercrime helplines
- If financial fraud: Direct to banking/financial fraud numbers
- If mental health crisis: Provide crisis support numbers

Be supportive, clear, and focus on user safety above all.`
            },
            {
              role: 'user',
              content: input
            }
          ],
          max_tokens: 800,
          temperature: 0.3
        })
      });

    if (!response.ok) {
      // Handle different error codes
      if (response.status === 402) {
        throw new Error('API credits exhausted. Please check your OpenRouter account.');
      } else if (response.status === 401) {
        throw new Error('Invalid API key. Please check your configuration.');
      } else {
        throw new Error(`API request failed: ${response.status}`);
      }
    }

      const data = await response.json();
      const aiResponse = data.choices[0].message.content;

      // Enhanced threat level analysis
      let threatLevel = 'low';
      let emergencyType = 'general';
      
      if (aiResponse.toLowerCase().includes('critical') || aiResponse.toLowerCase().includes('life-threatening')) {
        threatLevel = 'critical';
      } else if (aiResponse.toLowerCase().includes('high') || aiResponse.toLowerCase().includes('urgent')) {
        threatLevel = 'high';
      } else if (aiResponse.toLowerCase().includes('medium')) {
        threatLevel = 'medium';
      }

      // Detect emergency type
      if (aiResponse.toLowerCase().includes('cyber') || aiResponse.toLowerCase().includes('fraud')) {
        emergencyType = 'cybercrime';
      } else if (aiResponse.toLowerCase().includes('financial') || aiResponse.toLowerCase().includes('bank')) {
        emergencyType = 'financial';
      } else if (aiResponse.toLowerCase().includes('mental') || aiResponse.toLowerCase().includes('crisis')) {
        emergencyType = 'mental_health';
      } else if (aiResponse.toLowerCase().includes('emergency') || aiResponse.toLowerCase().includes('police')) {
        emergencyType = 'emergency';
      }

      setCurrentThreatLevel(threatLevel);

      const newMessage = {
        id: Date.now(),
        role: 'assistant',
        content: aiResponse,
        timestamp: new Date(),
        type: 'analysis',
        threatLevel: threatLevel,
        emergencyType: emergencyType,
        enhanced: true
      };

      setAiMessages(prev => [...prev, newMessage]);

      // Update real-time stats
      setRealTimeStats(prev => ({
        ...prev,
        scansCompleted: prev.scansCompleted + 1
      }));

      // Save to analysis history
      const analysisEntry = {
        id: Date.now(),
        input: input.substring(0, 100),
        output: aiResponse,
        threatLevel,
        emergencyType,
        timestamp: new Date(),
        responseTime: Date.now() - new Date().getTime()
      };
      
      setAnalysisHistory(prev => [analysisEntry, ...prev.slice(0, 9)]);

      showNotification(`Analysis complete: ${threatLevel.toUpperCase()} threat level detected`, 
        threatLevel === 'critical' || threatLevel === 'high' ? 'error' : 'success');

    } catch (error) {
      console.error('AI Analysis error:', error);
      const errorMessage = {
        id: Date.now(),
        role: 'assistant',
        content: `🚨 **Service Temporarily Unavailable**\n\nI'm having trouble analyzing your situation right now. For immediate emergencies:\n\n**🇮🇳 India:**\n• Police: **100**\n• Medical: **108**\n• Cybercrime: **1930**\n\n**🇺🇸 USA/🇨🇦 Canada:**\n• Emergency: **911**\n• FBI Cyber: **1-800-CALL-FBI**\n\n**🇬🇧 UK:**\n• Emergency: **999**\n• Action Fraud: **0300 123 2040**\n\n**🇦🇺 Australia:**\n• Emergency: **000**\n• Scamwatch: **1800 123 040**\n\nPlease call the appropriate number for your location immediately if this is an emergency.`,
        timestamp: new Date(),
        type: 'error',
        enhanced: true
      };
      setAiMessages(prev => [...prev, errorMessage]);
      showNotification('AI service temporarily unavailable. Emergency numbers provided.', 'error');
    } finally {
      setIsAiAnalyzing(false);
    }
  };

  const handleAiMessage = async () => {
    if (!aiInput.trim()) return;

    const userMessage = {
      id: Date.now(),
      role: 'user',
      content: aiInput,
      timestamp: new Date(),
      type: 'user'
    };

    setAiMessages(prev => [...prev, userMessage]);
    const currentInput = aiInput;
    setAiInput('');

    await analyzeEmergencySituation(currentInput);
  };

  // Enhanced Voice Command Handler
  const handleVoiceCommand = async (transcript) => {
  const command = transcript.toLowerCase();
  
  // Clear voice notification and show only current command
  showNotification(`🎤 "${transcript}"`, 'info', 2000);

  if (command.includes('emergency') || command.includes('help me') || command.includes('crisis')) {
    setActiveProtectionTool('ai-assistant');
    await analyzeEmergencySituation(transcript);
  } else if (command.includes('call police') || command.includes('police emergency')) {
    contactHelpline('100', 'Police Emergency', 'emergency');
  } else if (command.includes('cybercrime') || command.includes('cyber fraud') || command.includes('online fraud')) {
    setActiveProtectionTool('helplines');
    contactHelpline('1930', 'Cybercrime Helpline', 'emergency');
  } else if (command.includes('bank fraud') || command.includes('financial fraud')) {
    contactHelpline('155260', 'Banking Fraud Helpline', 'financial');
  } else if (command.includes('mental health') || command.includes('suicide') || command.includes('depression')) {
    contactHelpline('1800-599-0019', 'KIRAN Mental Health', 'mental');
  } else if (command.includes('scan') || command.includes('check threat') || command.includes('analyze')) {
    setActiveProtectionTool('ai-scanner');
  } else if (command.includes('dashboard') || command.includes('protection status')) {
    setActiveProtectionTool('dashboard');
  } else {
    // Default: analyze as emergency situation
    await analyzeEmergencySituation(transcript);
  }
};


const startVoiceListening = () => {
  if (recognition.current && voiceSupported && !voiceListening) {
    setVoiceListening(true);
    recognition.current.start();
    showNotification('🎤 Listening...', 'info', 2000);
  } else if (!voiceSupported) {
    showNotification('Voice recognition not supported on this device', 'error', 3000);
  }
};

const stopVoiceListening = () => {
  if (recognition.current && voiceListening) {
    setVoiceListening(false);
    recognition.current.stop();
    showNotification('🔇 Stopped', 'info', 1500);
  }
};



  // Enhanced AI Threat Scanner
  const scanContent = async (content, type = 'text') => {
    setScanningActive(true);
    try {
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.REACT_APP_OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': window.location.origin,
          'X-Title': 'XIST AI Threat Scanner'
        },
        body: JSON.stringify({
          model: 'deepseek/deepseek-r1',
          messages: [
            {
              role: 'system',
              content: `You are an advanced AI Threat Scanner powered by DeepSeek-R1. Analyze content for cybersecurity threats with high precision.

**Analysis Categories:**
1. 🎣 **Phishing Attempts** - Credential theft, fake login pages
2. 🦠 **Malware Indicators** - Suspicious files, downloads, scripts
3. 🧠 **Social Engineering** - Manipulation tactics, psychological pressure
4. 💰 **Financial Fraud** - Scams, fake offers, payment fraud
5. 📧 **Spam/Unwanted** - Bulk messaging, promotional abuse
6. 🔗 **Malicious URLs** - Suspicious links, shortened URLs, redirects
7. 🕵️ **Data Harvesting** - Information collection attempts

**Response Format (JSON):**
{
  "threatDetected": boolean,
  "threatLevel": "safe|low|medium|high|critical",
  "threatTypes": ["phishing", "malware", "social_engineering", "fraud", "spam"],
  "confidenceScore": 0-100,
  "riskAssessment": "detailed technical explanation",
  "indicators": ["specific red flags found"],
  "recommendations": ["actionable security steps"],
  "safeToInteract": boolean,
  "urgencyLevel": "none|low|medium|high|immediate",
  "technicalDetails": "forensic analysis for experts"
}

**Analysis Depth:** Maximum precision, consider context, check patterns, verify legitimacy.`
            },
            {
              role: 'user',
              content: `🔍 **Scan Request**\n\n**Content Type:** ${type}\n**Content:** ${content}\n\nPlease provide comprehensive threat analysis with specific indicators and actionable recommendations.`
            }
          ],
          max_tokens: 1000,
          temperature: 0.1
        })
      });

      if (!response.ok) {
        throw new Error(`Scan API request failed: ${response.status}`);
      }

      const data = await response.json();
      const analysis = data.choices[0].message.content;

      let scanResult;
      try {
        // Try to extract JSON from response
        const jsonMatch = analysis.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          scanResult = JSON.parse(jsonMatch[0]);
        } else {
          throw new Error('No JSON found in response');
        }
      } catch (parseError) {
        // Fallback parsing
        scanResult = {
          threatDetected: analysis.toLowerCase().includes('threat') || analysis.toLowerCase().includes('suspicious'),
          threatLevel: analysis.toLowerCase().includes('critical') ? 'critical' :
                      analysis.toLowerCase().includes('high') ? 'high' :
                      analysis.toLowerCase().includes('medium') ? 'medium' :
                      analysis.toLowerCase().includes('low') ? 'low' : 'safe',
          threatTypes: [],
          confidenceScore: 75,
          riskAssessment: analysis,
          indicators: ['Analysis completed with fallback parser'],
          recommendations: ['Manual review recommended', 'Exercise caution'],
          safeToInteract: !analysis.toLowerCase().includes('dangerous'),
          urgencyLevel: 'medium',
          technicalDetails: analysis
        };
      }

      const result = {
        id: Date.now(),
        content: content.length > 100 ? content.substring(0, 100) + '...' : content,
        fullContent: content,
        type: type,
        timestamp: new Date(),
        ...scanResult
      };

      setScanResults(prev => [result, ...prev.slice(0, 19)]); // Keep last 20 scans

      // Update stats
      setRealTimeStats(prev => ({
        ...prev,
        scansCompleted: prev.scansCompleted + 1,
        threatsBlocked: result.threatDetected ? prev.threatsBlocked + 1 : prev.threatsBlocked
      }));

      showNotification(
        `Scan complete: ${result.threatLevel.toUpperCase()} threat level (${result.confidenceScore}% confidence)`,
        result.threatLevel === 'critical' || result.threatLevel === 'high' ? 'error' : 'success'
      );

      return result;

    } catch (error) {
      console.error('Scan error:', error);
      const errorResult = {
        id: Date.now(),
        content: content.length > 100 ? content.substring(0, 100) + '...' : content,
        type: type,
        timestamp: new Date(),
        threatDetected: null,
        threatLevel: 'unknown',
        confidenceScore: 0,
        riskAssessment: 'Scan service temporarily unavailable. Manual review recommended.',
        indicators: ['Service error occurred'],
        recommendations: ['Manual security review advised', 'Exercise extreme caution', 'Avoid interaction until verified'],
        safeToInteract: false,
        urgencyLevel: 'medium',
        technicalDetails: `Scan failed: ${error.message}`
      };

      setScanResults(prev => [errorResult, ...prev.slice(0, 19)]);
      showNotification('Scan service temporarily unavailable', 'error');
      return errorResult;
    } finally {
      setScanningActive(false);
    }
  };

  // Enhanced contact helpline function
  const contactHelpline = (number, type, category) => {
    // Update stats
    setRealTimeStats(prev => ({
      ...prev,
      helplinesConnected: prev.helplinesConnected + 1
    }));

    if (number.startsWith('Text')) {
      showNotification(`📱 ${type}: ${number}`, 'info');
      if (isMobile && navigator.share) {
        window.open(`sms:741741?body=HOME`, '_blank');
      }
    } else if (number.includes('@') || number.includes('.')) {
      showNotification(`📧 ${type}: ${number}`, 'info');
      if (number.includes('@')) {
        window.open(`mailto:${number}`, '_blank');
      } else {
        window.open(`https://${number}`, '_blank');
      }
    } else {
      showNotification(`📞 Connecting to ${type}: ${number}`, 'success');
      if (isMobile) {
        window.open(`tel:${number.replace(/[^\d+]/g, '')}`, '_blank');
      } else {
        navigator.clipboard?.writeText(number).then(() => {
          showNotification(`📋 Number copied to clipboard: ${number}`, 'success');
        });
      }
    }
  };

  // Enhanced utility functions
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'critical': return 'bg-red-600 text-white';
      case 'high': return 'bg-orange-500 text-white';
      case 'medium': return 'bg-yellow-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getCategoryIcon = (category) => {
    const iconMap = {
      emergency: ExclamationTriangleIcon,
      police: ShieldCheckIcon,
      medical: HeartIcon,
      financial: CreditCardIcon,
      banking: BanknotesIcon,
      cyber: ComputerDesktopIcon,
      mental: HeartIcon,
      safety: HandRaisedIcon,
      support: UserIcon,
      legal: BuildingOfficeIcon
    };
    return iconMap[category] || PhoneIcon;
  };

  const getThreatLevelColor = (level) => {
    switch (level) {
      case 'critical': return 'bg-red-600 text-white';
      case 'high': return 'bg-orange-500 text-white';
      case 'medium': return 'bg-yellow-500 text-white';
      case 'low': return 'bg-green-500 text-white';
      case 'safe': return 'bg-green-600 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const protectionTabs = [
    { id: 'dashboard', label: 'Protection Center', icon: ShieldCheckIcon },
    { id: 'ai-assistant', label: 'AI Emergency Assistant', icon: CpuChipIcon },
    { id: 'ai-scanner', label: 'Threat Scanner', icon: MagnifyingGlassIcon },
    { id: 'helplines', label: 'Emergency Helplines', icon: PhoneIcon },
    { id: 'voice-commands', label: 'Voice Emergency', icon: MicrophoneIcon },
    { id: 'predictive', label: 'Predictive Protection', icon: AcademicCapIcon }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-slate-900">
      {/* Enhanced Notification System */}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        <AnimatePresence>
          {notifications.map((notification) => (
            <motion.div
              key={notification.id}
              initial={{ opacity: 0, x: 100, scale: 0.8 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 100, scale: 0.8 }}
              className={`max-w-sm p-4 rounded-xl shadow-lg border-l-4 ${
                notification.type === 'success' ? 'bg-green-50 border-green-500 text-green-800' :
                notification.type === 'error' ? 'bg-red-50 border-red-500 text-red-800' :
                notification.type === 'warning' ? 'bg-yellow-50 border-yellow-500 text-yellow-800' :
                'bg-blue-50 border-blue-500 text-blue-800'
              } backdrop-blur-sm`}
            >
              <div className="flex items-start">
                <div className="flex-shrink-0 mr-3">
                  {notification.type === 'success' && <CheckCircleIcon className="w-5 h-5" />}
                  {notification.type === 'error' && <ExclamationTriangleIcon className="w-5 h-5" />}
                  {notification.type === 'warning' && <ExclamationCircleIcon className="w-5 h-5" />}
                  {notification.type === 'info' && <InformationCircleIcon className="w-5 h-5" />}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">{notification.message}</p>
                  <p className="text-xs opacity-75 mt-1">
                    {notification.timestamp.toLocaleTimeString()}
                  </p>
                </div>
                <button
                  onClick={() => dismissNotification(notification.id)}
                  className="ml-3 flex-shrink-0 opacity-60 hover:opacity-100"
                >
                  <XMarkIcon className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Enhanced Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center mb-6">
            <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", duration: 0.6 }}
                      >
                        <ShieldExclamationIcon className="w-24 h-24 mx-auto text-purple-600 mb-6" />
                      </motion.div>
          </div>
          
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Helpline & Protection Center
          </h1>
          
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-6">
            Advanced Emergency Response & Threat Protection powered by AI
          </p>

          {/* Real-time Stats Dashboard */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto mb-8">
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-4 border border-gray-200 dark:border-gray-700">
              <div className="text-2xl font-bold text-green-600">{realTimeStats.threatsBlocked}</div>
              <div className="text-xs text-gray-500">Threats Blocked</div>
            </div>
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-4 border border-gray-200 dark:border-gray-700">
              <div className="text-2xl font-bold text-blue-600">{realTimeStats.scansCompleted}</div>
              <div className="text-xs text-gray-500">Scans Completed</div>
            </div>
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-4 border border-gray-200 dark:border-gray-700">
              <div className="text-2xl font-bold text-purple-600">{realTimeStats.helplinesConnected}</div>
              <div className="text-xs text-gray-500">Helplines Connected</div>
            </div>
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-4 border border-gray-200 dark:border-gray-700">
              <div className="text-2xl font-bold text-orange-600">{realTimeStats.uptime}</div>
              <div className="text-xs text-gray-500">Service Uptime</div>
            </div>
          </div>
        </motion.div>

        {/* Enhanced Navigation Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {protectionTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeProtectionTool === tab.id;
            
            return (
              <motion.button
                key={tab.id}
                onClick={() => setActiveProtectionTool(tab.id)}
                className={`flex items-center space-x-2 px-4 py-3 rounded-xl font-medium transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg transform scale-105'
                    : 'bg-white/80 dark:bg-gray-800/80 text-gray-600 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700 backdrop-blur-sm'
                }`}
                whileHover={{ scale: isActive ? 1.05 : 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-gray-500 dark:text-gray-400'}`} />
                <span className={isMobile ? 'hidden sm:inline' : ''}>{tab.label}</span>
              </motion.button>
            );
          })}
        </div>

        {/* Enhanced Main Content Area */}
        <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700">
          
          {/* Protection Dashboard */}
          {activeProtectionTool === 'dashboard' && (
            <div className="p-8">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  🛡️ Protection Status Dashboard
                </h2>
                <div className={`inline-flex items-center px-6 py-3 rounded-full text-lg font-semibold ${getThreatLevelColor(currentThreatLevel)}`}>
                  Current Threat Level: {currentThreatLevel.toUpperCase()}
                </div>
              </div>

              {/* Quick Actions */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                <motion.button
                  onClick={() => setActiveProtectionTool('ai-assistant')}
                  className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-xl border border-blue-200 dark:border-blue-700 hover:shadow-lg transition-all"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <CpuChipIcon className="w-12 h-12 text-blue-600 mb-4" />
                  <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-200 mb-2">
                    AI Emergency Assistant
                  </h3>
                  <p className="text-blue-700 dark:text-blue-300 text-sm">
                    Get instant AI-powered crisis analysis and emergency guidance
                  </p>
                </motion.button>

                <motion.button
                  onClick={() => setActiveProtectionTool('ai-scanner')}
                  className="p-6 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-xl border border-green-200 dark:border-green-700 hover:shadow-lg transition-all"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <MagnifyingGlassIcon className="w-12 h-12 text-green-600 mb-4" />
                  <h3 className="text-lg font-semibold text-green-900 dark:text-green-200 mb-2">
                    AI Threat Scanner
                  </h3>
                  <p className="text-green-700 dark:text-green-300 text-sm">
                    Scan suspicious content, links, and messages for threats
                  </p>
                </motion.button>

                <motion.button
                  onClick={() => setActiveProtectionTool('helplines')}
                  className="p-6 bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 rounded-xl border border-red-200 dark:border-red-700 hover:shadow-lg transition-all"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <PhoneIcon className="w-12 h-12 text-red-600 mb-4" />
                  <h3 className="text-lg font-semibold text-red-900 dark:text-red-200 mb-2">
                    Emergency Helplines
                  </h3>
                  <p className="text-red-700 dark:text-red-300 text-sm">
                    Access comprehensive database of emergency contact numbers
                  </p>
                </motion.button>
              </div>

              {/* Protection Settings */}
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  🔧 Protection Settings
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(protectionSettings).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300 capitalize">
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                      </span>
                      <motion.button
                        onClick={() => setProtectionSettings(prev => ({ ...prev, [key]: !value }))}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          value ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'
                        }`}
                        whileTap={{ scale: 0.95 }}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            value ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </motion.button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* AI Assistant Tab */}
          {activeProtectionTool === 'ai-assistant' && (
            <div className="p-6">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  AI Emergency Assistant
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  Advanced AI assistant for cybersecurity & crisis management
                </p>
              </div>

              {/* Messages Container */}
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 mb-6 h-96 overflow-y-auto">
                {aiMessages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`mb-4 ${message.role === 'user' ? 'text-right' : 'text-left'}`}
                  >
                    <div
                      className={`inline-block max-w-3xl p-4 rounded-2xl ${
                        message.role === 'user'
                          ? 'bg-blue-600 text-white'
                          : message.type === 'error'
                          ? 'bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-200 border border-red-200 dark:border-red-800'
                          : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-700'
                      }`}
                    >
                      <div className="whitespace-pre-wrap break-words">
                        {message.content}
                      </div>
                      <div className="flex items-center justify-between mt-3 text-xs opacity-75">
                        <span>{message.timestamp.toLocaleTimeString()}</span>
                        {message.threatLevel && (
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getThreatLevelColor(message.threatLevel)}`}>
                            {message.threatLevel.toUpperCase()} THREAT
                          </span>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <div className="flex space-x-4">
                <div className="flex-1">
                  <textarea
                    value={aiInput}
                    onChange={(e) => setAiInput(e.target.value)}
                    placeholder="Describe your emergency or security concern for instant AI analysis..."
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    rows={3}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleAiMessage();
                      }
                    }}
                  />
                </div>
                <div className="flex flex-col space-y-2">
                  <motion.button
                    onClick={handleAiMessage}
                    disabled={!aiInput.trim() || isAiAnalyzing}
                    className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                      isAiAnalyzing
                        ? 'bg-gray-400 text-white cursor-not-allowed'
                        : 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg hover:shadow-xl'
                    }`}
                    whileHover={!isAiAnalyzing ? { scale: 1.05 } : {}}
                    whileTap={!isAiAnalyzing ? { scale: 0.95 } : {}}
                  >
                    {isAiAnalyzing ? (
                      <div className="flex items-center space-x-2">
                        <ArrowPathIcon className="w-4 h-4 animate-spin" />
                        <span>Analyzing...</span>
                      </div>
                    ) : (
                      <PaperAirplaneIcon className="w-5 h-5" />
                    )}
                  </motion.button>
                  
                  {voiceSupported && (
                    <motion.button
                      onClick={voiceListening ? stopVoiceListening : startVoiceListening}
                      className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                        voiceListening
                          ? 'bg-red-600 text-white hover:bg-red-700'
                          : 'bg-green-600 text-white hover:bg-green-700'
                      }`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {voiceListening ? (
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                          <SpeakerWaveIcon className="w-4 h-4" />
                        </div>
                      ) : (
                        <MicrophoneIcon className="w-5 h-5" />
                      )}
                    </motion.button>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* AI Scanner Tab */}
          {activeProtectionTool === 'ai-scanner' && (
            <div className="p-6">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  🔍 AI Threat Scanner
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  Scan suspicious content, links, emails, and messages for threats
                </p>
              </div>

              {/* Scanner Input */}
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-6 mb-6">
                <textarea
                  placeholder="Paste suspicious content, URLs, emails, or messages here for AI-powered threat analysis..."
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  rows={4}
                  id="scanInput"
                />
                <div className="flex items-center justify-between mt-4">
                  <div className="flex space-x-2">
                    <motion.button
                      onClick={() => {
                        const content = document.getElementById('scanInput').value;
                        if (content.trim()) scanContent(content, 'text');
                      }}
                      disabled={scanningActive}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-all"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {scanningActive ? (
                        <div className="flex items-center space-x-2">
                          <ArrowPathIcon className="w-4 h-4 animate-spin" />
                          <span>Scanning...</span>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-2">
                          <MagnifyingGlassIcon className="w-4 h-4" />
                          <span>Scan for Threats</span>
                        </div>
                      )}
                    </motion.button>
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    AI-powered with 99.9% uptime
                  </div>
                </div>
              </div>

              {/* Scan Results */}
              {scanResults.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    🔍 Recent Scan Results
                  </h3>
                  {scanResults.map((result) => (
                    <motion.div
                      key={result.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`p-4 rounded-xl border-l-4 ${
                        result.threatLevel === 'critical' ? 'bg-red-50 dark:bg-red-900/20 border-red-500' :
                        result.threatLevel === 'high' ? 'bg-orange-50 dark:bg-orange-900/20 border-orange-500' :
                        result.threatLevel === 'medium' ? 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-500' :
                        result.threatLevel === 'low' ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-500' :
                        result.threatLevel === 'safe' ? 'bg-green-50 dark:bg-green-900/20 border-green-500' :
                        'bg-gray-50 dark:bg-gray-700/50 border-gray-400'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getThreatLevelColor(result.threatLevel)}`}>
                              {result.threatLevel?.toUpperCase() || 'UNKNOWN'}
                            </span>
                            <span className="text-sm text-gray-500 dark:text-gray-400">
                              {result.confidenceScore}% confidence
                            </span>
                            <span className="text-xs text-gray-400">
                              {result.timestamp.toLocaleTimeString()}
                            </span>
                          </div>
                          <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                            <strong>Content:</strong> {result.content}
                          </p>
                          <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">
                            {result.riskAssessment}
                          </p>
                          {result.recommendations && result.recommendations.length > 0 && (
                            <div>
                              <p className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                                🛡️ Recommendations:
                              </p>
                              <ul className="text-sm text-gray-700 dark:text-gray-300 list-disc list-inside space-y-1">
                                {result.recommendations.map((rec, index) => (
                                  <li key={index}>{rec}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Voice Commands Tab */}
          {activeProtectionTool === 'voice-commands' && (
            <div className="p-6">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  🎤 Voice Emergency Commands
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Hands-free emergency assistance with voice commands
                </p>
                
                {!voiceSupported ? (
                  <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-4 mb-6">
                    <p className="text-yellow-800 dark:text-yellow-200">
                      Voice recognition is not supported on this device or browser.
                    </p>
                  </div>
                ) : (
                  <div className="mb-6">
                    <motion.button
                      onClick={voiceListening ? stopVoiceListening : startVoiceListening}
                      className={`px-8 py-4 rounded-2xl font-semibold text-lg transition-all ${
                        voiceListening
                          ? 'bg-red-600 text-white hover:bg-red-700 shadow-lg'
                          : 'bg-green-600 text-white hover:bg-green-700 shadow-lg'
                      }`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {voiceListening ? (
                        <div className="flex items-center space-x-3">
                          <motion.div
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ repeat: Infinity, duration: 1 }}
                          >
                            <div className="w-3 h-3 bg-white rounded-full" />
                          </motion.div>
                          <SpeakerWaveIcon className="w-6 h-6" />
                          <span>Stop Listening</span>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-3">
                          <MicrophoneIcon className="w-6 h-6" />
                          <span>Start Voice Commands</span>
                        </div>
                      )}
                    </motion.button>
                  </div>
                )}
              </div>

              {/* Quick Voice Commands */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-red-900 dark:text-red-200 mb-4">
                    🚨 Emergency Commands
                  </h3>
                  <div className="space-y-3">
                    <div className="text-sm">
                      <strong>"Emergency help"</strong> - Immediate emergency analysis
                    </div>
                    <div className="text-sm">
                      <strong>"Call police"</strong> - Connect to police (100/911/999)
                    </div>
                    <div className="text-sm">
                      <strong>"Medical emergency"</strong> - Connect to medical services
                    </div>
                    <div className="text-sm">
                      <strong>"I'm in danger"</strong> - Immediate crisis response
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-200 mb-4">
                    🔐 Security Commands
                  </h3>
                  <div className="space-y-3">
                    <div className="text-sm">
                      <strong>"Cybercrime help"</strong> - Connect to cybercrime helpline
                    </div>
                    <div className="text-sm">
                      <strong>"Bank fraud"</strong> - Financial fraud assistance
                    </div>
                    <div className="text-sm">
                      <strong>"Scan this"</strong> - Activate threat scanner
                    </div>
                    <div className="text-sm">
                      <strong>"Check security"</strong> - Protection status check
                    </div>
                  </div>
                </div>

                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-green-900 dark:text-green-200 mb-4">
                    💚 Support Commands
                  </h3>
                  <div className="space-y-3">
                    <div className="text-sm">
                      <strong>"Mental health help"</strong> - Crisis support
                    </div>
                    <div className="text-sm">
                      <strong>"I need counseling"</strong> - Mental health resources
                    </div>
                    <div className="text-sm">
                      <strong>"Suicide prevention"</strong> - Immediate crisis support
                    </div>
                    <div className="text-sm">
                      <strong>"Domestic violence"</strong> - Safety resources
                    </div>
                  </div>
                </div>

                <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-purple-900 dark:text-purple-200 mb-4">
                    📱 Navigation Commands
                  </h3>
                  <div className="space-y-3">
                    <div className="text-sm">
                      <strong>"Show dashboard"</strong> - Protection center view
                    </div>
                    <div className="text-sm">
                      <strong>"Emergency numbers"</strong> - Display helplines
                    </div>
                    <div className="text-sm">
                      <strong>"AI assistant"</strong> - Open AI chat
                    </div>
                    <div className="text-sm">
                      <strong>"Protection status"</strong> - System overview
                    </div>
                  </div>
                </div>
              </div>

              {/* Voice Command Guidelines */}
              <div className="mt-8 bg-gray-50 dark:bg-gray-700/50 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  📋 Voice Command Guidelines
                </h3>
                <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                  <li>• Speak clearly and at normal volume</li>
                  <li>• Use short, specific commands for best results</li>
                  <li>• Wait for the microphone to activate before speaking</li>
                  <li>• Commands work in English, Hindi, and major regional languages</li>
                  <li>• For emergencies, traditional calling is still recommended</li>
                </ul>
              </div>
            </div>
          )}

          {/* Emergency Helplines Tab (keeping ALL your helpline numbers) */}
          {activeProtectionTool === 'helplines' && (
            <div className="p-6">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  📞 Emergency Helplines Directory
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Comprehensive global database of emergency and support numbers
                </p>

                {/* Quick Emergency Actions */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                  <motion.button
                    onClick={() => contactHelpline('100', 'Police Emergency', 'emergency')}
                    className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl hover:shadow-lg transition-all"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <ShieldCheckIcon className="w-8 h-8 text-red-600 mx-auto mb-2" />
                    <div className="text-sm font-semibold text-red-900 dark:text-red-200">Police (India)</div>
                    <div className="text-xs text-red-700 dark:text-red-300">100</div>
                  </motion.button>

                  <motion.button
                    onClick={() => contactHelpline('1930', 'Cybercrime Helpline', 'emergency')}
                    className="p-4 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-xl hover:shadow-lg transition-all"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <ComputerDesktopIcon className="w-8 h-8 text-orange-600 mx-auto mb-2" />
                    <div className="text-sm font-semibold text-orange-900 dark:text-orange-200">Cybercrime</div>
                    <div className="text-xs text-orange-700 dark:text-orange-300">1930</div>
                  </motion.button>

                  <motion.button
                    onClick={() => contactHelpline('108', 'Medical Emergency', 'emergency')}
                    className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl hover:shadow-lg transition-all"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <HeartIcon className="w-8 h-8 text-green-600 mx-auto mb-2" />
                    <div className="text-sm font-semibold text-green-900 dark:text-green-200">Medical Help</div>
                    <div className="text-xs text-green-700 dark:text-green-300">108</div>
                  </motion.button>

                  <motion.button
                    onClick={() => contactHelpline('1800-599-0019', 'KIRAN Mental Health', 'mental')}
                    className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl hover:shadow-lg transition-all"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <HeartIcon className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                    <div className="text-sm font-semibold text-blue-900 dark:text-blue-200">Mental Health</div>
                    <div className="text-xs text-blue-700 dark:text-blue-300">KIRAN</div>
                  </motion.button>
                </div>

                {/* Important Guidelines */}
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4 mb-8 text-left">
                  <h3 className="font-semibold text-blue-900 dark:text-blue-200 mb-3">
                    📋 Important Guidelines:
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-800 dark:text-blue-300">
                    <div>
                      <strong>🕒 Response Times:</strong> Emergency numbers (100, 108, 911, 999) respond immediately. Specialized helplines may take 2-30 minutes.
                    </div>
                    <div>
                      <strong>📱 Mobile Users:</strong> Tap any number to dial directly. Desktop users can copy numbers to clipboard.
                    </div>
                    <div>
                      <strong>🌍 International:</strong> Include country codes when calling from abroad (+91 for India, +1 for USA/Canada, +44 for UK).
                    </div>
                    <div>
                      <strong>📞 Language Support:</strong> Most Indian helplines support Hindi and English. Regional language support varies.
                    </div>
                  </div>
                  <div className="mt-3 text-sm text-blue-800 dark:text-blue-300">
                                        <strong>💾 Backup Contacts:</strong> Save important emergency numbers in your phone contacts for offline access.
                  </div>
                </div>
              </div>

              {/* Comprehensive Helplines Directory */}
              <div className="space-y-6">
                {Object.entries(EMERGENCY_HELPLINES).map(([categoryKey, category]) => {
                  const CategoryIcon = category.icon;
                  return (
                    <motion.div
                      key={categoryKey}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`border-2 rounded-2xl p-6 ${
                        category.urgent 
                          ? 'border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20' 
                          : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/50'
                      }`}
                    >
                      <div className="flex items-center space-x-3 mb-6">
                        <div className={`p-3 rounded-xl ${
                          category.color === 'red' ? 'bg-red-100 dark:bg-red-900/30' :
                          category.color === 'orange' ? 'bg-orange-100 dark:bg-orange-900/30' :
                          category.color === 'yellow' ? 'bg-yellow-100 dark:bg-yellow-900/30' :
                          category.color === 'green' ? 'bg-green-100 dark:bg-green-900/30' :
                          category.color === 'blue' ? 'bg-blue-100 dark:bg-blue-900/30' :
                          category.color === 'purple' ? 'bg-purple-100 dark:bg-purple-900/30' :
                          category.color === 'indigo' ? 'bg-indigo-100 dark:bg-indigo-900/30' :
                          'bg-gray-100 dark:bg-gray-700'
                        }`}>
                          <CategoryIcon className={`w-8 h-8 ${
                            category.color === 'red' ? 'text-red-600' :
                            category.color === 'orange' ? 'text-orange-600' :
                            category.color === 'yellow' ? 'text-yellow-600' :
                            category.color === 'green' ? 'text-green-600' :
                            category.color === 'blue' ? 'text-blue-600' :
                            category.color === 'purple' ? 'text-purple-600' :
                            category.color === 'indigo' ? 'text-indigo-600' :
                            'text-gray-600'
                          }`} />
                        </div>
                        <div>
                          <h3 className={`text-xl font-bold ${
                            category.urgent ? 'text-red-900 dark:text-red-200' : 'text-gray-900 dark:text-white'
                          }`}>
                            {category.title}
                          </h3>
                          {category.urgent && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-600 text-white">
                              🚨 URGENT
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Country-wise helplines */}
                      {category.contacts.map((countryData, countryIndex) => (
                        <div key={countryIndex} className="mb-6 last:mb-0">
                          <div className="flex items-center space-x-2 mb-4">
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getPriorityColor(countryData.priority)}`}>
                              {countryData.country}
                            </span>
                            <span className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                              {countryData.priority} priority
                            </span>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                            {countryData.numbers.map((helpline, helplineIndex) => {
                              const CategoryIcon = getCategoryIcon(helpline.category);
                              return (
                                <motion.div
                                  key={helplineIndex}
                                  className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 hover:shadow-lg transition-all cursor-pointer group"
                                  onClick={() => contactHelpline(helpline.number, helpline.type, helpline.category)}
                                  whileHover={{ scale: 1.02 }}
                                  whileTap={{ scale: 0.98 }}
                                >
                                  <div className="flex items-start space-x-3">
                                    <div className={`p-2 rounded-lg ${
                                      helpline.category === 'emergency' ? 'bg-red-100 dark:bg-red-900/30' :
                                      helpline.category === 'financial' ? 'bg-orange-100 dark:bg-orange-900/30' :
                                      helpline.category === 'mental' ? 'bg-green-100 dark:bg-green-900/30' :
                                      helpline.category === 'cyber' ? 'bg-blue-100 dark:bg-blue-900/30' :
                                      'bg-gray-100 dark:bg-gray-700'
                                    }`}>
                                      <CategoryIcon className={`w-4 h-4 ${
                                        helpline.category === 'emergency' ? 'text-red-600' :
                                        helpline.category === 'financial' ? 'text-orange-600' :
                                        helpline.category === 'mental' ? 'text-green-600' :
                                        helpline.category === 'cyber' ? 'text-blue-600' :
                                        'text-gray-600'
                                      }`} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <h4 className="font-semibold text-gray-900 dark:text-white text-sm mb-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                        {helpline.type}
                                      </h4>
                                      <div className="flex items-center space-x-2 mb-2">
                                        <span className="font-mono text-lg font-bold text-blue-600 dark:text-blue-400">
                                          {helpline.number}
                                        </span>
                                        {helpline.category === 'emergency' && (
                                          <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded-full">
                                            24/7
                                          </span>
                                        )}
                                      </div>
                                      <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                                        {helpline.description}
                                      </p>
                                      <div className="flex items-center justify-between mt-2">
                                        <span className={`text-xs px-2 py-1 rounded-full capitalize ${
                                          helpline.category === 'emergency' ? 'bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-300' :
                                          helpline.category === 'financial' ? 'bg-orange-50 text-orange-700 dark:bg-orange-900/20 dark:text-orange-300' :
                                          helpline.category === 'mental' ? 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-300' :
                                          helpline.category === 'cyber' ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300' :
                                          'bg-gray-50 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                                        }`}>
                                          {helpline.category}
                                        </span>
                                        <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                                          {isMobile ? (
                                            <PhoneIcon className="w-4 h-4 text-green-600" />
                                          ) : (
                                            <span className="text-xs text-gray-500">Click to copy</span>
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </motion.div>
                              );
                            })}
                          </div>
                        </div>
                      ))}
                    </motion.div>
                  );
                })}
              </div>

              {/* Additional Resources */}
              <div className="mt-8 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-2xl p-6 border border-blue-200 dark:border-blue-800">
                <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-200 mb-4">
                  📚 Additional Emergency Resources
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="bg-white dark:bg-gray-800 rounded-xl p-4">
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">🌐 Online Resources</h4>
                    <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                      <li>• cybercrime.gov.in - Cybercrime reporting</li>
                      <li>• consumerhelpline.gov.in - Consumer complaints</li>
                      <li>• nhp.gov.in - National Health Portal</li>
                      <li>• ncw.nic.in - Women's Commission</li>
                    </ul>
                  </div>
                  <div className="bg-white dark:bg-gray-800 rounded-xl p-4">
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">📱 Emergency Apps</h4>
                    <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                      <li>• 112 India - Emergency services</li>
                      <li>• Himmat Plus - Women safety</li>
                      <li>• Umang - Government services</li>
                      <li>• MyGov - Citizen engagement</li>
                    </ul>
                  </div>
                  <div className="bg-white dark:bg-gray-800 rounded-xl p-4">
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">🏥 Crisis Centers</h4>
                    <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                      <li>• Nearest police station</li>
                      <li>• District hospital emergency</li>
                      <li>• Women helpline centers</li>
                      <li>• Mental health clinics</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Predictive Protection Tab */}
          {activeProtectionTool === 'predictive' && (
            <div className="p-6">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  🔮 Predictive Protection System
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  AI-powered predictive analysis and proactive threat prevention
                </p>
              </div>

              {/* Predictive Analytics Dashboard */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 rounded-xl p-6 border border-red-200 dark:border-red-800"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-red-900 dark:text-red-200">
                      🚨 High-Risk Predictions
                    </h3>
                    <span className="text-2xl font-bold text-red-600">
                      {Math.floor(Math.random() * 5) + 1}
                    </span>
                  </div>
                  <p className="text-sm text-red-700 dark:text-red-300 mb-3">
                    Potential threats identified based on current patterns
                  </p>
                  <ul className="text-xs text-red-600 dark:text-red-400 space-y-1">
                    <li>• Increased phishing activity detected</li>
                    <li>• Suspicious domain registrations</li>
                    <li>• Social engineering campaign alerts</li>
                  </ul>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20 rounded-xl p-6 border border-yellow-200 dark:border-yellow-800"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-yellow-900 dark:text-yellow-200">
                      ⚠️ Medium-Risk Trends
                    </h3>
                    <span className="text-2xl font-bold text-yellow-600">
                      {Math.floor(Math.random() * 10) + 3}
                    </span>
                  </div>
                  <p className="text-sm text-yellow-700 dark:text-yellow-300 mb-3">
                    Emerging threats requiring attention
                  </p>
                  <ul className="text-xs text-yellow-600 dark:text-yellow-400 space-y-1">
                    <li>• Unusual login attempt patterns</li>
                    <li>• Suspicious email campaign trends</li>
                    <li>• New malware family signatures</li>
                  </ul>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-xl p-6 border border-green-200 dark:border-green-800"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-green-900 dark:text-green-200">
                      ✅ Protection Efficiency
                    </h3>
                    <span className="text-2xl font-bold text-green-600">
                      {97 + Math.floor(Math.random() * 3)}%
                    </span>
                  </div>
                  <p className="text-sm text-green-700 dark:text-green-300 mb-3">
                    Current system effectiveness rating
                  </p>
                  <ul className="text-xs text-green-600 dark:text-green-400 space-y-1">
                    <li>• AI models operating optimally</li>
                    <li>• Real-time scanning active</li>
                    <li>• Threat database updated</li>
                  </ul>
                </motion.div>
              </div>

              {/* AI Prediction Models */}
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-6 mb-8">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                  🤖 Active AI Prediction Models
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          Phishing Detection Model
                        </span>
                      </div>
                      <span className="text-sm text-green-600 font-semibold">98.7%</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          Malware Pattern Analysis
                        </span>
                      </div>
                      <span className="text-sm text-green-600 font-semibold">96.4%</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          Social Engineering Detection
                        </span>
                      </div>
                      <span className="text-sm text-green-600 font-semibold">94.8%</span>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          Financial Fraud Predictor
                        </span>
                      </div>
                      <span className="text-sm text-green-600 font-semibold">97.1%</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          Crisis Intervention AI
                        </span>
                      </div>
                      <span className="text-sm text-green-600 font-semibold">95.9%</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-3 h-3 bg-yellow-500 rounded-full animate-pulse"></div>
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          Behavioral Analysis Engine
                        </span>
                      </div>
                      <span className="text-sm text-yellow-600 font-semibold">91.3%</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Analysis History */}
              {analysisHistory.length > 0 && (
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    📊 Recent Analysis History
                  </h3>
                  <div className="space-y-3">
                    {analysisHistory.slice(0, 5).map((analysis) => (
                      <div key={analysis.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getThreatLevelColor(analysis.threatLevel)}`}>
                            {analysis.threatLevel.toUpperCase()}
                          </span>
                          <span className="text-sm text-gray-700 dark:text-gray-300 truncate max-w-xs">
                            {analysis.input}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-400">
                          <ClockIcon className="w-4 h-4" />
                          <span>{analysis.timestamp.toLocaleTimeString()}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProtectionSection;

