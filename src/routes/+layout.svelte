<script>
	import { goto, invalidate } from '$app/navigation';
	import { onMount } from 'svelte';
	import '../app.css';
	import { initializeStores, Toast } from '@skeletonlabs/skeleton';

	initializeStores();

	export let data;
	let { supabase, session } = data;
	$: ({ session, supabase } = data);

	onMount(() => {
		const { data } = supabase.auth.onAuthStateChange((_, newSession) => {
			if (newSession?.expires_at !== session?.expires_at) {
				invalidate('supabase:auth');
			}
		});

		return () => data.subscription.unsubscribe();
	});
</script>

<Toast position="t" />
<slot />
