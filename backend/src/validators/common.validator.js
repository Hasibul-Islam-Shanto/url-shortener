import { z } from 'zod';
import mongoose from 'mongoose';

export const objectIdSchema = z.object({
  id: z.string().refine((val) => mongoose.Types.ObjectId.isValid(val), {
    message: 'Invalid id format',
  }),
});

export const ALLOWED_SORT_FIELDS = ['createdAt', 'clickCount', 'updatedAt', 'originalUrl'];

export const paginationSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(10),
});
