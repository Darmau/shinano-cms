import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';
import { URL_PREFIX } from '$env/static/private'

export const load: PageServerLoad = async ({ url, params: { page }, locals: { supabase }}) => {
	const pageNumber = Number(page);
	const limit = url.searchParams.get('limit') ? Number(url.searchParams.get('limit')) : 12;

	// 获取photo表中数据的条目数
	const { count } = await supabase.from('photo').select('id', { count: 'exact' });

	// 同时获取photo_image表中photo_id为photo表中id的数据数量
	const { data: photos, error: fetchError } = await supabase
	.from('photo')
	.select(`
	  id, 
	  title, 
	  lang (id, locale), 
	  slug, 
	  category (id,  title), 
	  is_draft, 
	  is_featured, 
	  is_top,
	  cover (id, alt, storage_key),
	  photo_image (count)
	  `)
	.range((pageNumber - 1) * limit, pageNumber * limit - 1)
	.order('updated_at', { ascending: false });

	if (fetchError) {
		console.error(error);
		error(Number(fetchError.code), { message: fetchError.message})
	}

	const path = url.pathname.substring(0, url.pathname.indexOf(page) - 1);

	return {
		page: pageNumber,
		prefix: URL_PREFIX,
		count: count ?? 0,
		photos: photos ?? [],
		limit,
		path,
	}
}
