'use client';

import { motion } from 'framer-motion';
import { Shield, AlertTriangle, CheckCircle } from 'lucide-react';

interface VerdictCardProps {
  verdict: 'RED' | 'AMBER' | 'GREEN';
  confidence: number;
  reasons: string[];
}

export function VerdictCard({ verdict, confidence, reasons }: VerdictCardProps) {
  const verdictConfig = {
    RED: {
      color: 'rgb(239, 68, 68)',
      bgColor: 'rgba(239, 68, 68, 0.1)',
      borderColor: 'rgba(239, 68, 68, 0.5)',
      label: 'FRAUD DETECTED',
      description: 'This document is tampered or fraudulent',
      icon: AlertTriangle,
    },
    AMBER: {
      color: 'rgb(245, 158, 11)',
      bgColor: 'rgba(245, 158, 11, 0.1)',
      borderColor: 'rgba(245, 158, 11, 0.5)',
      label: 'SUSPICIOUS',
      description: 'This document requires manual review',
      icon: AlertTriangle,
    },
    GREEN: {
      color: 'rgb(16, 185, 129)',
      bgColor: 'rgba(16, 185, 129, 0.1)',
      borderColor: 'rgba(16, 185, 129, 0.5)',
      label: 'AUTHENTIC',
      description: 'This document appears genuine',
      icon: CheckCircle,
    },
  };

  const config = verdictConfig[verdict];
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.5, type: 'spring' }}
      className="w-full"
    >
      <div
        className="relative rounded-2xl p-12 border-2 overflow-hidden"
        style={{
          backgroundColor: config.bgColor,
          borderColor: config.borderColor,
        }}
      >
        {/* Animated background pulse */}
        <motion.div
          animate={{
            opacity: [0.3, 0.6, 0.3],
            scale: [0.8, 1, 0.8],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute inset-0"
          style={{
            background: `radial-gradient(circle, ${config.color}20 0%, transparent 70%)`,
          }}
        />

        <div className="relative z-10 flex flex-col items-center justify-center text-center">
          <motion.div
            animate={{
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
            }}
          >
            <Icon className="w-20 h-20 mx-auto mb-6" style={{ color: config.color }} />
          </motion.div>

          <h2 className="text-5xl font-bold mb-3" style={{ color: config.color }}>
            {config.label}
          </h2>

          <p className="text-lg text-muted-foreground mb-8 max-w-md">
            {config.description}
          </p>

          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="h-2 bg-muted rounded-full" style={{ width: `${confidence}%`, maxWidth: '200px' }} />
            <span className="text-2xl font-bold" style={{ color: config.color }}>
              {confidence}%
            </span>
          </div>

          {reasons.length > 0 && (
            <div className="mt-8 pt-8 border-t border-border w-full">
              <p className="text-sm font-semibold text-muted-foreground mb-4">
                Detection Reasons:
              </p>
              <ul className="space-y-2 text-sm text-foreground">
                {reasons.map((reason, idx) => (
                  <motion.li
                    key={idx}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="flex items-start gap-3"
                  >
                    <span className="text-neon-cyan mt-1">•</span>
                    <span>{reason}</span>
                  </motion.li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
