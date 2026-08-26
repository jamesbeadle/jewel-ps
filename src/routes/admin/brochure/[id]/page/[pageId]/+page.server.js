import { error, fail, redirect } from '@sveltejs/kit';
import { dbConfigured } from '$lib/server/db.js';
import {
	getBrochure,
	siteImageLibrary,
	updatePage,
	uploadedImageLibrary,
	deletePage
} from '$lib/server/brochures.js';
import { templateMap } from '$lib/brochure/templates.js';

/** @type {import('./$types').PageServerLoad} */
export const load = async ({ params }) => {
	const doc = await getBrochure(params.id);
	if (!doc) error(404, 'Brochure not found');
	const page = doc.pages.find((p) => p.id === params.pageId);
	if (!page) error(404, 'Page not found');
	const template = templateMap[page.template];
	if (!template) error(500, `Unknown template: ${page.template}`);

	const index = doc.pages.findIndex((p) => p.id === page.id);
	const uploaded = await uploadedImageLibrary();

	return {
		brochure: doc.brochure,
		page,
		pageNumber: index + 1,
		pageCount: doc.pages.length,
		prevId: doc.pages[index - 1]?.id ?? null,
		nextId: doc.pages[index + 1]?.id ?? null,
		template,
		siteImages: siteImageLibrary(),
		uploaded,
		canUpload: dbConfigured()
	};
};

/** @type {import('./$types').Actions} */
export const actions = {
	save: async ({ params, request }) => {
		const form = await request.formData();
		/** @type {Record<string, unknown>} */
		let content;
		try {
			content = JSON.parse(String(form.get('content') ?? '{}'));
			if (typeof content !== 'object' || content === null || Array.isArray(content)) {
				throw new Error('not an object');
			}
		} catch {
			return fail(400, { error: 'Could not read the page content — please try again.' });
		}
		await updatePage(params.id, params.pageId, content);
		return { saved: true };
	},

	delete: async ({ params }) => {
		await deletePage(params.id, params.pageId);
		redirect(303, `/admin/brochure/${params.id}`);
	}
};
