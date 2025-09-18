import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BookOpenIcon, PlayIcon, CheckCircleIcon, StarIcon, ClockIcon, TagIcon,
  UserGroupIcon, AcademicCapIcon, TrophyIcon, FireIcon, SparklesIcon,
  XMarkIcon, ArrowRightIcon, ArrowLeftIcon, QuestionMarkCircleIcon,
  BoltIcon, GiftIcon, LightBulbIcon, RocketLaunchIcon
} from '@heroicons/react/24/outline';
import Card from '../UI/Card';
import { useResponsive } from '../../hooks/useResponsive';

import { showNotification } from '../UI/NotificationToast';

const EducationSection = ({ user, userStats }) => {
  const { screenSize } = useResponsive();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [currentQuiz, setCurrentQuiz] = useState(null);
  const [quizAnswers, setQuizAnswers] = useState({});
  const [userProgress, setUserProgress] = useState({
    level: 1,
    xp: 0,
    streak: 0,
    completedCourses: [],
    achievements: [],
    totalHours: 0
  });
  const [showAchievement, setShowAchievement] = useState(null);

  // Load user progress from localStorage
  useEffect(() => {
    const savedProgress = localStorage.getItem(`xist-education-${user?.uid || 'anonymous'}`);
    if (savedProgress) {
      setUserProgress(JSON.parse(savedProgress));
    }
  }, [user]);

  // Save progress to localStorage
  const saveProgress = (progress) => {
    localStorage.setItem(`xist-education-${user?.uid || 'anonymous'}`, JSON.stringify(progress));
  };

  // Enhanced education content with real URLs and quiz questions
  const educationContent = [
    {
      id: 1,
      title: 'Identifying Phishing Emails',
      category: 'Email Security',
      difficulty: 'Beginner',
      duration: '15 min',
      content: 'Learn to spot suspicious email patterns, verify sender authenticity, and protect your personal information from phishing attacks.',
      progress: userProgress.completedCourses.includes(1) ? 100 : 0,
      tags: ['phishing', 'email', 'security'],
      completedBy: 12847,
      rating: 4.8,
      thumbnail: '📧',
      videoUrl: 'https://www.youtube.com/watch?v=Y4WCn0S-h1c', // Real phishing education video
      resourceLinks: [
        { title: 'FTC Phishing Guide', url: 'https://consumer.ftc.gov/articles/how-recognize-and-avoid-phishing-scams' },
        { title: 'CISA Email Security', url: 'https://www.cisa.gov/email-security' }
      ],
      quiz: [
        {
          question: 'What is the most reliable way to verify if an email is legitimate?',
          options: [
            'Check the sender\'s email address',
            'Look for spelling mistakes',
            'Contact the organization independently',
            'Check if it contains personal info'
          ],
          correct: 2,
          explanation: 'Always verify through independent, official channels rather than trusting email content.'
        },
        {
          question: 'Which of these is a common phishing red flag?',
          options: [
            'Urgent language demanding immediate action',
            'Professional email signatures',
            'Company logos and branding',
            'Personalized greetings'
          ],
          correct: 0,
          explanation: 'Urgency is a classic manipulation tactic used by scammers to bypass critical thinking.'
        }
      ]
    },
    {
      id: 2,
      title: 'Social Media Misinformation Detection',
      category: 'Misinformation',
      difficulty: 'Beginner',
      duration: '20 min',
      content: 'Master the art of identifying fake news, deepfakes, and misleading content on social media platforms.',
      progress: userProgress.completedCourses.includes(2) ? 100 : 0,
      tags: ['social-media', 'fake-news', 'detection'],
      completedBy: 15632,
      rating: 4.9,
      thumbnail: '📱',
      videoUrl: 'https://www.youtube.com/watch?v=cQ54GDm1eL0', // Real misinformation detection video
      resourceLinks: [
        { title: 'Fact-Checking Resources', url: 'https://www.factcheck.org/' },
        { title: 'Media Literacy Guide', url: 'https://newslit.org/' }
      ],
      quiz: [
        {
          question: 'What should you check first when evaluating news on social media?',
          options: [
            'Number of likes and shares',
            'The source and publication date',
            'How emotional the headline is',
            'Whether friends shared it'
          ],
          correct: 1,
          explanation: 'Always verify the source credibility and check if the information is current.'
        }
      ]
    },
    {
      id: 3,
      title: 'Cryptocurrency Scam Prevention',
      category: 'Financial Security',
      difficulty: 'Intermediate',
      duration: '25 min',
      content: 'Navigate the crypto landscape safely, identify investment scams, and protect your digital assets from fraud.',
      progress: userProgress.completedCourses.includes(3) ? 100 : 0,
      tags: ['cryptocurrency', 'investment', 'scams'],
      completedBy: 8921,
      rating: 4.7,
      thumbnail: '₿',
      videoUrl: 'https://www.youtube.com/watch?v=DHo_v7VgTSE', // Real crypto scam prevention
      resourceLinks: [
        { title: 'SEC Crypto Guidance', url: 'https://www.sec.gov/cryptocurrency' },
        { title: 'FTC Crypto Scams', url: 'https://consumer.ftc.gov/articles/what-know-about-cryptocurrency-scams' }
      ],
      quiz: [
        {
          question: 'What is a major red flag for crypto investment scams?',
          options: [
            'Promises of guaranteed high returns',
            'Technical trading analysis',
            'Regulated exchange listings',
            'Transparent team information'
          ],
          correct: 0,
          explanation: 'Legitimate investments never guarantee returns. High guaranteed returns are always suspicious.'
        }
      ]
    },
    {
      id: 4,
      title: 'Advanced Social Engineering Defense',
      category: 'Psychology',
      difficulty: 'Advanced',
      duration: '35 min',
      content: 'Understand psychological manipulation techniques and build mental defenses against social engineering attacks.',
      progress: userProgress.completedCourses.includes(4) ? 100 : 0,
      tags: ['social-engineering', 'psychology', 'defense'],
      completedBy: 6734,
      rating: 4.9,
      thumbnail: '🧠',
      videoUrl: 'https://www.youtube.com/watch?v=lc7scxvKQOo', // Real social engineering defense
      resourceLinks: [
        { title: 'SANS Social Engineering', url: 'https://www.sans.org/topics/social-engineering/' },
        { title: 'Psychology of Persuasion', url: 'https://www.socialengineer.org/' }
      ],
      quiz: [
        {
          question: 'What is the primary goal of social engineering?',
          options: [
            'To test network security',
            'To manipulate people into divulging information',
            'To sell products or services',
            'To provide customer support'
          ],
          correct: 1,
          explanation: 'Social engineering exploits human psychology to gain unauthorized access to information or systems.'
        }
      ]
    },
    {
      id: 5,
      title: 'Medical Misinformation & Health Fraud',
      category: 'Misinformation',
      difficulty: 'Intermediate',
      duration: '30 min',
      content: 'Identify false medical claims, evaluate health information sources, and protect against health-related scams.',
      progress: userProgress.completedCourses.includes(5) ? 100 : 0,
      tags: ['health', 'medical', 'misinformation'],
      completedBy: 9456,
      rating: 4.6,
      thumbnail: '⚕️',
      videoUrl: 'https://www.youtube.com/watch?v=yqmso0c9CBs', // Real health misinformation video
      resourceLinks: [
        { title: 'WHO Infodemic Management', url: 'https://www.who.int/teams/risk-communication/infodemic-management' },
        { title: 'MedlinePlus Health Info', url: 'https://medlineplus.gov/' }
      ],
      quiz: [
        {
          question: 'Which source is most reliable for health information?',
          options: [
            'Social media health influencers',
            'Peer-reviewed medical journals',
            'Health product advertisements',
            'Personal testimonials online'
          ],
          correct: 1,
          explanation: 'Peer-reviewed medical journals provide scientifically validated health information.'
        }
      ]
    }
    // Adding more courses with similar structure...
  ];

  // Achievements system
  const ACHIEVEMENTS = [
    {
      id: 'first-course',
      title: 'Learning Journey Begins',
      description: 'Complete your first course',
      icon: RocketLaunchIcon,
      color: 'blue',
      xp: 100
    },
    {
      id: 'quiz-master',
      title: 'Quiz Master',
      description: 'Score 100% on 3 quizzes',
      icon: TrophyIcon,
      color: 'gold',
      xp: 250
    },
    {
      id: 'streak-week',
      title: 'Week Warrior',
      description: 'Learn for 7 consecutive days',
      icon: FireIcon,
      color: 'red',
      xp: 200
    }
  ];

  const categories = [
    'all', 
    'Email Security', 
    'Misinformation', 
    'Financial Security', 
    'Psychology', 
    'Mobile Security', 
    'Digital Security', 
    'Social Engineering'
  ];

  const filteredContent = selectedCategory === 'all' 
    ? educationContent 
    : educationContent.filter(item => item.category === selectedCategory);

  // Start course with real functionality
  const startCourse = (courseId) => {
    const course = educationContent.find(c => c.id === courseId);
    if (course.videoUrl) {
      window.open(course.videoUrl, '_blank');
    }
    
    // Mark as in progress and award XP
    setUserProgress(prev => {
      const updated = {
        ...prev,
        xp: prev.xp + 25,
        totalHours: prev.totalHours + (parseInt(course.duration) / 60)
      };
      saveProgress(updated);
      return updated;
    });
    
    showNotification(`🚀 Starting "${course.title}"`, 'success');
  };

  // Complete course
  const completeCourse = (courseId) => {
    setUserProgress(prev => {
      const updated = {
        ...prev,
        completedCourses: [...prev.completedCourses, courseId],
        xp: prev.xp + 100,
        totalHours: prev.totalHours + 0.5
      };
      
      // Check for achievements
      if (updated.completedCourses.length === 1 && !prev.achievements.includes('first-course')) {
        updated.achievements.push('first-course');
        setShowAchievement(ACHIEVEMENTS.find(a => a.id === 'first-course'));
        setTimeout(() => setShowAchievement(null), 3000);
      }
      
      saveProgress(updated);
      return updated;
    });
    
    showNotification(`🎉 Course completed! +100 XP`, 'success');
  };

  // Start quiz
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

  // Submit quiz answer
  const submitQuizAnswer = (questionIndex, answerIndex) => {
    setQuizAnswers(prev => ({
      ...prev,
      [questionIndex]: answerIndex
    }));
  };

  // Complete quiz
  const completeQuiz = () => {
    const { questions, courseId } = currentQuiz;
    let score = 0;
    
    questions.forEach((question, index) => {
      if (quizAnswers[index] === question.correct) {
        score++;
      }
    });
    
    const percentage = Math.round((score / questions.length) * 100);
    const xpEarned = score * 50;
    
    setUserProgress(prev => {
      const updated = {
        ...prev,
        xp: prev.xp + xpEarned
      };
      saveProgress(updated);
      return updated;
    });
    
    // Complete the course if quiz passed
    if (percentage >= 80) {
      completeCourse(courseId);
    }
    
    setCurrentQuiz(null);
    setQuizAnswers({});
    showNotification(`🎯 Quiz completed! Score: ${percentage}% (+${xpEarned} XP)`, 'success');
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-200';
      case 'Intermediate': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-200';
      case 'Advanced': return 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
    }
  };

  const getProgressColor = (progress) => {
    if (progress === 0) return 'bg-gray-200 dark:bg-gray-700';
    if (progress < 50) return 'bg-red-200 dark:bg-red-700';
    if (progress < 80) return 'bg-yellow-200 dark:bg-yellow-700';
    return 'bg-green-200 dark:bg-green-700';
  };

  return (
    <div className={`max-w-5xl mx-auto space-y-6 ${screenSize.isMobile ? 'px-4' : 'px-6'}`}>
      {/* Enhanced Header with Gamification */}
      <div className="text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", duration: 0.8 }}
          className="relative inline-block"
        >
          <BookOpenIcon className="w-12 h-12 md:w-16 md:h-16 mx-auto mb-4 text-purple-600" />
          {userProgress.streak > 0 && (
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="absolute -top-2 -right-2 bg-orange-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold"
            >
              <FireIcon className="w-4 h-4" />
            </motion.div>
          )}
        </motion.div>
        
        <h1 className="text-2xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">
          Digital Safety Education Center
        </h1>
        <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
          Master the skills to identify misinformation, prevent digital threats, and protect yourself in the digital age.
        </p>
        
        {/* User Progress Display */}
        {user && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 flex justify-center space-x-6"
          >
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">Level {userProgress.level}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Current Level</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{userProgress.xp}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">XP Points</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600 flex items-center justify-center space-x-1">
                <FireIcon className="w-6 h-6" />
                <span>{userProgress.streak}</span>
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Day Streak</div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Enhanced Stats Overview */}
      <div className={`grid gap-4 ${screenSize.isMobile ? 'grid-cols-2' : 'md:grid-cols-4'}`}>
        <motion.div whileHover={{ scale: 1.05 }}>
          <Card className="p-4 text-center hover:shadow-lg transition-all">
            <AcademicCapIcon className="w-8 h-8 mx-auto mb-2 text-blue-600" />
            <div className="text-2xl font-bold text-blue-600">{educationContent.length}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Total Courses</div>
          </Card>
        </motion.div>
        
        <motion.div whileHover={{ scale: 1.05 }}>
          <Card className="p-4 text-center hover:shadow-lg transition-all">
            <UserGroupIcon className="w-8 h-8 mx-auto mb-2 text-green-600" />
            <div className="text-2xl font-bold text-green-600">156K+</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Students</div>
          </Card>
        </motion.div>
        
        <motion.div whileHover={{ scale: 1.05 }}>
          <Card className="p-4 text-center hover:shadow-lg transition-all">
            <StarIcon className="w-8 h-8 mx-auto mb-2 text-yellow-600" />
            <div className="text-2xl font-bold text-yellow-600">4.7</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Avg Rating</div>
          </Card>
        </motion.div>
        
        <motion.div whileHover={{ scale: 1.05 }}>
          <Card className="p-4 text-center hover:shadow-lg transition-all">
            <CheckCircleIcon className="w-8 h-8 mx-auto mb-2 text-purple-600" />
            <div className="text-2xl font-bold text-purple-600">
              {userProgress.completedCourses.length}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Completed</div>
          </Card>
        </motion.div>
      </div>

      {/* Category Filter - Enhanced */}
      <Card className="p-4 md:p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
          <TagIcon className="w-5 h-5 mr-2" />
          Browse by Category
        </h3>
        <div className={`flex gap-2 ${screenSize.isMobile ? 'flex-wrap' : 'flex-row overflow-x-auto'}`}>
          {categories.map((category) => (
            <motion.button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`touch-button px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                selectedCategory === category
                  ? 'bg-purple-600 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {category === 'all' ? 'All Categories' : category}
            </motion.button>
          ))}
        </div>
      </Card>

      {/* Enhanced Course Grid */}
      <div className={`grid gap-4 ${screenSize.isMobile ? 'grid-cols-1' : 'md:grid-cols-2 lg:grid-cols-3'}`}>
        {filteredContent.map((course, index) => (
          <motion.div
            key={course.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.02 }}
          >
            <Card className="group hover:shadow-xl transition-all duration-300 overflow-hidden">
              <div className="p-4">
                {/* Course Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="text-4xl mb-2">{course.thumbnail}</div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(course.difficulty)}`}>
                      {course.difficulty}
                    </span>
                    {userProgress.completedCourses.includes(course.id) && (
                      <CheckCircleIcon className="w-5 h-5 text-green-500" />
                    )}
                  </div>
                </div>

                {/* Course Info */}
                <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-2 group-hover:text-purple-600 transition-colors">
                  {course.title}
                </h3>
                
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-3">
                  {course.content}
                </p>

                {/* Course Stats */}
                <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-4">
                  <div className="flex items-center space-x-4">
                    <span className="flex items-center">
                      <ClockIcon className="w-4 h-4 mr-1" />
                      {course.duration}
                    </span>
                    <span className="flex items-center">
                      <StarIcon className="w-4 h-4 mr-1 text-yellow-500" />
                      {course.rating}
                    </span>
                  </div>
                  <span className="flex items-center">
                    <UserGroupIcon className="w-4 h-4 mr-1" />
                    {course.completedBy.toLocaleString()}
                  </span>
                </div>

                {/* Progress Bar */}
                {course.progress > 0 && (
                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600 dark:text-gray-400">Progress</span>
                      <span className="font-medium">{course.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <motion.div 
                        className={`h-2 rounded-full transition-all duration-500 ${getProgressColor(course.progress)}`}
                        initial={{ width: 0 }}
                        animate={{ width: `${course.progress}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {course.tags.slice(0, 3).map((tag, tagIndex) => (
                    <span 
                      key={tagIndex}
                      className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs rounded-full"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-2">
                  <motion.button
                    onClick={() => startCourse(course.id)}
                    className="flex-1 touch-button bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white py-3 rounded-lg font-medium transition-all duration-300 flex items-center justify-center space-x-2 group-hover:shadow-lg"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <PlayIcon className="w-5 h-5" />
                    <span>{course.progress > 0 ? 'Continue' : 'Start Course'}</span>
                  </motion.button>
                  
                  {course.quiz && (
                    <motion.button
                      onClick={() => startQuiz(course.id)}
                      className="px-4 py-3 border-2 border-purple-600 text-purple-600 rounded-lg font-medium hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-all"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <QuestionMarkCircleIcon className="w-5 h-5" />
                    </motion.button>
                  )}
                </div>

                {/* Resource Links */}
                {course.resourceLinks && course.resourceLinks.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
                    <h4 className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2">
                      📚 Additional Resources:
                    </h4>
                    <div className="flex flex-wrap gap-1">
                      {course.resourceLinks.map((link, linkIndex) => (
                        <motion.a
                          key={linkIndex}
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
                          whileHover={{ scale: 1.05 }}
                        >
                          {link.title}
                        </motion.a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Enhanced Learning Path Suggestion */}
      {user && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          whileHover={{ scale: 1.02 }}
        >
          <Card className="p-6 bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 border-purple-200 dark:border-purple-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-purple-600 rounded-full">
                  <TrophyIcon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-purple-900 dark:text-purple-200 mb-1">
                    🎯 Recommended Learning Path
                  </h3>
                  <p className="text-purple-700 dark:text-purple-300 text-sm">
                    Level {userProgress.level} • {userProgress.xp} XP • {userProgress.completedCourses.length}/{educationContent.length} courses completed
                  </p>
                </div>
              </div>
              <motion.button
                className="touch-button bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  const nextCourse = educationContent.find(c => !userProgress.completedCourses.includes(c.id));
                  if (nextCourse) {
                    startCourse(nextCourse.id);
                  } else {
                    showNotification('🎉 All courses completed! You are a security expert!', 'success');
                  }
                }}
              >
                Continue Path
              </motion.button>
            </div>
            
            {/* Progress Bar for Overall Completion */}
            <div className="mt-4">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-purple-700 dark:text-purple-300">Overall Progress</span>
                <span className="font-medium text-purple-900 dark:text-purple-200">
                  {Math.round((userProgress.completedCourses.length / educationContent.length) * 100)}%
                </span>
              </div>
              <div className="w-full bg-purple-200 dark:bg-purple-800 rounded-full h-2">
                <motion.div
                  className="h-2 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600"
                  initial={{ width: 0 }}
                  animate={{ width: `${(userProgress.completedCourses.length / educationContent.length) * 100}%` }}
                  transition={{ duration: 1, delay: 0.5 }}
                />
              </div>
            </div>
          </Card>
        </motion.div>
      )}

      {/* Quiz Modal */}
      <AnimatePresence>
        {currentQuiz && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white dark:bg-gray-800 rounded-2xl p-8 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Course Quiz
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400">{currentQuiz.courseTitle}</p>
                </div>
                <button
                  onClick={() => setCurrentQuiz(null)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                >
                  <XMarkIcon className="w-6 h-6 text-gray-500" />
                </button>
              </div>

              {currentQuiz && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                    <span>Question {currentQuiz.currentQuestion + 1} of {currentQuiz.questions.length}</span>
                    <span>Score: {currentQuiz.score}/{currentQuiz.questions.length}</span>
                  </div>

                  <div className="space-y-4">
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
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <div className="flex items-center space-x-3">
                            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                              quizAnswers[currentQuiz.currentQuestion] === index
                                ? 'border-purple-500 bg-purple-500'
                                : 'border-gray-300 dark:border-gray-600'
                            }`}>
                              {quizAnswers[currentQuiz.currentQuestion] === index && (
                                <CheckCircleIcon className="w-4 h-4 text-white" />
                              )}
                            </div>
                            <span className="text-gray-900 dark:text-white">{option}</span>
                          </div>
                        </motion.button>
                      ))}
                    </div>
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
                      whileHover={{ scale: currentQuiz.currentQuestion === 0 ? 1 : 1.05 }}
                    >
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
                      whileTap={{ scale: quizAnswers[currentQuiz.currentQuestion] === undefined ? 1 : 0.95 }}
                    >
                      <span>
                        {currentQuiz.currentQuestion === currentQuiz.questions.length - 1 ? 'Complete Quiz' : 'Next'}
                      </span>
                      <ArrowRightIcon className="w-4 h-4" />
                    </motion.button>
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Achievement Popup */}
      <AnimatePresence>
        {showAchievement && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white dark:bg-gray-800 rounded-2xl p-8 text-center max-w-md"
              initial={{ scale: 0.5, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.5, opacity: 0, y: 50 }}
              transition={{ type: "spring", damping: 15 }}
            >
              <motion.div
                className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-r from-yellow-400 to-yellow-600 flex items-center justify-center"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, delay: 0.2 }}
              >
                <showAchievement.icon className="w-10 h-10 text-white" />
              </motion.div>
              
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Achievement Unlocked! 🎉
              </h2>
              
              <h3 className="text-lg font-semibold text-yellow-600 dark:text-yellow-400 mb-2">
                {showAchievement.title}
              </h3>
              
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                {showAchievement.description}
              </p>
              
              <motion.div
                className="inline-flex items-center space-x-1 bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-400 px-4 py-2 rounded-full font-medium"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ repeat: 3, duration: 0.3 }}
              >
                <SparklesIcon className="w-4 h-4" />
                <span>+{showAchievement.xp} XP</span>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default EducationSection;
