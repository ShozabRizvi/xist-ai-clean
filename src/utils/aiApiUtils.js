import { ANALYSIS_MODES } from './analysisUtils';


// ===================== GEMINI API CALL =====================
export async function fetchGeminiAnalysis(prompt, mode = 'comprehensive') {
  const GEMINI_API_KEY = process.env.REACT_APP_GEMINI_API_KEY;
  
  if (!GEMINI_API_KEY) {
    throw new Error('Gemini API key not configured');
  }

  const config = ANALYSIS_MODES[mode] || ANALYSIS_MODES.comprehensive;
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`;

  const requestBody = {
    contents: [
      {
        parts: [
          {
            text: prompt
          }
        ]
      }
    ],
    generationConfig: {
      temperature: config.temperature || 0.5,
      maxOutputTokens: config.maxTokens || 600,
      topP: 0.95,
      topK: 40,
    },
    safetySettings: [
      {
        category: 'HARM_CATEGORY_HARASSMENT',
        threshold: 'BLOCK_NONE'
      },
      {
        category: 'HARM_CATEGORY_HATE_SPEECH',
        threshold: 'BLOCK_NONE'
      },
      {
        category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
        threshold: 'BLOCK_NONE'
      },
      {
        category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
        threshold: 'BLOCK_NONE'
      }
    ]
  };

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Gemini API error:', errorData);
      
      // Check for quota/rate limit errors
      if (response.status === 429 || response.status === 403) {
        throw new Error('QUOTA_EXCEEDED');
      }
      
      throw new Error(`Gemini API failed with status ${response.status}`);
    }

    const data = await response.json();
    
    // Extract text from Gemini response structure
    const aiText = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    
    if (!aiText) {
      throw new Error('Empty response from Gemini');
    }

    // Parse the AI response into structured format
    return parseAIResponse(aiText);

  } catch (error) {
    console.error('Gemini fetch error:', error);
    throw error;
  }
}

// ===================== OPENROUTER API CALL (DEEPSEEK FALLBACK) =====================
export async function fetchOpenRouterAnalysis(prompt, mode = 'comprehensive') {
  const OPENROUTER_API_KEY = process.env.REACT_APP_OPENROUTER_API_KEY;
  const MICROSOFT_MODEL = process.env.REACT_APP_MICROSOFT_MODEL || 'microsoft/mai-ds-r1:free';
  
  if (!OPENROUTER_API_KEY) {
    throw new Error('OpenRouter API key not configured');
  }

  const config = ANALYSIS_MODES[mode] || ANALYSIS_MODES.comprehensive;
  const url = 'https://openrouter.ai/api/v1/chat/completions';

  const requestBody = {
    model: MICROSOFT_MODEL,
    messages: [
      {
        role: 'system',
        content: 'You are an advanced AI safety analyst for Xist AI. Your role is to detect misinformation, scams, phishing, social engineering, and cyber threats. Always respond in the structured format requested by the user prompt. Be concise, friendly, and professional. Never mention AI provider details or credit usage.'
      },
      {
        role: 'user',
        content: prompt
      }
    ],
    max_tokens: config.maxTokens || 600,
    temperature: config.temperature || 0.5,
    top_p: 0.95,
    stream: false,
  };

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': window.location.origin,
        'X-Title': 'Xist AI - Misinformation Checker',
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('OpenRouter API error:', errorData);
      
      // Check for quota/rate limit errors
      if (response.status === 429 || response.status === 402) {
        throw new Error('QUOTA_EXCEEDED');
      }
      
      throw new Error(`OpenRouter API failed with status ${response.status}`);
    }

    const data = await response.json();
    
    // Extract text from OpenRouter response structure
    const aiText = data.choices?.[0]?.message?.content || '';
    
    if (!aiText) {
      throw new Error('Empty response from OpenRouter');
    }

    // Parse the AI response into structured format
    return parseAIResponse(aiText);

  } catch (error) {
    console.error('OpenRouter fetch error:', error);
    throw error;
  }
}

// ===================== AI RESPONSE PARSER =====================
export function parseAIResponse(aiText) {
  try {
    // Extract structured information from AI text response
    // The AI is instructed to provide: Summary, Verdict, Confidence, Alert Level, Patterns, Explanation
    
    // Extract verdict
    const verdictMatch = aiText.match(/Verdict:\s*([A-Z\/\s]+)/i) || 
                        aiText.match(/(SAFE|SUSPICIOUS|SCAM\/MISINFORMATION|THREAT|SCAM)/i);
    const verdict = verdictMatch ? verdictMatch[1].trim() : 'UNKNOWN';

    // Extract confidence percentage
    const confidenceMatch = aiText.match(/Confidence:\s*(\d+)%?/i);
    const confidence = confidenceMatch ? parseInt(confidenceMatch[1], 10) : 85;

    // Extract alert level
    const alertLevelMatch = aiText.match(/Alert Level:\s*(Critical|High|Medium|Low)/i);
    const alertLevel = alertLevelMatch ? alertLevelMatch[1] : determineAlertLevel(verdict, confidence);

    // Extract patterns (look for bullet points or numbered lists)
    const patternsSection = aiText.match(/Patterns?.*?:(.+?)(?=\n\n|Explanation|$)/is);
    let patterns = [];
    
    if (patternsSection) {
      const patternText = patternsSection[1];
      patterns = patternText
        .split(/\n/)
        .filter(line => line.trim().length > 0)
        .map(line => line.replace(/^[\s\-\*\d\.]+/, '').trim())
        .filter(line => line.length > 5 && line.length < 200)
        .slice(0, 10); // Max 10 patterns
    }

    // If no patterns found through structured extraction, try to find them in the text
    if (patterns.length === 0) {
      const commonPatterns = [
        'phishing attempt',
        'social engineering',
        'crypto scam',
        'urgent language',
        'credential harvesting',
        'fake urgency',
        'suspicious links',
        'impersonation',
        'financial fraud',
        'malware indicators'
      ];
      
      patterns = commonPatterns.filter(pattern => 
        aiText.toLowerCase().includes(pattern.toLowerCase())
      );
    }

    // Extract explanation (usually the last substantial paragraph)
    const explanationMatch = aiText.match(/Explanation:(.+?)(?=\n\n|$)/is) ||
                            aiText.match(/Analysis:(.+?)(?=\n\n|$)/is);
    let explanation = explanationMatch ? explanationMatch[1].trim() : '';
    
    // If no explicit explanation, take a meaningful chunk from the response
    if (!explanation) {
      const sentences = aiText.split(/\.\s+/);
      explanation = sentences.slice(1, 4).join('. ') + '.';
    }
    
    // Limit explanation length
    if (explanation.length > 500) {
      explanation = explanation.slice(0, 497) + '...';
    }

    // Extract summary (first substantial paragraph, up to 70 words)
    const summaryMatch = aiText.match(/^(.+?)(?=\n\n|Verdict:|$)/s);
    let summary = summaryMatch ? summaryMatch[1].trim() : aiText.slice(0, 300);
    
    // Ensure summary is not too long (≤70 words as per spec)
    const summaryWords = summary.split(/\s+/);
    if (summaryWords.length > 70) {
      summary = summaryWords.slice(0, 70).join(' ') + '...';
    }

    // Determine if critical
    const critical = (
      alertLevel === 'Critical' ||
      verdict.includes('SCAM') ||
      verdict.includes('THREAT') ||
      confidence >= 90
    );

    // Timestamp
    const timestamp = new Date().toLocaleString('en-US', {
      dateStyle: 'medium',
      timeStyle: 'short'
    });

    return {
      summary,
      verdict,
      confidence,
      alertLevel,
      patterns: patterns.length > 0 ? patterns : ['No specific patterns detected'],
      explanation,
      timestamp,
      critical,
    };

  } catch (parseError) {
    console.error('Error parsing AI response:', parseError);
    
    // Return a safe fallback structure
    return {
      summary: aiText.slice(0, 200) + '...',
      verdict: 'UNKNOWN',
      confidence: 50,
      alertLevel: 'Medium',
      patterns: ['Unable to extract patterns'],
      explanation: 'Analysis completed but response format was unexpected.',
      timestamp: new Date().toLocaleString(),
      critical: false,
    };
  }
}

// ===================== HELPER: DETERMINE ALERT LEVEL =====================
function determineAlertLevel(verdict, confidence) {
  if (verdict.includes('SCAM') || verdict.includes('THREAT')) {
    return confidence >= 85 ? 'Critical' : 'High';
  }
  
  if (verdict === 'SUSPICIOUS') {
    return confidence >= 80 ? 'High' : 'Medium';
  }
  
  if (verdict === 'SAFE') {
    return 'Low';
  }
  
  return 'Medium';
}

// ===================== HELPER: RETRY WITH EXPONENTIAL BACKOFF =====================
export async function retryWithBackoff(fetchFunction, maxRetries = 3) {
  let lastError;
  
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fetchFunction();
    } catch (error) {
      lastError = error;
      
      // Don't retry on quota errors
      if (error.message === 'QUOTA_EXCEEDED') {
        throw error;
      }
      
      // Exponential backoff: 1s, 2s, 4s
      const delay = Math.pow(2, i) * 1000;
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  throw lastError;
}

export default {
  fetchGeminiAnalysis,
  fetchOpenRouterAnalysis,
  parseAIResponse,
  retryWithBackoff,
};
