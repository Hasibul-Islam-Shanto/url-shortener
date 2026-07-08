import { Link } from 'react-router-dom';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { EmptyState } from '@/components/ui/EmptyState';
import { UrlStatusBadge } from '@/features/urls/components/UrlStatusBadge';
import { formatDate } from '@/utils/formatDate';
import type { Url } from '@/features/urls/types';

export function RecentUrlsList({ urls }: { urls: Url[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent URLs</CardTitle>
      </CardHeader>

      {urls.length === 0 && <EmptyState title="No URLs yet" description="Your recent links will appear here." />}

      {urls.length > 0 && (
        <ul className="divide-y divide-gray-100 dark:divide-gray-800">
          {urls.map((url) => (
            <li key={url._id} className="flex items-center justify-between gap-3 py-3 text-sm first:pt-0 last:pb-0">
              <Link to={`/urls/${url._id}`} className="max-w-[14rem] truncate hover:underline" title={url.originalUrl}>
                {url.originalUrl}
              </Link>
              <div className="flex items-center gap-3">
                <span className="text-gray-500 dark:text-gray-400">{formatDate(url.createdAt)}</span>
                <UrlStatusBadge url={url} />
              </div>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}
