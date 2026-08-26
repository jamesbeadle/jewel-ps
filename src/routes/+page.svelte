<script>
	import { onMount } from 'svelte';
	import { services, stats, process, maintenanceServices, clients, contact, ecologi, img } from '$lib/site.js';
	import { getGsap, prefersReducedMotion, reveal, parallax, countUp, splitWords } from '$lib/motion.js';
	import Seo from '$lib/components/Seo.svelte';
	import Testimonials from '$lib/components/Testimonials.svelte';
	import Accreditations from '$lib/components/Accreditations.svelte';
	import CtaBand from '$lib/components/CtaBand.svelte';

	/** @type {HTMLElement} */ let heroBg;
	/** @type {HTMLElement} */ let heroShade;
	/** @type {HTMLElement} */ let heroContent;
	/** @type {HTMLElement} */ let heroTitle;
	/** @type {HTMLElement} */ let heroFoot;
	/** @type {HTMLElement} */ let curtain;
	/** @type {HTMLElement} */ let processSection;
	/** @type {HTMLElement} */ let processLine;
	/** @type {HTMLElement[]} */ let processSteps = [];

	const mainServices = services.filter((s) => s.id !== 'emergency');
	const trades = maintenanceServices.filter((s) => s.title !== '24hr Emergency Callout');

	onMount(() => {
		const words = splitWords(heroTitle);
		if (prefersReducedMotion()) return;

		/** @type {{ revert: () => void } | undefined} */
		let ctx;
		getGsap().then(({ gsap, ScrollTrigger }) => {
			ctx = gsap.context(() => {
				// Intro: a slow settle, not a firework.
				gsap
					.timeline({ defaults: { ease: 'power3.out' } })
					.fromTo(heroBg, { scale: 1.12 }, { scale: 1, duration: 2.4, ease: 'power2.out' }, 0)
					.from(heroContent.querySelector('[data-kicker]'), { opacity: 0, y: 12, duration: 0.8 }, 0.4)
					.from(words, { yPercent: 105, duration: 1, stagger: 0.08 }, 0.5)
					.from(heroContent.querySelectorAll('[data-fade]'), { opacity: 0, y: 18, duration: 0.9, stagger: 0.12 }, 1.0)
					.from(heroFoot, { opacity: 0, duration: 1 }, 1.4);

				// Scroll: the hero stays pinned (CSS sticky) while the page slides over it.
				// As the curtain rises the photo pushes back, the shade deepens, the copy lifts and fades.
				gsap
					.timeline({ scrollTrigger: { trigger: curtain, start: 'top bottom', end: 'top top', scrub: 0.6 } })
					.to(heroBg, { scale: 1.12, yPercent: -6, ease: 'none' }, 0)
					.to(heroShade, { opacity: 0.85, ease: 'none' }, 0)
					.to(heroContent, { yPercent: -18, opacity: 0, ease: 'power1.in' }, 0)
					.to(heroFoot, { opacity: 0, ease: 'none' }, 0);

				// Process: gold line fills as the steps pass.
				gsap.fromTo(
					processLine,
					{ scaleY: 0 },
					{ scaleY: 1, ease: 'none', scrollTrigger: { trigger: processSection, start: 'top 60%', end: 'bottom 75%', scrub: 0.4 } }
				);
				processSteps.forEach((step) => {
					ScrollTrigger.create({
						trigger: step,
						start: 'top 62%',
						end: 'bottom 40%',
						onToggle: (/** @type {{ isActive: boolean }} */ self) => step.classList.toggle('is-active', self.isActive)
					});
				});
			});
		});

		return () => ctx?.revert();
	});
</script>

<Seo />

