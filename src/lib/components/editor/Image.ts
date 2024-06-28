import { mergeAttributes, Node } from '@tiptap/core';

export default Node.create({
	name: 'image',
	group: 'block',
	content: 'inline*',
	draggable: true,
	parseHTML() {
		return [
			{
				tag: 'article-image',
			},
		];
	},
	renderHTML({ HTMLAttributes }) {
		return ['img', mergeAttributes(HTMLAttributes, { class: 'w-1/2' }), 0];
	},
	addNodeView() {
		return ({ node }) => {
			const dom = document.createElement('img');
			dom.classList.add('w-1/3');
			dom.src = `${node.attrs.prefix}/cdn-cgi/image/format=auto,width=960/${node.attrs.prefix}/${node.attrs.storage_key}`;
			dom.alt = node.attrs.alt;

			return {
				dom,
				ignoreMutation: () => true,
			};
		};
	},
	addAttributes() {
		return {
			id: {
				default: 0,
			},
			alt: {
				default: '',
			},
			storage_key: {
				default: '',
			},
			prefix: {
				default: '',
			}
		};
	},
});
