'use server'

import { api } from '~/api/server'

export const signoutMutation = async () => {
  const { data } = await api.post('/auth/signout')

  return data
}
