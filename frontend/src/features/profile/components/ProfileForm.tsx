import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { FormField } from '@/components/FormField';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { applyServerErrors } from '@/utils/applyServerErrors';
import { useUpdateProfileMutation } from '../api/useUpdateProfileMutation';
import { updateProfileSchema, type UpdateProfileFormValues } from '../schemas/profile.schema';
import type { NormalizedApiError } from '@/types/api';
import type { User } from '@/features/auth/types';

export function ProfileForm({ user }: { user: User }) {
  const updateMutation = useUpdateProfileMutation();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<UpdateProfileFormValues>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: { name: user.name, avatar: user.avatar ?? '' },
  });

  const onSubmit = async (values: UpdateProfileFormValues) => {
    try {
      await updateMutation.mutateAsync({ name: values.name, avatar: values.avatar || null });
      toast.success('Profile updated');
    } catch (error) {
      applyServerErrors(setError, error as NormalizedApiError);
      toast.error('Failed to update profile');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {errors.root && (
        <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-900/20 dark:text-red-400">
          {errors.root.message}
        </p>
      )}
      <FormField label="Email" htmlFor="email-readonly">
        <Input id="email-readonly" value={user.email} disabled />
      </FormField>
      <FormField label="Name" htmlFor="name" error={errors.name?.message}>
        <Input id="name" invalid={!!errors.name} {...register('name')} />
      </FormField>
      <FormField label="Avatar URL (optional)" htmlFor="avatar" error={errors.avatar?.message}>
        <Input id="avatar" placeholder="https://example.com/avatar.png" invalid={!!errors.avatar} {...register('avatar')} />
      </FormField>
      <Button type="submit" loading={isSubmitting}>
        Save changes
      </Button>
    </form>
  );
}
