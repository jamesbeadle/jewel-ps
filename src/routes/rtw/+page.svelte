<script>
	import { onMount } from 'svelte';

	/**
	 * Right to Work check tool — originally Jeremy Ferendinos' standalone RTW
	 * Portal, integrated into the site as a normal page (v1.2): site header
	 * and footer, no separate portal chrome. The check wording, the
	 * 1 Oct 2026 / 28-day follow-up date logic, the GOV.UK links and the
	 * register row column order are Jeremy's and must not change without his
	 * sign-off (see the handover note).
	 *
	 * Each company serves its own copy of this tool on its own site, so the
	 * engaging company is fixed per deployment instead of selected.
	 */
	const ENTITY = 'JPS';

	const ENG_TYPES = [
		'Employee',
		'Sole-trader subcontractor',
		'Casual / temporary worker',
		'Platform engagement',
		'Ltd co subcontractor (no check - own staff)'
	];

	onMount(() => {
		/** @type {{ engType: string | null, route: string | null, limited: string | null, outcome: string | null }} */
		const state = { engType: null, route: null, limited: null, outcome: null };

		/**
		 * @param {string} id
		 * @returns {HTMLElement}
		 */
		const $id = (id) => /** @type {HTMLElement} */ (document.getElementById(id));
		/**
		 * @param {string} id
		 * @returns {HTMLInputElement}
		 */
		const field = (id) => /** @type {HTMLInputElement} */ (/** @type {unknown} */ ($id(id)));
		/** @param {string} id */
		const val = (id) => field(id).value.trim() !== '';
		/** @param {string} id */
		const chk = (id) => field(id).checked;

		/**
		 * @param {string} containerId
		 * @param {string[]} items
		 * @param {string} attr
		 * @param {(v: string) => void} onPick
		 */
		function radio(containerId, items, attr, onPick) {
			const box = $id(containerId);
			/** @type {HTMLElement[]} */
			const opts = items.length
				? items.map((t) => {
						const d = document.createElement('div');
						d.className = 'radio-opt';
						d.textContent = t;
						d.setAttribute(attr, t);
						box.appendChild(d);
						return d;
					})
				: Array.from(box.querySelectorAll('.radio-opt'));
			opts.forEach((d) => {
				d.onclick = () => {
					opts.forEach((o) => o.classList.remove('on'));
					d.classList.add('on');
					onPick(d.getAttribute(attr) ?? '');
					refresh();
				};
			});
		}

		radio('engType', ENG_TYPES, 'data-val', (v) => {
			state.engType = v;
			$id('ltdBanner').classList.toggle('hidden', v.indexOf('Ltd co') !== 0);
			checkPreOct();
		});

		field('startDate').addEventListener('change', () => {
			checkPreOct();
			refresh();
		});
		function checkPreOct() {
			const sd = field('startDate').value;
			const show =
				!!sd &&
				sd < '2026-10-01' &&
				!!state.engType &&
				state.engType !== 'Employee' &&
				state.engType.indexOf('Ltd co') !== 0;
			$id('preOctBanner').classList.toggle('hidden', !show);
		}

		radio('routeGroup', [], 'data-route', (v) => {
			state.route = v;
			$id('onlineRoute').classList.toggle('hidden', v !== 'online');
			$id('manualRoute').classList.toggle('hidden', v !== 'manual');
		});

		radio('limitedGroup', [], 'data-lim', (v) => {
			state.limited = v;
			$id('expiryWrap').classList.toggle('hidden', v !== 'yes');
		});

		field('expiry').addEventListener('change', function () {
			const d = this.value;
			if (!d) return;
			const f = followupDate(d);
			$id('followupNote').textContent =
				'Follow-up check due by ' +
				ukDate(f) +
				' (four weeks before expiry). Diarise it now as well as recording it in the register. Work must not continue past ' +
				ukDate(d) +
				' without a new check.';
			refresh();
		});

		radio('outcomeGroup', [], 'data-out', (v) => {
			state.outcome = v;
			$id('failBanner').classList.toggle('hidden', v === 'Pass');
		});

		['fullName', 'trade', 'checkedBy', 'shareCode', 'dob', 'docDetail', 'evidenceRef'].forEach(
			(id) => field(id).addEventListener('input', refresh)
		);
		['c1', 'c2', 'c3'].forEach((id) => field(id).addEventListener('change', refresh));

		/** @param {number} n */
		function sectionComplete(n) {
			const isLtd = !!state.engType && state.engType.indexOf('Ltd co') === 0;
			switch (n) {
				case 1:
					return val('fullName') && val('startDate') && val('checkedBy');
				case 2:
					return !!state.engType;
				case 3:
					if (isLtd) return true;
					if (state.route === 'online') return val('shareCode') && val('dob');
					if (state.route === 'manual') return val('docDetail');
					return false;
				case 4:
					return isLtd || (chk('c1') && chk('c2') && chk('c3'));
				case 5:
					return isLtd || state.limited === 'no' || (state.limited === 'yes' && val('expiry'));
				case 6:
					return isLtd || !!state.outcome;
			}
			return false;
		}

		function refresh() {
			for (let n = 1; n <= 6; n++) {
				const done = sectionComplete(n);
				$id('step' + n).classList.toggle('complete', done);
				const rs = /** @type {HTMLElement} */ (
					document.querySelector('.rail-step[data-for="step' + n + '"]')
				);
				rs.classList.toggle('done', done);
				const dot = /** @type {HTMLElement} */ (rs.querySelector('.dot'));
				dot.innerHTML = done ? '&#10003;' : String(n);
			}
		}

		/** @param {string} iso */
		function followupDate(iso) {
			const p = iso.split('-');
			const dt = new Date(Date.UTC(+p[0], +p[1] - 1, +p[2]));
			dt.setUTCDate(dt.getUTCDate() - 28);
			return dt.toISOString().slice(0, 10);
		}
		/** @param {string} iso */
		function ukDate(iso) {
			if (!iso) return '';
			const p = iso.split('-');
			return p[2] + '/' + p[1] + '/' + p[0];
		}
		function todayISO() {
			const n = new Date();
			return (
				n.getFullYear() +
				'-' +
				String(n.getMonth() + 1).padStart(2, '0') +
				'-' +
				String(n.getDate()).padStart(2, '0')
			);
		}

		$id('generateBtn').onclick = () => {
			const name = field('fullName').value.trim();
			/** @type {string[]} */
			const errs = [];
			if (!name) errs.push("enter the individual's full name");
			if (!field('startDate').value) errs.push('enter the start date');
			if (!field('checkedBy').value.trim()) errs.push('enter your name as checker');
			if (!state.engType) errs.push('select the engagement type');
			const isLtd = !!state.engType && state.engType.indexOf('Ltd co') === 0;
			if (!isLtd) {
				if (!state.route) errs.push('select the check route');
				if (!(chk('c1') && chk('c2') && chk('c3'))) errs.push('tick all three confirmations');
				if (!state.limited) errs.push('answer the time-limited question');
				if (state.limited === 'yes' && !field('expiry').value) errs.push('enter the expiry date');
				if (!state.outcome) errs.push('select the outcome');
			}
			if (errs.length) {
				alert('Before generating: ' + errs.join('; ') + '.');
				return;
			}

			const trade = field('trade').value.trim();
			const start = field('startDate').value;
			const checker = field('checkedBy').value.trim();
			const method = isLtd
				? 'Not required'
				: state.route === 'online'
					? 'Home Office online (share code)'
					: 'Manual document check';
			const docSeen = isLtd
				? 'n/a - checks own staff'
				: state.route === 'online'
					? 'Share code ' + field('shareCode').value.trim() + ', DOB ' + ukDate(field('dob').value)
					: field('docDetail').value.trim();
			const outcome = isLtd ? 'n/a' : (state.outcome ?? '');
			const expiry = state.limited === 'yes' ? field('expiry').value : '';
			const follow = expiry ? followupDate(expiry) : '';
			const evidence = field('evidenceRef').value.trim();
			const checkDate = isLtd ? '' : todayISO();
			/** @type {string[]} */
			const notes = [];
			if (isLtd) notes.push('Ltd co with own staff - confirm RTW warranty in subcontract');
			if (start < '2026-10-01' && !isLtd && state.engType !== 'Employee')
				notes.push('Voluntary check - engagement pre-dates 1 Oct 2026');

			const row = [
				'',
				ENTITY,
				name,
				trade,
				state.engType,
				ukDate(start),
				method,
				docSeen,
				ukDate(checkDate),
				checker,
				outcome,
				ukDate(expiry),
				ukDate(follow),
				evidence,
				notes.join('. ')
			].join('\t');
			field('rowOutput').value = row;

			const banner = $id('resultBanner');
			if (isLtd) {
				banner.className = 'banner info';
				banner.innerHTML =
					'No check required by us. Confirm the RTW warranty is in the subcontract before they start.';
			} else if (outcome === 'Pass') {
				banner.className = 'banner ok';
				banner.innerHTML =
					'<span class="pill pass">PASS</span> &nbsp;' + name + ' is cleared to start.';
			} else {
				banner.className = 'banner stop';
				banner.innerHTML =
					'<span class="pill fail">FAIL</span> &nbsp;' +
					name +
					' must not start. Refer to the procedure owner today.';
			}

			/** @type {[string, string][]} */
			const pairs = [
				['Individual', name + (trade ? ' (' + trade + ')' : '')],
				['Engaging company', ENTITY],
				['Engagement type', state.engType ?? ''],
				['Start date', ukDate(start)],
				['Check method', method],
				['Document / code', docSeen],
				['Check date', checkDate ? ukDate(checkDate) : 'n/a'],
				['Checked by', checker],
				['Outcome', outcome],
				['Permission expiry', expiry ? ukDate(expiry) : 'None'],
				['Follow-up due', follow ? ukDate(follow) : 'None'],
				['Evidence ref', evidence || '[not entered]']
			];
			const grid = $id('summaryGrid');
			grid.innerHTML = '';
			pairs.forEach((p2) => {
				const dt = document.createElement('dt');
				dt.textContent = p2[0];
				const dd = document.createElement('dd');
				dd.textContent = p2[1];
				grid.appendChild(dt);
				grid.appendChild(dd);
			});

			// Save the entry to the site's register log (viewed at /admin/rtw).
			// Runs alongside copy/print - a failed save never blocks the check.
			saveToLog([
				{
					entity: ENTITY,
					full_name: name,
					trade: trade,
					engagement_type: state.engType,
					start_date: start,
					check_method: method,
					document_seen: docSeen,
					check_date: checkDate,
					checked_by: checker,
					outcome: outcome,
					permission_expiry: expiry,
					followup_due: follow,
					evidence_ref: evidence,
					notes: notes.join('. ')
				}
			]);

			$id('result').classList.remove('hidden');
			$id('result').scrollIntoView({ behavior: 'smooth' });
		};

		let lastSavedKey = '';
		/** @param {Record<string, unknown>[]} entries */
		function saveToLog(entries) {
			const s = $id('saveStatus');
			const key = JSON.stringify(entries);
			if (key === lastSavedKey) {
				s.textContent = 'Already saved to the register log.';
				return;
			}
			s.textContent = 'Saving to the register log…';
			fetch('/rtw/submit', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ entries })
			})
				.then((r) => (r.ok ? r.json() : Promise.reject()))
				.then((d) => {
					lastSavedKey = key;
					s.textContent =
						'Saved to the register log (' +
						d.saved +
						(d.saved === 1 ? ' row' : ' rows') +
						'). Still paste the row into the group register.';
				})
				.catch(() => {
					s.textContent =
						'Could not save to the register log - copy the row into the register as usual and tell the site admin.';
				});
		}

		$id('copyBtn').onclick = () => {
			const ta = field('rowOutput');
			ta.select();
			ta.setSelectionRange(0, 999999);
			let done = false;
			if (navigator.clipboard && navigator.clipboard.writeText) {
				navigator.clipboard.writeText(ta.value).then(() => {}).catch(() => {});
				done = true;
			}
			if (!done) {
				try {
					document.execCommand('copy');
				} catch {
					/* no-op */
				}
			}
			const b = $id('copyBtn');
			b.textContent = 'Copied';
			setTimeout(() => {
				b.textContent = 'Copy row';
			}, 1600);
		};
	});
