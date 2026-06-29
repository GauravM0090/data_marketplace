import { notFound } from 'next/navigation'
import { getDatasetById } from '@/services/dataset.service'
import { BuyButton } from '@/components/checkout/buy-button'

export default async function DatasetDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const dataset = await getDatasetById(id)

  if (!dataset) {
    notFound()
  }

  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="text-3xl font-semibold">{dataset.title}</h1>
      <p className="mt-4 text-white/70">{dataset.description}</p>

      <div className="mt-8 flex items-center gap-4">
        <span className="text-2xl font-semibold">
          {dataset.currency} {Number(dataset.price).toFixed(2)}
        </span>
        <BuyButton datasetId={dataset.id} />
      </div>
    </main>
  )
}
