import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BookOpenIcon, PlayIcon, CheckCircleIcon, StarIcon, ClockIcon, TagIcon,
  UserGroupIcon, AcademicCapIcon, TrophyIcon, FireIcon, SparklesIcon,
  XMarkIcon, ArrowRightIcon, ArrowLeftIcon, QuestionMarkCircleIcon,
  BoltIcon, GiftIcon, LightBulbIcon, RocketLaunchIcon, EyeIcon,
  LockClosedIcon, PlayCircleIcon, PauseIcon, ShieldCheckIcon
} from '@heroicons/react/24/outline';
import Card from '../UI/Card';
import { useResponsive } from '../../hooks/useResponsive';
import { showNotification } from '../UI/NotificationToast';

// Enhanced education entries with YouTube thumbnails and full quiz logic
const educationContent = [
  {
    id: 1,
    title: 'Complete Cybersecurity Course 2025',
    category: 'Cybersecurity',
    difficulty: 'Beginner to Advanced',
    duration: '11:34:35',
    totalMinutes: 694,
    content: 'Master cybersecurity fundamentals covering threats, defense strategies, ethical hacking, and incident response. Complete hands-on course with real-world examples.',
    progress: 0,
    tags: ['cybersecurity', 'ethical-hacking', 'network-security', 'risk-management'],
    completedBy: 85420,
    rating: 4.9,
    thumbnail: 'https://img.youtube.com/vi/MvrgFOwEgdA/hqdefault.jpg',
    videoId: 'MvrgFOwEgdA',
    creator: "Edureka",
    resourceLinks: [
      { title: 'NIST Cybersecurity Framework', url: 'https://www.nist.gov/cyberframework' },
      { title: 'SANS Security Training', url: 'https://www.sans.org/' }
    ],
    quiz: [
      {
        question: 'What are the three pillars of information security (CIA Triad)?',
        options: [
          'Confidentiality, Integrity, Availability',
          'Control, Implementation, Assessment',
          'Classification, Investigation, Authorization',
          'Cryptography, Identity, Authentication'
        ],
        correct: 0,
        explanation: 'The CIA Triad consists of Confidentiality, Integrity, and Availability.'
      },
      {
        question: 'Which type of attack uses social engineering to trick users?',
        options: [
          'DDoS Attack',
          'SQL Injection',
          'Phishing',
          'Buffer Overflow'
        ],
        correct: 2,
        explanation: 'Phishing attacks use social engineering techniques.'
      }
    ]
  },
  {
    id: 2,
    title: 'Cybersecurity Awareness Training',
    category: 'Security Awareness',
    difficulty: 'Beginner',
    duration: '45:00',
    totalMinutes: 45,
    content: 'Essential awareness training for protecting networks, devices, and personal data from cyber threats in the modern digital landscape.',
    progress: 0,
    tags: ['awareness', 'phishing', 'passwords', 'social-engineering'],
    completedBy: 156830,
    rating: 4.7,
    thumbnail: 'https://img.youtube.com/vi/CT5gmh9cxpk/hqdefault.jpg',
    videoId: 'CT5gmh9cxpk',
    creator: "Security Training Institute",
    resourceLinks: [
      { title: 'CISA Security Tips', url: 'https://www.cisa.gov/secure-our-world' },
      { title: 'FTC Identity Theft Guide', url: 'https://www.identitytheft.gov/' }
    ],
    quiz: [
      {
        question: 'What should you do if you receive a suspicious email?',
        options: [
          'Click the link to verify if it\'s real',
          'Reply asking for verification',
          'Delete it and report to IT security',
          'Forward it to colleagues for their opinion'
        ],
        correct: 2,
        explanation: 'Never click suspicious links; delete and report to IT.'
      }
    ]
  },
  {
    id: 3,
    title: 'Digital Literacy & Online Safety',
    category: 'Digital Literacy',
    difficulty: 'Beginner',
    duration: '25:00',
    totalMinutes: 25,
    content: 'Learn essential digital skills including safe browsing, password management, and recognizing online threats.',
    progress: 0,
    tags: ['digital-literacy', 'online-safety', 'browsing', 'privacy'],
    completedBy: 203945,
    rating: 4.6,
    thumbnail: 'https://img.youtube.com/vi/oU1X3QpX-90/hqdefault.jpg',
    videoId: 'oU1X3QpX-90',
    creator: "Digital Citizenship Institute",
    resourceLinks: [
      { title: 'Common Sense Media', url: 'https://www.commonsensemedia.org/digital-citizenship' },
      { title: 'Be Internet Awesome', url: 'https://beinternetawesome.withgoogle.com/' }
    ],
    quiz: [
      {
        question: 'What is the most important rule for creating strong passwords?',
        options: [
          'Use the same password for all accounts',
          'Include personal information',
          'Use unique, complex passwords for each account',
          'Share passwords with trusted friends'
        ],
        correct: 2,
        explanation: 'Always use unique, complex passwords.'
      }
    ]
  },
  {
    id: 4,
    title: 'Fact-Checking & Misinformation',
    category: 'Misinformation',
    difficulty: 'Intermediate',
    duration: '18:00',
    totalMinutes: 18,
    content: 'Master techniques to identify fake news, verify information sources, and combat misinformation spread.',
    progress: 0,
    tags: ['fact-checking', 'misinformation', 'verification', 'media-literacy'],
    completedBy: 78322,
    rating: 4.8,
    thumbnail: 'https://img.youtube.com/vi/u8Pg-cD0ytg/hqdefault.jpg',
    videoId: 'u8Pg-cD0ytg',
    creator: "Fact Check Global",
    resourceLinks: [
      { title: 'Snopes Fact Checking', url: 'https://www.snopes.com/' },
      { title: 'Reuters Fact Check', url: 'https://www.reuters.com/fact-check/' }
    ],
    quiz: [
      {
        question: 'What is the first step in verifying information online?',
        options: [
          'Check social media comments',
          'Verify the source and publication date',
          'Count how many times it\'s been shared',
          'Look for emotional language'
        ],
        correct: 1,
        explanation: 'Check the credibility of the source.'
      }
    ]
  },
  {
    id: 5,
    title: 'Social Media Safety & Privacy',
    category: 'Social Media',
    difficulty: 'Beginner',
    duration: '22:00',
    totalMinutes: 22,
    content: 'Learn to protect your privacy on social platforms, recognize scams, and maintain digital wellness.',
    progress: 0,
    tags: ['social-media', 'privacy', 'scams', 'digital-wellness'],
    completedBy: 134567,
    rating: 4.5,
    thumbnail: 'https://img.youtube.com/vi/nzVgHIRx7mI/hqdefault.jpg',
    videoId: 'nzVgHIRx7mI',
    creator: "Digital Safety Foundation",
    resourceLinks: [
      { title: 'Privacy Settings Guide', url: 'https://privacy.net/social-media-privacy-settings/' },
      { title: 'Social Media Safety Tips', url: 'http://swgfl.org.uk/topics/social-media/' }
    ],
    quiz: [
      {
        question: 'Which privacy setting is most important on social media?',
        options: [
          'Making all posts public',
          'Limiting who can see your posts and personal info',
          'Adding as many friends as possible',
          'Using your real name everywhere'
        ],
        correct: 1,
        explanation: 'Limit post visibility to people you know and trust.'
      }
    ]
  }
];

