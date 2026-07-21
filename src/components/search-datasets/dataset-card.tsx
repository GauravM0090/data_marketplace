// components/datasets/dataset-card.tsx
// One dataset result card in the explore grid — matches the Figma card:
// icon + title/code + "Sample available" pill, a row of stat chips, the
// countries/languages/updated meta line, and the Save / View dataset actions.
import Link from 'next/link'
import type { DatasetCard as DatasetCardData } from '@/types/dataset'
import { formatCompactNumber, formatRelativeTime, countryFlag } from '@/utils/format'

const MAX_VISIBLE_COUNTRIES = 3
const MAX_VISIBLE_LANGUAGES = 2

function StatChip({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-[#E5E5E5] bg-[#F9FAFB] px-2.5 py-1 font-public-sans text-xs font-medium text-[#444444]">
      {icon}
      {label}
    </span>
  )
}

const ICONS = {
  records: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="9" cy="12" r="2.4" stroke="currentColor" strokeWidth="1.6" />
      <path d="M15 9l3 1.5v3L15 15" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
    </svg>
  ),
  quality: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 3l2.6 5.6 6 .7-4.5 4.1 1.2 6-5.3-3-5.3 3 1.2-6-4.5-4.1 6-.7L12 3z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  ),
  format: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M7 3h7l5 5v13a1 1 0 01-1 1H7a1 1 0 01-1-1V4a1 1 0 011-1z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path d="M14 3v5h5" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
    </svg>
  ),
  compliance: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 3l7 3v5c0 4.5-3 8.2-7 9.5-4-1.3-7-5-7-9.5V6l7-3z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  bookmark: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M6 3h12v18l-6-4-6 4V3z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
    </svg>
  ),
  chevron: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M9 5l7 7-7 7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  cardMark: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="2" y="6" width="15" height="12" rx="2" stroke="white" strokeWidth="1.6" />
      <path d="M17 10l5-2.5v9L17 14" stroke="white" strokeWidth="1.6" strokeLinejoin="round" />
    </svg>
  ),
}

export function DatasetCard({ dataset }: { dataset: DatasetCardData }) {
  const {
    id,
    title,
    slug,
    datasetCode,
    industry,
    qualityScore,
    fileFormat,
    recordCount,
    recordUnit,
    compliance,
    languages,
    countries,
    sampleAvailable,
    updatedAt,
  } = dataset

  const extraCountries = Math.max(countries.length - MAX_VISIBLE_COUNTRIES, 0)
  const extraLanguages = Math.max(languages.length - MAX_VISIBLE_LANGUAGES, 0)

  return (
    <div className="flex h-full flex-col gap-4 rounded-xl border border-[#E5E5E5] bg-white p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#0F1B3D]">
            {ICONS.cardMark}
          </span>
          <div>
            <h3 className="font-public-sans text-base font-semibold text-[#181818]">{title}</h3>
            <p className="mt-0.5 font-public-sans text-xs text-[#8C8C8C]">
              {datasetCode ?? '—'}
              {industry && ` • ${industry}`}
            </p>
          </div>
        </div>
        {sampleAvailable && (
          <span className="shrink-0 rounded-full bg-[#DCFCE7] px-3 py-1 font-public-sans text-xs font-medium text-[#15803D]">
            Sample available
          </span>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        {recordCount !== null && (
          <StatChip
            icon={ICONS.records}
            label={`${formatCompactNumber(recordCount)} ${recordUnit ?? 'records'}`}
          />
        )}
        {qualityScore !== null && (
          <StatChip icon={ICONS.quality} label={`${qualityScore.toFixed(1)} quality`} />
        )}
        {fileFormat && <StatChip icon={ICONS.format} label={`${fileFormat} format`} />}
        {compliance[0] && <StatChip icon={ICONS.compliance} label={compliance[0]} />}
      </div>

      <div className="mt-auto flex flex-wrap items-center justify-between gap-x-2 gap-y-2 border-t border-[#F0F0F0] pt-4 font-public-sans text-xs text-[#616161]">
        {countries.length > 0 && (
          <div className="flex items-center gap-1.5">
            <span>Countries:</span>
            <div className="flex items-center">
              <div className="flex -space-x-1.5">
                {countries.slice(0, MAX_VISIBLE_COUNTRIES).map((c, i) => (
                  <span 
                    key={i}
                    className="flex h-[18px] w-[18px] items-center justify-center rounded-full bg-white text-[14px] ring-2 ring-white"
                  >
                    {countryFlag(c)}
                  </span>
                ))}
              </div>
              {extraCountries > 0 && (
                <span className="ml-1 font-medium text-[#181818]">+{extraCountries}</span>
              )}
            </div>
          </div>
        )}
        {languages.length > 0 && (
          <div className="flex items-center gap-1">
            <span>Languages:</span>
            <span className="font-medium text-[#181818]">
              {languages.slice(0, MAX_VISIBLE_LANGUAGES).join(', ')}
              {extraLanguages > 0 && `, +${extraLanguages}`}
            </span>
          </div>
        )}
        <div className="flex items-center gap-1">
          <span>Updated:</span>
          <span className="font-medium text-[#181818]">{formatRelativeTime(updatedAt)}</span>
        </div>
      </div>

      <div className="flex items-center justify-between border-t border-[#F0F0F0] pt-4">
        <button
          type="button"
          className="flex items-center gap-1.5 font-public-sans text-sm font-medium text-[#616161] hover:text-[#181818]"
        >
          {ICONS.bookmark}
          Save
        </button>
        <Link
          href={`/datasets/${slug}`}
          className="flex items-center gap-1 rounded-lg border border-[#2563EB] px-4 py-2 font-public-sans text-sm font-semibold text-[#2563EB] transition-colors hover:bg-[#EFF6FF]"
        >
          View dataset
          {ICONS.chevron}
        </Link>
      </div>
    </div>
  )
}
