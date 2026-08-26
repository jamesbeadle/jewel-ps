/**
 * Server-side PDF generation.
 *
 * Renders the bare print route with headless Chromium and returns a
 * print-quality A4 PDF — identical output every time, full-bleed images,
 * embedded fonts, no dependence on anyone's browser print settings.
 *
 * Chromium resolution order:
 *   1. PDF_CHROME_PATH env var (explicit override)
 *   2. A locally installed Chrome/Chromium (dev machines)
 *   3. @sparticuz/chromium (the trimmed build used on Vercel)
 */
import { env } from '$env/dynamic/private';
import { existsSync } from 'node:fs';

const LOCAL_CHROME_PATHS = [
	// macOS
	'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
	'/Applications/Chromium.app/Contents/MacOS/Chromium',
	// Linux
	'/usr/bin/google-chrome',
	'/usr/bin/chromium',
	'/usr/bin/chromium-browser',
	'/opt/pw-browsers/chromium'
];

function baseArgs() {
	return ['--no-sandbox', '--disable-dev-shm-usage', '--font-render-hinting=none'];
}

/** @returns {Promise<{ executablePath: string, args: string[] }>} */
async function resolveChromium() {
	const override = (env.PDF_CHROME_PATH ?? '').trim();
	if (override && existsSync(override)) {
		return { executablePath: override, args: baseArgs() };
	}

	for (const p of LOCAL_CHROME_PATHS) {
		if (existsSync(p)) return { executablePath: p, args: baseArgs() };
	}

	// Serverless (Vercel): the trimmed Chromium build.
	const chromium = (await import('@sparticuz/chromium')).default;
	return {
		executablePath: await chromium.executablePath(),
		args: [...chromium.args, ...baseArgs()]
	};
}

/**
 * Capture `printUrl` (a /brochure/print/[id] page) as an A4 PDF.
 * Returns the raw PDF bytes.
 * @param {string} printUrl
 * @returns {Promise<Uint8Array>}
 */
export async function renderBrochurePdf(printUrl) {
	const puppeteer = (await import('puppeteer-core')).default;
	const { executablePath, args } = await resolveChromium();

	const browser = await puppeteer.launch({
		executablePath,
		args,
		headless: true,
		defaultViewport: { width: 1240, height: 1754, deviceScaleFactor: 2 }
	});

	try {
		const page = await browser.newPage();
		await page.goto(printUrl, { waitUntil: 'networkidle0', timeout: 45_000 });
		// Make sure the brochure fonts have finished loading before printing.
		await page.evaluate(() => document.fonts.ready.then(() => undefined));

		const pdf = await page.pdf({
			format: 'a4',
			printBackground: true,
			preferCSSPageSize: true,
			margin: { top: 0, right: 0, bottom: 0, left: 0 }
		});
		return pdf;
	} finally {
		await browser.close();
	}
}

/**
 * Safe download filename from a brochure title.
 * @param {string} title
 */
export function pdfFilename(title) {
	const safe = title
		.replace(/[^\w\s-]/g, '')
		.trim()
		.replace(/\s+/g, '-')
		.slice(0, 80);
	return `${safe || 'brochure'}.pdf`;
}
