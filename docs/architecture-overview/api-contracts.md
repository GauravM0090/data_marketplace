# API Contracts — Dataset Marketplace

> Last updated: June 2025

All route handlers return a standard `ApiResponse<T>` wrapper:

```ts
// types/api.ts
export type ApiResponse<T> =
  | { success: true; data: T }
  | { success: false; error: string; code?: string }
```

---

## All Endpoints

### Dataset Endpoints

| Endpoint | Access | Epic | Purpose |
|---|---|---|---|
| `GET /api/v1/datasets` | Public | 2 | Paginated + filtered dataset list |
| `POST /api/v1/datasets/upload-url` | Admin / Seller | 5 | Mint a signed URL to upload a dataset file directly to Storage |
| `POST /api/v1/datasets` | Admin / Seller | 5 | Create dataset listing (JSON metadata + storage paths) |
| `PUT /api/datasets/[id]` | Admin / Owner Seller | 5 | Update dataset |
| `DELETE /api/datasets/[id]` | Admin / Owner Seller | 5 | Delete dataset |
| `POST /api/contact` | Public | 0 | Contact form — send email |

> **File uploads do NOT go through the API.** Large dataset binaries (up to multi-GB) would blow past the Vercel serverless request-body limit. Instead the client uploads files **directly** to Supabase Storage using a short-lived signed URL minted by `POST /api/v1/datasets/upload-url`, then sends only the resulting storage paths to `POST /api/v1/datasets`. The old through-the-server `POST /api/upload` is removed.

### Payment Endpoints _(Future — Epic 3)_

| Endpoint | Access | Purpose |
|---|---|---|
| `POST /api/payments/create-session` | Auth | Create Dodo Payments checkout session |
| `POST /api/webhooks/dodo` | Dodo (signed) | Verify webhook, update order status |
| `GET /api/download/[id]` | Auth + paid order | Generate signed URL for purchased dataset |

### Profile Endpoints

| Endpoint | Access | Purpose |
|---|---|---|
| `GET /api/profile/me` | Auth | Current user profile + role-specific data |
| `PATCH /api/profile/me` | Auth | Update name, avatar, bio |

### Scheduling Endpoints

| Endpoint | Access | Purpose |
|---|---|---|
| `GET /api/schedule/[hostId]/slots` | Public | Get all available (non-booked) slots for a host |
| `POST /api/schedule/[hostId]/slots` | Seller / Admin | Create a new availability slot |
| `DELETE /api/schedule/slots/[id]` | Owner / Admin | Delete a slot (only if not yet booked) |
| `POST /api/schedule/[hostId]/book` | Auth | Book an available slot |
| `PATCH /api/schedule/bookings/[id]` | Host / Admin | Confirm or cancel a booking |
| `GET /api/schedule/bookings/mine` | Auth | My upcoming bookings (as booker or host) |

### Issues Endpoints

| Endpoint | Access | Purpose |
|---|---|---|
| `GET /api/issues` | Admin | All issues — filterable by status, priority, category |
| `GET /api/issues/mine` | Auth | Issues I reported |
| `GET /api/issues/assigned` | Seller / Admin | Issues assigned to me |
| `GET /api/issues/[id]` | Reporter / Assignee / Admin | Single issue detail |
| `POST /api/issues` | Auth | Open a new issue |
| `PATCH /api/issues/[id]` | Reporter / Assignee / Admin | Update status, assign, add resolution notes |

### Admin Analytics Endpoint

| Endpoint | Access | Purpose |
|---|---|---|
| `GET /api/admin/analytics` | Admin | Platform-wide stats: revenue, orders, datasets, users |

---

## GET /api/v1/datasets

Paginated, filtered listing of **published** datasets. Public — no auth. All params optional and validated by `datasetsQuerySchema`.

**Query params:**

| Param | Type | Description |
|---|---|---|
| `page` | `number` | Page number, 1-indexed (default: 1) |
| `limit` | `number` | Page size, max 100 (default: 12) |
| `industry` | `string` | Exact-match filter |
| `category` | `string` | Exact-match filter |
| `language` | `string` | Exact-match filter |
| `currency` | `string` | 3-letter ISO, exact-match |
| `fileFormat` | `string` | Exact-match filter |
| `tags` | `string` | Comma-separated; matches datasets with ANY of the tags |
| `minPrice` | `number` | Inclusive lower bound |
| `maxPrice` | `number` | Inclusive upper bound (must be ≥ `minPrice`) |

**Example:** `/api/v1/datasets?industry=Finance&minPrice=0&maxPrice=500&tags=finance,nse&page=1&limit=12`

**Response (200):**
```json
{
  "datasets": [ { "id": "...", "title": "...", "slug": "...", "description": "...", "category": "...", "language": "...", "thumbnailUrl": "..." } ],
  "pagination": { "page": 1, "limit": 12, "total": 42, "totalPages": 4 }
}
```
Invalid params → `400 { error, details: [{ field, message }] }`.

---

## Creating a Dataset — Two-Step Direct Upload

