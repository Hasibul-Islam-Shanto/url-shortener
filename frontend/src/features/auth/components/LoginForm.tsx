import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useLocation, useNavigate, type Location } from 'react-router-dom';
import { toast } from 'sonner';
import { useAuth } from '@/store/useAuth';
import { loginSchema, type LoginFormValues } from '../schemas/auth.schema';
import { FormField } from '@/components/FormField';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { applyServerErrors } from '@/utils/applyServerErrors';
import type { NormalizedApiError } from '@/types/api';

export function LoginForm() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({ resolver: zodResolver(loginSchema) });

  const onSubmit = async (values: LoginFormValues) => {
    try {
      await login(values);
      const from = (location.state as { from?: Location })?.from?.pathname ?? '/urls';
      navigate(from, { replace: true });
    } catch (error) {
      applyServerErrors(setError, error as NormalizedApiError);
      toast.error('Login failed');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {errors.root && (
        <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-900/20 dark:text-red-400">
          {errors.root.message}
        </p>
      )}
      <FormField label="Email" htmlFor="email" error={errors.email?.message}>
        <Input id="email" type="email" autoComplete="email" invalid={!!errors.email} {...register('email')} />
      </FormField>
      <FormField label="Password" htmlFor="password" error={errors.password?.message}>
        <Input
          id="password"
          type="password"
          autoComplete="current-password"
          invalid={!!errors.password}
          {...register('password')}
        />
      </FormField>
      <Button type="submit" className="w-full" loading={isSubmitting}>
        Log in
      </Button>
    </form>
  );
}
