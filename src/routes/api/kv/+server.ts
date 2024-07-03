import { error, type RequestHandler } from '@sveltejs/kit';
import { WORKERS_TOKEN, WORKERS_URL } from '$env/static/private';

// POST body: { keys: string[] }
export const POST: RequestHandler = async ({ request }) => {
	const { keys }: { keys: string[] } = await request.json();
	const keyValues = await fetch(`${WORKERS_URL}/kv`, {
		method: 'POST',
		headers: {
			'Authorization': `Bearer ${WORKERS_TOKEN}`,
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({ keys })
	}).then(res => res.json())
	.catch(err => {
		console.error(err);
		error(502, 'Error fetching key-values');
	});

	return new Response(JSON.stringify(keyValues), {
		headers: { 'Content-Type': 'application/json' }
	});
};

// PUT body: { kv: {key: value}[] }
export const PUT: RequestHandler = async ({ request }) => {
	const body = await request.json();
	const response = await fetch(`${WORKERS_URL}/kv`, {
		method: 'PUT',
		headers: {
			'Authorization': `Bearer ${WORKERS_TOKEN}`,
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(body)
	}).then(res => res.text());

	return new Response(response, {
		headers: { 'Content-Type': 'text/plain' }
	});
};

// DELETE body: { keys: string[] }
export const DELETE: RequestHandler = async ({ request }) => {
	const { keys }: { keys: string[] } = await request.json();
	const response = await fetch(`${WORKERS_URL}/kv`, {
		method: 'DELETE',
		headers: {
			'Authorization': `Bearer ${WORKERS_TOKEN}`,
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({ keys })
	}).then(res => res.text())
	.catch(err => {
		console.error(err);
		error(502, 'Error deleting key-values');
	});

	return new Response(response, {
		headers: { 'Content-Type': 'text/plain' }
	});
};
