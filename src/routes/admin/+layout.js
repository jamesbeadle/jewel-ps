// The admin area is rendered per-request (session cookie, live data) and
// must never be prerendered or indexed.
export const prerender = false;
export const ssr = true;
