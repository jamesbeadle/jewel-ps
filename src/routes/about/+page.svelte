<script>
	import { values, accreditations, img } from '$lib/site.js';
</script>

<svelte:head>
	<title>About Us | Jewel Property Serve</title>
	<meta
		name="description"
		content="A professional and passionate property maintenance company caring for properties across London and the South of England for over 20 years."
	/>
</svelte:head>

<!-- Page hero -->
<section class="relative bg-ink py-28">
	<img
		src={img('jewel_style_prime_london_lobby_option_3-1.png')}
		alt="Prime London lobby maintained by Jewel Property Serve"
		class="absolute inset-0 h-full w-full object-cover opacity-25"
	/>
	<div class="relative mx-auto max-w-6xl px-6">
		<p class="kicker">About us</p>
		<h1 class="mt-4 max-w-3xl font-display text-4xl leading-tight text-white md:text-6xl">
			A professional and passionate property maintenance company.
		</h1>
		<p class="mt-6 max-w-xl text-lg text-white/75">
			Caring for properties across London and the South of England.
		</p>
	</div>
</section>

<!-- Story -->
<section class="bg-white">
	<div class="mx-auto grid max-w-6xl items-center gap-14 px-6 py-24 md:grid-cols-2">
		<div>
			<p class="kicker">Our story</p>
			<h2 class="mt-4 font-display text-4xl leading-tight md:text-5xl">
				Welcome to Jewel Property Serve.
			</h2>
			<p class="mt-6 leading-relaxed text-ink-mute">
				We are a premier UK provider of top-quality refurbishment, restoration and maintenance
				services in the residential market. Our client-focused approach and decades of experience
				make us the preferred choice of development managers, private homeowners, insurance
				companies, architects and interior designers alike.
			</p>
			<p class="mt-4 leading-relaxed text-ink-mute">
				We take pride in delivering exceptional results on every project. Our long-standing
				collaborations with high-end developments and repeat private clients are a testament to our
				unwavering commitment to unparalleled service.
			</p>
		</div>
		<img
			src={img('Office-Picture-1.png')}
			alt="The Jewel Property Serve office"
			class="aspect-[4/3] w-full rounded-2xl object-cover shadow-xl"
		/>
	</div>
</section>

<!-- Mission -->
<section class="bg-ink py-24">
	<div class="mx-auto grid max-w-6xl items-center gap-14 px-6 md:grid-cols-2">
		<img
			src={img('construction-engineer-with-foreman-worker-checking-2021-08-26-17-34-59-utc_60.jpg')}
			alt="Jewel engineers reviewing works on site"
			class="order-2 aspect-[4/3] w-full rounded-2xl object-cover md:order-1"
		/>
		<div class="order-1 md:order-2">
			<p class="kicker">Our mission</p>
			<h2 class="mt-4 font-display text-4xl leading-tight text-white md:text-5xl">
				Supporting our clients with the highest level of care.
			</h2>
			<p class="mt-6 leading-relaxed text-white/70">
				Jewel Property Serve is a nominated main contractor for insurance companies across the UK.
				With a proven track record across major and minor loss, flood and fire reinstatement
				claims, we lead the way in restoring properties to their former glory.
			</p>
			<p class="mt-4 leading-relaxed text-white/70">
				We take a proactive approach and apply innovative thinking to every project, with a
				dedication to health & safety that ensures unparalleled results — and a contractor that
				truly cares about your satisfaction.
			</p>
		</div>
	</div>
</section>

<!-- Values -->
<section class="bg-white py-24">
	<div class="mx-auto max-w-6xl px-6">
		<div class="max-w-2xl">
			<p class="kicker">Our values</p>
			<h2 class="mt-4 font-display text-4xl leading-tight md:text-5xl">
				The values that drive everything we do.
			</h2>
		</div>
		<div class="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
			{#each values as value, i}
				<div class="rounded-2xl border border-ink/10 p-8">
					<span class="font-display text-4xl text-gold/40">{String(i + 1).padStart(2, '0')}</span>
					<h3 class="mt-3 text-lg font-semibold">{value.title}</h3>
					<p class="mt-2 text-sm leading-relaxed text-ink-mute">{value.text}</p>
				</div>
			{/each}
		</div>
	</div>
</section>

<!-- Sustainability -->
<section class="border-t border-ink/5 bg-white pb-24">
	<div class="mx-auto grid max-w-6xl items-center gap-14 px-6 pt-24 md:grid-cols-2">
		<div>
			<p class="kicker">Sustainability</p>
			<h2 class="mt-4 font-display text-4xl leading-tight md:text-5xl">
				We're working with Ecologi.
			</h2>
			<p class="mt-6 leading-relaxed text-ink-mute">
				At Jewel, we're conscious of our carbon footprint, and we've teamed up with Ecologi to
				give back to the planet. Each tree we plant sequesters an estimated 0.30 tonnes of carbon —
				the equivalent of over 700 miles in a standard car.
			</p>
		</div>
		<img
			src={img('Ecoligi.jpg')}
			alt="Our Ecologi partnership"
			class="aspect-[4/3] w-full rounded-2xl object-cover shadow-xl"
		/>
	</div>
</section>

<!-- Accreditations + CTA -->
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

<section class="bg-gold">
	<div class="mx-auto flex max-w-6xl flex-col items-center gap-6 px-6 py-16 text-center md:flex-row md:justify-between md:text-left">
		<h2 class="font-display text-3xl text-ink md:text-4xl">Experience the Jewel difference.</h2>
		<a
			href="/contact"
			class="inline-flex items-center justify-center rounded-full bg-ink px-8 py-4 text-sm font-semibold text-white transition hover:bg-ink-soft"
		>
			Get in touch
		</a>
	</div>
</section>
