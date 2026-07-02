// ─── Dataset Types ────────────────────────────────────────────

/**
 * Lightweight shape returned by GET /api/v1/datasets
 * Only the fields needed for the listing / browse page card.
 */
export interface DatasetCard {
  id: string
  title: string
  slug: string
  description: string
  category: string | null
  language: string | null
  thumbnailUrl: string | null
}

// Query params + their validation now live in `@/validations/dataset.schema`
// (Zod is the single source of truth so the type can never drift from the
// runtime checks enforced on GET /api/v1/datasets).

export interface PaginationMeta {
  page: number
  limit: number
  total: number
  totalPages: number
}

/**
 * Shape of the GET /api/v1/datasets JSON response body.
 */
export interface DatasetsListResponse {
  datasets: DatasetCard[]
  pagination: PaginationMeta
}
