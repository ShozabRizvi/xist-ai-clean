class BehaviorAnalyzer {
  constructor() {
    this.userProfiles = new Map();
    this.anomalyThreshold = 0.7;
  }

  analyzeUserBehavior(userId, actionData) {
    const profile = this.getUserProfile(userId);
    const normalizedAction = this.normalizeAction(actionData);
    
    // Update user profile
    this.updateProfile(userId, normalizedAction);
    
    // Detect anomalies
    const anomalyScore = this.detectAnomalies(profile, normalizedAction);
    
    // Generate risk assessment
    const riskAssessment = this.assessRisk(anomalyScore, normalizedAction);
    
    return {
      userId,
      timestamp: new Date(),
      action: normalizedAction,
      anomalyScore,
      riskLevel: this.categorizeRisk(anomalyScore),
      behaviorProfile: profile,
      recommendations: this.generateRecommendations(riskAssessment),
      socialEngineeringIndicators: this.detectSocialEngineering(normalizedAction)
    };
  }

  detectSocialEngineering(action) {
    const indicators = [];
    
    // Urgency indicators
    if (action.content?.includes('urgent') || action.content?.includes('immediately')) {
      indicators.push({
        type: 'urgency_pressure',
        confidence: 0.8,
        description: 'Content contains urgency pressure tactics'
      });
    }
    
    // Authority impersonation
    if (action.source?.includes('admin') || action.source?.includes('support')) {
      indicators.push({
        type: 'authority_impersonation',
        confidence: 0.7,
        description: 'Source claims administrative authority'
      });
    }
    
    // Credential requests
    if (action.content?.toLowerCase().includes('password') || 
        action.content?.toLowerCase().includes('login')) {
      indicators.push({
        type: 'credential_harvesting',
        confidence: 0.9,
        description: 'Content requests sensitive credentials'
      });
    }
    
    return indicators;
  }

  getUserProfile(userId) {
    if (!this.userProfiles.has(userId)) {
      this.userProfiles.set(userId, {
        userId,
        created: new Date(),
        interactions: 0,
        patterns: {
          timeDistribution: new Array(24).fill(0),
          deviceTypes: {},
          locationHistory: [],
          interactionTypes: {},
          responsePatterns: {},
          trustLevel: 0.5
        }
      });
    }
    return this.userProfiles.get(userId);
  }

  detectAnomalies(profile, action) {
    let anomalyScore = 0;
    
    // Time-based anomalies
    const currentHour = new Date().getHours();
    const normalTimeActivity = profile.patterns.timeDistribution[currentHour];
    if (normalTimeActivity < 0.1 && action.timestamp) {
      anomalyScore += 0.3;
    }
    
    // Location anomalies
    if (action.location && profile.patterns.locationHistory.length > 0) {
      const isNewLocation = !profile.patterns.locationHistory.includes(action.location);
      if (isNewLocation) anomalyScore += 0.2;
    }
    
    // Interaction type anomalies
    const actionType = action.type;
    const normalFreq = profile.patterns.interactionTypes[actionType] || 0;
    if (normalFreq < 0.05) anomalyScore += 0.25;
    
    return Math.min(anomalyScore, 1.0);
  }

  generateBehaviorInsights(userId) {
    const profile = this.getUserProfile(userId);
    
    return {
      trustScore: profile.patterns.trustLevel,
      riskFactors: this.identifyRiskFactors(profile),
      behaviorSignature: this.createBehaviorSignature(profile),
      recommendations: this.generatePersonalizedRecommendations(profile),
      anomalyHistory: this.getAnomalyHistory(userId),
      securityPosture: this.assessSecurityPosture(profile)
    };
  }

  createBehaviorSignature(profile) {
    return {
      timePattern: this.analyzeTimePattern(profile.patterns.timeDistribution),
      interactionStyle: this.analyzeInteractionStyle(profile.patterns.interactionTypes),
      riskTolerance: this.analyzeRiskTolerance(profile),
      securityAwareness: this.assessSecurityAwareness(profile)
    };
  }
}

export default new BehaviorAnalyzer();
