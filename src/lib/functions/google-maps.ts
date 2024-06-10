import { error } from '@sveltejs/kit';

interface AddressComponent {
	long_name: string;
	short_name: string;
	types: string[];
}

interface Result {
	address_components: AddressComponent[];
}

interface Location {
	results: Result[];
}

// 本函数接收经纬度和api，返回该坐标的地名
export default async function getLocation(latitude: number, longitude: number, google: string, amap?: string) {
	if (!google) {
		return error(400, 'No google api provided');
	}

	// 检查国家
	const country = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${google}&result_type=country`)
	.then((res) => res.json());

	if (country.results.length === 0) {
		return 'Failed to get location';
	}

	// 如果国家为中国，则使用高德地图api获取地址
	if (amap && isChina(country)) {
		return await getChinaLocation(Number(latitude), Number(longitude), amap);
	} else {
		const location = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${google}`)
		.then((res) => res.json());
		return location.results[0].formatted_address;
	}
}

// 遍历数组，找出国家是否为中国
function isChina(location: Location) {
	for (const address of location.results[0].address_components) {
		if (address.types.includes('country')) {
			return address.short_name === 'CN';
		}
	}
	return false
}

// 获取国内地址
async function getChinaLocation(latitude: number, longitude: number, key: string) {
	const response = await fetch(
		`https://restapi.amap.com/v3/geocode/regeo?key=${key}&location=${longitude.toFixed(6)},${latitude.toFixed(6)}&radius=2000`
	).then((res) => res.json());

	if (response.status === 0) {
		return 'Failed to get location';
	}

	return response.regeocode.formatted_address;
}
