<script>
	import { enhance } from '$app/forms';
	import { contact, social, enquiryTypes, faqs, img } from '$lib/site.js';
	import { reveal } from '$lib/motion.js';
	import Seo from '$lib/components/Seo.svelte';
	import Icon from '$lib/components/Icon.svelte';
	import Faq from '$lib/components/Faq.svelte';
	import Accreditations from '$lib/components/Accreditations.svelte';

	/** @type {{ form: any }} */
	let { form } = $props();
	let submitting = $state(false);

	const v = $derived(form?.values ?? {});
	const errors = $derived(form?.errors ?? {});

	const mailtoFallback = $derived(
		`mailto:${contact.email}?subject=${encodeURIComponent('Enquiry from jewelps.co.uk')}&body=${encodeURIComponent(
			`Name: ${v.name ?? ''}\nEmail: ${v.email ?? ''}\nPhone: ${v.phone ?? ''}\nPostcode: ${v.postcode ?? ''}\nService: ${v.service ?? ''}\n\n${v.message ?? ''}`
		)}`
	);

	const inputClass =
		'w-full rounded-2xl border border-white/10 bg-night/70 px-5 py-4 text-white placeholder:text-white/30 transition focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/30';
</script>

<Seo
	title="Contact us"
	description="Get in touch with Jewel Property Serve for a free quote or 24-hour emergency callout. Call 0208 109 1012 or email enquiries@jewelps.co.uk. 48 Warwick Street, London W1B 5AW."
/>

<!-- Hero -->
<section class="relative isolate overflow-hidden bg-night pt-36 pb-12 lg:pt-44 lg:pb-16">
	<div class="pointer-events-none absolute -right-40 top-0 -z-10 h-[40rem] w-[40rem] rounded-full bg-blue/15 blur-[120px]"></div>
	<div class="container-site" use:reveal={{ stagger: true }}>
		<p class="kicker">Contact</p>
		<h1 class="h-display mt-5 max-w-3xl text-white">Get in touch.</h1>
		<p class="lede mt-6 max-w-2xl">Tell us about your property and we’ll come back to you quickly with the best course of action — or call us any time for an emergency.</p>
	</div>
</section>

