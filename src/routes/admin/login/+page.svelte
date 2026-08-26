<script>
	import { enhance } from '$app/forms';
	import { site } from '$lib/site.js';

	let { data, form } = $props();
	let submitting = $state(false);
</script>

<svelte:head>
	<title>Admin login | Jewel Property Serve</title>
</svelte:head>

<div class="login">
	<div class="card login__card">
		<div class="login__logo">
			<img src={site.logo} alt="Jewel Property Serve" width="290" height="94" />
		</div>
		<h1>Admin login</h1>
		<p class="login__sub">Enquiries, media, brochures and RTW checks.</p>

		{#if !data.configured}
			<p class="login__warn">
				Admin credentials are not configured. Set <code>ADMIN_USERNAME</code> and
				<code>ADMIN_PASSWORD</code> environment variables, then redeploy.
			</p>
		{/if}
		{#if form?.error}
			<p class="login__error" role="alert">{form.error}</p>
		{/if}
		{#if form?.success}
			<p class="login__success" role="status">
				Logged in — taking you to the dashboard… <a href="/admin">Continue</a>
			</p>
		{/if}

		<form
			method="POST"
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
			<label>
				Username
				<input name="username" autocomplete="username" required />
			</label>
			<label>
				Password
				<input name="password" type="password" autocomplete="current-password" required />
			</label>
			<button class="btn btn--primary" type="submit" disabled={submitting}>
				{submitting ? 'Logging in…' : 'Log in'}
			</button>
		</form>

		<a class="login__back" href="/">← Back to the website</a>
	</div>
</div>

<style>
	.login {
		display: grid;
		place-items: center;
		min-height: 80vh;
		padding: 2rem 0;
	}

	.login__card {
		width: min(410px, 100%);
		padding: 2.2rem 2.2rem 2.4rem;
	}

	.login__logo {
		display: inline-flex;
		background: #101826;
		border-radius: 12px;
		padding: 0.7rem 1rem;
		margin-bottom: 1.4rem;
	}

	.login__logo img {
		height: 2.1rem;
		width: auto;
		display: block;
	}

	.login__card h1 {
		font-size: 1.5rem;
		margin-bottom: 0.2rem;
	}

	.login__sub {
		color: var(--ink-400);
		font-size: 0.92rem;
		margin-bottom: 1.4rem;
	}

	form {
		display: grid;
		gap: 1rem;
	}

	label {
		display: grid;
		gap: 0.3rem;
		font-family: var(--font-display);
		font-size: 0.92rem;
		font-weight: 600;
	}

	input {
		font: inherit;
		font-family: var(--font-body);
		font-weight: 400;
		padding: 0.7rem 0.9rem;
		border: 1px solid var(--line);
		border-radius: var(--radius);
		background: #fff;
	}

	input:focus {
		outline: 2px solid var(--accent-500);
		outline-offset: 1px;
	}

	button {
		justify-self: start;
	}

	.login__error {
		color: #a33a2a;
		background: #fdf1ee;
		border: 1px solid #f0cfc7;
		border-radius: var(--radius);
		padding: 0.7rem 0.9rem;
		margin: 0 0 1rem;
		font-size: 0.92rem;
	}

	.login__success {
		background: #eef7ee;
		border: 1px solid #cfe6cf;
		border-radius: var(--radius);
		padding: 0.7rem 0.9rem;
		margin: 0 0 1rem;
		font-size: 0.92rem;
	}

	.login__warn {
		color: var(--ink-600);
		background: var(--tint);
		border: 1px solid var(--line);
		border-radius: var(--radius);
		padding: 0.7rem 0.9rem;
		font-size: 0.9rem;
		margin: 0 0 1rem;
	}

	.login__back {
		display: block;
		margin-top: 1.5rem;
		text-align: center;
		font-size: 0.85rem;
		color: var(--ink-400);
		text-decoration: none;
	}

	.login__back:hover {
		color: var(--accent-500);
	}
</style>
