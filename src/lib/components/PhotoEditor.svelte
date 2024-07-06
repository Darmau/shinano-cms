<script lang="ts">
	import SimpleEditor from '$components/editor/SimpleEditor.svelte';
	import { t } from '$lib/functions/i18n';
	import AddIcon from '$assets/icons/plus.svelte';
	import { getToastStore } from '@skeletonlabs/skeleton';
	import { beforeNavigate, goto } from '$app/navigation';
	import getDateFormat from '$lib/functions/dateFormat';
	import { onMount } from 'svelte';
	import ImagesModel from '$components/editor/ImagesModel.svelte';
	import { flip } from 'svelte/animate';
	import { quintOut } from 'svelte/easing';

	export let data;
	let { supabase } = data;
	$: ({ supabase } = data);

	const toastStore = getToastStore();

	// 保存
	let photoContent = data.photoContent;
	let isChanged = false;
	let isSaved = false;

	let localTime = photoContent.published_at ?
		getDateFormat(photoContent.published_at, true) : null;

	// TODO: 保存方法不一样
	async function savePhoto() {
		// 存储photo信息

		// 删除photo_image表现有信息

		// bulk存入新的photo_image信息
	  return true;
	}

	// 选择图片
	let pictures = photoContent.photos || [] // 用于存储选择的图片数组，需要存入photo_image表
	function selectPictures(images) {
		pictures = images.map((image, index) => ({
			image: image,
			order: index
		}));
		isChanged = true;
	}

	let isModalOpen = false;
	function closeModel() {
		isModalOpen = false;
	}

	// 更改顺序
	let draggingIndex = null;

	function dragStart(event, index) {
		draggingIndex = index;
		event.dataTransfer.setData('text/plain', index);
	}

	function dragOver(event, index) {
		event.preventDefault();
		if (draggingIndex !== null && draggingIndex !== index) {
			const newPictures = [...pictures];
			const [removed] = newPictures.splice(draggingIndex, 1);
			newPictures.splice(index, 0, removed);
			pictures = newPictures;
			draggingIndex = index;
		}
	}

	function dragEnd() {
		draggingIndex = null;
		// 更新order值
		pictures = pictures.map((pic, index) => ({
			...pic,
			order: index + 1
		}));
	}

	// 切换发布摄影
	async function publishPhoto() {
		await savePhoto();
		if (photoContent.is_draft) {
			photoContent.is_draft = false;
			const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
			let date = localTime ? new Date(localTime) : new Date();
			let isoString = date.toLocaleString('en-US', { timeZone: timezone });
			photoContent.published_at = new Date(isoString).toISOString();
		} else {
			photoContent.is_draft = true;
			photoContent.published_at = null;
			localTime = null;
		}
		const { error } = await
			supabase.from('photo').update(photoContent).eq('id',
				photoContent.id).select();
		if (error) {
			console.error(error);
			toastStore.trigger({
				message: error.message,
				background: 'variant-filled-error'
			});
		} else {
			toastStore.trigger({
				message: 'Photo published successfully.',
				background: 'variant-filled-success'
			});
			isSaved = true;
			isChanged = false;
		}
	}

	// 删除摄影
	async function deletePhoto() {
		if (!isSaved) {
			toastStore.trigger({
				message: 'Photo not saved yet.',
				background: 'variant-filled-error'
			});
			return;
		}

		const { error } = await
			supabase.from('photo').delete().eq('id', photoContent.id).select();
		if (error) {
			console.error(error);
			toastStore.trigger({
				message: error.message,
				background: 'variant-filled-error'
			});
		} else {
			toastStore.trigger({
				message: 'Article deleted successfully.',
				background: 'variant-filled-success'
			});
			await goto('/admin/photo/1');
		}
	}

	// 找出当前摄影没有的语言
	const newLanguageVersions = () => {
		const currentLanguageId = data.currentLanguage.id;
		const otherVersions = data.otherVersions;
		const allLanguages = data.allLanguages;
		return allLanguages.filter(
			(language) =>
				!otherVersions.some((version) => version.lang.id === language.id) &&
				language.id !== currentLanguageId
		);
	}

	// 检查slug
	let isCheckingSlug = false;
	let slugExists = false;
	async function checkSlug(slug: string): Boolean {
		isCheckingSlug = true;

		const { error } = await fetch('/api/slug-check', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				type: 'photo',
				langId: data.currentLanguage.id,
				slug,
				contentId: photoContent.id || null
			})
		}).then(res => res.json());

		isCheckingSlug = false;
		if (error) {
			toastStore.trigger({
				message: error,
				background: 'variant-filled-error'
			});
			slugExists = true;
		} else {
			slugExists = false;
		}
	}

	// 生成slug
	async function generateSlug() {
		const title = photoContent.title;
		photoContent.slug = await fetch('/api/slug', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ title })
		}).then((res) => res.text());
		isChanged = true;
	}

	// 生成摘要
	async function generateAbstract() {
		const album = photoContent.content_text;
		photoContent.abstract = await fetch('/api/abstract', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ album })
		}).then((res) => res.text());
		isChanged = true;
	}

	// 监控正文变动
	let contentJSON = {};
	let contentHTML = '';
	let contentText = '';
	function handleContentUpdate(event) {
		const { json, html, text } = event.detail;
		contentJSON = json;
		contentHTML = html;
		contentText = text;
		photoContent.content_json = contentJSON;
		photoContent.content_html = contentHTML;
		photoContent.content_text = contentText;
		isChanged = true;
	}

	// 话题
	let topics = photoContent.topic;
	let topicInput = '';

	function handleKeydown(event) {
		if (event.key === 'Enter' && topicInput.trim() !== '') {
			topics = [...topics, topicInput.trim()];
			topicInput = '';
			isChanged = true;
		}
	}

	function removeTopic(index) {
		topics = topics.filter((_, i) => i !== index);
		isChanged = true;
	}

	// 防止误关页面
	function handleBeforeUnload(event) {
		if (!isSaved && isChanged) {
			event.preventDefault();
			event.returnValue = '';
		}
	}

	beforeNavigate((navigation) => {
		if (!isSaved && isChanged) {
			if (!confirm($t('leave-confirm'))) {
				navigation.preventDefault();
			}
		}
	})

	onMount(() => {
		isCheckingSlug = true;
		checkSlug(photoContent.slug);
		updateOrder();
	})
