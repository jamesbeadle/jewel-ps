// Central site content & config for Jewel Property Serve.
// Images are currently served from the live site. Run scripts/fetch-assets.sh
// on your own machine to copy them into static/images/, then change IMG_BASE to '/images'.
export const IMG_BASE = 'https://www.jewelps.co.uk/images';

/** @param {string} name */
export const img = (name) => `${IMG_BASE}/${name}`;

export const contact = {
	phone: '0208 109 1012',
	phoneHref: 'tel:+442081091012',
	email: 'enquiries@jewelps.co.uk',
	address: '48 Warwick Street, London, W1B 5AW'
};

export const social = {
	facebook: 'https://www.facebook.com/Jewelpsltd/',
	instagram: 'https://www.instagram.com/jewelpsltd/',
	linkedin: 'https://www.linkedin.com/company/jewelpropertyserveltd/',
	checkatrade: 'https://www.checkatrade.com/trades/jewelpropertyserveltd'
};

export const group = [
	{ name: 'Jewel Enterprises', href: 'https://www.jewelenterprises.co.uk/' },
	{ name: 'Jewel Bespoke Build', href: 'https://jewelbb.co.uk/' },
	{ name: 'Jewel Property Serve', href: 'https://www.jewelps.co.uk/' },
	{ name: 'Jewel Passive Fire Protection', href: 'https://www.jewelpfp.co.uk/' }
];

export const nav = [
	{ label: 'Home', href: '/' },
	{ label: 'About', href: '/about' },
	{ label: 'Refurbishment', href: '/refurbishment' },
	{ label: 'Maintenance', href: '/maintenance' },
	{ label: 'Fire & Flood', href: '/fire-flood-restoration' },
	{ label: 'Contact', href: '/contact' }
];

export const services = [
	{
		title: 'Refurbishment',
		href: '/refurbishment',
		image: img('image6.jpg'),
		blurb:
			'Bespoke renovation and refurbishment, from single rooms to complete property transformations — designed around you and finished to exacting standards.'
	},
	{
		title: 'Maintenance',
		href: '/maintenance',
		image: img('common-roof-repairs.webp'),
		blurb:
			'Planned and reactive maintenance across every trade, keeping your property or portfolio safe, compliant and running smoothly all year round.'
	},
	{
		title: 'Fire & Flood Restoration',
		href: '/fire-flood-restoration',
		image: img('Jewel-repair.jpg'),
		blurb:
			'A nominated main contractor for UK insurers, restoring fire and flood damaged properties to their pre-loss condition — quickly and with care.'
	},
	{
		title: '24hr Emergency Callout',
		href: '/contact',
		image: img('customer-service-24-hours-7-days-support2.jpg'),
		blurb:
			'Around-the-clock response, 365 days a year. When an emergency strikes, help is only ever a phone call away.'
	}
];

export const stats = [
	{ value: '20+', label: 'Years serving repeat clients' },
	{ value: '24/7', label: 'Emergency callout, 365 days' },
	{ value: '12mo', label: 'Guarantee on all works' },
	{ value: '100%', label: 'Vetted, qualified & DBS-checked team' }
];

export const process = [
	{
		step: '01',
		title: 'Getting started',
		text: 'Get in touch and we’ll send a dedicated engineer or estimator to your property to scope the works and provide a free, competitive quote.'
	},
	{
		step: '02',
		title: 'The works',
		text: 'A dedicated project manager keeps you informed with live site updates and guides you through every stage, from first fix to final finish.'
	},
	{
		step: '03',
		title: 'Completion',
		text: 'On handover you receive a detailed report of the work completed, together with recommendations for ongoing care of your property.'
	}
];

export const accreditations = [
	{ name: 'SafeContractor Approved', image: img('Safe-Contractor-Approved.png') },
	{ name: 'NICEIC', image: img('NIC-EIC-Logo.webp') },
	{ name: 'Vantify', image: img('Vantify-.jpg') }
];

export const testimonials = [
	{
		quote:
			'I was introduced to Jewel by my line manager, Frank attended site and submitted a quote which was extremely competitive, and upon instructing the works was kept up to date on progress and delivery of the works to completion. Very impressive!',
		name: 'Mike Collins',
		role: 'Harrods Headquarters'
	},
	{
		quote:
			'I am delighted with the outcome and very grateful for all the kind efforts of the Jewel team. Zack and Dan were a pleasure to deal with, and I really appreciated their attention to detail — the house looks great. Particular thanks for arranging the final roof repairs over the leak into my bathroom; it is a big relief that it has been sorted!',
		name: 'Veronica',
		role: 'Homeowner, Chelsea'
	},
	{
		quote:
			'We have worked with Jewel at Chiltern Court since 2006. Jewel have undertaken minor works on behalf of the landlord and completed a large number of refurbishment projects for a variety of residents. A highly efficient, friendly and professional contractor, often recommended to residents as an approved contractor.',
		name: 'Jonathan Gray',
		role: 'Building Surveyor'
	},
	{
		quote:
			'I have had the pleasure of having Jewel complete the works to my properties for 20+ years and witnessing the remarkable growth and success they have achieved under their dedicated leadership and commitment to excellence.',
		name: 'Lady Jacqueline Smith',
		role: 'Maxwell Regents Park'
	}
];

