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
					class="img-bg h-full w-full object-contain rounded"
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

<style>
	.img-bg {
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' version='1.1' width='200' height='400'%3E%3Cdefs%3E%3Cpattern id='grid' width='20' height='20' patternUnits='userSpaceOnUse'%3E%3Crect fill='black' x='0' y='0' width='10' height='10' opacity='0.1'/%3E%3Crect fill='white' x='10' y='0' width='10' height='10'/%3E%3Crect fill='black' x='10' y='10' width='10' height='10' opacity='0.1'/%3E%3Crect fill='white' x='0' y='10' width='10' height='10'/%3E%3C/pattern%3E%3C/defs%3E%3Crect fill='url(%23grid)' x='0' y='0' width='100%25' height='100%25'/%3E%3C/svg%3E");
	}
</style>
