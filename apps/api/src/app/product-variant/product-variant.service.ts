import { Injectable } from '@nestjs/common'
import { CreateProductVariantDto } from '~/app/product-variant/product-variant.dto'
import { PrismaService } from '~/database/prisma/prisma.service'

@Injectable()
export class ProductVariantService {
  constructor(private readonly prisma: PrismaService) {}

  async create(productId: string, data: CreateProductVariantDto) {
    return this.prisma.productVariant.create({
      data: {
        ...data,
        productId
      }
    })
  }
}
