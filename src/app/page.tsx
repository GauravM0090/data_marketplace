import { Hero, SiteHeader, TrustedBy } from '@/components/landing'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white text-[#181818]">
      <SiteHeader />
      <main>
        <Hero />
        <TrustedBy />
      </main>
    </div>
  )
}
