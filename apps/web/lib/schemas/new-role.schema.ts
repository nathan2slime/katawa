import { z } from 'zod'

export const newRoleSchema = z.object({
  name: z.string().min(1),
  color: z.string().min(1),
  permissions: z.array(z.string()).min(0)
})

export type NewRoleFormValues = z.infer<typeof newRoleSchema>
