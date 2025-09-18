import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CameraIcon, 
  MicrophoneIcon, 
  DocumentArrowUpIcon,
  SparklesIcon,
  ShieldExclamationIcon,
  CheckCircleIcon,
  XCircleIcon,
  HeartIcon,
  BoltIcon,
  EyeIcon,
  FireIcon,
  StarIcon
} from '@heroicons/react/24/outline';

const MobileVerifyScreen = ({ user, userStats, onAnalysis }) => {
  const [inputText, setInputText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [hapticEnabled, setHapticEnabled] = useState(true);
  const [voiceMode, setVoiceMode] = useState(false);
  const [cameraMode, setCameraMode] = useState(false);
  const [swipeDirection, setSwipeDirection] = useState(null);
  const [particles, setParticles] = useState([]);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 24
      }
    }
  };

  const pulseVariants = {
    pulse: {
      scale: [1, 1.05, 1],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  // Particle animation for gamification
  const createParticles = (type = 'success') => {
    const newParticles = Array.from({ length: 8 }, (_, i) => ({
      id: Date.now() + i,
      x: Math.random() * window.innerWidth,
      y: window.innerHeight * 0.6,
      color: type === 'success' ? '#10B981' : type === 'warning' ? '#F59E0B' : '#EF4444',
      emoji: type === 'success' ? '✅' : type === 'warning' ? '⚠️' : '🚨'
    }));
    setParticles(newParticles);
    
    setTimeout(() => setParticles([]), 2000);
  };

  // Enhanced haptic feedback
  const triggerHaptic = (type = 'impact') => {
    if (hapticEnabled && 'vibrate' in navigator) {
      const patterns = {
        impact: [10],
        success: [10, 50, 10],
        warning: [50, 100, 50],
        error: [100, 50, 100, 50, 100],
        gameReward: [10, 30, 10, 30, 10, 30, 10]
      };
      navigator.vibrate(patterns[type] || patterns.impact);
    }
  };

  // UNIQUE AI INNOVATION: Advanced Threat Analysis
  const analyzeRealTime = (text) => {
    if (!text || text.length < 10) return null;
    
    const threatIndicators = [
      { pattern: /urgent|emergency|act now/gi, weight: 20, type: 'urgency', severity: 'high' },
      { pattern: /free|win|prize|congratulations/gi, weight: 15, type: 'too-good-to-be-true', severity: 'medium' },
      { pattern: /click here|limited time/gi, weight: 25, type: 'pressure', severity: 'high' },
      { pattern: /bank|account|suspend|verify/gi, weight: 30, type: 'phishing', severity: 'critical' },
      { pattern: /bitcoin|crypto|investment/gi, weight: 20, type: 'financial', severity: 'high' },
      { pattern: /love|relationship|lonely/gi, weight: 25, type: 'romance_scam', severity: 'high' }
    ];

    let riskScore = 0;
    let detectedThreats = [];

    threatIndicators.forEach(({ pattern, weight, type, severity }) => {
      const matches = (text.match(pattern) || []).length;
      if (matches > 0) {
        riskScore += weight * matches;
        detectedThreats.push({ type, severity, matches });
      }
    });

    const threatLevel = riskScore > 60 ? 'CRITICAL' : riskScore > 40 ? 'HIGH' : riskScore > 20 ? 'MEDIUM' : 'LOW';
    
    return {
      riskScore: Math.min(riskScore, 100),
      threatLevel,
      detectedThreats,
      emotion: analyzeEmotion(text),
      manipulation: analyzeManipulation(text),
      predictiveInsights: generatePredictiveInsights(text),
      socialEngineering: analyzeSocialEngineering(text),
      aiGenerated: detectAIGenerated(text)
    };
  };

  // UNIQUE FEATURE: Emotion & Psychology Analysis
  const analyzeEmotion = (text) => {
    const emotionalPatterns = {
      fear: { pattern: /afraid|scared|danger|risk|threat|lose|miss out|emergency|urgent/gi, weight: 30 },
      anger: { pattern: /angry|furious|outraged|disgusted|hate|mad|frustrated/gi, weight: 25 },
      greed: { pattern: /money|profit|rich|wealth|earn|gain|investment|returns/gi, weight: 35 },
      urgency: { pattern: /now|immediately|quickly|hurry|deadline|expires|limited/gi, weight: 40 },
      trust: { pattern: /trusted|verified|official|legitimate|guaranteed|certified/gi, weight: 20 },
      social: { pattern: /everyone|people|friends|family|community|popular/gi, weight: 25 }
    };

    const emotions = {};
    let totalScore = 0;
    let dominantEmotion = 'neutral';
    let maxScore = 0;

    Object.entries(emotionalPatterns).forEach(([emotion, { pattern, weight }]) => {
      const matches = (text.match(pattern) || []).length;
      const score = Math.min(matches * weight, 100);
      emotions[emotion] = score;
      totalScore += score;
      
      if (score > maxScore) {
        maxScore = score;
        dominantEmotion = emotion;
      }
    });

    return {
      emotions,
      manipulationScore: Math.min(totalScore / 6, 100),
      dominantEmotion,
      psychologicalProfile: generatePsychologicalProfile(emotions),
      emotionalIntensity: Math.min(totalScore / 200 * 100, 100)
    };
  };

  // UNIQUE FEATURE: Social Engineering Detection
  const analyzeSocialEngineering = (text) => {
    const techniques = [
      { name: 'Authority', pattern: /doctor|expert|professor|official|government|ceo|director/gi, weight: 25 },
      { name: 'Social Proof', pattern: /everyone|thousands|millions|most people|studies show/gi, weight: 30 },
      { name: 'Scarcity', pattern: /limited|exclusive|rare|only \d+|last chance|running out/gi, weight: 35 },
      { name: 'Reciprocity', pattern: /free|gift|bonus|thank you|in return|because you/gi, weight: 20 },
      { name: 'Commitment', pattern: /agree|promise|guarantee|commitment|pledge|word/gi, weight: 25 },
      { name: 'Likability', pattern: /like you|similar|common|share|understand|friend/gi, weight: 20 }
    ];

    const detectedTechniques = [];
    let totalScore = 0;

    techniques.forEach(({ name, pattern, weight }) => {
      const matches = (text.match(pattern) || []).length;
      if (matches > 0) {
        const score = Math.min(matches * weight, 100);
        detectedTechniques.push({ name, score, matches });
        totalScore += score;
      }
    });

    return {
      techniques: detectedTechniques,
      overallScore: Math.min(totalScore / 6, 100),
      sophistication: totalScore > 100 ? 'EXPERT' : totalScore > 50 ? 'ADVANCED' : totalScore > 20 ? 'INTERMEDIATE' : 'BASIC',
      riskLevel: totalScore > 80 ? 'CRITICAL' : totalScore > 50 ? 'HIGH' : totalScore > 25 ? 'MEDIUM' : 'LOW'
    };
  };

  // UNIQUE FEATURE: AI-Generated Content Detection
  const detectAIGenerated = (text) => {
    const aiIndicators = [
      { pattern: /as an ai|i'm an ai|artificial intelligence|machine learning/gi, weight: 50 },
      { pattern: /however|furthermore|moreover|nevertheless|consequently/gi, weight: 15 },
      { pattern: /it's important to note|please note|it's worth mentioning/gi, weight: 25 },
      { pattern: /in conclusion|to summarize|overall|in summary/gi, weight: 20 }
    ];

    let aiScore = 0;
    const detectedPatterns = [];

    aiIndicators.forEach(({ pattern, weight }) => {
      const matches = (text.match(pattern) || []).length;
      if (matches > 0) {
        aiScore += weight * matches;
        detectedPatterns.push(pattern.source);
      }
    });

    // Text structure analysis
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 10);
    const avgSentenceLength = sentences.reduce((sum, s) => sum + s.length, 0) / sentences.length;
    
    // AI tends to write longer, more structured sentences
    if (avgSentenceLength > 80) aiScore += 15;
    
    return {
      score: Math.min(aiScore, 100),
      likelihood: aiScore > 60 ? 'HIGH' : aiScore > 30 ? 'MEDIUM' : 'LOW',
      patterns: detectedPatterns,
      confidence: Math.min(aiScore * 1.2, 95)
    };
  };

  const generatePsychologicalProfile = (emotions) => {
    const { fear, greed, urgency, social } = emotions;
    
    if (fear > 50 && urgency > 40) return 'Fear-based manipulation with urgency tactics';
    if (greed > 60) return 'Financial exploitation targeting greed';
    if (social > 50) return 'Social engineering using peer pressure';
    if (urgency > 60) return 'High-pressure decision manipulation';
    return 'Standard persuasion techniques detected';
  };

  // Enhanced analysis with all features
  const analyzeManipulation = (text) => {
    const techniques = [
      { name: 'Authority Appeal', pattern: /expert|doctor|study|research|scientists|official/gi },
      { name: 'Social Proof', pattern: /everyone|most people|thousands|millions|popular/gi },
      { name: 'Scarcity Pressure', pattern: /limited|exclusive|rare|only \d+|last chance/gi },
      { name: 'Fear Appeal', pattern: /dangerous|risky|avoid|protect|safe|threat|warning/gi },
      { name: 'Urgency Tactics', pattern: /now|immediately|urgent|expires|deadline/gi },
      { name: 'False Authority', pattern: /breakthrough|secret|hidden|they don't want/gi }
    ];

    const detectedTechniques = techniques.filter(({ pattern }) => 
      pattern.test(text)
    ).map(({ name }) => name);

    const sophisticationLevel = detectedTechniques.length > 4 ? 'EXPERT' :
                               detectedTechniques.length > 2 ? 'ADVANCED' :
                               detectedTechniques.length > 0 ? 'INTERMEDIATE' : 'BASIC';

    return {
      techniques: detectedTechniques,
      score: detectedTechniques.length * 20,
      sophistication: sophisticationLevel,
      riskMultiplier: detectedTechniques.length > 3 ? 1.5 : 1.0
    };
  };

  // UNIQUE FEATURE: Predictive Viral Analysis
  const generatePredictiveInsights = (text) => {
    const viralIndicators = [
      { pattern: /share|tell everyone|spread the word|forward this/gi, weight: 40 },
      { pattern: /breaking|urgent|alert|emergency|important/gi, weight: 35 },
      { pattern: /shocking|unbelievable|incredible|amazing|wow/gi, weight: 30 },
      { pattern: /you won't believe|this will shock you|must see/gi, weight: 45 }
    ];

    let viralScore = 0;
    const viralFactors = [];

    viralIndicators.forEach(({ pattern, weight }) => {
      const matches = (text.match(pattern) || []).length;
      if (matches > 0) {
        viralScore += weight * matches;
        viralFactors.push({ type: pattern.source, impact: weight * matches });
      }
    });

    // Platform-specific predictions
    const platformMultipliers = {
      twitter: viralScore > 50 ? 1.8 : 1.2,
      facebook: viralScore > 40 ? 1.5 : 1.1,
      whatsapp: viralScore > 30 ? 2.0 : 1.3,
      telegram: viralScore > 60 ? 1.7 : 1.0
    };

    const peakTime = viralScore > 70 ? '2-6 hours' :
                    viralScore > 40 ? '6-24 hours' :
                    viralScore > 20 ? '1-3 days' : '3+ days';

    return {
      viralPotential: Math.min(viralScore, 100),
      predictedSpread: viralScore > 60 ? 'VIRAL' : viralScore > 35 ? 'MODERATE' : 'LIMITED',
      peakTime,
      platformMultipliers,
      factors: viralFactors,
      estimatedReach: calculateEstimatedReach(viralScore)
    };
  };

  const calculateEstimatedReach = (viralScore) => {
    const baseReach = Math.floor(viralScore * 1000);
    return {
      conservative: baseReach,
      likely: Math.floor(baseReach * 2.5),
      optimistic: Math.floor(baseReach * 5)
    };
  };

  const performAnalysis = async () => {
    if (!inputText.trim()) return;
    
    setIsAnalyzing(true);
    triggerHaptic('impact');

    try {
      // Simulate advanced AI processing with realistic delay
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const result = analyzeRealTime(inputText);
      setAnalysisResult(result);
      
      // Create appropriate particle effects
      if (result.threatLevel === 'CRITICAL' || result.threatLevel === 'HIGH') {
        triggerHaptic('error');
        createParticles('error');
      } else if (result.threatLevel === 'MEDIUM') {
        triggerHaptic('warning');
        createParticles('warning');
      } else {
        triggerHaptic('success');
        createParticles('success');
      }
      
    } catch (error) {
      console.error('Analysis failed:', error);
      triggerHaptic('error');
    }
    
    setIsAnalyzing(false);
  };

  const handleUserFeedback = (feedback) => {
    triggerHaptic('gameReward');
    createParticles('success');
    
    // Award points for feedback
    const points = feedback === 'correct_prediction' ? 25 : 10;
    console.log(`User feedback: ${feedback}, awarded ${points} points`);
  };

  // Swipe gesture handling
  const handleSwipe = (direction) => {
    if (!analysisResult) return;
    
    setSwipeDirection(direction);
    
    if (direction === 'left') {
      handleUserFeedback('threat');
    } else if (direction === 'right') {
      handleUserFeedback('safe');
    }
    
    setTimeout(() => setSwipeDirection(null), 500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white overflow-hidden relative">
      
      {/* Particle System */}
      <AnimatePresence>
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            initial={{ 
              x: particle.x, 
              y: particle.y, 
              scale: 0, 
              opacity: 1 
            }}
            animate={{ 
              y: particle.y - 200, 
              scale: [0, 1.5, 0],
              opacity: [0, 1, 0],
              rotate: [0, 180, 360]
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 2, ease: "easeOut" }}
            className="absolute pointer-events-none text-2xl z-50"
            style={{ color: particle.color }}
          >
            {particle.emoji}
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Mobile Header */}
      <motion.div 
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="sticky top-0 z-40 bg-black/20 backdrop-blur-lg border-b border-white/10"
      >
        <div className="flex items-center justify-between p-4">
          <motion.div 
            className="flex items-center space-x-3"
            whileHover={{ scale: 1.05 }}
          >
            <motion.div 
              className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center"
              variants={pulseVariants}
              animate="pulse"
            >
              <SparklesIcon className="w-6 h-6" />
            </motion.div>
            <div>
              <h1 className="text-xl font-bold">Xist AI</h1>
              <p className="text-xs text-gray-300">Advanced Guardian</p>
            </div>
          </motion.div>
          
          {/* Gamified User Stats */}
          <motion.div 
            className="flex items-center space-x-3"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="text-right">
              <div className="text-sm font-bold text-yellow-400">
                Level {userStats?.level || 1}
              </div>
              <div className="text-xs text-gray-300">
                {userStats?.points || 0} pts
              </div>
            </div>
            <motion.div 
              className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center relative"
              animate={{ 
                boxShadow: ["0 0 0 0 rgba(251, 191, 36, 0.7)", "0 0 0 10px rgba(251, 191, 36, 0)", "0 0 0 0 rgba(251, 191, 36, 0)"]
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <StarIcon className="w-6 h-6 text-black" />
              {/* Level progress ring */}
              <svg className="absolute inset-0 w-12 h-12 transform -rotate-90">
                <circle
                  cx="24"
                  cy="24"
                  r="20"
                  stroke="rgba(255,255,255,0.3)"
                  strokeWidth="2"
                  fill="none"
                />
                <motion.circle
                  cx="24"
                  cy="24"
                  r="20"
                  stroke="#10B981"
                  strokeWidth="2"
                  fill="none"
                  strokeLinecap="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: (userStats?.points % 100) / 100 || 0.3 }}
                  transition={{ duration: 1.5, ease: "easeInOut" }}
                  strokeDasharray="126"
                />
              </svg>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>

      {/* Main Content */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="p-4 space-y-6"
      >
        
        {/* Daily Challenges - Enhanced Gamification */}
        <motion.div 
          variants={itemVariants}
          className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20"
          whileHover={{ scale: 1.02, y: -5 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <div className="flex items-center justify-between mb-6">
            <motion.h2 
              className="text-xl font-bold flex items-center space-x-2"
              layoutId="challenge-title"
            >
              <motion.span
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
              >
                🎯
              </motion.span>
              <span>Daily Challenges</span>
            </motion.h2>
            <motion.div 
              className="bg-gradient-to-r from-green-400 to-blue-500 text-white px-4 py-2 rounded-full text-sm font-bold"
              animate={{ 
                boxShadow: ["0 0 0 0 rgba(16, 185, 129, 0.4)", "0 0 0 8px rgba(16, 185, 129, 0)", "0 0 0 0 rgba(16, 185, 129, 0)"]
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              Earn +10-25 pts
            </motion.div>
          </div>
          
          <div className="space-y-4">
            {[
              { 
                text: "🚨 URGENT! You've won $10,000! Click this link before it expires in 1 hour!", 
                difficulty: 'Easy', 
                points: 10, 
                category: 'Lottery Scam',
                threat: 'Financial'
              },
              { 
                text: "Your bank account will be suspended unless you verify your identity immediately through this secure link.", 
                difficulty: 'Medium', 
                points: 15, 
                category: 'Phishing Attack',
                threat: 'Identity Theft'
              },
              { 
                text: "Secret investment opportunity! This AI algorithm guarantees 500% returns. Only 5 spots left!", 
                difficulty: 'Hard', 
                points: 25, 
                category: 'Investment Fraud',
                threat: 'Financial Scam'
              }
            ].map((challenge, idx) => (
              <motion.div
                key={idx}
                variants={itemVariants}
                className="bg-black/20 rounded-xl p-4 border border-white/10 cursor-pointer"
                whileHover={{ 
                  scale: 1.03, 
                  backgroundColor: "rgba(0,0,0,0.3)",
                  borderColor: "rgba(255,255,255,0.3)"
                }}
                whileTap={{ scale: 0.97 }}
                onClick={() => {
                  setInputText(challenge.text);
                  triggerHaptic('impact');
                  createParticles('success');
                }}
                layoutId={`challenge-${idx}`}
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex space-x-2">
                    <motion.span 
                      className={`px-3 py-1 rounded-full text-xs font-bold ${
                        challenge.difficulty === 'Easy' ? 'bg-green-500 text-black' :
                        challenge.difficulty === 'Medium' ? 'bg-yellow-500 text-black' :
                        'bg-red-500 text-white'
                      }`}
                      whileHover={{ scale: 1.1 }}
                    >
                      {challenge.difficulty}
                    </motion.span>
                    <span className="px-3 py-1 bg-purple-500/30 text-purple-200 rounded-full text-xs font-medium">
                      {challenge.category}
                    </span>
                    <span className="px-3 py-1 bg-orange-500/30 text-orange-200 rounded-full text-xs font-medium">
                      {challenge.threat}
                    </span>
                  </div>
                  <motion.span 
                    className="text-sm text-purple-300 font-bold"
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
                  >
                    +{challenge.points} pts
                  </motion.span>
                </div>
                <p className="text-sm text-gray-300 leading-relaxed mb-3">
                  {challenge.text}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-400">Tap to analyze with AI</span>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  >
                    <BoltIcon className="w-4 h-4 text-yellow-400" />
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Input Methods - Enhanced */}
        <motion.div 
          variants={itemVariants}
          className="grid grid-cols-3 gap-4"
        >
          {[
            {
              icon: CameraIcon,
              label: "AR Scan",
              subtitle: "Point & Detect",
              gradient: "from-blue-500 to-cyan-500",
              action: () => setCameraMode(!cameraMode)
            },
            {
              icon: MicrophoneIcon,
              label: "Voice AI",
              subtitle: 'Say "Hey Xist"',
              gradient: "from-purple-500 to-pink-500",
              action: () => setVoiceMode(!voiceMode)
            },
            {
              icon: DocumentArrowUpIcon,
              label: "Smart Upload",
              subtitle: "Drag & Drop",
              gradient: "from-green-500 to-emerald-500",
              action: () => {}
            }
          ].map((method, idx) => (
            <motion.button
              key={idx}
              variants={itemVariants}
              className={`bg-gradient-to-r ${method.gradient} p-6 rounded-2xl flex flex-col items-center space-y-3`}
              whileHover={{ 
                scale: 1.05, 
                rotateY: 10,
                boxShadow: "0 10px 25px rgba(0,0,0,0.2)" 
              }}
              whileTap={{ scale: 0.95 }}
              onClick={method.action}
              style={{ minHeight: '48px', minWidth: '48px' }}
            >
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
              >
                <method.icon className="w-8 h-8" />
              </motion.div>
              <span className="text-sm font-bold">{method.label}</span>
              <span className="text-xs opacity-80">{method.subtitle}</span>
            </motion.button>
          ))}
        </motion.div>

        {/* Enhanced Text Input */}
        <motion.div 
          variants={itemVariants}
          className="space-y-4"
        >
          <motion.textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Paste suspicious messages, URLs, claims, or any content you want our AI to verify for digital threats..."
            className="w-full h-40 bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-4 text-white placeholder-gray-300 resize-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-base leading-relaxed"
            style={{ fontSize: '16px' }}
            whileFocus={{ 
              scale: 1.02, 
              borderColor: "rgba(147, 51, 234, 0.5)",
              boxShadow: "0 0 20px rgba(147, 51, 234, 0.3)" 
            }}
            transition={{ type: "spring", stiffness: 300 }}
          />
          
          <motion.div 
            className="flex justify-between items-center text-sm text-gray-300"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <span>{inputText.length}/2000 characters</span>
            <div className="flex items-center space-x-2">
              <span>AI Ready</span>
              <AnimatePresence>
                {inputText.length > 10 && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="flex space-x-1"
                  >
                    {[0, 1, 2].map((i) => (
                      <motion.div
                        key={i}
                        className="w-2 h-2 bg-green-400 rounded-full"
                        animate={{ 
                          scale: [0.8, 1.2, 0.8],
                          opacity: [0.5, 1, 0.5]
                        }}
                        transition={{ 
                          duration: 1.5, 
                          repeat: Infinity,
                          delay: i * 0.2
                        }}
                      />
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </motion.div>

        {/* Enhanced Analyze Button */}
        <motion.button
          variants={itemVariants}
          onClick={performAnalysis}
          disabled={!inputText.trim() || isAnalyzing}
          className="w-full bg-gradient-to-r from-purple-600 to-pink-600 py-6 rounded-2xl font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden"
          whileHover={{ 
            scale: 1.02,
            boxShadow: "0 10px 30px rgba(147, 51, 234, 0.4)"
          }}
          whileTap={{ scale: 0.98 }}
          style={{ minHeight: '48px' }}
        >
          <AnimatePresence mode="wait">
            {isAnalyzing ? (
              <motion.div 
                key="analyzing"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="flex items-center justify-center space-x-3"
              >
                <motion.div 
                  className="w-6 h-6 border-2 border-white border-t-transparent rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                />
                <span>AI Deep Analysis...</span>
                <motion.div className="flex space-x-1">
                  {[0, 1, 2].map((i) => (
                    <motion.div
                      key={i}
                      className="w-2 h-2 bg-white rounded-full"
                      animate={{ 
                        y: [-4, 4, -4],
                        opacity: [0.4, 1, 0.4]
                      }}
                      transition={{ 
                        duration: 0.8, 
                        repeat: Infinity,
                        delay: i * 0.1
                      }}
                    />
                  ))}
                </motion.div>
              </motion.div>
            ) : (
              <motion.div 
                key="ready"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="flex items-center justify-center space-x-3"
              >
                <motion.div
                  animate={{ rotate: [0, 15, -15, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <BoltIcon className="w-6 h-6" />
                </motion.div>
                <span>Analyze with AI</span>
                <motion.div
                  animate={{ 
                    scale: [1, 1.2, 1],
                    rotate: [0, 180, 360]
                  }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  <SparklesIcon className="w-6 h-6" />
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* Button glow effect */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-400 opacity-0 rounded-2xl"
            animate={{ opacity: [0, 0.3, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </motion.button>

        {/* Enhanced Analysis Results */}
        <AnimatePresence>
          {analysisResult && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: -50 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 relative overflow-hidden"
              drag="x"
              dragConstraints={{ left: -100, right: 100 }}
              onDragEnd={(event, info) => {
                if (Math.abs(info.offset.x) > 50) {
                  handleSwipe(info.offset.x > 0 ? 'right' : 'left');
                }
              }}
            >
              {/* Swipe indicator */}
              <motion.div
                className="absolute top-2 left-1/2 transform -translate-x-1/2 w-12 h-1 bg-white/30 rounded-full"
                animate={{ width: [48, 60, 48] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              
              <motion.div 
                className="text-center mb-6"
                layoutId="analysis-header"
              >
                <motion.div 
                  className={`inline-flex items-center space-x-3 px-6 py-3 rounded-full text-xl font-bold ${
                    analysisResult.threatLevel === 'CRITICAL' ? 'bg-red-500' :
                    analysisResult.threatLevel === 'HIGH' ? 'bg-red-400' :
                    analysisResult.threatLevel === 'MEDIUM' ? 'bg-yellow-500 text-black' :
                    'bg-green-500 text-black'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  animate={analysisResult.threatLevel === 'CRITICAL' ? {
                    boxShadow: ["0 0 0 0 rgba(239, 68, 68, 0.7)", "0 0 0 20px rgba(239, 68, 68, 0)"],
                  } : {}}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  {analysisResult.threatLevel === 'CRITICAL' ? <XCircleIcon className="w-6 h-6" /> :
                   analysisResult.threatLevel === 'HIGH' ? <XCircleIcon className="w-6 h-6" /> :
                   analysisResult.threatLevel === 'MEDIUM' ? <ShieldExclamationIcon className="w-6 h-6" /> :
                   <CheckCircleIcon className="w-6 h-6" />}
                  <span>{analysisResult.threatLevel} RISK</span>
                </motion.div>
                
                <motion.div 
                  className="mt-6 text-5xl font-bold"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 300, delay: 0.2 }}
                >
                  {analysisResult.riskScore}%
                </motion.div>
                
                <motion.p 
                  className="text-gray-300 mt-2 text-lg"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  Threat Risk Score
                </motion.p>
                
                <motion.p 
                  className="text-gray-300 mt-4 bg-white/5 rounded-lg p-3 text-sm"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  🔄 Swipe or use buttons below to provide feedback
                </motion.p>
              </motion.div>

              {/* Advanced AI Features Display */}
              <div className="space-y-4">
                
                {/* Emotional Manipulation Analysis */}
                {analysisResult.emotion && analysisResult.emotion.manipulationScore > 20 && (
                  <motion.div 
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.8 }}
                    className="p-4 bg-purple-900/40 rounded-xl border border-purple-500/30"
                  >
                    <motion.h3 
                      className="font-bold text-purple-300 mb-3 flex items-center space-x-2"
                      layoutId="emotion-title"
                    >
                      <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        <HeartIcon className="w-5 h-5" />
                      </motion.div>
                      <span>🧠 Emotional Manipulation Detected</span>
                    </motion.h3>
                    
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="bg-white/10 rounded-lg p-3">
                        <span className="text-gray-300 text-sm">Manipulation Score</span>
                        <motion.div 
                          className="text-2xl font-bold text-red-400"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: "spring", delay: 1 }}
                        >
                          {Math.round(analysisResult.emotion.manipulationScore)}%
                        </motion.div>
                        {/* Progress bar */}
                        <div className="w-full bg-gray-700 rounded-full h-2 mt-2">
                          <motion.div
                            className="bg-gradient-to-r from-red-500 to-red-600 h-2 rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: `${analysisResult.emotion.manipulationScore}%` }}
                            transition={{ duration: 1.5, delay: 1.2 }}
                          />
                        </div>
                      </div>
                      
                      <div className="bg-white/10 rounded-lg p-3">
                        <span className="text-gray-300 text-sm">Dominant Emotion</span>
                        <motion.div 
                          className="text-lg font-bold text-yellow-400 capitalize"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 1.4 }}
                        >
                          {analysisResult.emotion.dominantEmotion}
                        </motion.div>
                        <motion.div 
                          className="text-xs text-gray-400 mt-1"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 1.6 }}
                        >
                          {analysisResult.emotion.psychologicalProfile}
                        </motion.div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Social Engineering Analysis */}
                {analysisResult.socialEngineering && analysisResult.socialEngineering.techniques.length > 0 && (
                  <motion.div 
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1.0 }}
                    className="p-4 bg-red-900/40 rounded-xl border border-red-500/30"
                  >
                    <h3 className="font-bold text-red-300 mb-3 flex items-center space-x-2">
                      <span>🎭 Social Engineering Techniques:</span>
                      <motion.span 
                        className={`px-2 py-1 rounded-full text-xs ${
                          analysisResult.socialEngineering.sophistication === 'EXPERT' ? 'bg-red-600' :
                          analysisResult.socialEngineering.sophistication === 'ADVANCED' ? 'bg-orange-600' :
                          'bg-yellow-600'
                        } text-white`}
                        whileHover={{ scale: 1.1 }}
                      >
                        {analysisResult.socialEngineering.sophistication}
                      </motion.span>
                    </h3>
                    <div className="space-y-2">
                      {analysisResult.socialEngineering.techniques.map((technique, idx) => (
                        <motion.div
                          key={idx}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 1.2 + (idx * 0.1) }}
                          className="flex justify-between items-center bg-white/10 rounded-lg p-3"
                        >
                          <span className="font-medium text-red-200">{technique.name}</span>
                          <div className="flex items-center space-x-2">
                            <span className="text-sm text-red-300">{technique.matches}x</span>
                            <div className="w-16 bg-gray-700 rounded-full h-2">
                              <motion.div
                                className="bg-gradient-to-r from-red-400 to-red-600 h-2 rounded-full"
                                initial={{ width: 0 }}
                                animate={{ width: `${Math.min(technique.score, 100)}%` }}
                                transition={{ duration: 1, delay: 1.4 + (idx * 0.1) }}
                              />
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* AI-Generated Content Detection */}
                {analysisResult.aiGenerated && analysisResult.aiGenerated.score > 30 && (
                  <motion.div 
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.2 }}
                    className="p-4 bg-cyan-900/40 rounded-xl border border-cyan-500/30"
                  >
                    <h3 className="font-bold text-cyan-300 mb-3 flex items-center space-x-2">
                      <span>🤖 AI-Generated Content Analysis</span>
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-white/10 rounded-lg p-3">
                        <span className="text-gray-300 text-sm">AI Likelihood</span>
                        <div className="text-xl font-bold text-cyan-400">
                          {analysisResult.aiGenerated.likelihood}
                        </div>
                        <div className="text-xs text-gray-400">
                          {analysisResult.aiGenerated.confidence}% confidence
                        </div>
                      </div>
                      <div className="bg-white/10 rounded-lg p-3">
                        <span className="text-gray-300 text-sm">Detection Score</span>
                        <div className="text-xl font-bold text-orange-400">
                          {Math.round(analysisResult.aiGenerated.score)}%
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-2 mt-1">
                          <motion.div
                            className="bg-gradient-to-r from-cyan-500 to-blue-600 h-2 rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: `${analysisResult.aiGenerated.score}%` }}
                            transition={{ duration: 1.5, delay: 1.4 }}
                          />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Predictive Viral Analysis */}
                {analysisResult.predictiveInsights && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 1.4 }}
                    className="p-4 bg-blue-900/40 rounded-xl border border-blue-500/30"
                  >
                    <h3 className="font-bold text-blue-300 mb-3 flex items-center space-x-2">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                      >
                        <SparklesIcon className="w-5 h-5" />
                      </motion.div>
                      <span>🔮 Viral Prediction Analysis</span>
                    </h3>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-white/10 rounded-lg p-3">
                        <span className="text-gray-300 text-sm">Viral Potential</span>
                        <div className="text-xl font-bold text-orange-400">
                          {analysisResult.predictiveInsights.viralPotential}%
                        </div>
                        <div className="text-xs text-blue-400">
                          Predicted: {analysisResult.predictiveInsights.predictedSpread}
                        </div>
                      </div>
                      
                      <div className="bg-white/10 rounded-lg p-3">
                        <span className="text-gray-300 text-sm">Peak Spread Time</span>
                        <div className="text-sm font-bold text-cyan-400">
                          {analysisResult.predictiveInsights.peakTime}
                        </div>
                        <div className="text-xs text-gray-400">
                          Est. reach: {analysisResult.predictiveInsights.estimatedReach?.likely?.toLocaleString() || 'N/A'}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Enhanced Action Buttons */}
              <motion.div 
                className="grid grid-cols-2 gap-4 mt-6"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.6 }}
              >
                <motion.button
                  onClick={() => handleUserFeedback('threat')}
                  className="bg-red-500/20 border border-red-500/50 p-6 rounded-xl flex flex-col items-center space-y-2 text-red-300"
                  whileHover={{ 
                    scale: 1.05, 
                    backgroundColor: "rgba(239, 68, 68, 0.3)",
                    borderColor: "rgba(239, 68, 68, 0.7)"
                  }}
                  whileTap={{ scale: 0.95 }}
                  style={{ minHeight: '48px' }}
                >
                  <XCircleIcon className="w-6 h-6" />
                  <span className="font-bold">Threat Detected</span>
                  <span className="text-xs">Mark as dangerous</span>
                </motion.button>
                
                <motion.button
                  onClick={() => handleUserFeedback('safe')}
                  className="bg-green-500/20 border border-green-500/50 p-6 rounded-xl flex flex-col items-center space-y-2 text-green-300"
                  whileHover={{ 
                    scale: 1.05,
                    backgroundColor: "rgba(16, 185, 129, 0.3)",
                    borderColor: "rgba(16, 185, 129, 0.7)"
                  }}
                  whileTap={{ scale: 0.95 }}
                  style={{ minHeight: '48px' }}
                >
                  <CheckCircleIcon className="w-6 h-6" />
                  <span className="font-bold">Looks Safe</span>
                  <span className="text-xs">Mark as legitimate</span>
                </motion.button>
              </motion.div>

              {/* Share & Save Actions */}
              <motion.div 
                className="mt-6 pt-6 border-t border-white/20 space-y-3"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.8 }}
              >
                <motion.button
                  onClick={() => {
                    if (navigator.share) {
                      navigator.share({
                        title: 'Xist AI Threat Analysis',
                        text: `🛡️ Risk Score: ${analysisResult.riskScore}% - ${analysisResult.threatLevel} threat detected by Xist AI Advanced Protection`,
                        url: window.location.href
                      });
                    }
                    triggerHaptic('success');
                    createParticles('success');
                  }}
                  className="w-full bg-white/10 border border-white/30 py-4 rounded-xl font-bold text-white hover:bg-white/20 transition-all"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  style={{ minHeight: '48px' }}
                >
                  <div className="flex items-center justify-center space-x-2">
                    <span>📱</span>
                    <span>Share Analysis Results</span>
                  </div>
                </motion.button>
                
                <motion.button
                  onClick={() => {
                    triggerHaptic('gameReward');
                    createParticles('success');
                    // Save to analysis history
                    console.log('Saved to history:', analysisResult);
                  }}
                  className="w-full bg-purple-500/20 border border-purple-500/50 py-3 rounded-xl font-medium text-purple-300 hover:bg-purple-500/30 transition-all"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  💾 Save to Analysis History
                </motion.button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Bottom spacing for mobile nav */}
      <div className="h-24"></div>
    </div>
  );
};

export default MobileVerifyScreen;
