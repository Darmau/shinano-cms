<script lang="ts">
	import ArticleEditor from '$components/ArticleEditor.svelte';

	export let data;
</script>

<div class="@container">
	<ArticleEditor {data} articleContent={data.articleContent} isSaved=true />
</div>
