import { building } from '$app/environment';
import { redirect } from '@sveltejs/kit';
import { ADMIN_COOKIE, verifySessionToken } from '$lib/server/auth.js';

/** @type {import('@sveltejs/kit').Handle} */
export const handle = async ({ event, resolve }) => {
	// During prerendering the crawler can follow the footer link to /admin.
	// If the guard redirected at build time, SvelteKit would bake that redirect
	// in as a static response — so the guard must not run while building.
	if (building) return resolve(event);

	const { pathname } = event.url;

	if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
		const ok = await verifySessionToken(event.cookies.get(ADMIN_COOKIE));
		if (!ok) redirect(303, '/admin/login');
	}

	return resolve(event);
};
