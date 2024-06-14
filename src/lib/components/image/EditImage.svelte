<script lang="ts">
	import { t } from '$lib/functions/i18n';
	import { getToastStore } from '@skeletonlabs/skeleton';
	import { invalidateAll } from '$app/navigation'

	export let data;
	let { supabase } = data;
	$: ({ supabase } = data);
	export let imageData;
	export let closeEdit: () => void;

	const toastStore = getToastStore();

	// 将拍摄时间处理为可读格式
	imageData.taken_at = imageData.taken_at ?
		imageData.taken_at.toString().slice(0,16) :
		new Date().toISOString().slice(0, 16);

	function getISODate(date: string) {
		return new Date().toISOString();
	}

	// 该变量负责记录表单是否被修改，如果修改，则为true
	let isFormChanged = false;

	// 提交更新数据
	async function submitForm(event: Event) {
		event.preventDefault();
		const formData = new FormData(event.target as HTMLFormElement);
		const updatedImage = Object.fromEntries(formData.entries());

		const { error: updateError } = await supabase
		  .from('image')
		  .update({
				file_name: updatedImage.file_name,
				alt: updatedImage.alt,
				folder: updatedImage.folder,
				caption: updatedImage.caption,
				location: updatedImage.location,
				taken_at: updatedImage.taken_at
			})
		  .eq('id', imageData.id)
		  .select();

		if (updateError) {
			console.error(updateError);
			toastStore.trigger({
				message: 'Failed to update image.',
				hideDismiss: true,
				background: 'variant-filled-error'
			});
		}

		isFormChanged = false;
		closeEdit();
		invalidateAll();

		toastStore.trigger({
			message: 'Image updated successfully.',
			hideDismiss: true,
			background: 'variant-filled-success'
		});
	}
</script>

<div
	class = "relative z-50" aria-labelledby = "modal-title" role = "dialog"
	aria-modal = "true"
>

	<div
		class = "fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
	></div>

	<div class = "fixed inset-0 z-10 w-screen overflow-y-auto">
		<div
			class = "flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0"
		>
			<div
				class =
					"relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg md:max-w-3xl sm:p-6"
			>
				<div class = "">
					<h3
						class = "text-base font-semibold leading-6 text-gray-900"
						id = "modal-title"
					>{$t('edit-image')}</h3>
					<div class="mt-4 flex flex-col gap-4 md:grid md:grid-cols-3">
						<div>
							<img
								src =
									{`${data.prefix}/cdn-cgi/image/format=auto,width=720/${data.prefix}/${imageData.storage_key}`}
								class = "img-bg w-full aspect-square object-contain md:col-span-1"
								alt = {imageData.alt}
							/>
						</div>
						<form
							method="POST"
							class="flex flex-col gap-6 md:col-span-2"
							on:submit = {submitForm}
							on:input = {() => isFormChanged = true}
						>
							<div>
								<label
									for = "file_name"
									class = "block text-sm font-medium leading-6 text-gray-900"
								>
									{$t('file-name')}
								</label>
								<input
									type = "text"
									id = "file_name"
									name = "file_name"
									bind:value = {imageData.file_name}
									class="text-gray-900 ring-gray-300 placeholder:text-gray-400 focus:ring-indigo-600 block w-full rounded-md border-0 py-1.5 px-2 shadow-sm ring-1 ring-inset focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6"
								/>
							</div>
							<div>
								<label
									for = "alt"
									class = "block text-sm font-medium leading-6 text-gray-900"
								>
									{$t('alt-text')}
								</label>
								<input
									type = "text"
									id = "alt"
									name = "alt"
									bind:value = {imageData.alt}
									class="text-gray-900 ring-gray-300 placeholder:text-gray-400 focus:ring-indigo-600 block w-full rounded-md border-0 py-1.5 px-2 shadow-sm ring-1 ring-inset focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6"
								/>
								<small>{$t('alt-text-description')}</small>
							</div>
							<div>
								<label
									for = "folder"
									class = "block text-sm font-medium leading-6 text-gray-900"
								>
									{$t('folder')}
								</label>
								<input
									type = "text"
									id = "folder"
									name = "folder"
									bind:value = {imageData.folder}
									class="text-gray-900 ring-gray-300 placeholder:text-gray-400 focus:ring-indigo-600 block w-full rounded-md border-0 py-1.5 px-2 shadow-sm ring-1 ring-inset focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6"
								/>
							</div>
							<div>
								<label
									for = "caption"
									class = "block text-sm font-medium leading-6 text-gray-900"
								>
									{$t('image-caption')}
								</label>
								<input
									type = "text"
									id = "caption"
									name = "caption"
									bind:value = {imageData.caption}
									class="text-gray-900 ring-gray-300 placeholder:text-gray-400 focus:ring-indigo-600 block w-full rounded-md border-0 py-1.5 px-2 shadow-sm ring-1 ring-inset focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6"
								/>
							</div>
							<div>
								<label
									for = "taken_at"
									class = "block text-sm font-medium leading-6 text-gray-900"
								>
									{$t('shooting-time')}
								</label>
								<input
									type = "datetime-local"
									id = "taken_at"
									name = "taken_at"
									bind:value = {imageData.taken_at}
									on:change = {() => console.log(imageData.taken_at)}
									class="text-gray-900 ring-gray-300 placeholder:text-gray-400 focus:ring-indigo-600 block w-full rounded-md border-0 py-1.5 px-2 shadow-sm ring-1 ring-inset focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6"
								/>
							</div>
							<div>
								<label
									for = "location"
									class = "block text-sm font-medium leading-6 text-gray-900"
								>
									{$t('shooting-location')}
								</label>
								<input
									type = "text"
									id = "location"
									name = "location"
									bind:value = {imageData.location}
									class="text-gray-900 ring-gray-300 placeholder:text-gray-400 focus:ring-indigo-600 block w-full rounded-md border-0 py-1.5 px-2 shadow-sm ring-1 ring-inset focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6"
								/>
							</div>
							<div class = "mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
								<button
									type = "submit"
									disabled={!isFormChanged}
									class =
										"inline-flex w-full justify-center rounded-md bg-cyan-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-cyan-500 sm:ml-3 sm:w-auto disabled:bg-gray-200"
								>
									{$t('submit')}
								</button>
								<button
									type = "button"
									on:click = {closeEdit}
									class =
										"mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto "
								>{$t('cancel')}</button>
							</div>
						</form>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>

<style>
  .img-bg {
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' version='1.1' width='200' height='400'%3E%3Cdefs%3E%3Cpattern id='grid' width='20' height='20' patternUnits='userSpaceOnUse'%3E%3Crect fill='black' x='0' y='0' width='10' height='10' opacity='0.05'/%3E%3Crect fill='white' x='10' y='0' width='10' height='10'/%3E%3Crect fill='black' x='10' y='10' width='10' height='10' opacity='0.05'/%3E%3Crect fill='white' x='0' y='10' width='10' height='10'/%3E%3C/pattern%3E%3C/defs%3E%3Crect fill='url(%23grid)' x='0' y='0' width='100%25' height='100%25'/%3E%3C/svg%3E");
  }
</style>
