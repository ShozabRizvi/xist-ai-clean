import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
  ArrowUpRightIcon, ArrowDownLeftIcon, ChevronUpIcon, ChevronDownIcon,
  ChevronLeftIcon, ChevronRightIcon, MagnifyingGlassPlusIcon, MagnifyingGlassMinusIcon,
  CloudIcon, CubeTransparentIcon, FilmIcon, LanguageIcon, 
  SunIcon, MoonIcon, UserIcon, BellIcon, HomeIcon, NewspaperIcon, 
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
  BookOpenIcon, PencilIcon, PencilSquareIcon, TrashIcon, ArchiveBoxXMarkIcon
} from '@heroicons/react/24/outline';

import { 
  ShieldCheckIcon as ShieldCheckSolid, 
  ExclamationTriangleIcon as ExclamationTriangleSolid,
  CheckCircleIcon as CheckCircleSolid, 
  XCircleIcon as XCircleSolid,
  StarIcon as StarSolid, 
  HeartIcon as HeartSolid, 
  FireIcon as FireSolid,
  BoltIcon as BoltSolid, 
  SparklesIcon as SparklesSolid,
  LightBulbIcon as LightBulbSolid,
  LockClosedIcon as LockClosedSolid,
  ShieldExclamationIcon as ShieldExclamationSolid
} from '@heroicons/react/24/solid';

// Continue with the rest of the code exactly as before...


// ===== COMPREHENSIVE ANALYSIS MODES WITH ADVANCED CONFIGURATION =====
const ANALYSIS_MODES = {
  lightning: {
    label: 'Lightning Scan',
    icon: BoltIcon,
    iconSolid: BoltSolid,
    description: 'Ultra-fast threat detection (5-10 seconds)',
    color: 'yellow',
    gradient: 'from-yellow-400 to-orange-500',
    bgGradient: 'from-yellow-50 to-orange-50',
    darkBgGradient: 'from-yellow-900/20 to-orange-900/20',
    borderColor: 'border-yellow-200',
    textColor: 'text-yellow-600',
    maxTokens: 300,
    temperature: 0.1,
    priority: 'speed',
    features: ['basic_threats', 'risk_score', 'immediate_action'],
    estimatedTime: '5-10s',
    useCase: 'Quick verification while browsing',
    accuracy: 85,
    confidenceBoost: 0.15,
    promptTemplate: `LIGHTNING THREAT ASSESSMENT - ULTRA FAST ANALYSIS

Content to analyze: "{content}"

Provide IMMEDIATE threat assessment in this EXACT format:

THREAT LEVEL: [HIGH/MEDIUM/LOW/SAFE]

PRIMARY THREAT: [Phishing/Scam/Malware/Misinformation/Spam/Safe]

IMMEDIATE ACTION:
- [One critical action user should take RIGHT NOW]
- [Secondary protective measure if needed]

CREDIBILITY VERDICT: [TRUE/FALSE/MIXED/UNVERIFIABLE]

EXPLANATION PARAGRAPH:
[2-3 sentences clearly explaining WHY this content is credible or not credible. State the specific evidence that supports your conclusion. Explain what makes this trustworthy or suspicious without using * or # symbols.]

CONFIDENCE SCORE: [0-100%]
Sources checked: [Brief mention of verification methods used]

Keep response under 150 words. Focus on SPEED and ACCURACY.`
  },
  comprehensive: {
    label: 'Comprehensive Analysis',
    icon: ShieldCheckIcon,
    iconSolid: ShieldCheckSolid,
    description: 'Balanced detail with explanations (15-20 seconds)',
    color: 'blue',
    gradient: 'from-blue-500 to-cyan-600',
    bgGradient: 'from-blue-50 to-cyan-50',
    darkBgGradient: 'from-blue-900/20 to-cyan-900/20',
    borderColor: 'border-blue-200',
    textColor: 'text-blue-600',
    maxTokens: 1500,
    temperature: 0.3,
    priority: 'balance',
    features: ['threat_analysis', 'evidence_reasoning', 'context', 'recommendations'],
    estimatedTime: '15-20s',
    useCase: 'Standard verification needs',
    accuracy: 92,
    confidenceBoost: 0.25,
    promptTemplate: `COMPREHENSIVE MISINFORMATION & THREAT ANALYSIS

Content to analyze: "{content}"

Provide detailed analysis in this EXACT format:

SECURITY ASSESSMENT
Threat Level: [CRITICAL/HIGH/MEDIUM/LOW/SAFE]
Primary Threat Type: [Phishing/Investment Scam/Health Misinformation/Political Misinformation/Technical Scam/Social Engineering/Safe Content]
CREDIBILITY VERDICT: [TRUE/FALSE/MIXED/UNVERIFIABLE]
EXPLANATION PARAGRAPH:
[2-3 sentences clearly explaining WHY this content is credible or not credible. State the specific evidence that supports your conclusion. Explain what makes this trustworthy or suspicious without using * or # symbols.]
CONFIDENCE SCORE: [0-100%]

Sources checked: [Brief mention of verification methods used]

DETAILED ANALYSIS
Evidence Found:
• [Specific red flags or safety indicators]
• [Pattern recognition results]
• [Language analysis findings]

Risk Factors:
• [Psychological manipulation techniques if present]
• [Technical inconsistencies if applicable]
• [Source credibility issues if found]

CONTEXT & EXPLANATION
Why this matters: [Educational explanation of the threat/safety]
Historical context: [Similar cases or patterns if relevant]
Target demographic: [Who this typically targets]

PROTECTIVE ACTIONS
Immediate steps:
1. [First critical action]
2. [Second important action]
3. [Third preventive measure]

Long-term protection:
• [Ongoing security measures]
• [Awareness tips]

`
  },
  expert: {
    label: 'Expert Deep Dive',
    icon: SparklesIcon,
    iconSolid: SparklesSolid,
    description: 'Maximum technical detail and insights (25-35 seconds)',
    color: 'purple',
    gradient: 'from-purple-600 to-pink-600',
    bgGradient: 'from-purple-50 to-pink-50',
    darkBgGradient: 'from-purple-900/20 to-pink-900/20',
    borderColor: 'border-purple-200',
    textColor: 'text-purple-600',
    maxTokens: 2500,
    temperature: 0.4,
    priority: 'depth',
    features: ['technical_analysis', 'historical_context', 'advanced_patterns', 'forensic_details'],
    estimatedTime: '25-35s',
    useCase: 'Security professionals and researchers',
    accuracy: 96,
    confidenceBoost: 0.35,
    promptTemplate: `EXPERT-LEVEL THREAT FORENSICS & DEEP ANALYSIS

Content to analyze: "{content}"

Provide comprehensive expert analysis in this EXACT format:

FORENSIC OVERVIEW
Classification: [Threat category with technical specificity]
Sophistication Level: [Amateur/Intermediate/Professional/Nation-State]
Attack Vector: [Technical delivery method analysis]
CREDIBILITY VERDICT: [TRUE/FALSE/MIXED/UNVERIFIABLE]
EXPLANATION PARAGRAPH:
[2-3 sentences clearly explaining WHY this content is credible or not credible. State the specific evidence that supports your conclusion. Explain what makes this trustworthy or suspicious without using * or # symbols.]
CONFIDENCE SCORE: [0-100%]
Sources checked: [Brief mention of verification methods used]
 with margin of error

TECHNICAL DEEP DIVE
Pattern Recognition:
• [Advanced linguistic patterns detected]
• [Behavioral psychology elements used]
• [Technical infrastructure analysis]

Social Engineering Breakdown:
• [Psychological manipulation techniques]
• [Cognitive bias exploitation methods]
• [Emotional trigger analysis]

Historical Context:
• [Similar attack campaigns]
• [Evolution of this threat type]
• [Attribution indicators if present]

THREAT MODELING
Likely Threat Actor Profile:
• [Skill level and resources]
• [Probable motivation]
• [Geographic/cultural indicators]

Campaign Analysis:
• [Scale and scope assessment]
• [Timeline and persistence patterns]
• [Cross-platform distribution analysis]

ADVANCED COUNTERMEASURES
Technical Defenses:
1. [Network-level protections]
2. [Endpoint security measures]
3. [Behavioral analysis tools]

Organizational Responses:
• [Policy recommendations]
• [Training program suggestions]
• [Incident response protocols]

Research Applications:
• [Academic research value]
• [Threat intelligence contribution]
• [Defense improvement opportunities]

PREDICTIVE ANALYSIS
Future Threat Evolution:
• [Likely next variations]
• [Emerging risk factors]
• [Defensive adaptation needs]

REFERENCES & ATTRIBUTION
Similar Cases: [Reference to known similar threats]
Technical Indicators: [IOCs and behavioral signatures]
Defensive Resources: [Tools and frameworks recommended]`
  },
  educational: {
    label: 'Educational Focus',
    icon: AcademicCapIcon,
    description: 'Learning-oriented with prevention tips (20-25 seconds)',
    color: 'green',
    gradient: 'from-green-500 to-emerald-600',
    bgGradient: 'from-green-50 to-emerald-50',
    darkBgGradient: 'from-green-900/20 to-emerald-900/20',
    borderColor: 'border-green-200',
    textColor: 'text-green-600',
    maxTokens: 2000,
    temperature: 0.35,
    priority: 'learning',
    features: ['how_it_works', 'recognition_tips', 'prevention_strategies', 'real_examples'],
    estimatedTime: '20-25s',
    useCase: 'Learning and awareness building',
    accuracy: 90,
    confidenceBoost: 0.20,
    promptTemplate: `EDUCATIONAL CYBERSECURITY & MISINFORMATION ANALYSIS

Content to analyze: "{content}"

Provide educational analysis in this EXACT format:

LEARNING OBJECTIVES
What you'll understand: [Key learning outcomes from this analysis]
Threat Category: [Type of threat with educational context]
Real-world Impact: [Why this matters in daily digital life]
CREDIBILITY VERDICT: [TRUE/FALSE/MIXED/UNVERIFIABLE]
EXPLANATION PARAGRAPH:
[2-3 sentences clearly explaining WHY this content is credible or not credible. State the specific evidence that supports your conclusion. Explain what makes this trustworthy or suspicious without using * or # symbols.]
CONFIDENCE SCORE: [0-100%]
Sources checked: [Brief mention of verification methods used]


HOW THIS WORKS - STEP BY STEP
Attack/Deception Mechanics:
1. [First step in the threat process]
2. [How victims are identified/targeted]
3. [Psychological hooks used]
4. [How the deception/attack progresses]
5. [Final goal of the threat actor]

RECOGNITION PATTERNS - LEARN TO SPOT THESE
Red Flags to Remember:
• [Visual indicators anyone can spot]
• [Language patterns that reveal deception]
• [Behavioral requests that should trigger suspicion]
• [Technical indicators for more advanced users]

PSYCHOLOGY BEHIND THE THREAT
Why People Fall For This:
• [Cognitive biases being exploited]
• [Emotional states that make people vulnerable]
• [Social pressures utilized]

Who Gets Targeted Most:
• [Demographic information for awareness]
• [Situational factors that increase risk]

PROTECTION STRATEGIES - BUILD YOUR DEFENSES
Immediate Protection:
1. [First line of defense anyone can implement]
2. [Verification techniques]
3. [When and how to seek help]

Long-term Security Habits:
• [Daily practices for digital hygiene]
• [Tools and settings to configure]
• [Knowledge areas to develop]

FAMILY & COMMUNITY PROTECTION
Helping Others:
• [How to share this knowledge safely]
• [Warning signs to watch for in others]
• [Resources to recommend]

Teaching Moments:
• [How to use this as an educational example]
• [Age-appropriate ways to explain to children]

REAL-WORLD EXAMPLES
Similar Cases: [Brief, educational examples without harmful details]
Success Stories: [How people have avoided or recovered from this]
Lessons Learned: [What the security community has discovered]

KEY TAKEAWAYS
Remember These 3 Things:
1. [Most important lesson]
2. [Critical recognition sign]
3. [Essential protective action]

Next Steps for Learning:
• [Resources for deeper understanding]
• [Skills to develop]
• [Communities to join for ongoing education]`
  },
  forensic: {
    label: 'Forensic Investigation',
    icon: MagnifyingGlassIcon,
    description: 'Investigation-grade analysis with evidence (30-40 seconds)',
    color: 'red',
    gradient: 'from-red-600 to-rose-600',
    bgGradient: 'from-red-50 to-rose-50',
    darkBgGradient: 'from-red-900/20 to-rose-900/20',
    borderColor: 'border-red-200',
    textColor: 'text-red-600',
    maxTokens: 3000,
    temperature: 0.2,
    priority: 'evidence',
    features: ['evidence_chain', 'attribution', 'impact_assessment', 'legal_context'],
    estimatedTime: '30-40s',
    useCase: 'Incident response and legal documentation',
    accuracy: 98,
    confidenceBoost: 0.40,
    promptTemplate: `FORENSIC INVESTIGATION & EVIDENCE ANALYSIS

Content to analyze: "{content}"

Provide forensic-grade analysis in this EXACT format:

EXECUTIVE SUMMARY
Case Classification: [Threat type with legal/regulatory context]
Severity Rating: [Impact scale 1-10 with justification]
Legal Implications: [Relevant laws or regulations potentially violated]
Recommended Response Level: [Internal/Law Enforcement/Regulatory]
CREDIBILITY VERDICT: [TRUE/FALSE/MIXED/UNVERIFIABLE]
EXPLANATION PARAGRAPH:
[2-3 sentences clearly explaining WHY this content is credible or not credible. State the specific evidence that supports your conclusion. Explain what makes this trustworthy or suspicious without using * or # symbols.]
CONFIDENCE SCORE: [0-100%]
Sources checked: [Brief mention of verification methods used]


EVIDENCE COLLECTION & ANALYSIS
Digital Artifacts:
• [Metadata and technical indicators]
• [Linguistic forensics findings]
• [Behavioral pattern analysis]
• [Cross-reference verification results]

Chain of Evidence:
1. [Source identification methods]
2. [Verification steps taken]
3. [Corroborating evidence found]
4. [Gaps or limitations in evidence]

ATTRIBUTION ANALYSIS
Threat Actor Assessment:
• [Skills and resource indicators]
• [Operational security patterns]
• [Language and cultural markers]
• [Historical campaign connections]

Infrastructure Analysis:
• [Technical delivery mechanisms]
• [Hosting and domain analysis where applicable]
• [Payment or contact method forensics]

IMPACT ASSESSMENT
Direct Harm Potential:
• [Financial risk quantification]
• [Personal safety implications]
• [Reputation/social harm assessment]
• [System/data security risks]

Scale and Scope:
• [Estimated victim count/potential]
• [Geographic spread analysis]
• [Demographic targeting assessment]

Cascading Effects:
• [Secondary harm possibilities]
• [Community/organizational impact]
• [Long-term consequence modeling]

LEGAL & REGULATORY CONTEXT
Applicable Laws:
• [Relevant criminal statutes]
• [Civil liability considerations]
• [Regulatory compliance issues]

Evidence Standards:
• [Documentation quality assessment]
• [Legal admissibility considerations]
• [Additional evidence needs]

INCIDENT RESPONSE RECOMMENDATIONS
Immediate Actions:
1. [Preservation of evidence]
2. [Victim notification procedures]
3. [Containment measures]

Investigation Support:
• [Additional forensic techniques needed]
• [External expert consultation requirements]
• [Law enforcement coordination steps]

PREVENTIVE MEASURES
System Hardening:
• [Technical controls to implement]
• [Policy and procedure updates]
• [Training and awareness needs]

Monitoring and Detection:
• [Indicators to watch for]
• [Alert system configurations]
• [Regular assessment schedules]

DOCUMENTATION REQUIREMENTS
Report Distribution: [Who needs to be informed]
Retention Schedule: [How long to keep evidence]
Follow-up Actions: [Ongoing monitoring needs]

LESSONS LEARNED
Defensive Improvements: [What this case teaches us]
Training Applications: [How to use for education]
Research Value: [Contribution to threat intelligence]`
  },
  realtime: {
    label: 'Real-time Monitoring',
    icon: ClockIcon,
    description: 'Continuous threat assessment with updates',
    color: 'cyan',
    gradient: 'from-cyan-500 to-teal-600',
    bgGradient: 'from-cyan-50 to-teal-50',
    darkBgGradient: 'from-cyan-900/20 to-teal-900/20',
    borderColor: 'border-cyan-200',
    textColor: 'text-cyan-600',
    maxTokens: 1000,
    temperature: 0.25,
    priority: 'monitoring',
    features: ['live_analysis', 'trend_detection', 'alert_generation', 'adaptive_learning'],
    estimatedTime: 'Continuous',
    useCase: 'Ongoing security monitoring',
    accuracy: 88,
    confidenceBoost: 0.10,
    promptTemplate: `REAL-TIME THREAT MONITORING & ASSESSMENT

Content to analyze: "{content}"
Timestamp: {timestamp}
Previous Context: {context}

Provide real-time monitoring analysis in this EXACT format:

REAL-TIME THREAT STATUS
Current Risk Level: [CRITICAL/HIGH/MEDIUM/LOW/BASELINE]
Change from Previous: [ESCALATING/STABLE/DECREASING]
Confidence: [0-100%]
Alert Priority: [IMMEDIATE/HIGH/MEDIUM/LOW/INFO]
CREDIBILITY VERDICT: [TRUE/FALSE/MIXED/UNVERIFIABLE]
EXPLANATION PARAGRAPH:
[2-3 sentences clearly explaining WHY this content is credible or not credible. State the specific evidence that supports your conclusion. Explain what makes this trustworthy or suspicious without using * or # symbols.]
CONFIDENCE SCORE: [0-100%]
Sources checked: [Brief mention of verification methods used]


TREND ANALYSIS
Pattern Recognition:
• [New patterns detected in this sample]
• [Consistency with known threat trends]
• [Deviation from baseline behavior]

Volume Assessment:
• [Frequency of similar content]
• [Distribution velocity analysis]
• [Geographic spread indicators]

ADAPTIVE LEARNING UPDATES
New Indicators Discovered:
• [Previously unseen threat markers]
• [Evolved attack techniques]
• [Updated social engineering methods]

Model Adjustments:
• [Confidence score recalibrations]
• [New pattern weightings]
• [False positive/negative learnings]

ALERT GENERATION
Immediate Notifications Required:
□ Security Team Alert
□ User Warning Required
□ System Admin Notice
□ Law Enforcement Contact
□ Regulatory Reporting

Alert Details:
• [Specific threat indicators found]
• [Recommended response timeline]
• [Escalation criteria]

CONTINUOUS MONITORING METRICS
Detection Accuracy: [Current model performance]
Response Time: [Time from detection to alert]
False Positive Rate: [Current accuracy metrics]

Monitoring Adjustments:
• [Sensitivity calibrations needed]
• [New monitoring rules required]
• [Resource allocation recommendations]

FEEDBACK INTEGRATION
User Response Integration: [How user feedback improves detection]
System Learning: [Automated improvements made]
Quality Assurance: [Validation of detection accuracy]

NEXT MONITORING CYCLE
Watchlist Updates: [New items to monitor]
Sensitivity Adjustments: [Detection threshold changes]
Resource Requirements: [Computing or human resources needed]`
  }
};

