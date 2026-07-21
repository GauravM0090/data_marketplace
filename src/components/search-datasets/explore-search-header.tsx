// components/datasets/explore-search-header.tsx
// The full-width blue "Search and explore datasets" bar at the top of the
// explore page. Uncontrolled input + local draft state: the store's `q` (which
// drives the actual API query) only updates on submit, not per keystroke, so
// typing never triggers a network request.
'use client'

import { useState, useEffect, type FormEvent } from 'react'
import { useDatasetFilters } from '@/stores/dataset-filters.store'
import { cn } from '@/lib/utils'

export function ExploreSearchHeader() {
  const setSearch = useDatasetFilters((s) => s.setSearch)
  const [draft, setDraft] = useState('')
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setSearch(draft)
  }

  return (
    <div
      className={cn(
        'sticky top-0 z-40 shrink-0 px-6 transition-all duration-300 ease-in-out',
        isScrolled
          ? 'bg-white py-4 shadow-sm border-b border-[#E5E5E5]'
          : 'bg-[#0F1B3D] py-8'
      )}
    >
      <div className={cn("mx-auto max-w-2xl transition-all duration-300", isScrolled ? "max-w-4xl flex items-center gap-4" : "text-center")}>
        <h1 
          className={cn(
            "font-public-sans font-semibold text-white transition-all duration-300 overflow-hidden", 
            isScrolled ? "h-0 opacity-0 text-[0px]" : "h-auto opacity-100 text-2xl"
          )}
        >
          Search and explore datasets
        </h1>
        <form onSubmit={handleSubmit} className={cn("flex items-center gap-3 w-full", isScrolled ? "mt-0" : "mt-5")}>
          <input
            type="text"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="Eg: search health care datasets"
            className={cn(
              "h-12 flex-1 rounded-lg px-4 font-public-sans text-sm text-[#181818] placeholder:text-[#8C8C8C] focus:outline-none focus:ring-2 focus:ring-[#2563EB] transition-colors",
              isScrolled ? "bg-[#F5F7FA] border border-[#E5E5E5]" : "border-0 bg-white"
            )}
          />
          <button
            type="submit"
            className="h-12 shrink-0 rounded-lg bg-[#2563EB] px-6 font-public-sans text-sm font-semibold text-white transition-colors hover:bg-[#1d4ed8]"
          >
            Search
          </button>
        </form>
      </div>
    </div>
  )
}
