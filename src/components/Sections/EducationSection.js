import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  PlayIcon, ClockIcon, QuestionMarkCircleIcon, 
  ArrowRightIcon, ArrowLeftIcon, XMarkIcon, AcademicCapIcon, 
  CpuChipIcon, ArrowTopRightOnSquareIcon, FunnelIcon
} from '@heroicons/react/24/outline';
import { showNotification } from '../UI/NotificationToast';

const useTypewriter = (text, speed = 60, delay = 200) => {
  const [displayedText, setDisplayedText] = useState("");
  const [started, setStarted] = useState(false);
  useEffect(() => { const timeout = setTimeout(() => setStarted(true), delay); return () => clearTimeout(timeout); }, [delay]);
  useEffect(() => {
    if (!started) return;
    if (displayedText.length < text.length) {
      const timeout = setTimeout(() => { setDisplayedText(text.slice(0, displayedText.length + 1)); }, speed);
      return () => clearTimeout(timeout);
    }
  }, [displayedText, text, speed, started]);
  return displayedText;
};

// ==============================
// 20 ACTIVE CYBER MODULES (2024/2025 VERIFIED)
// ==============================
const educationContent = [
  {
    // 🚀 NEW VIDEO REPLACEMENT: Guaranteed Embeddable 2026 OSINT Masterclass
    id: 1, 
    title: 'OSINT Course 2026: The Complete Intelligence Cycle', 
    category: 'OSINT', 
    duration: '1h 2m', 
    creator: 'Simplilearn', 
    videoId: 'luk-9Ld-NPs',
    content: 'Explore real-world OSINT tools like Google Dorking, Maltego, Shodan, and ExifTool while learning how to ethically gather, clean, and verify publicly available data.',
    quiz: [
      { 
        question: 'What does the OSINT Intelligence Cycle primarily consist of?', 
        options: ['Hacking, Cracking, and Leaking', 'Direction, Collection, Processing, Analysis, and Dissemination', 'Installing firewalls and antivirus software', 'Writing code and developing software'], 
        correct: 1 
      },
      { 
        question: 'Which tool is commonly used to search for specific connected devices and servers (like webcams or unsecured routers) on the internet?', 
        options: ['Shodan', 'Photoshop', 'Microsoft Word', 'Notepad++'], 
        correct: 0 
      },
      { 
        question: 'What is ExifTool primarily used for in an investigation?', 
        options: ['Editing video files', 'Extracting hidden metadata (like GPS coordinates or camera details) from images and files', 'Sending encrypted emails', 'Bypassing passwords'], 
        correct: 1 
      }
    ]
  },
  {
    id: 2, title: 'The State of Hacking in 2025', category: 'OSINT', duration: '45m', creator: 'David Bombal & John Hammond', videoId: 'VPugJa5FYHc',
    content: 'A deep-dive into how classic ransomware meets AI-assisted malware and how social engineering patterns have evolved.',
    quiz: [
      { question: 'How is AI currently changing malware?', options: ['It makes malware obsolete', 'It helps write polymorphic code and highly convincing phishing text', 'It physically destroys servers', 'It stops all viruses'], correct: 1 },
      { question: 'What is a "ClickFix" or "FileFix" attack?', options: ['A tool to repair hard drives', 'A social engineering trick forcing users to copy/paste malicious commands to "fix" an error', 'A type of antivirus', 'A Wi-Fi hack'], correct: 1 },
      { question: 'What is the best defense against evolving social engineering?', options: ['Deleting the browser', 'Zero-Trust architecture and continuous employee awareness training', 'Using older software', 'Turning off the router'], correct: 1 }
    ]
  },
  {
    id: 3, title: 'Level Up Your OSINT Skills', category: 'OSINT', duration: '1h 14m', creator: 'John Hammond', videoId: 'avNmw4Kr2yk',
    content: 'Advanced open-source intelligence tactics, including reverse image searching and dark web tracking.',
    quiz: [
      { question: 'What is Reverse Image Searching used for?', options: ['To increase image resolution', 'To find where an image originated or if it has been manipulated', 'To compress files', 'To create deepfakes'], correct: 1 },
      { question: 'What does EXIF data reveal?', options: ['The camera model, date, and GPS coordinates of a photo', 'The user\'s bank password', 'The website\'s HTML', 'The size of the monitor'], correct: 0 },
      { question: 'Can OSINT be used defensively?', options: ['No', 'Yes, to find what data you are accidentally leaking to attackers', 'Only by the military', 'Only on mobile'], correct: 1 }
    ]
  },

  // 🔴 Social Engineering & Scams
  {
    id: 4, title: 'Disrupting a Scammer for a WHOLE WEEK', category: 'Social Engineering', duration: '24m', creator: 'Jim Browning', videoId: 'txUmwD4IcMw',
    content: 'Watch the legendary scam-baiter intercept a bank impersonation scammer and protect victims in real-time.',
    quiz: [
      { question: 'How do tech support scammers typically gain access to a victim\'s PC?', options: ['Brute forcing the Wi-Fi', 'Tricking the victim into installing Remote Desktop software (AnyDesk, TeamViewer)', 'Mailing a USB drive', 'Through the power grid'], correct: 1 },
      { question: 'Why do scammers often ask victims to buy gift cards?', options: ['To buy software', 'Because gift cards are untraceable and cannot be easily refunded', 'To give as gifts', 'To test the internet speed'], correct: 1 },
      { question: 'What is the "Inspect Element" scam?', options: ['Stealing a monitor', 'Editing a bank page locally to make it look like they accidentally refunded too much money', 'A browser virus', 'A network attack'], correct: 1 }
    ]
  },
  {
    id: 5, title: 'We Shutdown a Scam Call Centre AGAIN!', category: 'Social Engineering', duration: '15m', creator: 'Karl Rock & Jim Browning', videoId: 'r1Q_P__aqAk',
    content: 'Undercover footage of an active scam call center raid led by cybercrime police and independent researchers.',
    quiz: [
      { question: 'Why is international cooperation necessary to stop scam centers?', options: ['To save money', 'Because the scammers and their victims are usually in different countries/jurisdictions', 'To share internet', 'To translate languages'], correct: 1 },
      { question: 'What is a "Money Mule"?', options: ['An animal', 'A person who receives and transfers illicit funds on behalf of scammers', 'A type of cryptocurrency', 'A secure bank'], correct: 1 },
      { question: 'How do scammers spoof Caller ID?', options: ['By stealing phones', 'Using VoIP (Voice over IP) software to mask their real origin', 'By asking the phone company', 'Using a VPN'], correct: 1 }
    ]
  },
  {
    id: 6, title: 'Interview with Jim Browning - Live Scam Audio', category: 'Social Engineering', duration: '1h 46m', creator: 'Jim Browning', videoId: 'wmPDGu66q14',
    content: 'An illuminating glimpse into the shadowy world of scam call centers and the psychology used against vulnerable victims.',
    quiz: [
      { question: 'Which emotion do social engineers rely on most to rush victims?', options: ['Joy', 'Boredom', 'Urgency, panic, and fear', 'Sadness'], correct: 2 },
      { question: 'What is "Vishing"?', options: ['Phishing via Voice/Phone calls', 'A type of computer virus', 'Stealing credit cards', 'Visual hacking'], correct: 0 },
      { question: 'Why do scammers isolate victims (e.g., telling them not to talk to bank tellers)?', options: ['To save time', 'To prevent third parties from recognizing the scam and stopping the transfer', 'Because banks are closed', 'To protect privacy'], correct: 1 }
    ]
  },

  // 🟣 Deepfakes, AI & Misinformation
  {
    id: 7, title: 'How to Recognize Deepfakes and AI Generated Videos', category: 'Deepfakes', duration: '12m', creator: 'Tech Analysis', videoId: '-kDtt0QBNRU',
    content: 'A rapid breakdown of the visual artifacts, lighting errors, and audio desyncs that expose synthetic media.',
    quiz: [
      { question: 'Which is a common visual flaw in early deepfakes?', options: ['Perfect lighting', 'Unnatural blinking, strange hair physics, or mismatched teeth', 'High resolution', 'Slow movement'], correct: 1 },
      { question: 'What technology is primarily used to create deepfakes?', options: ['Blockchain', 'Generative Adversarial Networks (GANs)', 'SQL Databases', 'HTML5'], correct: 1 },
      { question: 'Which of the following makes a deepfake harder to detect?', options: ['Low resolution and heavy compression', 'Bright lighting', 'Complex backgrounds', 'High audio quality'], correct: 0 }
    ]
  },
  {
    id: 8, title: 'Expert Shows How to Spot an AI Deepfake', category: 'Deepfakes', duration: '6m', creator: 'News Analysis', videoId: 'yiXzKN7M2f0',
    content: 'Security experts explain how threat actors create a sense of urgency using AI-generated likenesses.',
    quiz: [
      { question: 'What is the "Urgency Red Flag"?', options: ['A fast internet connection', 'A psychological tactic where an AI voice/video demands immediate action or money', 'A slow computer', 'A network error'], correct: 1 },
      { question: 'Why do deepfakes often struggle with hands?', options: ['Cameras can\'t see hands', 'AI models lack structural understanding of complex, overlapping geometry', 'Hands move too fast', 'Hands are too small'], correct: 1 },
      { question: 'What should you do if a family member calls asking for emergency funds?', options: ['Send the money instantly', 'Hang up and call them back on their known number, or ask a pre-agreed "safe word"', 'Email them', 'Ignore it'], correct: 1 }
    ]
  },
  {
    id: 9, title: 'THE END OF TRUST — Deepfake Expert Dr. Hany Farid', category: 'Deepfakes', duration: '20m', creator: 'Cyber Security Podcast', videoId: 'u_jZxo-VfpY',
    content: 'Understanding how Large Language Models and AI video generation are eroding our shared sense of reality.',
    quiz: [
      { question: 'What is the "Liar\'s Dividend"?', options: ['When a liar gets paid', 'The phenomenon where the existence of deepfakes allows guilty people to claim real evidence is fake', 'A stock market term', 'A fake news website'], correct: 1 },
      { question: 'How can digital watermarking help?', options: ['It makes images look better', 'It mathematically embeds invisible proof of origin and alteration history into media files', 'It deletes fake news', 'It stops hackers from downloading files'], correct: 1 },
      { question: 'What is a "hallucination" in AI?', options: ['A virus', 'A highly confident but factually incorrect output', 'A sleep mode', 'Hardware failure'], correct: 1 }
    ]
  },

  // 🔵 Core Cybersecurity Concepts
  {
    id: 10, title: 'Injection Attacks 101: SQL & XSS', category: 'Cybersecurity', duration: '11m', creator: 'Aikido Security', videoId: 'wu6FAsiFhv0',
    content: 'A fast-paced dive into the world of injection attacks, how they work, and real-world database breaches.',
    quiz: [
      { question: 'What is the primary target of an SQL Injection?', options: ['The frontend CSS', 'The backend database', 'The network router', 'The user\'s monitor'], correct: 1 },
      { question: 'What does XSS stand for?', options: ['Cross-Site Scripting', 'XML Secure Sockets', 'Xtreme Server Security', 'Cross-System Storage'], correct: 0 },
      { question: 'How are injection attacks best prevented?', options: ['Turning off the firewall', 'Using input validation and parameterized queries', 'Using a VPN', 'Hiding the database IP'], correct: 1 }
    ]
  },
  {
    id: 11, title: 'How Ransomware Works in 2024', category: 'Cybersecurity', duration: '13m', creator: 'Panda Security', videoId: 'BbLCXpAON2c',
    content: 'Learn how modern ransomware infects networks, encrypts data, and how to defend against double extortion.',
    quiz: [
      { question: 'What does modern ransomware primarily do to victim data?', options: ['Deletes it permanently', 'Encrypts it and demands payment for the key', 'Publishes it immediately', 'Copies it to a USB'], correct: 1 },
      { question: 'What is "Double Extortion"?', options: ['Asking for money twice', 'Encrypting data AND threatening to leak sensitive files publicly', 'Infecting two computers', 'Using two viruses'], correct: 1 },
      { question: 'What is the best defense against ransomware?', options: ['Paying the ransom', 'Regularly updated, isolated offline backups', 'Using a weaker password', 'Ignoring the warning'], correct: 1 }
    ]
  },
  {
    id: 12, title: 'Understanding Zero-Day Vulnerabilities', category: 'Cybersecurity', duration: '8m', creator: 'Security Brief', videoId: '293BbYGs0ro',
    content: 'A breakdown of active zero-day exploits in the wild and how threat actors leverage race conditions.',
    quiz: [
      { question: 'Why is it called a "Zero-Day"?', options: ['It takes zero days to fix', 'Developers have had zero days to prepare a patch because the flaw is unknown', 'It deletes data in zero days', 'It costs zero dollars'], correct: 1 },
      { question: 'Who typically discovers Zero-Day vulnerabilities?', options: ['The software CEO', 'Security researchers or malicious hackers', 'The marketing team', 'The end user'], correct: 1 },
      { question: 'What is a "Bug Bounty"?', options: ['A computer virus', 'A program where companies pay hackers to ethically report vulnerabilities', 'A fake website', 'A firewall feature'], correct: 1 }
    ]
  },
  {
    id: 13, title: 'Constructing a SQL Injection', category: 'Cybersecurity', duration: '15m', creator: 'Professor Messer', videoId: 'yAt4DO8dUNM',
    content: 'A live demonstration of how untrusted inputs grant attackers complete access to backend databases.',
    quiz: [
      { question: 'What language is manipulated in a SQL Injection?', options: ['HTML', 'Structured Query Language', 'Python', 'C++'], correct: 1 },
      { question: 'Which character is often used to test if an input field is vulnerable to SQLi?', options: ['An asterisk (*)', 'A single quote (\')', 'A hashtag (#)', 'An ampersand (&)'], correct: 1 },
      { question: 'What is a "Blind SQL Injection"?', options: ['An attack with the monitor off', 'An attack where the database does not return data to the screen, but behaves differently based on true/false queries', 'A Wi-Fi attack', 'A DDoS method'], correct: 1 }
    ]
  },
  {
    id: 14, title: 'Ransomware Threat Intelligence', category: 'Cybersecurity', duration: '10m', creator: 'Recorded Future', videoId: '5B6E0q0YGIo',
    content: 'Monitoring the ransomware kill chain and identifying pre-attack signals before systems are locked.',
    quiz: [
      { question: 'What is the "Kill Chain"?', options: ['A type of sword', 'The sequence of stages an attack goes through from reconnaissance to exfiltration', 'A firewall brand', 'A server rack'], correct: 1 },
      { question: 'What is RaaS?', options: ['Routers as a Service', 'Ransomware as a Service (a business model for cybercriminals)', 'RAM as a Service', 'Remote Access auto-System'], correct: 1 },
      { question: 'Why is Threat Intelligence important?', options: ['It speeds up the internet', 'It helps organizations detect indicators of compromise (IoCs) before the payload drops', 'It writes code', 'It lowers electricity costs'], correct: 1 }
    ]
  },

  // 🟡 Privacy, Anonymity & Infrastructure
  {
    id: 15, title: 'Why Your VPN Can\'t Stop Tracking', category: 'Privacy', duration: '9m', creator: 'RTINGS', videoId: 'pJOpHSPkWMo',
    content: 'A deep dive into browser fingerprinting, how it bypasses VPNs, and how to protect your identity.',
    quiz: [
      { question: 'Does a VPN stop browser fingerprinting?', options: ['Yes', 'No, a VPN only changes your IP, not your browser\'s unique characteristics', 'Only on mobile', 'Only if it is expensive'], correct: 1 },
      { question: 'What data does your browser freely hand over to websites?', options: ['Your exact home address', 'Screen resolution, installed fonts, and OS version', 'Your social security number', 'Your bank password'], correct: 1 },
      { question: 'Why do companies use fingerprinting?', options: ['To speed up downloads', 'To uniquely identify and track users across the web even if cookies are blocked', 'To hack webcams', 'To block ads'], correct: 1 }
    ]
  },
  {
    id: 16, title: 'End-to-End Encryption Explained', category: 'Privacy', duration: '11m', creator: 'Ask Leo', videoId: 'Rx39XYgsrQQ',
    content: 'Understanding cryptography and why true E2EE ensures only the sender and receiver can read messages.',
    quiz: [
      { question: 'In End-to-End Encryption, who holds the decryption keys?', options: ['The government', 'The app developer', 'Only the communicating users (sender and recipient)', 'The internet provider'], correct: 2 },
      { question: 'What happens if a messaging company is subpoenaed for E2EE chats?', options: ['They hand over the plain text', 'They hand over encrypted gibberish because they don\'t possess the private keys', 'They delete the app', 'They arrest the user'], correct: 1 },
      { question: 'Is SMS text messaging E2E encrypted?', options: ['Yes, always', 'No, SMS is sent in plain text and can be intercepted', 'Only on Android', 'Only on iPhones'], correct: 1 }
    ]
  },
  {
    id: 17, title: 'Don\'t Trust End-to-End Encryption', category: 'Privacy', duration: '21m', creator: 'Tech Analysis', videoId: 'oaQT1e6SBM8',
    content: 'How zero-click exploits, government malware, and metadata harvesting bypass E2EE entirely.',
    quiz: [
      { question: 'How can a hacker read an E2EE message?', options: ['By guessing the password', 'By compromising one of the endpoint devices (e.g., screen recording malware on the phone)', 'By calling the ISP', 'By turning off Wi-Fi'], correct: 1 },
      { question: 'What is a "Zero-Click" exploit?', options: ['A broken mouse', 'Malware that infects a device without the user ever clicking a link or taking action', 'A fast website', 'A server crash'], correct: 1 },
      { question: 'What is "Metadata"?', options: ['Fake data', 'Data about data (who you talked to, when, and for how long, even if the message itself is encrypted)', 'A Facebook product', 'A database error'], correct: 1 }
    ]
  },
  {
    id: 18, title: 'Tracking Without Cookies', category: 'Privacy', duration: '15m', creator: 'Shopify Devs', videoId: 'NsFOYs0VAvA',
    content: 'How modern ad-tech utilizes canvas tracking and APIs to profile users who block third-party cookies.',
    quiz: [
      { question: 'What is Canvas Fingerprinting?', options: ['Painting a picture', 'Instructing the browser to draw a hidden image; differences in graphics hardware render it uniquely', 'A type of cookie', 'A VPN protocol'], correct: 1 },
      { question: 'Why are third-party cookies dying?', options: ['They cost too much', 'Browsers like Safari and Firefox are blocking them by default for privacy', 'They slow down the PC', 'They take up hard drive space'], correct: 1 },
      { question: 'What does the GDPR regulate?', options: ['Hardware manufacturing', 'Data protection and privacy for individuals in the EU', 'Internet speeds', 'Browser updates'], correct: 1 }
    ]
  },
  {
    id: 19, title: 'Fighting Browser Fingerprinting', category: 'Privacy', duration: '17m', creator: 'Privacy Guides', videoId: 'v_50cBtSjyQ',
    content: 'An interview with privacy experts uncovering the tracking arms race and the specific tools used to fight back.',
    quiz: [
      { question: 'Which browser is designed specifically to resist fingerprinting by blending in?', options: ['Google Chrome', 'The Tor Browser / Mullvad Browser', 'Microsoft Edge', 'Internet Explorer'], correct: 1 },
      { question: 'What is the "Anti-Fingerprinting" strategy?', options: ['Having a totally unique setup', 'Making your browser metrics look exactly like millions of other users so you hide in the crowd', 'Turning off the monitor', 'Using a different keyboard'], correct: 1 },
      { question: 'Does installing dozens of privacy extensions make you safer from fingerprinting?', options: ['Yes', 'No, the unique combination of extensions actually makes your fingerprint MORE unique and trackable', 'Only on a Mac', 'Always'], correct: 1 }
    ]
  },
  {
    id: 20, title: 'Cybersecurity Standards 2024', category: 'Cybersecurity', duration: '14m', creator: 'SANS Institute', videoId: '5Vc_zcNmTZI',
    content: 'The state of cybersecurity risk management and the frameworks used by organizations to stay secure.',
    quiz: [
      { question: 'What is a cybersecurity framework?', options: ['A metal box for servers', 'A set of guidelines and best practices to manage cyber risk (e.g., NIST)', 'A programming language', 'A type of firewall'], correct: 1 },
      { question: 'What is the principle of "Least Privilege"?', options: ['Paying employees less', 'Giving users only the bare minimum access rights necessary to perform their jobs', 'Using weak passwords', 'Ignoring security alerts'], correct: 1 },
      { question: 'What does Incident Response cover?', options: ['Buying new computers', 'The structured approach to handling and managing a security breach or cyberattack', 'Updating a website', 'Writing code'], correct: 1 }
    ]
  }
];

