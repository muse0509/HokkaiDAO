# ctsDAO — Landing Page

Production landing page for **ctsDAO**, a planned two-week Solana builder
retreat in Sapporo, Japan (March 2027). Built with Next.js App Router,
TypeScript, Tailwind CSS v4, Framer Motion, and Zod.

## Features

- Animated, editorial landing page (hero, concept, Work/Powder/Demo format,
  the room, sponsor pillars, ownable moments, participants, status, interest
  form, sponsor CTA) — all copy deliberately cautious about unconfirmed
  partners, venue, and dates
- Backend-backed interest form (`POST /api/interest`) with Zod validation,
  honeypot, per-IP rate limiting, and salted IP hashing
- First-party attribution cookie (90 days) capturing UTM params, `ref`,
  `sponsor`, `invite`, `source`, landing path, and first/last-touch timestamps
- Optional analytics (GA4 + PostHog) behind a consent banner; tracking
  no-ops when keys are missing and logs to console in development
- Admin export: `GET /api/admin/submissions?secret=...` (JSON or CSV)
- SQLite for local dev, PostgreSQL for production, behind a small adapter
- Generated Open Graph image, sitemap, robots, full SEO metadata
- `prefers-reduced-motion` support throughout

## Local setup

```bash
npm install
cp .env.example .env.local   # fill in at least ADMIN_VIEW_SECRET
npm run dev                  # http://localhost:3000
```

With no `DATABASE_URL`, submissions are stored in a local SQLite file at
`./data/dev.db` (gitignored). Set `DATABASE_URL=postgres://...` for
PostgreSQL — the table is created automatically on first use.

## Environment variables

See [.env.example](.env.example). Highlights:

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Canonical URL for SEO/OG metadata |
| `NEXT_PUBLIC_FORM_ENABLED` | `false` hides the form and shows the fallback link |
| `DATABASE_URL` | `postgres://...` for prod, empty/`file:` for SQLite dev |
| `ADMIN_VIEW_SECRET` | Secret for the admin submissions endpoint |
| `NEXT_PUBLIC_GA_ID`, `NEXT_PUBLIC_POSTHOG_KEY`, `NEXT_PUBLIC_POSTHOG_HOST` | Optional analytics — site works without them |
| `NEXT_PUBLIC_DEFAULT_UTM_SOURCE` | Default `utm_source` for visitors with no params |
| `CONTACT_EMAIL`, `CONTACT_X_HANDLE` | Contact details rendered on the page |
| `INTEREST_FORM_FALLBACK_URL` | External form link shown when the form is disabled |
| `IP_HASH_SALT` | Optional salt for submitter IP hashing |

## Reading submissions

```bash
# JSON, newest first
curl "https://your-domain/api/admin/submissions?secret=$ADMIN_VIEW_SECRET"

# CSV download
curl "https://your-domain/api/admin/submissions?secret=$ADMIN_VIEW_SECRET&format=csv" -o submissions.csv
```

The secret can also be passed as an `Authorization: Bearer` header.

## Attribution

`proxy.ts` runs on every page view and maintains the `hkd_attr` cookie:
first-touch fields (`utm_*`, `ref`, `sponsor`, `invite`, `source`,
`landing_path`, `first_referrer`, `first_landing_url`, `first_seen_at`) are
written once and preserved; `last_seen_at` / `last_landing_path` refresh on
later visits. Share links like:

```
https://your-domain/?utm_source=x&utm_campaign=launch&ref=yourname
https://your-domain/?sponsor=acme
https://your-domain/?invite=builder-batch-1
```

The cookie is attached to each form submission server-side, so every row in
the database carries its acquisition source.

## Deployment checklist

- [ ] Set `NEXT_PUBLIC_SITE_URL` to the production domain
- [ ] Provision PostgreSQL and set `DATABASE_URL`
- [ ] Generate a strong `ADMIN_VIEW_SECRET` (`openssl rand -hex 32`)
- [ ] Set `IP_HASH_SALT` to a random value
- [ ] (Optional) add GA / PostHog keys
- [ ] `npm run build` passes; verify `/`, `/api/interest`, `/api/admin/submissions`
- [ ] Confirm OG image renders at `/opengraph-image`
- [ ] Test a UTM-tagged link end-to-end and check the stored attribution
