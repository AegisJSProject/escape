import { escapeHTML } from './html.js';

const SUPPORTS_TRUSTED_TYPES = 'trustedTypes' in globalThis;
const POLICY_NAME = 'aegis-escape#html';
const TRUSTED_SYMBOL = Symbol(POLICY_NAME);

const isTrustedHTML = SUPPORTS_TRUSTED_TYPES
	? input => globalThis.trustedTypes.isHTML(input)
	: input => typeof input === 'object' ? Object.hasOwn(input ?? {}, TRUSTED_SYMBOL) : false;

const policy = SUPPORTS_TRUSTED_TYPES
	? globalThis.trustedTypes.createPolicy(POLICY_NAME, { createHTML: input => input })
	: Object.freeze({
		name: POLICY_NAME,
		createHTML(input) {
			const obj = {
				toString() {
					return input;
				}
			};

			Object.defineProperty(obj, TRUSTED_SYMBOL, {
				value: true,
				enumerable: false,
				writable: false,
			});

			return Object.freeze(obj);
		}
	});

export function html(strings, ...values) {
	if (! Array.isArray(strings) || ! Array.isArray(strings.raw)) {
		return policy.createHTML(Array.isArray(strings)
			? strings.map(input => isTrustedHTML(input) ? input : escapeHTML(input)).join('')
			: escapeHTML(strings));
	} else {
		return policy.createHTML(String.raw(
			strings,
			...values.map(val => Array.isArray(val)
				? val.flatMap(v => isTrustedHTML(v) ? v : escapeHTML(v)).join('')
				: isTrustedHTML(val) ? val : escapeHTML(val)
			)
		));
	}
}
