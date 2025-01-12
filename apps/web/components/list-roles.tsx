'use client'

import { Permission, Role } from '@kwa/database'
import { ColumnDef, flexRender, getCoreRowModel, getSortedRowModel, useReactTable } from '@tanstack/react-table'
import { format } from 'date-fns'
import { ArrowUpDown, MoreHorizontal } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { proxy, useSnapshot } from 'valtio'
import { DeleteRole } from '~/components/delete-role'

import { EditRole } from '~/components/edit-role'
import { NewRole } from '~/components/new-role'

import { Badge } from '~/components/ui/badge'
import { Button } from '~/components/ui/button'
import { Checkbox } from '~/components/ui/checkbox'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '~/components/ui/dropdown-menu'
import { Input } from '~/components/ui/input'
import { Popover, PopoverContent, PopoverTrigger } from '~/components/ui/popover'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '~/components/ui/table'
import { debounce } from '~/lib/debounce'
import { Pagination } from '~/types/pagination'

type Props = {
  roles: Pagination<Role>
  query: string
  permissions: string[]
}

type RoleState = {
  updatedRole: Role | undefined
  deletedRoleIds: string[] | undefined
}

const proxyRoleState = proxy<RoleState>({
  updatedRole: undefined,
  deletedRoleIds: undefined
})

export const columns: ColumnDef<Role>[] = [
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
    accessorKey: 'name',
    header: 'Name',
    cell: ({ row }) => <div className="text-foreground">{row.getValue('name')}</div>
  },

  {
    accessorKey: 'permissions',
    header: 'Permissions',
    cell: ({ row }) => {
      const permissions: Permission[] = row.getValue('permissions') || []

      const isSized = permissions.length > 3
      const splited = permissions.slice(0, 3)

      return (
        <div className="gap-1 flex">
          {splited.map((permission, index) => (
            <Badge key={row.original.id + index} className="text-foreground" variant="outline">
              {permission}
            </Badge>
          ))}
          {isSized && (
            <Popover>
              <PopoverTrigger asChild>
                <Badge className="text-foreground cursor-pointer" variant="secondary">
                  More
                </Badge>
              </PopoverTrigger>

              <PopoverContent className="flex gap-1 flex-wrap">
                {permissions
                  .filter(e => !splited.includes(e))
                  .map((permission, index) => (
                    <Badge key={row.original.id + index} className="text-foreground" variant="outline">
                      {permission}
                    </Badge>
                  ))}
              </PopoverContent>
            </Popover>
          )}
        </div>
      )
    }
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
                  proxyRoleState.updatedRole = original
                }}
              >
                Edit
              </DropdownMenuItem>
            )}
            <DropdownMenuItem
              onClick={() => {
                if (selected.length > 0) {
                  proxyRoleState.deletedRoleIds = selected.map(row => row.original.id)
                } else {
                  proxyRoleState.deletedRoleIds = [original.id]
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

export const ListRoles = ({ query, roles: { data, sortField, sortOrder, page, pages, perPage }, permissions }: Props) => {
  const { updatedRole, deletedRoleIds } = useSnapshot(proxyRoleState)

  const [roles, setRoles] = useState<Role[]>(data)

  const router = useRouter()
  const table = useReactTable({
    data: roles,
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
    setRoles(data)
  }, [data])

  const handleChange = debounce((query: string) => onSearch({ query, page: 1 }), 300)

  const rows = table.getRowModel().rows

  return (
    <div className="w-full">
      <div className="flex items-center py-4 justify-between">
        <Input placeholder="Filter roles..." onChange={event => handleChange(event.target.value)} className="max-w-sm" />

        <NewRole permissions={permissions} onCreate={role => setRoles(prev => [...prev, role])} />
      </div>

      {updatedRole && (
        <EditRole
          onOpenChange={() => {
            proxyRoleState.updatedRole = undefined
          }}
          open={!!updatedRole}
          data={updatedRole as Role}
          onUpdated={role => setRoles(roles => roles.map(e => (e.id === role.id ? role : e)))}
          permissions={permissions}
        />
      )}

      {deletedRoleIds && deletedRoleIds.length > 0 && (
        <DeleteRole
          roles={deletedRoleIds}
          onOpenChange={() => {
            proxyRoleState.deletedRoleIds = undefined
          }}
          open={!!deletedRoleIds}
          onSuccess={deletedRoles => {
            table.resetRowSelection()
            setRoles(roles => roles.filter(role => !deletedRoles.includes(role.id)))
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
                <TableRow style={{ background: row.getIsSelected() ? 'hsl(var(--muted))' : `${row.original.color}10` }} key={row.id} data-state={row.getIsSelected() && 'selected'}>
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
