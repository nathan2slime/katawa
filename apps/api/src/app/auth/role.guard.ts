import { Permission } from '@kwa/database'
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { Reflector } from '@nestjs/core'

import { AppRequest } from '~/app/app.types'
import { RoleService } from '~/app/role/role.service'

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly roleService: RoleService
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req: AppRequest = context.switchToHttp().getRequest()
    const session = req.user

    if (session) {
        
      if (session.user.owner) return true

      const permissions = this.reflector.get(Permissions, context.getHandler()) as Permission[]

      if (permissions) {
        const roles = await this.roleService.getByUser(session.userId)
        const currentPermissions = [...new Set(...roles.map(e => e.permissions))]

        return currentPermissions.every(permission => permissions.includes(permission))
      }

      return true
    }
  }
}
