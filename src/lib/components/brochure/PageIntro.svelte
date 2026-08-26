<script>
	let { content } = $props();
	const c = $derived(content);
	const paragraphs = $derived(
		String(c.body ?? '')
			.split(/\n\s*\n/)
			.map((p) => p.trim())
			.filter(Boolean)
	);
</script>

<div class="intro">
	<div class="intro__line" aria-hidden="true"></div>
	<div class="intro__col">
		{#if c.kicker}<p class="b-kicker">{c.kicker}</p>{/if}
		<h2 class="intro__title">{c.title}</h2>
		<hr class="b-rule" />
		<div class="b-body intro__body">
			{#each paragraphs as p (p)}
				<p>{p}</p>
			{/each}
		</div>
	</div>
	<hr class="intro__bottom" />
</div>

<style>
	.intro {
		position: relative;
		flex: 1;
		padding: 30mm 22mm 24mm 26mm;
	}

	.intro__line {
		position: absolute;
		left: 22mm;
		top: 36mm;
		bottom: 50mm;
		width: 0.35mm;
		background: color-mix(in srgb, var(--b-accent) 55%, transparent);
	}

	.intro__col {
		padding-left: 14mm;
		max-width: 148mm;
	}

	.intro__title {
		font-family: var(--b-serif);
		font-weight: 400;
		font-size: 30pt;
		line-height: 1.18;
		color: var(--b-ink);
		margin: 0 0 7mm;
		max-width: 110mm;
	}

	.intro__body {
		max-width: 128mm;
	}

	.intro__body :global(p) {
		margin-bottom: 4.5mm;
	}

	.intro__bottom {
		position: absolute;
		left: 22mm;
		right: 22mm;
		bottom: 26mm;
		height: 0.35mm;
		border: 0;
		background: color-mix(in srgb, var(--b-accent) 65%, transparent);
	}
</style>
