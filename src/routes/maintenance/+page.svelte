<script>
	import { maintenanceServices, accreditations, img } from '$lib/site.js';
</script>

<svelte:head>
	<title>Maintenance Services | Jewel Property Serve</title>
	<meta
		name="description"
		content="Planned and reactive maintenance across every trade — HVAC, electrical, plumbing, roofing and more — keeping your property and portfolio running smoothly."
	/>
</svelte:head>

<!-- Page hero -->
<section class="relative bg-ink py-28">
	<img
		src={img('common-roof-repairs.webp')}
		alt="Property maintenance by Jewel Property Serve"
		class="absolute inset-0 h-full w-full object-cover opacity-25"
	/>
	<div class="relative mx-auto max-w-6xl px-6">
		<p class="kicker">Our services</p>
		<h1 class="mt-4 max-w-3xl font-display text-4xl leading-tight text-white md:text-6xl">
			Maintenance services.
		</h1>
		<p class="mt-6 max-w-xl text-lg text-white/75">
			Regular and specialised maintenance of your property and estate portfolio — maintaining your
			peace of mind.
		</p>
		<a href="/contact" class="btn-gold mt-9">Request your free quote</a>
	</div>
</section>

<!-- Services grid -->
<section class="bg-white py-24">
	<div class="mx-auto max-w-6xl px-6">
		<div class="max-w-2xl">
			<p class="kicker">Every trade, one contractor</p>
			<h2 class="mt-4 font-display text-4xl leading-tight md:text-5xl">
				Everything running smoothly, all year round.
			</h2>
		</div>
		<div class="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
			{#each maintenanceServices as service}
				<div class="rounded-2xl border border-ink/10 p-7 transition hover:border-gold/60 hover:shadow-lg">
					<div class="flex h-10 w-10 items-center justify-center rounded-full bg-gold/15">
						<svg class="h-5 w-5 text-gold-dark" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
							<path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
						</svg>
					</div>
					<h3 class="mt-4 text-lg font-semibold">{service.title}</h3>
					<p class="mt-2 text-sm leading-relaxed text-ink-mute">{service.text}</p>
				</div>
			{/each}
		</div>
	</div>
</section>

<!-- Managing agents -->
<section class="bg-ink py-24">
	<div class="mx-auto grid max-w-6xl items-center gap-14 px-6 md:grid-cols-2">
		<div>
			<p class="kicker">Managing agents & block managers</p>
			<h2 class="mt-4 font-display text-4xl leading-tight text-white md:text-5xl">
				Dedicated portfolio support.
			</h2>
			<p class="mt-6 leading-relaxed text-white/70">
				We provide dedicated maintenance support for managing agents and block managers across
				London and the South East — from day-to-day reactive repairs to fully planned programmes
				for entire portfolios.
			</p>
			<p class="mt-4 leading-relaxed text-white/70">
				One point of contact, prompt response times and full compliance documentation after every
				job. Our teams cover all core trades, plus specialist diagnostics such as thermal imaging,
				damp investigation and CCTV drainage surveys.
			</p>
			<a
				href="https://www.jewelps.co.uk/documents/2026_JewelPS_Management_Brochure.pdf"
				class="btn-gold mt-8"
			>
				Download the brochure
			</a>
		</div>
		<img
			src={img('jewel_style_prime_london_lobby_option_3-1.png')}
			alt="Prime London residential lobby"
			class="aspect-[4/3] w-full rounded-2xl object-cover"
		/>
	</div>
</section>

<!-- Accreditations -->
<section class="border-t border-ink/5 bg-white">
	<div class="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-12 px-6 py-12">
		{#each accreditations as accreditation}
			<img
				src={accreditation.image}
				alt={accreditation.name}
				class="h-16 w-auto object-contain grayscale transition hover:grayscale-0"
			/>
		{/each}
	</div>
</section>

<!-- CTA -->
<section class="bg-gold">
	<div class="mx-auto flex max-w-6xl flex-col items-center gap-6 px-6 py-16 text-center md:flex-row md:justify-between md:text-left">
		<div>
			<h2 class="font-display text-3xl text-ink md:text-4xl">Need an emergency callout?</h2>
			<p class="mt-2 text-ink/70">We're on standby 24 hours a day, 365 days a year.</p>
		</div>
		<a
			href="/contact"
			class="inline-flex items-center justify-center rounded-full bg-ink px-8 py-4 text-sm font-semibold text-white transition hover:bg-ink-soft"
		>
			Contact us now
		</a>
	</div>
</section>
