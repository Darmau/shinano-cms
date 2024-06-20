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

<div class="@container">
	{#if afterFetch}
		<div class = "grid grid-cols-1 @xl:grid-cols-2 @4xl:grid-cols-4 @6xl:grid-cols-6 gap-4">
			{#each data.images as image (image.id)}
				<div
					on:click={() => handleSelect(image.id, image.alt, image.storage_key,
					data.prefix)}
					data-image-id = {image.id}
					class = "bg-white border rounded-xl overflow-clip hover:shadow-md transition-all duration-150 space-y-2"
				>
					<div>
						<img
							src = {`${data.prefix}/cdn-cgi/image/format=auto,width=480/${data.prefix}/${image.storage_key}`}
							class = "img-bg h-full w-full object-contain"
							alt = {image.alt}
						/>
					</div>
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

<style>
  .img-bg {
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' version='1.1' width='200' height='400'%3E%3Cdefs%3E%3Cpattern id='grid' width='20' height='20' patternUnits='userSpaceOnUse'%3E%3Crect fill='black' x='0' y='0' width='10' height='10' opacity='0.05'/%3E%3Crect fill='white' x='10' y='0' width='10' height='10'/%3E%3Crect fill='black' x='10' y='10' width='10' height='10' opacity='0.05'/%3E%3Crect fill='white' x='0' y='10' width='10' height='10'/%3E%3C/pattern%3E%3C/defs%3E%3Crect fill='url(%23grid)' x='0' y='0' width='100%25' height='100%25'/%3E%3C/svg%3E");
  }
</style>
