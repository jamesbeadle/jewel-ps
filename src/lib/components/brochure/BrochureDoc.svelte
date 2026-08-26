<script>
	/**
	 * Renders a brochure as exact A4 pages (210 × 297 mm) — the single source
	 * of truth for the public /brochure viewer, the admin live preview, and
	 * the print route the PDF generator captures.
	 */
	import './brochure.css';
	import { FOOTER_STRIP_DEFAULT } from '$lib/brochure/templates';
	import PageCover from './PageCover.svelte';
	import PageIntro from './PageIntro.svelte';
	import PageTeam from './PageTeam.svelte';
	import PageServices from './PageServices.svelte';
	import PageProcess from './PageProcess.svelte';
	import PageProjectIntro from './PageProjectIntro.svelte';
	import PageProjectDetail from './PageProjectDetail.svelte';
	import PageProjectGallery from './PageProjectGallery.svelte';
	import PageTestimonials from './PageTestimonials.svelte';
	import PageFreeform from './PageFreeform.svelte';
	import PageBackCover from './PageBackCover.svelte';

	/**
	 * @typedef {{ id: string, template: string, content: Record<string, unknown> }} PageData
	 */

	/** @type {{ pages: PageData[], bandText?: string }} */
	let { pages, bandText = FOOTER_STRIP_DEFAULT } = $props();

	/** @type {Record<string, import('svelte').Component<any>>} */
	const components = {
		cover: PageCover,
		intro: PageIntro,
		team: PageTeam,
		services: PageServices,
		process: PageProcess,
		'project-intro': PageProjectIntro,
		'project-detail': PageProjectDetail,
		'project-gallery': PageProjectGallery,
		testimonials: PageTestimonials,
		freeform: PageFreeform,
		'back-cover': PageBackCover
	};

	/** Templates that carry the dark services band along the bottom. */
	const withBand = new Set([
		'team',
		'services',
		'process',
		'project-detail',
		'project-gallery',
		'testimonials'
	]);

	/** Templates that never show a page number. */
	const noNumber = new Set(['cover', 'back-cover']);
</script>

<div class="bdoc">
	{#each pages as page, i (page.id)}
		{@const Comp = components[page.template]}
		<section
			class="bpage"
			class:bpage--cover={page.template === 'cover'}
			class:bpage--dark={page.template === 'back-cover'}
			data-page={i + 1}
		>
			{#if Comp}
				<Comp content={page.content} />
			{:else}
				<div class="bpage__body">
					<p class="b-kicker">Unknown page type: {page.template}</p>
				</div>
			{/if}

			{#if !noNumber.has(page.template)}
				<div class="bpage__num" class:bpage__num--banded={withBand.has(page.template)}>
					{i + 1}
				</div>
			{/if}

			{#if withBand.has(page.template) && bandText}
				<div class="bpage__band"><span>{bandText}</span></div>
			{/if}
		</section>
	{/each}
</div>

<style>
	.bpage__num--banded {
		bottom: 10mm;
	}
</style>
