import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';
import { URL_PREFIX } from '$env/static/private';

export const load: PageServerLoad = async ({ params, locals: { supabase } }) => {
	const photoId = params.id;

	// 获取摄影数据 其中lang来自language表，需展开
	const { data: sourcePhoto, error: photoError } = await supabase
	.from('photo')
	.select(`
		  id,
		  title,
		  slug,
		  content_json,
		  content_html,
		  content_text,
		  abstract,
		  is_top,
		  is_draft,
		  is_featured,
		  lang,
		  topic,
		  published_at,
		  cover (id, alt, storage_key),
		  photo_image (order, image (id, alt, storage_key, caption))
		`)
	.eq('id', photoId)
	.single();

	if (photoError) {
		console.error('Error fetching photo data:', photoError);
		error(Number(photoError.code), { message: photoError.message });
	}

	const { data: allLanguages } = await supabase
	.from('language')
	.select('id, lang, locale');

	const currentLanguage = allLanguages?.find(lang => lang.id === sourcePhoto.lang);

	// 从photo_image表获取关联数据
	const photoContent = {
		id: sourcePhoto!.id,
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

	const categories = await supabase
	.from('category')
	.select('id, title, slug')
	.eq('lang', currentLanguage!.id)
	.eq('type', 'photo')
	.then(res => res.data);

	// 查询article表中除了当前语言版本的其他语言版本 查询slug相等但lang不等于currentLanguage.id的文章
	const otherVersions = await supabase
	.from('photo')
	.select('id, lang (id, lang, locale)')
	.eq('slug', sourcePhoto.slug)
	.neq('lang', currentLanguage!.id)
	.then(res => res.data);

	return {
		prefix: URL_PREFIX,
		currentLanguage,
		photoContent,
		categories,
		otherVersions,
		allLanguages
	};
};
