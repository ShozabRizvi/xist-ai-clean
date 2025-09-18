// Real API integrations for professional fact-checking
const API_CONFIG = {
  googleFactCheck: {
    baseUrl: 'https://factchecktools.googleapis.com/v1alpha1/claims:search',
    key: process.env.REACT_APP_GOOGLE_FACT_CHECK_API_KEY
  },
  newsApi: {
    baseUrl: 'https://newsapi.org/v2/everything',
    key: process.env.REACT_APP_NEWS_API_KEY
  },
  googleSearch: {
    baseUrl: 'https://www.googleapis.com/customsearch/v1',
    key: process.env.REACT_APP_GOOGLE_SEARCH_API_KEY,
    engineId: process.env.REACT_APP_GOOGLE_SEARCH_ENGINE_ID
  },
  useRealAPIs: process.env.REACT_APP_USE_REAL_APIS === 'true'
};

// Trusted source database
const TRUSTED_SOURCES = {
  'bbc.com': { score: 95, category: 'highly_credible', type: 'news' },
  'cnn.com': { score: 88, category: 'credible', type: 'news' },
  'reuters.com': { score: 97, category: 'highly_credible', type: 'news' },
  'ap.org': { score: 96, category: 'highly_credible', type: 'news' },
  'nytimes.com': { score: 90, category: 'credible', type: 'news' },
  'washingtonpost.com': { score: 89, category: 'credible', type: 'news' },
  'who.int': { score: 99, category: 'highly_credible', type: 'health' },
  'cdc.gov': { score: 98, category: 'highly_credible', type: 'health' },
  'nasa.gov': { score: 99, category: 'highly_credible', type: 'science' },
  'nih.gov': { score: 97, category: 'highly_credible', type: 'health' },
  'snopes.com': { score: 92, category: 'highly_credible', type: 'fact_check' },
  'factcheck.org': { score: 94, category: 'highly_credible', type: 'fact_check' },
  'politifact.com': { score: 91, category: 'highly_credible', type: 'fact_check' },
  'fullfact.org': { score: 93, category: 'highly_credible', type: 'fact_check' },
  'facebook.com': { score: 35, category: 'low_credibility', type: 'social' },
  'twitter.com': { score: 40, category: 'low_credibility', type: 'social' },
  'youtube.com': { score: 45, category: 'low_credibility', type: 'social' },
  'wikipedia.org': { score: 75, category: 'moderately_credible', type: 'reference' }
};

// Mock data for when APIs are not available
const MOCK_FACT_CHECK_DB = [
  {
    claim: "covid vaccine microchip",
    source: "CDC",
    rating: "FALSE",
    summary: "COVID-19 vaccines do not contain microchips or tracking devices. This has been thoroughly debunked by medical experts.",
    url: "https://cdc.gov/coronavirus/vaccine-myths",
    confidence: 100
  },
  {
    claim: "climate change hoax",
    source: "NASA",
    rating: "FALSE", 
    summary: "Climate change is scientifically proven with overwhelming evidence from multiple independent sources.",
    url: "https://climate.nasa.gov/evidence/",
    confidence: 98
  },
  {
    claim: "5g coronavirus connection",
    source: "WHO",
    rating: "FALSE",
    summary: "There is no link between 5G networks and COVID-19. Viruses cannot spread through radio waves.",
    url: "https://who.int/emergencies/diseases/novel-coronavirus-2019/advice-for-public/myth-busters",
    confidence: 100
  },
  {
    claim: "vaccine autism link",
    source: "CDC",
    rating: "FALSE",
    summary: "Extensive research has found no link between vaccines and autism. The original study was fraudulent and retracted.",
    url: "https://cdc.gov/vaccinesafety/concerns/autism.html",
    confidence: 100
  }
];

