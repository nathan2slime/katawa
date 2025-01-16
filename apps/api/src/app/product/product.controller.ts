import { Permission } from '@kwa/database'
import { Body, Controller, HttpStatus, Post, Res, UseGuards } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { Response } from 'express'

import { Roles } from '~/app/auth/auth.decorator'
import { JwtAuthGuard } from '~/app/guards/auth.guard'
import { RoleGuard } from '~/app/guards/role.guard'
import { CreateProductDto } from '~/app/product/product.dto'
import { ProductService } from '~/app/product/product.service'

@ApiTags('Product')
@Controller('product')
@UseGuards(JwtAuthGuard, RoleGuard)
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Roles([Permission.CREATE_PRODUCT])
  @Post('create')
  async create(@Body() body: CreateProductDto, @Res() res: Response) {
    const data = await this.productService.create(body)

    return res.status(HttpStatus.CREATED).json(data)
  }
}
