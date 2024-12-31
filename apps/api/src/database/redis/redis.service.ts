import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { RedisClientType, createClient } from 'redis'

import { AppConfig } from '~/config'
import { AppLoggerService } from '~/logger/logger.service'

@Injectable()
export class RedisService {
  client: RedisClientType

  constructor(
    private readonly configService: ConfigService<AppConfig>,
    private readonly logger: AppLoggerService
  ) {
    this.client = createClient({
      password: this.configService.get('REDIS_PASSWORD'),
      url: this.configService.get('REDIS_URL')
    })
    this.client.on('error', err => this.logger.error(err))

    this.client.connect().then(() => this.logger.info('Redis connection established successfully'))
  }

  async onModuleDestroy() {
    await this.client.quit()
  }
}
