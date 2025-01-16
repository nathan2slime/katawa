import { Category } from '@kwa/database'

import { api } from '~/api/client'
import { NewCategoryFormValues } from '~/lib/schemas/new-category.schema'

export const updateCategoryService = async (id: string, payload: NewCategoryFormValues) => {
  const { data } = await api.put<Category>(`/category/update/${id}`, payload)

  return data
}
