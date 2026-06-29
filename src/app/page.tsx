import Link from 'next/link'

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

          <div className="flex items-center gap-3">
            <Link
              href="/sign-in"
              className="rounded-lg px-4 py-2 text-sm font-medium text-white/60 transition-colors hover:text-white"
            >
              Sign In
            </Link>
            <Link
              href="/sign-up"
              className="rounded-lg bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] px-4 py-2 text-sm font-semibold shadow-lg shadow-[#6366f1]/20 transition-all hover:shadow-xl hover:shadow-[#6366f1]/30 hover:brightness-110"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* ─── Hero ───────────────────────────────────────────── */}
      <section className="relative flex flex-1 flex-col items-center justify-center overflow-hidden px-6 py-24 text-center">
        {/* Background blobs */}
        <div className="pointer-events-none absolute -left-40 top-0 h-[500px] w-[500px] rounded-full bg-[#6366f1]/15 blur-[140px]" />
        <div className="pointer-events-none absolute -right-40 bottom-0 h-[600px] w-[600px] rounded-full bg-[#8b5cf6]/10 blur-[160px]" />
        <div className="pointer-events-none absolute left-1/2 top-1/2 h-[300px] w-[300px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#06b6d4]/8 blur-[120px]" />

        <div className="relative z-10 mx-auto max-w-3xl">
          {/* Badge */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.04] px-4 py-1.5 text-xs font-medium text-white/50 backdrop-blur-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Now in Early Access
          </div>

          <h1 className="text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
            Premium Datasets for{' '}
            <span className="bg-gradient-to-r from-[#818cf8] via-[#a78bfa] to-[#c084fc] bg-clip-text text-transparent">
              AI &amp; Analytics
            </span>
          </h1>

          <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-white/40 sm:text-lg">
            Browse, preview, and purchase curated datasets across industries. High quality data to power your machine learning models and analytics pipelines.
          </p>

          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/datasets"
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] px-6 py-3.5 text-sm font-semibold shadow-xl shadow-[#6366f1]/25 transition-all hover:shadow-2xl hover:shadow-[#6366f1]/30 hover:brightness-110 active:scale-[0.98]"
            >
              Browse Datasets
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
              </svg>
            </Link>
            <Link
              href="/about"
              className="inline-flex items-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.04] px-6 py-3.5 text-sm font-medium text-white/60 backdrop-blur-sm transition-all hover:border-white/[0.15] hover:bg-white/[0.06] hover:text-white"
            >
              Learn More
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="relative z-10 mx-auto mt-20 grid max-w-2xl grid-cols-3 gap-8">
          {[
            { value: '500+', label: 'Datasets' },
            { value: '12', label: 'Industries' },
            { value: '99.9%', label: 'Uptime' },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-2xl font-bold tracking-tight sm:text-3xl">{stat.value}</p>
              <p className="mt-1 text-xs font-medium uppercase tracking-wider text-white/30">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── Categories ─────────────────────────────────────── */}
      <section className="border-t border-white/[0.06] px-6 py-20">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-center text-2xl font-bold tracking-tight sm:text-3xl">
            Explore by Industry
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-center text-sm text-white/40">
            Curated datasets spanning the most in-demand sectors
          </p>

          <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {[
              { name: 'Finance', icon: '📊', count: 84 },
              { name: 'Healthcare', icon: '🏥', count: 67 },
              { name: 'E-Commerce', icon: '🛒', count: 53 },
              { name: 'NLP & Text', icon: '💬', count: 91 },
              { name: 'Computer Vision', icon: '👁️', count: 78 },
              { name: 'Geospatial', icon: '🌍', count: 42 },
              { name: 'Social Media', icon: '📱', count: 36 },
              { name: 'Climate', icon: '🌡️', count: 29 },
            ].map((cat) => (
              <Link
                key={cat.name}
                href={`/datasets?industry=${cat.name.toLowerCase()}`}
                className="group flex flex-col items-center gap-3 rounded-xl border border-white/[0.06] bg-white/[0.02] p-6 transition-all hover:border-[#6366f1]/30 hover:bg-white/[0.04] hover:shadow-lg hover:shadow-[#6366f1]/5"
              >
                <span className="text-2xl">{cat.icon}</span>
                <span className="text-sm font-medium text-white/70 group-hover:text-white">{cat.name}</span>
                <span className="text-xs text-white/25">{cat.count} datasets</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA ────────────────────────────────────────────── */}
      <section className="border-t border-white/[0.06] px-6 py-20">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Ready to get started?</h2>
          <p className="mt-3 text-sm text-white/40">
            Create a free account and start exploring premium datasets today.
          </p>
          <Link
            href="/sign-up"
            className="mt-8 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] px-6 py-3.5 text-sm font-semibold shadow-xl shadow-[#6366f1]/25 transition-all hover:shadow-2xl hover:shadow-[#6366f1]/30 hover:brightness-110 active:scale-[0.98]"
          >
            Create Free Account
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
            </svg>
          </Link>
        </div>
      </section>

      {/* ─── Footer ─────────────────────────────────────────── */}
      <footer className="border-t border-white/[0.06] px-6 py-10">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 sm:flex-row">
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-gradient-to-br from-[#6366f1] to-[#8b5cf6]">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
                <line x1="12" y1="22.08" x2="12" y2="12" />
              </svg>
            </div>
            <span className="text-sm font-semibold">Macgence</span>
          </div>

          <div className="flex gap-6">
            <Link href="/about" className="text-xs text-white/30 transition-colors hover:text-white/60">About</Link>
            <Link href="/contact" className="text-xs text-white/30 transition-colors hover:text-white/60">Contact</Link>
            <Link href="/datasets" className="text-xs text-white/30 transition-colors hover:text-white/60">Datasets</Link>
          </div>

          <p className="text-xs text-white/20">© {new Date().getFullYear()} Macgence. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}