# Jewel Property Serve — website

The new **jewelps.co.uk**, built with SvelteKit 2 + Svelte 5 + Tailwind CSS v3 and deployed on Vercel.
Follows the Jewel Enterprise Brand Guidelines 2026 (PS Blue `#135EAA`, Jewel Gold `#C09A51`, PS Grey `#BBBBBB`; Switzer for headings, Geom Graphic for body).

## Pages

| Route | What's there |
| --- | --- |
| `/` | Sticky parallax hero the page slides over, services, intro + count-up stats, scroll-progress process, trades index, testimonials, Ecologi, CTA |
| `/about` | Story, mission, CEO quote, four brand values, Ecologi, testimonials |
| `/refurbishment` | Kitchens, bathrooms, carpentry & joinery, tiling, decoration |
| `/maintenance` | All 17 maintenance services, managing-agent support |
| `/fire-flood-restoration` | Restoration services, four-step claims process |
| `/contact` | Contact cards, map, enquiry form (server action), FAQs |
| `/brochure` | The active brochure from the admin builder, viewable as A4 pages + "Download PDF" |
| `/rtw` | Right to Work check tool (internal compliance; noindex, blocked in robots.txt) |
| `/privacy` | Privacy notice |
| `/sitemap.xml`, `/robots.txt` | Generated |

Old Webflow URLs (`/about-us-jewel-property-serve.html` etc.) 301-redirect to the new routes via `vercel.json`.

## Where things live

- **All copy & data** — `src/lib/site.js` (nav, services, testimonials, FAQs, contact details).
- **Brand colours / fonts** — `tailwind.config.js` and `src/app.css`.
- **Motion** — `src/lib/motion.js` (`reveal`, `parallax`, `countUp` actions + lazy-loaded GSAP). Everything respects `prefers-reduced-motion`.
- **Header / footer / mobile menu / sticky call bar** — `src/routes/+layout.svelte`.
- **Shared sections** — `src/lib/components/` (PageHero, Testimonials, CtaBand, Faq, Accreditations, Seo, Icon, Facets).
- **Logos** — `static/images/logos/` (from the official logo pack).
- **Photography** — `static/images/photos/` (self-hosted asset library recovered from the old Webflow site); the picker groups live in `src/lib/data/photos.js`.
- **Brochure builder** — templates & default content in `src/lib/brochure/`, A4 page renderers in `src/lib/components/brochure/`, data access in `src/lib/server/brochures.js`, PDF rendering in `src/lib/server/pdf.js`.
- **Admin area** — `src/routes/admin/` (see below); shared admin look in `src/routes/admin/admin.css`, auth in `src/lib/server/auth.js`, Supabase client + storage in `src/lib/server/db.js`.

## Admin area

There's a full admin at **`/admin`** (discreet link in the footer, `noindex`, blocked in `robots.txt`) — the same
structure and look as the jewelbb.co.uk admin:

- **Enquiries** — every contact-form submission is stored in Supabase and shown as an inbox: unread badge, open to read
  (marks it read), reply-by-email, archive/restore, delete, pagination. Each submission is also emailed to
  `enquiries@jewelps.co.uk` via Resend, so you get both.
