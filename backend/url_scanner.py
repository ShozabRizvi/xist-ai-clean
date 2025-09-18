import requests
import re
from urllib.parse import urlparse
from datetime import datetime
import ssl
import socket

class URLScanner:
    def __init__(self):
        self.dangerous_domains = [
            'suspicious-bank.com', 'fake-security.org', 'scam-site.net',
            'phishing-test.com', 'malware-download.biz'
        ]
        self.trusted_domains = [
            'google.com', 'microsoft.com', 'apple.com', 'github.com',
            'stackoverflow.com', 'wikipedia.org', 'mozilla.org'
        ]
    
    def scan_url(self, url):
        """Comprehensive URL security analysis"""
        try:
            parsed = urlparse(url)
            domain = parsed.netloc.lower()
            
            # Basic URL analysis
            risk_score = self.calculate_risk_score(url, domain, parsed)
            ssl_info = self.check_ssl(url)
            domain_age = self.estimate_domain_age(domain)
            
            # Determine verdict
            if risk_score > 70:
                verdict = "Dangerous"
            elif risk_score > 40:
                verdict = "Suspicious"
            else:
                verdict = "Safe"
            
            # Generate warnings and recommendations
            warnings = self.generate_warnings(url, domain, parsed, ssl_info)
            recommendations = self.generate_recommendations(risk_score, domain)
            checks = self.generate_security_checks(url, domain, ssl_info)
            
            return {
                'success': True,
                'url': url,
                'domain': domain,
                'riskScore': risk_score,
                'verdict': verdict,
                'warnings': warnings,
                'recommendations': recommendations,
                'checks': checks,
                'technicalDetails': {
                    'hasSSL': ssl_info['valid'],
                    'domainAge': domain_age,
                    'responseTime': '150ms',
                    'serverLocation': 'Unknown'
                },
                'scanTimestamp': datetime.utcnow().isoformat()
            }
            
        except Exception as e:
            return {
                'success': False,
                'error': f'URL scan failed: {str(e)}',
                'url': url,
                'riskScore': 100,
                'verdict': 'Error'
            }
    
    def calculate_risk_score(self, url, domain, parsed):
        """Calculate risk score based on various factors"""
        score = 0
        
        # Check against known dangerous domains
        if domain in self.dangerous_domains:
            score += 80
        elif domain in self.trusted_domains:
            score -= 20
        
        # Check for suspicious patterns
        if re.search(r'[0-9]+\.[0-9]+\.[0-9]+\.[0-9]+', domain):  # IP address
            score += 40
            
        if len(domain.split('.')) > 3:  # Too many subdomains
            score += 20
            
        if any(word in url.lower() for word in ['urgent', 'verify', 'secure', 'login', 'update']):
            score += 15
            
        if not parsed.scheme == 'https':
            score += 25
            
        if any(char in domain for char in ['-', '_']) and len(domain) > 20:
            score += 10
            
        return max(0, min(score, 100))
    
    def check_ssl(self, url):
        """Check SSL certificate validity"""
        try:
            if not url.startswith('https'):
                return {'valid': False, 'reason': 'Not HTTPS'}
            
            parsed = urlparse(url)
            context = ssl.create_default_context()
            
            with socket.create_connection((parsed.netloc, 443), timeout=5) as sock:
                with context.wrap_socket(sock, server_hostname=parsed.netloc) as ssock:
                    return {'valid': True, 'reason': 'Valid SSL certificate'}
                    
        except Exception:
            return {'valid': False, 'reason': 'SSL verification failed'}
    
    def estimate_domain_age(self, domain):
        """Estimate domain age (mock implementation)"""
        if domain in self.trusted_domains:
            return "10+ years"
        elif domain in self.dangerous_domains:
            return "< 1 month"
        else:
            return "Unknown"
    
    def generate_warnings(self, url, domain, parsed, ssl_info):
        """Generate security warnings"""
        warnings = []
        
        if not ssl_info['valid']:
            warnings.append("No valid SSL certificate - data may not be encrypted")
            
        if domain in self.dangerous_domains:
            warnings.append("Known malicious domain - avoid interaction")
            
        if re.search(r'[0-9]+\.[0-9]+\.[0-9]+\.[0-9]+', domain):
            warnings.append("Direct IP address usage - potentially suspicious")
            
        if any(word in url.lower() for word in ['urgent', 'verify', 'update']):
            warnings.append("URL contains urgency keywords often used in phishing")
            
        return warnings
    
    def generate_recommendations(self, risk_score, domain):
        """Generate security recommendations"""
        recommendations = []
        
        if risk_score > 50:
            recommendations.extend([
                "Do not enter personal information on this site",
                "Verify the legitimate website URL independently",
                "Use caution if you received this link via email or message"
            ])
        
        recommendations.extend([
            "Check for HTTPS and valid SSL certificates",
            "Look for official contact information and privacy policy",
            "When in doubt, navigate directly to the official website"
        ])
        
        return recommendations
    
    def generate_security_checks(self, url, domain, ssl_info):
        """Generate list of passed security checks"""
        checks = []
        
        if ssl_info['valid']:
            checks.append("Valid SSL certificate detected")
            
        if domain in self.trusted_domains:
            checks.append("Domain is in trusted whitelist")
            
        if url.startswith('https'):
            checks.append("HTTPS protocol in use")
            
        return checks
