import { Check, Copy } from 'lucide-react';
import { toast } from 'sonner';
import { useCopyToClipboard } from '@/hooks/useCopyToClipboard';
import { buildShortUrl } from '../utils/buildShortUrl';
import { cn } from '@/utils/cn';

interface CopyShortUrlButtonProps {
  shortCode: string;
  className?: string;
}

export function CopyShortUrlButton({ shortCode, className }: CopyShortUrlButtonProps) {
  const { copy, isCopied } = useCopyToClipboard();
  const shortUrl = buildShortUrl(shortCode);

  const handleCopy = async () => {
    await copy(shortUrl);
    toast.success('Copied!');
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      aria-label={isCopied ? 'Copied to clipboard' : 'Copy short URL'}
      className={cn(
        'inline-flex max-w-full items-center gap-1.5 rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs text-slate-200 transition-all duration-200 hover:shadow-glowSm focus:outline-none focus:ring-2 focus:ring-indigo-400/50 focus:shadow-glowSm',
        isCopied &&
          'animate-copy-pulse border-green-500/30 bg-green-500/10 text-green-400 shadow-glow-green',
        className
      )}
    >
      {isCopied ? (
        <Check className="h-3.5 w-3.5 shrink-0 text-green-400" />
      ) : (
        <Copy className="h-3.5 w-3.5 shrink-0 text-slate-400" />
      )}
      <span className="truncate">{isCopied ? 'Copied!' : shortUrl.replace(/^https?:\/\//, '')}</span>
    </button>
  );
}
