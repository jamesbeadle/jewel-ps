// Central registry of the self-hosted photography in static/images/photos/
// (the full asset library recovered from the old Webflow site). Used by the
// admin image picker so every built-in photo is choosable for brochures.
//
// If you drop new files into static/images/photos/, add them to the matching
// group here so they show up in the picker.
import { img } from '$lib/site.js';

/** @typedef {{ label: string, images: string[] }} PhotoGroup */

/** @type {PhotoGroup[]} */
export const photoGroups = [
	{
		label: 'Interiors & offices',
		images: [
			'50-Liverpool-st-Lounge-Area-Workroom-view_MC_HR_13.14-1920x1280.jpg',
			'jewel_style_prime_london_lobby_option_3-1.png',
			'Office-Picture-1.png',
			'zac-gudakov-ztWpwTEx728-unsplash.jpg',
			'nolan-issac-K5sjajgbTFw-unsplash-2.jpg',
			'pexels-marc-mueller-380768-1.jpg',
			'mark-higham-theartshot360-hEFlK-ZoE-E-unsplash-1.jpg',
			'9174928687_ba363209af_k.jpg',
			'0x0.jpg',
			'720.jpg',
			'4934.webp'
		].map(img)
	},
	{
		label: 'Refurbishment',
		images: [
			'Kitchens.jpg',
			'Bathroom--Plumbing.avif',
			'Carpentry-and-Joinery.png',
			'6870d940dea0ec79c9489c62_Tilling-p-800.jpg',
			'image10.jpg',
			'image6.jpg',
			'bf78877b-27b5-49f7-8cc6-724267fdaca6.png'
		].map(img)
	},
	{
		label: 'Maintenance & trades',
		images: [
			'common-roof-repairs.webp',
			'Jewel-ps-air-conditioning.webp',
			'HVAC-Parts_Alliance.webp',
			'nme-electrical-services-20-1024x800.jpg',
			'How-to-Make-Electrical-Plan.jpeg',
			'plumbing-1.jpg',
			'Glazing.jpg',
			'6065-009-internal-plant-room.jpg',
			'Energy_Centre.jpg',
			'thermal_audit.jpg',
			'Property-Maintenance.jpg',
			'Hard-FM-Manager.jpg',
			'construction-engineer-with-foreman-worker-checking-2021-08-26-17-34-59-utc_60.jpg'
		].map(img)
	},
	{
		label: 'Fire, flood & emergency',
		images: [
			'Jewel-repair.jpg',
			'office-flood.jpg',
			'Fire-escape-sign-in-workplace.jpg',
			'yangin-algilama-sistemi-gelgez-700x420.jpg.webp',
			'customer-service-24-hours-7-days-support2.jpg',
			'customer-service-24-hours-7-days-support.jpg',
			'Emergency-Callouts.jpg'
		].map(img)
	},
	{
		label: 'Brand & accreditations',
		images: [
			'Jewel-Property-Serve-UK.jpg',
			'Jewel-PS.jpg',
			'Jewel-Group-Property-Server.jpg',
			'Jewel-Property-Serve.webp',
			'Safe-Contractor-Approved.png',
			'NIC-EIC-Logo.webp',
			'Vantify-.jpg',
			'Ecoligi.jpg'
		].map(img)
	}
];
