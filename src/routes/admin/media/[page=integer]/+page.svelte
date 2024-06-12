<script lang="ts">
	import UploadFile from '$components/UploadFile.svelte';
	import PageTitle from '$components/PageTitle.svelte';

	export let data;
	export let title = "图片";

	let isUploadImage = false;

	// 该函数负责打开上传图片窗口
	function startUpload() {
		console.log('start')
		isUploadImage = true;
	}

	function closeUpload() {
		isUploadImage = false
	}
</script>

<svelte:head>
	<title>{title}</title>
</svelte:head>

<div>
	<PageTitle title={title} {startUpload} />
	{#if isUploadImage}
		<UploadFile data={data} {closeUpload} />
	{/if}
	{#each data.images as image}
		<img
			src={`${data.prefix}/cdn-cgi/image/format=avif,width=480/${data.prefix}/${image.storage_key}`} alt="test" />
	{/each}
</div>
