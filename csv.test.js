import assert from 'node:assert';
import { describe, test } from 'node:test';
import { escapeCSV } from './csv.js';

describe('escapeCSV tagged template', () => {
	test('wraps standard strings in double quotes', () => {
		const result = escapeCSV`${'John'},${'Smith'},${'john@example.com'}`;
		assert.strictEqual(result, '"John","Smith","john@example.com"');
	});

	test('escapes internal double quotes by doubling them', () => {
		const result = escapeCSV`${'John "Johnny"'},${'Smith'}`;
		assert.strictEqual(result, '"John ""Johnny""","Smith"');
	});

	test('handles values containing commas without breaking the CSV structure', () => {
		const result = escapeCSV`${'Smith, Jr.'},${'John'}`;
		assert.strictEqual(result, '"Smith, Jr.","John"');
	});

	test('handles values containing newlines', () => {
		const result = escapeCSV`${'John\nSmith'},${'john@example.com'}`;
		assert.strictEqual(result, '"John\nSmith","john@example.com"');
	});

	test('gracefully handles null and undefined values as empty strings', () => {
		const result = escapeCSV`${null},${undefined}`;
		assert.strictEqual(result, '"",""');
	});

	test('converts numbers and booleans to strings implicitly', () => {
		const result = escapeCSV`${123},${true},${0}`;
		assert.strictEqual(result, '"123","true","0"');
	});

	test('handles empty strings', () => {
		const result = escapeCSV`${''},${''}`;
		assert.strictEqual(result, '"",""');
	});
});
