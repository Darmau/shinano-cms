import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ depends, params: { page }, locals: { supabase } }) => {
	depends('supabase:db:image')
	// 从config表中读取S3_URL_PREFIX
	const { data: prefix } = await supabase.from('config').select('value').eq('name', 'S3_URL_PREFIX');
	const { data: images, error } = await supabase
		.from('image')
		.select('file_name, location, size, storage_key')
		.range(Number(page) * 10, (Number(page) + 1) * 10 - 1);
	if (error) {
		throw error;
	}
	return {
		page: Number(page),
		images: images ?? [],
		prefix: prefix?.[0]?.value ?? ''
	};
};
