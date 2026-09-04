import { fail, redirect } from '@sveltejs/kit';
import {
	ADMIN_COOKIE,
	checkCredentials,
	createSessionToken,
	credentialsConfigured,
	setSessionCookie,
	verifySessionToken
} from '$lib/server/auth.js';
import { MAX_FAILURES, loginLockState, recordLoginAttempt } from '$lib/server/login-attempts.js';

/** Pause after a wrong guess — makes online brute force slow and cheap for us. */
const FAILED_LOGIN_DELAY_MS = 1000;

/** @type {import('./$types').PageServerLoad} */
export const load = async ({ cookies }) => {
	// Already signed in? Straight to the dashboard. (hooks.server.js does the
	// same for GET requests before we get here; this also covers the no-JS
	// form post, where SvelteKit re-runs load after the action.)
	if (await verifySessionToken(cookies.get(ADMIN_COOKIE))) redirect(303, '/admin');
	return { configured: credentialsConfigured() };
};

/** @type {import('./$types').Actions} */
export const actions = {
	default: async ({ request, cookies, getClientAddress }) => {
		const form = await request.formData();
		const username = String(form.get('username') ?? '').slice(0, 200);
		const password = String(form.get('password') ?? '').slice(0, 1000);

		// On Vercel this is the x-forwarded-for header, which Vercel sets itself
		// (clients can't spoof it). Keep only the first hop, in case a proxy
		// ever appends to it, and never fail the login over a missing value.
		let ip = 'unknown';
		try {
			ip = (getClientAddress() ?? '').split(',')[0].trim() || 'unknown';
		} catch {
			// Not available in every runtime; the limit then applies to 'unknown' as a group.
		}

		const lock = await loginLockState(ip);
		if (lock.locked) {
			console.warn(`Admin login refused for ${ip}: locked out after ${MAX_FAILURES} failed attempts`);
			return fail(429, {
				error: `Too many failed attempts. Please try again in ${lock.retryAfterMinutes} minute${lock.retryAfterMinutes === 1 ? '' : 's'}.`
			});
		}

		const ok = await checkCredentials(username, password);
		await recordLoginAttempt(ip, username, ok);

		if (!ok) {
			console.warn(`Admin login failed for ${ip}`);
			await new Promise((r) => setTimeout(r, FAILED_LOGIN_DELAY_MS));
			return fail(401, { error: 'Incorrect username or password.' });
		}

		setSessionCookie(cookies, await createSessionToken());
		// Return 200 (not a redirect) so the Set-Cookie header rides on a normal
		// page response — the client then navigates to /admin itself.
		return { success: true };
	}
};
