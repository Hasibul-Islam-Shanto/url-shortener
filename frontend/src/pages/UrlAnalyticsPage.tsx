import { useParams, useSearchParams } from 'react-router-dom';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { ErrorState } from '@/components/ui/ErrorState';
import { Pagination } from '@/components/ui/Pagination';
import { ClicksSummaryCard } from '@/features/analytics/components/ClicksSummaryCard';
import { DistributionChart } from '@/features/analytics/components/DistributionChart';
import { RecentVisitsTable } from '@/features/analytics/components/RecentVisitsTable';
import { useUrlAnalyticsQuery } from '@/features/analytics/api/useUrlAnalyticsQuery';
import { useUrlDetailQuery } from '@/features/urls/api/useUrlDetailQuery';
import { DEFAULT_PAGE_SIZE } from '@/utils/constants';
import type { NormalizedApiError } from '@/types/api';

export function UrlAnalyticsPage() {
  const { id } = useParams<{ id: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const page = Number(searchParams.get('page')) || 1;
  const limit = DEFAULT_PAGE_SIZE;

  const { data: url } = useUrlDetailQuery(id ?? '');
  const { data, isLoading, isError, error, refetch } = useUrlAnalyticsQuery(id ?? '', { page, limit });

  if (isLoading) return <LoadingSpinner fullPage />;
  if (isError) return <ErrorState message={(error as NormalizedApiError).message} onRetry={() => refetch()} />;
  if (!data) return null;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-slate-100">Analytics</h1>
        {url && <p className="mt-1 truncate text-sm text-slate-400">{url.originalUrl}</p>}
      </div>

      <ClicksSummaryCard total={data.summary.total} />

      <div className="grid gap-4 md:grid-cols-3">
        <DistributionChart title="Browser" data={data.summary.byBrowser} />
        <DistributionChart title="Operating system" data={data.summary.byOS} />
        <DistributionChart title="Device" data={data.summary.byDevice} />
      </div>

      <div className="space-y-3">
        <h2 className="text-sm font-semibold text-slate-100">Recent visits</h2>
        <RecentVisitsTable visits={data.recentVisits} />
        <Pagination
          page={data.pagination.page}
          totalPages={data.pagination.totalPages}
          onPageChange={(p) => setSearchParams({ page: String(p) })}
        />
      </div>
    </div>
  );
}
