import { Check, Copy } from 'lucide-react';
import { useCopyToClipboard } from '@/hooks/useCopyToClipboard';
import { buildShortUrl } from '../utils/buildShortUrl';
import { cn } from '@/utils/cn';

interface CopyIconButtonProps {
  shortCode: string;
}

export function CopyIconButton({ shortCode }: CopyIconButtonProps) {
  const { copy, isCopied } = useCopyToClipboard();
  const shortUrl = buildShortUrl(shortCode);

  const handleCopy = async () => {
    await copy(shortUrl);
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      aria-label={isCopied ? 'Copied to clipboard' : 'Copy short URL'}
      className={cn(
        'rounded-xl p-2 text-slate-400 transition-all duration-200 hover:bg-white/[0.08] hover:text-accent-start hover:shadow-glowSm',
        isCopied && 'text-accent-start'
      )}
    >
      {isCopied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
    </button>
  );
}
