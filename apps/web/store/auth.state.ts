import { proxy } from 'valtio'

import { Session } from '@kwa/database'

export type AuthState<T = Session | null> = {
  logged: boolean
  session: T
}

export const storageKey = '@nbun/web'

const INITIAL: AuthState = {
  logged: false,
  session: null
}

export const authState = proxy<AuthState>(INITIAL)