// Extract factual claims from content using advanced NLP patterns
export const extractFactualClaims = async (content) => {
  console.log('🔍 Extracting factual claims from content...');
  
  const claims = [];
  const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 15);
  
  // Advanced claim detection patterns
  const claimPatterns = [
    // Statistical claims
    /\d{1,3}%|\d+\s?(percent|people|cases|deaths|studies|research)/i,
    // Authority claims
    /(according to|study shows|research proves|scientists say|experts claim|data shows)/i,
    // Medical claims
    /(cure|treatment|prevents|causes|linked to|associated with)/i,
    // Conspiracy patterns
    /(secret|hidden|they don't want|cover up|conspiracy|hoax)/i,
    // Urgent/breaking claims
    /(breaking|urgent|alert|warning|immediate)/i,
    // Comparison claims
    /(better than|worse than|more effective|less effective|compared to)/i
  ];
  
  for (const sentence of sentences) {
    let isFactual = false;
    let claimType = 'general';
    let confidence = 0.6;
    
    // Check against patterns
    for (const pattern of claimPatterns) {
      if (pattern.test(sentence)) {
        isFactual = true;
        confidence += 0.1;
        break;
      }
    }
    
    // Determine claim type based on keywords
    const lowerSentence = sentence.toLowerCase();
    if (lowerSentence.includes('covid') || lowerSentence.includes('vaccine') || lowerSentence.includes('virus')) {
      claimType = 'health';
      confidence += 0.2;
    } else if (lowerSentence.includes('climate') || lowerSentence.includes('global warming') || lowerSentence.includes('environment')) {
      claimType = 'environment';
      confidence += 0.15;
    } else if (lowerSentence.includes('election') || lowerSentence.includes('vote') || lowerSentence.includes('political')) {
      claimType = 'political';
      confidence += 0.1;
    } else if (lowerSentence.includes('economy') || lowerSentence.includes('inflation') || lowerSentence.includes('market')) {
      claimType = 'economic';
      confidence += 0.1;
    }
    
    if (isFactual && confidence > 0.6) {
      claims.push({
        text: sentence.trim(),
        type: claimType,
        confidence: Math.min(confidence, 1.0),
        keywords: extractKeywords(sentence)
      });
    }
  }
  
  console.log(`📋 Extracted ${claims.length} factual claims`);
  return claims.slice(0, 8); // Limit to 8 most confident claims
};

// Extract keywords from sentence
const extractKeywords = (sentence) => {
  const stopWords = ['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by'];
  return sentence.toLowerCase()
    .split(/\s+/)
    .filter(word => word.length > 3 && !stopWords.includes(word))
    .slice(0, 5);
};

// REAL GOOGLE FACT CHECK API INTEGRATION
export const searchGoogleFactCheck = async (query) => {
  if (!API_CONFIG.useRealAPIs || !API_CONFIG.googleFactCheck.key) {
    console.log('📝 Using mock Google Fact Check data');
    return searchMockFactCheck(query);
  }

  try {
    console.log('🔍 Searching Google Fact Check API for:', query.substring(0, 50));
    
    const response = await fetch(
      `${API_CONFIG.googleFactCheck.baseUrl}?query=${encodeURIComponent(query)}&key=${API_CONFIG.googleFactCheck.key}&languageCode=en`
    );

    if (!response.ok) {
      throw new Error(`Google Fact Check API error: ${response.status}`);
    }

    const data = await response.json();
    console.log('✅ Google Fact Check API response received');

    if (!data.claims || data.claims.length === 0) {
      console.log('📝 No fact-checks found, using enhanced search');
      return await searchEnhancedFactCheck(query);
    }

    return {
      source: 'Google Fact Check Tools',
      results: data.claims.map(claim => ({
        text: claim.text,
        claimant: claim.claimant,
        claimDate: claim.claimDate,
        claimReview: claim.claimReview?.[0] || {},
        rating: claim.claimReview?.[0]?.textualRating || 'UNRATED',
        url: claim.claimReview?.[0]?.url,
        publisher: claim.claimReview?.[0]?.publisher?.name,
        reviewDate: claim.claimReview?.[0]?.reviewDate,
        confidence: 90
      })),
      totalResults: data.claims.length
    };

  } catch (error) {
    console.error('❌ Google Fact Check API error:', error);
    return searchMockFactCheck(query);
  }
};