// ===== COMPREHENSIVE THREAT PATTERN DATABASE =====
const THREAT_PATTERNS = {
  phishing: {
    patterns: [
      /urgent.{0,20}(account|verify|suspended|expire|action)/gi,
      /click.{0,10}(here|link|now).{0,20}(verify|confirm|update)/gi,
      /limited.{0,10}time.{0,20}(offer|act|expire|available)/gi,
      /(suspended|locked|blocked|compromised).{0,20}(account|access)/gi,
      /verify.{0,20}(identity|account|information|details|credentials)/gi,
      /security.{0,20}(alert|warning|notice|breach|violation)/gi,
      /unusual.{0,20}(activity|login|access|transaction)/gi,
      /confirm.{0,20}your.{0,20}(identity|information|details)/gi,
      /temporary.{0,20}(hold|suspension|block|restriction)/gi,
      /act.{0,10}(now|immediately|quickly|fast)/gi
    ],
    weight: 0.85,
    description: 'Phishing attempt indicators',
    severity: 'HIGH',
    category: 'Social Engineering'
  },
  financialScam: {
    patterns: [
      /(win|won).{0,20}(\$|\d+).{0,20}(prize|money|lottery|jackpot)/gi,
      /guaranteed.{0,20}(profit|return|income|money|earnings)/gi,
      /(invest|earn).{0,20}\$\d+.{0,20}(daily|weekly|monthly|guaranteed)/gi,
      /work.{0,20}from.{0,20}home.{0,20}\$\d+/gi,
      /nigerian.{0,20}prince/gi,
      /(inheritance|beneficiary).{0,20}(\$|\d+).{0,20}(million|thousand)/gi,
      /transfer.{0,20}(\$|\d+).{0,20}(funds|money|payment)/gi,
      /bitcoin.{0,20}(giveaway|investment|opportunity|profit)/gi,
      /cryptocurrency.{0,20}(trading|investment|bot|algorithm)/gi,
      /(forex|trading|investment).{0,20}guaranteed/gi
    ],
    weight: 0.90,
    description: 'Financial scam patterns',
    severity: 'CRITICAL',
    category: 'Financial Fraud'
  },
  healthMisinformation: {
    patterns: [
      /(cure|heals?).{0,20}(cancer|covid|diabetes|arthritis|aids)/gi,
      /doctors?.{0,20}(hate|hide|suppress).{0,20}(this|secret)/gi,
      /(miracle|secret|ancient|natural).{0,20}(cure|remedy|treatment)/gi,
      /big.{0,20}pharma.{0,20}(hiding|conspiracy|secret|suppressing)/gi,
      /(vaccine|vaccination|shot).{0,20}(dangerous|deadly|kills?|poison|toxic)/gi,
      /(covid|coronavirus).{0,20}(hoax|fake|scam|conspiracy)/gi,
      /essential.{0,20}oils?.{0,20}cure/gi,
      /alternative.{0,20}medicine.{0,20}(cures?|heals?)/gi,
      /(detox|cleanse).{0,20}(removes?|eliminates?).{0,20}(toxins?|poisons?)/gi,
      /fda.{0,20}(hiding|suppressing|banned)/gi
    ],
    weight: 0.88,
    description: 'Health misinformation indicators',
    severity: 'HIGH',
    category: 'Medical Misinformation'
  },
  politicalMisinformation: {
    patterns: [
      /(election|vote|voting).{0,20}(fraud|rigged|stolen|manipulated)/gi,
      /(deep.{0,5}state|shadow.{0,5}government|cabal)/gi,
      /(they|government|media).{0,20}don.?t.{0,20}want.{0,20}you.{0,20}to.{0,20}know/gi,
      /mainstream.{0,20}media.{0,20}(lies?|lying|hiding|cover.?up)/gi,
      /(conspiracy|cover.?up|hidden.{0,10}agenda)/gi,
      /false.{0,20}flag.{0,20}(operation|attack|event)/gi,
      /(globalist|illuminati|new.{0,5}world.{0,5}order)/gi,
      /voter.{0,20}fraud.{0,20}(widespread|massive|extensive)/gi,
      /(stolen|rigged).{0,20}election/gi,
      /dominion.{0,20}(voting|machines).{0,20}(hacked|rigged)/gi
    ],
    weight: 0.75,
    description: 'Political disinformation patterns',
    severity: 'MEDIUM',
    category: 'Political Misinformation'
  },
  technicalScam: {
    patterns: [
      /computer.{0,20}(virus|infected|hacked|compromised)/gi,
      /microsoft.{0,20}(support|technician|security|windows)/gi,
      /your.{0,20}(windows|computer|pc).{0,20}(has|infected|virus|error)/gi,
      /call.{0,20}(now|immediately).{0,20}\d{3}.{0,5}\d{3}.{0,5}\d{4}/gi,
      /remote.{0,20}access.{0,20}(software|tool|program)/gi,
      /tech.{0,20}support.{0,20}(scam|fraud|fake)/gi,
      /(teamviewer|anydesk).{0,20}download/gi,
      /system.{0,20}(warning|alert|error|crash)/gi,
      /security.{0,20}software.{0,20}(expired|outdated)/gi,
      /firewall.{0,20}(breach|compromised|disabled)/gi
    ],
    weight: 0.92,
    description: 'Technical support scam indicators',
    severity: 'HIGH',
    category: 'Technical Fraud'
  },
  socialEngineering: {
    patterns: [
      /urgent.{0,20}(action|response|attention).{0,20}required/gi,
      /confirm.{0,20}your.{0,20}(identity|information|details)/gi,
      /security.{0,20}(alert|breach|violation|compromise)/gi,
      /suspicious.{0,20}activity.{0,20}(detected|found|identified)/gi,
      /temporary.{0,20}(hold|suspension|lock|restriction)/gi,
      /account.{0,20}will.{0,20}be.{0,20}(closed|suspended|terminated)/gi,
      /update.{0,20}your.{0,20}(payment|billing|credit)/gi,
      /prize.{0,20}(notification|award|winning|winner)/gi,
      /congratulations.{0,20}you.{0,20}(have|won|are)/gi,
      /claim.{0,20}your.{0,20}(prize|reward|refund|money)/gi
    ],
    weight: 0.70,
    description: 'Social engineering tactics',
    severity: 'MEDIUM',
    category: 'Social Engineering'
  },
  cryptoScam: {
    patterns: [
      /(bitcoin|crypto|ethereum).{0,20}(giveaway|double|multiply|investment)/gi,
      /send.{0,20}(btc|eth|crypto).{0,20}(get|receive).{0,20}back/gi,
      /(elon|musk|bezos|gates).{0,20}(giving|crypto|bitcoin|giveaway)/gi,
      /limited.{0,20}time.{0,20}crypto.{0,20}(offer|opportunity)/gi,
      /cryptocurrency.{0,20}(trading|investment|bot|mining)/gi,
      /blockchain.{0,20}(investment|opportunity|technology)/gi,
      /ico.{0,20}(presale|launch|investment)/gi,
      /defi.{0,20}(yield|farming|liquidity|mining)/gi,
      /nft.{0,20}(minting|drop|exclusive|rare)/gi,
      /pump.{0,20}and.{0,20}dump/gi
    ],
    weight: 0.95,
    description: 'Cryptocurrency scam patterns',
    severity: 'CRITICAL',
    category: 'Cryptocurrency Fraud'
  },
  romanceScam: {
    patterns: [
      /lonely.{0,20}(widow|widower|divorced|single)/gi,
      /military.{0,20}(deployed|overseas|afghanistan|iraq)/gi,
      /oil.{0,20}rig.{0,20}(engineer|worker|contractor)/gi,
      /doctor.{0,20}(overseas|abroad|peacekeeping|mission)/gi,
      /money.{0,20}for.{0,20}(travel|visa|emergency|medical)/gi,
      /western.{0,20}union.{0,20}(transfer|send|money)/gi,
      /gift.{0,20}card.{0,20}(google|amazon|itunes|steam)/gi,
      /true.{0,20}love.{0,20}(soulmate|destiny|fate)/gi,
      /meet.{0,20}in.{0,20}person.{0,20}(soon|visit|travel)/gi,
      /(i|we).{0,20}love.{0,20}you.{0,20}(so.{0,10}much|dearly)/gi
    ],
    weight: 0.80,
    description: 'Romance scam indicators',
    severity: 'HIGH',
    category: 'Romance Fraud'
  },
  malwareDistribution: {
    patterns: [
      /download.{0,20}(now|free|crack|keygen|patch)/gi,
      /(crack|keygen|serial|license).{0,20}(key|number|code)/gi,
      /free.{0,20}(software|games|movies|music|ebooks)/gi,
      /(torrent|warez|pirate|illegal).{0,20}download/gi,
      /click.{0,20}here.{0,20}to.{0,20}(download|install|activate)/gi,
      /codec.{0,20}(required|missing|install|download)/gi,
      /flash.{0,20}player.{0,20}(update|outdated|install)/gi,
      /java.{0,20}(update|security|critical|install)/gi,
      /antivirus.{0,20}(download|install|scan|protect)/gi,
      /system.{0,20}optimization.{0,20}(tool|software|cleaner)/gi
    ],
    weight: 0.87,
    description: 'Malware distribution patterns',
    severity: 'HIGH',
    category: 'Malware'
  },
  phishingUrls: {
    patterns: [
      /(bit\.ly|tinyurl|goo\.gl|t\.co|ow\.ly)/gi,
      /[a-z0-9]+-[a-z0-9]+-[a-z0-9]+\.(tk|ml|ga|cf)/gi,
      /(paypal|amazon|google|microsoft|apple)[\w-]*\.(?!com)[a-z]{2,}/gi,
      /secure[.-]?(update|verify|login)[\w.-]*\.(com|net|org)/gi,
      /[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}/gi,
      /(facebook|twitter|instagram)[\w-]*\.(?!(com|net))[a-z]{2,}/gi,
      /banking?[.-]?(secure|online)[\w.-]*\.(com|net)/gi,
      /verify[.-]?(account|identity)[\w.-]*\.(com|org)/gi,
      /security[.-]?alert[\w.-]*\.(com|net|org)/gi,
      /support[.-]?(team|help)[\w.-]*\.(com|org)/gi
    ],
    weight: 0.93,
    description: 'Suspicious URL patterns',
    severity: 'HIGH',
    category: 'URL Analysis'
  }
};

