<script lang="ts">
	import { onMount } from 'svelte';
	import { getToastStore } from '@skeletonlabs/skeleton';
	import { AI } from '$lib/types/prompts';
	import { t } from '$lib/functions/i18n';

	const toastStore = getToastStore();

	export let data;
	let { supabase } = data;
	$: ({ supabase } = data);

	const ai = new AI();
	let AIObj = ai.emptyObject();
	const KEYS = ai.array();

	// 从config表中获取AI配置
	const getAIConfig = async () => {
		const { data: prompts, error: fetchError } = await
			supabase.from('config').select('name, value').in('name', KEYS);

		if (fetchError) {
			console.error(fetchError);
			toastStore.trigger({
				message: 'Failed to fetch AI config.',
				hideDismiss: true,
				background: 'variant-filled-error'
			});
		}

		prompts.forEach(key => {
			if (key.name in AIObj) {
				AIObj[key.name] = key.value;
			}
		});
	}

	onMount(async () => {
		await getAIConfig();
	});

	// 该变量负责记录表单是否被修改，如果修改，则为true
	let isFormChanged = false;

	// 提交表单
	async function submitForm(event: Event) {
		event.preventDefault();
		const formData = new FormData(event.target as HTMLFormElement);
		const storageData = Object.fromEntries(formData.entries());

		// bulk upsert
		const upsertData = Object.keys(storageData).map(key => {
			return {
				name: key.toUpperCase(),
				value: storageData[key]
			}
		});

		// 将数组批量存储到config表中，如果有重复的name则更新
		const { error: upsertError } =
			await supabase.from('config').upsert(upsertData, {
				returning: 'minimal',
				onConflict: ['name']
			}).select();

		if (upsertError) {
			console.error(upsertError);
			toastStore.trigger({
				message: "Failed to update S3 config.",
				hideDismiss: true,
				background: 'variant-filled-error'
			});
			return false;
		}

		toastStore.trigger({
			message: "S3 config updated.",
			hideDismiss: true,
			background: 'variant-filled-success'
		});

		isFormChanged = false;
		await getAPIConfig();
	}
</script>

<main class="py-8">
	<form
		method="POST"
		on:submit={submitForm}
		on:input={() => isFormChanged = true}
		class="space-y-6"
	>
		<div class="border-b border-gray-900/10 pb-12 space-y-4">
			<div>
				<label
					for="openai_api_key"
					class = "block text-sm font-medium leading-6 text-gray-900"
				>
					OpenAI API Key
				</label>
				<input
					type="text"
					id="openai_api_key"
					name="openai_api_key"
					bind:value={AIObj.OPENAI_API_KEY}
					class="font-mono text-gray-900 ring-gray-300 placeholder:text-gray-400 focus:ring-indigo-600 block w-full rounded-md border-0 py-1.5 px-2 shadow-sm ring-1 ring-inset focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6"
				/>
			</div>
		</div>
		<div>
			<label
				for="prompt_slug"
				class = "block text-sm font-medium leading-6 text-gray-900"
			>
				根据标题生成网址末尾的slug
			</label>
			<textarea
				type="text"
				id="prompt_slug"
				name="prompt_slug"
				bind:value={AIObj.PROMPT_SLUG}
				class="text-gray-900 ring-gray-300 placeholder:text-gray-400 focus:ring-indigo-600 block w-full rounded-md border-0 py-1.5 px-2 shadow-sm ring-1 ring-inset focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6"
			></textarea>
		</div>
		<div>
			<label
				for="prompt_seo"
				class = "block text-sm font-medium leading-6 text-gray-900"
			>
				生成文章摘要用于SEO
			</label>
			<textarea
				type="text"
				id="prompt_seo"
				name="prompt_seo"
				bind:value={AIObj.PROMPT_SEO}
				class="text-gray-900 ring-gray-300 placeholder:text-gray-400 focus:ring-indigo-600 block w-full rounded-md border-0 py-1.5 px-2 shadow-sm ring-1 ring-inset focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6"
			></textarea>
		</div>
		<button
			type="submit"
			disabled={!isFormChanged}
			class =
				"rounded-md bg-cyan-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-cyan-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:bg-gray-200"
		>
			{$t('submit')}
		</button>
	</form>
</main>
