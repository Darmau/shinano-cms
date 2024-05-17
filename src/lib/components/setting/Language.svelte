<script lang="ts">
	import type { Configs } from '$types/config';
	import PlusIcon from '$assets/icons/plus.svelte';
	import { t } from '$lib/functions/i18n'

	export let data: Configs
</script>

<main class="py-8 flex flex-col gap-4">
	<button
		type = "button"
		class =
			"self-end inline-flex items-center gap-x-1.5 rounded-md bg-cyan-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-cyan-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
	>
		<PlusIcon classList="w-4 h-4" />
		{$t('add-language')}
	</button>
	{#if data.languages}
		<div class="">
			{#each data.languages as language}
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
	{/if}

</main>
