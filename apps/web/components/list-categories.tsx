'use client'

import { Category } from '@kwa/database'
import { ColumnDef, flexRender, getCoreRowModel, getSortedRowModel, useReactTable } from '@tanstack/react-table'
import { format } from 'date-fns'
import { ArrowUpDown, MoreHorizontal } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { proxy, useSnapshot } from 'valtio'
import { DeleteCategory } from '~/components/delete-category'
import { EditCategory } from '~/components/edit-category'
import { NewCategory } from '~/components/new-category'

import { Button } from '~/components/ui/button'
import { Checkbox } from '~/components/ui/checkbox'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '~/components/ui/dropdown-menu'
import { Input } from '~/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '~/components/ui/table'
import { debounce } from '~/lib/debounce'
import { Pagination } from '~/types/pagination'

type Props = {
  categories: Pagination<Category>
  query: string
}

type CategoryState = {
  updatedCategory: Category | undefined
  deletedCategoryIds: string[] | undefined
}

const proxyCategoryState = proxy<CategoryState>({
  updatedCategory: undefined,
  deletedCategoryIds: undefined
})

export const columns: ColumnDef<Category>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate')}
        onCheckedChange={value => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => <Checkbox checked={row.getIsSelected()} onCheckedChange={value => row.toggleSelected(!!value)} aria-label="Select row" />,
    enableSorting: false,
    enableHiding: false
  },
  {
    accessorKey: 'title',
    header: 'Name',
    cell: ({ row }) => <div className="text-foreground">{row.getValue('title')}</div>
  },
  {
    accessorKey: 'createdAt',
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
          Created At
          <ArrowUpDown width={13} height={13} />
        </Button>
      )
    },
    enableSorting: true,
    cell: ({ row }) => <div className="lowercase">{format(row.getValue('createdAt'), 'dd/MM/yyyy')}</div>
  },
  {
    id: 'actions',
    enableHiding: false,
    cell: ({ row: { original }, table }) => {
      const selected = table.getSelectedRowModel().flatRows

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open</span>
              <MoreHorizontal />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Manage</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {selected.length <= 0 && (
              <DropdownMenuItem
                onClick={() => {
                  proxyCategoryState.updatedCategory = original
                }}
              >
                Edit
              </DropdownMenuItem>
            )}
            <DropdownMenuItem
              onClick={() => {
                if (selected.length > 0) {
                  proxyCategoryState.deletedCategoryIds = selected.map(row => row.original.id)
                } else {
                  proxyCategoryState.deletedCategoryIds = [original.id]
                }
              }}
            >
              Remove
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    }
  }
]

export const ListCategories = ({ query, categories: { data, sortField, sortOrder, page, pages, perPage } }: Props) => {
  const { updatedCategory, deletedCategoryIds } = useSnapshot(proxyCategoryState)

  const [categories, setCategories] = useState<Category[]>(data)

  const router = useRouter()
  const table = useReactTable({
    data: categories,
    getCoreRowModel: getCoreRowModel(),
    columns,
    enableSorting: true,
    getSortedRowModel: getSortedRowModel()
  })

  const onSearch = (args: Record<string, unknown>) => {
    const data: Record<string, string> = { page: page.toString(), query, perPage: perPage.toString(), sortField, pages: pages.toString(), sortOrder, ...args }

    const searchParams = new URLSearchParams(data)

    router.push(`?${searchParams}`)
  }

  useEffect(() => {
    setCategories(data)
  }, [data])

  const handleChange = debounce((query: string) => onSearch({ query, page: 1 }), 300)

  const rows = table.getRowModel().rows

  return (
    <div className="w-full">
      <div className="flex items-center py-4 justify-between">
        <Input placeholder="Filter categories..." onChange={event => handleChange(event.target.value)} className="max-w-sm" />

        <NewCategory onCreate={category => setCategories(prev => [...prev, category])} />
      </div>

      {updatedCategory && (
        <EditCategory
          onOpenChange={() => {
            proxyCategoryState.updatedCategory = undefined
          }}
          open={!!updatedCategory}
          data={updatedCategory}
          onUpdated={category => setCategories(categories => categories.map(e => (e.id === category.id ? category : e)))}
        />
      )}

      {deletedCategoryIds && deletedCategoryIds.length > 0 && (
        <DeleteCategory
          categories={deletedCategoryIds}
          onOpenChange={() => {
            proxyCategoryState.deletedCategoryIds = undefined
          }}
          open={!!deletedCategoryIds}
          onSuccess={deletedCategory => {
            table.resetRowSelection()
            setCategories(roles => roles.filter(role => !deletedCategory.includes(role.id)))
          }}
        />
      )}

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map(headerGroup => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map(header => {
                  return <TableHead key={header.id}>{header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}</TableHead>
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {rows && rows.length ? (
              rows.map(row => (
                <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                  {row.getVisibleCells().map(cell => (
                    <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="space-x-2">
          <Button variant="outline" size="sm" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
            Previous
          </Button>
          <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}
