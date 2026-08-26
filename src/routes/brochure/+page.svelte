<script>
	import Seo from '$lib/components/Seo.svelte';
	import BrochureDoc from '$lib/components/brochure/BrochureDoc.svelte';

	let { data } = $props();

	// A4 pages are 210mm wide (~794 CSS px); scale them to fit the viewport.
	const PAGE_W = 794;
	const PAGE_H = 1123;
	let wrapWidth = $state(0);
	const scale = $derived(wrapWidth > 0 ? Math.min(1, wrapWidth / PAGE_W) : 1);
	const pageCount = $derived(data.doc.pages.length);
</script>

<Seo
	title="Our Brochure"
	description="The Jewel Property Serve brochure — who we are, our services, our process, and how to get in touch."
/>

<section class="bg-night pt-36 pb-10 lg:pt-44">
	<div class="container-site">
		<p class="kicker">Our brochure</p>
		<h1 class="h-section mt-5 text-white">Jewel Property Serve,<br />on paper.</h1>
		<div class="mt-8 flex flex-wrap items-center gap-5">
			<a class="btn-gold" href="/brochure/pdf" data-sveltekit-preload-data="off">Download PDF</a>
			<p class="text-sm text-grey">{pageCount} pages · A4 · print quality</p>
		</div>
	</div>
</section>

<section class="border-t border-white/[0.06] bg-night-2 py-12 sm:py-16">
	<div class="viewer mx-auto" bind:clientWidth={wrapWidth}>
		<div
			class="viewer__scaler"
			style="transform: scale({scale}); height: {pageCount * (PAGE_H + 24) * scale}px;"
		>
			<BrochureDoc pages={data.doc.pages} />
		</div>
	</div>
</section>

<style>
	.viewer {
		max-width: 850px;
		padding: 0 1rem;
	}

	.viewer__scaler {
		transform-origin: top left;
	}

	.viewer :global(.bpage) {
		margin-bottom: 24px;
		box-shadow: 0 12px 40px rgba(0, 0, 0, 0.45);
	}
</style>
