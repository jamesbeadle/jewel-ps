import { fail } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';

/**
 * Contact form handler.
 * Set FORM_WEBHOOK_URL (e.g. an n8n Webhook node URL, Make/Zapier hook, or Formspree endpoint)
 * in .env / Vercel project settings. Optional FORM_WEBHOOK_SECRET is sent as `x-jewel-secret`
 * so the workflow can reject anything that didn't come from the site.
 */
export const actions = {
	default: async ({ request, fetch, getClientAddress }) => {
		const data = await request.formData();

		// Honeypot — bots fill this, humans never see it.
		if (data.get('company_website')) return { success: true };

		const values = {
			name: String(data.get('name') ?? '').trim(),
			email: String(data.get('email') ?? '').trim(),
			phone: String(data.get('phone') ?? '').trim(),
			postcode: String(data.get('postcode') ?? '').trim(),
			service: String(data.get('service') ?? '').trim(),
			message: String(data.get('message') ?? '').trim()
		};

		/** @type {Record<string, string>} */
		const errors = {};
		if (values.name.length < 2) errors.name = 'Please tell us your name.';
		if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) errors.email = 'Please enter a valid email address.';
		if (values.phone && values.phone.replace(/\D/g, '').length < 10) errors.phone = 'Please enter a valid phone number.';
		if (values.message.length < 10) errors.message = 'Please give us a few details about the job.';
		if (Object.keys(errors).length) return fail(400, { errors, values });

		const endpoint = env.FORM_WEBHOOK_URL;
		if (!endpoint) {
			console.warn('[contact] FORM_WEBHOOK_URL is not set — form submission not delivered.');
			return fail(503, { unavailable: true, values });
		}

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
		} catch (err) {
			console.error('[contact] delivery failed:', err);
			return fail(502, { failed: true, values });
		}

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
