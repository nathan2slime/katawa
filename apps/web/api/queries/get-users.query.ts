import { Prisma } from '@kwa/database'

import { QueryFnArgs } from '~/api/query'
import { Pagination, PaginationArgs } from '~/types/pagination'

export type UserWithRole = Prisma.UserGetPayload<{
  include: {
    roles: true
  }
}>

export type UsersResponse = Pagination<UserWithRole>

export const getUsersQuery = async ({ api, payload }: QueryFnArgs<PaginationArgs>) => {
  const { data } = await api.get<Pagination<UserWithRole>>('/user/paginate', {
    params: payload
  })
  return data
}
