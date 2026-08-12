import { useState } from 'react';
import { ShortenForm } from '@/features/urls/components/ShortenForm';
import { ResultCard } from '@/features/urls/components/ResultCard';
import { RecentLinksList } from '@/features/urls/components/RecentLinksList';
import { useUrlListParams } from '@/features/urls/api/useUrlListParams';
import { useUrlListQuery } from '@/features/urls/api/useUrlListQuery';
import type { Url } from '@/features/urls/types';
import type { NormalizedApiError } from '@/types/api';

export function UrlsListPage() {
  const [createdUrl, setCreatedUrl] = useState<Url | null>(null);
  const { params, setParam } = useUrlListParams();
  const { data, isLoading, isError, error, refetch } = useUrlListQuery(params);

  return (
    <div className="space-y-8">
      <ShortenForm onCreated={setCreatedUrl} />

      {createdUrl && <ResultCard url={createdUrl} />}

      <RecentLinksList
        urls={data?.urls ?? []}
        pagination={data?.pagination ?? { total: 0, page: 1, limit: 10, totalPages: 1 }}
        totalCount={data?.pagination.total ?? 0}
        isLoading={isLoading}
        isError={isError}
        errorMessage={(error as NormalizedApiError | undefined)?.message}
        search={params.search ?? ''}
        onSearchChange={(search) => setParam({ search })}
        onPageChange={(page) => setParam({ page })}
        onRetry={() => refetch()}
      />
    </div>
  );
}
