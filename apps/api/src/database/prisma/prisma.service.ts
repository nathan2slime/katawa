import { PrismaClient } from '@kwa/database'
import { Injectable, OnModuleInit } from '@nestjs/common'

import { AppLoggerService } from '~/logger/logger.service'

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  constructor(private readonly logger: AppLoggerService) {
    super({ log: ['error', 'info', 'query', 'warn'] })
  }

  async onModuleInit() {
    try {
      await this.$connect()
    } catch (e: unknown) {
      this.logger.error(e)
    }
  }

  async onModuleDestroy() {
    await this.$disconnect()
  }

  exclude<T, Key extends keyof T>(data: T, keys: Key[]): Omit<T, Key> {
    return Object.fromEntries(
      Object.entries(data).filter(([key]) => {
        return !keys.includes(key as Key) && data[key] != null
      })
    ) as Omit<T, Key>
  }
}
