<script lang="ts">
	import { fileSize } from '$lib/functions/fileSize';
	import { t } from '$lib/functions/i18n';
	import { localTime } from '$lib/functions/localTime';
	import shutterSpeed from '$lib/functions/shutterSpeed';
	import { getToastStore } from '@skeletonlabs/skeleton';
	import { invalidateAll } from '$app/navigation';
	import EditImage from '$components/image/EditImage.svelte';
	import Edit from '$assets/icons/edit.svelte';

	export let data;
	let { supabase } = data;
	$: ({ supabase } = data);

	const toastStore = getToastStore();

	let deleteImageList = []; // ids of images to be deleted
	let selectedImages = `${deleteImageList.length} ${$t('selected')}`;
	let deletable = true;

	function updateSelectedImages() {
		selectedImages = `${deleteImageList.length} ${$t('selected')}`;
		deletable = deleteImageList.length <= 0;
	}

	// 根据id，删除选中图片
	async function deleteImages() {
		try {
			deletable = true;
			// 从data.images中提取要删除的图片的storage_keys
			const keysToDelete = data.images
			.filter(image => deleteImageList.includes(image.id))
			.map(image => image.storage_key);

			// 并行执行数据库删除和存储删除操作
			await Promise.all([
				supabase.from('image').delete().in('id', deleteImageList),

				fetch('/api/image', {
					method: 'DELETE',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ keys: keysToDelete })
				})
			]);

			const deletedCount = deleteImageList.length;
			deleteImageList = [];
			updateSelectedImages();
			await invalidateAll();

			toastStore.trigger({
				message: `成功删除${deletedCount}张图片。`,
				hideDismiss: true,
				background: 'variant-filled-success'
			});
		} catch (error) {
			console.error('删除图片时出错:', error);
			toastStore.trigger({
				message: '删除图片失败。',
				hideDismiss: true,
				background: 'variant-filled-error'
			});
		}
	}


	// 打开图片编辑窗口
	let isEditing = false;
	let imageData = {};

	function closeEdit() {
		isEditing = false;
	}

	function openEdit(image) {
		isEditing = true;
		imageData = image;
	}

	// 选中所有图片，并且添加到selectedImages数组中
	function switchSelectAllImages() {
		const checkboxes = document.querySelectorAll('input[type="checkbox"]');
		if (deleteImageList.length === data.images.length) {
			checkboxes.forEach(checkbox => {
				checkbox.checked = false;
			});
			deleteImageList = [];
		} else {
			deleteImageList = data.images.map(image => image.id);
			checkboxes.forEach(checkbox => {
				checkbox.checked = true;
			});
		}
		updateSelectedImages();
	}
</script>

