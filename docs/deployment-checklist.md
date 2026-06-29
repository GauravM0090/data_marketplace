# Deployment Checklist — Dataset Marketplace

> Pre-launch steps for each release. Work through this top to bottom before every production deployment.

---

## Pre-Deployment Checklist

### 1. Code & Build

- [ ] All feature branches merged to `main`
- [ ] No TypeScript errors (`npx tsc --noEmit`)
- [ ] No lint errors (`npx eslint .`)
- [ ] Production build succeeds locally (`npm run build`)
- [ ] No console errors or warnings in the build output

### 2. Environment Variables

- [ ] All required env vars set in Vercel project settings
- [ ] `NEXT_PUBLIC_APP_URL` set to the production domain
- [ ] `SUPABASE_SERVICE_ROLE_KEY` set (server-only, never expose)
- [ ] `LOG_LEVEL` set to `info` (not `debug`) for production
- [ ] Dodo Payments keys set (if Epic 3 is live)
- [ ] SMTP credentials set and tested

### 3. Database

- [ ] All pending Prisma migrations applied to production DB
  ```bash
  npm run db:migrate:deploy
  # or: npx prisma migrate deploy
  ```
- [ ] `prisma generate` run against latest schema
- [ ] No schema drift between local and production DB
- [ ] RLS policies verified for all tables in Supabase Dashboard

### 4. Supabase Setup

- [ ] Storage buckets created with correct visibility:
  - `dataset-images` → Public
  - `dataset-samples` → Public
  - `dataset-binaries` → Private
- [ ] Auth URL Configuration updated:
  - Site URL: production domain
  - Redirect URLs: `https://yourdomain.com/**`
- [ ] RLS enabled on all tables
- [ ] Service role key not exposed in any client-side code

### 5. Vercel Deployment

- [ ] Connected to correct GitHub repo and branch (`main`)
- [ ] Build command: `npm run build`
- [ ] Output directory: `.next`
- [ ] Node.js version: 20.x
- [ ] All env vars configured in Vercel dashboard (not just `.env.local`)

### 6. Smoke Tests (Post-Deploy)

Run these manually after each deployment:

- [ ] Landing page loads correctly at production URL
- [ ] `/datasets` listing page loads with real data
- [ ] Individual dataset detail page loads (`/datasets/[slug]`)
- [ ] Sign up flow works (check email confirmation)
- [ ] Sign in flow works
- [ ] Sign out works
- [ ] Auth-protected routes (`/account/*`) redirect to login when unauthenticated
- [ ] Contact form submits successfully
- [ ] No 500 errors in Vercel function logs

### 7. Performance

- [ ] Core Web Vitals checked (Vercel Analytics or PageSpeed Insights)
- [ ] Images loading from Supabase CDN (not origin)
- [ ] No large client JS bundles (check Vercel build output)

---

## Rollback Plan

If a deployment causes issues:

1. Go to Vercel Dashboard → Deployments
2. Find the last known-good deployment
3. Click **Promote to Production**
4. If DB migrations were applied, assess whether a rollback migration is needed

---

## Release Notes

Document what changed in each release in [regularwork.md](./regularwork.md).

---

## Environment-Specific Notes

| Environment | DB | Supabase Project | Vercel |
|---|---|---|---|
| Local | Dev Supabase project | Dev project | `npm run dev` |
| Production | Production Supabase project | Prod project | Vercel (auto-deploy on push to `main`) |

> Always keep dev and production on **separate** Supabase projects — never run migrations against production from a local machine.

