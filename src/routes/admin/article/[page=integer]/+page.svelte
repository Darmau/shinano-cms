<script lang="ts">
	import Pagination from '$components/Pagination.svelte';
	import { t } from '$lib/functions/i18n';
	import PageTitle from '$components/PageTitle.svelte';
	import { invalidateAll } from '$app/navigation';
	import { getToastStore } from '@skeletonlabs/skeleton';
	import ArticleIcon from '$assets/icons/document-text.svelte';

	export let data;
	let { supabase } = data;
	$: ({ supabase } = data);

	const toastStore = getToastStore();

	let selectedArticleList = [];
	let deletable = true;

	// 删除选中文章
	async function deleteArticles() {
		const { error: deleteError} = await
			supabase.from('article').delete().in('id',
			selectedArticleList);

		if (deleteError) {
			toastStore.trigger({
				message: deleteError.message,
				hideDismiss: true,
				background: 'variant-filled-error'
			});
		}

		selectedArticleList = [];
		deletable = true;

		toastStore.trigger({
			message: `成功删除文章。`,
			hideDismiss: true,
			background: 'variant-filled-success'
		});

		await invalidateAll();
	}

	// 直接删除文章
	async function deleteArticle(id: number) {
		const { error: deleteError } = await supabase.from('article').delete().eq('id', id);
		if (deleteError) {
			toastStore.trigger({
				message: deleteError.message,
				hideDismiss: true,
				background: 'variant-filled-error'
			});
		} else {
			toastStore.trigger({
				message: `成功删除文章`,
				hideDismiss: true,
				background: 'variant-filled-success'
			});
		}
		await invalidateAll();
	}

	// 选中所有文章并添加到selectedArticleList
	function switchSelectAll() {
		const checkboxes = document.querySelectorAll('.article-checkbox');
		if (selectedArticleList.length === data.articles.length) {
			checkboxes.forEach((checkbox) => {
				checkbox.checked = false;
			});
			selectedArticleList = [];
			deletable = true;
		} else {
			checkboxes.forEach((checkbox) => {
				checkbox.checked = true;
			});
			selectedArticleList = data.articles.map((article) => article.id);
			deletable = false;
		}
	}
</script>

<svelte:head>
	<title>{$t('article')}</title>
</svelte:head>

