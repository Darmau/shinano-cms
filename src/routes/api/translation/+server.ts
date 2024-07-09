import { error, type RequestHandler } from '@sveltejs/kit';
import { WORKERS_TOKEN, WORKERS_URL } from '$env/static/private';

export const POST: RequestHandler = async ({ request }) => {
	const { lang, content } = await request.json();
	const promptObj = await fetch(`${WORKERS_URL}/kv`, {
		method: 'POST',
		headers: {
			'Authorization': `Bearer ${WORKERS_TOKEN}`,
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			keys: [
				"prompt_TRANSLATION"
			]
		})
	}).then(res => res.json())
	.catch(err => {
		console.error(err);
		error(502, 'Error fetching prompt');
	});

	const prompt = promptObj[0].prompt_TRANSLATION;
	const contentAndLang = `${lang} | ${content}`;

	const translatedHtml = await fetch(`${WORKERS_URL}/openai`, {
		method: 'POST',
		headers: {
			'Authorization': `Bearer ${WORKERS_TOKEN}`,
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			model: 'gpt-3.5-turbo',
			messages: [
				{ role: 'system', content: prompt },
				{ role: 'user', content: contentAndLang },
			]
		})
	}).then(res => res.text())
	.catch(err => {
		console.error(err);
		error(502, 'Error generating translation');
	});

	return new Response(translatedHtml, {
		headers: { 'Content-Type': 'text/plain' }
	});
}
