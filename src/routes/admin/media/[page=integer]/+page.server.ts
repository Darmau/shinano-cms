import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ fetch, url,params: { page }, locals: { supabase } }) => {
	const pageNumber = Number(page)
	const limit = url.searchParams.get('limit') ? Number(url.searchParams.get('limit')) : 24

	const configs = await fetch('/api/kv', {
		method: 'POST',
		body: JSON.stringify({ keys: ['config_URL_PREFIX']})
	}).then(res => res.json());

	const { data: images, error } = await supabase
		.from('image')
		.select()
	  .range((pageNumber - 1) * limit, pageNumber * limit - 1)
	  .order('id', { ascending: false });

	// 获取image表中数据的条目数
	const { count } = await supabase.from('image').select('id', { count: 'exact' });

	if (error) {
		console.error(error);
		throw error;
	}

	// 获取url中域名开始到page之间的字符串
	const path = url.pathname.substring(0, url.pathname.indexOf(page) - 1);

	return {
		page: pageNumber,
		images: images ?? [],
		prefix: configs[0].config_URL_PREFIX,
		count: count ?? 0,
		limit: limit,
		path: path
	};
};