{#if isEditing}
	<EditImage data = {data} {closeEdit} imageData = {imageData} />
{/if}

<div class = "flex justify-between items-center my-8">
	<p>{selectedImages}</p>
	<button on:click = {switchSelectAllImages}>Select All</button>
	<div class = "mt-4 flex md:ml-4 md:mt-0">
		<button
			on:click = {deleteImages}
			disabled = {deletable} type = "button"
			class =
				"inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto disabled:bg-gray-300"
		>Delete
		</button>
	</div>
</div>
<div
	class =
		"grid grid-cols-1 @xl:grid-cols-2 @4xl:grid-cols-4 @6xl:grid-cols-6 gap-4"
>
	{#each data.images as image (image.id)}
		<div
			data-image-id = {image.id}
			class = "bg-white border rounded-xl overflow-clip hover:shadow-md transition-all duration-150 space-y-2"
		>
			<div class = "object-contain aspect-square relative">
				<div class = "absolute left-4 top-4 flex h-6 items-center">
					<input
						on:change = {() => {
							if (deleteImageList.includes(image.id)) {
								deleteImageList = deleteImageList.filter((id) => id !== image.id);
								updateSelectedImages()
							} else {
								deleteImageList.push(image.id);
								updateSelectedImages()
							}
						}}
						id = {image.id} aria-describedby = {image.alt}
						name = {image.storage_key}
						type = "checkbox"
						class =
							"h-5 w-5 rounded border-gray-300 text-cyan-600 focus:ring-cyan-600"
					>
				</div>
				<button
					class = "absolute right-4 top-4 flex h-6 items-center"
					on:click = {() => openEdit(image)}
				>
					<Edit classList = "h-6 w-6 text-gray-400 hover:text-cyan-600" />
				</button>
				<img
					src = {`${data.prefix}/cdn-cgi/image/format=auto,width=480/${data.prefix}/${image.storage_key}`}
					class = "img-bg h-full w-full object-contain"
					alt = {image.alt}
				/>
			</div>
			<div class = "p-4 space-y-4 break-words">
				<h3 class = "font-medium">{image.file_name}</h3>
				<small>
					<span>{image.width}</span>
					×
					<span>{image.height}</span>
					|
					<span>{fileSize(image.size)}</span>
				</small>
				<div class = "space-y-1">
					<h4 class = "font-medium text-sm mb-1">alt</h4>
					{#if image.alt}
						<p class = "text-gray-700 text-sm">{image.alt}</p>
					{:else}
						<p class = "text-gray-400 text-sm">No alt</p>
					{/if}
				</div>
				<div class = "space-y-1">
					<h4 class = "font-medium text-sm mb-1">{$t('image-caption')}</h4>
					{#if image.caption}
						<p class = "text-gray-700 text-sm">{image.caption}</p>
					{:else}
						<p class = "text-gray-400 text-sm">No description</p>
					{/if}
				</div>
				{#if image.taken_at}
					<div>
						<h4 class = "font-medium text-sm mb-1">{$t('shooting-time')}</h4>
						<p class = "text-sm text-gray-700">{localTime(image.taken_at)}</p>
					</div>
				{/if}
				{#if image.location}
					<div>
						<h4 class = "font-medium text-sm mb-1">拍摄地点</h4>
						<p class = "text-sm text-gray-700">{image.location}</p>
					</div>
				{/if}
				{#if image.exif}
					<ul class = "space-y-1">
						<li class = "flex justify-between gap-4">
							<h4 class = "font-medium text-sm mb-1 shrink-0">{$t('brand')}</h4>
							<p
								class = "text-sm text-gray-700 text-right"
							>{image.exif.Make}</p>
						</li>
						<li class = "flex justify-between gap-4">
							<h4 class = "font-medium text-sm mb-1 shrink-0">{$t('model')}</h4>
							<p
								class = "text-sm text-gray-700 text-right"
							>{image.exif.Model}</p>
						</li>
						<li class = "flex justify-between gap-4">
							<h4 class = "font-medium text-sm mb-1 shrink-0">{$t('lens')}</h4>
							<p
								class = "text-sm text-gray-700 text-right"
							>{image.exif.LensModel}</p>
						</li>
						<li class = "flex justify-between gap-4">
							<h4
								class = "font-medium text-sm mb-1 shrink-0"
							>{$t('aperture')}</h4>
							<p
								class = "text-sm text-gray-700 text-right"
							>{image.exif.FNumber}</p>
						</li>
						<li class = "flex justify-between gap-4">
							<h4
								class = "font-medium text-sm mb-1 shrink-0"
							>{$t('shutter-speed')}</h4>
							<p
								class = "text-sm text-gray-700 text-right"
							>{shutterSpeed(image.exif.ExposureTime)}</p>
						</li>
						<li class = "flex justify-between gap-4">
							<h4 class = "font-medium text-sm mb-1 shrink-0">{$t('iso')}</h4>
							<p class = "text-sm text-gray-700 text-right">{image.exif.ISO}</p>
						</li>
					</ul>
				{/if}
			</div>
		</div>
	{/each}
</div>

<style>
  .img-bg {
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' version='1.1' width='200' height='400'%3E%3Cdefs%3E%3Cpattern id='grid' width='20' height='20' patternUnits='userSpaceOnUse'%3E%3Crect fill='black' x='0' y='0' width='10' height='10' opacity='0.05'/%3E%3Crect fill='white' x='10' y='0' width='10' height='10'/%3E%3Crect fill='black' x='10' y='10' width='10' height='10' opacity='0.05'/%3E%3Crect fill='white' x='0' y='10' width='10' height='10'/%3E%3C/pattern%3E%3C/defs%3E%3Crect fill='url(%23grid)' x='0' y='0' width='100%25' height='100%25'/%3E%3C/svg%3E");
  }
</style>
