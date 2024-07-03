import { error, type RequestHandler } from '@sveltejs/kit';
import { WORKERS_TOKEN, WORKERS_URL } from '$env/static/private';

export const POST: RequestHandler = async ({ request }) => {
	const { title } = await request.json();
	const promptObj = await fetch(`${WORKERS_URL}/kv`, {
		method: 'POST',
		headers: {
			'Authorization': `Bearer ${WORKERS_TOKEN}`,
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			keys: [
				"prompt_SLUG"
			]
		})
	}).then(res => res.json())
	.catch(err => {
		console.error(err);
		error(502, 'Error fetching prompt');
	});

	const prompt = promptObj[0].prompt_SLUG;

	const generatedSlug = await fetch(`${WORKERS_URL}/openai`, {
		method: 'POST',
		headers: {
			'Authorization': `Bearer ${WORKERS_TOKEN}`,
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			messages: [
				{ role: 'system', content: prompt },
				{ role: 'user', content: title },
			]
		})
	}).then(res => res.text())
	.catch(err => {
		console.error(err);
		error(502, 'Error generating slug');
	});

	return new Response(generatedSlug, {
		headers: { 'Content-Type': 'text/plain' }
	});
}
