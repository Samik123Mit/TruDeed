'use client';

import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { TrendingUp, AlertTriangle, CheckCircle2, Clock, AlertCircle, Activity } from 'lucide-react';

export function AdvancedStats() {
  const stats = [
    {
      label: 'Total Verifications',
      value: '1,247',
      subtext: '+24% this month',
      icon: Activity,
      color: 'from-neon-cyan to-neon-blue',
      trend: 'up',
    },
    {
      label: 'Fraud Detection Rate',
      value: '14.2%',
      subtext: '178 frauds detected',
      icon: AlertCircle,
      color: 'from-red-500 to-orange-500',
      trend: 'up',
    },
    {
      label: 'Average Confidence',
      value: '91.3%',
      subtext: '+2.1% vs last week',
      icon: CheckCircle2,
      color: 'from-green-500 to-emerald-500',
      trend: 'up',
    },
    {
      label: 'Avg Processing Time',
      value: '2.3s',
      subtext: '-0.4s vs last week',
      icon: Clock,
      color: 'from-blue-500 to-cyan-500',
      trend: 'down',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, idx) => {
        const Icon = stat.icon;
        return (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
          >
            <Card className="p-6 border border-border bg-gradient-to-br from-card to-card/50 hover:border-neon-cyan/50 transition-all group overflow-hidden relative">
              {/* Animated background gradient */}
              <div className={`absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500 bg-gradient-to-br ${stat.color}`} />

              <div className="relative z-10">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="text-muted-foreground text-sm mb-1">{stat.label}</p>
                    <p className="text-3xl md:text-4xl font-bold">{stat.value}</p>
                  </div>
                  <div className={`p-3 rounded-lg bg-gradient-to-br ${stat.color} opacity-80`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <TrendingUp className={`w-4 h-4 ${stat.trend === 'up' ? 'text-green-500' : 'text-green-500'}`} />
                  <p className="text-xs text-muted-foreground">{stat.subtext}</p>
                </div>
              </div>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
}

export function RiskMetrics() {
  const metrics = [
    { label: 'Critical Alerts', value: 3, color: 'red' },
    { label: 'Pending Review', value: 12, color: 'amber' },
    { label: 'Verified Safe', value: 1054, color: 'green' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15 }}
    >
      <Card className="p-6 border border-border bg-card/50">
        <h3 className="text-lg font-semibold mb-6">Risk Dashboard</h3>
        <div className="space-y-4">
          {metrics.map((metric, idx) => {
            const colorMap: any = {
              red: 'bg-red-500',
              amber: 'bg-amber-500',
              green: 'bg-green-500',
            };
            const totalVerifications = 1247;
            const percentage = (metric.value / totalVerifications) * 100;

            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 + idx * 0.1 }}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">{metric.label}</span>
                  <span className="text-sm font-bold">{metric.value}</span>
                </div>
                <div className="w-full h-2 bg-card/50 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ duration: 1, delay: 0.2 + idx * 0.1 }}
                    className={`h-full rounded-full ${colorMap[metric.color]}`}
                  />
                </div>
              </motion.div>
            );
          })}
        </div>
      </Card>
    </motion.div>
  );
}
