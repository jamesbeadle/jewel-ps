/**
 * Brute-force protection for /admin/login.
 *
 * Every attempt is written to Supabase (public.admin_login_attempts —
 * created by supabase/2026-09-04-security-hardening.sql). Before a
 * password is even checked, the server counts that IP's recent
 * failures; once MAX_FAILURES have happened inside WINDOW_MINUTES the
 * IP is refused until the oldest of them ages out of the window.
 * Keeping the log in the database (rather than in memory) means the
 * limit holds across Vercel's serverless instances and redeploys.
 *
 * Fails soft on purpose: if Supabase is unreachable or the table has
 * not been created yet, the problem is logged and login still works —
 * the password stays the primary control and the admin is never locked
 * out by an outage. Only the IP, the username tried and the outcome are
 * stored; passwords never are.
 */
import { dbConfigured, dbDeleteWhere, dbInsert, dbSelect } from './db.js';

const TABLE = 'admin_login_attempts';

/** Failed attempts allowed per IP inside the window before lock-out. */
export const MAX_FAILURES = 5;
/** Sliding window, in minutes. */
export const WINDOW_MINUTES = 15;
/** Successful logins prune attempts older than this. */
const RETENTION_DAYS = 30;

/**
 * @typedef {Object} LockState
 * @property {boolean} locked
 * @property {number} retryAfterMinutes Minutes until another attempt will be accepted (0 when not locked).
 */

/**
 * @typedef {Object} AttemptRow
 * @property {string} attempted_at
 */

/**
 * True when the table is missing — i.e. the migration hasn't been run yet.
 * @param {unknown} e
 */
function tableMissing(e) {
	return e instanceof Error && /\(404\)|PGRST205|does not exist/.test(e.message);
}

/**
 * @param {string} what
 * @param {unknown} e
 */
function logFailure(what, e) {
	if (tableMissing(e)) {
		console.error(
			`Admin login rate limiting is inactive: the ${TABLE} table is missing. ` +
				'Run supabase/2026-09-04-security-hardening.sql in the Supabase SQL editor.'
		);
	} else {
		console.error(`Admin login rate limiting: ${what} failed —`, e);
	}
}

/**
 * Is this IP currently locked out? Never throws.
 * @param {string} ip
 * @returns {Promise<LockState>}
 */
export async function loginLockState(ip) {
	/** @type {LockState} */
	const open = { locked: false, retryAfterMinutes: 0 };
	if (!dbConfigured()) return open;
	try {
		const since = new Date(Date.now() - WINDOW_MINUTES * 60_000).toISOString();
		/** @type {AttemptRow[]} */
		const failures = await dbSelect(
			TABLE,
			`select=attempted_at&ip=eq.${encodeURIComponent(ip)}&success=eq.false` +
				`&attempted_at=gte.${encodeURIComponent(since)}&order=attempted_at.asc&limit=100`
		);
		if (failures.length < MAX_FAILURES) return open;

		// The lock lifts when enough failures have aged out of the window
		// for the count to drop below the limit again.
		const pivot = failures[failures.length - MAX_FAILURES];
		const unlockAt = new Date(pivot.attempted_at).getTime() + WINDOW_MINUTES * 60_000;
		const minutes = Math.max(1, Math.ceil((unlockAt - Date.now()) / 60_000));
		return { locked: true, retryAfterMinutes: minutes };
	} catch (e) {
		logFailure('lock check', e);
		return open;
	}
}

/**
 * Record the outcome of an attempt. Never throws.
 * @param {string} ip
 * @param {string} username
 * @param {boolean} success
 */
export async function recordLoginAttempt(ip, username, success) {
	if (!dbConfigured()) return;
	try {
		await dbInsert(TABLE, { ip: ip.slice(0, 100), username: username.slice(0, 100), success });
		if (success) {
			// Housekeeping rides on successful logins only, so attackers can't
			// make the server do extra work.
			const cutoff = new Date(Date.now() - RETENTION_DAYS * 86_400_000).toISOString();
			await dbDeleteWhere(TABLE, `attempted_at=lt.${encodeURIComponent(cutoff)}`);
		}
	} catch (e) {
		logFailure('recording an attempt', e);
	}
}
