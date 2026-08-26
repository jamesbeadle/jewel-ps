// Central site content & config for Jewel Property Serve.
// Copy follows the Jewel Enterprise Brand Guidelines 2026 (friendly, professional,
// concise, no jargon). Brand colours & fonts live in tailwind.config.js / app.css.

// Photography is currently served from the live jewelps.co.uk site.
// To self-host: run `bash scripts/fetch-assets.sh` (or the .bat) and set
// VITE_IMG_BASE=/images/photos in .env — see README.
export const IMG_BASE = import.meta.env.VITE_IMG_BASE || 'https://www.jewelps.co.uk/images';

/** @param {string} name */
export const img = (name) => `${IMG_BASE}/${name}`;

export const site = {
	name: 'Jewel Property Serve',
	legalName: 'Jewel Property Serve Ltd',
	url: 'https://www.jewelps.co.uk',
	tagline: 'Your property, our passion.',
	description:
		'Jewel Property Serve — London and the South East’s responsive partner for high-end property maintenance, refurbishment and fire & flood restoration. 24-hour emergency callout, 365 days a year.',
	area: 'London & the South East',
	logo: '/images/logos/jewel-property-serve.svg',
	logoPng: '/images/logos/jewel-property-serve.png'
};

export const contact = {
	phone: '0208 109 1012',
	phoneHref: 'tel:+442081091012',
	email: 'enquiries@jewelps.co.uk',
	address: '48 Warwick Street, London, W1B 5AW',
	addressLines: ['48 Warwick Street', 'London', 'W1B 5AW'],
	hours: 'Office Mon–Fri, 8am–5pm · Emergency callout 24/7, 365 days',
	mapEmbed:
		'https://www.google.com/maps?q=48+Warwick+Street,+London,+W1B+5AW&z=16&output=embed',
	mapLink: 'https://www.google.com/maps/search/?api=1&query=48+Warwick+Street+London+W1B+5AW'
};

export const social = {
	facebook: 'https://www.facebook.com/Jewelpsltd/',
	instagram: 'https://www.instagram.com/jewelpsltd/',
	linkedin: 'https://www.linkedin.com/company/jewelpropertyserveltd/',
	checkatrade: 'https://www.checkatrade.com/trades/jewelpropertyserveltd'
};

export const nav = [
	{ label: 'Home', href: '/' },
	{ label: 'About', href: '/about' },
	{ label: 'Refurbishment', href: '/refurbishment' },
	{ label: 'Maintenance', href: '/maintenance' },
	{ label: 'Fire & Flood', href: '/fire-flood-restoration' },
	{ label: 'Contact', href: '/contact' }
];

export const clients = [
	'Homeowners',
	'Private landlords',
	'Managing agents',
	'Property managers',
	'Commercial property owners',
	'Insurance companies'
];

export const services = [
	{
		id: 'refurbishment',
		index: '01',
		title: 'Refurbishment',
		href: '/refurbishment',
		image: img('image6.jpg'),
		icon: 'ruler',
		short: 'Kitchens, bathrooms, joinery, tiling & decoration.',
		blurb:
			'Bespoke renovation and refurbishment, from a single room to a complete property transformation — designed around you and finished to exacting standards.'
	},
	{
		id: 'maintenance',
		index: '02',
		title: 'Maintenance',
		href: '/maintenance',
		image: img('common-roof-repairs.webp'),
		icon: 'wrench',
		short: 'Planned & reactive, across every trade.',
		blurb:
			'Planned and reactive maintenance across every trade, keeping your property or portfolio safe, compliant and running smoothly all year round.'
	},
	{
		id: 'restoration',
		index: '03',
		title: 'Fire & Flood Restoration',
		href: '/fire-flood-restoration',
		image: img('Jewel-repair.jpg'),
		icon: 'flame',
		short: 'Nominated main contractor for UK insurers.',
		blurb:
			'Restoring fire and flood damaged properties to their pre-loss condition — quickly, carefully, and in step with your insurer.'
	},
	{
		id: 'emergency',
		index: '04',
		title: '24hr Emergency Callout',
		href: '/contact',
		image: img('customer-service-24-hours-7-days-support2.jpg'),
		icon: 'clock',
		short: 'Around the clock, 365 days a year.',
		blurb:
			'When an emergency strikes, help is only ever a phone call away. Our engineers are on standby day and night, every day of the year.'
	}
];

