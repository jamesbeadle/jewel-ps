/**
 * Tiny signed-cookie session for the admin area. No dependencies —
 * HMAC-SHA256 via Web Crypto (available in Node 18+ and on Vercel).
 *
 * Same approach as the jewelbb.co.uk admin: one shared login
 * (ADMIN_USERNAME / ADMIN_PASSWORD), an httpOnly cookie that carries an
 * expiry timestamp plus a signature, verified on every /admin request.
 */
import { dev } from '$app/environment';
import { env } from '$env/dynamic/private';

export const ADMIN_COOKIE = 'jps_admin';
const SESSION_HOURS = 8;

const enc = new TextEncoder();

/** @param {ArrayBuffer | Uint8Array} bytes */
function b64url(bytes) {
	const arr = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes);
	let s = '';
	for (const b of arr) s += String.fromCharCode(b);
	return btoa(s).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

/**
 * @param {string} payload
 * @param {string} secret
 */
async function hmac(payload, secret) {
	const key = await crypto.subtle.importKey(
		'raw',
		enc.encode(secret),
		{ name: 'HMAC', hash: 'SHA-256' },
		false,
		['sign']
	);
	const sig = await crypto.subtle.sign('HMAC', key, enc.encode(payload));
	return b64url(sig);
}

// Env values are trimmed to survive stray whitespace/newlines from
// copy-pasting into dashboard fields.
/** @param {string | undefined} v */
function envTrim(v) {
	return (v ?? '').trim();
}

function secret() {
	// Fall back to the admin password so the site works with minimal config;
	// set ADMIN_SESSION_SECRET for stricter separation.
	return envTrim(env.ADMIN_SESSION_SECRET) || envTrim(env.ADMIN_PASSWORD);
}

export function credentialsConfigured() {
	return Boolean(envTrim(env.ADMIN_USERNAME) && envTrim(env.ADMIN_PASSWORD));
}

/**
 * Constant-time string comparison so response timing doesn't leak how many
 * leading characters of the password were right.
 * @param {string} a
 * @param {string} b
 */
function safeEqual(a, b) {
	const x = enc.encode(a);
	const y = enc.encode(b);
	let diff = x.length ^ y.length;
	for (let i = 0; i < Math.max(x.length, y.length); i++) {
		diff |= (x[i] ?? 0) ^ (y[i] ?? 0);
	}
	return diff === 0;
}

/**
 * @param {string} username
 * @param {string} password
 */
export function checkCredentials(username, password) {
	if (!credentialsConfigured()) return false;
	const userOk = safeEqual(username.trim(), envTrim(env.ADMIN_USERNAME));
	const passOk = safeEqual(password, envTrim(env.ADMIN_PASSWORD));
	return userOk && passOk;
}

export async function createSessionToken() {
	const payload = String(Date.now() + SESSION_HOURS * 3600_000);
	return `${payload}.${await hmac(payload, secret())}`;
}

/** @param {string | undefined} token */
export async function verifySessionToken(token) {
	if (!token || !secret()) return false;
	const [payload, sig] = token.split('.');
	if (!payload || !sig) return false;
	if (Number(payload) < Date.now()) return false;
	return safeEqual(await hmac(payload, secret()), sig);
}

/**
 * @param {import('@sveltejs/kit').Cookies} cookies
 * @param {string} token
 */
export function setSessionCookie(cookies, token) {
	cookies.set(ADMIN_COOKIE, token, {
		path: '/',
		httpOnly: true,
		sameSite: 'lax',
		secure: !dev, // Safari drops Secure cookies on http://localhost
		maxAge: SESSION_HOURS * 3600
	});
}

/** @param {import('@sveltejs/kit').Cookies} cookies */
export function clearSessionCookie(cookies) {
	cookies.delete(ADMIN_COOKIE, { path: '/' });
}
