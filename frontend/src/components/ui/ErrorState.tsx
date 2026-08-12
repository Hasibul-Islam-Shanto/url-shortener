import { AlertTriangle } from 'lucide-react';
import { Button } from './Button';

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

export function ErrorState({ message = 'Something went wrong.', onRetry }: ErrorStateProps) {
  return (
    <div className="glass-panel flex flex-col items-center justify-center gap-3 px-6 py-12 text-center">
      <AlertTriangle className="h-8 w-8 text-red-500" />
      <p className="text-sm font-medium text-red-400">{message}</p>
      {onRetry && (
        <Button variant="outline" size="sm" onClick={onRetry}>
          Try again
        </Button>
      )}
    </div>
  );
}