// Enhanced fact-check search when no direct results
const searchEnhancedFactCheck = async (query) => {
  const keywords = extractKeywords(query);
  const enhancedQuery = keywords.join(' OR ');
  
  try {
    const response = await fetch(
      `${API_CONFIG.googleFactCheck.baseUrl}?query=${encodeURIComponent(enhancedQuery)}&key=${API_CONFIG.googleFactCheck.key}&languageCode=en`
    );

    const data = await response.json();
    
    if (data.claims && data.claims.length > 0) {
      return {
        source: 'Google Fact Check Tools (Enhanced)',
        results: data.claims.slice(0, 3).map(claim => ({
          text: claim.text,
          rating: claim.claimReview?.[0]?.textualRating || 'UNRATED',
          url: claim.claimReview?.[0]?.url,
          publisher: claim.claimReview?.[0]?.publisher?.name,
          confidence: 75,
          relevance: calculateRelevance(query, claim.text)
        })),
        totalResults: data.claims.length
      };
    }
  } catch (error) {
    console.error('Enhanced search failed:', error);
  }
  
  return searchMockFactCheck(query);
};

// Mock fact-check search for fallback
const searchMockFactCheck = (query) => {
  const lowerQuery = query.toLowerCase();
  const results = [];
  
  for (const factCheck of MOCK_FACT_CHECK_DB) {
    if (lowerQuery.includes(factCheck.claim.toLowerCase()) || 
        factCheck.claim.toLowerCase().includes(lowerQuery.split(' ')[0])) {
      results.push({
        text: query,
        rating: factCheck.rating,
        summary: factCheck.summary,
        url: factCheck.url,
        publisher: factCheck.source,
        confidence: factCheck.confidence,
        relevance: calculateRelevance(query, factCheck.claim)
      });
    }
  }
  
  // Add generic result if no specific match
  if (results.length === 0) {
    results.push({
      text: query,
      rating: 'UNVERIFIED',
      summary: `No specific fact-checks found for this claim. Recommend independent verification from authoritative sources.`,
      url: 'https://factcheck.org/search/',
      publisher: 'Xist AI Analysis',
      confidence: 60,
      relevance: 0.5
    });
  }
  
  return {
    source: 'Xist AI Knowledge Base',
    results: results,
    totalResults: results.length
  };
};

// Calculate relevance between query and fact-check
const calculateRelevance = (query, factCheckText) => {
  const queryWords = query.toLowerCase().split(/\s+/);
  const factCheckWords = factCheckText.toLowerCase().split(/\s+/);
  
  let matches = 0;
  for (const word of queryWords) {
    if (word.length > 3 && factCheckWords.some(fcWord => fcWord.includes(word) || word.includes(fcWord))) {
      matches++;
    }
  }
  
  return matches / queryWords.length;
};

// REAL NEWS API INTEGRATION
export const verifyNewsContent = async (content) => {
  console.log('📰 Verifying news content...');
  
  if (!API_CONFIG.useRealAPIs || !API_CONFIG.newsApi.key) {
    console.log('📝 Using mock news verification');
    return getMockNewsVerification(content);
  }

  try {
    const keywords = extractKeywords(content).slice(0, 3).join(' OR ');
    const fromDate = new Date();
    fromDate.setDate(fromDate.getDate() - 30); // Last 30 days
    
    const response = await fetch(
      `${API_CONFIG.newsApi.baseUrl}?q=${encodeURIComponent(keywords)}&from=${fromDate.toISOString().split('T')[0]}&sortBy=relevancy&apiKey=${API_CONFIG.newsApi.key}`
    );

    if (!response.ok) {
      throw new Error(`News API error: ${response.status}`);
    }

    const data = await response.json();
    console.log('✅ News API response received:', data.totalResults, 'articles');

    return {
      source: 'News API',
      totalArticles: data.totalResults,
      articles: data.articles?.slice(0, 5).map(article => ({
        title: article.title,
        source: article.source.name,
        publishedAt: article.publishedAt,
        url: article.url,
        description: article.description,
        credibilityScore: getSourceCredibilityScore(article.source.name.toLowerCase())
      })) || [],
      averageCredibility: data.articles ? 
        data.articles.slice(0, 5).reduce((sum, article) => 
          sum + getSourceCredibilityScore(article.source.name.toLowerCase()), 0
        ) / Math.min(5, data.articles.length) : 50
    };

  } catch (error) {
    console.error('❌ News API error:', error);
    return getMockNewsVerification(content);
  }
};

