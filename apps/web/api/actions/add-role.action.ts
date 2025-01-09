'use server'

import { api } from '~/api/server'

import { UserWithRole } from '~/api/queries/get-users.query'

export const addRoleFromUserAction = async (userId: string, roleId: string) => {
  const { data } = await api.put<UserWithRole>(`/user/manage/add/${userId}/${roleId}`)

  return data
}
