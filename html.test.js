import assert from 'node:assert';
import { describe, test, before } from 'node:test';
import { escapeHTML, escapeAttrName, stringifyAttr } from './html.js';

// Mock DOM Attr class for Node environment
class MockAttr {
	constructor(name, value) {
		this.name = name;
		this.value = value;
	}
}

// Polyfill global Attr for the instanceof check
before(() => {
	globalThis.Attr = MockAttr;
});

describe('Security Escaping Utils', () => {
	describe('escapeHTML', () => {
		test('escapes the "Big 5" special characters', () => {
			const input = '< > & " \'';
			const expected = '&lt; &gt; &amp; &quot; &apos;';
			assert.strictEqual(escapeHTML(input), expected);
		});

		test('handles mixed content correctly', () => {
			const input = '<div title="test">User & Co</div>';
			const expected = '&lt;div title=&quot;test&quot;&gt;User &amp; Co&lt;/div&gt;';
			assert.strictEqual(escapeHTML(input), expected);
		});

		test('preserves existing entities (idempotency)', () => {
			// Your lookahead prevents double-escaping
			const input = '&amp; &lt; &copy; &#123;';
			assert.strictEqual(escapeHTML(input), input);
		});

		test('escapes bare ampersands but leaves entities alone', () => {
			const input = 'Ben & Jerry vs Ben &amp; Jerry';
			const expected = 'Ben &amp; Jerry vs Ben &amp; Jerry';
			assert.strictEqual(escapeHTML(input), expected);
		});

		test('handles null/undefined/non-string', () => {
			assert.strictEqual(escapeHTML(null), '');
			assert.strictEqual(escapeHTML(undefined), '');
			assert.strictEqual(escapeHTML(123), '123');
			assert.strictEqual(escapeHTML({ toString: () => '<br>' }), '&lt;br&gt;');
		});
	});

	describe('escapeAttrName', () => {
		test('passes valid names through unchanged', () => {
			assert.strictEqual(escapeAttrName('data-id'), 'data-id');
			assert.strictEqual(escapeAttrName('xml:lang'), 'xml:lang');
		});

		test('hex-encodes space characters', () => {
			const input = 'on click';
			const expected = 'on_0020_click';
			assert.strictEqual(escapeAttrName(input), expected);
		});

		test('hex-encodes control characters', () => {
			const input = 'data\x00key'; // Null byte
			const expected = 'data_0000_key';
			assert.strictEqual(escapeAttrName(input), expected);
		});

		test('hex-encodes delimiters', () => {
			const input = 'user"name';
			const expected = 'user_0022_name';
			assert.strictEqual(escapeAttrName(input), expected);
		});

		test('hex-encodes injection attempts', () => {
			const input = '><script>';
			const expected = '_003e__003c_script_003e_';
			assert.strictEqual(escapeAttrName(input), expected);
		});
	});

	describe('stringifyAttr', () => {
		test('serializes a valid Attr object', () => {
			const attr = new MockAttr('id', 'main-content');
			assert.strictEqual(stringifyAttr(attr), 'id="main-content"');
		});

		test('escapes unsafe values', () => {
			const attr = new MockAttr('data-user', 'User "Name" <Admin>');
			// Value should use entities
			const expected = 'data-user="User &quot;Name&quot; &lt;Admin&gt;"';
			assert.strictEqual(stringifyAttr(attr), expected);
		});

		test('escapes unsafe names (Hex)', () => {
			const attr = new MockAttr('data key', 'value');
			// Name should use hex encoding
			const expected = 'data_0020_key="value"';
			assert.strictEqual(stringifyAttr(attr), expected);
		});

		test('returns empty string for non-Attr objects', () => {
			const pojo = { name: 'id', value: 'test' };
			assert.strictEqual(stringifyAttr(pojo), '');
			assert.strictEqual(stringifyAttr(null), '');
		});

		test('handles mixed injection attempt', () => {
			const attr = new MockAttr('><img src=x', '"><script>');
			// Name hex encoded, Value entity escaped
			const expected = '_003e__003c_img_0020_src_003d_x="&quot;&gt;&lt;script&gt;"';
			assert.strictEqual(stringifyAttr(attr), expected);
		});
	});
});
