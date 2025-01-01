import { log } from 'node:console'
import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common'
import { AbstractHttpAdapter } from '@nestjs/core'
import { Request, Response } from 'express'

import { AppLoggerService } from '~/logger/logger.service'

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<Response>()
    const request = ctx.getRequest<Request>()
    const status = exception.getStatus()
    const data = exception.getResponse()

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      data
    })
  }
}

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(
    private readonly httpAdapterHost: AbstractHttpAdapter,
    private readonly logger: AppLoggerService
  ) {}

  catch(exception: Error, host: ArgumentsHost): void {
    const httpAdapter = this.httpAdapterHost
    const ctx = host.switchToHttp()

    const httpStatus = exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR
    const message = exception.message

    exception.message.toLowerCase()

    const responseBody = {
      message,
      statusCode: httpStatus,
      timestamp: new Date().toISOString(),
      path: httpAdapter.getRequestUrl(ctx.getRequest())
    }
    this.logger.error(exception.message.toLowerCase(), {
      stack: exception.stack
    })
    log(exception)

    httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus)
  }
}
