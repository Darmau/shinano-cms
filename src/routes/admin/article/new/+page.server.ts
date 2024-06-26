import type { PageServerLoad } from './$types';
import { ThirdPartyAPIs } from '$lib/types/thirdPartyApi';

const storageConfigs = new ThirdPartyAPIs();
const CONFIGS = storageConfigs.emptyObject();

export const load: PageServerLoad = async ({ fetch}) => {
	const storageKeys = await fetch('/api/kv', {
		method: 'POST',
		body: JSON.stringify({ keys: ['config_URL_PREFIX']})
	}).then(res => res.json());

	storageKeys.forEach((item: Item) => {
		const key = Object.keys(item)[0];
		CONFIGS[key] = item[key];
	});

	return {
		prefix: CONFIGS.config_URL_PREFIX,
	}
}

interface Item {
	[key: string]: string;
}
