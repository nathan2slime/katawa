import { User } from '@kwa/database'
import { format } from 'date-fns'
import { Edit, MoreVertical, Settings, Trash } from 'lucide-react'

import { Button } from '~/components/ui/button'
import { Card, CardContent } from '~/components/ui/card'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '~/components/ui/dropdown-menu'
import { Separator } from '~/components/ui/separator'

type Props = {
  user: User
  onEdit: (user: User) => void
  onDelete: (user: User) => void
  onManage: (user: User) => void
  loading?: boolean
}

const Skeleton = () => (
  <Card className="w-full max-w-sm">
    <CardContent className="p-3">
      <div className="flex justify-between items-start gap-4">
        <div className="space-y-2 w-full">
          <div className="h-6 w-32 bg-accent-foreground/20 rounded animate-pulse" />
          <div className="h-1 mb-3 w-full bg-accent-foreground/20 rounded animate-pulse" />

          <div className="h-4 w-48 bg-accent-foreground/20 rounded animate-pulse" />
          <div className="h-3 w-24 bg-accent-foreground/20 rounded animate-pulse" />
        </div>

        <div className="h-8 w-8 bg-accent-foreground/20 rounded animate-pulse" />
      </div>
    </CardContent>
  </Card>
)

export const UserCard = ({ user, onEdit, onDelete, onManage, loading }: Props) => {
  if (loading) return <Skeleton />

  return (
    <Card className="w-full max-w-[320px]">
      <CardContent className="p-4">
        <div className="flex justify-between items-start gap-4">
          <div className="w-full">
            <h2 className="text-base font-bold truncate">{`${user.firstName} ${user.lastName}`}</h2>

            <Separator className="mb-3" />

            <p className="text-sm text-foreground">{user.email}</p>
            <p className="text-sm text-card-foreground mt-1">Created at: {format(user.createdAt, 'dd/MM/yyyy')}</p>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 flex-shrink-0 w-8 p-0">
                <span className="sr-only">Open</span>
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onEdit(user)}>
                <Edit className="mr-2 h-4 w-4" />
                <span>Edit</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onDelete(user)}>
                <Trash className="mr-2 h-4 w-4" />
                <span>Delete</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onManage(user)}>
                <Settings className="mr-2 h-4 w-4" />
                <span>Manage</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardContent>
    </Card>
  )
}
