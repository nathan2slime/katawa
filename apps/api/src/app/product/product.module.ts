import { Module } from '@nestjs/common'

import { ProductController } from '~/app/product/product.controller'
import { ProductService } from '~/app/product/product.service'
import { RoleModule } from '~/app/role/role.module'
import { SessionModule } from '~/app/session/session.module'

@Module({
  imports: [SessionModule, RoleModule],
  controllers: [ProductController],
  providers: [ProductService]
})
export class ProductModule {}
