<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { writable } from 'svelte/store';
	import { Editor } from '@tiptap/core';
	import StarterKit from '@tiptap/starter-kit';
	import FixedMenu from '$components/editor/FixedMenu.svelte';

	let element;
	let editor;

	export let content = '';

	const contentStore = writable(content);

	onMount(() => {
		editor = new Editor({
			element: element,
			extensions: [
				StarterKit,
			],
			content: '<p>Hello World! 🌍️ </p>',
			onTransaction: () => {
				// force re-render so `editor.isActive` works as expected
				editor = editor;
			}
		});
		editor.on('update', ({ editor }) => {
			contentStore.set(editor.getHTML());
		});
	});

	onDestroy(() => {
		if (editor) {
			editor.destroy();
		}
	});
</script>

<div class = "border rounded-lg p-4">
	<FixedMenu {editor} />
	<div
		bind:this = {element}
		class = "py-4"
	/>
</div>

{#if editor}
	<div class = "border mt-8">
		<pre class = "mb-4 border-b">
			{JSON.stringify(editor.getJSON(), null, 2)}
		</pre>

		<pre class = "font-mono bg-gray-200 mb-4">
			{editor.getHTML()}
		</pre>

		<div class = "bg-indigo-100">
		{$contentStore}
	  </div>
	</div>
{/if}

<style>
  button.active {
    background: black;
    color: white;
  }
</style>
