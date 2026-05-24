# TruDeed - Real-time Document Fraud Detection Platform

A cutting-edge AI-powered document integrity and fraud detection system for banks. Built for hackathons with a focus on visual wow factor and ultra-fast setup.

## Overview

TruDeed is a full-stack fraud detection platform that verifies land records, sale deeds, financial statements, bank statements, and ITRs in real-time. The system:

1. **Extracts** OCR text from uploaded documents
2. **Generates** visual/text/layout fingerprints (perceptual, semantic, structural hashes)
3. **Detects** fraud patterns using AI-powered rules
4. **Verifies** against mock authority APIs (Kaveri, Dharani, IGR, TRACES)
5. **Checks** federated ledger history for duplicates
6. **Returns** fraud verdict: GREEN (authentic) / AMBER (suspicious) / RED (tampered/fraud)

## Quick Start (2 Minutes)

### Prerequisites
- Docker & Docker Compose installed
- 4GB RAM minimum

### Setup & Run

```bash
# 1. Clone repository
git clone <repo-url>
cd trudeed

# 2. Start all services
docker-compose up

# 3. Wait for services to be ready (30-60 seconds)
# You'll see:
# - frontend: ready on http://localhost:3000
# - backend: ready on http://localhost:8000

# 4. Open browser
open http://localhost:3000

# 5. Start verifying documents!
# - Click "Launch App"
# - Upload a document
# - Get instant fraud verdict
```

### Without Docker (Local Development)

#### Frontend Setup
```bash
# Install dependencies
pnpm install

# Run dev server
pnpm dev
# Open http://localhost:3000
```

#### Backend Setup
```bash
# Create virtual environment
cd backend
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run server
uvicorn main:app --reload
# Backend ready on http://localhost:8000
```

## Demo Mode

Click **"Demo Mode"** button on the dashboard to instantly view:
- ✅ Authentic Land Record (GREEN verdict)
- ⚠️ Tampered Bank Statement (RED verdict)  
- ⚠️ Modified ITR (AMBER verdict)

No document upload or processing required - perfect for hackathon demos!

## Architecture

### Frontend (Next.js 15)
- Modern cybersecurity fintech UI
- Dark mode with cyan/teal neon accents
- Framer Motion animations
- Real-time verification visualization
- Responsive design

**Key Pages:**
- `/` - Landing page with workflow visualization
- `/dashboard` - Upload & analytics dashboard
- `/verify/[id]` - Detailed fraud detection results

### Backend (FastAPI + SQLite)
- REST API with CORS support
- SQLite database (no external dependencies)
- Async request handling
- Mock authority verification services
- Federated ledger simulation

**Key Endpoints:**
- `POST /api/upload` - Upload document
- `POST /api/verify/{id}` - Run fraud detection
- `GET /api/verifications/{id}` - Get results
- `GET /api/verifications` - History
- `GET /api/analytics` - Dashboard stats
- `POST /api/demo` - Demo data

## Technology Stack

### Frontend
- **Framework**: Next.js 15 (App Router)
- **Styling**: TailwindCSS + custom cybersecurity theme
- **Animations**: Framer Motion
- **State**: Zustand
- **UI Components**: Shadcn UI
- **Charts**: Recharts

### Backend
- **Framework**: FastAPI
- **Database**: SQLite3
- **OCR**: EasyOCR
- **Hashing**: imagehash, hashlib
- **Async**: asyncio, aiosqlite

### Deployment
- **Containerization**: Docker & Docker Compose
- **Frontend Hosting**: Vercel-ready (next build)
- **Backend Hosting**: Railway/Render-ready

## Features

### Document Verification
- Multi-format support (PDF, PNG, JPG)
- Instant OCR text extraction
- Three-layer cryptographic fingerprinting
- Real-time fraud detection

### Fraud Detection
- **Perceptual Hash**: Detects visual tampering
- **Semantic Hash**: Detects text modifications
- **Structural Hash**: Detects layout changes
- **Authority Verification**: Cross-checks with government databases (mocked)
- **Ledger History**: Duplicate detection and verification chain

### User Interface
- **Verdict Card**: Large, glowing fraud verdict (RED/AMBER/GREEN)
- **Analytics Dashboard**: Fraud trends, risk distribution
- **Verification Timeline**: Step-by-step pipeline visualization
- **Fingerprint Viewer**: Detailed hash analysis

### Mock Authority APIs
- **Kaveri**: Land records database
- **Dharani**: Property registry
- **IGR**: Stamp duty & registration
- **TRACES**: Income tax verification

## File Structure

```
trudeed/
├── app/                              # Next.js pages
│   ├── page.tsx                      # Landing page
│   ├── dashboard/page.tsx            # Dashboard
│   ├── verify/[id]/page.tsx          # Results
│   ├── layout.tsx                    # Root layout
│   └── globals.css                   # Theme & styles
│
├── components/                       # React components
│   ├── verdict-card.tsx              # Fraud verdict display
│   ├── upload-zone.tsx               # Drag-drop upload
│   └── ui/                           # Shadcn components
│
├── lib/
│   ├── api.ts                        # API client
│   └── store.ts                      # Zustand store
│
├── backend/                          # FastAPI application
│   ├── main.py                       # FastAPI app & routes
│   ├── models.py                     # SQLAlchemy models
│   ├── schemas.py                    # Pydantic schemas
│   ├── database.py                   # Database setup
│   ├── services_ocr.py               # OCR service
│   ├── services_fingerprint.py       # Fingerprint generation
│   ├── services_fraud.py             # Fraud detection engine
│   ├── services_authority.py         # Authority verification
│   ├── services_ledger.py            # Ledger history
│   ├── requirements.txt              # Python dependencies
│   └── Dockerfile                    # Backend image
│
├── docker-compose.yml                # Docker orchestration
├── Dockerfile.frontend               # Frontend image
├── package.json                      # Frontend dependencies
├── tailwind.config.ts                # TailwindCSS config
└── tsconfig.json                     # TypeScript config
```

