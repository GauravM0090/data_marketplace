import React from 'react'

function formatCount(n: number | null | undefined): string {
  if (n == null) return '—'
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}k`
  return n.toLocaleString()
}

export function DatasetHeading({ dataset }: { dataset: any }) {
  const pills = [
    dataset.recordCount ? { value: formatCount(Number(dataset.recordCount)), label: dataset.recordUnit || 'Records' } : null,
    dataset.fileSizeBytes ? { value: `${(Number(dataset.fileSizeBytes) / (1024 ** 4)).toFixed(1)} TB`, label: 'storage' } : null,
    dataset.languages?.length ? { value: String(dataset.languages.length), label: 'languages' } : null,
    dataset.countries?.length ? { value: String(dataset.countries.length), label: 'countries' } : null,
  ].filter(Boolean) as { value: string; label: string }[]

  return (
    <div className="rounded-2xl bg-[#0D1B2A] p-5 text-white">
      <div className="flex flex-col gap-3">
        {/* Top row: Badge + Save */}
        <div className="flex w-full items-center justify-between">
          <span className="inline-flex items-center gap-1 rounded-full bg-[#0D303B] px-4 py-2 text-xs font-medium text-[#7EE0D6]">
            {dataset.datasetCode && <><span>{dataset.datasetCode}</span><span className="mx-1 inline-block h-1 w-1 rounded-full bg-[#7EE0D6]"></span></>}
            <span>{dataset.industry || dataset.category || 'General'}</span>
          </span>
          <button className="flex items-center gap-1 rounded-md bg-white/10 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-white/20">
            <BookmarkIcon className="h-5 w-5" />
            Save
          </button>
        </div>

        {/* Title + Description */}
        <h1 className="text-xl font-semibold leading-7 mt-1">{dataset.title}</h1>
        <p className="text-xs font-medium leading-4 text-[#D3E0FB]">
          {dataset.description}
        </p>

        {/* Metric Pills */}
        {pills.length > 0 && (
          <div className="mt-1 flex flex-wrap gap-3">
            {pills.map((pill, i) => (
              <div key={i} className="flex items-center gap-2 rounded-lg bg-[#1B2837] px-4 py-2 text-xs">
                <span className="font-medium text-white">{pill.value}</span>
                <span className="text-[#CCCCCC]">{pill.label}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function BookmarkIcon({ className }: { className?: string }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"></path>
    </svg>
  )
}
