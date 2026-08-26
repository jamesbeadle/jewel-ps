import { dbConfigured, dbCount, dbSelect } from '$lib/server/db.js';

/** @type {import('./$types').PageServerLoad} */
export const load = async () => {
	/** @type {number | null} */
	let enquiryCount = null;
	let newEnquiryCount = 0;
	let weekCount = 0;
	/** @type {import('$lib/server/db.js').EnquiryRow[]} */
	let recentEnquiries = [];
	/** @type {string | null} */
	let dbError = null;

	if (dbConfigured()) {
		try {
			const weekAgo = new Date(Date.now() - 7 * 86_400_000).toISOString();
			[enquiryCount, newEnquiryCount, weekCount] = await Promise.all([
				dbCount('enquiries', 'status=neq.archived'),
				dbCount('enquiries', 'status=eq.new'),
				dbCount('enquiries', `created_at=gte.${encodeURIComponent(weekAgo)}`)
			]);
			recentEnquiries = await dbSelect(
				'enquiries',
				'select=*&status=neq.archived&order=created_at.desc&limit=5'
			);
		} catch (e) {
			dbError = (e instanceof Error ? e.message : 'Unknown error').slice(0, 400);
		}
	}

	return {
		configured: dbConfigured(),
		enquiryCount,
		newEnquiryCount,
		weekCount,
		recentEnquiries,
		dbError
	};
};
