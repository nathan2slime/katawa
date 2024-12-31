import { Session } from '@kwa/database'
import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { compare, hash } from 'bcryptjs'

import { SignInDto, SignUpDto } from '~/app/auth/auth.dto'
import { SessionService } from '~/app/session/session.service'
import { UserService } from '~/app/user/user.service'
import { EMAIL_ALREADY_EXISTS_MESSAGE, INVALID_CREDENTIALS_MESSAGE, USER_NOT_FOUND_MESSAGE } from '~/errors'

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly sessionService: SessionService
  ) {}

  async signIn(data: SignInDto) {
    const user = await this.userService.getByEmail(data.email)
    if (!user) throw new HttpException(USER_NOT_FOUND_MESSAGE, HttpStatus.NOT_FOUND)

    const isValidPassword = await compare(data.password, user.password)
    if (!isValidPassword) throw new HttpException(INVALID_CREDENTIALS_MESSAGE, HttpStatus.UNAUTHORIZED)

    user.password = undefined

    const session = await this.sessionService.create(user)

    return session
  }

  async signUp(data: SignUpDto) {
    const userAlreadyExists = await this.userService.getByEmail(data.email)
    if (userAlreadyExists) throw new HttpException(EMAIL_ALREADY_EXISTS_MESSAGE, HttpStatus.CONFLICT)

    data.password = await hash(data.password, 10)

    const user = await this.userService.create(data)
    const session = await this.sessionService.create(user)

    return session
  }

  async signOut(session: Session) {
    await this.sessionService.expire(session.id)
  }
}
