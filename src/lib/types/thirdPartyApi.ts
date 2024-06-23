export class ThirdPartyAPIs {
	private readonly apiNames: Map<string, string> = new Map([
		['config_UNSPLASH_ACCESS_KEY', ''],
		['config_UNSPLASH_SECRET_KEY', ''],
		['config_PERSPECTIVE', ''],
		['config_MAPBOX', ''],
		['config_AMAP', ''],
	])

	public array() {
		return Array.from(this.apiNames.keys())
	}

	public emptyObject() {
		return Object.fromEntries(this.apiNames);
	}
}
