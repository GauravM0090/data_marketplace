import { notFound } from 'next/navigation'
import { getDatasetBySlug, getRelatedDatasets } from '@/services/dataset.service'
import {
  DatasetHeading,
  StickyNav,
  Specifications,
  DataQuality,
  PricingOptions,
  PricingSidebar,
  FAQSection,
  RelatedDatasets,
  EnterpriseConsultation,
} from '@/components/each-dataset'

export default async function DatasetDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id: slug } = await params
  const dataset = await getDatasetBySlug(slug)

  if (!dataset) {
    notFound()
  }

  // Fetch related datasets (4 max)
  const relatedDatasets = await getRelatedDatasets(
    { id: dataset.id, industry: dataset.industry, category: dataset.category },
    4
  )

  // Serialize dataset to plain JSON to avoid Decimal/BigInt issues in client components
  const safeDataset = JSON.parse(
    JSON.stringify(dataset, (_key, value) =>
      typeof value === 'bigint' ? Number(value) : value
    )
  )

  return (
    <div className="min-h-screen bg-[#F4F7FB] text-[#181818] w-full">
      <div className="mx-auto w-full max-w-[1200px] px-5 py-6">

        {/* Breadcrumb */}
        <div className="mb-6 flex items-center gap-2 text-sm text-[#616161]">
          <span className="hover:text-[#181818] cursor-pointer">Home</span>
          <span className="text-[#CBD5E1]">&gt;</span>
          <span className="hover:text-[#181818] cursor-pointer">Marketplace</span>
          <span className="text-[#CBD5E1]">&gt;</span>
          <span className="font-medium text-[#181818]">{safeDataset.title}</span>
        </div>

        {/* ──── Two-column layout ──── */}
        {/* items-stretch (default) so the right column matches the tall left
            column's height — that gives the sticky pricing sidebar room to
            stay pinned all the way down instead of scrolling out of view. */}
        <div className="flex gap-6 items-stretch">

          {/* LEFT: Main content — 748px fixed */}
          <div className="w-[748px] shrink-0 flex flex-col gap-8 rounded-3xl border border-[#CBD5E1] bg-white p-6">
            {/* Hero heading */}
            <DatasetHeading dataset={safeDataset} />

            {/* Sticky nav toggle */}
            <StickyNav />

            {/* Content sections — gap 64px between major groups per Figma */}
            <div className="flex flex-col gap-16">
              <Specifications dataset={safeDataset} />
              <DataQuality dataset={safeDataset} />
              <PricingOptions dataset={safeDataset} />
              <FAQSection />
            </div>
          </div>

          {/* RIGHT: Pricing sidebar — 420px fixed */}
          <div className="w-[420px] shrink-0">
            <PricingSidebar dataset={safeDataset} />
          </div>
        </div>

        {/* ──── Enterprise Consultation Block ──── */}
        {/* ──── Enterprise Consultation Block ──── */}
        <EnterpriseConsultation />

        {/* ──── Related Datasets — full width, 2×2 grid, gap 24px ──── */}
        <div className="mt-12">
          <RelatedDatasets datasets={relatedDatasets} />
        </div>
      </div>
    </div>
  )
}

function CheckIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12"></polyline>
    </svg>
  )
}
