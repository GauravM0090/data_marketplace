// app/(auth)/forgot-password/page.tsx
'use client'

import { useState } from 'react'
import { forgotPassword } from '@/actions/auth.actions'
import Link from 'next/link'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    const res = await forgotPassword(email)
    if (res?.error) setError(res.error)
    else setSent(true)
    setLoading(false)
  }

  if (sent) {
    return (
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#6366f1]/10">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#818cf8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="4" width="20" height="16" rx="2" />
            <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
          </svg>
        </div>
        <h2 className="text-xl font-semibold text-white">Reset link sent</h2>
        <p className="text-sm text-white/50">
          We&apos;ve sent a password reset link to <span className="font-medium text-white/70">{email}</span>. Check your inbox and follow the instructions.
        </p>
        <Link
          href="/sign-in"
          className="mt-2 inline-flex items-center gap-1.5 text-sm font-medium text-[#818cf8] transition-colors hover:text-[#a5b4fc]"
        >
          ← Back to Sign In
        </Link>
      </div>
    )
  }

  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-white">Forgot password?</h1>
        <p className="mt-1.5 text-sm text-white/40">
          No worries — enter your email and we&apos;ll send you a reset link
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="forgot-email" className="text-xs font-medium uppercase tracking-wider text-white/40">
            Email
          </label>
          <input
            id="forgot-email"
            type="email"
            required
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="rounded-lg border border-white/[0.08] bg-white/[0.04] px-4 py-3 text-sm text-white placeholder-white/20 outline-none transition-all focus:border-[#6366f1]/50 focus:ring-2 focus:ring-[#6366f1]/20"
          />
        </div>

        {error && (
          <div className="rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-2.5 text-sm text-red-300">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="mt-1 flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-[#6366f1]/25 transition-all hover:shadow-xl hover:shadow-[#6366f1]/30 hover:brightness-110 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading && (
            <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          )}
          {loading ? 'Sending…' : 'Send Reset Link'}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-white/40">
        Remember your password?{' '}
        <Link href="/sign-in" className="font-medium text-[#818cf8] transition-colors hover:text-[#a5b4fc]">
          Sign in
        </Link>
      </p>
    </>
  )
}
