import { Injectable } from '@nestjs/common'

import { CreateProductDto } from '~/app/product/product.dto'
import { PrismaService } from '~/database/prisma/prisma.service'

@Injectable()
export class ProductService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateProductDto) {
    return this.prisma.product.create({
      data: {
        ...data,
        categories: {
          connect: data.categories.map(category => ({ id: category }))
        }
      }
    })
  }
}
