<script>
	import BImg from './BImg.svelte';

	let { content } = $props();
	const c = $derived(content);
</script>

<div class="cover">
	<div class="cover__photo">
		<BImg src={c.image} alt="" label="Cover photo" />
	</div>

	<hr class="cover__rule" />

	<div class="b-wordmark">
		<div class="b-wordmark__jewel">JEWEL</div>
		<div class="b-wordmark__sub">PROPERTY SERVE</div>
	</div>

	<div class="cover__title">{c.title || 'Your Property, Our Passion'}</div>

	<hr class="cover__rule cover__rule--short" />

	{#if c.subtitle}
		<div class="cover__subtitle">{c.subtitle}</div>
	{/if}

	{#if c.contact}
		<div class="cover__contact">{c.contact}</div>
	{/if}
</div>

<style>
	.cover {
		flex: 1;
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 20mm 22mm 16mm;
	}

	.cover__photo {
		width: 100%;
		height: 128mm;
		flex: 0 0 auto;
	}

	.cover__rule {
		width: 66mm;
		height: 0.55mm;
		background: var(--b-accent);
		border: 0;
		margin: 12mm 0 8mm;
	}

	.cover__rule--short {
		width: 20mm;
		margin: 9mm 0 0;
	}

	.cover__title {
		font-family: var(--b-serif);
		font-weight: 400;
		font-size: 34pt;
		line-height: 1.25;
		color: #33405a;
		text-align: center;
		margin-top: 9mm;
		max-width: 150mm;
		white-space: pre-line;
	}

	.cover__subtitle {
		margin-top: 12mm;
		font-size: 8.5pt;
		color: var(--b-ink-soft);
		letter-spacing: 0.04em;
	}

	.cover__contact {
		margin-top: auto;
		font-size: 9.5pt;
		color: var(--b-ink-soft);
		letter-spacing: 0.02em;
	}
</style>
