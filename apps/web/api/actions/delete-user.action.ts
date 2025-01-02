'use server'

import { api } from '~/api/server'

export const deleteUserAction = async ( id: string) => {
  const { status } = await api.delete(`/user/remove/${id}`)

  return status === 200
}
