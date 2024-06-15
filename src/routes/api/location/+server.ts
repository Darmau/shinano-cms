import type { RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ url }) => {
	const latitude = Number(url.searchParams.get('latitude'));
	const longitude = Number(url.searchParams.get('longitude'));
	const mapbox = url.searchParams.get('mapbox');
	const amap = url.searchParams.get('amap');

	if (!latitude || !longitude) {
		return new Response(JSON.stringify({ error: 'No latitude or longitude provided' }), { status: 400 });
	}

	if (!mapbox) {
		return new Response(JSON.stringify({ error: 'No mapbox api provided' }), { status: 400 });
	}

	// 首先通过mapbox获取国家信息
	const countryObject = await fetch(`https://api.mapbox.com/search/geocode/v6/reverse?longitude=${longitude}&latitude=${latitude}&types=country&access_token=${mapbox}`)
	.then((res) => res.json())
	.catch((err) => {
		console.error('mapbox请求失败', err);
		return null;
	});
	console.log('countryObject', JSON.stringify(countryObject));
	const country = countryObject.features[0].properties.context.country.country_code;

	// 如果国家为中国，则使用高德地图api获取地址
	if (amap && (country === 'CN' || country === 'HK' || country === 'MO')) {
		const response = await fetch(`https://restapi.amap.com/v3/geocode/regeo?key=${amap}&location=${longitude.toFixed(6)},${latitude.toFixed(6)}&radius=2000`).then((res) => res.json());
		if (response.status === 0) {
			console.error('高德地图api请求失败', response);
			return new Response(JSON.stringify({ error: '高德地图api请求失败' }), { status: response.status });
		}
		console.log('response', JSON.stringify(response));
		// 将response.regeocode.formatted_address字符串返回
		return new Response(JSON.stringify(response.regeocode.formatted_address));
	}
	// 对于世界上其他国家
	const language = languageMap.get(country) ?? 'en';
	const worldview = worldviewMap.get(country) ?? 'us';

	const response = await fetch(`https://api.mapbox.com/search/geocode/v6/reverse?longitude=${longitude}&latitude=${latitude}&language=${language}&worldview=${worldview}&limit=1&access_token=${mapbox}`).then((res) => res.json());

	if (response.features.length === 0) {
		console.error('无法获取地址信息', response);
		return new Response(JSON.stringify({ error: '无法获取地址信息' }), { status: response.status });
	}

	console.log('response', JSON.stringify(response));
	return new Response(JSON.stringify(response.features[0].properties.full_address));
};

// 根据国家，返回不同的language参数，以获得更好的结果
const languageMap = new Map([
	['CN', 'zh'],
	['JP', 'ja'],
	['KR', 'ko'],
	['TW', 'zh_TW'],
	['MO', 'zh_TW'],
	['SG', 'zh'],
	['ES', 'es'],
	['MX', 'es'],
	['CL', 'es'],
	['FR', 'fr'],
	['DE', 'de'],
	['IT', 'it'],
	['NL', 'nl'],
	['PT', 'pt'],
	['BR', 'pt'],
	['TH', 'th'],
	['ID', 'id'],
	['SE', 'sv'],
	['IN', 'hi'],
	['IL', 'he'],
	['RU', 'ru'],
	['EG', 'ar'],
	['SA', 'ar'],
	['AE', 'ar'],
	['QA', 'ar'],
	['OM', 'ar'],
	['KW', 'ar'],
	['BH', 'ar'],
	['JO', 'ar'],
	['LB', 'ar'],
	['SY', 'ar'],
	['IQ', 'ar']
]);

// 根据国家，返回不同的worldview参数，以获得更好的结果
const worldviewMap = new Map([
	['CN', 'cn'],
	['AR', 'ar'],
	['IN', 'in'],
	['JP', 'jp'],
	['MA', 'ma'],
	['RU', 'ru'],
	['TR', 'tr'],
	['US', 'us']
]);