Files never pass through the API. The client uploads each file straight to Supabase Storage, then creates the listing with the resulting paths.

### Step 1 — `POST /api/v1/datasets/upload-url`  *(seller / admin)*

**Request (JSON):**
```json
{ "title": "NSE Intraday Ticks 2024", "kind": "binary", "fileName": "ticks.csv" }
```
`kind` is `"binary"` (private bucket) or `"sample"` (public bucket). The object key is derived server-side from `title`.

**Response (200):**
```json
{ "success": true, "data": { "bucket": "dataset-binaries", "path": "datasets/nse-intraday-ticks-2024.csv", "token": "…", "signedUrl": "https://…" } }
```

**Then the client uploads directly** (browser, not the API):
```ts
await supabase.storage.from(bucket).uploadToSignedUrl(path, token, file)
```

### Step 2 — `POST /api/v1/datasets`  *(seller / admin)*

Creates the listing and **publishes it immediately** — a Dodo product is auto-created, and the dataset is live for purchase. Send metadata as JSON plus the storage paths from step 1.

**Request (JSON):**
```json
{
  "title": "NSE Intraday Ticks 2024",
  "description": "One-minute OHLCV ticks for NSE equities",
  "industry": "Finance",
  "category": "Time-Series",
  "language": "English",
  "price": 149.99,
  "currency": "USD",
  "fileFormat": ".csv",
  "rowCount": 1250000,
  "tags": ["finance", "time-series", "nse"],
  "binaryPath": "datasets/nse-intraday-ticks-2024.csv",
  "samplePath": "samples/nse-intraday-ticks-2024.csv"
}
```
Required: `title`, `description`, `industry`, `category`, `price`. `binaryPath` / `samplePath` are optional but, if given, must match the title-derived key **and** already exist in storage.

**Responses:** `201` created · `400` validation / path mismatch / file-not-in-storage · `401` no session · `403` not seller/admin · `409` duplicate title (slug).

---

## GET /api/profile/me

Returns current user's profile and role-specific data in a single call.

**Response (role = user):**
```json
{
  "success": true,
  "data": {
    "profile": { "id": "...", "fullName": "...", "email": "...", "role": "user", "avatarUrl": "..." },
    "orders": [ { "id": "...", "datasetTitle": "...", "status": "paid", "amount": 49.00, "paidAt": "..." } ],
    "downloads": [ { "datasetId": "...", "datasetTitle": "...", "downloadedAt": "..." } ],
    "issues": [ { "id": "...", "title": "...", "status": "open", "priority": "medium" } ],
    "upcomingMeets": [ { "slotId": "...", "hostName": "...", "date": "...", "time": "...", "topic": "..." } ]
  }
}
```

**Response (role = seller):**
```json
{
  "success": true,
  "data": {
    "profile": { "id": "...", "fullName": "...", "role": "seller", "bio": "..." },
    "datasets": [ { "id": "...", "title": "...", "orderCount": 12, "revenue": 588.00 } ],
    "issues": [ { "id": "...", "title": "...", "status": "in_progress", "assignedToMe": true } ],
    "meetSlots": [ { "id": "...", "date": "...", "startTime": "...", "isBooked": false } ],
    "upcomingBookings": [ { "bookingId": "...", "bookerName": "...", "topic": "...", "date": "..." } ]
  }
}
```

**Response (role = admin):**
```json
{
  "success": true,
  "data": {
    "profile": { "id": "...", "fullName": "...", "role": "admin" },
    "analytics": { "totalRevenue": 12400.00, "totalOrders": 248, "totalDatasets": 64, "totalUsers": 310 },
    "openIssues": [ { "id": "...", "title": "...", "priority": "high", "reporterName": "..." } ],
    "upcomingBookings": [ { "bookingId": "...", "bookerName": "...", "topic": "...", "date": "..." } ]
  }
}
```

---

## GET /api/schedule/[hostId]/slots

Returns all available (non-booked) slots for a host. Used to render the calendar UI.

**Query params:**

| Param | Type | Description |
|---|---|---|
| `month` | `string` | `YYYY-MM` — returns slots for that month |

**Response:**
```json
{
  "success": true,
  "data": {
    "host": { "id": "...", "fullName": "...", "avatarUrl": "...", "bio": "..." },
    "slots": [
      {
        "id": "...",
        "date": "2026-07-10",
        "startTime": "10:00",
        "endTime": "10:30",
        "durationMinutes": 30,
        "title": "Dataset Q&A"
      }
    ]
  }
}
```

---

## POST /api/schedule/[hostId]/book

Books an available slot. Marks the slot as `is_booked = true`.

**Request:**
```json
{
  "slotId": "uuid-of-slot",
  "topic": "Questions about Finance Dataset",
  "notes": "I want to understand the data freshness and update frequency"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "bookingId": "...",
    "status": "pending",
    "slotDate": "2026-07-10",
    "slotTime": "10:00",
    "meetLink": "https://meet.google.com/abc-defg-hij",
    "hostName": "Jane (Seller)"
  }
}
```

