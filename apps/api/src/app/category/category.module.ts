import { Module } from '@nestjs/common'

import { CategoryController } from '~/app/category/category.controller'
import { CategoryService } from '~/app/category/category.service'
import { RoleModule } from '~/app/role/role.module'
import { SessionModule } from '~/app/session/session.module'
import { PrismaService } from '~/database/prisma/prisma.service'

@Module({
  imports: [SessionModule, RoleModule],
  controllers: [CategoryController],
  exports: [CategoryService],
  providers: [CategoryService, PrismaService]
})
export class CategoryModule {}
