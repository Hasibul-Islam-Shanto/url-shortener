import { useId } from 'react';
import { Bar, BarChart, CartesianGrid, LabelList, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { EmptyState } from '@/components/ui/EmptyState';
import { designTokens } from '@/utils/designTokens';
import type { AnalyticsCount } from '../types';

interface DistributionChartProps {
  title: string;
  data: AnalyticsCount[];
}

export function DistributionChart({ title, data }: DistributionChartProps) {
  const gradientId = `accentBarGradient-${useId().replace(/:/g, '')}`;
  const chartData = data.map((d) => ({ name: d._id ?? 'Unknown', value: d.count }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>

      {chartData.length === 0 ? (
        <EmptyState title="No data yet" />
      ) : (
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={chartData} layout="vertical" margin={{ left: 8, right: 24 }} barSize={20}>
            <defs>
              <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor={designTokens.accentStart} />
                <stop offset="100%" stopColor={designTokens.accentEnd} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke={designTokens.chartGrid} horizontal={false} />
            <XAxis type="number" allowDecimals={false} tick={{ fontSize: 12, fill: designTokens.chartInk }} />
            <YAxis type="category" dataKey="name" width={90} tick={{ fontSize: 12, fill: designTokens.chartInk }} />
            <Tooltip
              contentStyle={{
                borderRadius: 12,
                fontSize: 12,
                backgroundColor: designTokens.bgBase,
                border: `1px solid ${designTokens.glassBorder}`,
                color: '#f1f5f9',
              }}
              cursor={{ fill: designTokens.accentStart, fillOpacity: 0.08 }}
            />
            <Bar dataKey="value" fill={`url(#${gradientId})`} radius={[0, 4, 4, 0]}>
              <LabelList dataKey="value" position="right" style={{ fill: designTokens.chartInk, fontSize: 12 }} />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      )}
    </Card>
  );
}
