<script>
	let { data } = $props();

	/** @param {string | null} iso */
	function ukDate(iso) {
		if (!iso) return '—';
		const p = iso.split('-');
		return `${p[2]}/${p[1]}/${p[0]}`;
	}

	/** @param {string} iso */
	function ukDateTime(iso) {
		const d = new Date(iso);
		return d.toLocaleString('en-GB', {
			day: '2-digit', month: '2-digit', year: 'numeric',
			hour: '2-digit', minute: '2-digit', timeZone: 'Europe/London'
		});
	}

	/** @param {string} outcome */
	function outcomeClass(outcome) {
		if (outcome === 'Pass') return 'pill pill--pass';
		if (outcome.startsWith('Fail')) return 'pill pill--fail';
		return 'pill';
	}
</script>

<svelte:head>
	<title>RTW checks | Admin | Jewel Property Serve</title>
</svelte:head>

<div class="head">
	<h1>RTW checks</h1>
	<a class="btn btn--outline" href="/rtw" target="_blank" rel="noopener">Open the check tool ↗</a>
</div>

<p class="intro">
	Every check completed at <code>/rtw</code> is logged here automatically (one row per engaging
	company, matching the group register). The group register remains the master record — checkers
	still paste their rows into it.
</p>

{#if !data.configured}
	<p class="warn">Supabase is not connected yet — see the dashboard for setup steps.</p>
{:else if data.dbError}
	<p class="warn">
		Could not load submissions — check that the schema (which includes
		the <code>rtw_submissions</code> table, created by <code>supabase/2026-08-26-admin.sql</code>)
		has been run.
		<br /><code class="warn__detail">{data.dbError}</code>
	</p>
{:else if data.total === 0}
	<p>No submissions yet. They'll appear here as soon as someone completes a check at <code>/rtw</code>.</p>
{:else}
	<p class="count">
		{data.total} row{data.total === 1 ? '' : 's'} · page {data.page} of {data.totalPages}
	</p>

	<div class="tablewrap card">
		<table>
			<thead>
				<tr>
					<th>Submitted</th>
					<th>Company</th>
					<th>Individual</th>
					<th>Engagement type</th>
					<th>Start</th>
					<th>Method</th>
					<th>Document / code</th>
					<th>Checked by</th>
					<th>Outcome</th>
					<th>Expiry</th>
					<th>Follow-up due</th>
					<th>Evidence ref</th>
					<th>Notes</th>
				</tr>
			</thead>
			<tbody>
				{#each data.rows as r (r.id)}
					<tr>
						<td class="nowrap">{ukDateTime(r.created_at)}</td>
						<td><strong>{r.entity}</strong></td>
						<td>
							<strong>{r.full_name}</strong>
							{#if r.trade}<span class="sub">{r.trade}</span>{/if}
						</td>
						<td>{r.engagement_type}</td>
						<td class="nowrap">{ukDate(r.start_date)}</td>
						<td>{r.check_method || '—'}</td>
						<td>{r.document_seen || '—'}</td>
						<td>{r.checked_by || '—'}</td>
						<td><span class={outcomeClass(r.outcome)}>{r.outcome || '—'}</span></td>
						<td class="nowrap">{ukDate(r.permission_expiry)}</td>
						<td class="nowrap">{ukDate(r.followup_due)}</td>
						<td>{r.evidence_ref || '—'}</td>
						<td class="notes">{r.notes || '—'}</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>

	{#if data.totalPages > 1}
		<nav class="pager" aria-label="Pagination">
			{#if data.page > 1}
				<a class="btn btn--outline" href="?page={data.page - 1}">← Newer</a>
			{:else}
				<span class="btn btn--outline is-disabled" aria-disabled="true">← Newer</span>
			{/if}
			<span class="pager__label">Page {data.page} of {data.totalPages}</span>
			{#if data.page < data.totalPages}
				<a class="btn btn--outline" href="?page={data.page + 1}">Older →</a>
			{:else}
				<span class="btn btn--outline is-disabled" aria-disabled="true">Older →</span>
			{/if}
		</nav>
	{/if}
{/if}

<style>
	.head {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1rem;
		flex-wrap: wrap;
		margin-bottom: 0.6rem;
	}

	.head h1 {
		margin: 0;
	}

	.intro {
		color: var(--ink-600);
		max-width: 52rem;
		margin-bottom: 1.4rem;
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

	.count {
		color: var(--ink-400);
		font-size: 0.9rem;
		margin-bottom: 0.7rem;
	}

	.tablewrap {
		overflow-x: auto;
		padding: 0;
	}

	table {
		border-collapse: collapse;
		width: 100%;
		font-size: 0.86rem;
	}

	th,
	td {
		text-align: left;
		vertical-align: top;
		padding: 0.65rem 0.8rem;
		border-bottom: 1px solid var(--line);
		white-space: normal;
	}

	th {
		background: var(--tint);
		font-size: 0.78rem;
		text-transform: uppercase;
		letter-spacing: 0.04em;
		color: var(--ink-600);
		white-space: nowrap;
	}

	tbody tr:last-child td {
		border-bottom: none;
	}

	.nowrap {
		white-space: nowrap;
	}

	.sub {
		display: block;
		color: var(--ink-400);
		font-size: 0.82rem;
	}

	.notes {
		min-width: 14rem;
		color: var(--ink-600);
	}

	.pill {
		display: inline-block;
		padding: 0.15rem 0.7rem;
		border-radius: 999px;
		font-size: 0.78rem;
		font-weight: 700;
		background: var(--tint);
		white-space: nowrap;
	}

	.pill--pass {
		background: #e8f6ee;
		color: #167a3d;
	}

	.pill--fail {
		background: #fdecea;
		color: #b3261e;
	}

	.pager {
		display: flex;
		align-items: center;
		gap: 1rem;
		margin-top: 1.3rem;
	}

	.pager__label {
		color: var(--ink-400);
		font-size: 0.9rem;
	}

	.pager :global(.btn),
	.pager .is-disabled {
		padding: 0.45rem 1.1rem;
		font-size: 0.88rem;
	}

	.is-disabled {
		opacity: 0.45;
		pointer-events: none;
	}
</style>
