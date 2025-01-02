'use server'

import { api } from '~/api/server'

import { User } from '@kwa/database'
import { NewUserFormValues } from '~/lib/schemas/new-user.schema'

export const newUserAction = async (payload: NewUserFormValues) => {
  const { data } = await api.post<User>('/user/create', payload)

  return data
}
