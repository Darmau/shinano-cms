<script lang="ts">
	import Tiptap from '$components/editor/Tiptap.svelte';
	import { S3Client } from '@aws-sdk/client-s3';
	import { onMount } from 'svelte';
	import ImagesModel from '$components/editor/ImagesModel.svelte';

	export let data;

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

<div>
	<Tiptap {data} />
</div>
