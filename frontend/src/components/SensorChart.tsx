'use client';

import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { SensorData } from '@/hooks/useMqtt';

interface SensorChartProps {
  data: SensorData[];
}

export function SensorChart({ data }: SensorChartProps) {
  return (
    <div className="glass p-6 rounded-2xl w-full h-100 flex flex-col">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-foreground">Kelembapan Tanah Real-time</h3>
        <p className="text-sm text-foreground/60">Data sensor diperbarui secara otomatis via MQTT</p>
      </div>
      
      <div className="flex-1 w-full min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data.length > 0 ? data : [{ time: '00:00', moisture: 0 }]}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorMoisture" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.8} />
                <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
            <XAxis 
              dataKey="time" 
              stroke="var(--foreground)" 
              opacity={0.5} 
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis 
              stroke="var(--foreground)" 
              opacity={0.5} 
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'var(--card)',
                borderColor: 'var(--border)',
                borderRadius: '8px',
                color: 'var(--foreground)',
              }}
              itemStyle={{ color: 'var(--primary)' }}
            />
            <Area
              type="monotone"
              dataKey="moisture"
              stroke="var(--primary)"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#colorMoisture)"
              isAnimationActive={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
