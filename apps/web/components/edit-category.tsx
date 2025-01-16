import { zodResolver } from '@hookform/resolvers/zod'
import { Category } from '@kwa/database'
import { useForm } from 'react-hook-form'
import { updateCategoryService } from '~/api/mutations/edit-category.mutation'

import { Button } from '~/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '~/components/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '~/components/ui/form'
import { Input } from '~/components/ui/input'
import { NewCategoryFormValues, newCategorySchema } from '~/lib/schemas/new-category.schema'

type Props = {
  data: Readonly<Category>
  open: boolean
  onUpdated: (role: Category) => void
  onOpenChange: (e: boolean) => void
}

export const EditCategory = ({ data, onUpdated, onOpenChange, open }: Props) => {
  const form = useForm<NewCategoryFormValues>({
    mode: 'all',
    resolver: zodResolver(newCategorySchema),
    defaultValues: data
  })

  const onSubmit = async (e: NewCategoryFormValues) => {
    const res = await updateCategoryService(data.id, e)

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
              name="title"
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
              name="slug"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Slug</FormLabel>
                  <FormControl>
                    <Input placeholder="asomeone" {...field} />
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
