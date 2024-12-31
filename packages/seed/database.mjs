import { env } from '@kwa/env'
import { PrismaClient } from '@kwa/database'

export const prisma = new PrismaClient({ datasourceUrl: env.DATABASE_URL })
