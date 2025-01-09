'use server'

import { api } from '~/api/server'

import { UserWithRole } from '~/api/queries/get-users.query'

export const removeRoleFromUserAction = async (userId: string, roleId: string) => {
  const { data } = await api.delete<UserWithRole>(`/user/manage/remove/${userId}/${roleId}`)

  return data
}
