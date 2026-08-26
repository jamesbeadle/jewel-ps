<script>
	import { enhance } from '$app/forms';

	let { data } = $props();
	let showCreate = $state(false);

	/** @param {string} iso */
	function fmtDate(iso) {
		return new Date(iso).toLocaleDateString('en-GB', {
			day: 'numeric',
			month: 'short',
			year: 'numeric'
		});
	}
</script>

<svelte:head>
	<title>Brochures | Admin | Jewel Property Serve</title>
</svelte:head>

<div class="head">
	<h1>Brochures</h1>
	<div class="head__actions">
		<a class="btn btn--outline" href="/brochure" target="_blank" rel="noopener">
			View live brochure ↗
		</a>
		{#if data.configured}
			<button class="btn btn--primary" onclick={() => (showCreate = !showCreate)}>
				+ New brochure
			</button>
		{/if}
	</div>
</div>

<p class="hint">
	Build print-quality brochures page by page. Keep them in <strong>draft</strong> while you work —
	the <strong>active</strong> brochure is the one visitors see at <code>/brochure</code> and
	download as a PDF.
</p>

{#if !data.configured}
	<p class="card notice">Supabase is not connected yet — see the dashboard for setup steps.</p>
{:else if data.setupError}
	<div class="card notice">
		<p><strong>The brochure tables don't exist yet.</strong></p>
		<p>
			Run <code>supabase/2026-08-19-brochures.sql</code> in the Supabase SQL Editor once, then
			reload this page.
		</p>
		<p class="notice__err">{data.setupError}</p>
	</div>
{:else}
	{#if showCreate}
		<form class="card create" method="POST" action="?/create" use:enhance>
			<label>
				Title
				<input name="title" placeholder="2026 Brochure" required />
			</label>
			<fieldset>
				<legend>Start from</legend>
				<label class="create__radio">
					<input type="radio" name="seed" value="template" checked />
					<span>
						<strong>The Jewel PS layout</strong> — cover, who we are, services, gallery,
						case studies, process, testimonials and back cover, all prefilled from the
						site's own copy and fully editable.
					</span>
				</label>
				<label class="create__radio">
					<input type="radio" name="seed" value="blank" />
					<span><strong>Blank</strong> — add pages one by one.</span>
				</label>
			</fieldset>
			<div>
				<button class="btn btn--primary" type="submit">Create brochure</button>
			</div>
		</form>
	{/if}

	{#if data.brochures.length === 0 && !showCreate}
		<p>No brochures yet — create your first one above.</p>
	{:else}
		<ul class="list">
			{#each data.brochures as b (b.id)}
				<li class="card row">
					<div class="row__text">
						<strong>
							{b.title}
							{#if b.status === 'active'}
								<span class="badge badge--active">Active</span>
							{:else}
								<span class="badge">Draft</span>
							{/if}
						</strong>
						<span>{b.page_count} pages · updated {fmtDate(b.updated_at)}</span>
					</div>
					<div class="row__actions">
						<a class="btn btn--outline btn--sm" href="/admin/brochure/{b.id}">Edit</a>
						<a
							class="btn btn--outline btn--sm"
							href="/admin/brochure/{b.id}/pdf"
							data-sveltekit-preload-data="off"
						>
							PDF
						</a>
						{#if b.status === 'active'}
							<form method="POST" action="?/deactivate" use:enhance>
								<input type="hidden" name="id" value={b.id} />
								<button class="linkish" type="submit">Unpublish</button>
							</form>
						{:else}
							<form method="POST" action="?/activate" use:enhance>
								<input type="hidden" name="id" value={b.id} />
								<button class="linkish linkish--go" type="submit">Make active</button>
							</form>
						{/if}
						<form method="POST" action="?/duplicate" use:enhance>
							<input type="hidden" name="id" value={b.id} />
							<button class="linkish" type="submit">Duplicate</button>
						</form>
						<form
							method="POST"
							action="?/delete"
							use:enhance
							onsubmit={(e) => {
								if (!confirm(`Delete “${b.title}”? This cannot be undone.`)) e.preventDefault();
							}}
						>
							<input type="hidden" name="id" value={b.id} />
							<button class="linkish linkish--danger" type="submit">Delete</button>
						</form>
					</div>
				</li>
			{/each}
		</ul>
	{/if}
{/if}

<style>
	.head {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1rem;
		flex-wrap: wrap;
	}

	.head h1 {
		margin: 0;
	}

	.head__actions {
		display: flex;
		gap: 0.8rem;
		align-items: center;
	}

	.hint {
		color: var(--ink-600);
		margin-block: 0.8rem 1.4rem;
		max-width: 52rem;
	}

	.notice {
		padding: 1.1rem 1.3rem;
		max-width: 52rem;
	}

	.notice__err {
		color: #a33a2a;
		font-size: 0.85rem;
		margin: 0;
	}

	.create {
		display: grid;
		gap: 1.1rem;
		padding: 1.6rem;
		max-width: 52rem;
		margin-bottom: 1.6rem;
	}

	.create label {
		display: grid;
		gap: 0.3rem;
		font-size: 0.92rem;
		font-weight: 600;
	}

	.create input[name='title'] {
		font: inherit;
		font-weight: 400;
		padding: 0.65rem 0.85rem;
		border: 1px solid var(--line);
		border-radius: var(--radius);
		max-width: 24rem;
	}

	.create fieldset {
		border: 1px solid var(--line);
		border-radius: var(--radius);
		display: grid;
		gap: 0.7rem;
		padding: 0.9rem 1rem;
	}

	.create legend {
		font-size: 0.85rem;
		font-weight: 600;
		padding-inline: 0.4rem;
	}

	.create__radio {
		display: grid;
		grid-template-columns: auto 1fr;
		gap: 0.6rem;
		font-weight: 400;
		align-items: start;
	}

	.create__radio span {
		font-size: 0.9rem;
		color: var(--ink-600);
	}

	.list {
		list-style: none;
		margin: 0;
		padding: 0;
		display: grid;
		gap: 0.8rem;
		max-width: 60rem;
	}

	.row {
		display: flex;
		align-items: center;
		gap: 1rem;
		padding: 0.9rem 1.2rem;
		flex-wrap: wrap;
	}

	.row__text {
		display: grid;
		margin-right: auto;
		min-width: 0;
		gap: 0.15rem;
	}

	.row__text span {
		color: var(--ink-400);
		font-size: 0.88rem;
	}

	.row__actions {
		display: flex;
		align-items: center;
		gap: 0.7rem;
		flex-wrap: wrap;
	}

	.btn--sm {
		padding: 0.4rem 1rem;
		font-size: 0.86rem;
	}

	.badge {
		display: inline-block;
		font-size: 0.7rem;
		font-weight: 600;
		letter-spacing: 0.04em;
		text-transform: uppercase;
		border-radius: 999px;
		padding: 0.14rem 0.6rem;
		background: var(--tint);
		border: 1px solid var(--line);
		color: var(--ink-600);
		margin-left: 0.5rem;
		vertical-align: 2px;
	}

	.badge--active {
		background: #eef7ee;
		border-color: #bfe0bf;
		color: #2c7a2c;
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

	.linkish--go {
		color: #2c7a2c;
	}

	.linkish--danger {
		color: #a33a2a;
	}
</style>
