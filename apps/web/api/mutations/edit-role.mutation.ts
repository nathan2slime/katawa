import { Role } from '@kwa/database'


import { api } from '~/api/client'
import { NewRoleFormValues } from '~/lib/schemas/new-role.schema'

export const updateRoleService = async (id: string, payload: NewRoleFormValues) => {
  const { data } = await api.put<Role>(`/role/update/${id}`, payload)

  return data
}
