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
			const figure = document.createElement('figure');
			figure.classList.add('w-1/3');

			// 创建img元素
			const img = document.createElement('img');
			img.src = `${node.attrs.prefix}/cdn-cgi/image/format=auto,width=960/${node.attrs.prefix}/${node.attrs.storage_key}`;
			img.alt = node.attrs.alt;

			// 创建figcaption元素
			const figcaption = document.createElement('figcaption');
			figcaption.textContent = node.attrs.caption;

			// 将img和figcaption添加到figure中
			figure.appendChild(img);
			figure.appendChild(figcaption);

			return {
				dom: figure,
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
			},
			caption: {
				default: ''
			}
		};
	},
});
