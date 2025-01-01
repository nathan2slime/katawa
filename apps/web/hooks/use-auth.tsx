import { useSnapshot } from 'valtio'

import { authState } from '~/store/auth.state'
import { KwaNonNullable, SessionWithUser } from '~/types/auth'

export const useAuth = () => {
  const auth = useSnapshot(authState)

  return {
    ...auth,
    session: auth.session as KwaNonNullable<SessionWithUser, ['user']>
  }
}