const EducationSection = ({ user, userStats }) => {
  const { screenSize } = useResponsive();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [currentQuiz, setCurrentQuiz] = useState(null);
  const [quizAnswers, setQuizAnswers] = useState({});
  const [activeVideo, setActiveVideo] = useState(null);

  const categories = [
    'all',
    'Cybersecurity',
    'Security Awareness',
    'Digital Literacy',
    'Misinformation',
    'Social Media'
  ];
  const filteredContent =
    selectedCategory === 'all'
      ? educationContent
      : educationContent.filter(item => item.category === selectedCategory);

  const startQuiz = (courseId) => {
    const course = educationContent.find(c => c.id === courseId);
    if (course.quiz) {
      setCurrentQuiz({
        courseId,
        questions: course.quiz,
        currentQuestion: 0,
        score: 0,
        courseTitle: course.title
      });
      setQuizAnswers({});
    }
  };

  const submitQuizAnswer = (questionIndex, answerIndex) => {
    setQuizAnswers(prev => ({
      ...prev,
      [questionIndex]: answerIndex
    }));
  };

  const completeQuiz = () => {
    const { questions } = currentQuiz;
    let score = 0;
    questions.forEach((question, index) => {
      if (quizAnswers[index] === question.correct) score++;
    });
    setCurrentQuiz(null);
    setQuizAnswers({});
    showNotification(`Quiz completed! Score: ${score}/${questions.length}`, 'success');
  };

  // UI render enhanced for thumbnails and professional look
  return (
    <div className={`max-w-5xl mx-auto space-y-6 ${screenSize.isMobile ? 'px-4' : 'px-6'}`}>
      <div className="text-center">
        <BookOpenIcon className="w-16 h-16 mx-auto mb-4 text-purple-600" />
        <h1 className="text-2xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">
          Digital Safety Education Center
        </h1>
        <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
          Master cybersecurity, digital literacy, and fact-checking through curated YouTube courses with quizzes.
        </p>
      </div>
      <div className="flex gap-2 flex-wrap justify-center mb-6">
        {categories.map(category => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition duration-200 ${
              selectedCategory === category
                ? 'bg-purple-600 text-white shadow'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            {category === 'all' ? 'All' : category}
          </button>
        ))}
      </div>
      <div className={`grid gap-6 ${screenSize.isMobile ? 'grid-cols-1' : 'md:grid-cols-2 lg:grid-cols-3'}`}>
        {filteredContent.map(course => (
          <Card key={course.id} className="overflow-hidden hover:shadow-lg transition">
            <div className="p-0">
              {/* YouTube Thumbnail */}
              <img
                src={course.thumbnail}
                alt={`Thumbnail: ${course.title}`}
                className="w-full h-48 object-cover mb-2 rounded-t-xl"
              />
              <div className="px-4 py-2">
                <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-1">{course.title}</h3>
                <p className="text-sm mb-2 text-gray-700 dark:text-gray-300 line-clamp-3">
                  {course.content}
                </p>
                <div className="text-xs text-gray-500 flex items-center justify-between mb-2">
                  <span>{course.creator}</span>
                  <span>{course.duration}</span>
                </div>
                <div className="flex gap-2 flex-wrap mb-2">
                  {course.tags.map(t => (
                    <span key={t} className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-xs rounded-full">{t}</span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <button
                    className="flex-1 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white py-2 rounded-lg font-medium flex items-center justify-center gap-2"
                    onClick={() => setActiveVideo(course.videoId)}
                  >
                    <PlayIcon className="w-5 h-5" />
                    Watch Video
                  </button>
                  {course.quiz && (
                    <button
                      onClick={() => startQuiz(course.id)}
                      className="border-2 border-purple-600 text-purple-600 rounded-lg px-4 py-2 font-medium hover:bg-purple-50 dark:hover:bg-purple-900/20"
                      title="Take Quiz"
                    >
                      <QuestionMarkCircleIcon className="w-5 h-5" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
      {/* Modal for Embedded Video */}
      <AnimatePresence>
        {activeVideo && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl max-w-2xl w-full overflow-hidden"
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
            >
              <div className="p-0 flex flex-col items-end">
                <button onClick={() => setActiveVideo(null)} className="p-2 m-2 text-gray-400 hover:text-gray-800 dark:hover:text-white">
                  <XMarkIcon className="w-6 h-6" />
                </button>
                <div className="aspect-w-16 aspect-h-9 w-full">
                  <iframe
                    title="YouTube Video"
                    src={`https://www.youtube.com/embed/${activeVideo}`}
                    frameBorder="0"
                    allowFullScreen
                    className="w-full h-96"
                  />
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* Quiz Modal */}
      <AnimatePresence>
        {currentQuiz && (
          <motion.div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div className="bg-white dark:bg-gray-800 rounded-2xl p-8 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Course Quiz</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">{currentQuiz.courseTitle}</p>
              <div className="space-y-6">
                <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                  <span>Question {currentQuiz.currentQuestion + 1} of {currentQuiz.questions.length}</span>
                  <span>Score: {currentQuiz.score}/{currentQuiz.questions.length}</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {currentQuiz.questions[currentQuiz.currentQuestion]?.question}
                </h3>
                <div className="space-y-3">
                  {currentQuiz.questions[currentQuiz.currentQuestion]?.options.map((option, index) => (
                    <motion.button
                      key={index}
                      onClick={() => submitQuizAnswer(currentQuiz.currentQuestion, index)}
                      className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                        quizAnswers[currentQuiz.currentQuestion] === index
                          ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                          : 'border-gray-200 dark:border-gray-600 hover:border-gray-300'
                      }`}
                      whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      <span className="text-gray-900 dark:text-white">{option}</span>
                    </motion.button>
                  ))}
                </div>
                <div className="flex items-center justify-between">
                  <motion.button
                    onClick={() => {
                      if (currentQuiz.currentQuestion > 0) {
                        setCurrentQuiz(prev => ({
                          ...prev,
                          currentQuestion: prev.currentQuestion - 1
                        }));
                      }
                    }}
                    disabled={currentQuiz.currentQuestion === 0}
                    className="flex items-center space-x-2 px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                    whileHover={{ scale: currentQuiz.currentQuestion === 0 ? 1 : 1.05 }}>
                    <ArrowLeftIcon className="w-4 h-4" />
                    <span>Previous</span>
                  </motion.button>
                  <motion.button
                    onClick={() => {
                      if (currentQuiz.currentQuestion < currentQuiz.questions.length - 1) {
                        setCurrentQuiz(prev => ({
                          ...prev,
                          currentQuestion: prev.currentQuestion + 1
                        }));
                      } else {
                        completeQuiz();
                      }
                    }}
                    disabled={quizAnswers[currentQuiz.currentQuestion] === undefined}
                    className="flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:from-purple-700 hover:to-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    whileHover={{ scale: quizAnswers[currentQuiz.currentQuestion] === undefined ? 1 : 1.05 }}
                    whileTap={{ scale: quizAnswers[currentQuiz.currentQuestion] === undefined ? 1 : 0.95 }}>
                    <span>
                      {currentQuiz.currentQuestion === currentQuiz.questions.length - 1 ? 'Complete Quiz' : 'Next'}
                    </span>
                    <ArrowRightIcon className="w-4 h-4" />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default EducationSection;
