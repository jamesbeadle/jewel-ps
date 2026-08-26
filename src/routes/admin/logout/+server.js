import { redirect } from '@sveltejs/kit';
import { clearSessionCookie } from '$lib/server/auth.js';

export const prerender = false;

/** @type {import('./$types').RequestHandler} */
export const POST = ({ cookies }) => {
	clearSessionCookie(cookies);
	redirect(303, '/admin/login');
};
