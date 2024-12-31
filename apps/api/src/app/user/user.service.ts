import { Prisma, User } from '@kwa/database'
import { Injectable } from '@nestjs/common'

import { SignUpDto } from '~/app/auth/auth.dto'
import { PrismaService } from '~/database/prisma/prisma.service'

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async getById(id: string) {
    const user = await this.prisma.user.findUnique({ where: { id } })

    return this.prisma.exclude<User, 'password'>(user, ['password'])
  }

  async create(data: SignUpDto) {
    const user = await this.prisma.user.create({
      data
    })

    return this.prisma.exclude<User, 'password'>(user, ['password'])
  }

  async getByEmail(email: string) {
    return this.prisma.user.findFirst({ where: { email } })
  }

  async getOnlyPasswordBy(where: Prisma.UserWhereInput) {
    return this.prisma.user.findFirst({
      where,
      select: {
        password: true
      }
    })
  }
}
