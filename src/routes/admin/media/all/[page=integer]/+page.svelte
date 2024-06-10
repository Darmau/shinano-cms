<script lang="ts">
	export let data;
</script>

<main>
	<h1>All Media</h1>
	<p>{data.page}</p>
	{#each data.images as image}
		<img
			src={`${data.prefix}/cdn-cgi/image/format=avif,width=480/${data.prefix}/${image.storage_key}`} alt="test" />
	{/each}
</main>
