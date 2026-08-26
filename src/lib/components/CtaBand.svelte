<script>
	import { contact } from '$lib/site.js';
	import { reveal } from '$lib/motion.js';
	import Icon from './Icon.svelte';

	/** @type {{ title?: string, text?: string }} */
	let {
		title = 'Ready when you are.',
		text = 'Free quotes. 24-hour emergency callout. A 12-month guarantee on every job.'
	} = $props();
</script>

<section class="relative isolate overflow-hidden bg-gold text-night">
	<div class="pointer-events-none absolute -left-20 top-1/2 h-[30rem] w-[30rem] -translate-y-1/2 rounded-full bg-white/20 blur-3xl"></div>
	<div class="pointer-events-none absolute -right-10 -top-24 h-[24rem] w-[24rem] rounded-full bg-blue/25 blur-3xl"></div>
	<div class="container-site relative flex flex-col gap-8 py-16 sm:py-20 lg:flex-row lg:items-center lg:justify-between" use:reveal>
		<div class="max-w-2xl">
			<h2 class="h-section text-night">{title}</h2>
			<p class="mt-4 text-lg text-night/75">{text}</p>
		</div>
		<div class="flex flex-col gap-3 sm:flex-row lg:flex-col xl:flex-row">
			<a href={contact.phoneHref} class="btn bg-night text-white hover:bg-night-3">
				<Icon name="phone" size={18} />
				{contact.phone}
			</a>
			<a href="/contact" class="btn border border-night/30 text-night hover:bg-night hover:text-white">
				Request a free quote
				<Icon name="arrow" size={18} />
			</a>
		</div>
	</div>
</section>
