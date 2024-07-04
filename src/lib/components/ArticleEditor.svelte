<script lang="ts">
	import Tiptap from '$components/editor/Tiptap.svelte';
	import { t } from '$lib/functions/i18n';
	import ImagesModel from '$components/editor/ImagesModel.svelte';
	import PhotoIcon from '$assets/icons/photo.svelte';
	import AddIcon from '$assets/icons/plus.svelte';
	import { getToastStore } from '@skeletonlabs/skeleton';
	import { goto } from '$app/navigation';
	import getDateFormat from '$lib/functions/dateFormat.js';
	import { onMount } from 'svelte';

	export let data;
	export let isSaved: boolean = false;
	let { supabase } = data;
	$: ({ supabase } = data);

	const toastStore = getToastStore();

	// 找出当前文章没有的语言
	function generateNewLanguageVersions() {
		const currentLanguageId = data.currentLanguage.id;
		const otherVersions = data.otherVersions;
		const allLanguages = data.allLanguages;
		return allLanguages.filter(
			(language) =>
				!otherVersions.some((version) => version.lang.id === language.id) &&
				language.id !== currentLanguageId
		);
	}

	const newLanguageVersions = generateNewLanguageVersions();

	// 保存函数
	let isChanged = false;
	let articleContent = data.articleContent;
	async function saveArticle() {
		if (!isChanged) return;

		articleContent.updated_at = new Date().toISOString();
		articleContent.cover = coverImage.id;
		articleContent.published_at = localTime ? new Date(localTime).toISOString() : null;

		// 存储到supabase article表。对于已保存的文章，只更新内容
		if (isSaved === true) {
			console.log('It is an existing article.')
			const { error } = await
				supabase.from('article').update(articleContent).eq('id',
					articleContent.id).select();
			if (error) {
				console.error(error);
				toastStore.trigger({
					message: 'Failed to save article.',
					background: 'variant-filled-error'
				});
			} else {
				toastStore.trigger({
					message: 'Article saved successfully.',
					background: 'variant-filled-success'
				});
				isSaved = true;
				isChanged = false;
			}
		} else {
			const { data, error: saveError } = await
				supabase.from('article').insert(articleContent).select();

			if (saveError) {
				console.error(saveError);
				toastStore.trigger({
					message: 'Failed to save article.',
					background: 'variant-filled-error'
				});
				isChanged = false;
			} else {
				toastStore.trigger({
					message: 'Article saved successfully.',
					background: 'variant-filled-success'
				});
				// 跳转到/admin/article/edit/:id
				isSaved = true;
				await goto(`/admin/article/edit/${data[0].id}`)
			}
		}
	}

	let contentJSON = {};
	let contentHTML = '';
	let contentText = '';

	// 监控正文变动
	function handleContentUpdate(event) {
		const { json, html, text } = event.detail;
		contentJSON = json;
		contentHTML = html;
		contentText = text;
		articleContent.content_json = contentJSON;
		articleContent.content_html = contentHTML;
		articleContent.content_text = contentText;
		isChanged = true;
	}

	// 接收图片选择器返回的图片信息并显示
	let isModalOpen = false;
	let coverImage = articleContent.cover || {};

	function selectCoverImage(images) {
		// 只接收第一张图片
		coverImage = {
			id: images[0].id,
			alt: images[0].alt,
			storage_key: images[0].storage_key
		};
		articleContent.cover = coverImage.id;
		isChanged = true;
	}

	function resetCoverImage() {
		coverImage = {};
		articleContent.cover = null;
		isChanged = true;
	}

	function closeModel() {
		isModalOpen = false;
	}

	// 切换发布文章
	let localTime = articleContent.published_at ?
		getDateFormat(articleContent.published_at, true) : null;
	async function publishArticle() {
		articleContent.cover = coverImage.id || null;
		if (articleContent.is_draft) {
			articleContent.is_draft = false;
			const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
			let date = localTime ? new Date(localTime) : new Date();
			let isoString = date.toLocaleString('en-US', { timeZone: timezone });
			articleContent.published_at = new Date(isoString).toISOString();
		} else {
			articleContent.is_draft = true;
			articleContent.published_at = null;
			localTime = null;
		}
		const { error } = await
			supabase.from('article').update(articleContent).eq('id',
				articleContent.id).select();
		if (error) {
			console.error(error);
			toastStore.trigger({
				message: 'Failed to publish article.',
				background: 'variant-filled-error'
			});
		} else {
			toastStore.trigger({
				message: 'Article published successfully.',
				background: 'variant-filled-success'
			});
			isSaved = true;
			isChanged = false;
		}
	}

	// 删除文章
	async function deleteArticle() {
		if (!isSaved) {
			toastStore.trigger({
				message: 'Article not saved yet.',
				background: 'variant-filled-error'
			});
			return;
		}

		const { error } = await
			supabase.from('article').delete().eq('id', articleContent.id).select();
		if (error) {
			console.error(error);
			toastStore.trigger({
				message: 'Failed to delete article.',
				background: 'variant-filled-error'
			});
		} else {
			toastStore.trigger({
				message: 'Article deleted successfully.',
				background: 'variant-filled-success'
			});
			await goto('/admin/article/1');
		}
	}

	// 检测当前slug在相同语言下是否已存在
	let slugExists = false;
	let isCheckingSlug = false;
	async function checkSlug(slug: string): Boolean {
		isCheckingSlug = true;

		const { error } = await fetch('/api/slug-check', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				type: 'article',
				langId: data.currentLanguage.id,
				slug,
				contentId: articleContent.id || null
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
		const title = articleContent.title;
		articleContent.slug = await fetch('/api/slug', {
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
		const article = articleContent.content_text;
		articleContent.abstract = await fetch('/api/abstract', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ article })
		}).then((res) => res.text());
		isChanged = true;
	}

	onMount(() => {
		isCheckingSlug = true;
		checkSlug(articleContent.slug);
	})
