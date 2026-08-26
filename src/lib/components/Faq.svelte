<script>
	import { faqs } from '$lib/site.js';
	import { reveal } from '$lib/motion.js';
	import Icon from './Icon.svelte';

	/** @type {{ items?: typeof faqs }} */
	let { items = faqs } = $props();
</script>

<div class="divide-y divide-white/[0.08] border-y border-white/[0.08]" use:reveal={{ stagger: true }}>
	{#each items as f, i}
		<details class="group" open={i === 0}>
			<summary class="flex cursor-pointer items-center justify-between gap-6 py-5 font-display text-lg font-semibold text-white transition hover:text-gold sm:text-xl">
				{f.q}
				<span class="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/15 text-gold transition group-open:rotate-45 group-open:border-gold">
					<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M12 5v14M5 12h14" /></svg>
				</span>
			</summary>
			<p class="pb-6 pr-12 text-grey">{f.a}</p>
		</details>
	{/each}
</div>
