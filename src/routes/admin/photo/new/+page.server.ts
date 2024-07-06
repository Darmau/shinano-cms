import type { PageServerLoad } from './$types';
import getDateFormat from '$lib/functions/dateFormat';
import { URL_PREFIX } from '$env/static/private';
import { error } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ url, locals: { supabase } }) => {
	const copyFromId = url.searchParams.get('from');
	const targetLangId = url.searchParams.get('lang');

	// 判断摄影是全新的还是创建的其他语言版本
	const isCompleteNew = !copyFromId && !targetLangId;

	let currentLanguage;
	let photoContent;
	let categories;
	let otherVersions;

	const { data: allLanguages } = await supabase
	.from('language')
	.select('id, lang, locale');

	if (isCompleteNew) {
		// 从language表中获取is_default为true的语言
		currentLanguage = await supabase
		.from('language')
		.select('id, lang, locale')
		.eq('is_default', true)
		.single()
		.then(res => res.data);

		// 根据defaultLanguage.data.id在category表中获取type为article的分类
		const defaultLanguageId = currentLanguage?.id ?? 1;
		categories = await supabase
		.from('category')
		.select('id, title, slug')
		.eq('lang', defaultLanguageId)
		.eq('type', 'photo')
		.then(res => res.data);

		otherVersions = [];

		const dateString = new Date().toISOString();

		photoContent = {
			title: 'title',
			slug: getDateFormat(dateString, false),
			abstract: '',
			is_top: false,
			is_draft: true,
			is_featured: false,
			lang: defaultLanguageId,
			topic: [],
			content_json: {
				'type': 'doc',
				'content': [
					{
						'type': 'paragraph',
						'content': [
							{
								'type': 'text',
								'text': '添加关于摄影的介绍'
							}
						]
					}
				]
			},
			content_html: '<p>添加关于摄影的介绍</p>',
			content_text: '添加关于摄影的介绍',
			photos: [],
			cover: null
		};
	} else {
		currentLanguage = allLanguages?.find(lang => lang.id === Number(targetLangId));

		// 从photo表获取数据
		const { data: sourcePhoto, error: sourceError } = await supabase
		.from('photo')
		.select(`
		    title, 
		    slug, 
		    abstract, 
		    is_top, 
		    is_draft, 
		    is_featured, 
		    content_json,
		    content_html, 
		    content_text, 
		    lang,
		    topic,
		    cover,
		    photo_image!inner (order, image (id, alt, storage_key, caption))
		  `)
		.eq('id', copyFromId)
		.single();

		if (sourceError) {
			console.error(error);
			error(500, { message: sourceError.message });
		}

		photoContent = {
			title: sourcePhoto!.title,
			slug: sourcePhoto!.slug,
			abstract: sourcePhoto!.abstract,
			is_top: sourcePhoto!.is_top,
			is_draft: sourcePhoto!.is_draft,
			is_featured: sourcePhoto!.is_featured,
			lang: currentLanguage!.id,
			content_json: sourcePhoto!.content_json,
			content_html: sourcePhoto!.content_html,
			content_text: sourcePhoto!.content_text,
			cover: sourcePhoto!.cover,
			photos: sourcePhoto.photo_image,
			topic: sourcePhoto!.topic
		};

		// 查询category表中type为article，lang为currentLanguage.id的分类
		categories = await supabase
		.from('category')
		.select('id, title, slug')
		.eq('lang', currentLanguage!.id)
		.eq('type', 'photo')
		.then(res => res.data);

		// 查询article表中除了当前语言版本的其他语言版本 查询slug相等但lang不等于currentLanguage.id的文章
		otherVersions = await supabase
		.from('photo')
		.select('id, lang (id, lang, locale)')
		.eq('slug', photoContent.slug)
		.neq('lang', currentLanguage!.id)
		.then(res => res.data);
	}

	return {
		prefix: URL_PREFIX,
		currentLanguage,
		photoContent,
		categories,
		otherVersions,
		allLanguages
	};
};
