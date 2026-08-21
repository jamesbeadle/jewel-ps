# Jewel Property Serve

Refreshed website for **Jewel Property Serve** (jewelps.co.uk), built with SvelteKit 2 + Svelte 5 + Tailwind CSS v3.
Deployed on Vercel (`@sveltejs/adapter-vercel`). No backend yet — Supabase can be added later.

## Pages

Home (`/`), About (`/about`), Refurbishment (`/refurbishment`), Maintenance (`/maintenance`),
Fire & Flood (`/fire-flood-restoration`), Contact (`/contact`).

All site content (nav, services, testimonials, FAQs, contact details) lives in `src/lib/site.js`.

## Images

Images are currently hot-linked from the live jewelps.co.uk site. To self-host them:

```bash
bash scripts/fetch-assets.sh   # downloads them into static/images/
```

then change `IMG_BASE` in `src/lib/site.js` to `'/images'`.

## Contact form

The form on `/contact` opens the visitor's email client (mailto) — no backend needed.
Swap in Formspree or Supabase later for true in-page submission.

## Stack

- **SvelteKit 2** / **Svelte 5** (runes)
- **Tailwind CSS v3** (config in `tailwind.config.js`)
- **Vercel adapter** for deployment
- JavaScript with JSDoc type-checking (`jsconfig.json`)

## Local development

```bash
npm install
npm run dev          # http://localhost:5173
```

Other scripts:

```bash
npm run build        # production build
npm run preview      # preview the production build locally
npm run check        # type / svelte checks
```

## Project structure

```
src/
  app.html            # page shell
  app.css             # Tailwind entry
  routes/
    +layout.svelte    # header / footer / nav
    +page.svelte      # homepage
    about/+page.svelte
    contact/+page.svelte
static/               # static assets (favicon, images)
tailwind.config.js    # theme: brand colors + Inter font
svelte.config.js      # Vercel adapter
```

## Editing content

- Site name + nav: `src/routes/+layout.svelte`
- Homepage headline / tagline: `src/routes/+page.svelte`
- Brand colors + font: `theme.extend` in `tailwind.config.js`

## Deploy to Vercel

1. Push this repo to GitHub (`jewel-ps`).
2. In Vercel: **Add New → Project → Import** this repo.
3. Framework preset auto-detects as **SvelteKit**. No env vars needed yet.
4. Deploy. You'll get a `*.vercel.app` test URL immediately.
5. Point a custom domain later under **Project → Settings → Domains** (DNS can be configured then).

## Adding Supabase later

When these become dynamic, install `@supabase/ssr`, add the keys to `.env`
(see `.env.example`), and create a client in `src/lib`. Not wired up yet.
