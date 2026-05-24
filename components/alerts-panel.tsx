'use client';

import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertCircle, TrendingUp, Bell, X } from 'lucide-react';
import { useState } from 'react';

const mockAlerts = [
  {
    id: 1,
    severity: 'CRITICAL',
    title: 'High Fraud Spike Detected',
    description: 'Fraud rate jumped to 24% in the last 2 hours',
    time: '12 mins ago',
    actionable: true,
  },
  {
    id: 2,
    severity: 'WARNING',
    title: 'Processing Slowdown',
    description: 'Average verification time increased by 1.2 seconds',
    time: '45 mins ago',
    actionable: false,
  },
  {
    id: 3,
    severity: 'INFO',
    title: 'Daily Report Ready',
    description: '1,247 verifications completed today',
    time: '2 hours ago',
    actionable: false,
  },
];

export function AlertsPanel() {
  const [alerts, setAlerts] = useState(mockAlerts);
  const [dismissedIds, setDismissedIds] = useState<number[]>([]);

  const handleDismiss = (id: number) => {
    setDismissedIds([...dismissedIds, id]);
  };

  const visibleAlerts = alerts.filter((a) => !dismissedIds.includes(a.id));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.25 }}
    >
      <Card className="p-6 border border-border bg-card/50">
        <div className="flex items-center gap-2 mb-6">
          <Bell className="w-5 h-5 text-neon-cyan" />
          <h3 className="text-lg font-semibold">System Alerts</h3>
          {visibleAlerts.length > 0 && (
            <div className="ml-auto flex items-center gap-2">
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-2 h-2 rounded-full bg-red-500"
              />
              <span className="text-xs font-semibold text-red-400">{visibleAlerts.length} new</span>
            </div>
          )}
        </div>

        {visibleAlerts.length === 0 ? (
          <div className="text-center py-12">
            <div className="flex justify-center mb-4">
              <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-green-500" />
              </div>
            </div>
            <p className="text-muted-foreground">All systems normal</p>
          </div>
        ) : (
          <div className="space-y-3">
            {visibleAlerts.map((alert, idx) => {
              const severityColors: any = {
                CRITICAL: 'border-red-500/50 bg-red-500/10 text-red-400',
                WARNING: 'border-amber-500/50 bg-amber-500/10 text-amber-400',
                INFO: 'border-blue-500/50 bg-blue-500/10 text-blue-400',
              };

              return (
                <motion.div
                  key={alert.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className={`p-4 rounded-lg border ${severityColors[alert.severity]} group transition-all`}
                >
                  <div className="flex gap-3">
                    <div className="flex-shrink-0 mt-1">
                      {alert.severity === 'CRITICAL' ? (
                        <motion.div
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                        >
                          <AlertCircle className="w-5 h-5" />
                        </motion.div>
                      ) : (
                        <TrendingUp className="w-5 h-5" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-sm">{alert.title}</p>
                      <p className="text-xs text-muted-foreground mt-1">{alert.description}</p>
                      <p className="text-xs mt-2 opacity-70">{alert.time}</p>
                    </div>
                    {alert.actionable && (
                      <div className="flex gap-2 ml-4 flex-shrink-0">
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-xs h-8 px-3 hover:bg-opacity-20"
                          onClick={() => handleDismiss(alert.id)}
                        >
                          View
                        </Button>
                      </div>
                    )}
                    {!alert.actionable && (
                      <button
                        onClick={() => handleDismiss(alert.id)}
                        className="flex-shrink-0 opacity-50 hover:opacity-100 transition-opacity"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </Card>
    </motion.div>
  );
}
