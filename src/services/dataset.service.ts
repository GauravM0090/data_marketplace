import { Prisma } from '@prisma/client'
import { unstable_cache } from 'next/cache'
import { prisma } from '@/lib/prisma'
import { logger } from '@/lib/logger'
import type { DatasetCard } from '@/types/dataset'
import type { DatasetsQueryParams } from '@/validations/dataset.schema'

// Bust this tag (revalidateTag) whenever a dataset is published or edited so the
// cached browse/list results below pick the change up immediately.
export const DATASETS_CACHE_TAG = 'datasets'

export interface PaginatedDatasets {
  datasets: DatasetCard[]
  total: number
}

/**
 * Fetch published datasets — lightweight card projection, filtered + paginated.
 * Filters map 1:1 to indexed/filterable columns on `datasets`
 * (industry, category, language, tags, currency, fileFormat, price range).
 *
 * Fields returned per dataset: id, title, slug, description, category, language, thumbnailUrl
 */
/**
 * Fetch a single dataset by id — full row, used server-side only
 * (checkout route's price/product lookup, dataset detail page).
 */
export async function getDatasetById(id: string) {
  return prisma.dataset.findUnique({ where: { id } })
}

export async function getPublishedDatasets(
  params: DatasetsQueryParams
): Promise<PaginatedDatasets> {
  const {
    page,
    limit,
    industry,
    category,
    language,
    tags,
    currency,
    fileFormat,
    minPrice,
    maxPrice,
  } = params

  const where: Prisma.DatasetWhereInput = {
    ...(industry && { industry }),
    ...(category && { category }),
    ...(language && { language }),
    ...(currency && { currency }),
    ...(fileFormat && { fileFormat }),
    // hasSome (not hasEvery) — a dataset matches if it carries ANY of the requested tags
    ...(tags && tags.length > 0 && { tags: { hasSome: tags } }),
    ...((minPrice !== undefined || maxPrice !== undefined) && {
      price: {
        ...(minPrice !== undefined && { gte: minPrice }),
        ...(maxPrice !== undefined && { lte: maxPrice }),
      },
    }),
  }

  logger.info(
    { where, page, limit },
    'dataset.service: fetching published datasets'
  )

  try {
    // findMany + count run in the same transaction so total stays consistent
    // with the page of results even if rows change between the two queries.  
    const [datasets, total] = await prisma.$transaction([
      prisma.dataset.findMany({
        where,
        select: {
          id: true,
          title: true,

          slug: true,
          description: true,
          category: true,
          language: true,
          thumbnailUrl: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.dataset.count({ where }),
    ])

    logger.info(
      { count: datasets.length, total, page, limit },
      'dataset.service: published datasets fetched successfully'
    )

    return { datasets, total }
  } catch (error) {
    logger.error(
      { error, where, page, limit },
      'dataset.service: failed to fetch published datasets'
    )
    throw error
  }
}

/**
 * Cache-wrapped {@link getPublishedDatasets} for the public browse/list paths.
 * The published catalogue is read on nearly every visit but changes rarely, so
 * we serve it from Next's data cache and hit Postgres at most once per
 * `revalidate` window per unique filter+page combination — cutting repeated
 * identical queries under load. Bust it with `revalidateTag(DATASETS_CACHE_TAG)`.
 *
 * Safe to cache because `DatasetCard` is plain JSON. Do NOT cache
 * {@link getDatasetById} this way — it returns `price` (Decimal) and
 * `fileSizeBytes` (BigInt), which Next's cache cannot serialize.
 */
export const getCachedPublishedDatasets = unstable_cache(
  (params: DatasetsQueryParams) => getPublishedDatasets(params),
  ['published-datasets'],
  { revalidate: 60, tags: [DATASETS_CACHE_TAG] }
)
