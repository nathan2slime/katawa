import { Prisma } from '@kwa/database'
import { Injectable } from '@nestjs/common'
import { PaginationDto } from '~/app/app.dto'

import { CreateCategoryDto, UpdateCategoryDto } from '~/app/category/category.dto'
import { PrismaService } from '~/database/prisma/prisma.service'

@Injectable()
export class CategoryService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateCategoryDto) {
    return this.prisma.category.create({ data })
  }

  async update(data: UpdateCategoryDto, id: string) {
    return this.prisma.category.update({ where: { id }, data })
  }

  async delete(id: string) {
    return this.prisma.category.delete({ where: { id } })
  }

  async paginate({ query, perPage, page, sortField, sortOrder }: PaginationDto) {
    const where: Prisma.CategoryWhereInput = query
      ? {
          OR: [
            {
              title: {
                contains: query,
                mode: 'insensitive'
              }
            }
          ]
        }
      : {}
    const total = await this.prisma.category.count({ where })

    const data = await this.prisma.category.findMany({
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
}
