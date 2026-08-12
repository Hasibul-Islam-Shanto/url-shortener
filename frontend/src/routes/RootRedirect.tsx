import { Navigate } from 'react-router-dom';
import { useAuth } from '@/store/useAuth';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

export function RootRedirect() {
  const { user, isLoading } = useAuth();

  if (isLoading) return <LoadingSpinner fullPage />;

  return <Navigate to={user ? '/dashboard' : '/login'} replace />;
}
