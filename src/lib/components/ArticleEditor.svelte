<script lang="ts">
	import Tiptap from '$components/editor/Tiptap.svelte';
	import { t } from '$lib/functions/i18n';
	import ImagesModel from '$components/editor/ImagesModel.svelte';

	export let data;
	export let articleContent;
	export let articleVersions;

	// 接收图片选择器返回的图片信息并显示
	let isModalOpen = false;
	let coverImage = {};
	function selectCoverImage(images) {
		// 只接收第一张图片
		coverImage = {
			id: images[0].id,
			alt: images[0].alt,
			key: images[0].storage_key,
		}
		articleContent.cover = coverImage.id;
	}
	function closeModel() {
		isModalOpen = false;
	}
</script>

{#if isModalOpen}
	<ImagesModel {data} {closeModel} onSelect={selectCoverImage} />
{/if}

<div class = "grid grid-cols-1 gap-4 @xl:grid-cols-4">
	<div class = "space-y-6 @xl:col-span-3">
		<div>{JSON.stringify(articleContent)}</div>
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
		<Tiptap {data} content = {articleContent.content} />
	</div>

	<aside class = "@xl:col-span-1 space-y-4">
    <!--语言-->
		<div>
			<h2 class="text-sm font-medium leading-6 text-gray-900">{$t('language')}</h2>
			<ul class="mt-2">
				<li
					class="inline-flex items-center rounded-md bg-blue-100 px-2 py-1 text-xs font-medium text-blue-700">
					{articleContent.language.lang}
				</li>
				{#each articleContent.otherVersions as version}
					<li
						class="inline-flex items-center rounded-md bg-gray-100 px-2 py-1 text-xs font-medium text-gray-600">
						{version.lang}
					</li>
				{/each}
				<li
					class="inline-flex items-center rounded-md bg-gray-100 px-2 py-1 text-xs font-medium text-gray-600">
					+ {$t('add-language')}
				</li>
			</ul>
		</div>

		<!--封面-->
		<div>
			<h2 class="text-sm font-medium leading-6 text-gray-900">{$t('cover')}</h2>
			<button on:click={()=>{isModalOpen =true}}>select</button>
			<img src = {`${data.prefix}/cdn-cgi/image/format=auto,width=480/${coverImage.key}`} alt = {coverImage.alt} />
		</div>

		<!--摘要-->
		<div>
			<div class="flex justify-between">
				<label
					for = "abstract"
					class = "block text-sm font-medium leading-6 text-gray-900"
				>{$t('abstract')}</label>
				<button>{$t('generate')}</button>
			</div>
			<div class = "mt-2">
				<textarea
					name = "abstract" id = "abstract" rows = "3"
					bind:value = {articleContent.abstract}
					placeholder="使用AI为文章生成摘要"
					class =
						"block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-2 ring-inset ring-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-cyan-600 sm:text-sm sm:leading-6"
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
		<div class = "flex justify-between">
			<button class = "">{$t('delete')}</button>
			<button>{$t('save')}</button>
			<button>{$t('publish')}</button>
		</div>
	</aside>
</div>
