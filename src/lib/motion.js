// Motion utilities for Jewel Property Serve.
// Everything here is browser-only and respects `prefers-reduced-motion`.
// - reveal / revealStagger: IntersectionObserver fade-up (no GSAP needed)
// - parallax: GSAP ScrollTrigger scrubbed transform on a layer
// - countUp: animated number
// - getGsap: lazy-loaded GSAP + ScrollTrigger for page-level timelines

import { browser } from '$app/environment';

/** @type {Promise<{ gsap: typeof import('gsap').gsap, ScrollTrigger: typeof import('gsap/ScrollTrigger').ScrollTrigger }> | undefined} */
let gsapPromise;

/** Lazy-load GSAP + ScrollTrigger once. */
export function getGsap() {
	if (!browser) return Promise.reject(new Error('getGsap is browser-only'));
	if (!gsapPromise) {
		gsapPromise = Promise.all([import('gsap'), import('gsap/ScrollTrigger')]).then(
			([{ gsap }, { ScrollTrigger }]) => {
				gsap.registerPlugin(ScrollTrigger);
				ScrollTrigger.config({ ignoreMobileResize: true });
				return { gsap, ScrollTrigger };
			}
		);
	}
	return gsapPromise;
}

export function prefersReducedMotion() {
	return browser && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/** Add the `no-motion` class to <html> when the user prefers reduced motion. */
export function initMotionPreference() {
	if (!browser) return;
	const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
	const apply = () => document.documentElement.classList.toggle('no-motion', mq.matches);
	apply();
	mq.addEventListener?.('change', apply);
}

/** @type {IntersectionObserver | undefined} */
let revealObserver;
function getRevealObserver() {
	if (!revealObserver) {
		revealObserver = new IntersectionObserver(
			(entries) => {
				for (const e of entries) {
					if (e.isIntersecting) {
						e.target.classList.add('is-in');
						revealObserver?.unobserve(e.target);
					}
				}
			},
			{ rootMargin: '0px 0px -10% 0px', threshold: 0.08 }
		);
	}
	return revealObserver;
}

/**
 * Svelte action: fade + rise into view once.
 * @param {HTMLElement} node
 * @param {{ stagger?: boolean }} [opts]
 */
export function reveal(node, opts = {}) {
	if (!browser) return;
	node.setAttribute(opts.stagger ? 'data-reveal-stagger' : 'data-reveal', '');
	if (prefersReducedMotion()) {
		node.classList.add('is-in');
		return;
	}
	const io = getRevealObserver();
	io.observe(node);
	return {
		destroy() {
			io.unobserve(node);
		}
	};
}

/**
 * Svelte action: scrubbed parallax on scroll.
 * speed  > 0 moves slower than the page (background feel), < 0 moves faster.
 * @param {HTMLElement} node
 * @param {{ speed?: number, scale?: number, trigger?: HTMLElement | null, start?: string, end?: string }} [opts]
 */
export function parallax(node, opts = {}) {
	if (!browser || prefersReducedMotion()) return;
	const { speed = 0.25, scale = 1, start = 'top bottom', end = 'bottom top' } = opts;
	let cleanup = () => {};
	getGsap().then(({ gsap }) => {
		const trigger = opts.trigger ?? node.parentElement ?? node;
		const tween = gsap.fromTo(
			node,
			{ yPercent: -speed * 40, scale },
			{
				yPercent: speed * 40,
				scale,
				ease: 'none',
				scrollTrigger: { trigger, start, end, scrub: 0.6, invalidateOnRefresh: true }
			}
		);
		cleanup = () => {
			tween.scrollTrigger?.kill();
			tween.kill();
		};
	});
	return { destroy: () => cleanup() };
}

/**
 * Svelte action: count from 0 to the number found in the node's text when it enters view.
 * Non-numeric prefix/suffix characters are preserved (e.g. "20+", "24/7").
 * @param {HTMLElement} node
 * @param {{ duration?: number }} [opts]
 */
export function countUp(node, opts = {}) {
	if (!browser) return;
	const original = node.textContent ?? '';
	const match = original.match(/(\d+)/);
	if (!match || prefersReducedMotion()) return;
	const target = parseInt(match[1], 10);
	const prefix = original.slice(0, match.index);
	const suffix = original.slice((match.index ?? 0) + match[1].length);
	node.textContent = `${prefix}0${suffix}`;
	const duration = opts.duration ?? 1400;
	const io = new IntersectionObserver((entries) => {
		if (!entries.some((e) => e.isIntersecting)) return;
		io.disconnect();
		const t0 = performance.now();
		/** @param {number} now */
		const tick = (now) => {
			const p = Math.min(1, (now - t0) / duration);
			const eased = 1 - Math.pow(1 - p, 3);
			node.textContent = `${prefix}${Math.round(target * eased)}${suffix}`;
			if (p < 1) requestAnimationFrame(tick);
		};
		requestAnimationFrame(tick);
	});
	io.observe(node);
	return { destroy: () => io.disconnect() };
}

/**
 * Split a heading into per-word spans so the words can be animated in sequence.
 * Returns the created word elements.
 * @param {HTMLElement} node
 */
export function splitWords(node) {
	const text = node.textContent ?? '';
	node.textContent = '';
	node.setAttribute('aria-label', text);
	/** @type {HTMLSpanElement[]} */
	const words = [];
	text.split(/\s+/).forEach((w, i, arr) => {
		const outer = document.createElement('span');
		outer.className = 'inline-block overflow-hidden align-bottom';
		outer.setAttribute('aria-hidden', 'true');
		const inner = document.createElement('span');
		inner.className = 'inline-block will-change-transform';
		inner.textContent = w;
		outer.appendChild(inner);
		node.appendChild(outer);
		if (i < arr.length - 1) node.appendChild(document.createTextNode(' '));
		words.push(inner);
	});
	return words;
}
