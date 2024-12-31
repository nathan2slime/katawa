import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1)
})

export type LoginFormValues = z.infer<typeof loginSchema>