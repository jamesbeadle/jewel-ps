<script>
	import { page } from '$app/stores';
	import { contact } from '$lib/site.js';
	import Icon from '$lib/components/Icon.svelte';
</script>

<svelte:head>
	<title>{$page.status === 404 ? 'Page not found' : 'Something went wrong'} | Jewel Property Serve</title>
</svelte:head>

<section class="relative isolate flex min-h-[100svh] items-center overflow-hidden bg-night pt-24">
	<div class="container-site">
		<p class="kicker">{$page.status}</p>
		<h1 class="h-display mt-5 max-w-3xl text-white">
			{$page.status === 404 ? 'We couldn’t find that page.' : 'Something went wrong.'}
		</h1>
		<p class="lede mt-6 max-w-xl">
			{$page.status === 404
				? 'The page may have moved during our site refresh. Try the links below, or call us — we’re always happy to help.'
				: 'Please try again in a moment, or call our service desk.'}
		</p>
		<div class="mt-9 flex flex-wrap gap-3">
			<a href="/" class="btn-gold">Back to home <Icon name="arrow" size={18} /></a>
			<a href={contact.phoneHref} class="btn-ghost"><Icon name="phone" size={18} /> {contact.phone}</a>
		</div>
	</div>
</section>
