import type { PageServerLoad } from './$types';
import getDateFormat from '$lib/functions/dateFormat';

export const load: PageServerLoad = async ({ url, fetch, locals: { supabase }}) => {
	const storageKeys = await fetch('/api/kv', {
		method: 'POST',
		body: JSON.stringify({ keys: ['config_URL_PREFIX']})
	}).then(res => res.json());

	const copyFromId= url.searchParams.get('from');
	const targetLangId = url.searchParams.get('lang');

	// 判断文章是全新的还是创建的其他语言版本
	const isCompleteNew = !copyFromId && !targetLangId;

	let currentLanguage;
	let articleContent;
	let categories;
	let otherVersions;

	const {data: allLanguages} = await supabase
	.from('language')
	.select('id, lang, locale');

	if (isCompleteNew) {
		// 从language表中获取is_default为true的语言
		currentLanguage = await supabase
		.from('language')
		.select('id, lang')
		.eq('is_default', true)
		.single()
		.then(res => res.data);

		// 根据defaultLanguage.data.id在category表中获取type为article的分类
		const defaultLanguageId = currentLanguage?.id ?? 1;
		categories = await supabase
		.from('category')
		.select('id, title, slug')
		.eq('lang', defaultLanguageId)
		.eq('type', 'article')
		.then(res => res.data);

		otherVersions = [];

		articleContent = {
			title: 'title',
			subtitle: '',
			slug: getDateFormat(),
			abstract: '',
			is_top: false,
			is_draft: true,
			is_featured: false,
			is_premium: false,
			lang: defaultLanguageId,
			content_json: {
				"type": "doc",
				"content": [
					{
						"type": "paragraph",
						"content": [
							{
								"type": "text",
								"text": "开始书写你的文章吧"
							}
						]
					}
				]
			},
			content_html: '<p>开始书写你的文章吧</p>',
			content_text: '开始书写你的文章吧',
		}
	} else {
		currentLanguage = allLanguages?.find(lang => lang.id === Number(targetLangId));

		const { data: sourceArticle, error} = await supabase
			.from('article')
		  .select(`
		    title, 
		    subtitle, 
		    slug, 
		    abstract, 
		    is_top, 
		    is_draft, 
		    is_featured, 
		    is_premium, 
		    content_json,
		    content_html, 
		    content_text, 
		    lang,
		    cover (id, alt, storage_key)
		  `)
		  .eq('id', copyFromId)
		  .single();

		if (error) {
			console.error(error);
		}

		articleContent = {
			title: sourceArticle!.title,
			subtitle: sourceArticle!.subtitle,
			slug: sourceArticle!.slug,
			abstract: sourceArticle!.abstract,
			is_top: sourceArticle!.is_top,
			is_draft: sourceArticle!.is_draft,
			is_featured: sourceArticle!.is_featured,
			is_premium: sourceArticle!.is_premium,
			lang: currentLanguage!.id,
			content_json:sourceArticle!.content_json,
			content_html: sourceArticle!.content_html,
			content_text: sourceArticle!.content_text,
			cover: sourceArticle!.cover
		}

		// 查询category表中type为article，lang为currentLanguage.id的分类
		categories = await supabase
		.from('category')
		.select('id, title, slug')
		.eq('lang', currentLanguage!.id)
		.eq('type', 'article')
		.then(res => res.data);

		// 查询article表中除了当前语言版本的其他语言版本 查询slug相等但lang不等于currentLanguage.id的文章
		otherVersions = await supabase
		  .from('article')
		  .select('id, lang (id, lang)')
		  .eq('slug', articleContent.slug)
		  .neq('lang', currentLanguage!.id)
		  .then(res => res.data);
	}

	return {
		prefix: storageKeys[0].config_URL_PREFIX,
		currentLanguage,
		articleContent,
		categories,
		otherVersions,
		allLanguages
	}
}
