import { fail } from '@sveltejs/kit';
import { dbConfigured, dbCount, dbDelete, dbSelect, dbUpdate } from '$lib/server/db.js';

const PAGE_SIZE = 20;

/** @type {import('./$types').PageServerLoad} */
export const load = async ({ url }) => {
	const view = url.searchParams.get('view') === 'archived' ? 'archived' : 'inbox';
	const requested = Number(url.searchParams.get('page'));
	let page = Number.isInteger(requested) && requested > 0 ? requested : 1;

	/** @type {import('$lib/server/db.js').EnquiryRow[]} */
	let rows = [];
	let total = 0;
	let newCount = 0;
	let archivedCount = 0;
	/** @type {string | null} */
	let dbError = null;

	if (dbConfigured()) {
		try {
			const filter = view === 'archived' ? 'status=eq.archived' : 'status=neq.archived';
			[total, newCount, archivedCount] = await Promise.all([
				dbCount('enquiries', filter),
				dbCount('enquiries', 'status=eq.new'),
				dbCount('enquiries', 'status=eq.archived')
			]);
			const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
			if (page > totalPages) page = totalPages;
			rows = await dbSelect(
				'enquiries',
				`select=*&${filter}&order=created_at.desc&limit=${PAGE_SIZE}&offset=${(page - 1) * PAGE_SIZE}`
			);
		} catch (e) {
			dbError = (e instanceof Error ? e.message : 'Unknown error').slice(0, 400);
		}
	}

	return {
		configured: dbConfigured(),
		view,
		rows,
		page,
		totalPages: Math.max(1, Math.ceil(total / PAGE_SIZE)),
		total,
		newCount,
		archivedCount,
		dbError
	};
};

/** @param {FormData} data */
function id(data) {
	const v = data.get('id');
	return typeof v === 'string' && v ? v : null;
}

/**
 * Every action takes an `id` field and returns `{ ok: true }`; the page
 * re-runs `load` afterwards via use:enhance so the list stays fresh.
 * @type {import('./$types').Actions}
 */
export const actions = {
	markRead: async ({ request }) => {
		const enquiryId = id(await request.formData());
		if (!enquiryId) return fail(400, { error: 'Missing enquiry id.' });
		await dbUpdate('enquiries', enquiryId, { status: 'read' });
		return { ok: true };
	},
	markUnread: async ({ request }) => {
		const enquiryId = id(await request.formData());
		if (!enquiryId) return fail(400, { error: 'Missing enquiry id.' });
		await dbUpdate('enquiries', enquiryId, { status: 'new' });
		return { ok: true };
	},
	archive: async ({ request }) => {
		const enquiryId = id(await request.formData());
		if (!enquiryId) return fail(400, { error: 'Missing enquiry id.' });
		await dbUpdate('enquiries', enquiryId, { status: 'archived' });
		return { ok: true };
	},
	restore: async ({ request }) => {
		const enquiryId = id(await request.formData());
		if (!enquiryId) return fail(400, { error: 'Missing enquiry id.' });
		await dbUpdate('enquiries', enquiryId, { status: 'read' });
		return { ok: true };
	},
	remove: async ({ request }) => {
		const enquiryId = id(await request.formData());
		if (!enquiryId) return fail(400, { error: 'Missing enquiry id.' });
		await dbDelete('enquiries', enquiryId);
		return { ok: true };
	}
};
