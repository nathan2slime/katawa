import { Request } from 'express'
import { SessionWithUser } from '~/app/session/session.types'

export type AppRequest = Request & {
  user: SessionWithUser
  store: string | undefined
  cookies: Record<string, { refreshToken: string; sessionToken: string }>
}
