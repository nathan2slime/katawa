import { Module } from '@nestjs/common'

import { AuthController } from '~/app/auth/auth.controller'
import { AuthService } from '~/app/auth/auth.service'
import { SessionModule } from '~/app/session/session.module'
import { UserModule } from '~/app/user/user.module'

@Module({
  imports: [UserModule, SessionModule],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService]
})
export class AuthModule {}
