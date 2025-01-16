'use server'

import { api } from '~/api/server'

import { Category } from '@kwa/database'
import { Pagination, PaginationArgs } from '~/types/pagination'

export const getCategoriesAction = async (args: PaginationArgs) => {
  const { data } = await api.get<Pagination<Category>>('/category/paginate', {
    params: args
  })

  return data
}
