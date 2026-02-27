import apiKeyPool from './ApiKeyPool';

class AIService {
  constructor() {
    this.baseURL = process.env.REACT_APP_OPENROUTER_BASE_URL || 'https://openrouter.ai/api/v1';
    this.model = process.env.REACT_APP_MICROSOFT_MODEL || 'deepseek/deepseek-r1-0528:free';
    this.maxRetries = 5; // Increased since we have 20 keys
    this.retryDelay = 1000; // 1 second base delay
    this.successCount = 0;
    this.failureCount = 0;
    
    console.log(`🤖 AIService initialized with model: ${this.model}`);
  }

  // Main API call with automatic key rotation
  async makeApiCall(messages, options = {}) {
    let lastError = null;
    let attemptsWithDifferentKeys = 0;
    const maxKeyAttempts = Math.min(apiKeyPool.apiKeys.length, 8); // Try max 8 different keys

    console.log(`🚀 Starting AI analysis with ${maxKeyAttempts} key attempts available`);

    while (attemptsWithDifferentKeys < maxKeyAttempts) {
      try {
        // Get next available API key
        const { key, index } = apiKeyPool.getNextApiKey();
        
        console.log(`🔑 Attempt ${attemptsWithDifferentKeys + 1}/${maxKeyAttempts} using key ${index + 1}/20`);

        const startTime = Date.now();
        const response = await this.callWithSpecificKey(key, messages, options);
        const duration = Date.now() - startTime;
        
        // Mark key as successful
        apiKeyPool.markKeySuccess(index);
        this.successCount++;
        
        console.log(`✅ Analysis successful with key ${index + 1} (${duration}ms)`);
        return response;

      } catch (error) {
        lastError = error;
        attemptsWithDifferentKeys++;
        this.failureCount++;

        // Get current key index for error handling
        const currentKeyIndex = (apiKeyPool.currentKeyIndex - 1 + apiKeyPool.apiKeys.length) % apiKeyPool.apiKeys.length;
        
        console.log(`❌ Key ${currentKeyIndex + 1} failed:`, error.message);

        // Handle different types of errors
        if (error.status === 429 || error.message?.includes('rate limit')) {
          // Rate limit error
          const resetTime = this.extractRateLimitReset(error);
          apiKeyPool.markRateLimited(currentKeyIndex, resetTime);
          
          console.log(`⏱️ Rate limit detected, trying next key...`);
          continue; // Try next key immediately
          
        } else if (error.status >= 500) {
          // Server error - mark key as failed but try next
          apiKeyPool.markKeyFailed(currentKeyIndex, error);
          await this.delay(this.retryDelay); // Brief delay for server errors
          continue;
          
        } else if (error.status === 401 || error.status === 403) {
          // Authentication error - mark key as unhealthy
          apiKeyPool.markKeyFailed(currentKeyIndex, error);
          continue;
          
        } else {
          // Other errors - brief wait before trying next key
          await this.delay(this.retryDelay * Math.min(attemptsWithDifferentKeys, 3));
          continue;
        }
      }
    }

    // All keys exhausted
    const stats = apiKeyPool.getPoolStats();
    const errorMessage = `All available keys exhausted after ${attemptsWithDifferentKeys} attempts. ` +
      `Pool status: ${stats.available}/${stats.total} available, ` +
      `${stats.rateLimited} rate-limited, ${stats.unhealthy} unhealthy. ` +
      `Last error: ${lastError?.message || 'Unknown error'}`;
    
    console.error('🚨 API Service Error:', errorMessage);
    throw new Error(errorMessage);
  }

