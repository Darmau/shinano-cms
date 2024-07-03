import { redirect, type Handle } from '@sveltejs/kit';
import { createServerClient } from '@supabase/ssr'
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public'
import { sequence } from '@sveltejs/kit/hooks'

const supabase: Handle = async ({ event, resolve }) => {
	event.locals.supabase = createServerClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY, {
		cookies: {
			getAll: () => event.cookies.getAll(),
			setAll: (cookiesToSet) => {
				cookiesToSet.forEach(({ name, value, options }) => {
					event.cookies.set(name, value, { ...options, path: '/' })
				})
			},
		},
	})

	event.locals.safeGetSession = async () => {
		const {
			data: { session },
		} = await event.locals.supabase.auth.getSession()
		if (!session) {
			return { session: null, user: null }
		}

		const {
			data: { user },
			error,
		} = await event.locals.supabase.auth.getUser()

		if (error) {
			// JWT validation has failed
			return { session: null, user: null }
		}
		return { session, user }
	}

	return resolve(event, {
		filterSerializedResponseHeaders(name) {
			return name === 'content-range' || name === 'x-supabase-api-version'
		},
	})
}

const authGuard: Handle = async ({ event, resolve }) => {
	const { session, user } = await event.locals.safeGetSession()
	event.locals.session = session
	event.locals.user = user

	if (!event.locals.session) {
		if (event.url.pathname.startsWith('/auth/signup') || event.url.pathname.startsWith('/api/auth')) {
			return resolve(event)
		}
		if (!event.url.pathname.startsWith('/auth/login')) {
			return redirect(303, '/auth/login')
		}
	} else {
		if (event.url.pathname.startsWith('/auth')) {
			return redirect(303, '/admin')
		}
	}
	return resolve(event)
}

export const handle: Handle = sequence(supabase, authGuard)
