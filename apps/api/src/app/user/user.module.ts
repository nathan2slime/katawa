import { Module } from '@nestjs/common'

import { RoleModule } from '~/app/role/role.module'
import { SessionModule } from '~/app/session/session.module'
import { UserController } from '~/app/user/user.controller'
import { UserService } from '~/app/user/user.service'

@Module({
  imports: [RoleModule, SessionModule],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService]
})
export class UserModule {}
