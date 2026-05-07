from sqlalchemy import Column, Integer, String, Text, DateTime
from app.database import Base
from datetime import datetime, timezone

class CallLog(Base):
    __tablename__ = "call_logs"

    id = Column(Integer, primary_key=True, index=True)
    timestamp = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    transcript = Column(Text)
    intent = Column(String)
    dialect = Column(String)
    emotion = Column(String)
    confidence = Column(Integer)
    restated = Column(Text)
    status = Column(String, default="Pending") # Pending, Verified, Revise, Retry
    priority_level = Column(String, default="Normal") # High, Normal
