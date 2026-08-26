<script>
	import { parallax, reveal } from '$lib/motion.js';

	/**
	 * @type {{
	 *   kicker: string, title: string, lede?: string, image: string, alt?: string,
	 *   cta?: { href: string, label: string } | null, secondary?: { href: string, label: string } | null,
	 *   children?: import('svelte').Snippet
	 * }}
	 */
	let { kicker, title, lede = '', image, alt = '', cta = null, secondary = null, children } = $props();
</script>

<section class="relative isolate flex min-h-[70svh] items-end overflow-hidden bg-night pt-36 pb-16 sm:pb-20 lg:min-h-[78svh] lg:pt-44 lg:pb-24">
	<div class="absolute inset-0 -z-20 overflow-hidden">
		<img
			src={image}
			{alt}
			class="photo h-[120%] w-full object-cover"
			use:parallax={{ speed: 0.35, scale: 1.05 }}
			fetchpriority="high"
		/>
		<div class="photo-tint absolute inset-0"></div>
	</div>
	<div class="absolute inset-0 -z-10 bg-gradient-to-t from-night via-night/70 to-night/30"></div>
	<div class="absolute inset-0 -z-10 bg-gradient-to-r from-blue-deep/40 via-transparent to-transparent"></div>

	<div class="container-site relative">
		<div class="max-w-4xl" use:reveal={{ stagger: true }}>
			<p class="kicker">{kicker}</p>
			<h1 class="mt-5 font-display text-[2.5rem] font-semibold leading-[1.04] tracking-[-0.02em] text-white sm:text-5xl lg:text-6xl xl:text-7xl">{title}</h1>
			{#if lede}
				<p class="lede mt-6 max-w-2xl">{lede}</p>
			{/if}
			{#if cta || secondary}
				<div class="mt-9 flex flex-wrap gap-3">
					{#if cta}<a href={cta.href} class="btn-gold">{cta.label}</a>{/if}
					{#if secondary}<a href={secondary.href} class="btn-ghost">{secondary.label}</a>{/if}
				</div>
			{/if}
			{#if children}{@render children()}{/if}
		</div>
	</div>
</section>
