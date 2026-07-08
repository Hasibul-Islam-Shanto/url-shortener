import { Check, Copy } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/Button';
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
    toast.success('Short URL copied to clipboard');
  };

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      onClick={handleCopy}
      className={cn('gap-1.5', className)}
    >
      {isCopied ? <Check className="h-3.5 w-3.5 text-green-600" /> : <Copy className="h-3.5 w-3.5" />}
      {shortUrl.replace(/^https?:\/\//, '')}
    </Button>
  );
}
