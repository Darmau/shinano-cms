import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals: { supabase } }) => {
	const { data, error } = await supabase
	.rpc('is_admin')
	if (error) console.error(error)

	return {
		is_admin: data ?? false
	}
}
