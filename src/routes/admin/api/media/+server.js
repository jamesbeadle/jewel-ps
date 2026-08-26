/**
 * Media upload support for the admin (media library + brochure builder).
 *
 * POST { filename } → { uploadUrl, publicUrl }
 *
 * The browser then PUTs the file straight to Supabase Storage using the
 * signed URL, which sidesteps Vercel's ~4.5 MB body limit — photos are
 * stored at full resolution, no recompression anywhere.
 * (This route sits under /admin, so the session guard already protects it.)
 */
import { error, json } from '@sveltejs/kit';
import { dbConfigured, storageSignedUpload } from '$lib/server/db.js';
import { MEDIA_FOLDER } from '$lib/server/brochures.js';

export const prerender = false;

/** @type {import('./$types').RequestHandler} */
export const POST = async ({ request }) => {
	if (!dbConfigured()) error(503, 'Supabase is not connected');
	const body = /** @type {{ filename?: string }} */ (await request.json().catch(() => ({})));
	const filename = String(body.filename ?? 'photo.jpg');
	try {
		const signed = await storageSignedUpload(filename, MEDIA_FOLDER);
		return json(signed);
	} catch (e) {
		error(502, `Could not create an upload URL: ${e instanceof Error ? e.message : 'unknown'}`);
	}
};
