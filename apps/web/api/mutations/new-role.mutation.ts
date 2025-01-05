import { api } from '~/api/client'

import { Role } from '@kwa/database'
import { NewRoleFormValues } from '~/lib/schemas/new-role.schema'

export const newRoleService = async (payload: NewRoleFormValues) => {
  const { data } = await api.post<Role>('/role/create', payload)

  return data
}
