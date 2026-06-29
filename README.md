This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Documentation

All project docs live in [`docs/`](docs/):

| Doc | What it covers |
|---|---|
| [docs/tech-stack-decisions.md](docs/tech-stack-decisions.md) | Tech stack choices and the reasoning behind each |
| [docs/environment-setup.md](docs/environment-setup.md) | Local vs production env setup, env vars, migrations across environments |
| [docs/auth.md](docs/auth.md) | Supabase SSR session management, the auth flow, and env keys |
| [docs/dodopayments.md](docs/dodopayments.md) | Dodo Payments integration — checkout + webhook flow, architecture decisions |
| [docs/deployment-checklist.md](docs/deployment-checklist.md) | Deployment checklist |
| [docs/regularwork.md](docs/regularwork.md) | Running AI development log (session-by-session record of all work) |

### Architecture overview ([`docs/architecture-overview/`](docs/architecture-overview/))

| Doc | What it covers |
|---|---|
| [docs/architecture-overview/system-design.md](docs/architecture-overview/system-design.md) | High-level system design |
| [docs/architecture-overview/db-schema.md](docs/architecture-overview/db-schema.md) | Database schema reference |
| [docs/architecture-overview/api-contracts.md](docs/architecture-overview/api-contracts.md) | API endpoint contracts |

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
