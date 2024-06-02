<script lang="ts">
	import PlusIcon from '$assets/icons/plus.svelte';
	import { t } from '$lib/functions/i18n'
	import { onMount } from 'svelte';
	import AddLanguage from '$components/setting/AddLanguage.svelte';

	export let data;
	let errorMessage = '';
	let languages = [];
	let { supabase } = data
	$: ({ supabase } = data)

	// 获取所有语言
	const getLanguages = async () => {
		const { data } = await
			supabase.from('language').select('lang, locale, is_default').order('is_default', {ascending: false});
		languages = data;
	}

	onMount(async () => {
		await getLanguages();
	});

	// 更换默认语言
	const setDefaultLanguage = async (lang: string) => {
		await supabase.from('language').update({is_default: true}).eq('lang', lang);
		await getLanguages();
	}

	// 添加语言
	const addLanguage = async (lang, locale) => {
		const { data, error: dataError } = await
			supabase.from('language').insert({ lang, locale }).select();
		if (dataError) {
			errorMessage = dataError.message;
		}
		closeAddLanguage();
	}

	// 删除语言
	const deleteLanguage = async (lang: string) => {
		const {error: deleteError} = await
			supabase.from('language').delete().eq('lang',
			lang);
		if (deleteError) {
			errorMessage = deleteError.message;
			console.error(deleteError);
		}
		await getLanguages();
	}

	// 关闭添加语言窗口并刷新数据
	let isAdding: boolean = false;
	function closeAddLanguage() {
		isAdding = false;
		getLanguages();
	}

	// 错误信息alert
	let errorVisible: boolean = true;

</script>

<main class="py-8 flex flex-col gap-4">
	<button
		on:click = {() => isAdding = true}
		type = "button"
		class =
			"self-end inline-flex items-center gap-x-1.5 rounded-md bg-cyan-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-cyan-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
	>
		<PlusIcon classList="w-4 h-4" />
		{$t('add-language')}
	</button>
	{#if isAdding}
		<AddLanguage {closeAddLanguage} {addLanguage} />
	{/if}
	{#if errorMessage}
		<p>{errorMessage}</p>
	{/if}
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
							on:click = {() => deleteLanguage(language.lang)}
							class="uppercase text-sm text-red-600 hover:text-red-700 hover:font-semibold"
						>{$t('delete')}
						</button>
					</div>
				</div>
			{/each}
		</div>
</main>
