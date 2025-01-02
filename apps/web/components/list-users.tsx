'use client'

import { User } from '@kwa/database'
import { useRouter } from 'next/navigation'

import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '~/components/ui/pagination'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select'
import { UserCard } from '~/components/user-card'

import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Separator } from '~/components/ui/separator'
import { Pagination as PaginationResult, SortOrder } from '~/types/pagination'

import { Search } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '~/components/ui/alert'
import { debounce } from '~/lib/debounce'
import { NewUser } from '~/components/new-user'
import { useEffect, useState } from 'react'

type Props = {
  query: string
  users: PaginationResult<User>
}

export const ListUsers = ({ query, users: { data, pages, page, perPage, sortField, sortOrder } }: Props) => {
  const [users, setUsers] = useState(data)

  const router = useRouter()

  const buildPages = () => {
    const links = []

    for (let i = 1; i <= pages; i++) {
      links.push(
        <PaginationItem onClick={() => onSearch({ page: i, perPage, sortOrder, sortField, pages })} key={i}>
          <PaginationLink isActive={i === page}>{i}</PaginationLink>
        </PaginationItem>
      )
    }

    return links
  }

  const onSearch = (args: Record<string, unknown>) => {
    const data: Record<string, string> = { page: page.toString(), query, perPage: perPage.toString(), sortField, pages: pages.toString(), sortOrder, ...args }

    const searchParams = new URLSearchParams(data)

    router.push(`?${searchParams}`)
  }

  const handleChange = debounce((query: string) => onSearch({ query, page: 1 }), 300)

  useEffect(() => {
    setUsers(data)
  }, [data])

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
          <Select
            onValueChange={value => {
              onSearch({ perPage: value })
            }}
          >
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
        <Alert>
          <Search className="h-4 w-4" />
          <AlertTitle>Heads up!</AlertTitle>
          <AlertDescription className="italic">
            We couldn't find any results for your search: <b>"{query}"</b>. Please try a different keyword
          </AlertDescription>
        </Alert>
      ) : (
        users.map(e => <UserCard key={e.id} user={e} onDelete={e => console.log(e)} onEdit={e => console.log(e)} onManage={e => console.log(e)} />)
      )}

      <Separator className="my-2" />

      <div className="w-full flex justify-center">
        <Pagination>
          <PaginationContent>
            <PaginationItem onClick={() => onSearch({ page: (page > 1 ? page - 1 : 1).toString() })}>
              <PaginationPrevious />
            </PaginationItem>
            {buildPages()}
            <PaginationItem onClick={() => onSearch({ page: (page >= pages ? pages : page + 1).toString() })}>
              <PaginationNext />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  )
}
