/**
 * Public PDF of the active brochure — the "Download PDF" button.
 */
import { error } from '@sveltejs/kit';
import { getActiveBrochure } from '$lib/server/brochures.js';
import { pdfFilename, renderBrochurePdf } from '$lib/server/pdf.js';

export const prerender = false;

// Vercel: PDF rendering needs more than the default 10s.
export const config = { maxDuration: 60 };

/** @type {import('./$types').RequestHandler} */
export const GET = async ({ url }) => {
	const active = await getActiveBrochure();
	const id = active?.brochure.id ?? 'default';
	const title = active?.brochure.title ?? 'Jewel Property Serve — Brochure';

	try {
		const pdf = await renderBrochurePdf(`${url.origin}/brochure/print/${id}`);
		return new Response(new Uint8Array(pdf), {
			headers: {
				'Content-Type': 'application/pdf',
				'Content-Disposition': `attachment; filename="${pdfFilename(title)}"`,
				'Cache-Control': 'public, max-age=300'
			}
		});
	} catch (e) {
		console.error('Brochure PDF generation failed:', e);
		error(500, 'PDF generation failed — please try again.');
	}
};
