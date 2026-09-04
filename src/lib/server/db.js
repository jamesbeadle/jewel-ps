/**
 * Minimal Supabase client (PostgREST over fetch — no dependencies).
 * Server-side only: uses the service role key, which bypasses RLS, so this
 * module must never be imported from client code ($lib/server enforces that).
 *
 * Tables have RLS enabled with no policies, so the anon key can't read or
 * write anything — only this server code can.
 */
import { env } from '$env/dynamic/private';

/**
 * @typedef {Object} EnquiryRow
 * @property {string} id
 * @property {string} name
 * @property {string} email
 * @property {string} phone
 * @property {string} postcode
 * @property {string} service
 * @property {string} message
 * @property {'new' | 'read' | 'archived'} status
 * @property {string} created_at
 */

// Trimmed to survive stray whitespace/newlines from dashboard copy-paste;
// a trailing slash on the URL is also tolerated.
function baseUrl() {
	return (env.SUPABASE_URL ?? '').trim().replace(/\/+$/, '');
}

function serviceKey() {
	return (env.SUPABASE_SERVICE_ROLE_KEY ?? '').trim();
}

export function dbConfigured() {
	return Boolean(baseUrl() && serviceKey());
}

/** @param {Record<string, string>} [extra] */
function headers(extra = {}) {
	const key = serviceKey();
	return {
		apikey: key,
		Authorization: `Bearer ${key}`,
		...extra
	};
}

/** @param {string} path */
function restUrl(path) {
	return `${baseUrl()}/rest/v1/${path}`;
}

/**
 * @param {Response} res
 * @param {string} what
 */
async function check(res, what) {
	if (!res.ok) {
		const text = await res.text().catch(() => '');
		throw new Error(`Supabase ${what} failed (${res.status}): ${text.slice(0, 300)}`);
	}
	return res;
}

/**
 * @template T
 * @param {string} table
 * @param {string} [query] PostgREST query string, e.g. `select=*&order=created_at.desc`
 * @returns {Promise<T[]>}
 */
export async function dbSelect(table, query = '') {
	const res = await fetch(restUrl(`${table}?${query}`), { headers: headers() });
	await check(res, `select ${table}`);
	return res.json();
}

/**
 * Exact row count for a table (optionally filtered by a PostgREST query).
 * @param {string} table
 * @param {string} [query]
 */
export async function dbCount(table, query = '') {
	const qs = `${query ? query + '&' : ''}select=id&limit=1`;
	const res = await fetch(restUrl(`${table}?${qs}`), {
		method: 'HEAD',
		headers: headers({ Prefer: 'count=exact' })
	});
	await check(res, `count ${table}`);
	const total = Number((res.headers.get('content-range') ?? '').split('/')[1]);
	return Number.isFinite(total) ? total : 0;
}

/**
 * @template T
 * @param {string} table
 * @param {Record<string, unknown>} row
 * @returns {Promise<T>}
 */
export async function dbInsert(table, row) {
	const res = await fetch(restUrl(table), {
		method: 'POST',
		headers: headers({ 'Content-Type': 'application/json', Prefer: 'return=representation' }),
		body: JSON.stringify(row)
	});
	await check(res, `insert ${table}`);
	const rows = /** @type {T[]} */ (await res.json());
	return rows[0];
}

/**
 * @param {string} table
 * @param {string} id
 * @param {Record<string, unknown>} patch
 */
export async function dbUpdate(table, id, patch) {
	const res = await fetch(restUrl(`${table}?id=eq.${encodeURIComponent(id)}`), {
		method: 'PATCH',
		headers: headers({ 'Content-Type': 'application/json' }),
		body: JSON.stringify(patch)
	});
	await check(res, `update ${table}`);
}

/**
 * Update every row matching a PostgREST filter query (e.g. `status=eq.active`).
 * @param {string} table
 * @param {string} query
 * @param {Record<string, unknown>} patch
 */
export async function dbUpdateWhere(table, query, patch) {
	const res = await fetch(restUrl(`${table}?${query}`), {
		method: 'PATCH',
		headers: headers({ 'Content-Type': 'application/json' }),
		body: JSON.stringify(patch)
	});
	await check(res, `update ${table}`);
}

/**
 * @param {string} table
 * @param {string} id
 */
export async function dbDelete(table, id) {
	const res = await fetch(restUrl(`${table}?id=eq.${encodeURIComponent(id)}`), {
		method: 'DELETE',
		headers: headers()
	});
	await check(res, `delete ${table}`);
}

/**
 * Delete every row matching a PostgREST filter query (e.g. `status=eq.archived`).
 * The filter is mandatory — an empty one would delete the whole table.
 * @param {string} table
 * @param {string} query
 */
export async function dbDeleteWhere(table, query) {
	if (!query.trim()) throw new Error(`dbDeleteWhere(${table}): refusing to delete without a filter`);
	const res = await fetch(restUrl(`${table}?${query}`), {
		method: 'DELETE',
		headers: headers()
	});
	await check(res, `delete ${table}`);
}

/* ---- Supabase Storage (public 'media' bucket) ------------------------- */

/**
 * Create a short-lived signed upload URL for the public 'media' bucket so the
 * browser can upload straight to Supabase Storage. This sidesteps Vercel's
 * ~4.5 MB request-body cap, so full-resolution photos survive intact.
 * Returns the absolute PUT URL and the public URL the file will have.
 * @param {string} filename
 * @param {string} folder
 * @returns {Promise<{ uploadUrl: string, publicUrl: string, path: string }>}
 */
export async function storageSignedUpload(filename, folder) {
	const ext = (filename.split('.').pop() || 'jpg').toLowerCase().replace(/[^a-z0-9]/g, '');
	const path = `${folder}/${crypto.randomUUID()}.${ext}`;
	const res = await fetch(`${baseUrl()}/storage/v1/object/upload/sign/media/${path}`, {
		method: 'POST',
		headers: headers({ 'Content-Type': 'application/json' }),
		body: JSON.stringify({})
	});
	await check(res, 'storage sign upload');
	const json = /** @type {{ url: string }} */ (await res.json());
	return {
		uploadUrl: `${baseUrl()}/storage/v1${json.url}`,
		publicUrl: `${baseUrl()}/storage/v1/object/public/media/${path}`,
		path
	};
}

/**
 * List uploaded files in a folder of the 'media' bucket (newest first).
 * @param {string} folder
 * @param {number} [limit]
 * @returns {Promise<{ name: string, publicUrl: string }[]>}
 */
export async function storageList(folder, limit = 200) {
	const res = await fetch(`${baseUrl()}/storage/v1/object/list/media`, {
		method: 'POST',
		headers: headers({ 'Content-Type': 'application/json' }),
		body: JSON.stringify({
			prefix: folder,
			limit,
			sortBy: { column: 'created_at', order: 'desc' }
		})
	});
	await check(res, 'storage list');
	const rows = /** @type {{ name: string, id: string | null }[]} */ (await res.json());
	return rows
		.filter((r) => r.id !== null) // folders come back with a null id
		.map((r) => ({
			name: r.name,
			publicUrl: `${baseUrl()}/storage/v1/object/public/media/${folder}/${r.name}`
		}));
}

/**
 * Delete a file from the 'media' bucket by its path (e.g. `uploads/xyz.jpg`).
 * @param {string} path
 */
export async function storageDelete(path) {
	const res = await fetch(`${baseUrl()}/storage/v1/object/media/${path}`, {
		method: 'DELETE',
		headers: headers()
	});
	await check(res, 'storage delete');
}
