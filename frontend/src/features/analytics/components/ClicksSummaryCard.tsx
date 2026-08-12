import { Card } from '@/components/ui/Card';

export function ClicksSummaryCard({ total }: { total: number }) {
  return (
    <Card>
      <p className="text-sm text-slate-400">Total clicks</p>
      <p className="mt-1 text-4xl font-semibold text-slate-100">{total}</p>
    </Card>
  );
}
