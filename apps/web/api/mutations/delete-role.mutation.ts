import { api } from '~/api/client'

type Payload = {
  id: string
}

export const deleteRoleService = async ({ id }: Payload) => {
  const { data } = await api.delete<Payload>(`/role/delete/${id}`)

  return data
}
