import { dbConfigured, dbCount, dbSelect } from '$lib/server/db.js';
import { uploadedImageLibrary } from '$lib/server/brochures.js';

/** @type {import('./$types').PageServerLoad} */
export const load = async () => {
	/** @type {number | null} */
	let enquiryCount = null;
	let newEnquiryCount = 0;
	let weekCount = 0;
	/** @type {number | null} */
	let brochureCount = null;
	/** @type {number | null} */
	let rtwCount = null;
	/** @type {number | null} */
	let mediaCount = null;
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
		// Newer tables (supabase/2026-08-26-admin.sql) — may not exist yet.
		// Separate tries so a missing table never breaks the tiles above.
		try {
			brochureCount = await dbCount('brochures');
		} catch {
			brochureCount = null;
		}
		try {
			rtwCount = await dbCount('rtw_submissions');
		} catch {
			rtwCount = null;
		}
		try {
			mediaCount = (await uploadedImageLibrary()).length;
		} catch {
			mediaCount = null;
		}
	}

	return {
		configured: dbConfigured(),
		enquiryCount,
		newEnquiryCount,
		weekCount,
		brochureCount,
		rtwCount,
		mediaCount,
		recentEnquiries,
		dbError
	};
};