<!-- ============================ HERO (sticky; the page slides over it) ============================ -->
<section class="sticky top-0 z-0 flex min-h-[100svh] flex-col justify-end overflow-hidden bg-night">
	<div class="absolute inset-0">
		<img
			bind:this={heroBg}
			src={img('50-Liverpool-st-Lounge-Area-Workroom-view_MC_HR_13.14-1920x1280.jpg')}
			alt="A high-end London interior maintained by Jewel Property Serve"
			class="photo h-full w-full object-cover will-change-transform"
			fetchpriority="high"
			decoding="async"
		/>
		<div class="photo-tint absolute inset-0"></div>
		<div class="absolute inset-0 bg-gradient-to-t from-night via-night/55 to-night/25"></div>
		<div class="absolute inset-0 bg-gradient-to-r from-night/70 via-night/20 to-transparent"></div>
		<div bind:this={heroShade} class="absolute inset-0 bg-night opacity-0"></div>
	</div>

	<div class="container-site relative pb-8 pt-32 sm:pb-12 lg:pb-16 lg:pt-40">
		<div bind:this={heroContent} class="max-w-3xl will-change-transform">
			<p class="kicker" data-kicker>London &amp; the South East</p>
			<h1 bind:this={heroTitle} class="h-display mt-5 text-white">Your property, our passion.</h1>
			<p class="mt-6 max-w-lg text-base leading-relaxed text-white/80 sm:text-lg lg:text-xl" data-fade>
				High-end property maintenance, refurbishment and fire &amp; flood restoration — with a 24-hour emergency callout, 365 days a year.
			</p>
			<div class="mt-8 flex flex-wrap items-center gap-x-7 gap-y-4" data-fade>
				<a href="/contact" class="btn-gold">Request a free quote</a>
				<a href={contact.phoneHref} class="font-display text-[15px] font-semibold text-white transition hover:text-gold">or call {contact.phone}</a>
			</div>
		</div>

		<div bind:this={heroFoot} class="mt-8 flex items-center justify-between border-t border-white/15 pt-5 text-[11px] uppercase tracking-[0.18em] text-white/55 sm:mt-12 sm:text-xs">
			<span class="hidden sm:inline">SafeContractor approved · NICEIC registered · 12-month guarantee</span>
			<span class="sm:hidden">20+ years · 12-month guarantee</span>
			<span class="flex items-center gap-3">
				Scroll
				<span class="block h-8 w-px overflow-hidden bg-white/15"><span class="block h-1/2 w-full animate-[scrollcue_1.8s_ease-in-out_infinite] bg-gold"></span></span>
			</span>
		</div>
	</div>
</section>

