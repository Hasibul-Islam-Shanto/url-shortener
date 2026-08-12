import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { toast } from 'sonner';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { applyServerErrors } from '@/utils/applyServerErrors';
import { useCreateUrlMutation } from '../api/useCreateUrlMutation';
import { createUrlSchema, type CreateUrlFormValues } from '../schemas/url.schema';
import type { NormalizedApiError } from '@/types/api';
import type { Url } from '../types';
import { cn } from '@/utils/cn';

interface ShortenFormProps {
  onCreated: (url: Url) => void;
}

export function ShortenForm({ onCreated }: ShortenFormProps) {
  const [showCustomize, setShowCustomize] = useState(false);
  const createMutation = useCreateUrlMutation();

  const {
    register,
    handleSubmit,
    setError,
    reset,
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
      reset();
      setShowCustomize(false);
      onCreated(url);
    } catch (error) {
      const normalized = error as NormalizedApiError;
      if (normalized.statusCode === 409) {
        setError('shortCode', { type: 'server', message: normalized.message });
        setShowCustomize(true);
      } else {
        applyServerErrors(setError, normalized);
      }
      toast.error('Failed to create URL');
    }
  };

  return (
    <section className="glass-panel p-6 sm:p-8">
      <h1 className="text-2xl font-semibold text-slate-100">Shorten your link</h1>
      <p className="mt-1 text-sm text-slate-400">Paste a long URL and get a short one instantly.</p>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
        {errors.root && (
          <p className="rounded-xl bg-red-500/10 px-3 py-2 text-sm text-red-400">{errors.root.message}</p>
        )}

        <div className="space-y-2">
          <Input
            id="shorten-original-url"
            type="url"
            placeholder="https://example.com/a-very-long-path"
            invalid={!!errors.originalUrl}
            className="h-12 rounded-full px-4"
            {...register('originalUrl')}
          />
          {errors.originalUrl && (
            <p className="px-1 text-sm text-red-400">{errors.originalUrl.message}</p>
          )}
        </div>

        <button
          type="button"
          onClick={() => setShowCustomize((prev) => !prev)}
          className="flex items-center gap-1 text-sm text-slate-400 transition-colors duration-200 hover:text-accent-start"
        >
          Customize
          {showCustomize ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </button>

        <div className={cn('space-y-3 overflow-hidden transition-all duration-200', showCustomize ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0')}>
          <div className="space-y-1">
            <Input
              id="shortCode"
              placeholder="Custom alias (optional)"
              invalid={!!errors.shortCode}
              className="rounded-xl"
              {...register('shortCode')}
            />
            {errors.shortCode && (
              <p className="text-sm text-red-400">{errors.shortCode.message}</p>
            )}
          </div>
          <div className="space-y-1">
            <Input
              id="expiresAt"
              type="datetime-local"
              invalid={!!errors.expiresAt}
              className="rounded-xl"
              {...register('expiresAt')}
            />
            {errors.expiresAt && (
              <p className="text-sm text-red-400">{errors.expiresAt.message}</p>
            )}
          </div>
        </div>

        <Button type="submit" className="h-12 w-full" loading={isSubmitting}>
          Shorten
        </Button>
      </form>
    </section>
  );
}