<section class="bg-night pb-24 sm:pb-32">
	<div class="container-site grid gap-10 lg:grid-cols-12 lg:gap-14">
		<!-- Contact cards -->
		<aside class="space-y-4 lg:col-span-5" use:reveal={{ stagger: true }}>
			<a href={contact.phoneHref} class="card group flex items-center gap-5 border-gold/40 bg-gold/[0.06] p-6 transition hover:bg-gold/10">
				<span class="relative flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-gold text-night">
					<span class="absolute inset-0 animate-pulseRing rounded-full bg-gold/60"></span>
					<Icon name="phone" size={24} class="relative" />
				</span>
				<span>
					<span class="block font-display text-[11px] font-semibold uppercase tracking-kicker text-gold">24hr emergency &amp; enquiries</span>
					<span class="block font-display text-2xl font-semibold text-white">{contact.phone}</span>
				</span>
			</a>
			<a href="mailto:{contact.email}" class="card group flex items-center gap-5 p-6 transition hover:border-gold/40">
				<span class="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-blue/20 text-blue-light"><Icon name="mail" size={24} /></span>
				<span>
					<span class="block font-display text-[11px] font-semibold uppercase tracking-kicker text-grey">Email</span>
					<span class="block font-display text-lg font-semibold text-white group-hover:text-gold">{contact.email}</span>
				</span>
			</a>
			<a href={contact.mapLink} target="_blank" rel="noopener" class="card group flex items-center gap-5 p-6 transition hover:border-gold/40">
				<span class="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-blue/20 text-blue-light"><Icon name="pin" size={24} /></span>
				<span>
					<span class="block font-display text-[11px] font-semibold uppercase tracking-kicker text-grey">Office</span>
					<span class="block font-display text-lg font-semibold text-white group-hover:text-gold">{contact.address}</span>
				</span>
			</a>
			<div class="card p-6">
				<p class="font-display text-[11px] font-semibold uppercase tracking-kicker text-grey">Hours</p>
				<p class="mt-2 text-white/85">{contact.hours}</p>
				<div class="mt-5 flex flex-wrap gap-2 text-sm">
					<a href={social.instagram} target="_blank" rel="noopener" class="rounded-full border border-white/10 px-4 py-2 transition hover:border-gold hover:text-gold">Instagram</a>
					<a href={social.linkedin} target="_blank" rel="noopener" class="rounded-full border border-white/10 px-4 py-2 transition hover:border-gold hover:text-gold">LinkedIn</a>
					<a href={social.facebook} target="_blank" rel="noopener" class="rounded-full border border-white/10 px-4 py-2 transition hover:border-gold hover:text-gold">Facebook</a>
					<a href={social.checkatrade} target="_blank" rel="noopener" class="rounded-full border border-white/10 px-4 py-2 transition hover:border-gold hover:text-gold">Checkatrade</a>
				</div>
			</div>
			<div class="overflow-hidden rounded-3xl border border-white/[0.06]">
				<iframe
					title="Map showing Jewel Property Serve, 48 Warwick Street, London"
					src={contact.mapEmbed}
					class="h-64 w-full grayscale invert-[0.9] hue-rotate-180 contrast-[0.9]"
					loading="lazy"
					referrerpolicy="no-referrer-when-downgrade"
					allowfullscreen
				></iframe>
			</div>
		</aside>

		<!-- Form -->
		<div class="lg:col-span-7" use:reveal>
			<div class="card p-6 sm:p-10">
				{#if form?.success}
					<div class="flex flex-col items-start gap-4 py-8">
						<span class="flex h-14 w-14 items-center justify-center rounded-full bg-gold text-night"><Icon name="check" size={26} /></span>
						<h2 class="font-display text-3xl font-semibold text-white">Thank you — we’ve got it.</h2>
						<p class="max-w-md text-grey">Your enquiry has been received and a member of our service desk will be in touch shortly. If it’s urgent, call us now on <a href={contact.phoneHref} class="font-semibold text-gold">{contact.phone}</a>.</p>
						<a href="/" class="btn-ghost mt-2">Back to home</a>
					</div>
				{:else}
					<h2 class="font-display text-2xl font-semibold text-white sm:text-3xl">Request a free quote</h2>
					<p class="mt-2 text-sm text-grey">Fields marked * are required.</p>

					{#if form?.unavailable || form?.failed}
						<div class="mt-6 rounded-2xl border border-gold/40 bg-gold/[0.08] p-5 text-sm text-white/85">
							<p class="font-semibold text-gold">Sorry — we couldn’t send that automatically.</p>
							<p class="mt-1">Please <a href={mailtoFallback} class="font-semibold text-white underline decoration-gold underline-offset-4">email us your enquiry</a> (we’ve pre-filled it for you) or call <a href={contact.phoneHref} class="font-semibold text-white">{contact.phone}</a>.</p>
						</div>
					{/if}

					<form
						method="POST"
						class="mt-8 grid gap-5 sm:grid-cols-2"
						use:enhance={() => {
							submitting = true;
							return async ({ update }) => {
								await update();
								submitting = false;
							};
						}}
					>
						<div class="hidden" aria-hidden="true">
							<label>Company website <input type="text" name="company_website" tabindex="-1" autocomplete="off" /></label>
						</div>

						<label class="block">
							<span class="mb-2 block text-sm font-medium text-white/80">Name *</span>
							<input type="text" name="name" required autocomplete="name" value={v.name ?? ''} class={inputClass} placeholder="Your name" />
							{#if errors.name}<span class="mt-1 block text-xs text-red-400">{errors.name}</span>{/if}
						</label>
						<label class="block">
							<span class="mb-2 block text-sm font-medium text-white/80">Email *</span>
							<input type="email" name="email" required autocomplete="email" value={v.email ?? ''} class={inputClass} placeholder="you@example.com" />
							{#if errors.email}<span class="mt-1 block text-xs text-red-400">{errors.email}</span>{/if}
						</label>
						<label class="block">
							<span class="mb-2 block text-sm font-medium text-white/80">Phone</span>
							<input type="tel" name="phone" autocomplete="tel" value={v.phone ?? ''} class={inputClass} placeholder="07… / 020…" />
							{#if errors.phone}<span class="mt-1 block text-xs text-red-400">{errors.phone}</span>{/if}
						</label>
						<label class="block">
							<span class="mb-2 block text-sm font-medium text-white/80">Property postcode</span>
							<input type="text" name="postcode" autocomplete="postal-code" value={v.postcode ?? ''} class={inputClass} placeholder="e.g. W1B 5AW" />
						</label>
						<label class="block sm:col-span-2">
							<span class="mb-2 block text-sm font-medium text-white/80">What do you need help with?</span>
							<select name="service" class="{inputClass} appearance-none bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2216%22 height=%2216%22 viewBox=%220 0 24 24%22 fill=%22none%22 stroke=%22%23C09A51%22 stroke-width=%222%22 stroke-linecap=%22round%22><path d=%22M6 9l6 6 6-6%22/></svg>')] bg-[length:16px] bg-[right_1.25rem_center] bg-no-repeat pr-12">
								{#each enquiryTypes as t}
									<option value={t} selected={v.service === t}>{t}</option>
								{/each}
							</select>
						</label>
						<label class="block sm:col-span-2">
							<span class="mb-2 block text-sm font-medium text-white/80">Tell us about the job *</span>
							<textarea name="message" required rows="5" class={inputClass} placeholder="A few details about the property and the works you need…">{v.message ?? ''}</textarea>
							{#if errors.message}<span class="mt-1 block text-xs text-red-400">{errors.message}</span>{/if}
						</label>
						<div class="flex flex-col gap-4 sm:col-span-2 sm:flex-row sm:items-center sm:justify-between">
							<p class="text-xs text-grey/80">We’ll only use your details to respond to your enquiry.</p>
							<button type="submit" class="btn-gold" disabled={submitting}>
								{submitting ? 'Sending…' : 'Send enquiry'}
								{#if !submitting}<Icon name="arrow" size={18} />{/if}
							</button>
						</div>
					</form>
				{/if}
			</div>
		</div>
	</div>
</section>

<!-- FAQs -->
<section id="faqs" class="bg-night-2 py-24 sm:py-32">
	<div class="container-site grid gap-12 lg:grid-cols-12">
		<div class="lg:col-span-4" use:reveal>
			<p class="kicker">FAQs</p>
			<h2 class="h-section mt-5 text-white">Good to know.</h2>
			<p id="careers" class="mt-6 text-grey">Can’t find what you’re looking for? Our service desk is happy to help on <a href={contact.phoneHref} class="font-semibold text-gold">{contact.phone}</a>.</p>
		</div>
		<div class="lg:col-span-8">
			<Faq items={faqs} />
		</div>
	</div>
</section>

<Accreditations />
