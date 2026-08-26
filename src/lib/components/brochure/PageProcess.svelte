<script>
	let { content } = $props();
	const c = $derived(content);
	const steps = $derived(
		(Array.isArray(c.steps) ? c.steps : [])
	);
</script>

<div class="proc bpage__body">
	{#if c.kicker}<p class="b-kicker">{c.kicker}</p>{/if}
	<h2 class="b-title">{c.title}</h2>
	<hr class="b-rule" />

	{#if c.lede}
		<p class="proc__lede">{String(c.lede)}</p>
	{/if}

	<div class="proc__steps">
		{#each steps as step, i (i)}
			<div class="proc__step">
				<div class="proc__num">{String(i + 1).padStart(2, '0')}</div>
				<div>
					<div class="proc__name">{step.title}</div>
					<div class="proc__body">{step.body}</div>
				</div>
			</div>
		{/each}
	</div>
</div>

<style>
	.proc__lede {
		font-size: 8.5pt;
		font-weight: 600;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		color: var(--b-accent);
		line-height: 1.75;
		max-width: 160mm;
		margin: 0 0 8mm;
	}

	.proc__steps {
		display: grid;
		row-gap: 7.5mm;
	}

	.proc__step {
		display: grid;
		grid-template-columns: 16mm 1fr;
		column-gap: 3mm;
		align-items: start;
	}

	.proc__num {
		font-family: var(--b-serif);
		font-weight: 400;
		font-size: 19pt;
		color: var(--b-accent);
		line-height: 1;
	}

	.proc__name {
		font-size: 10pt;
		font-weight: 600;
		color: var(--b-ink);
		margin-bottom: 1.4mm;
	}

	.proc__body {
		font-size: 8.5pt;
		line-height: 1.6;
		color: var(--b-ink-soft);
		max-width: 155mm;
	}
</style>
