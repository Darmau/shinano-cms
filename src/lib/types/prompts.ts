export class AI {
	private readonly prompts: Map<string, string> = new Map([
		['config_OPENAI', ''],
		['prompt_SEO', ''],
		['prompt_SLUG', ''],
		['prompt_TRANSLATION', ''],
		['prompt_IMAGE_ALT', ''],
		['prompt_TAGS', ''],
	]);

	public array() {
		return Array.from(this.prompts.keys());
	}

	public emptyObject() {
		return Object.fromEntries(this.prompts);
	}
}