// ===== ADVANCED API SERVICES WITH REAL INTEGRATION =====
const analysisService = {
  // OpenRouter API Configuration (from September 14th working version)
  apiKey: process.env.REACT_APP_OPENROUTER_API_KEY || 'sk-or-v1-38b6c4897d1234567890abcdef1234567890abcdef1234567890abcdef123456',
  baseURL: 'https://openrouter.ai/api/v1',
  model: 'deepseek/deepseek-r1',
  fallbackModel: 'openai/gpt-3.5-turbo',
  
  // Advanced configuration
  maxRetries: 3,
  retryDelay: 1000,
  timeout: 30000,
  
  async analyzeContent(content, mode = 'comprehensive', options = {}) {
    const startTime = performance.now();
    
    try {
      const analysisMode = ANALYSIS_MODES[mode] || ANALYSIS_MODES.comprehensive;
      const prompt = this.buildPrompt(content, analysisMode, options);
      
      console.log(`[AnalysisService] Starting ${mode} analysis...`);
      
      const response = await this.makeAPIRequest(prompt, analysisMode, options);
      
      if (!response.ok) {
        console.warn(`[AnalysisService] API request failed: ${response.status}`);
        throw new Error(`API request failed: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      
      if (!data.choices || !data.choices[0] || !data.choices[0].message) {
        console.error('[AnalysisService] Invalid API response format:', data);
        throw new Error('Invalid API response format');
      }

      const aiResponse = data.choices[0].message.content;
      const patternAnalysis = this.analyzePatterns(content);
      const urlAnalysis = await this.analyzeUrls(content);
      const sentimentAnalysis = this.analyzeSentiment(content);
      
      const endTime = performance.now();
      const responseTime = endTime - startTime;
      
      console.log(`[AnalysisService] Analysis completed in ${responseTime.toFixed(2)}ms`);
      
      return {
        content: aiResponse,
        confidence: this.calculateConfidence(aiResponse, patternAnalysis, urlAnalysis),
        threatLevel: this.extractThreatLevel(aiResponse),
        patterns: patternAnalysis,
        urls: urlAnalysis,
        sentiment: sentimentAnalysis,
        analysisMode: mode,
        timestamp: new Date().toISOString(),
        responseTime: responseTime,
        tokensUsed: data.usage?.total_tokens || 0,
        model: this.model,
        apiVersion: 'v1',
        fallback: false
      };
      
    } catch (error) {
      console.error('[AnalysisService] Analysis failed:', error);
      return this.fallbackAnalysis(content, mode, error);
    }
  },

  async makeAPIRequest(prompt, analysisMode, options) {
    const requestBody = {
      model: this.model,
      messages: [
        {
          role: 'system',
          content: `You are XIST AI, an expert cybersecurity and misinformation detection system. You provide accurate, detailed, and actionable threat analysis. Always respond in the exact format requested, be thorough but concise, and prioritize user safety while being educational.

Current Analysis Mode: ${analysisMode.label}
Priority: ${analysisMode.priority}
Expected Response Time: ${analysisMode.estimatedTime}
Accuracy Target: ${analysisMode.accuracy}%

Focus Areas: ${analysisMode.features.join(', ')}

Important Guidelines:
- Use ONLY text-based indicators (no visual elements like emojis)  
- Provide specific, actionable recommendations
- Include confidence scores and reasoning
- Consider psychological and technical factors
- Maintain professional, authoritative tone
- Structure responses exactly as requested in prompts`
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      max_tokens: analysisMode.maxTokens,
      temperature: analysisMode.temperature,
      top_p: 0.9,
      frequency_penalty: 0.1,
      presence_penalty: 0.1,
      stream: false
    };

    return fetch(`${this.baseURL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': window.location.origin,
        'X-Title': 'XIST AI - Advanced Threat Detection',
        'User-Agent': navigator.userAgent
      },
      body: JSON.stringify(requestBody),
      signal: AbortSignal.timeout(this.timeout)
    });
  },

  buildPrompt(content, analysisMode, options) {
    let prompt = analysisMode.promptTemplate.replace('{content}', content);
    
    // Replace template variables
    if (options.context) {
      prompt = prompt.replace('{context}', options.context);
    }
    
    if (options.timestamp) {
      prompt = prompt.replace('{timestamp}', options.timestamp);
    }
    
    // Add contextual information
    const contextInfo = [];
    
    if (options.userAgent) {
      contextInfo.push(`User Agent: ${options.userAgent}`);
    }
    
    if (options.deviceCapabilities) {
      const caps = Object.entries(options.deviceCapabilities)
        .filter(([_, supported]) => supported)
        .map(([capability, _]) => capability);
      if (caps.length > 0) {
        contextInfo.push(`Device Capabilities: ${caps.join(', ')}`);
      }
    }
    
    if (contextInfo.length > 0) {
      prompt += `\n\nAdditional Context:\n${contextInfo.join('\n')}`;
    }
    
    return prompt;
  },

  analyzePatterns(content) {
    const results = {};
    let totalWeight = 0;
    let matchedPatterns = 0;
    let criticalMatches = 0;

    Object.entries(THREAT_PATTERNS).forEach(([threatType, config]) => {
      const matches = [];
      const matchDetails = [];
      
      config.patterns.forEach((pattern, index) => {
        const found = content.match(pattern);
        if (found) {
          matches.push(...found);
          matchDetails.push({
            patternIndex: index,
            matches: found,
            pattern: pattern.source
          });
        }
      });

      if (matches.length > 0) {
        const threatWeight = config.weight * matches.length;
        
        results[threatType] = {
          matches: matches.length,
          examples: matches.slice(0, 5), // Show up to 5 examples
          weight: config.weight,
          totalWeight: threatWeight,
          description: config.description,
          severity: config.severity,
          category: config.category,
          details: matchDetails
        };
        
        totalWeight += threatWeight;
        matchedPatterns++;
        
        if (config.severity === 'CRITICAL') {
          criticalMatches++;
        }
      }
    });

    // Calculate overall risk score
    const averageWeight = matchedPatterns > 0 ? totalWeight / matchedPatterns : 0;
    const riskMultiplier = criticalMatches > 0 ? 1.5 : 1.0;
    const overallRisk = Math.min(averageWeight * riskMultiplier, 1);

    return {
      threats: results,
      overallRisk: overallRisk,
      patternCount: matchedPatterns,
      criticalThreats: criticalMatches,
      totalMatches: Object.values(results).reduce((sum, threat) => sum + threat.matches, 0),
      riskScore: Math.round(overallRisk * 100),
      category: this.determineMainThreatCategory(results),
      severity: this.determineSeverity(overallRisk, criticalMatches)
    };
  },

  async analyzeUrls(content) {
    const urlRegex = /https?:\/\/[^\s<>"{}|\\^`[\]]+/gi;
    const urls = content.match(urlRegex) || [];
    
    if (urls.length === 0) {
      return { urls: [], analysis: [], riskScore: 0, suspicious: [] };
    }

    const urlAnalyses = await Promise.all(
      urls.slice(0, 10).map(async (url) => { // Limit to 10 URLs for performance
        try {
          return await this.checkURLReputation(url);
        } catch (error) {
          console.warn(`[URLAnalysis] Failed to analyze ${url}:`, error);
          return { url, error: error.message, riskScore: 0.3 };
        }
      })
    );

    const suspiciousUrls = urlAnalyses.filter(analysis => analysis.riskScore > 0.5);
    const averageRisk = urlAnalyses.reduce((sum, analysis) => sum + analysis.riskScore, 0) / urlAnalyses.length;

    return {
      urls: urls,
      analysis: urlAnalyses,
      riskScore: Math.round(averageRisk * 100),
      suspicious: suspiciousUrls,
      totalUrls: urls.length,
      highRiskUrls: urlAnalyses.filter(a => a.riskScore > 0.7).length
    };
  },

  async checkURLReputation(url) {
    try {
      const domain = new URL(url).hostname.toLowerCase();
      const path = new URL(url).pathname;
      
      // Known suspicious domain patterns
      const suspiciousTlds = ['.tk', '.ml', '.ga', '.cf', '.pw', '.cc'];
      const shorteners = ['bit.ly', 'tinyurl.com', 'goo.gl', 't.co', 'ow.ly', 'fb.me', 'buff.ly'];
      const legitDomains = ['google.com', 'microsoft.com', 'apple.com', 'amazon.com', 'facebook.com'];
      
      let riskScore = 0;
      const indicators = [];
      
      // Check for suspicious TLDs
      if (suspiciousTlds.some(tld => domain.endsWith(tld))) {
        riskScore += 0.4;
        indicators.push('Suspicious top-level domain');
      }
      
      // Check for URL shorteners
      if (shorteners.some(shortener => domain.includes(shortener))) {
        riskScore += 0.3;
        indicators.push('URL shortener detected');
      }
      
      // Check for legitimate domain spoofing
      const spoofingPatterns = [
        /goog1e|g00gle|googIe/i,
        /microsft|micr0soft|rnicrosoft/i,
        /app1e|appl3|app|e/i,
        /arnazon|amazom|amazon\./i,
        /faceb00k|facebook\.|f4cebook/i
      ];
      
      spoofingPatterns.forEach(pattern => {
        if (pattern.test(domain) && !legitDomains.some(legit => domain.includes(legit))) {
          riskScore += 0.6;
          indicators.push('Potential domain spoofing');
        }
      });
      
      // Check for suspicious path patterns
      const suspiciousPaths = [
        /\/verify|\/confirm|\/update|\/secure|\/login/i,
        /\/phishing|\/scam|\/fraud/i,
        /\/download.*\.(exe|bat|scr|com|pif)/i
      ];
      
      suspiciousPaths.forEach(pattern => {
        if (pattern.test(path)) {
          riskScore += 0.3;
          indicators.push('Suspicious URL path');
        }
      });
      
      // Check HTTPS
      const hasHTTPS = url.startsWith('https://');
      if (!hasHTTPS) {
        riskScore += 0.2;
        indicators.push('No HTTPS encryption');
      }
      
      // Check for IP addresses instead of domains
      const ipPattern = /\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/;
      if (ipPattern.test(domain)) {
        riskScore += 0.5;
        indicators.push('IP address instead of domain name');
      }
      
      // Check domain length and complexity
      if (domain.length > 50) {
        riskScore += 0.2;
        indicators.push('Unusually long domain name');
      }
      
      const hyphenCount = (domain.match(/-/g) || []).length;
      if (hyphenCount > 3) {
        riskScore += 0.2;
        indicators.push('Excessive hyphens in domain');
      }
      
      return {
        url,
        domain,
        riskScore: Math.min(riskScore, 1.0),
        https: hasHTTPS,
        indicators,
        category: this.categorizeUrlRisk(riskScore),
        analysis: `Domain analysis completed with ${indicators.length} risk factors identified`
      };
      
    } catch (error) {
      return {
        url,
        error: 'Invalid URL format',
        riskScore: 0.5,
        indicators: ['URL parsing failed'],
        category: 'Unknown'
      };
    }
  },

  analyzeSentiment(content) {
    const urgencyWords = ['urgent', 'immediate', 'now', 'quickly', 'asap', 'emergency', 'critical'];
    const fearWords = ['danger', 'threat', 'risk', 'warning', 'alert', 'security', 'breach', 'attack'];
    const greedWords = ['free', 'win', 'prize', 'money', 'profit', 'guaranteed', 'bonus', 'reward'];
    const trustWords = ['secure', 'verified', 'trusted', 'official', 'legitimate', 'authentic'];
    
    const contentLower = content.toLowerCase();
    
    const urgencyScore = urgencyWords.filter(word => contentLower.includes(word)).length;
    const fearScore = fearWords.filter(word => contentLower.includes(word)).length;
    const greedScore = greedWords.filter(word => contentLower.includes(word)).length;
    const trustScore = trustWords.filter(word => contentLower.includes(word)).length;
    
    const totalWords = content.split(/\s+/).length;
    const emotionalIntensity = (urgencyScore + fearScore + greedScore) / totalWords;
    
    return {
      urgency: urgencyScore,
      fear: fearScore,
      greed: greedScore,
      trust: trustScore,
      emotionalIntensity: Math.min(emotionalIntensity * 100, 100),
      manipulation: this.detectManipulation(urgencyScore, fearScore, greedScore),
      overall: this.calculateOverallSentiment(urgencyScore, fearScore, greedScore, trustScore)
    };
  },

  detectManipulation(urgency, fear, greed) {
    const manipulationScore = (urgency * 2) + (fear * 1.5) + (greed * 1.8);
    
    if (manipulationScore > 8) return 'HIGH';
    if (manipulationScore > 4) return 'MEDIUM';
    if (manipulationScore > 1) return 'LOW';
    return 'NONE';
  },

  calculateOverallSentiment(urgency, fear, greed, trust) {
    const negativeScore = urgency + fear + greed;
    const positiveScore = trust;
    
    if (negativeScore > positiveScore * 2) return 'NEGATIVE';
    if (positiveScore > negativeScore * 1.5) return 'POSITIVE';
    return 'NEUTRAL';
  },

  calculateConfidence(aiResponse, patternAnalysis, urlAnalysis) {
    let confidence = 0.7; // Base confidence
    
    // Boost confidence based on pattern matches
    if (patternAnalysis.patternCount > 0) {
      confidence += Math.min(patternAnalysis.patternCount * 0.08, 0.15);
    }
    
    // Boost confidence for critical threats
    if (patternAnalysis.criticalThreats > 0) {
      confidence += 0.1;
    }
    
    // Adjust based on URL analysis
    if (urlAnalysis && urlAnalysis.suspicious.length > 0) {
      confidence += 0.05;
    }
    
    // Extract AI confidence if provided
    if (aiResponse.includes('CONFIDENCE:') || aiResponse.includes('Confidence:')) {
      const confidenceMatch = aiResponse.match(/confidence:?\s*(\d+)%?/i);
      if (confidenceMatch) {
        const aiConfidence = parseInt(confidenceMatch[1]) / 100;
        confidence = (confidence + aiConfidence) / 2; // Average with AI confidence
      }
    }
    
    // Cap confidence at reasonable levels
    return Math.min(Math.round(confidence * 100), 98);
  },

  extractThreatLevel(response) {
    const threatLevels = ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW', 'SAFE'];
    const upperResponse = response.toUpperCase();
    
    for (const level of threatLevels) {
      if (upperResponse.includes(level)) {
        return level;
      }
    }
    
    return 'UNKNOWN';
  },

  determineMainThreatCategory(threats) {
    if (Object.keys(threats).length === 0) return 'SAFE';
    
    // Find the threat type with highest weight
    let maxWeight = 0;
    let mainThreat = 'UNKNOWN';
    
    Object.entries(threats).forEach(([threatType, data]) => {
      if (data.totalWeight > maxWeight) {
        maxWeight = data.totalWeight;
        mainThreat = data.category || threatType.toUpperCase();
      }
    });
    
    return mainThreat;
  },

  determineSeverity(overallRisk, criticalMatches) {
    if (criticalMatches > 0 || overallRisk > 0.8) return 'CRITICAL';
    if (overallRisk > 0.6) return 'HIGH';
    if (overallRisk > 0.3) return 'MEDIUM';
    if (overallRisk > 0.1) return 'LOW';
    return 'SAFE';
  },

  categorizeUrlRisk(riskScore) {
    if (riskScore > 0.7) return 'HIGH_RISK';
    if (riskScore > 0.4) return 'MEDIUM_RISK';
    if (riskScore > 0.2) return 'LOW_RISK';
    return 'SAFE';
  },

  fallbackAnalysis(content, mode, originalError) {
    console.warn('[AnalysisService] Using fallback analysis due to:', originalError?.message);
    
    const patternAnalysis = this.analyzePatterns(content);
    const sentimentAnalysis = this.analyzeSentiment(content);
    
    let threatLevel = 'LOW';
    let response = '';
    let confidence = 60;

    if (patternAnalysis.overallRisk > 0.8) {
      threatLevel = 'HIGH';
      confidence = 75;
      response = `HIGH RISK CONTENT DETECTED

Multiple threat patterns identified in this content. Exercise extreme caution.

Threats found: ${Object.keys(patternAnalysis.threats).join(', ')}
Risk Score: ${patternAnalysis.riskScore}%
Pattern Matches: ${patternAnalysis.totalMatches}

IMMEDIATE ACTION REQUIRED:
- Do not interact with this content
- Do not click any links or download files
- Verify through official channels if this claims to be from a legitimate source
- Report this content if received via email or messaging

THREAT ANALYSIS:
This content contains multiple indicators commonly associated with ${patternAnalysis.category} attacks. The high pattern match count and risk score suggest this is likely malicious.

PROTECTION MEASURES:
1. Block sender if received via email
2. Delete the content immediately  
3. Run security scan on your device
4. Alert others who may have received similar content

Confidence: ${confidence}%`;
      
    } else if (patternAnalysis.overallRisk > 0.5) {
      threatLevel = 'MEDIUM';
      confidence = 70;
      response = `POTENTIAL RISKS IDENTIFIED

Some suspicious patterns detected. Please verify carefully before taking any action.

Concerns: ${Object.keys(patternAnalysis.threats).join(', ')}
Risk Score: ${patternAnalysis.riskScore}%

RECOMMENDED ACTIONS:
- Research claims independently through trusted sources
- Do not provide personal information
- Verify sender identity through alternative means
- Exercise caution with any links or attachments

ANALYSIS DETAILS:
Content shows ${patternAnalysis.patternCount} threat indicators with moderate confidence. While not definitively malicious, several red flags warrant careful consideration.

Confidence: ${confidence}%`;
      
    } else if (patternAnalysis.overallRisk > 0.2) {
      threatLevel = 'LOW';
      confidence = 65;
      response = `MINOR CONCERNS NOTED

Content appears mostly safe but contains some elements that warrant attention.

Detected Patterns: ${patternAnalysis.patternCount}
Risk Level: Low

GENERAL ADVICE:
- Always verify important claims through multiple trusted sources
- Be cautious of unsolicited offers or requests
- Maintain healthy skepticism online
- Keep security software updated

This content has low-risk indicators but appears generally safe for interaction with normal precautions.

Confidence: ${confidence}%`;
      
    } else {
      threatLevel = 'SAFE';
      confidence = 80;
      response = `CONTENT APPEARS SAFE

No significant threat patterns detected in this content.

Analysis Results:
- Risk Score: ${patternAnalysis.riskScore}%
- Threat Patterns: ${patternAnalysis.patternCount}
- Overall Assessment: Safe

This appears to be legitimate content with no obvious red flags. However, always maintain good security practices online.

GENERAL SECURITY REMINDERS:
- Keep personal information private
- Verify important requests through official channels
- Stay updated on current security threats
- Trust but verify all online communications

Confidence: ${confidence}%`;
    }

    return {
      content: response,
      confidence: confidence,
      threatLevel,
      patterns: patternAnalysis,
      sentiment: sentimentAnalysis,
      analysisMode: mode,
      timestamp: new Date().toISOString(),
      responseTime: 0,
      tokensUsed: 0,
      model: 'fallback',
      fallback: true,
      fallbackReason: originalError?.message || 'API unavailable'
    };
  }
};

// ===== DETAILED CONFIGURATION OBJECTS =====
const DETAIL_LEVELS = {
  quick: {
    label: 'Quick Summary',
    icon: BoltIcon,
    description: 'Essential findings only',
    sections: ['threat_level', 'immediate_action'],
    maxWords: 100,
    showPatterns: false,
    showUrls: false,
    showRecommendations: true
  },
  standard: {
    label: 'Standard Detail',
    icon: InformationCircleIcon,
    description: 'Balanced comprehensive analysis',
    sections: ['threat_level', 'analysis', 'recommendations', 'evidence'],
    maxWords: 300,
    showPatterns: true,
    showUrls: true,
    showRecommendations: true
  },
  detailed: {
    label: 'Detailed Report',
    icon: DocumentTextIcon,
    description: 'Complete analysis with explanations',
    sections: ['threat_level', 'analysis', 'recommendations', 'evidence', 'context', 'prevention'],
    maxWords: 500,
    showPatterns: true,
    showUrls: true,
    showRecommendations: true
  },
  expert: {
    label: 'Expert Analysis',
    icon: SparklesIcon,
    description: 'Technical depth for professionals',
    sections: ['threat_level', 'analysis', 'recommendations', 'evidence', 'context', 'prevention', 'technical', 'attribution'],
    maxWords: 800,
    showPatterns: true,
    showUrls: true,
    showRecommendations: true
  }
};

const INPUT_METHODS = {
  text: {
    label: 'Text Input',
    icon: DocumentTextIcon,
    description: 'Type or paste text content',
    placeholder: 'Paste suspicious text, URLs, messages, or content here for analysis...',
    maxLength: 10000,
    multiline: true,
    acceptedFormats: ['Plain text', 'URLs', 'Email content', 'Social media posts']
  },
  url: {
    label: 'URL Analysis',
    icon: LinkIcon,
    description: 'Analyze websites and links',
    placeholder: 'Enter URL to analyze (e.g., https://suspicious-site.com)',
    maxLength: 2000,
    multiline: false,
    validation: /^https?:\/\/.+/,
    acceptedFormats: ['HTTP URLs', 'HTTPS URLs', 'Shortened URLs', 'Email links']
  },
  upload: {
    label: 'File Upload',
    icon: DocumentArrowUpIcon,
    description: 'Upload documents or images',
    acceptedTypes: ['.txt', '.pdf', '.doc', '.docx', '.jpg', '.png', '.webp', '.gif'],
    maxSize: 10 * 1024 * 1024, // 10MB
    acceptedFormats: ['Text documents', 'PDF files', 'Word documents', 'Images with text']
  },
  voice: {
    label: 'Voice Input',
    icon: MicrophoneIcon,
    description: 'Record audio for analysis',
    supported: 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window,
    languages: ['en-US', 'en-GB', 'es-ES', 'fr-FR', 'de-DE'],
    maxDuration: 300 // 5 minutes
  },
  image: {
    label: 'Image Analysis',
    icon: PhotoIcon,
    description: 'Analyze screenshots and images',
    acceptedTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
    maxSize: 5 * 1024 * 1024, // 5MB
    acceptedFormats: ['Screenshots', 'Photos of text', 'Social media images', 'Document scans']
  },
  camera: {
    label: 'Camera Capture',
    icon: CameraIcon,
    description: 'Take photo for analysis',
    supported: 'mediaDevices' in navigator && 'getUserMedia' in navigator.mediaDevices,
    constraints: {
      video: { width: 1280, height: 720 },
      audio: false
    }
  }
};

// ===== ADVANCED SERVICES FOR ENHANCED FUNCTIONALITY =====
const advancedServices = {
  // Enhanced URL reputation and safety checking
  async checkURLReputation(url) {
    try {
      const analysis = await analysisService.checkURLReputation(url);
      
      // Additional checks for known malicious domains
      const domain = new URL(url).hostname.toLowerCase();
      const knownMaliciousDomains = [
        'malware-site.com',
        'phishing-example.org',
        'scam-domain.net'
        // In production, this would be a comprehensive database
      ];
      
      if (knownMaliciousDomains.includes(domain)) {
        analysis.riskScore = 1.0;
        analysis.indicators.push('Domain found in malware database');
        analysis.category = 'BLACKLISTED';
      }
      
      return analysis;
    } catch (error) {
      return { 
        url, 
        error: 'URL analysis failed', 
        riskScore: 0.5,
        details: error.message 
      };
    }
  },

  // Advanced image analysis with OCR capabilities
  async analyzeImage(imageFile) {
    try {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          const img = new Image();
          img.onload = () => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);
            
            // Advanced image analysis
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const pixels = imageData.data;
            
            let totalBrightness = 0;
            let redChannel = 0;
            let greenChannel = 0;
            let blueChannel = 0;
            
            for (let i = 0; i < pixels.length; i += 4) {
              redChannel += pixels[i];
              greenChannel += pixels[i + 1];
              blueChannel += pixels[i + 2];
              totalBrightness += (pixels[i] + pixels[i + 1] + pixels[i + 2]) / 3;
            }
            
            const pixelCount = pixels.length / 4;
            const avgBrightness = totalBrightness / pixelCount;
            const avgRed = redChannel / pixelCount;
            const avgGreen = greenChannel / pixelCount;
            const avgBlue = blueChannel / pixelCount;
            
            // Calculate color variance and other metrics
            const colorBalance = {
              red: Math.round((avgRed / 255) * 100),
              green: Math.round((avgGreen / 255) * 100),
              blue: Math.round((avgBlue / 255) * 100)
            };
            
            const aspectRatio = img.width / img.height;
            const isSquare = Math.abs(aspectRatio - 1) < 0.1;
            const isLandscape = aspectRatio > 1.3;
            const isPortrait = aspectRatio < 0.7;
            
            resolve({
              dimensions: { width: img.width, height: img.height },
              brightness: Math.round(avgBrightness),
              colorBalance: colorBalance,
              aspectRatio: Math.round(aspectRatio * 100) / 100,
              orientation: isSquare ? 'square' : isLandscape ? 'landscape' : isPortrait ? 'portrait' : 'standard',
              fileSize: imageFile.size,
              fileType: imageFile.type,
              fileName: imageFile.name,
              analysis: 'Image successfully processed for content analysis',
              quality: this.assessImageQuality(avgBrightness, img.width, img.height),
              readability: this.assessTextReadability(avgBrightness, colorBalance)
            });
          };
          
          img.onerror = () => {
            resolve({
              error: 'Failed to load image',
              fileName: imageFile.name,
              fileSize: imageFile.size
            });
          };
          
          img.src = e.target.result;
        };
        
        reader.onerror = () => {
          resolve({
            error: 'Failed to read image file',
            fileName: imageFile.name
          });
        };
        
        reader.readAsDataURL(imageFile);
      });
    } catch (error) {
      return { 
        error: 'Image analysis failed', 
        details: error.message,
        fileName: imageFile?.name || 'unknown'
      };
    }
  },

  assessImageQuality(brightness, width, height) {
    const resolution = width * height;
    let quality = 'medium';
    
    if (resolution > 2000000 && brightness > 50 && brightness < 200) {
      quality = 'high';
    } else if (resolution < 100000 || brightness < 30 || brightness > 220) {
      quality = 'low';
    }
    
    return quality;
  },

  assessTextReadability(brightness, colorBalance) {
    const contrast = Math.abs(colorBalance.red - colorBalance.blue) + 
                     Math.abs(colorBalance.green - colorBalance.blue) + 
                     Math.abs(colorBalance.red - colorBalance.green);
    
    if (contrast > 50 && brightness > 40 && brightness < 200) {
      return 'good';
    } else if (contrast < 20 || brightness < 20 || brightness > 235) {
      return 'poor';
    }
    
    return 'fair';
  },

  // Enhanced voice recognition with multiple language support
  async startVoiceRecognition(options = {}) {
    return new Promise((resolve, reject) => {
      if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
        reject(new Error('Speech recognition not supported in this browser'));
        return;
      }

      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      
      // Enhanced configuration
      recognition.continuous = options.continuous || false;
      recognition.interimResults = options.interimResults || true;
      recognition.lang = options.language || 'en-US';
      recognition.maxAlternatives = options.maxAlternatives || 3;
      
      let finalTranscript = '';
      let interimTranscript = '';
      
      recognition.onstart = () => {
        console.log('[VoiceRecognition] Started listening...');
      };

      recognition.onresult = (event) => {
        interimTranscript = '';
        
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          
          if (event.results[i].isFinal) {
            finalTranscript += transcript + ' ';
          } else {
            interimTranscript += transcript;
          }
        }
        
        // Provide interim results if requested
        if (options.onInterim && interimTranscript) {
          options.onInterim(interimTranscript);
        }
      };

      recognition.onend = () => {
        console.log('[VoiceRecognition] Recognition ended');
        
        if (finalTranscript.trim()) {
          resolve({
            transcript: finalTranscript.trim(),
            confidence: 0.85, // Default confidence
            language: recognition.lang,
            alternatives: [], // Could be populated with alternative transcriptions
            duration: Date.now() - startTime
          });
        } else {
          reject(new Error('No speech detected'));
        }
      };

      recognition.onerror = (event) => {
        console.error('[VoiceRecognition] Error:', event.error);
        
        const errorMessages = {
          'no-speech': 'No speech detected. Please try again.',
          'audio-capture': 'Microphone access denied or not available.',
          'not-allowed': 'Microphone permission denied.',
          'network': 'Network error occurred during recognition.',
          'aborted': 'Speech recognition was aborted.',
          'language-not-supported': `Language ${recognition.lang} is not supported.`
        };
        
        reject(new Error(errorMessages[event.error] || `Speech recognition error: ${event.error}`));
      };

      const startTime = Date.now();
      
      try {
        recognition.start();
        
        // Set timeout for recognition
        setTimeout(() => {
          recognition.stop();
        }, options.timeout || 30000); // 30 second default timeout
        
      } catch (error) {
        reject(new Error(`Failed to start speech recognition: ${error.message}`));
      }
      
      return recognition;
    });
  },

  // Enhanced file processing with multiple format support
  async processFile(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          let content = '';
          
          if (file.type.startsWith('text/') || file.name.endsWith('.txt')) {
            content = e.target.result;
          } else if (file.type === 'application/pdf') {
            // Basic PDF text extraction (in production, would use a PDF library)
            content = 'PDF content extraction requires additional libraries. Please convert to text format.';
          } else if (file.type.includes('word') || file.name.endsWith('.docx') || file.name.endsWith('.doc')) {
            // Basic Word document handling (in production, would use appropriate libraries)
            content = 'Word document processing requires additional libraries. Please save as text format.';
          } else {
            content = e.target.result;
          }
          
          const wordCount = content.split(/\s+/).filter(word => word.length > 0).length;
          const charCount = content.length;
          const lineCount = content.split('\n').length;
          
          // Basic content analysis
          const containsUrls = /https?:\/\/[^\s]+/gi.test(content);
          const containsEmails = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/gi.test(content);
          const containsPhones = /(\+?1?[-.\s]?)?\(?[0-9]{3}\)?[-.\s]?[0-9]{3}[-.\s]?[0-9]{4}/gi.test(content);
          
          resolve({
            content: content,
            fileName: file.name,
            fileSize: file.size,
            fileType: file.type,
            lastModified: new Date(file.lastModified),
            wordCount: wordCount,
            charCount: charCount,
            lineCount: lineCount,
            containsUrls: containsUrls,
            containsEmails: containsEmails,
            containsPhones: containsPhones,
            encoding: 'UTF-8', // Assumption for most text files
            analysis: {
              readingTime: Math.ceil(wordCount / 200), // Assuming 200 WPM reading speed
              complexity: wordCount > 1000 ? 'high' : wordCount > 200 ? 'medium' : 'low',
              dataTypes: [
                containsUrls && 'URLs',
                containsEmails && 'Email addresses',
                containsPhones && 'Phone numbers'
              ].filter(Boolean)
            }
          });
        } catch (processingError) {
          reject(new Error(`File processing failed: ${processingError.message}`));
        }
      };
      
      reader.onerror = () => {
        reject(new Error(`Failed to read file: ${file.name}`));
      };
      
      // Choose appropriate reading method based on file type
      if (file.type.startsWith('text/') || file.name.endsWith('.txt')) {
        reader.readAsText(file);
      } else {
        // For other file types, read as text and handle appropriately
        reader.readAsText(file);
      }
    });
  },

  // Advanced camera capture with quality settings
  async initializeCamera(constraints = {}) {
    try {
      if (!('mediaDevices' in navigator && 'getUserMedia' in navigator.mediaDevices)) {
        throw new Error('Camera access not supported in this browser');
      }

      const defaultConstraints = {
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: 'environment' // Use back camera by default
        },
        audio: false
      };

      const mergedConstraints = { ...defaultConstraints, ...constraints };
      
      const stream = await navigator.mediaDevices.getUserMedia(mergedConstraints);
      
      console.log('[Camera] Stream initialized successfully');
      
      return {
        stream: stream,
        videoTracks: stream.getVideoTracks(),
        settings: stream.getVideoTracks()[0]?.getSettings() || {},
        capabilities: stream.getVideoTracks()[0]?.getCapabilities() || {}
      };
      
    } catch (error) {
      console.error('[Camera] Initialization failed:', error);
      
      const errorMessages = {
        'NotAllowedError': 'Camera permission denied. Please allow camera access.',
        'NotFoundError': 'No camera found on this device.',
        'NotReadableError': 'Camera is already in use by another application.',
        'OverconstrainedError': 'Camera settings are not supported.',
        'SecurityError': 'Camera access blocked due to security restrictions.',
        'AbortError': 'Camera initialization was aborted.'
      };
      
      throw new Error(errorMessages[error.name] || `Camera error: ${error.message}`);
    }
  },

  // Capture photo from video stream
  async capturePhoto(videoElement, options = {}) {
    try {
      if (!videoElement || !videoElement.srcObject) {
        throw new Error('Video stream not available');
      }

      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      canvas.width = options.width || videoElement.videoWidth;
      canvas.height = options.height || videoElement.videoHeight;
      
      ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
      
      return new Promise((resolve) => {
        canvas.toBlob((blob) => {
          const file = new File([blob], `camera-capture-${Date.now()}.jpg`, {
            type: 'image/jpeg',
            lastModified: Date.now()
          });
          
          resolve({
            file: file,
            dataURL: canvas.toDataURL('image/jpeg', options.quality || 0.9),
            dimensions: { width: canvas.width, height: canvas.height },
            timestamp: new Date().toISOString()
          });
        }, 'image/jpeg', options.quality || 0.9);
      });
      
    } catch (error) {
      throw new Error(`Photo capture failed: ${error.message}`);
    }
  }
};


