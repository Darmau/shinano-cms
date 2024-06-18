import { CodeBlock } from '@tiptap/extension-code-block';

export interface CustomCodeBlockOptions {
	HTMLAttributes: Record<string, never>,
}

export const CustomCodeBlock = CodeBlock.extend<CustomCodeBlockOptions>({
	name: 'customCodeBlock',
	addAttributes() {
		return {
			...this.parent?.(),
			'data-language': {
				default: null,
				parseHTML: element => element.getAttribute('data-language'),
				renderHTML: attributes => {
					if (!attributes['data-language']) {
						return {};
					}
					return {
						'data-language': attributes['data-language'],
					};
				},
			},
		};
	},

	renderHTML({ node, HTMLAttributes }) {
		return [
			'pre',
			{
				...HTMLAttributes,
				'data-language': node.attrs['data-language'] || '',
			},
			['code', {}, 0],
		];
	},
});
