# NextStep — Hybrid deploy (new Next.js site on Vercel + old CRM backend on Render)

## Architecture

```
NEW Next.js site (Vercel)
  ├─ public website (this repo)
  ├─ /api/apply  → proxies to OLD backend  (leads, register-ID, email, WhatsApp AI)
  ├─ /api/track  → proxies to OLD backend  (application status)
  └─ content CMS, countries, newsletter, bookings, analytics → Turso DB

OLD backend (Render, unchanged)  = the "brain": CRM, WhatsApp AI, tracking, email, docs
Domain (Cloudflare DNS)          → points to Vercel
```

The form token is injected **server-side** in the proxy, so it is never exposed to
the browser and there is **no CORS** to configure on the old backend.

## What is already wired in the code

- `src/lib/backend.ts` — bridge to old backend (base URL + token + retry for Render cold starts)
- `src/app/api/apply/route.ts` — proxies to `POST /public/website/apply-json`
- `src/app/api/track/route.ts`  — proxies to `GET /public/website/track`
- `src/lib/db.ts` — uses Turso (libSQL) when `TURSO_DATABASE_URL` is set; local SQLite file otherwise
- `.env` — has all keys (see below)

## Step 1 — Create the Turso database (seed it from the local DB in one shot)

```bash
# install once:  https://docs.turso.tech/quickstart
turso auth login
turso db create nextstep --from-file ./db/custom.db   # uploads schema + 16 countries + content
turso db show --url nextstep        # → TURSO_DATABASE_URL   (libsql://...)
turso db tokens create nextstep     # → TURSO_AUTH_TOKEN
```

## Step 2 — New GitHub repo

```bash
git init && git add -A && git commit -m "NextStep hybrid site"
gh repo create nextstep-website --private --source=. --push
```

## Step 3 — Vercel

Import the repo, then set Environment Variables (Production):

| Key                  | Value                                             |
|----------------------|---------------------------------------------------|
| `TURSO_DATABASE_URL` | from `turso db show --url nextstep`               |
| `TURSO_AUTH_TOKEN`   | from `turso db tokens create nextstep`            |
| `OLD_API_BASE`       | `https://ai-consultancy-2dk0.onrender.com`        |
| `WEBSITE_FORM_SECRET`| `NSI-WEB-FORM-SECURE-KEY-7k3m9p2qx` (match Render)|

Deploy. On the Vercel preview URL, **test that a form submission and the tracking
page both work** before touching DNS.

## Step 4 — Point the domain (LAST)

In Cloudflare DNS, change `@` / `www` for nextstepinternationals.com from Render → Vercel
(Vercel shows the exact records). Leave the old Render service running as rollback.

## Notes / known gaps

- **Book-a-session** has no endpoint on the old backend, so bookings are stored in Turso
  and appear only in the NEW site's admin — not the old CRM. Add a `/public/website/book`
  endpoint on the old backend later if you want them in the CRM too.
- **Content images** are URL strings in the CMS. Paste public R2 URLs
  (`https://media.nextstepinternationals.com/...`). An in-admin uploader can be added later.
- Old backend runs on Render free tier (~60s cold start). The proxy already retries.
