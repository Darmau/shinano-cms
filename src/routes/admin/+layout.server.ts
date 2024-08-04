import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals: { supabase } }) => {
	// 在message查询未读消息数
	const {count} = await supabase
	.from('message')
	.select('count', { count: 'exact' })
	.eq('is_read', false)

	return {
		unread_message_count: count ?? 0
	}
}