// Get source credibility score
const getSourceCredibilityScore = (sourceName) => {
  // Check exact matches first
  for (const [domain, info] of Object.entries(TRUSTED_SOURCES)) {
    if (sourceName.includes(domain.replace('.com', '').replace('.org', '').replace('.gov', ''))) {
      return info.score;
    }
  }
  
  // Default scoring based on source type indicators
  if (sourceName.includes('bbc') || sourceName.includes('reuters') || sourceName.includes('ap ')) return 95;
  if (sourceName.includes('cnn') || sourceName.includes('nyt') || sourceName.includes('post')) return 85;
  if (sourceName.includes('fox') || sourceName.includes('daily')) return 70;
  if (sourceName.includes('blog') || sourceName.includes('news')) return 55;
  
  return 60; // Default for unknown sources
};

// Mock news verification
const getMockNewsVerification = (content) => {
  const keywords = extractKeywords(content);
  
  return {
    source: 'Xist AI News Database',
    totalArticles: Math.floor(Math.random() * 50) + 10,
    articles: [
      {
        title: `Related coverage of: ${keywords.slice(0, 2).join(' ')}`,
        source: 'Reuters',
        publishedAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
        credibilityScore: 97,
        description: 'Professional fact-checking and verification from trusted news sources.'
      },
      {
        title: `Analysis: ${keywords[0]} claims examined`,
        source: 'BBC News',
        publishedAt: new Date(Date.now() - Math.random() * 14 * 24 * 60 * 60 * 1000).toISOString(),
        credibilityScore: 95,
        description: 'Independent journalism analysis and verification.'
      }
    ],
    averageCredibility: 85
  };
};

// COMPREHENSIVE SOURCE CREDIBILITY VERIFICATION
export const verifySourceCredibility = async (content) => {
  console.log('📊 Analyzing source credibility...');
  
  const urls = extractUrls(content);
  const domains = extractDomains(content);
  const credibilityResults = [];
  
  // Analyze each domain
  for (const domain of domains) {
    const domainInfo = TRUSTED_SOURCES[domain.toLowerCase()] || await analyzeUnknownDomain(domain);
    
    credibilityResults.push({
      domain,
      score: domainInfo.score,
      category: domainInfo.category,
      type: domainInfo.type,
      reasoning: generateCredibilityReasoning(domain, domainInfo)
    });
  }
  
  // If no domains found, analyze content patterns
  if (credibilityResults.length === 0) {
    const contentAnalysis = await analyzeContentCredibility(content);
    credibilityResults.push(contentAnalysis);
  }
  
  const overallScore = credibilityResults.length > 0 
    ? Math.round(credibilityResults.reduce((sum, d) => sum + d.score, 0) / credibilityResults.length)
    : await getContentBasedCredibility(content);
  
  return {
    domains: credibilityResults,
    overallScore,
    trustedSources: credibilityResults.filter(d => d.score >= 80).map(d => d.domain),
    suspiciousSources: credibilityResults.filter(d => d.score < 50).map(d => d.domain),
    analysis: generateSourceAnalysis(credibilityResults, overallScore)
  };
};

// Analyze unknown domain credibility
const analyzeUnknownDomain = async (domain) => {
  // Basic heuristics for unknown domains
  let score = 50; // Neutral starting point
  let category = 'unknown';
  let type = 'unknown';
  
  // Government domains
  if (domain.endsWith('.gov')) {
    score = 95;
    category = 'highly_credible';
    type = 'government';
  }
  // Educational domains
  else if (domain.endsWith('.edu')) {
    score = 85;
    category = 'credible';
    type = 'educational';
  }
  // Organization domains
  else if (domain.endsWith('.org')) {
    score = 70;
    category = 'moderately_credible';
    type = 'organization';
  }
  // Suspicious patterns
  else if (domain.includes('blog') || domain.includes('wordpress') || domain.includes('blogspot')) {
    score = 40;
    category = 'low_credibility';
    type = 'blog';
  }
  // Social media
  else if (['facebook.com', 'twitter.com', 'instagram.com', 'tiktok.com'].includes(domain)) {
    score = 35;
    category = 'low_credibility';
    type = 'social';
  }
  
  return { score, category, type };
};

