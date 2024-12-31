import { Prisma } from '@kwa/database'

export type SessionWithUser = Prisma.SessionGetPayload<{
  include: {
    user: true
  }
}>
