import os
import time
import json
import tempfile
import requests
from bs4 import BeautifulSoup
from flask import Flask, request, jsonify
from flask_cors import CORS, cross_origin
from dotenv import load_dotenv
from werkzeug.utils import secure_filename
import google.generativeai as genai
import PyPDF2

load_dotenv()
app = Flask(__name__)
CORS(app)

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
genai.configure(api_key=GEMINI_API_KEY)

# Force JSON output format
llm_model = genai.GenerativeModel('gemini-2.5-flash', generation_config={"response_mime_type": "application/json"})

def scrape_url(url):
    """Helper function to extract text from a webpage"""
    try:
        headers = {'User-Agent': 'Mozilla/5.0'}
        response = requests.get(url, headers=headers, timeout=10)
        soup = BeautifulSoup(response.text, 'html.parser')
        # Extract paragraph text and limit to 10,000 characters to save tokens
        paragraphs = soup.find_all('p')
        text = ' '.join([p.get_text() for p in paragraphs])
        return text[:10000] 
    except Exception as e:
        return f"Error scraping URL: {str(e)}"

@app.route('/api/analyze', methods=['POST'])
@cross_origin()
def analyze_content():
    temp_file_path = None
    media_file_for_gemini = None

    try:
        # 1. HANDLE BOTH JSON (Text/URL) AND FORM DATA (Files)
        if request.content_type.startswith('multipart/form-data'):
            mode = request.form.get('mode', 'text')
            content = request.form.get('text', '')
            uploaded_file = request.files.get('file')
        else:
            data = request.get_json()
            mode = data.get('mode', 'text')
            content = data.get('text') or data.get('content', '')
            uploaded_file = None

        if not content and not uploaded_file:
            return jsonify({'error': 'No content or file provided'}), 400

        # 2. PREPARE THE DATA FOR GEMINI
        analysis_input = content

        # Handle URL Mode
        if mode == 'url':
            print(f"🌍 Scraping URL: {content}")
            analysis_input = scrape_url(content)
            if not analysis_input.strip():
                return jsonify({'error': 'Could not extract text from this URL.'}), 400
        
        # Handle Document Mode (PDF, TXT)
        elif mode == 'document' and uploaded_file:
            print(f"📄 Processing uploaded document...")
            filename = secure_filename(uploaded_file.filename).lower()
            extracted_text = ""

            try:
                # Read PDF Files
                if filename.endswith('.pdf'):
                    pdf_reader = PyPDF2.PdfReader(uploaded_file)
                    for page in pdf_reader.pages:
                        text = page.extract_text()
                        if text:
                            extracted_text += text + "\n"
                
                # Read TXT Files
                elif filename.endswith('.txt'):
                    extracted_text = uploaded_file.read().decode('utf-8')
                
                else:
                    return jsonify({"error": "Unsupported document format. Please upload PDF or TXT."}), 400

                # Trick the AI: Change mode to 'text' and pass the extracted words!
                mode = 'text'
                analysis_input = extracted_text

            except Exception as e:
                print(f"Document parsing error: {str(e)}")
                return jsonify({"error": "Failed to extract text from document."}), 500
            
        # Handle Media Modes (Image, Video, Voice)
        # Handle Media Modes (Image, Video, Voice)
        elif mode in ['image', 'video', 'voice'] and uploaded_file:
            print(f"📁 Processing uploaded {mode} file...")
            
            # 🚨 FIX: Ensure Voice notes have an audio extension for Gemini API
            original_filename = secure_filename(uploaded_file.filename)
            if mode == 'voice' and not original_filename.lower().endswith(('.webm', '.wav', '.mp3')):
                filename = f"voice_capture_{int(time.time())}.webm"
            else:
                filename = original_filename

            temp_dir = tempfile.gettempdir()
            temp_file_path = os.path.join(temp_dir, filename)
            uploaded_file.save(temp_file_path)

            # Upload the file securely to Gemini's File API
            # Explicitly setting the mime_type helps Gemini skip the guessing stage
            mime_type = "audio/webm" if mode == 'voice' else None
            media_file_for_gemini = genai.upload_file(path=temp_file_path, mime_type=mime_type)
            
            print(f"⏳ Waiting for Gemini to process the {mode}...")
            
            # THE FINAL FIX: UPDATING THE FILE OBJECT
            while media_file_for_gemini.state.name == 'PROCESSING':
                print(".", end="", flush=True)
                time.sleep(2)
                # Overwrite the old file object with the newly updated one
                media_file_for_gemini = genai.get_file(media_file_for_gemini.name)
                
            if media_file_for_gemini.state.name == 'FAILED':
                # 🚨 DEBUG: Print why it failed in the console
                print(f"\n❌ Media processing failed in Gemini. State: {media_file_for_gemini.state}")
                return jsonify({"error": f"Gemini failed to process the {mode} file."}), 500
                
            print("\n✅ Media is ACTIVE and ready!")
            analysis_input = "Please analyze the attached media file."

        # 3. BUILD THE MULTIMODAL PROMPT
        if mode in ['image', 'video', 'voice']:
            prompt_instructions = f"""
            You are an elite, highly skeptical Digital Media Forensics Expert for 'Xist AI'. 
            Your SOLE directive is to forensically examine the attached {mode} and determine if it is authentic physical media or synthetically generated/manipulated (e.g., Midjourney, Sora, Deepfakes, Voice Cloning).
            
            CRITICAL FORENSIC VECTORS TO ANALYZE:
            1. Lighting & Physics: Are shadows perfectly aligned with light sources? Look for impossible reflections, HDR studio lighting in natural settings, or missing ambient occlusion.
            2. Micro-Anatomy: Zoom in on teeth, cuticles, hair strands, and fabric seams. Look for melting, unnatural blending, asymmetrical irises, or hyper-smoothed "plastic" skin.
            3. Structural Coherence: Are straight lines bending? Is background text legible or alien gibberish? Are distant background objects merging together like a watercolor painting?
            4. Temporal/Acoustic: For video, look for facial edge flickering or micro-jitter. For voice, listen for metallic artifacts, lack of natural breathing, or robotic cadences.
            
            TONE & STYLE RULES:
            - Write your explanation like a clinical, professional intelligence briefing.
            - NEVER use repetitive, generic openings like "This image received a score of..." or "Based on the analysis..."
            - Be hyper-specific. Name the EXACT visual or audio anomalies you found in this specific file. 
            - If it is authentic, explain specifically why the natural elements (lighting, breathing, physics) prove its authenticity. Do NOT assume it is real just because it looks high-quality.
            
            You MUST return ONLY a valid JSON object matching this exact structure:
            {{
                "credibility_score": <integer 0-100: 100=Authentic physical capture, 0=Blatant AI generation/Deepfake>,
                "overall_verdict": <string: MUST BE "SAFE", "QUESTIONABLE", or "CRITICAL">,
                "threat_category": <string: MUST BE "Deepfake", "Manipulated Media", or "Safe">,
                "emotional_intensity": 0,
                "bias_score": 0,
                "logical_consistency": <integer 0-100: Score low if physics/lighting/audio flow make no sense>,
                "explanation": "A highly specific, unique 3-4 sentence forensic explanation. Point out the EXACT artifacts or natural details you observed. Vary your sentence structure.",
                "sources": []
            }}
            """
        else:
            prompt_instructions = f"""
            You are an elite Threat Intelligence and Disinformation Analyst for 'Xist AI'. 
            Analyze the following {mode} input for semantic manipulation, factual accuracy, AI-generated text patterns, and deceptive intent.
            
            CRITICAL FORENSIC VECTORS TO ANALYZE:
            1. AI Text Fingerprints: Look for classic LLM markers (e.g., over-structuring, lack of human "burstiness", or heavy use of AI buzzwords like 'delve', 'tapestry', 'testament', 'navigating', 'crucial').
            2. Psychological Manipulation: Is the text engineered to trigger outrage, fear, or urgency? Does it use clickbait tactics to bypass rational thought?
            3. Logical Coherence: Does it make wild empirical claims without citations? Does it rely on strawman arguments, whataboutism, or false dichotomies?
            4. Intent Profiling: Is the underlying intent to inform, to scam, to polarize a community, or to push propaganda?
            
            TONE & STYLE RULES:
            - Write like a senior intelligence analyst. Maintain an objective, clinical, and authoritative tone.
            - NEVER use repetitive boilerplate phrases like "This text got a critical score because..."
            - Quote specific words, claims, or rhetorical tactics used in the text to justify your score. 
            - Ensure every explanation sounds uniquely tailored to the specific text provided. Act as a human lie detector.
            
            You MUST return ONLY a valid JSON object matching this exact structure:
            {{
                "credibility_score": <integer 0-100: 100=Factual/Verified, 0=Blatant Disinformation/Scam/AI Spam>,
                "overall_verdict": <string: MUST BE EXACTLY "SAFE", "QUESTIONABLE", or "CRITICAL">,
                "threat_category": <string: MUST BE "Misinformation", "Scam", "Malware Risk", or "Safe">,
                "emotional_intensity": <integer 0-100: High if text relies heavily on fear/anger/outrage>,
                "bias_score": <integer 0-100: High if heavily one-sided or propaganda>,
                "logical_consistency": <integer 0-100: High if arguments are sound and backed by evidence>,
                "explanation": "A highly specific, unique 3-4 sentence intelligence brief. Cite the exact deceptive phrasing or logical gaps you found. Vary your sentence structure.",
                "sources": [
                    {{
                        "source_name": "Name of real organization (e.g., Reuters, AP News, Snopes)",
                        "source_type": "Fact-Checking Authority",
                        "why_relevant": "Briefly state why this specific source is best suited to verify this exact claim."
                    }}
                ]
            }}
            """

        # Package the prompt and the file (if it exists) together
        if media_file_for_gemini:
            gemini_payload = [prompt_instructions, media_file_for_gemini]
        else:
            gemini_payload = [prompt_instructions, f"INPUT TEXT: {analysis_input}"]

        # 4. CALL GEMINI
        print(f"🤖 Sending {mode} data to Gemini...")
        gemini_response = llm_model.generate_content(gemini_payload)
        ai_data = json.loads(gemini_response.text)

        # 5. FORMAT RESPONSE FOR REACT
        prob_real = ai_data.get("credibility_score", 50)
        prob_fake = 100 - prob_real
        verdict = ai_data.get("overall_verdict", "QUESTIONABLE")

        structured_response = {
            "overall_verdict": verdict,
            "credibility_score": prob_real,
            "threat_category": ai_data.get("threat_category", "Misinformation"),
            "content_overview": {
                "content_type": mode.upper(),
                "primary_theme": f"AI {mode.capitalize()} Forensic Audit",
                "intent_assessment": "Manipulation/Deepfake Detected" if prob_fake > 50 else "Authentic Content"
            },
            "linguistic_patterns": {
                "emotional_intensity": ai_data.get("emotional_intensity", 50),
                "bias_indicator_score": ai_data.get("bias_score", 50),
                "sensationalism_score": ai_data.get("emotional_intensity", 50),
                "logical_consistency_score": ai_data.get("logical_consistency", 50)
            },
            "claim_analysis": [{
                "claim_text": content[:60] + "..." if mode in ['text', 'url'] else f"Analyzed {mode} file",
                "claim_type": "Visual/Audio Content" if mode in ['image', 'video', 'voice'] else "Factual Claim",
                "confidence_level": prob_real,
                "risk_level": "high" if prob_fake > 60 else "low",
                "verification_status": "verified" if prob_real > 75 else "disputed",
                "explanation": "AI detected manipulative intent or synthetic generation." if prob_fake > 50 else "Information/Media appears authentic."
            }],
            "validation_sources": ai_data.get("sources", []),
            "final_explanation_for_user": ai_data.get("explanation", "Analysis complete.")
        }
        
        return jsonify(structured_response)

    except Exception as e:
        print(f"❌ CRASH REPORT: {str(e)}")
        return jsonify({'error': str(e)}), 500
        
    finally:
        # 6. CLEANUP: Delete the temporary file from your server to save hard drive space!
        if temp_file_path and os.path.exists(temp_file_path):
            os.remove(temp_file_path)
            
            # --- ADD THIS NEW ROUTE BELOW THE /api/analyze FUNCTION ---