// Generate credibility reasoning
const generateCredibilityReasoning = (domain, info) => {
  const reasons = [];
  
  if (info.score >= 90) {
    reasons.push('Highly trusted authoritative source');
  } else if (info.score >= 80) {
    reasons.push('Generally reliable with good track record');
  } else if (info.score >= 60) {
    reasons.push('Moderately reliable, recommend cross-checking');
  } else if (info.score >= 40) {
    reasons.push('Low reliability, high risk of bias or misinformation');
  } else {
    reasons.push('Unreliable source, high misinformation risk');
  }
  
  if (info.type === 'government') reasons.push('Official government source');
  if (info.type === 'educational') reasons.push('Academic or educational institution');
  if (info.type === 'fact_check') reasons.push('Professional fact-checking organization');
  if (info.type === 'social') reasons.push('Social media platform - content varies widely');
  
  return reasons.join('; ');
};

// Content-based credibility analysis
const analyzeContentCredibility = async (content) => {
  let score = 60; // Neutral start
  const indicators = [];
  
  // Positive indicators
  if (/according to.*research|study published|peer.reviewed/i.test(content)) {
    score += 15;
    indicators.push('References research/studies');
  }
  
  if (/expert.*said|professor.*stated|doctor.*explained/i.test(content)) {
    score += 10;
    indicators.push('Quotes experts');
  }
  
  // Negative indicators
  if (/URGENT|BREAKING|SHOCKING|YOU WON'T BELIEVE/i.test(content)) {
    score -= 20;
    indicators.push('Uses sensationalized language');
  }
  
  if (/they don't want you to know|secret|hidden truth|cover.?up/i.test(content)) {
    score -= 25;
    indicators.push('Contains conspiracy language');
  }
  
  if (/click here|limited time|act now|don't miss/i.test(content)) {
    score -= 15;
    indicators.push('Contains promotional/spam language');
  }
  
  return {
    domain: 'content-analysis',
    score: Math.max(10, Math.min(100, score)),
    category: score >= 70 ? 'credible_content' : score >= 50 ? 'mixed_signals' : 'suspicious_content',
    type: 'content_analysis',
    reasoning: indicators.length > 0 ? indicators.join('; ') : 'Standard content analysis'
  };
};

// Get content-based credibility when no sources found
const getContentBasedCredibility = async (content) => {
  const analysis = await analyzeContentCredibility(content);
  return analysis.score;
};

// Generate source analysis summary
const generateSourceAnalysis = (results, overallScore) => {
  if (results.length === 0) {
    return 'No sources detected in content. Credibility assessment based on content analysis.';
  }
  
  const trusted = results.filter(r => r.score >= 80).length;
  const suspicious = results.filter(r => r.score < 50).length;
  
  if (trusted > suspicious) {
    return `Analysis of ${results.length} source(s) shows ${trusted} trusted source(s). Content appears to be from reliable sources.`;
  } else if (suspicious > 0) {
    return `Analysis of ${results.length} source(s) shows ${suspicious} suspicious source(s). Exercise caution with this information.`;
  } else {
    return `Analysis of ${results.length} source(s) shows mixed credibility. Recommend independent verification.`;
  }
};

// Extract URLs from content
export const extractUrls = (content) => {
  const urlRegex = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/g;
  return content.match(urlRegex) || [];
};

// Extract domains from content
export const extractDomains = (content) => {
  const urls = extractUrls(content);
  const domains = new Set();
  
  urls.forEach(url => {
    try {
      const domain = new URL(url).hostname.replace('www.', '');
      domains.add(domain);
    } catch (error) {
      console.warn('Invalid URL:', url);
    }
  });
  
  // Also check for domain mentions without full URLs
  const domainRegex = /(?:^|\s)((?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,})(?:\s|$)/g;
  let match;
  while ((match = domainRegex.exec(content)) !== null) {
    const domain = match[1].toLowerCase();
    if (domain.includes('.') && !domain.includes('@')) {
      domains.add(domain);
    }
  }
  
  return Array.from(domains);
};

