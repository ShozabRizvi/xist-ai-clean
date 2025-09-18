class AIScanner {
  constructor() {
    this.apiKey = process.env.REACT_APP_OPENROUTER_API_KEY;
    this.baseURL = 'https://openrouter.ai/api/v1/chat/completions';
    this.model = 'deepseek/deepseek-r1';
  }

  // URL SCANNING
  async scanURL(url) {
    try {
      const response = await this.analyzeContent({
        type: 'url',
        content: url,
        prompt: `Analyze this URL for potential security threats, malware, phishing, or suspicious content: ${url}
        
        Provide analysis in this JSON format:
        {
          "threat_detected": boolean,
          "threat_level": "low|medium|high|critical",
          "threat_types": ["phishing", "malware", "suspicious"],
          "confidence_score": 0-100,
          "risk_assessment": "string",
          "recommendations": ["action1", "action2"],
          "safe_to_visit": boolean,
          "details": "explanation"
        }`
      });

      return this.processResponse(response);
    } catch (error) {
      console.error('URL scan error:', error);
      throw new Error('Failed to scan URL');
    }
  }

  // IMAGE SCANNING
  async scanImage(imageFile) {
    try {
      const base64Image = await this.fileToBase64(imageFile);
      
      const response = await this.analyzeContent({
        type: 'image',
        content: base64Image,
        prompt: `Analyze this image for potential threats, inappropriate content, malware signatures, or suspicious elements.
        
        Check for:
        - Malicious QR codes
        - Suspicious text content
        - Inappropriate imagery
        - Phishing attempts
        - Social engineering
        
        Respond in JSON format with threat analysis.`
      });

      return this.processResponse(response);
    } catch (error) {
      console.error('Image scan error:', error);
      throw new Error('Failed to scan image');
    }
  }

  // DOCUMENT SCANNING
  async scanDocument(documentFile) {
    try {
      const text = await this.extractTextFromDocument(documentFile);
      
      return await this.scanText(text, {
        source: 'document',
        filename: documentFile.name,
        fileType: documentFile.type
      });
    } catch (error) {
      console.error('Document scan error:', error);
      throw new Error('Failed to scan document');
    }
  }

  // TEXT SCANNING
  async scanText(text, metadata = {}) {
    try {
      const response = await this.analyzeContent({
        type: 'text',
        content: text,
        metadata,
        prompt: `Analyze this text content for potential threats, misinformation, hate speech, or malicious content:

        "${text}"
        
        Analyze for:
        - Misinformation/fake news
        - Hate speech
        - Scams/fraud
        - Social engineering
        - Malicious instructions
        - Inappropriate content
        
        Provide detailed JSON analysis with threat assessment.`
      });

      return this.processResponse(response);
    } catch (error) {
      console.error('Text scan error:', error);
      throw new Error('Failed to scan text');
    }
  }

  // OCR SCANNING
  async scanOCR(imageFile) {
    try {
      // Extract text using OCR
      const extractedText = await this.performOCR(imageFile);
      
      if (!extractedText.trim()) {
        return {
          success: false,
          error: 'No text detected in image'
        };
      }

      // Analyze extracted text
      const textAnalysis = await this.scanText(extractedText, {
        source: 'ocr',
        originalType: 'image'
      });

      return {
        ...textAnalysis,
        extractedText,
        ocrConfidence: 0.95 // Mock confidence score
      };
    } catch (error) {
      console.error('OCR scan error:', error);
      throw new Error('Failed to perform OCR scan');
    }
  }

  // CAMERA SCANNING
  async scanCamera(imageBlob) {
    try {
      const file = new File([imageBlob], 'camera-capture.jpg', { type: 'image/jpeg' });
      return await this.scanImage(file);
    } catch (error) {
      console.error('Camera scan error:', error);
      throw new Error('Failed to scan camera image');
    }
  }

  // CORE AI ANALYSIS
  async analyzeContent({ type, content, prompt, metadata = {} }) {
    const requestBody = {
      model: this.model,
      messages: [
        {
          role: 'system',
          content: 'You are an advanced AI security analyst specializing in threat detection, misinformation identification, and content safety analysis. Always respond with accurate JSON format.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      max_tokens: 1000,
      temperature: 0.1
    };

    const response = await fetch(this.baseURL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': window.location.origin,
        'X-Title': 'Xist AI Scanner'
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.statusText}`);
    }

    return await response.json();
  }

  // HELPER METHODS
  processResponse(apiResponse) {
    try {
      const content = apiResponse.choices[0]?.message?.content;
      if (!content) throw new Error('No response content');

      // Try to extract JSON from response
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      const analysisData = jsonMatch ? JSON.parse(jsonMatch[0]) : {};

      return {
        success: true,
        timestamp: new Date().toISOString(),
        analysis: {
          threatDetected: analysisData.threat_detected || false,
          threatLevel: analysisData.threat_level || 'low',
          threatTypes: analysisData.threat_types || [],
          confidenceScore: analysisData.confidence_score || 0,
          riskAssessment: analysisData.risk_assessment || 'Analysis completed',
          recommendations: analysisData.recommendations || [],
          safeToVisit: analysisData.safe_to_visit !== false,
          details: analysisData.details || content
        },
        rawResponse: content
      };
    } catch (error) {
      console.error('Response processing error:', error);
      return {
        success: false,
        error: 'Failed to process analysis results',
        rawResponse: apiResponse.choices[0]?.message?.content || 'No response'
      };
    }
  }

  fileToBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  }

  async extractTextFromDocument(file) {
    // Mock document text extraction - in real app, use PDF.js or similar
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        // For demo, just use filename + basic content
        resolve(`Document: ${file.name}\nContent analysis pending...`);
      };
      reader.readAsText(file);
    });
  }

  async performOCR(imageFile) {
    // Mock OCR - in real app, integrate with Tesseract.js or Cloud Vision API
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve("Sample extracted text from image OCR analysis");
      }, 2000);
    });
  }
}

export default new AIScanner();
