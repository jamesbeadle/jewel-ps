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

## Launch checklist

1. **Photography** — images are still hot-linked from the live site. Before the old site is switched off, run
   `bash scripts/fetch-assets.sh` (Mac/Linux) or `powershell -ExecutionPolicy Bypass -File scripts\fetch-assets.ps1` (Windows),
   then set `VITE_IMG_BASE=/images/photos` in `.env` and in Vercel. Better still, replace them with fresh, high-res project photography — the parallax hero deserves it.
2. **Contact form** — set `FORM_WEBHOOK_URL` (and optionally `FORM_WEBHOOK_SECRET`) in Vercel → Settings → Environment Variables.
   Any JSON webhook works; an n8n *Webhook* node → *Send Email* is the simplest. The form posts:
   `{ source, submittedAt, ip, userAgent, name, email, phone, postcode, service, message }` with header `x-jewel-secret`.
   Until it's set, the form shows an "email us instead" fallback with a pre-filled mailto.
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
