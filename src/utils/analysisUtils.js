export const ANALYSIS_MODES = {
  lightning: {
    label: '⚡ Lightning Scan',
    description: 'Quick 30-second scan for obvious threats. Perfect for rapid checks.',
    promptTemplate: `You are Xist AI, a misinformation and threat detection expert. 
Analyze the following content VERY BRIEFLY and respond with:
1. One-line greeting to the user: "Hi [username], thanks for..."
2. Verdict: SAFE, SUSPICIOUS, or SCAM/MISINFORMATION
3. Confidence: X%
4. One key pattern/reason
Keep response under 100 words total. Omit any mention of AI model or credits.

Content to analyze:
{content}`,
    maxTokens: 250,
    temperature: 0.7,
    icon: 'BoltIcon',
  },

  comprehensive: {
    label: '🔍 Comprehensive Check',
    description: 'Detailed analysis with pattern matching and reasoning. Balanced approach.',
    promptTemplate: `You are Xist AI, a misinformation and threat detection expert. 
Perform a detailed analysis of the following content:

Instructions:
1. Start with a friendly greeting to the user: "Hi [username], thanks for sharing this..."
2. Provide a summary of findings (≤70 words)
3. Give a clear Verdict: SAFE, SUSPICIOUS, SCAM/MISINFORMATION, or THREAT
4. Provide Confidence as a percentage (0-100)
5. Set Alert Level: Low, Medium, High, or Critical
6. List 3-5 Detected Patterns (e.g., "Urgency language used", "Unknown sender", "Financial request")
7. Brief Explanation (1-2 sentences)
8. Friendly closing

Format clearly with labels. Do NOT mention which AI model is analyzing or any credits used.

Content to analyze:
{content}`,
    maxTokens: 600,
    temperature: 0.5,
    icon: 'MagnifyingGlassIcon',
  },

  deepdive: {
    label: '🔬 Deep Dive Analysis',
    description: 'Forensic breakdown with technical details and evidence. Thorough investigation.',
    promptTemplate: `You are Xist AI, an advanced threat and misinformation forensic analyst.
Perform a comprehensive forensic analysis of the following content:

Analysis Structure:
1. Greeting: "Hi [username], thanks for entrusting Xist AI with this analysis..."
2. Executive Summary (≤70 words, key findings only)
3. Verdict: SAFE, SUSPICIOUS, SCAM/MISINFORMATION, THREAT, or CRITICAL_THREAT
4. Confidence: X%
5. Alert Level: Low, Medium, High, or Critical
6. Detailed Pattern Breakdown (5-8 patterns with reasoning):
   - Pattern Name: Explanation
   - Pattern Name: Explanation
   (Include phishing indicators, social engineering tactics, fraud vectors, etc.)
7. Technical Findings (if applicable)
8. Risk Assessment (brief)
9. Recommended Actions (1-2 bullet points)
10. Closing: "Stay safe online!"

Be thorough and specific. Do NOT mention AI model or credit usage.

Content to analyze:
{content}`,
    maxTokens: 1200,
    temperature: 0.3,
    icon: 'BeakerIcon',
  },

  forensic: {
    label: '🔐 Forensic Deep Dive',
    description: 'Ultra-detailed technical & behavioral analysis. Maximum depth investigation.',
    promptTemplate: `You are Xist AI, a forensic cybersecurity and misinformation analyst with expertise in:
- Linguistic analysis and manipulation tactics
- Behavioral profiling
- Technical threat indicators
- Social engineering methodologies
- Fraud schemes and scam vectors
- Credential harvesting techniques
- Malware/phishing indicators

Perform an ultra-detailed forensic analysis:

1. Greeting: "Hi [username], thank you for this critical security check..."
2. Executive Summary (≤70 words, highest-priority findings)
3. Verdict: SAFE, SUSPICIOUS, SCAM/MISINFORMATION, THREAT, or CRITICAL_THREAT
4. Confidence: X%
5. Alert Level: Low, Medium, High, or Critical

6. Comprehensive Pattern Analysis (8-12 detailed patterns):
   [Pattern Name]: [Evidence + reasoning]
   [Pattern Name]: [Evidence + reasoning]
   Include: linguistic manipulation, behavioral red flags, technical indicators, timing patterns, etc.

7. Linguistic Analysis:
   - Persuasion techniques used
   - Urgency/scarcity framing
   - Emotional triggers identified

8. Technical Indicators (if present):
   - Suspicious URLs/domains
   - Known phishing/malware signatures
   - Infrastructure anomalies

9. Threat Actor Profile (if identifiable):
   - Sophistication level
   - Likely motivation
   - Known group affiliation (if any)

10. Risk Assessment:
    - Immediate threat level
    - Data/financial exposure
    - Victim demographic (if applicable)

11. Mitigation & Action Plan:
    - Immediate steps for user
    - Reporting recommendations
    - Prevention measures

12. Confidence Breakdown by Category:
    - Linguistic patterns: X%
    - Technical indicators: X%
    - Behavioral factors: X%

13. Closing: "Thank you for helping keep our community safe. Report suspicious activity!"

Be exhaustive but concise. Structure clearly with headers. Omit AI/credit details.

Content to analyze:
{content}`,
    maxTokens: 2000,
    temperature: 0.2,
    icon: 'ShieldExclamationIcon',
  },
};

/**
 * Threat Pattern Keywords & Detection Rules
 * Used for local pattern matching to supplement AI analysis
 */
