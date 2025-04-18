import { z } from 'zod';

export const postSchema = z.object({
  id: z.string().uuid(),
  userId: z.string(),
  post: z.string().min(1, 'Post is required'),
  insertedAt: z.date(),
});

export const postFormInputSchema = postSchema.pick({
  post: true,
});

export type postsInput = z.infer<typeof postSchema>;
export type postFormInput = z.infer<typeof postFormInputSchema>;
