<script lang="ts">
	import Tiptap from '$components/editor/Tiptap.svelte';
	import { t } from '$lib/functions/i18n';
	import ImagesModel from '$components/editor/ImagesModel.svelte';
	import PhotoIcon from '$assets/icons/photo.svelte';
	import AddIcon from '$assets/icons/plus.svelte';
	import { getToastStore } from '@skeletonlabs/skeleton';
	import { goto } from '$app/navigation';

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
			const { data, error } = await
				supabase.from('article').insert(articleContent).select();

			if (error) {
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

	// 发布文章
	async function publishArticle() {
		articleContent.is_draft = false;
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
			await goto('/admin/article');
		}
	}
</script>

{#if isModalOpen}
	<ImagesModel {data} {closeModel} onSelect = {selectCoverImage} />
{/if}

<div class = "grid grid-cols-1 gap-4 3xl:grid-cols-4">
	<div class = "space-y-6 xl:col-span-3">
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
					required
					class =
						"block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-2 ring-inset ring-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-cyan-600 sm:text-sm sm:leading-6"
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
			<div class = "mt-2">
				<input
					type = "text" name = "slug" id = "slug"
					bind:value = {articleContent.slug}
					required
					class =
						"block font-mono w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-2 ring-inset ring-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-cyan-600 sm:text-sm sm:leading-6"
				>
			</div>
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
					required
					class =
						"block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-2 ring-inset ring-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-cyan-600 sm:text-sm sm:leading-6"
				>
			</div>
		</div>

		<!--Content-->
		<Tiptap
			on:contentUpdate = {handleContentUpdate} {data} content =
			{articleContent.content_json}
		/>
	</div>

	<aside class = "col-span-1 space-y-6">
		<!--语言-->
		<div>
			<h2
				class = "text-sm font-medium leading-6 text-gray-900"
			>{$t('language')}</h2>
			<ul class = "mt-2">
				<li
					class = "inline-flex items-center rounded-md bg-blue-100 px-2 py-1 text-xs font-medium text-blue-700"
				>
					{data.currentLanguage.locale}
				</li>
				{#each data.otherVersions as version}
					<li
						class = "inline-flex items-center rounded-md bg-gray-100 px-2 py-1 text-xs font-medium text-gray-600"
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
							class = "inline-flex items-center rounded-md bg-gray-100 px-2 py-1 text-xs font-medium text-gray-600"
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
				<button>
					<AddIcon classList = "h-4 w-4 text-gray-400 hover:text-cyan-600" />
				</button>
			</header>
			<select
				bind:value={articleContent.category}
				id="category"
				name="category"
				class="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6">
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
					class = "rounded bg-red-600 px-2 py-1 text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed"
				>
					{$t('reset')}
				</button>
				<button
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
					class = "rounded bg-cyan-600 px-2 py-1 text-sm font-semibold text-white shadow-sm hover:bg-cyan-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-600"
				>{$t('generate')}</button>
			</div>
			<div class = "mt-2">
				<textarea
					name = "abstract" id = "abstract" rows = "3"
					bind:value = {articleContent.abstract}
					placeholder = "使用AI为文章生成摘要"
					class =
						"block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-2 ring-inset ring-gray-900 focus:ring-2 focus:ring-inset focus:ring-cyan-600 sm:text-sm sm:leading-6"
				/>
			</div>
		</div>

		<!--属性-->
		<div class = "flex gap-4 flex-wrap my-4">
			<div class = "flex h-6 items-center gap-2">
				<input
					bind:checked = {articleContent.is_top}
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
					bind:checked = {articleContent.is_feature}
					id = "is_feature" aria-describedby = "是否设置为推荐文章"
					name = "is_feature" type = "checkbox"
					class =
						"h-4 w-4 rounded border-gray-300 text-cyan-600 focus:ring-cyan-600"
				>
				<label
					for = "is_feature"
					class = "font-medium text-gray-900 text-sm"
				>{$t('feature')}</label>
			</div>
			<div class = "flex h-6 items-center gap-2">
				<input
					bind:checked = {articleContent.is_premium}
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
			>{$t('publish')}</button>
		</div>
	</aside>
</div>

<style>
  .img-bg {
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' version='1.1' width='200' height='400'%3E%3Cdefs%3E%3Cpattern id='grid' width='20' height='20' patternUnits='userSpaceOnUse'%3E%3Crect fill='black' x='0' y='0' width='10' height='10' opacity='0.05'/%3E%3Crect fill='white' x='10' y='0' width='10' height='10'/%3E%3Crect fill='black' x='10' y='10' width='10' height='10' opacity='0.05'/%3E%3Crect fill='white' x='0' y='10' width='10' height='10'/%3E%3C/pattern%3E%3C/defs%3E%3Crect fill='url(%23grid)' x='0' y='0' width='100%25' height='100%25'/%3E%3C/svg%3E");
  }
</style>
