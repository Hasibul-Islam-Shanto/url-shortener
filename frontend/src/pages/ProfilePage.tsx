import { Card } from '@/components/ui/Card';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { ProfileForm } from '@/features/profile/components/ProfileForm';
import { useAuth } from '@/store/useAuth';

export function ProfilePage() {
  const { user, isLoading } = useAuth();

  if (isLoading) return <LoadingSpinner fullPage />;
  if (!user) return null;

  return (
    <div className="mx-auto max-w-lg space-y-6">
      <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Profile</h1>
      <Card>
        <ProfileForm user={user} />
      </Card>
    </div>
  );
}
