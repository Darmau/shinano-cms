<script lang="ts">
	import { getToastStore, ProgressRadial } from '@skeletonlabs/skeleton';
	import { ImageProcess } from '$lib/types/imageProcess';
	import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
	import { onMount } from 'svelte';
	import exifr from 'exifr';
	import { v4 as uuidv4 } from 'uuid';
	import getDateFormat from '$lib/functions/dateFormat';
	import FileDropzone from '$components/FileDropzone.svelte';
	import getLocation from '$lib/functions/google-maps';

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

	// 上传文件
	async function uploadFile(event: Event) {
		event.preventDefault();
		const storageKey = uuidv4();
		const target = event.target as HTMLInputElement;
		const file = target.files[0];

		const command = new PutObjectCommand({
			Bucket: CONFIGS.S3_BUCKET,
			Key: storageKey,
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
			isLoading = true;
			await S3.send(command);
		} catch (error) {
			console.error(error);
			toastStore.trigger({
				message: 'Failed to upload file.',
				hideDismiss: true,
				background: 'variant-filled-error'
			});
			return false;
		}

		// extract EXIF info from image
		const EXIF = await exifr.parse(file);

		// 如果有GPS信息，请求Mapbox接口获取地理位置信息
		let location: string = null;
		if (EXIF?.latitude && EXIF?.longitude && CONFIGS.GOOGLE_MAPS) {
			location = await getLocation(EXIF.latitude, EXIF.longitude,
				CONFIGS.GOOGLE_MAPS);
		}

		// save data into supabase
		const { error: insertError } = await
			supabase.from('image').insert({
				folder: 'default',
				file_name: file.name,
				format: file.type.split('/')[1],
				alt: '',
				caption: '',
				date: getDateFormat(), // 当天日期 2024-12-16
				exif: {
					maker: EXIF?.Make,
					model: EXIF?.Model,
					exposure_time: EXIF?.ExposureTime,
					aperture: EXIF?.FNumber,
					iso: EXIF?.ISO,
					focal_length: EXIF?.FocalLength,
					lens_model: EXIF?.LensModel
				},
				gps: {
					latitude: EXIF?.latitude,
					longitude: EXIF?.longitude
				},
				location: location,
				taken_at: EXIF?.DateTimeOriginal,
				size: file.size,
				storage_key: storageKey
			}).select();
		if (insertError) {
			console.error(insertError);
			toastStore.trigger({
				message: 'Failed to insert image data.',
				hideDismiss: true,
				background: 'variant-filled-error'
			});
		}
		console.log('File uploaded successfully.');
		isLoading = false;
		toastStore.trigger({
			message: 'File uploaded successfully.',
			hideDismiss: true,
			background: 'variant-filled-success'
		});
	}
</script>

<div>
	{#if isLoading}
		<div class = "flex justify-center items-center min-h-32">
			<ProgressRadial value = {undefined} width = "w-12" />
		</div>
	{:else}
		<FileDropzone
			name = "files" bind:files = {files} on:change = {uploadFile}
		/>
	{/if}
</div>
