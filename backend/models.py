from sqlalchemy import Column, Integer, String, DateTime, Float, Text, JSON, Boolean
from sqlalchemy.ext.declarative import declarative_base
from datetime import datetime

Base = declarative_base()


class Document(Base):
    __tablename__ = "documents"
    
    id = Column(Integer, primary_key=True, index=True)
    filename = Column(String, index=True)
    file_hash = Column(String, unique=True, index=True)
    file_path = Column(String)
    upload_time = Column(DateTime, default=datetime.utcnow)
    status = Column(String, default="uploaded")  # uploaded, processing, verified


class Verification(Base):
    __tablename__ = "verifications"
    
    id = Column(Integer, primary_key=True, index=True)
    document_id = Column(Integer, index=True)
    ocr_text = Column(Text)
    perceptual_hash = Column(String)
    semantic_hash = Column(String)
    structural_hash = Column(String)
    composite_fingerprint = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)


class Verdict(Base):
    __tablename__ = "verdicts"
    
    id = Column(Integer, primary_key=True, index=True)
    verification_id = Column(Integer, index=True)
    verdict = Column(String)  # RED, AMBER, GREEN
    confidence = Column(Float)
    reasons = Column(JSON)  # List of fraud reason codes
    fraud_details = Column(JSON)  # Detailed fraud information
    created_at = Column(DateTime, default=datetime.utcnow)


class LedgerHistory(Base):
    __tablename__ = "ledger_history"
    
    id = Column(Integer, primary_key=True, index=True)
    fingerprint = Column(String, index=True)
    verdict = Column(String)  # Previous verdict
    document_type = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)
    is_duplicate = Column(Boolean, default=False)


class AnalyticsEvent(Base):
    __tablename__ = "analytics_events"
    
    id = Column(Integer, primary_key=True, index=True)
    event_type = Column(String)  # verification, fraud_detected, etc
    verdict = Column(String)
    confidence = Column(Float)
    processing_time_ms = Column(Integer)
    created_at = Column(DateTime, default=datetime.utcnow)
