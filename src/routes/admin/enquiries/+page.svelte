<script>
	import { enhance } from '$app/forms';
	import { invalidateAll } from '$app/navigation';
	import Icon from '$lib/components/Icon.svelte';

	let { data, form } = $props();

	/** @type {Set<string>} ids currently expanded */
	let open = $state(new Set());
	/** @type {string | null} id awaiting delete confirmation */
	let confirmDelete = $state(null);

	/** @param {string} iso */
	function fmt(iso) {
		return new Date(iso).toLocaleString('en-GB', {
			weekday: 'short',
			day: 'numeric',
			month: 'short',
			year: 'numeric',
			hour: '2-digit',
			minute: '2-digit',
			timeZone: 'Europe/London'
		});
	}

	/** @param {string} iso */
	function ago(iso) {
		const mins = Math.floor((Date.now() - new Date(iso).getTime()) / 60_000);
		if (mins < 1) return 'just now';
		if (mins < 60) return `${mins}m ago`;
		const hrs = Math.floor(mins / 60);
		if (hrs < 24) return `${hrs}h ago`;
		const days = Math.floor(hrs / 24);
		if (days < 7) return `${days}d ago`;
		return new Date(iso).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', timeZone: 'Europe/London' });
	}

	/**
	 * Expanding an unread enquiry marks it read in the background,
	 * like opening an email.
	 * @param {import('$lib/server/db.js').EnquiryRow} r
	 */
	async function toggle(r) {
		const next = new Set(open);
		if (next.has(r.id)) next.delete(r.id);
		else next.add(r.id);
		open = next;

		if (!next.has(r.id) || r.status !== 'new') return;
		const body = new FormData();
		body.set('id', r.id);
		try {
			await fetch('?/markRead', { method: 'POST', body, headers: { 'x-sveltekit-action': 'true' } });
			await invalidateAll();
		} catch {
			/* leave it unread — the explicit button still works */
		}
	}

	/** @param {string} id */
	function pageHref(id) {
		const p = new URLSearchParams();
		if (data.view === 'archived') p.set('view', 'archived');
		p.set('page', id);
		return `?${p.toString()}`;
	}

	/** @param {string} s */
	function mailtoFor(s) {
		return `mailto:${s}?subject=${encodeURIComponent('Re: your enquiry to Jewel Property Serve')}`;
	}

	const btn =
		'inline-flex items-center gap-1.5 rounded-full border border-white/15 px-3 py-1.5 font-display text-xs font-semibold text-grey transition hover:border-gold hover:text-gold disabled:opacity-50';
</script>

<svelte:head>
	<title>Enquiries | Admin | Jewel Property Serve</title>
</svelte:head>

