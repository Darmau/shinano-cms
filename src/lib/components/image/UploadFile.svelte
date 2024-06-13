<script lang="ts">
	import { getToastStore, ProgressRadial } from '@skeletonlabs/skeleton';
	import { ImageProcess } from '$lib/types/imageProcess';
	import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
	import { onMount } from 'svelte';
	import exifr from 'exifr';
	import { v4 as uuidv4 } from 'uuid';
	import getDateFormat from '$lib/functions/dateFormat';
	import FileDropzone from '$components/FileDropzone.svelte';
	import getLocation from '$lib/functions/googleMaps';
	import { invalidateAll } from '$app/navigation'

	export let data;
	let { supabase } = data;
	$: ({ supabase } = data);

	let files: FileList;
	const toastStore = getToastStore();

	const storageConfigs = new ImageProcess();
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
				message: 'Failed to fetch S3 config.',
				hideDismiss: true,
				background: 'variant-filled-error'
			});
		}

		storageKeys.forEach(key => {
			if (key.name in CONFIGS) {
				CONFIGS[key.name] = key.value;
			}
		});

		initS3Client();
	};

	onMount(async () => {
		await getS3Config();
	});

	let isLoading = false;

	function getImageDimensions(file: File): Promise<{
		width: number;
		height: number
	}> {
		return new Promise((resolve, reject) => {
			const img = new Image();
			img.onload = () => {
				resolve({ width: img.width, height: img.height });
			};
			img.onerror = reject;

			const reader = new FileReader();
			reader.onload = (e) => {
				img.src = e.target.result as string;
			};
			reader.onerror = reject;
			reader.readAsDataURL(file);
		});
	}

	// 上传文件
	async function uploadFiles(event: Event) {
		isLoading = true;
		event.preventDefault();
		const target = event.target as HTMLInputElement;
		if (!target.files?.length) {
			return;
		}
		const files = Array.from(target.files);

		// 超过10个文件禁止上传
		if (files.length > 10) {
			toastStore.trigger({
				message: 'You can only upload up to 10 files at a time.',
				hideDismiss: true,
				background: 'variant-filled-error'
			});
			return;
		}

		const uploadPromises = files.map(async (file) => {
			const storageKey = uuidv4();
			const dimensions = await getImageDimensions(file);
			const command = new PutObjectCommand({
				Bucket: CONFIGS.S3_BUCKET,
				Key: storageKey,
				Body: file,
				ContentType: file.type,
				Metadata: {
					'file-size': file.size.toString(),
					'file-type': file.type,
					'width': dimensions.width.toString(),
					'height': dimensions.height.toString()
				}
			});

			// Attempt upload
			try {
				await S3.send(command);
				const EXIF = await exifr.parse(file);
				let location: string = null;
				if (EXIF?.latitude && EXIF?.longitude) {
					location = await getLocation(EXIF.latitude, EXIF.longitude,
						CONFIGS.GOOGLE_MAPS, CONFIGS.AMAP);
					// Ensure this function supports async execution
				}

				// Prepare data for batch insertion
				return {
					folder: 'default',
					file_name: file.name,
					format: file.type.split('/')[1],
					alt: '',
					caption: '',
					date: getDateFormat(),
					exif: EXIF,
					location,
					taken_at: EXIF?.DateTimeOriginal,
					size: file.size,
					width: dimensions.width,
					height: dimensions.height,
					storage_key: storageKey
				}
			} catch (error) {
				console.error(error);
				toastStore.trigger({
					message: error.message || `Failed to upload ${file.name}.`,
					hideDismiss: true,
					background: 'variant-filled-error'
				});
			}
		});

		try {
			const records = await Promise.all(uploadPromises);
			const { error: insertError } = await
				supabase.from('image').insert(records).select();
			if (insertError) {
				console.error(insertError);
			}

			console.log('Files uploaded successfully.');
			toastStore.trigger({
				message: 'Files uploaded successfully.',
				hideDismiss: true,
				background: 'variant-filled-success'
			});
		} catch (error) {
			toastStore.trigger({
				message: error.message || 'An error occurred during file upload.',
				hideDismiss: true,
				background: 'variant-filled-error'
			});
		} finally {
			isLoading = false;
			await invalidateAll()
		}
	}
</script>

<div class="my-8">
	{#if isLoading}
		<div class = "flex justify-center items-center min-h-32">
			<ProgressRadial value = {undefined} width = "w-12" />
		</div>
	{:else}
		<FileDropzone
			name = "files" bind:files = {files} on:change = {uploadFiles}
		/>
	{/if}
</div>