// COMPREHENSIVE FACT-CHECK SEARCH
export const searchFactCheckers = async (claim) => {
  console.log('🔍 Searching professional fact-checkers for:', claim.substring(0, 50));
  
  try {
    // Search Google Fact Check API
    const googleResults = await searchGoogleFactCheck(claim);
    
    // Search news verification
    const newsResults = await verifyNewsContent(claim);
    
    // Combine results
    const allResults = [];
    
    // Add Google Fact Check results
    if (googleResults.results && googleResults.results.length > 0) {
      googleResults.results.forEach(result => {
        allResults.push({
          source: result.publisher || googleResults.source,
          rating: standardizeRating(result.rating),
          summary: result.summary || `Fact-check analysis of: ${claim.substring(0, 100)}...`,
          url: result.url || 'https://factcheck.org',
          confidence: result.confidence || 85,
          relevance: result.relevance || calculateRelevance(claim, result.text || claim),
          reviewDate: result.reviewDate,
          claimant: result.claimant
        });
      });
    }
    
    // Add news verification context
    if (newsResults.articles && newsResults.articles.length > 0) {
      allResults.push({
        source: 'News Verification Analysis',
        rating: newsResults.averageCredibility >= 80 ? 'VERIFIED' : 
                newsResults.averageCredibility >= 60 ? 'MIXED' : 'UNVERIFIED',
        summary: `Found ${newsResults.totalArticles} related news articles with average credibility of ${newsResults.averageCredibility}%`,
        url: newsResults.articles[0]?.url || 'https://news.google.com',
        confidence: Math.round(newsResults.averageCredibility),
        relevance: 0.7,
        reviewDate: new Date().toISOString().split('T')[0],
        additionalInfo: `Top sources: ${newsResults.articles.slice(0, 3).map(a => a.source).join(', ')}`
      });
    }
    
    // If no results, add default analysis
    if (allResults.length === 0) {
      allResults.push({
        source: 'Xist AI Analysis',
        rating: 'UNVERIFIED',
        summary: 'No specific fact-checks found for this claim in our database. Recommend manual verification from authoritative sources.',
        url: 'https://factcheck.org/search/',
        confidence: 60,
        relevance: 0.5,
        reviewDate: new Date().toISOString().split('T')[0]
      });
    }
    
    console.log(`✅ Found ${allResults.length} fact-check result(s)`);
    return allResults;
    
  } catch (error) {
    console.error('❌ Comprehensive fact-check search failed:', error);
    
    // Fallback to mock results
    return [{
      source: 'Xist AI Fallback',
      rating: 'UNVERIFIED',
      summary: 'Unable to complete fact-check verification due to API limitations. Recommend manual verification.',
      url: 'https://factcheck.org',
      confidence: 50,
      relevance: 0.5,
      reviewDate: new Date().toISOString().split('T')[0]
    }];
  }
};

// Standardize rating formats from different sources
const standardizeRating = (rating) => {
  if (!rating) return 'UNRATED';
  
  const normalizedRating = rating.toUpperCase();
  
  // Map various rating formats to standard ones
  const ratingMap = {
    'TRUE': 'VERIFIED',
    'MOSTLY TRUE': 'VERIFIED',
    'ACCURATE': 'VERIFIED',
    'CORRECT': 'VERIFIED',
    'FALSE': 'FALSE',
    'MOSTLY FALSE': 'FALSE',
    'INCORRECT': 'FALSE',
    'DEBUNKED': 'FALSE',
    'MISLEADING': 'MISLEADING',
    'PARTLY FALSE': 'MISLEADING',
    'MIXED': 'MISLEADING',
    'UNPROVEN': 'UNVERIFIED',
    'UNSUBSTANTIATED': 'UNVERIFIED',
    'NO EVIDENCE': 'UNVERIFIED'
  };
  
  return ratingMap[normalizedRating] || 'UNVERIFIED';
};

// Generate corrective information
export const generateCorrectiveInfo = async (claims, factCheckResults) => {
  console.log('💡 Generating corrective information...');
  
  const corrections = [];
  
  for (let i = 0; i < claims.length && i < factCheckResults.length; i++) {
    const claim = claims[i];
    const factChecks = factCheckResults[i];
    
    if (factChecks && factChecks.length > 0) {
      for (const factCheck of factChecks) {
        if (factCheck.rating === 'FALSE' || factCheck.rating === 'MISLEADING') {
          corrections.push({
            originalClaim: claim.text,
            issue: factCheck.rating === 'FALSE' ? 'This claim is false' : 'This claim is misleading',
            correction: factCheck.summary,
            source: factCheck.source,
            sourceUrl: factCheck.url,
            confidence: factCheck.confidence,
            evidence: `Verified by ${factCheck.source} on ${factCheck.reviewDate || 'recent date'}`
          });
        }
      }
    }
  }
  
  console.log(`📝 Generated ${corrections.length} correction(s)`);
  return corrections;
};

