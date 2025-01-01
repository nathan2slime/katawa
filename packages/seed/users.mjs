import { faker } from '@faker-js/faker'
import bcryptjs from 'bcryptjs'

import { prisma } from './database.mjs'
import { logger } from './logger.mjs'

export const users = async () => {
  for (let index = 0; index < 80; index++) {
    const password = faker.internet.password({ length: 6, memorable: true })
    const data = {
      email: faker.internet.email(),
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      password
    }

    data.password = await bcryptjs.hash(password, 10)

    await prisma.user.create({
      data
    })

    data.password = password

    logger.info(data)
  }
}