<!-- ============================ THE CURTAIN: everything below slides over the hero ============================ -->
<div bind:this={curtain} class="relative z-10 rounded-t-[2rem] bg-night shadow-[0_-30px_60px_-20px_rgba(0,0,0,0.8)] sm:rounded-t-[2.5rem]">
	<!-- Services -->
	<section id="services" class="py-20 sm:py-28">
		<div class="container-site">
			<div class="max-w-2xl" use:reveal={{ stagger: true }}>
				<p class="kicker">Our services</p>
				<h2 class="h-section mt-5 text-white">For all your needs, we’ve got you covered.</h2>
				<p class="mt-5 text-lg text-grey">One complete solution for your property — reactive, planned and project works, from a single repair to a full transformation.</p>
			</div>

			<div class="mt-12 grid gap-4 sm:mt-16 sm:gap-5 lg:grid-cols-3">
				{#each mainServices as s, i}
					<a
						href={s.href}
						class="group relative flex min-h-[22rem] flex-col justify-end overflow-hidden rounded-[1.5rem] bg-night-3 sm:min-h-[26rem] lg:min-h-[32rem]"
						use:reveal
						style="transition-delay: {i * 90}ms"
					>
						<div class="absolute inset-0 overflow-hidden">
							<img src={s.image} alt="" class="photo h-[115%] w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]" loading="lazy" use:parallax={{ speed: 0.18 }} />
							<div class="photo-tint absolute inset-0"></div>
							<div class="absolute inset-0 bg-gradient-to-t from-night via-night/40 to-transparent"></div>
						</div>
						<div class="relative p-7 sm:p-8">
							<span class="font-display text-xs font-semibold tracking-kicker text-gold">{s.index}</span>
							<h3 class="mt-3 font-display text-3xl font-semibold text-white">{s.title}</h3>
							<p class="mt-3 max-w-xs text-sm leading-relaxed text-white/70">{s.short}</p>
							<span class="mt-5 inline-block font-display text-sm font-semibold text-gold transition group-hover:translate-x-1">Learn more →</span>
						</div>
					</a>
				{/each}
			</div>

			<!-- 24hr callout: one line, one action -->
			<div class="mt-5 flex flex-col gap-5 rounded-[1.5rem] border border-gold/30 bg-gold/[0.06] p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8" use:reveal>
				<div>
					<p class="font-display text-xs font-semibold tracking-kicker text-gold">04 · 24-hour emergency callout</p>
					<p class="mt-2 font-display text-xl font-semibold text-white sm:text-2xl">Experts on standby around the clock, 365 days a year.</p>
				</div>
				<a href={contact.phoneHref} class="btn-gold shrink-0">Call {contact.phone}</a>
			</div>
		</div>
	</section>

	<!-- Intro + stats -->
	<section class="border-t border-white/[0.06] py-20 sm:py-28">
		<div class="container-site grid items-center gap-12 lg:grid-cols-12 lg:gap-20">
			<div class="lg:col-span-6" use:reveal={{ stagger: true }}>
				<p class="kicker">About Jewel Property Serve</p>
				<h2 class="h-section mt-5 text-white">We put the <span class="text-gradient-gold">‘Pro’</span> in property services.</h2>
				<p class="mt-7 text-lg leading-relaxed text-grey">
					A premier UK provider of top-quality refurbishment, restoration and maintenance for residential and commercial property. We focus on speed, clear communication and workmanship you can trust — with minimal disruption to you or your occupants.
				</p>
				<p class="mt-4 leading-relaxed text-grey">
					Our client-focused approach and decades of experience make us the preferred choice of development managers, private homeowners, insurers, managing agents, architects and interior designers alike.
				</p>
				<p class="mt-6 text-sm text-white/60">{clients.join(' · ')}</p>
				<a href="/about" class="btn-ghost mt-8">Discover Jewel</a>
			</div>
			<div class="relative overflow-hidden rounded-[1.5rem] lg:col-span-6" use:reveal>
				<div class="aspect-[4/3] lg:aspect-[4/5]">
					<img src={img('9174928687_ba363209af_k.jpg')} alt="A property cared for by Jewel Property Serve" class="h-[120%] w-full object-cover" loading="lazy" use:parallax={{ speed: 0.25 }} />
				</div>
			</div>
		</div>

		<div class="container-site mt-16 sm:mt-20">
			<dl class="grid grid-cols-2 gap-x-6 gap-y-10 border-y border-white/10 py-10 lg:grid-cols-4" use:reveal={{ stagger: true }}>
				{#each stats as s}
					<div>
						<dd class="font-display text-4xl font-semibold tracking-tight text-white sm:text-5xl lg:text-6xl">
							<span use:countUp>{s.value}</span>{#if s.suffix}<span class="text-xl text-gold sm:text-2xl">{s.suffix}</span>{/if}
						</dd>
						<dt class="mt-2 text-sm text-grey">{s.label}</dt>
					</div>
				{/each}
			</dl>
		</div>
	</section>

	<!-- Process -->
	<section bind:this={processSection} class="bg-night-2 py-20 sm:py-28">
		<div class="container-site grid gap-12 lg:grid-cols-12">
			<div class="lg:col-span-5">
				<div class="lg:sticky lg:top-32" use:reveal>
					<p class="kicker">How we work</p>
					<h2 class="h-section mt-5 text-white">We make things simple.</h2>
					<p class="mt-6 text-lg text-grey">A dedicated point of contact from your first call to final handover — so you always know what’s happening, and when.</p>
					<a href="/contact" class="btn-gold mt-9">Start a project</a>
				</div>
			</div>
			<div class="relative lg:col-span-7">
				<div class="absolute bottom-6 left-[1.35rem] top-6 w-px bg-white/10 sm:left-7"></div>
				<div bind:this={processLine} class="absolute bottom-6 left-[1.35rem] top-6 w-px origin-top bg-gold sm:left-7" style="transform: scaleY(0)"></div>
				<ol class="space-y-6">
					{#each process as p, i}
						<li bind:this={processSteps[i]} class="process-step relative grid grid-cols-[2.75rem_1fr] gap-5 sm:grid-cols-[3.5rem_1fr] sm:gap-8" use:reveal>
							<span class="step-dot relative z-10 mt-1 flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-night-2 font-display text-sm font-semibold text-white/70 transition duration-500 sm:h-14 sm:w-14 sm:text-base">{p.step}</span>
							<div class="step-card rounded-[1.25rem] border border-white/[0.06] bg-night p-6 transition duration-500 sm:p-8">
								<h3 class="font-display text-2xl font-semibold text-white">{p.title}</h3>
								<p class="mt-3 text-grey">{p.text}</p>
							</div>
						</li>
					{/each}
				</ol>
			</div>
		</div>
	</section>

	<!-- Trades: a typographic index, no icons -->
	<section class="py-20 sm:py-28">
		<div class="container-site">
			<div class="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between" use:reveal>
				<div class="max-w-xl">
					<p class="kicker">Maintenance</p>
					<h2 class="h-section mt-5 text-white">Every trade. One call.</h2>
				</div>
				<a href="/maintenance" class="btn-ghost self-start sm:self-auto">All maintenance services</a>
			</div>
			<ol class="mt-12 grid gap-x-12 sm:grid-cols-2 lg:grid-cols-3" use:reveal={{ stagger: true }}>
				{#each trades as t, i}
					<li class="border-b border-white/10">
						<a href="/maintenance" class="group flex items-baseline gap-4 py-4 transition hover:text-gold">
							<span class="w-6 shrink-0 font-display text-xs text-gold/70">{String(i + 1).padStart(2, '0')}</span>
							<span class="font-display text-lg font-medium text-white transition group-hover:text-gold sm:text-xl">{t.title}</span>
						</a>
					</li>
				{/each}
			</ol>
		</div>
	</section>

	<Testimonials />
	<Accreditations />

	<!-- Ecologi -->
	<section class="py-20 sm:py-28">
		<div class="container-site grid items-center gap-12 lg:grid-cols-12">
			<div class="relative order-2 overflow-hidden rounded-[1.5rem] lg:order-1 lg:col-span-6" use:reveal>
				<div class="aspect-[4/3]">
					<img src={ecologi.image} alt="Our Ecologi forest" class="h-[120%] w-full object-cover" loading="lazy" use:parallax={{ speed: 0.25 }} />
				</div>
			</div>
			<div class="order-1 lg:order-2 lg:col-span-5 lg:col-start-8" use:reveal={{ stagger: true }}>
				<p class="kicker">Sustainability</p>
				<h2 class="h-section mt-5 text-white">{ecologi.title}</h2>
				<p class="mt-6 text-lg text-grey">{ecologi.text}</p>
				<a href="/about#ecologi" class="btn-ghost mt-8">Our eco commitment</a>
			</div>
		</div>
	</section>

	<CtaBand />
</div>

<style>
	@keyframes scrollcue {
		0% { transform: translateY(-100%); }
		60%, 100% { transform: translateY(200%); }
	}
	:global(.process-step.is-active .step-dot) {
		border-color: #c09a51;
		background: #c09a51;
		color: #080c14;
		box-shadow: 0 0 0 8px rgba(192, 154, 81, 0.15);
	}
	:global(.process-step.is-active .step-card) {
		border-color: rgba(192, 154, 81, 0.4);
	}
</style>
