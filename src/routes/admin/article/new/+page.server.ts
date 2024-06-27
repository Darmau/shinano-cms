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

	return {
		prefix: storageKeys[0].config_URL_PREFIX,
		defaultLanguage: defaultLanguage.data
	}
}
