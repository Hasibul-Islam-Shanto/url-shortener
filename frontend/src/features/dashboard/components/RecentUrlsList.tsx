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
        <ul className="space-y-2">
          {urls.map((url, index) => (
            <li
              key={url._id}
              className="animate-fade-in-up flex items-center justify-between gap-3 rounded-2xl border border-white/30 bg-white/30 px-3 py-3 text-sm backdrop-blur-sm transition-all duration-200 hover:bg-white/40 dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10"
              style={{ animationDelay: `${index * 60}ms` }}
            >
              <Link
                to={`/urls/${url._id}`}
                className="max-w-[14rem] truncate text-indigo-600 transition-colors duration-200 hover:underline dark:text-indigo-400"
                title={url.originalUrl}
              >
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
