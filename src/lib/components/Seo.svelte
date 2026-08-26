<script>
	import { page } from '$app/stores';
	import { site } from '$lib/site.js';

	/** @type {{ title?: string, description?: string, image?: string, type?: string }} */
	let { title, description = site.description, image = '/og-image.png', type = 'website' } = $props();

	const fullTitle = $derived(title ? `${title} | ${site.name}` : `${site.name} | Property & Portfolio Estate Maintenance, London`);
	const canonical = $derived(`${site.url}${$page.url.pathname === '/' ? '' : $page.url.pathname}`);
	const ogImage = $derived(image.startsWith('http') ? image : `${site.url}${image}`);
</script>

<svelte:head>
	<title>{fullTitle}</title>
	<meta name="description" content={description} />
	<link rel="canonical" href={canonical} />
	<meta property="og:type" content={type} />
	<meta property="og:site_name" content={site.name} />
	<meta property="og:title" content={fullTitle} />
	<meta property="og:description" content={description} />
	<meta property="og:url" content={canonical} />
	<meta property="og:image" content={ogImage} />
	<meta property="og:locale" content="en_GB" />
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content={fullTitle} />
	<meta name="twitter:description" content={description} />
	<meta name="twitter:image" content={ogImage} />
</svelte:head>
