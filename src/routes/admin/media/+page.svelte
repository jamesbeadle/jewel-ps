<script>
	import { enhance } from '$app/forms';
	import { invalidateAll } from '$app/navigation';

	let { data, form } = $props();

	let uploading = $state(false);
	let uploadError = $state('');
	/** @type {HTMLInputElement | undefined} */
	let fileInput = $state();
	/** @type {string | null} url just copied */
	let copied = $state(null);
	/** @type {string | null} name awaiting delete confirmation */
	let confirmDelete = $state(null);

	/** @param {FileList | null} files */
	async function uploadFiles(files) {
		if (!files || files.length === 0) return;
		uploading = true;
		uploadError = '';
		try {
			for (const file of Array.from(files)) {
				const res = await fetch('/admin/api/media', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ filename: file.name })
				});
				if (!res.ok) throw new Error((await res.text()).slice(0, 200));
				const { uploadUrl } = await res.json();
				const put = await fetch(uploadUrl, {
					method: 'PUT',
					headers: { 'Content-Type': file.type || 'application/octet-stream' },
					body: file
				});
				if (!put.ok) throw new Error(`Upload failed (${put.status})`);
			}
			await invalidateAll();
		} catch (e) {
			uploadError = e instanceof Error ? e.message : 'Upload failed';
		} finally {
			uploading = false;
			if (fileInput) fileInput.value = '';
		}
	}

	/** @param {string} url */
	async function copyUrl(url) {
		try {
			await navigator.clipboard.writeText(url);
			copied = url;
			setTimeout(() => {
				if (copied === url) copied = null;
			}, 1600);
		} catch {
			/* clipboard unavailable — no-op */
		}
	}
</script>

<svelte:head>
	<title>Media | Admin</title>
</svelte:head>

<div class="head">
	<h1>Media</h1>
	{#if data.configured}
		<label class="btn btn--primary upload">
			{uploading ? 'Uploading…' : '⬆ Upload photos'}
			<input
				bind:this={fileInput}
				type="file"
				accept="image/*"
				multiple
				disabled={uploading}
				onchange={(e) => uploadFiles(e.currentTarget.files)}
			/>
		</label>
	{/if}
</div>

<p class="hint">
	Photos upload straight to Supabase Storage at full resolution and are available everywhere in
	the admin — including the brochure builder's image picker. Use <em>Copy URL</em> to reference a
	photo anywhere else.
</p>

{#if !data.configured}
	<p class="warn">Supabase is not connected yet — see the dashboard for setup steps.</p>
{:else if data.dbError}
	<p class="warn">
		Could not load the media library — check that <code>supabase/2026-08-26-admin.sql</code>
		(which creates the <code>media</code> storage bucket) has been run.
		<br /><code class="warn__detail">{data.dbError}</code>
	</p>
{/if}

{#if uploadError}
	<p class="err" role="alert">{uploadError}</p>
{/if}
{#if form?.error}
	<p class="err" role="alert">{form.error}</p>
{/if}

{#if data.configured && !data.dbError}
	<h2 class="section-label">Uploaded photos ({data.uploads.length})</h2>
	{#if data.uploads.length === 0}
		<p class="empty">Nothing uploaded yet — photos you upload here will appear in this library.</p>
	{:else}
		<div class="grid">
			{#each data.uploads as f (f.name)}
				<figure class="cell card">
					<a href={f.publicUrl} target="_blank" rel="noopener">
						<img src={f.publicUrl} alt={f.name} loading="lazy" />
					</a>
					<figcaption>
						<button class="linkish" type="button" onclick={() => copyUrl(f.publicUrl)}>
							{copied === f.publicUrl ? 'Copied ✓' : 'Copy URL'}
						</button>
						{#if confirmDelete === f.name}
							<form
								method="POST"
								action="?/delete"
								use:enhance={() => async ({ update }) => {
									confirmDelete = null;
									await update();
								}}
							>
								<input type="hidden" name="name" value={f.name} />
								<button class="linkish linkish--danger" type="submit">Really delete?</button>
							</form>
						{:else}
							<button
								class="linkish linkish--danger"
								type="button"
								onclick={() => (confirmDelete = f.name)}
							>
								Delete
							</button>
						{/if}
					</figcaption>
				</figure>
			{/each}
		</div>
	{/if}
{/if}

{#each data.groups as group (group.label)}
	<h2 class="section-label">{group.label} <span class="section-label__note">(built into the site)</span></h2>
	<div class="grid grid--builtin">
		{#each group.images as url (url)}
			<figure class="cell card">
				<a href={url} target="_blank" rel="noopener">
					<img src={url} alt="" loading="lazy" />
				</a>
				<figcaption>
					<button class="linkish" type="button" onclick={() => copyUrl(url)}>
						{copied === url ? 'Copied ✓' : 'Copy URL'}
					</button>
				</figcaption>
			</figure>
		{/each}
	</div>
{/each}

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

	.upload {
		position: relative;
		overflow: hidden;
	}

	.upload input {
		position: absolute;
		inset: 0;
		opacity: 0;
		cursor: pointer;
	}

	.hint {
		color: var(--ink-600);
		margin-block: 0.8rem 1.4rem;
		max-width: 52rem;
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

	.section-label {
		font-size: 0.82rem;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.14em;
		color: var(--ink-400);
		margin: 2rem 0 0.9rem;
	}

	.section-label__note {
		font-weight: 400;
		letter-spacing: 0.06em;
		text-transform: none;
		color: var(--ink-400);
	}

	.empty {
		color: var(--ink-600);
	}

	.grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
		gap: 0.8rem;
	}

	.grid--builtin {
		grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
	}

	.cell {
		margin: 0;
		overflow: hidden;
		display: flex;
		flex-direction: column;
	}

	.cell a {
		display: block;
		aspect-ratio: 4 / 3;
		background: var(--tint);
	}

	.cell img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		display: block;
	}

	.cell figcaption {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 0.5rem;
		padding: 0.4rem 0.7rem;
		font-size: 0.8rem;
	}

	.linkish {
		font: inherit;
		font-size: 0.8rem;
		background: none;
		border: 0;
		padding: 0.15rem 0;
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
</style>
