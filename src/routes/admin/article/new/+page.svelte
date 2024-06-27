<script lang="ts">
	import ArticleEditor from '$components/ArticleEditor.svelte';

	export let data;

	const emptyArticle = {
		title: '',
		subtitle: '',
		slug: '',
		abstract: '',
		is_top: false,
		is_draft: true,
		is_feature: false,
		is_premium: false,
		language: data.defaultLanguage,
		otherVersions: [],
		content_json: {
			"type": "doc",
			"content": [
				{
					"type": "paragraph",
					"content": [
						{
							"type": "text",
							"text": "开始书写你的文章吧"
						}
					]
				}
			]
		}
	}
</script>

<div class="@container">
	<ArticleEditor {data} articleContent={emptyArticle} />
</div>
