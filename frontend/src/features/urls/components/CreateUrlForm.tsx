import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { FormField } from '@/components/FormField';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { applyServerErrors } from '@/utils/applyServerErrors';
import { useCreateUrlMutation } from '../api/useCreateUrlMutation';
import { createUrlSchema, type CreateUrlFormValues } from '../schemas/url.schema';
import type { NormalizedApiError } from '@/types/api';
import type { Url } from '../types';

interface CreateUrlFormProps {
  onCreated: (url: Url) => void;
}

export function CreateUrlForm({ onCreated }: CreateUrlFormProps) {
  const createMutation = useCreateUrlMutation();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<CreateUrlFormValues>({ resolver: zodResolver(createUrlSchema) });

  const onSubmit = async (values: CreateUrlFormValues) => {
    try {
      const url = await createMutation.mutateAsync({
        originalUrl: values.originalUrl,
        shortCode: values.shortCode || undefined,
        expiresAt: values.expiresAt || undefined,
      });
      toast.success('Short URL created');
      onCreated(url);
    } catch (error) {
      const normalized = error as NormalizedApiError;
      if (normalized.statusCode === 409) {
        setError('shortCode', { type: 'server', message: normalized.message });
      } else {
        applyServerErrors(setError, normalized);
      }
      toast.error('Failed to create URL');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {errors.root && (
        <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-900/20 dark:text-red-400">
          {errors.root.message}
        </p>
      )}
      <FormField label="Original URL" htmlFor="originalUrl" error={errors.originalUrl?.message}>
        <Input
          id="originalUrl"
          type="url"
          placeholder="https://example.com/a-very-long-path"
          invalid={!!errors.originalUrl}
          {...register('originalUrl')}
        />
      </FormField>
      <FormField label="Custom alias (optional)" htmlFor="shortCode" error={errors.shortCode?.message}>
        <Input id="shortCode" placeholder="my-link" invalid={!!errors.shortCode} {...register('shortCode')} />
      </FormField>
      <FormField label="Expiration date (optional)" htmlFor="expiresAt" error={errors.expiresAt?.message}>
        <Input id="expiresAt" type="datetime-local" invalid={!!errors.expiresAt} {...register('expiresAt')} />
      </FormField>
      <Button type="submit" className="w-full" loading={isSubmitting}>
        Create short URL
      </Button>
    </form>
  );
}
