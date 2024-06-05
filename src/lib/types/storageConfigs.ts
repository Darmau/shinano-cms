export class StorageConfigs {
	private readonly configNames: Map<string, string> = new Map([
		['S3_REGION', ''],
		['S3_ENDPOINT', ''],
		['S3_ACCESS_ID', ''],
		['S3_SECRET_KEY', ''],
		['S3_BUCKET', ''],
		['S3_URL_PREFIX', '']
	])

	public array() {
		return Array.from(this.configNames.keys())
	}

	public emptyObject() {
		return Object.fromEntries(this.configNames);
	}
}
