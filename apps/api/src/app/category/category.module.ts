import { Module } from '@nestjs/common'

import { CategoryController } from '~/app/category/category.controller'
import { CategoryService } from '~/app/category/category.service'
import { PrismaService } from '~/database/prisma/prisma.service'

@Module({
  controllers: [CategoryController],
  exports: [CategoryService],
  providers: [CategoryService, PrismaService]
})
export class CategoryModule {}
