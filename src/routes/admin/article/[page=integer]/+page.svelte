<script lang="ts">
	export let data;
</script>
<a href="/admin/article/new">New Article</a>

<div>{data.page}</div>

<ul>
	{#each data.articles as article}
		<li>
			<h2>{article.title}</h2>
		</li>
	{/each}
</ul>

<div>{data.count}</div>

<div>{data.path}</div>
