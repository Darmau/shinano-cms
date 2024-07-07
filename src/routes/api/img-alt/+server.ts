import { error, type RequestHandler } from '@sveltejs/kit';
import { WORKERS_TOKEN, WORKERS_URL } from '$env/static/private';

export const POST: RequestHandler = async ({ request }) => {
	const { prefix, img_key } = await request.json();
	const promptObj = await fetch(`${WORKERS_URL}/kv`, {
		method: 'POST',
		headers: {
			'Authorization': `Bearer ${WORKERS_TOKEN}`,
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			keys: [
				"prompt_IMAGE_ALT"
			]
		})
	}).then(res => res.json())
	.catch(err => {
		console.error(err);
		error(502, 'Error fetching prompt');
	});

	const prompt = promptObj[0].prompt_IMAGE_ALT;

	const generatedSlug = await fetch(`${WORKERS_URL}/openai`, {
		method: 'POST',
		headers: {
			'Authorization': `Bearer ${WORKERS_TOKEN}`,
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			messages: [
				{ role: 'system', content: prompt },
				{ role: 'user', content: [{
					  "type": "image_url",
						"image_url": {
						  "url": `${prefix}/cdn-cgi/image/format=jpeg,width=512/${prefix}/${img_key}`,
							"detail": "auto"
						}
					}]
				},
			],
			max_tokens: 120,
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
