import { Link, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import { Pencil, BarChart3, Trash2 } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { ErrorState } from '@/components/ui/ErrorState';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { UrlStatusBadge } from '@/features/urls/components/UrlStatusBadge';
import { CopyShortUrlButton } from '@/features/urls/components/CopyShortUrlButton';
import { useUrlDetailQuery } from '@/features/urls/api/useUrlDetailQuery';
import { useDeleteUrlMutation } from '@/features/urls/api/useDeleteUrlMutation';
import { formatDateTime } from '@/utils/formatDate';
import { useState, type ReactNode } from 'react';
import type { NormalizedApiError } from '@/types/api';

function DetailRow({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="flex items-center justify-between border-b border-gray-100 py-3 text-sm last:border-0 dark:border-gray-800">
      <span className="text-gray-500 dark:text-gray-400">{label}</span>
      <span className="font-medium text-gray-900 dark:text-gray-100">{value}</span>
    </div>
  );
}

export function UrlDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const { data: url, isLoading, isError, error, refetch } = useUrlDetailQuery(id ?? '');
  const deleteMutation = useDeleteUrlMutation();

  const handleDelete = () => {
    if (!url) return;
    deleteMutation.mutate(url._id, {
      onSuccess: () => {
        toast.success('URL deleted');
        navigate('/urls', { replace: true });
      },
      onError: (err) => toast.error((err as NormalizedApiError).message),
    });
  };

  if (isLoading) return <LoadingSpinner fullPage />;
  if (isError) return <ErrorState message={(error as NormalizedApiError).message} onRetry={() => refetch()} />;
  if (!url) return null;

  return (
    <div className="mx-auto max-w-lg space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100">URL details</h1>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link to={`/urls/${url._id}/edit`}>
              <Pencil className="h-4 w-4" /> Edit
            </Link>
          </Button>
          <Button variant="outline" size="sm" asChild>
            <Link to={`/urls/${url._id}/analytics`}>
              <BarChart3 className="h-4 w-4" /> Analytics
            </Link>
          </Button>
          <Button variant="destructive" size="sm" onClick={() => setConfirmDeleteOpen(true)}>
            <Trash2 className="h-4 w-4" /> Delete
          </Button>
        </div>
      </div>

      <Card>
        <DetailRow label="Original URL" value={<span className="max-w-[16rem] truncate">{url.originalUrl}</span>} />
        <DetailRow label="Short URL" value={<CopyShortUrlButton shortCode={url.shortCode} />} />
        <DetailRow label="Total clicks" value={url.clickCount} />
        <DetailRow label="Status" value={<UrlStatusBadge url={url} />} />
        <DetailRow label="Created" value={formatDateTime(url.createdAt)} />
        <DetailRow label="Last clicked" value={formatDateTime(url.lastClickedAt)} />
        <DetailRow label="Expires" value={formatDateTime(url.expiresAt)} />
      </Card>

      <ConfirmDialog
        open={confirmDeleteOpen}
        onOpenChange={setConfirmDeleteOpen}
        title="Delete this URL?"
        description="This will permanently delete the short URL and its analytics. This cannot be undone."
        confirmLabel="Delete"
        destructive
        loading={deleteMutation.isPending}
        onConfirm={handleDelete}
      />
    </div>
  );
}