## Database Schema

### Documents Table
```sql
- id: integer (primary key)
- filename: string
- file_hash: string (unique, indexed)
- file_path: string
- upload_time: datetime
- status: string (uploaded/processing/verified)
```

### Verifications Table
```sql
- id: integer (primary key)
- document_id: integer (foreign key)
- ocr_text: text
- perceptual_hash: string
- semantic_hash: string
- structural_hash: string
- composite_fingerprint: string
- created_at: datetime
```

### Verdicts Table
```sql
- id: integer (primary key)
- verification_id: integer (foreign key)
- verdict: string (RED/AMBER/GREEN)
- confidence: float (0-100)
- reasons: json (list of fraud reasons)
- fraud_details: json (detailed analysis)
- created_at: datetime
```

### LedgerHistory Table
```sql
- id: integer (primary key)
- fingerprint: string (indexed)
- verdict: string
- document_type: string
- is_duplicate: boolean
- created_at: datetime
```

## Configuration

### Environment Variables

Create `.env.local` in frontend root:
```
NEXT_PUBLIC_API_URL=http://localhost:8000
```

Backend uses `.env`:
```
DATABASE_URL=sqlite:///./trudeed.db
PYTHONUNBUFFERED=1
```

## Fraud Detection Logic

The system detects fraud through multiple indicators:

1. **Amount Tampering**: Variance in monetary values
2. **Duplicate Submission**: Fingerprint matches in ledger history
3. **Layout Anomalies**: Unusual document structure
4. **Text Inconsistencies**: Suspicious keywords, date mismatches
5. **Authority Mismatch**: Record not found in databases
6. **Date Validity**: Invalid or future dates

**Verdict Rules:**
- **RED**: 3+ indicators OR critical tampering detected
- **AMBER**: 1-2 indicators OR high suspicion
- **GREEN**: No indicators OR matches authority records

## Performance

- **Upload**: <1 second
- **OCR**: 1-2 seconds
- **Fingerprinting**: <0.5 seconds
- **Fraud Detection**: <0.5 seconds
- **Total**: ~3 seconds for full verification

The UI provides instant feedback with staged animations for a faster perceived experience.

## Customization

### Change Color Scheme

Edit `/app/globals.css`:
```css
:root {
  --primary: #your-color;
  --accent: #your-color;
  --verdict-red: #your-red;
  --verdict-amber: #your-amber;
  --verdict-green: #your-green;
}
```

### Add New Fraud Rules

Edit `backend/services_fraud.py`:
```python
def _check_your_rule(self, ocr_data, confidence, ledger):
    # Implement rule logic
    return {
        "detected": True/False,
        "code": "YOUR_RULE_CODE",
        "score": 0-100,
        "reason": "Description"
    }
```

### Integrate Real Authority APIs

Replace mock services in `backend/services_authority.py` with actual API calls:
```python
def verify_kaveri(self, survey_number: str):
    response = requests.get(f"https://kaveri-api.gov.in/verify/{survey_number}")
    # Process response
```

## Deployment

### Deploy Frontend to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Deploy Backend to Railway/Render

Railway:
```bash
# Connect GitHub repo to Railway
# Set DATABASE_URL env var
# Deploy
```

Render:
```bash
# Connect GitHub repo to Render
# Set DATABASE_URL env var
# Deploy
```

## API Documentation

### POST /api/upload
Upload a document for verification.

**Request:**
```
Content-Type: multipart/form-data
file: <binary>
```

**Response:**
```json
{
  "id": 1,
  "filename": "document.pdf",
  "file_hash": "abc123...",
  "upload_time": "2024-05-24T10:30:00"
}
```

### POST /api/verify/{document_id}
Run full fraud detection verification.

**Response:**
```json
{
  "verification_id": 1,
  "verdict": "RED",
  "confidence": 92,
  "reasons": ["Amount tampering detected", "..."],
  "processing_time_ms": 2500,
  "authority_status": {...},
  "ledger_status": {...}
}
```

### GET /api/verifications/{verification_id}
Get detailed verification results.

### GET /api/verifications
Get verification history (paginated).

### GET /api/analytics
Get dashboard analytics data.

## Troubleshooting

### Backend won't start
```bash
# Check database file
ls -la backend/trudeed.db

# Clear and reinit
rm backend/trudeed.db
python backend/main.py  # Runs init_db on startup
```

### Frontend can't connect to backend
```bash
# Verify backend is running
curl http://localhost:8000/health

# Check env variable
echo $NEXT_PUBLIC_API_URL

# Update docker-compose if needed
# Ensure network is correct
```

### OCR not working
```bash
# OCR model downloads on first run (large file ~200MB)
# Check backend logs for download progress
# Fallback to mock OCR if network issue
```

## License

MIT License - Built for hackathon

## Support

For issues or questions:
1. Check troubleshooting section above
2. Review backend logs: `docker-compose logs backend`
3. Review frontend logs: `docker-compose logs frontend`
4. Check API health: `curl http://localhost:8000/health`

---

**Built with ❤️ for fraud detection. Speed and security, always.**
