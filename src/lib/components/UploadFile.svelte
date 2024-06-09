<script lang="ts">
	import { FileDropzone, getToastStore } from '@skeletonlabs/skeleton';
	import { StorageConfigs } from '$lib/types/storageConfigs';
	import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
	import { onMount } from 'svelte';
	import { v4 as uuidv4 } from 'uuid';

	export let data;
	let { supabase } = data;
	$: ({ supabase } = data);

	let files: FileList;
	const toastStore = getToastStore();

	const storageConfigs = new StorageConfigs();
	let CONFIGS = storageConfigs.emptyObject();
	const KEYS = storageConfigs.array();

	let S3: S3Client | undefined;

	function initS3Client() {
		S3 = new S3Client({
			region: CONFIGS.S3_REGION,
			endpoint: CONFIGS.S3_ENDPOINT,
			credentials: {
				accessKeyId: CONFIGS.S3_ACCESS_ID,
				secretAccessKey: CONFIGS.S3_SECRET_KEY
			}
		});

	}

	// 获取S3配置，并存储到CONFIGS中
	const getS3Config = async () => {
		const { data: storageKeys, error: fetchError } = await
			supabase.from('config').select('name, value').in('name', KEYS);

		if (fetchError) {
			console.error(fetchError);
			toastStore.trigger({
				message: "Failed to fetch S3 config.",
				hideDismiss: true,
				background: 'variant-filled-error'
			});
		}

		storageKeys.forEach(key => {
			if (key.name in CONFIGS) {
				CONFIGS[key.name] = key.value;
			}
		})

		initS3Client();
	}

	onMount(async () => {
		await getS3Config();
	});

	// 上传文件
	async function uploadFile(event: Event) {
		event.preventDefault();
		const target = event.target as HTMLInputElement;
		const file = target.files[0];

		const command = new PutObjectCommand({
			Bucket: CONFIGS.S3_BUCKET,
			Key: uuidv4(),
			Body: file,
			ContentType: file.type,
			Metadata: {
				'file-name': file.name,
				'file-size': file.size.toString(),
				'file-type': file.type
			}
		});

		// upload
		try {
			const response = await S3.send(command);
			console.log(response);
		} catch (error) {
			console.error(error);
			toastStore.trigger({
				message: "Failed to upload file.",
				hideDismiss: true,
				background: 'variant-filled-error'
			})
		}
	}
</script>

<div>
	<FileDropzone name="files" bind:files={files} on:change={uploadFile} />
</div>
