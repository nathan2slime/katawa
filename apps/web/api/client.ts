import { env } from '@kwa/env'
import axios, { AxiosError } from 'axios'
import toast from 'react-hot-toast'

export const api = axios.create({
  baseURL: new URL('api', env.NEXT_PUBLIC_API_URL).toString(),
  withCredentials: true
})

api.interceptors.response.use(
  response => response,
  (error: AxiosError) => {
    const noNotifyPath = ['/api/auth', '/api/auth/refresh']

    if (error.response) {
      const data = error.response.data as Record<string, string>

      if (data) {
        if (data.path && noNotifyPath.includes(data.path)) return Promise.reject(error)

        toast.error(data.message)
      }
    } else {
      toast.error(error.message)
    }

    return Promise.reject(error)
  }
)
