<script lang="ts">
	import { t } from '$lib/functions/i18n';
	import { onMount } from 'svelte';
	import { getToastStore } from '@skeletonlabs/skeleton';
	import { ThirdPartyAPIs } from '$lib/types/thirdPartyApi';

	const toastStore = getToastStore();

	export let data;
	let { supabase } = data;
	$: ({ supabase } = data);

	const apis = new ThirdPartyAPIs();
	let API = apis.emptyObject();
	const KEYS = apis.array();

	// 从config表中获取API配置
	const getAPIConfig = async () => {
		const { data: apiKeys, error: fetchError } = await
			supabase.from('config').select('name, value').in('name', KEYS);

		if (fetchError) {
			console.error(fetchError);
			toastStore.trigger({
				message: 'Failed to fetch API config.',
				hideDismiss: true,
				background: 'variant-filled-error'
			});
		}

		apiKeys.forEach(key => {
			if (key.name in API) {
				API[key.name] = key.value;
			}
		});
	};

	onMount(async () => {
		await getAPIConfig();
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

<main class = "py-8">
	<form
		method="POST"
		on:submit={submitForm}
		on:input={() => isFormChanged = true}
		class="space-y-6"
	>
		<div class="border-b border-gray-900/10 pb-12 space-y-4">
			<div>
				<label
					for="unsplash_access_key"
					class = "block text-sm font-medium leading-6 text-gray-900"
				>
					Unsplash Access Key
				</label>
				<input
					type="text"
					id="unsplash_access_key"
					name="unsplash_access_key"
					bind:value={API.UNSPLASH_ACCESS_KEY}
					class="font-mono text-gray-900 ring-gray-300 placeholder:text-gray-400 focus:ring-indigo-600 block w-full rounded-md border-0 py-1.5 px-2 shadow-sm ring-1 ring-inset focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6"
				/>
				<p
					class="mt-2 text-sm text-gray-500"
				>
					{$t('api-unsplash')}
				</p>
			</div>
			<div>
				<label
					for="unsplash_secret_key"
					class = "block text-sm font-medium leading-6 text-gray-900"
				>
					Unsplash Secret Key
				</label>
				<input
					type="text"
					id="unsplash_secret_key"
					name="unsplash_secret_key"
					bind:value={API.UNSPLASH_SECRET_KEY}
					class="font-mono text-gray-900 ring-gray-300 placeholder:text-gray-400 focus:ring-indigo-600 block w-full rounded-md border-0 py-1.5 px-2 shadow-sm ring-1 ring-inset focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6"
				/>
			</div>
		</div>
		<div>
			<label
				for="mapbox"
				class = "block text-sm font-medium leading-6 text-gray-900"
			>
				Mapbox
			</label>
			<input
				type="text"
				id="mapbox"
				name="mapbox"
				bind:value={API.MAPBOX}
				class="font-mono text-gray-900 ring-gray-300 placeholder:text-gray-400 focus:ring-indigo-600 block w-full rounded-md border-0 py-1.5 px-2 shadow-sm ring-1 ring-inset focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6"
			/>
			<p
				class="mt-2 text-sm text-gray-500"
			>
				{$t('api-mapbox')}
			</p>
		</div>
		<div>
			<label
				for="perspective"
				class = "block text-sm font-medium leading-6 text-gray-900"
			>
				Perspective
			</label>
			<input
				type="text"
				id="perspective"
				name="perspective"
				bind:value={API.PERSPECTIVE}
				class="font-mono text-gray-900 ring-gray-300 placeholder:text-gray-400 focus:ring-indigo-600 block w-full rounded-md border-0 py-1.5 px-2 shadow-sm ring-1 ring-inset focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6"
			/>
			<p
				class="mt-2 text-sm text-gray-500"
			>
				{$t('api-perspective')}
			</p>
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
