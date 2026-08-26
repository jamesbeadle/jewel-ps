<script>
	import Icon from '$lib/components/Icon.svelte';

	let { data } = $props();

	const today = new Date().toLocaleDateString('en-GB', {
		weekday: 'long',
		day: 'numeric',
		month: 'long',
		timeZone: 'Europe/London'
	});

	/** @param {string} iso */
	function when(iso) {
		const d = new Date(iso);
		const days = Math.floor((Date.now() - d.getTime()) / 86_400_000);
		if (days === 0) return 'Today';
		if (days === 1) return 'Yesterday';
		return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', timeZone: 'Europe/London' });
	}
</script>

<svelte:head>
	<title>Admin | Jewel Property Serve</title>
</svelte:head>

<header class="flex flex-wrap items-end justify-between gap-4">
	<div>
		<p class="kicker">Jewel Property Serve</p>
		<h1 class="mt-3 text-3xl sm:text-4xl">Dashboard</h1>
		<p class="mt-1 text-grey">{today}</p>
	</div>
</header>

{#if !data.configured}
	<div class="mt-8 max-w-3xl rounded-2xl border border-gold/30 bg-gold/10 px-5 py-4 text-sm leading-relaxed text-grey">
		<strong class="text-white">Supabase is not connected yet.</strong> Set
		<code class="text-gold">SUPABASE_URL</code> and <code class="text-gold">SUPABASE_SERVICE_ROLE_KEY</code>
		environment variables, run <code class="text-gold">supabase/schema.sql</code> in the Supabase SQL editor, then redeploy.
		Until then the contact form still delivers via the webhook — enquiries just won't be stored here.
	</div>
{:else if data.dbError}
	<div class="mt-8 max-w-3xl rounded-2xl border border-red-400/30 bg-red-500/10 px-5 py-4 text-sm leading-relaxed text-grey">
		<strong class="text-white">Supabase is configured but unreachable</strong> — check the keys, and that
		<code class="text-gold">supabase/schema.sql</code> has been run.
		<code class="mt-2 block break-words text-xs text-red-200">{data.dbError}</code>
	</div>
{/if}

<!-- Enquiries hero card -->
<a
	href="/admin/enquiries"
	class="card mt-8 flex max-w-4xl items-center gap-5 p-6 transition hover:-translate-y-0.5 hover:border-gold/40 sm:gap-7 sm:p-7 {data.newEnquiryCount > 0 ? '!border-gold/40 bg-gradient-to-r from-night-2 to-gold/10' : ''}"
>
	<span class="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl {data.newEnquiryCount > 0 ? 'bg-gold text-night' : 'bg-blue/25 text-blue-light'}">
		<Icon name="mail" size={26} />
	</span>
	<span class="min-w-0 flex-1">
		<span class="flex items-center gap-3">
			<span class="font-display text-xl font-semibold">Enquiries</span>
			{#if data.newEnquiryCount > 0}
				<span class="rounded-full bg-gold px-2.5 py-0.5 font-display text-xs font-semibold text-night">{data.newEnquiryCount} new</span>
			{/if}
		</span>
		<span class="mt-1 block text-sm text-grey">
			{#if data.enquiryCount === null}
				Quote requests from the website will land here once Supabase is connected.
			{:else if data.newEnquiryCount > 0}
				You have {data.newEnquiryCount} unread enquir{data.newEnquiryCount === 1 ? 'y' : 'ies'} waiting for a reply.
			{:else if data.enquiryCount === 0}
				No enquiries yet — new requests from the contact form will appear here instantly.
			{:else}
				All caught up — {data.enquiryCount} enquir{data.enquiryCount === 1 ? 'y' : 'ies'} in the inbox, nothing unread.
			{/if}
		</span>
	</span>
	<span class="hidden shrink-0 font-display text-sm font-semibold text-gold sm:block">Open inbox →</span>
</a>

{#if data.configured && !data.dbError}
	<div class="mt-5 grid max-w-4xl gap-4 sm:grid-cols-3">
		<div class="card p-5">
			<p class="font-display text-[11px] font-semibold uppercase tracking-kicker text-grey">Unread</p>
			<p class="mt-2 font-display text-3xl font-semibold text-gold">{data.newEnquiryCount}</p>
		</div>
		<div class="card p-5">
			<p class="font-display text-[11px] font-semibold uppercase tracking-kicker text-grey">Last 7 days</p>
			<p class="mt-2 font-display text-3xl font-semibold">{data.weekCount}</p>
		</div>
		<div class="card p-5">
			<p class="font-display text-[11px] font-semibold uppercase tracking-kicker text-grey">In inbox</p>
			<p class="mt-2 font-display text-3xl font-semibold">{data.enquiryCount ?? 0}</p>
		</div>
	</div>
{/if}

{#if data.recentEnquiries.length > 0}
	<h2 class="mt-10 font-display text-[11px] font-semibold uppercase tracking-kicker text-grey">Recent</h2>
	<ul class="mt-3 max-w-4xl divide-y divide-white/[0.06] overflow-hidden rounded-2xl border border-white/[0.06] bg-night-2/60">
		{#each data.recentEnquiries as r (r.id)}
			<li>
				<a href="/admin/enquiries#e-{r.id}" class="flex items-center gap-4 px-5 py-3.5 text-sm transition hover:bg-white/[0.04]">
					<span class="h-2 w-2 shrink-0 rounded-full {r.status === 'new' ? 'bg-gold shadow-[0_0_0_3px_rgba(192,154,81,0.25)]' : 'bg-white/20'}" aria-hidden="true"></span>
					<span class="shrink-0 font-semibold text-white">{r.name}</span>
					<span class="hidden shrink-0 text-grey/70 sm:inline">{r.service}</span>
					<span class="min-w-0 flex-1 truncate text-grey">{r.message}</span>
					<span class="shrink-0 text-xs text-grey/70">{when(r.created_at)}</span>
				</a>
			</li>
		{/each}
	</ul>
{/if}
