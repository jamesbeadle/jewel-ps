import { fallbackBrochure, getActiveBrochure } from '$lib/server/brochures.js';

export const prerender = false;

/**
 * The public brochure page shows the ACTIVE brochure built in /admin/brochure.
 * Before Supabase is connected (or before any brochure is made active) it
 * falls back to the built-in default so the page always works.
 * @type {import('./$types').PageServerLoad}
 */
export const load = async () => {
	const active = await getActiveBrochure();
	return { doc: active ?? fallbackBrochure() };
};
