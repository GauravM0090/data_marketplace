import Link from 'next/link'
import { getCachedPublishedDatasets } from '@/services/dataset.service'
import { datasetsQuerySchema } from '@/validations/dataset.schema'

export default async function DatasetsPage() {
  const { datasets } = await getCachedPublishedDatasets(datasetsQuerySchema.parse({}))

  return (
    <main className="mx-auto max-w-6xl px-6 py-16">
      <h1 className="text-3xl font-semibold">Browse Datasets</h1>
      <p className="mt-2 text-white/70">Pick a dataset to see pricing and buy it.</p>

      {datasets.length === 0 ? (
        <p className="mt-10 text-white/60">No datasets published yet.</p>
      ) : (
        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {datasets.map((dataset) => (
            <Link
              key={dataset.id}
              href={`/datasets/${dataset.id}`}
              className="group overflow-hidden rounded-xl border border-white/10 bg-white/5 transition hover:border-indigo-400/50 hover:bg-white/10"
            >
              {dataset.thumbnailUrl && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={dataset.thumbnailUrl}
                  alt={dataset.title}
                  className="h-40 w-full object-cover"
                />
              )}
              <div className="p-5">
                <h2 className="text-lg font-medium group-hover:text-indigo-300">
                  {dataset.title}
                </h2>
                <p className="mt-2 line-clamp-2 text-sm text-white/60">
                  {dataset.description}
                </p>
                <div className="mt-4 flex gap-2 text-xs text-white/50">
                  {dataset.category && <span>{dataset.category}</span>}
                  {dataset.language && <span>· {dataset.language}</span>}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </main>
  )
}
