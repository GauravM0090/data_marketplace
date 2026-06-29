// app/(auth)/reset-password/page.tsx
'use client'

import { useState } from 'react'
import { resetPassword } from '@/actions/auth.actions'
import Link from 'next/link'

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
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
    const res = await resetPassword(password)
    if (res?.error) setError(res.error)
    setLoading(false)
  }

  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-white">Set new password</h1>
        <p className="mt-1.5 text-sm text-white/40">Choose a strong password for your account</p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="reset-password" className="text-xs font-medium uppercase tracking-wider text-white/40">
            New Password
          </label>
          <input
            id="reset-password"
            type="password"
            required
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="Min. 6 characters"
            className="rounded-lg border border-white/[0.08] bg-white/[0.04] px-4 py-3 text-sm text-white placeholder-white/20 outline-none transition-all focus:border-[#6366f1]/50 focus:ring-2 focus:ring-[#6366f1]/20"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="reset-confirm" className="text-xs font-medium uppercase tracking-wider text-white/40">
            Confirm Password
          </label>
          <input
            id="reset-confirm"
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
          {loading ? 'Updating…' : 'Update Password'}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-white/40">
        <Link href="/sign-in" className="font-medium text-[#818cf8] transition-colors hover:text-[#a5b4fc]">
          ← Back to Sign In
        </Link>
      </p>
    </>
  )
}