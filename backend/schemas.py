from pydantic import BaseModel
from typing import List, Optional, Dict, Any
from datetime import datetime


class DocumentBase(BaseModel):
    filename: str


class DocumentCreate(DocumentBase):
    pass


class DocumentResponse(DocumentBase):
    id: int
    file_hash: str
    upload_time: datetime
    status: str

    class Config:
        from_attributes = True


class VerificationBase(BaseModel):
    ocr_text: str
    perceptual_hash: str
    semantic_hash: str
    structural_hash: str
    composite_fingerprint: str


class VerificationCreate(VerificationBase):
    document_id: int


class VerificationResponse(VerificationBase):
    id: int
    document_id: int
    created_at: datetime

    class Config:
        from_attributes = True


class VerdictBase(BaseModel):
    verdict: str  # RED, AMBER, GREEN
    confidence: float
    reasons: List[str]
    fraud_details: Dict[str, Any]


class VerdictCreate(VerdictBase):
    verification_id: int


class VerdictResponse(VerdictBase):
    id: int
    verification_id: int
    created_at: datetime

    class Config:
        from_attributes = True


class VerificationDetailResponse(BaseModel):
    document: DocumentResponse
    verification: VerificationResponse
    verdict: VerdictResponse
    authority_status: Dict[str, Any]
    ledger_status: Dict[str, Any]

    class Config:
        from_attributes = True


class VerificationHistoryItem(BaseModel):
    id: int
    filename: str
    verdict: str
    confidence: float
    upload_time: datetime
    processing_time_ms: int


class AnalyticsStatsResponse(BaseModel):
    total_verifications: int
    red_count: int
    amber_count: int
    green_count: int
    average_confidence: float
    fraud_rate: float
