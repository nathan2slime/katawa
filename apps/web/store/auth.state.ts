import { Permission } from '@kwa/database'
import { proxy } from 'valtio'

import { SessionWithUser } from '~/types/auth.types'

export type AuthState<T = SessionWithUser | null> = {
  logged: boolean
  session: T
  permissions: Permission[]
}

export const storageKey = '@kwa/web'

const INITIAL: AuthState = {
  logged: false,
  permissions: [],
  session: null
}

export const authState = proxy<AuthState>(INITIAL)
