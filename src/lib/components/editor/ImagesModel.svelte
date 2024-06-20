<script lang="ts">
	import { onMount } from 'svelte';
	import { getToastStore } from '@skeletonlabs/skeleton';
	import { DeleteObjectsCommand, S3Client } from '@aws-sdk/client-s3';
	import Edit from '$assets/icons/edit.svelte';
	import EditImage from '$components/image/EditImage.svelte';
	import UploadFile from '$components/image/UploadFile.svelte';
	import { invalidateAll } from '$app/navigation';
	import { t } from '$lib/functions/i18n';

	const toastStore = getToastStore();

	export let data;
	let { supabase } = data;
	$: ({ supabase } = data);
	let S3: S3Client | undefined;
	let afterFetch = false;
	let selectedImages = new Map<number, any>();
	let selectedNumber: number = 0;

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
				message: 'Failed to fetch images.',
				background: 'variant-filled-error'
			});
		} else {
			data = { ...data, images, page }; // 重新赋值data对象
			afterFetch = true;
		}
	};


	// 获取下一页图片数据
	const nextPage = async () => {
		await getImages(data.page + 1);
	};

	// 获取上一页图片数据
	const prevPage = async () => {
		await getImages(data.page - 1);
	};

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
			selectedNumber = selectedNumber - 1;
		} else {
			selectedImages.set(image.id, {
				id: image.id,
				alt: image.alt,
				storage_key: image.storage_key,
				prefix: data.prefix
			}); // 如果不存在，则添加
			selectedNumber = selectedNumber + 1;
		}
		selectedImages = new Map(selectedImages); // 触发Svelte的响应式更新
	};

	// 提交选中的图片
	const submitSelection = () => {
		const selectedArray = Array.from(selectedImages.values());
		onSelect(selectedArray);
		closeModel();
	};

	let isEditing = false;
	let imageData = {};
	function closeEdit() {
		isEditing = false;
	}

	function openEdit(image) {
		isEditing = true;
		imageData = image;
	}

	// 负责处理删除图片
	async function deleteImages() {
		const imageIds = Array.from(selectedImages.keys());
		const { error: deleteError } = await
			supabase.from('image').delete().in('id', imageIds);
		// 查找data.images中id与deleteImageList的id一致的条目，提取storage_key
		const command = new DeleteObjectsCommand({
			Bucket: data.configs.S3_BUCKET,
			Delete: {
				Objects: data.images.filter((image) => imageIds.includes(image.id)).map((image) => {
					return { Key: image.storage_key };
				})
			}
		});
		const s3response = await S3.send(command);

		if (deleteError || s3response.Deleted.length <= 0) {
			console.error(deleteError);
			toastStore.trigger({
				message: 'Failed to delete images.',
				hideDismiss: true,
				background: 'variant-filled-error'
			});
		} else {
			// 根据id，
			selectedImages = new Map();
			selectedNumber = 0;
			await getImages(data.page);
			toastStore.trigger({
				message: `${deleteImageList.length} images deleted successfully.`,
				hideDismiss: true,
				background: 'variant-filled-success'
			});
		}
	}
</script>

<div class = "relative z-50">
	<div class = "fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity">
		{#if isEditing}
			<EditImage data={data} {closeEdit} imageData={imageData} />
		{/if}
		<div class =
					 "fixed inset-0 z-10 flex justify-center items-center w-screen overflow-y-auto">
			<div
				class =
					"w-full max-w-5xl h-5/6 bg-white overflow-scroll rounded-lg shadow-xl"
			>
				<div
					class="flex justify-between items-center sticky top-0 z-50 w-full bg-white p-4">
					<button
						on:click={deleteImages}
						class="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:w-auto"
					>
						{$t('delete')}
					</button>
					<div>{selectedNumber} Selected</div>
					<button
						on:click = {submitSelection}
						class = "relative inline-flex items-center rounded-md bg-cyan-600 px-3 py-2 text-sm font-semibold text-white hover:bg-cyan-700 focus-visible:outline-offset-0"
					>
						{$t('submit')}
					</button>
				</div>
				<div class = "@container p-4">
					<UploadFile on:submit={getImages} data = {data} s3 = {S3} />
					{#if afterFetch}
						<div
							class = "grid grid-cols-1 @xl:grid-cols-2 @4xl:grid-cols-4 @6xl:grid-cols-6 gap-4"
						>
							{#each data.images as image (image.id)}
								<div
									data-image-id = {image.id}
									class = "bg-white border rounded-xl overflow-clip hover:shadow-md transition-all duration-150 space-y-2"
								>
									<div class = "object-contain aspect-square relative">
										<div class = "absolute left-4 top-4 flex h-6 items-center">
											<input
												on:change = {() => handleCheckboxChange(image)}
												id = {image.id} aria-describedby = {image.alt}
												name = {image.storage_key}
												type = "checkbox"
												class =
													"h-5 w-5 rounded border-gray-300 text-cyan-600 focus:ring-cyan-600"
											>
											<label for = {image.id}>{image.alt}</label>
										</div>
										<button
											class = "absolute right-4 top-4 flex h-6 items-center"
											on:click = {() => openEdit(image)}
										>
											<Edit
												classList = "h-6 w-6 text-gray-400 hover:text-cyan-600"
											/>
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
					{/if}
				</div>
				<div
					class="sticky bottom-0 p-4 bg-white border-t flex justify-between">
					<button
						on:click={closeModel}
						class = "relative inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus-visible:outline-offset-0"
					>
						{$t('close')}
					</button>
					<div class="space-x-4">
						<button
							on:click = {prevPage}
							class = "relative inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus-visible:outline-offset-0"
						>
							{$t('previous-page')}
						</button>
						<button
							on:click = {nextPage}
							class = "relative inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus-visible:outline-offset-0"
						>
							{$t('next-page')}
						</button>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>

<style>
  .img-bg {
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' version='1.1' width='200' height='400'%3E%3Cdefs%3E%3Cpattern id='grid' width='20' height='20' patternUnits='userSpaceOnUse'%3E%3Crect fill='black' x='0' y='0' width='10' height='10' opacity='0.05'/%3E%3Crect fill='white' x='10' y='0' width='10' height='10'/%3E%3Crect fill='black' x='10' y='10' width='10' height='10' opacity='0.05'/%3E%3Crect fill='white' x='0' y='10' width='10' height='10'/%3E%3C/pattern%3E%3C/defs%3E%3Crect fill='url(%23grid)' x='0' y='0' width='100%25' height='100%25'/%3E%3C/svg%3E");
  }
</style>
