<script>
	import '../app.css';
	import { page } from '$app/stores';
	import { nav, contact, social, group, img } from '$lib/site.js';

	let { children } = $props();
	let menuOpen = $state(false);

	$effect(() => {
		// close mobile menu on navigation
		$page.url.pathname;
		menuOpen = false;
	});
</script>

<div class="flex min-h-screen flex-col bg-white text-ink">
	<!-- Top bar -->
	<div class="bg-ink text-white/70">
		<div class="mx-auto flex max-w-6xl items-center justify-between px-6 py-2 text-xs">
			<div class="flex items-center gap-5">
				<a href={contact.phoneHref} class="transition hover:text-gold">{contact.phone}</a>
				<a href="mailto:{contact.email}" class="hidden transition hover:text-gold sm:inline"
					>{contact.email}</a
				>
			</div>
			<div class="hidden items-center gap-4 md:flex">
				<span class="text-white/40">Part of the Jewel Enterprises group</span>
				<a href="https://jewelbb.co.uk/" class="transition hover:text-gold">Bespoke Build</a>
				<a href="https://www.jewelpfp.co.uk/" class="transition hover:text-gold"
					>Passive Fire Protection</a
				>
			</div>
		</div>
	</div>

	<!-- Header -->
	<header class="sticky top-0 z-50 border-b border-ink/5 bg-white/90 backdrop-blur">
		<nav class="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
			<a href="/" class="flex items-center gap-3">
				<img src={img('Logo_Jewel-Property-Serve.png')} alt="Jewel Property Serve" class="h-10 w-auto" />
			</a>

			<div class="hidden items-center gap-8 lg:flex">
				{#each nav as item}
					<a
						href={item.href}
						class="text-sm font-medium transition hover:text-gold-dark
						{$page.url.pathname === item.href ? 'text-gold-dark' : 'text-ink-mute'}"
					>
						{item.label}
					</a>
				{/each}
				<a href="/contact" class="btn-gold !px-5 !py-2.5">Free quote</a>
			</div>

			<button
				class="p-2 lg:hidden"
				onclick={() => (menuOpen = !menuOpen)}
				aria-label="Toggle menu"
				aria-expanded={menuOpen}
			>
				<svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
					{#if menuOpen}
						<path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
					{:else}
						<path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16" />
					{/if}
				</svg>
			</button>
		</nav>

		{#if menuOpen}
			<div class="border-t border-ink/5 bg-white px-6 py-4 lg:hidden">
				<div class="flex flex-col gap-4">
					{#each nav as item}
						<a href={item.href} class="text-sm font-medium text-ink-mute hover:text-gold-dark">
							{item.label}
						</a>
					{/each}
					<a href="/contact" class="btn-gold w-full">Request your free quote</a>
				</div>
			</div>
		{/if}
	</header>

	<main class="flex-1">
		{@render children()}
	</main>

	<!-- Footer -->
	<footer class="bg-ink text-white/60">
		<div class="mx-auto max-w-6xl px-6 py-16">
			<div class="grid gap-12 md:grid-cols-4">
				<div class="md:col-span-2">
					<img
						src={img('Jewel-Property-Serve.webp')}
						alt="Jewel Property Serve"
						class="h-12 w-auto"
					/>
					<p class="mt-5 max-w-sm text-sm leading-relaxed">
						Your responsive partner for high-end property and estate maintenance across London and
						the South East.
					</p>
					<div class="mt-6 flex gap-4">
						<a href={social.facebook} aria-label="Facebook" class="transition hover:text-gold">
							<svg class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.07C24 5.4 18.63 0 12 0S0 5.4 0 12.07C0 18.1 4.39 23.09 10.13 24v-8.44H7.08v-3.49h3.04V9.41c0-3.02 1.79-4.7 4.53-4.7 1.31 0 2.68.24 2.68.24v2.97h-1.5c-1.5 0-1.96.93-1.96 1.89v2.26h3.32l-.53 3.49h-2.8V24C19.62 23.09 24 18.1 24 12.07z"/></svg>
						</a>
						<a href={social.instagram} aria-label="Instagram" class="transition hover:text-gold">
							<svg class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.16c3.2 0 3.58.01 4.85.07 3.25.15 4.77 1.69 4.92 4.92.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.15 3.23-1.66 4.77-4.92 4.92-1.27.06-1.64.07-4.85.07s-3.58-.01-4.85-.07c-3.26-.15-4.77-1.7-4.92-4.92C2.17 15.58 2.16 15.2 2.16 12s.01-3.58.07-4.85C2.38 3.92 3.9 2.38 7.15 2.23 8.42 2.17 8.8 2.16 12 2.16zM12 0C8.74 0 8.33.01 7.05.07 2.7.27.27 2.69.07 7.05.01 8.33 0 8.74 0 12s.01 3.67.07 4.95c.2 4.36 2.62 6.78 6.98 6.98C8.33 23.99 8.74 24 12 24s3.67-.01 4.95-.07c4.35-.2 6.78-2.62 6.98-6.98.06-1.28.07-1.69.07-4.95s-.01-3.67-.07-4.95c-.2-4.35-2.62-6.78-6.98-6.98C15.67.01 15.26 0 12 0zm0 5.84A6.16 6.16 0 1 0 18.16 12 6.16 6.16 0 0 0 12 5.84zm0 10.15A3.99 3.99 0 1 1 16 12a3.99 3.99 0 0 1-4 3.99zm6.41-11.85a1.44 1.44 0 1 0 1.43 1.44 1.44 1.44 0 0 0-1.43-1.44z"/></svg>
						</a>
						<a href={social.linkedin} aria-label="LinkedIn" class="transition hover:text-gold">
							<svg class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05a3.74 3.74 0 0 1 3.37-1.85c3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.07 2.07 0 1 1 0-4.13 2.07 2.07 0 0 1 0 4.13zM7.12 20.45H3.56V9h3.56v11.45zM22.23 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.46c.98 0 1.77-.77 1.77-1.72V1.72C24 .77 23.21 0 22.23 0z"/></svg>
						</a>
					</div>
				</div>

				<div>
					<h3 class="text-xs font-semibold uppercase tracking-[0.2em] text-gold">Services</h3>
					<ul class="mt-5 space-y-3 text-sm">
						<li><a href="/refurbishment" class="transition hover:text-gold">Refurbishment</a></li>
						<li><a href="/maintenance" class="transition hover:text-gold">Maintenance</a></li>
						<li>
							<a href="/fire-flood-restoration" class="transition hover:text-gold"
								>Fire & Flood Restoration</a
							>
						</li>
						<li><a href="/contact" class="transition hover:text-gold">24hr Emergency Callout</a></li>
					</ul>
				</div>

				<div>
					<h3 class="text-xs font-semibold uppercase tracking-[0.2em] text-gold">Contact</h3>
					<ul class="mt-5 space-y-3 text-sm">
						<li><a href={contact.phoneHref} class="transition hover:text-gold">{contact.phone}</a></li>
						<li>
							<a href="mailto:{contact.email}" class="transition hover:text-gold">{contact.email}</a>
						</li>
						<li>{contact.address}</li>
					</ul>
				</div>
			</div>

			<div class="mt-14 border-t border-white/10 pt-8">
				<div class="flex flex-col justify-between gap-4 text-xs md:flex-row md:items-center">
					<span>© {new Date().getFullYear()} Jewel Property Serve Ltd. All rights reserved.</span>
					<div class="flex flex-wrap gap-x-5 gap-y-2">
						{#each group as company}
							<a href={company.href} class="transition hover:text-gold">{company.name}</a>
						{/each}
					</div>
				</div>
			</div>
		</div>
	</footer>
</div>
