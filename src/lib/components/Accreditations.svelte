<script>
	import { accreditations } from '$lib/site.js';
	import { reveal } from '$lib/motion.js';
</script>

<section class="border-y border-white/[0.06] bg-night">
	<div class="container-site flex flex-col items-center gap-8 py-10 sm:flex-row sm:justify-between" use:reveal={{ stagger: true }}>
		<p class="font-display text-[11px] font-semibold uppercase tracking-kicker text-grey/70">Accredited &amp; approved</p>
		{#each accreditations as a}
			<div class="flex h-14 items-center rounded-xl bg-white px-5 py-2">
				<img src={a.image} alt={a.name} class="h-full w-auto max-w-[9rem] object-contain" loading="lazy" />
			</div>
		{/each}
	</div>
</section>
