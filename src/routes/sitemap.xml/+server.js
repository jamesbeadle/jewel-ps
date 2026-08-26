import { site } from '$lib/site.js';

export const prerender = true;

const pages = [
	{ path: '/', priority: '1.0' },
	{ path: '/about', priority: '0.8' },
	{ path: '/refurbishment', priority: '0.9' },
	{ path: '/maintenance', priority: '0.9' },
	{ path: '/fire-flood-restoration', priority: '0.9' },
	{ path: '/contact', priority: '0.8' },
	{ path: '/brochure', priority: '0.5' },
	{ path: '/privacy', priority: '0.2' }
];

export function GET() {
	const lastmod = new Date().toISOString().slice(0, 10);
	const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages
	.map(
		(p) => `  <url>
    <loc>${site.url}${p.path === '/' ? '' : p.path}</loc>
    <lastmod>${lastmod}</lastmod>
    <priority>${p.priority}</priority>
  </url>`
	)
	.join('\n')}
</urlset>`;
	return new Response(body, { headers: { 'content-type': 'application/xml', 'cache-control': 'max-age=3600' } });
}
