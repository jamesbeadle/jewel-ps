import { dbConfigured, dbCount, dbSelect } from '$lib/server/db.js';

const PAGE_SIZE = 20;

/**
 * @typedef {Object} RtwSubmissionRow
 * @property {string} id
 * @property {string} group_id
 * @property {string} entity
 * @property {string} full_name
 * @property {string} trade
 * @property {string} engagement_type
 * @property {string | null} start_date
 * @property {string} check_method
 * @property {string} document_seen
 * @property {string | null} check_date
 * @property {string} checked_by
 * @property {string} outcome
 * @property {string | null} permission_expiry
 * @property {string | null} followup_due
 * @property {string} evidence_ref
 * @property {string} notes
 * @property {string} created_at
 */

/** @type {import('./$types').PageServerLoad} */
export const load = async ({ url }) => {
	const requested = Number(url.searchParams.get('page'));
	let page = Number.isInteger(requested) && requested > 0 ? requested : 1;

	if (!dbConfigured()) {
		return {
			configured: false,
			rows: /** @type {RtwSubmissionRow[]} */ ([]),
			page: 1,
			totalPages: 1,
			total: 0,
			pageSize: PAGE_SIZE,
			dbError: /** @type {string | null} */ (null)
		};
	}

	/** @type {RtwSubmissionRow[]} */
	let rows = [];
	let total = 0;
	/** @type {string | null} */
	let dbError = null;
	try {
		total = await dbCount('rtw_submissions');
		const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
		if (page > totalPages) page = totalPages;
		rows = await dbSelect(
			'rtw_submissions',
			`select=*&order=created_at.desc&limit=${PAGE_SIZE}&offset=${(page - 1) * PAGE_SIZE}`
		);
	} catch (e) {
		dbError = (e instanceof Error ? e.message : 'Unknown error').slice(0, 400);
	}

	return {
		configured: true,
		rows,
		page,
		totalPages: Math.max(1, Math.ceil(total / PAGE_SIZE)),
		total,
		pageSize: PAGE_SIZE,
		dbError
	};
};
