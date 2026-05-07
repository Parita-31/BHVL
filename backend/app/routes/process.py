from fastapi import APIRouter, UploadFile, Depends
from sqlalchemy.orm import Session
from app.services import llm, tts
from app.database import get_db
from app.models.call_log import CallLog

router = APIRouter()

@router.post("/process")
async def process_audio(file: UploadFile, db: Session = Depends(get_db)):
    audio_data = await file.read()
    mime_type = file.content_type
    
    # 1. Pass the raw audio bytes directly to Multimodal Gemini
    analysis = await llm.analyze_audio(audio_data, mime_type)
    
    # 2. Generate Audio for the Restated text using free gTTS
    audio_file = tts.speak(analysis.get("restated", "I could not generate an audio response."))
    
    # Determine priority based on emotion
    emotion = analysis.get("emotion", "Unknown")
    priority_level = "High" if "distress" in emotion.lower() or "anger" in emotion.lower() else "Normal"
    
    # Save to database
    db_log = CallLog(
        transcript=analysis.get("transcript", "Failed to transcribe."),
        intent=analysis.get("intent", "Unknown"),
        dialect=analysis.get("dialect", "Unknown"),
        emotion=emotion,
        confidence=analysis.get("confidence", 0),
        restated=analysis.get("restated", "Could not verify."),
        status="Pending",
        priority_level=priority_level
    )
    db.add(db_log)
    db.commit()
    db.refresh(db_log)

    return {
        "id": db_log.id,
        "transcript": db_log.transcript,
        "dialect": db_log.dialect,
        "intent": db_log.intent,
        "confidence": db_log.confidence,
        "emotion": db_log.emotion,
        "restated": db_log.restated,
        "audio": audio_file,
        "priority_level": db_log.priority_level
    }