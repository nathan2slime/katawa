import Link from 'next/link'
import { z } from 'zod'

import { getCategoriesAction } from '~/api/actions/get-categories'
import { AppSidebar } from '~/components/app-sidebar'
import { Header } from '~/components/header'
import { ListCategories } from '~/components/list-categories'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from '~/components/ui/breadcrumb'
import { ScrollArea } from '~/components/ui/scroll-area'
import { SidebarInset, SidebarProvider } from '~/components/ui/sidebar'
import { Page } from '~/types'
import { PaginationArgs, SortOrder } from '~/types/pagination'

const schema = z.object({
  query: z.string().default(''),
  perPage: z.coerce.number().default(15),
  sortOrder: z.nativeEnum(SortOrder).default(SortOrder.ASC),
  sortField: z.string().default('createdAt'),
  page: z.coerce.number().default(1)
})

export const dynamic = 'force-dynamic'

const Categories: Page = async ({ searchParams }) => {
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

  const data = await getCategoriesAction(args)

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <Header>
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink asChild>
                  <Link href="#">Manager</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>

              <BreadcrumbSeparator className="hidden md:block" />

              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink asChild>
                  <Link href="/manager/categories">Categories</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </Header>
        <ScrollArea>
          <div className="flex group-has-[[data-collapsible=icon]]/sidebar-wrapper:pt-12 px-4 pt-16 flex-1 w-full h-screen flex-col gap-4">
            <ListCategories query={args.query || ''} categories={data} />
          </div>
        </ScrollArea>
      </SidebarInset>
    </SidebarProvider>
  )
}

export default Categories
