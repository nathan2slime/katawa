import { Permission } from '@kwa/database'
import { Body, Controller, HttpStatus, Param, Post, Res, UseGuards } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { Response } from 'express'

import { Roles } from '~/app/auth/auth.decorator'
import { JwtAuthGuard } from '~/app/guards/auth.guard'
import { RoleGuard } from '~/app/guards/role.guard'
import { CreateProductVariantDto } from '~/app/product-variant/product-variant.dto'
import { ProductVariantService } from '~/app/product-variant/product-variant.service'

@ApiTags('Product')
@Controller('product/variant')
@UseGuards(JwtAuthGuard, RoleGuard)
export class ProductVariantController {
  constructor(private readonly productVariantService: ProductVariantService) {}

  @Roles([Permission.CREATE_PRODUCT])
  @Post('create/:productId')
  async create(@Param('productId') productId: string, @Body() body: CreateProductVariantDto, @Res() res: Response) {
    const data = await this.productVariantService.create(productId, body)

    return res.status(HttpStatus.CREATED).json(data)
  }
}
