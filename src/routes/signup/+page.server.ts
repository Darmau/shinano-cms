import { redirect } from '@sveltejs/kit'

import type { Actions } from './$types';
import { API } from '$env/static/private';

export const actions: Actions = {
	signup: async ({ request, locals: {  } }) => {
		const formData = await request.formData()
		const email = formData.get('email') as string
		const password = formData.get('password') as string
		const name = formData.get('name') as string

		await fetch(`${API}/auth/signup`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ email, password, name }),
		}).then((res) => res.json())
		console.log('注册成功')
		return redirect(303, '/signup/confirm')
	},
}
