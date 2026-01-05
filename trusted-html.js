import { escapeHTML } from './html.js';

const SUPPORTS_TRUSTED_TYPES = 'trustedTypes' in globalThis;
const isTrustedHTML = SUPPORTS_TRUSTED_TYPES ? globalThis.trustedTypes.isHTML : () => false;

function createHTML(strings, ...values) {
	if (! Array.isArray(strings) || ! Array.isArray(strings.raw)) {
		return Array.isArray(strings)
			? strings.map(escapeHTML).join('')
			: escapeHTML(strings);
	} else {
		return String.raw(strings, ...values.map(val => isTrustedHTML(val) ? val : escapeHTML(val)));
	}
}

/**
 * Creates a Trusted Types policy (or a compliant fallback) for sanitizing HTML.
 * The returned policy's `createHTML` method is overloaded to handle both direct string arguments
 * and tagged template literals.
 *
 * @param {string} [name="aegis-escape#html"] - The policy name. Must match your CSP `trusted-types` directive.
 * @returns {TrustedTypePolicy} A native Policy object or a frozen fallback matching the interface.
 *
 * @example
 * const policy = createPolicy();
 *
 * // 1. As a regular method:
 * policy.createHTML('<div>Hello</div>');
 *
 * // 2. As a tagged template:
 * policy.createHTML`<div>${userContent}</div>`;
 */
export function createPolicy(name = 'aegis-escape#html') {
	return SUPPORTS_TRUSTED_TYPES
		? globalThis.trustedTypes.createPolicy(name, { createHTML })
		: Object.freeze({ name, createHTML });
}