const EducationSection = () => {
  const typingTitle = useTypewriter("Education Centre", 80, 200);

  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showCategoryMenu, setShowCategoryMenu] = useState(false);
  const [currentQuiz, setCurrentQuiz] = useState(null);
  const [quizAnswers, setQuizAnswers] = useState({});

  const categories = ['all', 'OSINT', 'Deepfakes', 'Social Engineering', 'Cybersecurity', 'Privacy'];
  const filteredContent = selectedCategory === 'all' ? educationContent : educationContent.filter(item => item.category === selectedCategory);

  const startQuiz = (courseId) => {
    const course = educationContent.find(c => c.id === courseId);
    if (course.quiz) {
      setCurrentQuiz({ courseId, questions: course.quiz, currentQuestion: 0, score: 0, courseTitle: course.title });
      setQuizAnswers({});
    }
  };

  const submitQuizAnswer = (questionIndex, answerIndex) => {
    setQuizAnswers(prev => ({ ...prev, [questionIndex]: answerIndex }));
  };

  const completeQuiz = () => {
    const { questions } = currentQuiz;
    let score = 0;
    questions.forEach((question, index) => { if (quizAnswers[index] === question.correct) score++; });
    setCurrentQuiz(null); setQuizAnswers({});
    showNotification(`Protocol Completed! Score: ${score}/${questions.length}`, 'success');
  };

  const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } };

  return (
    // 🚀 FIX: Removed the hardcoded double margin (`marginLeft: 280px`). The App.js `main` wrapper already handles this!
    <motion.div 
      initial="hidden" 
      animate="visible" 
      variants={containerVariants}
      className="w-full min-h-screen relative overflow-visible"
    >
      
      {/* ========================================= */}
      {/* 🚀 HERO HEADER (CLARTHA ACADEMY STYLE)  */}
      {/* ========================================= */}
      {/* Removed hardcoded background so global theme shines through */}
      <div className="sticky top-0 z-30 px-4 py-8 md:py-12 transition-all overflow-visible bg-transparent">
        
        <div className="max-w-4xl mx-auto flex flex-col items-center justify-center relative z-10 overflow-visible">
          
          <AcademicCapIcon className="w-10 h-10 md:w-14 md:h-14 text-indigo-500 dark:text-indigo-400 mb-5 stroke-[1.5]" />
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-center mb-2 pb-4 leading-normal tracking-tight text-slate-900 dark:text-white">
            <span className="text-brand-highlight">{typingTitle}</span>
            <motion.span 
              animate={{ opacity: [0, 1, 0] }} 
              transition={{ repeat: Infinity, duration: 0.9 }} 
              className="inline-block w-2.5 md:w-3 h-[0.8em] bg-indigo-500 dark:bg-indigo-400 ml-2 align-baseline" 
            />
          </h1>

          <p className="text-[9px] md:text-[11px] font-mono font-bold uppercase tracking-[0.3em] md:tracking-[0.4em] text-slate-600 dark:text-slate-400 mb-8 md:mb-12 text-center px-4">
            Cognitive Firewall Training & Security Modules
          </p>
          
          {/* ✅ DESKTOP: SEGMENTED FILTER CONTROL (GLASS INPUT STYLE) */}
          <div className="hidden md:flex w-full max-w-4xl px-2 overflow-visible justify-center pb-2 flex-wrap gap-y-2">
            <div className="p-1.5 flex items-center gap-1 rounded-full glass-input transition-all flex-wrap justify-center">
              {categories.map(f => (
                <button 
                  key={f} onClick={() => setSelectedCategory(f)} 
                  className={`relative px-6 py-2.5 rounded-full text-[10px] md:text-[11px] font-black uppercase tracking-widest transition-all duration-300 flex-shrink-0 ${
                    selectedCategory === f 
                      ? 'text-white' 
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {selectedCategory === f && (
                    <motion.div layoutId="activeCategory" className="absolute inset-0 rounded-full shadow-lg bg-indigo-600 dark:bg-indigo-500" transition={{ type: 'spring', stiffness: 400, damping: 30 }} />
                  )}
                  <span className="relative z-10 block py-0.5">{f}</span>
                </button>
              ))}
            </div>
          </div>

          {/* ✅ MOBILE: CATEGORY BUTTON */}
          <div className="md:hidden relative mt-1 w-max mx-auto overflow-visible pb-2">
            <button 
              onClick={() => setShowCategoryMenu(true)}
              className="flex items-center gap-2 px-6 py-3 rounded-full glass-card transition-all text-slate-900 dark:text-white"
            >
              <FunnelIcon className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <span className="text-[11px] font-black uppercase tracking-widest block py-0.5">
                {selectedCategory}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* ========================================= */}
      {/* 🚀 COURSE GRID (LIQUID GLASS CARDS)       */}
      {/* ========================================= */}
      <div className="max-w-7xl mx-auto relative z-10 px-4 md:px-8 py-8">
        <div className="grid gap-8 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
          {filteredContent.map(course => (
            // 🚀 CLARTHA STYLE: Changed to glass-card and added animate-workspace
            <motion.div key={course.id} 
                        className="glass-card animate-workspace p-1.5 overflow-hidden group transition-all flex flex-col relative rounded-[2rem]"> 
              
              <div className="relative aspect-video cursor-pointer overflow-hidden rounded-[1.5rem]" 
                   onClick={() => window.open(`https://www.youtube.com/watch?v=${course.videoId}`, '_blank')}>
                <img src={`https://img.youtube.com/vi/${course.videoId}/hqdefault.jpg`} alt={course.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute inset-0 bg-slate-900/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm">
                  <div className="w-16 h-16 rounded-full bg-indigo-600 shadow-[0_0_20px_rgba(79,70,229,0.8)] flex items-center justify-center">
                    <ArrowTopRightOnSquareIcon className="w-8 h-8 text-white ml-1" />
                  </div>
                </div>
                <div className="absolute top-3 left-3 bg-slate-950/80 backdrop-blur-md text-indigo-400 text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded border border-indigo-500/30">
                  {course.category}
                </div>
              </div>

              <div className="p-5 md:p-6 flex flex-col flex-grow">
                <h3 className="font-black text-lg mb-2 leading-tight text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{course.title}</h3>
                <p className="text-xs leading-relaxed mb-6 line-clamp-3 text-slate-700 dark:text-slate-300">{course.content}</p>
                
                <div className="mt-auto pt-4 border-t border-slate-300/30 dark:border-slate-700/50 flex items-center justify-between gap-2">
                  <div className="flex flex-col gap-1 min-w-0 pr-2">
                     <span className="text-[9px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest flex items-center gap-1 truncate"><ClockIcon className="w-3 h-3 shrink-0"/> {course.duration}</span>
                     <span className="text-[10px] font-bold truncate text-slate-800 dark:text-slate-200">{course.creator}</span>
                  </div>
                  <div className="flex items-center gap-1.5 md:gap-2 shrink-0">
                    <button onClick={() => window.open(`https://www.youtube.com/watch?v=${course.videoId}`, '_blank')} className="px-3 md:px-4 h-8 rounded-lg bg-indigo-600/10 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 hover:bg-indigo-600 hover:text-white flex items-center justify-center gap-1 transition-all border border-indigo-600/20 dark:border-indigo-500/20 text-[9px] md:text-[10px] font-black uppercase tracking-widest">
                      <PlayIcon className="w-3 h-3" /> Watch
                    </button>
                    {course.quiz && (
                      <button onClick={() => startQuiz(course.id)} className="px-3 md:px-4 h-8 rounded-lg flex items-center justify-center gap-1 transition-all text-[9px] md:text-[10px] font-black uppercase tracking-widest glass-input text-slate-800 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-indigo-400">
                        <QuestionMarkCircleIcon className="w-3 h-3 shrink-0" /> Quiz
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        <div className="pb-24"></div>
      </div>

      {/* ========================================= */}
      {/* 🎛️ GLOBAL CATEGORY MODAL (MOBILE FIX)     */}
      {/* ========================================= */}
      <AnimatePresence>
        {showCategoryMenu && (
          <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowCategoryMenu(false)} />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-64 rounded-3xl shadow-2xl overflow-hidden flex flex-col z-10 glass-card"
            >
              <div className="p-4 border-b border-white/10 text-center text-xs font-black uppercase tracking-widest text-slate-800 dark:text-slate-300">Intelligence Modules</div>
              {categories.map(f => (
                <button key={f} onClick={() => { setSelectedCategory(f); setShowCategoryMenu(false); }}
                  className={`w-full text-center px-5 py-4 text-[11px] font-black uppercase tracking-widest transition-all ${selectedCategory === f ? 'bg-indigo-600 text-white' : 'text-slate-700 dark:text-slate-300 hover:bg-black/5 dark:hover:bg-white/5'}`}
                > {f} </button>
              ))}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ========================================= */}
      {/* 🚨 QUIZ MODAL (GLASS CARD UPGRADE)        */}
      {/* ========================================= */}
      <AnimatePresence>
        {currentQuiz && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setCurrentQuiz(null)} className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" />
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} onClick={(e) => e.stopPropagation()} 
                        className="glass-card rounded-[2rem] p-8 max-w-2xl w-[90%] max-h-[85vh] overflow-y-auto relative z-10 mx-4">
              <div className="flex justify-between items-center mb-8 border-b border-black/10 dark:border-white/10 pb-4">
                <div>
                  <h2 className="text-xl font-black uppercase tracking-tight text-indigo-600 dark:text-indigo-400 flex items-center gap-2"><CpuChipIcon className="w-5 h-5"/> Protocol Evaluation</h2>
                  <p className="text-xs mt-1 font-mono uppercase tracking-widest text-slate-600 dark:text-slate-400">{currentQuiz.courseTitle}</p>
                </div>
                <button onClick={() => setCurrentQuiz(null)} className="p-2 hover:bg-rose-500/20 text-slate-600 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-500 rounded-lg transition-colors"><XMarkIcon className="w-5 h-5" /></button>
              </div>
              
              <div className="space-y-6">
                <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-slate-600 dark:text-slate-400">
                  <span className="glass-input px-3 py-1.5 rounded">Node {currentQuiz.currentQuestion + 1} // {currentQuiz.questions.length}</span>
                  <span className="text-indigo-600 dark:text-indigo-400">Score: {currentQuiz.score}</span>
                </div>
                
                <h3 className="text-lg font-bold leading-relaxed text-slate-900 dark:text-white">
                  {currentQuiz.questions[currentQuiz.currentQuestion]?.question}
                </h3>
                
                <div className="space-y-3">
                  {currentQuiz.questions[currentQuiz.currentQuestion]?.options.map((option, index) => (
                    <motion.button key={index} onClick={() => submitQuizAnswer(currentQuiz.currentQuestion, index)} whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}
                      className={`w-full text-left p-4 rounded-xl transition-all font-medium text-sm ${
                        quizAnswers[currentQuiz.currentQuestion] === index
                          ? 'border-2 border-indigo-600 dark:border-indigo-500 bg-indigo-600/10 text-indigo-800 dark:text-indigo-300 shadow-[0_0_15px_rgba(79,70,229,0.2)]'
                          : 'glass-input text-slate-800 dark:text-slate-200'
                      }`}>
                      {option}
                    </motion.button>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-6 border-t border-black/10 dark:border-white/10">
                  <button onClick={() => setCurrentQuiz(prev => ({ ...prev, currentQuestion: prev.currentQuestion - 1 }))} disabled={currentQuiz.currentQuestion === 0} 
                          className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${currentQuiz.currentQuestion === 0 ? 'opacity-30 cursor-not-allowed' : 'glass-input hover:text-indigo-600 dark:hover:text-indigo-400'}`}>
                    <ArrowLeftIcon className="w-4 h-4" /> Previous
                  </button>
                  <button onClick={() => { if (currentQuiz.currentQuestion < currentQuiz.questions.length - 1) { setCurrentQuiz(prev => ({ ...prev, currentQuestion: prev.currentQuestion + 1 })); } else { completeQuiz(); } }} disabled={quizAnswers[currentQuiz.currentQuestion] === undefined} 
                          className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${quizAnswers[currentQuiz.currentQuestion] === undefined ? 'opacity-30 cursor-not-allowed glass-input' : 'bg-indigo-600 text-white hover:bg-indigo-500 shadow-lg shadow-indigo-500/20'}`}>
                    {currentQuiz.currentQuestion === currentQuiz.questions.length - 1 ? 'Finish' : 'Next'} <ArrowRightIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </motion.div>
  );
};

export default EducationSection;