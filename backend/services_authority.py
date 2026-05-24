from typing import Dict, List
import random


class AuthorityVerificationService:
    """Mock authority verification APIs for demo purposes"""
    
    # Mock database entries
    MOCK_KAVERI = {
        "45/A": {"owner": "RAJESH KUMAR", "area": "1.5 acres", "status": "registered"},
        "45/B": {"owner": "PRIYA SHARMA", "area": "2.0 acres", "status": "registered"},
        "46/1": {"owner": "AMIT PATEL", "area": "0.75 acres", "status": "registered"},
    }
    
    MOCK_DHARANI = {
        "MH-2024-001": {"type": "land", "status": "active", "owner": "RAJESH KUMAR"},
        "MH-2024-002": {"type": "building", "status": "active", "owner": "PRIYA SHARMA"},
        "MH-2024-003": {"type": "land", "status": "active", "owner": "AMIT PATEL"},
    }
    
    def verify_with_authorities(self, ocr_data: Dict) -> Dict:
        """Verify document against all mock authorities"""
        
        survey_numbers = ocr_data.get("entities", {}).get("survey_numbers", [])
        names = ocr_data.get("entities", {}).get("names", [])
        
        results = {
            "kaveri_verified": False,
            "dharani_verified": False,
            "igr_verified": False,
            "traces_verified": False,
            "overall_status": "unknown",
            "details": {}
        }
        
        # Kaveri verification (Land Records)
        if survey_numbers:
            for survey_num in survey_numbers:
                if survey_num in self.MOCK_KAVERI:
                    results["kaveri_verified"] = True
                    results["details"]["kaveri"] = self.MOCK_KAVERI[survey_num]
                    break
        
        # Dharani verification
        if names:
            # Mock dharani verification with 80% success rate
            if random.random() < 0.8:
                results["dharani_verified"] = True
                results["details"]["dharani"] = {"status": "record_found", "verified": True}
            else:
                results["details"]["dharani"] = {"status": "record_not_found", "verified": False}
        
        # IGR verification (mock)
        if random.random() < 0.85:
            results["igr_verified"] = True
            results["details"]["igr"] = {"stamp_duty_paid": True, "registration_valid": True}
        
        # TRACES verification (for financial documents - mock)
        if random.random() < 0.9:
            results["traces_verified"] = True
            results["details"]["traces"] = {"income_verified": True}
        
        # Overall status
        verified_count = sum([
            results["kaveri_verified"],
            results["dharani_verified"],
            results["igr_verified"],
            results["traces_verified"]
        ])
        
        if verified_count >= 3:
            results["overall_status"] = "fully_verified"
        elif verified_count >= 2:
            results["overall_status"] = "partially_verified"
        else:
            results["overall_status"] = "not_verified"
        
        return results
    
    def verify_kaveri(self, survey_number: str) -> Dict:
        """Verify against Kaveri (land records) database"""
        if survey_number in self.MOCK_KAVERI:
            return {
                "verified": True,
                "data": self.MOCK_KAVERI[survey_number]
            }
        return {"verified": False, "data": None}
    
    def verify_dharani(self, document_id: str) -> Dict:
        """Verify against Dharani (property registry) database"""
        if document_id in self.MOCK_DHARANI:
            return {
                "verified": True,
                "data": self.MOCK_DHARANI[document_id]
            }
        return {"verified": False, "data": None}
    
    def verify_igr(self, registration_data: Dict) -> Dict:
        """Verify against IGR (stamp duty) database"""
        return {
            "verified": random.random() < 0.85,
            "stamp_duty_paid": random.random() < 0.9,
            "registration_number": f"IGR-{random.randint(100000, 999999)}"
        }
    
    def verify_traces(self, financial_data: Dict) -> Dict:
        """Verify against TRACES (tax) database"""
        return {
            "verified": random.random() < 0.9,
            "income_matched": random.random() < 0.85,
            "filing_status": "filed"
        }
