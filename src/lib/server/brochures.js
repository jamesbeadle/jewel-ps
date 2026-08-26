/**
 * Brochure data access — CRUD over the `brochures` and `brochure_pages`
 * tables, plus helpers used by the admin builder (duplicating, reordering,
 * the media library). Same approach as the jewelbb.co.uk brochure builder.
 */
import {
	dbConfigured,
	dbDelete,
	dbInsert,
	dbSelect,
	dbUpdate,
	dbUpdateWhere,
	storageList
} from '$lib/server/db.js';
import { templateMap } from '$lib/brochure/templates.js';
import { defaultBrochurePages } from '$lib/brochure/defaults.js';
import { photoGroups } from '$lib/data/photos.js';
import { site } from '$lib/site.js';

/**
 * @typedef {Object} BrochureRow
 * @property {string} id
 * @property {string} title
 * @property {'draft' | 'active'} status
 * @property {string} created_at
 * @property {string} updated_at
 *
 * @typedef {Object} BrochurePageRow
 * @property {string} id
 * @property {string} brochure_id
 * @property {string} template
 * @property {Record<string, unknown>} content
 * @property {number} sort_order
 * @property {string} created_at
 *
 * @typedef {{ brochure: BrochureRow, pages: BrochurePageRow[] }} BrochureDoc
 */

/** The storage folder all admin uploads go to. */
export const MEDIA_FOLDER = 'uploads';

/* ---- Reads ---------------------------------------------------------- */

/** @returns {Promise<(BrochureRow & { page_count: number })[]>} */
export async function listBrochures() {
	const [brochures, pages] = await Promise.all([
		dbSelect('brochures', 'select=*&order=updated_at.desc'),
		dbSelect('brochure_pages', 'select=brochure_id')
	]);
	/** @type {Map<string, number>} */
	const counts = new Map();
	for (const p of /** @type {{ brochure_id: string }[]} */ (pages)) {
		counts.set(p.brochure_id, (counts.get(p.brochure_id) ?? 0) + 1);
	}
	return /** @type {BrochureRow[]} */ (brochures).map((b) => ({
		...b,
		page_count: counts.get(b.id) ?? 0
	}));
}

/**
 * @param {string} id
 * @returns {Promise<BrochureDoc | null>}
 */
export async function getBrochure(id) {
	const rows = /** @type {BrochureRow[]} */ (
		await dbSelect('brochures', `select=*&id=eq.${encodeURIComponent(id)}`)
	);
	if (!rows[0]) return null;
	const pages = /** @type {BrochurePageRow[]} */ (
		await dbSelect(
			'brochure_pages',
			`select=*&brochure_id=eq.${encodeURIComponent(id)}&order=sort_order.asc,created_at.asc`
		)
	);
	return { brochure: rows[0], pages };
}

/**
 * The brochure shown to the public. Falls back to the built-in default.
 * @returns {Promise<BrochureDoc | null>}
 */
export async function getActiveBrochure() {
	if (!dbConfigured()) return null;
	try {
		const rows = /** @type {BrochureRow[]} */ (
			await dbSelect('brochures', 'select=*&status=eq.active&limit=1')
		);
		if (!rows[0]) return null;
		const pages = /** @type {BrochurePageRow[]} */ (
			await dbSelect(
				'brochure_pages',
				`select=*&brochure_id=eq.${encodeURIComponent(rows[0].id)}&order=sort_order.asc,created_at.asc`
			)
		);
		return { brochure: rows[0], pages };
	} catch {
		return null;
	}
}

/**
 * Built-in default rendered when nothing is active yet.
 * @returns {BrochureDoc}
 */
export function fallbackBrochure() {
	const now = new Date().toISOString();
	return {
		brochure: {
			id: 'default',
			title: `${site.name} — Brochure`,
			status: 'active',
			created_at: now,
			updated_at: now
		},
		pages: defaultBrochurePages().map((p, i) => ({
			id: `default-${i}`,
			brochure_id: 'default',
			template: p.template,
			content: p.content,
			sort_order: (i + 1) * 10,
			created_at: now
		}))
	};
}

/* ---- Writes --------------------------------------------------------- */

/**
 * @param {string} title
 * @param {'blank' | 'template'} seed
 * @returns {Promise<BrochureRow>}
 */
export async function createBrochure(title, seed) {
	const brochure = /** @type {BrochureRow} */ (
		await dbInsert('brochures', { title, status: 'draft' })
	);
	if (seed === 'template') {
		const pages = defaultBrochurePages();
		for (let i = 0; i < pages.length; i++) {
			await dbInsert('brochure_pages', {
				brochure_id: brochure.id,
				template: pages[i].template,
				content: pages[i].content,
				sort_order: (i + 1) * 10
			});
		}
	}
	return brochure;
}

/**
 * @param {string} id
 * @returns {Promise<BrochureRow | null>}
 */
