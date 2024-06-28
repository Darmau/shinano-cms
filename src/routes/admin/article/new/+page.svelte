<script lang="ts">
	import ArticleEditor from '$components/ArticleEditor.svelte';

	export let data;
</script>

<div>
	<ArticleEditor {data} isSaved=false />
</div>
