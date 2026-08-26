import { fail } from '@sveltejs/kit';
import { dbConfigured, storageDelete, storageList } from '$lib/server/db.js';
import { MEDIA_FOLDER } from '$lib/server/brochures.js';
import { photoGroups } from '$lib/data/photos.js';

/** @type {import('./$types').PageServerLoad} */
export const load = async () => {
	if (!dbConfigured()) {
		return { configured: false, uploads: [], groups: photoGroups, dbError: null };
	}
	try {
		const uploads = await storageList(MEDIA_FOLDER, 500);
		return { configured: true, uploads, groups: photoGroups, dbError: null };
	} catch (e) {
		return {
			configured: true,
			uploads: [],
			groups: photoGroups,
			dbError: (e instanceof Error ? e.message : 'Unknown error').slice(0, 400)
		};
	}
};

/** @type {import('./$types').Actions} */
export const actions = {
	delete: async ({ request }) => {
		const form = await request.formData();
		const name = String(form.get('name') ?? '');
		if (!name || name.includes('/') || name.includes('..')) {
			return fail(400, { error: 'Invalid file name.' });
		}
		try {
			await storageDelete(`${MEDIA_FOLDER}/${name}`);
		} catch (e) {
			return fail(502, {
				error: `Could not delete the file: ${e instanceof Error ? e.message : 'unknown'}`
			});
		}
		return { ok: true };
	}
};
