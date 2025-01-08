import { zodResolver } from '@hookform/resolvers/zod'
import { Role } from '@kwa/database'
import { useForm } from 'react-hook-form'
import { HexColorPicker } from 'react-colorful'

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '~/components/ui/form'
import { NewRoleFormValues, newRoleSchema } from '~/lib/schemas/new-role.schema'
import { Input } from '~/components/ui/input'
import { Popover, PopoverContent, PopoverTrigger } from '~/components/ui/popover'
import { SelectTagInput } from '~/components/select-tag-input'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '~/components/ui/dialog'
import { Button } from '~/components/ui/button'
import { updateRoleService } from '~/api/mutations/edit-role.mutation'

type Props = {
  data: Readonly<Role>
  open: boolean
  permissions: string[]
  onUpdated: (role: Role) => void
  onOpenChange: (e: boolean) => void
}

export const EditRole = ({ data, permissions, onUpdated, onOpenChange, open }: Props) => {
  const form = useForm<NewRoleFormValues>({
    mode: 'all',
    resolver: zodResolver(newRoleSchema),
    defaultValues: data
  })

  const onSubmit = async (e: NewRoleFormValues) => {
    const res = await updateRoleService(data.id, e)

    if (res) {
      onOpenChange(false)
      onUpdated(res)
    }
  }

  const { isValid } = form.formState

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Role</DialogTitle>
          <DialogDescription>Click save when you're done</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome</FormLabel>
                  <FormControl>
                    <Input placeholder="Name" {...field} />
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
              <Button onClick={() => onOpenChange(false)} type="reset" variant="outline" className="font-semibold">
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
