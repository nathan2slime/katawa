'use client'

import { User } from '@kwa/database'
import { useRouter } from 'next/navigation'

import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '~/components/ui/pagination'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select'
import { UserCard } from '~/components/user-card'

import { Separator } from '~/components/ui/separator'
import { Pagination as PaginationResult } from '~/types/pagination'

type Props = {
  users: PaginationResult<User>
}

export const ListUsers = ({ users: { data, pages, page, perPage, sortField, sortOrder } }: Props) => {
  const router = useRouter()

  const buildPages = () => {
    const links = []

    for (let i = 1; i <= pages; i++) {
      links.push(
        <PaginationItem key={i}>
          <PaginationLink href={buildUrl({ page: i, perPage, sortOrder, sortField, pages })} isActive={i === page}>
            {i}
          </PaginationLink>
        </PaginationItem>
      )
    }

    return links
  }

  const buildUrl = (args: Record<string, string | number>) => {
    return Object.keys(args).reduce((acc, item, index) => `${index === 0 ? '?' : `${acc}&`}${item}=${args[item]}`, '')
  }

  return (
    <div className="flex flex-wrap gap-3 p-4 justify-center">
      {data.map(e => (
        <UserCard key={e.id} user={e} onDelete={e => console.log(e)} onEdit={e => console.log(e)} onManage={e => console.log(e)} />
      ))}

      <Separator className="my-2" />

      <div className="w-full flex justify-center">
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious href={buildUrl({ page: page > 1 ? page - 1 : 1, perPage, sortOrder, sortField, pages })} />
            </PaginationItem>
            {buildPages()}
            <PaginationItem>
              <PaginationNext href={buildUrl({ page: page >= pages ? pages : page + 1, perPage, sortOrder, sortField, pages })} />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
        <Select
          onValueChange={value => {
            router.push(buildUrl({ page, perPage: value, sortOrder, sortField, pages }))
          }}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Itens" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="15">15 </SelectItem>
            <SelectItem value="30">30 </SelectItem>
            <SelectItem value="45">40 </SelectItem>
            <SelectItem value="60">60</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
