<script>
	import './admin.css';
	import { page } from '$app/stores';
	import { site } from '$lib/site.js';

	let { data, children } = $props();

	const onLogin = $derived($page.url.pathname === '/admin/login');

	const links = [
		{ label: 'Enquiries', href: '/admin/enquiries' },
		{ label: 'Media', href: '/admin/media' },
		{ label: 'Brochures', href: '/admin/brochure' },
		{ label: 'RTW checks', href: '/admin/rtw' }
	];

	/** @param {string} href */
	function isActive(href) {
		return $page.url.pathname.startsWith(href);
	}
</script>

<svelte:head>
	<meta name="robots" content="noindex, nofollow" />
</svelte:head>

<div class="admin" class:admin--login={onLogin}>
	{#if !onLogin}
		<nav class="admin__nav" aria-label="Admin">
			<div class="container admin__nav-inner">
				<a href="/admin" class="admin__brand" aria-label="Admin dashboard">
					<img src={site.logo} alt="" class="admin__logo" width="290" height="94" />
					<span class="admin__brand-text">Admin</span>
				</a>
				<ul class="admin__links">
					{#each links as link (link.href)}
						<li>
							<a href={link.href} aria-current={isActive(link.href) ? 'page' : undefined}>
								{link.label}
								{#if link.href === '/admin/enquiries' && data.newEnquiries > 0}
									<span class="admin__badge">{data.newEnquiries}</span>
								{/if}
							</a>
						</li>
					{/each}
				</ul>
				<div class="admin__side">
					<a class="admin__view" href="/" target="_blank" rel="noopener">View site ↗</a>
					<form method="POST" action="/admin/logout">
						<button class="admin__logout">Log out</button>
					</form>
				</div>
			</div>
		</nav>
	{/if}
	<div class="container admin__body">
		{@render children()}
	</div>
</div>

<style>
	.admin__nav {
		background: linear-gradient(180deg, #101826, #080c14);
		color: #fff;
		border-bottom: 3px solid var(--accent-500);
		position: sticky;
		top: 0;
		z-index: 50;
		box-shadow: 0 4px 18px rgba(8, 12, 20, 0.25);
	}

	.admin__nav-inner {
		display: flex;
		align-items: center;
		gap: 1.8rem;
		padding-block: 0.7rem;
		flex-wrap: wrap;
	}

	.admin__brand {
		display: inline-flex;
		align-items: center;
		gap: 0.7rem;
		color: #fff;
		text-decoration: none;
		margin-right: auto;
	}

	.admin__logo {
		height: 1.8rem;
		width: auto;
	}

	.admin__brand-text {
		font-family: var(--font-display);
		font-weight: 600;
		font-size: 0.9rem;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--gold-300);
	}

	.admin__links {
		display: flex;
		gap: 0.2rem;
		list-style: none;
		margin: 0;
		padding: 0;
		flex-wrap: wrap;
	}

	.admin__links a {
		display: inline-flex;
		align-items: center;
		gap: 0.45rem;
		color: #c7cdd6;
		text-decoration: none;
		font-family: var(--font-display);
		font-size: 0.93rem;
		font-weight: 500;
		padding: 0.42rem 0.85rem;
		border-radius: 999px;
		transition:
			background-color 0.15s ease,
			color 0.15s ease;
	}

	.admin__links a:hover {
		color: #fff;
		background: rgba(255, 255, 255, 0.09);
	}

	.admin__links a[aria-current='page'] {
		color: #fff;
		background: rgba(19, 94, 170, 0.35);
		box-shadow: inset 0 0 0 1px rgba(47, 127, 211, 0.6);
	}

	.admin__badge {
		background: var(--gold-500);
		color: #080c14;
		font-size: 0.7rem;
		font-weight: 600;
		border-radius: 999px;
		padding: 0.05rem 0.45rem;
		line-height: 1.5;
	}

	.admin__side {
		display: flex;
		align-items: center;
		gap: 0.9rem;
	}

	.admin__view {
		color: #c7cdd6;
		text-decoration: none;
		font-size: 0.88rem;
	}

	.admin__view:hover {
		color: var(--gold-300);
	}

	.admin__logout {
		font: inherit;
		font-family: var(--font-display);
		font-size: 0.85rem;
		background: none;
		border: 1px solid rgba(255, 255, 255, 0.35);
		color: #fff;
		border-radius: 999px;
		padding: 0.32rem 0.95rem;
		cursor: pointer;
		transition:
			background-color 0.15s ease,
			border-color 0.15s ease;
	}

	.admin__logout:hover {
		background: rgba(255, 255, 255, 0.12);
		border-color: rgba(255, 255, 255, 0.6);
	}

	.admin__body {
		padding-block: 2.2rem 3.5rem;
	}

	@media (max-width: 900px) {
		.admin__nav-inner {
			gap: 0.8rem;
		}

		.admin__links {
			order: 3;
			width: 100%;
			padding-bottom: 0.3rem;
		}
	}
</style>
