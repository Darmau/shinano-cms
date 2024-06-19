import { Node } from '@tiptap/core';

export default Node.create({
	name: 'image',
	group: 'block',
	content: 'inline*',
	parseHTML() {
		return [
			{
				tag: 'article-image',
			},
		];
	},
	renderHTML({ HTMLAttributes }) {
		return ['custom-image', HTMLAttributes, 0];
	},
	addNodeView() {
		return ({ node }) => {
			const dom = document.createElement('img');
			dom.classList.add('w-1/2');
			dom.src = `${node.attrs.prefix}/cdn-cgi/image/format=auto,width=960/${node.attrs.prefix}/${node.attrs.storage_key}`;
			dom.alt = node.attrs.alt;
			return {
				dom,
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
