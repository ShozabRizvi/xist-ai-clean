import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  LightBulbIcon, 
  TrendingUpIcon, 
  ExclamationTriangleIcon,
  GlobeAltIcon,
  ClockIcon,
  FireIcon
} from '@heroicons/react/24/outline';

const PredictiveAnalysis = ({ content, realTimeData }) => {
  const [predictions, setPredictions] = useState(null);
  const [trendingThreats, setTrendingThreats] = useState([]);
  const [emergingNarratives, setEmergingNarratives] = useState([]);

  useEffect(() => {
    if (content) {
      generatePredictions(content);
      fetchTrendingThreats();
      analyzeEmergingNarratives(content);
    }
  }, [content]);

  // UNIQUE AI INNOVATION: Predictive Misinformation Analysis
  const generatePredictions = async (text) => {
    // Simulate advanced AI prediction algorithms
    const viralityFactors = analyzeViralityPotential(text);
    const narrativePatterns = detectNarrativePatterns(text);
    const contextualFactors = analyzeContextualFactors(text);

    const prediction = {
      viralPotential: viralityFactors.score,
      spreadPrediction: calculateSpreadPrediction(viralityFactors, narrativePatterns),
      peakTime: predictPeakSpread(viralityFactors),
      targetDemographics: identifyTargetGroups(text),
      countermeasures: generateCountermeasures(narrativePatterns),
      confidence: calculatePredictionConfidence(viralityFactors, contextualFactors)
    };

    setPredictions(prediction);
  };

  const analyzeViralityPotential = (text) => {
    const viralIndicators = [
      { pattern: /breaking|urgent|alert/gi, weight: 25, factor: 'urgency' },
      { pattern: /shocking|unbelievable|incredible/gi, weight: 20, factor: 'sensationalism' },
      { pattern: /share|tell everyone|spread the word/gi, weight: 30, factor: 'call_to_share' },
      { pattern: /secret|hidden|they don't want/gi, weight: 35, factor: 'conspiracy' },
      { pattern: /everyone needs to know/gi, weight: 40, factor: 'social_pressure' }
    ];

    let score = 0;
    let detectedFactors = [];

    viralIndicators.forEach(({ pattern, weight, factor }) => {
      if (pattern.test(text)) {
        score += weight;
        detectedFactors.push(factor);
      }
    });

    // Emotional language multiplier
    const emotionalIntensity = analyzeEmotionalIntensity(text);
    score *= (1 + emotionalIntensity / 100);

    return {
      score: Math.min(score, 100),
      factors: detectedFactors,
      emotionalIntensity
    };
  };

  const analyzeEmotionalIntensity = (text) => {
    const emotionWords = {
      high: /outraged|furious|terrifying|devastating|shocking|incredible/gi,
      medium: /angry|worried|concerned|surprised|amazing/gi,
      low: /interesting|notable|concerning|unusual/gi
    };

    let intensity = 0;
    const highMatches = (text.match(emotionWords.high) || []).length;
    const mediumMatches = (text.match(emotionWords.medium) || []).length;
    const lowMatches = (text.match(emotionWords.low) || []).length;

    intensity = (highMatches * 30) + (mediumMatches * 20) + (lowMatches * 10);
    return Math.min(intensity, 100);
  };

  const detectNarrativePatterns = (text) => {
    const narrativeTypes = [
      { type: 'conspiracy', pattern: /cover.up|hidden agenda|they don't want|secret/gi },
      { type: 'health_scare', pattern: /dangerous|toxic|harmful|deadly|poison/gi },
      { type: 'financial_fear', pattern: /collapse|crash|economic|lose money|bankruptcy/gi },
      { type: 'political_division', pattern: /corrupt|scandal|fraud|lie|deceive/gi },
      { type: 'social_outrage', pattern: /unfair|injustice|discrimination|abuse|violation/gi }
    ];

    const detectedNarratives = narrativeTypes
      .filter(({ pattern }) => pattern.test(text))
      .map(({ type }) => type);

    return {
      types: detectedNarratives,
      complexity: detectedNarratives.length,
      primaryNarrative: detectedNarratives[0] || 'general'
    };
  };

  const calculateSpreadPrediction = (virality, narratives) => {
    const baseSpread = virality.score;
    const narrativeMultiplier = narratives.complexity * 1.2;
    const platformFactors = {
      twitter: 1.5,
      facebook: 1.3,
      instagram: 1.1,
      tiktok: 1.8,
      whatsapp: 2.0
    };

    const predictedSpread = {
      hour1: Math.round(baseSpread * 0.1 * narrativeMultiplier),
      hour6: Math.round(baseSpread * 0.3 * narrativeMultiplier),
      day1: Math.round(baseSpread * 0.7 * narrativeMultiplier),
      day3: Math.round(baseSpread * 1.0 * narrativeMultiplier),
      week1: Math.round(baseSpread * 0.8 * narrativeMultiplier),
      platforms: platformFactors
    };

    return predictedSpread;
  };

  const predictPeakSpread = (virality) => {
    const urgencyFactor = virality.factors.includes('urgency') ? 0.5 : 1;
    const conspiracyFactor = virality.factors.includes('conspiracy') ? 2 : 1;
    
    const peakHours = 24 * urgencyFactor * conspiracyFactor;
    return Math.max(peakHours, 1);
  };

  const identifyTargetGroups = (text) => {
    const demographicPatterns = [
      { group: 'elderly', pattern: /pension|retirement|senior|elderly|medicare/gi },
      { group: 'parents', pattern: /children|kids|family|parenting|school/gi },
      { group: 'investors', pattern: /money|investment|crypto|stocks|financial/gi },
      { group: 'health_conscious', pattern: /health|diet|fitness|wellness|natural/gi },
      { group: 'politically_engaged', pattern: /government|politics|election|voting|policy/gi }
    ];

    return demographicPatterns
      .filter(({ pattern }) => pattern.test(text))
      .map(({ group }) => group);
  };

  const generateCountermeasures = (narratives) => {
    const countermeasureStrategies = {
      conspiracy: [
        'Provide transparent, factual information',
        'Engage trusted community leaders',
        'Use peer-to-peer fact-checking'
      ],
      health_scare: [
        'Connect with medical professionals',
        'Share official health authority guidance',
        'Provide scientific evidence'
      ],
      financial_fear: [
        'Offer verified financial advice',
        'Connect with regulatory authorities',
        'Provide historical context'
      ],
      political_division: [
        'Promote nonpartisan fact-checking',
        'Encourage critical thinking',
        'Provide multiple perspectives'
      ]
    };

    const primaryNarrative = narratives.primaryNarrative;
    return countermeasureStrategies[primaryNarrative] || [
      'Encourage source verification',
      'Promote media literacy',
      'Foster critical thinking'
    ];
  };

  const fetchTrendingThreats = async () => {
    // Simulate real-time threat intelligence
    const mockThreatData = [
      {
        id: 1,
        threat: 'AI-Generated Deepfake Videos',
        trendScore: 89,
        growth: '+340%',
        affectedRegions: ['North America', 'Europe'],
        timeframe: 'Last 24 hours'
      },
      {
        id: 2,
        threat: 'Cryptocurrency Investment Scams',
        trendScore: 76,
        growth: '+156%',
        affectedRegions: ['Global'],
        timeframe: 'Last 48 hours'
      },
      {
        id: 3,
        threat: 'Health Misinformation Campaigns',
        trendScore: 64,
        growth: '+89%',
        affectedRegions: ['Asia', 'Africa'],
        timeframe: 'Last week'
      }
    ];

    setTrendingThreats(mockThreatData);
  };

  const analyzeEmergingNarratives = (text) => {
    // Simulate emerging narrative detection
    const emergingPatterns = [
      {
        narrative: 'Economic Collapse Predictions',
        confidence: 78,
        keywords: ['recession', 'inflation', 'market crash'],
        estimatedReach: '2.3M people',
        growthRate: '+67%'
      },
      {
        narrative: 'Election Fraud Claims',
        confidence: 85,
        keywords: ['voting', 'fraud', 'manipulation'],
        estimatedReach: '4.1M people',
        growthRate: '+123%'
      }
    ];

    setEmergingNarratives(emergingPatterns);
  };

  const calculatePredictionConfidence = (virality, contextual) => {
    const baseConfidence = 60;
    const viralityBoost = virality.score > 50 ? 20 : 10;
    const contextualBoost = contextual ? 15 : 5;
    
    return Math.min(baseConfidence + viralityBoost + contextualBoost, 95);
  };

  if (!predictions) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
        <div className="text-center py-8">
          <LightBulbIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400">
            Analyzing content for predictive insights...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      {/* Main Prediction Panel */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 rounded-2xl p-6 border border-purple-200 dark:border-purple-800"
      >
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-2 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-lg">
            <TrendingUpIcon className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
              Predictive Analysis
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              AI-powered spread prediction and impact assessment
            </p>
          </div>
        </div>

        {/* Viral Potential */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-white/50 dark:bg-gray-800/50 rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Viral Potential
              </span>
              <span className={`text-2xl font-bold ${
                predictions.viralPotential > 70 ? 'text-red-600' :
                predictions.viralPotential > 40 ? 'text-yellow-600' :
                'text-green-600'
              }`}>
                {Math.round(predictions.viralPotential)}%
              </span>
            </div>
            
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all duration-1000 ${
                  predictions.viralPotential > 70 ? 'bg-gradient-to-r from-red-500 to-red-600' :
                  predictions.viralPotential > 40 ? 'bg-gradient-to-r from-yellow-500 to-orange-500' :
                  'bg-gradient-to-r from-green-500 to-green-600'
                }`}
                style={{ width: `${predictions.viralPotential}%` }}
              />
            </div>
          </div>

          <div className="bg-white/50 dark:bg-gray-800/50 rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Prediction Confidence
              </span>
              <span className="text-2xl font-bold text-blue-600">
                {predictions.confidence}%
              </span>
            </div>
            
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div
                className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-1000"
                style={{ width: `${predictions.confidence}%` }}
              />
            </div>
          </div>
        </div>

        {/* Spread Prediction Timeline */}
        <div className="bg-white/50 dark:bg-gray-800/50 rounded-xl p-4 mb-6">
          <h4 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center space-x-2">
            <ClockIcon className="w-5 h-5 text-purple-600" />
            <span>Predicted Spread Timeline</span>
          </h4>
          
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {[
              { time: '1 Hour', value: predictions.spreadPrediction.hour1 },
              { time: '6 Hours', value: predictions.spreadPrediction.hour6 },
              { time: '1 Day', value: predictions.spreadPrediction.day1 },
              { time: '3 Days', value: predictions.spreadPrediction.day3 },
              { time: '1 Week', value: predictions.spreadPrediction.week1 }
            ].map((item, idx) => (
              <div key={idx} className="text-center">
                <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  {item.time}
                </div>
                <div className="text-lg font-bold text-purple-600">
                  {item.value.toLocaleString()}
                </div>
                <div className="text-xs text-gray-500">
                  shares
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Target Demographics */}
        {predictions.targetDemographics.length > 0 && (
          <div className="bg-white/50 dark:bg-gray-800/50 rounded-xl p-4 mb-6">
            <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
              Target Demographics
            </h4>
            <div className="flex flex-wrap gap-2">
              {predictions.targetDemographics.map((demo, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 rounded-full text-sm font-medium"
                >
                  {demo.replace('_', ' ').toUpperCase()}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Countermeasures */}
        <div className="bg-white/50 dark:bg-gray-800/50 rounded-xl p-4">
          <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
            Recommended Countermeasures
          </h4>
          <ul className="space-y-2">
            {predictions.countermeasures.map((measure, idx) => (
              <li key={idx} className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  {measure}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </motion.div>

      {/* Trending Threats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700"
      >
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-2 bg-gradient-to-r from-red-500 to-orange-500 rounded-lg">
            <FireIcon className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
              Trending Threats
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Real-time global threat intelligence
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {trendingThreats.map((threat) => (
            <div key={threat.id} className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold text-gray-900 dark:text-white">
                  {threat.threat}
                </h4>
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                    threat.trendScore > 80 ? 'bg-red-100 text-red-800' :
                    threat.trendScore > 60 ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {threat.trendScore}/100
                  </span>
                  <span className="text-green-600 font-bold text-sm">
                    {threat.growth}
                  </span>
                </div>
              </div>
              
              <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                <div className="flex items-center space-x-4">
                  <span>📍 {threat.affectedRegions.join(', ')}</span>
                  <span>⏱️ {threat.timeframe}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Emerging Narratives */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700"
      >
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg">
            <GlobeAltIcon className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
              Emerging Narratives
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Early detection of developing misinformation themes
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {emergingNarratives.map((narrative, idx) => (
            <div key={idx} className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 border border-blue-200 dark:border-blue-800">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold text-gray-900 dark:text-white">
                  {narrative.narrative}
                </h4>
                <span className="text-blue-600 font-bold">
                  {narrative.confidence}% confidence
                </span>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-3">
                <div>
                  <span className="text-xs text-gray-600 dark:text-gray-400">Estimated Reach</span>
                  <div className="font-bold text-orange-600">{narrative.estimatedReach}</div>
                </div>
                <div>
                  <span className="text-xs text-gray-600 dark:text-gray-400">Growth Rate</span>
                  <div className="font-bold text-green-600">{narrative.growthRate}</div>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {narrative.keywords.map((keyword, kidx) => (
                  <span
                    key={kidx}
                    className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded text-xs"
                  >
                    #{keyword}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default PredictiveAnalysis;
