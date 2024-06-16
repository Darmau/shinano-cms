<script lang="ts">
	export let editor;
	export let key;
</script>

{#if editor}
	<button class:active={editor.isActive(key)} on:click>
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
