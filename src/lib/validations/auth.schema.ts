import { z } from 'zod'

// Email/password bounds enforced server-side — the client forms (sign-up,
// reset-password pages) already check these, but server actions must never
// trust client-side checks alone since they can be bypassed by calling the
// action directly.
const email = z
  .string()
  .trim()
  .toLowerCase()
  .min(1, 'Email is required')
  .max(255, 'Email is too long')
  .email('Enter a valid email address')

// Matches the "Min. 6 characters" rule already shown on the sign-up/reset-password
// forms. Capped at 128 so an oversized payload can't be pushed into Supabase Auth.
const newPassword = z
  .string()
  .min(6, 'Password must be at least 6 characters')
  .max(128, 'Password is too long')

export const signUpSchema = z.object({
  email,
  password: newPassword,
})

export const signInSchema = z.object({
  email,
  // Signing in just checks an existing credential, so only bound the length —
  // don't re-enforce the creation-time complexity rule here.
  password: z.string().min(1, 'Password is required').max(128, 'Password is too long'),
})

export const forgotPasswordSchema = z.object({
  email,
})

export const resetPasswordSchema = z.object({
  newPassword,
})

export type SignUpInput = z.infer<typeof signUpSchema>
export type SignInInput = z.infer<typeof signInSchema>
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>
