<script lang="ts">
	import PlusIcon from '$assets/icons/plus.svelte';
	import { t } from '$lib/functions/i18n'
	import { onMount } from 'svelte';

	export let data
	let languages = [];
	let { supabase } = data
	$: ({ supabase } = data)

	// 获取所有语言
	$: getLanguages = async () => {
		const { data } = await supabase.from('language').select('lang, locale, is_default');
		languages = data;
	}

	$: addLanguage = async () => {
		await supabase.from('language').insert({lang: 'jp',
			locale: '日本语'}).select();
		await getLanguages();
	}

	// 更换默认语言
	$: setDefaultLanguage = async (lang: string) => {
		await supabase.from('language').update({is_default: true}).eq('lang', lang);
		await getLanguages();
	}

	onMount(async () => {
		await getLanguages();
	});

	$: addTestLanguage = async () => {
		const { data } = await supabase.from('language').insert({lang: 'jp',
			locale: '日本语'}).select();
		return data;
	}
</script>

<main class="py-8 flex flex-col gap-4">
	<button
		on:click = {addLanguage}
		type = "button"
		class =
			"self-end inline-flex items-center gap-x-1.5 rounded-md bg-cyan-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-cyan-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
	>
		<PlusIcon classList="w-4 h-4" />
		{$t('add-language')}
	</button>
	<div>
			{#each languages as language}
				<div class="border-b flex justify-between py-4">
					<div>
						<h3 class="font-medium flex items-center gap-2">
							{language.locale}
							{#if language.is_default}
								<span
									class="inline-flex items-center rounded-md bg-yellow-50 px-2 py-1 text-xs font-medium text-yellow-800 ring-1 ring-inset ring-yellow-600/20">{$t('default')}</span>
							{/if}
						</h3>
						<p class="text-sm text-zinc-600 font-mono">{language.lang}</p>
					</div>
					<div class="flex gap-4">
						{#if !language.is_default}
							<button
								on:click = {() => setDefaultLanguage(language.lang)}
								type = "button"
								class="uppercase text-cyan-600 text-sm hover:text-cyan-700 hover:font-semibold"
							>{$t('set-default')}
							</button>
						{/if}
						<button
							type = "button"
							class="uppercase text-sm text-red-600 hover:text-red-700 hover:font-semibold"
						>{$t('delete')}
						</button>
					</div>
				</div>
			{/each}
		</div>
</main>
