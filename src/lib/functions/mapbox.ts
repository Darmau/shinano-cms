// 本函数接收经纬度和api，返回该坐标的地名
export default async function getLocation(latitude: number, longitude: number, token: string) {
  const location = await fetch(`https://api.mapbox.com/search/geocode/v6/reverse?longitude=${longitude}&latitude=${latitude}&language=zh-Hans&access_token=${token}
`).then((res) => res.json());
	console.log(location);
	if (location.features.length === 0) {
		return 'Unknown location';
	}
	return location.features[0].properties.full_address;
}
