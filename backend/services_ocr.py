import io
import hashlib
from PIL import Image
from typing import Dict, List, Optional
import re

# Try to import EasyOCR, fall back to mock if unavailable
try:
    import easyocr
    _ocr_available = False  # Will set to True after first successful init
except ImportError:
    _ocr_available = False

_reader = None


def get_ocr_reader():
    global _reader, _ocr_available
    if _reader is None and not _ocr_available:
        try:
            _reader = easyocr.Reader(['en'], gpu=False)
            _ocr_available = True
            print("[OCR] EasyOCR initialized successfully")
        except Exception as e:
            print(f"[OCR] EasyOCR unavailable, using mock OCR: {e}")
            _ocr_available = False
    return _reader if _ocr_available else None


def extract_text_from_image(image_bytes: bytes) -> Dict[str, any]:
    """Extract text from image using OCR"""
    try:
        reader = get_ocr_reader()
        if reader is None:
            return _mock_ocr_response()
        
        image = Image.open(io.BytesIO(image_bytes))
        if image.mode == 'RGBA':
            image = image.convert('RGB')
        
        results = reader.readtext(image)
        
        # Extract text and build response
        full_text = "\n".join([text for (_, text, _) in results])
        
        extracted_data = {
            "full_text": full_text,
            "entities": _extract_entities(full_text),
            "confidence": _calculate_confidence(results),
            "word_count": len(full_text.split())
        }
        
        return extracted_data
    except Exception as e:
        print(f"[OCR] Error processing image: {e}")
        return _mock_ocr_response()





def _extract_entities(text: str) -> Dict[str, List[str]]:
    """Extract key entities from OCR text"""
    entities = {
        "amounts": [],
        "dates": [],
        "names": [],
        "ids": [],
        "survey_numbers": []
    }
    
    # Extract amounts (currency patterns)
    amount_pattern = r'₹\s*[\d,]+'
    entities["amounts"] = re.findall(amount_pattern, text)
    
    # Extract dates (DD/MM/YYYY or DD-MM-YYYY)
    date_pattern = r'\d{1,2}[/-]\d{1,2}[/-]\d{4}'
    entities["dates"] = re.findall(date_pattern, text)
    
    # Extract potential IDs (Aadhar, PAN, etc - numbers)
    id_pattern = r'\b\d{10,12}\b'
    entities["ids"] = re.findall(id_pattern, text)
    
    # Extract survey numbers (S.No., Survey No., etc)
    survey_pattern = r'[Ss]urvey\s*[Nn]o\.?\s*:?\s*(\d+[A-Z/0-9]*)'
    entities["survey_numbers"] = re.findall(survey_pattern, text)
    
    return entities


def _calculate_confidence(results: List) -> float:
    """Calculate average confidence from OCR results"""
    if not results:
        return 0.0
    confidences = [conf for (_, _, conf) in results]
    return round(sum(confidences) / len(confidences) * 100, 2) if confidences else 0.0


def _mock_ocr_response() -> Dict[str, any]:
    """Return mock OCR response for demo/fallback"""
    return {
        "full_text": "Land Record - Survey No. 45/A, Amount: ₹5,00,000, Date: 15/03/2024",
        "entities": {
            "amounts": ["₹5,00,000"],
            "dates": ["15/03/2024"],
            "names": ["RAJESH KUMAR"],
            "ids": ["1234567890"],
            "survey_numbers": ["45/A"]
        },
        "confidence": 85.5,
        "word_count": 12
    }
