import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ fetch, url, params: { page }, locals: { supabase }}) => {
	const pageNumber = Number(page);
	const limit = url.searchParams.get('limit') ? Number(url.searchParams.get('limit')) : 24;

	const configs = await fetch('/api/kv', {
		method: 'POST',
		body: JSON.stringify({ keys: ['config_URL_PREFIX']})
	}).then(res => res.json());

	// 获取article表中数据的条目数
	const { count } = await supabase.from('article').select('id', { count: 'exact' });

	const { data: articles, error } = await supabase
		.from('article')
		.select()
		.range((pageNumber - 1) * 24, pageNumber * 24 - 1)
		.order('id', { ascending: false });

	if (error) {
		console.error(error);
		throw error;
	}

	const path = url.pathname.substring(0, url.pathname.indexOf(page) - 1);

	return {
		page: pageNumber,
		prefix: configs[0].config_URL_PREFIX,
		count: count ?? 0,
		articles: articles ?? [],
		limit,
		path,
	}
}