</script>

<svelte:window on:beforeunload={handleBeforeUnload} />

{#if isModalOpen}
	<ImagesModel {data} {closeModel} onSelect = {selectPictures} />
{/if}

<div class = "grid grid-cols-1 gap-6 3xl:grid-cols-4">
	<div class = "space-y-8 xl:col-span-3">
		<div class="break-all">{JSON.stringify(pictures)}</div>

    <!--标题-->
		<div>
			<label
				for = "title"
				class = "block text-sm font-medium leading-6 text-gray-900"
			>{$t('title')}</label>
			<div class = "mt-2">
				<input
					type = "text" name = "title" id = "title"
					bind:value = {photoContent.title}
					on:input = {() => {isChanged = true}}
					required
					class =
						"block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-cyan-600 sm:text-sm sm:leading-6"
					placeholder = "必须填写标题"
				>
			</div>
		</div>

		<!--slug-->
		<div>
			<label
				for = "slug"
				class = "block text-sm font-medium leading-6 text-gray-900"
			>Slug</label>
			<div class = "mt-2 flex gap-4">
				<input
					type = "text" name = "slug" id = "slug"
					bind:value = {photoContent.slug}
					on:input = {() => {isChanged = true; checkSlug(photoContent.slug)}}
					required
					class =
						"block font-mono w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-cyan-600 sm:text-sm sm:leading-6"
				>
				<button
					type="button"
					on:click = {generateSlug}
					class="w-fit break-keep rounded bg-cyan-50 px-3 py-1 text-sm font-semibold text-cyan-600 shadow-sm hover:bg-cyan-100"
				>{$t('generate')}</button>
			</div>
			{#if isCheckingSlug}
				<p class="mt-2 text-sm text-gray-600">Checking...</p>
			{:else}
				{#if slugExists}
					<p class="mt-2 text-sm text-red-600">{$t('slug-has-been-used')}</p>
				{:else}
					<p class="mt-2 text-sm text-green-600">{$t('slug-is-available')}</p>
				{/if}
			{/if}
		</div>

		<!--图片-->
		<div>
			<label
				for = "images"
				class = "block text-sm font-medium leading-6 text-gray-900"
			>图片</label>
			<button
				on:click = {()=>{isModalOpen =true}}
				class =
					"rounded bg-cyan-600 px-2 py-1 text-sm font-semibold text-white shadow-sm hover:bg-cyan-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-600"
			>
				{$t('select')}
			</button>
			<ol class="flex">
				{#each pictures as photo, index (photo.order)}
					<li
						draggable={true}
						on:dragstart={(event) => dragStart(event, index)}
						on:dragover={(event) => dragOver(event, index)}
						on:dragend={dragEnd}
						animate:flip={{ duration: 100 }}
					>
						<figure>
							<input
								type="checkbox"
								id = {`photo-${photo.order}`}
								name = {`photo-${photo.order}`}
								checked = {photoContent.cover === photo.image.id}
								on:change = {() => {isChanged = true}}
								on:click = {() => {photoContent.cover = photo.image.id}}
							/>
							<img
								src={`${data.prefix}/cdn-cgi/image/format=auto,width=480/${photo.image.storage_key}`}
								alt={photo.image.alt}
							/>
							{#if photo.image.caption}
								<figcaption>{photo.image.caption}</figcaption>
							{/if}
						</figure>
					</li>
				{/each}
			</ol>
		</div>

    <!--编辑器-->
		<SimpleEditor on:contentUpdate = {handleContentUpdate} {data} content =
			{data.photoContent.content_json} />
	</div>

	<aside class = "col-span-1 space-y-8">
    <!--发布时间-->
		<div>
			<label
				class = "text-sm font-medium leading-6 text-gray-900">{$t('publish-time')}</label>
			<input
				type="datetime-local"
				class="mt-2 w-full rounded-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-cyan-600 sm:text-sm sm:leading-6"
			/>
		</div>

    <!--语言-->
		<div>
			<h2
				class = "text-sm font-medium leading-6 text-gray-900"
			>{$t('language')}</h2>
			<ul class = "mt-2 flex gap-2">
				<li
					class = "inline-flex items-center gap-x-1.5 rounded-md bg-green-100 px-2 py-1 text-xs font-medium text-green-700"
				>
					<svg class="h-1.5 w-1.5 fill-green-500" viewBox="0 0 6 6" aria-hidden="true">
						<circle cx="3" cy="3" r="3" />
					</svg>
					{data.currentLanguage.locale}
				</li>
				{#each data.otherVersions as version}
					<li
						class =
							"inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-600/20 hover:bg-blue-200"
					>
						<a
							data-sveltekit-reload
							href= {`/admin/photo/edit/${version.id}`}
						>
							{version.lang.locale}
						</a>
					</li>
				{/each}
				{#if photoContent.id}
					{#each newLanguageVersions as newVersion}
						<li
							class =
								"inline-flex items-center rounded-md bg-gray-100 px-2 py-1 text-xs font-medium text-gray-600 hover:bg-gray-200"
						>
							<a
								data-sveltekit-reload
								href=
									{`/admin/photo/new?from=${photoContent.id}&lang=${newVersion.id}`}
							>
								+ {newVersion.locale}
							</a>
						</li>
					{/each}
				{/if}
			</ul>
		</div>

		<!--分类-->
		<div>
			<header class="flex justify-between">
				<label
					class = "text-sm font-medium leading-6 text-gray-900"
					for="category"
				>{$t('category')}</label>
				<a
					href="/admin/category/new"
					target="_blank"
				>
					<AddIcon classList = "h-4 w-4 text-gray-400 hover:text-cyan-600" />
				</a>
			</header>
			<select
				bind:value={photoContent.category}
				on:change = {() => {isChanged = true}}
				id="category"
				name="category"
				class="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-cyan-600 sm:text-sm sm:leading-6">
				{#each data.categories as category}
					<option value = {category.id}>{category.title}</option>
				{/each}
			</select>
		</div>

		<!--话题-->
		<div>
			<label
				class = "text-sm font-medium leading-6 text-gray-900">{$t('topic')}</label>
			<div class="relative mt-2">
				<div
					class="flex flex-wrap gap-1 w-full rounded-md border-0 p-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 sm:text-sm sm:leading-6">
					{#each topics as topic, index}
					<span class="inline-flex items-center gap-x-0.5 rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10">
						{topic}
						<button type="button" on:click={() => removeTopic(index)}
										class="group relative -mr-1 h-3.5 w-3.5 rounded-sm hover:bg-gray-500/20">
							<span class="sr-only">Remove</span>
							<svg viewBox="0 0 14 14" class="h-3.5 w-3.5 stroke-gray-600/50 group-hover:stroke-gray-600/75">
								<path d="M4 4l6 6m0-6l-6 6" />
							</svg>
							<span class="absolute -inset-1"></span>
						</button>
					</span>
					{/each}
					<input
						type="text"
						bind:value={topicInput}
						on:keydown={handleKeydown}
						class="peer border-none text-sm focus:ring-0 focus:outline-none bg-transparent"
					/>
				</div>
			</div>
		</div>

		<!--摘要-->
		<div>
			<div class = "flex justify-between">
				<label
					for = "abstract"
					class = "block text-sm font-medium leading-6 text-gray-900"
				>{$t('abstract')}</label>
				<button
					type="button"
					on:click = {generateAbstract}
					class = "rounded bg-cyan-600 px-2 py-1 text-sm font-semibold text-white shadow-sm hover:bg-cyan-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-600"
				>{$t('generate')}</button>
			</div>
			<div class = "mt-2">
				<textarea
					name = "abstract" id = "abstract" rows = "3"
					bind:value = {photoContent.abstract}
					placeholder = "使用AI为文章生成摘要"
					class =
						"block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-cyan-600 sm:text-sm sm:leading-6"
				/>
			</div>
		</div>

		<!--属性-->
		<div class = "flex gap-4 flex-wrap my-4">
			<div class = "flex h-6 items-center gap-2">
				<input
					bind:checked = {photoContent.is_top}
					on:change = {() => {isChanged = true}}
					id = "is_top" aria-describedby = "是否置顶文章"
					name = "is_top" type = "checkbox"
					class =
						"h-4 w-4 rounded border-gray-300 text-cyan-600 focus:ring-cyan-600"
				>
				<label
					for = "is_top"
					class = "font-medium text-gray-900 text-sm"
				>{$t('top')}</label>
			</div>
			<div class = "flex h-6 items-center gap-2">
				<input
					bind:checked = {photoContent.is_featured}
					on:change = {() => {isChanged = true}}
					id = "is_featured" aria-describedby = "是否设置为推荐文章"
					name = "is_featured" type = "checkbox"
					class =
						"h-4 w-4 rounded border-gray-300 text-cyan-600 focus:ring-cyan-600"
				>
				<label
					for = "is_featured"
					class = "font-medium text-gray-900 text-sm"
				>{$t('feature')}</label>
			</div>
		</div>

		<!--按钮-->
		<div class = "flex justify-end gap-4">
			<button
				on:click = {deletePhoto}
				class =
					"rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600 mr-auto"
			>{$t('delete')}</button>
			<button
				on:click = {savePhoto}
				disabled = {!isChanged}
				class =
					"rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed"
			>{$t('save')}</button>
			<button
				on:click = {publishPhoto}
				class =
					"rounded-md bg-cyan-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-cyan-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-600"
			>{photoContent.is_draft ? $t('publish') : $t('unpublish')}</button>
		</div>
	</aside>
</div>

<style>
  .image-container {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
  }
  .image-item {
    position: relative;
    cursor: move;
  }
  .image-item img {
    width: 150px;
    height: 150px;
    object-fit: cover;
  }
  .order {
    position: absolute;
    top: 5px;
    left: 5px;
    background-color: rgba(0, 0, 0, 0.5);
    color: white;
    padding: 2px 6px;
    border-radius: 3px;
  }
</style>
