// actions/auth.actions.ts
'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import { revalidatePath } from 'next/cache'
import { logger } from '@/lib/logger'
import { prisma } from '@/lib/prisma'
import { getSessionUserId } from '@/services/auth.service'
import {
  emailSchema,
  signUpSchema,
  signInSchema,
  forgotPasswordSchema,
  verifyResetOtpSchema,
  signupOtpSchema, 
  profileSchema,
  type ProfileInput,
} from '@/validations/auth.schema'

// ─── Email-exists pre-check (UX only, not authoritative) ────────────────
// Called by the sign-up form to show an inline "email already taken" hint
// before the user submits. Fail-closed to { exists: false } so validation
// errors / DB outages never block a legitimate signup attempt — the real
// duplicate check is the `identities.length === 0` guard inside `signUp`.

export async function checkEmailExists(email: string) {
  const parsed = emailSchema.safeParse(email)
  if (!parsed.success) {
    // Invalid email format — don't bother querying, just say "not taken".
    return { exists: false }
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email: parsed.data },
      select: { id: true },
    })
    return { exists: !!user }
  } catch (thrown) {
    const err = thrown as Error & { cause?: unknown }
    logger.error(
      {
        name: err?.name,
        message: err?.message,
        cause: err?.cause instanceof Error
          ? { name: err.cause.name, message: err.cause.message }
          : err?.cause,
      },
      'auth.actions: checkEmailExists failed'
    )
    // Fail closed — never block signup on a lookup failure.
    return { exists: false }
  }
}

export async function signUp(email: string, password: string) {
  const parsed = signUpSchema.safeParse({ email, password })
  if (!parsed.success) {
    logger.warn(
      { issues: parsed.error.issues },
      'auth.actions: signUp validation failed'
    )
    return { error: parsed.error.issues[0].message }
  }

  logger.info({ email: parsed.data.email }, 'auth.actions: signUp invoked — calling supabase.auth.signUp')

  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)

  let data, error
  try {
    ;({ data, error } = await supabase.auth.signUp(parsed.data))
  } catch (thrown) {
    // Network-level failures (DNS, timeout, connection refused) can throw
    // rather than resolve with { error } — catch these separately.
    const err = thrown as Error & { cause?: unknown }
    logger.error(
      {
        name: err?.name,
        message: err?.message,
        cause: err?.cause instanceof Error
          ? { name: err.cause.name, message: err.cause.message }
          : err?.cause,
        stack: err?.stack,
      },
      'auth.actions: signUp threw before returning'
    )
    return { error: 'Could not reach the auth service. Please try again in a moment.' }
  }

  if (error) {
    // AuthApiError has status/code and a real message.
    // AuthRetryableFetchError often has an empty top-level message with the
    // real reason nested in `cause` (e.g. underlying fetch/SMTP failure).
    const cause = (error as { cause?: unknown }).cause
    logger.error(
      {
        name: error.name,
        status: error.status,
        code: error.code,
        message: error.message || null,
        cause:
          cause instanceof Error
            ? { name: cause.name, message: cause.message, stack: cause.stack }
            : cause ?? null,
      },
      'auth.actions: signUp failed'
    )

    // Give a specific, useful message per failure type instead of the generic fallback.
    if (error.name === 'AuthRetryableFetchError') {
      return {
        error:
          'Email service is temporarily unavailable (this can happen if you just requested a code — please wait a bit and try again).',
      }
    }

    return { error: error.message || 'Could not create your account. Please try again.' }
  }

  logger.info(
    {
      email: parsed.data.email,
      userId: data.user?.id,
      identitiesCount: data.user?.identities?.length ?? null,
      confirmationSentAt: data.user?.confirmation_sent_at ?? null,
    },
    'auth.actions: signUp returned'
  )

  if (data.user?.identities?.length === 0) {
    logger.warn({ email: parsed.data.email }, 'auth.actions: signUp — email already registered, no email sent')
    return { error: 'An account with this email already exists. Try logging in instead.' }
  }

  logger.info({ email: parsed.data.email }, 'auth.actions: signUp succeeded, confirmation email sent')
  return { success: true }
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
  // Session cookie is set. Return success so the auth modal can close in
  // place and keep the user on their current route (no redirect).
  return { success: true }
}

