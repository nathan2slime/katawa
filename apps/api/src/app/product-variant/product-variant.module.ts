import { Module } from '@nestjs/common'
import { ProductVariantController } from '~/app/product-variant/product-variant.controller'
import { ProductVariantService } from '~/app/product-variant/product-variant.service'
import { RoleModule } from '~/app/role/role.module'
import { SessionModule } from '~/app/session/session.module'

@Module({
  imports: [SessionModule, RoleModule],
  exports: [ProductVariantService],
  providers: [ProductVariantService],
  controllers: [ProductVariantController]
})
export class ProductVariantModule {}
