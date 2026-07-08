import { useState } from 'react';
import { toast } from 'sonner';

export function useCopyToClipboard(resetDelayMs = 1800) {
  const [isCopied, setIsCopied] = useState(false);

  const copy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), resetDelayMs);
    } catch {
      toast.error('Failed to copy to clipboard');
    }
  };

  return { copy, isCopied };
}
