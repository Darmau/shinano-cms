<script lang="ts">
	import UploadFile from '$components/UploadFile.svelte';
	import PageTitle from '$components/PageTitle.svelte';

	export let data;
	export let title = "图片";
</script>

<svelte:head>
	<title>{title}</title>
</svelte:head>

<div>
	<PageTitle title={title} />
	<UploadFile data={data} />
	{#each data.images as image}
		<img
			src={`${data.prefix}/cdn-cgi/image/format=avif,width=480/${data.prefix}/${image.storage_key}`} alt="test" />
	{/each}
</div>
