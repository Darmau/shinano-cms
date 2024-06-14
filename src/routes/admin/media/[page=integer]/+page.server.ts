import type { PageServerLoad } from './$types';
import { ImageProcess } from '$lib/types/imageProcess';

const storageConfigs = new ImageProcess();
const CONFIGS = storageConfigs.emptyObject();
const KEYS = storageConfigs.array();

export const load: PageServerLoad = async ({ depends, url,params: { page }, locals: { supabase } }) => {
	depends('supabase:db:image')

	const pageNumber = Number(page)
	const limit = url.searchParams.get('limit') ? Number(url.searchParams.get('limit')) : 16

	// 从config表中读取S3_URL_PREFIX
	const { data: storageKeys, error: fetchError } = await
		supabase.from('config').select('name, value').in('name', KEYS);
	const { data: images, error } = await supabase
		.from('image')
		.select()
	  .range((pageNumber - 1) * limit, pageNumber * limit - 1)
	  .order('id', { ascending: false });

	// 获取image表中数据的条目数
	const { count } = await supabase.from('image').select('id', { count: 'exact' });

	if (error || fetchError) {
		throw error;
	}

	storageKeys.forEach(key => {
		if (key.name in CONFIGS) {
			CONFIGS[key.name] = key.value;
		}
	});

	// 获取url中域名开始到page之间的字符串
	const path = url.pathname.substring(0, url.pathname.indexOf(page) - 1);

	return {
		page: pageNumber,
		images: images ?? [],
		prefix: CONFIGS.S3_URL_PREFIX,
		configs: CONFIGS,
		count: count ?? 0,
		limit: limit,
		path: path
	};
};
