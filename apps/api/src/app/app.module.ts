import { env } from '@kwa/env'
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { JwtModule } from '@nestjs/jwt'

import { AuthModule } from '~/app/auth/auth.module'
import { PrismaModule } from '~/database/prisma/prisma.module'
import { RedisModule } from '~/database/redis/redis.module'
import { LoggerModule } from '~/logger/logger.module'

import configuration from '~/config'

@Module({
  imports: [
    LoggerModule,
    AuthModule,
    RedisModule,
    PrismaModule,
    JwtModule.register({
      global: true,
      secret: env.SESSION_KEY
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration]
    })
  ],
  controllers: [],
  providers: []
})
export class AppModule  {
 
}
