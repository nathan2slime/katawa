'use client'

import { useRouter } from 'next/navigation'

import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '~/components/ui/pagination'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select'
import { UserCard } from '~/components/user-card'

import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Separator } from '~/components/ui/separator'
import { SortOrder } from '~/types/pagination'

import { Search } from 'lucide-react'
import { useEffect, useState } from 'react'
import { UserWithRole, UsersResponse } from '~/api/queries/get-users.query'
import { DeleteUser } from '~/components/delete-user'
import { EditUser } from '~/components/edit-user'
import { ManageUser } from '~/components/manage-user'
import { NewUser } from '~/components/new-user'
import { Alert, AlertDescription, AlertTitle } from '~/components/ui/alert'
import { debounce } from '~/lib/debounce'
import { cn } from '~/lib/utils'

type Props = {
  query: string
  users: UsersResponse
}

export const ListUsers = ({ query, users: { data, pages, page, perPage, sortField, sortOrder } }: Props) => {
  const [users, setUsers] = useState(data)
  const [userDeleted, setUserDeleted] = useState<string>()
  const [userUpdated, setUserUpdated] = useState<UserWithRole>()
  const [userManaged, setUserManaged] = useState<UserWithRole>()

  const router = useRouter()

  const onSearch = (args: Record<string, unknown>) => {
    const data: Record<string, string> = { page: page.toString(), query, perPage: perPage.toString(), sortField, pages: pages.toString(), sortOrder, ...args }

    const searchParams = new URLSearchParams(data)

    router.push(`?${searchParams}`)
  }

  const handleChange = debounce((query: string) => onSearch({ query, page: 1 }), 300)

  useEffect(() => {
    setUsers(data)
  }, [data])

  const totalPages = Array.from({ length: pages }, (_, i) => i + 1)

  const prevPage = page - 1 < 0 ? null : page - 1
  const nextPage = page + 1 >= pages ? null : page + 1

  return (
    <div className="flex flex-wrap gap-3 py-4 justify-center">
      <div className="flex flex-wrap w-full px-4 justify-between items-center gap-4">
        <Input type="text" placeholder="Pesquisar" onChange={e => handleChange(e.target.value)} className="w-fit flex-1 max-w-[300px]" />
        <div className="flex items-center gap-2 w-fit flex-2">
          <Select value={sortField} onValueChange={value => onSearch({ sortField: value })}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Ordenar por" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="firstName">First Name</SelectItem>
              <SelectItem value="email">Email</SelectItem>
              <SelectItem value="createdAt">Created At</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={() => onSearch({ sortOrder: sortOrder === SortOrder.ASC ? SortOrder.DESC : SortOrder.ASC })}>
            {sortOrder === SortOrder.ASC ? '↑' : '↓'}
          </Button>
          <Select onValueChange={value => onSearch({ perPage: value })}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder={perPage.toString()} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="15">15 </SelectItem>
              <SelectItem value="30">30 </SelectItem>
              <SelectItem value="45">40 </SelectItem>
              <SelectItem value="60">60</SelectItem>
            </SelectContent>
          </Select>

          <NewUser onCreate={e => setUsers([...users, e])} />
        </div>
      </div>
      <Separator className="my-2" />

      {users.length === 0 ? (
        <Alert className="mx-4">
          <Search className="h-4 w-4" />
          <AlertTitle>Heads up!</AlertTitle>
          <AlertDescription className="italic">
            We couldn't find any results for your search: <b>"{query}"</b>. Please try a different keyword
          </AlertDescription>
        </Alert>
      ) : (
        users.map(e => <UserCard key={e.id} user={e} onDelete={e => setUserDeleted(e.id)} onEdit={e => setUserUpdated(e)} onManage={e => setUserManaged(e)} />)
      )}

      <EditUser
        isOpen={!!userUpdated}
        onCreate={user => setUsers(users => users.map(e => (e.id === user.id ? user : e)))}
        data={userUpdated}
        onOpenChange={() => setUserUpdated(undefined)}
      />

      <DeleteUser
        onSuccess={userId => setUsers(users => users.filter(e => e.id !== userId))}
        open={!!userDeleted}
        userId={userDeleted}
        onOpenChange={() => setUserDeleted(undefined)}
      />

      {userManaged && (
        <ManageUser
          onComplete={user => setUsers(users => users.map(e => (e.id === user.id ? user : e)))}
          open={!!userManaged}
          onOpenChange={() => setUserManaged(undefined)}
          user={userManaged}
        />
      )}

      <Separator className="my-2" />

      <div className="flex w-full justify-center">
        <Pagination className="mt-4">
          <PaginationContent>
            <PaginationItem
              onClick={() => onSearch({ page: (page > 1 ? page - 1 : 1).toString() })}
              className={cn(prevPage ? 'pointer-events-auto' : 'pointer-events-none opacity-50')}
            >
              <PaginationPrevious href="#" />
            </PaginationItem>
            {totalPages.map((e, index) => {
              if (index < 2 || index >= totalPages.length - 2 || (index >= page - 1 && index <= page + 1)) {
                return (
                  <PaginationItem
                    key={`${index}_user`}
                    className={cn(users.length > 0 ? 'pointer-events-auto' : 'pointer-events-none opacity-50')}
                    onClick={() =>
                      onSearch({
                        page: e,
                        perPage,
                        sortOrder,
                        sortField,
                        pages: totalPages
                      })
                    }
                  >
                    <PaginationLink isActive={e === page} href="#">
                      {e}
                    </PaginationLink>
                  </PaginationItem>
                )
              }

              if (index === 2 || index === totalPages.length - 3) {
                return (
                  <PaginationItem>
                    <PaginationEllipsis />
                  </PaginationItem>
                )
              }
            })}
            <PaginationItem
              className={cn(nextPage ? 'pointer-events-auto' : 'pointer-events-none opacity-50')}
              onClick={() =>
                onSearch({
                  page: (page >= pages ? pages : page + 1).toString()
                })
              }
            >
              <PaginationNext href="#" />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  )
}
