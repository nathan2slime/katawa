import { Body, Controller, Delete, Get, HttpStatus, Param, Post, Put, Res } from '@nestjs/common'
import { Response } from 'express'

import { CreateCategoryDto, UpdateCategoryDto } from '~/app/category/category.dto'
import { CategoryService } from '~/app/category/category.service'

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post('create')
  async create(@Body() payload: CreateCategoryDto, @Res() res: Response) {
    const data = await this.categoryService.create(payload)

    return res.status(HttpStatus.CREATED).json(data)
  }

  @Delete('delete/:id')
  async delete(@Param('id') id: string, @Res() res: Response) {
    await this.categoryService.delete(id)

    return res.status(HttpStatus.OK).send()
  }

  @Put('update/:id')
  async update(@Param('id') id: string, @Body() payload: UpdateCategoryDto, @Res() res: Response) {
    const data = await this.categoryService.update(payload, id)

    return res.status(HttpStatus.OK).json(data)
  }

  @Get()
  async getAll(@Res() res: Response) {
    const data = await this.categoryService.findAll()

    return res.status(HttpStatus.OK).json(data)
  }
}
