<script>
	let { content } = $props();
	const c = $derived(content);
</script>

<div class="bc">
	<hr class="bc__topline" />

	<div class="bc__mid">
		<div class="b-wordmark">
			<div class="b-wordmark__jewel">JEWEL</div>
			<div class="b-wordmark__sub bc__sub">PROPERTY SERVE LTD</div>
		</div>
		<hr class="bc__rule" />

		<div class="bc__title">{c.title || 'Here When You Need Us'}</div>

		<dl class="bc__contact">
			{#if c.phone}
				<dt>TELEPHONE</dt>
				<dd>{c.phone}</dd>
			{/if}
			{#if c.email}
				<dt>EMAIL</dt>
				<dd>{c.email}</dd>
			{/if}
			{#if c.web}
				<dt>WEB</dt>
				<dd>{c.web}</dd>
			{/if}
			{#if c.address}
				<dt>ADDRESS</dt>
				<dd>{c.address}</dd>
			{/if}
		</dl>
	</div>

	<div class="bc__foot">
		{#if c.services_line}
			<div class="bc__services">{c.services_line}</div>
		{/if}
		<hr class="bc__hair" />
		{#if c.accreditations_line}
			<div class="bc__accr">{c.accreditations_line}</div>
		{/if}
	</div>
</div>

<style>
	.bc {
		flex: 1;
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 26mm 24mm 16mm;
	}

	.bc__topline {
		width: 100%;
		border: 0;
		height: 0.35mm;
		background: color-mix(in srgb, var(--b-gold) 75%, transparent);
		margin: 0 0 4mm;
	}

	.bc__mid {
		flex: 1;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		text-align: center;
	}

	.bc__sub {
		color: var(--b-gold);
	}

	.bc__rule {
		width: 20mm;
		height: 0.35mm;
		background: var(--b-gold);
		border: 0;
		margin: 8mm 0 14mm;
	}

	.bc__title {
		font-family: var(--b-serif);
		font-weight: 400;
		font-size: 26pt;
		line-height: 1.4;
		color: #e9edf3;
		max-width: 120mm;
		margin-bottom: 18mm;
	}

	.bc__contact {
		margin: 0;
	}

	.bc__contact dt {
		font-size: 7pt;
		font-weight: 600;
		letter-spacing: 0.3em;
		color: var(--b-gold);
		margin-bottom: 1.4mm;
	}

	.bc__contact dd {
		margin: 0 0 4.5mm;
		font-size: 10.5pt;
		color: #dfe5ec;
	}

	.bc__foot {
		width: 100%;
		text-align: center;
	}

	.bc__services {
		font-size: 8pt;
		color: #8b94a1;
		letter-spacing: 0.04em;
		margin-bottom: 4mm;
	}

	.bc__hair {
		width: 100%;
		border: 0;
		height: 0.3mm;
		background: color-mix(in srgb, var(--b-gold) 55%, transparent);
		margin: 0 0 4mm;
	}

	.bc__accr {
		font-size: 6.4pt;
		color: #7d8794;
		letter-spacing: 0.05em;
	}
</style>
