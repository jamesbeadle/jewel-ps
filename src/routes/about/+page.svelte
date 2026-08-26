<script>
	import { values, groupValues, leadership, ecologi, clients, img } from '$lib/site.js';
	import { reveal, parallax } from '$lib/motion.js';
	import Seo from '$lib/components/Seo.svelte';
	import Icon from '$lib/components/Icon.svelte';
	import PageHero from '$lib/components/PageHero.svelte';
	import Testimonials from '$lib/components/Testimonials.svelte';
	import Accreditations from '$lib/components/Accreditations.svelte';
	import CtaBand from '$lib/components/CtaBand.svelte';
</script>

<Seo
	title="About us"
	description="A professional and passionate property maintenance company. Jewel Property Serve is a family business caring for properties across London and the South East for more than 20 years."
/>

<PageHero
	kicker="About us"
	title="A professional and passionate property maintenance company."
	lede="A family business caring for properties across London and the South East — with the reliability, professionalism and care that clients have trusted us for over two decades."
	image={img('jewel_style_prime_london_lobby_option_3-1.png')}
	alt="A prime London lobby maintained by Jewel Property Serve"
	cta={{ href: '/contact', label: 'Get in touch' }}
/>

<!-- Story -->
<section class="bg-night py-24 sm:py-32">
	<div class="container-site grid items-center gap-14 lg:grid-cols-12 lg:gap-20">
		<div class="lg:col-span-6" use:reveal={{ stagger: true }}>
			<p class="kicker">Our story</p>
			<h2 class="h-section mt-5 text-white">Welcome to Jewel Property Serve.</h2>
			<p class="mt-7 text-lg leading-relaxed text-grey">
				We are a premier UK provider of top-quality refurbishment, restoration and maintenance services for residential and commercial property. Our client-focused approach and decades of experience make us the preferred choice of development managers, private homeowners, insurers, managing agents, architects and interior designers alike.
			</p>
			<p class="mt-4 leading-relaxed text-grey">
				We take pride in delivering exceptional results on every project, with minimal disruption to you and your occupants. Our long-standing collaborations with high-end developments and repeat private clients are a testament to our commitment to service.
			</p>
			<div class="mt-8 flex flex-wrap gap-2">
				{#each clients as c}
					<span class="rounded-full border border-white/10 px-3.5 py-1.5 text-xs text-white/70">{c}</span>
				{/each}
			</div>
		</div>
		<div class="relative overflow-hidden rounded-[2rem] shadow-card lg:col-span-6" use:reveal>
			<div class="aspect-[4/3]">
				<img src={img('Office-Picture-1.png')} alt="The Jewel Property Serve office" class="h-[125%] w-full object-cover" loading="lazy" use:parallax={{ speed: 0.25 }} />
			</div>
		</div>
	</div>
</section>

<!-- Mission -->
<section class="relative isolate overflow-hidden bg-night-2 py-24 sm:py-32">
	<div class="bg-grid absolute inset-0 -z-10"></div>
	<div class="container-site grid items-center gap-14 lg:grid-cols-12 lg:gap-20">
		<div class="relative order-2 overflow-hidden rounded-[2rem] lg:order-1 lg:col-span-6" use:reveal>
			<div class="aspect-[4/3]">
				<img src={img('construction-engineer-with-foreman-worker-checking-2021-08-26-17-34-59-utc_60.jpg')} alt="Jewel engineers reviewing works on site" class="h-[125%] w-full object-cover" loading="lazy" use:parallax={{ speed: 0.25 }} />
			</div>
		</div>
		<div class="order-1 lg:order-2 lg:col-span-6" use:reveal={{ stagger: true }}>
			<p class="kicker">Our mission</p>
			<h2 class="h-section mt-5 text-white">Supporting our clients with the highest level of care.</h2>
			<p class="mt-7 text-lg leading-relaxed text-grey">
				Jewel Property Serve is a nominated main contractor for insurance companies across the UK. With a proven track record across major and minor loss, flood and fire reinstatement claims, we lead the way in restoring properties to their former glory.
			</p>
			<p class="mt-4 leading-relaxed text-grey">
				We take a proactive approach and apply innovative thinking to every project, with a dedication to health &amp; safety that ensures unparalleled results — and a contractor that truly cares about your satisfaction.
			</p>
			<ul class="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3">
				{#each groupValues as v}
					<li class="flex items-center gap-2 text-sm text-white/80"><Icon name="check" size={16} class="shrink-0 text-gold" />{v}</li>
				{/each}
			</ul>
		</div>
	</div>
</section>

<!-- Leadership quote -->
<section class="bg-night py-20 sm:py-28">
	<div class="container-site">
		<figure class="relative mx-auto max-w-4xl text-center" use:reveal>
			<img src="/images/logos/jewel-diamond.svg" alt="" class="mx-auto h-10 w-auto opacity-80" />
			<blockquote class="mt-8 font-display text-2xl font-medium leading-snug text-white sm:text-3xl lg:text-4xl">
				“{leadership.quote}”
			</blockquote>
			<figcaption class="mt-8">
				<span class="block font-display font-semibold text-gold">{leadership.name}</span>
				<span class="block text-sm text-grey">{leadership.role}</span>
			</figcaption>
		</figure>
	</div>
</section>

<!-- Values -->
<section id="values" class="bg-night-2 py-24 sm:py-32">
	<div class="container-site">
		<div class="max-w-2xl" use:reveal>
			<p class="kicker">Our values</p>
			<h2 class="h-section mt-5 text-white">The values that drive everything we do.</h2>
		</div>
		<div class="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4" use:reveal={{ stagger: true }}>
			{#each values as v, i}
				<div class="card group p-8 transition hover:border-gold/40">
					<span class="font-display text-4xl font-semibold text-gold/40 transition group-hover:text-gold">{String(i + 1).padStart(2, '0')}</span>
					<h3 class="mt-6 font-display text-2xl font-semibold text-white">{v.title}</h3>
					<p class="mt-3 text-sm leading-relaxed text-grey">{v.text}</p>
				</div>
			{/each}
		</div>
	</div>
</section>

<!-- Ecologi -->
<section id="ecologi" class="relative overflow-hidden bg-night py-24 sm:py-32">
	<div class="container-site grid items-center gap-12 lg:grid-cols-12">
		<div class="lg:col-span-5" use:reveal={{ stagger: true }}>
			<p class="kicker">Sustainability</p>
			<h2 class="h-section mt-5 text-white">{ecologi.title}</h2>
			<p class="mt-6 text-lg text-grey">{ecologi.text}</p>
			<div class="mt-8 grid grid-cols-2 gap-4">
				<div class="card p-5">
					<p class="font-display text-3xl font-semibold text-white">0.30<span class="text-base text-gold">t</span></p>
					<p class="mt-1 text-xs text-grey">CO₂ sequestered per tree</p>
				</div>
				<div class="card p-5">
					<p class="font-display text-3xl font-semibold text-white">732<span class="text-base text-gold">mi</span></p>
					<p class="mt-1 text-xs text-grey">Equivalent driving offset per tree</p>
				</div>
			</div>
		</div>
		<div class="relative overflow-hidden rounded-[2rem] lg:col-span-6 lg:col-start-7" use:reveal>
			<div class="aspect-[4/3]">
				<img src={ecologi.image} alt="Our Ecologi partnership" class="h-[125%] w-full object-cover" loading="lazy" use:parallax={{ speed: 0.25 }} />
			</div>
		</div>
	</div>
</section>

<Testimonials title="Trusted for over twenty years." parallaxColumns={false} />
<Accreditations />
<CtaBand title="Experience the Jewel difference." text="Talk to our service desk about your property — we’ll advise on the best course of action, free of charge." />
