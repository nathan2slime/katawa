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

  exclude<T, Key extends T extends Array<unknown> ? keyof T[0] : keyof T>(data: T, keys: Key[]) {
    type Data = T extends Array<unknown> ? T[0] : T

    type FinalData = Omit<Data, Key>

    const onFilter = (payload: Data | T) => Object.fromEntries(Object.entries(payload).filter(([key]) => !keys.includes(key as Key) && payload[key] != null))

    const final = Array.isArray(data) ? data.map(e => onFilter(e)) : onFilter(data)

    return final as unknown as FinalData
  }
}