- **Media** — a photo library backed by Supabase Storage (public `media` bucket). Photos upload straight to storage at
  full resolution via short-lived signed URLs (sidesteps Vercel's ~4.5 MB body cap), and every image the site ships
  with is browsable too, with copy-URL everywhere.
- **Brochures** — the full brochure builder from jewelbb.co.uk, redesigned for the PS brand. Compose print-quality A4
  brochures page by page from designed templates (cover, introduction, services, process, case-study spreads, gallery,
  team, testimonials, back cover), with a live A4 preview and the media picker on every image field. Keep brochures in
  draft and make one **active** — that's what visitors see at `/brochure` and download as a PDF. PDFs are rendered
  server-side with headless Chromium (`puppeteer-core` + `@sparticuz/chromium`), so the output is identical to the
  designed pages every time. A new brochure can be seeded from the built-in Jewel PS layout, which is also the fallback
  shown at `/brochure` before anything is published.
- **RTW checks** — every Right to Work check completed at `/rtw` (Jeremy's guided check tool, entity `JPS`) is logged
  to a register viewable here; the tool's copy-row and print outputs are unchanged.
- **Login** — one shared username/password from env vars, held in a signed `httpOnly` cookie for 8 hours. No accounts
  table, no third-party auth. Rate-limited against brute force (see *Security* below).
- **Supabase** — talked to over plain `fetch` with the service-role key (no SDK). Tables have RLS enabled with no
  policies, so nothing is reachable with the public anon key.

If Supabase isn't configured the public site is unaffected: the form still delivers via the webhook, `/brochure` shows
the built-in default, and the dashboard explains what's missing.

**Setup (once):**

1. In the Jewel PS Supabase project's **SQL Editor**, run `supabase/schema.sql` (enquiries + login-attempt log),
   `supabase/2026-08-26-admin.sql` (media bucket, brochures, RTW register) and
   `supabase/2026-09-04-security-hardening.sql` (locks the public API roles out, adds the login-attempt log to an
   existing database). *The first two have already been applied to the live `jewel-ps` project; run the hardening
   script there once — it's safe on live data.* (Existing database? Don't re-run `schema.sql` — see *Database
   migrations* below.)
2. **Project Settings → API**: copy the **Project URL** and **service_role** key into `SUPABASE_URL` /
   `SUPABASE_SERVICE_ROLE_KEY` (locally in `.env`, and on Vercel). The service-role key bypasses RLS — server only,
   never commit it.
3. Set `ADMIN_USERNAME` / `ADMIN_PASSWORD` (and ideally a random `ADMIN_SESSION_SECRET`) for the login.
4. Redeploy, then sign in at `/admin`.

**PDF generation** — on Vercel nothing to configure (`@sparticuz/chromium` is bundled; the routes set
`maxDuration: 60`). Locally it uses an installed Chrome/Chromium automatically, or set `PDF_CHROME_PATH`.

### Database migrations

`schema.sql` is for a **fresh** database. On the live database, apply changes with the dated, standalone files in
`supabase/` instead — each is additive, idempotent and safe to re-run:

| File | Adds |
| --- | --- |
| `2026-08-26-admin.sql` | `media` storage bucket, `brochures` + `brochure_pages` (brochure builder), `rtw_submissions` (RTW register) |
| `2026-09-04-security-hardening.sql` | RLS on every table, public API roles revoked, `admin_login_attempts` table (see *Security*) |

## Security

**Database.** Every table has row-level security enabled with **no policies**. The site's server code authenticates
with the `service_role` key, which bypasses RLS; the public `anon`/`authenticated` keys are never used and see nothing.
As a second layer, `2026-09-04-security-hardening.sql` also revokes the table privileges Supabase grants those public
roles by default (and stops future tables getting them), so even if RLS were switched off by mistake the public keys
still couldn't read or write anything. The script ends with a report — every table should show `rls_enabled = true`,
`policies = 0`, `anon_access = false`, `service_role_access = true`. If a table is ever meant to be read with the anon
key, it needs both a policy *and* an explicit `grant select on public.<table> to anon`. The public `media` storage
bucket is unaffected — uploaded photos keep serving as before.

**Admin area (`/admin`).** Guarded in `src/hooks.server.js` for every request whose path starts with `/admin` (except
the login page): the `jps_admin` cookie must carry a valid, unexpired HMAC-SHA256 signature. The cookie is `HttpOnly`,
`Secure`, `SameSite=Lax` and lasts 8 hours; SvelteKit's built-in origin check protects the login/logout forms from
CSRF. Credentials and signatures are compared in constant time. The login is rate-limited — after **5 failed attempts
from one IP within 15 minutes** further attempts are refused until the window passes (attempts are logged in
`admin_login_attempts`, so the limit survives redeploys; a wrong password also costs a one-second delay). Every
`/admin` response is sent with `Cache-Control: no-store`, `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`,
`Referrer-Policy: same-origin` and `X-Robots-Tag: noindex`. Failed and refused logins appear in the Vercel function
logs as `Admin login failed for <ip>` / `Admin login refused for <ip>`.

To sign every admin out at once (e.g. after a shared laptop goes missing), change `ADMIN_SESSION_SECRET` in Vercel and
redeploy.

## Launch checklist

1. **Photography** — ✅ done: the full image library from the old site now lives in `static/images/photos/` and
   `VITE_IMG_BASE=/images/photos` is set in `.env` — remember to set the same variable in Vercel so the deployed site
   self-hosts too. (`scripts/fetch-assets.sh` remains only as a fallback.)
2. **Contact form email** — enquiries are emailed via [Resend](https://resend.com) (the `jewelps.co.uk` domain is
   verified there). Set `RESEND_API_KEY` in Vercel → Settings → Environment Variables; optionally `CONTACT_TO_EMAIL`
   (default `enquiries@jewelps.co.uk`) and `CONTACT_FROM_EMAIL` (default `website@jewelps.co.uk` — must be on the
   verified domain). Emails have Reply-To set to the enquirer, so replying answers them directly. The old
   `FORM_WEBHOOK_URL` (n8n) path still works as an optional extra. With nothing configured, the form shows an
   "email us instead" fallback with a pre-filled mailto.
3. **Geom Graphic** — the licensed body font isn't in the repo; Outfit is the stand-in. Drop the `.woff2` files into `static/fonts/` and uncomment the `GEOM` block at the top of `src/app.css`.
4. **Terms & conditions** — `static/documents/terms-and-conditions.pdf` is a client-facing Terms of Business (v1.0, Aug 2026) written for the new site; the source is `scripts/terms-and-conditions.html` — edit it and re-export to PDF from a browser (Print → Save as PDF, A4, background graphics on). Have it checked before launch.
5. **Domain** — point `jewelps.co.uk` at Vercel under Project → Settings → Domains.

## Local development

```bash
npm install
npm run dev          # http://localhost:5173
npm run build        # production build
npm run preview      # builds, then serves the production build on http://localhost:4173
npm run check        # svelte-check (passes with 0 errors)
```

Copy `.env.example` to `.env` for local environment variables.

## Deploy to Vercel

Push to GitHub, import the repo in Vercel (framework auto-detects as SvelteKit), add the environment variables above, deploy.
