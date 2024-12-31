import { api } from '~/api/server'

import { SessionWithUser } from '~/types/auth.types'

export const getSesssionQuery = async () => {
  const { data } = await api.get<SessionWithUser>('/auth')

  return data
}
