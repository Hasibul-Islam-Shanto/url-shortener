import { Outlet } from 'react-router-dom';
import { Link2 } from 'lucide-react';

export function PublicLayout() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4 py-12 dark:bg-gray-950">
      <div className="mb-8 flex items-center gap-2 text-xl font-semibold text-gray-900 dark:text-gray-100">
        <Link2 className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
        URL Shortener
      </div>
      <div className="w-full max-w-sm">
        <Outlet />
      </div>
    </div>
  );
}
