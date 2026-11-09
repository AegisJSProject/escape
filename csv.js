export function escapeCSV(strings, ...values) {
	return String.raw(strings, ...values.map(v => `"${String(v ?? '').replaceAll('"', '""')}"`));
}
