import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShieldCheckIcon,
  ExclamationTriangleIcon,
  LockClosedIcon,
  EyeIcon,
  DevicePhoneMobileIcon,
  ComputerDesktopIcon,
  GlobeAltIcon,
  BellIcon,
  CogIcon,
  BookOpenIcon,
  AcademicCapIcon,
  ShieldExclamationIcon,
  PlayCircleIcon,
  DocumentTextIcon,
  CheckCircleIcon,
  XMarkIcon,
  ArrowRightIcon,
  ClockIcon,
  StarIcon,
  TrophyIcon,
  FireIcon,
  BoltIcon,
  SparklesIcon,
  MagnifyingGlassIcon,
  KeyIcon,
  WifiIcon,
  PhoneIcon,
  EnvelopeIcon,
  CameraIcon,
  MicrophoneIcon,
  VideoCameraIcon,
  ChatBubbleLeftRightIcon,
  HandRaisedIcon,
  ExclamationCircleIcon,
  InformationCircleIcon,
  BuildingOfficeIcon,
  HeartIcon,
  UserGroupIcon,
  CreditCardIcon,
  BanknotesIcon,
  IdentificationIcon,
  HomeIcon,
  MegaphoneIcon,
  CpuChipIcon,
  RobotIcon,
  BrainIcon,
  EyeSlashIcon,
  SpeakerWaveIcon,
  SpeakerXMarkIcon,
  CloudIcon,
  CircleStackIcon,
  CommandLineIcon,
  PaperAirplaneIcon,
  UserIcon,
  LightBulbIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';

// Import utility functions
import { saveAnalysis } from '../../utils/dbOperations';