---

## POST /api/issues

Opens a new support issue. Any authenticated user can open one.

**Request:**
```json
{
  "title": "Download link expired immediately",
  "description": "I purchased the dataset but the download link says it has expired.",
  "category": "order",
  "priority": "high",
  "orderId": "uuid-of-order",
  "datasetId": "uuid-of-dataset"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "issueId": "...",
    "status": "open",
    "createdAt": "2026-06-19T10:00:00Z"
  }
}
```

---

## GET /api/admin/analytics

Platform-wide aggregate stats. Admin only.

**Response:**
```json
{
  "success": true,
  "data": {
    "revenue": {
      "total": 12400.00,
      "thisMonth": 3200.00,
      "lastMonth": 2900.00
    },
    "orders": {
      "total": 248,
      "paid": 230,
      "pending": 10,
      "failed": 8
    },
    "datasets": {
      "total": 64,
      "published": 58,
      "draft": 6
    },
    "users": {
      "total": 310,
      "buyers": 280,
      "sellers": 25,
      "admins": 5
    },
    "issues": {
      "open": 4,
      "inProgress": 2,
      "resolved": 38
    }
  }
}
```

---

## POST /api/payments/create-session _(Epic 3 — Future)_

Creates a DodoPayments checkout session for a dataset purchase.

**Request:**
```json
{
  "datasetId": "uuid-of-the-dataset"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "sessionId": "dodo_sess_xxxx",
    "checkoutUrl": "https://checkout.dodopayments.com/session/dodo_sess_xxxx"
  }
}
```

**Server-side steps:**
1. Verify user is authenticated (Supabase session)
2. Look up dataset price
3. Create an `Order` in DB with `status: "pending"` and `dodoSessionId` saved
4. Call DodoPayments API to create checkout session
5. Return `checkoutUrl` to redirect user

---

## POST /api/webhooks/dodo _(Epic 3 — Future)_

Receives payment confirmation from DodoPayments after a successful payment.

**Webhook payload (fired by Dodo):**
```json
{
  "type": "payment.succeeded",
  "data": {
    "payment_id": "dodo_pay_xxxx",
    "session_id": "dodo_sess_xxxx",
    "amount": 4900,
    "currency": "USD",
    "status": "succeeded",
    "customer": { "email": "user@example.com" },
    "metadata": {
      "orderId": "our-internal-order-uuid",
      "userId": "supabase-user-uuid",
      "datasetId": "dataset-uuid"
    }
  },
  "created_at": "2026-06-17T12:00:00Z"
}
```

**Server-side steps:**
1. Verify webhook signature using Dodo's signing secret (prevent spoofing)
2. Find the `Order` by `orderId` from `metadata`
3. Update Order → `status: "paid"`, `dodoPaymentId`, `paidAt`
4. Create a `Download` record for the user
5. Return `200 OK` to Dodo (otherwise Dodo retries)

---

## GET /api/download/[id] _(Epic 6 — Future)_

Generates a signed URL for a purchased dataset binary. Only accessible after verifying a `paid` order.

```ts
// lib/storage.ts
export async function getSignedDownloadUrl(path: string, expiresInSeconds = 3600) {
  const { data, error } = await supabase.storage
    .from('dataset-binaries')
    .createSignedUrl(path, expiresInSeconds)
  if (error) throw error
  return data.signedUrl
}
```

---

## Feature Breakdown by Epic

### Epic 0 — Landing Page ✅

| Section | Details |
|---|---|
| Hero | Headline, subheadline, CTA to `/datasets` |
| Featured Datasets | 3–6 curated datasets pulled server-side via `dataset.service.ts` |
| Category Highlights | Visual grid of industries/categories linking to filtered listing |
| Social Proof | Testimonials, dataset count stats |

### Epic 1 — User Onboarding ✅

| Feature | Details |
|---|---|
| Register | Supabase Auth email/password signup → insert into `users` table |
| Login | Supabase Auth → session cookie set → redirect via `?next=` param |
| Profile | `/profile/user` — order history, downloads, issues, meets |
| Route Guard | `middleware.ts` checks session on every request to `/profile/*`, `/account/*`, `/admin/*` |

Auth flow:
```
User submits login form
  ↓
supabase.auth.signInWithPassword()
  ↓
Supabase sets session cookie
  ↓
middleware.ts reads cookie on every subsequent request
  ↓
Protected routes: redirect to /login if no session
```

### Epic 2 — Search & Discovery ✅

| Feature | Details |
|---|---|
| Dataset Listing `/datasets` | Server-rendered page, initial data fetched via `dataset.service.ts` |
| Filters | Industry, category, language, file format, price range — state in URL search params |
| Filter Sidebar | Zustand controls open/close; pending selection committed on "Apply" |
| Client Refetch | TanStack Query `useDatasets(filters)` re-fetches when URL params change |
| Detail Page `/datasets/[slug]` | Full metadata, image gallery, sample download (public), Buy button (login required — Epic 3) |
| Sample Download | Public CDN URL, no auth, direct link |
