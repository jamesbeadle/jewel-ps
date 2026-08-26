<script>
	import { testimonials } from '$lib/site.js';
	import { reveal, parallax } from '$lib/motion.js';

	/** @type {{ items?: typeof testimonials, title?: string, kicker?: string, parallaxColumns?: boolean }} */
	let {
		items = testimonials,
		title = 'Don’t take our word for it.',
		kicker = 'What our clients say',
		parallaxColumns = true
	} = $props();

	const left = $derived(items.filter((_, i) => i % 2 === 0));
	const right = $derived(items.filter((_, i) => i % 2 === 1));
</script>

<section class="relative isolate overflow-hidden bg-night-2 py-24 sm:py-32">
	<div class="bg-grid absolute inset-0 -z-10"></div>
	<div class="container-site">
		<div class="max-w-2xl" use:reveal>
			<p class="kicker">{kicker}</p>
			<h2 class="h-section mt-5 text-white">{title}</h2>
		</div>

		<div class="mt-14 grid gap-6 md:grid-cols-2 md:gap-8">
			<div class="space-y-6 md:space-y-8">
				{#each left as t}
					{@render card(t)}
				{/each}
			</div>
			<div class="space-y-6 md:space-y-8 md:pt-16">
				{#if parallaxColumns}
					<div class="space-y-6 md:space-y-8" use:parallax={{ speed: -0.18 }}>
						{#each right as t}
							{@render card(t)}
						{/each}
					</div>
				{:else}
					{#each right as t}
						{@render card(t)}
					{/each}
				{/if}
			</div>
		</div>
	</div>
</section>

{#snippet card(/** @type {{ quote: string, name: string, role: string }} */ t)}
	<figure class="card relative p-8 sm:p-10" use:reveal>
		<svg class="absolute right-8 top-8 h-10 w-10 text-gold/30" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
			<path d="M9.5 5C6.46 5 4 7.46 4 10.5c0 2.3 1.4 4.26 3.4 5.08L6 19h4l1.5-4.1V10.5C11.5 7.46 9.5 5 9.5 5zm10 0C16.46 5 14 7.46 14 10.5c0 2.3 1.4 4.26 3.4 5.08L16 19h4l1.5-4.1V10.5C21.5 7.46 19.5 5 19.5 5z" />
		</svg>
		<blockquote class="text-[15px] leading-relaxed text-white/80 sm:text-base">“{t.quote}”</blockquote>
		<figcaption class="mt-7 flex items-center gap-4">
			<span class="flex h-11 w-11 items-center justify-center rounded-full bg-blue/20 font-display text-sm font-semibold text-blue-light">
				{t.name.split(' ').map((/** @type {string} */ n) => n[0]).slice(0, 2).join('')}
			</span>
			<span>
				<span class="block font-display font-semibold text-white">{t.name}</span>
				<span class="block text-sm text-gold">{t.role}</span>
			</span>
		</figcaption>
	</figure>
{/snippet}
