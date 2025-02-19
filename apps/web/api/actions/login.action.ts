'use server'

import { env } from '@kwa/env'
import { parse } from 'cookie'
import { cookies } from 'next/headers'

import { api } from '~/api/server'
import { loginSchema } from '~/lib/schemas/login.schema'
import { SessionWithUser } from '~/types/auth'

// TODO: Just not making sense, it was a study of actions
export const loginAction = async (prev: unknown, payload: FormData) => {
  const { data, headers } = await api.post<SessionWithUser>('/auth/signin', loginSchema.parse(Object.fromEntries(payload.entries())))

  if (data) {
    const setCookie: string[] = headers['set-cookie'] || []
    const cookie = await cookies()

    const authCookie = setCookie.find(e => e.startsWith(env.AUTH_COOKIE))

    if (authCookie) {
      const authCookieParsed = parse(authCookie)

      const value = authCookieParsed.auth
      const expires = authCookieParsed.Expires
      const path = authCookieParsed.Path

      if (value && expires && path) {
        cookie.set({
          name: env.AUTH_COOKIE,
          value,
          path,
          expires: new Date(expires)
        })

        return { error: false, prev, message: 'Welcome' }
      }
    }
  }

  return { error: true, message: 'Invalid credentials' }
}
