from typing import Dict, List, Tuple
from datetime import datetime
import random


class FraudDetectionEngine:
    """Rule-based fraud detection for documents"""
    
    # Known fraud patterns
    SUSPICIOUS_KEYWORDS = [
        "duplicate", "revised", "corrected", "updated", "modified",
        "amended", "edited", "replacement"
    ]
    
    def __init__(self):
        self.fraud_rules = [
            self._check_amount_tampering,
            self._check_duplicate_submission,
            self._check_layout_anomalies,
            self._check_text_inconsistencies,
            self._check_authority_mismatch,
            self._check_date_validity
        ]
    
    def detect_fraud(self, ocr_data: Dict, ocr_confidence: float,
                    ledger_history: List[Dict] = None) -> Dict:
        """Run fraud detection pipeline"""
        
        fraud_indicators = []
        fraud_scores = {}
        
        # Run each fraud detection rule
        for rule_func in self.fraud_rules:
            result = rule_func(ocr_data, ocr_confidence, ledger_history)
            if result["detected"]:
                fraud_indicators.append(result)
                fraud_scores[result["code"]] = result["score"]
        
        # Calculate final verdict and confidence
        verdict, confidence, reasons = self._calculate_verdict(
            fraud_indicators,
            ocr_confidence
        )
        
        return {
            "verdict": verdict,
            "confidence": confidence,
            "reasons": reasons,
            "fraud_indicators": fraud_indicators,
            "fraud_scores": fraud_scores,
            "is_fraudulent": verdict == "RED",
            "is_suspicious": verdict == "AMBER",
            "is_authentic": verdict == "GREEN"
        }
    
    def _check_amount_tampering(self, ocr_data: Dict, confidence: float,
                               ledger: List[Dict]) -> Dict:
        """Detect amount field tampering"""
        amounts = ocr_data.get("entities", {}).get("amounts", [])
        
        if not amounts:
            return {"detected": False, "code": "AMOUNT_CHECK", "score": 0}
        
        # Extract numeric values
        try:
            amount_values = [int(''.join(filter(str.isdigit, a))) for a in amounts]
            
            # Check for suspiciously round numbers (potential tampering)
            suspicious_rounds = sum(1 for v in amount_values if v % 100000 == 0)
            
            # Check if amounts vary wildly (potential multiple edits)
            if len(amount_values) > 1:
                max_amt = max(amount_values)
                min_amt = min(amount_values)
                if min_amt > 0:
                    variance = (max_amt - min_amt) / min_amt
                    if variance > 0.5:  # >50% variance is suspicious
                        return {
                            "detected": True,
                            "code": "AMOUNT_VARIANCE",
                            "score": 65,
                            "reason": f"Amount variance detected: {variance*100:.1f}%"
                        }
            
            if suspicious_rounds > len(amounts) * 0.5:
                return {
                    "detected": True,
                    "code": "SUSPICIOUS_AMOUNTS",
                    "score": 45,
                    "reason": f"{suspicious_rounds} suspiciously round amounts detected"
                }
        except:
            pass
        
        return {"detected": False, "code": "AMOUNT_CHECK", "score": 0}
    
    def _check_duplicate_submission(self, ocr_data: Dict, confidence: float,
                                   ledger: List[Dict]) -> Dict:
        """Detect if document was previously submitted"""
        
        if not ledger:
            return {"detected": False, "code": "DUPLICATE_CHECK", "score": 0}
        
        # Check for duplicate survey/ID numbers
        ids = ocr_data.get("entities", {}).get("ids", [])
        survey_nums = ocr_data.get("entities", {}).get("survey_numbers", [])
        
        all_identifiers = ids + survey_nums
        
        for identifier in all_identifiers:
            for ledger_entry in ledger:
                if identifier in ledger_entry.get("identifiers", []):
                    prev_verdict = ledger_entry.get("verdict", "UNKNOWN")
                    return {
                        "detected": True,
                        "code": "DUPLICATE_SUBMISSION",
                        "score": 80,
                        "reason": f"Duplicate submission detected. Previous verdict: {prev_verdict}"
                    }
        
        return {"detected": False, "code": "DUPLICATE_CHECK", "score": 0}
    
    def _check_layout_anomalies(self, ocr_data: Dict, confidence: float,
                               ledger: List[Dict]) -> Dict:
        """Detect layout and formatting anomalies"""
        
        word_count = ocr_data.get("word_count", 0)
        
        # Unusually short documents
        if word_count < 10:
            return {
                "detected": True,
                "code": "LAYOUT_ANOMALY",
                "score": 35,
                "reason": f"Unusually short document ({word_count} words)"
            }
        
        # Check OCR confidence
        ocr_conf = ocr_data.get("confidence", 100)
        if ocr_conf < 60:
            return {
                "detected": True,
                "code": "LOW_OCR_CONFIDENCE",
                "score": 40,
                "reason": f"Low OCR confidence: {ocr_conf}%"
            }
        
        return {"detected": False, "code": "LAYOUT_CHECK", "score": 0}
    
    def _check_text_inconsistencies(self, ocr_data: Dict, confidence: float,
                                   ledger: List[Dict]) -> Dict:
        """Detect text modification patterns"""
        
        full_text = ocr_data.get("full_text", "").lower()
        
        # Check for suspicious keywords
        suspicious_keywords_found = [
            kw for kw in self.SUSPICIOUS_KEYWORDS if kw in full_text
        ]
        
        if suspicious_keywords_found:
            return {
                "detected": True,
                "code": "SUSPICIOUS_TEXT",
                "score": 50,
                "reason": f"Suspicious keywords found: {', '.join(suspicious_keywords_found)}"
            }
        
        # Check for date inconsistencies
        dates = ocr_data.get("entities", {}).get("dates", [])
        if len(dates) > 1:
            return {
                "detected": True,
                "code": "DATE_INCONSISTENCY",
                "score": 45,
                "reason": f"Multiple dates found ({len(dates)}), possible modification"
            }
        
        return {"detected": False, "code": "TEXT_CHECK", "score": 0}
    
    def _check_authority_mismatch(self, ocr_data: Dict, confidence: float,
                                 ledger: List[Dict]) -> Dict:
        """Check against authority databases"""
        
        # Simulate authority verification (in real system, would call APIs)
        # For demo, randomly return minor issues sometimes
        if random.random() < 0.15:  # 15% of documents have minor authority issues
            return {
                "detected": True,
                "code": "AUTHORITY_MISMATCH",
                "score": 35,
                "reason": "Minor discrepancy with authority records"
            }
        
        return {"detected": False, "code": "AUTHORITY_CHECK", "score": 0}
    
    def _check_date_validity(self, ocr_data: Dict, confidence: float,
                            ledger: List[Dict]) -> Dict:
        """Check if dates are within valid range"""
        
        dates = ocr_data.get("entities", {}).get("dates", [])
        
        for date_str in dates:
            try:
                # Basic date validation
                parts = date_str.replace('-', '/').split('/')
                if len(parts) == 3:
                    day, month, year = int(parts[0]), int(parts[1]), int(parts[2])
                    
                    if month > 12 or day > 31:
                        return {
                            "detected": True,
                            "code": "INVALID_DATE",
                            "score": 70,
                            "reason": f"Invalid date format detected: {date_str}"
                        }
                    
                    # Check if date is in future
                    if int(year) > 2025:
                        return {
                            "detected": True,
                            "code": "FUTURE_DATE",
                            "score": 80,
                            "reason": f"Future date detected: {date_str}"
                        }
            except:
                pass
        
        return {"detected": False, "code": "DATE_CHECK", "score": 0}
    
    def _calculate_verdict(self, indicators: List[Dict],
                          ocr_confidence: float) -> Tuple[str, float, List[str]]:
        """Calculate final verdict from all indicators"""
        
        if not indicators:
            # No fraud indicators found
            confidence = min(95, ocr_confidence + 10)
            return "GREEN", confidence, ["Document appears authentic"]
        
        # Calculate fraud score
        total_score = sum(ind.get("score", 0) for ind in indicators)
        num_indicators = len(indicators)
        average_score = total_score / num_indicators if num_indicators > 0 else 0
        
        # Adjust confidence based on OCR quality
        confidence = max(50, 100 - average_score) if ocr_confidence > 70 else max(40, 100 - average_score - 10)
        
        # Determine verdict
        high_severity_indicators = [
            ind for ind in indicators if ind.get("score", 0) >= 70
        ]
        medium_indicators = [
            ind for ind in indicators if 50 <= ind.get("score", 0) < 70
        ]
        
        reasons = [ind.get("reason", ind.get("code")) for ind in indicators]
        
        if high_severity_indicators or (num_indicators >= 3 and average_score > 60):
            verdict = "RED"
            confidence = min(95, confidence)
        elif num_indicators >= 2 or average_score > 55:
            verdict = "AMBER"
            confidence = max(50, confidence)
        else:
            verdict = "GREEN"
            confidence = min(85, confidence)
        
        return verdict, int(confidence), reasons
