import { User } from '@kwa/database'
import { QueryFnArgs } from '~/api/query'

import { Pagination, PaginationArgs } from '~/types/pagination'

export const getUsersQuery = async ({ api, payload }: QueryFnArgs<PaginationArgs>) => {
  const { data } = await api.get<Pagination<User>>('/user/paginate', {
    params: payload
  })

  return data
}
