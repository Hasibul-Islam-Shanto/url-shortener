import { z } from 'zod';

export const updateProfileSchema = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters').max(100),
  avatar: z.union([z.url('Enter a valid URL'), z.literal('')]).optional(),
});

export type UpdateProfileFormValues = z.infer<typeof updateProfileSchema>;
