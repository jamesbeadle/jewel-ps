<script>
	import { enhance } from '$app/forms';
	import { invalidateAll } from '$app/navigation';

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
</script>

<svelte:head>
	<title>Enquiries | Admin | Jewel Property Serve</title>
</svelte:head>

<header class="head">
	<div>
		<h1>Enquiries</h1>
		<p class="head__sub">
			Requests from the contact form. Unread ones are highlighted; opening one marks it read.
		</p>
	</div>

	<nav class="tabs" aria-label="Inbox view">
		<a href="/admin/enquiries" class="tab" class:tab--on={data.view === 'inbox'} aria-current={data.view === 'inbox' ? 'page' : undefined}>
			Inbox
			{#if data.newCount > 0}<span class="tab__badge">{data.newCount}</span>{/if}
		</a>
		<a href="/admin/enquiries?view=archived" class="tab" class:tab--on={data.view === 'archived'} aria-current={data.view === 'archived' ? 'page' : undefined}>
			Archived <span class="tab__count">{data.archivedCount}</span>
		</a>
	</nav>
</header>

{#if !data.configured}
	<p class="warn">
		<strong>Supabase is not connected</strong> — set <code>SUPABASE_URL</code> and
		<code>SUPABASE_SERVICE_ROLE_KEY</code> to switch the inbox on.
	</p>
{:else if data.dbError}
	<p class="warn">
		<strong>Couldn't load enquiries.</strong>
		<br /><code class="warn__detail">{data.dbError}</code>
	</p>
{:else if form?.error}
	<p class="err" role="alert">{form.error}</p>
{/if}

{#if data.configured && !data.dbError}
	{#if data.rows.length === 0}
		<div class="card empty">
			<p class="empty__title">
				{data.view === 'archived' ? 'Nothing archived' : 'No enquiries yet'}
			</p>
			<p class="empty__sub">
				{data.view === 'archived' ? 'Archived enquiries will be kept here.' : 'New quote requests from the website will appear here instantly.'}
			</p>
		</div>
	{:else}
		<ul class="list">
			{#each data.rows as r (r.id)}
				{@const expanded = open.has(r.id)}
				<li id="e-{r.id}" class="card row" class:row--new={r.status === 'new'}>
					<button type="button" class="row__head" onclick={() => toggle(r)} aria-expanded={expanded}>
						<span class="row__dot" class:row__dot--new={r.status === 'new'} aria-hidden="true"></span>
						<span class="row__main">
							<span class="row__meta">
								<span class="row__name">{r.name}</span>
								{#if r.service}<span class="row__service">{r.service}</span>{/if}
								{#if r.postcode}<span class="row__postcode">{r.postcode}</span>{/if}
							</span>
							<span class="row__message" class:row__message--open={expanded}>{r.message}</span>
						</span>
						<span class="row__side">
							<time datetime={r.created_at} title={fmt(r.created_at)}>{ago(r.created_at)}</time>
							<span class="row__chev" class:row__chev--open={expanded}>▾</span>
						</span>
					</button>

					{#if expanded}
						<div class="row__detail">
							<dl class="detail-grid">
								<div>
									<dt>Email</dt>
									<dd><a href={mailtoFor(r.email)}>{r.email}</a></dd>
								</div>
								<div>
									<dt>Phone</dt>
									<dd>
										{#if r.phone}<a href="tel:{r.phone.replace(/\s+/g, '')}">{r.phone}</a>{:else}<span class="muted">No phone given</span>{/if}
									</dd>
								</div>
								<div>
									<dt>Postcode</dt>
									<dd>{r.postcode || '—'}</dd>
								</div>
								<div>
									<dt>Received</dt>
									<dd>{fmt(r.created_at)}</dd>
								</div>
							</dl>

							<div class="actions">
								<a href={mailtoFor(r.email)} class="btn btn--primary btn--sm">Reply by email</a>

								{#if r.status === 'archived'}
									<form method="POST" action="?/restore" use:enhance>
										<input type="hidden" name="id" value={r.id} />
										<button class="btn btn--outline btn--sm">Restore to inbox</button>
									</form>
								{:else}
									{#if r.status === 'new'}
										<form method="POST" action="?/markRead" use:enhance>
											<input type="hidden" name="id" value={r.id} />
											<button class="btn btn--outline btn--sm">Mark read</button>
										</form>
									{:else}
										<form method="POST" action="?/markUnread" use:enhance>
											<input type="hidden" name="id" value={r.id} />
											<button class="btn btn--outline btn--sm">Mark unread</button>
										</form>
									{/if}
									<form method="POST" action="?/archive" use:enhance>
										<input type="hidden" name="id" value={r.id} />
										<button class="btn btn--outline btn--sm">Archive</button>
									</form>
								{/if}

								<span class="actions__spacer"></span>
								{#if confirmDelete === r.id}
									<form method="POST" action="?/remove" use:enhance={() => { confirmDelete = null; return async ({ update }) => update(); }}>
										<input type="hidden" name="id" value={r.id} />
										<span class="danger-note">Delete permanently?</span>
										<button class="linkish linkish--danger">Yes, delete</button>
									</form>
									<button type="button" class="linkish" onclick={() => (confirmDelete = null)}>Cancel</button>
								{:else}
									<button type="button" class="linkish linkish--danger" onclick={() => (confirmDelete = r.id)}>Delete</button>
								{/if}
							</div>
						</div>
					{/if}
				</li>
			{/each}
		</ul>

		{#if data.totalPages > 1}
			<nav class="pager" aria-label="Pagination">
				{#if data.page > 1}
					<a href={pageHref(String(data.page - 1))} class="btn btn--outline btn--sm">← Newer</a>
				{:else}<span></span>{/if}
				<span class="pager__label">Page {data.page} of {data.totalPages} · {data.total} total</span>
				{#if data.page < data.totalPages}
					<a href={pageHref(String(data.page + 1))} class="btn btn--outline btn--sm">Older →</a>
				{:else}<span></span>{/if}
			</nav>
		{/if}
	{/if}
{/if}

<style>
	.head {
		display: flex;
		align-items: flex-end;
		justify-content: space-between;
		gap: 1rem;
		flex-wrap: wrap;
		margin-bottom: 1.4rem;
	}

	.head h1 {
		margin-bottom: 0.1rem;
	}

	.head__sub {
		color: var(--ink-600);
		margin: 0;
		font-size: 0.95rem;
	}

	.tabs {
		display: flex;
		gap: 0.25rem;
		background: var(--tint);
		border: 1px solid var(--line);
		border-radius: 999px;
		padding: 0.25rem;
	}

	.tab {
		display: inline-flex;
		align-items: center;
		gap: 0.4rem;
		border-radius: 999px;
		padding: 0.35rem 1rem;
		font-family: var(--font-display);
		font-size: 0.9rem;
		font-weight: 500;
		color: var(--ink-600);
		text-decoration: none;
	}

	.tab:hover {
		color: var(--ink-900);
	}

	.tab--on {
		background: var(--accent-500);
		color: #fff;
	}

	.tab__badge {
		background: var(--gold-500);
		color: #fff;
		font-size: 0.7rem;
		font-weight: 600;
		border-radius: 999px;
		padding: 0.05rem 0.45rem;
		line-height: 1.5;
	}

	.tab__count {
		font-size: 0.78rem;
		opacity: 0.7;
	}

	.warn {
		background: #fdf6ec;
		border: 1px solid #f0dfc0;
		border-radius: var(--radius);
		padding: 0.9rem 1.1rem;
		color: var(--ink-600);
		max-width: 46rem;
	}

	.warn__detail {
		display: inline-block;
		margin-top: 0.5rem;
		font-size: 0.82rem;
		word-break: break-word;
		color: #8a5a2a;
	}

	.err {
		background: #fdf1ee;
		border: 1px solid #f0cfc7;
		color: #a33a2a;
		border-radius: var(--radius);
		padding: 0.6rem 1rem;
		max-width: 46rem;
	}

	.empty {
		max-width: 48rem;
		padding: 2.6rem;
		text-align: center;
	}

	.empty__title {
		font-family: var(--font-display);
		font-weight: 600;
		font-size: 1.1rem;
		margin: 0 0 0.2rem;
	}

	.empty__sub {
		color: var(--ink-600);
		font-size: 0.92rem;
		margin: 0;
	}

	.list {
		list-style: none;
		margin: 0;
		padding: 0;
		display: grid;
		gap: 0.7rem;
		max-width: 60rem;
	}

	.row {
		overflow: hidden;
	}

	.row--new {
		border-color: var(--gold-300);
	}

	.row__head {
		font: inherit;
		display: flex;
		align-items: flex-start;
		gap: 0.9rem;
		width: 100%;
		padding: 1rem 1.2rem;
		text-align: left;
		background: none;
		border: 0;
		cursor: pointer;
	}

	.row__head:hover {
		background: rgba(19, 28, 42, 0.03);
	}

	.row__dot {
		flex-shrink: 0;
		margin-top: 0.5rem;
		width: 8px;
		height: 8px;
		border-radius: 50%;
		background: var(--line);
	}

	.row__dot--new {
		background: var(--gold-500);
		box-shadow: 0 0 0 3px rgba(192, 154, 81, 0.25);
	}

	.row__main {
		min-width: 0;
		flex: 1;
	}

	.row__meta {
		display: flex;
		flex-wrap: wrap;
		align-items: baseline;
		gap: 0.3rem 0.7rem;
	}

	.row__name {
		font-family: var(--font-display);
		font-weight: 600;
		color: var(--ink-900);
	}

	.row__service {
		background: var(--accent-100);
		color: var(--accent-600);
		border-radius: 999px;
		padding: 0.08rem 0.6rem;
		font-size: 0.72rem;
		font-weight: 500;
	}

	.row__postcode {
		color: var(--ink-400);
		font-size: 0.8rem;
	}

	.row__message {
		display: block;
		margin-top: 0.25rem;
		color: var(--ink-600);
		font-size: 0.92rem;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.row__message--open {
		white-space: pre-line;
		overflow: visible;
	}

	.row__side {
		flex-shrink: 0;
		text-align: right;
		color: var(--ink-400);
		font-size: 0.8rem;
	}

	.row__chev {
		display: block;
		margin-top: 0.2rem;
		color: var(--accent-500);
		transition: transform 0.15s ease;
	}

	.row__chev--open {
		transform: rotate(180deg);
	}

	.row__detail {
		border-top: 1px solid var(--line);
		background: var(--tint);
		padding: 1rem 1.2rem 1.1rem;
	}

	.detail-grid {
		display: grid;
		gap: 0.5rem 2rem;
		margin: 0;
		font-size: 0.9rem;
	}

	@media (min-width: 640px) {
		.detail-grid {
			grid-template-columns: 1fr 1fr;
		}
	}

	.detail-grid dt {
		font-size: 0.72rem;
		font-weight: 600;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: var(--ink-400);
	}

	.detail-grid dd {
		margin: 0.05rem 0 0;
		color: var(--ink-900);
	}

	.detail-grid a {
		color: var(--accent-600);
	}

	.muted {
		color: var(--ink-400);
	}

	.actions {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 0.6rem;
		margin-top: 1rem;
	}

	.actions__spacer {
		margin-left: auto;
	}

	.btn--sm {
		padding: 0.4rem 1rem;
		font-size: 0.84rem;
	}

	.danger-note {
		color: #a33a2a;
		font-size: 0.82rem;
		margin-right: 0.4rem;
	}

	.linkish {
		font: inherit;
		font-size: 0.86rem;
		background: none;
		border: 0;
		padding: 0.2rem 0.1rem;
		cursor: pointer;
		color: var(--ink-600);
		text-decoration: underline;
		text-underline-offset: 3px;
		text-decoration-thickness: 1px;
	}

	.linkish:hover {
		color: var(--ink-900);
	}

	.linkish--danger {
		color: #a33a2a;
	}

	.pager {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1rem;
		margin-top: 1.3rem;
		max-width: 60rem;
	}

	.pager__label {
		color: var(--ink-400);
		font-size: 0.9rem;
	}
</style>
