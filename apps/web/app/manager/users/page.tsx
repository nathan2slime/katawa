import { QueryClient } from '@tanstack/react-query'
import Link from 'next/link'
import { getUsersQuery } from '~/api/queries/get-users.query'
import { api } from '~/api/server'

import { AppSidebar } from '~/components/app-sidebar'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from '~/components/ui/breadcrumb'
import { Separator } from '~/components/ui/separator'
import { SidebarInset, SidebarProvider, SidebarTrigger } from '~/components/ui/sidebar'
import { ListUsers } from '~/components/list-users'
import { PaginationArgs, SortOrder } from '~/types/pagination'

export const dynamic = 'force-dynamic'

const Users = async () => {
  const client = new QueryClient()

  const args: PaginationArgs = {
    page: 1,
    perPage: 12,
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
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
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
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <ListUsers users={data} />
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}

export default Users
