export class ThirdPartyAPIs {
	private readonly apiNames: Map<string, string> = new Map([
		['UNSPLASH_ACCESS_KEY', ''],
		['UNSPLASH_SECRET_KEY', ''],
		['PERSPECTIVE', ''],
		['MAP_AMAP', ''],
		['MAP_GOOGLE', '']
	])

	public array() {
		return Array.from(this.apiNames.keys())
	}

	public emptyObject() {
		return Object.fromEntries(this.apiNames);
	}
}
