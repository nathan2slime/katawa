'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { Role } from '@kwa/database'

import { Plus } from 'lucide-react'
import { useEffect, useState } from 'react'
import { HexColorPicker } from 'react-colorful'
import { useForm } from 'react-hook-form'

import { newRoleService } from '~/api/mutations/new-role.mutation'
import { SelectTagInput } from '~/components/select-tag-input'
import { Button } from '~/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '~/components/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '~/components/ui/form'
import { Input } from '~/components/ui/input'
import { Popover, PopoverContent, PopoverTrigger } from '~/components/ui/popover'
import { NewRoleFormValues, newRoleSchema } from '~/lib/schemas/new-role.schema'

type Props = {
  onCreate: (data: Role) => void
  permissions: string[]
}
export const NewRole = ({ onCreate, permissions }: Props) => {
  const [isOpen, setIsOpen] = useState(false)

  const form = useForm<NewRoleFormValues>({
    resolver: zodResolver(newRoleSchema),
    defaultValues: {
      color: '',
      permissions: [],
      name: ''
    }
  })

  const onSubmit = async (payload: NewRoleFormValues) => {
    const res = await newRoleService(payload)

    if (res) {
      setIsOpen(false)
      onCreate(res)
    }
  }

  useEffect(() => {
    form.reset({ color: '', permissions: [], name: '' })
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
          <DialogTitle>New Role</DialogTitle>
          <DialogDescription>Click save when you're done</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Manager" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="permissions"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Permissions</FormLabel>
                  <FormControl>
                    <SelectTagInput {...field} value={field.value} options={permissions.map(e => ({ label: e, value: e }))} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="color"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Color</FormLabel>
                  <FormControl>
                    <Popover>
                      <PopoverTrigger className="w-full">
                        <Input {...field} placeholder="#F4F4F4" />
                      </PopoverTrigger>
                      <PopoverContent className="p-0 w-fit border-0 overflow-hidden">
                        <HexColorPicker color={field.value} onChange={e => form.setValue('color', e, { shouldValidate: true })} />
                      </PopoverContent>
                    </Popover>
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
