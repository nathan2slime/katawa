import { Global, Module } from '@nestjs/common'

import { RedisService } from '~/database/redis/redis.service'

@Global()
@Module({
  providers: [RedisService],
  exports: [RedisService]
})
export class RedisModule {}
