export class ImageProcess {
	private readonly configNames: Map<string, string> = new Map([
		['S3_REGION', ''],
		['S3_ENDPOINT', ''],
		['S3_ACCESS_ID', ''],
		['S3_SECRET_KEY', ''],
		['S3_BUCKET', ''],
		['S3_URL_PREFIX', ''],
		['GOOGLE_MAPS', ''],
		['OPENAI_API_KEY', ''],
		['PROMPT_IMAGE_ALT', ''],
	])

	public array() {
		return Array.from(this.configNames.keys())
	}

	public emptyObject() {
		return Object.fromEntries(this.configNames);
	}
}
