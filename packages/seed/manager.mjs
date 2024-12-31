import bcryptjs from 'bcryptjs'
import { faker } from '@faker-js/faker/locale/en'

import { prisma } from './database.mjs'
import { logger } from './logger.mjs'

export const manager = async () => {
  const password = faker.internet.password({ length: 6, memorable: true })
  const data = {
    email: 'admin@gmail.com',
    username: faker.internet.userName(),
    owner: true,
    password
  }

  const exist = await prisma.user.findFirst({ where: { email: data.email } })
  if (exist) return

  data.password = await bcryptjs.hash(password, 10)

  await prisma.user.create({
    data
  })

  data.password = password

  logger.info(data)
}
