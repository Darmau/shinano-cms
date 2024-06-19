<script lang="ts">
	import { onMount } from 'svelte';
	import { getToastStore } from '@skeletonlabs/skeleton';
	import { S3Client } from '@aws-sdk/client-s3';

	const toastStore = getToastStore();

	export let data;
	let { supabase } = data;
	$: ({ supabase } = data);
	let S3: S3Client | undefined;
	let afterFetch = false;

	export let isOpen = false;
	export let onSelect;

	function handleSelect(id, alt, storage_key, prefix) {
		onSelect(id, alt, storage_key, prefix);
		isOpen = false;
	}

	// 获取图片信息
	const getImages = async (page: number = 1) => {
		const { data: images, error: fetchError } = await
			supabase.from('image').select().range((page - 1) * 16,
				page * 16 - 1).order('id', { ascending: false });
		if (fetchError) {
			console.error(fetchError);
			toastStore.trigger({
				message: "Failed to fetch images.",
				background: 'variant-filled-error'
			});
		} else {
			data = { ...data, images, page }; // 重新赋值data对象
			afterFetch = true;
		}
	}


	// 获取下一页图片数据
	const nextPage = async () => {
		await getImages(data.page + 1);
	}

	// 获取上一页图片数据
	const prevPage = async () => {
		await getImages(data.page - 1);
	}

	onMount(async () => {
		S3 = new S3Client({
			region: data.configs.S3_REGION,
			endpoint: data.configs.S3_ENDPOINT,
			credentials: {
				accessKeyId: data.configs.S3_ACCESS_ID,
				secretAccessKey: data.configs.S3_SECRET_KEY
			}
		});
		await getImages();
	});

</script>

<div>
	{#if afterFetch}
		<div>
			{#each data.images as image, index}
				<div
					on:click={() => handleSelect(image.id, image.alt, image.storage_key,
					data.prefix)}
					class="relative inline-block w-24 h-24 m-2 bg-gray-200 rounded-md cursor-pointer"
				>
					<img
						src={`${data.prefix}/cdn-cgi/image/format=auto,width=480/${data.prefix}/${image.storage_key}`}
						alt={image.file_name}
						class="w-full h-full object-cover rounded-md"
					/>
				</div>
			{/each}
		</div>
		<div>
			<button
				on:click={prevPage}
				class="relative inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus-visible:outline-offset-0"
			>
				Previous Page
			</button>
			<button
				on:click={nextPage}
				class="relative inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus-visible:outline-offset-0"
			>
				Next Page
			</button>
		</div>
	{/if}
</div>