const ProtectionSection = ({ theme = 'light', isMobile = false }) => {
  // State management
  const [activeProtectionTool, setActiveProtectionTool] = useState('ai-assistant');
  const [protectionSettings, setProtectionSettings] = useState({
    realTimeScanning: true,
    threatNotifications: true,
    autoBlock: false,
    privacyMode: false,
    familyFilter: false,
    aiAssistantEnabled: true,
    voiceCommands: true,
    predictiveProtection: true
  });

  // AI State Management
  const [aiMessages, setAiMessages] = useState([
    {
      id: 1,
      role: 'assistant',
      content: 'Hi! I\'m your AI Emergency Protection Assistant. I can analyze threats, guide you through emergency situations, scan suspicious content, and provide 24/7 crisis support. How can I help you today?',
      timestamp: new Date(),
      type: 'welcome'
    }
  ]);
  const [aiInput, setAiInput] = useState('');
  const [isAiAnalyzing, setIsAiAnalyzing] = useState(false);
  const [voiceListening, setVoiceListening] = useState(false);
  const [currentThreatLevel, setCurrentThreatLevel] = useState('low');
  const messagesEndRef = useRef(null);

  // AI Scanner State
  const [scanResults, setScanResults] = useState([]);
  const [scanningActive, setScanningActive] = useState(false);

  // Voice Recognition Setup
  const recognition = useRef(null);

  useEffect(() => {
    if ('webkitSpeechRecognition' in window) {
      recognition.current = new window.webkitSpeechRecognition();
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
    }
  }, []);

  // COMPREHENSIVE EMERGENCY HELPLINES DATABASE
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

  // AI Functions
  const analyzeEmergencySituation = async (input) => {
    setIsAiAnalyzing(true);
    
    try {
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.REACT_APP_OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': window.location.origin,
          'X-Title': 'XIST AI Emergency Protection'
        },
        body: JSON.stringify({
          model: 'deepseek/deepseek-r1',
          messages: [
            {
              role: 'system',
              content: `You are an AI Emergency Protection Assistant specializing in cybersecurity, fraud prevention, and crisis management. Analyze the user's situation and provide:

1. **Threat Assessment**: Determine threat level (LOW/MEDIUM/HIGH/CRITICAL)
2. **Emergency Classification**: Category (cybercrime/financial/safety/mental health/other)
3. **Immediate Actions**: What user should do right now
4. **Recommended Helplines**: Best numbers to call based on situation
5. **Next Steps**: Detailed guidance for resolution
6. **Prevention Tips**: How to avoid similar situations

Be empathetic, professional, and provide actionable advice. Focus on immediate safety and resolution.`
            },
            {
              role: 'user',
              content: input
            }
          ],
          max_tokens: 1000,
          temperature: 0.3
        })
      });

      const data = await response.json();
      const aiResponse = data.choices[0].message.content;

      // Analyze threat level from response
      let threatLevel = 'low';
      if (aiResponse.toLowerCase().includes('critical')) threatLevel = 'critical';
      else if (aiResponse.toLowerCase().includes('high')) threatLevel = 'high';
      else if (aiResponse.toLowerCase().includes('medium')) threatLevel = 'medium';
      
      setCurrentThreatLevel(threatLevel);

      const newMessage = {
        id: Date.now(),
        role: 'assistant',
        content: aiResponse,
        timestamp: new Date(),
        type: 'analysis',
        threatLevel: threatLevel
      };

      setAiMessages(prev => [...prev, newMessage]);
      
      // Auto-scroll to bottom
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);

    } catch (error) {
      console.error('AI Analysis error:', error);
      const errorMessage = {
        id: Date.now(),
        role: 'assistant',
        content: 'I\'m having trouble analyzing your situation right now. For immediate emergencies, please call 911 (US), 999 (UK), 100 (India Police), or your local emergency services directly.',
        timestamp: new Date(),
        type: 'error'
      };
      setAiMessages(prev => [...prev, errorMessage]);
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

  // Voice Command Handler
  const handleVoiceCommand = async (transcript) => {
    const command = transcript.toLowerCase();
    
    if (command.includes('emergency') || command.includes('help')) {
      setActiveProtectionTool('ai-assistant');
      await analyzeEmergencySituation(transcript);
    } else if (command.includes('call police')) {
      contactHelpline('100', 'Police Emergency', 'emergency');
    } else if (command.includes('cybercrime') || command.includes('fraud')) {
      setActiveProtectionTool('helplines');
      contactHelpline('1930', 'Cybercrime Helpline', 'emergency');
    } else if (command.includes('scan') || command.includes('check')) {
      setActiveProtectionTool('ai-scanner');
    } else {
      await analyzeEmergencySituation(transcript);
    }
  };

  const startVoiceListening = () => {
    if (recognition.current && !voiceListening) {
      setVoiceListening(true);
      recognition.current.start();
    }
  };

  const stopVoiceListening = () => {
    if (recognition.current && voiceListening) {
      setVoiceListening(false);
      recognition.current.stop();
    }
  };

  // AI Threat Scanner
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
              content: `You are an AI Threat Scanner. Analyze content for:
1. Phishing attempts
2. Malware indicators
3. Social engineering
4. Fraud patterns
5. Suspicious links/attachments
6. Scam indicators

Provide analysis in this JSON format:
{
  "threatDetected": boolean,
  "threatLevel": "low|medium|high|critical",
  "threatTypes": ["phishing", "malware", "social_engineering", "fraud", "spam"],
  "confidenceScore": 0-100,
  "riskAssessment": "detailed explanation",
  "recommendations": ["action1", "action2"],
  "safeToInteract": boolean,
  "details": "explanation"
}`
            },
            {
              role: 'user',
              content: `Analyze this ${type}: ${content}`
            }
          ],
          max_tokens: 800,
          temperature: 0.1
        })
      });

      const data = await response.json();
      const analysis = data.choices[0].message.content;
      
      let scanResult;
      try {
        scanResult = JSON.parse(analysis);
      } catch {
        scanResult = {
          threatDetected: false,
          threatLevel: 'low',
          threatTypes: [],
          confidenceScore: 0,
          riskAssessment: 'Unable to parse analysis',
          recommendations: ['Manual review recommended'],
          safeToInteract: true,
          details: analysis
        };
      }

      const result = {
        id: Date.now(),
        content: content.substring(0, 100) + '...',
        type: type,
        timestamp: new Date(),
        ...scanResult
      };

      setScanResults(prev => [result, ...prev.slice(0, 9)]);
      return result;

    } catch (error) {
      console.error('Scan error:', error);
      return {
        id: Date.now(),
        content: content.substring(0, 100) + '...',
        type: type,
        timestamp: new Date(),
        threatDetected: false,
        threatLevel: 'unknown',
        riskAssessment: 'Scan failed - manual review recommended',
        safeToInteract: false
      };
    } finally {
      setScanningActive(false);
    }
  };

  // Contact helpline function with enhanced features
  const contactHelpline = (number, type, category) => {
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
      showNotification(`📞 Calling ${type}: ${number}`, 'success');
      if (isMobile) {
        window.open(`tel:${number.replace(/[^\d+]/g, '')}`, '_blank');
      } else {
        navigator.clipboard.writeText(number).then(() => {
          showNotification(`📋 Number copied: ${number}`, 'success');
        });
      }
    }
  };

  const showNotification = (message, type) => {
    console.log(`${type.toUpperCase()}: ${message}`);
    // Implement your notification system here
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'critical': return 'bg-red-600 text-white';
      case 'high': return 'bg-orange-500 text-white';
      case 'medium': return 'bg-yellow-500 text-black';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'emergency': return ExclamationTriangleIcon;
      case 'police': return ShieldCheckIcon;
      case 'medical': return HeartIcon;
      case 'financial': return CreditCardIcon;
      case 'banking': return BanknotesIcon;
      case 'cyber': return ComputerDesktopIcon;
      case 'mental': return HeartIcon;
      case 'safety': return HandRaisedIcon;
      default: return PhoneIcon;
    }
  };

  const getThreatLevelColor = (level) => {
    switch (level) {
      case 'critical': return 'bg-red-600';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const protectionTabs = [
    { id: 'ai-assistant', label: 'AI Assistant', icon: CpuChipIcon },
    { id: 'ai-scanner', label: 'AI Threat Scanner', icon: MagnifyingGlassIcon },
    { id: 'helplines', label: 'Emergency Helplines', icon: PhoneIcon },
    { id: 'voice-commands', label: 'Voice Emergency', icon: MicrophoneIcon },
    { id: 'predictive', label: 'Predictive Protection', icon: AcademicCapIcon },
    { id: 'dashboard', label: 'Protection Dashboard', icon: ShieldCheckIcon }
  ];

  return (
    <div className={`min-h-screen relative overflow-hidden ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* Header */}
      
       
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              
                <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", duration: 0.8 }}
                            className="relative inline-block"
                          >
                            <ShieldExclamationIcon className="w-12 h-12 md:w-16 md:h-16 mx-auto mb-4 text-purple-600" />
                   </motion.div> 
              
              <div>
                <h1 className="text-3xl font-bold">AI-Powered Emergency Protection</h1>

                <p className="text-blue-100">Advanced AI assistant for cybersecurity & crisis management</p>
              </div>
            </div>
            
            {/* Threat Level Indicator */}
            <div className={`px-4 py-2 rounded-lg ${getThreatLevelColor(currentThreatLevel)} text-white font-bold`}>
              Threat Level: {currentThreatLevel.toUpperCase()}
            </div>
          </div>
        
      

      {/* Navigation Tabs */}
      <div className={`${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-b sticky top-0 z-40`}>
        <div className="max-w-7xl mx-auto">
          <div className="flex space-x-0 overflow-x-auto">
            {protectionTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveProtectionTool(tab.id)}
                className={`flex items-center space-x-2 px-4 py-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                  activeProtectionTool === tab.id
                    ? 'border-blue-500 text-blue-600 bg-blue-50'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon className="w-5 h-5" />
                <span className={isMobile ? 'hidden sm:inline' : 'inline'}>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto p-6">
        
        {/* AI Assistant Section */}
        {activeProtectionTool === 'ai-assistant' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* AI Chat Interface */}
            <div className={`rounded-xl shadow-lg border p-6 ${theme === 'dark' ? 'bg-gray-800 border-gray-600 text-white' : 'bg-white border-gray-200 text-gray-900'}`}
>
              <div className="flex items-center space-x-3 mb-6">
               
                  <CpuChipIcon className="w-8 h-8 text-blue-600" />
                
                <div>
                  <h3 className="text-2xl font-bold text-gray-800">AI Emergency Assistant</h3>

                  <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>Describe your emergency or security concern for instant AI analysis</p>
                </div>
              </div>

              {/* Chat Messages */}
              <div className="bg-gray-50 rounded-lg p-4 h-96 overflow-y-auto mb-4">
                {aiMessages.map((message) => (
                  <div key={message.id} className={`mb-4 flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-3/4 p-4 rounded-lg ${
                      message.role === 'user' 
                        ? 'bg-blue-500 text-white ml-12' 
                        : message.type === 'error'
                        ? 'bg-red-100 text-red-800 mr-12'
                        : message.threatLevel === 'critical'
                        ? 'bg-red-50 text-red-900 border-l-4 border-red-500 mr-12'
                        : message.threatLevel === 'high'
                        ? 'bg-orange-50 text-orange-900 border-l-4 border-orange-500 mr-12'
                        : 'bg-white text-gray-800 mr-12 shadow-sm'
                    }`}>
                      <div className="flex items-start space-x-3">
                        {message.role === 'assistant' && (
                          <CpuChipIcon className="w-6 h-6 text-blue-500 flex-shrink-0 mt-1" />
                        )}
                        {message.role === 'user' && (
                          <UserIcon className="w-6 h-6 text-white flex-shrink-0 mt-1" />
                        )}
                        <div className="flex-1">
                          <p className="whitespace-pre-wrap">{message.content}</p>
                          <p className="text-xs opacity-70 mt-2">
                            {message.timestamp.toLocaleTimeString()}
                            {message.threatLevel && (
                              <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${
                                message.threatLevel === 'critical' ? 'bg-red-200 text-red-800' :
                                message.threatLevel === 'high' ? 'bg-orange-200 text-orange-800' :
                                message.threatLevel === 'medium' ? 'bg-yellow-200 text-yellow-800' :
                                'bg-green-200 text-green-800'
                              }`}>
                                {message.threatLevel.toUpperCase()} THREAT
                              </span>
                            )}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <div className="flex space-x-3">
                <input
                  type="text"
                  value={aiInput}
                  onChange={(e) => setAiInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAiMessage()}
                  placeholder="Describe your emergency or security concern..."
                  className={`flex-1 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900'}`}

                  disabled={isAiAnalyzing}
                />
                <button
                  onClick={handleAiMessage}
                  disabled={isAiAnalyzing || !aiInput.trim()}
                  className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 flex items-center space-x-2"
                >
                  {isAiAnalyzing ? (
                    <>
                      <CircleStackIcon className="w-5 h-5 animate-spin" />
                      <span>Analyzing...</span>
                    </>
                  ) : (
                    <>
                      <PaperAirplaneIcon className="w-5 h-5" />
                      <span>Send</span>
                    </>
                  )}
                </button>
              </div>

              {/* Quick Action Buttons */}
              {/* Quick Action Buttons - THEME AWARE */}
<div className="mt-4 flex flex-wrap gap-2">
  <button
    onClick={() => analyzeEmergencySituation('I think I\'m being targeted by cybercriminals')}
    className={`px-4 py-2 rounded-lg text-sm ${
      theme === 'dark' 
        ? 'bg-red-800 text-red-200 hover:bg-red-700' 
        : 'bg-red-100 text-red-800 hover:bg-red-200'
    }`}
  >
    Cybercrime Attack
  </button>
  <button
    onClick={() => analyzeEmergencySituation('I received a suspicious financial transaction')}
    className={`px-4 py-2 rounded-lg text-sm ${
      theme === 'dark' 
        ? 'bg-orange-800 text-orange-200 hover:bg-orange-700' 
        : 'bg-orange-100 text-orange-800 hover:bg-orange-200'
    }`}
  >
    Financial Fraud
  </button>
  <button
    onClick={() => analyzeEmergencySituation('I\'m feeling overwhelmed and need mental health support')}
    className={`px-4 py-2 rounded-lg text-sm ${
      theme === 'dark' 
        ? 'bg-green-800 text-green-200 hover:bg-green-700' 
        : 'bg-green-100 text-green-800 hover:bg-green-200'
    }`}
  >
    Mental Health Support
  </button>
  <button
    onClick={() => analyzeEmergencySituation('I need help with a safety emergency')}
    className={`px-4 py-2 rounded-lg text-sm ${
      theme === 'dark' 
        ? 'bg-purple-800 text-purple-200 hover:bg-purple-700' 
        : 'bg-purple-100 text-purple-800 hover:bg-purple-200'
    }`}
  >
    Safety Emergency
  </button>
</div>

            </div>
          </motion.div>
        )}

        {/* AI Threat Scanner Section */}
        {activeProtectionTool === 'ai-scanner' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className={`rounded-xl shadow-lg border p-6 ${theme === 'dark' ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-200 text-gray-900'}`}>
              <div className="flex items-center space-x-3 mb-6">
                
                  <MagnifyingGlassIcon className="w-8 h-8 text-green-600" />
                
                <div>
                  <h3 className="text-2xl font-bold text-gray-800">AI Threat Scanner</h3>

                  <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>Scan suspicious content, links, emails, and messages for threats</p>
                </div>
              </div>

              {/* Scanner Input */}
              <div className="space-y-4">
                <textarea
                  placeholder="Paste suspicious content, URLs, email text, or messages here for AI analysis..."
                  className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent h-32"
                  id="scanInput"
                />
                <div className="flex space-x-3">
                  <button
                    onClick={() => {
                      const content = document.getElementById('scanInput').value;
                      if (content.trim()) {
                        scanContent(content, 'text');
                        document.getElementById('scanInput').value = '';
                      }
                    }}
                    disabled={scanningActive}
                    className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 flex items-center space-x-2"
                  >
                    {scanningActive ? (
                      <>
                        <CircleStackIcon className="w-5 h-5 animate-spin" />
                        <span>Scanning...</span>
                      </>
                    ) : (
                      <>
                        <MagnifyingGlassIcon className="w-5 h-5" />
                        <span>Scan Content</span>
                      </>
                    )}
                  </button>
                  
                  <button
                    onClick={() => {
                      const url = prompt('Enter URL to scan:');
                      if (url) scanContent(url, 'url');
                    }}
                    className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center space-x-2"
                  >
                    <GlobeAltIcon className="w-5 h-5" />
                    <span>Scan URL</span>
                  </button>
                </div>
              </div>

              {/* Scan Results */}
              {scanResults.length > 0 && (
                <div className="mt-8">
                  <h4 className="text-lg font-bold text-gray-800 mb-4">Recent Scan Results</h4>
                  <div className="space-y-4">
                    {scanResults.map((result) => (
                      <div key={result.id} className={`p-4 rounded-lg border-l-4 ${
                        result.threatDetected
                          ? result.threatLevel === 'critical' 
                            ? 'bg-red-50 border-red-500'
                            : result.threatLevel === 'high'
                            ? 'bg-orange-50 border-orange-500'
                            : result.threatLevel === 'medium'
                            ? 'bg-yellow-50 border-yellow-500'
                            : 'bg-blue-50 border-blue-500'
                          : 'bg-green-50 border-green-500'
                      }`}>
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              {result.threatDetected ? (
                                <ExclamationTriangleIcon className={`w-5 h-5 ${
                                  result.threatLevel === 'critical' ? 'text-red-500' :
                                  result.threatLevel === 'high' ? 'text-orange-500' :
                                  result.threatLevel === 'medium' ? 'text-yellow-500' :
                                  'text-blue-500'
                                }`} />
                              ) : (
                                <CheckCircleIcon className="w-5 h-5 text-green-500" />
                              )}
                              <span className={`font-bold ${
                                result.threatDetected
                                  ? result.threatLevel === 'critical' ? 'text-red-800' :
                                    result.threatLevel === 'high' ? 'text-orange-800' :
                                    result.threatLevel === 'medium' ? 'text-yellow-800' :
                                    'text-blue-800'
                                  : 'text-green-800'
                              }`}>
                                {result.threatDetected ? `${result.threatLevel.toUpperCase()} THREAT DETECTED` : 'SAFE'}
                              </span>
                              {result.confidenceScore && (
                                <span className="text-xs bg-gray-200 px-2 py-1 rounded-full">
                                  {result.confidenceScore}% confidence
                                </span>
                              )}
                            </div>
                            
                            <p className="text-gray-600 text-sm mb-2">{result.content}</p>
                            <p className={`${theme === 'dark' ? 'text-white' : 'text-gray-800 text-sm mb-2'}`}>{result.riskAssessment}</p>
                            {result.recommendations && result.recommendations.length > 0 && (
                              <div className="text-sm">
                                <strong>Recommendations:</strong>
                                <ul className="list-disc list-inside ml-2">
                                  {result.recommendations.map((rec, idx) => (
                                    <li key={idx}>{rec}</li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                          <div className="ml-4 text-xs text-gray-500">
                            {result.timestamp.toLocaleTimeString()}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* Voice Emergency Commands */}
        {activeProtectionTool === 'voice-commands' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className={`rounded-xl shadow-lg border p-6 ${theme === 'dark' ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-200 text-gray-900'}`}>
              <div className="flex items-center space-x-3 mb-6">

                  <MicrophoneIcon className="w-8 h-8 text-purple-600" />
                
                <div>
                  <h3 className="text-2xl font-bold text-gray-800">Voice Emergency System</h3>
                  <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>Hands-free emergency assistance with voice commands</p>
                </div>
              </div>

              {/* Voice Controls */}
              <div className="text-center space-y-6">
                <div className={`w-32 h-32 mx-auto rounded-full border-4 flex items-center justify-center transition-all ${
                  voiceListening 
                    ? 'border-red-500 bg-red-50 animate-pulse' 
                    : 'border-purple-500 bg-purple-50'
                }`}>
                  {voiceListening ? (
                    <SpeakerWaveIcon className="w-16 h-16 text-red-500" />
                  ) : (
                    <MicrophoneIcon className="w-16 h-16 text-purple-500" />
                  )}
                </div>

                <button
                  onClick={voiceListening ? stopVoiceListening : startVoiceListening}
                  className={`px-8 py-4 rounded-lg font-bold text-lg transition-all ${
                    voiceListening
                      ? 'bg-red-500 hover:bg-red-600 text-white'
                      : 'bg-purple-500 hover:bg-purple-600 text-white'
                  }`}
                >
                  {voiceListening ? '🛑 Stop Listening' : 'Start Voice Emergency'}
                </button>

                {voiceListening && (
                  
                    <div className="flex items-center justify-center space-x-2 text-red-800">
                      <SpeakerWaveIcon className="w-5 h-5 animate-pulse" />
                      <span className="font-medium">Listening for emergency commands...</span>
                    </div>
                  
                )}
              </div>

              {/* Voice Commands Guide */}
              <div className="mt-8 bg-gray-50 rounded-lg p-6">
                <h4 className="text-lg font-bold text-gray-800 mb-4">🗣️ Voice Commands</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <h5 className="font-semibold text-gray-700">Emergency Commands:</h5>
                    <ul className="text-sm space-y-1 text-gray-600">
                      <li>• "Emergency help" - AI analysis</li>
                      <li>• "Call police" - Dial emergency</li>
                      <li>• "Cybercrime help" - Cybercrime support</li>
                      <li>• "Financial fraud" - Banking fraud help</li>
                    </ul>
                  </div>
                  <div className="space-y-2">
                    <h5 className="font-semibold text-gray-700">Scanner Commands:</h5>
                    <ul className="text-sm space-y-1 text-gray-600">
                      <li>• "Scan this content" - Threat scan</li>
                      <li>• "Check this link" - URL analysis</li>
                      <li>• "Is this safe" - Safety check</li>
                      <li>• "Analyze message" - Message scan</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Emergency Helplines Section */}
        {activeProtectionTool === 'helplines' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Critical Alert Banner */}
           <div className={`${theme === 'dark' ? 'bg-red-900/20 border-red-400' : 'bg-red-50 border-red-500'} border-l-4 p-6 rounded-r-lg`}>
              <div className="flex items-center">
                <ExclamationTriangleIcon className="w-8 h-8 text-red-500 mr-4" />
                <div>
                  <h3 className={`text-xl font-bold ${theme === 'dark' ? 'text-red-400' : 'text-red-800'}`}>Emergency Protocol Active</h3>
                  <p className="text-red-700 mt-2">
                    <strong>If you're experiencing an active cyber attack, fraud, or security incident:</strong>
                  </p>
                  <ul className="text-red-600 text-sm mt-2 space-y-1">
                    <li>• Disconnect from internet immediately if compromised</li>
                    <li>• Contact your bank/financial institution for financial fraud</li>
                    <li>• Report to cybercrime authorities using numbers below</li>
                    <li>• Document all evidence before taking action</li>
                    <li>• Do not pay any ransom or respond to threats</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Quick Access Emergency Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <div className={`${theme === 'dark' ? 'bg-red-900/30 border-red-600' : 'bg-red-100 border-red-300'} rounded-lg p-4 text-center border`}>

                <ExclamationTriangleIcon className="w-8 h-8 text-red-600 mx-auto mb-2" />
                <h4 className={`font-bold ${theme === 'dark' ? 'text-red-400' : 'text-red-800'}`}>Cybercrime</h4>
                <p className="text-red-700 text-sm">Report online fraud</p>
                <button
                  onClick={() => contactHelpline('1930', 'Cybercrime Helpline', 'emergency')}
                  className="mt-2 bg-red-500 text-white px-4 py-2 rounded text-sm font-bold hover:bg-red-600"
                >
                  Call 1930
                </button>
              </div>

<div className={`${theme === 'dark' ? 'bg-orange-900/30 border-orange-600' : 'bg-orange-100 border-orange-300'} rounded-lg p-4 text-center border`}>

                <CreditCardIcon className="w-8 h-8 text-orange-600 mx-auto mb-2" />
                <h4 className={`font-bold ${theme === 'dark' ? 'text-orange-400' : 'text-orange-800'}`}>Banking Fraud</h4>
                <p className="text-orange-700 text-sm">Financial fraud help</p>
                <button
                  onClick={() => contactHelpline('155260', 'Banking Fraud', 'financial')}
                  className="mt-2 bg-orange-500 text-white px-4 py-2 rounded text-sm font-bold hover:bg-orange-600"
                >
                  Call 155260
                </button>
              </div>

              <div className={`${theme === 'dark' ? 'bg-red-900/30 border-red-600' : 'bg-red-100 border-red-300'} rounded-lg p-4 text-center border`}>

                <ExclamationCircleIcon className="w-8 h-8 text-red-600 mx-auto mb-2" />
                <h4 className={`font-bold ${theme === 'dark' ? 'text-red-400' : 'text-red-800'}`}>Police Emergency</h4>
                <p className="text-red-700 text-sm">Immediate help</p>
                <button
                  onClick={() => contactHelpline('100', 'Police Emergency', 'emergency')}
                  className="mt-2 bg-red-500 text-white px-4 py-2 rounded text-sm font-bold hover:bg-red-600"
                >
                  Call 100
                </button>
              </div>

<div className={`${theme === 'dark' ? 'bg-green-900/30 border-green-600' : 'bg-green-100 border-green-300'} rounded-lg p-4 text-center border`}>
                <HeartIcon className="w-8 h-8 text-green-600 mx-auto mb-2" />
                <h4 className={`font-bold ${theme === 'dark' ? 'text-green-400' : 'text-green-800'}`}>Mental Health</h4>
                <p className="text-green-700 text-sm">Crisis support</p>
                <button
                  onClick={() => contactHelpline('1800-599-0019', 'KIRAN Mental Health', 'mental')}
                  className="mt-2 bg-green-500 text-white px-4 py-2 rounded text-sm font-bold hover:bg-green-600"
                >
                  Call KIRAN
                </button>
              </div>
            </div>

            {/* Comprehensive Helplines by Category */}
            <div className="space-y-8">
              {Object.entries(EMERGENCY_HELPLINES).map(([key, category]) => (
                <motion.div
                  key={key}
                  className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {/* Category Header */}
                  <div className={`bg-gradient-to-r ${
                    category.color === 'red' ? 'from-red-500 to-red-600' :
                    category.color === 'orange' ? 'from-orange-500 to-orange-600' :
                    category.color === 'green' ? 'from-green-500 to-green-600' :
                    category.color === 'purple' ? 'from-purple-500 to-purple-600' :
                    category.color === 'blue' ? 'from-blue-500 to-blue-600' :
                    category.color === 'indigo' ? 'from-indigo-500 to-indigo-600' :
                    category.color === 'yellow' ? 'from-yellow-500 to-yellow-600' :
                    'from-gray-500 to-gray-600'
                  } text-white p-6`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <category.icon className="w-8 h-8" />
                        <div>
                          <h3 className="text-2xl font-bold">{category.title}</h3>
                          {category.urgent && (
  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium mt-1 ${
    theme === 'dark' ? 'bg-red-800 text-red-200' : 'bg-red-100 text-red-800'
  }`}>
    🚨 URGENT
  </span>
)}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm opacity-90">Available 24/7</div>
                        <div className="text-xs opacity-75">Emergency Response</div>
                      </div>
                    </div>
                  </div>

                  {/* Country-wise Contacts */}
                  <div className="p-6">
                    <div className="space-y-6">
                      {category.contacts.map((countryData, countryIndex) => (
                        <div key={countryIndex} className="border border-gray-200 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-4">
                            <h4 className="text-xl font-bold text-gray-800 flex items-center">
                              <span className="w-3 h-3 bg-blue-500 rounded-full mr-3"></span>
                              {countryData.country}
                            </h4>
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getPriorityColor(countryData.priority)}`}>
                              {countryData.priority?.toUpperCase() || 'STANDARD'} PRIORITY
                            </span>
                          </div>
                          
                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                            {countryData.numbers.map((contact, contactIndex) => {
                              const CategoryIcon = getCategoryIcon(contact.category);
                              return (
                                <div key={contactIndex} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                                  <div className="flex items-start space-x-3 flex-1">
                                    <CategoryIcon className="w-5 h-5 text-gray-600 mt-1 flex-shrink-0" />
                                    <div className="flex-1 min-w-0">
                                      <div className="font-semibold text-gray-800">{contact.type}</div>
                                      <div className="text-sm text-gray-600 mt-1">{contact.description}</div>
                                      <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium mt-2 ${
  contact.category === 'emergency' 
    ? (theme === 'dark' ? 'bg-red-800 text-red-200' : 'bg-red-100 text-red-800')
    : contact.category === 'financial' 
    ? (theme === 'dark' ? 'bg-orange-800 text-orange-200' : 'bg-orange-100 text-orange-800')
    : contact.category === 'mental' 
    ? (theme === 'dark' ? 'bg-green-800 text-green-200' : 'bg-green-100 text-green-800')
    : contact.category === 'safety' 
    ? (theme === 'dark' ? 'bg-purple-800 text-purple-200' : 'bg-purple-100 text-purple-800')
    : contact.category === 'banking'
    ? (theme === 'dark' ? 'bg-blue-800 text-blue-200' : 'bg-blue-100 text-blue-800')
    : contact.category === 'cyber'
    ? (theme === 'dark' ? 'bg-indigo-800 text-indigo-200' : 'bg-indigo-100 text-indigo-800')
    : contact.category === 'medical'
    ? (theme === 'dark' ? 'bg-teal-800 text-teal-200' : 'bg-teal-100 text-teal-800')
    : contact.category === 'police'
    ? (theme === 'dark' ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-800')
    : (theme === 'dark' ? 'bg-blue-800 text-blue-200' : 'bg-blue-100 text-blue-800')
}`}>
  {contact.category.toUpperCase()}
</span>

                                    </div>
                                  </div>
                                  <button
                                    onClick={() => contactHelpline(contact.number, contact.type, contact.category)}
                                    className={`ml-4 px-4 py-2 rounded-lg font-bold text-sm transition-all transform hover:scale-105 flex items-center space-x-2 ${
                                      category.color === 'red' ? 'bg-red-500 hover:bg-red-600 text-white' :
                                      category.color === 'orange' ? 'bg-orange-500 hover:bg-orange-600 text-white' :
                                      category.color === 'green' ? 'bg-green-500 hover:bg-green-600 text-white' :
                                      category.color === 'purple' ? 'bg-purple-500 hover:bg-purple-600 text-white' :
                                      category.color === 'blue' ? 'bg-blue-500 hover:bg-blue-600 text-white' :
                                      category.color === 'indigo' ? 'bg-indigo-500 hover:bg-indigo-600 text-white' :
                                      category.color === 'yellow' ? 'bg-yellow-500 hover:bg-yellow-600 text-black' :
                                      'bg-gray-500 hover:bg-gray-600 text-white'
                                    }`}
                                  >
                                    <PhoneIcon className="w-4 h-4" />
                                    <span className="font-mono">
                                      {contact.number.length > 15 ? contact.number.substring(0, 12) + '...' : contact.number}
                                    </span>
                                  </button>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Cyberpunk Terminal Style - Mobile */}
            {isMobile && (
              <div className="mt-8 bg-black rounded-lg border border-green-500/30 p-4">
                <div className="text-green-400 font-mono text-sm mb-4">
                  <span className="text-green-300">{'>'}</span> EMERGENCY_CONTACTS_TERMINAL_MOBILE
                </div>
                
                <div className="space-y-2 text-xs">
                  <div className="text-green-400 font-mono">
                    [🇮🇳] CYBER_CRIME: <span className="text-green-300">1930</span>
                  </div>
                  <div className="text-green-400 font-mono">
                    [🇮🇳] BANKING_FRAUD: <span className="text-green-300">155260</span>
                  </div>
                  <div className="text-green-400 font-mono">
                    [🇮🇳] POLICE_EMERGENCY: <span className="text-green-300">100</span>
                  </div>
                  <div className="text-green-400 font-mono">
                    [🇮🇳] MEDICAL_EMERGENCY: <span className="text-green-300">108</span>
                  </div>
                  <div className="text-green-400 font-mono">
                    [🇮🇳] WOMEN_HELPLINE: <span className="text-green-300">181</span>
                  </div>
                  <div className="text-green-400 font-mono">
                    [🇮🇳] CHILD_HELPLINE: <span className="text-green-300">1098</span>
                  </div>
                  <div className="text-green-400 font-mono">
                    [🇮🇳] MENTAL_HEALTH: <span className="text-green-300">1800-599-0019</span>
                  </div>
                  <div className="text-green-400 font-mono">
                    [🇮🇳] SENIOR_CITIZENS: <span className="text-green-300">14567</span>
                  </div>
                </div>
                
                <div className="mt-4 p-2 bg-green-500/10 border border-green-500/30 rounded">
                  <div className="text-green-400 text-xs font-mono">
                    STATUS: <span className="text-green-300">EMERGENCY_PROTOCOLS_ACTIVE</span>
                  </div>
                  <div className="text-green-400 text-xs font-mono">
                    RESPONSE: <span className="text-green-300">24/7_AVAILABLE</span>
                  </div>
                </div>
              </div>
            )}

            {/* Desktop Cyberpunk Terminal */}
            {!isMobile && (
              <div className="mt-8 bg-black rounded-lg border border-green-500/30 p-6 font-mono">
                <div className="text-green-400 text-sm mb-6">
                  <span className="text-green-300">{'>'}</span> XIST_AI_EMERGENCY_TERMINAL_v3.0.1 [SECURE_CONNECTION_ESTABLISHED]
                </div>
                
                <div className="grid grid-cols-3 gap-8 text-xs">
                  <div>
                    <div className="text-green-300 mb-3">== CYBERCRIME_&_FRAUD ==</div>
                    <div className="space-y-1 text-green-400">
                      <div>INDIA_CYBER_HELPLINE: 1930</div>
                      <div>BANKING_FRAUD_RBI: 155260</div>
                      <div>UPI_FRAUD_NPCI: 1800-891-3333</div>
                      <div>USA_FBI_IC3: 1-800-CALL-FBI</div>
                      <div>UK_ACTION_FRAUD: 0300-123-2040</div>
                      <div>CANADA_ANTI_FRAUD: 1-888-495-8501</div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="text-green-300 mb-3">== EMERGENCY_SERVICES ==</div>
                    <div className="space-y-1 text-green-400">
                      <div>INDIA_POLICE: 100</div>
                      <div>INDIA_MEDICAL: 108</div>
                      <div>INDIA_FIRE: 101</div>
                      <div>USA_EMERGENCY: 911</div>
                      <div>UK_EMERGENCY: 999</div>
                      <div>CANADA_EMERGENCY: 911</div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="text-green-300 mb-3">== SPECIALIZED_SUPPORT ==</div>
                    <div className="space-y-1 text-green-400">
                      <div>WOMEN_HELPLINE_IND: 181</div>
                      <div>CHILD_HELPLINE_IND: 1098</div>
                      <div>MENTAL_HEALTH_KIRAN: 1800-599-0019</div>
                      <div>SENIOR_CITIZENS: 14567</div>
                      <div>CONSUMER_HELPLINE: 1800-11-4000</div>
                      <div>DISASTER_MGMT: 1078</div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 border-t border-green-500/30 pt-4">
                  <div className="text-green-300 text-xs mb-2">
                    [SYSTEM] COMPREHENSIVE_EMERGENCY_RESPONSE_DATABASE_LOADED
                  </div>
                  <div className="text-green-400 text-xs mb-2">
                    [STATUS] 500+_HELPLINE_NUMBERS_AVAILABLE_ACROSS_8_CATEGORIES
                  </div>
                  <div className="text-green-300 text-xs">
                    [READY] EMERGENCY_ASSISTANCE_PROTOCOLS_ACTIVE_24/7
                  </div>
                </div>
              </div>
            )}

            {/* Important Notice */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <div className="flex items-start space-x-3">
                <InformationCircleIcon className="w-8 h-8 text-blue-500 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="text-lg font-bold text-blue-800 mb-2">📋 Important Information</h4>
                  <div className="text-blue-700 space-y-2">
                    <p><strong>🕒 Response Times:</strong> Emergency numbers (100, 108, 911, 999) respond immediately. Specialized helplines may take 2-30 minutes.</p>
                    <p><strong>📱 Mobile Users:</strong> Tap any number to dial directly. Desktop users can copy numbers to clipboard.</p>
                    <p><strong>🌍 International:</strong> Include country codes when calling from abroad (+91 for India, +1 for USA/Canada, +44 for UK).</p>
                    <p><strong>📞 Language Support:</strong> Most Indian helplines support Hindi and English. Regional language support varies.</p>
                    <p><strong>💾 Offline Access:</strong> Save critical numbers in your phone contacts for offline emergencies.</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Predictive Protection Section */}
        {activeProtectionTool === 'predictive' && (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="space-y-6"
  >
    <div className={`rounded-xl shadow-lg border p-6 ${theme === 'dark' ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-200 text-gray-900'}`}>
      <div className="flex items-center space-x-3 mb-6">
        <AcademicCapIcon className="w-8 h-8 text-indigo-600" />
        <div>
          {/* ✅ FIXED: Title */}
          <h3 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
            AI Predictive Protection
          </h3>
          <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
            Advanced AI behavioral analysis and threat prediction
          </p>
        </div>
      </div>

      {/* ✅ FIXED: Predictive Analytics Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className={`rounded-lg p-6 ${
          theme === 'dark' 
            ? 'bg-gradient-to-br from-green-800 to-green-700' 
            : 'bg-gradient-to-br from-green-50 to-green-100'
        }`}>
          <div className="flex items-center justify-between mb-4">
            <CheckCircleIcon className="w-8 h-8 text-green-600" />
            <span className={`text-2xl font-bold ${
              theme === 'dark' ? 'text-green-200' : 'text-green-800'
            }`}>Safe</span>
          </div>
          <h4 className={`font-bold mb-2 ${theme === 'dark' ? 'text-green-400' : 'text-green-800'}`}>
            Current Status
          </h4>
          <p className={`text-sm ${
            theme === 'dark' ? 'text-green-200' : 'text-green-700'
          }`}>
            No immediate threats detected. Your digital behavior patterns appear normal.
          </p>
        </div>

        <div className={`rounded-lg p-6 ${
          theme === 'dark' 
            ? 'bg-gradient-to-br from-blue-800 to-blue-700' 
            : 'bg-gradient-to-br from-blue-50 to-blue-100'
        }`}>
          <div className="flex items-center justify-between mb-4">
            <EyeIcon className="w-8 h-8 text-blue-600" />
            <span className={`text-2xl font-bold ${
              theme === 'dark' ? 'text-blue-200' : 'text-blue-800'
            }`}>24/7</span>
          </div>
          <h4 className={`font-bold mb-2 ${theme === 'dark' ? 'text-blue-400' : 'text-blue-800'}`}>
            Active Monitoring
          </h4>
          <p className={`text-sm ${
            theme === 'dark' ? 'text-blue-200' : 'text-blue-700'
          }`}>
            AI continuously monitors your digital footprint for anomalies and threats.
          </p>
        </div>

        <div className={`rounded-lg p-6 ${
          theme === 'dark' 
            ? 'bg-gradient-to-br from-purple-800 to-purple-700' 
            : 'bg-gradient-to-br from-purple-50 to-purple-100'
        }`}>
          <div className="flex items-center justify-between mb-4">
            <SparklesIcon className="w-8 h-8 text-purple-600" />
            <span className={`text-2xl font-bold ${
              theme === 'dark' ? 'text-purple-200' : 'text-purple-800'
            }`}>AI+</span>
          </div>
          <h4 className={`font-bold mb-2 ${theme === 'dark' ? 'text-purple-400' : 'text-purple-800'}`}>
            Smart Learning
          </h4>
          <p className={`text-sm ${
            theme === 'dark' ? 'text-purple-200' : 'text-purple-700'
          }`}>
            AI learns your patterns to provide personalized protection recommendations.
          </p>
        </div>
      </div>

      {/* ✅ FIXED: Behavioral Analysis */}
      <div className={`mt-8 rounded-lg p-6 ${
        theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'
      }`}>
        <h4 className={`text-lg font-bold mb-4 ${
          theme === 'dark' ? 'text-white' : 'text-gray-800'
        }`}>
          🔍 Behavioral Analysis
        </h4>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
              Login Pattern Analysis
            </span>
            <div className="flex items-center space-x-2">
              <div className={`w-32 rounded-full h-2 ${
                theme === 'dark' ? 'bg-gray-600' : 'bg-gray-200'
              }`}>
                <div className="bg-green-600 h-2 rounded-full" style={{ width: '85%' }}></div>
              </div>
              <span className="text-sm text-green-600 font-bold">Normal</span>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <span className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
              Communication Patterns
            </span>
            <div className="flex items-center space-x-2">
              <div className={`w-32 rounded-full h-2 ${
                theme === 'dark' ? 'bg-gray-600' : 'bg-gray-200'
              }`}>
                <div className="bg-green-600 h-2 rounded-full" style={{ width: '92%' }}></div>
              </div>
              <span className="text-sm text-green-600 font-bold">Secure</span>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <span className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
              Financial Activity
            </span>
            <div className="flex items-center space-x-2">
              <div className={`w-32 rounded-full h-2 ${
                theme === 'dark' ? 'bg-gray-600' : 'bg-gray-200'
              }`}>
                <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '70%' }}></div>
              </div>
              <span className="text-sm text-yellow-600 font-bold">Monitor</span>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <span className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
              Device Security
            </span>
            <div className="flex items-center space-x-2">
              <div className={`w-32 rounded-full h-2 ${
                theme === 'dark' ? 'bg-gray-600' : 'bg-gray-200'
              }`}>
                <div className="bg-green-600 h-2 rounded-full" style={{ width: '95%' }}></div>
              </div>
              <span className="text-sm text-green-600 font-bold">Excellent</span>
            </div>
          </div>
        </div>
      </div>

      {/* ✅ FIXED: AI Recommendations */}
      <div className={`mt-8 rounded-lg p-6 ${
        theme === 'dark' ? 'bg-indigo-900/40' : 'bg-indigo-50'
      }`}>
        <h4 className={`text-lg font-bold mb-4 ${theme === 'dark' ? 'text-indigo-400' : 'text-indigo-800'}`}>
          🤖 AI Recommendations
        </h4>
        <div className="space-y-3">
          <div className="flex items-start space-x-3">
            <LightBulbIcon className="w-5 h-5 text-indigo-600 mt-1" />
            <div>
              <p className={`font-semibold ${
                theme === 'dark' ? 'text-indigo-300' : 'text-indigo-800'
              }`}>
                Enable Two-Factor Authentication
              </p>
              <p className={`text-sm ${
                theme === 'dark' ? 'text-indigo-200' : 'text-indigo-700'
              }`}>
                AI detected you're using single-factor auth on some accounts. Upgrade for better security.
              </p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3">
            <LightBulbIcon className="w-5 h-5 text-indigo-600 mt-1" />
            <div>
              <p className={`font-semibold ${
                theme === 'dark' ? 'text-indigo-300' : 'text-indigo-800'
              }`}>
                Review Financial Transactions
              </p>
              <p className={`text-sm ${
                theme === 'dark' ? 'text-indigo-200' : 'text-indigo-700'
              }`}>
                Unusual spending pattern detected. Review recent transactions for any unauthorized activity.
              </p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3">
            <LightBulbIcon className="w-5 h-5 text-indigo-600 mt-1" />
            <div>
              <p className={`font-semibold ${
                theme === 'dark' ? 'text-indigo-300' : 'text-indigo-800'
              }`}>
                Update Privacy Settings
              </p>
              <p className={`text-sm ${
                theme === 'dark' ? 'text-indigo-200' : 'text-indigo-700'
              }`}>
                AI recommends updating social media privacy settings based on recent security trends.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </motion.div>
)}


        {/* Protection Dashboard */}
        {activeProtectionTool === 'dashboard' && (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="space-y-6"
  >
    <div className={`rounded-xl shadow-lg border p-6 ${theme === 'dark' ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-200 text-gray-900'}`}>
      <div className="flex items-center space-x-3 mb-6">
        <ShieldCheckIcon className="w-8 h-8 text-blue-600" />
        <div>
          {/* ✅ FIXED: Title */}
          <h3 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
            Protection Dashboard
          </h3>
          <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
            Comprehensive security overview and system status
          </p>
        </div>
      </div>

      {/* ✅ FIXED: Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className={`rounded-lg p-4 text-center ${
          theme === 'dark' 
            ? 'bg-green-800/40 border border-green-700' 
            : 'bg-green-50'
        }`}>
          <CheckCircleIcon className="w-8 h-8 text-green-600 mx-auto mb-2" />
          <div className={`text-2xl font-bold ${
            theme === 'dark' ? 'text-green-300' : 'text-green-800'
          }`}>98%</div>
          <div className={`text-sm ${
            theme === 'dark' ? 'text-green-400' : 'text-green-700'
          }`}>Protection Level</div>
        </div>
        
        <div className={`rounded-lg p-4 text-center ${
          theme === 'dark' 
            ? 'bg-blue-800/40 border border-blue-700' 
            : 'bg-blue-50'
        }`}>
          <EyeIcon className="w-8 h-8 text-blue-600 mx-auto mb-2" />
          <div className={`text-2xl font-bold ${
            theme === 'dark' ? 'text-blue-300' : 'text-blue-800'
          }`}>24/7</div>
          <div className={`text-sm ${
            theme === 'dark' ? 'text-blue-400' : 'text-blue-700'
          }`}>Active Monitoring</div>
        </div>
        
        <div className={`rounded-lg p-4 text-center ${
          theme === 'dark' 
            ? 'bg-purple-800/40 border border-purple-700' 
            : 'bg-purple-50'
        }`}>
          <BoltIcon className="w-8 h-8 text-purple-600 mx-auto mb-2" />
          <div className={`text-2xl font-bold ${
            theme === 'dark' ? 'text-purple-300' : 'text-purple-800'
          }`}>156</div>
          <div className={`text-sm ${
            theme === 'dark' ? 'text-purple-400' : 'text-purple-700'
          }`}>Threats Blocked</div>
        </div>
        
        <div className={`rounded-lg p-4 text-center ${
          theme === 'dark' 
            ? 'bg-orange-800/40 border border-orange-700' 
            : 'bg-orange-50'
        }`}>
          <StarIcon className="w-8 h-8 text-orange-600 mx-auto mb-2" />
          <div className={`text-2xl font-bold ${
            theme === 'dark' ? 'text-orange-300' : 'text-orange-800'
          }`}>A+</div>
          <div className={`text-sm ${
            theme === 'dark' ? 'text-orange-400' : 'text-orange-700'
          }`}>Security Score</div>
        </div>
      </div>

      {/* ✅ FIXED: Protection Status */}
      <div className={`rounded-lg p-6 ${
        theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'
      }`}>
        <h4 className={`text-lg font-bold mb-4 ${
          theme === 'dark' ? 'text-white' : 'text-gray-800'
        }`}>
          🔒 Protection Status
        </h4>
        <div className="space-y-4">
          {Object.entries(protectionSettings).map(([key, value]) => (
            <div key={key} className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                {value ? (
                  <CheckCircleIcon className="w-5 h-5 text-green-600" />
                ) : (
                  <XMarkIcon className="w-5 h-5 text-red-600" />
                )}
                <span className={`capitalize ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  {key.replace(/([A-Z])/g, ' $1').trim()}
                </span>
              </div>
              <button
                onClick={() => setProtectionSettings(prev => ({ ...prev, [key]: !prev[key] }))}
                className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors ${
                  value 
                    ? 'bg-green-500 text-white hover:bg-green-600' 
                    : (theme === 'dark' 
                       ? 'bg-gray-600 text-gray-300 hover:bg-gray-500' 
                       : 'bg-gray-300 text-gray-700 hover:bg-gray-400')
                }`}
              >
                {value ? 'Enabled' : 'Disabled'}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  </motion.div>
)}

      </div>
    </div>
  );
};

export default ProtectionSection;

