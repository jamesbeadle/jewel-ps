<script>
	import BImg from './BImg.svelte';

	let { content } = $props();
	const c = $derived(content);
	const images = $derived((Array.isArray(c.images) ? c.images : []));
	const cells = $derived(Array.from({ length: 6 }, (_, i) => images[i] ?? ''));
</script>

<div class="pg bpage__body">
	{#if c.kicker}<p class="b-kicker pg__kicker">{String(c.kicker)}</p>{/if}
	<h2 class="pg__title">{String(c.title ?? '')}</h2>
	<hr class="pg__rule" />

	<div class="pg__grid">
		{#each cells as src, i (i)}
			<div class="pg__cell">
				<BImg {src} alt="" label={`Photo ${i + 1}`} />
			</div>
		{/each}
	</div>
</div>

<style>
	.pg {
		padding-top: 20mm;
		padding-bottom: 18mm;
	}

	.pg__kicker {
		margin-bottom: 3mm;
	}

	.pg__title {
		font-family: var(--b-serif);
		font-weight: 400;
		font-size: 17pt;
		color: var(--b-ink);
		margin: 0 0 2.5mm;
	}

	.pg__rule {
		width: 26mm;
		height: 0.5mm;
		background: var(--b-accent);
		border: 0;
		margin: 0 0 6mm;
	}

	.pg__grid {
		flex: 1;
		display: grid;
		grid-template-columns: 1fr 1fr;
		grid-template-rows: repeat(3, 1fr);
		gap: 3.5mm;
		min-height: 0;
	}

	.pg__cell {
		min-height: 0;
	}
</style>
