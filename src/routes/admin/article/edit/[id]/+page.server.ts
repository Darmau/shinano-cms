import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	const articleId = params.id;
	return {
		id: articleId
	}
}
