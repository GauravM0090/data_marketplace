# Database Schema — Dataset Marketplace

> Last updated: 30 June 2026

All tables have **Row-Level Security (RLS) enabled** in Supabase PostgreSQL.

---

## Tables Overview

| Table | Status | Purpose |
|---|---|---|
| `users` | ✅ MVP | Auth users — role: `user`, `seller`, or `admin` |
| `datasets` | ✅ MVP | Dataset metadata; `seller_id` links to the listing owner |
| `orders` | 🔧 Scaffolded | Active in Epic 3 (Payments) |
| `downloads` | 🔧 Scaffolded | Active in Epic 6 (Post Purchase) |
| `meet_slots` | 🔧 Scaffolded | Availability windows posted by sellers / admin |
| `meet_bookings` | 🔧 Scaffolded | Confirmed bookings on a slot (Calendly-style) |
| `issues` | 🔧 Scaffolded | Support issues raised by users/sellers, resolved by admin |

---

## users

| Column | Type | Notes |
|---|---|---|
| `id` | `uuid` PK | Mirrors `auth.users.id` |
| `email` | `text` unique | |
| `full_name` | `text` | Defaults to the email prefix when the user skips profile setup |
| `organization` | `text` nullable | Profile setup — company / university (optional/skippable) |
| `job_title` | `text` nullable | Profile setup — self-described role e.g. "Project Manager". **NOT** the permission `role` below |
| `role` | `text` | Permission role: `'user' \| 'seller' \| 'admin'`, default `'user'` |
| `avatar_url` | `text` | _Planned — not yet in the Prisma schema_ |
| `bio` | `text` | _Planned — not yet in the Prisma schema_ |
| `created_at` | `timestamptz` | DB default `now()` |
| `updated_at` | `timestamptz` | DB default `now()` (see note) + Prisma `@updatedAt` on app updates |

**RLS Policy:** Users can read/update their own row only. Admin can read all.

> **`handle_new_user` trigger + `updated_at` default:** a Supabase trigger on
> `auth.users` INSERTs the matching `public.users` row on signup. Because that
> INSERT happens **outside Prisma**, every column it omits must have a DB-level
> default — so `updated_at` carries `@default(now())` in the Prisma schema
> (migration `..._user_updated_at_default`). Without it the trigger throws a
> NOT NULL violation and the whole signup transaction aborts (GoTrue returns a
> 500 with an empty body). The trigger itself currently lives only in Supabase —
> it is **not** captured in a Prisma migration yet.

**Role capabilities:**

| Role | Can do |
|---|---|
| `user` | Browse, purchase, download datasets; open issues; book meets |
| `seller` | All user capabilities + list/manage their own datasets; host meet slots; resolve issues on their listings |
| `admin` | Full access — all data, all users, analytics, assign/resolve all issues, manage all meet slots |

---

## datasets

| Column | Type | Notes |
|---|---|---|
| `id` | `uuid` PK | |
| `seller_id` | `uuid` FK | → `users.id` — the seller who listed this dataset |
| `title` | `text` | |
| `slug` | `text` unique | Used in URLs |
| `description` | `text` | |
| `industry` | `text` | Indexed — filter |
| `category` | `text` | Indexed — filter |
| `language` | `text` | Indexed — filter |
| `tags` | `text[]` | GIN indexed — filter |
| `price` | `numeric(10,2)` | |
| `currency` | `text` | default `'USD'` |
| `thumbnail_url` | `text` | Public CDN URL |
| `binary_url` | `text` | Private bucket path |
| `sample_url` | `text` | Public CDN URL |
| `file_format` | `text` | `.csv \| .json \| .parquet …` |
| `file_size_bytes` | `bigint` | |
| `row_count` | `integer` | |
| `dodo_product_id` | `text` | Dodo Payments product ID — set on upload |
| `created_at` | `timestamptz` | |
| `updated_at` | `timestamptz` | |

