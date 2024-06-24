<script lang="ts">
	import Tiptap from '$components/editor/Tiptap.svelte';

	export let data;
</script>

<div>
	<Tiptap {data} />
</div>
