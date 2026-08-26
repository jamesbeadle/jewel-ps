<script>
	import { page } from '$app/stores';
	import { site } from '$lib/site.js';

	let { data, children } = $props();

	const onLogin = $derived($page.url.pathname === '/admin/login');

	const links = [
		{ label: 'Dashboard', href: '/admin', exact: true },
		{ label: 'Enquiries', href: '/admin/enquiries', exact: false }
	];

	/** @param {{ href: string, exact: boolean }} link */
	function isActive(link) {
		const p = $page.url.pathname;
		return link.exact ? p === link.href : p.startsWith(link.href);
	}
</script>

<svelte:head>
	<meta name="robots" content="noindex, nofollow" />
</svelte:head>

<div class="min-h-screen bg-night text-white">
	{#if !onLogin}
		<nav class="sticky top-0 z-50 border-b border-gold/30 bg-night-2/95 backdrop-blur" aria-label="Admin">
			<div class="container-site flex flex-wrap items-center gap-x-6 gap-y-2 py-3">
				<a href="/admin" class="mr-auto flex items-center gap-3" aria-label="Admin dashboard">
					<img src={site.logo} alt="" class="h-7 w-auto" width="290" height="94" />
					<span class="font-display text-sm font-semibold tracking-wide text-gold">Admin</span>
				</a>

				<ul class="order-3 flex w-full gap-1 sm:order-none sm:w-auto">
					{#each links as link (link.href)}
						{@const active = isActive(link)}
						<li>
							<a
								href={link.href}
								aria-current={active ? 'page' : undefined}
								class="inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 font-display text-sm font-medium transition {active
									? 'bg-blue/25 text-white ring-1 ring-inset ring-blue-light/60'
									: 'text-grey hover:bg-white/[0.06] hover:text-white'}"
							>
								{link.label}
								{#if link.href === '/admin/enquiries' && data.newEnquiries > 0}
									<span class="rounded-full bg-gold px-1.5 py-px text-[11px] font-semibold leading-4 text-night">{data.newEnquiries}</span>
								{/if}
							</a>
						</li>
					{/each}
				</ul>

				<div class="flex items-center gap-4">
					<a href="/" target="_blank" rel="noopener" class="text-sm text-grey transition hover:text-gold">View site ↗</a>
					<form method="POST" action="/admin/logout">
						<button class="rounded-full border border-white/25 px-3.5 py-1.5 font-display text-xs font-semibold text-white transition hover:border-gold hover:text-gold">Log out</button>
					</form>
				</div>
			</div>
		</nav>
	{/if}

	<div class="container-site py-8 sm:py-10">
		{@render children()}
	</div>
</div>
