'use client'

import React, { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useDatasets } from '@/hooks/use-datasets'
import { useDatasetFacets } from '@/hooks/use-dataset-facets'
import { useDatasetFilters, type FacetKey } from '@/stores/dataset-filters.store'
import { DatasetCard } from '@/components/search-datasets/dataset-card'
import type { DatasetSort } from '@/validations/dataset.schema'

export function DatasetExploreSection() {
  const router = useRouter()
  
  // Data
  const { data, isPending } = useDatasets()
  const { data: facetsData } = useDatasetFacets()

  // State
  const { q, setSearch, facets, toggleFacet, clearAll, sort, setSort, minQuality, setMinQuality } = useDatasetFilters()
  const [draftSearch, setDraftSearch] = useState(q)

  // Update local search if global changes
  useEffect(() => {
    setDraftSearch(q)
  }, [q])

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    setSearch(draftSearch)
  }

  // Active filters for tags
  const activeTags: { label: string; onRemove: () => void }[] = []
  
  Object.entries(facets).forEach(([key, values]) => {
    values.forEach(val => {
      activeTags.push({
        label: val,
        onRemove: () => toggleFacet(key as FacetKey, val)
      })
    })
  })

  if (minQuality) {
    activeTags.push({
      label: `${minQuality}+ Quality`,
      onRemove: () => setMinQuality(null)
    })
  }

  return (
    <section className="w-full bg-[#EFF6FF] py-16">
      <div className="mx-auto max-w-[1200px] px-5">
        <h2 className="mb-10 text-center text-2xl font-bold text-[#181818] md:text-3xl">
          We got every dataset you need. Search and explore now.
        </h2>

        <div className="rounded-3xl bg-[#283350] p-4 md:p-8">
          {/* Search bar */}
          <form onSubmit={handleSearch} className="mb-6 flex items-center gap-3 rounded-xl bg-white p-2">
            <input
              type="text"
              value={draftSearch}
              onChange={(e) => setDraftSearch(e.target.value)}
              placeholder="Eg: search health care datasets"
              className="flex-1 bg-transparent px-4 py-2.5 text-sm text-[#616161] outline-none placeholder:text-[#8C8C8C]"
            />
            <button
              type="submit"
              className="shrink-0 rounded-lg bg-[#2563EB] px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#1D4ED8]"
            >
              Search
            </button>
          </form>

          {/* Filter bar */}
          <div className="mb-6 rounded-xl bg-white p-4">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-sm font-semibold text-[#181818]">Filter by</span>
              {activeTags.length > 0 && (
                <button type="button" onClick={clearAll} className="text-sm text-[#2563EB] hover:underline">
                  Clear all
                </button>
              )}
            </div>
            
            {/* Filter pills */}
            <div className="mb-3 flex flex-wrap gap-2">
              <FilterDropdown 
                label="Industry" 
                count={facets.industry.length}
                options={facetsData?.industry?.map(f => f.value) || []}
                selected={facets.industry}
                onToggle={(val) => toggleFacet('industry', val)}
              />
              <FilterDropdown 
                label="Modality" 
                count={facets.modality.length}
                options={facetsData?.modality?.map(f => f.value) || []}
                selected={facets.modality}
                onToggle={(val) => toggleFacet('modality', val)}
              />
              
              {/* Sort Dropdown */}
              <SortDropdown sort={sort} setSort={setSort} />

              <FilterDropdown 
                label="License type" 
                count={facets.licenseType.length}
                options={facetsData?.licenseType?.map(f => f.value) || []}
                selected={facets.licenseType}
                onToggle={(val) => toggleFacet('licenseType', val)}
              />

              {/* Quality Dropdown */}
              <QualityDropdown quality={minQuality} setQuality={setMinQuality} />

              <FilterDropdown 
                label="More (Use cases)" 
                count={facets.useCase.length}
                options={facetsData?.useCase?.map(f => f.value) || []}
                selected={facets.useCase}
                onToggle={(val) => toggleFacet('useCase', val)}
              />
            </div>

            {/* Active tags */}
            {activeTags.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-2 border-t border-[#F0F0F0] mt-3">
                {activeTags.map((tag, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center gap-1.5 rounded-full border border-[#CBD5E1] bg-white px-3 py-1.5 text-xs font-medium text-[#181818]"
                  >
                    {tag.label}
                    <button type="button" onClick={tag.onRemove} className="text-[#8C8C8C] hover:text-[#181818]">
                      <XIcon />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Results count */}
          <p className="mb-4 text-sm font-semibold text-white">
            {isPending ? 'Loading...' : `${data?.pagination.total || 0} datasets match your results`}
          </p>

          {/* Dataset cards */}
          <div className="grid gap-4 sm:grid-cols-2 min-h-[300px]">
            {!isPending && data?.datasets.slice(0, 4).map((dataset) => (
              <DatasetCard key={dataset.id} dataset={dataset} />
            ))}
          </div>

          {/* View all button */}
          <div className="mt-6 flex justify-center">
            <Link
              href="/datasets"
              className="inline-flex items-center gap-2 rounded-lg border border-white bg-transparent px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-white/10"
            >
              View all {data?.pagination.total || 0} Datasets
              <ArrowRightIcon />
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

// Helper components

function useOnClickOutside(ref: React.RefObject<HTMLElement | null>, handler: () => void) {
  useEffect(() => {
    const listener = (event: MouseEvent | TouchEvent) => {
      if (!ref.current || ref.current.contains(event.target as Node)) {
        return
      }
      handler()
    }
    document.addEventListener('mousedown', listener)
    document.addEventListener('touchstart', listener)
    return () => {
      document.removeEventListener('mousedown', listener)
      document.removeEventListener('touchstart', listener)
    }
  }, [ref, handler])
}

function FilterDropdown({ 
  label, 
  count, 
  options, 
  selected, 
  onToggle 
}: { 
  label: string
  count: number
  options: string[]
  selected: string[]
  onToggle: (val: string) => void
}) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  useOnClickOutside(ref, () => setOpen(false))

  const isActive = count > 0 || open

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
          isActive 
            ? 'bg-[#2563EB] text-white' 
            : 'bg-[#F4F7FB] text-[#616161] hover:bg-[#E2E8F0]'
        }`}
      >
        {label}
        {count > 0 && (
          <span className={`flex h-4 w-4 items-center justify-center rounded-full text-[10px] font-bold ${isActive ? 'bg-white text-[#2563EB]' : 'bg-[#CBD5E1] text-[#181818]'}`}>
            {count}
          </span>
        )}
        <ChevronDownIcon />
      </button>

      {open && (
        <div className="absolute left-0 top-full z-50 mt-1 max-h-60 w-48 overflow-y-auto rounded-lg border border-[#E5E5E5] bg-white p-2 shadow-lg">
          {options.length === 0 ? (
            <div className="px-2 py-1 text-xs text-[#8C8C8C]">No options</div>
          ) : (
            options.map(opt => (
              <label key={opt} className="flex cursor-pointer items-center gap-2 rounded px-2 py-1.5 hover:bg-[#F4F7FB]">
                <input
                  type="checkbox"
                  checked={selected.includes(opt)}
                  onChange={() => onToggle(opt)}
                  className="rounded border-[#CBD5E1] text-[#2563EB] focus:ring-[#2563EB]"
                />
                <span className="text-sm text-[#181818]">{opt}</span>
              </label>
            ))
          )}
        </div>
      )}
    </div>
  )
}

const SORT_OPTIONS: { value: DatasetSort, label: string }[] = [
  { value: 'recent', label: 'Last updated' },
  { value: 'quality', label: 'Highest quality' },
  { value: 'price_asc', label: 'Price: low to high' },
  { value: 'price_desc', label: 'Price: high to low' },
]

function SortDropdown({ sort, setSort }: { sort: DatasetSort, setSort: (s: DatasetSort) => void }) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  useOnClickOutside(ref, () => setOpen(false))

  const activeLabel = SORT_OPTIONS.find(o => o.value === sort)?.label

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
          open 
            ? 'bg-[#2563EB] text-white' 
            : 'bg-[#F4F7FB] text-[#616161] hover:bg-[#E2E8F0]'
        }`}
      >
        Sort: {activeLabel}
        <ChevronDownIcon />
      </button>

      {open && (
        <div className="absolute left-0 top-full z-50 mt-1 w-48 rounded-lg border border-[#E5E5E5] bg-white p-2 shadow-lg">
          {SORT_OPTIONS.map(opt => (
            <button
              key={opt.value}
              onClick={() => { setSort(opt.value); setOpen(false) }}
              className={`w-full text-left rounded px-2 py-1.5 text-sm ${sort === opt.value ? 'bg-[#F4F7FB] font-medium text-[#2563EB]' : 'text-[#181818] hover:bg-[#F4F7FB]'}`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

function QualityDropdown({ quality, setQuality }: { quality: number | null, setQuality: (q: number | null) => void }) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  useOnClickOutside(ref, () => setOpen(false))

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
          quality !== null || open 
            ? 'bg-[#2563EB] text-white' 
            : 'bg-[#F4F7FB] text-[#616161] hover:bg-[#E2E8F0]'
        }`}
      >
        Data quality score {quality !== null ? `(${quality}+)` : ''}
        <ChevronDownIcon />
      </button>

      {open && (
        <div className="absolute left-0 top-full z-50 mt-1 w-48 rounded-lg border border-[#E5E5E5] bg-white p-2 shadow-lg">
          {[9, 8, 7, 6].map(q => (
            <button
              key={q}
              onClick={() => { setQuality(quality === q ? null : q); setOpen(false) }}
              className={`w-full text-left rounded px-2 py-1.5 text-sm ${quality === q ? 'bg-[#F4F7FB] font-medium text-[#2563EB]' : 'text-[#181818] hover:bg-[#F4F7FB]'}`}
            >
              {q}+ quality
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

// Icons

function ChevronDownIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m6 9 6 6 6-6" />
    </svg>
  )
}

function XIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18"></line>
      <line x1="6" y1="6" x2="18" y2="18"></line>
    </svg>
  )
}

function ArrowRightIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="5" y1="12" x2="19" y2="12"></line>
      <polyline points="12 5 19 12 12 19"></polyline>
    </svg>
  )
}
