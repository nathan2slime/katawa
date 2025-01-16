'use client'

import dynamic from 'next/dynamic'
import { useState } from 'react'
import { deleteCategoryService } from '~/api/mutations/delete-category.mutation'

import { Button } from '~/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '~/components/ui/dialog'

type Props = {
  open: boolean
  categories: string[]
  onSuccess: (roles: string[]) => unknown
  onOpenChange: (isOpen: boolean) => unknown
}

const Loading = dynamic(async () => (await import('~/components/loading')).Loading)

export const DeleteCategory = ({ open, onOpenChange, onSuccess, categories }: Props) => {
  const [isLoading, setIsLoading] = useState(false)

  const handleDelete = async () => {
    if (categories.length) {
      setIsLoading(true)
      await Promise.all(categories.map(id => deleteCategoryService({ id })))

      setIsLoading(false)
      onOpenChange(false)

      onSuccess(categories)
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
