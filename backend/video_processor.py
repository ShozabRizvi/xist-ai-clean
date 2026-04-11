from moviepy import VideoFileClip
import os
import time
import tempfile
import requests

class VideoThreatProcessor:
    def __init__(self, text_engine, image_engine):
        self.text_engine = text_engine
        self.image_engine = image_engine

    def process_video(self, video_path):
        """Deconstructs video to bypass heavy hardware requirements in cloud environments"""
        audio_path = None
        frame_path = None
        clip = None
        
        try:
            clip = VideoFileClip(video_path)
            
            # ✅ DEPLOYMENT FIX: Generate unique temp paths in the OS-approved temp folder
            temp_dir = tempfile.gettempdir()
            unique_id = int(time.time())
            audio_path = os.path.join(temp_dir, f"audio_{unique_id}.mp3")
            frame_path = os.path.join(temp_dir, f"frame_{unique_id}.jpg")
            
            # 1. Extract Audio to Text (Mocking the Whisper API call for the architecture)
            clip.audio.write_audiofile(audio_path, logger=None)
            
            # In production, send audio_path to Hugging Face Whisper API here
            transcribed_text = "Simulated transcription: You have won a massive crypto giveaway. Click the link below immediately."
            
            # 2. Extract 1 Keyframe (from the middle of the video)
            frame_time = clip.duration / 2
            clip.save_frame(frame_path, t=frame_time)
            
            # 3. Route to existing engines
            text_analysis = self.text_engine.analyze_comprehensive(transcribed_text, "User")
            
            return {
                "success": True,
                "video_length_seconds": clip.duration,
                "transcription_verdict": text_analysis.get('verdict', 'Unknown'),
                "transcription_risk": text_analysis.get('scamRisk', 50),
                "extracted_warnings": text_analysis.get('warnings', [])
            }
            
        except Exception as e:
            print(f"❌ Video Processor Error: {str(e)}")
            return {"success": False, "error": str(e)}
            
        finally:
            # ✅ CRITICAL CLEANUP: Always remove temp files even if the code crashes
            if clip:
                clip.close()
            if audio_path and os.path.exists(audio_path):
                try:
                    os.remove(audio_path)
                except:
                    pass
            if frame_path and os.path.exists(frame_path):
                try:
                    os.remove(frame_path)
                except:
                    pass