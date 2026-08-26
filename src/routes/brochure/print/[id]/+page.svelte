<script>
	import BrochureDoc from '$lib/components/brochure/BrochureDoc.svelte';

	let { data } = $props();
</script>

<svelte:head>
	<title>{data.doc.brochure.title}</title>
	<meta name="robots" content="noindex, nofollow" />
</svelte:head>

<BrochureDoc pages={data.doc.pages} />

<style>
	:global(html),
	:global(body) {
		margin: 0;
		padding: 0;
		background: #fff !important;
		overflow-x: visible;
	}

	@page {
		size: A4;
		margin: 0;
	}

	@media print {
		:global(.bpage) {
			margin: 0 !important;
			box-shadow: none !important;
		}
	}
</style>