</script>

<svelte:head>
	<title>Right to Work Check | Jewel Property Serve Ltd</title>
	<meta name="robots" content="noindex, nofollow" />
</svelte:head>

<section class="no-print bg-night pt-36 pb-14 lg:pt-44">
	<div class="container-site">
		<p class="kicker">Internal compliance</p>
		<h1 class="h-section mt-5 text-white">Right to Work Check</h1>
		<p class="lede mt-6 max-w-2xl">
			Guided statutory check for every new individual engagement at Jewel Property Serve, in force
			for engagements starting on or after 1 October 2026.
		</p>
		<span class="rule-chip">&#9888;&#65038; No completed check, no start - no exceptions</span>
	</div>
</section>

<section class="rtwp">
	<div class="rtwp__inner">
		<div class="rail" id="rail">
			<div class="rail-step" data-for="step1"><span class="dot">1</span>Details</div>
			<div class="rail-step" data-for="step2"><span class="dot">2</span>Engagement</div>
			<div class="rail-step" data-for="step3"><span class="dot">3</span>Route</div>
			<div class="rail-step" data-for="step4"><span class="dot">4</span>Confirmations</div>
			<div class="rail-step" data-for="step5"><span class="dot">5</span>Expiry</div>
			<div class="rail-step" data-for="step6"><span class="dot">6</span>Outcome</div>
		</div>

		<div id="printhead">
			<h1>Jewel Property Serve - Right to Work Check Record</h1>
			<p>
				Generated by the Jewel Property Serve RTW check tool. File with the check evidence. Retain
				for the engagement plus two years.
			</p>
		</div>

		<div class="card" id="step1">
			<h2>
				<span class="stepnum">1</span>Who is being engaged?
				<span class="tick">&#10003; Complete</span>
			</h2>
			<div class="grid2">
				<div>
					<label for="fullName">Full name of individual</label><input
						type="text"
						id="fullName"
						placeholder="e.g. John Smith"
					/>
				</div>
				<div>
					<label for="trade">Trade / role</label><input
						type="text"
						id="trade"
						placeholder="e.g. Fire stopping operative"
					/>
				</div>
				<div>
					<label for="startDate">Start date of engagement</label><input type="date" id="startDate" />
				</div>
				<div>
					<label for="checkedBy">Person carrying out the check</label><input
						type="text"
						id="checkedBy"
						placeholder="Your name"
					/>
				</div>
			</div>
		</div>

		<div class="card" id="step2">
			<h2>
				<span class="stepnum">2</span>Engagement type <span class="tick">&#10003; Complete</span>
			</h2>
			<div class="radio-group" id="engType"></div>
			<div id="ltdBanner" class="banner info hidden">
				A limited company subcontractor with its own employees checks its own staff. No check by us,
				but confirm the RTW warranty is in the subcontract. You can still log this below for the
				record.
			</div>
			<div id="preOctBanner" class="banner info hidden">
				Start date is before 1 October 2026: a check is only legally required for employees. It is
				still good practice to run one - continuing records a voluntary check. A re-engagement after
				a break on or after 1 October needs a full check.
			</div>
		</div>

		<div class="card" id="step3">
			<h2><span class="stepnum">3</span>Route <span class="tick">&#10003; Complete</span></h2>
			<div class="radio-group" id="routeGroup">
				<div class="radio-opt" data-route="online">
					Non-UK national - Home Office online check with share code (free)
				</div>
				<div class="radio-opt" data-route="manual">
					British or Irish passport holder - manual passport check
				</div>
			</div>
			<div id="onlineRoute" class="hidden">
				<p class="muted">
					The individual gets their share code at
					<a href="https://www.gov.uk/prove-right-to-work" target="_blank" rel="noopener"
						>gov.uk/prove-right-to-work</a
					>. You check it at
					<a href="https://www.gov.uk/view-right-to-work" target="_blank" rel="noopener"
						>gov.uk/view-right-to-work</a
					>
					- when asked for the organisation carrying out the check, enter the engaging company's
					full name exactly. Codes are valid for 90 days.
				</p>
				<div class="grid2">
					<div>
						<label for="shareCode">Share code</label><input
							type="text"
							id="shareCode"
							placeholder="e.g. W12 345 678"
						/>
					</div>
					<div><label for="dob">Date of birth</label><input type="date" id="dob" /></div>
				</div>
			</div>
			<div id="manualRoute" class="hidden">
				<p class="muted">
					You must be holding the original passport, with the individual present in person or on a
					live video call. The passport must be current - the draft Home Office guidance does not
					accept expired passports for manual checks. Copy every relevant page (photo, date of
					birth, nationality, signature, expiry) and mark the copy: "The date on which this right
					to work check was made: [date]".
				</p>
				<label for="docDetail">Document seen (type and number)</label>
				<input type="text" id="docDetail" placeholder="e.g. British passport 123456789" />
			</div>
		</div>

		<div class="card" id="step4">
			<h2>
				<span class="stepnum">4</span>Confirmations <span class="tick">&#10003; Complete</span>
			</h2>
			<label class="checkitem"
				><input type="checkbox" id="c1" /><span
					>The document or online profile is genuine and current (or an in-date share code result),
					and permits the work in question.</span
				></label
			>
			<label class="checkitem"
				><input type="checkbox" id="c2" /><span
					>The photo and date of birth match the individual, checked in person or on a live video
					call (likeness check).</span
				></label
			>
			<label class="checkitem"
				><input type="checkbox" id="c3" /><span
					>Evidence saved to the restricted RTW folder, in the engaging company's subfolder: PDF of
					the online result, or the passport copy marked "The date on which this right to work
					check was made: [date]" plus my name.</span
				></label
			>
			<label for="evidenceRef">Evidence file reference</label>
			<input type="text" id="evidenceRef" placeholder="e.g. Smith_J_JPS_011026.pdf" />
		</div>

		<div class="card" id="step5">
			<h2>
				<span class="stepnum">5</span>Time-limited permission?
				<span class="tick">&#10003; Complete</span>
			</h2>
			<div class="radio-group" id="limitedGroup">
				<div class="radio-opt" data-lim="no">No - permission is not time-limited</div>
				<div class="radio-opt" data-lim="yes">Yes - permission expires</div>
			</div>
			<div id="expiryWrap" class="hidden">
				<label for="expiry">Permission expiry date</label>
				<input type="date" id="expiry" />
				<p class="muted" id="followupNote"></p>
			</div>
		</div>

		<div class="card" id="step6">
			<h2><span class="stepnum">6</span>Outcome <span class="tick">&#10003; Complete</span></h2>
			<div class="radio-group" id="outcomeGroup">
				<div class="radio-opt" data-out="Pass">Pass - cleared to start</div>
				<div class="radio-opt" data-out="Fail - do not start">
					Fail - do not start, refer to the procedure owner
				</div>
			</div>
			<div id="failBanner" class="banner stop hidden">
				Do not allow this individual to start. Tell the site manager and the procedure owner today.
			</div>
			<button class="tbtn tbtn-gold no-print" id="generateBtn"
				>Generate register entry &#8594;</button
			>
		</div>

		<div class="card hidden" id="result">
			<h2>Completed check record</h2>
			<div id="resultBanner"></div>
			<dl class="summary-grid" id="summaryGrid"></dl>
			<div class="no-print">
				<label for="rowOutput" style="margin-top:16px"
					>Register row - paste into the group register (columns match exactly)</label
				>
				<textarea id="rowOutput" readonly></textarea>
			</div>
			<button class="tbtn tbtn-primary no-print" id="copyBtn">Copy row</button>
			<button class="tbtn tbtn-secondary no-print" onclick={() => window.print()}
				>Print / save as PDF</button
			>
			<p class="muted no-print" id="saveStatus" aria-live="polite"></p>
			<p class="muted">
				The printed record can be filed alongside the document copy or online check PDF as part of
				the evidence.
			</p>
		</div>
	</div>
