import { Bar, BarChart, CartesianGrid, LabelList, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { EmptyState } from '@/components/ui/EmptyState';
import { useTheme } from '@/store/ThemeContext';
import type { AnalyticsCount } from '../types';

interface DistributionChartProps {
  title: string;
  data: AnalyticsCount[];
}

const TOKENS = {
  light: { bar: '#2a78d6', grid: '#e1e0d9', ink: '#898781' },
  dark: { bar: '#3987e5', grid: '#2c2c2a', ink: '#898781' },
};

export function DistributionChart({ title, data }: DistributionChartProps) {
  const { theme } = useTheme();
  const tokens = TOKENS[theme];
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
            <CartesianGrid stroke={tokens.grid} horizontal={false} />
            <XAxis type="number" allowDecimals={false} tick={{ fontSize: 12, fill: tokens.ink }} />
            <YAxis type="category" dataKey="name" width={90} tick={{ fontSize: 12, fill: tokens.ink }} />
            <Tooltip
              contentStyle={{ borderRadius: 8, fontSize: 12 }}
              cursor={{ fill: tokens.bar, fillOpacity: 0.08 }}
            />
            <Bar dataKey="value" fill={tokens.bar} radius={[0, 4, 4, 0]}>
              <LabelList dataKey="value" position="right" style={{ fill: tokens.ink, fontSize: 12 }} />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      )}
    </Card>
  );
}
