<script lang="ts">
import { t } from '$lib/functions/i18n';
import { onMount } from 'svelte';
import { getToastStore } from '@skeletonlabs/skeleton';
import { ProgressRadial } from '@skeletonlabs/skeleton';

const toastStore = getToastStore();

export let data;
let { supabase } = data;
$: ({ supabase } = data);

let STORAGE = {
	'S3_REGION': '',
	'S3_ENDPOINT': '',
	'S3_ACCESS_ID': '',
	'S3_SECRET_KEY': '',
	'S3_BUCKET': '',
	'S3_URL_PREFIX': ''
}

const KEYS = [
	'S3_REGION',
	'S3_ENDPOINT',
	'S3_ACCESS_ID',
	'S3_SECRET_KEY',
	'S3_BUCKET',
	'S3_URL_PREFIX'
]

// 从config表中获取S3配置 name, value
const getS3Config = async () => {
  const { data: storageKeys, error: fetchError } = await
		supabase.from('config').select('name, value').in('name', KEYS);

	if (fetchError) {
		console.error(fetchError);
		toastStore.trigger({
			message: "Failed to fetch S3 config.",
			hideDismiss: true,
			background: 'variant-filled-error'
		});
	}

	storageKeys.forEach(key => {
		if (key.name in STORAGE) {
			STORAGE[key.name] = key.value;
		}
	})
}

onMount(async () => {
	await getS3Config();
});

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

	await getS3Config();
}
</script>

<main class="py-8">
  <form
	  method="POST"
		on:submit={submitForm}
		class="space-y-6"
	>
		<div>
			<label
				for="s3_region"
				class = "block text-sm font-medium leading-6 text-gray-900"
			>
				Region
			</label>
			<input
				type="text"
				id="s3_region"
				name="s3_region"
				placeholder="S3 region, like us-west-1"
				bind:value={STORAGE.S3_REGION}
				required
				class="text-gray-900 ring-gray-300 placeholder:text-gray-400 focus:ring-indigo-600 block w-full rounded-md border-0 py-1.5 px-2 shadow-sm ring-1 ring-inset focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6"
			/>
		</div>
		<div>
			<label
				for="s3_endpoint"
				class = "block text-sm font-medium leading-6 text-gray-900"
			>
				Endpoint
			</label>
			<input
				type="text"
				id="s3_endpoint"
				name="s3_endpoint"
				placeholder="https://s3.us-west-1.amazonaws.com"
				bind:value={STORAGE.S3_ENDPOINT}
				required
				class="text-gray-900 ring-gray-300 placeholder:text-gray-400 focus:ring-indigo-600 block w-full rounded-md border-0 py-1.5 px-2 shadow-sm ring-1 ring-inset focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6"
			/>
    </div>
		<div>
			<label
				for="s3_access_id"
				class = "block text-sm font-medium leading-6 text-gray-900"
			>
				Access ID
			</label>
			<input
				type="text"
				id="s3_access_id"
				name="s3_access_id"
				placeholder="Access ID for S3 bucket"
				bind:value={STORAGE.S3_ACCESS_ID}
				required
				class="text-gray-900 ring-gray-300 placeholder:text-gray-400 focus:ring-indigo-600 block w-full rounded-md border-0 py-1.5 px-2 shadow-sm ring-1 ring-inset focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6"
			/>
		</div>
		<div>
			<label
				for="s3_secret_key"
				class = "block text-sm font-medium leading-6 text-gray-900"
			>
				Secret Key
			</label>
			<input
				type="text"
				id="s3_secret_key"
				name="s3_secret_key"
				placeholder="Secret Key for S3 bucket"
				bind:value={STORAGE.S3_SECRET_KEY}
				required
				class="text-gray-900 ring-gray-300 placeholder:text-gray-400 focus:ring-indigo-600 block w-full rounded-md border-0 py-1.5 px-2 shadow-sm ring-1 ring-inset focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6"
			/>
		</div>
		<div>
			<label
				for="s3_bucket"
				class = "block text-sm font-medium leading-6 text-gray-900"
			>
				Bucket
			</label>
			<input
				type="text"
				id="s3_bucket"
				name="s3_bucket"
				placeholder="Bucket Name"
				bind:value={STORAGE.S3_BUCKET}
				required
				class="text-gray-900 ring-gray-300 placeholder:text-gray-400 focus:ring-indigo-600 block w-full rounded-md border-0 py-1.5 px-2 shadow-sm ring-1 ring-inset focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6"
			/>
		</div>
		<div>
			<label
				for="s3_url_prefix"
				class = "block text-sm font-medium leading-6 text-gray-900"
			>
				URL Prefix
			</label>
			<input
				type="text"
				id="s3_url_prefix"
				name="s3_url_prefix"
				placeholder="URL Prefix for visit actual file"
				bind:value={STORAGE.S3_URL_PREFIX}
				required
				class="text-gray-900 ring-gray-300 placeholder:text-gray-400 focus:ring-indigo-600 block w-full rounded-md border-0 py-1.5 px-2 shadow-sm ring-1 ring-inset focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6"
			/>
		</div>
    <button
			type="submit"
			class =
				"rounded-md bg-cyan-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-cyan-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
		>
			{$t('submit')}
		</button>
	</form>
</main>
