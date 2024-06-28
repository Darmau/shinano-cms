<script lang="ts">
	import ArticleEditor from '$components/ArticleEditor.svelte';

	export let data;

	const emptyArticle = {
		title: 'title',
		subtitle: '',
		slug: '',
		abstract: '',
		is_top: false,
		is_draft: true,
		is_featured: false,
		is_premium: false,
		lang: data.defaultLanguage.id,
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
		},
		content_html: '<p>开始书写你的文章吧</p>',
		content_text: '开始书写你的文章吧'
	}
</script>

<div class="@container">
	<ArticleEditor {data} articleContent={emptyArticle} isSaved=false />
</div>
