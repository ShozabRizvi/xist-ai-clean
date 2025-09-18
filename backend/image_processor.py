import base64
import re
from datetime import datetime
import json
import requests
from io import BytesIO
from PIL import Image

class ImageProcessor:
    def __init__(self):
        self.supported_formats = ['JPEG', 'JPG', 'PNG', 'WebP', 'BMP', 'TIFF']
        
    def process_image(self, image_data):
        """Process image with OCR and threat detection"""
        try:
            # Parse base64 image
            if image_data.startswith('data:image'):
                image_data = image_data.split(',')[1]
            
            # Decode image
            img_bytes = base64.b64decode(image_data)
            img = Image.open(BytesIO(img_bytes))
            
            # Simulate OCR processing
            extracted_text = self.simulate_ocr(img)
            
            # Quick threat analysis
            analysis = self.analyze_extracted_content(extracted_text)
            
            return {
                'success': True,
                'extractedText': extracted_text,
                'confidence': 85.0,
                'processingTime': 1200,  # milliseconds
                'imageFormat': img.format,
                'imageDimensions': f"{img.width}x{img.height}",
                'analysis': analysis
            }
            
        except Exception as e:
            return {
                'success': False,
                'error': f'Image processing failed: {str(e)}',
                'extractedText': '',
                'confidence': 0
            }
    
    def simulate_ocr(self, img):
        """Simulate OCR text extraction"""
        # In production, integrate with Tesseract.js or cloud OCR APIs
        sample_texts = [
            "URGENT: Your account will be suspended unless you verify immediately! Click here: https://suspicious-bank.com/verify?id=12345",
            "Congratulations! You've won $10,000! Claim now at: winner-claim.net/prize",
            "Your payment of $299.99 is due immediately. Avoid late fees: pay-now-secure.com",
            "Security Alert: Unusual activity detected. Verify your identity: security-check.org/login",
            "Limited time offer! Make $5000 per week working from home. Join now: make-money-fast.biz"
        ]
        
        # Return random sample for demo
        import random
        return random.choice(sample_texts)
    
    def analyze_extracted_content(self, text):
        """Basic threat analysis of extracted text"""
        risk_score = 0
        threats_found = []
        
        # Check for suspicious patterns
        suspicious_patterns = {
            'urgent_action': r'urgent|immediate|suspend|expire|act now',
            'financial_threats': r'\$\d+|payment|due|claim|prize|winner',
            'suspicious_links': r'http[s]?://[^\s]+',
            'verification_requests': r'verify|confirm|update|account|login',
            'fear_tactics': r'suspend|block|close|penalty|fine|legal'
        }
        
        text_lower = text.lower()
        
        for threat_type, pattern in suspicious_patterns.items():
            if re.search(pattern, text_lower):
                risk_score += 20
                threats_found.append(threat_type.replace('_', ' ').title())
        
        # Determine verdict
        if risk_score > 60:
            verdict = "High Risk"
        elif risk_score > 30:
            verdict = "Suspicious"
        else:
            verdict = "Low Risk"
        
        return {
            'riskScore': min(risk_score, 100),
            'verdict': verdict,
            'threatsFound': threats_found
        }
