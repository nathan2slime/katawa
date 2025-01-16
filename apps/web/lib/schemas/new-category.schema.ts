import { z } from 'zod'

export const newCategorySchema = z.object({
  slug: z.string().min(1),
  title: z.string().min(1)
})

export type NewCategoryFormValues = z.infer<typeof newCategorySchema>
