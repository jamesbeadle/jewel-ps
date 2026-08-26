<script>
	import BImg from './BImg.svelte';

	let { content } = $props();
	const c = $derived(content);
	const members = $derived(
		(Array.isArray(c.members) ? c.members : [])
	);
	const accreditations = $derived(
		(Array.isArray(c.accreditations) ? c.accreditations : [])
	);
</script>

<div class="team bpage__body">
	{#if c.kicker}<p class="b-kicker">{c.kicker}</p>{/if}
	<h2 class="b-title">{c.title}</h2>
	<hr class="b-rule" />

	<div class="team__grid" class:team__grid--compact={members.length > 6}>
		{#each members as m, i (i)}
			<figure class="team__card">
				<div class="team__photo">
					<BImg src={m.photo} alt={m.name} label="Photo" />
				</div>
				<figcaption>
					<div class="team__name">{m.name}</div>
					<div class="team__role">{m.role}</div>
				</figcaption>
			</figure>
		{/each}
	</div>

	{#if accreditations.length}
		<div class="team__accr">
			<hr class="team__accr-rule" />
			<p class="b-kicker team__accr-kicker">OUR ACCREDITATIONS</p>
			<div class="team__accr-row">
				{#each accreditations as a (a)}
					<img src={a} alt="" />
				{/each}
			</div>
		</div>
	{/if}
</div>

<style>
	.team {
		padding-bottom: 20mm;
	}

	.team__grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		column-gap: 9mm;
		row-gap: 7mm;
		justify-items: center;
		margin-top: 2mm;
	}

	.team__card {
		margin: 0;
		text-align: center;
		width: 100%;
	}

	.team__photo {
		width: 40mm;
		height: 40mm;
		margin: 0 auto;
	}

	.team__photo :global(img) {
		filter: grayscale(1);
	}

	.team__grid--compact .team__photo {
		width: 34mm;
		height: 34mm;
	}

	.team__name {
		font-size: 9pt;
		color: var(--b-ink);
		margin-top: 2.6mm;
	}

	.team__role {
		font-size: 6.4pt;
		font-weight: 600;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		color: var(--b-accent);
		margin-top: 0.8mm;
	}

	.team__accr {
		margin-top: auto;
		padding-top: 4mm;
	}

	.team__accr-rule {
		border: 0;
		height: 0.3mm;
		background: color-mix(in srgb, var(--b-accent) 50%, transparent);
		margin: 0 0 3.5mm;
	}

	.team__accr-kicker {
		text-align: center;
		font-size: 7pt;
		margin-bottom: 3mm;
	}

	.team__accr-row {
		display: flex;
		justify-content: center;
		align-items: center;
		gap: 9mm;
	}

	.team__accr-row img {
		height: 11mm;
		width: auto;
		max-width: 24mm;
		object-fit: contain;
	}
</style>
