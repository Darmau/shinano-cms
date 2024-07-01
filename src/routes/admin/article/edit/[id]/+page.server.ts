import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ fetch, params , locals: {supabase}}) => {
	const storageKeys = await fetch('/api/kv', {
		method: 'POST',
		body: JSON.stringify({ keys: ['config_URL_PREFIX']})
	}).then(res => res.json());

	const articleId = params.id;

	// 获取文章数据 其中lang来自language表，需展开
	const { data: articleData, error: articleError } = await supabase
		.from('article')
		.select(`
		  id,
		  title,
		  subtitle,
		  slug,
		  content_json,
		  content_html,
		  content_text,
		  abstract,
		  is_top,
		  is_draft,
		  is_featured,
		  is_premium,
		  lang,
		  published_at,
		  cover (id, alt, storage_key)
		`)
		.eq('id', articleId)
		.single();

	if (articleError) {
		console.error('Error fetching article data:', articleError);
		return {
			status: 500,
			error: new Error('Error fetching article data')
		}
	}

	const {data: allLanguages} = await supabase
	.from('language')
	.select('id, lang, locale')

	const currentLanguage = allLanguages?.find(lang => lang.id === articleData.lang);

	const categories = await supabase
	.from('category')
	.select('id, title, slug')
	.eq('lang', currentLanguage!.id)
	.eq('type', 'article')
	.then(res => res.data);

	// 查询article表中除了当前语言版本的其他语言版本 查询slug相等但lang不等于currentLanguage.id的文章
	const otherVersions = await supabase
	.from('article')
	.select('id, lang (id, lang, locale)')
	.eq('slug', articleData.slug)
	.neq('lang', currentLanguage!.id)
	.then(res => res.data);

	return {
		prefix: storageKeys[0].config_URL_PREFIX,
		currentLanguage,
		articleContent: articleData,
		categories,
		otherVersions,
		allLanguages
	}
}
