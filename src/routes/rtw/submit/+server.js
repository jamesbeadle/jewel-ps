import { json } from '@sveltejs/kit';
import { dbConfigured, dbInsert } from '$lib/server/db.js';

/**
 * Receives a completed RTW check from the tool at /rtw and stores it in
 * Supabase for /admin/rtw. The tool still offers copy-paste and print as
 * before — this runs alongside them, so a failed save never blocks a check.
 */

export const prerender = false;

const MAX_ENTRIES = 10;

/**
 * @param {unknown} v
 * @param {number} max
 */
function str(v, max) {
	return typeof v === 'string' ? v.trim().slice(0, max) : '';
}

/**
 * Accepts YYYY-MM-DD only; anything else becomes null.
 * @param {unknown} v
 */
function isoDate(v) {
	return typeof v === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(v.trim()) ? v.trim() : null;
}

/** @type {import('./$types').RequestHandler} */
export const POST = async ({ request }) => {
	if (!dbConfigured()) {
		return json({ error: 'Register log is not configured on the server.' }, { status: 503 });
	}

	/** @type {unknown} */
	let body;
	try {
		body = await request.json();
	} catch {
		return json({ error: 'Invalid request.' }, { status: 400 });
	}

	const entries = /** @type {{ entries?: unknown }} */ (body)?.entries;
	if (!Array.isArray(entries) || entries.length === 0 || entries.length > MAX_ENTRIES) {
		return json({ error: 'Invalid request.' }, { status: 400 });
	}

	const groupId = crypto.randomUUID();
	const rows = [];
	for (const e of entries) {
		const rec = /** @type {Record<string, unknown>} */ (e);
		const row = {
			group_id: groupId,
			entity: str(rec.entity, 20),
			full_name: str(rec.full_name, 200),
			trade: str(rec.trade, 200),
			engagement_type: str(rec.engagement_type, 100),
			start_date: isoDate(rec.start_date),
			check_method: str(rec.check_method, 100),
			document_seen: str(rec.document_seen, 300),
			check_date: isoDate(rec.check_date),
			checked_by: str(rec.checked_by, 200),
			outcome: str(rec.outcome, 50),
			permission_expiry: isoDate(rec.permission_expiry),
			followup_due: isoDate(rec.followup_due),
			evidence_ref: str(rec.evidence_ref, 300),
			notes: str(rec.notes, 1000)
		};
		if (!row.entity || !row.full_name || !row.engagement_type) {
			return json({ error: 'Invalid request.' }, { status: 400 });
		}
		rows.push(row);
	}

	try {
		for (const row of rows) await dbInsert('rtw_submissions', row);
	} catch {
		return json({ error: 'Could not save to the register log.' }, { status: 502 });
	}

	return json({ saved: rows.length });
};
