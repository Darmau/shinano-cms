import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params , locals: {supabase}}) => {
	const articleId = params.id;

	// 获取文章数据 其中lang来自language表，需展开
	const { data: articleData } = await supabase
		.from('article')
		.select(`
		  id,
		  title,
		  slug,
		  subtitle,
		  content_json,
		  content_html,
		  content_text,
		  abstract,
		  lang (lang, locale)
		`)
		.eq('id', articleId)
		.single();
	return {
		id: articleId,
		articleContent: articleData!.content_json,
	}
}
