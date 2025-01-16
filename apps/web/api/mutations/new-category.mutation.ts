import { Category } from '@kwa/database'

import { api } from '~/api/client'

import { NewCategoryFormValues } from '~/lib/schemas/new-category.schema'

export const newCategoryService = async (payload: NewCategoryFormValues) => {
  const { data } = await api.post<Category>('/category/create', payload)

  return data
}
