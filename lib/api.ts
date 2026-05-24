const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export interface VerificationResult {
  verification_id: number;
  verdict_id: number;
  verdict: 'RED' | 'AMBER' | 'GREEN';
  confidence: number;
  processing_time_ms: number;
  reasons: string[];
  authority_status: Record<string, any>;
  ledger_status: Record<string, any>;
}

export interface VerificationDetails {
  document: {
    id: number;
    filename: string;
    upload_time: string;
  };
  verification: {
    id: number;
    ocr_text: string;
    perceptual_hash: string;
    semantic_hash: string;
    structural_hash: string;
    composite_fingerprint: string;
  };
  verdict: {
    verdict: string;
    confidence: number;
    reasons: string[];
    fraud_details: Record<string, any>;
  };
  ledger_status: Record<string, any>;
}

export interface VerificationHistoryItem {
  verification_id: number;
  filename: string;
  verdict: string;
  confidence: number;
  upload_time: string;
  processing_time_ms: number;
}

export async function uploadDocument(file: File): Promise<{
  id: number;
  filename: string;
  file_hash: string;
  upload_time: string;
}> {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(`${API_BASE}/api/upload`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: 'Upload failed' }));
    throw new Error(error.detail || 'Upload failed');
  }

  return response.json();
}

export async function verifyDocument(documentId: number): Promise<VerificationResult> {
  const response = await fetch(`${API_BASE}/api/verify/${documentId}`, {
    method: 'POST',
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: 'Verification failed' }));
    throw new Error(error.detail || 'Verification failed');
  }

  return response.json();
}

export async function getVerificationDetails(
  verificationId: number
): Promise<VerificationDetails> {
  const response = await fetch(`${API_BASE}/api/verifications/${verificationId}`);

  if (!response.ok) {
    throw new Error('Failed to fetch verification details');
  }

  return response.json();
}

export async function getVerificationHistory(
  skip: number = 0,
  limit: number = 10
): Promise<{
  items: VerificationHistoryItem[];
  count: number;
}> {
  const response = await fetch(
    `${API_BASE}/api/verifications?skip=${skip}&limit=${limit}`
  );

  if (!response.ok) {
    throw new Error('Failed to fetch verification history');
  }

  return response.json();
}

export async function getAnalytics(): Promise<any> {
  const response = await fetch(`${API_BASE}/api/analytics`);

  if (!response.ok) {
    throw new Error('Failed to fetch analytics');
  }

  return response.json();
}

export async function getDemoData(): Promise<any> {
  const response = await fetch(`${API_BASE}/api/demo`, {
    method: 'POST',
  });

  if (!response.ok) {
    throw new Error('Failed to fetch demo data');
  }

  return response.json();
}
