import { building } from '$app/environment';
import { ADMIN_COOKIE, verifySessionToken } from '$lib/server/auth.js';

/**
 * Headers added to every /admin response (pages, form actions, the media
 * upload API, PDF downloads):
 *  - no-store: never cached by the browser, a proxy or Vercel's CDN, so
 *    nothing private lingers after logout (or behind the Back button);
 *  - DENY: admin pages can't be framed by another site (clickjacking);
 *  - nosniff / Referrer-Policy: browsers must honour the content type and
 *    never send admin URLs to third parties;
 *  - X-Robots-Tag: keeps search engines out even if a page is linked.
 * @type {Record<string, string>}
 */
const ADMIN_HEADERS = {
	'Cache-Control': 'no-store',
	'X-Frame-Options': 'DENY',
	'X-Content-Type-Options': 'nosniff',
	'Referrer-Policy': 'same-origin',
	'X-Robots-Tag': 'noindex, nofollow'
};

/** @type {import('@sveltejs/kit').Handle} */
export const handle = async ({ event, resolve }) => {
	// During prerendering the crawler can follow the footer link to /admin.
	// If the guard redirected at build time, SvelteKit would bake that redirect
	// in as a static response — so the guard must not run while building.
	if (building) return resolve(event);

	const { pathname } = event.url;

	// Deliberately broad: anything starting with /admin is treated as admin
	// territory, so a new route can never be forgotten by the guard.
	if (!pathname.startsWith('/admin')) return resolve(event);

	const loggedIn = await verifySessionToken(event.cookies.get(ADMIN_COOKIE));

	if (pathname === '/admin/login') {
		// Already signed in? Straight to the dashboard (POSTs still go
		// through so an expired-then-renewed login form keeps working).
		if (loggedIn && event.request.method === 'GET') return withAdminHeaders(redirectTo('/admin'));
	} else if (!loggedIn) {
		return withAdminHeaders(redirectTo('/admin/login'));
	}

	return withAdminHeaders(await resolve(event));
};

/**
 * A 303 built by hand (rather than thrown with `redirect()`) so the admin
 * headers can be added to it like any other /admin response.
 * @param {string} location
 */
function redirectTo(location) {
	return new Response(null, { status: 303, headers: { location } });
}

/** @param {Response} response */
function withAdminHeaders(response) {
	try {
		for (const [name, value] of Object.entries(ADMIN_HEADERS)) {
			response.headers.set(name, value);
		}
		return response;
	} catch {
		// Some responses carry immutable headers (e.g. one passed straight
		// through from fetch) — rebuild it rather than skip the headers.
		const headers = new Headers(response.headers);
		for (const [name, value] of Object.entries(ADMIN_HEADERS)) headers.set(name, value);
		return new Response(response.body, {
			status: response.status,
			statusText: response.statusText,
			headers
		});
	}
}