export async function signOut() {
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
  // OTP-based reset: with no `redirectTo`, Supabase emails the recovery
  // {{ .Token }} (a 6-digit code) instead of a magic link. The email template
  // must include {{ .Token }} for the code to appear. The user enters that
  // code in step 2 — see verifyPasswordResetOtp.
  const { error } = await supabase.auth.resetPasswordForEmail(parsed.data.email)
  if (error) {
    logger.error({ error: error.message }, 'auth.actions: forgotPassword failed')
    return { error: error.message }
  }

  logger.info({ email: parsed.data.email }, 'auth.actions: forgotPassword reset code sent')
  return { success: true }
}

export async function verifyPasswordResetOtp(
  email: string,
  token: string,
  newPassword: string
) {
  const parsed = verifyResetOtpSchema.safeParse({ email, token, newPassword })
  if (!parsed.success) {
    logger.warn(
      { issues: parsed.error.issues },
      'auth.actions: verifyPasswordResetOtp validation failed'
    )
    return { error: parsed.error.issues[0].message }
  }

  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)

  // Verify the recovery code — on success this establishes a session (written
  // to the auth cookie via the SSR client), which updateUser then relies on.
  const { error: verifyError } = await supabase.auth.verifyOtp({
    email: parsed.data.email,
    token: parsed.data.token,
    type: 'recovery',
  })
  if (verifyError) {
    logger.warn({ error: verifyError.message }, 'auth.actions: verifyPasswordResetOtp verify failed')
    return { error: verifyError.message }
  }

  const { error: updateError } = await supabase.auth.updateUser({
    password: parsed.data.newPassword,
  })
  if (updateError) {
    logger.error({ error: updateError.message }, 'auth.actions: verifyPasswordResetOtp update failed')
    return { error: updateError.message }
  }

  logger.info({ email: parsed.data.email }, 'auth.actions: verifyPasswordResetOtp succeeded')
  // User is signed in with the new password. Return success so the form can
  // close in place and keep them on their current route.
  return { success: true }
}

export async function verifySignupOtp(email: string, token: string) {
  const parsed = signupOtpSchema.safeParse({ email, token })
  if (!parsed.success) {
    logger.warn(
      { issues: parsed.error.issues },
      'auth.actions: verifySignupOtp validation failed'
    )
    return { error: parsed.error.issues[0].message }
  }

  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)

  // Confirm the signup code — on success this establishes a session (cookie).
  const { error } = await supabase.auth.verifyOtp({
    email: parsed.data.email,
    token: parsed.data.token,
    type: 'signup',
  })
  if (error) {
    logger.warn({ error: error.message }, 'auth.actions: verifySignupOtp failed')
    return { error: error.message }
  }

  // Seed full_name from the email prefix if the DB trigger left it null, so the
  // user has a sensible name even when they skip the profile step.
  const userId = await getSessionUserId(cookieStore)
  if (userId) {
    const fallbackName = parsed.data.email.split('@')[0]
    // Best-effort: only set when the trigger-created row still has a null name.
    // Non-fatal — auth already succeeded, so don't fail verification if the
    // `users` row/trigger isn't set up in this project's DB yet.
    try {
      await prisma.user.updateMany({
        where: { id: userId, fullName: null },
        data: { fullName: fallbackName },
      })
    } catch (err) {
      logger.warn({ err: (err as Error).message, userId }, 'auth.actions: verifySignupOtp name backfill skipped')
    }
  }

  logger.info({ email: parsed.data.email }, 'auth.actions: verifySignupOtp succeeded')
  return { success: true }
}

export async function updateProfile(input: ProfileInput) {
  const parsed = profileSchema.safeParse(input)
  if (!parsed.success) {
    logger.warn(
      { issues: parsed.error.issues },
      'auth.actions: updateProfile validation failed'
    )
    return { error: parsed.error.issues[0].message }
  }

  const cookieStore = await cookies()
  const userId = await getSessionUserId(cookieStore)
  if (!userId) {
    return { error: 'You must be signed in to update your profile.' }
  }

  // Empty optional fields are left untouched; full_name falls back to the email
  // prefix when blank so the user always has a display name.
  const { fullName, organization, industry, jobTitle } = parsed.data
  const user = await prisma.user.findUnique({ where: { id: userId }, select: { email: true } })
  const resolvedName =
    fullName?.trim() || user?.email?.split('@')[0] || null

  await prisma.user.update({
    where: { id: userId },
    data: {
      fullName: resolvedName,
      organization: organization?.trim() || null,
      industry: industry?.trim() || null,
      jobTitle: jobTitle?.trim() || null,
    },

  })

  logger.info({ userId }, 'auth.actions: updateProfile succeeded')
  revalidatePath('/profile')
  return { success: true }
}
