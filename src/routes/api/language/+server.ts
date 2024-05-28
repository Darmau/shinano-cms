import type { RequestHandler } from '@sveltejs/kit';
import { error } from '@sveltejs/kit';

// 增加语言 须提供lang, locale
export const POST: RequestHandler = async (event) => {
	const { lang, locale } = await event.request.json();
	const { locals: { supabase } } = event;

	if (!lang || !locale) {
		error(400, 'lang and locale are required');
	}

	const { error: dataError } = await supabase
		.from('language')
	  .insert({ lang, locale });

	if (dataError) {
		error(500, dataError.message);
	}

	return new Response('Created', { status: 200 });
};

// 修改默认语言，须提供lang
export const PUT: RequestHandler = async (event) => {
	// /api/language/:lang
	const { lang } = event.params;
	const { locals: { supabase } } = event;

	if (!lang) {
		error(400, 'lang is required');
	}

	const { error: dataError } = await supabase
		.from('language')
		.update({ default: true })
		.eq('lang', lang);

	if (dataError) {
		error(500, dataError.message);
	}

	return new Response('Updated', { status: 200 });
};

// 删除语言，须提供lang
export const DELETE: RequestHandler = async (event) => {
	// /api/language/:lang
	const { lang } = event.params;
	const { locals: { supabase } } = event;

	if (!lang) {
		error(400, 'lang is required');
	}

	const { error: dataError } = await supabase
		.from('language')
		.delete()
		.eq('lang', lang);

	if (dataError) {
		error(500, dataError.message);
	}

	return new Response('Deleted', { status: 200 });
}
