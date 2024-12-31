import { Permission } from '@kwa/database'
import { Reflector } from '@nestjs/core'

export const Roles = Reflector.createDecorator<Permission[]>()
