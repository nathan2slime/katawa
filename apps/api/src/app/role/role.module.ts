import { Module } from '@nestjs/common'

import { RoleController } from '~/app/role/role.controller'
import { RoleService } from '~/app/role/role.service'
import { SessionModule } from '~/app/session/session.module'
import { PrismaService } from '~/database/prisma/prisma.service'

@Module({
  imports: [SessionModule],
  controllers: [RoleController],
  exports: [RoleService],
  providers: [PrismaService, RoleService]
})
export class RoleModule {}
