<script>
	import '../app.css';
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { nav, contact, social, site } from '$lib/site.js';
	import { initMotionPreference } from '$lib/motion.js';

	let { children } = $props();
	let menuOpen = $state(false);
	let scrollY = $state(0);
	let innerHeight = $state(800);
	const scrolled = $derived(scrollY > 24);
	// The mobile call bar only appears once the hero (and its own CTA) has scrolled away.
	const showCallBar = $derived(scrollY > innerHeight * 0.9 && $page.url.pathname !== '/contact');

	$effect(() => {
		$page.url.pathname;
		menuOpen = false;
	});

	$effect(() => {
		if (typeof document === 'undefined') return;
		document.documentElement.style.overflow = menuOpen ? 'hidden' : '';
	});

	onMount(() => {
		initMotionPreference();
	});

	const jsonLd = JSON.stringify({
		'@context': 'https://schema.org',
		'@type': 'LocalBusiness',
		'@id': `${site.url}/#business`,
		name: site.legalName,
		url: site.url,
		logo: `${site.url}${site.logoPng}`,
		image: `${site.url}/og-image.png`,
		description: site.description,
		telephone: '+442081091012',
		email: contact.email,
		address: {
			'@type': 'PostalAddress',
			streetAddress: '48 Warwick Street',
			addressLocality: 'London',
			postalCode: 'W1B 5AW',
			addressCountry: 'GB'
		},
		areaServed: ['London', 'South East England'],
		openingHours: 'Mo-Su 00:00-24:00',
		sameAs: Object.values(social)
	});
</script>

<svelte:window bind:scrollY bind:innerHeight />

<svelte:head>
	{@html `<script type="application/ld+json">${jsonLd}</script>`}
</svelte:head>

<a href="#main" class="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-gold focus:px-5 focus:py-3 focus:text-night">
	Skip to content
</a>

