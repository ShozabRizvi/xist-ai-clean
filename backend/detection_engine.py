import re
import requests
from datetime import datetime

class AdvancedDetectionEngine:
    def __init__(self):
        self.scam_patterns = [
            r'urgent.*action.*required', r'click.*here.*immediately',
            r'you.*won.*\$[\d,]+', r'limited.*time.*offer',
            r'verify.*account.*suspended', r'congratulations.*winner',
            r'act.*now.*expires', r'free.*money', r'guaranteed.*income',
            r'work.*from.*home.*\$\d+', r'make.*money.*fast'
        ]
        
        self.misinfo_patterns = [
            r'miracle.*cure', r'doctors.*hate.*this', r'100%.*guaranteed',
            r'secret.*government', r'they.*don\'t.*want.*you.*to.*know',
            r'big.*pharma.*conspiracy', r'hidden.*truth',
            r'mainstream.*media.*won\'t.*tell', r'government.*cover.*up'
        ]
        
        self.financial_keywords = ['investment', 'profit', 'returns', 'crypto', 'bitcoin', 'loan']
        self.medical_keywords = ['cure', 'treatment', 'medicine', 'disease', 'cancer', 'weight loss']

    def analyze_comprehensive(self, content, user_name):
        scam_score, scam_flags = self._analyze_patterns(content, self.scam_patterns, 15)
        misinfo_score, misinfo_flags = self._analyze_patterns(content, self.misinfo_patterns, 20)
        url_analysis = self._analyze_urls(content)
        domain_analysis = self._analyze_domain_specific(content)
        linguistic_features = self._extract_features(content)
        
        scam_risk = (
            scam_score * 0.3 +
            url_analysis['risk_score'] * 0.3 +
            domain_analysis['financial_risk'] * 0.2 +
            linguistic_features['manipulation_score'] * 0.2
        )
        
        credibility_score = 85 - (misinfo_score * 0.4 + domain_analysis['medical_risk'] * 0.3 + scam_risk * 0.3)
        
        if scam_risk > 70 or credibility_score < 30:
            verdict = "High Risk"
        elif scam_risk > 40 or credibility_score < 60:
            verdict = "Suspicious"
        else:
            verdict = "Credible"
            
        warnings = scam_flags + misinfo_flags + url_analysis['warnings']
        
        return {
            'scamRisk': round(min(100, scam_risk)),
            'credibilityScore': round(max(0, credibility_score)),
            'verdict': verdict,
            'warnings': warnings[:5],
            'recommendations': ["Verify through official channels", "Do not share personal info", "Check for HTTPS on links"],
            'summary': f"Heuristic analysis detected {round(min(100, scam_risk))}% scam risk based on text patterns and URLs.",
            'analysisDate': datetime.now().isoformat(),
            'aiModel': 'Xist AI Fast Heuristics v1.0'
        }

    def _analyze_patterns(self, content, patterns, weight):
        score = 0
        flags = []
        content_lower = content.lower()
        for pattern in patterns:
            if re.search(pattern, content_lower):
                score += weight
                flags.append(f"Pattern detected: {pattern.replace('.*', ' ')}")
        return min(score, 100), flags

    def _analyze_urls(self, content):
        urls = re.findall(r'https?://[^\s]+', content)
        risk_score = 0
        warnings = []
        for url in urls:
            if any(s in url for s in ['bit.ly', 'tinyurl.com', 't.co']):
                risk_score += 25
                warnings.append("Shortened URL detected")
            if url.startswith('http://'):
                risk_score += 20
                warnings.append("Insecure HTTP connection")
        return {'risk_score': min(risk_score, 100), 'warnings': warnings, 'url_count': len(urls)}

    def _analyze_domain_specific(self, content):
        content_lower = content.lower()
        fin_risk = sum(1 for k in self.financial_keywords if k in content_lower) * 10
        med_risk = sum(1 for k in self.medical_keywords if k in content_lower) * 15
        return {'financial_risk': min(fin_risk, 100), 'medical_risk': min(med_risk, 100)}

    def _extract_features(self, content):
        # Pure Python replacement for ML feature extraction
        caps_ratio = sum(1 for c in content if c.isupper()) / max(len(content), 1)
        exclamation_count = content.count('!')
        manipulation = min((caps_ratio * 100) + (exclamation_count * 5), 100)
        return {'manipulation_score': manipulation}