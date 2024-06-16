<script lang="ts">
	import EditorButton from '$components/editor/EditorButton.svelte';

	export let editor;
	let showHeading = false;
</script>

{#if editor}
	<div class = "">
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
		<EditorButton
			{editor} key = "paragraph"
			on:click={() => editor.chain().focus().setParagraph().run()}
			disabled={!editor.can().chain().focus().setParagraph().run()}
			class={editor.isActive("strike") ? "is-active" : ""}
		/>

		<div class="relative inline-block text-left">
			<div>
				<button
					type="button"
					on:click={() => showHeading = !showHeading}
					class="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
					id="heading-menu"
					aria-expanded="true"
					aria-haspopup="true">
					Heading
					<svg class="-mr-1 h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
						<path fill-rule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clip-rule="evenodd" />
					</svg>
				</button>
			</div>

			{#if showHeading}
				<div class="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none" role="menu" aria-orientation="vertical" aria-labelledby="menu-button" tabindex="-1">
					<div class="flex flex-col gap-2" role="none">
						<!-- Active: "bg-gray-100 text-gray-900", Not Active: "text-gray-700" -->
						<EditorButton
							{editor} key = "heading 1"
							on:click={() =>
							{editor.chain().focus().toggleHeading({level: 1}).run(); showHeading = false;}}
							disabled={!editor.can().chain().focus().toggleHeading({level: 1}).run()}
							class={editor.isActive("strike") ? "is-active" : ""}
						/>
						<EditorButton
							{editor} key = "heading 2"
							on:click={() =>
							{editor.chain().focus().toggleHeading({level: 2}).run();
								showHeading = false;}}
							disabled={!editor.can().chain().focus().toggleHeading({level: 2}).run()}
							class={editor.isActive("strike") ? "is-active" : ""}
						/>
						<EditorButton
							{editor} key = "heading 3"
							on:click={() =>
							{editor.chain().focus().toggleHeading({level: 3}).run();
								showHeading = false;}}
							disabled={!editor.can().chain().focus().toggleHeading({level: 3}).run()}
							class={editor.isActive("strike") ? "is-active" : ""}
						/>
						<EditorButton
							{editor} key = "heading 4"
							on:click={() =>
							{editor.chain().focus().toggleHeading({level: 4}).run();
								showHeading = false;}}
							disabled={!editor.can().chain().focus().toggleHeading({level: 4}).run()}
							class={editor.isActive("strike") ? "is-active" : ""}
						/>
						<EditorButton
							{editor} key = "heading 5"
							on:click={() =>
							{editor.chain().focus().toggleHeading({level: 5}).run();
								showHeading = false;}}
							disabled={!editor.can().chain().focus().toggleHeading({level: 5}).run()}
							class={editor.isActive("strike") ? "is-active" : ""}
						/>
						<EditorButton
							{editor} key = "heading 6"
							on:click={() =>
							{editor.chain().focus().toggleHeading({level: 6}).run();
								showHeading = false;}}
							disabled={!editor.can().chain().focus().toggleHeading({level: 6}).run()}
							class={editor.isActive("strike") ? "is-active" : ""}
						/>
					</div>
				</div>
			{/if}
		</div>

	</div>
{/if}
