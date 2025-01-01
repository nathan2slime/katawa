import { QueryFnArgs } from '~/api/query'

import { LoginFormValues } from '~/lib/login.schema'
import { SessionWithUser } from '~/types/auth'

export const loginMutation = async ({ api, payload }: QueryFnArgs<LoginFormValues>) => {
  const { data } = await api.post<SessionWithUser>('/auth/signin', payload)

  return data
}
