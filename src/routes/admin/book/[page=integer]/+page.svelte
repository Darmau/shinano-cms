<script lang="ts">
	import { getToastStore } from '@skeletonlabs/skeleton';
	import PageTitle from '$components/PageTitle.svelte';
	import { t } from '$lib/functions/i18n';

	export let data;
	let { supabase } = data;
	$: ({ supabase } = data);

	const toastStore = getToastStore();
</script>

<svelte:head>
	<title>{$t('book')}</title>
</svelte:head>


<div>
	<PageTitle title="{$t('book')}" />
	<div>{JSON.stringify(data.books)}</div>
</div>
