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
	const features = $derived((Array.isArray(c.features) ? c.features : []));
</script>

<div class="pd">
	<div class="pd__photo">
		<BImg src={String(c.image ?? '')} alt={String(c.title ?? '')} label="Tall photo" />
	</div>

	<div class="pd__col">
		{#if c.kicker}<p class="b-kicker pd__kicker">{String(c.kicker)}</p>{/if}
		<h2 class="pd__title">{String(c.title ?? '')}</h2>
		<hr class="pd__rule" />

		<div class="pd__body">
			{#each paragraphs as p (p)}
				<p>{p}</p>
			{/each}
		</div>

		{#if features.length}
			<div class="pd__features">
				<hr class="pd__hair" />
				<p class="pd__flabel">KEY FEATURES</p>
				<ul>
					{#each features as f (f)}
						<li>— {f}</li>
					{/each}
				</ul>
			</div>
		{/if}

		{#if c.value || c.duration}
			<hr class="pd__hair" />
			<div class="pd__stats">
				<div class="pd__stat">
					<p class="pd__flabel">PROJECT VALUE</p>
					<div class="pd__statbox">{String(c.value ?? '')}</div>
				</div>
				<div class="pd__stat">
					<p class="pd__flabel">PROJECT DURATION</p>
					<div class="pd__statbox">{String(c.duration ?? '')}</div>
				</div>
			</div>
		{/if}
	</div>
</div>

<style>
	.pd {
		flex: 1;
		display: grid;
		grid-template-columns: 96mm 1fr;
		min-height: 0;
	}

	.pd__photo {
		margin: 21mm 0 12mm;
		min-height: 0;
	}

	.pd__col {
		padding: 30mm 20mm 20mm 14mm;
		display: flex;
		flex-direction: column;
		min-height: 0;
	}

	.pd__kicker {
		margin-bottom: 6mm;
	}

	.pd__title {
		font-family: var(--b-serif);
		font-weight: 400;
		font-size: 18.5pt;
		line-height: 1.2;
		color: var(--b-ink);
		margin: 0 0 4mm;
	}

	.pd__rule {
		width: 30mm;
		height: 0.35mm;
		background: var(--b-accent);
		border: 0;
		margin: 0 0 7mm;
	}

	.pd__body {
		font-size: 8.6pt;
		line-height: 1.6;
		color: var(--b-ink-soft);
	}

	.pd__body p {
		margin: 0 0 3.4mm;
	}

	.pd__features {
		margin-top: 4mm;
	}

	.pd__hair {
		border: 0;
		height: 0.3mm;
		background: color-mix(in srgb, var(--b-accent) 45%, transparent);
		margin: 4.5mm 0 3.5mm;
	}

	.pd__flabel {
		font-size: 7pt;
		font-weight: 600;
		letter-spacing: 0.22em;
		color: var(--b-accent);
		margin: 0 0 2.4mm;
	}

	.pd__features ul {
		list-style: none;
		margin: 0;
		padding: 0 0 0 2mm;
	}

	.pd__features li {
		font-size: 8.4pt;
		line-height: 1.65;
		color: var(--b-ink-soft);
	}

	.pd__stats {
		display: grid;
		grid-template-columns: 1fr 1fr;
		column-gap: 6mm;
	}

	.pd__statbox {
		background: #e9eef6;
		border: 0.25mm solid #d3deec;
		padding: 3.4mm 3mm;
		font-size: 8.4pt;
		font-weight: 600;
		color: var(--b-ink);
	}
</style>
