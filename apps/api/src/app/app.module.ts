import { env } from '@kwa/env'
import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { JwtModule } from '@nestjs/jwt'

import { AuthModule } from '~/app/auth/auth.module'
import { CategoryModule } from '~/app/category/category.module'
import { RoleModule } from '~/app/role/role.module'
import configuration from '~/config'
import { PrismaModule } from '~/database/prisma/prisma.module'
import { RedisModule } from '~/database/redis/redis.module'
import { LoggerModule } from '~/logger/logger.module'

@Module({
  imports: [
    LoggerModule,
    AuthModule,
    RedisModule,
    PrismaModule,
    CategoryModule,
    RoleModule,
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
export class AppModule {}
