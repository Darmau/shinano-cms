<!--本组件是一个toast，用于添加语言-->
<script lang="ts">
	import InputField from '$components/InputField.svelte';

	export let closeAddLanguage: () => void;
	export let addLanguage: (lang: string, locale: string) => void;

	function submitForm(event: Event) {
		event.preventDefault();
		const formData = new FormData(event.target as HTMLFormElement);
		const languageData = Object.fromEntries(formData.entries());
		addLanguage(languageData.lang, languageData.locale);
		closeAddLanguage();
	}
</script>

<form
	method="POST"
	on:submit={submitForm}
>
  <InputField
		label="Language"
		name="lang"
		type="text"
		placeholder="Input language"
	/>
  <InputField
		label="Locale"
		name="locale"
		type="text"
		placeholder="Input locale"
	/>
	<button
		type="submit"
		class="bg-cyan-600 text-white rounded px-4 py-2 hover:bg-cyan-800"
	>
		Submit
	</button>
</form>
