import { Loader2 } from 'lucide-react';
import { cn } from '@/utils/cn';

interface LoadingSpinnerProps {
  className?: string;
  fullPage?: boolean;
}

export function LoadingSpinner({ className, fullPage }: LoadingSpinnerProps) {
  const spinner = <Loader2 className={cn('h-6 w-6 animate-spin text-indigo-600 dark:text-indigo-400', className)} />;

  if (fullPage) {
    return <div className="flex min-h-[50vh] items-center justify-center">{spinner}</div>;
  }

  return spinner;
}
