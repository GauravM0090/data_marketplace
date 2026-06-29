# Dodo Payments Integration

> Status: checkout + webhook implemented and smoke-tested. Not yet end-to-end testable — see "Manual prerequisites" below.

## Flow

```
Your App                          Dodo Payments
────────────────────────────────────────────────
1. User on /datasets/[id] clicks "Buy Now"
   ↓
2. POST /api/v1/checkout
   → auth check (Supabase session)
   → look up Dataset price/currency/dodoProductId from OUR db (never trust client)
   → reject if already purchased (existing paid Order for this user+dataset)
   → create Order (status: pending, amount/currency from the dataset row)
   → call Dodo SDK ──────────────→  Dodo creates checkout session
   ← { checkout_url, session_id } ←─────────
   → save dodoSessionId on the Order
   ↓
3. Client redirects to checkout_url (window.location.href)
                                   User pays on Dodo's hosted page.
                                   Discount codes are entered there —
                                   Dodo validates + computes the final total.
                                   ↓
4.                POST /api/v1/webhooks/dodo ←── Dodo fires payment.succeeded / payment.failed
   @dodopayments/nextjs Webhooks adapter:
   - verifies signature (401 if bad)
   - validates payload (400 if malformed)
   - routes to onPaymentSucceeded / onPaymentFailed
   → find Order by metadata.orderId
   → update Order: status → paid|failed, dodoPaymentId, paidAt
   (idempotent — a retried webhook for an already-processed Order is a no-op)
   ↓
5. User lands on /checkout/success?orderId=...
   page reads Order status directly from the DB and shows paid / pending
```

**Note on Downloads:** the webhook does **not** create a `Download` row. That table's `ipAddress` + `downloadedAt` columns are about the moment a file is actually downloaded by the buyer's browser — a webhook arrives from Dodo's servers, not the buyer, so creating one there would record the wrong IP and conflate "paid" with "downloaded". Gating the actual file download behind `Order.status === 'paid'` is a separate, not-yet-built endpoint (see "Not built yet" below).

---

## Architecture decisions

Dodo offers three ways to integrate (Next.js adapter, raw TypeScript SDK, calling your own routes from the frontend) — these aren't alternatives to pick one of, they're different layers:

| Layer | Choice | Why |
|---|---|---|
| **Checkout session creation** (server) | Raw `dodopayments` SDK, called directly from `payment.service.ts` | `@dodopayments/nextjs`'s `Checkout` route handler forwards request query/body straight to Dodo with no hook to run our own price lookup, already-purchased check, or `Order` creation first — using it would mean trusting client-supplied price/product data. A custom route lets us do all of that before ever calling Dodo. |
| **Webhook receiving** (server) | `@dodopayments/nextjs`'s `Webhooks` handler | It already does HMAC signature verification, Zod payload validation, and per-event-type routing (`onPaymentSucceeded`, `onPaymentFailed`, ...) — no reason to hand-roll that. |
| **Triggering checkout** (frontend) | TanStack Query `useMutation` calling our own `POST /api/v1/checkout` | Matches the project's existing rule ("TanStack Query for anything from the API/DB" — `docs/tech-stack-decisions.md`). `@tanstack/react-query` was added as a dependency for this (it was decided in the tech-stack doc but not actually installed until now). |
| **Discounts** | Dodo-native discount codes, entered by the buyer on Dodo's hosted checkout page (`feature_flags.allow_discount_code`, on by default) | Dodo's checkout session API only accepts a fixed `product_id` + `quantity` per line item — there's no field for "charge a custom discounted amount" (the `amount` override on a cart item only applies to pay-what-you-want products, which is a different feature). Letting Dodo own the discount math means the amount it reports back in the webhook is always the actual charged amount — no risk of our calculation drifting from what the customer was actually charged. |
| **Cart shape** | One dataset per Order (no multi-item cart) | Matches the existing schema (`Order.datasetId` is a single FK) — no migration needed. A multi-dataset cart would need a new `OrderItem` line-items table; not built. |

---

## Implementation

### New files

| File | Purpose |
|---|---|
| `src/lib/dodo.ts` | `DodoPayments` SDK client singleton (mirrors the `lib/prisma.ts` pattern) |
| `src/lib/validations/checkout.schema.ts` | Zod schema for `POST /api/v1/checkout` — just `{ datasetId: uuid }` |
| `src/services/payment.service.ts` | Wraps `dodo.checkoutSessions.create()` — builds `product_cart` from `dataset.dodoProductId`, sets `metadata: { orderId, userId, datasetId }` so the webhook can find its way back |
| `src/services/order.service.ts` | All `Order` lifecycle DB ops: `findPaidOrder`, `createPendingOrder`, `attachCheckoutSession`, `markOrderPaid`, `markOrderFailed`, `getOrderById`. The paid/failed transitions use `updateMany({ where: { id, status: 'pending' } })` so a duplicate webhook delivery is a no-op instead of double-applying side effects. |
| `src/app/api/v1/checkout/route.ts` | `POST` — auth → validate → look up dataset → block re-purchase → create pending Order → create Dodo session → return `{ checkoutUrl, orderId }` |
| `src/app/api/v1/webhooks/dodo/route.ts` | `POST` — `Webhooks({...})` from `@dodopayments/nextjs`; `onPaymentSucceeded` → `markOrderPaid`, `onPaymentFailed` → `markOrderFailed` |
| `src/lib/query-client.ts` + `src/components/providers/query-provider.tsx` | TanStack Query setup (`staleTime` 5m, `gcTime` 10m, `retry` 2 per `docs/tech-stack-decisions.md`), wired into `src/app/layout.tsx` |
| `src/hooks/use-create-checkout.ts` | `useMutation` — POSTs to `/api/v1/checkout`, redirects to `checkoutUrl` on success |
| `src/components/checkout/buy-button.tsx` | Client component using the hook above |
| `src/app/(public)/datasets/[id]/page.tsx` | Was an empty placeholder — now a minimal Server Component: fetches the dataset, 404s if missing/unpublished, renders title/price + `<BuyButton>` |
| `src/app/(public)/checkout/success/page.tsx` | Reads `?orderId=`, fetches the Order directly (Server Component), shows paid vs. still-confirming |

