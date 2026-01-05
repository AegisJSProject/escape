import terser from '@rollup/plugin-terser';

export default [{
	input: 'index.js',
	output: [{
		file: 'index.cjs',
		format: 'cjs',
	}, {
		file: 'index.min.js',
		format: 'module',
		plugins: [terser()],
		sourcemap: true,
	}],
}, {
	input: 'html.js',
	output: [{
		file: 'html.cjs',
		format: 'cjs',
	}, {
		file: 'html.min.js',
		format: 'module',
		plugins: [terser()],
		sourcemap: true,
	}],
}, {
	input: 'trusted-html.js',
	output: [{
		file: 'trusted-html.cjs',
		format: 'cjs',
	}, {
		file: 'trusted-html.min.js',
		format: 'module',
		plugins: [terser()],
		sourcemap: true,
	}],
}, {
	input: 'css.js',
	output: [{
		file: 'css.cjs',
		format: 'cjs',
	}, {
		file: 'css.min.js',
		format: 'module',
		plugins: [terser()],
		sourcemap: true,
	}],
}];
