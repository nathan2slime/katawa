import { Module } from '@nestjs/common'

import { CategoryService } from '~/app/category/category.service'
import { PrismaService } from '~/database/prisma/prisma.service'

@Module({
  imports: [],
  exports: [CategoryService],
  providers: [CategoryService, PrismaService]
})
export class CategoryModule {}
