import { Session, User } from '@kwa/database'
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'

import { JwtAuthPayload } from '~/app/auth/auth.types'
import { AppConfig } from '~/config'
import { PrismaService } from '~/database/prisma/prisma.service'
import { RedisService } from '~/database/redis/redis.service'
import { AppLoggerService } from '~/logger/logger.service'

@Injectable()
export class SessionService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly redis: RedisService,
    private readonly logger: AppLoggerService,
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService<AppConfig>
  ) {}

  async create(user: Omit<User, 'password'>) {
    const newSession = await this.prisma.session.create({
      data: {
        user: {
          connect: {
            id: user.id
          }
        }
      }
    })

    const payload = { userId: user.id, sessionId: newSession.id }

    const accessToken = await this.jwtService.signAsync(payload, {
      secret: this.configService.get('SESSION_KEY'),
      expiresIn: this.configService.get('ACCESS_TOKEN_EXPIRES_IN')
    })
    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: this.configService.get('SESSION_KEY'),
      expiresIn: this.configService.get('REFRESH_TOKEN_EXPIRES_IN')
    })

    const data = await this.prisma.session.update({
      where: {
        id: newSession.id
      },
      data: {
        refreshToken,
        accessToken
      }
    })

    const session = { ...data, user }
    await this.cache(session)

    return session
  }

  getCacheKey(id: string) {
    this.logger.info('get session cache key', id)

    return `session:${id}`
  }

  cache(session: Session) {
    this.logger.info('save session in redis', session.id)

    return this.redis.client.set(this.getCacheKey(session.id), JSON.stringify(session), {
      EX: Math.floor(require('ms')(this.configService.get('ACCESS_TOKEN_EXPIRES_IN')) / 1000)
    })
  }

  async expire(id: string) {
    this.logger.info('expire session in redis', id)
    await this.redis.client.del(this.getCacheKey(id))

    this.logger.info('removing session', id)
    await this.prisma.session.delete({
      where: { id }
    })
  }

  async refresh(payload: JwtAuthPayload) {
    this.logger.info('start refresh session', payload)

    const accessToken = await this.jwtService.signAsync(
      { sessionId: payload.sessionId, userId: payload.userId },
      {
        secret: this.configService.get('SESSION_KEY'),
        expiresIn: this.configService.get('ACCESS_TOKEN_EXPIRES_IN')
      }
    )

    this.logger.info('update session with new access token')
    const data = await this.prisma.session.update({
      where: { id: payload.sessionId },
      data: { accessToken },
      include: { user: true }
    })

    if (data) {
      const user = this.prisma.exclude(data.user, ['password'])

      const session = { ...data, user }
      await this.cache(session)

      return session
    }
  }

  async deleteAllByUserId(userId: string) {
    const sessions = await this.prisma.session.findMany({
      where: { userId },
      select: {
        id: true
      }
    })

    const cacheKeys = sessions.map(session => this.getCacheKey(session.id))
    await this.redis.client.del(cacheKeys)

    return this.prisma.session.deleteMany({ where: { userId } })
  }

  async findById(id: string) {
    const cached = await this.redis.client.get(this.getCacheKey(id))
    if (cached) return JSON.parse(cached)

    const data = await this.prisma.session.findUnique({
      where: { id },
      include: { user: true }
    })

    if (data) {
      const user = this.prisma.exclude(data.user, ['password'])
      const session = { ...data, user }

      await this.cache(session)

      return session
    }
  }
}
