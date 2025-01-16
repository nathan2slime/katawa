import { Permission } from '@kwa/database'
import { Body, Controller, Delete, Get, HttpStatus, Param, Post, Put, Query, Res, UseGuards } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { Response } from 'express'
import { PaginationDto } from '~/app/app.dto'
import { Roles } from '~/app/auth/auth.decorator'

import { CreateCategoryDto, UpdateCategoryDto } from '~/app/category/category.dto'
import { CategoryService } from '~/app/category/category.service'
import { JwtAuthGuard } from '~/app/guards/auth.guard'
import { RoleGuard } from '~/app/guards/role.guard'

@Controller('category')
@ApiTags('Category')
@UseGuards(JwtAuthGuard, RoleGuard)
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Roles([Permission.CREATE_CATEGORY])
  @Post('create')
  async create(@Body() payload: CreateCategoryDto, @Res() res: Response) {
    const data = await this.categoryService.create(payload)

    return res.status(HttpStatus.CREATED).json(data)
  }

  @Roles([Permission.DELETE_CATEGORY])
  @Delete('delete/:id')
  async delete(@Param('id') id: string, @Res() res: Response) {
    await this.categoryService.delete(id)

    return res.status(HttpStatus.OK).send()
  }

  @Roles([Permission.UPDATE_CATEGORY])
  @Put('update/:id')
  async update(@Param('id') id: string, @Body() payload: UpdateCategoryDto, @Res() res: Response) {
    const data = await this.categoryService.update(payload, id)

    return res.status(HttpStatus.OK).json(data)
  }

  @Get('paginate')
  async paginate(@Query() query: PaginationDto, @Res() res: Response) {
    const data = await this.categoryService.paginate(query)

    return res.status(HttpStatus.CREATED).json(data)
  }
}
