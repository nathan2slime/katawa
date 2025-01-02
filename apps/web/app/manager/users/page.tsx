import { QueryClient } from '@tanstack/react-query'
import Link from 'next/link'
import { z } from 'zod'

import { getUsersQuery } from '~/api/queries/get-users.query'
import { api } from '~/api/server'

import { AppSidebar } from '~/components/app-sidebar'
import { Header } from '~/components/header'
import { ListUsers } from '~/components/list-users'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from '~/components/ui/breadcrumb'
import { ScrollArea } from '~/components/ui/scroll-area'
import { PaginationArgs, SortOrder } from '~/types/pagination'
import { SidebarInset, SidebarProvider } from '~/components/ui/sidebar'
import { Page } from '~/types'

export const dynamic = 'force-dynamic'

const schema = z.object({
  query: z.string().default(''),
  perPage: z.coerce.number().default(15),
  sortOrder: z.nativeEnum(SortOrder).default(SortOrder.ASC),
  sortField: z.string().default('createdAt'),
  page: z.coerce.number().default(1)
})

const Users: Page = async ({ searchParams }) => {
  const client = new QueryClient()

  const params = schema.safeParse(await searchParams)

  const args: PaginationArgs = params.success
    ? params.data
    : {
        page: 1,
        perPage: 15,
        query: '',
        sortField: 'createdAt',
        sortOrder: SortOrder.ASC
      }

  const data = await client.fetchQuery({
    queryKey: ['get-users'],
    queryFn: () =>
      getUsersQuery({
        api,
        payload: args
      })
  })

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <Header>
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink>
                  <Link href="#">Manager</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>

              <BreadcrumbSeparator className="hidden md:block" />

              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink>
                  <Link href="/manager/users">Users</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

        </Header>
        <ScrollArea>
          <div className="flex group-has-[[data-collapsible=icon]]/sidebar-wrapper:pt-12 pt-16 flex-1 w-full h-screen flex-col gap-4">
            <ListUsers query={args.query} users={data} />
          </div>
        </ScrollArea>
      </SidebarInset>
    </SidebarProvider>
  )
}

export default Users
