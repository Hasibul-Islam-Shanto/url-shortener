import { z } from 'zod';
import { ALLOWED_SORT_FIELDS } from './common.validator.js';
import { isAllowedRedirectUrl, isReservedShortCode } from '../utils/urlPolicy.js';

const shortCodeSchema = z
  .string()
  .trim()
  .min(3)
  .max(30)
  .regex(/^[a-zA-Z0-9_-]+$/, 'Short code may only contain letters, numbers, hyphens, and underscores')
  .refine((value) => !isReservedShortCode(value), 'This short code is reserved');

const httpUrlSchema = z
  .string()
  .trim()
  .url()
  .refine((value) => ['http:', 'https:'].includes(new URL(value).protocol), {
    message: 'URL must use http or https',
  })
  .refine(isAllowedRedirectUrl, {
    message: 'URL destination is not allowed',
  });

const futureDateSchema = z
  .coerce
  .date()
  .refine((date) => date.getTime() > Date.now(), { message: 'expiresAt must be a future date' });

export const createUrlSchema = z.object({
  originalUrl: httpUrlSchema,
  shortCode: shortCodeSchema.optional(),
  expiresAt: futureDateSchema.optional(),
});

export const updateUrlSchema = z
  .object({
    originalUrl: httpUrlSchema.optional(),
    isActive: z.boolean().optional(),
    expiresAt: futureDateSchema.nullable().optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: 'At least one field must be provided',
  });

export const listUrlsQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(10),
  sort: z
    .string()
    .regex(/^[a-zA-Z]+:(asc|desc)$/, 'sort must be in the form field:asc|desc')
    .default('createdAt:desc')
    .refine((val) => ALLOWED_SORT_FIELDS.includes(val.split(':')[0]), {
      message: `sort field must be one of ${ALLOWED_SORT_FIELDS.join(', ')}`,
    }),
  status: z.enum(['active', 'disabled', 'expired']).optional(),
  search: z.string().trim().min(1).optional(),
});

export const shortCodeParamSchema = z.object({
  shortCode: z.string().trim().min(1),
});
