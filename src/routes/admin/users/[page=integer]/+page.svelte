<script lang="ts">
	export let data;
	let { supabase } = data;
	$: ({ supabase } = data);
</script>

<div>
	{JSON.stringify(data.users)}
</div>
