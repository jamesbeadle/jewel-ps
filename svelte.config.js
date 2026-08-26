import adapter from '@sveltejs/adapter-vercel';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  preprocess: vitePreprocess(),
  kit: {
    adapter: adapter(),
    // Poll for a new deployment so open tabs switch to full-page navigation
    // (avoids stale-chunk errors right after a deploy or a local rebuild).
    version: { pollInterval: 30000 }
  }
};

export default config;
