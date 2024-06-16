<script lang="ts">
	import EditorButton from '$components/editor/EditorButton.svelte';

	export let editor;
</script>

{#if editor}
	<div class = "fixed-menu">
		<EditorButton
			{editor} key = "bold"
			on:click = {() => console.log && editor.chain().focus().toggleBold().run()}
			disabled = {!editor.can().chain().focus().toggleBold().run()}
			class = {editor.isActive("bold") ? "is-active" : ""}
		/>
		<EditorButton
			{editor} key = "italic"
			on:click={() => editor.chain().focus().toggleItalic().run()}
			disabled={!editor.can().chain().focus().toggleItalic().run()}
			class={editor.isActive("italic") ? "is-active" : ""}
		/>
		<EditorButton
			{editor} key = "strike"
			on:click={() => editor.chain().focus().toggleStrike().run()}
			disabled={!editor.can().chain().focus().toggleStrike().run()}
			class={editor.isActive("strike") ? "is-active" : ""}
		/>
	</div>
{/if}

<style>
  .fixed-menu {
    background: #ccc;
    padding: 2px;
    min-height: 36px;
  }
</style>
