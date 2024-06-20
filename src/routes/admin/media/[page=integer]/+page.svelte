<script lang="ts">
	import UploadFile from '$components/image/UploadFile.svelte';
	import PageTitle from '$components/PageTitle.svelte';
	import ImageGrid from '$components/image/ImageGrid.svelte';
	import { S3Client } from '@aws-sdk/client-s3';
	import { onMount } from 'svelte';
	import Pagination from '$components/Pagination.svelte';

	export let data;
	export let title = '图片';

	let S3: S3Client | undefined;

	onMount(async () => {
		S3 = new S3Client({
			region: data.configs.S3_REGION,
			endpoint: data.configs.S3_ENDPOINT,
			credentials: {
				accessKeyId: data.configs.S3_ACCESS_ID,
				secretAccessKey: data.configs.S3_SECRET_KEY
			}
		});
	});
</script>

<svelte:head>
	<title>{title}</title>
</svelte:head>

<div class="@container">
	<PageTitle title = {title} />
	<UploadFile data = {data} s3 = {S3} />
	<ImageGrid data = {data} s3 = {S3} />
	<Pagination
		count = {data.count} page = {data.page} limit = {data.limit}
		path = {data.path}
	/>
</div>
