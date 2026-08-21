<script>
	import { accreditations, testimonials, contact, img } from '$lib/site.js';
</script>

<svelte:head>
	<title>Fire & Flood Damage Restoration | Jewel Property Serve</title>
	<meta
		name="description"
		content="A nominated main contractor for UK insurers, Jewel Property Serve restores fire and flood damaged properties to their pre-loss condition — quickly and with care."
	/>
</svelte:head>

<!-- Page hero -->
<section class="relative bg-ink py-28">
	<img
		src={img('Jewel-repair.jpg')}
		alt="Fire and flood damage restoration"
		class="absolute inset-0 h-full w-full object-cover opacity-25"
	/>
	<div class="relative mx-auto max-w-6xl px-6">
		<p class="kicker">Our services</p>
		<h1 class="mt-4 max-w-3xl font-display text-4xl leading-tight text-white md:text-6xl">
			Fire & flood damage restoration.
		</h1>
		<p class="mt-6 max-w-xl text-lg text-white/75">
			Bringing your property back to life after disaster strikes.
		</p>
		<a href="/contact" class="btn-gold mt-9">Request your free quote</a>
	</div>
</section>

<!-- Intro -->
<section class="bg-white py-24">
	<div class="mx-auto grid max-w-6xl items-center gap-14 px-6 md:grid-cols-2">
		<div>
			<p class="kicker">Restoration specialists</p>
			<h2 class="mt-4 font-display text-4xl leading-tight md:text-5xl">
				Bringing your property back to life.
			</h2>
			<p class="mt-6 leading-relaxed text-ink-mute">
				Seeing your property in disrepair is overwhelming — we're here to help you every step of
				the way. As a nominated main contractor for insurance companies across the UK, we
				specialise in restoring fire and flood damaged properties to their pre-loss condition as
				quickly as possible.
			</p>
			<p class="mt-4 leading-relaxed text-ink-mute">
				Every property is unique, so we tailor our services to your specific needs. We keep you
				informed at every stage, from initial inspection to final walk-through, and work closely
				with your insurance company to ensure you receive the coverage you deserve.
			</p>
		</div>
		<img
			src={img('Jewel-repair.jpg')}
			alt="Restoration works in progress"
			class="aspect-[4/3] w-full rounded-2xl object-cover shadow-xl"
		/>
	</div>
</section>

<!-- What we do -->
<section class="bg-ink py-24">
	<div class="mx-auto max-w-6xl px-6">
		<div class="grid gap-6 md:grid-cols-2">
			<div class="rounded-2xl bg-ink-soft p-9">
				<p class="kicker">Our services</p>
				<h3 class="mt-3 font-display text-2xl text-white">Complete restoration & repair</h3>
				<p class="mt-4 text-sm leading-relaxed text-white/65">
					Fire and flood damage restoration, mould remediation, smoke damage repair, water damage
					restoration and more — using state-of-the-art equipment and techniques to ensure the job
					is done right, first time.
				</p>
			</div>
			<div class="rounded-2xl bg-ink-soft p-9">
				<p class="kicker">24/7 support</p>
				<h3 class="mt-3 font-display text-2xl text-white">There when you need us most</h3>
				<p class="mt-4 text-sm leading-relaxed text-white/65">
					Emergencies don't keep office hours. Our team is available around the clock to provide
					emergency services, exceptional workmanship and a stress-free experience from start to
					finish. Call us any time on {contact.phone}.
				</p>
			</div>
		</div>
	</div>
</section>

<!-- Testimonials -->
<section class="bg-white py-24">
	<div class="mx-auto max-w-6xl px-6">
		<div class="max-w-2xl">
			<p class="kicker">Testimonials</p>
			<h2 class="mt-4 font-display text-4xl leading-tight md:text-5xl">
				Trusted when it matters most.
			</h2>
		</div>
		<div class="mt-14 grid gap-6 md:grid-cols-2">
			{#each testimonials.slice(0, 2) as testimonial}
				<figure class="flex flex-col justify-between rounded-2xl border border-ink/10 p-8">
					<blockquote class="text-sm leading-relaxed text-ink-mute">
						“{testimonial.quote}”
					</blockquote>
					<figcaption class="mt-6">
						<p class="font-semibold">{testimonial.name}</p>
						<p class="text-sm text-gold-dark">{testimonial.role}</p>
					</figcaption>
				</figure>
			{/each}
		</div>
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
			<h2 class="font-display text-3xl text-ink md:text-4xl">Dealing with fire or flood damage?</h2>
			<p class="mt-2 text-ink/70">Call us 24/7 on {contact.phone} — we'll take it from here.</p>
		</div>
		<a
			href="/contact"
			class="inline-flex items-center justify-center rounded-full bg-ink px-8 py-4 text-sm font-semibold text-white transition hover:bg-ink-soft"
		>
			Get help now
		</a>
	</div>
</section>
