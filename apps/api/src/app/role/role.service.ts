import { Injectable } from '@nestjs/common'
import { CreateRoleDto } from '~/app/role/role.dto'
import { PrismaService } from '~/database/prisma/prisma.service'

@Injectable()
export class RoleService {
  constructor(private readonly prisma: PrismaService) {}

  getByUser(userId: string) {
    return this.prisma.role.findMany({
      where: {
        userRole: {
          some: {
            userId
          }
        }
      }
    })
  }

  create(data: CreateRoleDto) {
    return this.prisma.role.create({
      data
    })
  }
}
