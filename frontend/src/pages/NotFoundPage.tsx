import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/Button';

export function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-bg-base text-center">
      <h1 className="text-4xl font-bold text-slate-100">404</h1>
      <p className="text-slate-400">This page doesn&apos;t exist.</p>
      <Button asChild>
        <Link to="/urls">Back home</Link>
      </Button>
    </div>
  );
}
