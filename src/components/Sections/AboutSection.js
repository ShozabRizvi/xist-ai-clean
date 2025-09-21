import React from 'react';
import { motion } from 'framer-motion';
import { 
  InformationCircleIcon, 
  ShieldCheckIcon, 
  UsersIcon, 
  CpuChipIcon, 
  HeartIcon, 
  GlobeAltIcon, 
  AcademicCapIcon, 
  TrophyIcon,
  CodeBracketIcon,
  PaintBrushIcon,
  LinkIcon
} from '@heroicons/react/24/outline';
import Card from '../UI/Card';
import { useResponsive } from '../../hooks/useResponsive';


const AboutSection = () => {
  const { screenSize } = useResponsive();

  const teamMembers = [
    {
      name: 'Shozab Rizvi',
      role: 'Lead Developer',
      image: 'Shozab-v2.png',
      icon: CodeBracketIcon,
      isTeam: false,
      experience: '3rd Year Student',
      education: 'B.Tech Computer Science Engineering, FGIET Raebareli',
      bio: 'Shozab is a third-year computer science student at FGIET Raebareli and the founder of Xist AI. As a passionate student developer, he leads the technical development of the platform while balancing his academic studies.',
      specializations: ['React Development', 'JavaScript/TypeScript', 'AI Integration', 'Web Security', 'System Design'],
      socialLinks: {
        github: 'https://github.com/shozabrizvi',
        linkedin: 'https://linkedin.com/in/shozab-rizvi',
        email: 'shozabrizvi16@gmail.com'
      },
      location: 'Raebareli, UP',
      currentFocus: 'Building scalable AI-powered security solutions while pursuing B.Tech degree'
    },
    {
      name: 'Rishabh Srivastava',
      role: 'AI Expert',
      subtitle: 'Analysis & Custom Responses',
      image: 'Rishabh.png',
      icon: CpuChipIcon,
      isTeam: false,
      experience: '3rd Year Student',
      education: 'B.Tech Computer Science Engineering, FGIET Raebareli',
      bio: 'Rishabh is a third-year computer science student at FGIET Raebareli, specializing in artificial intelligence and machine learning. He develops intelligent analysis systems for Xist AI.',
      specializations: ['Machine Learning', 'Python Programming', 'AI Model Training', 'Data Analysis', 'Algorithm Design'],
      socialLinks: {
        github: 'https://github.com/rishabh-ai-fresh',
        linkedin: 'https://www.linkedin.com/in/rishabh-srivastava-854a98377/',
        email: 'parabalsrivastava@gmail.com'
      },
      location: 'Raebareli, UP',
      currentFocus: 'Applying AI knowledge from coursework to real-world cybersecurity challenges'
    },
    {
      name: 'Asmit Gupta',
      role: 'Community Moderator & Creative Team',
      image: 'Asmit.png',
      icon: PaintBrushIcon,
      isTeam: false,
      experience: '2nd Year Student',
      education: 'B.Tech Computer Science Engineering, AKGEC Ghaziabad',
      bio: 'Asmit is a second-year computer science student at AKGEC, Ghaziabad. He manages community engagement and creative design for Xist AI while pursuing his studies.',
      specializations: ['UI/UX Design', 'Community Management', 'Social Media Strategy', 'Content Creation', 'Digital Design'],
      socialLinks: {
        github: 'https://github.com/asmit-creative',
        linkedin: 'https://www.linkedin.com/in/asmit-gupta',
        email: 'asmitgupta2006@gmail.com'
      },
      location: 'Ghaziabad, UP',
      currentFocus: 'Making cybersecurity education engaging through creative design while completing studies'
    }
  ];

  const stats = [
    { label: 'Users Protected', value: '2.3K+', icon: UsersIcon },
    { label: 'Threats Detected', value: '5.2K+', icon: ShieldCheckIcon },
    { label: 'Accuracy Rate', value: '94.8%', icon: TrophyIcon },
    { label: 'Active Development', value: '6+ months', icon: GlobeAltIcon }
  ];

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-12">
      
      {/* Header Section */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-6"
      >
        <div className="flex items-center justify-center space-x-3">
          <div className="w-16 h-16 rounded-full flex items-center justify-center">
            <InformationCircleIcon className="w-12 h-12  mx-auto mb-4 text-purple-600" />
          </div>
          <div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">About Xist AI</h1>
            <p className="text-xl text-gray-600 dark:text-gray-300">Advanced AI platform built by students</p>
          </div>
        </div>

        <p className="text-lg text-gray-700 dark:text-gray-300 max-w-4xl mx-auto leading-relaxed">
          Xist AI is a student-led initiative dedicated to protecting individuals and communities from digital threats through innovative AI technology. Built by passionate computer science students, we combine academic knowledge with practical application to make cybersecurity accessible to everyone.
        </p>
      </motion.div>

      {/* Key Features */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg"
      >
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">How Xist AI Works</h2>
        
        <p className="text-gray-600 dark:text-gray-300 text-center mb-8 max-w-3xl mx-auto">
          Our platform combines modern web technologies, machine learning algorithms, and AI-powered analysis using 
          <strong className="text-purple-600 dark:text-purple-400"> DeepSeek-R1 AI</strong> to provide comprehensive digital 
          protection services with <strong className="text-green-600 dark:text-green-400">94.8% accuracy</strong> - all developed by students during their studies.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              icon: CpuChipIcon,
              title: "Student-Built AI Models",
              description: "AI models developed by computer science students using modern technologies and algorithms"
            },
            {
              icon: ShieldCheckIcon, 
              title: "Real-time Protection",
              description: "Fast threat detection system built with latest web development practices learned in college"
            },
            {
              icon: UsersIcon,
              title: "Student Community", 
              description: "Built by students, for everyone who needs accessible digital protection and education"
            },
            {
              icon: AcademicCapIcon,
              title: "Learning-Focused",
              description: "Continuously improving the platform while learning and applying new concepts from coursework"
            }
          ].map((feature, idx) => (
            <motion.div
              key={idx}
              className="text-center p-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + idx * 0.1 }}
            >
              <feature.icon className="w-12 h-12 text-purple-600 dark:text-purple-400 mx-auto mb-4" />
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">{feature.title}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Team Section - CLEAN VERSION */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg"
      >
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 text-center">Meet Our Team</h2>
        <p className="text-center text-gray-600 dark:text-gray-300 mb-8">
          Computer science students passionate about cybersecurity and technology
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {teamMembers.map((member, index) => (
            <motion.div
              key={index}
              className="text-center p-6 bg-gray-50 dark:bg-gray-700 rounded-xl"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 + index * 0.1 }}
              whileHover={{ y: -5 }}
            >
              {/* Team Member Image */}
              <div className="relative mb-4">
                <img
                  src={`/${member.image}`}
                  alt={member.name}
                  className="w-24 h-24 rounded-full object-cover mx-auto border-4 border-white shadow-lg"
                  onError={(e) => {
                    console.log(`Failed to load: ${member.image}`);
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
                {/* Fallback Avatar */}
                <div className="w-24 h-24 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold text-lg flex items-center justify-center mx-auto border-4 border-white shadow-lg hidden">
                  {member.name.split(' ').map(n => n[0]).join('')}
                </div>
              </div>

              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
                {member.name}
              </h3>
              
              <p className="text-purple-600 dark:text-purple-400 font-medium text-sm mb-2">
                {member.role}
              </p>
              
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                {member.education}
              </p>
              
              <p className="text-xs text-gray-500 dark:text-gray-500 mb-3">
                📍 {member.location}
              </p>

              {/* Specializations */}
              <div className="mb-4">
                <div className="flex flex-wrap justify-center gap-1">
                  {member.specializations.slice(0, 3).map((skill, skillIndex) => (
                    <span
                      key={skillIndex}
                      className="px-2 py-1 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 text-xs rounded-full"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Social Links */}
              <div className="flex justify-center space-x-3">
                {member.socialLinks?.github && (
                  <a
                    href={member.socialLinks.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
                    </svg>
                  </a>
                )}
                
                {member.socialLinks?.linkedin && (
                  <a
                    href={member.socialLinks.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                  </a>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Stats Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl p-8 text-white"
      >
        <h2 className="text-2xl font-bold text-center mb-4">Our Journey So Far</h2>
        <p className="text-center text-purple-100 mb-8">Student project making real impact</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat, idx) => (
            <motion.div
              key={idx}
              className="text-center"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.7 + idx * 0.1 }}
            >
              <stat.icon className="w-8 h-8 mx-auto mb-2 opacity-80" />
              <div className="text-3xl font-bold mb-1">{stat.value}</div>
              <div className="text-sm opacity-90">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Mission Statement */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="text-center space-y-6"
      >
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Our Student Mission</h2>
        <p className="text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
          As computer science students, we believe in using our knowledge to solve real-world problems. 
          Xist AI represents our commitment to making the digital world safer for everyone, one line of code at a time.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              icon: ShieldCheckIcon,
              title: "Student Innovation",
              description: "Applying classroom knowledge to solve real cybersecurity challenges"
            },
            {
              icon: UsersIcon,
              title: "Community Focus", 
              description: "Building solutions that help students and families stay safe online"
            },
            {
              icon: AcademicCapIcon,
              title: "Learn & Build",
              description: "Continuously learning while developing cutting-edge security solutions"
            }
          ].map((commitment, idx) => (
            <motion.div
              key={idx}
              className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg"
              whileHover={{ y: -5 }}
              transition={{ delay: 0.9 + idx * 0.1 }}
            >
              <commitment.icon className="w-12 h-12 text-purple-600 dark:text-purple-400 mx-auto mb-4" />
              <h3 className="font-bold text-gray-900 dark:text-white mb-2">{commitment.title}</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">{commitment.description}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default AboutSection;
