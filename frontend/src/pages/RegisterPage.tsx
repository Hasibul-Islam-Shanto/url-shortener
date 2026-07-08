import { Link } from 'react-router-dom';
import { Card } from '@/components/ui/Card';
import { RegisterForm } from '@/features/auth/components/RegisterForm';

export function RegisterPage() {
  return (
    <Card>
      <h1 className="mb-1 text-lg font-semibold text-gray-900 dark:text-gray-100">Create an account</h1>
      <p className="mb-6 text-sm text-gray-500 dark:text-gray-400">
        Start shortening and tracking your links.
      </p>
      <RegisterForm />
      <p className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
        Already have an account?{' '}
        <Link to="/login" className="font-medium text-indigo-600 hover:underline dark:text-indigo-400">
          Log in
        </Link>
      </p>
    </Card>
  );
}
