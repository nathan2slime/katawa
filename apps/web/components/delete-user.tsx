'use client'

import dynamic from 'next/dynamic'
import { useState } from 'react'
import { deleteUserAction } from '~/api/actions/delete-user.action'

import { Button } from '~/components/ui/button'
import { DialogFooter, DialogHeader, Dialog, DialogContent, DialogDescription, DialogTitle } from '~/components/ui/dialog'

type Props = {
  open: boolean
  userId?: string
  onSuccess: (userId: string) => unknown
  onOpenChange: (isOpen: boolean) => unknown
}

const Loading = dynamic(async () => (await import('~/components/loading')).Loading)

export const DeleteUser = ({ open, onOpenChange, onSuccess, userId }: Props) => {
  const [isLoading, setIsLoading] = useState(false)

  const handleDelete = async () => {
    if (userId) {
      setIsLoading(true)
      await deleteUserAction(userId)

      setIsLoading(false)
      onOpenChange(false)

      onSuccess(userId)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you absolutely sure?</DialogTitle>
          <DialogDescription>This action cannot be undone. This will permanently delete this user and remove your data from our servers.</DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button type="submit" onClick={handleDelete}>
            {isLoading ? <Loading name="cardio" size="22" speed="2" /> : 'Confirm'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
