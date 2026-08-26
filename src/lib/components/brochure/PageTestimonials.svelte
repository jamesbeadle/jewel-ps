<script>
	let { content } = $props();
	const c = $derived(content);
	const quotes = $derived(
		(Array.isArray(c.quotes) ? c.quotes : [])
	);
</script>

<div class="ts bpage__body">
	{#if c.kicker}<p class="b-kicker">{String(c.kicker)}</p>{/if}
	<h2 class="b-title">{String(c.title ?? '')}</h2>
	<hr class="b-rule" />

	<div class="ts__cols">
		{#each quotes as q, i (i)}
			<figure class="ts__quote">
				<span class="ts__mark">“</span>
				<blockquote>{q.quote}</blockquote>
				<hr />
				<figcaption>— {q.author}</figcaption>
			</figure>
		{/each}
	</div>
</div>

<style>
	.ts__cols {
		columns: 2;
		column-gap: 12mm;
		margin-top: 2mm;
	}

	.ts__quote {
		break-inside: avoid;
		margin: 0 0 6mm;
		position: relative;
		padding-left: 7mm;
		display: flex;
		flex-direction: column;
	}

	/* Visual order: quote → attribution → hairline (DOM keeps figcaption last
	   for accessibility). */
	.ts__quote hr {
		order: 3;
	}

	.ts__mark {
		position: absolute;
		left: 0;
		top: -1mm;
		font-family: var(--b-serif);
		font-size: 17pt;
		color: var(--b-accent);
	}

	.ts__quote blockquote {
		margin: 0;
		font-family: var(--b-serif);
		font-size: 10.2pt;
		line-height: 1.5;
		color: var(--b-ink-soft);
	}

	.ts__quote figcaption {
		margin-top: 1.8mm;
		font-size: 7.6pt;
		font-weight: 600;
		color: var(--b-accent);
	}

	.ts__quote hr {
		border: 0;
		height: 0.25mm;
		width: 22mm;
		background: color-mix(in srgb, var(--b-accent) 40%, transparent);
		margin: 3mm 0 0;
	}
</style>