export async function duplicateBrochure(id) {
	const doc = await getBrochure(id);
	if (!doc) return null;
	const copy = /** @type {BrochureRow} */ (
		await dbInsert('brochures', { title: `${doc.brochure.title} (copy)`, status: 'draft' })
	);
	for (const p of doc.pages) {
		await dbInsert('brochure_pages', {
			brochure_id: copy.id,
			template: p.template,
			content: p.content,
			sort_order: p.sort_order
		});
	}
	return copy;
}

/** @param {string} id */
export async function touchBrochure(id) {
	await dbUpdate('brochures', id, { updated_at: new Date().toISOString() });
}

/**
 * Make this brochure the live one (demotes any other active brochure).
 * @param {string} id
 */
export async function setActiveBrochure(id) {
	await dbUpdateWhere('brochures', 'status=eq.active', { status: 'draft' });
	await dbUpdate('brochures', id, { status: 'active', updated_at: new Date().toISOString() });
}

/** @param {string} id */
export async function setDraftBrochure(id) {
	await dbUpdate('brochures', id, { status: 'draft', updated_at: new Date().toISOString() });
}

/** @param {string} id */
export async function deleteBrochure(id) {
	await dbDelete('brochures', id); // pages cascade
}

/* ---- Pages ----------------------------------------------------------- */

/** @param {BrochurePageRow[]} pages */
function nextSortOrder(pages) {
	return pages.length ? Math.max(...pages.map((p) => p.sort_order)) + 10 : 10;
}

/**
 * @param {string} brochureId
 * @param {import('$lib/brochure/templates.js').TemplateId} template
 * @param {Record<string, unknown>} [content]
 * @returns {Promise<BrochurePageRow>}
 */
export async function addPage(brochureId, template, content) {
	const doc = await getBrochure(brochureId);
	const t = templateMap[template];
	const page = /** @type {BrochurePageRow} */ (
		await dbInsert('brochure_pages', {
			brochure_id: brochureId,
			template,
			content: content ?? t?.blank ?? {},
			sort_order: doc ? nextSortOrder(doc.pages) : 10
		})
	);
	await touchBrochure(brochureId);
	return page;
}

/**
 * Add the classic three-page case-study spread (opener → detail → gallery).
 * @param {string} brochureId
 */
export async function addProjectPages(brochureId) {
	await addPage(brochureId, 'project-intro');
	await addPage(brochureId, 'project-detail');
	await addPage(brochureId, 'project-gallery');
}

/**
 * @param {string} brochureId
 * @param {string} pageId
 * @param {Record<string, unknown>} content
 */
export async function updatePage(brochureId, pageId, content) {
	await dbUpdate('brochure_pages', pageId, { content });
	await touchBrochure(brochureId);
}

/**
 * @param {string} brochureId
 * @param {string} pageId
 */
export async function deletePage(brochureId, pageId) {
	await dbDelete('brochure_pages', pageId);
	await touchBrochure(brochureId);
}

/**
 * @param {string} brochureId
 * @param {string} pageId
 */
export async function duplicatePage(brochureId, pageId) {
	const doc = await getBrochure(brochureId);
	const page = doc?.pages.find((p) => p.id === pageId);
	if (!doc || !page) return;
	await dbInsert('brochure_pages', {
		brochure_id: brochureId,
		template: page.template,
		content: page.content,
		sort_order: page.sort_order + 1
	});
	await touchBrochure(brochureId);
}

/**
 * Move a page one step up or down by swapping sort orders.
 * @param {string} brochureId
 * @param {string} pageId
 * @param {'up' | 'down'} direction
 */
export async function movePage(brochureId, pageId, direction) {
	const doc = await getBrochure(brochureId);
	if (!doc) return;
	const idx = doc.pages.findIndex((p) => p.id === pageId);
	const swapWith = direction === 'up' ? idx - 1 : idx + 1;
	if (idx === -1 || swapWith < 0 || swapWith >= doc.pages.length) return;
	// Renumber the whole list so swaps stay stable even with duplicate orders.
	const order = doc.pages.map((p) => p.id);
	[order[idx], order[swapWith]] = [order[swapWith], order[idx]];
	for (let i = 0; i < order.length; i++) {
		await dbUpdate('brochure_pages', order[i], { sort_order: (i + 1) * 10 });
	}
	await touchBrochure(brochureId);
}

/* ---- Media library --------------------------------------------------- */

/** @typedef {{ label: string, images: string[] }} MediaGroup */

/**
 * Every image the site already ships with, grouped for the picker.
 * @returns {MediaGroup[]}
 */
export function siteImageLibrary() {
	return photoGroups;
}

/**
 * Photos previously uploaded through the admin (media page or image picker).
 * @returns {Promise<string[]>}
 */
export async function uploadedImageLibrary() {
	if (!dbConfigured()) return [];
	try {
		const files = await storageList(MEDIA_FOLDER);
		return files.map((f) => f.publicUrl);
	} catch {
		return [];
	}
}
