import { useState } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2 } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { CreateUrlForm } from '@/features/urls/components/CreateUrlForm';
import { CopyShortUrlButton } from '@/features/urls/components/CopyShortUrlButton';
import type { Url } from '@/features/urls/types';

export function UrlCreatePage() {
  const [createdUrl, setCreatedUrl] = useState<Url | null>(null);

  return (
    <div className="mx-auto max-w-lg space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Create a short URL</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Paste a long link and get a short, shareable URL instantly.
        </p>
      </div>

      {!createdUrl && (
        <Card className="shadow-glow-sm">
          <CreateUrlForm onCreated={setCreatedUrl} />
        </Card>
      )}

      {createdUrl && (
        <Card className="animate-fade-in-up space-y-4 text-center shadow-glow-sm">
          <CheckCircle2 className="mx-auto h-10 w-10 text-green-600 dark:text-green-400" />
          <div>
            <p className="font-medium text-gray-900 dark:text-gray-100">Short URL created!</p>
            <p className="mt-1 truncate text-sm text-gray-500 dark:text-gray-400">
              {createdUrl.originalUrl}
            </p>
          </div>
          <div className="flex justify-center">
            <CopyShortUrlButton shortCode={createdUrl.shortCode} />
          </div>
          <div className="flex justify-center gap-3">
            <Button variant="outline" onClick={() => setCreatedUrl(null)}>
              Create another
            </Button>
            <Button asChild>
              <Link to={`/urls/${createdUrl._id}`}>View details</Link>
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
}