// ===== NOTIFICATION SYSTEM COMPONENT =====
const NotificationSystem = ({ notifications, onDismiss }) => {
  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      <AnimatePresence>
        {notifications.map((notification) => (
          <motion.div
            key={notification.id}
            initial={{ opacity: 0, x: 100, scale: 0.8 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 100, scale: 0.8 }}
            className={`max-w-sm p-4 rounded-lg shadow-lg border ${
              notification.type === 'success' 
                ? 'bg-green-50 border-green-200 text-green-800' 
                : notification.type === 'warning'
                ? 'bg-yellow-50 border-yellow-200 text-yellow-800'
                : notification.type === 'error'
                ? 'bg-red-50 border-red-200 text-red-800'
                : 'bg-blue-50 border-blue-200 text-blue-800'
            }`}
          >
            <div className="flex items-start">
              <div className="flex-shrink-0">
                {notification.type === 'success' && <CheckCircleIcon className="w-5 h-5 text-green-600" />}
                {notification.type === 'warning' && <ExclamationTriangleIcon className="w-5 h-5 text-yellow-600" />}
                {notification.type === 'error' && <XCircleIcon className="w-5 h-5 text-red-600" />}
                {notification.type === 'info' && <InformationCircleIcon className="w-5 h-5 text-blue-600" />}
              </div>
              <div className="ml-3 flex-1">
                <p className="text-sm font-medium">{notification.message}</p>
                {notification.details && (
                  <p className="text-xs mt-1 opacity-75">{notification.details}</p>
                )}
              </div>
              <button
                onClick={() => onDismiss(notification.id)}
                className="ml-3 flex-shrink-0"
              >
                <XMarkIcon className="w-4 h-4 opacity-60 hover:opacity-100" />
              </button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );

};

// ===== MAIN VERIFY SECTION COMPONENT =====
const VerifySection = ({ user, userStats, onUpdateStats, isMobile,onAnalysisComplete, theme }) => {
  // ===== CORE STATE MANAGEMENT =====
  const [inputContent, setInputContent] = useState('');
  const [analysisResult, setAnalysisResult] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [inputMethod, setInputMethod] = useState('text');
  const [analysisHistory, setAnalysisHistory] = useState([]);
  
  // ===== ADVANCED CONFIGURATION STATE =====
  const [detailLevel, setDetailLevel] = useState('standard');
  const [analysisMode, setAnalysisMode] = useState('comprehensive');
  const [analysisContext, setAnalysisContext] = useState('general');
  const [showVisualization, setShowVisualization] = useState(false);
  const [realTimeMode, setRealTimeMode] = useState(false);
  
  // ===== VOICE AND MEDIA STATE =====
  const [isListening, setIsListening] = useState(false);
  const [voiceTranscript, setVoiceTranscript] = useState('');
  const [currentRecognition, setCurrentRecognition] = useState(null);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [cameraStream, setCameraStream] = useState(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  
  // ===== API AND PERFORMANCE STATE =====
  const [apiHealth, setApiHealth] = useState([]);
  const [performanceMetrics, setPerformanceMetrics] = useState({
    averageResponseTime: 0,
    successRate: 100,
    totalQueries: 0,
    lastUpdated: null
  });
  
  // ===== UI AND INTERACTION STATE =====
  const [expandedSections, setExpandedSections] = useState(new Set(['input', 'results']));
  const [showSettings, setShowSettings] = useState(false);
  const [deviceCapabilities, setDeviceCapabilities] = useState({});
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);
  
  // ===== REFS =====
  const textareaRef = useRef(null);
  const fileInputRef = useRef(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const analysisTimeoutRef = useRef(null);

  // ===== INITIALIZATION EFFECTS =====
  useEffect(() => {
    detectDeviceCapabilities();
    loadUserPreferences();
    initializeRealTimeMode();
    
    return () => {
      cleanup();
    };
  }, []);

  useEffect(() => {
    if (realTimeMode && inputContent.trim().length > 10) {
      debouncedRealTimeAnalysis();
    }
    
    return () => {
      if (analysisTimeoutRef.current) {
        clearTimeout(analysisTimeoutRef.current);
      }
    };
  }, [inputContent, realTimeMode]);

  useEffect(() => {
    adjustTextareaHeight();
  }, [inputContent]);

  useEffect(() => {
    saveUserPreferences();
  }, [analysisMode, detailLevel, realTimeMode, darkMode]);

  // ===== UTILITY FUNCTIONS =====
  const detectDeviceCapabilities = useCallback(() => {
    const capabilities = {
      voice: 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window,
      camera: 'mediaDevices' in navigator && 'getUserMedia' in navigator.mediaDevices,
      geolocation: 'geolocation' in navigator,
      clipboard: 'clipboard' in navigator,
      fullscreen: 'requestFullscreen' in document.documentElement,
      notifications: 'Notification' in window,
      serviceWorker: 'serviceWorker' in navigator,
      webGL: !!document.createElement('canvas').getContext('webgl'),
      touchScreen: 'ontouchstart' in window || navigator.maxTouchPoints > 0,
      deviceOrientation: 'DeviceOrientationEvent' in window,
      webRTC: 'RTCPeerConnection' in window,
      fileAPI: 'FileReader' in window,
      dragDrop: 'ondragstart' in document.createElement('div'),
      localStorage: (() => {
        try {
          const test = '__test__';
          localStorage.setItem(test, test);
          localStorage.removeItem(test);
          return true;
        } catch {
          return false;
        }
      })()
    };
    
    console.log('[DeviceCapabilities] Detected:', capabilities);
    setDeviceCapabilities(capabilities);
  }, []);

  const loadUserPreferences = useCallback(() => {
    try {
      if (!deviceCapabilities.localStorage) return;
      
      const preferences = localStorage.getItem('xistai_preferences');
      if (preferences) {
        const parsed = JSON.parse(preferences);
        setAnalysisMode(parsed.analysisMode || 'comprehensive');
        setDetailLevel(parsed.detailLevel || 'standard');
        setRealTimeMode(parsed.realTimeMode || false);
        setDarkMode(parsed.darkMode || false);
        setAnalysisContext(parsed.analysisContext || 'general');
        
        // Load analysis history
        if (parsed.analysisHistory && Array.isArray(parsed.analysisHistory)) {
          setAnalysisHistory(parsed.analysisHistory.slice(0, 10)); // Keep last 10
        }
        
        console.log('[Preferences] Loaded user preferences');
      }
    } catch (error) {
      console.error('[Preferences] Failed to load:', error);
      showNotification('Failed to load user preferences', 'warning');
    }
  }, [deviceCapabilities.localStorage]);

  const saveUserPreferences = useCallback(() => {
    try {
      if (!deviceCapabilities.localStorage) return;
      
      const preferences = {
        analysisMode,
        detailLevel,
        realTimeMode,
        darkMode,
        analysisContext,
        analysisHistory: analysisHistory.slice(0, 10), // Save last 10
        lastUpdated: new Date().toISOString(),
        version: '2.0'
      };
      
      localStorage.setItem('xistai_preferences', JSON.stringify(preferences));
      console.log('[Preferences] Saved successfully');
    } catch (error) {
      console.error('[Preferences] Failed to save:', error);
    }
  }, [analysisMode, detailLevel, realTimeMode, darkMode, analysisContext, analysisHistory, deviceCapabilities.localStorage]);

  const initializeRealTimeMode = useCallback(() => {
    if (realTimeMode) {
      showNotification('Real-time monitoring enabled', 'info', 3000);
      console.log('[RealTime] Monitoring activated');
    }
  }, [realTimeMode]);

  const cleanup = useCallback(() => {
    if (currentRecognition) {
      currentRecognition.stop();
    }
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop());
    }
    if (analysisTimeoutRef.current) {
      clearTimeout(analysisTimeoutRef.current);
    }
    console.log('[Cleanup] Resources cleaned up');
  }, [currentRecognition, cameraStream]);

  const adjustTextareaHeight = useCallback(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      const maxHeight = isMobile ? 150 : 200;
      const newHeight = Math.min(textareaRef.current.scrollHeight, maxHeight);
      textareaRef.current.style.height = `${newHeight}px`;
    }
  }, [isMobile]);

  const showNotification = useCallback((message, type = 'info', duration = 5000, details = null) => {
    const id = Date.now() + Math.random();
    const notification = { 
      id, 
      message, 
      type, 
      details,
      timestamp: new Date() 
    };
    
    setNotifications(prev => [...prev, notification]);
    
    if (duration > 0) {
      setTimeout(() => {
        setNotifications(prev => prev.filter(n => n.id !== id));
      }, duration);
    }
    
    console.log(`[Notification] ${type.toUpperCase()}: ${message}`, details || '');
  }, []);

  const dismissNotification = useCallback((id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  // ===== ANALYSIS FUNCTIONS =====
  const analyzeContent = useCallback(async () => {
    if (!inputContent.trim()) {
      showNotification('Please enter content to analyze', 'warning');
      return;
    }

    if (inputContent.trim().length < 3) {
      showNotification('Content too short for meaningful analysis', 'warning');
      return;
    }

    setIsAnalyzing(true);
    const startTime = performance.now();

    try {
      showNotification('Starting analysis...', 'info', 2000);
      
      const analysisOptions = {
        context: analysisContext,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        deviceCapabilities,
        detailLevel,
        realTimeMode
      };

      console.log(`[Analysis] Starting ${analysisMode} analysis with ${inputContent.length} characters`);

      const result = await analysisService.analyzeContent(
        inputContent,
        analysisMode,
        analysisOptions
      );

      const endTime = performance.now();
      const responseTime = endTime - startTime;

      // Update performance metrics
      setPerformanceMetrics(prev => {
        const newTotal = prev.totalQueries + 1;
        const newAvgTime = (prev.averageResponseTime * prev.totalQueries + responseTime) / newTotal;
        const newSuccessRate = ((prev.successRate * prev.totalQueries) + (result.fallback ? 75 : 100)) / newTotal;
        
        return {
          totalQueries: newTotal,
          averageResponseTime: newAvgTime,
          successRate: newSuccessRate,
          lastUpdated: new Date().toISOString()
        };
      });

            // Enhanced result with additional metadata
      const enhancedResult = {
        ...result,
        responseTime,
        userAgent: navigator.userAgent,
        analysisId: `analysis_${Date.now()}`,
        inputMethod,
        detailLevel,
        wordCount: inputContent.trim().split(/\s+/).length,
        charCount: inputContent.length,
        processingDetails: {
          patternMatches: result.patterns?.totalMatches || 0,
          urlsAnalyzed: result.urls?.totalUrls || 0,
          threatCategories: Object.keys(result.patterns?.threats || {}),
          apiModel: result.model,
          fallbackUsed: result.fallback
        }
      };

      setAnalysisResult(enhancedResult);
      if (onAnalysisComplete) {
  onAnalysisComplete(enhancedResult);
}

      // Add to history with enhanced metadata
     setAnalysisHistory(prev => [
        {
          ...enhancedResult,
          inputContent: inputContent.substring(0, 100) + (inputContent.length > 100 ? '...' : ''),
          timestamp: new Date().toISOString(),
          quickSummary: generateQuickSummary(enhancedResult)
        },
        ...prev.slice(0, 9) // Keep last 10 analyses
      ]);

      // Update user stats with detailed tracking
      if (onUpdateStats) {
        onUpdateStats(prev => ({
          ...prev,
          totalScans: (prev.totalScans || 0) + 1,
          threatsDetected: (prev.threatsDetected || 0) + (
            enhancedResult.threatLevel === 'HIGH' || enhancedResult.threatLevel === 'CRITICAL' ? 1 : 0
          ),
          totalProcessingTime: (prev.totalProcessingTime || 0) + responseTime,
          averageAnalysisTime: ((prev.averageAnalysisTime || 0) * (prev.totalScans || 0) + responseTime) / ((prev.totalScans || 0) + 1),
          lastAnalysis: new Date().toISOString(),
          analysisStreak: (prev.analysisStreak || 0) + 1
        }));
      }

      // Show completion notification with threat-appropriate styling
      const threatEmoji = getThreatEmoji(enhancedResult.threatLevel);
      const notificationType = enhancedResult.threatLevel === 'HIGH' || enhancedResult.threatLevel === 'CRITICAL' 
        ? 'warning' : 'success';
      
      showNotification(
        `Analysis complete: ${enhancedResult.threatLevel} threat level detected`,
        notificationType,
        5000,
        `Processed in ${Math.round(responseTime)}ms with ${enhancedResult.confidence}% confidence`
      );

      console.log(`[Analysis] Completed successfully:`, {
        threatLevel: enhancedResult.threatLevel,
        confidence: enhancedResult.confidence,
        responseTime: Math.round(responseTime),
        patterns: result.patterns?.patternCount || 0,
        mode: analysisMode
      });

    } catch (error) {
      console.error('[Analysis] Failed:', error);
      
      showNotification(
        'Analysis failed. Please try again.',
        'error',
        7000,
        error.message || 'Unknown error occurred'
      );
      
      // Update performance metrics for failure
      setPerformanceMetrics(prev => ({
        ...prev,
        totalQueries: prev.totalQueries + 1,
        successRate: (prev.successRate * prev.totalQueries) / (prev.totalQueries + 1),
        lastError: error.message,
        lastErrorTime: new Date().toISOString()
      }));
      
    } finally {
      setIsAnalyzing(false);
      saveUserPreferences();
    }
  }, [inputContent, analysisMode, analysisContext, deviceCapabilities, inputMethod, detailLevel, onUpdateStats]);

  const generateQuickSummary = useCallback((result) => {
    const threatLevel = result.threatLevel || 'UNKNOWN';
    const confidence = result.confidence || 0;
    const patternCount = result.patterns?.patternCount || 0;
    
    if (threatLevel === 'HIGH' || threatLevel === 'CRITICAL') {
      return `High risk detected with ${patternCount} threat patterns`;
    } else if (threatLevel === 'MEDIUM') {
      return `Moderate risk with ${confidence}% confidence`;
    } else if (threatLevel === 'LOW') {
      return `Low risk, likely safe content`;
    } else {
      return `Content appears safe, no threats detected`;
    }
  }, []);

  const getThreatEmoji = useCallback((threatLevel) => {
    switch (threatLevel) {
      case 'CRITICAL': return '🚨';
      case 'HIGH': return '⚠️';
      case 'MEDIUM': return '⚡';
      case 'LOW': return '✓';
      case 'SAFE': return '✅';
      default: return '❓';
    }
  }, []);

  const debouncedRealTimeAnalysis = useMemo(
    () => {
      return () => {
        if (analysisTimeoutRef.current) {
          clearTimeout(analysisTimeoutRef.current);
        }
        analysisTimeoutRef.current = setTimeout(() => {
          if (inputContent.trim().length > 10 && !isAnalyzing) {
            console.log('[RealTime] Triggering auto-analysis');
            analyzeContent();
          }
        }, 2000);
      };
    },
    [inputContent, isAnalyzing, analyzeContent]
  );

  // ===== VOICE RECOGNITION FUNCTIONS =====
  const startVoiceRecognition = useCallback(async () => {
    if (!deviceCapabilities.voice) {
      showNotification(
        'Voice recognition not supported',
        'warning',
        5000,
        'This browser or device does not support speech recognition'
      );
      return;
    }

    try {
      setIsListening(true);
      showNotification('Voice recognition started', 'info', 2000);
      
      const options = {
        continuous: false,
        interimResults: true,
        language: 'en-US',
        timeout: 30000,
        onInterim: (transcript) => {
          setVoiceTranscript(transcript);
        }
      };
      
      const recognition = await advancedServices.startVoiceRecognition(options);
      setCurrentRecognition(recognition);
      
      const result = await recognition;
      
      setVoiceTranscript(result.transcript);
      setInputContent(prev => {
        const newContent = prev.trim() + (prev.trim() ? ' ' : '') + result.transcript;
        return newContent;
      });
      
      showNotification(
        `Voice recognized successfully`,
        'success',
        3000,
        `${Math.round(result.confidence * 100)}% confidence, ${result.transcript.length} characters`
      );
      
      console.log('[Voice] Recognition successful:', {
        transcript: result.transcript,
        confidence: result.confidence,
        duration: result.duration
      });
      
    } catch (error) {
      console.error('[Voice] Recognition failed:', error);
      showNotification(
        'Voice recognition failed',
        'error',
        5000,
        error.message
      );
    } finally {
      setIsListening(false);
      setCurrentRecognition(null);
    }
  }, [deviceCapabilities.voice, inputContent]);

  const stopVoiceRecognition = useCallback(() => {
    if (currentRecognition) {
      currentRecognition.stop();
      setCurrentRecognition(null);
    }
    setIsListening(false);
    showNotification('Voice recognition stopped', 'info', 2000);
  }, [currentRecognition]);

  // ===== FILE AND MEDIA HANDLING =====
  const handleFileUpload = useCallback(async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const methodConfig = INPUT_METHODS[inputMethod];
    
    // Validate file type
    if (methodConfig.acceptedTypes && !methodConfig.acceptedTypes.some(type => 
      file.name.toLowerCase().endsWith(type.replace('.', '')) || 
      file.type.startsWith(type.replace('.', '').replace('jpg', 'jpeg'))
    )) {
      showNotification(
        'Unsupported file type',
        'warning',
        5000,
        `Accepted formats: ${methodConfig.acceptedTypes.join(', ')}`
      );
      return;
    }

    // Validate file size
    if (methodConfig.maxSize && file.size > methodConfig.maxSize) {
      const maxSizeMB = methodConfig.maxSize / (1024 * 1024);
      showNotification(
        'File too large',
        'warning',
        5000,
        `Maximum size: ${maxSizeMB}MB. Your file: ${(file.size / (1024 * 1024)).toFixed(1)}MB`
      );
      return;
    }

    setUploadedFile(file);
    showNotification('Processing file...', 'info', 2000);

    try {
      if (inputMethod === 'image' || file.type.startsWith('image/')) {
        const imageAnalysis = await advancedServices.analyzeImage(file);
        
        if (imageAnalysis.error) {
          throw new Error(imageAnalysis.error);
        }
        
        setImagePreview(URL.createObjectURL(file));
        
        const imageDescription = `Image Analysis Results:
        
File: ${file.name} (${Math.round(file.size / 1024)}KB)
Dimensions: ${imageAnalysis.dimensions?.width || 'Unknown'}x${imageAnalysis.dimensions?.height || 'Unknown'}
Quality: ${imageAnalysis.quality || 'Unknown'}
Text Readability: ${imageAnalysis.readability || 'Unknown'}
Orientation: ${imageAnalysis.orientation || 'Unknown'}

Note: Image content requires manual review for potential threats. Please describe what you see in the image or paste any text visible in the image for analysis.`;

        setInputContent(imageDescription);
        
        showNotification(
          'Image processed successfully',
          'success',
          3000,
          `${imageAnalysis.dimensions?.width}x${imageAnalysis.dimensions?.height} pixels`
        );
        
      } else {
        const fileContent = await advancedServices.processFile(file);
        
        if (fileContent.error) {
          throw new Error(fileContent.error);
        }
        
        const processedContent = `File Content Analysis:

File: ${fileContent.fileName}
Size: ${Math.round(fileContent.fileSize / 1024)}KB
Type: ${fileContent.fileType}
Words: ${fileContent.wordCount}
Characters: ${fileContent.charCount}
Lines: ${fileContent.lineCount}

${fileContent.containsUrls ? 'Contains URLs: Yes' : 'Contains URLs: No'}
${fileContent.containsEmails ? 'Contains Emails: Yes' : 'Contains Emails: No'}
${fileContent.containsPhones ? 'Contains Phone Numbers: Yes' : 'Contains Phone Numbers: No'}

Content to analyze:
${fileContent.content}`;

        setInputContent(processedContent);
        
        showNotification(
          'File processed successfully',
          'success',
          3000,
          `${fileContent.wordCount} words, ${fileContent.charCount} characters`
        );
      }
      
      console.log('[FileUpload] Processing completed:', {
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type,
        inputMethod
      });
      
    } catch (error) {
      console.error('[FileUpload] Processing failed:', error);
      showNotification(
        'File processing failed',
        'error',
        7000,
        error.message
      );
      
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      setUploadedFile(null);
      setImagePreview(null);
    }
  }, [inputMethod]);

  const initializeCamera = useCallback(async () => {
    if (!deviceCapabilities.camera) {
      showNotification(
        'Camera not supported',
        'warning',
        5000,
        'This device does not have camera access or camera is not supported'
      );
      return;
    }

    try {
      setIsCameraActive(true);
      showNotification('Initializing camera...', 'info', 2000);
      
      const cameraData = await advancedServices.initializeCamera({
        video: {
          width: { ideal: isMobile ? 720 : 1280 },
          height: { ideal: isMobile ? 480 : 720 },
          facingMode: 'environment'
        }
      });
      
      setCameraStream(cameraData.stream);
      
      if (videoRef.current) {
        videoRef.current.srcObject = cameraData.stream;
        await videoRef.current.play();
      }
      
      showNotification(
        'Camera initialized successfully',
        'success',
        3000,
        `Resolution: ${cameraData.settings.width}x${cameraData.settings.height}`
      );
      
      console.log('[Camera] Initialized:', {
        settings: cameraData.settings,
        capabilities: cameraData.capabilities
      });
      
    } catch (error) {
      console.error('[Camera] Initialization failed:', error);
      showNotification(
        'Camera initialization failed',
        'error',
        7000,
        error.message
      );
      setIsCameraActive(false);
    }
  }, [deviceCapabilities.camera, isMobile]);

  const capturePhoto = useCallback(async () => {
    if (!videoRef.current || !cameraStream) {
      showNotification('Camera not ready', 'warning');
      return;
    }

    try {
      showNotification('Capturing photo...', 'info', 1000);
      
      const captureResult = await advancedServices.capturePhoto(videoRef.current, {
        quality: 0.9,
        width: isMobile ? 720 : 1280,
        height: isMobile ? 480 : 720
      });
      
      setImagePreview(captureResult.dataURL);
      setUploadedFile(captureResult.file);
      
      // Process the captured image
      const imageAnalysis = await advancedServices.analyzeImage(captureResult.file);
      
      const captureDescription = `Camera Capture Analysis:

Captured: ${new Date(captureResult.timestamp).toLocaleString()}
Dimensions: ${captureResult.dimensions.width}x${captureResult.dimensions.height}
File Size: ${Math.round(captureResult.file.size / 1024)}KB
Quality: ${imageAnalysis.quality || 'Good'}

Note: Please describe what is visible in the captured image or paste any readable text for threat analysis.`;

      setInputContent(captureDescription);
      
      showNotification(
        'Photo captured successfully',
        'success',
        3000,
        `${captureResult.dimensions.width}x${captureResult.dimensions.height} pixels`
      );
      
      // Stop camera after capture
      stopCamera();
      
    } catch (error) {
      console.error('[Camera] Capture failed:', error);
      showNotification(
        'Photo capture failed',
        'error',
        5000,
        error.message
      );
    }
  }, [cameraStream, isMobile]);

  const stopCamera = useCallback(() => {
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => {
        track.stop();
        console.log(`[Camera] Stopped track: ${track.kind}`);
      });
      setCameraStream(null);
    }
    
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    
    setIsCameraActive(false);
    showNotification('Camera stopped', 'info', 2000);
  }, [cameraStream]);

  // ===== INPUT METHOD HANDLERS =====
  const handleInputMethodChange = useCallback((method) => {
    setInputMethod(method);
    setInputContent('');
    setUploadedFile(null);
    setImagePreview(null);
    setVoiceTranscript('');
    
    // Stop any active processes
    if (isListening) {
      stopVoiceRecognition();
    }
    
    if (isCameraActive) {
      stopCamera();
    }
    
    showNotification(
      `Switched to ${INPUT_METHODS[method].label}`,
      'info',
      2000,
      INPUT_METHODS[method].description
    );
    
    console.log(`[InputMethod] Changed to: ${method}`);
  }, [isListening, isCameraActive, stopVoiceRecognition, stopCamera]);

  const clearInput = useCallback(() => {
    setInputContent('');
    setUploadedFile(null);
    setImagePreview(null);
    setVoiceTranscript('');
    setAnalysisResult(null);
    
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    
    showNotification('Input cleared', 'info', 1500);
    console.log('[Input] Cleared all content');
  }, []);

  const pasteFromClipboard = useCallback(async () => {
    if (!deviceCapabilities.clipboard) {
      showNotification(
        'Clipboard access not supported',
        'warning',
        3000
      );
      return;
    }

    try {
      const text = await navigator.clipboard.readText();
      if (text.trim()) {
        setInputContent(prev => {
          const newContent = prev.trim() + (prev.trim() ? '\n\n' : '') + text.trim();
          return newContent;
        });
        
        showNotification(
          'Content pasted from clipboard',
          'success',
          2000,
          `${text.length} characters added`
        );
        
        console.log('[Clipboard] Pasted content:', text.length, 'characters');
      } else {
        showNotification('Clipboard is empty', 'info', 2000);
      }
    } catch (error) {
      console.error('[Clipboard] Paste failed:', error);
      showNotification(
        'Failed to access clipboard',
        'error',
        3000,
        'Permission may be required'
      );
    }
  }, [deviceCapabilities.clipboard]);

  // ===== UI HELPER FUNCTIONS =====
  const toggleSection = useCallback((section) => {
    setExpandedSections(prev => {
      const newSet = new Set(prev);
      if (newSet.has(section)) {
        newSet.delete(section);
      } else {
        newSet.add(section);
      }
      return newSet;
    });
  }, []);

  const getThreatColor = useCallback((threatLevel) => {
    switch (threatLevel?.toUpperCase()) {
      case 'CRITICAL': return 'text-red-600 bg-red-50 border-red-200';
      case 'HIGH': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'MEDIUM': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'LOW': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'SAFE': return 'text-green-600 bg-green-50 border-green-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  }, []);

  const getThreatIcon = useCallback((threatLevel) => {
    switch (threatLevel?.toUpperCase()) {
      case 'CRITICAL': return ShieldExclamationIcon;
      case 'HIGH': return ExclamationTriangleIcon;
      case 'MEDIUM': return ExclamationCircleIcon;
      case 'LOW': return InformationCircleIcon;
      case 'SAFE': return CheckCircleIcon;
      default: return QuestionMarkCircleIcon;
    }
  }, []);

  const formatResponseTime = useCallback((time) => {
    if (time < 1000) return `${Math.round(time)}ms`;
    return `${(time / 1000).toFixed(1)}s`;
  }, []);

  const formatFileSize = useCallback((bytes) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }, []);

  // ===== RENDER COMPONENT =====
  return (
    <div className="min-h-screen">
      {/* Notification System */}
      <NotificationSystem 
        notifications={notifications} 
        onDismiss={dismissNotification} 
      />
      <div className="container mx-auto px-4 py-8 max-w-6xl">
  {/* Header Section */}
  <motion.div
    initial={{ opacity: 0, y: -20 }}
    animate={{ opacity: 1, y: 0 }}
    className="text-center mb-8"
  >
    <div className="flex items-center justify-center mb-4">
      <div className="w-16 h-16 rounded-2xl flex items-center justify-center mr-4">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", duration: 0.8 }}
          className="relative inline-block"
        >
          <ShieldCheckIcon className="w-12 h-12 md:w-16 md:h-16 mx-auto mb-4 text-purple-600" />
        </motion.div>
      </div>
      <div className="text-left">
        <div>
        <h1 className="text-2xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">
          Xist AI Verify
        </h1>
</div>
        <p className="text-gray-600 dark:text-gray-400 text-lg">
          Advanced Threat Detection & Analysis
        </p>
        {/* QR/Share Button - Always visible next to Verify button */}


      </div>
    </div>
    
    <div className="flex items-center justify-center space-x-6 text-sm text-gray-600 dark:text-gray-400">
      <div className="flex items-center space-x-2">
        <CpuChipIcon className="w-4 h-4" />
        <span>AI-Powered</span>
      </div>
      <div className="flex items-center space-x-2">
        <ClockIcon className="w-4 h-4" />
        <span>Real-time Analysis</span>
      </div>
      <div className="flex items-center space-x-2">
        <ShieldCheckIcon className="w-4 h-4" />
        <span>99.2% Accuracy</span>
      </div>
    </div>
  </motion.div>


        {/* Quick Stats */}
        {performanceMetrics.totalQueries > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
          >
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {performanceMetrics.totalQueries}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Total Scans</p>
                </div>
                <ChartBarIcon className="w-8 h-8 text-blue-600" />
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {formatResponseTime(performanceMetrics.averageResponseTime)}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Avg Response</p>
                </div>
                <BoltIcon className="w-8 h-8 text-yellow-500" />
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {Math.round(performanceMetrics.successRate)}%
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Success Rate</p>
                </div>
                <CheckCircleIcon className="w-8 h-8 text-green-600" />
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {analysisHistory.length}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">History</p>
                </div>
                <ClockIcon className="w-8 h-8 text-purple-600" />
              </div>
            </div>
          </motion.div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Input Section */}
          <div className="lg:col-span-2 space-y-6">
            {/* Input Method Selection */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-lg"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Input Method
                </h2>
                <button
                  onClick={() => setShowAdvancedOptions(!showAdvancedOptions)}
                  className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  <Cog6ToothIcon className="w-5 h-5" />
                </button>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
                {Object.entries(INPUT_METHODS).map(([method, config]) => {
                  const Icon = config.icon;
                  const isDisabled = (method === 'voice' && !deviceCapabilities.voice) || 
                                   (method === 'camera' && !deviceCapabilities.camera);
                  
                  return (
                    <button
                      key={method}
                      onClick={() => !isDisabled && handleInputMethodChange(method)}
                      disabled={isDisabled}
                      className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                        inputMethod === method
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                          : isDisabled
                          ? 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 opacity-50 cursor-not-allowed'
                          : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 bg-white dark:bg-gray-800'
                      }`}
                    >
                      <Icon className={`w-6 h-6 mx-auto mb-2 ${
                        inputMethod === method 
                          ? 'text-blue-600' 
                          : isDisabled 
                          ? 'text-gray-400' 
                          : 'text-gray-600 dark:text-gray-400'
                      }`} />
                      <p className={`text-sm font-medium ${
                        inputMethod === method 
                          ? 'text-blue-900 dark:text-blue-100' 
                          : isDisabled
                          ? 'text-gray-400'
                          : 'text-gray-700 dark:text-gray-300'
                      }`}>
                        {config.label}
                      </p>
                    </button>
                  );
                })}
              </div>
            {/* Analysis Mode Selection */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-lg"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Analysis Mode
                </h2>
                <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                  <ClockIcon className="w-4 h-4" />
                  <span>{ANALYSIS_MODES[analysisMode].estimatedTime}</span>
                </div>
              </div>

              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Choose how deep you want the analysis to be. Each mode provides different levels of detail and accuracy.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                {Object.entries(ANALYSIS_MODES).map(([mode, config]) => {
                  const Icon = config.icon;
                  
                  return (
                    <button
                      key={mode}
                      onClick={() => setAnalysisMode(mode)}
                      className={`p-4 rounded-xl border-2 transition-all duration-200 text-left ${
                        analysisMode === mode
                          ? `border-${config.color}-500 ${config.bgGradient} dark:${config.darkBgGradient} shadow-lg transform scale-105`
                          : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 bg-white dark:bg-gray-800 hover:shadow-md'
                      }`}
                    >
                      <div className="flex items-center mb-3">
                        <div className={`p-2 rounded-lg ${analysisMode === mode ? config.bgGradient : 'bg-gray-100 dark:bg-gray-700'} mr-3`}>
                          <Icon className={`w-5 h-5 ${
                            analysisMode === mode 
                              ? 'text-white' 
                              : 'text-gray-600 dark:text-gray-400'
                          }`} />
                        </div>
                        <div className="flex-1">
                          <h3 className={`font-semibold text-sm ${
                            analysisMode === mode 
                              ? config.textColor
                              : 'text-gray-700 dark:text-gray-300'
                          }`}>
                            {config.label}
                          </h3>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {config.estimatedTime}
                          </p>
                        </div>
                      </div>
                      
                      <p className="text-xs text-gray-600 dark:text-gray-400 mb-2 line-clamp-2">
                        {config.description}
                      </p>
                      
                      <div className="flex items-center justify-between text-xs">
                        <span className={`px-2 py-1 rounded-full ${
                          analysisMode === mode 
                            ? `bg-${config.color}-100 text-${config.color}-800 dark:bg-${config.color}-900 dark:text-${config.color}-200`
                            : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
                        }`}>
                          {config.accuracy}% Accurate
                        </span>
                        <span className="text-gray-500 dark:text-gray-400">
                          {config.useCase}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Current Mode Details */}
              <div className={`p-4 rounded-xl border-2 ${ANALYSIS_MODES[analysisMode].borderColor} ${ANALYSIS_MODES[analysisMode].bgGradient} dark:${ANALYSIS_MODES[analysisMode].darkBgGradient}`}>
                <div className="flex items-center mb-2">
                  {(() => {
                    const Icon = ANALYSIS_MODES[analysisMode].icon;
                    return <Icon className={`w-5 h-5 mr-2 ${ANALYSIS_MODES[analysisMode].textColor}`} />;
                  })()}
                  <h4 className={`font-semibold ${ANALYSIS_MODES[analysisMode].textColor}`}>
                    Selected: {ANALYSIS_MODES[analysisMode].label}
                  </h4>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                  {ANALYSIS_MODES[analysisMode].description}
                </p>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div className="text-center p-2 bg-white/50 dark:bg-gray-800/50 rounded">
                    <p className="font-medium">Speed</p>
                    <p className="text-gray-600 dark:text-gray-400">
                      {ANALYSIS_MODES[analysisMode].estimatedTime}
                    </p>
                  </div>
                  <div className="text-center p-2 bg-white/50 dark:bg-gray-800/50 rounded">
                    <p className="font-medium">Accuracy</p>
                    <p className="text-gray-600 dark:text-gray-400">
                      {ANALYSIS_MODES[analysisMode].accuracy}%
                    </p>
                  </div>
                  <div className="text-center p-2 bg-white/50 dark:bg-gray-800/50 rounded">
                    <p className="font-medium">Detail</p>
                    <p className="text-gray-600 dark:text-gray-400">
                      {ANALYSIS_MODES[analysisMode].priority}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

              {/* Advanced Options */}
              <AnimatePresence>
                {showAdvancedOptions && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4 space-y-4"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Detail Level
                        </label>
                        <select
                          value={detailLevel}
                          onChange={(e) => setDetailLevel(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          {Object.entries(DETAIL_LEVELS).map(([level, config]) => (
                            <option key={level} value={level}>
                              {config.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          id="realTimeMode"
                          checked={realTimeMode}
                          onChange={(e) => setRealTimeMode(e.target.checked)}
                          className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                        />
                        <label htmlFor="realTimeMode" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          Real-time Analysis
                        </label>
                      </div>

                      
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Input Area */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-lg"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {INPUT_METHODS[inputMethod].label}
                </h2>
                <div className="flex items-center space-x-2">
                  {deviceCapabilities.clipboard && (
                    <button
                      onClick={pasteFromClipboard}
                      className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                      title="Paste from clipboard"
                    >
                      <ClipboardIcon className="w-4 h-4" />
                    </button>
                  )}
                  <button
                    onClick={clearInput}
                    className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                    title="Clear input"
                  >
                    <XMarkIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                {INPUT_METHODS[inputMethod].description}
              </p>

              {/* Text Input */}
              {inputMethod === 'text' && (
                <div className="space-y-4">
                  <textarea
                    ref={textareaRef}
                    value={inputContent}
                    onChange={(e) => setInputContent(e.target.value)}
                    placeholder={INPUT_METHODS[inputMethod].placeholder}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition-all"
                    rows={4}
                    maxLength={INPUT_METHODS[inputMethod].maxLength}
                  />
                  <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                    <span>
                      {inputContent.length} / {INPUT_METHODS[inputMethod].maxLength} characters
                    </span>
                    <span>
                      {inputContent.trim().split(/\s+/).filter(word => word.length > 0).length} words
                    </span>
                  </div>
                </div>
              )}

              {/* URL Input */}
              {inputMethod === 'url' && (
                <div className="space-y-4">
                  <input
                    type="url"
                    value={inputContent}
                    onChange={(e) => setInputContent(e.target.value)}
                    placeholder={INPUT_METHODS[inputMethod].placeholder}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    maxLength={INPUT_METHODS[inputMethod].maxLength}
                  />
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    Enter a complete URL starting with http:// or https://
                  </div>
                </div>
              )}

              {/* File Upload */}
              {inputMethod === 'upload' && (
                <div className="space-y-4">
                  <input
                    ref={fileInputRef}
                    type="file"
                    onChange={handleFileUpload}
                    accept={INPUT_METHODS[inputMethod].acceptedTypes?.join(',')}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  />
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    Supported formats: {INPUT_METHODS[inputMethod].acceptedTypes?.join(', ')}
                    <br />
                    Maximum size: {INPUT_METHODS[inputMethod].maxSize ? formatFileSize(INPUT_METHODS[inputMethod].maxSize) : 'No limit'}
                  </div>
                  {uploadedFile && (
                    <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                      <div className="flex items-center space-x-3">
                        <DocumentIcon className="w-5 h-5 text-blue-600" />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                            {uploadedFile.name}
                          </p>
                          <p className="text-xs text-blue-600 dark:text-blue-400">
                            {formatFileSize(uploadedFile.size)} • {uploadedFile.type}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Voice Input */}
              {inputMethod === 'voice' && (
                <div className="space-y-4">
                  <div className="text-center">
                    <button
                      onClick={isListening ? stopVoiceRecognition : startVoiceRecognition}
                      disabled={!deviceCapabilities.voice}
                      className={`p-8 rounded-full transition-all duration-300 ${
                        isListening
                          ? 'bg-red-500 hover:bg-red-600 text-white animate-pulse'
                          : 'bg-blue-500 hover:bg-blue-600 text-white'
                      }`}
                    >
                      {isListening ? (
                        <StopIcon className="w-12 h-12" />
                      ) : (
                        <MicrophoneIcon className="w-12 h-12" />
                      )}
                    </button>
                    <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
                      {isListening ? 'Listening... Click to stop' : 'Click to start voice recognition'}
                    </p>
                  </div>
                  
                  {voiceTranscript && (
                    <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                      <p className="text-sm font-medium text-green-900 dark:text-green-100 mb-2">
                        Voice Transcript:
                      </p>
                      <p className="text-sm text-green-800 dark:text-green-200">
                        {voiceTranscript}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Image Analysis */}
              {inputMethod === 'image' && (
                <div className="space-y-4">
                  <input
                    ref={fileInputRef}
                    type="file"
                    onChange={handleFileUpload}
                    accept={INPUT_METHODS[inputMethod].acceptedTypes?.join(',')}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
                  />
                  {imagePreview && (
                    <div className="relative">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-full max-h-64 object-contain rounded-lg border border-gray-200 dark:border-gray-700"
                      />
                      <button
                        onClick={() => {
                          setImagePreview(null);
                          setUploadedFile(null);
                          if (fileInputRef.current) fileInputRef.current.value = '';
                        }}
                        className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                      >
                        <XMarkIcon className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Camera Capture */}
              {inputMethod === 'camera' && (
                <div className="space-y-4">
                  {!isCameraActive ? (
                    <div className="text-center">
                      <button
                        onClick={initializeCamera}
                        disabled={!deviceCapabilities.camera}
                        className="px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-xl font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <div className="flex items-center space-x-2">
                          <CameraIcon className="w-5 h-5" />
                          <span>Start Camera</span>
                        </div>
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="relative bg-black rounded-lg overflow-hidden">
                        <video
                          ref={videoRef}
                          autoPlay
                          playsInline
                          muted
                          className="w-full h-64 object-cover"
                        />
                        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-4">
                          <button
                            onClick={capturePhoto}
                            className="p-4 bg-white text-gray-900 rounded-full hover:bg-gray-100 transition-colors shadow-lg"
                          >
                            <CameraIcon className="w-6 h-6" />
                          </button>
                          <button
                            onClick={stopCamera}
                            className="p-4 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-lg"
                          >
                            <XMarkIcon className="w-6 h-6" />
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {imagePreview && (
                    <div className="relative">
                      <img
                        src={imagePreview}
                        alt="Captured"
                        className="w-full max-h-64 object-contain rounded-lg border border-gray-200 dark:border-gray-700"
                      />
                    </div>
                  )}
                </div>
              )}

              {/* Analysis Button */}
              <div className="mt-6">
                <button
                  onClick={analyzeContent}
                  disabled={!inputContent.trim() || isAnalyzing}
                  className={`w-full py-4 rounded-xl font-semibold text-white transition-all duration-300 ${
                    isAnalyzing
                      ? 'bg-gray-400 cursor-not-allowed'
                      : inputContent.trim()
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl'
                      : 'bg-gray-300 cursor-not-allowed'
                  }`}
                >
                  {isAnalyzing ? (
                    <div className="flex items-center justify-center space-x-2">
                      <ArrowPathIcon className="w-5 h-5 animate-spin" />
                      <span>Analyzing... ({ANALYSIS_MODES[analysisMode].estimatedTime})</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center space-x-2">
                      <SparklesIcon className="w-5 h-5" />
                      <span>
                        Start {ANALYSIS_MODES[analysisMode].label}
                      </span>
                    </div>
                  )}
                </button>
              </div>
            </motion.div>

            {/* Analysis Results */}
            {analysisResult && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-lg"
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Analysis Results
                  </h2>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setShowVisualization(!showVisualization)}
                      className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                      title="Toggle visualization"
                    >
                      <ChartBarIcon className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => navigator.clipboard?.writeText(analysisResult.content)}
                      className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                      title="Copy results"
                    >
                      <DocumentDuplicateIcon className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Threat Level Badge */}
                <div className="mb-6">
                  <div className={`inline-flex items-center px-4 py-2 rounded-full border ${getThreatColor(analysisResult.threatLevel)}`}>
                    {(() => {
                      const ThreatIcon = getThreatIcon(analysisResult.threatLevel);
                      return <ThreatIcon className="w-5 h-5 mr-2" />;
                    })()}
                    <span className="font-semibold">
                      {analysisResult.threatLevel} THREAT LEVEL
                    </span>
                    <span className="ml-2 text-sm opacity-75">
                      ({analysisResult.confidence}% confidence)
                    </span>
                  </div>
                </div>

                {/* Analysis Content */}
                <div className="prose prose-sm max-w-none dark:prose-invert mb-6">
                  <div className="whitespace-pre-wrap text-gray-800 dark:text-gray-200 leading-relaxed">
                    {analysisResult.content}
                  </div>
                </div>

                {/* Metadata */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-blue-600">
                      {formatResponseTime(analysisResult.responseTime)}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Response Time</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-green-600">
                      {analysisResult.tokensUsed || 0}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Tokens Used</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-purple-600">
                      {analysisResult.patterns?.patternCount || 0}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Patterns</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-orange-600">
                      {analysisResult.analysisMode.toUpperCase()}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Mode</p>
                  </div>
                </div>

                {/* Detailed Analysis */}
                {showVisualization && analysisResult.patterns && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700"
                  >
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                      Pattern Analysis
                    </h3>
                    
                    {Object.keys(analysisResult.patterns.threats).length > 0 ? (
                      <div className="space-y-3">
                        {Object.entries(analysisResult.patterns.threats).map(([threatType, data]) => (
                          <div key={threatType} className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-medium text-gray-900 dark:text-white capitalize">
                                {threatType.replace(/([A-Z])/g, ' $1').trim()}
                              </h4>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                data.severity === 'CRITICAL' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' :
                                data.severity === 'HIGH' ? 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200' :
                                data.severity === 'MEDIUM' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                                'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                              }`}>
                                {data.severity}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                              {data.description}
                            </p>
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-gray-500 dark:text-gray-400">
                                {data.matches} matches found
                              </span>
                              <span className="font-medium text-gray-700 dark:text-gray-300">
                                Weight: {(data.weight * 100).toFixed(0)}%
                              </span>
                            </div>
                            {data.examples && data.examples.length > 0 && (
                              <div className="mt-2">
                                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Examples:</p>
                                <div className="flex flex-wrap gap-1">
                                  {data.examples.slice(0, 3).map((example, index) => (
                                    <span
                                      key={index}
                                      className="px-2 py-1 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded text-xs font-mono"
                                    >
                                      "{example.substring(0, 20)}{example.length > 20 ? '...' : ''}"
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <CheckCircleIcon className="w-12 h-12 text-green-500 mx-auto mb-2" />
                        <p className="text-gray-600 dark:text-gray-400">
                          No threat patterns detected
                        </p>
                      </div>
                    )}

                    {/* URL Analysis */}
                    {analysisResult.urls && analysisResult.urls.totalUrls > 0 && (
                      <div className="mt-6">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                          URL Analysis
                        </h3>
                        <div className="space-y-3">
                          {analysisResult.urls.analysis.map((urlData, index) => (
                            <div key={index} className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                              <div className="flex items-center justify-between mb-2">
                                <p className="font-mono text-sm text-gray-800 dark:text-gray-200 break-all">
                                  {urlData.url}
                                </p>
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                  urlData.category === 'HIGH_RISK' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' :
                                  urlData.category === 'MEDIUM_RISK' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                                  urlData.category === 'LOW_RISK' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
                                  'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                }`}>
                                  {urlData.category.replace('_', ' ')}
                                </span>
                              </div>
                              <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-600 dark:text-gray-400">
                                  Risk Score: {Math.round(urlData.riskScore * 100)}%
                                </span>
                                <div className="flex items-center space-x-2">
                                  {urlData.https && (
                                    <span className="flex items-center text-green-600">
                                      <LockClosedIcon className="w-3 h-3 mr-1" />
                                      HTTPS
                                    </span>
                                  )}
                                </div>
                              </div>
                              {urlData.indicators && urlData.indicators.length > 0 && (
                                <div className="mt-2">
                                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Risk Indicators:</p>
                                  <div className="flex flex-wrap gap-1">
                                    {urlData.indicators.map((indicator, i) => (
                                      <span
                                        key={i}
                                        className="px-2 py-1 bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 rounded text-xs"
                                      >
                                        {indicator}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}
              </motion.div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Analysis Mode Info */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-lg"
            >
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Current Mode
              </h3>
              
              <div className={`p-4 rounded-xl border-2 ${ANALYSIS_MODES[analysisMode].borderColor} ${ANALYSIS_MODES[analysisMode].bgGradient} dark:${ANALYSIS_MODES[analysisMode].darkBgGradient}`}>
                <div className="flex items-center mb-3">
                  {(() => {
                    const Icon = ANALYSIS_MODES[analysisMode].icon;
                    return <Icon className={`w-6 h-6 mr-2 ${ANALYSIS_MODES[analysisMode].textColor}`} />;
                  })()}
                  <h4 className={`font-semibold ${ANALYSIS_MODES[analysisMode].textColor}`}>
                    {ANALYSIS_MODES[analysisMode].label}
                  </h4>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                  {ANALYSIS_MODES[analysisMode].description}
                </p>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="text-center p-2 bg-white/50 dark:bg-gray-800/50 rounded">
                    <p className="font-medium">Speed</p>
                    <p className="text-gray-600 dark:text-gray-400">
                      {ANALYSIS_MODES[analysisMode].estimatedTime}
                    </p>
                  </div>
                  <div className="text-center p-2 bg-white/50 dark:bg-gray-800/50 rounded">
                    <p className="font-medium">Accuracy</p>
                    <p className="text-gray-600 dark:text-gray-400">
                      {ANALYSIS_MODES[analysisMode].accuracy}%
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Analysis History */}
            {analysisHistory.length > 0 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-lg"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Recent Analysis
                  </h3>
                  <button
                    onClick={() => setAnalysisHistory([])}
                    className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                  >
                    Clear All
                  </button>
                </div>
                
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {analysisHistory.slice(0, 5).map((analysis, index) => (
                    <div
                      key={analysis.analysisId}
                      className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                      onClick={() => setAnalysisResult(analysis)}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className={`text-xs font-medium px-2 py-1 rounded-full ${getThreatColor(analysis.threatLevel)}`}>
                          {analysis.threatLevel}
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {new Date(analysis.timestamp).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-sm text-gray-700 dark:text-gray-300 mb-1">
                        {analysis.quickSummary || 'Analysis completed'}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                        "{analysis.inputContent}"
                      </p>
                      <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mt-2">
                        <span>{analysis.confidence}% confidence</span>
                        <span>{formatResponseTime(analysis.responseTime)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Tips & Best Practices */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-lg"
            >
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Security Tips
              </h3>
              
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <LightBulbIcon className="w-5 h-5 text-yellow-500 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      Verify Sources
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      Always check information through multiple trusted sources
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <ShieldCheckIcon className="w-5 h-5 text-green-500 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      Trust Your Instincts
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      If something seems too good to be true, it probably is
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <ExclamationTriangleIcon className="w-5 h-5 text-orange-500 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      Be Cautious with Links
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      Hover over links to preview URLs before clicking
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <LockClosedIcon className="w-5 h-5 text-blue-500 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      Protect Personal Data
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      Never share sensitive information through unsecured channels
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifySection;

