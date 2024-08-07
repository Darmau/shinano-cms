<script lang="ts">
	import { t } from '$lib/functions/i18n';
	import PhotoIcon from '$assets/icons/photo.svelte';
	import ImagesModel from '$components/editor/ImagesModel.svelte';
	import { getToastStore } from '@skeletonlabs/skeleton';
	import { invalidateAll } from '$app/navigation';

	export let data;
	let { supabase } = data;
	$: ({ supabase } = data);

	const toastStore = getToastStore();

	let categoryData = data.category;

	// 接收图片选择器返回的图片信息并显示
	let isModalOpen = false;
	let coverImage = categoryData.cover || {};

	function selectCoverImage(images) {
		// 只接收第一张图片
		coverImage = {
			id: images[0].id,
			alt: images[0].alt,
			storage_key: images[0].storage_key
		};
		categoryData.cover = coverImage.id;
	}

	function resetCoverImage() {
		coverImage = {};
		categoryData.cover = null;
	}

	function closeModel() {
		isModalOpen = false;
	}

	// 保存
	async function saveCategory() {
		categoryData.cover = coverImage.id || null;

		const { data: updateData, error: updateError } = await supabase
		.from('category')
		.update(categoryData)
		.eq('id', categoryData.id)
		.select();

		if (updateError) {
			console.error(updateError);
			toastStore.trigger({
				message: `保存分类失败。${updateError.message}`,
				hideDismiss: true,
				background: 'variant-filled-error'
			});
		} else {
			toastStore.trigger({
				message: '保存分类成功。',
				hideDismiss: true,
				background: 'variant-filled-success'
			});
			await invalidateAll();
		}
	}
</script>

{#if isModalOpen}
	<ImagesModel {data} {closeModel} onSelect = {selectCoverImage} />
{/if}

<div class = "max-w-96 mx-auto">
	<div class = "space-y-6">
		<div>
			<label
				for = "title"
				class = "block text-sm font-medium leading-6 text-gray-900"
			>{$t('title')}</label>
			<div class = "mt-2">
				<input
					bind:value = {categoryData.title}
					type = "text" name = "title" id = "title"
					class = "block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-cyan-600 sm:text-sm sm:leading-6"
				/>
			</div>
		</div>
		<div>
			<label
				for = "type"
				class = "block text-sm font-medium leading-6 text-gray-900"
			>{$t('type')}</label>
			<select
				bind:value = {categoryData.type}
				id = "type"
				name = "type"
				class = "mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-cyan-600 sm:text-sm sm:leading-6"
			>
				<option value = "article">Article</option>
				<option value = "photo">Photo</option>
				<option value = "video">Video</option>
			</select>
		</div>
		<div>
			<label
				for = "slug"
				class = "block text-sm font-medium leading-6 text-gray-900"
			>Slug</label>
			<div class = "mt-2">
				<input
					bind:value = {categoryData.slug}
					type = "text" name = "slug" id = "slug"
					class = "block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-cyan-600 sm:text-sm sm:leading-6"
				/>
			</div>
			<p class = "mt-2 text-sm text-gray-500">
				注意在同一个语言下和类型下不得重复</p>
		</div>
		<div>
			<label
				for = "description"
				class = "block text-sm font-medium leading-6 text-gray-900"
			>{$t('description')}</label>
			<div class = "mt-2">
				<textarea
					bind:value = {categoryData.description}
					rows = "3" name = "description" id = "description"
					class = "block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-cyan-600 sm:text-sm sm:leading-6"
				/>
			</div>
		</div>
		<div>
			<label
				for = "language"
				class = "block text-sm font-medium leading-6 text-gray-900"
			>{$t('language')}</label>
			<select
				bind:value = {categoryData.lang}
				id = "language"
				name = "language"
				class = "mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-cyan-600 sm:text-sm sm:leading-6"
			>
				{#each data.languages as language}
					<option value = {language.id}>{language.locale}</option>
				{/each}
			</select>
		</div>
		<div>
			<header class = "flex justify-end gap-4">
				<h2
					class = "text-sm font-medium leading-6 text-gray-900 grow"
				>{$t('cover')}</h2>
				<button
					on:click = {resetCoverImage}
					type = "button"
					disabled = {Object.keys(coverImage).length === 0}
					class = "rounded bg-red-600 px-2 py-1 text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed"
				>
					{$t('reset')}
				</button>
				<button
					type = "button"
					on:click = {()=>{isModalOpen =true}}
					class = "rounded bg-cyan-600 px-2 py-1 text-sm font-semibold text-white shadow-sm hover:bg-cyan-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-600"
				>
					{$t('select')}
				</button>
			</header>
			<div
				class =
					"mt-2 aspect-[4/3] bg-gray-100 w-full rounded-md flex justify-center items-center"
			>
				<input
					type = "hidden" name = "coverImageId"
					bind:value = {categoryData.cover}
				>
				{#if Object.keys(coverImage).length > 0}
					<img
						src =
							{`${data.prefix}/cdn-cgi/image/format=auto,width=480/${coverImage.storage_key}`}
						alt = {coverImage.alt}
						class = "img-bg h-full w-full object-contain"
					/>
				{:else}
					<PhotoIcon classList = "h-16 w-16 text-gray-400 m-auto" />
				{/if}
			</div>
		</div>
		<button
			type = "button"
			on:click = {saveCategory}
			class = "flex w-full justify-center rounded-md bg-cyan-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-cyan-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-600"
		>
			保存
		</button>
	</div>
</div>
