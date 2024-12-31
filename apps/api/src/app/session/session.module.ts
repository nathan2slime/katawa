import { Module } from '@nestjs/common'

import { SessionService } from '~/app/session/session.service'

@Module({
  exports: [SessionService],
  providers: [SessionService]
})
export class SessionModule {}
