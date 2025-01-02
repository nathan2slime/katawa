'use server'

import { api } from '~/api/server'

import { User } from '@kwa/database'
import { EditUserFormValues } from '~/lib/schemas/edit-user.schema'

export const editUserAction = async ({ id, ...payload }: EditUserFormValues) => {
  const { data } = await api.put<User>(`/user/update/${id}`, payload)

  return data
}
