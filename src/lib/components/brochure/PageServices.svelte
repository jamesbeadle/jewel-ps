<script>
	let { content } = $props();
	const c = $derived(content);
	const items = $derived(
		(Array.isArray(c.items) ? c.items : [])
	);
</script>

<div class="svc bpage__body">
	{#if c.kicker}<p class="b-kicker">{c.kicker}</p>{/if}
	<h2 class="b-title">{c.title}</h2>
	<hr class="b-rule" />

	<div class="svc__grid">
		{#each items as item, i (i)}
			<div class="svc__item">
				<div class="svc__num">{String(i + 1).padStart(2, '0')}</div>
				<div>
					<div class="svc__name">{item.title}</div>
					<div class="svc__body">{item.body}</div>
				</div>
			</div>
		{/each}
	</div>
</div>

<style>
	.svc__grid {
		display: grid;
		grid-template-columns: 1fr 1fr;
		column-gap: 12mm;
		row-gap: 10mm;
		margin-top: 4mm;
	}

	.svc__item {
		display: grid;
		grid-template-columns: 13mm 1fr;
		column-gap: 4mm;
		align-items: start;
	}

	.svc__num {
		font-family: var(--b-serif);
		font-weight: 400;
		font-size: 17pt;
		color: var(--b-ink-muted);
		line-height: 1.1;
	}

	.svc__name {
		font-size: 10pt;
		font-weight: 600;
		color: var(--b-ink);
		margin-bottom: 1.8mm;
	}

	.svc__body {
		font-size: 8.5pt;
		line-height: 1.55;
		color: var(--b-ink-soft);
	}
</style>
