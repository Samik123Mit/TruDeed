from typing import Dict, List, Optional
from datetime import datetime
from sqlalchemy.orm import Session
from models import LedgerHistory


class FederatedLedgerService:
    """Federated ledger for tracking verification history"""
    
    def __init__(self, db: Session):
        self.db = db
    
    def record_verification(self, fingerprint: str, verdict: str,
                           document_type: str = "unknown") -> None:
        """Record a verification in the federated ledger"""
        
        entry = LedgerHistory(
            fingerprint=fingerprint,
            verdict=verdict,
            document_type=document_type,
            created_at=datetime.utcnow(),
            is_duplicate=False
        )
        
        self.db.add(entry)
        self.db.commit()
    
    def check_duplicate(self, fingerprint: str) -> Optional[Dict]:
        """Check if fingerprint exists in ledger (duplicate submission)"""
        
        existing = self.db.query(LedgerHistory).filter(
            LedgerHistory.fingerprint == fingerprint
        ).first()
        
        if existing:
            return {
                "is_duplicate": True,
                "previous_verdict": existing.verdict,
                "previous_time": existing.created_at.isoformat(),
                "days_since_submission": self._days_since(existing.created_at)
            }
        
        return {"is_duplicate": False}
    
    def get_verification_chain(self, fingerprint: str) -> List[Dict]:
        """Get complete verification history for a fingerprint"""
        
        entries = self.db.query(LedgerHistory).filter(
            LedgerHistory.fingerprint == fingerprint
        ).order_by(LedgerHistory.created_at.desc()).all()
        
        return [
            {
                "verdict": entry.verdict,
                "timestamp": entry.created_at.isoformat(),
                "document_type": entry.document_type
            }
            for entry in entries
        ]
    
    def get_ledger_status(self, fingerprint: str) -> Dict:
        """Get current ledger status for a fingerprint"""
        
        latest_entry = self.db.query(LedgerHistory).filter(
            LedgerHistory.fingerprint == fingerprint
        ).order_by(LedgerHistory.created_at.desc()).first()
        
        if latest_entry:
            return {
                "status": "recorded",
                "verdict": latest_entry.verdict,
                "last_verified": latest_entry.created_at.isoformat(),
                "verification_count": len(self.get_verification_chain(fingerprint))
            }
        
        return {"status": "not_recorded"}
    
    def get_fraud_stats(self) -> Dict:
        """Get aggregate fraud statistics from ledger"""
        
        total = self.db.query(LedgerHistory).count()
        
        red_count = self.db.query(LedgerHistory).filter(
            LedgerHistory.verdict == "RED"
        ).count()
        
        amber_count = self.db.query(LedgerHistory).filter(
            LedgerHistory.verdict == "AMBER"
        ).count()
        
        green_count = self.db.query(LedgerHistory).filter(
            LedgerHistory.verdict == "GREEN"
        ).count()
        
        return {
            "total_verifications": total,
            "red_count": red_count,
            "amber_count": amber_count,
            "green_count": green_count,
            "fraud_rate": round((red_count / total * 100) if total > 0 else 0, 2),
            "suspicious_rate": round((amber_count / total * 100) if total > 0 else 0, 2)
        }
    
    def _days_since(self, dt: datetime) -> int:
        """Calculate days since a datetime"""
        delta = datetime.utcnow() - dt
        return delta.days
