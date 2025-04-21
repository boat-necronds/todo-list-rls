import { z } from "zod"

export const postSchema = z.object({
  id: z.string().uuid(),
  userId: z.string(),
  post: z.string().min(1, "Post is required"),
  insertedAt: z.date(),
})

export type postInput = z.infer<typeof postSchema>
