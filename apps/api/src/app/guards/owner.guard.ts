import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'

import { AppRequest } from '~/app/app.types'

@Injectable()
export class OwnerGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req: AppRequest = context.switchToHttp().getRequest()
    const session = req.user

    if (session) {
      return session.user.owner
    }
  }
}
