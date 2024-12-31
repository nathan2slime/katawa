import { Injectable, LoggerService } from '@nestjs/common'
import Logger, { createLogger } from 'bunyan'

@Injectable()
export class AppLoggerService implements LoggerService {
  private readonly logger: Logger

  constructor() {
    this.logger = createLogger({
      name: '@kwa/api',
      stream: require('bunyan-pretty')({
        colorize: true,
        translateTime: 'SYS:standard',
        singleLine: true
      }),
    })
  }

  log(message: string | object, ...args: unknown[]) {
    this.logger.info(message, ...args)
  }

  info(message: string | object, ...args: unknown[]) {
    this.logger.info(message, ...args)
  }

  error(message: string | object | Error | unknown, ...args: unknown[]) {
    this.logger.error(message, ...args)
  }

  warn(message: string | object | Error, ...args: unknown[]) {
    this.logger.warn(message, ...args)
  }

  debug(message: string | object, ...args: unknown[]) {
    this.logger.debug(message, ...args)
  }

  verbose(message: string | object, ...args: unknown[]) {
    this.logger.trace(message, ...args)
  }
}
