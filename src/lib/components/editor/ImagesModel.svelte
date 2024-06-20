<script lang="ts">
	import { onMount } from 'svelte';
	import { getToastStore } from '@skeletonlabs/skeleton';
	import { S3Client } from '@aws-sdk/client-s3';
	import Edit from '$assets/icons/edit.svelte';
	const toastStore = getToastStore();

	export let data;
	let { supabase } = data;
	$: ({ supabase } = data);
	let S3: S3Client | undefined;
	let afterFetch = false;
	let selectedImages = new Map<number, any>();

	export let closeModel: () => void;
	export let onSelect;

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

	// 处理复选框状态改变
	const handleCheckboxChange = (image) => {
		if (selectedImages.has(image.id)) {
			selectedImages.delete(image.id); // 如果已存在，则删除
			console.log(selectedImages)
		} else {
			selectedImages.set(image.id, {
				id: image.id,
				alt: image.alt,
				storage_key: image.storage_key,
				prefix: data.prefix
			}); // 如果不存在，则添加
			console.log(selectedImages)
		}
		selectedImages = new Map(selectedImages); // 触发Svelte的响应式更新
	}

	// 提交选中的图片
	const submitSelection = () => {
		const selectedArray = Array.from(selectedImages.values());
		onSelect(selectedArray);
		closeModel();
	}
</script>

	<div class="@container">
		{#if afterFetch}
			<div class = "grid grid-cols-1 @xl:grid-cols-2 @4xl:grid-cols-4 @6xl:grid-cols-6 gap-4">
				<button
					on:click={submitSelection}
					class="relative inline-flex items-center rounded-md bg-cyan-600 px-3 py-2 text-sm font-semibold text-white hover:bg-cyan-700 focus-visible:outline-offset-0"
				>
					Submit Selection
				</button>
				{#each data.images as image (image.id)}
					<div
						data-image-id = {image.id}
						class = "bg-white border rounded-xl overflow-clip hover:shadow-md transition-all duration-150 space-y-2"
					>
						<div class = "object-contain aspect-square relative">
							<div class = "absolute left-4 top-4 flex h-6 items-center">
								<input
									on:change={() => handleCheckboxChange(image)}
									id = {image.id} aria-describedby = {image.alt}
									name = {image.storage_key}
									type = "checkbox"
									class =
										"h-5 w-5 rounded border-gray-300 text-cyan-600 focus:ring-cyan-600"
								>
								<label for={image.id}>{image.alt}</label>
							</div>
							<button
								class = "absolute right-4 top-4 flex h-6 items-center"
								on:click = {() => openEdit(image)}
							>
								<Edit classList="h-6 w-6 text-gray-400 hover:text-cyan-600" />
							</button>
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
