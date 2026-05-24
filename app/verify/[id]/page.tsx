'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { getVerificationDetails } from '@/lib/api';
import { VerdictCard } from '@/components/verdict-card';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Shield, Copy, Check, Home } from 'lucide-react';
import Link from 'next/link';

interface VerificationData {
  document: any;
  verification: any;
  verdict: any;
  ledger_status: any;
}

export default function VerificationResultsPage() {
  const params = useParams();
  const router = useRouter();
  const verificationId = params.id as string;

  const [data, setData] = useState<VerificationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const result = await getVerificationDetails(parseInt(verificationId));
        setData(result);
      } catch (err) {
        console.error('[Verification] Error loading data:', err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [verificationId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            className="w-16 h-16 border-4 border-neon-cyan border-t-transparent rounded-full mx-auto mb-4"
          />
          <p className="text-muted-foreground">Verifying document integrity...</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <Card className="p-8 max-w-md">
          <p className="text-muted-foreground mb-4">Verification not found</p>
          <Link href="/dashboard">
            <Button className="w-full">Back to Dashboard</Button>
          </Link>
        </Card>
      </div>
    );
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Shield className="w-8 h-8 text-neon-cyan" />
            <h1 className="text-2xl font-bold">Verification Result</h1>
          </div>
          <Link href="/dashboard">
            <Button variant="outline">
              <Home className="w-4 h-4 mr-2" />
              Dashboard
            </Button>
          </Link>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-6 py-12 space-y-12">
        {/* Verdict Card - DOMINANT */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <VerdictCard
            verdict={data.verdict.verdict as any}
            confidence={data.verdict.confidence}
            reasons={data.verdict.reasons}
          />
        </motion.div>

        {/* Document Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="text-2xl font-bold mb-6">Document Information</h2>
          <Card className="p-8 border border-neon-cyan/30 hover:border-neon-cyan/60 transition-colors">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-muted-foreground text-sm mb-1">Filename</p>
                  <p className="font-mono text-foreground break-all">{data.document.filename}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-sm mb-1">Upload Time</p>
                  <p className="font-mono text-foreground">
                    {new Date(data.document.upload_time).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Fingerprint Analysis */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <h2 className="text-2xl font-bold mb-6">Cryptographic Fingerprints</h2>
          <div className="space-y-4">
            {[
              {
                title: 'Perceptual Hash (pHash)',
                description: 'Visual content fingerprint - detects image tampering',
                value: data.verification.perceptual_hash,
              },
              {
                title: 'Semantic Hash',
                description: 'Text content fingerprint - detects text modifications',
                value: data.verification.semantic_hash,
              },
              {
                title: 'Structural Hash',
                description: 'Document layout fingerprint - detects structure changes',
                value: data.verification.structural_hash,
              },
            ].map((hash, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + idx * 0.1 }}
              >
                <Card
                  className="p-6 border border-border hover:border-neon-cyan/50 transition-colors cursor-pointer"
                  onClick={() => setExpandedSection(expandedSection === idx ? null : idx)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground mb-1">{hash.title}</h3>
                      <p className="text-sm text-muted-foreground mb-3">{hash.description}</p>
                      {expandedSection === idx && (
                        <div className="mt-4 p-4 bg-card rounded border border-border">
                          <p className="font-mono text-xs text-neon-cyan break-all">{hash.value}</p>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="mt-3 text-neon-cyan hover:bg-neon-cyan/10"
                            onClick={(e) => {
                              e.stopPropagation();
                              copyToClipboard(hash.value);
                            }}
                          >
                            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                            {copied ? 'Copied' : 'Copy'}
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Composite Fingerprint */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <Card className="p-8 border border-neon-cyan/50 bg-card/50">
            <h3 className="font-semibold text-lg mb-3 text-neon-cyan">Composite Fingerprint</h3>
            <div className="bg-background/50 rounded p-4 mb-4">
              <p className="font-mono text-xs text-neon-cyan break-all">
                {data.verification.composite_fingerprint}
              </p>
            </div>
            <p className="text-sm text-muted-foreground">
              This unique fingerprint identifies the document and enables duplicate detection
            </p>
          </Card>
        </motion.div>

        {/* Authority Verification */}
        {data.verdict.fraud_details?.authority_status && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            <h2 className="text-2xl font-bold mb-6">Authority Verification</h2>
            <Card className="p-8 border border-border">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {[
                  { name: 'Kaveri', key: 'kaveri_verified' },
                  { name: 'Dharani', key: 'dharani_verified' },
                  { name: 'IGR', key: 'igr_verified' },
                  { name: 'TRACES', key: 'traces_verified' },
                ].map((auth, idx) => {
                  const verified = data.verdict.fraud_details.authority_status[auth.key];
                  return (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.8 + idx * 0.05 }}
                      className={`p-4 rounded border text-center ${
                        verified
                          ? 'border-green-500/50 bg-green-500/10'
                          : 'border-muted/50 bg-muted/10'
                      }`}
                    >
                      <p className="text-sm font-semibold mb-2">{auth.name}</p>
                      <p className={verified ? 'text-green-500' : 'text-muted-foreground'}>
                        {verified ? 'Verified' : 'Not Found'}
                      </p>
                    </motion.div>
                  );
                })}
              </div>
            </Card>
          </motion.div>
        )}

        {/* OCR Preview */}
        {data.verification.ocr_text && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            <h2 className="text-2xl font-bold mb-6">Extracted Text (OCR)</h2>
            <Card className="p-8 border border-border bg-card/50 max-h-64 overflow-y-auto">
              <p className="text-sm text-foreground whitespace-pre-wrap">
                {data.verification.ocr_text}
              </p>
            </Card>
          </motion.div>
        )}

        {/* Footer Actions */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="flex gap-4 justify-center pt-8"
        >
          <Link href="/dashboard">
            <Button className="bg-neon-cyan text-background hover:bg-neon-cyan/80">
              Verify Another Document
            </Button>
          </Link>
          <Button variant="outline">Download Report</Button>
        </motion.div>
      </div>
    </div>
  );
}
