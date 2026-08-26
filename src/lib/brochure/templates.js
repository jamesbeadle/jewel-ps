/**
 * Brochure page templates.
 *
 * Each brochure is an ordered list of pages; every page uses one of these
 * templates and stores its own content as JSON. The field specs below drive
 * both the admin edit forms and give each template a well-known shape for
 * the A4 renderer components in $lib/components/brochure.
 *
 * Shared between server and client — keep this file dependency-free.
 * Same structure as the jewelbb.co.uk brochure builder.
 */

/**
 * @typedef {'cover' | 'intro' | 'team' | 'services' | 'process' | 'project-intro' | 'project-detail' | 'project-gallery' | 'testimonials' | 'freeform' | 'back-cover'} TemplateId
 *
 * @typedef {{ key: string, label: string, type: 'text' | 'textarea', placeholder?: string }} SubField
 *
 * @typedef {(
 *   { key: string, label: string, type: 'text', placeholder?: string, hint?: string } |
 *   { key: string, label: string, type: 'textarea', rows?: number, placeholder?: string, hint?: string } |
 *   { key: string, label: string, type: 'image', hint?: string } |
 *   { key: string, label: string, type: 'images', max: number, hint?: string } |
 *   { key: string, label: string, type: 'list', hint?: string } |
 *   { key: string, label: string, type: 'group-list', fields: SubField[], itemLabel: string, max?: number, hint?: string }
 * )} Field
 *
 * @typedef {{ id: TemplateId, name: string, description: string, fields: Field[], blank: Record<string, unknown> }} Template
 */

