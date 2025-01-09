'use server'

import { api } from '~/api/server'

import { UserWithRole } from '~/api/queries/get-users.query'
import { EditUserFormValues } from '~/lib/schemas/edit-user.schema'

export const editUserAction = async ({ id, ...payload }: EditUserFormValues) => {
  const { data } = await api.put<UserWithRole>(`/user/update/${id}`, payload)

  return data
}