export const values = [
	{ title: 'Reliable', text: 'A team you can depend on — consistent in quality, communication and delivery, project after project.' },
	{ title: 'Experienced', text: 'Decades of hands-on expertise across every trade, delivering safe, qualified solutions to complex problems.' },
	{ title: 'Compliant', text: 'We hold ourselves to the highest standards, meeting every relevant regulation, law and industry requirement.' },
	{ title: 'Professional', text: 'Proven in our field, we handle every relationship and every communication with courtesy and care.' },
	{ title: 'Trusted', text: 'Long-standing client relationships built on a company-wide ethos of doing right by the customer.' },
	{ title: 'Dedicated', text: 'Committed to nothing less than the best service and outstanding results on every job we take on.' }
];

export const refurbServices = [
	{
		title: 'Kitchens',
		image: img('Kitchens.jpg'),
		text: 'The kitchen is the heart of any home. We design and install custom cabinetry, worktops, splashbacks and more, tailored to how you live — using quality materials and the latest techniques so your kitchen is as durable as it is beautiful, whatever your style.'
	},
	{
		title: 'Bathrooms & Plumbing',
		image: img('Bathroom--Plumbing.avif'),
		text: 'From full renovations to brand-new installations, we create bathrooms that feel like a private retreat. Every installation is completed to the highest standard with the best quality materials and products.'
	},
	{
		title: 'Carpentry & Joinery',
		image: img('Carpentry-and-Joinery.png'),
		text: 'Bespoke manufacture, installation and repair — from custom furniture and cabinetry to trim work and moulding. Our experienced carpenters add beauty, functionality and value to every property they touch.'
	},
	{
		title: 'Tiling',
		image: img('6870d940dea0ec79c9489c62_Tilling-p-800.jpg'),
		text: 'Skilled craftsmen working in ceramic, porcelain, glass and natural stone. Whether it’s a kitchen splashback, a luxurious bathroom or a statement accent wall, we install, repair and maintain tiling that looks stunning and lasts.'
	},
	{
		title: 'Decoration',
		image: img('image10.jpg'),
		text: 'Interior refresh or complete overhaul — our decorators work with you at every step to bring your vision to life, creating personal spaces that reflect your style and stand up to daily living.'
	}
];

export const maintenanceServices = [
	{ title: 'HVAC', text: 'Design, installation and maintenance of heating, ventilation and air-conditioning systems that keep your property comfortable and energy efficient.' },
	{ title: 'Electrical', text: 'Fully qualified electricians for installations, testing and maintenance — from safety inspections to complete system upgrades.' },
	{ title: 'Emergency Lighting', text: 'Installation, testing and maintenance of emergency lighting so your property is always prepared and compliant.' },
	{ title: 'Sprinklers', text: 'Complete installation, testing and maintenance of sprinkler systems, keeping your property compliant and protected from fire.' },
	{ title: 'Plumbing', text: 'Comprehensive plumbing solutions, from routine maintenance to emergency repairs, keeping everything flowing as it should.' },
	{ title: 'Boiler & Heating', text: 'Installation, maintenance and repair of boilers and heating systems, engineered for comfort and efficiency.' },
	{ title: 'PAT Testing', text: 'Testing and certification of electrical appliances so your property remains safe, compliant and operating efficiently.' },
	{ title: 'CCTV, Security & Entry', text: 'Access control, surveillance and entry systems, customised to keep your property fully secure.' },
	{ title: 'Pump & Plant Room', text: 'Specialist installation, maintenance and repair of pump and plant-room systems for efficient day-to-day operation.' },
	{ title: 'AOV Systems', text: 'Installation, maintenance and repair of automatic opening vents, keeping your building safe and compliant in an emergency.' },
	{ title: 'Air Conditioning', text: 'From initial consultation to ongoing maintenance, personalised cooling solutions that keep your property at the perfect temperature.' },
	{ title: 'Roof Repair', text: 'From small patch-ups to complete replacements, quality materials and workmanship that protect your property for years to come.' },
	{ title: 'Glazing', text: 'Installation, repair and maintenance of glazing — enhancing natural light while keeping your property safe and functional.' },
	{ title: 'Leak Investigation', text: 'Latest technology and techniques to find and fix leaks before they cause costly water damage.' },
	{ title: 'General Maintenance', text: 'Regular inspections, preventative maintenance and responsive repairs that keep your property running smoothly.' },
	{ title: '24hr Emergency Callout', text: 'Experts on standby around the clock, 365 days a year, for fast, reliable help when you need it most.' }
];

export const faqs = [
	{
		q: 'Are your staff qualified?',
		a: 'Every member of our team is fully vetted, qualified and DBS checked. Our work for schools, hotels, government bodies and notable properties reflects the standards we hold ourselves to.'
	},
	{
		q: 'Is your work guaranteed?',
		a: 'All work comes with a 12-month guarantee, and parts are covered by the manufacturer’s warranty.'
	},
	{
		q: 'Do you do emergency callouts?',
		a: 'Yes — our callout service operates 24 hours a day, 365 days a year, so help is always quickly available should an emergency arise.'
	},
	{
		q: 'What if I’m not sure what the fault is?',
		a: 'No problem. Our service desk will talk you through the issue and advise on the best course of action.'
	},
	{
		q: 'Looking for a career at Jewel?',
		a: 'We’re always looking to grow our team of managers, surveyors and engineers. If you deliver high standards with great customer service, email us at enquiries@jewelps.co.uk.'
	}
];
