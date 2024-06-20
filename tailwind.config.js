/** @type {import('tailwindcss').Config} */
import forms from '@tailwindcss/forms';
import { join } from 'path';
import { skeleton } from '@skeletonlabs/tw-plugin';

export default {
	darkMode: 'class',
	content: [
		'./src/**/*.{html,js,svelte,ts}',
		join(require.resolve(
				'@skeletonlabs/skeleton'),
			'../**/*.{html,js,svelte,ts}'
		)
	],
	theme: {
		extend: {
			screens: {
				'3xl': '1600px'
			}
		}
	},
	plugins: [
		skeleton({
			themes: { preset: ['skeleton'] }
		}),
		require('@tailwindcss/container-queries'),
		forms,
		require('@tailwindcss/typography')
	]
};

