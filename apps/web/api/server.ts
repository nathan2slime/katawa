import { env } from '@kwa/env'
import axios from 'axios'
import { cookies } from 'next/headers'

export const api = axios.create({
  baseURL: new URL('api', env.API_URL).toString(),
  withCredentials: true
})

api.interceptors.request.use(async req => {
  const cookie = await cookies()

  req.headers.Cookie = cookie.toString()
  req.withCredentials = true

  return req
})

api.interceptors.response.use(
  async response => response,
  () => Promise.resolve({ data: null })
)
