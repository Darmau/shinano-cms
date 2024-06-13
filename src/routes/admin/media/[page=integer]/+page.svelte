<script lang="ts">
	import UploadFile from '$components/image/UploadFile.svelte';
	import PageTitle from '$components/PageTitle.svelte';
	import ImageGrid from '$components/image/ImageGrid.svelte';

	export let data;
	export let title = "图片";
</script>

<svelte:head>
	<title>{title}</title>
</svelte:head>

<div>
	<PageTitle title={title} />
	<UploadFile data={data} />
	<ImageGrid data={data} />
</div>
