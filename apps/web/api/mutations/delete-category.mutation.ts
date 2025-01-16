'use server'
import { api } from '~/api/server'

type Payload = {
  id: string
}

export const deleteCategoryService = async ({ id }: Payload) => {
  const { data } = await api.delete<Payload>(`/category/delete/${id}`)

  return data
}
