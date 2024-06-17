<script lang="ts">
	import { onMount } from 'svelte';
	import type { Readable } from 'svelte/store';
	import StarterKit from '@tiptap/starter-kit';
	import Highlight from '@tiptap/extension-highlight';
	import { Link } from '@tiptap/extension-link';
	import { Editor } from '$lib/functions/Editor';
	import EditorContent from '$components/editor/EditorContent.svelte';
	import createEditor from '$lib/functions/createEditor';

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
				})
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

	$: isActive = (name: string, attrs = {}) => $editor.isActive(name, attrs);

	$: menuItems = [
		{
			name: 'heading-2',
			command: toggleHeading(2),
			content: 'H2',
			active: () => isActive('heading', { level: 2 }),
		},
		{
			name: 'heading-3',
			command: toggleHeading(3),
			content: 'H3',
			active: () => isActive('heading', { level: 3 }),
		},
		{
			name: 'heading-4',
			command: toggleHeading(4),
			content: 'H4',
			active: () => isActive('heading', { level: 4 }),
		},
		{
			name: 'bold',
			command: toggleBold,
			content: 'B',
			active: () => isActive('bold'),
		},
		{
			name: 'italic',
			command: toggleItalic,
			content: 'I',
			active: () => isActive('italic'),
		},
		{
			name: 'strike',
			command: toggleStrike,
			content: 'S',
			active: () => isActive('strike'),
		},
		{
			name: 'inline-code',
			command: toggleInlineCode,
			content: 'Code',
			active: () => isActive('code'),
		},
		{
			name: 'highlight',
			command: toggleHighlight,
			content: 'H',
			active: () => isActive('highlight'),
		},
		{
			name: 'link',
			command: setLink,
			content: 'Link',
			active: () => isActive('link'),
		},
		{
			name: 'unlink',
			command: () => $editor.chain().focus().unsetLink().run(),
			content: 'Unlink',
			active: () => isActive('unlink'),
		},
		{
			name: 'paragraph',
			command: setParagraph,
			content: 'P',
			active: () => isActive('paragraph'),
		},
		{
			name: 'bullet-list',
			command: toggleBulletList,
			content: 'UL',
			active: () => isActive('bulletList'),
		},
		{
			name: 'ordered-list',
			command: toggleOrderedList,
			content: 'OL',
			active: () => isActive('orderedList'),
		},
		{
			name: 'code-block',
			command: toggleCodeBlock,
			content: '```',
			active: () => isActive('codeBlock'),
		},
		{
			name: 'hard-break',
			command: setHardBreak,
			content: '<br>',
			active: () => isActive('hardBreak'),
		},
		{
			name: 'divider',
			command: setDivider,
			content: '---',
			active: () => isActive('horizontalRule'),
		},
	];
</script>

<svelte:head>
	<title>Tiptap Svelte</title>
</svelte:head>

<h1 class="mb-2 font-bold">Editor with Nodeview Renderer</h1>

{#if editor}
	<div class="border-black border-2 border-b-0 rounded-t-md p-2 flex gap-1">
		{#each menuItems as item (item.name)}
			<button
				type="button"
				class="hover:bg-black hover:text-white w-auto h-7 px-1 rounded {item.active()
				? 'bg-black text-white' : ''}"
				on:click={item.command}
			>
				{item.content}
			</button>
		{/each}
	</div>
{/if}

<EditorContent editor={$editor} />

{#if editor}
	<pre class="json-output">{JSON.stringify($editor.getJSON(), null, 2)}</pre>
{/if}
