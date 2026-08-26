/**
 * Admin PDF download — works for drafts too. The admin session guards this
 * route (hooks.server.js); a short-lived print token lets the headless
 * browser open the draft's print page without a cookie.
 */
import { error } from '@sveltejs/kit';
import { createPrintToken } from '$lib/server/auth.js';
import { getBrochure } from '$lib/server/brochures.js';
import { pdfFilename, renderBrochurePdf } from '$lib/server/pdf.js';

export const prerender = false;

// Vercel: PDF rendering needs more than the default 10s.
export const config = { maxDuration: 60 };

/** @type {import('./$types').RequestHandler} */
export const GET = async ({ params, url }) => {
	const doc = await getBrochure(params.id);
	if (!doc) error(404, 'Brochure not found');

	const token = await createPrintToken(params.id);
	try {
		const pdf = await renderBrochurePdf(
			`${url.origin}/brochure/print/${params.id}?token=${encodeURIComponent(token)}`
		);
		return new Response(new Uint8Array(pdf), {
			headers: {
				'Content-Type': 'application/pdf',
				'Content-Disposition': `attachment; filename="${pdfFilename(doc.brochure.title)}"`
			}
		});
	} catch (e) {
		console.error('Brochure PDF generation failed:', e);
		error(500, 'PDF generation failed — please try again.');
	}
};
