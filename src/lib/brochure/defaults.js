/**
 * The default Jewel Property Serve brochure. Used two ways:
 *
 *  1. As the seed when an admin clicks "New brochure → Start from the Jewel PS
 *     layout" (every page is then fully editable).
 *  2. As the fallback shown at /brochure before Supabase is connected or
 *     while no brochure has been made active.
 *
 * All copy is drawn from the live site content in $lib/site.js, so the seed
 * brochure is accurate on day one.
 */
import { contact, img, testimonials, process } from '$lib/site.js';

/** @typedef {{ template: import('./templates.js').TemplateId, content: Record<string, unknown> }} DefaultPage */

const contactLine = `jewelps.co.uk | ${contact.phone} | ${contact.email}`;

/** @returns {DefaultPage[]} */
export function defaultBrochurePages() {
	return [
		{
			template: 'cover',
			content: {
				image: img('jewel_style_prime_london_lobby_option_3-1.png'),
				title: 'Your Property,\nOur Passion',
				subtitle: 'High-End Property Maintenance, Refurbishment & Restoration | London & the South East',
				contact: contactLine
			}
		},
		{
			template: 'intro',
			content: {
				kicker: 'WHO WE ARE',
				title: 'Care Without Compromise',
				body: [
					'Jewel Property Serve is London and the South East’s responsive partner for high-end property maintenance, refurbishment and fire & flood restoration — trusted by homeowners, landlords, managing agents and insurers for more than twenty years.',
					'From our base on Warwick Street in the West End we look after some of the capital’s most notable addresses. Every member of our team is vetted, qualified and DBS-checked, and every job — from a single repair to a complete refurbishment — is finished to the same exacting standard and backed by a 12-month guarantee.',
					'When an emergency strikes, help is only ever a phone call away: our engineers are on standby 24 hours a day, 365 days a year.',
					'This is property care as it should be — reliable, professional, caring and experienced. Your property, our passion.'
				].join('\n\n')
			}
		},
		{
			template: 'services',
			content: {
				kicker: 'OUR EXPERTISE',
				title: 'A Complete Service',
				items: [
					{
						title: 'Refurbishment',
						body: 'Bespoke renovation and refurbishment, from a single room to a complete property transformation. Kitchens, bathrooms, carpentry & joinery, tiling and decoration — designed around you and finished to exacting standards.'
					},
					{
						title: 'Planned & Reactive Maintenance',
						body: 'Planned and reactive maintenance across every trade — HVAC, electrical, plumbing, boilers, roofing, glazing and more — keeping your property or portfolio safe, compliant and running smoothly all year round.'
					},
					{
						title: 'Fire & Flood Restoration',
						body: 'A nominated main contractor for UK insurers, restoring fire and flood damaged properties to their pre-loss condition — quickly, carefully, and in step with your insurer from first inspection to final sign-off.'
					},
					{
						title: '24hr Emergency Callout',
						body: 'Experts on standby around the clock, 365 days a year. Make-safe, board-up and emergency drying whenever an emergency strikes — fast, reliable help when you need it most.'
					},
					{
						title: 'Compliance & Testing',
						body: 'NICEIC-registered electrical testing, PAT testing, emergency lighting, sprinklers and AOV systems — the inspections and certification that keep your property safe and fully compliant.'
					},
					{
						title: 'Managing Agent Support',
						body: 'Dedicated maintenance support for managing agents and block managers across London and the South East, with a service desk that keeps residents informed and portfolios running without surprises.'
					}
				]
			}
		},
		{
			template: 'project-gallery',
			content: {
				kicker: 'OUR WORK',
				title: 'Across London & the South East',
				images: [
					img('50-Liverpool-st-Lounge-Area-Workroom-view_MC_HR_13.14-1920x1280.jpg'),
					img('Kitchens.jpg'),
					img('jewel_style_prime_london_lobby_option_3-1.png'),
					img('Bathroom--Plumbing.avif'),
					img('Office-Picture-1.png'),
					img('image10.jpg')
				]
			}
		},
		{
			template: 'project-intro',
			content: {
				kicker: 'REFURBISHMENT',
				title: 'Interiors, Reimagined',
				subtitle: 'Kitchens, Bathrooms, Carpentry & Joinery, Tiling and Decoration — From a Single Room to a Complete Transformation',
				image: img('Kitchens.jpg')
			}
		},
		{
			template: 'project-detail',
			content: {
				kicker: 'FIRE & FLOOD RESTORATION',
				title: 'Back to Pre-Loss Condition',
				image: img('Jewel-repair.jpg'),
				body: [
					'As a nominated main contractor for UK insurers, we handle major and minor loss claims from first inspection to final sign-off — structural repairs, soot and smoke damage removal, drying, stripping out and full reinstatement.',
					'Our 24/7 emergency response team carries out make-safe, board-up and emergency drying around the clock, so damage is contained the moment it happens.',
					'Deep cleaning, odour removal, mould remediation and redecoration make every trace of the loss a thing of the past — quickly, carefully, and in step with your insurer.'
				].join('\n\n'),
				features: [
					'Nominated main contractor for UK insurers',
					'24/7 make-safe and emergency drying',
					'Fire, smoke, flood and water damage',
					'Mould remediation',
					'Full insurance reinstatement'
				],
				value: '',
				duration: ''
			}
		},
		{
			template: 'process',
			content: {
				kicker: 'OUR PROCESS',
				title: 'How We Work',
				lede: 'One dedicated team from first call to final report — with a project manager keeping you informed at every stage.',
				steps: [
					{
						title: process[0]?.title ?? 'Getting started',
						body: process[0]?.text ?? ''
					},
					{
						title: process[1]?.title ?? 'The works',
						body: process[1]?.text ?? ''
					},
					{
						title: process[2]?.title ?? 'Completion',
						body: process[2]?.text ?? ''
					},
					{
						title: 'Aftercare',
						body: 'All work comes with a 12-month guarantee, with parts covered by the manufacturer’s warranty — and our service desk remains on hand 24/7, 365 days a year, should you ever need us.'
					}
				]
			}
		},
		{
			template: 'testimonials',
			content: {
				kicker: 'CLIENT TESTIMONIALS',
				title: 'In Their Words',
				quotes: testimonials.map((t) => ({
					quote: t.quote,
					author: `${t.name}, ${t.role}`
				}))
			}
		},
		{
			template: 'freeform',
			content: {
				kicker: 'OUR COMMITMENT',
				title: 'Standards You Can See',
				body: [
					'Every member of our team is fully vetted, qualified and DBS-checked. We are SafeContractor approved, NICEIC registered and Vantify accredited — and our work for schools, hotels, government bodies and notable properties reflects the standards we hold ourselves to.',
					'We also partner with Ecologi to offset our carbon footprint: for every project we plant trees in our virtual forest, each sequestering an estimated 0.30 tonnes of carbon — roughly the equivalent of 732 miles in a standard car.'
				].join('\n\n'),
				image: img('Ecoligi.jpg')
			}
		},
		{
			template: 'back-cover',
			content: {
				title: 'Here When You Need Us',
				phone: contact.phone,
				email: contact.email,
				web: 'www.jewelps.co.uk',
				address: contact.addressLines.join(', '),
				services_line:
					'Refurbishment · Planned & Reactive Maintenance · Fire & Flood Restoration · 24hr Emergency Callout',
				accreditations_line:
					'SafeContractor Approved | NICEIC Registered | Vantify | Ecologi Partner | 12-Month Guarantee'
			}
		}
	];
}
