import { fail } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import { dbConfigured, dbInsert } from '$lib/server/db.js';

/**
 * Contact form handler. Each submission is delivered two ways, either of
 * which is enough for the visitor to see "success":
 *
 *  1. Stored in Supabase (`enquiries` table) so it appears in the admin
 *     inbox at /admin/enquiries — needs SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY.
 *  2. Posted as JSON to FORM_WEBHOOK_URL (e.g. an n8n Webhook node) for
 *     email notifications. Optional FORM_WEBHOOK_SECRET is sent as
 *     `x-jewel-secret` so the workflow can reject anything that didn't come
 *     from the site.
 *
 * With neither configured the form shows an "email us instead" fallback.
 */
export const actions = {
	default: async ({ request, fetch, getClientAddress }) => {
		const data = await request.formData();

		// Honeypot — bots fill this, humans never see it.
		if (data.get('company_website')) return { success: true };

		const values = {
			name: String(data.get('name') ?? '').trim().slice(0, 120),
			email: String(data.get('email') ?? '').trim().slice(0, 200),
			phone: String(data.get('phone') ?? '').trim().slice(0, 50),
			postcode: String(data.get('postcode') ?? '').trim().slice(0, 20),
			service: String(data.get('service') ?? '').trim().slice(0, 80),
			message: String(data.get('message') ?? '').trim().slice(0, 5000)
		};

		/** @type {Record<string, string>} */
		const errors = {};
		if (values.name.length < 2) errors.name = 'Please tell us your name.';
		if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) errors.email = 'Please enter a valid email address.';
		if (values.phone && values.phone.replace(/\D/g, '').length < 10) errors.phone = 'Please enter a valid phone number.';
		if (values.message.length < 10) errors.message = 'Please give us a few details about the job.';
		if (Object.keys(errors).length) return fail(400, { errors, values });

		const endpoint = env.FORM_WEBHOOK_URL;
		if (!endpoint && !dbConfigured()) {
			console.warn('[contact] Neither FORM_WEBHOOK_URL nor Supabase is set — form submission not delivered.');
			return fail(503, { unavailable: true, values });
		}

		let stored = false;
		let delivered = false;

		// 1. Admin inbox
		if (dbConfigured()) {
			try {
				await dbInsert('enquiries', { ...values, status: 'new' });
				stored = true;
			} catch (err) {
				console.error('[contact] Supabase insert failed:', err);
			}
		}

		// 2. Webhook (email notification)
		if (endpoint) {
			try {
				const res = await fetch(endpoint, {
					method: 'POST',
					headers: {
						'content-type': 'application/json',
						...(env.FORM_WEBHOOK_SECRET ? { 'x-jewel-secret': env.FORM_WEBHOOK_SECRET } : {})
					},
					body: JSON.stringify({
						source: 'jewelps.co.uk',
						submittedAt: new Date().toISOString(),
						ip: safeAddress(getClientAddress),
						userAgent: request.headers.get('user-agent') ?? '',
						...values
					})
				});
				if (!res.ok) throw new Error(`Webhook responded ${res.status}`);
				delivered = true;
			} catch (err) {
				console.error('[contact] webhook delivery failed:', err);
			}
		}

		if (!stored && !delivered) return fail(502, { failed: true, values });
		return { success: true };
	}
};

/** @param {() => string} fn */
function safeAddress(fn) {
	try {
		return fn();
	} catch {
		return '';
	}
}
