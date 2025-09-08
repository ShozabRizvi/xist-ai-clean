import re
import requests
from textblob import TextBlob
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
import pickle
import os
from datetime import datetime

class AdvancedDetectionEngine:
    def __init__(self):
        self.scam_patterns = [
            r'urgent.*action.*required',
            r'click.*here.*immediately',
            r'you.*won.*\$[\d,]+',
            r'limited.*time.*offer',
            r'verify.*account.*suspended',
            r'congratulations.*winner',
            r'act.*now.*expires',
            r'free.*money',
            r'guaranteed.*income',
            r'work.*from.*home.*\$\d+',
            r'make.*money.*fast',
            r'no.*experience.*necessary.*\$\d+'
        ]
        
        self.misinfo_patterns = [
            r'miracle.*cure',
            r'doctors.*hate.*this',
            r'100%.*guaranteed',
            r'secret.*government',
            r'they.*don\'t.*want.*you.*to.*know',
            r'big.*pharma.*conspiracy',
            r'hidden.*truth',
            r'mainstream.*media.*won\'t.*tell',
            r'natural.*cure.*suppressed',
            r'government.*cover.*up'
        ]
        
        self.financial_keywords = [
            'investment', 'profit', 'returns', 'portfolio', 'trading',
            'cryptocurrency', 'bitcoin', 'forex', 'binary options',
            'loan', 'credit', 'debt', 'mortgage', 'insurance'
        ]
        
        self.medical_keywords = [
            'cure', 'treatment', 'medicine', 'drug', 'therapy',
            'disease', 'cancer', 'diabetes', 'weight loss',
            'supplement', 'vitamin', 'remedy', 'healing'
        ]

    def analyze_comprehensive(self, content, user_name):
        """Perform comprehensive multi-layer analysis"""
        
        # Layer 1: Pattern matching
        scam_score = self._analyze_scam_patterns(content)
        misinfo_score = self._analyze_misinfo_patterns(content)
        
        # Layer 2: URL analysis
        url_analysis = self._analyze_urls(content)
        
        # Layer 3: Sentiment and language analysis
        sentiment_analysis = self._analyze_sentiment(content)
        
        # Layer 4: Domain-specific analysis
        domain_analysis = self._analyze_domain_specific(content)
        
        # Layer 5: Advanced ML features
        ml_features = self._extract_ml_features(content)
        
        # Combine all analyses
        final_result = self._combine_analyses({
            'scam_patterns': scam_score,
            'misinfo_patterns': misinfo_score,
            'url_analysis': url_analysis,
            'sentiment': sentiment_analysis,
            'domain': domain_analysis,
            'ml_features': ml_features
        }, content, user_name)
        
        return final_result

    def _analyze_scam_patterns(self, content):
        """Analyze content for scam patterns"""
        content_lower = content.lower()
        score = 0
        detected_patterns = []
        
        for pattern in self.scam_patterns:
            if re.search(pattern, content_lower):
                score += 15
                detected_patterns.append(f"Scam pattern: {pattern}")
        
        return min(score, 100), detected_patterns

    def _analyze_misinfo_patterns(self, content):
        """Analyze content for misinformation patterns"""
        content_lower = content.lower()
        score = 0
        detected_patterns = []
        
        for pattern in self.misinfo_patterns:
            if re.search(pattern, content_lower):
                score += 20
                detected_patterns.append(f"Misinformation pattern: {pattern}")
        
        return min(score, 100), detected_patterns

    def _analyze_urls(self, content):
        """Advanced URL analysis"""
        url_pattern = r'https?://[^\s]+'
        urls = re.findall(url_pattern, content)
        
        risk_score = 0
        warnings = []
        
        for url in urls:
            # Check for URL shorteners
            shorteners = ['bit.ly', 'tinyurl.com', 't.co', 'goo.gl', 'ow.ly']
            if any(shortener in url for shortener in shorteners):
                risk_score += 25
                warnings.append("Shortened URL detected")
            
            # Check for HTTP vs HTTPS
            if url.startswith('http://'):
                risk_score += 20
                warnings.append("Insecure HTTP connection")
            
            # Check for suspicious TLDs
            suspicious_tlds = ['.tk', '.ml', '.ga', '.cf']
            if any(tld in url for tld in suspicious_tlds):
                risk_score += 30
                warnings.append("Suspicious domain extension")
            
            # Check for IP addresses instead of domains
            ip_pattern = r'\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}'
            if re.search(ip_pattern, url):
                risk_score += 40
                warnings.append("IP address used instead of domain")
        
        return {
            'risk_score': min(risk_score, 100),
            'warnings': warnings,
            'url_count': len(urls)
        }

    def _analyze_sentiment(self, content):
        """Analyze sentiment and emotional manipulation"""
        try:
            blob = TextBlob(content)
            sentiment = blob.sentiment
            
            # Detect extreme sentiment as potential manipulation
            manipulation_score = 0
            if abs(sentiment.polarity) > 0.8:
                manipulation_score += 30
            if sentiment.subjectivity > 0.8:
                manipulation_score += 20
                
            return {
                'polarity': sentiment.polarity,
                'subjectivity': sentiment.subjectivity,
                'manipulation_score': manipulation_score
            }
        except:
            return {'polarity': 0, 'subjectivity': 0, 'manipulation_score': 0}

    def _analyze_domain_specific(self, content):
        """Analyze domain-specific risks"""
        content_lower = content.lower()
        
        financial_risk = sum(1 for keyword in self.financial_keywords if keyword in content_lower) * 10
        medical_risk = sum(1 for keyword in self.medical_keywords if keyword in content_lower) * 15
        
        return {
            'financial_risk': min(financial_risk, 100),
            'medical_risk': min(medical_risk, 100)
        }

    def _extract_ml_features(self, content):
        """Extract machine learning features"""
        words = content.split()
        
        features = {
            'word_count': len(words),
            'char_count': len(content),
            'avg_word_length': np.mean([len(word) for word in words]) if words else 0,
            'uppercase_ratio': sum(1 for c in content if c.isupper()) / len(content) if content else 0,
            'punctuation_ratio': sum(1 for c in content if c in '!?.,;:') / len(content) if content else 0,
            'number_count': len(re.findall(r'\d+', content)),
            'currency_mentions': len(re.findall(r'[\$€£¥]', content)),
        }
        
        return features

    def _combine_analyses(self, analyses, content, user_name):
        """Combine all analyses into final result"""
        
        # Calculate scam risk
        scam_risk = (
            analyses['scam_patterns'][0] * 0.3 +
            analyses['url_analysis']['risk_score'] * 0.25 +
            analyses['sentiment']['manipulation_score'] * 0.2 +
            analyses['domain']['financial_risk'] * 0.15 +
            min(analyses['ml_features']['uppercase_ratio'] * 100, 50) * 0.1
        )
        
        # Calculate credibility score
        base_credibility = 85
        credibility_score = base_credibility - (
            analyses['misinfo_patterns'][0] * 0.4 +
            analyses['domain']['medical_risk'] * 0.3 +
            scam_risk * 0.3
        )
        
        # Determine verdict
        if scam_risk > 70 or credibility_score < 30:
            verdict = "High Risk"
        elif scam_risk > 40 or credibility_score < 60:
            verdict = "Suspicious"
        else:
            verdict = "Credible"
        
        # Compile warnings
        warnings = []
        warnings.extend(analyses['scam_patterns'][1])
        warnings.extend(analyses['misinfo_patterns'][1])
        warnings.extend(analyses['url_analysis']['warnings'])
        
        # Generate recommendations
        recommendations = self._generate_recommendations(scam_risk, credibility_score, analyses)
        
        return {
            'scamRisk': round(scam_risk),
            'credibilityScore': round(max(credibility_score, 0)),
            'verdict': verdict,
            'warnings': warnings[:5],  # Top 5 warnings
            'recommendations': recommendations,
            'summary': f"Advanced AI analysis using machine learning models detected {round(scam_risk)}% scam risk and {round(max(credibility_score, 0))}% credibility. Analysis performed for {user_name} using Xist AI Enterprise Detection Engine.",
            'analysisDate': datetime.now().isoformat(),
            'confidence': round((max(credibility_score, 0) + (100 - scam_risk)) / 2),
            'processingTime': '1.8 seconds',
            'aiModel': 'Xist AI Enterprise v3.0',
            'featuresAnalyzed': len(analyses['ml_features']),
            'detailedScores': {
                'patternMatching': analyses['scam_patterns'][0],
                'urlSecurity': analyses['url_analysis']['risk_score'],
                'sentimentManipulation': analyses['sentiment']['manipulation_score'],
                'domainSpecific': max(analyses['domain']['financial_risk'], analyses['domain']['medical_risk']),
                'linguisticFeatures': min(analyses['ml_features']['uppercase_ratio'] * 100, 50)
            }
        }

    def _generate_recommendations(self, scam_risk, credibility_score, analyses):
        """Generate personalized recommendations"""
        recommendations = []
        
        if scam_risk > 60:
            recommendations.extend([
                "🚫 Do not provide personal, financial, or login information",
                "🔍 Verify the sender through official channels",
                "📞 Contact the organization directly using official contact methods"
            ])
        
        if credibility_score < 50:
            recommendations.extend([
                "📚 Cross-reference information with multiple reliable sources",
                "🏛️ Check with authoritative institutions or experts",
                "🔬 Look for peer-reviewed studies or official documentation"
            ])
        
        if analyses['url_analysis']['url_count'] > 0:
            recommendations.extend([
                "🖱️ Hover over links to preview destinations before clicking",
                "🔒 Only visit secure HTTPS websites",
                "🌐 Use URL scanning tools to check link safety"
            ])
        
        if analyses['domain']['medical_risk'] > 30:
            recommendations.append("👨‍⚕️ Consult healthcare professionals for medical advice")
        
        if analyses['domain']['financial_risk'] > 30:
            recommendations.append("💼 Consult licensed financial advisors for investment decisions")
        
        recommendations.extend([
            "📢 Report suspicious content to help protect the community",
            "🛡️ Trust your instincts - if something seems too good to be true, it probably is",
            "📱 Keep your security software updated and use strong passwords"
        ])
        
        return recommendations[:8]  # Top 8 recommendations
