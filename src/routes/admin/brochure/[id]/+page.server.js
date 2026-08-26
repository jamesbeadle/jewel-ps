import { error, redirect } from '@sveltejs/kit';
import {
	addPage,
	addProjectPages,
	deleteBrochure,
	deletePage,
	duplicatePage,
	getBrochure,
	movePage,
	setActiveBrochure,
	setDraftBrochure
} from '$lib/server/brochures.js';
import { dbUpdate } from '$lib/server/db.js';

/** @type {import('./$types').PageServerLoad} */
export const load = async ({ params }) => {
	const doc = await getBrochure(params.id);
	if (!doc) error(404, 'Brochure not found');
	return { doc };
};

/** @type {import('./$types').Actions} */
export const actions = {
	rename: async ({ params, request }) => {
		const form = await request.formData();
		const title = String(form.get('title') ?? '').trim();
		if (title) {
			await dbUpdate('brochures', params.id, { title, updated_at: new Date().toISOString() });
		}
		return { saved: true };
	},

	activate: async ({ params }) => {
		await setActiveBrochure(params.id);
	},

	deactivate: async ({ params }) => {
		await setDraftBrochure(params.id);
	},

	delete: async ({ params }) => {
		await deleteBrochure(params.id);
		redirect(303, '/admin/brochure');
	},

	addPage: async ({ params, request }) => {
		const form = await request.formData();
		const template = /** @type {import('$lib/brochure/templates.js').TemplateId} */ (
			String(form.get('template') ?? 'freeform')
		);
		const page = await addPage(params.id, template);
		redirect(303, `/admin/brochure/${params.id}/page/${page.id}`);
	},

	addProject: async ({ params }) => {
		await addProjectPages(params.id);
	},

	movePage: async ({ params, request }) => {
		const form = await request.formData();
		await movePage(
			params.id,
			String(form.get('page_id') ?? ''),
			String(form.get('direction')) === 'up' ? 'up' : 'down'
		);
	},

	duplicatePage: async ({ params, request }) => {
		const form = await request.formData();
		await duplicatePage(params.id, String(form.get('page_id') ?? ''));
	},

	deletePage: async ({ params, request }) => {
		const form = await request.formData();
		await deletePage(params.id, String(form.get('page_id') ?? ''));
	}
};
