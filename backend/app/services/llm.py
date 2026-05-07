from groq import Groq
import os
import json
from dotenv import load_dotenv

load_dotenv(override=True)

api_key = os.getenv("GROQ_API_KEY")
print("GROQ API KEY:", "Loaded" if api_key else "Missing")

if api_key:
    client = Groq(api_key=api_key)
else:
    client = None

async def analyze_audio(audio_data: bytes, mime_type: str = "audio/webm"):

    if not client:
        return {
            "transcript": "No audio processed.",
            "intent": "KEY_MISSING",
            "confidence": 0,
            "dialect": "Unknown",
            "emotion": "Unknown",
            "restated": "Groq API key missing. Check backend/.env file."
        }

    try:
        # Step 1: Transcribe Audio using Whisper
        filename = "audio.webm"
        if "mp4" in mime_type:
            filename = "audio.mp4"
        elif "wav" in mime_type:
            filename = "audio.wav"
        elif "mp3" in mime_type:
            filename = "audio.mp3"
            
        transcription = client.audio.transcriptions.create(
            file=(filename, audio_data),
            model="whisper-large-v3",
            response_format="json",
            temperature=0.0
        )
        
        transcript_text = transcription.text.strip()
        
        if not transcript_text:
             raise ValueError("Transcription returned empty text.")

        # Step 2: Analyze Text using Llama 3
        prompt = f"""
        Analyze the following transcribed emergency or complaint text: "{transcript_text}"
        
        Return ONLY a raw JSON object with EXACTLY these keys:
        {{
          "transcript": "{transcript_text}",
          "intent": "",
          "confidence": 0,
          "dialect": "",
          "emotion": "",
          "restated": ""
        }}
        """

        chat_completion = client.chat.completions.create(
            messages=[
                {
                    "role": "system",
                    "content": "You are a helpful assistant that analyzes text and outputs strictly in JSON."
                },
                {
                    "role": "user",
                    "content": prompt,
                }
            ],
            model="llama-3.3-70b-versatile",
            response_format={"type": "json_object"}
        )

        text_resp = chat_completion.choices[0].message.content.strip()
        return json.loads(text_resp)

    except Exception as e:
        print(f"LLM Error: {e}")
        return {
            "transcript": "Audio could not be processed.",
            "intent": "Error",
            "confidence": 0,
            "dialect": "Unknown",
            "emotion": "Unknown",
            "restated": f"AI processing failed: {str(e)}"
        }