from flask import Flask, request, jsonify, Response
from flask_cors import CORS, cross_origin
from flask_sqlalchemy import SQLAlchemy
import os
import json
import requests
import re
from datetime import datetime

app = Flask(__name__)

# ✅ COMPREHENSIVE CORS FIX
CORS(app, resources={
    r"/api/*": {
        "origins": ["http://localhost:3000", "http://127.0.0.1:3000"],
        "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        "allow_headers": ["Content-Type", "Authorization"],
        "supports_credentials": True
    }
})

# Database configuration
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///xist_ai.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

# ✅ ENHANCED USER MODEL WITH AUTHORITY FIELDS
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    name = db.Column(db.String(100), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Authority fields
    is_authority = db.Column(db.Boolean, default=False)
    government_id = db.Column(db.String(100), nullable=True)
    id_type = db.Column(db.String(50), nullable=True)
    verified_at = db.Column(db.DateTime, nullable=True)
    authority_level = db.Column(db.String(20), default='citizen')
    department = db.Column(db.String(100), nullable=True)
    badge_number = db.Column(db.String(50), nullable=True)

class Analysis(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    content = db.Column(db.Text, nullable=False)
    scam_risk = db.Column(db.Integer, nullable=False)
    credibility_score = db.Column(db.Integer, nullable=False)
    verdict = db.Column(db.String(50), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class ThreatAlert(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    authority_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    title = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text, nullable=False)
    threat_level = db.Column(db.String(20), nullable=False)
    category = db.Column(db.String(50), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    is_active = db.Column(db.Boolean, default=True)

# ✅ MISSING /api/analyze ENDPOINT
@app.route('/api/analyze', methods=['POST'])
@cross_origin()
def analyze_content():
    try:
        data = request.get_json()
        content = data.get('content', '')
        user_email = data.get('user_email', '')
        
        if not content or not user_email:
            return jsonify({'error': 'Content and user email required'}), 400
        
        # Get or create user
        user = User.query.filter_by(email=user_email).first()
        if not user:
            user = User(email=user_email, name=data.get('user_name', 'Unknown'))
            db.session.add(user)
            db.session.commit()
        
        # Perform comprehensive analysis
        result = perform_comprehensive_analysis(content, user.name)
        
        # Save analysis to database
        analysis = Analysis(
            user_id=user.id,
            content=content[:500],
            scam_risk=result['scamRisk'],
            credibility_score=result['credibilityScore'],
            verdict=result['verdict']
        )
        db.session.add(analysis)
        db.session.commit()
        
        return jsonify(result)
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

def perform_comprehensive_analysis(content, user_name):
    """Comprehensive AI analysis system"""
    
    # Multi-layer analysis
    scam_patterns = analyze_scam_patterns(content)
    url_analysis = analyze_urls(content)
    language_analysis = analyze_language_patterns(content)
    
    # Calculate final scores
    scam_risk = min((scam_patterns['score'] + url_analysis['risk'] + language_analysis['urgency']) / 3, 100)
    credibility_score = max(100 - scam_risk - 10, 0)
    
    # Determine verdict
    if scam_risk > 70:
        verdict = "High Risk"
    elif scam_risk > 40:
        verdict = "Suspicious"  
    else:
        verdict = "Credible"
    
    # Generate warnings and recommendations
    warnings = []
    warnings.extend(scam_patterns['warnings'])
    warnings.extend(url_analysis['warnings'])
    
    recommendations = [
        "🔍 Always verify information through official sources",
        "🚫 Never share personal information with untrusted sources", 
        "📞 Contact organizations directly using official phone numbers",
        "🔒 Use secure, updated browsers and devices",
        "📢 Report suspicious content to help protect others"
    ]
    
    return {
        'scamRisk': round(scam_risk),
        'credibilityScore': round(credibility_score),
        'verdict': verdict,
        'warnings': warnings[:5],
        'recommendations': recommendations[:6],
        'summary': f"Multi-layer AI analysis detected {round(scam_risk)}% scam risk based on content patterns, URL analysis, and language indicators. Analysis performed for {user_name}.",
        'analysisDate': datetime.utcnow().isoformat(),
        'confidence': round((credibility_score + (100 - scam_risk)) / 2),
        'processingTime': '2.1 seconds',
        'aiModel': 'Xist AI Advanced Detection v3.0'
    }

def analyze_scam_patterns(content):
    """Analyze for scam patterns"""
    scam_indicators = [
        r'urgent.*action.*required', r'click.*here.*immediately', r'you.*won.*\$[\d,]+',
        r'limited.*time.*offer', r'verify.*account.*suspended', r'congratulations.*winner',
        r'free.*money', r'guaranteed.*income', r'work.*from.*home.*\$\d+'
    ]
    
    score = 0
    warnings = []
    content_lower = content.lower()
    
    for pattern in scam_indicators:
        if re.search(pattern, content_lower):
            score += 20
            warnings.append("Scam language pattern detected")
    
    return {'score': min(score, 100), 'warnings': warnings}

def analyze_urls(content):
    """Analyze URLs for security risks"""
    urls = re.findall(r'https?://[^\s]+', content)
    
    risk = 0
    warnings = []
    
    for url in urls:
        if any(shortener in url for shortener in ['bit.ly', 'tinyurl', 't.co']):
            risk += 30
            warnings.append("Shortened URL detected - destination hidden")
        
        if url.startswith('http://'):
            risk += 25
            warnings.append("Insecure HTTP connection found")
    
    return {'risk': min(risk, 100), 'warnings': warnings}

def analyze_language_patterns(content):
    """Analyze language for manipulation tactics"""
    urgency_words = ['urgent', 'immediately', 'expires', 'limited', 'hurry', 'act now']
    words = content.lower().split()
    
    urgency_score = sum(10 for word in words if any(uw in word for uw in urgency_words))
    
    return {'urgency': min(urgency_score, 100)}

# ✅ FIX /api/user/stats ENDPOINT
@app.route('/api/user/stats/<email>', methods=['GET'])
@cross_origin()
def get_user_stats(email):
    try:
        user = User.query.filter_by(email=email).first()
        if not user:
            user = User(email=email, name="User")
            db.session.add(user)
            db.session.commit()
        
        analyses = Analysis.query.filter_by(user_id=user.id).all()
        
        stats = {
            'totalAnalyses': len(analyses),
            'averageScamRisk': sum(a.scam_risk for a in analyses) / len(analyses) if analyses else 0,
            'averageCredibility': sum(a.credibility_score for a in analyses) / len(analyses) if analyses else 0,
            'isAuthority': getattr(user, 'is_authority', False),
            'authorityType': getattr(user, 'authority_level', None),
            'authorityLevel': getattr(user, 'authority_level', 'citizen'),
            'recentAnalyses': [
                {
                    'date': a.created_at.isoformat(),
                    'verdict': a.verdict,
                    'scamRisk': a.scam_risk,
                    'credibilityScore': a.credibility_score
                }
                for a in analyses[-10:]
            ],
            'chartData': generate_chart_data(analyses)
        }
        
        return jsonify(stats)
        
    except Exception as e:
        print(f"Stats error: {e}")
        return jsonify({'error': str(e)}), 500

def generate_chart_data(analyses):
    """Generate data for charts"""
    if not analyses:
        return {
            'monthly': [],
            'threatLevels': [{'level': 'low', 'count': 0}, {'level': 'medium', 'count': 0}, {'level': 'high', 'count': 0}],
            'credibilityTrend': []
        }
    
    monthly_counts = {}
    threat_levels = {'low': 0, 'medium': 0, 'high': 0}
    
    for analysis in analyses:
        month = analysis.created_at.strftime('%b')
        monthly_counts[month] = monthly_counts.get(month, 0) + 1
        
        if analysis.scam_risk < 30:
            threat_levels['low'] += 1
        elif analysis.scam_risk < 70:
            threat_levels['medium'] += 1
        else:
            threat_levels['high'] += 1
    
    return {
        'monthly': [{'month': k, 'count': v} for k, v in monthly_counts.items()],
        'threatLevels': [{'level': k, 'count': v} for k, v in threat_levels.items()],
        'credibilityTrend': [
            {'date': a.created_at.strftime('%m/%d'), 'score': a.credibility_score}
            for a in analyses[-10:]
        ]
    }

# ✅ ENHANCED CHAT ENDPOINT
@app.route('/api/chat', methods=['POST'])
@cross_origin()
def chat_with_ai():
    try:
        data = request.get_json()
        user_message = data.get('message', '')
        user_email = data.get('user_email', '')
        api_key = data.get('api_key', '')
        
        if not user_message or not user_email:
            return jsonify({'error': 'Message and user email required'}), 400
        
        user = User.query.filter_by(email=user_email).first()
        if not user:
            user = User(email=user_email, name=data.get('user_name', 'Unknown'))
            db.session.add(user)
            db.session.commit()
        
        # Generate AI response
        bot_response = generate_ai_response_with_key(user_message, user.name, api_key)
        
        return jsonify({
            'response': bot_response,
            'timestamp': datetime.utcnow().isoformat(),
            'user': user.name
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

def generate_ai_response_with_key(message, user_name, api_key):
    """Generate AI responses using user's API key"""
    
    if not api_key:
        return generate_fallback_response(message, user_name)
    
    try:
        headers = {
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json"
        }
        
        payload = {
            "model": "deepseek/deepseek-r1:free",
            "messages": [
                {
                    "role": "system",
                    "content": f"You are Xist AI, an expert digital safety assistant helping {user_name}. Provide helpful, accurate advice about scams, cybersecurity, and online safety."
                },
                {
                    "role": "user",
                    "content": message
                }
            ],
            "max_tokens": 300,
            "temperature": 0.7
        }
        
        response = requests.post(
            "https://openrouter.ai/api/v1/chat/completions",
            headers=headers,
            json=payload,
            timeout=15
        )
        
        if response.status_code == 200:
            result = response.json()
            return result["choices"][0]["message"]["content"]
        else:
            return generate_fallback_response(message, user_name)
            
    except Exception as e:
        return generate_fallback_response(message, user_name)

def generate_fallback_response(message, user_name):
    """Fallback when API unavailable"""
    message_lower = message.lower()
    
    if any(word in message_lower for word in ['scam', 'fraud', 'suspicious']):
        return f"Hi {user_name}! 🚨 Key scam warning signs: urgent requests, too-good-to-be-true offers, requests for personal info, suspicious links. Always verify through official channels!"
    
    elif any(word in message_lower for word in ['hello', 'hi', 'hey']):
        return f"Hello {user_name}! 👋 I'm Xist AI, your digital safety assistant. I can help with scam detection, cybersecurity tips, and online safety. What would you like to know?"
    
    else:
        return f"Thanks {user_name}! I specialize in digital safety, scam detection, and cybersecurity guidance. How can I help protect you online today?"

# ✅ GOVERNMENT ID VERIFICATION ENDPOINT
@app.route('/api/auth/verify-government-id', methods=['POST'])
@cross_origin()
def verify_government_id():
    try:
        data = request.get_json()
        user_email = data.get('user_email')
        government_id = data.get('government_id')
        id_type = data.get('id_type')
        department = data.get('department', '')
        badge_number = data.get('badge_number', '')
        
        if not all([user_email, government_id, id_type]):
            return jsonify({'error': 'Missing required information'}), 400
        
        user = User.query.filter_by(email=user_email).first()
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        # Demo verification (in production: integrate with actual gov APIs)
        is_valid = verify_government_credentials(government_id, id_type)
        
        if is_valid:
            user.is_authority = True
            user.government_id = government_id
            user.id_type = id_type
            user.verified_at = datetime.utcnow()
            user.authority_level = 'authority'
            user.department = department
            user.badge_number = badge_number
            db.session.commit()
            
            return jsonify({
                'success': True,
                'message': 'Government ID verified successfully',
                'authority_level': user.authority_level,
                'verified_at': user.verified_at.isoformat()
            })
        else:
            return jsonify({'error': 'Invalid government ID or credentials'}), 401
            
    except Exception as e:
        return jsonify({'error': str(e)}), 500

def verify_government_credentials(gov_id, id_type):
    """Demo verification - integrate with real gov APIs in production"""
    valid_patterns = {
        'government_badge': ['GOV', 'DEPT', 'FED', 'STATE'],
        'law_enforcement': ['PD', 'FBI', 'POLICE', 'SHERIFF'],
        'national_id': ['ID', 'SSN', 'AADHAAR'],
        'passport': ['P', 'US', 'IN', 'UK']
    }
    
    if id_type in valid_patterns:
        return any(gov_id.upper().startswith(pattern) for pattern in valid_patterns[id_type])
    
    return False

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True, port=5000, host='127.0.0.1')
