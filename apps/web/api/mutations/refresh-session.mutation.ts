import { api } from '~/api/server'
import { SessionWithUser } from '~/types/auth'

export const refreshSessionMutation = async () => {
  const { data } = await api.patch<SessionWithUser>('/auth/refresh')

  return data
}
