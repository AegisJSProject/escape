import assert from 'node:assert';
import { describe, test } from 'node:test';
import { html } from './trusted-html.js';

describe('Trusted HTML Policy (Node/Fallback Mode)', () => {
	test('Tag Usage: escapes unsafe values', () => {
		const unsafe = '<img src=x onerror=alert(1)>';
		const result = html`<div>${unsafe}</div>`;

		assert.strictEqual(result.toString(), '<div>&lt;img src=x onerror=alert(1)&gt;</div>');
	});

	test('Direct Usage: escapes input string', () => {
		const result = html('<script>alert(1)</script>');
		assert.strictEqual(result.toString(), '&lt;script&gt;alert(1)&lt;/script&gt;');
	});

	test('Array Usage: joins and escapes list items', () => {
		// Essential to ensure arrays are not stringified with commas
		const items = ['<br>', '<b>bold</b>'];
		const result = html`Items: ${items}`;

		assert.strictEqual(result.toString(), 'Items: &lt;br&gt;,&lt;b&gt;bold&lt;/b&gt;');
	});

	test('Security: enforces Double Escaping in fallback mode', () => {
		/* * CRITICAL SECURITY CHECK:
		 * Since we are in Node (no TrustedTypes), the output of `html` is just a string.
		 * If we nest this string into another template, it MUST be escaped again.
		 * If it wasn't, we would be vulnerable to "fake trust".
		 */
		const inner = html`<span>Safe</span>`;
		// inner is string: "<span>Safe</span>"

		const outer = html`<div>${inner}</div>`;
		// outer sees a string, so it escapes it: "<div>&lt;span&gt;Safe&lt;/span&gt;</div>"

		assert.strictEqual(outer.toString(), '<div><span>Safe</span></div>');
	});
});