</script>

{#if isModalOpen}
	<ImagesModel {data} {closeModel} onSelect = {selectCoverImage} />
{/if}

<div class = "grid grid-cols-1 gap-6 3xl:grid-cols-4">
	<div class = "space-y-8 xl:col-span-3">
		<!--title-->
		<div>
			<label
				for = "title"
				class = "block text-sm font-medium leading-6 text-gray-900"
			>{$t('title')}</label>
			<div class = "mt-2">
				<input
					type = "text" name = "title" id = "title"
					bind:value = {articleContent.title}
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
					bind:value = {articleContent.slug}
					on:input = {() => {isChanged = true; checkSlug(articleContent.slug)}}
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
					<p class="mt-2 text-sm text-cyan-600">{$t('slug-is-available')}</p>
				{/if}
			{/if}
		</div>

		<!--subtitle-->
		<div>
			<label
				for = "subtitle"
				class = "block text-sm font-medium leading-6 text-gray-900"
			>{$t('subtitle')}</label>
			<div class = "mt-2">
				<input
					type = "text" name = "subtitle" id = "subtitle"
					bind:value = {articleContent.subtitle}
					on:input = {() => {isChanged = true}}
					required
					class =
						"block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-cyan-600 sm:text-sm sm:leading-6"
				>
			</div>
		</div>

		<!--Content-->
		<Tiptap
			on:contentUpdate = {handleContentUpdate} {data} content =
			{articleContent.content_json}
		/>
	</div>

	<aside class = "col-span-1 space-y-8">
		<!--发布时间-->
		<div>
			<label class = "text-sm font-medium leading-6 text-gray-900">发布时间</label>
			<input
				type="datetime-local"
				class="mt-2 w-full rounded-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-cyan-600 sm:text-sm sm:leading-6"
				bind:value={localTime}
				on:change = {() => {isChanged = true}}
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
							href= {`/admin/article/edit/${version.id}`}
						>
							{version.lang.locale}
						</a>
					</li>
				{/each}
				{#if articleContent.id}
					{#each newLanguageVersions as newVersion}
						<li
							class =
								"inline-flex items-center rounded-md bg-gray-100 px-2 py-1 text-xs font-medium text-gray-600 hover:bg-gray-200"
						>
							<a
								data-sveltekit-reload
								href=
									{`/admin/article/new?from=${articleContent.id}&lang=${newVersion.id}`}
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
				bind:value={articleContent.category}
				on:change = {() => {isChanged = true}}
				id="category"
				name="category"
				class="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-cyan-600 sm:text-sm sm:leading-6">
				{#each data.categories as category}
					<option value = {category.id}>{category.title}</option>
				{/each}
			</select>
		</div>

		<!--封面-->
		<div>
			<header class = "flex justify-end gap-4">
				<h2
					class = "text-sm font-medium leading-6 text-gray-900 grow"
				>{$t('cover')}</h2>
				<button
					on:click = {resetCoverImage}
					disabled = {Object.keys(coverImage).length === 0}
					class =
						"rounded bg-red-600 px-2 py-1 text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed"
				>
					{$t('reset')}
				</button>
				<button
					on:click = {()=>{isModalOpen =true}}
					class =
						"rounded bg-cyan-600 px-2 py-1 text-sm font-semibold text-white shadow-sm hover:bg-cyan-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-600"
				>
					{$t('select')}
				</button>
			</header>
			<div
				class =
					"mt-2 aspect-[4/3] bg-gray-100 w-full rounded-md flex justify-center items-center"
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
					bind:value = {articleContent.abstract}
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
					bind:checked = {articleContent.is_top}
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
					bind:checked = {articleContent.is_featured}
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
			<div class = "flex h-6 items-center gap-2">
				<input
					bind:checked = {articleContent.is_premium}
					on:change = {() => {isChanged = true}}
					id = "is_premium" aria-describedby = "是否登录后可见"
					name = "is_premium" type = "checkbox"
					class =
						"h-4 w-4 rounded border-gray-300 text-cyan-600 focus:ring-cyan-600"
				>
				<label
					for = "is_premium"
					class = "font-medium text-gray-900 text-sm"
				>{$t('logged-in-only')}</label>
			</div>
		</div>

		<!--按钮-->
		<div class = "flex justify-end gap-4">
			<button
				on:click = {deleteArticle}
				class =
					"rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600 mr-auto"
			>{$t('delete')}</button>
			<button
				on:click = {saveArticle}
				disabled = {!isChanged}
				class =
					"rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed"
			>{$t('save')}</button>
			<button
				on:click = {publishArticle}
				class =
					"rounded-md bg-cyan-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-cyan-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-600"
			>{articleContent.is_draft ? $t('publish') : $t('unpublish')}</button>
		</div>
	</aside>
</div>

<style>
  .img-bg {
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' version='1.1' width='200' height='400'%3E%3Cdefs%3E%3Cpattern id='grid' width='20' height='20' patternUnits='userSpaceOnUse'%3E%3Crect fill='black' x='0' y='0' width='10' height='10' opacity='0.05'/%3E%3Crect fill='white' x='10' y='0' width='10' height='10'/%3E%3Crect fill='black' x='10' y='10' width='10' height='10' opacity='0.05'/%3E%3Crect fill='white' x='0' y='10' width='10' height='10'/%3E%3C/pattern%3E%3C/defs%3E%3Crect fill='url(%23grid)' x='0' y='0' width='100%25' height='100%25'/%3E%3C/svg%3E");
  }
</style>
