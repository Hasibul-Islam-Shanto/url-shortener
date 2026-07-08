import { z } from 'zod';

const shortCodeSchema = z
  .string()
  .trim()
  .min(3, 'Short code must be at least 3 characters')
  .max(30, 'Short code must be at most 30 characters')
  .regex(/^[a-zA-Z0-9_-]+$/, 'Only letters, numbers, hyphens, and underscores are allowed');

const futureDateSchema = z
  .string()
  .min(1)
  .refine((val) => new Date(val).getTime() > Date.now(), 'Expiration must be a future date');

export const createUrlSchema = z.object({
  originalUrl: z.url('Enter a valid URL'),
  shortCode: z.union([shortCodeSchema, z.literal('')]).optional(),
  expiresAt: z.union([futureDateSchema, z.literal('')]).optional(),
});

export type CreateUrlFormValues = z.infer<typeof createUrlSchema>;

export const updateUrlSchema = z.object({
  originalUrl: z.url('Enter a valid URL'),
  isActive: z.boolean(),
  expiresAt: z.union([futureDateSchema, z.literal('')]).optional(),
});

export type UpdateUrlFormValues = z.infer<typeof updateUrlSchema>;
