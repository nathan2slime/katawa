'use server'

import { api } from '~/api/server'

import { Role } from '@kwa/database'
import { Pagination, PaginationArgs } from '~/types/pagination'

export const getRolesAction = async (args: PaginationArgs) => {
  const { data } = await api.get<Pagination<Role>>('/role/paginate', {
    params: args
  })

  return data
}
