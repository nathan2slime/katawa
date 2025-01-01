import { Prisma } from '@kwa/database'

export type SessionWithUser = Prisma.SessionGetPayload<{
  include: {
    user: true
  }
}>

export type KwaNonNullable<T, K extends (keyof T)[]> = NonNullable<
  {
    [S in K[number]]: NonNullable<T[S]>
  } & {
    [P in Exclude<keyof T, K[number]>]: T[P]
  }
>
