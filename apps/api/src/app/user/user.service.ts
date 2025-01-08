import { Prisma, User } from '@kwa/database'
import { Injectable } from '@nestjs/common'

import { PaginationDto } from '~/app/app.dto'
import { CreateUserDto, UpdateUserDto } from '~/app/user/user.dto'
import { PrismaService } from '~/database/prisma/prisma.service'

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async getById(id: string) {
    const user = await this.prisma.user.findUnique({ where: { id } })

    return this.prisma.exclude<User, 'password'>(user, ['password'])
  }

  async removeById(id: string) {
    return this.prisma.user.delete({ where: { id } })
  }

  async create(data: CreateUserDto) {
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

  async updateById(id: string, data: UpdateUserDto) {
    return this.prisma.user.update({
      where: { id },
      data,
      select: {
        roles: {
          select: {
            role: {
              select: {
                color: true,
                name: true,
                id: true
              }
            }
          }
        }
      }
    })
  }

  async paginate({ perPage, query, page, sortField, sortOrder }: PaginationDto) {
    const where: Prisma.UserWhereInput = query
      ? {
          AND: [
            {
              OR: [
                {
                  firstName: {
                    contains: query,
                    mode: 'insensitive'
                  }
                },
                {
                  lastName: {
                    contains: query,
                    mode: 'insensitive'
                  }
                }
              ]
            },
            {
              owner: false
            }
          ]
        }
      : {
          owner: false
        }
    const total = await this.prisma.user.count({ where })

    const data = await this.prisma.user.findMany({
      take: perPage,
      skip: page === 1 ? 0 : perPage * (page - 1),
      where,
      include: {
        roles: {
          select: {
            role: {
              select: {
                color: true,
                name: true,
                id: true
              }
            }
          }
        }
      },
      orderBy: sortField
        ? [{ [sortField]: sortOrder }]
        : {
            createdAt: 'asc'
          }
    })

    const pages = Math.ceil(total / perPage)

    return {
      total,
      data: this.prisma.exclude<User[], 'password'>(data, ['password']),
      pages,
      perPage,
      sortField,
      sortOrder,
      page
    }
  }
}
