// app/(public)/datasets/page.tsx
// Explore/browse page — reached from the hero's "Explore marketplace" CTA.
//
// Scroll model: The page scrolls naturally. The SiteHeader and ExploreSearchHeader
// stick to the top (ExploreSearchHeader animates its background). The FiltersSidebar
// sticks to the side while the DatasetResults and the global Footer scroll.

import { ExploreSearchHeader } from '@/components/search-datasets/explore-search-header'
import { FiltersSidebar } from '@/components/search-datasets/filters-sidebar'
import { DatasetResults } from '@/components/search-datasets/dataset-results'

export default function DatasetsPage() {
  return (
    <div className="flex min-h-screen flex-col bg-[#F5F7FA] text-[#181818]">
      <div className="sticky top-0 z-50 flex flex-col">
      
        <ExploreSearchHeader />
      </div>

      <div className="mx-auto flex w-full max-w-[1440px] flex-1 items-start">
        <aside className="sticky top-[152px] h-[calc(100vh-152px)] w-[320px] shrink-0 overflow-y-auto border-r border-[#E5E5E5] bg-[#F5F7FA] pb-8">
          <FiltersSidebar />
        </aside>

        <main className="flex-1 pb-16">
          <DatasetResults />
        </main>
      </div>
    </div>
  )
}
