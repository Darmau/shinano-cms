import { Node } from '@tiptap/core';

export default Node.create({
	name: 'gallery',
	group: 'block',
	content: 'inline*',
	parseHTML() {
		return [
			{
				tag: 'custom-node',
			},
		];
	},
	renderHTML({ HTMLAttributes }) {
		return ['custom-node', HTMLAttributes, 0];
	},
	addNodeView() {
		return ({ node }) => {
			const dom = document.createElement('div');
			dom.classList.add('custom-node');
			dom.innerHTML = `<p>${node.attrs.index}</p>`;
			return {
				dom,
			};
		};
	},
	addAttributes() {
		return {
			index: {
				default: 0,
			},
		};
	},
});