export const THREAT_PATTERNS = {
  cryptoScam: {
    name: 'Cryptocurrency Scam',
    keywords: ['bitcoin', 'ethereum', 'crypto', 'invest', 'double', 'multiply', 'giveaway', 'free money', 'limited time offer', 'guaranteed returns', 'elon musk', 'bezos'],
    score: 0.9,
  },
  phishing: {
    name: 'Phishing Attempt',
    keywords: ['verify account', 'confirm identity', 'update payment', 'click here urgently', 'act now', 'reset password', 'unusual activity', 'suspicious login', 'confirm credentials'],
    score: 0.85,
  },
  socialEngineering: {
    name: 'Social Engineering',
    keywords: ['urgent action', 'confirm details', 'security alert', 'breach detected', 'compromised', 'temporary hold', 'locked account', 'verify now'],
    score: 0.80,
  },
  financialFraud: {
    name: 'Financial Fraud',
    keywords: ['claim prize', 'won lottery', 'inheritance', 'tax refund', 'unclaimed funds', 'wire transfer', 'banking details', 'account information'],
    score: 0.88,
  },
  jobScam: {
    name: 'Job/Employment Scam',
    keywords: ['easy money', 'work from home', 'no experience needed', 'hire immediately', 'pay upfront', 'application fee', 'guarantee job'],
    score: 0.82,
  },
  impersonation: {
    name: 'Impersonation/Fake Authority',
    keywords: ['official', 'government', 'bank', 'amazon', 'apple', 'microsoft', 'from:', 'on behalf of', 'representing'],
    score: 0.75,
  },
  malware: {
    name: 'Malware/Suspicious Download',
    keywords: ['download', 'exe', 'zip', 'attachment', 'run this', 'install now', 'enable macros', 'update required'],
    score: 0.80,
  },
  urgencyLanguage: {
    name: 'Excessive Urgency',
    keywords: ['urgent', 'immediately', 'act now', 'limited time', 'expires', 'deadline', 'hurry', 'last chance', 'don\'t wait'],
    score: 0.70,
  },
};

/**
 * Build friendly, personalized prompt for AI analysis
 * Incorporates user name, greeting, and analysis mode
 */
export function buildFriendlyPrompt(content, userName, mode = 'comprehensive') {
  const config = ANALYSIS_MODES[mode] || ANALYSIS_MODES.comprehensive;
  
  // Replace placeholders
  let prompt = config.promptTemplate
    .replace('{content}', content)
    .replace('{username}', userName || 'Friend')
    .replace('[username]', userName || 'Friend');
  
  return prompt;
}

/**
 * Local pattern detection - fast, client-side threat indicator
 * Supplements AI analysis for pre-screening
 */
export function detectLocalPatterns(content) {
  const lowerContent = content.toLowerCase();
  const detectedPatterns = [];
  
  Object.entries(THREAT_PATTERNS).forEach(([key, pattern]) => {
    const matchCount = pattern.keywords.filter(keyword =>
      lowerContent.includes(keyword.toLowerCase())
    ).length;
    
    if (matchCount > 0) {
      detectedPatterns.push({
        pattern: pattern.name,
        score: Math.min(matchCount * pattern.score / pattern.keywords.length, 1),
        matches: matchCount,
      });
    }
  });
  
  return detectedPatterns.sort((a, b) => b.score - a.score);
}

/**
 * Calculate threat severity based on patterns
 */
export function calculateThreatLevel(patterns) {
  if (!patterns || patterns.length === 0) return { level: 'SAFE', score: 0 };
  
  const avgScore = patterns.reduce((sum, p) => sum + p.score, 0) / patterns.length;
  
  if (avgScore >= 0.85) return { level: 'CRITICAL', score: avgScore };
  if (avgScore >= 0.70) return { level: 'HIGH', score: avgScore };
  if (avgScore >= 0.50) return { level: 'MEDIUM', score: avgScore };
  return { level: 'LOW', score: avgScore };
}

/**
 * Format analysis result for database storage
 */
export function formatAnalysisForDB(analysisResult, userId, inputType, mode, provider) {
  return {
    user_id: userId,
    verdict: analysisResult.verdict,
    confidence: analysisResult.confidence,
    alert_level: analysisResult.alertLevel,
    patterns: analysisResult.patterns,
    explanation: analysisResult.explanation,
    summary: analysisResult.summary,
    timestamp: analysisResult.timestamp,
    input_type: inputType,
    analysis_mode: mode,
    provider_used: provider,
    is_critical: analysisResult.critical,
    created_at: new Date().toISOString(),
  };
}

/**
 * Get mode config by key
 */
export function getModeConfig(mode) {
  return ANALYSIS_MODES[mode] || ANALYSIS_MODES.comprehensive;
}

/**
 * List all available modes
 */
export function getAvailableModes() {
  return Object.entries(ANALYSIS_MODES).map(([key, config]) => ({
    key,
    label: config.label,
    description: config.description,
    maxTokens: config.maxTokens,
  }));
}

/**
 * Validate content before analysis
 */
export function validateInput(content, maxLength = 5000) {
  if (!content || typeof content !== 'string') {
    return { valid: false, error: 'Content must be a non-empty string' };
  }
  
  if (content.trim().length < 10) {
    return { valid: false, error: 'Content must be at least 10 characters' };
  }
  
  if (content.length > maxLength) {
    return { valid: false, error: `Content exceeds ${maxLength} character limit` };
  }
  
  return { valid: true };
}

/**
 * Sanitize input for safe processing
 */
export function sanitizeInput(content) {
  return content
    .trim()
    .replace(/[<>]/g, '') // Remove potential HTML
    .slice(0, 5000); // Enforce max length
}

export default {
  ANALYSIS_MODES,
  THREAT_PATTERNS,
  buildFriendlyPrompt,
  detectLocalPatterns,
  calculateThreatLevel,
  formatAnalysisForDB,
  getModeConfig,
  getAvailableModes,
  validateInput,
  sanitizeInput,
};