</section>

<style>
	/* Hero rule chip (page hero uses the site's normal hero styles) */
	.rule-chip {
		display: inline-flex;
		align-items: center;
		gap: 8px;
		margin-top: 1.1rem;
		background: #fff6df;
		border: 1px solid #eedc9a;
		color: #935f00;
		font-size: 0.85rem;
		font-weight: 600;
		padding: 6px 14px;
		border-radius: 999px;
	}

	/* Tool styles — ported from Jeremy's standalone portal, namespaced under
	   .rtwp. :global() is used because several elements (radio options,
	   summary rows, banner states) are created or re-classed at runtime. */
	.rtwp {
		--navy: #14213d;
		--navy-2: #1d2f57;
		--gold: #c9a227;
		--bg: #eef0f4;
		--tcard: #ffffff;
		--tborder: #dce0e8;
		--ttext: #1c2026;
		--tmuted: #667085;
		--green: #167a3d;
		--green-bg: #e8f6ee;
		--red: #b3261e;
		--red-bg: #fdecea;
		--amber: #935f00;
		--amber-bg: #fff6df;
		--tradius: 14px;
		--tshadow: 0 1px 3px rgba(16, 24, 40, 0.07), 0 6px 18px rgba(16, 24, 40, 0.05);
		background: var(--bg);
		border-block: 1px solid var(--tborder);
		color: var(--ttext);
		line-height: 1.55;
		padding: 26px 24px 70px;
	}

	.rtwp__inner {
		max-width: 860px;
		margin: 0 auto;
	}

	.rtwp :global(.rail) {
		background: var(--tcard);
		border: 1px solid var(--tborder);
		border-radius: var(--tradius);
		box-shadow: var(--tshadow);
		display: flex;
		overflow-x: auto;
		padding: 12px 10px;
		gap: 4px;
	}

	.rtwp :global(.rail-step) {
		display: flex;
		align-items: center;
		gap: 7px;
		font-size: 0.74rem;
		font-weight: 600;
		color: var(--tmuted);
		padding: 6px 10px;
		border-radius: 8px;
		white-space: nowrap;
	}

	.rtwp :global(.rail-step .dot) {
		width: 20px;
		height: 20px;
		border-radius: 50%;
		border: 2px solid var(--tborder);
		display: inline-flex;
		align-items: center;
		justify-content: center;
		font-size: 0.66rem;
		color: var(--tmuted);
		background: #fff;
	}

	.rtwp :global(.rail-step.done) {
		color: var(--green);
	}

	.rtwp :global(.rail-step.done .dot) {
		background: var(--green);
		border-color: var(--green);
		color: #fff;
	}

	.rtwp :global(.card) {
		background: var(--tcard);
		border: 1px solid var(--tborder);
		border-radius: var(--tradius);
		box-shadow: var(--tshadow);
		padding: 24px;
		margin-top: 18px;
	}

	.rtwp :global(.card h2) {
		font-size: 1.02rem;
		color: var(--navy);
		display: flex;
		align-items: center;
		gap: 10px;
		margin: 0;
	}

	.rtwp :global(.stepnum) {
		width: 26px;
		height: 26px;
		border-radius: 8px;
		background: var(--navy);
		color: #fff;
		font-size: 0.8rem;
		font-weight: 700;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		flex-shrink: 0;
	}

	.rtwp :global(.card h2 .tick) {
		margin-left: auto;
		font-size: 0.75rem;
		font-weight: 700;
		color: var(--green);
		visibility: hidden;
	}

	.rtwp :global(.card.complete h2 .tick) {
		visibility: visible;
	}

	.rtwp :global(.card.complete .stepnum) {
		background: var(--green);
	}

	.rtwp :global(label) {
		display: block;
		font-size: 0.8rem;
		font-weight: 650;
		margin: 14px 0 5px;
		color: #344054;
	}

	.rtwp :global(input[type='text']),
	.rtwp :global(input[type='date']) {
		width: 100%;
		padding: 10px 12px;
		border: 1.5px solid var(--tborder);
		border-radius: 9px;
		font-size: 0.95rem;
		font-family: inherit;
		background: #fff;
		transition:
			border-color 0.15s,
			box-shadow 0.15s;
	}

	.rtwp :global(input:focus) {
		outline: none;
		border-color: var(--navy);
		box-shadow: 0 0 0 3px rgba(20, 33, 61, 0.12);
	}

	.rtwp :global(.grid2) {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 0 16px;
	}

	@media (max-width: 560px) {
		.rtwp :global(.grid2) {
			grid-template-columns: 1fr;
		}
	}

	.rtwp :global(.radio-group) {
		display: flex;
		flex-direction: column;
		gap: 9px;
		margin-top: 8px;
	}

	.rtwp :global(.radio-opt) {
		border: 1.5px solid var(--tborder);
		border-radius: 10px;
		padding: 12px 14px;
		cursor: pointer;
		font-size: 0.92rem;
		background: #fff;
		transition: all 0.15s;
		display: flex;
		align-items: center;
		gap: 10px;
	}

	.rtwp :global(.radio-opt)::before {
		content: '';
		width: 16px;
		height: 16px;
		border-radius: 50%;
		border: 2px solid var(--tborder);
		flex-shrink: 0;
		transition: all 0.15s;
	}

	.rtwp :global(.radio-opt:hover) {
		border-color: var(--navy);
	}

	.rtwp :global(.radio-opt.on) {
		border-color: var(--navy);
		background: #f2f5fb;
	}

	.rtwp :global(.radio-opt.on)::before {
		border-color: var(--navy);
		background: radial-gradient(circle, var(--navy) 45%, transparent 50%);
	}

	.rtwp :global(.banner) {
		border-radius: 10px;
		padding: 13px 16px;
		font-size: 0.88rem;
		margin-top: 14px;
	}

	.rtwp :global(.banner.stop) {
		background: var(--red-bg);
		color: var(--red);
		border: 1px solid #f0b9b5;
		font-weight: 650;
	}

	.rtwp :global(.banner.ok) {
		background: var(--green-bg);
		color: var(--green);
		border: 1px solid #bfe5cc;
		font-weight: 650;
	}

	.rtwp :global(.banner.info) {
		background: var(--amber-bg);
		color: var(--amber);
		border: 1px solid #eedc9a;
	}

	.rtwp :global(.checkitem) {
		display: flex;
		gap: 12px;
		align-items: flex-start;
		padding: 11px 0;
		border-bottom: 1px solid #f1f3f6;
		font-size: 0.9rem;
		font-weight: 400;
		cursor: pointer;
		color: var(--ttext);
	}

	.rtwp :global(.checkitem:last-of-type) {
		border-bottom: none;
	}

	.rtwp :global(.checkitem input) {
		margin-top: 3px;
		width: 17px;
		height: 17px;
		flex-shrink: 0;
		accent-color: var(--navy);
	}

	.rtwp :global(a) {
		color: var(--navy-2);
		font-weight: 600;
	}

	.rtwp :global(.muted) {
		color: var(--tmuted);
		font-size: 0.82rem;
		margin-top: 8px;
	}

	.rtwp :global(.tbtn) {
		display: inline-flex;
		align-items: center;
		gap: 8px;
		border: none;
		border-radius: 10px;
		padding: 13px 24px;
		font-size: 0.95rem;
		font-family: inherit;
		font-weight: 700;
		cursor: pointer;
		margin-top: 16px;
		transition: all 0.15s;
	}

	.rtwp :global(.tbtn-primary) {
		background: var(--navy);
		color: #fff;
		box-shadow: 0 2px 10px rgba(20, 33, 61, 0.35);
	}

	.rtwp :global(.tbtn-primary:hover) {
		background: var(--navy-2);
		transform: translateY(-1px);
	}

	.rtwp :global(.tbtn-gold) {
		background: var(--gold);
		color: var(--navy);
	}

	.rtwp :global(.tbtn-gold:hover) {
		filter: brightness(1.05);
		transform: translateY(-1px);
	}

	.rtwp :global(.tbtn-secondary) {
		background: #fff;
		color: var(--navy);
		border: 1.5px solid var(--navy);
		margin-left: 10px;
	}

	.rtwp :global(.hidden) {
		display: none;
	}

	.rtwp :global(textarea) {
		width: 100%;
		min-height: 84px;
		font-family: 'SF Mono', Consolas, monospace;
		font-size: 0.74rem;
		border: 1.5px solid var(--tborder);
		border-radius: 9px;
		padding: 12px;
		margin-top: 8px;
		white-space: pre;
		background: #fafbfc;
	}

	.rtwp :global(.summary-grid) {
		display: grid;
		grid-template-columns: 170px 1fr;
		gap: 8px 14px;
		font-size: 0.88rem;
		margin-top: 12px;
		margin-bottom: 0;
	}

	.rtwp :global(.summary-grid dt) {
		font-weight: 650;
		color: var(--tmuted);
	}

	.rtwp :global(.summary-grid dd) {
		margin: 0;
	}

	.rtwp :global(.pill) {
		display: inline-block;
		padding: 3px 12px;
		border-radius: 999px;
		font-size: 0.76rem;
		font-weight: 750;
		letter-spacing: 0.03em;
	}

	.rtwp :global(.pill.pass) {
		background: var(--green-bg);
		color: var(--green);
	}

	.rtwp :global(.pill.fail) {
		background: var(--red-bg);
		color: var(--red);
	}

	.rtwp :global(#printhead) {
		display: none;
	}

	@media print {
		/* Hide the site chrome and the form; print only the check record. */
		:global(header),
		:global(footer),
		.no-print,
		.rtwp :global(.rail),
		.rtwp :global(.no-print),
		.rtwp :global(.tbtn),
		.rtwp :global(#step1),
		.rtwp :global(#step2),
		.rtwp :global(#step3),
		.rtwp :global(#step4),
		.rtwp :global(#step5),
		.rtwp :global(#step6) {
			display: none !important;
		}

		.rtwp {
			background: #fff;
			border: none;
			padding: 0;
		}

		.rtwp__inner {
			max-width: 100%;
		}

		.rtwp :global(.card) {
			border: 1px solid #999;
			box-shadow: none;
			break-inside: avoid;
		}

		.rtwp :global(#printhead) {
			display: block !important;
			padding: 0 0 12px;
		}

		.rtwp :global(#printhead h1) {
			font-size: 1.1rem;
			color: #14213d;
			margin: 0;
		}

		.rtwp :global(#printhead p) {
			font-size: 0.78rem;
			color: #555;
			margin: 0;
		}
	}
</style>
