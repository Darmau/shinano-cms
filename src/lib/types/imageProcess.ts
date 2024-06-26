export class ImageProcess {
	private readonly configNames: Map<string, string> = new Map([
		['config_URL_PREFIX', ''],
	])

	public array() {
		return Array.from(this.configNames.keys())
	}

	public emptyObject() {
		return Object.fromEntries(this.configNames);
	}
}