  // Make API call with specific key
  async callWithSpecificKey(apiKey, messages, options = {}) {
    const requestPayload = {
      model: this.model,
      messages: messages,
      temperature: options.temperature || 0.7,
      max_tokens: options.maxTokens || 2000,
      top_p: options.topP || 0.9,
      stream: false,
      ...options
    };

    const requestOptions = {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': window.location.origin,
        'X-Title': 'Xist AI - Misinformation Detection Platform'
      },
      body: JSON.stringify(requestPayload)
    };

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 45000); // 45s timeout

    try {
      const response = await fetch(`${this.baseURL}/chat/completions`, {
        ...requestOptions,
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorText = await response.text();
        let errorMessage;
        
        try {
          const errorJson = JSON.parse(errorText);
          errorMessage = errorJson.error?.message || errorText;
        } catch {
          errorMessage = errorText;
        }

        const error = new Error(`HTTP ${response.status}: ${errorMessage}`);
        error.status = response.status;
        error.response = response;
        throw error;
      }

      const data = await response.json();
      
      if (!data.choices || data.choices.length === 0) {
        throw new Error('No response choices received from DeepSeek-R1 model');
      }

      return {
        content: data.choices[0].message.content,
        usage: data.usage,
        model: data.model,
        finishReason: data.choices[0].finish_reason,
        responseTime: Date.now()
      };

    } catch (error) {
      clearTimeout(timeoutId);
      
      if (error.name === 'AbortError') {
        throw new Error('Request timeout after 45 seconds');
      }
      
      throw error;
    }
  }

  // Extract rate limit reset time from error headers
  extractRateLimitReset(error) {
    try {
      // Try multiple header formats
      const headers = error.response?.headers;
      if (headers) {
        const resetHeader = headers.get('x-ratelimit-reset-requests') || 
                          headers.get('retry-after') ||
                          headers.get('x-ratelimit-reset');
        
        if (resetHeader) {
          const resetTime = parseInt(resetHeader);
          return resetTime || 3600; // Default to 1 hour
        }
      }
    } catch (e) {
      console.log('Could not extract rate limit reset time:', e.message);
    }
    
    return 3600; // Default to 1 hour
  }

  // Utility delay function
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Main content analysis function for Xist AI
  async analyzeContent(inputText, analysisType = 'comprehensive') {
    const analysisPrompt = this.buildAnalysisPrompt(inputText, analysisType);
    
    try {
      const response = await this.makeApiCall(analysisPrompt, {
        temperature: 0.3, // Lower temperature for consistent analysis 
        maxTokens: 2000,
        topP: 0.9
      });

      // Parse structured response
      let analysisResult;
      try {
        // Try to extract JSON from response
        const jsonMatch = response.content.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          analysisResult = JSON.parse(jsonMatch[0]);
        } else {
          throw new Error('No JSON found in response');
        }
      } catch (parseError) {
        console.log('JSON parsing failed, creating structured response from text');
        analysisResult = this.parseTextualResponse(response.content, inputText);
      }

      // Enhance with metadata
      return {
        ...analysisResult,
        timestamp: new Date().toISOString(),
        inputText: inputText.substring(0, 500),
        model: response.model,
        usage: response.usage,
        analysisType: analysisType,
        processingTime: Date.now() - (response.responseTime || Date.now())
      };

    } catch (error) {
      console.error('AI Analysis Error:', error);
      
      // Return fallback analysis when service fails
      return {
        overallRiskLevel: 'UNKNOWN',
        confidence: 0.5,
        category: 'service_error',
        summary: `Analysis service temporarily unavailable: ${error.message}`,
        threats: ['Service temporarily unavailable'],
        recommendations: [
          'Try again in a few moments', 
          'Manual verification recommended',
          'Check content against known fact-checking sources'
        ],
        technicalDetails: `Error: ${error.message}. Pool status: ${JSON.stringify(apiKeyPool.getPoolStats())}`,
        timestamp: new Date().toISOString(),
        inputText: inputText.substring(0, 500),
        error: true,
        fallback: true
      };
    }
  }

  // Build analysis prompt for DeepSeek-R1
  buildAnalysisPrompt(inputText, analysisType) {
    const systemPrompt = `You are Xist AI, an advanced misinformation detection and digital threat analysis system powered by DeepSeek-R1. 

Your mission is to analyze content for potential threats, misinformation, scams, phishing attempts, or safety concerns.

CRITICAL: Always return a valid JSON response with this exact structure:
{
  "overallRiskLevel": "LOW|MEDIUM|HIGH|CRITICAL",
  "confidence": 0.95,
  "category": "phishing|scam|misinformation|legitimate|spam|malware|social_engineering|fake_news|clickbait",
  "summary": "Brief explanation of findings",
  "threats": ["list", "of", "identified", "threats"],
  "recommendations": ["actionable", "safety", "recommendations"],
  "technicalDetails": "Detailed analysis for cybersecurity experts",
  "indicators": ["specific", "red", "flags", "found"],
  "sourceCredibility": "assessment of source reliability"
}

Analysis levels:
- LOW: Safe content, no threats detected
- MEDIUM: Suspicious elements, exercise caution
- HIGH: Clear threats detected, avoid interaction
- CRITICAL: Immediate danger, block and report`;

    return [
      {
        role: 'system',
        content: systemPrompt
      },
      {
        role: 'user', 
        content: `Analyze this content for digital threats and misinformation (${analysisType} analysis):\n\n${inputText}`
      }
    ];
  }

  // Parse textual response when JSON parsing fails
  parseTextualResponse(content, inputText) {
    const lines = content.split('\n').filter(line => line.trim());
    
    // Extract risk level
    let riskLevel = 'MEDIUM';
    const riskIndicators = {
      'CRITICAL': ['critical', 'immediate danger', 'severe threat'],
      'HIGH': ['high risk', 'dangerous', 'scam', 'phishing', 'malicious'],
      'LOW': ['safe', 'legitimate', 'low risk', 'no threat'],
      'MEDIUM': ['suspicious', 'caution', 'moderate', 'uncertain']
    };

    const lowerContent = content.toLowerCase();
    for (const [level, indicators] of Object.entries(riskIndicators)) {
      if (indicators.some(indicator => lowerContent.includes(indicator))) {
        riskLevel = level;
        break;
      }
    }

    return {
      overallRiskLevel: riskLevel,
      confidence: 0.7,
      category: 'general_analysis',
      summary: lines[0] || content.substring(0, 200),
      threats: this.extractThreats(content),
      recommendations: this.extractRecommendations(content),
      technicalDetails: content,
      indicators: ['Textual analysis performed'],
      sourceCredibility: 'Analysis based on content patterns'
    };
  }

  extractThreats(content) {
    const threats = [];
    const threatKeywords = ['scam', 'phishing', 'malware', 'virus', 'suspicious', 'fake', 'fraud'];
    
    threatKeywords.forEach(keyword => {
      if (content.toLowerCase().includes(keyword)) {
        threats.push(`Potential ${keyword} detected`);
      }
    });

    return threats.length > 0 ? threats : ['Analysis completed'];
  }

  extractRecommendations(content) {
    const baseRecommendations = [
      'Verify information through multiple reliable sources',
      'Exercise caution when clicking links or downloading files',
      'Report suspicious content to appropriate authorities'
    ];

    if (content.toLowerCase().includes('urgent') || content.toLowerCase().includes('immediate')) {
      baseRecommendations.unshift('Be wary of urgent or pressure tactics');
    }

    return baseRecommendations;
  }

  // Get service statistics
  getServiceStats() {
    const poolStats = apiKeyPool.getPoolStats();
    return {
      ...poolStats,
      serviceSuccess: this.successCount,
      serviceFailures: this.failureCount,
      successRate: this.successCount + this.failureCount > 0 
        ? Math.round((this.successCount / (this.successCount + this.failureCount)) * 100) 
        : 0,
      model: this.model,
      endpoint: this.baseURL
    };
  }

  // Reset service statistics
  resetServiceStats() {
    this.successCount = 0;
    this.failureCount = 0;
    apiKeyPool.resetAllKeys();
  }
}

// Singleton instance
const aiService = new AIService();

export default aiService;
