import { Injectable } from '@nestjs/common'

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

  async findAll() {
    return this.prisma.category.findMany()
  }
}
