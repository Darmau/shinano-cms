<script lang="ts">
	import { fileSize } from '$lib/functions/fileSize';
	import { t } from '$lib/functions/i18n';
	import { localTime } from '$lib/functions/localTime';

	export let data;
</script>

<div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
	{#each data.images as image}
		<div
			data-image-id={image.id}
			class="bg-white border rounded-xl p-4 hover:shadow-md transition-all duration-150 space-y-2">
			<div class="object-contain aspect-square">
				<img
					src={`${data.prefix}/cdn-cgi/image/format=auto,width=480/${data.prefix}/${image.storage_key}`}
					class="h-full w-full object-contain bg-gray-100 rounded"
					alt={image.alt} />
			</div>
			<h3 class="font-medium">{image.file_name}</h3>
			<p class="bg-gray-50 p-2 rounded text-sm">{image.caption}</p>
			<p class="text-gray-700 text-sm">{image.alt}</p>
			<p>{$t('shooting-time')}: {localTime(image.taken_at)}</p>
			<small>
				<span>{image.width}</span>
				×
				<span>{image.height}</span>
				|
				<span>{fileSize(image.size)}</span>
			</small>
			<p class="text-sm">{image.location}</p>
		</div>
	{/each}
</div>