**RLS Policy:** Anyone can SELECT all rows (datasets are live on upload — no publish step). `seller_id = auth.uid()` can INSERT/UPDATE their own rows. Admin can INSERT/UPDATE/DELETE all.

> **Note on gallery images:** `image_urls` (and the separate `dataset_images` table) are both deferred — only `thumbnail_url` is used for now (browse-page card image). A gallery for the detail page can be added back, in whichever shape, once that page is actually built.

---

## orders _(scaffolded — active in Epic 3)_

| Column | Type | Notes |
|---|---|---|
| `id` | `uuid` PK | |
| `user_id` | `uuid` FK | → `users.id` (buyer) |
| `dataset_id` | `uuid` FK | → `datasets.id` |
| `amount` | `numeric(10,2)` | |
| `currency` | `text` | |
| `status` | `text` | `'pending' \| 'paid' \| 'failed' \| 'refunded'` |
| `dodo_session_id` | `text` | Dodo Payments checkout session reference |
| `dodo_payment_id` | `text` | Dodo Payments final payment ID (from webhook) |
| `created_at` | `timestamptz` | |
| `paid_at` | `timestamptz` | |

**RLS Policy:** `auth.uid() = user_id` for SELECT/INSERT. Only service role key (via webhook) can UPDATE status.

### Order Status Lifecycle

```
pending  →  paid      (webhook: payment.succeeded)
pending  →  failed    (webhook: payment.failed)
paid     →  refunded  (webhook: payment.refunded — future)
```

---

## downloads _(scaffolded — active in Epic 6)_

| Column | Type | Notes |
|---|---|---|
| `id` | `uuid` PK | |
| `user_id` | `uuid` FK | → `users.id` |
| `dataset_id` | `uuid` FK | → `datasets.id` |
| `order_id` | `uuid` FK | → `orders.id` |
| `downloaded_at` | `timestamptz` | |
| `ip_address` | `text` | Audit log |

**RLS Policy:** `auth.uid() = user_id` for SELECT. INSERT only via service role.

---

## meet_slots

Availability windows that sellers or admin post — users can book into these.

| Column | Type | Notes |
|---|---|---|
| `id` | `uuid` PK | |
| `host_id` | `uuid` FK | → `users.id` (seller or admin hosting the slot) |
| `title` | `text` | e.g. "Dataset Q&A", "Onboarding Call" |
| `description` | `text` | Optional details about the meeting |
| `duration_minutes` | `integer` | e.g. 30, 60 |
| `available_date` | `date` | Calendar date of the slot |
| `start_time` | `time` | Slot start (local time stored, timezone in profile) |
| `end_time` | `time` | Slot end |
| `is_booked` | `boolean` | default `false` — flipped when a booking is confirmed |
| `meet_link` | `text` | Google Meet / Zoom URL set by host |
| `created_at` | `timestamptz` | |

**RLS Policy:** Any authenticated user can SELECT non-booked slots. Only `host_id = auth.uid()` or admin can INSERT/UPDATE/DELETE.

---

## meet_bookings

A confirmed booking by a user on an available slot.

| Column | Type | Notes |
|---|---|---|
| `id` | `uuid` PK | |
| `slot_id` | `uuid` FK | → `meet_slots.id` |
| `booker_id` | `uuid` FK | → `users.id` (user who booked) |
| `topic` | `text` | What the user wants to discuss |
| `notes` | `text` | Optional extra context from booker |
| `status` | `text` | `'pending' \| 'confirmed' \| 'cancelled'` |
| `created_at` | `timestamptz` | |

**RLS Policy:** `auth.uid() = booker_id` can SELECT/INSERT their own bookings. Slot host and admin can SELECT + UPDATE status. No user can DELETE a booking (only cancel via status update).

### Booking Status Lifecycle

```
pending   →  confirmed   (host confirms)
pending   →  cancelled   (host or booker cancels)
confirmed →  cancelled   (either party cancels)
```

