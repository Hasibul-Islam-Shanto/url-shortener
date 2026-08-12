import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/store/useAuth';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

export function PublicOnlyRoute() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingSpinner fullPage />;
  }

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}
