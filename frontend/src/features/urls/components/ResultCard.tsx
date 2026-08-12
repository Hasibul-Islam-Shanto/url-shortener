import { Check, Copy } from 'lucide-react';
import { toast } from 'sonner';
import { useCopyToClipboard } from '@/hooks/useCopyToClipboard';
import { buildShortUrl } from '../utils/buildShortUrl';
import type { Url } from '../types';

interface ResultCardProps {
  url: Url;
}

export function ResultCard({ url }: ResultCardProps) {
  const { copy, isCopied } = useCopyToClipboard();
  const shortUrl = buildShortUrl(url.shortCode);

  const handleCopy = async () => {
    await copy(shortUrl);
    toast.success('Copied!');
  };

  return (
    <section className="glass-panel animate-fade-in-up p-5 shadow-glowSm">
      <p className="text-sm text-slate-400">Your short link is ready</p>
      <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="truncate text-lg font-semibold text-accent-start">{shortUrl}</p>
        <button
          type="button"
          onClick={handleCopy}
          aria-label={isCopied ? 'Copied to clipboard' : 'Copy short URL'}
          className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl border border-glass-border bg-glass px-4 py-2 text-sm text-slate-200 transition-all duration-200 hover:shadow-glowSm focus:outline-none focus:ring-2 focus:ring-accent-start/50"
        >
          {isCopied ? (
            <>
              <Check className="h-4 w-4 text-accent-start" />
              Copied!
            </>
          ) : (
            <>
              <Copy className="h-4 w-4" />
              Copy
            </>
          )}
        </button>
      </div>
      <p className="mt-2 truncate text-xs text-slate-500" title={url.originalUrl}>
        {url.originalUrl}
      </p>
    </section>
  );
}
