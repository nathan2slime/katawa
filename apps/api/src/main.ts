import { env } from '@kwa/env'
import { ValidationPipe } from '@nestjs/common'
import { HttpAdapterHost, NestFactory } from '@nestjs/core'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'

import cookieParser from 'cookie-parser'

import 'reflect-metadata'

import { AppModule } from '~/app/app.module'
import { AllExceptionsFilter, HttpExceptionFilter } from '~/app/filters/http_expection'
import { AppLoggerService } from '~/logger/logger.service'

const main = async () => {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
    autoFlushLogs: true
  })
  const logger = app.get(AppLoggerService)
  const { httpAdapter } = app.get(HttpAdapterHost)

  app.use(cookieParser())

  app.enableCors({
    credentials: true,
    origin: env.NODE_ENV === 'production' ? env.CLIENT_URL : true
  })

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      forbidUnknownValues: true,
      validateCustomDecorators: true
    })
  )

  app.useGlobalFilters(new HttpExceptionFilter(), new AllExceptionsFilter(httpAdapter, logger))

  const config = new DocumentBuilder().setTitle('Kwa').build()

  app.setGlobalPrefix('api')

  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('api/docs', app, document)

  const PORT = process.env.PORT || '5400'
  await app.listen(PORT, () => logger.info(`running in http://localhost:${PORT}/api/docs`))
}

main()
