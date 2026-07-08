import { Link2, MousePointerClick, CheckCircle2, Ban, Clock } from 'lucide-react';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { ErrorState } from '@/components/ui/ErrorState';
import { StatCard } from '@/features/dashboard/components/StatCard';
import { MostClickedCard } from '@/features/dashboard/components/MostClickedCard';
import { RecentUrlsList } from '@/features/dashboard/components/RecentUrlsList';
import { useDashboardQuery } from '@/features/dashboard/api/useDashboardQuery';
import type { NormalizedApiError } from '@/types/api';

export function DashboardPage() {
  const { data, isLoading, isError, error, refetch } = useDashboardQuery();

  if (isLoading) return <LoadingSpinner fullPage />;
  if (isError) return <ErrorState message={(error as NormalizedApiError).message} onRetry={() => refetch()} />;
  if (!data) return null;

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Dashboard</h1>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        <StatCard label="Total URLs" value={data.totalUrls} icon={Link2} />
        <StatCard label="Total clicks" value={data.totalClicks} icon={MousePointerClick} />
        <StatCard label="Active" value={data.activeUrls} icon={CheckCircle2} />
        <StatCard label="Disabled" value={data.disabledUrls} icon={Ban} />
        <StatCard label="Expired" value={data.expiredUrls} icon={Clock} />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <RecentUrlsList urls={data.recentUrls} />
        <MostClickedCard url={data.mostClickedUrl} />
      </div>
    </div>
  );
}
