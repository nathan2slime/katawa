import { Prisma } from '@kwa/database'
import { Injectable } from '@nestjs/common'

import { PaginationDto } from '~/app/app.dto'
import { CreateRoleDto, UpdateRoleDto } from '~/app/role/role.dto'
import { PrismaService } from '~/database/prisma/prisma.service'

@Injectable()
export class RoleService {
  constructor(private readonly prisma: PrismaService) {}

  async getByUser(userId: string) {
    return this.prisma.role.findMany({
      where: {
        users: {
          some: {
            id: userId
          }
        }
      }
    })
  }

  async delete(id: string) {
    return this.prisma.role.delete({ where: { id } })
  }

  async update(id: string, data: UpdateRoleDto) {
    return this.prisma.role.update({ where: { id }, data })
  }

  async paginate({ query, perPage, page, sortField, sortOrder }: PaginationDto) {
    const where: Prisma.RoleWhereInput = query
      ? {
          OR: [
            {
              name: {
                contains: query,
                mode: 'insensitive'
              }
            }
          ]
        }
      : {}
    const total = await this.prisma.role.count({ where })

    const data = await this.prisma.role.findMany({
      take: perPage,
      skip: page === 1 ? 0 : perPage * (page - 1),
      where,
      orderBy: sortField
        ? [{ [sortField]: sortOrder }]
        : {
            createdAt: 'asc'
          }
    })

    const pages = Math.ceil(total / perPage)

    return {
      total,
      data,
      pages,
      perPage,
      sortField,
      sortOrder,
      page
    }
  }

  async create(data: CreateRoleDto) {
    return this.prisma.role.create({
      data
    })
  }
}
