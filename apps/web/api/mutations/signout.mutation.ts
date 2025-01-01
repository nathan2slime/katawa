import { QueryFnArgs } from '~/api/query'

export const signoutMutation = async ({ api }: QueryFnArgs<undefined>) => {
  const { data } = await api.post('/auth/signout')

  return data
}
