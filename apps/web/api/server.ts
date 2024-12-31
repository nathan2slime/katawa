import { env } from '@kwa/env'
import axios from 'axios'
import { cookies, headers } from 'next/headers'

export const api = axios.create({
  baseURL: new URL('api', env.API_URL).toString(),
  withCredentials: true
})

api.interceptors.request.use(async req => {
  const cookie = await cookies()
  const store = (await headers()).get('store')

  req.headers.Cookie = cookie.toString()
  req.headers.store = store
  req.withCredentials = true

  return req
})

api.interceptors.response.use(
  response => response,
  () => Promise.resolve({ data: null })
)
