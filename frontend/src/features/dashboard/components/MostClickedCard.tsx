import { Link } from 'react-router-dom';
import { Trophy } from 'lucide-react';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { EmptyState } from '@/components/ui/EmptyState';
import { CopyShortUrlButton } from '@/features/urls/components/CopyShortUrlButton';
import type { MostClickedUrl } from '../types';

export function MostClickedCard({ url }: { url: MostClickedUrl | null }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Most clicked URL</CardTitle>
        <Trophy className="h-4 w-4 text-amber-500" />
      </CardHeader>

      {!url && <EmptyState title="No clicks yet" description="Share a short URL to see it here." />}

      {url && (
        <div className="space-y-3">
          <Link to={`/urls/${url._id}`} className="block truncate text-sm hover:underline" title={url.originalUrl}>
            {url.originalUrl}
          </Link>
          <div className="flex items-center justify-between">
            <CopyShortUrlButton shortCode={url.shortCode} />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {url.clickCount} clicks
            </span>
          </div>
        </div>
      )}
    </Card>
  );
}
