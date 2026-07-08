import { useNavigate, useParams } from 'react-router-dom';
import { Card } from '@/components/ui/Card';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { ErrorState } from '@/components/ui/ErrorState';
import { EditUrlForm } from '@/features/urls/components/EditUrlForm';
import { useUrlDetailQuery } from '@/features/urls/api/useUrlDetailQuery';
import type { NormalizedApiError } from '@/types/api';

export function UrlEditPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: url, isLoading, isError, error, refetch } = useUrlDetailQuery(id ?? '');

  return (
    <div className="mx-auto max-w-lg space-y-6">
      <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Edit URL</h1>

      {isLoading && <LoadingSpinner fullPage />}

      {isError && (
        <ErrorState message={(error as NormalizedApiError).message} onRetry={() => refetch()} />
      )}

      {url && (
        <Card>
          <EditUrlForm url={url} onSaved={() => navigate(`/urls/${url._id}`)} />
        </Card>
      )}
    </div>
  );
}
