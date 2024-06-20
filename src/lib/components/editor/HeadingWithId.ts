import Heading from '@tiptap/extension-heading';
import { v4 as uuidv4 } from 'uuid';

export interface CustomHeadingOptions {
	levels: number[];
}

export const HeadingWithID = Heading.extend({
	name: 'headingWithID',
	addAttributes() {
		return {
			...this.parent?.(),
			id: {
				default: uuidv4(),
				parseHTML: element => element.getAttribute('id'),
				renderHTML: attributes => {
					if (!attributes.id) {
						return {};
					}
					return {
						id: attributes.id,
					};
				},
			},
		};
	},

	renderHTML({ node, HTMLAttributes }) {
		return [
			'h' + node.attrs.level,
			{
				...HTMLAttributes,
				id: node.attrs.id,
			},
			0,
		];
	}
})
