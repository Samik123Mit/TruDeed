'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Shield, Activity, TrendingUp, AlertCircle, RefreshCw } from 'lucide-react';
import { UploadZone } from '@/components/upload-zone';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { uploadDocument, verifyDocument, getVerificationHistory, getAnalytics } from '@/lib/api';
import { useStore } from '@/lib/store';
import Link from 'next/link';

export default function DashboardPage() {
  const router = useRouter();
  const { setIsLoading, setError, error, demoMode, setDemoMode } = useStore();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [verifications, setVerifications] = useState<any[]>([]);
  const [analytics, setAnalytics] = useState<any>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [historyData, analyticsData] = await Promise.all([
          getVerificationHistory(0, 5),
          getAnalytics(),
        ]);
        setVerifications(historyData.items);
        setAnalytics(analyticsData);
      } catch (err) {
        console.log('[Dashboard] Initial load error (expected if backend not ready)');
      }
    };

    loadData();
  }, []);

  const handleFileSelected = (file: File) => {
    setSelectedFile(file);
  };

  const handleVerify = async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    setError(null);

    try {
      // Upload document
      const uploadRes = await uploadDocument(selectedFile);
      
      // Verify document
      const verifyRes = await verifyDocument(uploadRes.id);
      
      // Redirect to results
      router.push(`/verify/${verifyRes.verification_id}`);
    } catch (err: any) {
      setError(err.message || 'Verification failed');
      setIsUploading(false);
    }
  };

  const handleDemoMode = async () => {
    setDemoMode(!demoMode);
    if (!demoMode) {
      // Load demo verdicts
      router.push('/demo');
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Shield className="w-8 h-8 text-neon-cyan" />
            <h1 className="text-2xl font-bold">TruDeed Dashboard</h1>
          </div>
          <div className="flex items-center gap-4">
            <Button
              onClick={handleDemoMode}
              variant={demoMode ? 'default' : 'outline'}
              className={demoMode ? 'bg-neon-cyan text-background' : ''}
            >
              Demo Mode
            </Button>
            <Link href="/">
              <Button variant="outline">Home</Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Upload Section */}
        <div className="mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h2 className="text-3xl font-bold mb-2">Upload Document for Verification</h2>
            <p className="text-muted-foreground">
              Upload land records, deeds, financial statements, or any legal document
            </p>
          </motion.div>

          <UploadZone onFileSelected={handleFileSelected} isLoading={isUploading} />

          {error && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 p-4 rounded-lg bg-red-500/10 border border-red-500/30 flex gap-3"
            >
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-200">{error}</p>
            </motion.div>
          )}

          {selectedFile && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-8 flex justify-center"
            >
              <Button
                onClick={handleVerify}
                disabled={isUploading}
                className="bg-neon-cyan text-background hover:bg-neon-cyan/80 text-base px-8 py-6"
              >
                {isUploading ? (
                  <>
                    <RefreshCw className="mr-2 h-5 w-5 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  <>
                    Start Verification
                  </>
                )}
              </Button>
            </motion.div>
          )}
        </div>

        {/* Analytics Grid */}
        {analytics && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mb-16"
          >
            <h2 className="text-3xl font-bold mb-8">Analytics</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[
                {
                  label: 'Total Verifications',
                  value: analytics.stats.total_verifications,
                  icon: Activity,
                  color: 'text-neon-cyan',
                },
                {
                  label: 'Fraud Detected (RED)',
                  value: analytics.stats.red_count,
                  icon: AlertCircle,
                  color: 'text-red-500',
                },
                {
                  label: 'Suspicious (AMBER)',
                  value: analytics.stats.amber_count,
                  icon: AlertCircle,
                  color: 'text-amber-500',
                },
                {
                  label: 'Authentic (GREEN)',
                  value: analytics.stats.green_count,
                  icon: Shield,
                  color: 'text-green-500',
                },
              ].map((stat, idx) => {
                const Icon = stat.icon;
                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                  >
                    <Card className="p-6 border border-border hover:border-neon-cyan/50 transition-colors">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-muted-foreground text-sm mb-2">{stat.label}</p>
                          <p className="text-4xl font-bold">{stat.value}</p>
                        </div>
                        <Icon className={`w-8 h-8 ${stat.color}`} />
                      </div>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* Recent Verifications */}
        {verifications.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <h2 className="text-3xl font-bold mb-8">Recent Verifications</h2>
            <Card className="border border-border overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-card/50 border-b border-border">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold">Filename</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold">Verdict</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold">Confidence</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold">Time</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {verifications.map((v, idx) => {
                      const verdictColors: any = {
                        RED: 'text-red-500',
                        AMBER: 'text-amber-500',
                        GREEN: 'text-green-500',
                      };
                      return (
                        <motion.tr
                          key={idx}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: idx * 0.05 }}
                          className="border-b border-border hover:bg-card/50 transition-colors"
                        >
                          <td className="px-6 py-4 text-sm">{v.filename}</td>
                          <td className={`px-6 py-4 text-sm font-semibold ${verdictColors[v.verdict]}`}>
                            {v.verdict}
                          </td>
                          <td className="px-6 py-4 text-sm">{v.confidence}%</td>
                          <td className="px-6 py-4 text-sm text-muted-foreground">
                            {new Date(v.upload_time).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 text-sm">
                            <Link href={`/verify/${v.verification_id}`}>
                              <Button variant="ghost" size="sm" className="text-neon-cyan hover:text-neon-cyan">
                                View
                              </Button>
                            </Link>
                          </td>
                        </motion.tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
}
