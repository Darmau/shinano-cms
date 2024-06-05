export class AI {
	private readonly prompts: Map<string, string> = new Map([
		['OPENAI_API_KEY', ''],
		['PROMPT_SEO', ''],
		['PROMPT_SLUG', '']
	]);

	public array() {
		return Array.from(this.prompts.keys());
	}

	public emptyObject() {
		return Object.fromEntries(this.prompts);
	}
}
