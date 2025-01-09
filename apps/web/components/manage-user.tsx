import { useEffect, useState } from 'react'
import { addRoleFromUserAction } from '~/api/actions/add-role.action'
import { getRolesAction } from '~/api/actions/get-roles.action'
import { removeRoleFromUserAction } from '~/api/actions/remove-role.action'

import { UserWithRole } from '~/api/queries/get-users.query'
import { FancyBox, Item } from '~/components/fancy-box'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '~/components/ui/dialog'
import { debounce } from '~/lib/debounce'
import { SortOrder } from '~/types/pagination'

type Props = {
  user: UserWithRole
  open: boolean
  onOpenChange: (value: boolean) => void
  onComplete: (user: UserWithRole) => void
}

export const ManageUser = ({ open, onOpenChange, onComplete, user }: Props) => {
  const [roles, setRoles] = useState(user.roles)
  const [selectedValues, setSelectedValues] = useState<Item[]>(user.roles.map(e => ({ color: e.color, label: e.name, value: e.id })))

  const onSearchRole = async (value: string) => {
    const res = await getRolesAction({ page: 1, perPage: 40, query: value, sortField: 'createdAt', sortOrder: SortOrder.ASC })

    if (res) {
      const newRoles = res.data

      if (newRoles.length) {
        setRoles(newRoles)
      }
    }
  }

  const handleChange = debounce((value: string) => onSearchRole(value), 300)

  const values = roles.map(role => {
    return {
      color: role.color,
      label: role.name,
      value: role.id
    }
  })

  useEffect(() => {
    handleChange('')
  }, [])

  const onSave = async (values: Item[], id: string, status: 'deleted' | 'created') => {
    setSelectedValues(values)

    if (status === 'created') {
      await addRoleFromUserAction(user.id, id)
    } else {
      await removeRoleFromUserAction(user.id, id)
    }

    onComplete({ ...user, roles: roles.filter(role => values.find(({ value }) => value === role.id)) })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Manage User</DialogTitle>
          <DialogDescription>Click save when you're done</DialogDescription>
        </DialogHeader>

        <FancyBox selectedValues={selectedValues} setSelectedValues={onSave} setInputValue={handleChange} values={values} />
      </DialogContent>
    </Dialog>
  )
}
