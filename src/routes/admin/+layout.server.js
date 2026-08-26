import { dbConfigured, dbCount } from '$lib/server/db.js';

/**
 * Shared across every admin page: the count of unread enquiries, shown as a
 * badge in the admin nav. Fails soft (0) so a missing table or connection
 * issue never breaks the admin area.
 * @type {import('./$types').LayoutServerLoad}
 */
export const load = async ({ url }) => {
	if (url.pathname === '/admin/login' || !dbConfigured()) {
		return { newEnquiries: 0 };
	}
	try {
		return { newEnquiries: await dbCount('enquiries', 'status=eq.new') };
	} catch {
		return { newEnquiries: 0 };
	}
};
