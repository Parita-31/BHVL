import speech_recognition as sr
from pydub import AudioSegment
import io

async def transcribe(file):
    try:
        audio_data = await file.read()
        if not audio_data:
            return "No audio received."
            
        # Convert whatever format (e.g. webm from web) to wav
        audio = AudioSegment.from_file(io.BytesIO(audio_data))
        wav_io = io.BytesIO()
        audio.export(wav_io, format="wav")
        wav_io.seek(0)
        
        recognizer = sr.Recognizer()
        with sr.AudioFile(wav_io) as source:
            audio_content = recognizer.record(source)
            
        text = recognizer.recognize_google(audio_content)
        return text
    except sr.UnknownValueError:
        return "Audio not clear enough or silence."
    except sr.RequestError:
        return "Speech to text service unavailable."
    except Exception as e:
        print(f"ASR Error: {e}")
        return "Error decoding audio format."