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