@app.route('/api/triage', methods=['POST'])
@cross_origin()
def emergency_triage():
    """
    Dedicated node for Helpline 24/7. 
    Bypasses forensic analysis to provide direct tactical solutions.
    """
    try:
        data = request.get_json()
        user_issue = data.get('text', '')

        if not user_issue:
            return jsonify({'error': 'No issue provided'}), 400

        # Dedicated "Responder" prompt overrides the forensic style of /api/analyze
        # We use a plain string here instead of forcing JSON to ensure simplicity and speed
        triage_prompt = f"""
        ACT AS: A senior, clinical Emergency Cyber-Responder for XIST AI.
        USER ISSUE: {user_issue}
        
        STRICT PROTOCOL:
        1. Provide ONLY a 3-step tactical survival plan.
        2. NO introductory text (e.g., "I'm sorry to hear that" or "Based on...").
        3. NO analysis of whether the text is AI or human.
        4. NO forensic technical terms.
        5. TONE: Cold, commanding, and action-oriented.
        6. FORMAT: A simple numbered list.
        """

        response = llm_model.generate_content(triage_prompt)
        
        try:
            # Since your model is FORCED to JSON, we must parse it
            ai_data = json.loads(response.text)
            # We look for common keys Gemini might use, or the whole string
            solution_text = ai_data.get('explanation', ai_data.get('solution', response.text))
        except:
            # Fallback if it returns plain text despite the config
            solution_text = response.text

        return jsonify({"solution": solution_text})

    except Exception as e:
        print(f"❌ TRIAGE ERROR: {str(e)}")
        return jsonify({"error": "Emergency Triage Node Offline"}), 500
    
if __name__ == '__main__':
    app.run(debug=True, port=5000, host='0.0.0.0')