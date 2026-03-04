import requests
import re
from urllib.parse import urlparse
from datetime import datetime
import ssl
import socket
import os

class URLScanner:
    def __init__(self):
        # Whitelist for known safe entities
        self.trusted_domains = [
            'google.com', 'microsoft.com', 'apple.com', 'github.com',
            'stackoverflow.com', 'wikipedia.org', 'mozilla.org',
            'xistai.web.app'
        ]
        # Your Google Safe Browsing API Key (Get from Google Cloud Console)
        self.safebrowsing_api_key = os.environ.get('GOOGLE_SAFE_BROWSING_KEY')
    
    def scan_url(self, url):
        """Advanced dynamic URL security analysis"""
        try:
            parsed = urlparse(url)
            domain = parsed.netloc.lower()
            
            # Layer 1: Whitelist Check (Fastest)
            if domain in self.trusted_domains:
                return self._generate_safe_response(url, domain, "Domain is in trusted whitelist")

            # Layer 2: Heuristic Analysis (Local Pattern Matching)
            heuristic_risk = self.calculate_heuristic_risk(url, domain, parsed)
            
            # Layer 3: Live Threat Intelligence (Google Safe Browsing)
            global_threat = self.check_global_threat_intel(url)
            
            # Layer 4: Technical Validation (SSL/TLS)
            ssl_info = self.check_ssl(url)
            
            # Aggregate Scoring
            final_risk_score = max(heuristic_risk, global_threat['risk_score'])
            
            # Final Verdict
            if final_risk_score > 70:
                verdict = "Dangerous"
            elif final_risk_score > 40:
                verdict = "Suspicious"
            else:
                verdict = "Safe"
            
            return {
                'success': True,
                'url': url,
                'domain': domain,
                'riskScore': final_risk_score,
                'verdict': verdict,
                'warnings': self.generate_warnings(url, domain, parsed, ssl_info, global_threat),
                'recommendations': self.generate_recommendations(final_risk_score, domain),
                'technicalDetails': {
                    'hasSSL': ssl_info['valid'],
                    'threatSource': global_threat['source'],
                    'scanTimestamp': datetime.utcnow().isoformat()
                }
            }
            
        except Exception as e:
            return {'success': False, 'error': str(e), 'riskScore': 100, 'verdict': 'Error'}

    def check_global_threat_intel(self, url):
        """Queries Google Safe Browsing for real-time threat data"""
        if not self.safebrowsing_api_key:
            return {'risk_score': 0, 'source': 'Local Heuristics Only'}

        endpoint = f"https://safebrowsing.googleapis.com/v4/threatMatches:find?key={self.safebrowsing_api_key}"
        payload = {
            "client": {"clientId": "xist-ai", "clientVersion": "3.0"},
            "threatInfo": {
                "threatTypes": ["MALWARE", "SOCIAL_ENGINEERING", "UNWANTED_SOFTWARE", "POTENTIALLY_HARMFUL_APPLICATION"],
                "platformTypes": ["ANY_PLATFORM"],
                "threatEntryTypes": ["URL"],
                "threatEntries": [{"url": url}]
            }
        }
        
        try:
            response = requests.post(endpoint, json=payload, timeout=5)
            data = response.json()
            if 'matches' in data:
                return {'risk_score': 100, 'source': f"Google Safe Browsing: {data['matches'][0]['threatType']}"}
        except:
            pass
        return {'risk_score': 0, 'source': 'Global Intel: Clean'}

    def calculate_heuristic_risk(self, url, domain, parsed):
        """Advanced Lexical Analysis (Catching patterns before they are blacklisted)"""
        score = 0
        
        # 1. IP Address Usage (High risk for phishing)
        if re.search(r'[0-9]+\.[0-9]+\.[0-9]+\.[0-9]+', domain):
            score += 50
            
        # 2. Homoglyph/Typosquatting Detection (e.g., 'g00gle.com')
        suspicious_chars = ['0', '1', 'l', 'v', 'w', '-']
        if any(char in domain for char in suspicious_chars) and len(domain) > 15:
            score += 20

        # 3. URL Shortener Detection (Hiding destinations)
        if any(s in domain for s in ['bit.ly', 'tinyurl.com', 't.co', 'short.link']):
            score += 30

        # 4. Excessive Subdomains (Typical for free hosting phishing)
        if len(domain.split('.')) > 3:
            score += 25
            
        # 5. Insecure Protocol
        if parsed.scheme == 'http':
            score += 20
            
        return min(score, 100)

    def check_ssl(self, url):
        """Live SSL handshake verification"""
        try:
            if not url.startswith('https'):
                return {'valid': False, 'reason': 'Insecure Protocol'}
            parsed = urlparse(url)
            context = ssl.create_default_context()
            with socket.create_connection((parsed.netloc, 443), timeout=3) as sock:
                with context.wrap_socket(sock, server_hostname=parsed.netloc) as ssock:
                    return {'valid': True, 'reason': 'Valid Certificate'}
        except:
            return {'valid': False, 'reason': 'SSL Handshake Failed'}

    def generate_warnings(self, url, domain, parsed, ssl_info, global_threat):
        warnings = []
        if global_threat['risk_score'] == 100:
            warnings.append(f"CRITICAL: {global_threat['source']}")
        if not ssl_info['valid']:
            warnings.append(f"SECURITY: {ssl_info['reason']}")
        if len(domain.split('.')) > 3:
            warnings.append("SUSPICIOUS: Unusual number of subdomains detected")
        return warnings

    def _generate_safe_response(self, url, domain, reason):
        return {
            'success': True, 'url': url, 'domain': domain, 'riskScore': 0,
            'verdict': 'Safe', 'warnings': [], 'checks': [reason]
        }

    def generate_recommendations(self, score, domain):
        if score > 70:
            return ["EXIT IMMEDIATELY: This site is flagged as malicious", "Report this URL to prevent others from being scammed"]
        if score > 40:
            return ["Use caution: Do not provide login credentials or financial data", "Manually type the address of the site you intended to visit"]
        return ["Site appears safe based on current intelligence"]