/** @type {Template[]} */
export const templates = [
	{
		id: 'cover',
		name: 'Cover',
		description: 'Front cover — hero photo, wordmark and strapline.',
		fields: [
			{ key: 'image', label: 'Cover photo', type: 'image' },
			{ key: 'title', label: 'Strapline', type: 'text', placeholder: 'Your Property,\nOur Passion' },
			{
				key: 'subtitle',
				label: 'Sub-line',
				type: 'text',
				placeholder: 'High-End Property Maintenance & Restoration | London & the South East'
			},
			{
				key: 'contact',
				label: 'Contact line',
				type: 'text',
				placeholder: 'jewelps.co.uk | 0208 109 1012 | enquiries@jewelps.co.uk'
			}
		],
		blank: { image: '', title: 'Your Property,\nOur Passion', subtitle: '', contact: '' }
	},
	{
		id: 'intro',
		name: 'Introduction',
		description: 'Full-width text page — who we are / our approach.',
		fields: [
			{ key: 'kicker', label: 'Kicker', type: 'text', placeholder: 'WHO WE ARE' },
			{ key: 'title', label: 'Heading', type: 'text', placeholder: 'Care Without Compromise' },
			{
				key: 'body',
				label: 'Body text',
				type: 'textarea',
				rows: 12,
				hint: 'Blank line = new paragraph.'
			}
		],
		blank: { kicker: 'WHO WE ARE', title: '', body: '' }
	},
	{
		id: 'team',
		name: 'Team',
		description: 'Portrait grid of team members, with optional accreditation strip.',
		fields: [
			{ key: 'kicker', label: 'Kicker', type: 'text', placeholder: 'OUR TEAM' },
			{ key: 'title', label: 'Heading', type: 'text', placeholder: 'Get to Know Us' },
			{
				key: 'members',
				label: 'Team members',
				type: 'group-list',
				itemLabel: 'member',
				max: 9,
				fields: [
					{ key: 'name', label: 'Name', type: 'text' },
					{ key: 'role', label: 'Role', type: 'text' },
					{ key: 'photo', label: 'Photo URL', type: 'text' }
				],
				hint: 'Up to 9 people. Photos render in black & white, as in print.'
			},
			{
				key: 'accreditations',
				label: 'Accreditation logos',
				type: 'images',
				max: 6,
				hint: 'Optional strip along the bottom of the page.'
			}
		],
		blank: { kicker: 'OUR TEAM', title: 'Get to Know Us', members: [], accreditations: [] }
	},
	{
		id: 'services',
		name: 'Services',
		description: 'Numbered two-column grid of services (01–06).',
		fields: [
			{ key: 'kicker', label: 'Kicker', type: 'text', placeholder: 'OUR EXPERTISE' },
			{ key: 'title', label: 'Heading', type: 'text', placeholder: 'A Complete Service' },
			{
				key: 'items',
				label: 'Services',
				type: 'group-list',
				itemLabel: 'service',
				max: 6,
				fields: [
					{ key: 'title', label: 'Service', type: 'text' },
					{ key: 'body', label: 'Description', type: 'textarea' }
				]
			}
		],
		blank: { kicker: 'OUR EXPERTISE', title: 'A Complete Service', items: [] }
	},
	{
		id: 'process',
		name: 'Process',
		description: 'Numbered step-by-step list (first call → completion).',
		fields: [
			{ key: 'kicker', label: 'Kicker', type: 'text', placeholder: 'OUR PROCESS' },
			{ key: 'title', label: 'Heading', type: 'text', placeholder: 'How We Work' },
			{
				key: 'lede',
				label: 'Intro line',
				type: 'textarea',
				rows: 3,
				hint: 'Rendered in small caps above the steps. Optional.'
			},
			{
				key: 'steps',
				label: 'Steps',
				type: 'group-list',
				itemLabel: 'step',
				max: 7,
				fields: [
					{ key: 'title', label: 'Step', type: 'text' },
					{ key: 'body', label: 'Description', type: 'textarea' }
				]
			}
		],
		blank: { kicker: 'OUR PROCESS', title: 'How We Work', lede: '', steps: [] }
	},
	{
		id: 'project-intro',
		name: 'Case study — opener',
		description: 'Case-study title page with one large photo.',
		fields: [
			{ key: 'kicker', label: 'Location / sector', type: 'text', placeholder: 'WEST END, LONDON' },
			{ key: 'title', label: 'Project name', type: 'text', placeholder: 'A West End Refurbishment' },
			{
				key: 'subtitle',
				label: 'One-line summary',
				type: 'text',
				placeholder: 'Full Refurbishment of a Prime Residential Apartment'
			},
			{ key: 'image', label: 'Main photo', type: 'image' }
		],
		blank: { kicker: '', title: '', subtitle: '', image: '' }
	},
	{
		id: 'project-detail',
		name: 'Case study — detail',
		description: 'Tall photo left; description, key features, value & duration right.',
		fields: [
			{ key: 'kicker', label: 'Category', type: 'text', placeholder: 'REFURBISHMENT' },
			{ key: 'title', label: 'Project name', type: 'text' },
			{ key: 'image', label: 'Tall photo (left half)', type: 'image' },
			{
				key: 'body',
				label: 'Description',
				type: 'textarea',
				rows: 9,
				hint: 'Blank line = new paragraph. Two or three short paragraphs fit best.'
			},
			{ key: 'features', label: 'Key features', type: 'list', hint: 'One per line, up to 6.' },
			{ key: 'value', label: 'Project value', type: 'text', placeholder: '£120,000' },
			{ key: 'duration', label: 'Project duration', type: 'text', placeholder: '8 Weeks' }
		],
		blank: { kicker: '', title: '', image: '', body: '', features: [], value: '', duration: '' }
	},
	{
		id: 'project-gallery',
		name: 'Gallery',
		description: 'Six-photo gallery grid (2 × 3).',
		fields: [
			{ key: 'kicker', label: 'Kicker', type: 'text', placeholder: 'GALLERY' },
			{
				key: 'title',
				label: 'Heading',
				type: 'text',
				placeholder: 'Our Work Across London & the South East'
			},
			{ key: 'images', label: 'Photos', type: 'images', max: 6 }
		],
		blank: { kicker: 'GALLERY', title: '', images: [] }
	},
	{
		id: 'testimonials',
		name: 'Testimonials',
		description: 'Two-column client quotes.',
		fields: [
			{ key: 'kicker', label: 'Kicker', type: 'text', placeholder: 'CLIENT TESTIMONIALS' },
			{ key: 'title', label: 'Heading', type: 'text', placeholder: 'In Their Words' },
			{
				key: 'quotes',
				label: 'Quotes',
				type: 'group-list',
				itemLabel: 'quote',
				max: 10,
				fields: [
					{ key: 'quote', label: 'Quote', type: 'textarea' },
					{ key: 'author', label: 'Attribution', type: 'text', placeholder: 'Veronica, Chelsea' }
				]
			}
		],
		blank: { kicker: 'CLIENT TESTIMONIALS', title: 'In Their Words', quotes: [] }
	},
	{
		id: 'freeform',
		name: 'Text & photo',
		description: 'Flexible page — heading, body text and an optional photo.',
		fields: [
			{ key: 'kicker', label: 'Kicker', type: 'text' },
			{ key: 'title', label: 'Heading', type: 'text' },
			{ key: 'body', label: 'Body text', type: 'textarea', rows: 10, hint: 'Blank line = new paragraph.' },
			{ key: 'image', label: 'Photo (optional)', type: 'image' }
		],
		blank: { kicker: '', title: '', body: '', image: '' }
	},
	{
		id: 'back-cover',
		name: 'Back cover',
		description: 'Dark closing page with wordmark and contact details.',
		fields: [
			{ key: 'title', label: 'Closing line', type: 'text', placeholder: 'Here When You Need Us' },
			{ key: 'phone', label: 'Telephone', type: 'text' },
			{ key: 'email', label: 'Email', type: 'text' },
			{ key: 'web', label: 'Website', type: 'text' },
			{ key: 'address', label: 'Address', type: 'text' },
			{
				key: 'services_line',
				label: 'Services line',
				type: 'text',
				placeholder: 'Refurbishment · Maintenance · Fire & Flood Restoration …'
			},
			{
				key: 'accreditations_line',
				label: 'Accreditations line',
				type: 'text',
				placeholder: 'SafeContractor Approved | NICEIC Registered | Vantify …'
			}
		],
		blank: {
			title: 'Here When You Need Us',
			phone: '',
			email: '',
			web: '',
			address: '',
			services_line: '',
			accreditations_line: ''
		}
	}
];

/** @type {Record<string, Template>} */
export const templateMap = Object.fromEntries(templates.map((t) => [t.id, t]));

/** @param {string} id */
export function templateName(id) {
	return templateMap[id]?.name ?? id;
}

/** The footer strip shown along the bottom of content pages. */
export const FOOTER_STRIP_DEFAULT =
	'Refurbishment | Maintenance | Fire & Flood Restoration | 24hr Emergency Callout';
