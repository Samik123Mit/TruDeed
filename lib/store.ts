import { create } from 'zustand';

export interface Document {
  id: number;
  filename: string;
  file_hash: string;
  upload_time: string;
}

export interface Verification {
  id: number;
  document_id: number;
  verification_id?: number;
  verdict: 'RED' | 'AMBER' | 'GREEN';
  confidence: number;
  processing_time_ms: number;
  reasons: string[];
  authority_status?: Record<string, any>;
  ledger_status?: Record<string, any>;
}

interface Store {
  // Documents
  documents: Document[];
  setDocuments: (docs: Document[]) => void;
  addDocument: (doc: Document) => void;
  currentDocument: Document | null;
  setCurrentDocument: (doc: Document | null) => void;

  // Verifications
  verifications: Verification[];
  setVerifications: (verifes: Verification[]) => void;
  addVerification: (verify: Verification) => void;
  currentVerification: Verification | null;
  setCurrentVerification: (verify: Verification | null) => void;

  // UI State
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  error: string | null;
  setError: (error: string | null) => void;
  demoMode: boolean;
  setDemoMode: (enabled: boolean) => void;

  // Analytics
  analyticsData: any;
  setAnalyticsData: (data: any) => void;
}

export const useStore = create<Store>((set) => ({
  // Documents
  documents: [],
  setDocuments: (docs) => set({ documents: docs }),
  addDocument: (doc) =>
    set((state) => ({
      documents: [doc, ...state.documents],
      currentDocument: doc,
    })),
  currentDocument: null,
  setCurrentDocument: (doc) => set({ currentDocument: doc }),

  // Verifications
  verifications: [],
  setVerifications: (verifes) => set({ verifications: verifes }),
  addVerification: (verify) =>
    set((state) => ({
      verifications: [verify, ...state.verifications],
      currentVerification: verify,
    })),
  currentVerification: null,
  setCurrentVerification: (verify) => set({ currentVerification: verify }),

  // UI State
  isLoading: false,
  setIsLoading: (loading) => set({ isLoading: loading }),
  error: null,
  setError: (error) => set({ error }),
  demoMode: false,
  setDemoMode: (enabled) => set({ demoMode: enabled }),

  // Analytics
  analyticsData: null,
  setAnalyticsData: (data) => set({ analyticsData: data }),
}));
