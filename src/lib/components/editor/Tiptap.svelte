<script lang="ts">
	import { onMount } from 'svelte';
	import type { Readable } from 'svelte/store';
	import StarterKit from '@tiptap/starter-kit';
	import Highlight from '@tiptap/extension-highlight';
	import { Link } from '@tiptap/extension-link';
	import { Editor } from '$lib/functions/Editor';
	import EditorContent from '$components/editor/EditorContent.svelte';
	import createEditor from '$lib/functions/createEditor';
	import H2Icon from '$assets/icons/editor/heading2.svelte';
	import H3Icon from '$assets/icons/editor/heading3.svelte';
	import H4Icon from '$assets/icons/editor/heading4.svelte';
	import BoldIcon from '$assets/icons/editor/bold.svelte';
	import ItalicIcon from '$assets/icons/editor/italic.svelte';
	import StrikeIcon from '$assets/icons/editor/strike.svelte';
	import CodeIcon from '$assets/icons/editor/code.svelte';
	import HighlightIcon from '$assets/icons/editor/highlight.svelte';
	import LinkIcon from '$assets/icons/editor/link.svelte';
	import UnlinkIcon from '$assets/icons/editor/linkoff.svelte';
	import ParagraphIcon from '$assets/icons/editor/paragraph.svelte';
	import BlockquoteIcon from '$assets/icons/editor/quote.svelte';
	import BulletListIcon from '$assets/icons/editor/ulist.svelte';
	import OrderedListIcon from '$assets/icons/editor/olist.svelte';
	import CodeBlockIcon from '$assets/icons/editor/codeblock.svelte';
	import HardBreakIcon from '$assets/icons/editor/break.svelte';
	import DividerIcon from '$assets/icons/editor/divider.svelte';
	import InsertTable from '$assets/icons/editor/insertTable.svelte';
	import InsertColumnBefore
		from '$assets/icons/editor/tableColumnBefore.svelte';
	import InsertColumnAfter from '$assets/icons/editor/tableColumnAfter.svelte';
	import DeleteColumn from '$assets/icons/editor/tableColumnDelete.svelte';
	import InsertRowBefore from '$assets/icons/editor/tableRowBefore.svelte';
	import InsertRowAfter from '$assets/icons/editor/tableRowAfter.svelte';
	import DeleteRow from '$assets/icons/editor/tableRowDelete.svelte';
	import Undo from '$assets/icons/editor/undo.svelte';
	import Redo from '$assets/icons/editor/redo.svelte';
	import { Table } from '@tiptap/extension-table';
	import TableCell from '@tiptap/extension-table-cell';
	import TableHeader from '@tiptap/extension-table-header';
	import TableRow from '@tiptap/extension-table-row';

	// import { SvelteCounterExtension, SvelteEditableExtension } from './_components/SvelteExtension';

	let editor: Readable<Editor>;

	onMount(() => {
		editor = createEditor({
			extensions: [
				StarterKit,
				Highlight,
				Link.configure({
					protocols: ['http', 'https', 'mailto'],
					defaultProtocol: 'https',
				}),
				Table,
				TableRow,
				TableCell,
				TableHeader,
			],
			content: `
        <p>This is still the text editor you're used to, but enriched with node views.</p>
        <svelte-counter-component count="0"></svelte-counter-component>
        <p>This is an editable component</p>
        <svelte-editable-component>This is editable</svelte-editable-component>
        <p>Did you see that? That's a Svelte component. We are really living in the future.</p>
      `,
			editorProps: {
				attributes: {
					class: 'border-2 border-black rounded-b-md p-3 outline-none',
				},
			},
		});
	});

	const toggleHeading = (level: 1 | 2) => {
		return () => {
			$editor.chain().focus().toggleHeading({ level }).run();
		};
	};

	const toggleBold = () => {
		$editor.chain().focus().toggleBold().run();
	};

	const toggleItalic = () => {
		$editor.chain().focus().toggleItalic().run();
	};

	const toggleStrike = () => {
		$editor.chain().focus().toggleStrike().run();
	};

	const toggleInlineCode = () => {
		$editor.chain().focus().toggleCode().run();
	};

	const toggleHighlight = () => {
		$editor.chain().focus().toggleHighlight().run();
	};

	const toggleBlockquote = () => {
		$editor.chain().focus().toggleBlockquote().run();
	};

	const setLink = () => {
		const previousUrl = $editor.getAttributes('link').href
		const url = window.prompt('URL', previousUrl)

		// cancelled
		if (url === null) {
			return
		}

		// empty
		if (url === '') {
			$editor.chain().focus().extendMarkRange('link').unsetLink()
			.run()

			return
		}

		// update link
		$editor.chain().focus().extendMarkRange('link').setLink({ href: url })
		.run()
	};

	const setParagraph = () => {
		$editor.chain().focus().setParagraph().run();
	};

	const toggleBulletList = () => {
		$editor.chain().focus().toggleBulletList().run();
	};

	const toggleOrderedList = () => {
		$editor.chain().focus().toggleOrderedList().run();
	};

	const toggleCodeBlock = () => {
		$editor.chain().focus().toggleCodeBlock().run();
	};

	const setHardBreak = () => {
		$editor.chain().focus().setHardBreak().run();
	};

	const setDivider = () => {
		$editor.chain().focus().setHorizontalRule().run();
	};

	const insertTable = () => {
		$editor.chain().focus().insertTable({ rows: 3, cols: 3,
			withHeaderRow: true}).run();
	};

	const addColumnBefore = () => {
		$editor.chain().focus().addColumnBefore().run();
	};

	const addColumnAfter = () => {
		$editor.chain().focus().addColumnAfter().run();
	};

	const deleteColumn = () => {
		$editor.chain().focus().deleteColumn().run();
	};

	const addRowBefore = () => {
		$editor.chain().focus().addRowBefore().run();
	};

	const addRowAfter = () => {
		$editor.chain().focus().addRowAfter().run();
	};

	const deleteRow = () => {
		$editor.chain().focus().deleteRow().run();
	};

	const undo = () => {
		$editor.chain().focus().undo().run();
	};

	const redo = () => {
		$editor.chain().focus().redo().run();
	};

	$: isActive = (name: string, attrs = {}) => $editor.isActive(name, attrs);

	$: menuItems = [
		{
			name: 'heading-2',
			command: toggleHeading(2),
			content: H2Icon,
			active: () => isActive('heading', { level: 2 }),
		},
		{
			name: 'heading-3',
			command: toggleHeading(3),
			content: H3Icon,
			active: () => isActive('heading', { level: 3 }),
		},
		{
			name: 'heading-4',
			command: toggleHeading(4),
			content: H4Icon,
			active: () => isActive('heading', { level: 4 }),
		},
		{
			name: 'bold',
			command: toggleBold,
			content: BoldIcon,
			active: () => isActive('bold'),
		},
		{
			name: 'italic',
			command: toggleItalic,
			content: ItalicIcon,
			active: () => isActive('italic'),
		},
		{
			name: 'strike',
			command: toggleStrike,
			content: StrikeIcon,
			active: () => isActive('strike'),
		},
		{
			name: 'inline-code',
			command: toggleInlineCode,
			content: CodeIcon,
			active: () => isActive('code'),
		},
		{
			name: 'highlight',
			command: toggleHighlight,
			content: HighlightIcon,
			active: () => isActive('highlight'),
		},
		{
			name: 'link',
			command: setLink,
			content: LinkIcon,
			active: () => isActive('link'),
		},
		{
			name: 'unlink',
			command: () => $editor.chain().focus().unsetLink().run(),
			content: UnlinkIcon,
			active: () => isActive('unlink'),
		},
		{
			name: 'paragraph',
			command: setParagraph,
			content: ParagraphIcon,
			active: () => isActive('paragraph'),
		},
		{
			name: 'blockquote',
			command: toggleBlockquote,
			content: BlockquoteIcon,
			active: () => isActive('blockquote'),
		},
		{
			name: 'bullet-list',
			command: toggleBulletList,
			content: BulletListIcon,
			active: () => isActive('bulletList'),
		},
		{
			name: 'ordered-list',
			command: toggleOrderedList,
			content: OrderedListIcon,
			active: () => isActive('orderedList'),
		},
		{
			name: 'code-block',
			command: toggleCodeBlock,
			content: CodeBlockIcon,
			active: () => isActive('codeBlock'),
		},
		{
			name: 'hard-break',
			command: setHardBreak,
			content: HardBreakIcon,
			active: () => isActive('hardBreak'),
		},
		{
			name: 'divider',
			command: setDivider,
			content: DividerIcon,
			active: () => isActive('horizontalRule'),
		},
		{
			name: 'insert-table',
			command: insertTable,
			content: InsertTable,
			active: () => isActive('table'),
		},
		{
			name: 'insert-column-before',
			command: addColumnBefore,
			content: InsertColumnBefore,
			active: () => isActive('tableColumnBefore'),
		},
		{
			name: 'insert-column-after',
			command: addColumnAfter,
			content: InsertColumnAfter,
			active: () => isActive('tableColumnAfter'),
		},
		{
			name: 'delete-column',
			command: deleteColumn,
			content: DeleteColumn,
			active: () => isActive('tableColumnDelete'),
		},
		{
			name: 'insert-row-before',
			command: addRowBefore,
			content: InsertRowBefore,
			active: () => isActive('tableRowBefore'),
		},
		{
			name: 'insert-row-after',
			command: addRowAfter,
			content: InsertRowAfter,
			active: () => isActive('tableRowAfter'),
		},
		{
			name: 'delete-row',
			command: deleteRow,
			content: DeleteRow,
			active: () => isActive('tableRowDelete'),
		},
		{
			name: 'undo',
			command: undo,
			content: Undo,
			active: () => isActive('undo'),
		},
		{
			name: 'redo',
			command: redo,
			content: Redo,
			active: () => isActive('redo'),
		}
	];
</script>

<svelte:head>
	<title>Tiptap Svelte</title>
</svelte:head>

{#if editor}
	<div
		class="border-black border-2 border-b-0 rounded-t-md p-2 flex gap-1 flex-wrap">
		{#each menuItems as item (item.name)}
			<button
				type="button"
				title={item.name}
				class="hover:bg-black hover:text-white w-auto h-7 px-1 rounded {item.active()
				? 'bg-black text-white' : ''}"
				on:click={item.command}
			>
				<svelte:component this={item.content} classList="w-6 h-6" />
			</button>
		{/each}
	</div>
{/if}

<EditorContent editor={$editor} />

{#if editor}
	<pre class="json-output">{JSON.stringify($editor.getJSON(), null, 2)}</pre>
{/if}

