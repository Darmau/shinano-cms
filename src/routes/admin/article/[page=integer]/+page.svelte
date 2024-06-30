<script lang="ts">
	import Pagination from '$components/Pagination.svelte';
	import { t } from '$lib/functions/i18n';

	export let data;
</script>

<svelte:head>
	<title>{$t('article')}</title>
</svelte:head>

<div>
	<div class = "sm:flex sm:items-center">
		<div class = "sm:flex-auto">
			<h1 class = "text-base font-semibold leading-6 text-gray-900">Users</h1>
			<p class = "mt-2 text-sm text-gray-700">A list of all the users in your
				account including their name, title, email and role.</p>
		</div>
		<div class = "mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
			<a
				href = "/admin/article/new"
				class = "block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
			>New</a>
		</div>
	</div>
	<div class = "mt-8 flow-root">
		<div class = "-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
			<div class = "inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
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
								<span class = "sr-only">Edit</span>
							</th>
						</tr>
						</thead>
						<tbody class = "divide-y divide-gray-200 bg-white">
            <!--文章数据-->
						{#each data.articles as article (article.id)}
							<tr
								class="even:bg-gray-50 hover:bg-gray-100 cursor-cell"
							>
								<td class = "px-3 py-4 text-sm text-gray-500">
									<input
										type = "checkbox"
										class = "h-4 w-4 rounded border-gray-300 text-cyan-600 focus:ring-cyan-600"
									/>
								</td>
								<td
									class = "whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6"
								>
									{article.title}
									<dl class = "font-normal lg:hidden">
										<dt class = "sr-only sm:hidden">Slug</dt>
										<dd class =
													"font-mono mt-1 truncate text-gray-500 sm:hidden">
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
										"hidden font-mono px-3 py-4 text-sm text-gray-500 sm:table-cell"
								>{article.slug}
								</td>
								<td
									class = "px-3 py-4 text-sm text-gray-500">{article.category.title}</td>

								<!--文章状态-->
								<td
									class = "px-3 py-4 text-sm text-gray-500 flex gap-2">
									{#if article.is_draft}
										<span class="inline-flex items-center gap-x-1.5 rounded-full bg-gray-100 px-2 py-1 text-xs font-medium text-gray-600">
											<svg class="h-1.5 w-1.5 fill-gray-400" viewBox="0 0 6 6" aria-hidden="true">
												<circle cx="3" cy="3" r="3" />
											</svg>
											{$t('draft')}
										</span>
									{:else}
										<span class="inline-flex items-center gap-x-1.5 rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-700">
											<svg class="h-1.5 w-1.5 fill-green-500" viewBox="0 0 6 6" aria-hidden="true">
												<circle cx="3" cy="3" r="3" />
											</svg>
											{$t('published')}
										</span>
									{/if}

									{#if article.is_featured}
										<span
											class="inline-flex items-center gap-x-1.5 rounded-full bg-sky-100 px-2 py-1 text-xs font-medium text-sky-700">
											{$t('featured')}
										</span>
									{/if}

									{#if article.is_top}
										<span
											class="inline-flex items-center gap-x-1.5 rounded-full bg-violet-100 px-2 py-1 text-xs font-medium text-violet-700">
											{$t('topped')}
										</span>
									{/if}

									{#if article.is_premium}
										<span
											class="inline-flex items-center gap-x-1.5 rounded-full bg-amber-100 px-2 py-1 text-xs font-medium text-amber-700">
											{$t('premium-only')}
										</span>
									{/if}
								</td>

								<td
									class = "relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6"
								>
									<a
										href = {`/admin/article/edit/${article.id}`}
										data-sveltekit-preload-data
										class = "text-indigo-600 hover:text-indigo-900"
									>{$t('edit')}</a>
								</td>
							</tr>
						{/each}
						</tbody>
					</table>
				</div>
			</div>
		</div>
	</div>
</div>

<Pagination
	count = {data.count} page = {data.page} limit = {data.limit}
	path = {data.path}
/>
