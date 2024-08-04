<script lang = "ts">
	import { getToastStore } from '@skeletonlabs/skeleton';
	import Pagination from '$components/Pagination.svelte';
	import { invalidateAll } from '$app/navigation';
	import { localTime } from '$lib/functions/localTime';
	import { t } from '$lib/functions/i18n';

	export let data;
	let { supabase } = data;
	$: ({ supabase } = data);

	const toastStore = getToastStore();

	// 设为公开
	async function setPublic(id) {
		const { error: publicError } = await
			supabase.from('comment').update({ is_public: true }).eq('id', id);
		if (publicError) {
			toastStore.trigger({
				message: publicError.message,
				hideDismiss: true,
				background: 'variant-filled-error'
			});
		} else {
			toastStore.trigger({
				message: `成功设为公开`,
				hideDismiss: true,
				background: 'variant-filled-success'
			});
		}
		await invalidateAll();
	}

	// 设为屏蔽
	async function setBlock(id) {
		const { error: blockError } = await
			supabase.from('comment').update({ is_blocked: true }).eq('id', id);
		if (blockError) {
			toastStore.trigger({
				message: blockError.message,
				hideDismiss: true,
				background: 'variant-filled-error'
			});
		} else {
			toastStore.trigger({
				message: `成功设为屏蔽`,
				hideDismiss: true,
				background: 'variant-filled-success'
			});
		}
		await invalidateAll();
	}

	// 取消屏蔽
	async function cancelBlock(id) {
		const { error: cancelError } = await
			supabase.from('comment').update({ is_blocked: false }).eq('id', id);
		if (cancelError) {
			toastStore.trigger({
				message: cancelError.message,
				hideDismiss: true,
				background: 'variant-filled-error'
			});
		} else {
			toastStore.trigger({
				message: `成功取消屏蔽`,
				hideDismiss: true,
				background: 'variant-filled-success'
			});
		}
		await invalidateAll();
	}
</script>

<svelte:head>
	<title>{$t('comment')}</title>
</svelte:head>

<div class = "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
	{#each data.comments as comment}
		<div class = "rounded-md border p-3 flex flex-col gap-3" data-comment-id =
			{comment.id}>
			{#if comment.is_anonymous}
				<p class="text-sm text-cyan-700 font-medium">{$t('anonymous_comment')}</p>
			{/if}
			<h2
				class="text-base font-medium text-zinc-800">{comment.user_id.name}</h2>
			<p class="text-lg text-zinc-800">{comment.content_text}</p>

			{#if comment.to_article}
				<h3
					class="font-medium text-cyan-600 text-base">{comment.to_article.title}</h3>
			{:else if comment.to_photo}
				<h3
					class="font-medium text-cyan-600 text-base">{comment.to_photo.title}</h3>
			{:else if comment.to_thought}
				<h3
					class="font-medium text-cyan-600 text-base">{comment.to_thought.content_text}</h3>
			{/if}

			<time class="text-sm text-zinc-500">{localTime(comment.created_at)}</time>
			<div class="mt-auto space-x-2">
				{#if comment.is_public === false}
					<button
						class="p-2 rounded bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700"
						on:click = {() => setPublic(comment.id)}
					>
						{$t('set_public')}
					</button>
				{/if}
				{#if comment.is_blocked === false}
					<button
						class="p-2 rounded bg-red-700 text-white text-sm font-medium hover:bg-red-800"
						on:click = {() => setBlock(comment.id)}
					>
						{$t('block_comment')}
					</button>
				{:else}
					<button
						class="p-2 rounded bg-green-600 text-white text-sm font-medium hover:bg-green-700"
						on:click = {() => cancelBlock(comment.id)}
					>
						{$t('unblock_comment')}
					</button>
				{/if}
			</div>

		</div>
	{/each}
</div>

<Pagination
	count = {data.count} page = {data.page} limit = {data.limit}
	path = {data.path}
/>
