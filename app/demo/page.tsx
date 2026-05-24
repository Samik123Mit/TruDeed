'use client';

import { motion } from 'framer-motion';
import { Shield, ArrowRight } from 'lucide-react';
import { VerdictCard } from '@/components/verdict-card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const demoExamples = [
  {
    name: 'Authentic Land Record',
    verdict: 'GREEN' as const,
    confidence: 94,
    reasons: ['Document matches authority records', 'All signatures verified', 'No tampering detected'],
  },
  {
    name: 'Tampered Bank Statement',
    verdict: 'RED' as const,
    confidence: 98,
    reasons: ['Critical amount modification detected', 'Layout tampering identified', 'Duplicate submission found in ledger'],
  },
  {
    name: 'Modified ITR Document',
    verdict: 'AMBER' as const,
    confidence: 76,
    reasons: ['Minor layout inconsistencies detected', 'OCR confidence lower than expected', 'Manual review recommended'],
  },
];

export default function DemoPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Shield className="w-8 h-8 text-neon-cyan" />
            <h1 className="text-2xl font-bold">TruDeed Demo</h1>
          </div>
          <Link href="/dashboard">
            <Button variant="outline">Back to Dashboard</Button>
          </Link>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 text-center"
        >
          <h2 className="text-4xl font-bold mb-4">Fraud Detection Examples</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            See how TruDeed detects authentic documents, suspicious cases, and outright fraud using advanced AI analysis.
          </p>
        </motion.div>

        <div className="space-y-12">
          {demoExamples.map((example, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.2 }}
              className="space-y-4"
            >
              <div>
                <h3 className="text-xl font-semibold mb-2">{example.name}</h3>
                <p className="text-muted-foreground text-sm">
                  {idx === 0 && 'A genuine land record that passes all verification checks.'}
                  {idx === 1 && 'A document with critical tampering in monetary values and structure.'}
                  {idx === 2 && 'A document with minor inconsistencies requiring manual review.'}
                </p>
              </div>
              <VerdictCard
                verdict={example.verdict}
                confidence={example.confidence}
                reasons={example.reasons}
              />
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-16 text-center"
        >
          <h3 className="text-2xl font-bold mb-4">Ready to Detect Real Fraud?</h3>
          <p className="text-muted-foreground mb-8">
            Upload your own documents to see TruDeed in action
          </p>
          <Link href="/dashboard">
            <Button className="bg-neon-cyan text-background hover:bg-neon-cyan/80 text-base px-8 py-6">
              Upload Document <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
