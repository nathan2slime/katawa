import { Role } from '@kwa/database'
import { api } from '~/api/server'

export const getMyRolesQuery = async () => {
  const { data } = await api.get<Role[]>('/role/my')

  return data
}
