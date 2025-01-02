import { Permission } from '@kwa/database'
import { HydrationBoundary, QueryClient, dehydrate } from '@tanstack/react-query'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'

import { refreshSessionMutation } from '~/api/mutations/refresh-session.mutation'
import { getMyRolesQuery } from '~/api/queries/get-my-roles.query'
import { getSesssionQuery } from '~/api/queries/get-session.query'
import { AuthProvider } from '~/components/auth-provider'
import { AppChildren } from '~/types'
import { SessionWithUser } from '~/types/auth'

export const AuthGuard = async ({ children }: AppChildren) => {
  const header = await headers()
  const pathname = header.get('x-pathname') as string
  const referer = header.get('referer') as string
  const client = new QueryClient()

  const path = pathname || new URL(referer).pathname

  const inAuthPage = path && path.includes('auth')

  let session: SessionWithUser | null = null

  session = await client.fetchQuery({
    queryKey: ['session'],
    queryFn: getSesssionQuery
  })

  if (!session)
    session = await client.fetchQuery({
      queryKey: ['refresh-session'],
      queryFn: refreshSessionMutation
    })

  if (!inAuthPage && !session) redirect('/auth/signing')

  const roles = await client.fetchQuery({
    queryKey: ['my-roles'],
    queryFn: getMyRolesQuery
  })

  const permissions: Permission[] = (roles || []).flatMap(role => role.permissions)

  return (
    <HydrationBoundary state={dehydrate(client)}>
      <AuthProvider state={{ session: session, permissions, logged: !!session }}>{children}</AuthProvider>
    </HydrationBoundary>
  )
}
