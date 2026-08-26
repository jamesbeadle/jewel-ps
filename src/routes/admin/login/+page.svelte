<script>
	import { enhance } from '$app/forms';
	import { site } from '$lib/site.js';

	let { data, form } = $props();
	let submitting = $state(false);

	const inputClass =
		'w-full rounded-xl border border-white/10 bg-night-3 px-4 py-3 text-white placeholder:text-grey/50 focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold';
</script>

<svelte:head>
	<title>Admin login | Jewel Property Serve</title>
</svelte:head>

<div class="flex min-h-[70vh] items-center justify-center">
	<div class="card w-full max-w-sm p-8">
		<img src={site.logo} alt="Jewel Property Serve" class="h-9 w-auto" width="290" height="94" />
		<h1 class="mt-6 text-2xl">Admin login</h1>
		<p class="mt-1 text-sm text-grey">Website enquiries and content.</p>

		{#if !data.configured}
			<p class="mt-5 rounded-xl border border-gold/30 bg-gold/10 px-4 py-3 text-sm text-grey">
				Admin credentials are not configured. Set <code class="text-gold">ADMIN_USERNAME</code> and
				<code class="text-gold">ADMIN_PASSWORD</code> environment variables, then redeploy.
			</p>
		{/if}
		{#if form?.error}
			<p class="mt-5 rounded-xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-200" role="alert">{form.error}</p>
		{/if}
		{#if form?.success}
			<p class="mt-5 rounded-xl border border-green-400/30 bg-green-500/10 px-4 py-3 text-sm text-green-200" role="status">
				Logged in — taking you to the dashboard… <a href="/admin" class="underline">Continue</a>
			</p>
		{/if}

		<form
			method="POST"
			class="mt-6 space-y-4"
			use:enhance={() => {
				submitting = true;
				return async ({ result, update }) => {
					if (result.type === 'success' && /** @type {any} */ (result.data)?.success) {
						// Cookie is already set by the response; go straight to the dashboard.
						window.location.assign('/admin');
						return;
					}
					submitting = false;
					await update(); // renders the error message on failure
				};
			}}
		>
			<label class="block">
				<span class="mb-1.5 block font-display text-xs font-semibold uppercase tracking-kicker text-grey">Username</span>
				<input name="username" autocomplete="username" required class={inputClass} />
			</label>
			<label class="block">
				<span class="mb-1.5 block font-display text-xs font-semibold uppercase tracking-kicker text-grey">Password</span>
				<input name="password" type="password" autocomplete="current-password" required class={inputClass} />
			</label>
			<button class="btn-gold w-full" type="submit" disabled={submitting}>
				{submitting ? 'Logging in…' : 'Log in'}
			</button>
		</form>

		<a href="/" class="mt-6 block text-center text-xs text-grey/70 transition hover:text-gold">← Back to the website</a>
	</div>
</div>
