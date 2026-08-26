<script>
	import { restorationServices, contact, img } from '$lib/site.js';
	import { reveal, parallax } from '$lib/motion.js';
	import Seo from '$lib/components/Seo.svelte';
	import PageHero from '$lib/components/PageHero.svelte';
	import Testimonials from '$lib/components/Testimonials.svelte';
	import Accreditations from '$lib/components/Accreditations.svelte';
	import CtaBand from '$lib/components/CtaBand.svelte';
	import { testimonials } from '$lib/site.js';

	const steps = [
		{ step: '01', title: 'Emergency response', text: 'Make-safe, board-up and emergency drying, day or night. Call us and we’ll be on our way.' },
		{ step: '02', title: 'Assessment & scope', text: 'A detailed inspection and schedule of works, agreed with you and your insurer or loss adjuster.' },
		{ step: '03', title: 'Restoration works', text: 'Strip-out, drying, structural repairs and full reinstatement by our in-house trades, with a dedicated project manager.' },
		{ step: '04', title: 'Handover', text: 'Final walk-through, completion report and a 12-month guarantee — your property back to its pre-loss condition.' }
	];
</script>

<Seo
	title="Fire & flood damage restoration"
	description="A nominated main contractor for UK insurers, Jewel Property Serve restores fire and flood damaged properties to their pre-loss condition — quickly, carefully and with 24/7 emergency response."
/>

<PageHero
	kicker="Our services · Fire & flood restoration"
	title="Bringing your property back to life after disaster strikes."
	lede="Seeing your property in disrepair is overwhelming. As a nominated main contractor for insurance companies across the UK, we’re here to help you every step of the way."
	image={img('Jewel-repair.jpg')}
	alt="Fire and flood damage restoration works"
	cta={{ href: contact.phoneHref, label: `24/7 emergency: ${contact.phone}` }}
	secondary={{ href: '/contact', label: 'Request a free quote' }}
/>

<!-- Intro -->
<section class="bg-night py-24 sm:py-32">
	<div class="container-site grid items-center gap-14 lg:grid-cols-12 lg:gap-20">
		<div class="lg:col-span-6" use:reveal={{ stagger: true }}>
			<p class="kicker">Restoration specialists</p>
			<h2 class="h-section mt-5 text-white">Restored to pre-loss condition. Fast.</h2>
			<p class="mt-7 text-lg leading-relaxed text-grey">
				We specialise in repairing fire and flood damaged properties and restoring them to their pre-loss condition as quickly as possible. Every property is unique, so we tailor our services to your specific needs — using state-of-the-art equipment and techniques to make sure the job is done right, first time.
			</p>
			<p class="mt-4 leading-relaxed text-grey">
				We keep you informed at every stage, from initial inspection to final walk-through, and work closely with your insurance company to ensure you receive the coverage you deserve.
			</p>
			<div class="mt-8 flex flex-wrap gap-2">
				{#each ['Insurance companies', 'Loss adjusters', 'Managing agents', 'Homeowners', 'Landlords'] as c}
					<span class="rounded-full border border-white/10 px-3.5 py-1.5 text-xs text-white/70">{c}</span>
				{/each}
			</div>
		</div>
		<div class="relative overflow-hidden rounded-[2rem] shadow-card lg:col-span-6" use:reveal>
			<div class="aspect-[4/3]">
				<img src={img('Jewel-repair.jpg')} alt="Restoration works in progress" class="h-[125%] w-full object-cover" loading="lazy" use:parallax={{ speed: 0.25 }} />
			</div>
			<div class="absolute bottom-6 left-6 flex items-center gap-3 rounded-full bg-night/70 px-4 py-2 text-sm text-white backdrop-blur">
				<span class="relative flex h-2.5 w-2.5"><span class="absolute inline-flex h-full w-full animate-pulseRing rounded-full bg-gold/70"></span><span class="relative inline-flex h-2.5 w-2.5 rounded-full bg-gold"></span></span>
				Emergency team on standby 24/7
			</div>
		</div>
	</div>
</section>

<!-- Services -->
<section class="relative isolate overflow-hidden bg-night-2 py-24 sm:py-32">
	<div class="bg-grid absolute inset-0 -z-10"></div>
	<div class="container-site">
		<div class="max-w-2xl" use:reveal>
			<p class="kicker">What we do</p>
			<h2 class="h-section mt-5 text-white">Complete restoration &amp; repair.</h2>
		</div>
		<ol class="mt-14 grid gap-x-12 sm:grid-cols-2" use:reveal={{ stagger: true }}>
			{#each restorationServices as s, i}
				<li class="border-t border-white/10 py-6">
					<div class="grid grid-cols-[2.5rem_1fr] gap-4">
						<span class="pt-1 font-display text-xs font-semibold text-gold/80">{String(i + 1).padStart(2, '0')}</span>
						<div>
							<h3 class="font-display text-xl font-semibold text-white sm:text-2xl">{s.title}</h3>
							<p class="mt-2 max-w-xl text-sm leading-relaxed text-grey">{s.text}</p>
						</div>
					</div>
				</li>
			{/each}
		</ol>
	</div>
</section>

<!-- Steps -->
<section class="bg-night py-24 sm:py-32">
	<div class="container-site">
		<div class="max-w-2xl" use:reveal>
			<p class="kicker">What happens next</p>
			<h2 class="h-section mt-5 text-white">From first call to final sign-off.</h2>
		</div>
		<ol class="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-4" use:reveal={{ stagger: true }}>
			{#each steps as s}
				<li class="card relative p-8">
					<span class="font-display text-4xl font-semibold text-gold/50">{s.step}</span>
					<h3 class="mt-5 font-display text-xl font-semibold text-white">{s.title}</h3>
					<p class="mt-3 text-sm leading-relaxed text-grey">{s.text}</p>
				</li>
			{/each}
		</ol>
	</div>
</section>

<Testimonials items={[testimonials[1], testimonials[0]]} title="Trusted when it matters most." parallaxColumns={false} />
<Accreditations />
<CtaBand title="Fire or flood damage? We’re here." text="Emergency response around the clock, 365 days a year. Call now and we’ll get your property secured." />
