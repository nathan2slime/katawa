import bcryptjs from 'bcryptjs'
import { faker } from '@faker-js/faker/locale/en'

import { prisma } from './database.mjs'
import { logger } from './logger.mjs'

const isDev = process.env.NODE_ENV === 'development'
// Generate new password in DEVELOPMENT

export const manager = async () => {
  const password = faker.internet.password({ length: 6, memorable: true })
  const data = {
    email: 'admin@gmail.com',
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    owner: true,
    password
  }

  const exist = await prisma.user.findFirst({ where: { email: data.email } })
  data.password = await bcryptjs.hash(password, 10)

  if (exist) {
    isDev &&
      (await prisma.user.update({
        data: {
          password: data.password
        },
        where: {
          email: data.email
        }
      }))
  } else {
    await prisma.user.create({
      data
    })
  }

  data.password = password

  logger.info(data)
}
