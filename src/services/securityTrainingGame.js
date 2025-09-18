class SecurityTrainingGame {
  constructor() {
    this.scenarios = this.initializeScenarios();
    this.achievements = this.initializeAchievements();
    this.userProgress = this.loadUserProgress();
    this.leaderboard = this.loadLeaderboard();
    this.currentScenario = null;
  }

  // INITIALIZE ALL TRAINING SCENARIOS
  initializeScenarios() {
    return {
      phishing_email: {
        id: 'phishing_email',
        title: 'Email Phishing Detection',
        category: 'social_engineering',
        difficulty: 'beginner',
        estimatedTime: 5,
        description: 'Learn to identify suspicious emails and phishing attempts',
        points: 100,
        badge: 'Email Detective',
        scenarios: [
          {
            id: 'phish_001',
            title: 'Urgent Bank Notice',
            content: {
              from: 'security@bankofamerika.com',
              subject: 'URGENT: Verify Your Account Immediately!',
              body: `Dear Valued Customer,

We have detected suspicious activity on your account. Your access will be suspended within 24 hours unless you verify your information immediately.

Click here to secure your account: http://bank-verification.suspicious-site.com

This is an automated message. Do not reply to this email.

Best regards,
Bank of America Security Team`,
              attachments: ['account_verification.exe']
            },
            redFlags: [
              'Misspelled domain name (bankofamerika.com)',
              'Suspicious URL (not bank official site)',
              'Executable attachment',
              'Urgency pressure tactics',
              'Generic greeting'
            ],
            choices: [
              {
                id: 'click_link',
                text: 'Click the verification link immediately',
                correct: false,
                feedback: 'Never click suspicious links! This could compromise your account.',
                consequence: 'Account credentials stolen',
                points: -10
              },
              {
                id: 'download_attachment',
                text: 'Download and run the attachment',
                correct: false,
                feedback: 'Executable attachments from unknown sources are extremely dangerous!',
                consequence: 'Malware installed on system',
                points: -20
              },
              {
                id: 'report_phishing',
                text: 'Report as phishing and delete the email',
                correct: true,
                feedback: 'Excellent! You correctly identified this phishing attempt.',
                consequence: 'Threat neutralized',
                points: 50
              },
              {
                id: 'verify_separately',
                text: 'Contact bank directly through official channels',
                correct: true,
                feedback: 'Great approach! Always verify through official channels.',
                consequence: 'Confirmed account is safe',
                points: 40
              }
            ]
          }
        ]
      },

      social_engineering: {
        id: 'social_engineering',
        title: 'Social Engineering Defense',
        category: 'human_psychology',
        difficulty: 'intermediate',
        estimatedTime: 8,
        description: 'Recognize and defend against psychological manipulation tactics',
        points: 200,
        badge: 'Manipulation Detector',
        scenarios: [
          {
            id: 'social_001',
            title: 'The Helpful IT Technician',
            content: {
              scenario: 'A person calls claiming to be from IT support',
              dialogue: [
                'Caller: "Hi, this is Jake from IT support. We\'ve detected some unusual activity on your computer."',
                'Caller: "I need to remotely access your system to fix this security issue immediately."',
                'Caller: "Can you please download TeamViewer and give me the access code?"',
                'Caller: "This is urgent - your data could be at risk if we don\'t act now."'
              ],
              context: 'You receive this call during work hours'
            },
            redFlags: [
              'Unsolicited call claiming urgency',
              'Requesting remote access',
              'Pressure tactics',
              'No verification of identity',
              'Asking to download software'
            ],
            choices: [
              {
                id: 'provide_access',
                text: 'Download TeamViewer and provide access code',
                correct: false,
                feedback: 'This is a classic social engineering attack! Never give remote access to unsolicited callers.',
                points: -25
              },
              {
                id: 'hang_up_verify',
                text: 'Hang up and call IT directly to verify',
                correct: true,
                feedback: 'Perfect! Always verify through official channels.',
                points: 60
              },
              {
                id: 'ask_questions',
                text: 'Ask for employee ID and verify through company directory',
                correct: true,
                feedback: 'Good security thinking! Verification is key.',
                points: 50
              }
            ]
          }
        ]
      },

      malware_analysis: {
        id: 'malware_analysis',
        title: 'Malware Identification',
        category: 'technical_security',
        difficulty: 'advanced',
        estimatedTime: 12,
        description: 'Learn to identify and analyze different types of malware',
        points: 300,
        badge: 'Malware Hunter',
        scenarios: [
          {
            id: 'malware_001',
            title: 'Suspicious File Analysis',
            content: {
              fileName: 'important_document.pdf.exe',
              fileSize: '2.3 MB',
              source: 'Unknown email attachment',
              behavior: [
                'File attempts to access network',
                'Creates registry entries',
                'Installs additional files in system directory',
                'Attempts to disable antivirus'
              ]
            },
            choices: [
              {
                id: 'run_file',
                text: 'Run the file to see what it contains',
                correct: false,
                feedback: 'Never execute suspicious files! This could infect your system.',
                points: -30
              },
              {
                id: 'scan_analyze',
                text: 'Scan with antivirus and analyze in sandbox',
                correct: true,
                feedback: 'Excellent approach! Always analyze suspicious files safely.',
                points: 70
              }
            ]
          }
        ]
      },

      password_security: {
        id: 'password_security',
        title: 'Password Security Mastery',
        category: 'authentication',
        difficulty: 'beginner',
        estimatedTime: 6,
        description: 'Master the art of creating and managing secure passwords',
        points: 150,
        badge: 'Password Guardian',
        scenarios: [
          {
            id: 'password_001',
            title: 'Password Strength Challenge',
            content: {
              task: 'Evaluate these password options for a banking website',
              passwords: [
                { password: 'password123', strength: 'Very Weak' },
                { password: 'MyDog@2023!', strength: 'Moderate' },
                { password: 'Tr0ub4dor&3', strength: 'Strong' },
                { password: 'correct horse battery staple', strength: 'Very Strong' }
              ]
            },
            choices: [
              {
                id: 'choose_weak',
                text: 'Use "password123" - it\'s easy to remember',
                correct: false,
                feedback: 'This password is extremely weak and easily guessed!',
                points: -15
              },
              {
                id: 'choose_strong',
                text: 'Use a long passphrase or strong random password',
                correct: true,
                feedback: 'Great choice! Strong passwords are your first line of defense.',
                points: 45
              }
            ]
          }
        ]
      },

      network_security: {
        id: 'network_security',
        title: 'Network Security Fundamentals',
        category: 'infrastructure',
        difficulty: 'intermediate',
        estimatedTime: 10,
        description: 'Understand network security principles and common attack vectors',
        points: 250,
        badge: 'Network Guardian'
      },

      data_privacy: {
        id: 'data_privacy',
        title: 'Data Privacy & Protection',
        category: 'compliance',
        difficulty: 'intermediate',
        estimatedTime: 9,
        description: 'Learn about data privacy laws and protection strategies',
        points: 200,
        badge: 'Privacy Champion'
      }
    };
  }

  // INITIALIZE ACHIEVEMENT SYSTEM
  initializeAchievements() {
    return {
      first_scenario: {
        id: 'first_scenario',
        title: 'Getting Started',
        description: 'Complete your first training scenario',
        icon: '🎯',
        points: 10,
        rarity: 'common'
      },
      perfect_score: {
        id: 'perfect_score',
        title: 'Perfect Score',
        description: 'Get 100% on any scenario',
        icon: '💯',
        points: 50,
        rarity: 'rare'
      },
      speed_demon: {
        id: 'speed_demon',
        title: 'Speed Demon',
        description: 'Complete a scenario in under 2 minutes',
        icon: '⚡',
        points: 30,
        rarity: 'uncommon'
      },
      phishing_master: {
        id: 'phishing_master',
        title: 'Phishing Master',
        description: 'Complete all phishing scenarios with 90%+ accuracy',
        icon: '🎣',
        points: 100,
        rarity: 'epic'
      },
      security_expert: {
        id: 'security_expert',
        title: 'Security Expert',
        description: 'Reach level 10 in security training',
        icon: '🛡️',
        points: 200,
        rarity: 'legendary'
      },
      threat_hunter: {
        id: 'threat_hunter',
        title: 'Threat Hunter',
        description: 'Identify 50 different threats across all scenarios',
        icon: '🔍',
        points: 150,
        rarity: 'epic'
      },
      mentor: {
        id: 'mentor',
        title: 'Security Mentor',
        description: 'Help 10 other users complete scenarios',
        icon: '👨‍🏫',
        points: 100,
        rarity: 'rare'
      }
    };
  }

  // START A TRAINING SCENARIO
  async startScenario(scenarioId) {
    const scenario = this.scenarios[scenarioId];
    if (!scenario) {
      throw new Error('Scenario not found');
    }

    this.currentScenario = {
      ...scenario,
      startTime: Date.now(),
      currentStep: 0,
      userAnswers: [],
      score: 0,
      hintsUsed: 0,
      timeSpent: 0
    };

    return this.getCurrentScenarioState();
  }

  // SUBMIT ANSWER FOR CURRENT SCENARIO
  async submitAnswer(choiceId) {
    if (!this.currentScenario) {
      throw new Error('No active scenario');
    }

    const currentStep = this.getCurrentStep();
    if (!currentStep) {
      throw new Error('Invalid scenario step');
    }

    const choice = currentStep.choices.find(c => c.id === choiceId);
    if (!choice) {
      throw new Error('Invalid choice');
    }

    // Record the answer
    this.currentScenario.userAnswers.push({
      stepId: currentStep.id,
      choiceId,
      correct: choice.correct,
      points: choice.points || 0,
      feedback: choice.feedback,
      timestamp: Date.now()
    });

    // Update score
    this.currentScenario.score += choice.points || 0;

    // Move to next step or complete scenario
    this.currentScenario.currentStep++;

    const isComplete = this.currentScenario.currentStep >= this.getScenarioSteps().length;
    
    if (isComplete) {
      return await this.completeScenario();
    }

    return {
      correct: choice.correct,
      feedback: choice.feedback,
      consequence: choice.consequence,
      points: choice.points || 0,
      nextStep: this.getCurrentScenarioState()
    };
  }

  // COMPLETE THE CURRENT SCENARIO
  async completeScenario() {
    if (!this.currentScenario) {
      throw new Error('No active scenario');
    }

    const endTime = Date.now();
    const timeSpent = Math.round((endTime - this.currentScenario.startTime) / 1000);
    
    const correctAnswers = this.currentScenario.userAnswers.filter(a => a.correct).length;
    const totalQuestions = this.currentScenario.userAnswers.length;
    const accuracy = Math.round((correctAnswers / totalQuestions) * 100);
    
    // Calculate final score with bonuses
    let finalScore = Math.max(0, this.currentScenario.score);
    
    // Time bonus (faster completion = bonus points)
    if (timeSpent < 120) { // Under 2 minutes
      finalScore += 20;
    }
    
    // Accuracy bonus
    if (accuracy === 100) {
      finalScore += 50;
    } else if (accuracy >= 90) {
      finalScore += 25;
    }

    // No hints bonus
    if (this.currentScenario.hintsUsed === 0) {
      finalScore += 15;
    }

    const scenarioResult = {
      scenarioId: this.currentScenario.id,
      score: finalScore,
      accuracy,
      timeSpent,
      correctAnswers,
      totalQuestions,
      hintsUsed: this.currentScenario.hintsUsed,
      completedAt: new Date(),
      answers: this.currentScenario.userAnswers
    };

    // Update user progress
    await this.updateUserProgress(scenarioResult);
    
    // Check for achievements
    const newAchievements = await this.checkAchievements(scenarioResult);
    
    // Update leaderboard
    await this.updateLeaderboard(scenarioResult);

    this.currentScenario = null;

    return {
      ...scenarioResult,
      newAchievements,
      levelUp: await this.checkLevelUp(),
      rank: await this.getUserRank()
    };
  }

  // GET CURRENT SCENARIO STATE
  getCurrentScenarioState() {
    if (!this.currentScenario) return null;

    const currentStep = this.getCurrentStep();
    const progress = Math.round((this.currentScenario.currentStep / this.getScenarioSteps().length) * 100);

    return {
      scenario: {
        id: this.currentScenario.id,
        title: this.currentScenario.title,
        difficulty: this.currentScenario.difficulty,
        category: this.currentScenario.category
      },
      currentStep,
      progress,
      score: this.currentScenario.score,
      timeElapsed: Math.round((Date.now() - this.currentScenario.startTime) / 1000),
      hintsUsed: this.currentScenario.hintsUsed,
      canUseHint: this.currentScenario.hintsUsed < 3
    };
  }

  // GET CURRENT STEP
  getCurrentStep() {
    if (!this.currentScenario) return null;
    
    const steps = this.getScenarioSteps();
    return steps[this.currentScenario.currentStep] || null;
  }

  // GET ALL SCENARIO STEPS
  getScenarioSteps() {
    if (!this.currentScenario) return [];
    
    const scenario = this.scenarios[this.currentScenario.id];
    return scenario?.scenarios || [];
  }

  // USE A HINT
  useHint() {
    if (!this.currentScenario || this.currentScenario.hintsUsed >= 3) {
      return null;
    }

    this.currentScenario.hintsUsed++;
    
    const currentStep = this.getCurrentStep();
    const hints = currentStep?.redFlags || [];
    
    return {
      hint: hints[this.currentScenario.hintsUsed - 1] || 'No more hints available',
      hintsRemaining: 3 - this.currentScenario.hintsUsed
    };
  }

  // UPDATE USER PROGRESS
  async updateUserProgress(result) {
    if (!this.userProgress.completedScenarios) {
      this.userProgress.completedScenarios = [];
    }

    this.userProgress.completedScenarios.push(result);
    this.userProgress.totalScore = (this.userProgress.totalScore || 0) + result.score;
    this.userProgress.totalTime = (this.userProgress.totalTime || 0) + result.timeSpent;
    
    // Calculate level
    this.userProgress.level = Math.floor(this.userProgress.totalScore / 1000) + 1;
    this.userProgress.xpToNextLevel = 1000 - (this.userProgress.totalScore % 1000);

    this.saveUserProgress();
  }

  // CHECK FOR NEW ACHIEVEMENTS
  async checkAchievements(result) {
    const newAchievements = [];
    const userAchievements = this.userProgress.achievements || [];

    // First scenario achievement
    if (userAchievements.length === 0 && !userAchievements.includes('first_scenario')) {
      newAchievements.push(this.achievements.first_scenario);
    }

    // Perfect score achievement
    if (result.accuracy === 100 && !userAchievements.includes('perfect_score')) {
      newAchievements.push(this.achievements.perfect_score);
    }

    // Speed demon achievement
    if (result.timeSpent < 120 && !userAchievements.includes('speed_demon')) {
      newAchievements.push(this.achievements.speed_demon);
    }

    // Security expert achievement
    if (this.userProgress.level >= 10 && !userAchievements.includes('security_expert')) {
      newAchievements.push(this.achievements.security_expert);
    }

    // Update user achievements
    newAchievements.forEach(achievement => {
      if (!userAchievements.includes(achievement.id)) {
        userAchievements.push(achievement.id);
        this.userProgress.totalScore += achievement.points;
      }
    });

    this.userProgress.achievements = userAchievements;
    this.saveUserProgress();

    return newAchievements;
  }

  // CHECK FOR LEVEL UP
  async checkLevelUp() {
    const currentLevel = Math.floor(this.userProgress.totalScore / 1000) + 1;
    const previousLevel = this.userProgress.level || 1;
    
    if (currentLevel > previousLevel) {
      this.userProgress.level = currentLevel;
      this.saveUserProgress();
      return {
        leveledUp: true,
        newLevel: currentLevel,
        previousLevel
      };
    }
    
    return { leveledUp: false };
  }

  // UPDATE LEADERBOARD
  async updateLeaderboard(result) {
    if (!this.leaderboard) {
      this.leaderboard = [];
    }

    const userId = 'user_' + Date.now(); // Mock user ID
    let userEntry = this.leaderboard.find(entry => entry.userId === userId);

    if (!userEntry) {
      userEntry = {
        userId,
        username: 'Security Trainee',
        totalScore: 0,
        scenariosCompleted: 0,
        averageAccuracy: 0,
        totalTime: 0,
        level: 1
      };
      this.leaderboard.push(userEntry);
    }

    userEntry.totalScore += result.score;
    userEntry.scenariosCompleted++;
    userEntry.totalTime += result.timeSpent;
    userEntry.level = Math.floor(userEntry.totalScore / 1000) + 1;
    
    // Calculate average accuracy
    const completedScenarios = this.userProgress.completedScenarios || [];
    const totalAccuracy = completedScenarios.reduce((sum, s) => sum + s.accuracy, 0);
    userEntry.averageAccuracy = Math.round(totalAccuracy / completedScenarios.length);

    // Sort leaderboard by score
    this.leaderboard.sort((a, b) => b.totalScore - a.totalScore);
    
    this.saveLeaderboard();
  }

  // GET USER RANK
  async getUserRank() {
    const userId = 'user_' + Date.now(); // Mock user ID
    const userIndex = this.leaderboard.findIndex(entry => entry.userId === userId);
    return userIndex !== -1 ? userIndex + 1 : null;
  }

  // GET LEADERBOARD
  getLeaderboard(limit = 10) {
    return this.leaderboard.slice(0, limit);
  }

  // GET USER STATISTICS
  getUserStats() {
    const completedScenarios = this.userProgress.completedScenarios || [];
    
    return {
      level: this.userProgress.level || 1,
      totalScore: this.userProgress.totalScore || 0,
      xpToNextLevel: this.userProgress.xpToNextLevel || 1000,
      scenariosCompleted: completedScenarios.length,
      totalTime: this.userProgress.totalTime || 0,
      averageAccuracy: completedScenarios.length > 0 
        ? Math.round(completedScenarios.reduce((sum, s) => sum + s.accuracy, 0) / completedScenarios.length)
        : 0,
      achievements: this.userProgress.achievements || [],
      rank: this.leaderboard.findIndex(entry => entry.userId === 'user_' + Date.now()) + 1 || null
    };
  }

  // GET ALL SCENARIOS
  getAllScenarios() {
    return Object.values(this.scenarios).map(scenario => ({
      id: scenario.id,
      title: scenario.title,
      category: scenario.category,
      difficulty: scenario.difficulty,
      estimatedTime: scenario.estimatedTime,
      description: scenario.description,
      points: scenario.points,
      badge: scenario.badge,
      completed: this.isScenarioCompleted(scenario.id)
    }));
  }

  // CHECK IF SCENARIO IS COMPLETED
  isScenarioCompleted(scenarioId) {
    const completedScenarios = this.userProgress.completedScenarios || [];
    return completedScenarios.some(s => s.scenarioId === scenarioId);
  }

  // UTILITY METHODS
  loadUserProgress() {
    try {
      return JSON.parse(localStorage.getItem('xist-security-training-progress')) || {};
    } catch {
      return {};
    }
  }

  saveUserProgress() {
    localStorage.setItem('xist-security-training-progress', JSON.stringify(this.userProgress));
  }

  loadLeaderboard() {
    try {
      return JSON.parse(localStorage.getItem('xist-security-training-leaderboard')) || [];
    } catch {
      return [];
    }
  }

  saveLeaderboard() {
    localStorage.setItem('xist-security-training-leaderboard', JSON.stringify(this.leaderboard));
  }
}

export default new SecurityTrainingGame();
