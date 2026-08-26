<script>
	import { maintenanceServices, clients, contact, img } from '$lib/site.js';
	import { reveal } from '$lib/motion.js';
	import Seo from '$lib/components/Seo.svelte';
	import PageHero from '$lib/components/PageHero.svelte';
	import Testimonials from '$lib/components/Testimonials.svelte';
	import Accreditations from '$lib/components/Accreditations.svelte';
	import CtaBand from '$lib/components/CtaBand.svelte';
	import { testimonials } from '$lib/site.js';
</script>

<Seo
	title="Maintenance services"
	description="Planned and reactive property maintenance across London and the South East — electrical, plumbing, HVAC, roofing, glazing, compliance testing and a 24-hour emergency callout."
/>

<PageHero
	kicker="Our services · Maintenance"
	title="Maintaining your peace of mind."
	lede="Regular and specialised maintenance of your property and estate portfolio, keeping everything safe, compliant and running smoothly — with experts on call 24 hours a day."
	image={img('common-roof-repairs.webp')}
	alt="Roof maintenance by Jewel Property Serve"
	cta={{ href: '/contact', label: 'Request a free quote' }}
	secondary={{ href: contact.phoneHref, label: `Emergency: ${contact.phone}` }}
/>

<!-- Who we help -->
<section class="bg-night py-20 sm:py-28">
	<div class="container-site grid gap-12 lg:grid-cols-12">
		<div class="lg:col-span-5" use:reveal={{ stagger: true }}>
			<p class="kicker">Planned &amp; reactive</p>
			<h2 class="h-section mt-5 text-white">One contractor for every trade.</h2>
		</div>
		<div class="lg:col-span-6 lg:col-start-7" use:reveal={{ stagger: true }}>
			<p class="text-lg leading-relaxed text-grey">
				Whether you look after a single home or a portfolio of buildings, we provide reactive repairs, planned preventative maintenance and project works through one point of contact — fully vetted, qualified and DBS-checked engineers, every time.
			</p>
			<div class="mt-8 flex flex-wrap gap-2">
				{#each clients as c}
					<span class="rounded-full border border-white/10 px-3.5 py-1.5 text-xs text-white/70">{c}</span>
				{/each}
			</div>
		</div>
	</div>
</section>

<!-- Service grid -->
<section class="relative isolate overflow-hidden bg-night-2 py-24 sm:py-32">
	<div class="bg-grid absolute inset-0 -z-10"></div>
	<div class="container-site">
		<div class="max-w-2xl" use:reveal>
			<p class="kicker">What we cover</p>
			<h2 class="h-section mt-5 text-white">Every trade. One call.</h2>
		</div>
		<ol class="mt-14 grid gap-x-12 sm:grid-cols-2" use:reveal={{ stagger: true }}>
			{#each maintenanceServices as s, i}
				<li id={s.title === 'Managing Agent Support' ? 'managing-agents' : undefined} class="border-t border-white/10 py-6 {s.title.includes('Emergency') ? 'sm:col-span-2 rounded-[1.25rem] border border-gold/30 bg-gold/[0.06] px-6 sm:px-8' : ''}">
					<div class="grid grid-cols-[2.5rem_1fr] gap-4">
						<span class="pt-1 font-display text-xs font-semibold text-gold/80">{String(i + 1).padStart(2, '0')}</span>
						<div>
							<h3 class="font-display text-xl font-semibold text-white sm:text-2xl">{s.title}</h3>
							<p class="mt-2 max-w-xl text-sm leading-relaxed text-grey">{s.text}</p>
							{#if s.title.includes('Emergency')}<a href={contact.phoneHref} class="btn-gold mt-5">Call {contact.phone}</a>{/if}
						</div>
					</div>
				</li>
			{/each}
		</ol>
	</div>
</section>

<!-- Managing agents -->
<section class="bg-night py-24 sm:py-32">
	<div class="container-site">
		<div class="card grid items-center gap-10 p-8 sm:p-12 lg:grid-cols-12 lg:p-16" use:reveal={{ stagger: true }}>
			<div class="lg:col-span-7">
				<p class="kicker">Managing agents &amp; block managers</p>
				<h2 class="h-section mt-5 text-white">Dedicated portfolio support.</h2>
				<p class="mt-6 text-lg text-grey">
					We provide dedicated maintenance support for managing agents and block managers across London and the South East — one service desk, clear reporting, and a team that residents are happy to see. We’ve been an approved contractor at Chiltern Court since 2006.
				</p>
			</div>
			<div class="grid gap-3 lg:col-span-5">
				{#each ['Single point of contact for all trades', 'Planned maintenance programmes', 'Compliance testing & certification', 'Detailed completion reports', '24hr emergency response for residents'] as f}
					<div class="border-b border-white/10 py-3 text-sm text-white/85">{f}</div>
				{/each}
			</div>
		</div>
	</div>
</section>

<Testimonials items={[testimonials[2], testimonials[3]]} title="Long-standing relationships." parallaxColumns={false} />
<Accreditations />
<CtaBand title="Need something fixed?" text="Call our service desk — we’ll talk you through the issue and get the right engineer to you fast." />
