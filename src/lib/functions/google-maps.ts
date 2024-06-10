// 本函数接收经纬度和api，返回该坐标的地名
export default async function getLocation(latitude: number, longitude: number, token: string) {
  const location = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${token}`)
	.then((res) => res.json());
	console.log(location);
	if (location.results.length === 0) {
		return 'Unknown location';
	}
	return location.results[0].formatted_address;
}
