import { Module } from '@nestjs/common'

import { RoleService } from '~/app/role/role.service'
import { PrismaService } from '~/database/prisma/prisma.service'

@Module({
  exports: [RoleService],
  providers: [PrismaService, RoleService]
})
export class RoleModule {}
