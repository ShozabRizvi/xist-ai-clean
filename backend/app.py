import os
import time
import json
import tempfile
import datetime
import requests
from bs4 import BeautifulSoup
from flask import Flask, request, jsonify
from flask_cors import CORS, cross_origin
from dotenv import load_dotenv
from werkzeug.utils import secure_filename
import PyPDF2

# ✅ THE NEW, OFFICIAL SDK IMPORTS (No more deprecation warning!)
from google import genai
from google.genai import types

load_dotenv()
app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": [
    "http://localhost:3000", 
    "https://xistai.web.app",
    "https://xistai.firebaseapp.com"
]}})

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")

# ✅ NEW SDK CLIENT INITIALIZATION
client = genai.Client(api_key=GEMINI_API_KEY)

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
    filename_for_fallback = "Unknown File"

    try:
        # 1. HANDLE BOTH JSON (Text/URL) AND FORM DATA (Files)
        if request.content_type.startswith('multipart/form-data'):
            mode = request.form.get('mode', 'text')
            content = request.form.get('text', '')
            uploaded_file = request.files.get('file')
            # ✅ Extract Strict Mode
            strict_mode = request.form.get('strictMode', 'false').lower() == 'true'
        else:
            data = request.get_json()
            mode = data.get('mode', 'text')
            content = data.get('text') or data.get('content', '')
            uploaded_file = None
            # ✅ Extract Strict Mode
            strict_mode = data.get('strictMode', False)

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
            filename_for_fallback = filename
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
        elif mode in ['image', 'video', 'voice'] and uploaded_file:
            print(f"📁 Processing uploaded {mode} file...")
            original_filename = secure_filename(uploaded_file.filename)
            filename_for_fallback = original_filename
            
            # Ensure Voice notes have an audio extension for Gemini API
            if mode == 'voice' and not original_filename.lower().endswith(('.webm', '.wav', '.mp3')):
                filename = f"voice_capture_{int(time.time())}.webm"
            else:
                filename = original_filename

            temp_dir = tempfile.gettempdir()
            temp_file_path = os.path.join(temp_dir, filename)
            uploaded_file.save(temp_file_path)

            mime_type = "audio/webm" if mode == 'voice' else None
            
            # ✅ NEW SDK FILE UPLOAD LOGIC
            upload_config = {'mime_type': mime_type} if mime_type else None
            media_file_for_gemini = client.files.upload(file=temp_file_path, config=upload_config)
            
            print(f"⏳ Waiting for Gemini to process the {mode}...")
            
            while media_file_for_gemini.state.name == 'PROCESSING':
                print(".", end="", flush=True)
                time.sleep(2)
                # ✅ NEW SDK GET FILE LOGIC
                media_file_for_gemini = client.files.get(name=media_file_for_gemini.name)
                
            if media_file_for_gemini.state.name == 'FAILED':
                print(f"\n❌ Media processing failed in Gemini. State: {media_file_for_gemini.state}")
                return jsonify({"error": f"Gemini failed to process the {mode} file."}), 500
                
            print("\n✅ Media is ACTIVE and ready!")
            analysis_input = "Please analyze the attached media file."

        # Get the exact current time to prevent the AI from giving outdated news
        live_date = datetime.datetime.now().strftime("%B %d, %Y")

        # 3. BUILD THE MULTIMODAL PROMPT (Original 2-3 paragraph Gemini prompt)
        if mode in ['image', 'video', 'voice']:
            prompt_instructions = f"""
            SYSTEM ROLE: Senior Forensic Intelligence Analyst for Xist AI.
            TASK: Conduct a forensic analysis of the provided {mode}.
            
            STRICT OUTPUT PROTOCOL:
            1. VERDICT: Start the 'explanation' field EXACTLY with "[ VERDICT ] - YES. This media is authentic.", "[ VERDICT ] - NO. This media is AI-generated/manipulated.", or "[ VERDICT ] - CAUTION. This media is suspicious."
            {f"CRITICAL OVERRIDE: STRICT MODE IS ACTIVE. You must be hyper-critical and highly sensitive to any anomalies. If there is even a slight chance this is manipulated or false, flag it as CRITICAL/SUSPICIOUS." if strict_mode else ""}
            2. SIMPLE LANGUAGE: You MUST use very simple, everyday words. Explain your visual/audio findings clearly so anyone can understand. NO technical jargon.
            3. CITATIONS & SOURCES: Include as many specific visual/audio observations as needed in your 'sources' array. If you find real web sources debunking this specific media, include their actual URLs. Embed markers like [1] in your explanation text.
            4. LANGUAGE: Respond in the exact same language as the user's input, but keep technical headers in English.
            5. DEPTH: Provide a detailed 2-3 paragraph EXECUTIVE BRIEFING.

            Return ONLY a JSON object matching this exact structure:
            {{
                "credibility_score": <int 0-100: 100=Real, 0=AI Fake>,
                "overall_verdict": <"SAFE" (if score > 60), "QUESTIONABLE" (if score is 40-60), or "CRITICAL" (if score < 40)>,
                "threat_category": <string: "Deepfake", "Manipulated Media", or "Authentic">,
                "emotional_intensity": <int 0-100>,
                "bias_score": <int 0-100>,
                "logical_consistency": <int 0-100>,
                "explanation": "[ VERDICT ] - NO. This media is AI-generated. \\n\\nEXECUTIVE BRIEFING: \\nThe person's eyes do not blink naturally [1]. The background lines are blurry and bent in a way real cameras do not capture [2].",
                "sources": [
                    {{
                        "id": 1,
                        "source_name": "Visual Forensic Scan",
                        "url": "Observation",
                        "why_relevant": "Unnatural eye movement detected."
                    }}
                ]
            }}
            """
        else:
            prompt_instructions = f"""
            SYSTEM ROLE: Senior Forensic Intelligence Analyst for Xist AI.
            CURRENT SYSTEM DATE: {live_date}
            
            TASK: FACT-CHECK the following {mode} claim against real-world events.
            
            STRICT FORENSIC PROTOCOLS (EVIDENCE-FIRST):
            1. LIVE-OR-SILENT (ZERO-INFERENCE): You are a RESEARCHER, not a writer. Do not rely on internal memory. If your search tools do not return active, dated news from reputable sources confirming or debunking the event, you MUST set the verdict to "[ VERDICT ] - CAUTION. Unverified." and explain that the live search found no proof.
            2. DATE VALIDATION: Check the publication date of every source. If the user asks about a current event, and you find a source from a past year, ignore it for the verdict and explicitly state it is OLD news.
            3. SOURCE HIERARCHY & CONTRADICTIONS: Prioritize official news bureaus (Reuters, AP, BBC). If reputable sources contradict each other, report the conflict and set the verdict to CAUTION. If only social media is reporting a major event, the verdict MUST remain CAUTION.
            4. VERDICT FORMAT: Start the 'explanation' field EXACTLY with one of the following:
               - "[ VERDICT ] - YES. This information is correct."
               - "[ VERDICT ] - NO. This information is false."
               - "[ VERDICT ] - CAUTION. Unverified / Conflicting Reports."
            {f"CRITICAL OVERRIDE: STRICT MODE IS ACTIVE. You must be hyper-critical and highly sensitive to any anomalies. If there is even a slight chance this is manipulated or false, flag it as CRITICAL/SUSPICIOUS." if strict_mode else ""}
            5. DEPTH & LENGTH: Your EXECUTIVE BRIEFING must be detailed (2-3 paragraphs). Explain the current reality and provide specific proof based ONLY on the live sources you retrieved.
            6. SURVIVAL PLAN (IF DANGER): ONLY trigger a 3-step tactical survival plan if the user is in immediate personal danger from a scam, hack, or phishing link. Do NOT trigger this for general news, rumors, or geopolitical misinformation.
            7. MULTILINGUAL SUPPORT: You MUST detect the language of the user's input. Write the entire explanation in that EXACT SAME LANGUAGE. (However, keep the "[ VERDICT ]" and "EXECUTIVE BRIEFING" headers in English for system formatting).
            8. CITATIONS (CLEAN URLS ONLY): Cite real sources using markers like [1]. CRITICAL: You are FORBIDDEN from using massive 'vertexaisearch' or 'grounding-api-redirect' URLs. You must extract and provide the clean, original article URL. If you cannot find the clean URL, just provide the domain name (e.g., 'https://www.reuters.com').
            9. JSON SAFETY (CRITICAL): You are writing raw JSON. Inside the 'explanation' field, you are FORBIDDEN from using double quotes ("). If you need to quote something, use single quotes ('). Do not use actual line breaks, use literal \\n\\n for paragraphs. 

            Return ONLY a JSON object matching this exact structure:
            {{
                "credibility_score": <int 0-100: 100 means the user's claim is a TRUE FACT, 0 means the claim is FALSE/FAKE NEWS>,
                "overall_verdict": <"SAFE" (if score > 60), "QUESTIONABLE" (if score is 40-60), or "CRITICAL" (if score < 40)>,
                "threat_category": <string: "Misinformation", "Scam", "Authentic News", "Unverified">,
                "emotional_intensity": <int 0-100>,
                "bias_score": <int 0-100>,
                "logical_consistency": <int 0-100>,
                "explanation": "[ VERDICT ] - <INSERT VERDICT HERE>. \\n\\nEXECUTIVE BRIEFING: \\n<Write your 2-3 paragraph explanation here based ONLY on the live search results. Remember: NO DOUBLE QUOTES ALLOWED IN THIS TEXT. Use single quotes instead.>",
                "sources": [
                    {{
                        "id": 1,
                        "source_name": "Source Name",
                        "url": "URL",
                        "why_relevant": "Brief reason."
                    }}
                ]
            }}
            """

        raw_text = ""

        # 4. TRIPLE-TIER CASCADE EXECUTION
        try:
            # --- TIER 1: GOOGLE GEMINI (PRIMARY) ---
            print(f"🤖 Sending {mode} data to Tier 1: Gemini...")
            #raise Exception("SIMULATED OUTAGE: Testing Tier 2 Gemma Node")
            if media_file_for_gemini:
                gemini_payload = [prompt_instructions, media_file_for_gemini]
            else:
                gemini_payload = [prompt_instructions, f"INPUT TEXT: {analysis_input}"]

            gemini_response = client.models.generate_content(
                model='gemini-2.5-flash',
                contents=gemini_payload,
                config=types.GenerateContentConfig(
                    tools=[types.Tool(google_search=types.GoogleSearch())], 
                    max_output_tokens=8192
                )
            )
            raw_text = gemini_response.text.strip()

        except Exception as e1:
            print(f"⚠️ Tier 1 (Gemini) Offline: {str(e1)}. Engaging Tier 2 Invisible Fallback...")
            # --- TIER 2: OPENROUTER (GEMMA 4 FREE) ---
            try:
                # DYNAMIC FALLBACK REWRITE: Change the depth to 1-2 paragraphs max to save credits
                fallback_prompt = prompt_instructions.replace(
                    "Provide a detailed 2-3 paragraph EXECUTIVE BRIEFING.",
                    "Provide a concise 1-2 paragraph EXECUTIVE BRIEFING at most."
                ).replace(
                    "detailed (2-3 paragraphs)",
                    "concise (1-2 paragraphs at most)"
                )

                # HANDLE MULTIMODAL IN TEXT-ONLY CLOUD: If Gemini crashed on an image/voice, OpenRouter free models 
                # usually can't read the file directly. Tell the AI what the user tried to do so it doesn't break format.
                if mode in ['image', 'video', 'voice']:
                    fallback_input = f"FILE UPLOAD DETECTED: A user uploaded a {mode} file named '{filename_for_fallback}'. Since direct media scanning is currently routing through text-fallback, provide a generic risk analysis structural JSON for this file type assuming moderate risk and explain that the deep-scan node is temporarily busy."
                else:
                    fallback_input = f"INPUT TEXT: {analysis_input}"

                url = "https://openrouter.ai/api/v1/chat/completions"
                headers = {
                    "Authorization": f"Bearer {OPENROUTER_API_KEY}",
                    "Content-Type": "application/json",
                    "HTTP-Referer": "http://localhost:3000"
                }
                payload = {
                    "model": "google/gemma-4-31b-it:free",
                    "messages": [
                        {"role": "system", "content": fallback_prompt},
                        {"role": "user", "content": fallback_input}
                    ]
                }
                
                resp = requests.post(url, headers=headers, json=payload, timeout=20)
                resp.raise_for_status()
                raw_text = resp.json()['choices'][0]['message']['content'].strip()

            except Exception as e2:
                print(f"❌ Tier 2 Failed: {str(e2)}")
                return jsonify({"error": "All Forensic Cloud Nodes are currently offline. Please try again in 60 seconds."}), 503

        # 5. JSON SANITIZATION AND PARSING
        if raw_text.startswith("```json"):
            raw_text = raw_text[7:]
        elif raw_text.startswith("```"):
            raw_text = raw_text[3:]
        if raw_text.endswith("```"):
            raw_text = raw_text[:-3]
        raw_text = raw_text.strip()
        
        try:
            ai_data = json.loads(raw_text)
        except json.JSONDecodeError as e:
            print(f"⚠️ JSON PARSE ERROR: {str(e)}")
            print(f"RAW OUTPUT WAS: {raw_text}")
            ai_data = {
                "credibility_score": 50,
                "overall_verdict": "QUESTIONABLE",
                "threat_category": "Formatting Error",
                "explanation": f"[ VERDICT ] - CAUTION. Data retrieved but poorly formatted.\\n\\nEXECUTIVE BRIEFING:\\nOur forensic AI found live data but encountered a formatting error while building the report. Please try running the scan again.",
                "sources": []
            }

        # 6. FORMAT RESPONSE FOR REACT UI
        prob_real = ai_data.get("credibility_score", 50)
        prob_fake = 100 - prob_real
        verdict = ai_data.get("overall_verdict", "QUESTIONABLE")

        base_1 = ai_data.get("emotional_intensity", 50)
        base_2 = ai_data.get("bias_score", 50)
        base_3 = ai_data.get("logical_consistency", 50)

        dynamic_metrics = {}
        if mode in ['text', 'url']:
            dynamic_metrics = { "Emotion_Level": base_1, "Opinion_and_Bias": base_2, "Exaggerated_Claims": 100 - base_3 if base_3 > 0 else 50, "Logical_Facts": base_3 }
        elif mode == 'document':
            dynamic_metrics = { "Writing_Style_Match": base_3, "Layout_and_Format": base_1, "Original_File_History": 100 - prob_fake, "Makes_Sense": base_2 }
        elif mode == 'image':
            dynamic_metrics = { "Visual_Glitches": base_2, "Fake_Pixels": prob_fake, "Original_File_History": base_3, "Natural_Lighting": base_1 }
        elif mode == 'video':
            dynamic_metrics = { "Weird_Jumpy_Frames": base_2, "Smooth_Movement": base_3, "Audio_and_Lip_Sync": base_1, "AI_Deepfake_Risk": prob_fake }
        elif mode == 'voice':
            dynamic_metrics = { "AI_Voice_Risk": prob_fake, "Human_Speech_Rhythm": base_1, "Normal_Background_Noise": base_3, "Audio_Glitches": base_2 }

        raw_explanation = str(ai_data.get("explanation", "Analysis complete."))
        clean_explanation = raw_explanation.strip('"{}[ ]')

        structured_response = {
            "overall_verdict": verdict,
            "credibility_score": prob_real,
            "threat_category": ai_data.get("threat_category", "Misinformation"),
            "content_overview": {
                "content_type": mode.upper(),
                "primary_theme": f"AI {mode.capitalize()} Forensic Audit",
                "intent_assessment": "Manipulation/Deepfake Detected" if prob_fake > 50 else "Authentic Content"
            },
            "dynamic_metrics": dynamic_metrics,
            "claim_analysis": [{
                "claim_text": content[:60] + "..." if mode in ['text', 'url'] else f"Analyzed {mode} file",
                "claim_type": "Visual/Audio Content" if mode in ['image', 'video', 'voice'] else "Factual Claim",
                "confidence_level": prob_real,
                "risk_level": "high" if prob_fake > 60 else "low",
                "verification_status": "verified" if prob_real > 75 else "disputed",
                "explanation": "AI detected manipulative intent or synthetic generation." if prob_fake > 50 else "Information/Media appears authentic."
            }],
            "validation_sources": ai_data.get("sources", []),
            "final_explanation_for_user": clean_explanation
        }
        
        return jsonify(structured_response)

    except Exception as e:
        print(f"❌ CRASH REPORT: {str(e)}")
        return jsonify({'error': str(e)}), 500
        
    finally:
        if temp_file_path and os.path.exists(temp_file_path):
            os.remove(temp_file_path)