### Changed files

- `src/services/dataset.service.ts` — added `getDatasetById(id)` (full row, server-side only — used by the checkout route and the detail page)
- `src/app/layout.tsx` — wrapped `{children}` in `<QueryProvider>`
- `package.json` — added `@tanstack/react-query`

---

## Schema

No migration was needed — every field this flow uses already existed (added in session 2, June 17, per `docs/regularwork.md`). For reference, the relevant columns:

| Model | Field | Used for |
|---|---|---|
| `Dataset` | `price`, `currency` | Source of truth for the amount on a new Order — never trust a client-supplied price |
| `Dataset` | `dodoProductId` | The Dodo Product this dataset maps to. **Auto-set on upload** via `createDatasetProduct()` in `payment.service.ts`. Seeded datasets still have `null` unless `DODO_TEST_PRODUCT_ID` is set |
| `Order` | `status` | `pending` → `paid` \| `failed` (→ `refunded`, not wired up yet) |
| `Order` | `dodoSessionId` | Set right after the checkout session is created |
| `Order` | `dodoPaymentId`, `paidAt` | Set by the webhook on `payment.succeeded` |
| `Order` | `userId`, `datasetId` | Used by `findPaidOrder` to block re-purchasing an already-owned dataset |
| `Download` | *(not written by this flow)* | Reserved for a future download-gating endpoint — see below |  

---

## Environment variables

All already present in `.env` (added in an earlier session) except one:

| Var | Status | Notes |
|---|---|---|
| `DODO_PAYMENTS_API_KEY` | ✅ set | Used by `lib/dodo.ts` |
| `DODO_PAYMENTS_ENVIRONMENT` | ✅ set to `test_mode` | |
| `DODO_PAYMENTS_WEBHOOK_KEY` | ❌ **empty** | **Blocks the webhook route entirely** — `Webhooks({ webhookKey: '' })` throws `Secret can't be empty` at module load, so `/api/v1/webhooks/dodo` 500s on every request until this is filled in from the Dodo dashboard (Webhooks → secret) |
| `DODO_PAYMENTS_RETURN_URL` | ⚠️ unused | The code builds `return_url`/`cancel_url` per-request from `NEXT_PUBLIC_APP_URL` (so each order's success URL carries its own `orderId`) instead of reading this static var. Can be removed, or repurposed later if a fixed fallback is ever needed. |

---

## Manual prerequisites (not yet done)

1. **Fill `DODO_PAYMENTS_WEBHOOK_KEY`** from the Dodo dashboard before the webhook route will even load without a 500.
2. **Seeded datasets have no Dodo product.** Datasets created via `POST /api/v1/datasets` get a Dodo product automatically. The 10 seeded datasets still need `DODO_TEST_PRODUCT_ID` set in `.env` for the first one to be purchasable — or re-create them through the upload flow.
3. **Local webhook testing needs a tunnel** (Dodo can't reach `localhost`) — `ngrok http 3000`, then point the Dodo sandbox webhook URL at the ngrok URL. Already documented in `docs/environment-setup.md`.

---

## Verified so far

- `tsc --noEmit` and `eslint` clean on every new/changed file
- Dev server boots; `/` and `/checkout/success` render
- `POST /api/v1/checkout` unauthenticated → `401 { success: false, error: 'Unauthorized' }`
- `/datasets/[id]` for a real seeded dataset renders title, price, and the Buy button
- `POST /api/v1/webhooks/dodo` currently 500s with `Secret can't be empty` — expected, confirms prerequisite #1 above, not a bug

**Not yet verified** (blocked on the prerequisites above): an authenticated checkout call actually reaching Dodo and getting back a real `checkout_url`, and a real webhook delivery flipping an Order to `paid`.

## Not built yet

- A download-serving endpoint that checks `Order.status === 'paid'` for the requesting user + dataset, then creates the actual `Download` audit row (with the real request IP) and serves/signs the file — the natural follow-up once the prerequisites above are done.
- Dodo Product sync on **edits** — product creation on upload is now automatic, but if a seller later changes a dataset's price/title, the Dodo product won't auto-update yet.
