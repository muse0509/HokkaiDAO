# Deploy — HokkaiDAO LP

Fully static site (`output: "export"`), hosted on **Cloudflare Pages**. There is
no server and no database: the interest form posts directly to a **Google Form**
from the browser, and first-party attribution is captured client-side.

## 1. Wire up the Google Form (required for the form to submit)

Until this is done, the form validates but shows *"isn't connected yet."*

1. Create a Google Form with one question per field. Suggested types:
   - **Short answer**: name, email, x_handle, organization_or_project,
     location, website, github, telegram, referral_source
   - **Paragraph**: reason, notes, attribution
   - **Dropdown** (or short answer): role
   - **Checkboxes**: interest_type — add the 9 options
     (participant, sponsor, speaker, volunteer, designer, partner, media,
     investor, other)
   - **Checkbox** (single, value `Yes`): has_attended_mtndao_or_similar
2. Form → ⋮ → **Get pre-filled link**. Fill every field with a dummy value →
   **Get link** → copy it. Each field appears as `entry.1234567890=...`.
3. Open `lib/google-form.ts` and:
   - Set `GOOGLE_FORM_ACTION` to your form URL with `/viewform` replaced by
     `/formResponse`.
   - Replace every `entry.REPLACE_*` in `GOOGLE_FORM_ENTRY_IDS` with the real ids.

Responses land in the form's linked Google Sheet. UTM / ref / sponsor data is
sent as JSON in the `attribution` field.

## 2. Environment variables (optional)

Set at build time (e.g. Pages project → Settings → Variables) — all optional:

- `NEXT_PUBLIC_SITE_URL` — canonical URL (sitemap/OG). e.g. `https://hokkaidao.xyz`
- `NEXT_PUBLIC_GA_ID` / `NEXT_PUBLIC_POSTHOG_KEY` — analytics (consent-gated)
- `NEXT_PUBLIC_DEFAULT_UTM_SOURCE` — fallback utm_source for attribution
- `NEXT_PUBLIC_FORM_ENABLED=false` — hide the form and show the fallback link
- `INTEREST_FORM_FALLBACK_URL` — public Google Form URL shown when disabled

## 3. Deploy

```bash
# Build + deploy to Cloudflare Pages (already logged in via wrangler)
npm run deploy

# Local preview of the production build
npm run preview
```

First run prompts to create the Pages project (name: `hokkaidao-lp`). After that,
`npm run deploy` ships the contents of `out/`.

To auto-deploy on push instead, connect the GitHub repo in the Cloudflare Pages
dashboard with build command `npm run build` and output directory `out`.
