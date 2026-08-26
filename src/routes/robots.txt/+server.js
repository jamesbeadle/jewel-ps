import { site } from '$lib/site.js';

export const prerender = true;

export function GET() {
	return new Response(`User-agent: *\nAllow: /\nDisallow: /admin\n\nSitemap: ${site.url}/sitemap.xml\n`, {
		headers: { 'content-type': 'text/plain' }
	});
}
