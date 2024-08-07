import { redirect, error } from '@sveltejs/kit'

import type { Actions } from '@sveltejs/kit'

export const actions: Actions = {
	default: async ({ request, locals: { supabase } }) => {
		const formData = await request.formData()
		const email = formData.get('email') as string
		const password = formData.get('password') as string

		const { error: AuthError } = await supabase.auth.signInWithPassword({ email, password })

		if (AuthError ) {
			error(AuthError.code, { message: AuthError.message });
		} else {
			return redirect(303, '/admin')
		}
	},
}
