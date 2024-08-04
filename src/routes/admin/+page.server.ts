import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals: { supabase } }) => {
	const { data, error } = await supabase
	.rpc('is_admin')
	if (error) console.error(error)

	// 在message查询未读消息数
	const {count} = await supabase
	  .from('message')
	  .select('count', { count: 'exact' })
	  .eq('is_read', false)

	return {
		is_admin: data ?? false,
		unread_message_count: count ?? 0
	}
}
