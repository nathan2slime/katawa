import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'

import { JwtAuthPayload } from '~/app/auth/auth.types'
import { SessionService } from '~/app/session/session.service'
import { AppConfig } from '~/config'

@Injectable()
export class JwtRefreshGuard implements CanActivate {
  constructor(
    private readonly sessionService: SessionService,
    private readonly configService: ConfigService<AppConfig>,
    private readonly jwtService: JwtService
  ) {}

  async canActivate(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest()

    if (req) {
      const data = req.cookies[this.configService.get('AUTH_COOKIE')]

      if (data && data.refreshToken) {
        const payload = await this.jwtService.verifyAsync(data.refreshToken, { secret: this.configService.get('SESSION_KEY') })

        const session = await this.validate(payload)
        req.user = session

        return true
      }
    }

    return false
  }

  async validate(payload: JwtAuthPayload) {
    if (payload.exp < Math.floor(Date.now() / 1000)) {
      await this.sessionService.expire(payload.sessionId)
    } else {
      const session = await this.sessionService.refresh(payload)

      if (session) return session
    }

    throw new UnauthorizedException()
  }
}
