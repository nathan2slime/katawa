'use client'

import { AuthState } from '~/store/auth.state'
import { authState } from '~/store/auth.state'
import { AppChildren } from '~/types'

type Props = AppChildren<{
  state: AuthState
}>

export const AuthProvider = ({ state, children }: Props) => {
  authState.session = state.session
  authState.logged = state.logged

  return <>{children}</>
}