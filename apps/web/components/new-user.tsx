'use client'

import { zodResolver } from '@hookform/resolvers/zod'

import { Plus } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { newUserAction } from '~/api/actions/new-user.action'
import { UserWithRole } from '~/api/queries/get-users.query'
import { Button } from '~/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '~/components/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '~/components/ui/form'
import { Input } from '~/components/ui/input'
import { NewUserFormValues, newUserSchema } from '~/lib/schemas/new-user.schema'

type Props = {
  onCreate: (data: UserWithRole) => void
}
export const NewUser = ({ onCreate }: Props) => {
  const [isOpen, setIsOpen] = useState(false)

  const form = useForm<NewUserFormValues>({
    mode: 'all',
    resolver: zodResolver(newUserSchema),
    defaultValues: {
      email: '',
      firstName: '',
      lastName: '',
      password: ''
    }
  })

  const onSubmit = async (payload: NewUserFormValues) => {
    const res = await newUserAction(payload)

    if (res) {
      setIsOpen(false)
      onCreate({ ...res, roles: [] })
    }
  }

  useEffect(() => {
    form.reset({ email: '', firstName: '', lastName: '', password: '' })
  }, [isOpen])

  const { isValid } = form.formState

  return (
    <Dialog open={isOpen} onOpenChange={e => setIsOpen(e)}>
      <DialogTrigger asChild>
        <Button variant="default">
          <Plus />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>New User</DialogTitle>
          <DialogDescription>Click save when you're done</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="flex gap-2 items-start">
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
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Senha</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="******" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button onClick={() => setIsOpen(false)} type="reset" variant="outline" className="font-semibold">
                Cancel
              </Button>
              <Button type="submit" disabled={!isValid}>
                Save changes
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
