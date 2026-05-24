'use client';

import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { Card } from '@/components/ui/card';
import { motion } from 'framer-motion';

const verdictData = [
  { date: 'Mon', GREEN: 24, AMBER: 12, RED: 8 },
  { date: 'Tue', GREEN: 32, AMBER: 15, RED: 5 },
  { date: 'Wed', GREEN: 18, AMBER: 18, RED: 11 },
  { date: 'Thu', GREEN: 28, AMBER: 10, RED: 7 },
  { date: 'Fri', GREEN: 35, AMBER: 14, RED: 9 },
  { date: 'Sat', GREEN: 22, AMBER: 16, RED: 12 },
  { date: 'Sun', GREEN: 26, AMBER: 11, RED: 6 },
];

const verdictDistribution = [
  { name: 'Authentic (GREEN)', value: 62, fill: '#10b981' },
  { name: 'Suspicious (AMBER)', value: 24, fill: '#f59e0b' },
  { name: 'Fraud (RED)', value: 14, fill: '#ef4444' },
];

const fraudCategoryData = [
  { category: 'Amount Changed', count: 8 },
  { category: 'Layout Mismatch', count: 6 },
  { category: 'Duplicate', count: 5 },
  { category: 'Name Mismatch', count: 4 },
  { category: 'OCR Suspect', count: 3 },
  { category: 'Edited Fields', count: 2 },
];

const processingTimeData = [
  { hour: '00:00', avgTime: 2.4 },
  { hour: '04:00', avgTime: 2.1 },
  { hour: '08:00', avgTime: 2.8 },
  { hour: '12:00', avgTime: 3.2 },
  { hour: '16:00', avgTime: 2.6 },
  { hour: '20:00', avgTime: 2.3 },
];

export function VerificationTrendChart() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
    >
      <Card className="p-6 border border-border bg-card/50">
        <h3 className="text-lg font-semibold mb-6">Verification Trends (7 Days)</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={verdictData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(45, 55, 72, 0.5)" />
            <XAxis dataKey="date" stroke="rgba(160, 168, 181, 0.8)" />
            <YAxis stroke="rgba(160, 168, 181, 0.8)" />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1a1f3a',
                border: '1px solid rgba(0, 212, 255, 0.3)',
                borderRadius: '8px',
              }}
              labelStyle={{ color: '#e0e8f5' }}
            />
            <Legend />
            <Line type="monotone" dataKey="GREEN" stroke="#10b981" strokeWidth={2} name="Authentic" />
            <Line type="monotone" dataKey="AMBER" stroke="#f59e0b" strokeWidth={2} name="Suspicious" />
            <Line type="monotone" dataKey="RED" stroke="#ef4444" strokeWidth={2} name="Fraud" />
          </LineChart>
        </ResponsiveContainer>
      </Card>
    </motion.div>
  );
}

export function VerdictDistributionChart() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <Card className="p-6 border border-border bg-card/50">
        <h3 className="text-lg font-semibold mb-6">Verdict Distribution</h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={verdictDistribution}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, value }) => `${name}: ${value}%`}
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
            >
              {verdictDistribution.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: '#1a1f3a',
                border: '1px solid rgba(0, 212, 255, 0.3)',
                borderRadius: '8px',
              }}
              labelStyle={{ color: '#e0e8f5' }}
            />
          </PieChart>
        </ResponsiveContainer>
      </Card>
    </motion.div>
  );
}

export function FraudCategoryChart() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      <Card className="p-6 border border-border bg-card/50">
        <h3 className="text-lg font-semibold mb-6">Fraud Categories (Top)</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={fraudCategoryData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(45, 55, 72, 0.5)" />
            <XAxis dataKey="category" stroke="rgba(160, 168, 181, 0.8)" angle={-45} textAnchor="end" height={100} />
            <YAxis stroke="rgba(160, 168, 181, 0.8)" />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1a1f3a',
                border: '1px solid rgba(0, 212, 255, 0.3)',
                borderRadius: '8px',
              }}
              labelStyle={{ color: '#e0e8f5' }}
            />
            <Bar dataKey="count" fill="#00d4ff" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Card>
    </motion.div>
  );
}

export function ProcessingTimeChart() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
    >
      <Card className="p-6 border border-border bg-card/50">
        <h3 className="text-lg font-semibold mb-6">Avg Processing Time (Seconds)</h3>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={processingTimeData}>
            <defs>
              <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#00d4ff" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#00d4ff" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(45, 55, 72, 0.5)" />
            <XAxis dataKey="hour" stroke="rgba(160, 168, 181, 0.8)" />
            <YAxis stroke="rgba(160, 168, 181, 0.8)" />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1a1f3a',
                border: '1px solid rgba(0, 212, 255, 0.3)',
                borderRadius: '8px',
              }}
              labelStyle={{ color: '#e0e8f5' }}
            />
            <Area type="monotone" dataKey="avgTime" stroke="#00d4ff" fillOpacity={1} fill="url(#colorUv)" />
          </AreaChart>
        </ResponsiveContainer>
      </Card>
    </motion.div>
  );
}
