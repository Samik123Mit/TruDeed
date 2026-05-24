'use client';

import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { AlertCircle, CheckCircle, AlertTriangle, Clock } from 'lucide-react';

const mockActivities = [
  {
    id: 1,
    type: 'RED',
    filename: 'bank_statement_modified.pdf',
    time: '2 mins ago',
    reason: 'Amount variance detected',
    confidence: 92,
  },
  {
    id: 2,
    type: 'GREEN',
    filename: 'land_deed_authentic.jpg',
    time: '5 mins ago',
    reason: 'Verified against Kaveri DB',
    confidence: 98,
  },
  {
    id: 3,
    type: 'AMBER',
    filename: 'itr_2024_scanned.pdf',
    time: '8 mins ago',
    reason: 'Layout mismatch - requires review',
    confidence: 67,
  },
  {
    id: 4,
    type: 'RED',
    filename: 'sale_deed_forged.png',
    time: '12 mins ago',
    reason: 'Duplicate submission detected',
    confidence: 88,
  },
  {
    id: 5,
    type: 'GREEN',
    filename: 'aadhaar_card_verified.jpg',
    time: '15 mins ago',
    reason: 'Perceptual hash matched',
    confidence: 99,
  },
];

export function ActivityFeed() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="h-full"
    >
      <Card className="p-6 border border-border bg-card/50 h-full">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold">Live Verification Activity</h3>
          <motion.div
            animate={{ opacity: [1, 0.5, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-2 h-2 rounded-full bg-neon-cyan"
          />
        </div>

        <div className="space-y-4">
          {mockActivities.map((activity, idx) => {
            const iconMap: any = {
              RED: <AlertCircle className="w-5 h-5 text-red-500" />,
              GREEN: <CheckCircle className="w-5 h-5 text-green-500" />,
              AMBER: <AlertTriangle className="w-5 h-5 text-amber-500" />,
            };

            const bgMap: any = {
              RED: 'bg-red-500/10 border-red-500/20',
              GREEN: 'bg-green-500/10 border-green-500/20',
              AMBER: 'bg-amber-500/10 border-amber-500/20',
            };

            return (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
                className={`p-4 rounded-lg border transition-colors ${bgMap[activity.type]} hover:border-opacity-50`}
              >
                <div className="flex gap-3">
                  {iconMap[activity.type]}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <p className="text-sm font-semibold truncate">{activity.filename}</p>
                        <p className="text-xs text-muted-foreground mt-1">{activity.reason}</p>
                      </div>
                      <div className="flex-shrink-0 text-right">
                        <p className="text-xs text-muted-foreground">{activity.time}</p>
                        <p className="text-xs font-semibold text-neon-cyan mt-1">{activity.confidence}%</p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        <div className="mt-6 text-center">
          <p className="text-xs text-muted-foreground">Updates in real-time</p>
        </div>
      </Card>
    </motion.div>
  );
}
