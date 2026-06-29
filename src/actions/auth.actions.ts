// actions/auth.actions.ts
'use server'

import { createClient } from '@/lib/supabse/server'
import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import { logger } from '@/lib/logger'
import {
  signUpSchema,
  signInSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from '@/lib/validations/auth.schema'

export async function signUp(email: string, password: string) {
  const parsed = signUpSchema.safeParse({ email, password })
  if (!parsed.success) {
    logger.warn(
      { issues: parsed.error.issues },
      'auth.actions: signUp validation failed'
    )
    return { error: parsed.error.issues[0].message }
  }

  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)
  const { error } = await supabase.auth.signUp(parsed.data)
  if (error) {
    logger.error({ error: error.message }, 'auth.actions: signUp failed')
    return { error: error.message }
  }

  logger.info({ email: parsed.data.email }, 'auth.actions: signUp succeeded, confirmation email sent')
  return { success: true }  // Supabase sends confirmation email automatically
}

export async function signIn(email: string, password: string) {
  const parsed = signInSchema.safeParse({ email, password })
  if (!parsed.success) {
    logger.warn(
      { issues: parsed.error.issues },
      'auth.actions: signIn validation failed'
    )
    return { error: parsed.error.issues[0].message }
  }

  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)
  const { error } = await supabase.auth.signInWithPassword(parsed.data)
  if (error) {
    logger.warn({ email: parsed.data.email, error: error.message }, 'auth.actions: signIn failed')
    return { error: error.message }
  }

  logger.info({ email: parsed.data.email }, 'auth.actions: signIn succeeded')
  redirect('/')
}

export async function signOut(){
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)
  await supabase.auth.signOut()
  logger.info('auth.actions: signOut')
  redirect('/')
}



// add to actions/auth.actions.ts

export async function forgotPassword(email: string) {
  const parsed = forgotPasswordSchema.safeParse({ email })
  if (!parsed.success) {
    logger.warn(
      { issues: parsed.error.issues },
      'auth.actions: forgotPassword validation failed'
    )
    return { error: parsed.error.issues[0].message }
  }

  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)
  const { error } = await supabase.auth.resetPasswordForEmail(parsed.data.email, {
    redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/reset-password`,
  })
  if (error) {
    logger.error({ error: error.message }, 'auth.actions: forgotPassword failed')
    return { error: error.message }
  }

  logger.info({ email: parsed.data.email }, 'auth.actions: forgotPassword reset email sent')
  return { success: true }
}

export async function resetPassword(newPassword: string) {
  const parsed = resetPasswordSchema.safeParse({ newPassword })
  if (!parsed.success) {
    logger.warn(
      { issues: parsed.error.issues },
      'auth.actions: resetPassword validation failed'
    )
    return { error: parsed.error.issues[0].message }
  }

  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)
  const { error } = await supabase.auth.updateUser({ password: parsed.data.newPassword })
  if (error) {
    logger.error({ error: error.message }, 'auth.actions: resetPassword failed')
    return { error: error.message }
  }

  logger.info('auth.actions: resetPassword succeeded')
  redirect('/login')
}
