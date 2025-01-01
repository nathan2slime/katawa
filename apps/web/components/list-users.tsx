'use client'
import { User } from '@kwa/database'
import { UserCard } from '~/components/user-card'

import { Pagination } from '~/types/pagination'

type Props = {
  users: Pagination<User>
}

export const ListUsers = ({ users: { data } }: Props) => {
  return (
    <div className="flex flex-wrap gap-3">
      {data.map(e => (
        <UserCard loading key={e.id} user={e} onDelete={e => console.log(e)} onEdit={e => console.log(e)} onManage={e => console.log(e)} />
      ))}
    </div>
  )
}
