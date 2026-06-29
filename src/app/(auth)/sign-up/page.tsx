// app/(auth)/sign-up/page.tsx
'use client'

import { useState } from 'react'
import { signUp } from '@/actions/auth.actions'
import Link from 'next/link'

export default function SignupPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [done, setDone] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }

    setLoading(true)
    const res = await signUp(email, password)
    if (res?.error) setError(res.error)
    else setDone(true)
    setLoading(false)
  }

  if (done) {
    return (
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/10">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
        <h2 className="text-xl font-semibold text-white">Check your email</h2>
        <p className="text-sm text-white/50">
          We&apos;ve sent a confirmation link to <span className="font-medium text-white/70">{email}</span>. Click the link to activate your account.
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
        <h1 className="text-2xl font-bold tracking-tight text-white">Create your account</h1>
        <p className="mt-1.5 text-sm text-white/40">Start exploring premium datasets today</p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="signup-email" className="text-xs font-medium uppercase tracking-wider text-white/40">
            Email
          </label>
          <input
            id="signup-email"
            type="email"
            required
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="rounded-lg border border-white/[0.08] bg-white/[0.04] px-4 py-3 text-sm text-white placeholder-white/20 outline-none transition-all focus:border-[#6366f1]/50 focus:ring-2 focus:ring-[#6366f1]/20"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="signup-password" className="text-xs font-medium uppercase tracking-wider text-white/40">
            Password
          </label>
          <input
            id="signup-password"
            type="password"
            required
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="Min. 6 characters"
            className="rounded-lg border border-white/[0.08] bg-white/[0.04] px-4 py-3 text-sm text-white placeholder-white/20 outline-none transition-all focus:border-[#6366f1]/50 focus:ring-2 focus:ring-[#6366f1]/20"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="signup-confirm" className="text-xs font-medium uppercase tracking-wider text-white/40">
            Confirm Password
          </label>
          <input
            id="signup-confirm"
            type="password"
            required
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
            placeholder="Re-enter your password"
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
          {loading ? 'Creating account…' : 'Create Account'}
        </button>
      </form>

      <div className="mt-6 flex items-center gap-3">
        <div className="h-px flex-1 bg-white/[0.06]" />
        <span className="text-xs text-white/20">OR</span>
        <div className="h-px flex-1 bg-white/[0.06]" />
      </div>

      <p className="mt-4 text-center text-sm text-white/40">
        Already have an account?{' '}
        <Link href="/sign-in" className="font-medium text-[#818cf8] transition-colors hover:text-[#a5b4fc]">
          Sign in
        </Link>
      </p>
    </>
  )
}