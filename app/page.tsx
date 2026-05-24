'use client';

import { motion } from 'framer-motion';
import { ChevronRight, Shield, Zap, Lock, Eye, TrendingUp, ArrowRight, Upload } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.3,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: 'easeOut' },
  },
};

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 backdrop-blur-md border-b border-border/50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="w-8 h-8 text-neon-cyan" />
            <span className="font-bold text-xl bg-gradient-to-r from-neon-cyan to-neon-blue bg-clip-text text-transparent">
              TruDeed
            </span>
          </div>
          <Link href="/dashboard">
            <Button variant="outline" size="sm" className="border-neon-cyan text-neon-cyan hover:bg-neon-cyan/10">
              Launch App
            </Button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center relative pt-20 px-6">
        {/* Animated background */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            animate={{
              x: [0, 100, 0],
              y: [0, 50, 0],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: 'linear',
            }}
            className="absolute top-20 left-10 w-72 h-72 bg-neon-cyan/10 rounded-full filter blur-3xl"
          />
          <motion.div
            animate={{
              x: [0, -100, 0],
              y: [0, -50, 0],
            }}
            transition={{
              duration: 25,
              repeat: Infinity,
              ease: 'linear',
            }}
            className="absolute bottom-20 right-10 w-96 h-96 bg-neon-blue/10 rounded-full filter blur-3xl"
          />
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-4xl mx-auto text-center relative z-10"
        >
          <motion.h1
            variants={itemVariants}
            className="text-6xl md:text-7xl font-bold mb-6 leading-tight"
          >
            <span className="bg-gradient-to-r from-neon-cyan via-neon-blue to-neon-cyan bg-clip-text text-transparent">
              Real-time Document
            </span>
            <br />
            <span>Fraud Detection</span>
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto"
          >
            AI-powered integrity verification for banks. Detect tampering in seconds. Trust documents again.
          </motion.p>

          <motion.div
            variants={itemVariants}
            className="flex gap-4 justify-center flex-wrap"
          >
            <Link href="/dashboard">
              <Button className="bg-neon-cyan text-background hover:bg-neon-cyan/80 text-base px-8 py-6">
                Verify Document <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Button variant="outline" className="border-neon-cyan text-neon-cyan hover:bg-neon-cyan/10 text-base px-8 py-6">
              View Demo
            </Button>
          </motion.div>
        </motion.div>
      </section>

      {/* Workflow Animation Section */}
      <section className="py-24 px-6 bg-gradient-to-b from-transparent to-card/30">
        <div className="max-w-6xl mx-auto">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-4xl font-bold text-center mb-16"
          >
            Verification Pipeline
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
            {[
              { icon: Upload, title: 'Upload', desc: 'Add document' },
              { icon: Eye, title: 'OCR', desc: 'Extract text' },
              { icon: Zap, title: 'Fingerprint', desc: 'Generate hashes' },
              { icon: Lock, title: 'Verify', desc: 'Check authorities' },
              { icon: Shield, title: 'Verdict', desc: 'Fraud detection' },
            ].map((step, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="relative"
              >
                <div className="bg-card border border-neon-cyan/30 rounded-lg p-6 text-center hover:border-neon-cyan/60 transition-colors">
                  <step.icon className="w-8 h-8 mx-auto mb-3 text-neon-cyan" />
                  <h3 className="font-semibold mb-1">{step.title}</h3>
                  <p className="text-sm text-muted-foreground">{step.desc}</p>
                </div>
                {idx < 4 && (
                  <div className="hidden md:block absolute top-1/2 -right-2 transform -translate-y-1/2">
                    <ChevronRight className="w-6 h-6 text-neon-blue" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Feature Cards */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-4xl font-bold text-center mb-16"
          >
            Enterprise-Grade Verification
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: 'Real-Time Detection',
                desc: 'Detect fraud in seconds with AI-powered analysis',
                icon: Zap,
              },
              {
                title: 'Authority Verification',
                desc: 'Cross-check with Kaveri, Dharani, IGR, TRACES',
                icon: Lock,
              },
              {
                title: 'Federated Ledger',
                desc: 'Immutable verification history and duplicate detection',
                icon: Shield,
              },
              {
                title: 'Multi-Hash Verification',
                desc: 'Perceptual, semantic, and structural fingerprints',
                icon: TrendingUp,
              },
              {
                title: 'Explainable AI',
                desc: 'Clear reasoning for every fraud detection verdict',
                icon: Eye,
              },
              {
                title: 'Bank Integration',
                desc: 'REST API for seamless bank system integration',
                icon: Shield,
              },
            ].map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="bg-card border border-border hover:border-neon-cyan/50 rounded-xl p-8 group transition-all duration-300 hover:shadow-lg hover:shadow-neon-cyan/20"
              >
                <feature.icon className="w-10 h-10 text-neon-cyan mb-4 group-hover:scale-110 transition-transform" />
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Fraud Stats */}
      <section className="py-24 px-6 bg-card/50 border-y border-border">
        <div className="max-w-6xl mx-auto">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-4xl font-bold text-center mb-16"
          >
            Trusted by Financial Institutions
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { label: 'Documents Verified', value: '50K+' },
              { label: 'Fraud Detected', value: '4.2K' },
              { label: 'Avg. Verification Time', value: '2.3s' },
            ].map((stat, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="text-center"
              >
                <div className="text-4xl md:text-5xl font-bold text-neon-cyan mb-2">
                  {stat.value}
                </div>
                <p className="text-muted-foreground">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-5xl font-bold mb-6"
          >
            Ready to Detect Fraud?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-xl text-muted-foreground mb-8"
          >
            Upload any document and get an instant fraud verdict powered by AI.
          </motion.p>
          <Link href="/dashboard">
            <Button className="bg-neon-cyan text-background hover:bg-neon-cyan/80 text-base px-8 py-6">
              Launch Dashboard <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2">
            <Shield className="w-6 h-6 text-neon-cyan" />
            <span className="font-bold">TruDeed</span>
          </div>
          <p className="text-muted-foreground text-sm">
            Real-time fraud detection powered by AI
          </p>
          <p className="text-muted-foreground text-sm">
            © 2024 TruDeed. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
