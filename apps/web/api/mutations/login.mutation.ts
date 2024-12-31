import { QueryFnArgs } from '~/api/query'

import { LoginFormValues } from '~/lib/schemas/login'
import { SessionWithUser } from '~/types/auth.types'

export const loginMutation = async ({ api, payload }: QueryFnArgs<LoginFormValues>) => {
  const { data } = await api.post<SessionWithUser>('/auth/signin', payload)

  return data
}
