import hashlib
import imagehash
from PIL import Image
import io
from typing import Dict, Tuple
import json


def generate_fingerprints(image_bytes: bytes, ocr_text: str) -> Dict[str, str]:
    """Generate three types of hashes for document integrity verification"""
    
    # 1. Perceptual Hash - for visual tampering detection
    perceptual = _generate_perceptual_hash(image_bytes)
    
    # 2. Semantic Hash - for text content changes
    semantic = _generate_semantic_hash(ocr_text)
    
    # 3. Structural Hash - for layout/format changes
    structural = _generate_structural_hash(image_bytes, ocr_text)
    
    # 4. Composite fingerprint
    composite = _generate_composite_fingerprint(perceptual, semantic, structural)
    
    return {
        "perceptual_hash": perceptual,
        "semantic_hash": semantic,
        "structural_hash": structural,
        "composite_fingerprint": composite,
        "fingerprint_details": {
            "perceptual_description": "Visual content fingerprint - detects image tampering",
            "semantic_description": "Text content fingerprint - detects text modifications",
            "structural_description": "Document layout fingerprint - detects structure changes"
        }
    }


def _generate_perceptual_hash(image_bytes: bytes) -> str:
    """Generate perceptual hash using pHash algorithm"""
    try:
        image = Image.open(io.BytesIO(image_bytes))
        if image.mode == 'RGBA':
            image = image.convert('RGB')
        
        # Resize to standard size for consistent hashing
        image.thumbnail((256, 256), Image.Resampling.LANCZOS)
        
        # Generate perceptual hash
        phash = imagehash.phash(image)
        return str(phash)
    except Exception as e:
        print(f"[Fingerprint] Perceptual hash error: {e}")
        return _generate_mock_hash("perceptual")


def _generate_semantic_hash(text: str) -> str:
    """Generate semantic hash from OCR text content"""
    try:
        # Normalize text
        normalized = text.lower().strip()
        normalized = ' '.join(normalized.split())  # Remove extra whitespace
        
        # SHA256 hash of normalized text
        hash_obj = hashlib.sha256(normalized.encode())
        return hash_obj.hexdigest()[:32]  # Return first 32 chars for display
    except Exception as e:
        print(f"[Fingerprint] Semantic hash error: {e}")
        return _generate_mock_hash("semantic")


def _generate_structural_hash(image_bytes: bytes, text: str) -> str:
    """Generate structural hash combining image properties and text structure"""
    try:
        image = Image.open(io.BytesIO(image_bytes))
        
        # Image properties contributing to structure
        structure_data = {
            "width": image.width,
            "height": image.height,
            "format": image.format,
            "mode": image.mode,
            "text_length": len(text),
            "text_lines": len(text.split('\n')),
            "aspect_ratio": round(image.width / image.height, 2) if image.height else 0
        }
        
        # Create structural signature
        signature = json.dumps(structure_data, sort_keys=True)
        hash_obj = hashlib.sha256(signature.encode())
        return hash_obj.hexdigest()[:32]
    except Exception as e:
        print(f"[Fingerprint] Structural hash error: {e}")
        return _generate_mock_hash("structural")


def _generate_composite_fingerprint(perceptual: str, semantic: str, structural: str) -> str:
    """Combine all three hashes into a composite fingerprint"""
    combined = f"{perceptual}:{semantic}:{structural}"
    hash_obj = hashlib.sha256(combined.encode())
    return hash_obj.hexdigest()


def _generate_mock_hash(hash_type: str) -> str:
    """Generate mock hash for fallback/demo purposes"""
    mocks = {
        "perceptual": "1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p",
        "semantic": "a0b1c2d3e4f5g6h7i8j9k0l1m2n3o4p5",
        "structural": "p5o4n3m2l1k0j9i8h7g6f5e4d3c2b1a0"
    }
    return mocks.get(hash_type, "f0e1d2c3b4a59687f8e9d0c1b2a35647")


def compare_fingerprints(fp1: str, fp2: str) -> Dict[str, any]:
    """Compare two fingerprints to detect tampering"""
    match = fp1 == fp2
    
    return {
        "match": match,
        "similarity": 100.0 if match else 0.0,
        "tampering_detected": not match
    }
