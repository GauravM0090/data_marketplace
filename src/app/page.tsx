import Link from 'next/link'
import { AuthNavButtons } from '@/components/auth'

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* ─── Navbar ─────────────────────────────────────────── */}
      <nav className="sticky top-0 z-50 border-b border-white/[0.06] bg-[#0a0e1a]/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[#6366f1] to-[#8b5cf6] shadow-lg shadow-[#6366f1]/20">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
                <line x1="12" y1="22.08" x2="12" y2="12" />
              </svg>
            </div>
            <span className="text-lg font-bold tracking-tight">Macgence</span>
          </Link>

          <div className="hidden items-center gap-8 md:flex">
            <Link href="/datasets" className="text-sm text-white/50 transition-colors hover:text-white">Datasets</Link>
            <Link href="/about" className="text-sm text-white/50 transition-colors hover:text-white">About</Link>
            <Link href="/contact" className="text-sm text-white/50 transition-colors hover:text-white">Contact</Link>
          </div>

          <AuthNavButtons />
        </div>
      </nav>
    </div>
  )
}