<header class="flex flex-wrap items-end justify-between gap-4">
	<div>
		<p class="kicker">Website enquiries</p>
		<h1 class="mt-3 text-3xl sm:text-4xl">Inbox</h1>
		<p class="mt-1 text-sm text-grey">
			Requests from the contact form. Unread ones are highlighted; opening one marks it read.
		</p>
	</div>

	<nav class="flex gap-1 rounded-full border border-white/10 bg-night-2 p-1" aria-label="Inbox view">
		<a
			href="/admin/enquiries"
			class="rounded-full px-4 py-1.5 font-display text-sm font-medium transition {data.view === 'inbox' ? 'bg-blue/30 text-white' : 'text-grey hover:text-white'}"
			aria-current={data.view === 'inbox' ? 'page' : undefined}
		>
			Inbox
			{#if data.newCount > 0}<span class="ml-1 rounded-full bg-gold px-1.5 text-[11px] font-semibold text-night">{data.newCount}</span>{/if}
		</a>
		<a
			href="/admin/enquiries?view=archived"
			class="rounded-full px-4 py-1.5 font-display text-sm font-medium transition {data.view === 'archived' ? 'bg-blue/30 text-white' : 'text-grey hover:text-white'}"
			aria-current={data.view === 'archived' ? 'page' : undefined}
		>
			Archived <span class="ml-1 text-xs text-grey/70">{data.archivedCount}</span>
		</a>
	</nav>
</header>

{#if !data.configured}
	<div class="mt-8 max-w-3xl rounded-2xl border border-gold/30 bg-gold/10 px-5 py-4 text-sm leading-relaxed text-grey">
		<strong class="text-white">Supabase is not connected</strong> — set <code class="text-gold">SUPABASE_URL</code> and
		<code class="text-gold">SUPABASE_SERVICE_ROLE_KEY</code> to switch the inbox on.
	</div>
{:else if data.dbError}
	<div class="mt-8 max-w-3xl rounded-2xl border border-red-400/30 bg-red-500/10 px-5 py-4 text-sm text-grey">
		<strong class="text-white">Couldn't load enquiries.</strong>
		<code class="mt-2 block break-words text-xs text-red-200">{data.dbError}</code>
	</div>
{:else if form?.error}
	<p class="mt-6 rounded-xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-200" role="alert">{form.error}</p>
{/if}

{#if data.configured && !data.dbError}
	{#if data.rows.length === 0}
		<div class="card mt-8 max-w-3xl p-10 text-center">
			<span class="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-blue/20 text-blue-light"><Icon name="mail" size={26} /></span>
			<p class="mt-5 font-display text-lg font-semibold">
				{data.view === 'archived' ? 'Nothing archived' : 'No enquiries yet'}
			</p>
			<p class="mt-1 text-sm text-grey">
				{data.view === 'archived' ? 'Archived enquiries will be kept here.' : 'New quote requests from the website will appear here instantly.'}
			</p>
		</div>
	{:else}
		<ul class="mt-8 max-w-4xl space-y-3">
			{#each data.rows as r (r.id)}
				{@const expanded = open.has(r.id)}
				<li id="e-{r.id}" class="card overflow-hidden transition {r.status === 'new' ? '!border-gold/40' : ''}">
					<button
						type="button"
						class="flex w-full items-start gap-4 px-5 py-4 text-left transition hover:bg-white/[0.03]"
						onclick={() => toggle(r)}
						aria-expanded={expanded}
					>
						<span class="mt-2 h-2 w-2 shrink-0 rounded-full {r.status === 'new' ? 'bg-gold shadow-[0_0_0_3px_rgba(192,154,81,0.25)]' : 'bg-white/20'}" aria-hidden="true"></span>
						<span class="min-w-0 flex-1">
							<span class="flex flex-wrap items-baseline gap-x-3 gap-y-1">
								<span class="font-display font-semibold {r.status === 'new' ? 'text-white' : 'text-white/85'}">{r.name}</span>
								{#if r.service}
									<span class="rounded-full bg-blue/20 px-2 py-0.5 text-[11px] font-medium text-blue-light">{r.service}</span>
								{/if}
								{#if r.postcode}
									<span class="text-xs text-grey/70">{r.postcode}</span>
								{/if}
							</span>
							<span class="mt-1 block text-sm text-grey {expanded ? 'whitespace-pre-line' : 'truncate'}">{r.message}</span>
						</span>
						<span class="shrink-0 text-right text-xs text-grey/70">
							<time datetime={r.created_at} title={fmt(r.created_at)}>{ago(r.created_at)}</time>
							<span class="mt-1 block text-gold transition {expanded ? 'rotate-180' : ''}">▾</span>
						</span>
					</button>

					{#if expanded}
						<div class="border-t border-white/[0.06] bg-night-3/40 px-5 py-4">
							<dl class="grid gap-x-8 gap-y-2 text-sm sm:grid-cols-2">
								<div class="flex items-center gap-2">
									<dt class="sr-only">Email</dt>
									<span class="text-blue-light"><Icon name="mail" size={16} /></span>
									<dd><a href={mailtoFor(r.email)} class="text-white underline-offset-2 hover:text-gold hover:underline">{r.email}</a></dd>
								</div>
								<div class="flex items-center gap-2">
									<dt class="sr-only">Phone</dt>
									<span class="text-blue-light"><Icon name="phone" size={16} /></span>
									<dd>
										{#if r.phone}<a href="tel:{r.phone.replace(/\s+/g, '')}" class="text-white hover:text-gold">{r.phone}</a>{:else}<span class="text-grey/60">No phone given</span>{/if}
									</dd>
								</div>
								<div class="flex items-center gap-2">
									<dt class="sr-only">Postcode</dt>
									<span class="text-blue-light"><Icon name="pin" size={16} /></span>
									<dd class="text-white">{r.postcode || '—'}</dd>
								</div>
								<div class="flex items-center gap-2">
									<dt class="sr-only">Received</dt>
									<span class="text-blue-light"><Icon name="clock" size={16} /></span>
									<dd class="text-white">{fmt(r.created_at)}</dd>
								</div>
							</dl>

							<div class="mt-4 flex flex-wrap items-center gap-2">
								<a href={mailtoFor(r.email)} class="btn-gold !px-4 !py-2 !text-xs">Reply by email</a>

								{#if r.status === 'archived'}
									<form method="POST" action="?/restore" use:enhance>
										<input type="hidden" name="id" value={r.id} />
										<button class={btn}>Restore to inbox</button>
									</form>
								{:else}
									{#if r.status === 'new'}
										<form method="POST" action="?/markRead" use:enhance>
											<input type="hidden" name="id" value={r.id} />
											<button class={btn}>Mark read</button>
										</form>
									{:else}
										<form method="POST" action="?/markUnread" use:enhance>
											<input type="hidden" name="id" value={r.id} />
											<button class={btn}>Mark unread</button>
										</form>
									{/if}
									<form method="POST" action="?/archive" use:enhance>
										<input type="hidden" name="id" value={r.id} />
										<button class={btn}>Archive</button>
									</form>
								{/if}

								<span class="ml-auto"></span>
								{#if confirmDelete === r.id}
									<form method="POST" action="?/remove" use:enhance={() => { confirmDelete = null; return async ({ update }) => update(); }}>
										<input type="hidden" name="id" value={r.id} />
										<span class="mr-2 text-xs text-red-200">Delete permanently?</span>
										<button class="{btn} !border-red-400/50 !text-red-200 hover:!border-red-300">Yes, delete</button>
									</form>
									<button type="button" class={btn} onclick={() => (confirmDelete = null)}>Cancel</button>
								{:else}
									<button type="button" class="{btn} !border-transparent text-grey/60 hover:!border-red-400/50 hover:!text-red-200" onclick={() => (confirmDelete = r.id)}>Delete</button>
								{/if}
							</div>
						</div>
					{/if}
				</li>
			{/each}
		</ul>

		{#if data.totalPages > 1}
			<nav class="mt-8 flex max-w-4xl items-center justify-between text-sm text-grey" aria-label="Pagination">
				{#if data.page > 1}
					<a href={pageHref(String(data.page - 1))} class={btn}>← Newer</a>
				{:else}<span></span>{/if}
				<span>Page {data.page} of {data.totalPages} · {data.total} total</span>
				{#if data.page < data.totalPages}
					<a href={pageHref(String(data.page + 1))} class={btn}>Older →</a>
				{:else}<span></span>{/if}
			</nav>
		{/if}
	{/if}
{/if}
