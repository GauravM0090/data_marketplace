// (auth)/layout.tsx — shared layout for all auth pages: centered card on gradient background
import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Macgence Data Marketplace — Account',
  description: 'Sign in, sign up, or reset your password for Macgence Data Marketplace.',
}

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#0a0e1a] px-4 py-12">
      {/* Animated gradient blobs */}
      <div className="pointer-events-none absolute -left-32 -top-32 h-[500px] w-[500px] rounded-full bg-[#6366f1]/20 blur-[120px] animate-pulse" />
      <div className="pointer-events-none absolute -bottom-40 -right-40 h-[600px] w-[600px] rounded-full bg-[#8b5cf6]/15 blur-[140px] animate-pulse [animation-delay:1.5s]" />
      <div className="pointer-events-none absolute left-1/2 top-1/3 h-[300px] w-[300px] -translate-x-1/2 rounded-full bg-[#06b6d4]/10 blur-[100px] animate-pulse [animation-delay:3s]" />

      <div className="relative z-10 w-full max-w-md">
        {/* Logo / Brand */}
        <Link href="/" className="mb-8 flex items-center justify-center gap-2 transition-opacity hover:opacity-80">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#6366f1] to-[#8b5cf6] shadow-lg shadow-[#6366f1]/25">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
              <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
              <line x1="12" y1="22.08" x2="12" y2="12" />
            </svg>
          </div>
          <span className="text-xl font-bold tracking-tight text-white">Macgence</span>
        </Link>

        {/* Card */}
        <div className="rounded-2xl border border-white/[0.08] bg-white/[0.04] p-8 shadow-2xl shadow-black/40 backdrop-blur-xl">
          {children}
        </div>

        {/* Footer */}
        <p className="mt-6 text-center text-xs text-white/30">
          © {new Date().getFullYear()} Macgence Data Marketplace. All rights reserved.
        </p>
      </div>
    </div>
  )
}
