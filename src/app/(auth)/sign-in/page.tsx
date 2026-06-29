// app/(auth)/sign-in/page.tsx
'use client'

import { useState } from 'react'
import { signIn } from '@/actions/auth.actions'
import Link from 'next/link'

export default function SignInPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    const res = await signIn(email, password)
    if (res?.error) setError(res.error)
    setLoading(false)
  }

  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-white">Welcome back</h1>
        <p className="mt-1.5 text-sm text-white/40">Sign in to access your datasets</p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="signin-email" className="text-xs font-medium uppercase tracking-wider text-white/40">
            Email
          </label>
          <input
            id="signin-email"
            type="email"
            required
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="rounded-lg border border-white/[0.08] bg-white/[0.04] px-4 py-3 text-sm text-white placeholder-white/20 outline-none transition-all focus:border-[#6366f1]/50 focus:ring-2 focus:ring-[#6366f1]/20"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <label htmlFor="signin-password" className="text-xs font-medium uppercase tracking-wider text-white/40">
              Password
            </label>
            <Link
              href="/forgot-password"
              className="text-xs font-medium text-[#818cf8] transition-colors hover:text-[#a5b4fc]"
            >
              Forgot password?
            </Link>
          </div>
          <input
            id="signin-password"
            type="password"
            required
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="Enter your password"
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
          {loading ? 'Signing in…' : 'Sign In'}
        </button>
      </form>

      <div className="mt-6 flex items-center gap-3">
        <div className="h-px flex-1 bg-white/[0.06]" />
        <span className="text-xs text-white/20">OR</span>
        <div className="h-px flex-1 bg-white/[0.06]" />
      </div>

      <p className="mt-4 text-center text-sm text-white/40">
        Don&apos;t have an account?{' '}
        <Link href="/sign-up" className="font-medium text-[#818cf8] transition-colors hover:text-[#a5b4fc]">
          Create one
        </Link>
      </p>
    </>
  )
}