<div>
	<PageTitle title = {$t('article')} />
	<div class = "flex gap-4 items-center justify-between">
		<button
			type = "button"
			disabled = {deletable}
			on:click = {deleteArticles}
			class =
				"inline-flex justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:w-auto disabled:bg-gray-300"
		>{$t('delete')}
		</button>
		<a
			href = "/admin/article/new"
			class =
				"inline-flex justify-between gap-2 rounded-md bg-cyan-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-cyan-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-600"
		>
			{$t('add-new')}
		</a>
	</div>
	<div class = "mt-8 flow-root">
		{#if data.articles.length > 0}
			<div class = "-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
				<div
					class = "inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8"
				>
					<div
						class = "overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg"
					>
						<table class = "min-w-full divide-y divide-gray-300">
							<thead class = "bg-zinc-100">
							<tr>
								<th
									scope = "col"
									class = "px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
								>
									<input
										on:click = {switchSelectAll}
										type = "checkbox"
										class = "h-4 w-4 rounded border-gray-300 text-cyan-600 focus:ring-cyan-600"
									/>
								</th>
								<th
									scope = "col"
									class = "py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
								>{$t('title')}
								</th>
								<th
									scope = "col"
									class = "hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 lg:table-cell"
								>{$t('language')}
								</th>
								<th
									scope = "col"
									class = "hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 sm:table-cell"
								>Slug
								</th>
								<th
									scope = "col"
									class = "px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
								>{$t('category')}
								</th>
								<th
									scope = "col"
									class = "px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
								>{$t('status')}
								</th>
								<th scope = "col" class = "relative py-3.5 pl-3 pr-4 sm:pr-6">
									<span class = "sr-only">{$t('edit')}</span>
								</th>
							</tr>
							</thead>
							<tbody class = "divide-y divide-gray-200 bg-white">
							<!--文章数据-->
							{#each data.articles as article (article.id)}
								<tr
									class = "even:bg-gray-50 hover:bg-gray-100 cursor-cell"
								>
									<td class = "px-3 py-4 text-sm text-gray-500">
										<input
											on:change = {() => {
											if (selectedArticleList.includes(article.id)) {
												selectedArticleList = selectedArticleList.filter((id) => id !== article.id);
												deletable = selectedArticleList.length === 0;
											} else {
												selectedArticleList.push(article.id);
												deletable = false;
											}
										}}
											type = "checkbox"
											class =
												"article-checkbox h-4 w-4 rounded border-gray-300 text-cyan-600 focus:ring-cyan-600"
										/>
									</td>
									<td
										class =
											"break-words py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6"
									>
										{article.title}
										<p
											class = "font-normal break-words text-gray-600"
										>{article.subtitle}</p>
										<dl class = "font-normal lg:hidden">
											<dt class = "sr-only sm:hidden">Slug</dt>
											<dd
												class =
													"font-mono mt-1 text-gray-500 sm:hidden"
											>
												{article.slug}
											</dd>
											<dt class = "sr-only">Language</dt>
											<dd class = "mt-1 truncate text-gray-500">
												{article.lang.locale}
											</dd>
										</dl>
									</td>
									<td
										class = "hidden px-3 py-4 text-sm text-gray-500 lg:table-cell"
									>{article.lang.locale}
									</td>
									<td
										class =
											"hidden break-words font-mono px-3 py-4 text-sm text-gray-500 sm:table-cell"
									>{article.slug}
									</td>
									<td
										class =
											"hidden sm:table-cell px-3 py-4 text-sm text-gray-500"
									>{article.category.title}</td>

									<!--文章状态-->
									<td
										class =
											"px-3 py-4 space-y-2 text-sm text-gray-500"
									>
										{#if article.is_draft}
										<span
											class =
												"inline-flex items-center gap-x-1.5 rounded-full bg-gray-100 px-2 py-1 text-xs font-medium text-gray-600 break-keep"
										>
											<svg
												class = "h-1.5 w-1.5 fill-gray-400" viewBox = "0 0 6 6"
												aria-hidden = "true"
											>
												<circle cx = "3" cy = "3" r = "3" />
											</svg>
											{$t('draft')}
										</span>
										{:else}
										<span
											class =
												"inline-flex items-center gap-x-1.5 rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-700 break-keep"
										>
											<svg
												class = "h-1.5 w-1.5 fill-green-500" viewBox = "0 0 6 6"
												aria-hidden = "true"
											>
												<circle cx = "3" cy = "3" r = "3" />
											</svg>
											{$t('published')}
										</span>
										{/if}

										{#if article.is_featured}
										<span
											class =
												"inline-flex items-center gap-x-1.5 rounded-full bg-sky-100 px-2 py-1 text-xs font-medium text-sky-700 break-keep"
										>
											{$t('featured')}
										</span>
										{/if}

										{#if article.is_top}
										<span
											class =
												"inline-flex items-center gap-x-1.5 rounded-full bg-violet-100 px-2 py-1 text-xs font-medium text-violet-700 break-keep"
										>
											{$t('topped')}
										</span>
										{/if}

										{#if article.is_premium}
										<span
											class = "inline-flex items-center gap-x-1.5 rounded-full bg-amber-100 px-2 py-1 text-xs font-medium text-amber-700"
										>
											{$t('premium-only')}
										</span>
										{/if}
									</td>

									<td
										class =
											"space-y-4 sm:space-y-2 sm:space-x-4 py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6"
									>
										<a
											href = {`/admin/article/edit/${article.id}`}
											data-sveltekit-preload-data
											class = "break-keep text-cyan-600 hover:text-cyan-900"
										>{$t('edit')}</a>
										<button
											on:click = {() => deleteArticle(article.id)}
											class = "break-keep text-red-600 hover:text-red-900"
										>
											{$t('delete')}
										</button>
									</td>
								</tr>
							{/each}
							</tbody>
						</table>
					</div>
				</div>
			</div>
		{:else}
			<div class = "flex flex-col items-center justify-center text-center min-h-80">
				<ArticleIcon classList="mx-auto h-12 w-12 text-gray-400" />
				<h3 class = "mt-2 text-sm font-semibold text-gray-900">No articles</h3>
				<div class = "mt-6">
					<a
						href = "/admin/article/new"
						class = "inline-flex items-center rounded-md bg-cyan-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-cyan-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-600"
					>
						{$t('add-new')}
					</a>
				</div>
			</div>

		{/if}
	</div>
</div>

<Pagination
	count = {data.count} page = {data.page} limit = {data.limit}
	path = {data.path}
/>
