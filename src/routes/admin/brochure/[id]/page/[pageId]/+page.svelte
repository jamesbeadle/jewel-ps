<script>
	import { enhance } from '$app/forms';
	import { invalidateAll } from '$app/navigation';
	import BrochureDoc from '$lib/components/brochure/BrochureDoc.svelte';
	import ImagePicker from '$lib/components/admin/ImagePicker.svelte';

	let { data, form } = $props();

	/* Editable copy of the page content. Re-initialised whenever the admin
	   navigates to a different page (the #key block below re-mounts us). */
	/** @type {Record<string, unknown>} */
	let content = $state(JSON.parse(JSON.stringify(data.page.content ?? {})));
	const original = $derived(JSON.stringify(data.page.content ?? {}));
	const dirty = $derived(JSON.stringify(content) !== original);

	/** @type {string[]} */
	let uploaded = $state([...data.uploaded]);
	let pickerOpen = $state(false);
	/** @type {{ key: string, index?: number, subKey?: string } | null} */
	let pickTarget = $state(null);

	/**
	 * @param {string} key
	 * @param {number} [index]
	 * @param {string} [subKey]
	 */
	function openPicker(key, index, subKey) {
		pickTarget = { key, index, subKey };
		pickerOpen = true;
	}

	/** @param {string} url */
	function assignPicked(url) {
		if (!pickTarget) return;
		const { key, index, subKey } = pickTarget;
		if (subKey !== undefined && index !== undefined) {
			const list = listOf(key);
			list[index][subKey] = url;
			content[key] = list;
		} else if (index !== undefined) {
			const arr = arrayOf(key);
			if (index >= arr.length) arr.push(url);
			else arr[index] = url;
			content[key] = arr;
		} else {
			content[key] = url;
		}
	}

	/**
	 * @param {string} key
	 * @returns {string[]}
	 */
	function arrayOf(key) {
		return Array.isArray(content[key]) ? [...content[key]] : [];
	}

	/**
	 * @param {string} key
	 * @returns {Record<string, unknown>[]}
	 */
	function listOf(key) {
		return Array.isArray(content[key]) ? [...content[key]] : [];
	}

	/**
	 * @param {string} key
	 * @param {number} index
	 */
	function removeAt(key, index) {
		const arr = arrayOf(key);
		arr.splice(index, 1);
		content[key] = arr;
	}

	/**
	 * @param {string} key
	 * @param {{ key: string }[]} fields
	 */
	function groupAdd(key, fields) {
		const list = listOf(key);
		list.push(Object.fromEntries(fields.map((f) => [f.key, ''])));
		content[key] = list;
	}

	/**
	 * @param {string} key
	 * @param {number} index
	 */
	function groupRemove(key, index) {
		const list = listOf(key);
		list.splice(index, 1);
		content[key] = list;
	}

	/**
	 * @param {string} key
	 * @param {number} index
	 * @param {-1 | 1} dir
	 */
	function groupMove(key, index, dir) {
		const list = listOf(key);
		const target = index + dir;
		if (target < 0 || target >= list.length) return;
		[list[index], list[target]] = [list[target], list[index]];
		content[key] = list;
	}

	/* 'list' fields (key features) edit as one-per-line text */
	/** @param {string} key */
	function linesOf(key) {
		return (Array.isArray(content[key]) ? content[key] : []).join('\n');
	}

	/**
	 * @param {string} key
	 * @param {string} value
	 */
	function setLines(key, value) {
		content[key] = value
			.split('\n')
			.map((l) => l.trim())
			.filter(Boolean);
	}

	/** @param {import('$lib/brochure/templates.js').Field} f */
	function isFilled(f) {
		return f.type === 'image' && Boolean(content[f.key]);
	}

	/* Live preview scaling */
	let previewWidth = $state(0);
	const scale = $derived(previewWidth > 0 ? previewWidth / 794 : 0.5);
</script>

<svelte:head>
	<title>Edit page — {data.brochure.title} | Admin | Jewel Property Serve</title>
</svelte:head>

