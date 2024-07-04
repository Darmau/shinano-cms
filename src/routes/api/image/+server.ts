import { error, type RequestHandler } from '@sveltejs/kit';
import { WORKERS_TOKEN, WORKERS_URL } from '$env/static/private';
import getDateFormat from '$lib/functions/dateFormat';

interface WorkerResponse {
	storage_key: string;
	location: string;
	taken_at: string;
	exif: JSON;
}

export const POST: RequestHandler = async({ request, locals: { supabase} }) => {
	// 接收一个file
	const formData = await request.formData();
	const file = formData.get('file') as File;
	const width = formData.get('width') as string;
	const height = formData.get('height') as string;

	if (!file) {
		return new Response('Bad request: Missing `file`', { status: 400 });
	}

	// 请求workers，上传文件，获得存储的key以及exif
	const workersResponse: WorkerResponse = await fetch(`${WORKERS_URL}/r2`, {
		method: 'POST',
		headers: {
			'Authorization': `Bearer ${WORKERS_TOKEN}`,
		},
		body: formData
	}).then(res => res.json())
	.catch(err => {
		console.error(err);
		error(502, 'Error uploading file');
	});

	const dateString = new Date().toISOString();

	// 存储到supabase
	const { data, error: saveDataError } = await supabase.from('image').insert({
		folder: 'default',
		file_name: file.name,
		storage_key: workersResponse.storage_key,
		location: workersResponse.location,
		taken_at: workersResponse.taken_at,
		exif: workersResponse.exif,
		date: getDateFormat(dateString, false),
		width,
		height,
		size: file.size,
		format: file.type.split('/')[1]
	}).select();

	if (saveDataError) {
		console.error(saveDataError);
		error(502, 'Error saving data');
	}

	// 返回完整的数据条目
	return new Response(JSON.stringify(data), {
		headers: { 'Content-Type': 'application/json' }
	});
}

export const DELETE: RequestHandler = async({ request, locals: { supabase } }) => {
	// 接收key数组
	const { keys }: { keys: string[] } = await request.json();

	// 请求workers，删除文件
	const deleteResponse = await fetch(`${WORKERS_URL}/r2`, {
		method: 'DELETE',
		headers: {
			'Authorization': `Bearer ${WORKERS_TOKEN}`,
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({ keys })
	}).then(res => res.text())
	.catch(err => {
		console.error(err);
		error(502, 'Error deleting file');
	});

	// 从supabase删除
	const { error: deleteDataError } = await supabase.from('image').delete().in('storage_key', keys).select();

	if (deleteDataError) {
		console.error(deleteDataError);
		error(502, 'Error deleting data');
	}

	return new Response(deleteResponse, {
		headers: { 'Content-Type': 'text/plain' }
	});
}
