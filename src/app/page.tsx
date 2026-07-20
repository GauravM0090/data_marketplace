import { cookies } from 'next/headers'
import { createClient } from '@/lib/supabase/server'
import { AuthNavButtons, SignOutButton } from '@/components/auth'

export default async function HomePage() {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)
  const { data } = await supabase.auth.getClaims()
  const user = data?.claims

  return (
    <div className="flex min-h-screen flex-col bg-[#0a0e1a] text-white">
      {/* ─── Minimal Navbar ─────────────────────────────────── */}
      <nav className="sticky top-0 z-50 border-b border-white/[0.06] bg-[#0a0e1a]/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <span className="text-lg font-bold tracking-tight">Onboarding Test</span>
          {user ? <SignOutButton /> : <AuthNavButtons />}
        </div>
      </nav>

      {/* ─── Body ───────────────────────────────────────────── */}
      <main className="flex flex-1 items-center justify-center px-6">
        <div className="text-center">
          {user ? (
            <>
              <h1 className="text-3xl font-bold">Welcome back!</h1>
              <p className="mt-2 text-white/50">
                Signed in as <span className="font-medium text-white">{(user as Record<string, string>).email}</span>
              </p>
            </>
          ) : (
            <>
              <h1 className="text-3xl font-bold">User Onboarding</h1>
              <p className="mt-2 text-white/50">Sign in or create an account to test the flow.</p>
            </>
          )}
        </div>
      </main>
    </div>
  )
}