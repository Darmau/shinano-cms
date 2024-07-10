import { error, type RequestHandler } from '@sveltejs/kit';
import { WORKERS_TOKEN, WORKERS_URL } from '$env/static/private';

export const POST: RequestHandler = async ({ request }) => {
	const { prefix, img_key } = await request.json();

	const generatedSlug = await fetch(`${WORKERS_URL}/img-alt`, {
		method: 'POST',
		headers: {
			'Authorization': `Bearer ${WORKERS_TOKEN}`,
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			key: `${prefix}/${img_key}`
		})
	}).then(res => res.text())
	.catch(err => {
		console.error(err);
		error(502, 'Error generating alt');
	});

	return new Response(generatedSlug, {
		headers: { 'Content-Type': 'text/plain' }
	});
}