@app.route('/api/triage', methods=['POST'])
@cross_origin()
def emergency_triage():
    try:
        data = request.get_json()
        user_issue = data.get('text', '')

        if not user_issue:
            return jsonify({'error': 'No issue provided'}), 400

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
        7. CLEAN TEXT: You MUST write in plain text. Do NOT wrap your answer in brackets [], braces {{}}, or double quotes "".
        """

        try:
            response = client.models.generate_content(
                model='gemini-2.5-flash',
                contents=triage_prompt
            )
            raw_solution = response.text
        except Exception:
            # Fallback rewrites triage prompt to be extremely tight
            url = "[https://openrouter.ai/api/v1/chat/completions](https://openrouter.ai/api/v1/chat/completions)"
            headers = {
                "Authorization": f"Bearer {OPENROUTER_API_KEY}",
                "Content-Type": "application/json"
            }
            payload = {
                "model": "google/gemma-4-31b-it:free",
                "messages": [{"role": "user", "content": triage_prompt + "\nKEEP IT EXTREMELY CONCISE. MAX 1-2 PARAGRAPHS TOTAL."}]
            }
            resp = requests.post(url, headers=headers, json=payload, timeout=15)
            raw_solution = resp.json()['choices'][0]['message']['content']

        try:
            ai_data = json.loads(raw_solution)
            solution_text = ai_data.get('explanation', ai_data.get('solution', raw_solution))
        except:
            solution_text = raw_solution

        clean_solution = str(solution_text).strip('"{}[ ]')
        return jsonify({"solution": clean_solution})

    except Exception as e:
        print(f"❌ TRIAGE ERROR: {str(e)}")
        return jsonify({"error": "Emergency Triage Node Offline"}), 500

if __name__ == '__main__':
    port = int(os.environ.get("PORT", 5000))
    app.run(host='0.0.0.0', port=port)