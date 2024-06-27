import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ fetch, locals: { supabase }}) => {
	const storageKeys = await fetch('/api/kv', {
		method: 'POST',
		body: JSON.stringify({ keys: ['config_URL_PREFIX']})
	}).then(res => res.json());

	// 从language表中获取is_default为true的语言
	const defaultLanguage = await supabase
		.from('language')
		.select('id, lang')
		.eq('is_default', true)
		.single();

	// 根据defaultLanguage.data.id在category表中获取type为article的分类
	const defaultLanguageId = defaultLanguage.data?.id ?? 1;
	const categories = await supabase
		.from('category')
		.select('id, title, slug')
		.eq('lang', defaultLanguageId)
	  .eq('type', 'article');

	return {
		prefix: storageKeys[0].config_URL_PREFIX,
		defaultLanguage: defaultLanguage.data,
		categories: categories.data,
		otherVersions: []
	}
}
