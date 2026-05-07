from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.call_log import CallLog

router = APIRouter()

@router.post("/confirm")
def confirm(data: dict, db: Session = Depends(get_db)):
    response = data.get("response")
    log_id = data.get("id")
    
    if log_id:
        db_log = db.query(CallLog).filter(CallLog.id == log_id).first()
        if db_log:
            if response == "YES":
                db_log.status = "Verified"
            elif response == "PARTIAL":
                db_log.status = "Revise"
            else:
                db_log.status = "Retry"
            db.commit()

    if response == "YES":
        return {"status": "VERIFIED"}

    elif response == "PARTIAL":
        return {
            "status": "REVISE",
            "message": "Please tell what is incorrect"
        }

    else:
        return {
            "status": "RETRY",
            "message": "Please repeat your issue clearly"
        }