<script>
	import { services, stats, process, accreditations, testimonials, img } from '$lib/site.js';
</script>

<svelte:head>
	<title>Jewel Property Serve | Property & Portfolio Estate Maintenance</title>
	<meta
		name="description"
		content="Jewel Property Serve — London and the South East's trusted partner for high-end property maintenance, refurbishment and fire & flood restoration. 24/7 emergency callout."
	/>
</svelte:head>

<!-- Hero -->
<section class="relative flex min-h-[85vh] items-center bg-ink">
	<img
		src={img('50-Liverpool-st-Lounge-Area-Workroom-view_MC_HR_13.14-1920x1280.jpg')}
		alt="High-end interior maintained by Jewel Property Serve"
		class="absolute inset-0 h-full w-full object-cover opacity-40"
	/>
	<div class="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-transparent"></div>
	<div class="relative mx-auto w-full max-w-6xl px-6 py-28">
		<p class="kicker">Complete property maintenance</p>
		<h1 class="mt-5 max-w-3xl font-display text-5xl leading-[1.05] text-white md:text-7xl">
			Your property, <span class="text-gold">our passion.</span>
		</h1>
		<p class="mt-7 max-w-xl text-lg leading-relaxed text-white/80">
			The trusted one-stop partner for high-end property maintenance, refurbishment and fire &
			flood restoration across London and the South East.
		</p>
		<div class="mt-10 flex flex-wrap gap-4">
			<a href="/contact" class="btn-gold">Request your free quote</a>
			<a href="#services" class="btn-outline-light">Browse our services</a>
		</div>
	</div>
</section>

<!-- Stats -->
<section class="border-b border-ink/5 bg-white">
	<div class="mx-auto grid max-w-6xl grid-cols-2 gap-8 px-6 py-14 md:grid-cols-4">
		{#each stats as stat}
			<div>
				<p class="font-display text-4xl text-gold-dark md:text-5xl">{stat.value}</p>
				<p class="mt-2 text-sm text-ink-mute">{stat.label}</p>
			</div>
		{/each}
	</div>
</section>

<!-- About intro -->
<section class="bg-white">
	<div class="mx-auto grid max-w-6xl items-center gap-14 px-6 py-24 md:grid-cols-2">
		<div>
			<p class="kicker">About Jewel Property Serve</p>
			<h2 class="mt-4 font-display text-4xl leading-tight md:text-5xl">
				We put the “Pro” in property services.
			</h2>
			<p class="mt-6 leading-relaxed text-ink-mute">
				Jewel Property Serve is a premier UK provider of top-quality refurbishment, restoration and
				maintenance for the residential and commercial market.
			</p>
			<p class="mt-4 leading-relaxed text-ink-mute">
				Our client-focused approach and decades of experience make us the preferred choice of
				development managers, private homeowners, insurance companies, architects and interior
				designers alike.
			</p>
			<a href="/about" class="btn-outline-dark mt-8">Discover Jewel</a>
		</div>
		<div class="relative">
			<img
				src={img('9174928687_ba363209af_k.jpg')}
				alt="Property maintained by Jewel Property Serve"
				class="aspect-[4/3] w-full rounded-2xl object-cover shadow-xl"
			/>
			<div class="absolute -bottom-4 -left-4 h-24 w-24 rounded-2xl border-2 border-gold"></div>
		</div>
	</div>
</section>

<!-- Services -->
<section id="services" class="bg-ink py-24">
	<div class="mx-auto max-w-6xl px-6">
		<div class="max-w-2xl">
			<p class="kicker">Our services</p>
			<h2 class="mt-4 font-display text-4xl leading-tight text-white md:text-5xl">
				For all your needs, we've got you covered.
			</h2>
			<p class="mt-5 leading-relaxed text-white/70">
				One complete solution for all of your property maintenance, refurbishment and restoration
				works.
			</p>
		</div>

		<div class="mt-14 grid gap-6 sm:grid-cols-2">
			{#each services as service}
				<a
					href={service.href}
					class="group overflow-hidden rounded-2xl bg-ink-soft transition hover:-translate-y-1"
				>
					<div class="overflow-hidden">
						<img
							src={service.image}
							alt={service.title}
							class="aspect-[16/9] w-full object-cover transition duration-500 group-hover:scale-105"
						/>
					</div>
					<div class="p-7">
						<h3 class="font-display text-2xl text-white transition group-hover:text-gold">
							{service.title}
						</h3>
						<p class="mt-3 text-sm leading-relaxed text-white/60">{service.blurb}</p>
						<span class="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-gold">
							Learn more
							<svg class="h-4 w-4 transition group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
								<path stroke-linecap="round" stroke-linejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
							</svg>
						</span>
					</div>
				</a>
			{/each}
		</div>
	</div>
</section>

<!-- Process -->
<section class="bg-white py-24">
	<div class="mx-auto max-w-6xl px-6">
		<div class="max-w-2xl">
			<p class="kicker">Our process</p>
			<h2 class="mt-4 font-display text-4xl leading-tight md:text-5xl">We make things simple.</h2>
		</div>
		<div class="mt-14 grid gap-10 md:grid-cols-3">
			{#each process as item}
				<div class="relative rounded-2xl border border-ink/10 p-8">
					<span class="font-display text-5xl text-gold/40">{item.step}</span>
					<h3 class="mt-4 text-xl font-semibold">{item.title}</h3>
					<p class="mt-3 text-sm leading-relaxed text-ink-mute">{item.text}</p>
				</div>
			{/each}
		</div>
		<div class="mt-12 text-center">
			<a href="/contact" class="btn-gold">Contact us</a>
		</div>
	</div>
</section>

<!-- Accreditations -->
<section class="border-y border-ink/5 bg-white">
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

<!-- Testimonials -->
<section class="bg-ink py-24">
	<div class="mx-auto max-w-6xl px-6">
		<div class="max-w-2xl">
			<p class="kicker">Testimonials</p>
			<h2 class="mt-4 font-display text-4xl leading-tight text-white md:text-5xl">
				Don't take our word for it.
			</h2>
		</div>
		<div class="mt-14 grid gap-6 md:grid-cols-2">
			{#each testimonials as testimonial}
				<figure class="flex flex-col justify-between rounded-2xl bg-ink-soft p-8">
					<blockquote class="text-sm leading-relaxed text-white/75">
						“{testimonial.quote}”
					</blockquote>
					<figcaption class="mt-6">
						<p class="font-semibold text-white">{testimonial.name}</p>
						<p class="text-sm text-gold">{testimonial.role}</p>
					</figcaption>
				</figure>
			{/each}
		</div>
	</div>
</section>

<!-- CTA -->
<section class="bg-gold">
	<div class="mx-auto flex max-w-6xl flex-col items-center gap-6 px-6 py-16 text-center md:flex-row md:justify-between md:text-left">
		<div>
			<h2 class="font-display text-3xl text-ink md:text-4xl">Ready to get started?</h2>
			<p class="mt-2 text-ink/70">Free quotes. 24/7 emergency callout. A 12-month guarantee on all works.</p>
		</div>
		<a
			href="/contact"
			class="inline-flex items-center justify-center rounded-full bg-ink px-8 py-4 text-sm font-semibold text-white transition hover:bg-ink-soft"
		>
			Request your free quote
		</a>
	</div>
</section>
