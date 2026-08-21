<script>
	import { refurbServices, accreditations, img } from '$lib/site.js';
</script>

<svelte:head>
	<title>Refurbishment Services | Jewel Property Serve</title>
	<meta
		name="description"
		content="Bespoke renovation and refurbishment — kitchens, bathrooms, carpentry, tiling and decoration, delivered from concept to completion by Jewel Property Serve."
	/>
</svelte:head>

<!-- Page hero -->
<section class="relative bg-ink py-28">
	<img
		src={img('image6.jpg')}
		alt="Refurbished interior by Jewel Property Serve"
		class="absolute inset-0 h-full w-full object-cover opacity-25"
	/>
	<div class="relative mx-auto max-w-6xl px-6">
		<p class="kicker">Our services</p>
		<h1 class="mt-4 max-w-3xl font-display text-4xl leading-tight text-white md:text-6xl">
			Refurbishment services.
		</h1>
		<p class="mt-6 max-w-xl text-lg text-white/75">
			From design to installation, we create spaces that are as functional as they are beautiful.
		</p>
		<a href="/contact" class="btn-gold mt-9">Request your free quote</a>
	</div>
</section>

<!-- Intro -->
<section class="bg-white py-24">
	<div class="mx-auto max-w-3xl px-6 text-center">
		<p class="kicker">Concept to completion</p>
		<h2 class="mt-4 font-display text-4xl leading-tight md:text-5xl">
			Bespoke solutions, tailored to you.
		</h2>
		<p class="mt-6 leading-relaxed text-ink-mute">
			Every property is different. Our highly skilled team works closely with you to tailor each
			refurbishment to your individual needs and preferences — using only the finest materials and
			the latest techniques. From initial consultation to project completion, we deliver a seamless
			experience, whether you're creating your dream home or transforming a commercial property.
		</p>
	</div>
</section>

<!-- Services alternating -->
<section class="bg-white pb-24">
	<div class="mx-auto max-w-6xl space-y-20 px-6">
		{#each refurbServices as service, i}
			<div class="grid items-center gap-12 md:grid-cols-2">
				<img
					src={service.image}
					alt={service.title}
					class="aspect-[4/3] w-full rounded-2xl object-cover shadow-lg {i % 2 === 1 ? 'md:order-2' : ''}"
				/>
				<div>
					<p class="kicker">Refurbishment</p>
					<h3 class="mt-3 font-display text-3xl md:text-4xl">{service.title}</h3>
					<p class="mt-5 leading-relaxed text-ink-mute">{service.text}</p>
				</div>
			</div>
		{/each}
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
			<h2 class="font-display text-3xl text-ink md:text-4xl">Planning a refurbishment?</h2>
			<p class="mt-2 text-ink/70">Tell us about your project and we'll provide a free, competitive quote.</p>
		</div>
		<a
			href="/contact"
			class="inline-flex items-center justify-center rounded-full bg-ink px-8 py-4 text-sm font-semibold text-white transition hover:bg-ink-soft"
		>
			Request your free quote
		</a>
	</div>
</section>
