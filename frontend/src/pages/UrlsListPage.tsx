import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { ErrorState } from '@/components/ui/ErrorState';
import { EmptyState } from '@/components/ui/EmptyState';
import { Pagination } from '@/components/ui/Pagination';
import { UrlFilters } from '@/features/urls/components/UrlFilters';
import { UrlTable } from '@/features/urls/components/UrlTable';
import { useUrlListParams } from '@/features/urls/api/useUrlListParams';
import { useUrlListQuery } from '@/features/urls/api/useUrlListQuery';
import type { NormalizedApiError } from '@/types/api';

export function UrlsListPage() {
  const { params, setParam } = useUrlListParams();
  const { data, isLoading, isError, error, refetch } = useUrlListQuery(params);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100">My URLs</h1>
        <Button asChild>
          <Link to="/urls/new">
            <Plus className="h-4 w-4" /> Create URL
          </Link>
        </Button>
      </div>

      <UrlFilters
        params={params}
        onSearchChange={(search) => setParam({ search })}
        onStatusChange={(status) => setParam({ status })}
        onSortChange={(sort) => setParam({ sort })}
      />

      {isLoading && <LoadingSpinner fullPage />}

      {isError && (
        <ErrorState message={(error as NormalizedApiError).message} onRetry={() => refetch()} />
      )}

      {!isLoading && !isError && data && data.urls.length === 0 && (
        <EmptyState
          title="No URLs yet"
          description="Create your first shortened URL to get started."
          action={
            <Button asChild size="sm">
              <Link to="/urls/new">Create URL</Link>
            </Button>
          }
        />
      )}

      {!isLoading && !isError && data && data.urls.length > 0 && (
        <>
          <UrlTable urls={data.urls} />
          <Pagination
            page={data.pagination.page}
            totalPages={data.pagination.totalPages}
            onPageChange={(page) => setParam({ page })}
          />
        </>
      )}
    </div>
  );
}