export const stats = [
	{ value: '20+', label: 'Years of repeat clients' },
	{ value: '24/7', label: 'Emergency callout, 365 days' },
	{ value: '12', suffix: 'mo', label: 'Guarantee on all works' },
	{ value: '100%', label: 'Vetted, qualified & DBS-checked' }
];

export const marquee = [
	'24hr emergency callout',
	'12-month guarantee',
	'SafeContractor approved',
	'NICEIC registered',
	'DBS-checked team',
	'Nominated insurer contractor',
	'Ecologi partner',
	'London & the South East'
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
		text: 'On handover you receive a detailed report of the work completed, together with recommendations for the ongoing care of your property.'
	}
];

export const accreditations = [
	{ name: 'SafeContractor Approved', image: img('Safe-Contractor-Approved.png') },
	{ name: 'NICEIC Registered', image: img('NIC-EIC-Logo.webp') },
	{ name: 'Vantify', image: img('Vantify-.jpg') }
];

export const testimonials = [
	{
		quote:
			'I was introduced to Jewel by my line manager. Frank attended site and submitted a quote which was extremely competitive, and upon instructing the works I was kept up to date on progress and delivery of the works to completion. Very impressive!',
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
		role: 'Building Surveyor, Chiltern Court'
	},
	{
		quote:
			'I have had the pleasure of having Jewel complete the works to my properties for 20+ years and witnessing the remarkable growth and success they have achieved under their dedicated leadership and commitment to excellence.',
		name: 'Lady Jacqueline Smith',
		role: 'Maxwell, Regent’s Park'
	}
];

/** Brand voice principles (Jewel Enterprise Brand Guidelines 2026). */
export const values = [
	{ title: 'Reliable', text: 'Trusted and committed. We can be relied upon for consistency, quality and performance — regardless of project scale or complexity.' },
	{ title: 'Professional', text: 'Strong in our field, we handle all communications and relationships with professionalism, transparency and clear accountability.' },
	{ title: 'Caring', text: 'We make sure clients are well looked after, working to understand and exceed their expectations at every stage of every project.' },
	{ title: 'Experienced', text: 'A reliable, hard-working team delivering qualified and safe solutions with a wide range of knowledge and skill across every trade.' }
];

export const groupValues = ['Safety first', 'Integrity', 'Quality workmanship', 'Client focus', 'Family culture', 'Growth'];

export const leadership = {
	quote:
		'The Jewel Enterprise family is dedicated to providing the highest levels of standards within the industry, and I am proud to represent and work with a team who continue to perform, deliver and satisfy every day.',
	name: 'Nigel Reilly',
	role: 'Founder & CEO'
};

export const ecologi = {
	title: 'We plant trees for every project.',
	text: 'Jewel partners with Ecologi to offset our carbon footprint. For every project we plant trees in our virtual forest — each sequestering an estimated 0.30 tonnes of carbon, roughly the equivalent of 732 miles in a standard car.',
	image: img('Ecoligi.jpg')
};

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
		text: 'Bespoke manufacture, installation and repair — from custom furniture and cabinetry to trim work and moulding. Our experienced carpenters add beauty, function and value to every property they touch.'
	},
	{
		title: 'Tiling',
		image: img('6870d940dea0ec79c9489c62_Tilling-p-800.jpg'),
		text: 'Skilled craftsmen working in ceramic, porcelain, glass and natural stone. Whether it’s a kitchen splashback, a luxurious bathroom or a statement wall, we install, repair and maintain tiling that looks stunning and lasts.'
	},
	{
		title: 'Decoration',
		image: img('image10.jpg'),
		text: 'Interior refresh or complete overhaul — our decorators work with you at every step to bring your vision to life, creating spaces that reflect your style and stand up to daily living.'
	}
];