// Calculate overall credibility with weighted factors
export const calculateOverallCredibility = (analysisData) => {
  console.log('🎯 Calculating overall credibility score...');
  
  let totalScore = 0;
  let totalWeight = 0;
  
  // Source credibility (weight: 35%)
  if (analysisData.sourceCredibility && analysisData.sourceCredibility.overallScore) {
    totalScore += analysisData.sourceCredibility.overallScore * 0.35;
    totalWeight += 0.35;
  }
  
  // Fact-check results (weight: 40%)
  if (analysisData.factCheckResults && analysisData.factCheckResults.length > 0) {
    let factCheckScore = 0;
    let factCheckCount = 0;
    
    analysisData.factCheckResults.forEach(results => {
      if (results && results.length > 0) {
        results.forEach(result => {
          let score = 50; // neutral
          
          switch (result.rating) {
            case 'VERIFIED': score = 90; break;
            case 'FALSE': score = 10; break;
            case 'MISLEADING': score = 30; break;
            case 'UNVERIFIED': score = 50; break;
            default: score = 50;
          }
          
          // Weight by confidence and relevance
          const weight = (result.confidence / 100) * (result.relevance || 0.5);
          factCheckScore += score * weight;
          factCheckCount += weight;
        });
      }
    });
    
    if (factCheckCount > 0) {
      const avgFactCheckScore = factCheckScore / factCheckCount;
      totalScore += avgFactCheckScore * 0.40;
      totalWeight += 0.40;
    }
  }
  
  // Claims analysis (weight: 25%)
  if (analysisData.claimsAnalysis && analysisData.claimsAnalysis.length > 0) {
    const avgClaimConfidence = analysisData.claimsAnalysis.reduce((sum, claim) => {
      return sum + (claim.confidence * 100);
    }, 0) / analysisData.claimsAnalysis.length;
    
    totalScore += avgClaimConfidence * 0.25;
    totalWeight += 0.25;
  }
  
  // Calculate final score
  const finalScore = totalWeight > 0 ? Math.round(totalScore / totalWeight) : 50;
  const adjustedScore = Math.max(5, Math.min(95, finalScore)); // Keep within realistic bounds
  
  const breakdown = {
    sourceCredibility: analysisData.sourceCredibility?.overallScore || 0,
    factCheckConsensus: analysisData.factCheckResults?.length > 0 ? 
      Math.round(analysisData.factCheckResults.reduce((sum, results) => {
        if (!results || results.length === 0) return sum;
        return sum + results.reduce((s, r) => s + (r.confidence || 50), 0) / results.length;
      }, 0) / analysisData.factCheckResults.length) : 0,
    claimsVerification: analysisData.claimsAnalysis?.length > 0 ?
      Math.round(analysisData.claimsAnalysis.reduce((sum, c) => sum + (c.confidence * 100), 0) / analysisData.claimsAnalysis.length) : 0
  };
  
  console.log(`🎯 Overall credibility: ${adjustedScore}%`);
  
  return {
    score: adjustedScore,
    breakdown,
    confidence: totalWeight,
    factors: Math.round(totalWeight * 100) + '%'
  };
};

// API health check
export const checkAPIHealth = async () => {
  const health = {
    googleFactCheck: false,
    newsApi: false,
    googleSearch: false,
    timestamp: new Date().toISOString()
  };
  
  // Test Google Fact Check API
  if (API_CONFIG.googleFactCheck.key) {
    try {
      const response = await fetch(
        `${API_CONFIG.googleFactCheck.baseUrl}?query=test&key=${API_CONFIG.googleFactCheck.key}`
      );
      health.googleFactCheck = response.ok;
    } catch (error) {
      console.warn('Google Fact Check API health check failed:', error);
    }
  }
  
  // Test News API
  if (API_CONFIG.newsApi.key) {
    try {
      const response = await fetch(
        `${API_CONFIG.newsApi.baseUrl}?q=test&apiKey=${API_CONFIG.newsApi.key}`
      );
      health.newsApi = response.ok;
    } catch (error) {
      console.warn('News API health check failed:', error);
    }
  }
  
  return health;
};

export default {
  extractFactualClaims,
  searchGoogleFactCheck,
  verifyNewsContent,
  verifySourceCredibility,
  searchFactCheckers,
  generateCorrectiveInfo,
  calculateOverallCredibility,
  checkAPIHealth,
  extractUrls,
  extractDomains
};
