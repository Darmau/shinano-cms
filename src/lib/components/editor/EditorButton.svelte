<script lang="ts">
	export let editor;
	export let key;
</script>

{#if editor}
	<button class:active={editor.isActive(key)} on:click
					class="rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
		{key}
	</button>
{/if}

<style>
  button {
    margin: 0;
  }

  button.active {
    background: black;
    color: white;
  }
</style>