export const maintenanceServices = [
	{ icon: 'wind', title: 'HVAC', text: 'Design, installation and maintenance of heating, ventilation and air-conditioning systems that keep your property comfortable and energy efficient.' },
	{ icon: 'zap', title: 'Electrical', text: 'Fully qualified, NICEIC-registered electricians for installations, testing and maintenance — from safety inspections to complete system upgrades.' },
	{ icon: 'bulb', title: 'Emergency Lighting', text: 'Installation, testing and maintenance of emergency lighting so your property is always prepared and compliant.' },
	{ icon: 'droplets', title: 'Sprinklers', text: 'Complete installation, testing and maintenance of sprinkler systems, keeping your property compliant and protected from fire.' },
	{ icon: 'droplet', title: 'Plumbing', text: 'Comprehensive plumbing solutions, from routine maintenance to emergency repairs, keeping everything flowing as it should.' },
	{ icon: 'thermometer', title: 'Boiler & Heating', text: 'Installation, maintenance and repair of boilers and heating systems, engineered for comfort and efficiency.' },
	{ icon: 'plug', title: 'PAT Testing', text: 'Testing and certification of electrical appliances so your property remains safe, compliant and operating efficiently.' },
	{ icon: 'camera', title: 'CCTV, Security & Entry', text: 'Access control, surveillance and entry systems, customised to keep your property fully secure.' },
	{ icon: 'activity', title: 'Pump & Plant Room', text: 'Specialist installation, maintenance and repair of pump and plant-room systems for efficient day-to-day operation.' },
	{ icon: 'vent', title: 'AOV Systems', text: 'Installation, maintenance and repair of automatic opening vents, keeping your building safe and compliant in an emergency.' },
	{ icon: 'snowflake', title: 'Air Conditioning', text: 'From initial consultation to ongoing maintenance, personalised cooling solutions that keep your property at the perfect temperature.' },
	{ icon: 'layers', title: 'Roof Repair', text: 'From small patch-ups to complete replacements, quality materials and workmanship that protect your property for years to come.' },
	{ icon: 'grid', title: 'Glazing', text: 'Installation, repair and maintenance of glazing — enhancing natural light while keeping your property safe and secure.' },
	{ icon: 'search', title: 'Leak Investigation', text: 'The latest technology and techniques to find and fix leaks before they cause costly water damage.' },
	{ icon: 'users', title: 'Managing Agent Support', text: 'Dedicated maintenance support for managing agents and block managers across London and the South East.' },
	{ icon: 'hammer', title: 'General Maintenance', text: 'Regular inspections, preventative maintenance and responsive repairs that keep your property running smoothly.' },
	{ icon: 'clock', title: '24hr Emergency Callout', text: 'Experts on standby around the clock, 365 days a year, for fast, reliable help when you need it most.' }
];

export const restorationServices = [
	{ icon: 'flame', title: 'Fire damage restoration', text: 'Structural repairs, soot and smoke damage removal, and full reinstatement of fire-damaged rooms and buildings.' },
	{ icon: 'droplet', title: 'Flood & water damage', text: 'Drying, stripping out and rebuilding after burst pipes, storm damage and flooding — back to pre-loss condition.' },
	{ icon: 'wind', title: 'Smoke damage repair', text: 'Deep cleaning, odour removal and redecoration to make every trace of smoke a thing of the past.' },
	{ icon: 'shield', title: 'Mould remediation', text: 'Safe removal of mould and the moisture problems that cause it, protecting the property and the people in it.' },
	{ icon: 'file', title: 'Insurance reinstatement', text: 'A nominated main contractor for UK insurers, handling major and minor loss claims from first inspection to final sign-off.' },
	{ icon: 'clock', title: '24/7 emergency response', text: 'Make-safe, board-up and emergency drying around the clock, 365 days a year.' }
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
		q: 'Which areas do you cover?',
		a: 'We look after properties across London and the South East, from our base on Warwick Street in the West End.'
	},
	{
		q: 'Looking for a career at Jewel?',
		a: 'We’re always looking to grow our team of managers, surveyors and engineers. If you deliver high standards with great customer service, email us at enquiries@jewelps.co.uk.'
	}
];

/** Options for the contact form service selector. */
export const enquiryTypes = [
	'Refurbishment',
	'Planned or reactive maintenance',
	'Fire or flood restoration',
	'Emergency callout',
	'Managing agent / portfolio support',
	'Something else'
];
