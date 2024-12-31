import { QueryFnArgs } from '~/api/query'

import { LoginFormValues } from '~/lib/schemas/login'

export const loginMutation = async ({ api, payload, store }: QueryFnArgs<LoginFormValues>) => {
  const { data } = await api.post('/auth/signin', payload, { headers: { store } })

  return data
}