---

## issues

Support issues raised by users or sellers, triaged and resolved by admin or the relevant seller.

| Column | Type | Notes |
|---|---|---|
| `id` | `uuid` PK | |
| `reporter_id` | `uuid` FK | → `users.id` (who opened the issue) |
| `assigned_to_id` | `uuid` FK nullable | → `users.id` (admin or seller handling it) |
| `order_id` | `uuid` FK nullable | → `orders.id` — attach to a specific order if relevant |
| `dataset_id` | `uuid` FK nullable | → `datasets.id` — attach to a specific dataset if relevant |
| `title` | `text` | Short summary |
| `description` | `text` | Full description |
| `category` | `text` | `'order' \| 'dataset' \| 'billing' \| 'account' \| 'general'` |
| `priority` | `text` | `'low' \| 'medium' \| 'high'` — default `'medium'` |
| `status` | `text` | `'open' \| 'in_progress' \| 'resolved' \| 'closed'` — default `'open'` |
| `resolution_notes` | `text` | Admin/seller notes when closing |
| `created_at` | `timestamptz` | |
| `updated_at` | `timestamptz` | |
| `resolved_at` | `timestamptz` | Set when status → `'resolved'` or `'closed'` |

**RLS Policy:** `auth.uid() = reporter_id` can SELECT/INSERT their own issues. Assigned user and admin can SELECT + UPDATE. Nobody can DELETE issues (audit trail).

### Issue Status Lifecycle

```
open  →  in_progress   (admin/seller picks it up)
in_progress  →  resolved   (fix applied, awaiting confirmation)
resolved  →  closed     (confirmed by reporter or auto-closed after 7 days)
open / in_progress  →  closed   (admin force-closes)
```

---

## Profile Dashboard — Data by Role

What each profile page surfaces from the DB:

| Data | User `/profile/user` | Seller `/profile/seller` | Admin `/profile/admin` |
|---|---|---|---|
| Profile info | ✅ own row | ✅ own row | ✅ own row |
| Order history | ✅ own orders | — | ✅ all orders |
| Downloaded datasets | ✅ own downloads | — | — |
| Listed datasets | — | ✅ own datasets | ✅ all datasets |
| Dataset revenue | — | ✅ sum(orders on their datasets) | ✅ total platform |
| Issues filed | ✅ own issues | ✅ own issues | — |
| Issues assigned | — | ✅ issues on their listings | ✅ all issues |
| Meet bookings made | ✅ upcoming meets | ✅ upcoming meets | ✅ upcoming meets |
| Meet slots hosted | — | ✅ manage slots | ✅ manage slots |
| Analytics | — | Basic (own listings) | Full platform |

---

## Deferred Tables (Future Epics)

### Dataset gallery images _(deferred — not in MVP)_

> Removed from `datasets` on 2026-06-23 — `image_urls text[]` existed but nothing read it (only `thumbnail_url` is used, on the browse-page card). Will be re-added, as either a column or the `dataset_images` table below, once the detail page actually needs a gallery.

**Option A — flat column (what was removed):**

| Column | Type | Notes |
|---|---|---|
| `image_urls` | `text[]` | Gallery CDN URLs stored directly on `datasets` |

**Option B — separate table (if sort-ordered gallery management is needed):**

| Column | Type | Notes |
|---|---|---|
| `id` | `uuid` PK | |
| `dataset_id` | `uuid` FK | → `datasets.id` |
| `image_url` | `text` | Public CDN URL |
| `sort_order` | `integer` | |

### contacts _(deferred — not in MVP)_

> Contact form submissions stored in DB deferred to a future epic.

| Column | Type | Notes |
|---|---|---|
| `id` | `uuid` PK | |
| `name` | `text` | |
| `email` | `text` | |
| `message` | `text` | |
| `created_at` | `timestamptz` | |
