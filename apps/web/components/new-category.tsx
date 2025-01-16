'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { Category } from '@kwa/database'
import { Plus } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'

import { newCategoryService } from '~/api/mutations/new-category.mutation'

import { Button } from '~/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '~/components/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '~/components/ui/form'
import { Input } from '~/components/ui/input'
import { NewCategoryFormValues, newCategorySchema } from '~/lib/schemas/new-category.schema'

type Props = {
  onCreate: (data: Category) => void
}

export const NewCategory = ({ onCreate }: Props) => {
  const [isOpen, setIsOpen] = useState(false)

  const form = useForm<NewCategoryFormValues>({
    resolver: zodResolver(newCategorySchema),
    defaultValues: {
      slug: '',
      title: ''
    }
  })

  const onSubmit = async (payload: NewCategoryFormValues) => {
    const res = await newCategoryService(payload)

    if (res) {
      setIsOpen(false)
      onCreate(res)
    }
  }

  useEffect(() => {
    form.reset({ title: '', slug: '' })
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
          <DialogTitle>New Category</DialogTitle>
          <DialogDescription>Click save when you're done</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Computers" {...field} />
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
                    <Input placeholder="pen" {...field} />
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
