import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ depends, url,params: { page }, locals: { supabase } }) => {
	depends('supabase:db:image')
	const pageNumber = Number(page)
	const limit = url.searchParams.get('limit') ? Number(url.searchParams.get('limit')) : 16
	// 从config表中读取S3_URL_PREFIX
	const { data: prefix } = await supabase.from('config').select('value').eq('name', 'S3_URL_PREFIX');
	const { data: images, error } = await supabase
		.from('image')
		.select('file_name, location, size, storage_key')
	  .range((pageNumber - 1) * limit, pageNumber * limit - 1)
	  .order('id', { ascending: false });
	if (error) {
		throw error;
	}
	return {
		page: pageNumber,
		images: images ?? [],
		prefix: prefix?.[0]?.value ?? ''
	};
};
