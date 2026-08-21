<script>
	import { contact, faqs, accreditations, social } from '$lib/site.js';

	let name = $state('');
	let email = $state('');
	let phone = $state('');
	let message = $state('');
	/** @type {number | null} */
	let openFaq = $state(0);

	function submit(/** @type {SubmitEvent} */ e) {
		e.preventDefault();
		const subject = encodeURIComponent(`Enquiry from ${name}`);
		const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\nPhone: ${phone}\n\n${message}`);
		window.location.href = `mailto:${contact.email}?subject=${subject}&body=${body}`;
	}
</script>

<svelte:head>
	<title>Contact Us | Jewel Property Serve</title>
	<meta
		name="description"
		content="Get in touch with Jewel Property Serve for free quotes, 24/7 emergency callouts and all property maintenance, refurbishment and restoration enquiries."
	/>
</svelte:head>

<!-- Hero + form -->
<section class="bg-ink py-24">
	<div class="mx-auto grid max-w-6xl gap-16 px-6 lg:grid-cols-2">
		<div>
			<p class="kicker">Contact</p>
			<h1 class="mt-4 font-display text-4xl leading-tight text-white md:text-6xl">Get in touch.</h1>
			<p class="mt-6 max-w-md leading-relaxed text-white/70">
				Whether you need a free quote, an emergency callout or just some advice from our service
				desk — we'd love to hear from you.
			</p>

			<div class="mt-10 space-y-6">
				<div>
					<p class="text-xs font-semibold uppercase tracking-[0.2em] text-gold">Call us</p>
					<a href={contact.phoneHref} class="mt-1 block text-2xl font-semibold text-white transition hover:text-gold">
						{contact.phone}
					</a>
					<p class="mt-1 text-sm text-white/50">24 hours a day, 365 days a year</p>
				</div>
				<div>
					<p class="text-xs font-semibold uppercase tracking-[0.2em] text-gold">Email us</p>
					<a href="mailto:{contact.email}" class="mt-1 block text-lg text-white transition hover:text-gold">
						{contact.email}
					</a>
				</div>
				<div>
					<p class="text-xs font-semibold uppercase tracking-[0.2em] text-gold">Visit us</p>
					<p class="mt-1 text-white/80">{contact.address}</p>
				</div>
				<div class="flex gap-4 pt-2">
					<a href={social.facebook} class="text-white/60 transition hover:text-gold">Facebook</a>
					<a href={social.instagram} class="text-white/60 transition hover:text-gold">Instagram</a>
					<a href={social.linkedin} class="text-white/60 transition hover:text-gold">LinkedIn</a>
					<a href={social.checkatrade} class="text-white/60 transition hover:text-gold">Checkatrade</a>
				</div>
			</div>
		</div>

		<form onsubmit={submit} class="rounded-2xl bg-white p-8 shadow-2xl md:p-10">
			<h2 class="font-display text-2xl">Request your free quote</h2>
			<p class="mt-2 text-sm text-ink-mute">
				Tell us a little about your project and we'll get back to you promptly.
			</p>

			<div class="mt-8 space-y-5">
				<div>
					<label for="name" class="text-sm font-medium">Name</label>
					<input
						id="name"
						type="text"
						required
						bind:value={name}
						class="mt-1.5 w-full rounded-lg border border-ink/15 px-4 py-3 text-sm outline-none transition focus:border-gold"
						placeholder="Your name"
					/>
				</div>
				<div class="grid gap-5 sm:grid-cols-2">
					<div>
						<label for="email" class="text-sm font-medium">Email</label>
						<input
							id="email"
							type="email"
							required
							bind:value={email}
							class="mt-1.5 w-full rounded-lg border border-ink/15 px-4 py-3 text-sm outline-none transition focus:border-gold"
							placeholder="you@example.com"
						/>
					</div>
					<div>
						<label for="phone" class="text-sm font-medium">Phone</label>
						<input
							id="phone"
							type="tel"
							bind:value={phone}
							class="mt-1.5 w-full rounded-lg border border-ink/15 px-4 py-3 text-sm outline-none transition focus:border-gold"
							placeholder="Optional"
						/>
					</div>
				</div>
				<div>
					<label for="message" class="text-sm font-medium">How can we help?</label>
					<textarea
						id="message"
						required
						rows="5"
						bind:value={message}
						class="mt-1.5 w-full rounded-lg border border-ink/15 px-4 py-3 text-sm outline-none transition focus:border-gold"
						placeholder="Tell us about your property and what you need…"
					></textarea>
				</div>
				<button type="submit" class="btn-gold w-full">Send enquiry</button>
			</div>
		</form>
	</div>
</section>

<!-- FAQs -->
<section class="bg-white py-24">
	<div class="mx-auto max-w-3xl px-6">
		<div class="text-center">
			<p class="kicker">FAQs</p>
			<h2 class="mt-4 font-display text-4xl leading-tight md:text-5xl">
				Frequently asked questions.
			</h2>
		</div>
		<div class="mt-12 divide-y divide-ink/10 border-y border-ink/10">
			{#each faqs as faq, i}
				<div>
					<button
						class="flex w-full items-center justify-between py-5 text-left"
						onclick={() => (openFaq = openFaq === i ? null : i)}
						aria-expanded={openFaq === i}
					>
						<span class="pr-6 font-semibold">{faq.q}</span>
						<svg
							class="h-5 w-5 shrink-0 text-gold-dark transition {openFaq === i ? 'rotate-45' : ''}"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
							stroke-width="2"
						>
							<path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
						</svg>
					</button>
					{#if openFaq === i}
						<p class="pb-6 text-sm leading-relaxed text-ink-mute">{faq.a}</p>
					{/if}
				</div>
			{/each}
		</div>
	</div>
</section>

<!-- Accreditations -->
<section class="border-t border-ink/5 bg-white">
	<div class="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-12 px-6 py-12">
		{#each accreditations as accreditation}
			<img
				src={accreditation.image}
				alt={accreditation.name}
				class="h-16 w-auto object-contain grayscale transition hover:grayscale-0"
			/>
		{/each}
	</div>
</section>
