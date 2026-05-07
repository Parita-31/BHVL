from gtts import gTTS
import os
import time

def speak(text):
    try:
        tts = gTTS(text=text, lang="en")
        filename = f"response_{int(time.time())}.mp3"
        filepath = os.path.join(".", filename)
        tts.save(filepath)
        return filename
    except Exception as e:
        print(f"TTS Error: {e}")
        return "response.mp3" # fallback to default if error