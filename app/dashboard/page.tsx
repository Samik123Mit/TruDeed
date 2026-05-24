'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Shield, RefreshCw, AlertCircle, ChevronDown, Filter, Download } from 'lucide-react';
import { UploadZone } from '@/components/upload-zone';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { AdvancedStats, RiskMetrics } from '@/components/advanced-stats';
import { ActivityFeed } from '@/components/activity-feed';
import { AlertsPanel } from '@/components/alerts-panel';
import { VerificationTrendChart, VerdictDistributionChart, FraudCategoryChart, ProcessingTimeChart } from '@/components/fraud-chart';
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
  const [expandedSection, setExpandedSection] = useState<string | null>('upload');

  useEffect(() => {
    const loadData = async () => {
      try {
        const [historyData, analyticsData] = await Promise.all([
          getVerificationHistory(0, 10),
          getAnalytics(),
        ]);
        setVerifications(historyData.items);
        setAnalytics(analyticsData);
      } catch (err) {
        console.log('[Dashboard] Initial load error (expected if backend not ready)');
      }
    };

    loadData();
    const interval = setInterval(loadData, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleFileSelected = (file: File) => {
    setSelectedFile(file);
  };

  const handleVerify = async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    setError(null);

    try {
      const uploadRes = await uploadDocument(selectedFile);
      const verifyRes = await verifyDocument(uploadRes.id);
      router.push(`/verify/${verifyRes.verification_id}`);
    } catch (err: any) {
      setError(err.message || 'Verification failed');
      setIsUploading(false);
    }
  };

  const handleDemoMode = async () => {
    setDemoMode(!demoMode);
    if (!demoMode) {
      router.push('/demo');
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="border-b border-border bg-gradient-to-r from-card/50 to-transparent backdrop-blur-lg sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-gradient-to-br from-neon-cyan to-neon-blue">
                <Shield className="w-6 h-6 text-background" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">TruDeed</h1>
                <p className="text-xs text-muted-foreground">Enterprise Fraud Detection</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button
                onClick={handleDemoMode}
                variant={demoMode ? 'default' : 'outline'}
                className={demoMode ? 'bg-neon-cyan text-background hover:bg-neon-cyan/80' : 'border-neon-cyan text-neon-cyan'}
              >
                {demoMode ? '✓ Demo Active' : 'Demo Mode'}
              </Button>
              <Button variant="ghost" size="icon" className="text-neon-cyan">
                <Download className="w-5 h-5" />
              </Button>
              <Link href="/">
                <Button variant="outline" className="border-border hover:border-neon-cyan">
                  Home
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Advanced Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <AdvancedStats />
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Left Column - Upload & Charts */}
          <div className="lg:col-span-2 space-y-8">
            {/* Upload Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="border border-neon-cyan/30 bg-card/50 overflow-hidden">
                <div
                  className="p-6 cursor-pointer flex items-center justify-between hover:bg-card/50 transition-colors"
                  onClick={() => setExpandedSection(expandedSection === 'upload' ? null : 'upload')}
                >
                  <div>
                    <h2 className="text-xl font-bold">Upload Document</h2>
                    <p className="text-sm text-muted-foreground mt-1">Land records, deeds, statements, ITRs</p>
                  </div>
                  <motion.div
                    animate={{ rotate: expandedSection === 'upload' ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ChevronDown className="w-5 h-5 text-neon-cyan" />
                  </motion.div>
                </div>

                <motion.div
                  initial={false}
                  animate={{ height: expandedSection === 'upload' ? 'auto' : 0, opacity: expandedSection === 'upload' ? 1 : 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="px-6 pb-6 border-t border-border">
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
                        className="mt-8 flex flex-col gap-3"
                      >
                        <div className="p-3 rounded-lg bg-card border border-neon-cyan/30">
                          <p className="text-sm font-medium truncate">{selectedFile.name}</p>
                          <p className="text-xs text-muted-foreground mt-1">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                        </div>
                        <Button
                          onClick={handleVerify}
                          disabled={isUploading}
                          className="bg-neon-cyan text-background hover:bg-neon-cyan/80 w-full"
                        >
                          {isUploading ? (
                            <>
                              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                              Verifying...
                            </>
                          ) : (
                            'Start Verification'
                          )}
                        </Button>
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              </Card>
            </motion.div>

            {/* Charts Grid */}
            <div className="space-y-8">
              <VerificationTrendChart />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <VerdictDistributionChart />
                <FraudCategoryChart />
              </div>
              <ProcessingTimeChart />
            </div>
          </div>

          {/* Right Column - Activity & Alerts */}
          <div className="space-y-8">
            <ActivityFeed />
            <RiskMetrics />
            <AlertsPanel />
          </div>
        </div>

        {/* Recent Verifications Table */}
        {verifications.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Verification History</h2>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="gap-2">
                  <Filter className="w-4 h-4" />
                  Filter
                </Button>
              </div>
            </div>

            <Card className="border border-border overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-card/50 border-b border-border">
                    <tr>
                      <th className="px-6 py-4 text-left font-semibold">Filename</th>
                      <th className="px-6 py-4 text-left font-semibold">Type</th>
                      <th className="px-6 py-4 text-left font-semibold">Verdict</th>
                      <th className="px-6 py-4 text-left font-semibold">Confidence</th>
                      <th className="px-6 py-4 text-left font-semibold">Processing</th>
                      <th className="px-6 py-4 text-left font-semibold">Time</th>
                      <th className="px-6 py-4 text-left font-semibold">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {verifications.slice(0, 10).map((v, idx) => {
                      const verdictColors: any = {
                        RED: 'bg-red-500/10 text-red-400 font-semibold px-3 py-1 rounded-full text-xs',
                        AMBER: 'bg-amber-500/10 text-amber-400 font-semibold px-3 py-1 rounded-full text-xs',
                        GREEN: 'bg-green-500/10 text-green-400 font-semibold px-3 py-1 rounded-full text-xs',
                      };

                      const getFileType = (filename: string) => {
                        const ext = filename.split('.').pop()?.toUpperCase() || 'DOC';
                        const typeMap: any = {
                          PDF: 'land_record',
                          JPG: 'deed',
                          PNG: 'statement',
                          JPEG: 'itr',
                        };
                        return typeMap[ext] || ext;
                      };

                      return (
                        <motion.tr
                          key={idx}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: idx * 0.05 }}
                          className="border-b border-border hover:bg-card/50 transition-colors"
                        >
                          <td className="px-6 py-4 font-medium truncate max-w-xs">{v.filename}</td>
                          <td className="px-6 py-4 text-muted-foreground capitalize text-xs">{getFileType(v.filename)}</td>
                          <td className="px-6 py-4">
                            <span className={verdictColors[v.verdict]}>{v.verdict}</span>
                          </td>
                          <td className="px-6 py-4 font-semibold">{v.confidence}%</td>
                          <td className="px-6 py-4 text-muted-foreground">
                            <span className="text-neon-cyan">{v.processing_time_ms || 2300}ms</span>
                          </td>
                          <td className="px-6 py-4 text-muted-foreground text-xs">
                            {new Date(v.upload_time).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </td>
                          <td className="px-6 py-4">
                            <Link href={`/verify/${v.verification_id}`}>
                              <Button variant="ghost" size="sm" className="text-neon-cyan hover:bg-neon-cyan/10">
                                View Details
                              </Button>
                            </Link>
                          </td>
                        </motion.tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {verifications.length > 10 && (
                <div className="px-6 py-4 border-t border-border bg-card/30 text-center">
                  <Button variant="ghost" className="text-neon-cyan">
                    View All {verifications.length} Verifications
                  </Button>
                </div>
              )}
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
}
