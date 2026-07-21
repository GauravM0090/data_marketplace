import { Hero, TrustedBy, DatasetExploreSection } from "@/components/landing";


export default function HomePage() {
  return (
    <div className="min-h-screen bg-white text-[#181818]">

      <main>
        <Hero />
        <TrustedBy />
        <DatasetExploreSection />
      </main>
    </div>
  )
}
