import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { FormField } from '@/components/FormField';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { applyServerErrors } from '@/utils/applyServerErrors';
import { useUpdateUrlMutation } from '../api/useUpdateUrlMutation';
import { updateUrlSchema, type UpdateUrlFormValues } from '../schemas/url.schema';
import { toDatetimeLocalValue } from '../utils/toDatetimeLocalValue';
import type { NormalizedApiError } from '@/types/api';
import type { Url } from '../types';

interface EditUrlFormProps {
  url: Url;
  onSaved: () => void;
}

export function EditUrlForm({ url, onSaved }: EditUrlFormProps) {
  const updateMutation = useUpdateUrlMutation(url._id);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<UpdateUrlFormValues>({
    resolver: zodResolver(updateUrlSchema),
    defaultValues: {
      originalUrl: url.originalUrl,
      isActive: url.isActive,
      expiresAt: toDatetimeLocalValue(url.expiresAt),
    },
  });

  const onSubmit = async (values: UpdateUrlFormValues) => {
    try {
      await updateMutation.mutateAsync({
        originalUrl: values.originalUrl,
        isActive: values.isActive,
        expiresAt: values.expiresAt || null,
      });
      toast.success('URL updated');
      onSaved();
    } catch (error) {
      applyServerErrors(setError, error as NormalizedApiError);
      toast.error('Failed to update URL');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {errors.root && (
        <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-900/20 dark:text-red-400">
          {errors.root.message}
        </p>
      )}
      <FormField label="Short code" htmlFor="shortCode-readonly">
        <Input id="shortCode-readonly" value={url.shortCode} disabled />
      </FormField>
      <FormField label="Original URL" htmlFor="originalUrl" error={errors.originalUrl?.message}>
        <Input id="originalUrl" type="url" invalid={!!errors.originalUrl} {...register('originalUrl')} />
      </FormField>
      <FormField label="Expiration date" htmlFor="expiresAt" error={errors.expiresAt?.message}>
        <Input id="expiresAt" type="datetime-local" invalid={!!errors.expiresAt} {...register('expiresAt')} />
      </FormField>
      <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
        <input type="checkbox" className="h-4 w-4 rounded" {...register('isActive')} />
        Active
      </label>
      <Button type="submit" className="w-full" loading={isSubmitting}>
        Save changes
      </Button>
    </form>
  );
}
