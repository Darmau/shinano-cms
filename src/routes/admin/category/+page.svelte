<script>
	import PageTitle from '$components/PageTitle.svelte';
	import { t } from '$lib/functions/i18n';

	export let data;

	// 读取分类相应的内容数量
	function getCountByType(category) {
		if (category && category.type) {
			return category[category.type][0].count;
		}
		return 0;
	}
</script>

<div>
	<PageTitle title = {$t('category')} />
	<div class="my-8 flex justify-end">
		<a
			href="/admin/category/new"
		  class="inline-flex justify-between gap-2 rounded-md bg-cyan-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-cyan-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-600"
		>
			添加分类
		</a>
	</div>
	<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
		{#each data.categories as category (category.id)}
			<div class="border p-4 rounded-md space-y-3">
				<h4 class="inline-flex items-center rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10">{category.lang.locale}</h4>
				<h3 class="font-medium text-lg text-cyan-700">{category.title}</h3>
				<p class="text-base text-gray-600">{category.description}</p>
				<div class="flex justify-between">
					<div>
						<h5 class="text-sm text-gray-700">Type</h5>
						<p class="text-lg capitalize">{$t(category.type)}</p>
					</div>
					<div class="text-sm text-gray-700">
						<h5>Count</h5>
						<p class="text-lg font-mono">{getCountByType(category)}</p>
					</div>
				</div>
			</div>
		{/each}
	</div>
</div>
