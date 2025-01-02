import { z } from 'zod'

export const editUserSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  lastName: z.string().min(1),
  firstName: z.string().min(1)
})

export type EditUserFormValues = z.infer<typeof editUserSchema>
