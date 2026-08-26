<script>
	import BImg from './BImg.svelte';

	let { content } = $props();
	const c = $derived(content);
	const paragraphs = $derived(
		String(c.body ?? '')
			.split(/\n\s*\n/)
			.map((p) => p.trim())
			.filter(Boolean)
	);
</script>

<div class="ff bpage__body">
	{#if c.kicker}<p class="b-kicker">{c.kicker}</p>{/if}
	{#if c.title}<h2 class="b-title">{c.title}</h2>{/if}
	<hr class="b-rule" />
	<div class="b-body ff__body">
		{#each paragraphs as p (p)}
			<p>{p}</p>
		{/each}
	</div>
	{#if c.image}
		<div class="ff__photo">
			<BImg src={c.image} alt="" />
		</div>
	{/if}
</div>

<style>
	.ff__body {
		max-width: 150mm;
	}

	.ff__body :global(p) {
		margin-bottom: 4mm;
	}

	.ff__photo {
		flex: 1;
		min-height: 40mm;
		margin-top: 6mm;
	}
</style>
