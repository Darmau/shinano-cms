import type { PageServerLoad } from './$types';
import { ThirdPartyAPIs } from '$lib/types/thirdPartyApi';

const storageConfigs = new ThirdPartyAPIs();
const CONFIGS = storageConfigs.emptyObject();

export const load: PageServerLoad = async ({ fetch, locals: { supabase }}) => {
	const storageKeys = await fetch('/api/kv', {
		method: 'POST',
		body: JSON.stringify({ keys: ['config_URL_PREFIX']})
	}).then(res => res.json());

	storageKeys.forEach((item: Item) => {
		const key = Object.keys(item)[0];
		CONFIGS[key] = item[key];
	});

	// 从language表中获取is_default为true的语言
	const defaultLanguage = await supabase
		.from('language')
		.select('id, lang')
		.eq('is_default', true)
		.single();

	return {
		prefix: CONFIGS.config_URL_PREFIX,
		defaultLanguage: defaultLanguage.data
	}
}

interface Item {
	[key: string]: string;
}
