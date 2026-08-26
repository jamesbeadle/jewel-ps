<script>
	import { refurbServices, process, img } from '$lib/site.js';
	import { reveal, parallax } from '$lib/motion.js';
	import Seo from '$lib/components/Seo.svelte';
	import Icon from '$lib/components/Icon.svelte';
	import PageHero from '$lib/components/PageHero.svelte';
	import Testimonials from '$lib/components/Testimonials.svelte';
	import Accreditations from '$lib/components/Accreditations.svelte';
	import CtaBand from '$lib/components/CtaBand.svelte';
	import { testimonials } from '$lib/site.js';
</script>

<Seo
	title="Refurbishment services"
	description="Bespoke refurbishment and renovation in London and the South East — kitchens, bathrooms, carpentry & joinery, tiling and decoration, from concept to completion."
/>

<PageHero
	kicker="Our services · Refurbishment"
	title="From concept to completion."
	lede="Renovation and refurbishment by skilled professionals, with bespoke solutions for residential and commercial property. We work with you from first consultation to final finish."
	image={img('image6.jpg')}
	alt="A refurbished interior by Jewel Property Serve"
	cta={{ href: '/contact', label: 'Request a free quote' }}
	secondary={{ href: '#services', label: 'What we do' }}
/>

<!-- Intro -->
<section class="bg-night py-24 sm:py-32">
	<div class="container-site grid gap-12 lg:grid-cols-12">
		<div class="lg:col-span-5" use:reveal={{ stagger: true }}>
			<p class="kicker">Refurbishment</p>
			<h2 class="h-section mt-5 text-white">Beautiful. Functional. Built to last.</h2>
		</div>
		<div class="lg:col-span-6 lg:col-start-7" use:reveal={{ stagger: true }}>
			<p class="text-lg leading-relaxed text-grey">
				From design to installation, our team of experts will work with you to create a space that fits your needs — not only beautiful, but practical for the way you live and work. We use quality materials and the latest techniques on every project, whether it’s a single room or a whole-property transformation.
			</p>
			<ul class="mt-8 grid gap-3 sm:grid-cols-2">
				{#each ['Dedicated project manager', 'Free, competitive quotes', 'Live site updates', 'All trades in-house', '12-month guarantee', 'Minimal disruption'] as f}
					<li class="flex items-center gap-3 text-sm text-white/85"><span class="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gold/15 text-gold"><Icon name="check" size={14} /></span>{f}</li>
				{/each}
			</ul>
		</div>
	</div>
</section>

<!-- Services (alternating) -->
<section id="services" class="bg-night-2 py-24 sm:py-32">
	<div class="container-site">
		<div class="max-w-2xl" use:reveal>
			<p class="kicker">What we do</p>
			<h2 class="h-section mt-5 text-white">Every room, every detail.</h2>
		</div>
		<div class="mt-16 space-y-20 lg:space-y-28">
			{#each refurbServices as s, i}
				<article class="grid items-center gap-8 lg:grid-cols-12 lg:gap-16">
					<div class="relative overflow-hidden rounded-[2rem] shadow-card lg:col-span-7 {i % 2 ? 'lg:order-2' : ''}" use:reveal>
						<div class="aspect-[16/10]">
							<img src={s.image} alt={s.title} class="h-[125%] w-full object-cover" loading="lazy" use:parallax={{ speed: 0.22 }} />
						</div>
						<span class="absolute left-6 top-6 rounded-full bg-night/70 px-4 py-1.5 font-display text-xs font-semibold tracking-kicker text-gold backdrop-blur">0{i + 1}</span>
					</div>
					<div class="lg:col-span-5 {i % 2 ? 'lg:order-1' : ''}" use:reveal={{ stagger: true }}>
						<h3 class="font-display text-3xl font-semibold text-white sm:text-4xl">{s.title}</h3>
						<p class="mt-5 leading-relaxed text-grey">{s.text}</p>
						<a href="/contact" class="mt-7 inline-flex items-center gap-2 font-display text-sm font-semibold text-gold transition hover:gap-3">Discuss your {s.title.toLowerCase()} project <Icon name="arrow" size={16} /></a>
					</div>
				</article>
			{/each}
		</div>
	</div>
</section>

<!-- Process -->
<section class="bg-night py-24 sm:py-32">
	<div class="container-site">
		<div class="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between" use:reveal>
			<div>
				<p class="kicker">How it works</p>
				<h2 class="h-section mt-5 text-white">We make things simple.</h2>
			</div>
		</div>
		<ol class="mt-12 grid gap-5 md:grid-cols-3" use:reveal={{ stagger: true }}>
			{#each process as p}
				<li class="card p-8">
					<span class="font-display text-4xl font-semibold text-gold/50">{p.step}</span>
					<h3 class="mt-5 font-display text-xl font-semibold text-white">{p.title}</h3>
					<p class="mt-3 text-sm leading-relaxed text-grey">{p.text}</p>
				</li>
			{/each}
		</ol>
	</div>
</section>

<Testimonials items={[testimonials[1], testimonials[2]]} title="Refurbishments our clients love." parallaxColumns={false} />
<Accreditations />
<CtaBand title="Let’s design your next space." text="Free consultation and quote. A dedicated project manager from first fix to final finish." />