<!-- Header (no backdrop-filter here: it would become the containing block for the fixed menu) -->
<header class="fixed inset-x-0 top-0 z-50 transition-colors duration-500 {scrolled && !menuOpen ? 'bg-night/95 shadow-[0_1px_0_0_rgba(255,255,255,0.06)]' : 'bg-transparent'}">
	<div class="container-site flex items-center justify-between transition-[padding] duration-500 {scrolled ? 'py-3.5' : 'py-5 lg:py-7'}">
		<a href="/" class="relative z-[70] flex items-center" aria-label="Jewel Property Serve — home">
			<img src={site.logo} alt="Jewel Property Serve" class="h-9 w-auto sm:h-10 lg:h-12" width="290" height="94" />
		</a>

		<nav class="hidden items-center gap-9 lg:flex" aria-label="Primary">
			{#each nav as item}
				{@const active = item.href === '/' ? $page.url.pathname === '/' : $page.url.pathname.startsWith(item.href)}
				<a
					href={item.href}
					class="relative font-display text-[15px] font-medium tracking-wide transition hover:text-gold {active ? 'text-gold' : 'text-white/85'}"
					aria-current={active ? 'page' : undefined}
				>
					{item.label}
					<span class="absolute -bottom-2 left-0 h-px bg-gold transition-all duration-300 {active ? 'w-full' : 'w-0'}"></span>
				</a>
			{/each}
		</nav>

		<div class="hidden items-center gap-7 lg:flex">
			<a href={contact.phoneHref} class="font-display text-[15px] font-semibold text-white transition hover:text-gold">{contact.phone}</a>
			<a href="/contact" class="btn-gold !px-6 !py-3">Free quote</a>
		</div>

		<button
			class="relative z-[70] -mr-2 flex h-11 w-11 items-center justify-center text-white lg:hidden"
			onclick={() => (menuOpen = !menuOpen)}
			aria-label={menuOpen ? 'Close menu' : 'Open menu'}
			aria-expanded={menuOpen}
			aria-controls="mobile-menu"
		>
			<span class="relative block h-3.5 w-6">
				<span class="absolute left-0 top-0 h-[1.5px] w-full bg-current transition-all duration-300 {menuOpen ? 'top-[6px] rotate-45' : ''}"></span>
				<span class="absolute left-0 top-[12px] h-[1.5px] w-full bg-current transition-all duration-300 {menuOpen ? 'top-[6px] -rotate-45' : ''}"></span>
			</span>
		</button>
	</div>
</header>

<!-- Mobile menu: a sibling of the header so it is truly viewport-fixed -->
<div
	id="mobile-menu"
	class="fixed inset-0 z-[60] flex flex-col bg-night transition-opacity duration-300 lg:hidden {menuOpen ? 'visible opacity-100' : 'invisible opacity-0'}"
	aria-hidden={!menuOpen}
>
	<nav class="container-site flex flex-1 flex-col justify-center" aria-label="Mobile">
		{#each nav as item, i}
			{@const active = item.href === '/' ? $page.url.pathname === '/' : $page.url.pathname.startsWith(item.href)}
			<a
				href={item.href}
				class="border-b border-white/10 py-4 font-display text-[2rem] font-semibold leading-none transition-all duration-500 {active ? 'text-gold' : 'text-white'} {menuOpen ? 'translate-y-0 opacity-100' : 'translate-y-3 opacity-0'}"
				style="transition-delay: {menuOpen ? 60 + i * 40 : 0}ms"
				tabindex={menuOpen ? 0 : -1}
			>
				{item.label}
			</a>
		{/each}
	</nav>
	<div class="container-site pb-[max(2rem,env(safe-area-inset-bottom))]">
		<a href={contact.phoneHref} class="btn-gold w-full" tabindex={menuOpen ? 0 : -1}>Call {contact.phone}</a>
		<p class="mt-4 text-center text-xs text-grey">24-hour emergency callout · {contact.email}</p>
	</div>
</div>

<main id="main" class="relative">
	{@render children()}
</main>

<!-- Footer -->
<footer class="relative border-t border-white/[0.06] bg-night text-grey">
	<div class="container-site py-16 sm:py-20">
		<div class="grid gap-12 lg:grid-cols-12">
			<div class="lg:col-span-5">
				<img src={site.logo} alt="Jewel Property Serve" class="h-12 w-auto" loading="lazy" />
				<p class="mt-6 max-w-sm leading-relaxed">
					Your responsive partner for high-end property and estate maintenance across London and the South East. A family business, trusted for over twenty years.
				</p>
				<div class="mt-7 flex flex-wrap gap-x-5 gap-y-2 text-sm">
					<a href={social.instagram} target="_blank" rel="noopener" class="transition hover:text-gold">Instagram</a>
					<a href={social.linkedin} target="_blank" rel="noopener" class="transition hover:text-gold">LinkedIn</a>
					<a href={social.facebook} target="_blank" rel="noopener" class="transition hover:text-gold">Facebook</a>
					<a href={social.checkatrade} target="_blank" rel="noopener" class="transition hover:text-gold">Checkatrade</a>
				</div>
			</div>

			<div class="grid gap-10 sm:grid-cols-3 lg:col-span-7">
				<div>
					<h3 class="font-display text-[11px] font-semibold uppercase tracking-kicker text-gold">Services</h3>
					<ul class="mt-5 space-y-3 text-sm">
						<li><a href="/refurbishment" class="transition hover:text-gold">Refurbishment</a></li>
						<li><a href="/maintenance" class="transition hover:text-gold">Maintenance</a></li>
						<li><a href="/fire-flood-restoration" class="transition hover:text-gold">Fire &amp; Flood Restoration</a></li>
						<li><a href="/contact" class="transition hover:text-gold">24hr Emergency Callout</a></li>
						<li><a href="/maintenance#managing-agents" class="transition hover:text-gold">Managing Agents</a></li>
					</ul>
				</div>
				<div>
					<h3 class="font-display text-[11px] font-semibold uppercase tracking-kicker text-gold">Company</h3>
					<ul class="mt-5 space-y-3 text-sm">
						<li><a href="/about" class="transition hover:text-gold">About us</a></li>
						<li><a href="/about#values" class="transition hover:text-gold">Our values</a></li>
						<li><a href="/about#ecologi" class="transition hover:text-gold">Sustainability</a></li>
						<li><a href="/contact#faqs" class="transition hover:text-gold">FAQs</a></li>
						<li><a href="/contact#careers" class="transition hover:text-gold">Careers</a></li>
					</ul>
				</div>
				<div>
					<h3 class="font-display text-[11px] font-semibold uppercase tracking-kicker text-gold">Contact</h3>
					<ul class="mt-5 space-y-3 text-sm">
						<li><a href={contact.phoneHref} class="font-display text-base font-semibold text-white transition hover:text-gold">{contact.phone}</a></li>
						<li><a href="mailto:{contact.email}" class="transition hover:text-gold">{contact.email}</a></li>
						<li class="leading-relaxed">
							{#each contact.addressLines as line, i}{line}{#if i < contact.addressLines.length - 1}<br />{/if}{/each}
						</li>
						<li class="text-xs text-grey/70">Emergency callout 24/7, 365 days</li>
					</ul>
				</div>
			</div>
		</div>

		<div class="mt-16 flex flex-col gap-3 border-t border-white/[0.06] pt-8 text-xs text-grey/60 sm:flex-row sm:items-center sm:justify-between">
			<span>© {new Date().getFullYear()} Jewel Property Serve Ltd. All rights reserved.</span>
			<div class="flex gap-5">
				<a href="/documents/terms-and-conditions.pdf" class="transition hover:text-gold">Terms &amp; conditions</a>
				<a href="/privacy" class="transition hover:text-gold">Privacy</a>
			</div>
		</div>
	</div>
	<!-- spacer so the mobile call bar never covers the footer -->
	<div class="h-20 lg:hidden"></div>
</footer>

<!-- Mobile call bar: one action, only after the hero has gone -->
<div
	class="fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-night/95 px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] transition-transform duration-500 lg:hidden {showCallBar ? 'translate-y-0' : 'translate-y-full'}"
	aria-hidden={!showCallBar}
>
	<div class="flex items-center justify-between gap-4">
		<a href="/contact" class="font-display text-sm font-semibold text-white/85" tabindex={showCallBar ? 0 : -1}>Request a free quote →</a>
		<a href={contact.phoneHref} class="btn-gold !px-5 !py-2.5" tabindex={showCallBar ? 0 : -1}>Call {contact.phone}</a>
	</div>
</div>
