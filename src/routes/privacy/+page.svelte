<script>
	import { contact, site } from '$lib/site.js';
	import Seo from '$lib/components/Seo.svelte';
</script>

<Seo title="Privacy notice" description="How Jewel Property Serve Ltd collects and uses personal information submitted through this website." />

<section class="bg-night pt-36 pb-24 lg:pt-44">
	<div class="container-site max-w-3xl">
		<p class="kicker">Legal</p>
		<h1 class="h-section mt-5 text-white">Privacy notice</h1>
		<div class="prose-invert mt-10 space-y-6 leading-relaxed text-grey">
			<p><strong class="text-white">Who we are.</strong> {site.legalName}, {contact.address}. You can contact us at <a href="mailto:{contact.email}" class="text-gold">{contact.email}</a> or on {contact.phone}.</p>
			<p><strong class="text-white">What we collect.</strong> When you use the enquiry form we collect the details you provide — typically your name, email address, phone number, property postcode and a description of the works — together with basic technical information such as your IP address, to help us prevent spam.</p>
			<p><strong class="text-white">Why we use it.</strong> We use this information to respond to your enquiry, prepare a quotation and, if you become a client, to deliver our services and keep in touch about the works. Our lawful basis is taking steps at your request before entering into a contract, and our legitimate interest in running our business.</p>
			<p><strong class="text-white">Who we share it with.</strong> Enquiries are delivered to our team through secure workflow tools. We do not sell your information. Where a job involves an insurer, managing agent or subcontractor we share only what is needed to carry out the works.</p>
			<p><strong class="text-white">How long we keep it.</strong> Enquiries that do not lead to work are deleted within 12 months. Client records are kept for the period required by law and for the duration of any guarantee.</p>
			<p><strong class="text-white">Your rights.</strong> You can ask us to access, correct or delete your personal information at any time by emailing <a href="mailto:{contact.email}" class="text-gold">{contact.email}</a>. You also have the right to complain to the Information Commissioner’s Office (ico.org.uk).</p>
			<p><strong class="text-white">Cookies.</strong> This website does not set marketing or tracking cookies. The embedded map on our contact page is provided by Google and is subject to Google’s privacy policy.</p>
			<p class="text-sm text-grey/70">Last updated: August 2026.</p>
		</div>
	</div>
</section>
