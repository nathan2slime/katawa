'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'

import { useForm } from 'react-hook-form'
import { editUserAction } from '~/api/actions/edit-user.action'
import { UserWithRole } from '~/api/queries/get-users.query'

import { Button } from '~/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '~/components/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '~/components/ui/form'
import { Input } from '~/components/ui/input'
import { EditUserFormValues, editUserSchema } from '~/lib/schemas/edit-user.schema'

type Props = {
  data?: UserWithRole
  isOpen: boolean
  onOpenChange: (value: boolean) => void
  onCreate: (data: UserWithRole) => void
}

export const EditUser = ({ onCreate, data, isOpen, onOpenChange }: Props) => {
  const form = useForm<EditUserFormValues>({
    resolver: zodResolver(editUserSchema),
    mode: 'all',
    defaultValues: {
      email: data?.email,
      id: data?.id,
      firstName: data?.firstName,
      lastName: data?.lastName
    }
  })

  useEffect(() => {
    data && form.reset(data)
  }, [data])

  const onSubmit = async (payload: EditUserFormValues) => {
    const res = await editUserAction(payload)

    if (res) {
      onOpenChange(false)
      onCreate(res)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit User</DialogTitle>
          <DialogDescription>Click save when you're done</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="flex gap-2 items-center">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Viktor" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="seu@email.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button onClick={() => onOpenChange(false)} type="reset" variant="outline" className="font-semibold">
                Cancel
              </Button>
              <Button type="submit">Save changes</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
