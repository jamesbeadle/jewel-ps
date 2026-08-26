<script>
	import { enhance } from '$app/forms';
	import BrochureDoc from '$lib/components/brochure/BrochureDoc.svelte';
	import { templates, templateName } from '$lib/brochure/templates';

	let { data } = $props();

	const brochure = $derived(data.doc.brochure);
	const pages = $derived(data.doc.pages);

	/** @param {Record<string, unknown>} content */
	function pageTitle(content) {
		return String(content.title ?? content.kicker ?? '') || 'Untitled';
	}
</script>

<svelte:head>
	<title>{brochure.title} | Admin | Jewel Property Serve</title>
</svelte:head>

<nav class="crumbs"><a href="/admin/brochure">← All brochures</a></nav>

<div class="head">
	<form class="head__title" method="POST" action="?/rename" use:enhance>
		<input name="title" value={brochure.title} aria-label="Brochure title" />
		<button class="btn btn--outline btn--sm" type="submit">Rename</button>
	</form>

	<div class="head__actions">
		{#if brochure.status === 'active'}
			<span class="badge badge--active">Active</span>
			<form method="POST" action="?/deactivate" use:enhance>
				<button class="btn btn--outline btn--sm" type="submit">Unpublish</button>
			</form>
		{:else}
			<span class="badge">Draft</span>
			<form method="POST" action="?/activate" use:enhance>
				<button class="btn btn--outline btn--sm" type="submit">Make active</button>
			</form>
		{/if}
		<a
			class="btn btn--outline btn--sm"
			href="/brochure/print/{brochure.id}"
			target="_blank"
			rel="noopener"
		>
			Preview ↗
		</a>
		<a
			class="btn btn--primary btn--sm"
			href="/admin/brochure/{brochure.id}/pdf"
			data-sveltekit-preload-data="off"
		>
			Download PDF
		</a>
	</div>
</div>

<div class="adders">
	<form class="adders__form" method="POST" action="?/addPage">
		<label for="add-template">Add a page</label>
		<select id="add-template" name="template">
			{#each templates as t (t.id)}
				<option value={t.id}>{t.name} — {t.description}</option>
			{/each}
		</select>
		<button class="btn btn--outline btn--sm" type="submit">Add page</button>
	</form>

	<form class="adders__form adders__form--single" method="POST" action="?/addProject" use:enhance>
		<label for="add-spread">Add a case-study spread</label>
		<button id="add-spread" class="btn btn--outline btn--sm" type="submit">
			+ Opener, detail &amp; gallery (3 pages)
		</button>
	</form>
</div>

{#if pages.length === 0}
	<p class="empty">No pages yet — add your first page above.</p>
{:else}
	<ol class="pages">
		{#each pages as page, i (page.id)}
			<li class="card pagerow">
				<a class="pagerow__thumb" href="/admin/brochure/{brochure.id}/page/{page.id}">
					<div class="pagerow__thumb-inner">
						<BrochureDoc pages={[page]} />
					</div>
				</a>
				<div class="pagerow__text">
					<span class="pagerow__n">Page {i + 1}</span>
					<strong>{templateName(page.template)}</strong>
					<span class="pagerow__title">{pageTitle(page.content)}</span>
				</div>
				<div class="pagerow__actions">
					<form method="POST" action="?/movePage" use:enhance>
						<input type="hidden" name="page_id" value={page.id} />
						<input type="hidden" name="direction" value="up" />
						<button class="iconbtn" title="Move up" disabled={i === 0}>↑</button>
					</form>
					<form method="POST" action="?/movePage" use:enhance>
						<input type="hidden" name="page_id" value={page.id} />
						<input type="hidden" name="direction" value="down" />
						<button class="iconbtn" title="Move down" disabled={i === pages.length - 1}>↓</button>
					</form>
					<a class="btn btn--outline btn--sm" href="/admin/brochure/{brochure.id}/page/{page.id}">
						Edit
					</a>
					<form method="POST" action="?/duplicatePage" use:enhance>
						<input type="hidden" name="page_id" value={page.id} />
						<button class="linkish" type="submit">Duplicate</button>
					</form>
					<form
						method="POST"
						action="?/deletePage"
						use:enhance
						onsubmit={(e) => {
							if (!confirm('Delete this page?')) e.preventDefault();
						}}
					>
						<input type="hidden" name="page_id" value={page.id} />
						<button class="linkish linkish--danger" type="submit">Delete</button>
					</form>
				</div>
			</li>
		{/each}
	</ol>
{/if}

<form
	method="POST"
	action="?/delete"
	onsubmit={(e) => {
		if (!confirm(`Delete “${brochure.title}” and all its pages? This cannot be undone.`))
			e.preventDefault();
	}}
>
	<button class="danger" type="submit">Delete this brochure</button>
</form>

<style>
	.crumbs {
		margin-bottom: 0.6rem;
	}

	.crumbs a {
		color: var(--ink-600);
		text-decoration: none;
		font-size: 0.92rem;
	}

	.head {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1rem;
		flex-wrap: wrap;
		margin-bottom: 1.2rem;
	}

	.head__title {
		display: flex;
		gap: 0.6rem;
		align-items: center;
		flex: 1;
		min-width: 260px;
		max-width: 34rem;
	}

	.head__title input {
		font-family: var(--font-display);
		font-size: 1.35rem;
		font-weight: 600;
		padding: 0.45rem 0.7rem;
		border: 1px solid transparent;
		border-radius: var(--radius);
		background: transparent;
		width: 100%;
	}

	.head__title input:hover,
	.head__title input:focus {
		border-color: var(--line);
		background: #fff;
		outline: none;
	}

	.head__actions {
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
		padding: 0.2rem 0.65rem;
		background: var(--tint);
		border: 1px solid var(--line);
		color: var(--ink-600);
	}

	.badge--active {
		background: #eef7ee;
		border-color: #bfe0bf;
		color: #2c7a2c;
	}

	.adders {
		display: flex;
		gap: 1.5rem;
		flex-wrap: wrap;
		margin-bottom: 1.4rem;
	}

	.adders__form {
		display: grid;
		gap: 0.35rem;
		grid-template-columns: auto auto;
		align-items: end;
	}

	.adders__form label {
		grid-column: 1 / -1;
		font-size: 0.8rem;
		font-weight: 600;
		color: var(--ink-600);
	}

	.adders__form select {
		font: inherit;
		font-size: 0.88rem;
		padding: 0.42rem 0.6rem;
		border: 1px solid var(--line);
		border-radius: var(--radius);
		background: #fff;
		max-width: 22rem;
		margin-right: 0.6rem;
	}

	.adders__form--single {
		grid-template-columns: auto;
	}

	.empty {
		color: var(--ink-600);
	}

	.pages {
		list-style: none;
		margin: 0 0 1.6rem;
		padding: 0;
		display: grid;
		gap: 0.7rem;
	}

	.pagerow {
		display: flex;
		align-items: center;
		gap: 1.1rem;
		padding: 0.7rem 1rem;
		flex-wrap: wrap;
	}

	.pagerow__thumb {
		display: block;
		width: 88px;
		height: 124px;
		overflow: hidden;
		border: 1px solid var(--line);
		border-radius: 4px;
		background: #fff;
		flex: 0 0 auto;
	}

	.pagerow__thumb-inner {
		transform: scale(0.1108);
		transform-origin: top left;
		width: 794px;
		height: 1123px;
		pointer-events: none;
	}

	.pagerow__text {
		display: grid;
		gap: 0.1rem;
		margin-right: auto;
		min-width: 0;
	}

	.pagerow__n {
		font-size: 0.72rem;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		color: var(--ink-400);
	}

	.pagerow__title {
		color: var(--ink-600);
		font-size: 0.9rem;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		max-width: 32rem;
	}

	.pagerow__actions {
		display: flex;
		align-items: center;
		gap: 0.55rem;
		flex-wrap: wrap;
	}

	.iconbtn {
		font: inherit;
		width: 1.9rem;
		height: 1.9rem;
		border-radius: 50%;
		border: 1px solid var(--line);
		background: #fff;
		cursor: pointer;
		color: var(--ink-600);
	}

	.iconbtn:hover:not(:disabled) {
		border-color: var(--ink-400);
		color: var(--ink-900);
	}

	.iconbtn:disabled {
		opacity: 0.35;
		cursor: default;
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

	.danger {
		font: inherit;
		font-size: 0.88rem;
		color: #a33a2a;
		background: none;
		border: 1px solid #e5b8ae;
		border-radius: 999px;
		padding: 0.45rem 1.1rem;
		cursor: pointer;
	}

	.danger:hover {
		background: #fdf1ee;
	}
</style>
