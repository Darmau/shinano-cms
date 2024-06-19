import type { PageServerLoad } from './$types';
import { ImageProcess } from '$lib/types/imageProcess';

const storageConfigs = new ImageProcess();
const CONFIGS = storageConfigs.emptyObject();
const KEYS = storageConfigs.array();

export const load: PageServerLoad = async ({ locals: {supabase}}) => {
	const { data: storageKeys, error: fetchError } = await
		supabase.from('config').select('name, value').in('name', KEYS);

	if (fetchError) {
		throw fetchError;
	}

	storageKeys.forEach(key => {
		if (key.name in CONFIGS) {
			CONFIGS[key.name] = key.value;
		}
	});

	return {
		configs: CONFIGS,
		prefix: CONFIGS.S3_URL_PREFIX,
	}
}
