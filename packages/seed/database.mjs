import { PrismaClient } from '@kwa/database'
import { env } from '@kwa/env'

export const prisma = new PrismaClient({ datasourceUrl: env.DATABASE_URL })
