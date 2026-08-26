import { fail, redirect } from '@sveltejs/kit';
import {
	ADMIN_COOKIE,
	checkCredentials,
	createSessionToken,
	credentialsConfigured,
	setSessionCookie,
	verifySessionToken
} from '$lib/server/auth.js';

/** @type {import('./$types').PageServerLoad} */
export const load = async ({ cookies }) => {
	// Already signed in? Straight to the dashboard.
	if (await verifySessionToken(cookies.get(ADMIN_COOKIE))) redirect(303, '/admin');
	return { configured: credentialsConfigured() };
};

/** @type {import('./$types').Actions} */
export const actions = {
	default: async ({ request, cookies }) => {
		const form = await request.formData();
		const username = String(form.get('username') ?? '');
		const password = String(form.get('password') ?? '');

		if (!checkCredentials(username, password)) {
			return fail(401, { error: 'Incorrect username or password.' });
		}

		setSessionCookie(cookies, await createSessionToken());
		// Return 200 (not a redirect) so the Set-Cookie header rides on a normal
		// page response — the client then navigates to /admin itself.
		return { success: true };
	}
};
