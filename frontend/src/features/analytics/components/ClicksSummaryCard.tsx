import { Card } from '@/components/ui/Card';

export function ClicksSummaryCard({ total }: { total: number }) {
  return (
    <Card>
      <p className="text-sm text-gray-500 dark:text-gray-400">Total clicks</p>
      <p className="mt-1 text-4xl font-semibold text-gray-900 dark:text-gray-100">{total}</p>
    </Card>
  );
}
