from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.call_log import CallLog

router = APIRouter()

@router.get("/logs")
def get_logs(db: Session = Depends(get_db)):
    logs = db.query(CallLog).order_by(CallLog.timestamp.desc()).all()
    return logs
