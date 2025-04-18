import { z } from "zod"

export const FormStateSchema = z.object({
  status: z.enum(["idle", "loading", "success", "error"]),
  message: z.string().optional(),
  errors: z.record(z.string(), z.array(z.string())).optional(), // zod error
  errorDetails: z
    .array(
      z.object({
        path: z.string().optional(),
        message: z.string().optional(),
      })
    )
    .optional(), // api error details from validation
  data: z.any().optional(),
})

export const userSignUpSchema = z.object({
  id: z.string().optional(),
  username: z.string().min(1, "Username is required"),
  role: z.string().optional(),
  password: z.string().optional(),
})

export const userSignInSchema = z.object({
  email: z
    .string()
    .min(1, "Username is required")
    .regex(/^\S+$/, "Username must not contain whitespace"),
  name: z.string().min(1, "Username is required"),
  password: z
    .string()
    .min(1, "Password is required")
    .regex(/^\S+$/, "Password must not contain whitespace"),
  role: z.string(),
})

export const todoSchema = z.object({
  id: z.string().uuid(),
  userId: z.string(),
  task: z.string().min(1, "Task is required"),
  isComplete: z.boolean(),
  insertedAt: z.date(),
})

export const signInSchema = z.object({
  email: z.string().min(1, "Email is required"),
  password: z.string().min(1, "Password is required"),
})

export const userSignUpInputSchema = userSignUpSchema.pick({
  id: true,
  username: true,
  role: true,
  password: true,
})

export const userSignInInputSchema = userSignInSchema.pick({
  email: true,
  password: true,
  name: true,
  role: true,
})

export const userProfileSchema = userSignUpSchema.pick({
  username: true,
  role: true,
})

export const todoTaskInputSchema = todoSchema.pick({
  task: true,
})

export type FormState = z.infer<typeof FormStateSchema>
export type UserInputSignUpForm = z.infer<typeof userSignUpSchema>
export type UserInputSignInForm = z.infer<typeof userSignInSchema>
export type UserProfileForm = z.infer<typeof userProfileSchema>
export type signInInput = z.infer<typeof signInSchema>

export type todoInput = z.infer<typeof todoSchema>
export type todoTaskInput = z.infer<typeof todoTaskInputSchema>
