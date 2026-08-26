/**
 * Bare A4 render of a brochure — the page the headless PDF browser captures.
 *
 * Access:
 *  - the built-in default ('default') and the ACTIVE brochure are public
 *    (they're the same content as /brochure);
 *  - drafts need either a valid admin session or a short-lived print token
 *    (issued by the PDF endpoints).
 */
import { error } from '@sveltejs/kit';
import { ADMIN_COOKIE, verifyPrintToken, verifySessionToken } from '$lib/server/auth.js';
import { dbConfigured } from '$lib/server/db.js';
import { fallbackBrochure, getBrochure } from '$lib/server/brochures.js';

export const prerender = false;

/** @type {import('./$types').PageServerLoad} */
export const load = async ({ params, url, cookies }) => {
	if (params.id === 'default' || !dbConfigured()) {
		return { doc: fallbackBrochure() };
	}

	const doc = await getBrochure(params.id);
	if (!doc) error(404, 'Brochure not found');

	if (doc.brochure.status !== 'active') {
		const tokenOk = await verifyPrintToken(params.id, url.searchParams.get('token'));
		const sessionOk = await verifySessionToken(cookies.get(ADMIN_COOKIE));
		if (!tokenOk && !sessionOk) error(403, 'This brochure is not published');
	}

	return { doc };
};
