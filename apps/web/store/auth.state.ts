import { Permission } from '@kwa/database'
import { proxy } from 'valtio'

import { SessionWithUser } from '~/types/auth'

export type AuthState<T = SessionWithUser | null> = {
  logged: boolean
  session: T
  permissions: Permission[]
}

const INITIAL: AuthState = {
  logged: false,
  permissions: [],
  session: null
}

export const authState = proxy<AuthState>(INITIAL)
