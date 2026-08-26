import { fail, redirect } from '@sveltejs/kit';
import { dbConfigured } from '$lib/server/db.js';
import {
	createBrochure,
	deleteBrochure,
	duplicateBrochure,
	listBrochures,
	setActiveBrochure,
	setDraftBrochure
} from '$lib/server/brochures.js';

/** @type {import('./$types').PageServerLoad} */
export const load = async () => {
	if (!dbConfigured()) return { brochures: [], configured: false };
	try {
		return { brochures: await listBrochures(), configured: true };
	} catch (e) {
		// Most likely the new tables haven't been created yet.
		return {
			brochures: [],
			configured: true,
			setupError: e instanceof Error ? e.message : 'Could not load brochures.'
		};
	}
};

/** @type {import('./$types').Actions} */
export const actions = {
	create: async ({ request }) => {
		const form = await request.formData();
		const title = String(form.get('title') ?? '').trim() || 'Untitled brochure';
		const seed = String(form.get('seed') ?? 'template') === 'blank' ? 'blank' : 'template';
		const brochure = await createBrochure(title, seed);
		redirect(303, `/admin/brochure/${brochure.id}`);
	},

	duplicate: async ({ request }) => {
		const form = await request.formData();
		const copy = await duplicateBrochure(String(form.get('id') ?? ''));
		if (!copy) return fail(404, { error: 'Brochure not found' });
		redirect(303, `/admin/brochure/${copy.id}`);
	},

	activate: async ({ request }) => {
		const form = await request.formData();
		await setActiveBrochure(String(form.get('id') ?? ''));
	},

	deactivate: async ({ request }) => {
		const form = await request.formData();
		await setDraftBrochure(String(form.get('id') ?? ''));
	},

	delete: async ({ request }) => {
		const form = await request.formData();
		await deleteBrochure(String(form.get('id') ?? ''));
	}
};