{#key data.page.id}
	<nav class="crumbs">
		<a href="/admin/brochure/{data.brochure.id}">← {data.brochure.title}</a>
		<span class="crumbs__pos">
			Page {data.pageNumber} of {data.pageCount} · {data.template.name}
			{#if data.prevId}
				· <a href="/admin/brochure/{data.brochure.id}/page/{data.prevId}">Prev</a>
			{/if}
			{#if data.nextId}
				· <a href="/admin/brochure/{data.brochure.id}/page/{data.nextId}">Next</a>
			{/if}
		</span>
	</nav>

	<div class="editor">
		<div class="editor__form">
			<h1>{data.template.name}</h1>
			<p class="hint">{data.template.description}</p>

			{#if form?.saved}
				<p class="ok" role="status">Saved.</p>
			{/if}
			{#if form?.error}
				<p class="err" role="alert">{form.error}</p>
			{/if}

			<form
				class="card fields"
				method="POST"
				action="?/save"
				use:enhance={() => async ({ update }) => {
					await update({ reset: false });
					await invalidateAll();
				}}
			>
				<input type="hidden" name="content" value={JSON.stringify(content)} />

				{#each data.template.fields as field (field.key)}
					<div class="field">
						{#if field.type === 'text'}
							<label for="f-{field.key}">{field.label}</label>
							<input
								id="f-{field.key}"
								type="text"
								placeholder={field.placeholder ?? ''}
								bind:value={content[field.key]}
							/>
						{:else if field.type === 'textarea'}
							<label for="f-{field.key}">{field.label}</label>
							<textarea
								id="f-{field.key}"
								rows={field.rows ?? 6}
								placeholder={field.placeholder ?? ''}
								bind:value={content[field.key]}
							></textarea>
						{:else if field.type === 'list'}
							<label for="f-{field.key}">{field.label}</label>
							<textarea
								id="f-{field.key}"
								rows="5"
								value={linesOf(field.key)}
								oninput={(e) => setLines(field.key, e.currentTarget.value)}
							></textarea>
						{:else if field.type === 'image'}
							<span class="field__label">{field.label}</span>
							<div class="imgfield">
								{#if isFilled(field)}
									<img class="imgfield__thumb" src={String(content[field.key])} alt="" />
								{/if}
								<div class="imgfield__controls">
									<button
										type="button"
										class="btn btn--outline btn--sm"
										onclick={() => openPicker(field.key)}
									>
										{isFilled(field) ? 'Change photo' : 'Choose photo'}
									</button>
									{#if isFilled(field)}
										<button
											type="button"
											class="linkish linkish--danger"
											onclick={() => (content[field.key] = '')}
										>
											Remove
										</button>
									{/if}
								</div>
							</div>
						{:else if field.type === 'images'}
							<span class="field__label">{field.label} <em>(up to {field.max})</em></span>
							<div class="imggrid">
								{#each arrayOf(field.key) as url, i (i)}
									<div class="imggrid__cell">
										<img src={url} alt="" />
										<div class="imggrid__cellbtns">
											<button type="button" title="Change" onclick={() => openPicker(field.key, i)}>
												✎
											</button>
											<button type="button" title="Remove" onclick={() => removeAt(field.key, i)}>
												✕
											</button>
										</div>
									</div>
								{/each}
								{#if arrayOf(field.key).length < field.max}
									<button
										type="button"
										class="imggrid__add"
										onclick={() => openPicker(field.key, arrayOf(field.key).length)}
									>
										+ Add
									</button>
								{/if}
							</div>
						{:else if field.type === 'group-list'}
							<span class="field__label">{field.label}</span>
							<div class="groups">
								{#each listOf(field.key) as item, i (i)}
									<div class="group card">
										<div class="group__head">
											<span>{field.itemLabel} {i + 1}</span>
											<span class="group__btns">
												<button type="button" disabled={i === 0} onclick={() => groupMove(field.key, i, -1)}>↑</button>
												<button
													type="button"
													disabled={i === listOf(field.key).length - 1}
													onclick={() => groupMove(field.key, i, 1)}
												>↓</button>
												<button type="button" class="group__del" onclick={() => groupRemove(field.key, i)}>✕</button>
											</span>
										</div>
										{#each field.fields as sub (sub.key)}
											<div class="group__field">
												<label for="g-{field.key}-{i}-{sub.key}">{sub.label}</label>
												{#if sub.type === 'textarea'}
													<textarea
														id="g-{field.key}-{i}-{sub.key}"
														rows="3"
														value={String(item[sub.key] ?? '')}
														oninput={(e) => {
															const list = listOf(field.key);
															list[i] = { ...list[i], [sub.key]: e.currentTarget.value };
															content[field.key] = list;
														}}
													></textarea>
												{:else}
													<div class="group__inline">
														<input
															id="g-{field.key}-{i}-{sub.key}"
															type="text"
															placeholder={sub.placeholder ?? ''}
															value={String(item[sub.key] ?? '')}
															oninput={(e) => {
																const list = listOf(field.key);
																list[i] = { ...list[i], [sub.key]: e.currentTarget.value };
																content[field.key] = list;
															}}
														/>
														{#if sub.key === 'photo'}
															<button
																type="button"
																class="btn btn--outline btn--sm"
																onclick={() => openPicker(field.key, i, 'photo')}
															>
																Choose
															</button>
														{/if}
													</div>
												{/if}
											</div>
										{/each}
									</div>
								{/each}
								{#if !field.max || listOf(field.key).length < field.max}
									<button
										type="button"
										class="btn btn--outline btn--sm"
										onclick={() => groupAdd(field.key, field.fields)}
									>
										+ Add {field.itemLabel}
									</button>
								{/if}
							</div>
						{/if}
						{#if 'hint' in field && field.hint}
							<p class="field__hint">{field.hint}</p>
						{/if}
					</div>
				{/each}

				<div class="fields__save">
					<button class="btn btn--primary" type="submit">Save page</button>
					{#if dirty}
						<span class="fields__dirty">Unsaved changes</span>
					{/if}
				</div>
			</form>

			<form
				method="POST"
				action="?/delete"
				onsubmit={(e) => {
					if (!confirm('Delete this page?')) e.preventDefault();
				}}
			>
				<button class="danger" type="submit">Delete this page</button>
			</form>
		</div>

		<div class="editor__preview">
			<div class="editor__preview-label">
				Live preview — page {data.pageNumber}
			</div>
			<div class="editor__preview-frame" bind:clientWidth={previewWidth}>
				<div
					class="editor__preview-scaler"
					style="transform: scale({scale}); height: {1123 * scale}px;"
				>
					<BrochureDoc
						pages={[{ id: data.page.id, template: data.page.template, content }]}
					/>
				</div>
			</div>
		</div>
	</div>

	<ImagePicker
		bind:open={pickerOpen}
		bind:uploaded
		groups={data.siteImages}
		canUpload={data.canUpload}
		onpick={assignPicked}
	/>
{/key}

<style>
	.crumbs {
		margin-bottom: 0.8rem;
		display: flex;
		justify-content: space-between;
		gap: 1rem;
		flex-wrap: wrap;
	}

	.crumbs a {
		color: var(--ink-600);
		font-size: 0.92rem;
	}

	.crumbs__pos {
		color: var(--ink-400);
		font-size: 0.88rem;
	}

	.editor {
		display: grid;
		grid-template-columns: minmax(0, 1fr) minmax(320px, 480px);
		gap: 2rem;
		align-items: start;
	}

	@media (max-width: 1000px) {
		.editor {
			grid-template-columns: 1fr;
		}
	}

	.editor__form h1 {
		margin: 0 0 0.2rem;
		font-size: 1.6rem;
	}

	.hint {
		color: var(--ink-600);
		margin: 0 0 1rem;
	}

	.ok {
		background: #eef7ee;
		border: 1px solid #cfe6cf;
		border-radius: var(--radius);
		padding: 0.6rem 1rem;
	}

	.err {
		background: #fdf1ee;
		border: 1px solid #f0cfc7;
		color: #a33a2a;
		border-radius: var(--radius);
		padding: 0.6rem 1rem;
	}

	.fields {
		display: grid;
		gap: 1.2rem;
		padding: 1.5rem;
	}

	.field {
		display: grid;
		gap: 0.35rem;
	}

	.field label,
	.field__label {
		font-size: 0.92rem;
		font-weight: 600;
	}

	.field__label em {
		font-style: normal;
		font-weight: 400;
		color: var(--ink-400);
	}

	.field input[type='text'],
	.field textarea {
		font: inherit;
		font-weight: 400;
		padding: 0.6rem 0.8rem;
		border: 1px solid var(--line);
		border-radius: var(--radius);
		width: 100%;
	}

	.field textarea {
		line-height: 1.55;
	}

	.field input:focus,
	.field textarea:focus {
		outline: 2px solid var(--accent-500);
		outline-offset: 1px;
	}

	.field__hint {
		color: var(--ink-400);
		font-size: 0.82rem;
		margin: 0;
	}

	.imgfield {
		display: flex;
		gap: 1rem;
		align-items: center;
		flex-wrap: wrap;
	}

	.imgfield__thumb {
		width: 130px;
		height: 92px;
		object-fit: cover;
		border-radius: var(--radius);
		border: 1px solid var(--line);
	}

	.imgfield__controls {
		display: flex;
		align-items: center;
		gap: 0.8rem;
	}

	.btn--sm {
		padding: 0.4rem 1rem;
		font-size: 0.86rem;
	}

	.imggrid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(96px, 1fr));
		gap: 0.55rem;
	}

	.imggrid__cell {
		position: relative;
		aspect-ratio: 4 / 3;
		border-radius: 8px;
		overflow: hidden;
		border: 1px solid var(--line);
	}

	.imggrid__cell img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.imggrid__cellbtns {
		position: absolute;
		top: 4px;
		right: 4px;
		display: flex;
		gap: 4px;
	}

	.imggrid__cellbtns button {
		width: 1.5rem;
		height: 1.5rem;
		border-radius: 50%;
		border: 0;
		background: rgba(255, 255, 255, 0.92);
		cursor: pointer;
		font-size: 0.75rem;
		line-height: 1;
	}

	.imggrid__add {
		aspect-ratio: 4 / 3;
		border: 1.5px dashed var(--line);
		border-radius: 8px;
		background: none;
		color: var(--ink-600);
		font: inherit;
		font-size: 0.85rem;
		cursor: pointer;
	}

	.imggrid__add:hover {
		border-color: var(--accent-500);
		color: var(--accent-600);
	}

	.groups {
		display: grid;
		gap: 0.8rem;
	}

	.group {
		padding: 0.9rem 1rem;
		display: grid;
		gap: 0.7rem;
	}

	.group__head {
		display: flex;
		justify-content: space-between;
		align-items: center;
		font-size: 0.78rem;
		font-weight: 600;
		letter-spacing: 0.05em;
		text-transform: uppercase;
		color: var(--ink-400);
	}

	.group__btns {
		display: flex;
		gap: 0.3rem;
	}

	.group__btns button {
		font: inherit;
		width: 1.6rem;
		height: 1.6rem;
		border-radius: 50%;
		border: 1px solid var(--line);
		background: #fff;
		cursor: pointer;
		color: var(--ink-600);
		font-size: 0.8rem;
		line-height: 1;
	}

	.group__btns button:disabled {
		opacity: 0.3;
		cursor: default;
	}

	.group__del {
		color: #a33a2a;
	}

	.group__field {
		display: grid;
		gap: 0.3rem;
	}

	.group__field label {
		font-size: 0.82rem;
		font-weight: 600;
		color: var(--ink-600);
	}

	.group__field input,
	.group__field textarea {
		font: inherit;
		font-weight: 400;
		font-size: 0.92rem;
		padding: 0.5rem 0.7rem;
		border: 1px solid var(--line);
		border-radius: var(--radius);
		width: 100%;
	}

	.group__inline {
		display: flex;
		gap: 0.5rem;
		align-items: center;
	}

	.fields__save {
		display: flex;
		align-items: center;
		gap: 1rem;
	}

	.fields__dirty {
		color: var(--accent-600);
		font-size: 0.88rem;
	}

	.linkish {
		font: inherit;
		font-size: 0.86rem;
		background: none;
		border: 0;
		padding: 0;
		cursor: pointer;
		color: var(--ink-600);
		text-decoration: underline;
		text-underline-offset: 3px;
	}

	.linkish--danger {
		color: #a33a2a;
	}

	.danger {
		margin-top: 1.2rem;
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

	.editor__preview {
		position: sticky;
		top: 84px;
	}

	.editor__preview-label {
		font-size: 0.8rem;
		font-weight: 600;
		letter-spacing: 0.05em;
		text-transform: uppercase;
		color: var(--ink-400);
		margin-bottom: 0.5rem;
	}

	.editor__preview-frame {
		border: 1px solid var(--line);
		border-radius: 8px;
		overflow: hidden;
		background: #fff;
		box-shadow: var(--shadow-soft);
	}

	.editor__preview-scaler {
		transform-origin: top left;
		width: 794px;
	}
</style>
