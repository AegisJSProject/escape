export const HTML_UNSAFE_PATTERN = /[<>"']|&(?![a-zA-Z\d]{2,40};|#\d{1,6};)/g;
/* eslint no-control-regex: "off" */
export const ATTR_NAME_UNSAFE_PATTERN = /[\u0000-\u001f\u007f-\u009f\s"'\\/=><&]/g;
export const HTML_REPLACEMENTS = Object.freeze({
	'&': '&amp;',
	'"': '&quot;',
	'\'': '&apos;',
	'<': '&lt;',
	'>': '&gt;',
});

const _str = (str, fallback = '') => (str?.toString?.() ?? fallback);

/**
 * Escapes characters that are unsafe for use in HTML text content or quoted attribute values.
 * * Replaces `&`, `<`, `>`, `"`, and `'` with their corresponding named entities.
 * Returns an empty string if the input is null or undefined.
 *
 * @param {string} str The input string to escape.
 * @returns {string} The escaped string safe for HTML text nodes and quoted attributes.
 */
export const escapeHTML = str => _str(str)
	.replaceAll(HTML_UNSAFE_PATTERN, char => HTML_REPLACEMENTS[char]);

/**
 * Tagged template function that automatically escapes interpolated values.
 * @example html`<div class="${className}">${content}</div>`
 */
export function html(strings, ...values) {
	return String.raw(strings, ...values.map(escapeHTML));
}

/**
 * Escapes characters that are unsafe or prohibited in HTML attribute names.
 * * Uses a hex-encoding strategy (e.g., `_0020_`) to preserve uniqueness and prevent
 * attribute injection or name collisions, as attribute names do not support standard entity escaping.
 *
 * @param {string} str The string to use as an attribute name.
 * @returns {string} A sanitized string safe for use as an attribute name.
 */
export const escapeAttrName = str => _str(str)
	.replace(ATTR_NAME_UNSAFE_PATTERN, char => '_' + char.charCodeAt(0).toString(16).padStart(4, '0') + '_');


/**
 * Serializes a DOM Attr node into a safe HTML attribute string (name="value").
 * * Automatically escapes the attribute name (hex-encoded) and the attribute value (entity-escaped).
 * Returns an empty string if the provided argument is not a valid DOM Attr instance.
 *
 * @param {Attr} attr The DOM Attribute node to stringify.
 * @returns {string} The formatted attribute string (e.g., `data-id="123"`) or an empty string.
 */
export const stringifyAttr = attr => attr instanceof globalThis.Attr
	? `${escapeAttrName(attr.name)}="${escapeHTML(attr.value)}"`
	: '';
