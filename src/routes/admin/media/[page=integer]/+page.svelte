<script lang="ts">
	import UploadFile from '$components/image/UploadFile.svelte';
	import PageTitle from '$components/PageTitle.svelte';
	import ImageGrid from '$components/image/ImageGrid.svelte';
	import Pagination from '$components/Pagination.svelte';

	export let data;
	export let title = '图片';
</script>

<svelte:head>
	<title>{title}</title>
</svelte:head>

<div class="">
	<PageTitle title = {title} />
	<UploadFile />
	<ImageGrid data = {data} />
	<Pagination
		count = {data.count} page = {data.page} limit = {data.limit}
		path = {data.path}
	/>
</div>
