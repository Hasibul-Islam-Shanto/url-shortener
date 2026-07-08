import { Link } from 'react-router-dom';
import { Card } from '@/components/ui/Card';
import { LoginForm } from '@/features/auth/components/LoginForm';

export function LoginPage() {
  return (
    <Card>
      <h1 className="mb-1 text-lg font-semibold text-gray-900 dark:text-gray-100">Welcome back</h1>
      <p className="mb-6 text-sm text-gray-500 dark:text-gray-400">Log in to manage your short URLs.</p>
      <LoginForm />
      <p className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
        Don&apos;t have an account?{' '}
        <Link to="/register" className="font-medium text-indigo-600 hover:underline dark:text-indigo-400">
          Sign up
        </Link>
      </p>
    </Card>
  );
}
