/**
 * Escapes a string for use in CSS selectors and identifiers.
 * * Wraps native `CSS.escape()` if available.
 * * Polyfills the CSSOM spec behavior for server-side or legacy environments.
 * * Correctly handles leading digits, control characters, and syntax delimiters.
 *
 * @param {string} value - The string to be escaped.
 * @returns {string} A CSS-safe string suitable for use in `querySelector` or stylesheets.
 *
 * @example
 * escapeCSS('123'); // "\\31 23" (Valid ID selector)
 * escapeCSS('foo.bar'); // "foo\\.bar" (Escaped class/ID syntax)
 */
export const escapeCSS = typeof globalThis?.CSS?.escape === 'function' ? globalThis.CSS.escape : (value) => {
	const string = String(value);
	const length = string.length;
	let index = -1;
	let codeUnit;
	let result = '';
	const firstCodeUnit = string.charCodeAt(0);

	while (++index < length) {
		codeUnit = string.charCodeAt(index);

		// 1. Handle NULL (U+0000) -> Replacement Character
		if (codeUnit === 0x0000) {
			result += '\uFFFD';
			continue;
		}

		// 2. Handle Control Characters (0x01-0x1F, 0x7F) -> Hex Escape + Space
		if ((codeUnit >= 0x0001 && codeUnit <= 0x001f) || codeUnit === 0x007f) {
			result += '\\' + codeUnit.toString(16) + ' ';
			continue;
		}

		// 3. Handle Leading Digits
		// If digit is first char, OR digit is second char and first char was hyphen
		if (index === 0 || (index === 1 && firstCodeUnit === 0x002d)) {
			if (codeUnit >= 0x0030 && codeUnit <= 0x0039) {
				result += '\\' + codeUnit.toString(16) + ' ';
				continue;
			}
		}

		// 4. Handle Single Hyphen (valid ident requires 2 chars if starts with hyphen?)
		// Actually, a single hyphen must be escaped to be an ident, not a keyword/syntax
		if (index === 0 && length === 1 && codeUnit === 0x002d) {
			result += '\\' + string.charAt(index);
			continue;
		}

		// 5. Allowed Characters (No escaping needed)
		// High ASCII (>= 0x80), Hyphen (0x2d), Underscore (0x5f), 0-9, A-Z, a-z
		if (
			codeUnit >= 0x0080 ||
			codeUnit === 0x002d ||
			codeUnit === 0x005f ||
			(codeUnit >= 0x0030 && codeUnit <= 0x0039) ||
			(codeUnit >= 0x0041 && codeUnit <= 0x005a) ||
			(codeUnit >= 0x0061 && codeUnit <= 0x007a)
		) {
			result += string.charAt(index);
			continue;
		}

		// 6. Default: Backslash Escape (Syntax chars like . : # [ ])
		result += '\\' + string.charAt(index);
	}
	return result;
};
