import type { PageServerLoad } from './$types';
import { URL_PREFIX } from '$env/static/private'

export const load: PageServerLoad = async ({ url, params: { page }, locals: { supabase }}) => {
	const pageNumber = Number(page);
	const limit = url.searchParams.get('limit') ? Number(url.searchParams.get('limit')) : 12;

	// 获取article表中数据的条目数
	const { count } = await supabase.from('article').select('id', { count: 'exact' });

	const { data: articles, error } = await supabase
		.from('article')
		.select(`id, title, subtitle, lang (id, locale), slug, category (id,  title), is_draft, is_featured, is_top, is_premium`)
		.range((pageNumber - 1) * limit, pageNumber * limit - 1)
		.order('id', { ascending: false });

	if (error) {
		console.error(error);
		throw error;
	}

	const path = url.pathname.substring(0, url.pathname.indexOf(page) - 1);

	return {
		page: pageNumber,
		prefix: URL_PREFIX,
		count: count ?? 0,
		articles: articles ?? [],
		limit,
		path,
	}
}
