<script>
	import BImg from './BImg.svelte';

	let { content } = $props();
	const c = $derived(content);
</script>

<div class="pi bpage__body">
	{#if c.kicker}<p class="b-kicker">{c.kicker}</p>{/if}
	<h2 class="pi__title">{c.title}</h2>
	<hr class="pi__rule" />
	{#if c.subtitle}
		<p class="pi__subtitle">{c.subtitle}</p>
	{/if}
	<div class="pi__photo">
		<BImg src={c.image} alt={c.title} label="Main photo" />
	</div>
</div>

<style>
	.pi {
		padding-top: 26mm;
		padding-bottom: 18mm;
	}

	.pi__title {
		font-family: var(--b-serif);
		font-weight: 400;
		font-size: 31pt;
		line-height: 1.12;
		color: var(--b-ink);
		margin: 0 0 5mm;
	}

	.pi__rule {
		width: 32mm;
		height: 1.4mm;
		background: var(--b-accent-deep);
		border: 0;
		margin: 0 0 6mm;
	}

	.pi__subtitle {
		font-size: 8.5pt;
		color: var(--b-ink-soft);
		margin: 0 0 6mm;
	}

	.pi__photo {
		flex: 1;
		min-height: 0;
	}
</style>
