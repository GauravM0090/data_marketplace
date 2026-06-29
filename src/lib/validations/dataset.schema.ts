import { z } from 'zod'

// Operational caps for free-text filters. The `datasets` columns themselves are
// unbounded Postgres `text`/`text[]` (see prisma/schema/schema.prisma), so these
// limits exist purely to stop a client from sending pathologically large query
// params, not to mirror a DB constraint.
const MAX_FILTER_TEXT_LENGTH = 100
const MAX_TAGS = 20
const MAX_TAG_LENGTH = 50
const MAX_PAGE_SIZE = 100

// Operational caps for the longer free-text fields on create.
const MAX_TITLE_LENGTH = 200
const MAX_DESCRIPTION_LENGTH = 5000
const MAX_FILE_FORMAT_LENGTH = 20
const MAX_FILE_NAME_LENGTH = 255
const MAX_STORAGE_PATH_LENGTH = 300

// `price` is Decimal(10,2) on `datasets` → 8 digits before the decimal point max.
const MAX_PRICE = 99_999_999.99

// `row_count` is a Postgres `integer` → must fit in a signed 32-bit int.
const MAX_INT4 = 2_147_483_647

const filterText = () => z.string().trim().min(1).max(MAX_FILTER_TEXT_LENGTH)
const priceBound = () => z.coerce.number().nonnegative().max(MAX_PRICE)

// Normalise "absent-ish" numeric inputs (null / empty string / undefined) to
// `undefined` BEFORE coercion. Without this, z.coerce.number() turns null and ""
// into 0 — so a missing required price would silently become a free dataset.
const nullishToUndefined = (value: unknown) =>
  value === null || value === '' || value === undefined ? undefined : value

/**
 * Validates + coerces GET /api/v1/datasets query params.
 * One field per filterable `datasets` column, plus pagination.
 */
export const datasetsQuerySchema = z
  .object({
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().max(MAX_PAGE_SIZE).default(12),
    industry: filterText().optional(),
    category: filterText().optional(),
    language: filterText().optional(),
    fileFormat: filterText().optional(),
    // ISO 4217 codes are always 3 letters — `currency` defaults to 'USD'.
    currency: z
      .string()
      .trim()
      .length(3, 'currency must be a 3-letter ISO code')
      .transform((value) => value.toUpperCase())
      .optional(),
    // Comma-separated in the URL (?tags=nlp,finance) → trimmed, deduped-by-filter array.
    tags: z
      .string()
      .transform((value) =>
        value
          .split(',')
          .map((tag) => tag.trim())
          .filter(Boolean)
      )
      .pipe(z.array(z.string().max(MAX_TAG_LENGTH)).max(MAX_TAGS))
      .optional(),
    minPrice: priceBound().optional(),
    maxPrice: priceBound().optional(),
  })
  .refine(
    (data) =>
      data.minPrice === undefined ||
      data.maxPrice === undefined ||
      data.minPrice <= data.maxPrice,
    {
      message: 'minPrice cannot be greater than maxPrice',
      path: ['minPrice'],
    }
  )

export type DatasetsQueryParams = z.infer<typeof datasetsQuerySchema>

/**
 * Validates the JSON body of POST /api/v1/datasets/upload-url.
 * The client asks for a signed URL to upload one dataset file directly to
 * Supabase Storage; the storage object key is derived server-side from `title`.
 */
export const uploadUrlSchema = z.object({
  title: z.string().trim().min(1, 'title is required').max(MAX_TITLE_LENGTH),
  kind: z.enum(['binary', 'sample']),
  fileName: z.string().trim().min(1, 'fileName is required').max(MAX_FILE_NAME_LENGTH),
})

export type UploadUrlInput = z.infer<typeof uploadUrlSchema>

// Storage object key the client got back from /upload-url. Format is verified
// strictly (against the title-derived key) in the route via storage.service —
// here we only bound the raw string.
const storagePath = () => z.string().trim().min(1).max(MAX_STORAGE_PATH_LENGTH)

/**
 * Validates the JSON body of POST /api/v1/datasets (dataset creation).
 *
 * Only metadata + storage references travel through this endpoint — the file
 * bytes are uploaded directly to Supabase Storage beforehand (see /upload-url),
 * so `binaryPath` / `samplePath` are the keys returned by that step, not files.
 * Numeric fields are coerced (so `"99.99"` is also accepted) and `price` rejects
 * a missing/NaN value so it stays required.
 */
export const createDatasetSchema = z.object({
  title: z.string().trim().min(1, 'title is required').max(MAX_TITLE_LENGTH),
  description: z
    .string()
    .trim()
    .min(1, 'description is required')
    .max(MAX_DESCRIPTION_LENGTH),
  industry: z.string().trim().min(1, 'industry is required').max(MAX_FILTER_TEXT_LENGTH),
  category: z.string().trim().min(1, 'category is required').max(MAX_FILTER_TEXT_LENGTH),
  language: z.string().trim().min(1).max(MAX_FILTER_TEXT_LENGTH).optional(),
  price: z.preprocess(
    nullishToUndefined,
    z.coerce
      .number({ message: 'price is required and must be a number' })
      .nonnegative('price must be 0 or greater')
      .max(MAX_PRICE, 'price exceeds the maximum allowed value')
  ),
  // ISO 4217 codes are always 3 letters — defaults to 'USD' when omitted.
  currency: z
    .string()
    .trim()
    .length(3, 'currency must be a 3-letter ISO code')
    .transform((value) => value.toUpperCase())
    .optional()
    .default('USD'),
  fileFormat: z.string().trim().min(1).max(MAX_FILE_FORMAT_LENGTH).optional(),
  rowCount: z.preprocess(
    nullishToUndefined,
    z.coerce
      .number({ message: 'rowCount must be a number' })
      .int('rowCount must be a whole number')
      .nonnegative('rowCount must be 0 or greater')
      .max(MAX_INT4, 'rowCount exceeds the maximum allowed value')
      .optional()
  ),
  tags: z
    .array(z.string().trim().min(1).max(MAX_TAG_LENGTH))
    .max(MAX_TAGS, `a dataset can have at most ${MAX_TAGS} tags`)
    .default([]),
  binaryPath: storagePath().optional(),
  samplePath: storagePath().optional(),
})

export type CreateDatasetInput = z.infer<typeof createDatasetSchema>
