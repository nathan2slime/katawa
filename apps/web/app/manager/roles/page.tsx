import Link from 'next/link'
import { z } from 'zod'

import { AppSidebar } from '~/components/app-sidebar'
import { Header } from '~/components/header'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from '~/components/ui/breadcrumb'
import { ScrollArea } from '~/components/ui/scroll-area'
import { SidebarInset, SidebarProvider } from '~/components/ui/sidebar'
import { ListRoles } from '~/components/list-roles'

import { Page } from '~/types'
import { PaginationArgs, SortOrder } from '~/types/pagination'
import { getRolesAction } from '~/api/actions/get-roles.action'

export const dynamic = 'force-dynamic'

const schema = z.object({
  query: z.string().default(''),
  perPage: z.coerce.number().default(15),
  sortOrder: z.nativeEnum(SortOrder).default(SortOrder.ASC),
  sortField: z.string().default('createdAt'),
  page: z.coerce.number().default(1)
})

const MyRoles: Page = async ({ searchParams }) => {
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

  const roles = await getRolesAction(args)

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
                  <Link href="/manager/roles">Roles</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </Header>
        <ScrollArea>
          <div className="flex group-has-[[data-collapsible=icon]]/sidebar-wrapper:pt-12 px-4 pt-16 flex-1 w-full h-screen flex-col gap-4">
            <ListRoles query={args.query || ''} roles={roles} />
          </div>
        </ScrollArea>
      </SidebarInset>
    </SidebarProvider>
  )
}

export default MyRoles
