import type { Actions, PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';
import { URL_PREFIX } from '$env/static/private';

export const load: PageServerLoad = async ({ params, locals: { supabase } }) => {
	const categoryId = params.id;

	const { data: categoryData, error: categoryError } = await supabase
	.from('category')
	.select(`
	  id,
	  title,
	  slug,
	  description,
	  lang,
	  cover (id, alt, storage_key),
	  type`)
	.eq('id', categoryId)
	.single();

	const { data: languageData, error: languageError } = await supabase
	.from('language')
	.select('id, locale')
	.order('id', { ascending: true });

	if (categoryError || languageError) {
		const errorCode = Number(categoryError?.code || languageError?.code);
		const errorMessage = categoryError?.message || languageError?.message || 'Error';
		error(errorCode, { message: errorMessage });
	}

	return {
		prefix: URL_PREFIX,
		category: categoryData,
		languages: languageData
	};
};

export const actions: Actions = {
	update: async ({ params, request, locals: { supabase } }) => {
		const categoryId = params.id;
		const data = await request.formData();

		const title = data.get('title');
		const description = data.get('description');
		const slug = data.get('slug');
		const cover = Number(data.get('coverImageId'));
		const lang = Number(data.get('language'));
		const type = data.get('type');

		const { error: categoryError } = await supabase
		.from('category')
		.update({
			title,
			description,
			slug,
			cover,
			lang,
			type
		})
		.eq('id', categoryId);

		if (categoryError) {
			console.error(categoryError);
		}

		return {
			success: true
		};
	}

	// delete: async ({ request, locals: {supabase}}) => {}
};
