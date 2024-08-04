import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals: { supabase } }) => {
	// 在message查询未读消息数
	const {count: message} = await supabase
	.from('message')
	.select('count', { count: 'exact' })
	.eq('is_read', false)

	const {count: comment} = await supabase
	  .from('comment')
	  .select('count', { count: 'exact' })
	  .eq('is_public', false)

	return {
		message_count: message ?? 0,
		comment_count: comment ?? 0
	}
}
