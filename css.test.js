import assert from 'node:assert';
import { describe, test } from 'node:test';
import { escapeCSS } from './css.js';

describe('escapeCSS', () => {
	test('passes through valid identifiers', () => {
		assert.strictEqual(escapeCSS('foo'), 'foo');
		assert.strictEqual(escapeCSS('foo-bar'), 'foo-bar');
		assert.strictEqual(escapeCSS('foo_bar'), 'foo_bar');
		assert.strictEqual(escapeCSS('FOO'), 'FOO');
	});

	test('escapes syntax characters', () => {
		// Class, ID, Pseudo-classes
		assert.strictEqual(escapeCSS('foo.bar'), 'foo\\.bar');
		assert.strictEqual(escapeCSS('foo#bar'), 'foo\\#bar');
		assert.strictEqual(escapeCSS('foo:bar'), 'foo\\:bar');
		// Brackets and attributes
		assert.strictEqual(escapeCSS('[data=val]'), '\\[data\\=val\\]');
	});

	test('handles leading digits (must be hex escaped)', () => {
		// 1 -> \31 + space
		assert.strictEqual(escapeCSS('123'), '\\31 23');
		// 9 -> \39 + space
		assert.strictEqual(escapeCSS('987'), '\\39 87');
		// 0 -> \30 + space
		assert.strictEqual(escapeCSS('0abc'), '\\30 abc');
	});

	test('handles leading hyphen followed by digit', () => {
		// Hyphen remains, digit becomes hex escaped
		assert.strictEqual(escapeCSS('-123'), '-\\31 23');
		assert.strictEqual(escapeCSS('-0'), '-\\30 ');
	});

	test('handles single hyphen vs double hyphen', () => {
		// Single hyphen is a reserved syntax if standalone, must escape
		assert.strictEqual(escapeCSS('-'), '\\-');

		// Double hyphen is valid (starts a custom property), passes through
		assert.strictEqual(escapeCSS('--var'), '--var');
	});

	test('handles control characters', () => {
		// Null byte -> Replacement Character (U+FFFD)
		assert.strictEqual(escapeCSS('\u0000'), '\uFFFD');

		// C0 Control (0x01-0x1F) -> Hex escape + space
		assert.strictEqual(escapeCSS('\x01'), '\\1 ');
		assert.strictEqual(escapeCSS('\x1F'), '\\1f ');

		// Delete (0x7F) -> Hex escape + space
		assert.strictEqual(escapeCSS('\x7F'), '\\7f ');
	});

	test('handles high ASCII and Unicode', () => {
		// Should pass through untouched
		assert.strictEqual(escapeCSS('©'), '©');
		assert.strictEqual(escapeCSS('💩'), '💩');
		assert.strictEqual(escapeCSS('über'), 'über');
	});

	test('converts non-strings to strings (IDL behavior)', () => {
		assert.strictEqual(escapeCSS(123), '\\31 23');
		// String(null) -> "null" (valid identifier)
		assert.strictEqual(escapeCSS(null), 'null');
		// String(undefined) -> "undefined" (valid identifier)
		assert.strictEqual(escapeCSS(undefined), 'undefined');
	});
});
