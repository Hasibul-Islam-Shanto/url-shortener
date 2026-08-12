import { AmbientBackground } from '@/components/layout/AmbientBackground';
import { Navbar } from '@/components/layout/Navbar';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';
import { Outlet } from 'react-router-dom';

export function AppLayout() {
  useKeyboardShortcuts();

  return (
    <div className="relative min-h-screen bg-bg-base">
      <AmbientBackground />
      <Navbar />
      <main className="mx-auto max-w-3xl px-4 py-8 sm:py-12">
        <Outlet />
      </main>
    </div>
  );
}
