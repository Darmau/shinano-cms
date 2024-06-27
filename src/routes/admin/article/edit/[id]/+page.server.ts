import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params , locals: {supabase}}) => {
	const articleId = params.id;

	// 获取文章数据
	const { data: articleData } = await supabase.from('article').select().eq('id', articleId).single();
	return {
		id: articleId,
		articleContent: articleData?.content,
	}
}
