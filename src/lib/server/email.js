/**
 * Enquiry notification emails via Resend (https://resend.com) — plain fetch,
 * no SDK. The jewelps.co.uk domain is verified in Resend, so mail is sent
 * from the site's own domain and lands reliably.
 *
 * Env vars:
 *   RESEND_API_KEY     — required to send (from the Resend dashboard → API keys)
 *   CONTACT_TO_EMAIL   — where enquiries go   (default enquiries@jewelps.co.uk)
 *   CONTACT_FROM_EMAIL — the sender address    (default website@jewelps.co.uk;
 *                        must be on the verified domain)
 */
import { env } from '$env/dynamic/private';

/** @param {string | undefined} v */
function envTrim(v) {
	return (v ?? '').trim();
}

export function emailConfigured() {
	return Boolean(envTrim(env.RESEND_API_KEY));
}

/** @param {string} s */
function escapeHtml(s) {
	return s
		.replaceAll('&', '&amp;')
		.replaceAll('<', '&lt;')
		.replaceAll('>', '&gt;')
		.replaceAll('"', '&quot;');
}

/**
 * Send the "new enquiry" notification. Throws on failure — callers decide
 * whether that should block the visitor's success message (it shouldn't).
 *
 * @param {{ name: string, email: string, phone: string, postcode: string, service: string, message: string }} values
 */
export async function sendEnquiryEmail(values) {
	const to = envTrim(env.CONTACT_TO_EMAIL) || 'enquiries@jewelps.co.uk';
	const from =
		envTrim(env.CONTACT_FROM_EMAIL) || 'Jewel Property Serve <website@jewelps.co.uk>';

	const rows = [
		['Name', values.name],
		['Email', values.email],
		['Phone', values.phone || '—'],
		['Postcode', values.postcode || '—'],
		['Service', values.service || '—']
	]
		.map(
			([label, value]) => `
				<tr>
					<td style="padding:6px 16px 6px 0;color:#8a94a3;font-size:13px;white-space:nowrap;vertical-align:top;">${label}</td>
					<td style="padding:6px 0;color:#131c2a;font-size:14px;">${escapeHtml(value)}</td>
				</tr>`
		)
		.join('');

	const html = `
	<div style="background:#f4f6f9;padding:32px 16px;font-family:-apple-system,'Segoe UI',Arial,sans-serif;">
		<div style="max-width:560px;margin:0 auto;background:#ffffff;border:1px solid #e4e8ef;border-radius:14px;overflow:hidden;">
			<div style="background:#0e1420;border-bottom:3px solid #135eaa;padding:18px 26px;">
				<span style="color:#ffffff;font-size:16px;font-weight:600;letter-spacing:0.02em;">Jewel <span style="color:#d8b970;font-weight:400;">Property Serve</span></span>
			</div>
			<div style="padding:24px 26px 28px;">
				<h1 style="margin:0 0 4px;font-size:19px;color:#131c2a;">New website enquiry</h1>
				<p style="margin:0 0 18px;font-size:13px;color:#8a94a3;">Submitted at ${new Date().toLocaleString('en-GB', { timeZone: 'Europe/London' })} (UK time)</p>
				<table cellpadding="0" cellspacing="0" style="border-collapse:collapse;">${rows}</table>
				<div style="margin-top:18px;padding:14px 16px;background:#f4f6f9;border:1px solid #e4e8ef;border-radius:10px;">
					<p style="margin:0 0 6px;font-size:11px;font-weight:600;letter-spacing:0.12em;text-transform:uppercase;color:#8a94a3;">Message</p>
					<p style="margin:0;font-size:14px;line-height:1.6;color:#131c2a;white-space:pre-line;">${escapeHtml(values.message)}</p>
				</div>
				<p style="margin:20px 0 0;font-size:13px;color:#8a94a3;">
					Reply to this email to answer ${escapeHtml(values.name)} directly, or manage it in the
					<a href="https://www.jewelps.co.uk/admin/enquiries" style="color:#135eaa;">admin inbox</a>.
				</p>
			</div>
		</div>
	</div>`;

	const text = [
		'New website enquiry — jewelps.co.uk',
		'',
		`Name:     ${values.name}`,
		`Email:    ${values.email}`,
		`Phone:    ${values.phone || '—'}`,
		`Postcode: ${values.postcode || '—'}`,
		`Service:  ${values.service || '—'}`,
		'',
		'Message:',
		values.message,
		'',
		'Manage it at https://www.jewelps.co.uk/admin/enquiries'
	].join('\n');

	const res = await fetch('https://api.resend.com/emails', {
		method: 'POST',
		headers: {
			Authorization: `Bearer ${envTrim(env.RESEND_API_KEY)}`,
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			from,
			to: [to],
			reply_to: values.email,
			subject: `New enquiry from ${values.name}${values.service ? ` — ${values.service}` : ''}`,
			html,
			text
		})
	});

	if (!res.ok) {
		const detail = await res.text().catch(() => '');
		throw new Error(`Resend responded ${res.status}: ${detail.slice(0, 300)}`);
	}
}
