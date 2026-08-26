/**
 * When a new build is deployed while a visitor has the site open, the next client-side
 * navigation can fail to fetch a chunk whose hash no longer exists. Rather than show an
 * error page, fall back to a full-page navigation to the requested URL.
 */
/** @type {import('@sveltejs/kit').HandleClientError} */
export function handleError({ error, event }) {
	const message = String(/** @type {any} */ (error)?.message ?? error ?? '');
	if (/dynamically imported module|Importing a module script failed|Failed to fetch/i.test(message)) {
		window.location.href = event.url.href;
		return { message: 'Loading the latest version…' };
	}
	console.error(error);
	return { message: 'Something went wrong.' };
}
